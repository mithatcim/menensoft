import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/shared/reveal";
import { buttonVariants } from "@/components/ui/button";
import { sectorsEn } from "@/content/en/sectors";
import { systemsEn } from "@/content/en/systems";
import { projectToFitType } from "@/content/fit";
import { type Project } from "@/content/projects";
import { sectors } from "@/content/sectors";
import { systems } from "@/content/systems";
import { type Locale } from "@/lib/locale";
import { cn } from "@/lib/utils";

const BAND_COPY = {
  tr: {
    eyebrow: "Teslim edilen yapı — sizin için de kurulabilir",
    title: "Benzer bir sisteme mi ihtiyacınız var?",
    text: "Bu sayfadaki modüller ve akış, gerçek bir ihtiyaç için kuruldu. Sizin işinizin girdisi farklı olabilir; teslim mantığı aynıdır: net kapsam, yönetilebilir panel, devredilebilir yapı.",
    primary: "Benzer sistem istiyorum",
    secondary: "Süreci gör",
    secondaryHref: "/surec",
    quoteBase: "/teklif-al",
    systemBase: "/sistemler",
    sectorBase: "/sektorler",
  },
  en: {
    eyebrow: "Delivered structure — buildable for you too",
    title: "Need a similar system?",
    text: "The modules and flow on this page were built for a real need. Your input may differ; the delivery logic stays the same: clear scope, a manageable panel, a transferable structure.",
    primary: "I want a similar system",
    secondary: "See the process",
    secondaryHref: "/en/process",
    quoteBase: "/en/start-project",
    systemBase: "/en/systems",
    sectorBase: "/en/sectors",
  },
} as const;

/**
 * Proje detayının satış köprüsü: "bu yapı sizin işiniz için de kurulabilir".
 * İlgili sistem/sektör sayfaları içerikten ters aramayla bulunur; birincil
 * CTA sihirbaza önseçimle gider. Uydurma kanıt yok — bağlantılar gerçek.
 */
export function SimilarSystemBand({
  project,
  locale = "tr",
}: {
  project: Project;
  locale?: Locale;
}) {
  const copy = BAND_COPY[locale];
  const fitType = projectToFitType[project.slug];
  // carries the project through to the inquiry page (see CaseStudyHero)
  const quoteHref = fitType
    ? `${copy.quoteBase}?tur=${fitType}&proje=${project.slug}`
    : `${copy.quoteBase}?proje=${project.slug}`;

  const systemPool = locale === "en" ? systemsEn : systems;
  const sectorPool = locale === "en" ? sectorsEn : sectors;
  const relatedSystems = systemPool.filter((sys) =>
    sys.relatedProjects.some((rp) => rp.slug === project.slug),
  );
  const relatedSectors = sectorPool.filter((sec) =>
    sec.relatedProjects.some((rp) => rp.slug === project.slug),
  );

  return (
    <section className="pb-4 md:pb-6">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-xl border border-accent/25 bg-accent/5 p-6 md:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_20%_0%,rgba(139,140,248,0.08),transparent)]"
            />
            <div className="relative">
              <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                <span aria-hidden className="size-1.5 bg-accent/90" />
                {copy.eyebrow}
              </p>
              <h2 className="mt-3 text-xl font-semibold tracking-tight text-balance md:text-2xl">
                {copy.title}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                {copy.text}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href={quoteHref}
                  className={cn(buttonVariants({ variant: "cta" }), "h-11 px-6")}
                >
                  {copy.primary}
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href={copy.secondaryHref}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-11 px-6",
                  )}
                >
                  {copy.secondary}
                </Link>
              </div>
              {(relatedSystems.length > 0 || relatedSectors.length > 0) && (
                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-border/60 pt-4 text-sm">
                  {relatedSystems.map((sys) => (
                    <Link
                      key={sys.slug}
                      href={`${copy.systemBase}/${sys.slug}`}
                      className="group inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {sys.title}
                      <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                  {relatedSectors.map((sec) => (
                    <Link
                      key={sec.slug}
                      href={`${copy.sectorBase}/${sec.slug}`}
                      className="group inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {sec.title}
                      <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
