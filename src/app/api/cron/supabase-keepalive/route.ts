import { NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabase/server";

/**
 * GET /api/cron/supabase-keepalive (Phase 33C).
 *
 * Supabase free-tier projects pause after ~7 days of inactivity. A brand-new,
 * quiet site is exactly the case that goes quiet — and the failure mode is that
 * the FIRST REAL LEAD hits a paused database. That is the one failure this
 * project cannot afford, so the mitigation ships in the same phase as the first
 * insert rather than being left as a note.
 *
 * A trivial query is enough to count as activity. It returns a count, never a
 * row: nothing about any lead leaves this endpoint.
 *
 * Schedule it in Vercel Cron (see SUPABASE_SETUP.md). Protected by CRON_SECRET
 * because it is a public URL; if the secret is unset the route refuses to run
 * rather than defaulting to open.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    // Fail closed. An unprotected cron endpoint is a free way for anyone to
    // spend your database quota.
    return NextResponse.json(
      { ok: false, error: "cron_secret_not_configured" },
      { status: 503 },
    );
  }

  // Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`.
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: "supabase_not_configured" },
      { status: 503 },
    );
  }

  const { count, error } = await supabase
    .from("leads")
    .select("id", { count: "exact", head: true });

  if (error) {
    console.error("[keepalive] failed:", error.message);
    return NextResponse.json({ ok: false, error: "query_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, leads: count ?? 0 });
}
