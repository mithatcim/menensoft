import { createHash } from "node:crypto";

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
import { getPool } from "@/lib/db/postgres";

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

const fail = (
  status: number,
  code: LeadErrorCode,
  message: string,
  field?: string,
) => NextResponse.json({ ok: false, code, message, field }, { status });

/**
 * The client IP is hashed and never stored — not in `leads` (which has no IP
 * column at all) and not in `lead_rate_limits`, which holds only the digest. The
 * hash answers "is this the same sender?" and nothing else.
 *
 * Salted with LEAD_RATE_LIMIT_SALT when set. If it is absent we fall back to
 * DATABASE_URL, which is already a server-only secret and is stable across
 * requests — so the limiter still works out of the box rather than silently
 * degrading to unsalted (and therefore reversible) hashes of an address space
 * small enough to brute-force.
 */
function clientHash(req: Request): string {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const salt =
    process.env.LEAD_RATE_LIMIT_SALT || process.env.DATABASE_URL || "menensoft";
  return createHash("sha256").update(`${ip}:${salt}`).digest("hex");
}

/**
 * One atomic statement, not read-then-write: two concurrent submissions would
 * both read the old count and both be allowed. The upsert closes that race in a
 * single round trip, and RETURNING tells us where we landed.
 */
async function overRateLimit(
  pool: NonNullable<ReturnType<typeof getPool>>,
  hash: string,
): Promise<boolean> {
  try {
    const { rows } = await pool.query<{ count: number }>(
      `insert into lead_rate_limits (ip_hash, window_start, count)
       values ($1, now(), 1)
       on conflict (ip_hash) do update set
         count = case
           when lead_rate_limits.window_start < now() - $2::interval then 1
           else lead_rate_limits.count + 1
         end,
         window_start = case
           when lead_rate_limits.window_start < now() - $2::interval then now()
           else lead_rate_limits.window_start
         end
       returning count`,
      [hash, RATE_WINDOW],
    );
    return (rows[0]?.count ?? 0) > RATE_MAX;
  } catch (err) {
    // Fail OPEN. A broken limiter must never be the reason a real lead is lost —
    // the worst case is some spam gets through, and spam is cheaper than silence.
    console.error(
      "[lead] rate limiter unavailable, allowing through:",
      err instanceof Error ? err.message : err,
    );
    return false;
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

  if (await overRateLimit(pool, clientHash(req))) {
    return fail(429, "rate_limit", "too_many_submissions");
  }

  // --- enrich server-side ---------------------------------------------------
  // Never from the client: a payload could claim any country or device it liked.
  const ua = req.headers.get("user-agent");
  const country = req.headers.get("x-vercel-ip-country"); // null off Vercel

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
        cleanProjectSlug(input.referenceProjectSlug),
        cleanSourcePath(input.sourcePath),
        deviceTypeFromUA(ua),
        country || null,
        ua ? ua.slice(0, 400) : null,
        null, // session_id — Phase 33F
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
