import { createHash } from "node:crypto";

import { getPool } from "./postgres";

/**
 * Shared PostgreSQL rate limiter (Phase 33D).
 *
 * Lifted out of /api/lead so the login limiter and the lead limiter cannot drift
 * apart. In-memory counters are useless on serverless — consecutive requests can
 * land on different instances — so the counter lives in the database we are
 * already talking to.
 *
 * The table name is chosen from a closed set below and never comes from user
 * input. It is the one value here that cannot be a bound parameter (SQL does not
 * parameterize identifiers), so it must not be interpolatable from outside.
 */

const TABLES = {
  lead: "lead_rate_limits",
  adminLogin: "admin_login_attempts",
} as const;

export type RateLimitBucket = keyof typeof TABLES;

/**
 * The IP is hashed and never stored — not in `leads` (which has no IP column at
 * all) and not in the limiter tables, which hold only the digest. The hash
 * answers "is this the same sender?" and nothing else.
 *
 * Salted with LEAD_RATE_LIMIT_SALT when set. If absent we fall back to
 * DATABASE_URL, itself a server-only secret and stable across requests — so the
 * limiter still works rather than silently degrading to unsalted (and therefore
 * trivially reversible) hashes of an address space small enough to enumerate.
 */
export function clientHash(req: Request, scope = ""): string {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const salt =
    process.env.LEAD_RATE_LIMIT_SALT || process.env.DATABASE_URL || "menensoft";
  return createHash("sha256").update(`${scope}:${ip}:${salt}`).digest("hex");
}

export interface RateLimitResult {
  /** True when this request is over the limit and should be refused. */
  limited: boolean;
  /** True when the limiter itself could not run (no database, query failed). */
  degraded: boolean;
}

/**
 * One atomic statement, not read-then-write: two concurrent attempts would both
 * read the old count and both be allowed. The upsert closes that race in a
 * single round trip, and RETURNING says where we landed.
 *
 * Callers decide what a `degraded` limiter means, because the right answer
 * differs. For leads it is "let it through" — a broken limiter must never be why
 * a real lead is lost, and spam is cheaper than silence. For admin login it is
 * "refuse" — an unprotected login form is worse than a locked-out owner.
 */
export async function hitRateLimit(
  bucket: RateLimitBucket,
  hash: string,
  max: number,
  window: string,
): Promise<RateLimitResult> {
  const pool = getPool();
  if (!pool) return { limited: false, degraded: true };

  const table = TABLES[bucket]; // closed set, never user input

  try {
    const { rows } = await pool.query<{ count: number }>(
      `insert into ${table} (ip_hash, window_start, count)
       values ($1, now(), 1)
       on conflict (ip_hash) do update set
         count = case
           when ${table}.window_start < now() - $2::interval then 1
           else ${table}.count + 1
         end,
         window_start = case
           when ${table}.window_start < now() - $2::interval then now()
           else ${table}.window_start
         end
       returning count`,
      [hash, window],
    );
    return { limited: (rows[0]?.count ?? 0) > max, degraded: false };
  } catch (err) {
    console.error(
      `[rate-limit:${bucket}] unavailable:`,
      err instanceof Error ? err.message : err,
    );
    return { limited: false, degraded: true };
  }
}

/** Clears a bucket for one sender — used after a successful admin login, so a
 *  few fat-fingered attempts don't leave the owner locked out. */
export async function clearRateLimit(
  bucket: RateLimitBucket,
  hash: string,
): Promise<void> {
  const pool = getPool();
  if (!pool) return;
  try {
    await pool.query(`delete from ${TABLES[bucket]} where ip_hash = $1`, [hash]);
  } catch {
    // a stale counter is harmless; it ages out of the window on its own
  }
}
