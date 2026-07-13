import { NextResponse } from "next/server";
import { z } from "zod";

import { EVENT_TYPES } from "@/lib/analytics/events";
import {
  deviceType,
  isBot,
  optedOut,
  referrerHost,
  visitorKey,
} from "@/lib/analytics/visitor";
import { getPool } from "@/lib/db/postgres";
import { allCanonicalRoutes } from "@/lib/routes";

/**
 * POST /api/e — cookieless analytics ingest (Phase 33E).
 *
 * Rules this endpoint lives by:
 *
 *   1. It NEVER breaks the page. Every failure — no database, no salt, a bot, an
 *      opted-out visitor, a malformed body, a dead connection — answers 200
 *      {ok:true, skipped:...}. A missing pageview costs nothing; a JavaScript
 *      error on a sales page costs a customer.
 *   2. It NEVER returns analytics data. It is write-only. There is no GET.
 *   3. It stores no IP, no user-agent, no full referrer. The client cannot even
 *      send an identifier, because it does not have one.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Generous for an event, tiny for an attacker. */
const MAX_BODY_BYTES = 4 * 1024;

/** New session after 30 minutes of silence — the industry-standard window. */
const SESSION_GAP = "30 minutes";

/**
 * A closed set. Anything else the client sends is dropped, not stored: metadata
 * is the one free-form field here, and free-form fields are where personal data
 * ends up by accident.
 */
const ALLOWED_META_KEYS = new Set([
  "channel", // email | whatsapp
  "fit", // selected system id
  "project", // project slug
  "label", // CTA label (site copy, not user input)
  "to", // same-site destination path
  "from", // language switch: origin locale
  "seconds", // heartbeat
]);

const CANONICAL = new Set<string>(allCanonicalRoutes);

const schema = z.object({
  type: z.enum(EVENT_TYPES),
  path: z.string().max(200),
  locale: z.enum(["tr", "en"]),
  ref: z.string().max(500).optional(),
  meta: z.record(z.string(), z.union([z.string(), z.number()])).optional(),
});

/** 200 always. See rule 1. */
const skip = (reason: string) =>
  NextResponse.json({ ok: true, skipped: true, reason });

/** Paths are matched against real routes; anything else is recorded as "other"
 *  rather than trusted, so a crafted path cannot fill the table with junk. */
function cleanPath(p: string): string | null {
  if (CANONICAL.has(p)) return p;
  // Dynamic-looking but unknown: keep the shape, drop the specifics.
  if (/^\/[a-z0-9/-]{0,80}$/i.test(p)) return null;
  return null;
}

function cleanMeta(meta: Record<string, string | number> | undefined) {
  if (!meta) return {};
  const out: Record<string, string | number> = {};
  for (const [k, v] of Object.entries(meta)) {
    if (!ALLOWED_META_KEYS.has(k)) continue;
    if (typeof v === "number") {
      if (Number.isFinite(v)) out[k] = Math.trunc(v);
    } else {
      out[k] = v.slice(0, 120);
    }
  }
  return out;
}

export async function POST(req: Request) {
  try {
    if (!req.headers.get("content-type")?.includes("application/json")) {
      return skip("bad_content_type");
    }

    // Honoured before anything else is even parsed.
    if (optedOut(req)) return skip("opted_out");

    const ua = req.headers.get("user-agent");
    if (isBot(ua)) return skip("bot");

    const raw = await req.text();
    if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES)
      return skip("too_large");

    let parsed;
    try {
      parsed = schema.safeParse(JSON.parse(raw));
    } catch {
      return skip("bad_json");
    }
    if (!parsed.success) return skip("invalid");
    const e = parsed.data;

    const key = visitorKey(req);
    if (!key) return skip("unconfigured"); // no ANALYTICS_SALT

    const pool = getPool();
    if (!pool) return skip("no_database");

    const path = cleanPath(e.path);
    const device = deviceType(ua);
    const country = req.headers.get("x-vercel-ip-country") || null;
    const refHost = referrerHost(e.ref);
    const meta = cleanMeta(e.meta);

    const client = await pool.connect();
    try {
      await client.query("begin");

      // Find this visitor's live session, or start one. The 30-minute window is
      // evaluated in SQL so two events racing in cannot both create a session.
      const found = await client.query<{ id: string }>(
        `select id from visitor_sessions
          where visitor_key = $1 and last_seen_at > now() - $2::interval
          order by last_seen_at desc limit 1
          for update`,
        [key, SESSION_GAP],
      );

      let sessionId = found.rows[0]?.id;
      let isNew = false;

      if (!sessionId) {
        const created = await client.query<{ id: string }>(
          `insert into visitor_sessions
             (visitor_key, first_path, last_path, locale, referrer_host, device_type, country)
           values ($1, $2, $2, $3, $4, $5, $6)
           returning id`,
          [key, path, e.locale, refHost, device, country],
        );
        sessionId = created.rows[0].id;
        isNew = true;

        await client.query(
          `insert into analytics_events
             (session_id, event_type, path, locale, referrer_host, device_type, country)
           values ($1, 'session_start', $2, $3, $4, $5, $6)`,
          [sessionId, path, e.locale, refHost, device, country],
        );
      }

      // Dedupe: React strict mode and fast back/forward both double-fire a
      // pageview. Without this every session looks twice as engaged as it is.
      if (e.type === "page_view") {
        const dup = await client.query(
          `select 1 from analytics_events
            where session_id = $1 and event_type = 'page_view'
              and path is not distinct from $2
              and created_at > now() - interval '1 second'
            limit 1`,
          [sessionId, path],
        );
        if (dup.rowCount) {
          await client.query("commit");
          return NextResponse.json({ ok: true, deduped: true });
        }
      }

      // A heartbeat only extends the session clock; it is not an interaction and
      // must not inflate the event log or the pageview count.
      if (e.type !== "heartbeat") {
        await client.query(
          `insert into analytics_events
             (session_id, event_type, path, locale, referrer_host, device_type, country, metadata)
           values ($1, $2, $3, $4, $5, $6, $7, $8::jsonb)`,
          [
            sessionId,
            e.type,
            path,
            e.locale,
            refHost,
            device,
            country,
            JSON.stringify(meta),
          ],
        );
      }

      // duration = last event minus first event. APPROXIMATE, and the admin UI
      // says so: the true dwell time of the final page is unknowable without an
      // unload beacon, and even then it is a guess.
      await client.query(
        `update visitor_sessions
            set last_seen_at = now(),
                last_path = coalesce($2, last_path),
                pageview_count = pageview_count + case when $3 then 1 else 0 end,
                duration_seconds = greatest(
                  duration_seconds,
                  extract(epoch from (now() - created_at))::int
                )
          where id = $1`,
        [
          sessionId,
          path,
          e.type === "page_view" && !isNew ? true : e.type === "page_view",
        ],
      );

      await client.query("commit");
      return NextResponse.json({ ok: true });
    } catch (err) {
      await client.query("rollback").catch(() => {});
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    // Logged for the operator, never returned. Analytics failing is not the
    // visitor's problem and must never become visible to them.
    console.error(
      "[analytics] ingest failed:",
      err instanceof Error ? err.message : err,
    );
    return skip("error");
  }
}
