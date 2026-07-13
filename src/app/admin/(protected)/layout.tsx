import { BarChart3, Inbox, LayoutDashboard, LogOut } from "lucide-react";
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
        {/* The brand, three nav items and a logout button do not fit in 390px of
            phone. Before this, the logout button sat 72px past the right edge of
            the viewport and every admin page scrolled sideways. The labels
            collapse to icons below `sm`; the icons carry aria-labels so nothing
            is lost to a screen reader. */}
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-4 sm:gap-4 sm:px-5">
          <nav className="flex min-w-0 items-center gap-0.5 sm:gap-1">
            <Link
              href="/admin"
              className="mr-1 shrink-0 text-sm font-semibold tracking-tight sm:mr-3"
            >
              Menensoft
              <span className="hidden font-mono text-xs text-muted-foreground sm:inline">
                {" "}
                /yönetim
              </span>
            </Link>
            <Link
              href="/admin"
              aria-label="Özet"
              className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground sm:px-2.5"
            >
              <LayoutDashboard className="size-4 shrink-0" />
              <span className="hidden sm:inline">Özet</span>
            </Link>
            <Link
              href="/admin/leads"
              aria-label="Talepler"
              className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground sm:px-2.5"
            >
              <Inbox className="size-4 shrink-0" />
              <span className="hidden sm:inline">Talepler</span>
            </Link>
            <Link
              href="/admin/analytics"
              aria-label="Analitik"
              className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground sm:px-2.5"
            >
              <BarChart3 className="size-4 shrink-0" />
              <span className="hidden sm:inline">Analitik</span>
            </Link>
          </nav>

          <form action={logoutAction} className="shrink-0">
            <button
              type="submit"
              aria-label="Çıkış"
              className="flex items-center gap-1.5 rounded-md border border-border px-2 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground sm:px-2.5"
            >
              <LogOut className="size-3.5 shrink-0" />
              <span className="hidden sm:inline">Çıkış</span>
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
