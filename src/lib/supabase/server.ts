import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client, holding the service role key (Phase 33C).
 *
 * The service role bypasses RLS. `leads` has RLS enabled and no policies, so
 * this is the ONLY thing on earth that can read or write that table — which is
 * the entire security model. That means two rules, and they are not negotiable:
 *
 *   1. This file must never reach the browser. The guard below makes a stray
 *      client import fail loudly instead of silently shipping a key. (Vercel's
 *      `server-only` package would catch it at BUILD time rather than run time
 *      and is worth adding later; it was left out here to keep this phase to the
 *      two sanctioned dependencies. The bundle is grepped for the key in QA.)
 *   2. The key must never be prefixed NEXT_PUBLIC_. Anything so prefixed is
 *      inlined into the client bundle by definition.
 *
 * Missing env is a runtime state, not a build failure. A local `pnpm build`,
 * `pnpm start` and `pnpm audit:browser` must all keep working with no Supabase
 * project at all — the site is a static sales site first, and the forms degrade
 * to email/WhatsApp when the database is not configured. So this returns null
 * instead of throwing, and /api/lead answers 503 with a clear reason.
 */

if (typeof window !== "undefined") {
  throw new Error(
    "src/lib/supabase/server.ts was imported from the browser. It holds the " +
      "service role key and must only be used from route handlers or server " +
      "components.",
  );
}

let cached: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  cached ??= createClient(url, key, {
    auth: {
      // No user session here: this client is a machine, not a person. Persisting
      // or refreshing a session would be meaningless in a serverless handler.
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return cached;
}
