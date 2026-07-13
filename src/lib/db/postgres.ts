import { Pool, type QueryResult, type QueryResultRow } from "pg";

/**
 * Server-only PostgreSQL access (Phase 33C-PG).
 *
 * Vendor-neutral: the only configuration is a connection string. No SDK, no
 * dashboard, no provider account. Local Docker, Neon, Render, Railway or your
 * own box all look identical from here.
 *
 * The security boundary is the network, not a policy engine: the browser never
 * talks to the database, so there is nothing to lock down at the row level.
 * That puts the entire weight of the model on two rules:
 *
 *   1. This file must never reach the browser. The guard below makes a stray
 *      client import fail loudly instead of silently shipping a connection
 *      string. (Vercel's `server-only` package would catch it at BUILD time
 *      rather than run time and is worth adding later; the bundle is grepped
 *      for DATABASE_URL in QA.)
 *   2. DATABASE_URL must never be prefixed NEXT_PUBLIC_. Anything so prefixed
 *      is inlined into the client bundle by definition.
 *
 * Missing env is a runtime state, not a build failure. A local `pnpm build`,
 * `pnpm start` and `pnpm audit:browser` all keep working with no database at
 * all — the site is a static sales site first, and the forms degrade to
 * email/WhatsApp when there is nowhere to write. So this returns null instead of
 * throwing, and /api/lead answers 503 with a clear reason.
 */

if (typeof window !== "undefined") {
  throw new Error(
    "src/lib/db/postgres.ts was imported from the browser. It holds the " +
      "database connection string and must only be used from route handlers " +
      "or server components.",
  );
}

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

/**
 * Cached on globalThis, not in a module-scope `let`: Next's dev server reloads
 * modules on every edit, and a fresh Pool per reload leaks connections until
 * Postgres starts refusing them.
 */
const globalForPg = globalThis as unknown as { __leadPool?: Pool | null };

function sslFor(url: string): false | { rejectUnauthorized: boolean } {
  // Explicit opt-out wins.
  if (/[?&]sslmode=disable\b/.test(url)) return false;

  let host = "";
  try {
    host = new URL(url).hostname;
  } catch {
    // unparseable URL — let pg produce the real error rather than guessing
  }
  const isLocal =
    host === "localhost" || host === "127.0.0.1" || host === "::1" || host === "";

  // Local Postgres (Docker, a dev box) usually has no TLS at all, and demanding
  // it just makes local setup fail for no security gain — nothing leaves the
  // machine.
  if (isLocal) return false;

  // Hosted Postgres: TLS on. `rejectUnauthorized: false` is the pragmatic
  // setting most managed providers require, because their certificate chains are
  // not in Node's default trust store. It protects the traffic but does not
  // authenticate the server, so it is not a defence against an attacker who can
  // already redirect your connection. If your provider publishes a CA bundle,
  // pass it here instead — that is strictly better.
  return { rejectUnauthorized: false };
}

export function getPool(): Pool | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;

  if (!globalForPg.__leadPool) {
    globalForPg.__leadPool = new Pool({
      connectionString: url,
      ssl: sslFor(url),
      // Small on purpose: serverless functions scale by process, not by pool.
      // A large pool per instance is how you exhaust a database's connection
      // limit with almost no traffic. Use the provider's POOLED url if it has one.
      max: 3,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 5_000,
    });

    // An idle client erroring (database restarted, network blipped) emits on the
    // pool. Unhandled, it takes the process down — which would turn a transient
    // database hiccup into a site-wide outage.
    globalForPg.__leadPool.on("error", (err) => {
      console.error("[db] idle client error:", err.message);
    });
  }

  return globalForPg.__leadPool;
}

/**
 * Parameterized queries only. Every value the visitor can influence is passed as
 * a bound parameter — user input is never concatenated into SQL anywhere in this
 * codebase.
 */
export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: readonly unknown[] = [],
): Promise<QueryResult<T> | null> {
  const pool = getPool();
  if (!pool) return null;
  return pool.query<T>(text, params as unknown[]);
}
