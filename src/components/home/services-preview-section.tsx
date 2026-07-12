import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  CircuitBoard,
  Gauge,
  LayoutDashboard,
  ShoppingCart,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { SpotlightCard } from "@/components/shared/spotlight-card";
import { fitSystemsEn } from "@/content/en/fit";
import { getProjectEn } from "@/content/en/projects";
import { solutionsEn } from "@/content/en/solutions";
import { getSystemEn } from "@/content/en/systems";
import { fitSystems } from "@/content/fit";
import { getProject } from "@/content/projects";
import { solutions } from "@/content/solutions";
import { getSystem } from "@/content/systems";
import { type Locale } from "@/lib/locale";
import { cn } from "@/lib/utils";

/**
 * Services catalogue — the homepage's breadth surface (Phase 18).
 *
 * Deliberately NOT interactive: the Visual Gateway owns need-first selection,
 * SystemLayers owns the under-the-hood story, and this section's whole job is
 * letting a visitor compare all six solution areas at a glance. So it stays a
 * server-rendered grid with zero selector state.
 *
 * Everything here is derived from existing content: proof chips come from the
 * real `relatedSlugs` already carried by solutions.ts (previously only used on
 * /cozumler), and each card's primary CTA prefills the project-fit wizard by
 * reverse-mapping the solution's systemSlug to the wizard's fit id — the only
 * ids `?tur=` actually recognizes. No invented proof, no invented metrics.
 */

/** Fit id → icon; fit ids are locale-stable, unlike the solution ids. */
const ICONS: Record<string, LucideIcon> = {
  "e-ticaret": ShoppingCart,
  "yonetim-paneli": LayoutDashboard,
  dashboard: Gauge,
  operasyon: CircuitBoard,
  otomasyon: Workflow,
  "kurumsal-site": Building2,
};

/** The two areas given extra visual weight so the grid stops reading flat. */
const FLAGSHIP_FITS = new Set(["e-ticaret", "operasyon"]);

/**
 * Where a solution lists several honest proofs, prefer the one that spreads the
 * evidence across the portfolio instead of repeating the same project. Only
 * ever applied if the slug is genuinely among that solution's relatedSlugs —
 * proof is never borrowed from an unrelated project.
 */
const PREFERRED_PROOF: Record<string, string> = {
  "yonetim-paneli": "orva-psychology",
  dashboard: "log-management-platform",
  otomasyon: "cendovar",
};

const COPY = {
  tr: {
    eyebrow: "Çözümler",
    title: "Sizin için ne kurabiliriz?",
    description:
      "Altı sistem alanı — her biri gerçek bir işletme problemine karşılık gelir. Alanınızı bulun, ne kurulduğunu ve hangi projede çalıştığını görün.",
    all: "Tüm çözümler",
    allHref: "/cozumler",
    who: "kime",
    proofLabel: "Kanıt",
    primary: "Bu sistemi konuşalım",
    systemDetail: "Sistem detayını incele",
    footerQuestion: "Hangi sistemin uygun olduğundan emin değil misiniz?",
    footerLink: "Hangi sistem uygun?",
    quoteBase: "/teklif-al",
    systemBase: "/sistemler",
    projectBase: "/projeler",
  },
  en: {
    eyebrow: "Solutions",
    title: "What can we build for you?",
    description:
      "Six system areas — each mapped to a real business problem. Find yours, see what gets built and which project it already runs in.",
    all: "All solutions",
    allHref: "/en/solutions",
    who: "for",
    proofLabel: "Proof",
    primary: "Discuss this system",
    systemDetail: "View system detail",
    footerQuestion: "Not sure which system fits?",
    footerLink: "Find the right system",
    quoteBase: "/en/start-project",
    systemBase: "/en/systems",
    projectBase: "/en/projects",
  },
} as const;

