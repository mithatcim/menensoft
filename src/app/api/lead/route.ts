import { createHash } from "node:crypto";

import { NextResponse } from "next/server";

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
import { type LeadErrorCode, type LeadResult } from "@/lib/leads/types";
import { getSupabaseAdmin } from "@/lib/supabase/server";

/**
 * POST /api/lead — the site's only public write endpoint (Phase 33C).
 *
 * Design rule that outranks everything else here: THE DATABASE MUST NOT BECOME A
 * SINGLE POINT OF FAILURE FOR REVENUE. If anything goes wrong — no Supabase
 * project configured, insert rejected, network down — this returns an honest
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

const fail = (
  status: number,
  code: LeadErrorCode,
  message: string,
  field?: string,
) => NextResponse.json({ ok: false, code, message, field }, { status });

/**
 * The client IP is hashed and never stored — not in `leads` (which has no IP
 * column at all) and not in `lead_rate_limits`, which holds only the digest. The
 * hash answers "is this the same sender?" and nothing else. Salted with the
 * service key so the digests are useless outside this deployment.
 */
function clientHash(req: Request): string {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const salt = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "menensoft";
  return createHash("sha256").update(`${ip}:${salt}`).digest("hex");
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
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return fail(503, "unconfigured", "supabase_not_configured");
  }

  // --- rate limit -----------------------------------------------------------
  // In-memory counters are useless on serverless: consecutive requests can land
  // on different instances. The counter has to live somewhere shared, and the
  // nearest shared thing is the database we are already talking to.
  try {
    const { data: allowed, error } = await supabase.rpc("rate_limit_lead", {
      p_hash: clientHash(req),
    });
    if (!error && allowed === false) {
      return fail(429, "rate_limit", "too_many_submissions");
    }
    // A broken limiter must not block real leads — if the RPC itself errors we
    // let the submission through rather than lose it.
  } catch {
    // same reasoning: fail open, not closed
  }

  // --- enrich server-side ---------------------------------------------------
  // Never from the client: a payload could claim any country or device it liked.
  const ua = req.headers.get("user-agent");
  const country = req.headers.get("x-vercel-ip-country"); // null off Vercel

  const row = {
    name: input.name,
    email: input.email ?? null,
    phone: input.phone ?? null,
    message: input.message,
    language: input.language,
    contact_preference: derivePreference(
      input.contactPreference,
      input.email,
      input.phone,
    ),
    selected_fit_id: cleanFitId(input.selectedFitId),
    selected_situation: cleanSituation(input.selectedSituation),
    reference_project_slug: cleanProjectSlug(input.referenceProjectSlug),
    source_path: cleanSourcePath(input.sourcePath),
    device_type: deviceTypeFromUA(ua),
    country: country || null,
    user_agent: ua ? ua.slice(0, 400) : null,
    status: "new",
  };

  const { data, error } = await supabase
    .from("leads")
    .insert(row)
    .select("id")
    .single();

  if (error || !data) {
    // Logged for the operator, never returned: Postgres error text can name
    // columns, constraints and policies, and this is a public endpoint.
    console.error("[lead] insert failed:", error?.message);
    return fail(500, "server", "insert_failed");
  }

  return NextResponse.json({ ok: true, id: data.id } satisfies LeadResult);
}
