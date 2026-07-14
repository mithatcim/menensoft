import { NextResponse } from "next/server";

import { type LeadErrorCode, type LeadResult } from "@/lib/leads/types";
import {
  MAX_FILL_MS,
  MIN_FILL_MS,
  cleanFitId,
  cleanProjectSlug,
  cleanSituation,
  cleanSourcePath,
  derivePreference,
  deviceTypeFromUA,
  leadSchema,
} from "@/lib/leads/validate";
import { visitorKey } from "@/lib/analytics/visitor";
import { getPool } from "@/lib/db/postgres";
import { clientHash, hitRateLimit } from "@/lib/db/rate-limit";

/**
 * POST /api/lead — the site's only public write endpoint (Phase 33C-PG).
 *
 * Direct PostgreSQL, parameterized SQL, no ORM and no vendor SDK.
 *
 * Design rule that outranks everything else here: THE DATABASE MUST NOT BECOME A
 * SINGLE POINT OF FAILURE FOR REVENUE. If anything goes wrong — no DATABASE_URL,
 * insert rejected, database asleep, network down — this returns an honest
 * failure and the UI falls back to email/WhatsApp with the visitor's message
 * intact. It never reports success it did not achieve. A lost lead costs money;
 * a lost database row costs nothing.
 *
 * No GET handler: a crawler or a curious browser gets a 405, so there is nothing
 * to index and nothing to leak.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Past this, it isn't a project brief. The UI caps the message at 1500 chars. */
const MAX_BODY_BYTES = 16 * 1024;

/** 5 submissions per 10 minutes per sender. */
const RATE_MAX = 5;
const RATE_WINDOW = "10 minutes";

/** Same 30-minute window /api/e uses to decide a session is still live. */
const SESSION_WINDOW = "30 minutes";

const fail = (
  status: number,
  code: LeadErrorCode,
  message: string,
  field?: string,
) => NextResponse.json({ ok: false, code, message, field }, { status });

/**
 * Attach the lead to the visitor's live analytics session (Phase 36A).
 *
 * WHAT THIS DOES NOT DO, and cannot:
 *   - it does not accept a session id from the client. The browser has no
 *     identifier, has never had one, and could not send one if it wanted to.
 *   - it does not set a cookie or write to localStorage.
 *   - it does not store an IP. The address is used in memory to recompute the
 *     SAME daily-rotating visitor_key that /api/e derives, and is written
 *     nowhere. There is still no IP column in any table.
 *   - it does not enable cross-day tracking. The salt rotates at UTC midnight,
 *     so a lead submitted today can only ever match a session from today.
 *
 * What it DOES do, stated plainly because the privacy page now says so too: the
 * admin panel can see which pages a NAMED person read before they wrote in.
 * That is a real escalation over "these two tables never join", and it is why
 * /gizlilik and /en/privacy were rewritten in the same phase rather than after.
 *
 * It is best-effort. A failure here must never cost a lead: no session found, no
 * salt configured, query error — all return null and the insert proceeds.
 */
async function findLiveSession(
  pool: NonNullable<ReturnType<typeof getPool>>,
  req: Request,
): Promise<string | null> {
  try {
    const key = visitorKey(req); // null when ANALYTICS_SALT is unset
    if (!key) return null;

    const { rows } = await pool.query<{ id: string }>(
      `select id from visitor_sessions
        where visitor_key = $1 and last_seen_at > now() - $2::interval
        order by last_seen_at desc
        limit 1`,
      [key, SESSION_WINDOW],
    );
    return rows[0]?.id ?? null;
  } catch (err) {
    console.error(
      "[lead] session lookup failed, saving lead unlinked:",
      err instanceof Error ? err.message : err,
    );
    return null;
  }
}

export async function POST(req: Request) {
  if (!req.headers.get("content-type")?.includes("application/json")) {
    return fail(415, "validation", "expected_json");
  }

  const raw = await req.text();
  if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) {
    return fail(413, "validation", "payload_too_large");
  }

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return fail(400, "validation", "invalid_json");
  }

  const parsed = leadSchema.safeParse(json);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return fail(
      400,
      "validation",
      first?.message ?? "invalid_input",
      first?.path?.[0]?.toString(),
    );
  }
  const input = parsed.data;

  // --- spam gates, cheapest first, before we touch the database ------------
  //
  // Both are answered with a 200 "ok" rather than an error. A bot that learns
  // which of its submissions were rejected learns how to get past the gate; a
  // bot that is told everything worked learns nothing and goes away. No row is
  // written. The id is a throwaway.
  if (input.company) {
    return NextResponse.json({ ok: true, id: "accepted" });
  }
  if (input.formStartedAt) {
    const elapsed = Date.now() - input.formStartedAt;
    if (elapsed < MIN_FILL_MS || elapsed > MAX_FILL_MS) {
      return NextResponse.json({ ok: true, id: "accepted" });
    }
  }

  // --- configuration is a runtime state, not a build failure ---------------
  const pool = getPool();
  if (!pool) {
    return fail(503, "unconfigured", "database_not_configured");
  }

  // Fails OPEN (see hitRateLimit): a broken limiter must never be the reason a
  // real lead is lost. Spam is cheaper than silence. Admin login takes the
  // opposite trade deliberately.
  const rl = await hitRateLimit(
    "lead",
    clientHash(req, "lead"),
    RATE_MAX,
    RATE_WINDOW,
  );
  if (rl.limited) {
    return fail(429, "rate_limit", "too_many_submissions");
  }

  // --- enrich server-side ---------------------------------------------------
  // Never from the client: a payload could claim any country or device it liked.
  const ua = req.headers.get("user-agent");
  const country = req.headers.get("x-vercel-ip-country"); // null off Vercel

  const sessionId = await findLiveSession(pool, req);

  try {
    // Parameterized. Nothing the visitor sends is ever concatenated into SQL.
    const { rows } = await pool.query<{ id: string }>(
      `insert into leads (
         name, email, phone, message, language, contact_preference,
         selected_fit_id, selected_situation, reference_project_slug,
         source_path, device_type, country, user_agent, session_id, status
       ) values (
         $1, $2, $3, $4, $5, $6,
         $7, $8, $9,
         $10, $11, $12, $13, $14, 'new'
       )
       returning id`,
      [
        input.name,
        input.email ?? null,
        input.phone ?? null,
        input.message,
        input.language,
        derivePreference(input.contactPreference, input.email, input.phone),
        cleanFitId(input.selectedFitId),
        cleanSituation(input.selectedSituation),
        await cleanProjectSlug(input.referenceProjectSlug),
        await cleanSourcePath(input.sourcePath),
        deviceTypeFromUA(ua),
        country || null,
        ua ? ua.slice(0, 400) : null,
        sessionId,
      ],
    );

    const id = rows[0]?.id;
    if (!id) {
      console.error("[lead] insert returned no id");
      return fail(500, "server", "insert_failed");
    }

    return NextResponse.json({ ok: true, id } satisfies LeadResult);
  } catch (err) {
    // Logged for the operator, never returned: Postgres error text names columns
    // and constraints, and this is a public endpoint.
    console.error(
      "[lead] insert failed:",
      err instanceof Error ? err.message : err,
    );
    return fail(500, "server", "insert_failed");
  }
}