export function ServicesPreviewSection({ locale = "tr" }: { locale?: Locale }) {
  const copy = COPY[locale];
  const pool = locale === "en" ? solutionsEn : solutions;
  const lookupSystem = locale === "en" ? getSystemEn : getSystem;
  const lookupProject = locale === "en" ? getProjectEn : getProject;
  const fitPool = locale === "en" ? fitSystemsEn : fitSystems;

  // systemSlug -> wizard fit id, so each card can prefill the wizard instead of
  // dumping the visitor on an empty /teklif-al
  const fitIdBySystemSlug = new Map(
    fitPool
      .filter((f) => f.systemSlug)
      .map((f) => [f.systemSlug as string, f.id]),
  );

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

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {pool.map((solution, index) => {
            const fitId = fitIdBySystemSlug.get(solution.systemSlug);
            const Icon = (fitId && ICONS[fitId]) || ShoppingCart;
            const flagship = Boolean(fitId && FLAGSHIP_FITS.has(fitId));

            const system = lookupSystem(solution.systemSlug);
            const whoNeeds = system?.whoNeeds[0];

            // honest proof only, chosen from this solution's own related list
            const preferred = fitId ? PREFERRED_PROOF[fitId] : undefined;
            const proofSlug =
              preferred && solution.relatedSlugs.includes(preferred)
                ? preferred
                : solution.relatedSlugs[0];
            const proof = proofSlug ? lookupProject(proofSlug) : undefined;

            const ctaHref = fitId
              ? `${copy.quoteBase}?tur=${fitId}`
              : copy.quoteBase;

            return (
              // min-w-0: a grid item defaults to min-width:auto and sizes to its
              // content, so the proof chip's project name was widening the whole
              // column past a 360px screen instead of ellipsizing inside it
              <Reveal
                key={solution.id}
                delay={Math.min(index * 0.05, 0.2)}
                className="h-full min-w-0"
              >
                <SpotlightCard
                  className={cn(
                    "relative flex h-full flex-col rounded-xl border bg-card/70 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_56px_-24px_rgba(0,0,0,0.85)] md:p-6",
                    flagship
                      ? "border-accent/30 ring-1 ring-accent/15 hover:border-accent/45"
                      : "border-border ring-1 ring-white/5 hover:border-foreground/25",
                  )}
                >
                  {flagship && (
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 rounded-xl bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(139,140,248,0.07),transparent)]"
                    />
                  )}

                  {/* icon sits inline with the title: a separate icon row cost
                      ~50px per card on mobile and made the section taller */}
                  <div className="relative flex items-start gap-3">
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-lg border",
                        flagship
                          ? "border-accent/40 bg-accent/10"
                          : "border-border bg-background/50",
                      )}
                    >
                      <Icon
                        aria-hidden
                        className={cn(
                          "size-4",
                          flagship ? "text-accent" : "text-muted-foreground",
                        )}
                      />
                    </span>
                    <h3 className="min-w-0 flex-1 text-lg font-semibold tracking-tight text-balance">
                      {solution.title}
                    </h3>
                    <span
                      aria-hidden
                      className="shrink-0 font-mono text-xs text-muted-foreground/40"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <p className="relative mt-3 text-sm leading-relaxed text-muted-foreground">
                    {solution.problem}
                  </p>

                  {/* mobile shows the single strongest build line; desktop both */}
                  <ul className="relative mt-3 space-y-1.5 border-t border-border/60 pt-3">
                    {solution.builds.slice(0, 2).map((item, i) => (
                      <li
                        key={item}
                        className={cn(
                          "gap-2.5 text-xs leading-relaxed text-foreground/85",
                          i === 0 ? "flex" : "hidden sm:flex",
                        )}
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
                    <p className="relative mt-3 hidden gap-2.5 text-xs leading-relaxed text-muted-foreground sm:flex">
                      <span className="shrink-0 font-mono tracking-widest text-muted-foreground/60 uppercase">
                        {copy.who}
                      </span>
                      {whoNeeds}
                    </p>
                  )}

                  <div className="relative mt-auto pt-3">
                    {/* flex + min-w-0 (not inline-flex): an inline-flex chip
                        reports the full project name as its min-content and
                        forces the whole grid column wider than a 360px screen */}
                    {proof && (
                      <Link
                        href={`${copy.projectBase}/${proof.slug}`}
                        className="group/proof flex w-full min-w-0 items-center gap-2 rounded-lg border border-border bg-background/50 px-2.5 py-1.5 text-xs transition-colors hover:border-accent/40 hover:bg-card"
                      >
                        <span
                          aria-hidden
                          className="size-1.5 shrink-0 rounded-full bg-accent/80"
                        />
                        <span className="shrink-0 font-mono tracking-widest text-muted-foreground/70 uppercase">
                          {copy.proofLabel}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-foreground/85">
                          {proof.name}
                        </span>
                        <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground transition-colors group-hover/proof:text-foreground" />
                      </Link>
                    )}

                    {/* primary = prefilled inquiry. Deliberately NOT
                        buttonVariants: its whitespace-nowrap would push a
                        360px viewport wider (Phase 17 lesson). */}
                    <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2">
                      <Link
                        href={ctaHref}
                        className="group/cta inline-flex items-center justify-center gap-1.5 rounded-lg border border-accent/40 bg-accent/10 px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-accent/60 hover:bg-accent/15"
                      >
                        {copy.primary}
                        <ArrowRight className="size-3.5 shrink-0 text-accent transition-transform group-hover/cta:translate-x-0.5" />
                      </Link>
                      <Link
                        href={`${copy.systemBase}/${solution.systemSlug}`}
                        className="group/sys inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {copy.systemDetail}
                        <ArrowUpRight className="size-3.5 shrink-0 transition-transform group-hover/sys:-translate-y-0.5 group-hover/sys:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </SpotlightCard>
              </Reveal>
            );
          })}
        </div>

        {/* catalogue footer: the undecided path back into the wizard */}
        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <p className="text-sm text-muted-foreground">
              {copy.footerQuestion}{" "}
              <Link
                href={copy.quoteBase}
                className="text-foreground/85 underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                {copy.footerLink}
              </Link>
            </p>
            <Link
              href={copy.allHref}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground md:hidden"
            >
              {copy.all}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
