import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/login-form";
import { getAdminConfig, getAdminSession } from "@/lib/admin/auth";
import { isDatabaseConfigured } from "@/lib/db/postgres";

export const dynamic = "force-dynamic";

/**
 * The only public admin route (Phase 33D).
 *
 * Three states, and the difference matters:
 *   - already signed in  -> straight to the panel
 *   - not configured     -> setup instructions, NO login form (there is nothing
 *                           to log into, and a form that cannot work is a form
 *                           people will keep trying)
 *   - configured         -> the form
 *
 * The setup state names the env vars but never their values, and it reaches no
 * database. It is safe to render to a stranger — which it will be, because this
 * route is public by necessity.
 */
export default async function AdminLoginPage() {
  if (await getAdminSession()) redirect("/admin");

  const config = getAdminConfig();
  const dbReady = isDatabaseConfigured();

  if (!config) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-6 py-16">
        <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
          <span aria-hidden className="size-1.5 bg-accent/90" />
          Kurulum gerekli
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
          Yönetim paneli henüz yapılandırılmadı
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Giriş yapılabilmesi için şu ortam değişkenleri gerekiyor. Kurulum
          adımları <code className="text-foreground/90">ADMIN_SETUP.md</code>{" "}
          dosyasında.
        </p>
        <ul className="mt-5 space-y-2 rounded-xl border border-border bg-card/60 p-5 font-mono text-xs">
          {[
            ["ADMIN_EMAIL", process.env.ADMIN_EMAIL],
            ["ADMIN_PASSWORD_HASH", process.env.ADMIN_PASSWORD_HASH],
            ["ADMIN_SESSION_SECRET", process.env.ADMIN_SESSION_SECRET],
            ["DATABASE_URL", process.env.DATABASE_URL],
          ].map(([key, value]) => (
            <li key={key} className="flex items-center justify-between gap-4">
              {/* The NAME of the variable, never its value. */}
              <span className="text-foreground/85">{key}</span>
              <span
                className={
                  value ? "shrink-0 text-accent" : "shrink-0 text-muted-foreground/50"
                }
              >
                {value ? "ayarlı" : "eksik"}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-5 font-mono text-xs leading-relaxed text-muted-foreground/70">
          Parola hash&apos;i:{" "}
          <span className="text-foreground/85">
            node scripts/hash-admin-password.mjs
          </span>
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-6 py-16">
      <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
        <span aria-hidden className="size-1.5 bg-accent/90" />
        Menensoft
      </p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">Yönetim girişi</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Bu panel yalnızca site sahibi içindir. Kayıt yoktur.
      </p>

      {!dbReady && (
        <p className="mt-5 rounded-lg border border-accent/30 bg-accent/5 px-4 py-3 text-xs leading-relaxed text-foreground/90">
          <strong className="font-medium">DATABASE_URL ayarlı değil.</strong>{" "}
          Giriş doğrulanamaz — panel veritabanına ihtiyaç duyar.
        </p>
      )}

      <LoginForm disabled={!dbReady} />
    </main>
  );
}
