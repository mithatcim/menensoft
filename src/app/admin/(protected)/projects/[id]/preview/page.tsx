import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProjectCaseStudy } from "@/components/projects/case-study";
import { getAdminProject, STATUS_LABEL } from "@/lib/projects-cms/admin";
import { toProject, type Locale } from "@/lib/projects-cms";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

/**
 * Admin preview (Phase 38B).
 *
 * Renders the DRAFT with the same components the public case-study page uses —
 * CaseStudyHero, FlowPanel, CapabilityMatrix, the dossier blocks — fed by the
 * same `Project` object the public page would receive. So this is not a mock-up
 * of the page; it is the page's own parts, showing the owner's unsaved-to-the-
 * world content.
 *
 * It is NOT pixel-identical to /projeler/[slug] and it does not pretend to be:
 * that route still reads the typed files and still owns its own section order.
 * The two converge in 38C, when the public route reads this same database and
 * preview becomes literally the public page with a draft flag. Saying that out
 * loud on the page is cheaper than an owner discovering it at launch.
 *
 * Auth: inherited from the (protected) layout, which redirects anonymous
 * visitors to /admin/login before this file runs. There is no token, no
 * shareable link, and nothing public references this route.
 */
export default async function ProjectPreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ locale?: string }>;
}) {
  const { id } = await params;
  const { locale: rawLocale } = await searchParams;
  const locale: Locale = rawLocale === "en" ? "en" : "tr";

  const row = await getAdminProject(id);

  if (row === null) {
    return (
      <p className="rounded-xl border border-border bg-card/60 p-6 text-sm text-muted-foreground">
        DATABASE_URL ayarlı değil — önizleme yapılamıyor.
      </p>
    );
  }
  if (!row) notFound();

  const { project, translations } = row;
  const translation = translations[locale];

  const other: Locale = locale === "tr" ? "en" : "tr";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/admin/projects/${project.id}`}
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Düzenlemeye dön
        </Link>

        <div className="flex items-center gap-1.5">
          {(["tr", "en"] as const).map((l) => (
            <Link
              key={l}
              href={`/admin/projects/${project.id}/preview?locale=${l}`}
              className={
                l === locale
                  ? "rounded-lg border border-accent/50 bg-accent/10 px-3 py-1.5 font-mono text-xs text-foreground"
                  : "rounded-lg border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
              }
            >
              {l.toUpperCase()}
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
        <p className="text-sm font-medium text-amber-200">
          Admin önizleme — bu sayfa yayında olmayabilir.
        </p>
        <p className="mt-1 text-xs leading-relaxed text-amber-200/80">
          Durum: <strong>{STATUS_LABEL[project.status]}</strong>. Herkese açık
          proje sayfaları <strong>38C’ye kadar</strong> typed dosyaları okuyor,
          bu yüzden buradaki içerik henüz sitede görünmüyor. Bölüm sırası
          birebir yayın sayfası değildir; 38C’de önizleme doğrudan yayın
          sayfasının kendisi olacak.
        </p>
      </div>

      {!translation || !translation.name.trim() ? (
        <p className="rounded-xl border border-dashed border-border bg-card/30 p-8 text-center text-sm text-muted-foreground">
          {locale.toUpperCase()} içeriği boş. Önizlenecek bir şey yok —{" "}
          <Link
            href={`/admin/projects/${project.id}/preview?locale=${other}`}
            className="underline underline-offset-4"
          >
            {other.toUpperCase()} önizlemesine geçin
          </Link>{" "}
          ya da bu dili doldurun.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-background">
          {/* 38D: the ACTUAL public case study, with draft data. Before this,
              preview hand-composed a similar-looking page, which meant it could
              drift from the real one — and a preview that lies is worse than no
              preview, because the owner trusts it. */}
          <ProjectCaseStudy
            project={{
              ...toProject(project, translation),
              ...(project.fit_id ? { fitId: project.fit_id } : {}),
              // 38E: the matrix is on the row, so the preview shows exactly what
              // the owner just ticked — before it is published anywhere.
              ...(project.capabilities?.length
                ? { capabilities: project.capabilities }
                : {}),
            }}
            locale={locale}
          />
        </div>
      )}
    </div>
  );
}
