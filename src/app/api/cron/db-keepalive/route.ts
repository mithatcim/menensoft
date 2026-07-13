import { NextResponse } from "next/server";

import { getPool } from "@/lib/db/postgres";

/**
 * GET /api/cron/db-keepalive (Phase 33C-PG).
 *
 * Optional, and only worth scheduling on a provider whose database sleeps when
 * idle — several free tiers suspend a project after days of inactivity. The
 * failure mode there is nasty and quiet: the FIRST REAL LEAD is the request that
 * wakes the database, and it may time out instead. On an always-on Postgres (a
 * VPS, a paid tier, local Docker) this endpoint is simply unused.
 *
 * A trivial count is enough to register as activity. It returns a number, never
 * a row: nothing about any lead leaves this endpoint.
 *
 * It fails CLOSED. With no CRON_SECRET set it refuses to run rather than
 * defaulting to open — an unprotected cron URL is a free way for a stranger to
 * spend your database quota. Scheduling is documented in POSTGRES_SETUP.md.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "cron_secret_not_configured" },
      { status: 503 },
    );
  }

  // Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`.
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const pool = getPool();
  if (!pool) {
    return NextResponse.json(
      { ok: false, error: "database_not_configured" },
      { status: 503 },
    );
  }

  try {
    const { rows } = await pool.query<{ count: string }>(
      "select count(*)::text as count from leads",
    );
    return NextResponse.json({ ok: true, leads: Number(rows[0]?.count ?? 0) });
  } catch (err) {
    console.error(
      "[keepalive] failed:",
      err instanceof Error ? err.message : err,
    );
    return NextResponse.json(
      { ok: false, error: "query_failed" },
      { status: 500 },
    );
  }
}
