import { getAdminSession } from "@/lib/admin/auth";
import { exportLeadsCsv } from "@/lib/admin/leads";

/**
 * GET /admin/leads.csv — lead export (Phase 36A).
 *
 * Lives under /admin, so `robots.txt` already disallows it and the admin root
 * layout's noindex already covers the path. But neither of those is protection:
 * the auth check below is. A route handler is NOT covered by the protected
 * layout — layouts guard pages, not handlers — so this checks the session
 * itself, exactly like every Server Action does.
 *
 * Insurance, mostly. Your leads should never be trapped behind a psql prompt.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    // 404, not 401: an unauthenticated stranger learns nothing about what does
    // or does not exist here.
    return new Response("Not found", { status: 404 });
  }

  const csv = await exportLeadsCsv();
  if (csv === null) {
    return new Response("Database not configured", { status: 503 });
  }

  const stamp = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="menensoft-leads-${stamp}.csv"`,
      // Never let a proxy or the browser keep a copy of the customer list.
      "Cache-Control": "no-store, private",
    },
  });
}
