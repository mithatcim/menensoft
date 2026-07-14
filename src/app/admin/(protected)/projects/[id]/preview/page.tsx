import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CaseStudyHero } from "@/components/projects/case-study-hero";
import {
  DossierConstraints,
  DossierModules,
} from "@/components/projects/system-dossier";
import { CapabilityMatrix } from "@/components/projects/system-map";
import { FlowPanel } from "@/components/shared/flow-panel";
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
          {(() => {
            const preview = toProject(project, translation);
            return (
              <>
                <CaseStudyHero project={preview} locale={locale} />

                <div className="space-y-10 px-5 py-10 sm:px-8">
                  <DossierConstraints project={preview} locale={locale} />

                  {preview.flow && preview.flow.length > 0 && (
                    <FlowPanel
                      label={locale === "en" ? "System flow" : "Sistem akışı"}
                      nodes={preview.flow}
                    />
                  )}

                  {preview.built.length > 0 && (
                    <section>
                      <h2 className="font-mono text-xs tracking-widest text-muted-foreground/70 uppercase">
                        {locale === "en" ? "What was built" : "Neler kuruldu"}
                      </h2>
                      <ul className="mt-3 space-y-1.5">
                        {preview.built.map((item) => (
                          <li
                            key={item}
                            className="flex gap-2.5 text-sm text-foreground/90"
                          >
                            <span
                              aria-hidden
                              className="mt-2 size-1.5 shrink-0 rounded-full bg-accent/70"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  <DossierModules project={preview} />

                  <CapabilityMatrix slug={preview.slug} locale={locale} />

                  {preview.statusNote && (
                    <section>
                      <h2 className="font-mono text-xs tracking-widest text-muted-foreground/70 uppercase">
                        {locale === "en" ? "Current status" : "Güncel durum"}
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-foreground/85">
                        {preview.statusNote}
                      </p>
                    </section>
                  )}
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
