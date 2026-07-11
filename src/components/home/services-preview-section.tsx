import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { SpotlightCard } from "@/components/shared/spotlight-card";
import { solutionsEn } from "@/content/en/solutions";
import { getSystemEn } from "@/content/en/systems";
import { solutions } from "@/content/solutions";
import { getSystem } from "@/content/systems";
import { type Locale } from "@/lib/locale";

const PREVIEW_COPY = {
  tr: {
    eyebrow: "Çözümler",
    title: "Sizin için ne kurabiliriz?",
    description:
      "Altı sistem alanı — her biri gerçek bir işletme problemine karşılık gelir. Alanınızı bulun, ne kurulduğunu görün, görüşmeyi başlatın.",
    all: "Tüm çözümler",
    allHref: "/cozumler",
    who: "kime",
    quote: "Teklif al",
    quoteHref: "/teklif-al",
    detail: "Sistem detayı",
    systemBase: "/sistemler",
  },
  en: {
    eyebrow: "Solutions",
    title: "What can we build for you?",
    description:
      "Six system areas — each mapped to a real business problem. Find yours, see what gets built, start the conversation.",
    all: "All solutions",
    allHref: "/en/solutions",
    who: "for",
    quote: "Start a project",
    quoteHref: "/en/start-project",
    detail: "System details",
    systemBase: "/en/systems",
  },
} as const;

/**
 * "Sizin için ne kurabiliriz?" — ana sayfanın satış bölümü. Her kart bir
 * alıcı sorusuna cevap verir: hangi problemi çözer, ne kurulur, kimin
 * işine yarar. İçerik solutions.ts + systems.ts'ten türetilir; uydurma
 * kanıt yok, her kart gerçek sistem sayfasına ve teklife bağlanır.
 */
export function ServicesPreviewSection({ locale = "tr" }: { locale?: Locale }) {
  const copy = PREVIEW_COPY[locale];
  const pool = locale === "en" ? solutionsEn : solutions;
  const lookup = locale === "en" ? getSystemEn : getSystem;
  return (
    <section className="py-16 md:py-24">
      <Container>
        <Reveal>
          <div className="flex items-end justify-between gap-6">
            <SectionHeading
              eyebrow={copy.eyebrow}
              title={copy.title}
              description={copy.description}
            />
            <Link
              href={copy.allHref}
              className="hidden shrink-0 items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground md:inline-flex"
            >
              {copy.all}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pool.map((solution, index) => {
            const system = lookup(solution.systemSlug);
            const whoNeeds = system?.whoNeeds[0];
            return (
              <Reveal
                key={solution.id}
                delay={Math.min(index * 0.05, 0.2)}
                className="h-full"
              >
                <SpotlightCard className="flex h-full flex-col rounded-xl border border-border bg-card/70 p-6 ring-1 ring-white/5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_28px_56px_-24px_rgba(0,0,0,0.85)]">
                  <h3 className="text-lg font-semibold tracking-tight text-balance">
                    {solution.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {solution.problem}
                  </p>
                  <ul className="mt-4 space-y-1.5 border-t border-border/60 pt-4">
                    {solution.builds.slice(0, 2).map((item) => (
                      <li
                        key={item}
                        className="flex gap-2.5 text-xs leading-relaxed text-foreground/85"
                      >
                        <span
                          aria-hidden
                          className="mt-1.5 size-1 shrink-0 rounded-full bg-accent/80"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                  {whoNeeds && (
                    <p className="mt-3 flex gap-2.5 text-xs leading-relaxed text-muted-foreground">
                      <span className="shrink-0 font-mono tracking-widest text-muted-foreground/60 uppercase">
                        {copy.who}
                      </span>
                      {whoNeeds}
                    </p>
                  )}
                  <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-5 text-sm">
                    <Link
                      href={copy.quoteHref}
                      className="group/cta inline-flex items-center gap-1.5 font-medium text-foreground/90 transition-colors hover:text-foreground"
                    >
                      {copy.quote}
                      <ArrowRight className="size-3.5 text-accent transition-transform group-hover/cta:translate-x-0.5" />
                    </Link>
                    <Link
                      href={`${copy.systemBase}/${solution.systemSlug}`}
                      className="group/sys inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {copy.detail}
                      <ArrowUpRight className="size-3.5 transition-transform group-hover/sys:-translate-y-0.5 group-hover/sys:translate-x-0.5" />
                    </Link>
                  </div>
                </SpotlightCard>
              </Reveal>
            );
          })}
        </div>
        <div className="mt-8 md:hidden">
          <Link
            href={copy.allHref}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {copy.all}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
