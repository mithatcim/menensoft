import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { SystemBlueprint } from "@/components/projects/system-blueprint";
import { Reveal } from "@/components/shared/reveal";
import { fitSystemsEn } from "@/content/en/fit";
import { getSystemEn } from "@/content/en/systems";
import { fitSystems } from "@/content/fit";
import type { PublicProject } from "@/lib/projects/types";
import { getSystem } from "@/content/systems";
import { type Locale } from "@/lib/locale";
import { cn } from "@/lib/utils";

/**
 * Project case-study hero (Phase 21).
 *
 * Replaces the old fold, which opened with a DURUM / ROL / TEKNOLOJİ metadata
 * table — including "Rol: Uçtan uca tasarlandı ve geliştirildi", which read as
 * a line from a CV rather than an answer to "can you build my system?". It
 * also left the right half of the fold empty and put the first inquiry CTA
 * roughly three screens down.
 *
 * The fold now answers a buyer's questions in order: what kind of system is
 * this, is it real, what problem did it solve, what was actually built, and
 * how do I ask for one. The stack survives as a quiet supporting row — it no
 * longer leads.
 *
 * Nothing new is invented. The system type is derived (project.fitId → the
 * wizard's fit option → its systemSlug), the modules and status come straight
 * from the project record, and the CTA prefills the wizard with the same fit id
 * the rest of the site already uses.
 */

const HERO_COPY = {
  tr: {
    back: "Tüm projeler",
    backHref: "/projeler",
    systemLabel: "Sistem tipi",
    problemLabel: "Çözdüğü problem",
    modulesLabel: "Kurulan modüller",
    stackLabel: "Teknoloji",
    fallbackCta: "Benzer bir sistem konuşalım",
    quoteBase: "/teklif-al",
    systemBase: "/sistemler",
  },
  en: {
    back: "All projects",
    backHref: "/en/projects",
    systemLabel: "System type",
    problemLabel: "The problem it handles",
    modulesLabel: "Modules delivered",
    stackLabel: "Stack",
    fallbackCta: "Discuss a similar system",
    quoteBase: "/en/start-project",
    systemBase: "/en/systems",
  },
} as const;

export function CaseStudyHero({
  project,
  locale = "tr",
}: {
  project: PublicProject;
  locale?: Locale;
}) {
  const copy = HERO_COPY[locale];
  const internal = project.tier === "internal";

  // system type: derived, never duplicated into the project record
  // 38D: the fit id lives on the project row. The static map in fit.ts is a
  // seed/parity fixture now, not live truth — keeping it as a fallback here
  // would mean two sources for one fact, and the stale one would win whenever
  // the owner changed a system type in the panel.
  const fitId = project.fitId;
  const fitPool = locale === "en" ? fitSystemsEn : fitSystems;
  const lookupSystem = locale === "en" ? getSystemEn : getSystem;
  const fit = fitId ? fitPool.find((f) => f.id === fitId) : undefined;
  const system = fit?.systemSlug ? lookupSystem(fit.systemSlug) : undefined;

  // ?proje= lets the inquiry page confirm where the visitor came from, and puts
  // one honest reference line in the message so the founder knows which project
  // triggered it. Falls back cleanly when there is no fit id.
  const ctaHref = fitId
    ? `${copy.quoteBase}?tur=${fitId}&proje=${project.slug}`
    : `${copy.quoteBase}?proje=${project.slug}`;
  const ctaLabel = project.similarCta ?? copy.fallbackCta;
  const lead = project.dossierSummary ?? project.oneLiner;

  return (
    <section className="relative overflow-hidden border-b border-border/60 py-12 md:py-16">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="bg-grid mask-radial-faded absolute inset-0 opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_0%,rgba(139,140,248,0.10),transparent)]" />
      </div>

      <Container className="relative">
        <Link
          href={copy.backHref}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {copy.back}
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:items-center lg:gap-14">
          <div>
            <Reveal>
              {/* what kind of system, and how real it is — the two things a
                  buyer needs before the name of the project means anything */}
              <div className="flex flex-wrap items-center gap-3">
                {system && (
                  <Link
                    href={`${copy.systemBase}/${system.slug}`}
                    className="group inline-flex items-center gap-2 rounded-lg border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-xs text-accent transition-colors hover:border-accent/60 hover:bg-accent/15"
                  >
                    <span className="tracking-widest uppercase opacity-70">
                      {copy.systemLabel}
                    </span>
                    {system.title}
                    <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                )}
                {/* tier-aware: internal work never borrows the visual language
                    of delivered client work */}
                <span
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-xs",
                    internal
                      ? "border-dashed border-border bg-background/50 text-muted-foreground"
                      : "border-border bg-background/50 text-foreground/85",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "size-1.5 rounded-full",
                      internal ? "bg-muted-foreground/50" : "bg-accent/90",
                    )}
                  />
                  {project.statusLabel}
                </span>
              </div>

              <h1 className="mt-6 text-3xl font-semibold tracking-tight text-balance md:text-4xl lg:text-5xl">
                {project.name}
              </h1>
              <p className="mt-5 text-base leading-relaxed text-pretty text-foreground/85 md:text-lg">
                {lead}
              </p>
            </Reveal>

            <Reveal delay={0.06}>
              <div className="mt-7 border-t border-border/60 pt-6">
                <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground/70 uppercase">
                  <span
                    aria-hidden
                    className="size-1.5 rotate-45 border border-muted-foreground/50"
                  />
                  {copy.problemLabel}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-pretty text-muted-foreground md:text-base">
                  {project.problem}
                </p>
              </div>
            </Reveal>

            {/* No modules-at-a-glance list here on purpose: the blueprint
                sitting directly beside this column already lists them as
                chips, and printing the same module names twice inside one
                fold was the first thing that looked wrong once it rendered. */}

            <Reveal delay={0.14}>
              {/* the inquiry that used to live ~3 screens down */}
              <div className="mt-8">
                <Link
                  href={ctaHref}
                  className="group/cta inline-flex items-center justify-center gap-2 rounded-lg border border-accent/50 bg-accent/15 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent/70 hover:bg-accent/20"
                >
                  {ctaLabel}
                  <ArrowRight className="size-4 shrink-0 text-accent transition-transform group-hover/cta:translate-x-0.5" />
                </Link>
              </div>

              {/* the stack supports; it no longer leads the page */}
              <p className="mt-7 font-mono text-xs text-muted-foreground/70">
                <span className="tracking-widest uppercase">
                  {copy.stackLabel}
                </span>
                <span aria-hidden className="mx-2">
                  —
                </span>
                {project.stack.join(" · ")}
              </p>
            </Reveal>
          </div>

          {/* the schematic that fills what used to be an empty right fold */}
          <Reveal delay={0.08}>
            <SystemBlueprint project={project} locale={locale} />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
