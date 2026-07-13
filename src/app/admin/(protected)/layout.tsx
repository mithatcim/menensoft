import { Inbox, LayoutDashboard, LogOut } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { logoutAction } from "@/app/admin/actions";
import { getAdminSession } from "@/lib/admin/auth";
import { isDatabaseConfigured } from "@/lib/db/postgres";

export const dynamic = "force-dynamic";

/**
 * The gate (Phase 33D). Everything under it requires a valid session.
 *
 * This stops an unauthenticated visitor from SEEING anything. It does not, on
 * its own, stop them from DOING anything — Server Actions are separate POST
 * endpoints and are never routed through this layout. That is why every mutating
 * action re-checks the session itself. Both checks exist; neither is redundant.
 */
export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const dbReady = isDatabaseConfigured();

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-5">
          <nav className="flex items-center gap-1">
            <Link
              href="/admin"
              className="mr-3 text-sm font-semibold tracking-tight"
            >
              Menensoft{" "}
              <span className="font-mono text-xs text-muted-foreground">
                /yönetim
              </span>
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <LayoutDashboard className="size-4" />
              Özet
            </Link>
            <Link
              href="/admin/leads"
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Inbox className="size-4" />
              Talepler
            </Link>
          </nav>

          <form action={logoutAction}>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground"
            >
              <LogOut className="size-3.5" />
              Çıkış
            </button>
          </form>
        </div>
      </header>

      {!dbReady && (
        <div className="border-b border-accent/30 bg-accent/5">
          <p className="mx-auto max-w-6xl px-5 py-3 text-xs leading-relaxed text-foreground/90">
            <strong className="font-medium">DATABASE_URL ayarlı değil.</strong>{" "}
            Talepler okunamıyor. Kurulum: POSTGRES_SETUP.md
          </p>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
    </div>
  );
}
