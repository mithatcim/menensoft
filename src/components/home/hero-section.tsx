"use client";

import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { projectsEn } from "@/content/en/projects";
import { siteEn } from "@/content/en/site";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { type Locale } from "@/lib/locale";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Kahraman bölümünün dil sözlüğü — TR varsayılan, EN /en sayfalarından gelir.
 *
 * Phase 19B: the hero now follows the opening sales showcase, so it stops
 * acting as a second first-impression and becomes a brand reinforcement band.
 * `bridge` ties it back to the showcase above, and `intro` replaces the
 * displayed site.subheadline — which listed the same six system types the
 * showcase had just walked through. site.subheadline itself is untouched: it
 * still carries the page metadata description.
 */
const HERO_COPY = {
  tr: {
    site,
    projects,
    bridge: "Bu sistemleri kuran marka",
    intro:
      "Vitrin, panel, veri modeli ve teslim tek elden ilerler. Menensoft'un arkasında, her katmanı uçtan uca tasarlayıp geliştiren kurucu geliştirici var: Mithat Yılmaz.",
    primaryCta: "Proje görüşmesi başlat",
    primaryHref: "/teklif-al",
    secondaryCta: "Projeleri incele",
    secondaryHref: "/projeler",
    undecided: "Hangi sistemi seçeceğinizden emin değil misiniz?",
    undecidedLink: "İki soruluk kısa akış size gösterir",
    // "Teknoloji", not "Teknoloji yığını": "yığın" is a literal calque of
    // "stack" and reads translated. Also matches the project case-study hero.
    stackLabel: "Teknoloji",
    cardTitle: "~/projeler — sistem durumu",
    cardFooter: (n: number) =>
      `${n} sistem — uçtan uca tasarlandı ve geliştirildi`,
    lower: (s: string) => s.toLocaleLowerCase("tr-TR"),
  },
  en: {
    site: siteEn,
    projects: projectsEn,
    bridge: "The brand behind these systems",
    intro:
      "Storefront, panel, data model and handoff move as one. Behind Menensoft is a founder-developer who designs and builds every layer end to end: Mithat Yılmaz.",
    primaryCta: "Start a project conversation",
    primaryHref: "/en/start-project",
    secondaryCta: "View projects",
    secondaryHref: "/en/projects",
    undecided: "Not sure which system you need?",
    undecidedLink: "A two-question flow will show you",
    stackLabel: "Core stack",
    cardTitle: "~/projects — system status",
    cardFooter: (n: number) => `${n} systems — designed and built end to end`,
    lower: (s: string) => s.toLowerCase(),
  },
} as const;

function Entrance({
  delay,
  className,
  children,
}: {
  delay: number;
  className?: string;
  children: React.ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

/** Concentric orbit rings with slowly circling nodes — a system/cockpit motif. */
function OrbitField() {
  const reduceMotion = useReducedMotion();
  const spin = (duration: number, reverse = false) =>
    reduceMotion
      ? undefined
      : {
          animate: { rotate: reverse ? -360 : 360 },
          transition: { duration, repeat: Infinity, ease: "linear" as const },
        };

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
    >
      <div className="absolute size-[340px] rounded-full border border-border/40" />
      <div className="absolute size-[470px] rounded-full border border-border/25" />
      <div className="absolute size-[600px] rounded-full border border-border/15" />
      <motion.div className="absolute size-[470px]" {...spin(44)}>
        <span className="absolute top-0 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_14px_3px_rgba(139,140,248,0.45)]" />
      </motion.div>
      <motion.div className="absolute size-[340px]" {...spin(32, true)}>
        <span className="absolute top-0 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-bright/70" />
      </motion.div>
    </div>
  );
}

function BuildStatusCard({ locale }: { locale: Locale }) {
  const copy = HERO_COPY[locale];
  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute inset-0 translate-x-3 translate-y-3 rounded-xl border border-border/50 bg-card/40"
      />
      <div className="relative overflow-hidden rounded-xl border border-border bg-card/90 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)] ring-1 ring-white/5 backdrop-blur-sm">
        <div
          aria-hidden
          className="animate-scan absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-accent/8 to-transparent"
        />
        <div className="relative flex items-center gap-3 border-b border-border bg-background/40 px-4 py-3">
          <span aria-hidden className="flex gap-1.5">
            <span className="size-2.5 rounded-full border border-border bg-muted/60" />
            <span className="size-2.5 rounded-full border border-border bg-muted/60" />
            <span className="size-2.5 rounded-full border border-border bg-muted/60" />
          </span>
          <p className="flex-1 truncate font-mono text-xs text-muted-foreground">
            {copy.cardTitle}
          </p>
          <span
            aria-hidden
            className="size-1.5 rounded-full bg-accent shadow-[0_0_8px_1px_rgba(139,140,248,0.6)]"
          />
        </div>
        {/* slug and status each get their own line: side by side, a 23-char slug
            and a 43-char status label cannot share one monospace row at this
            width, and the shared row silently truncated the slug away entirely
            (log-management-platform and cendovar rendered at 0px on /en). The
            card is lg-only and the grid is items-center against a taller left
            column, so the extra line costs no section height. */}
        <ul className="relative divide-y divide-border/60">
          {copy.projects.map((project) => (
            <li
              key={project.slug}
              className="flex flex-col gap-1 px-4 py-2.5 font-mono text-xs"
            >
              <span className="truncate text-foreground/80">
                {project.slug}
              </span>
              <span className="flex min-w-0 items-center gap-2 text-muted-foreground">
                <span
                  aria-hidden
                  className="size-1 shrink-0 rounded-full bg-accent/80"
                />
                <span className="min-w-0 flex-1 truncate">
                  {copy.lower(project.statusLabel)}
                </span>
              </span>
            </li>
          ))}
        </ul>
        <p className="relative border-t border-border px-4 py-3 font-mono text-xs text-muted-foreground">
          {copy.cardFooter(copy.projects.length)}
        </p>
      </div>
    </div>
  );
}

export function HeroSection({ locale = "tr" }: { locale?: Locale }) {
  const copy = HERO_COPY[locale];
  const headline = copy.site.headline.replace(/\.$/, "");

  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(139,140,248,0.10),transparent)]" />
      </div>
      {/* Compacted for slot 2 (Phase 19B): the showcase above carries the first
          impression, so this band reinforces the brand instead of competing for
          it. Every structural element is kept — pill, headline, both CTAs, the
          undecided path, the stack line, the status card — only the scale and
          rhythm come down. */}
      <Container className="relative grid gap-12 pt-14 pb-16 md:pt-16 md:pb-20 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-center">
        <div>
          <Entrance delay={0}>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
              {/* copy bridge from the showcase: names what this band is for, so
                  the hero reads as a continuation rather than a restart */}
              <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                <span aria-hidden className="h-px w-6 bg-accent/60" />
                {copy.bridge}
              </p>
              <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 font-mono text-xs text-muted-foreground backdrop-blur">
                <span
                  aria-hidden
                  className="size-1.5 rounded-full bg-accent shadow-[0_0_8px_1px_rgba(139,140,248,0.6)]"
                />
                {copy.site.availability}
              </p>
            </div>
          </Entrance>
          <Entrance delay={0.06}>
            {/* h2, not h1: the opening sales showcase now carries the page's
                single h1. Its type scale stays below the showcase h1 so the
                page's largest heading is also its first one. */}
            <h2 className="mt-6 max-w-3xl text-3xl font-semibold tracking-tight text-balance md:text-4xl lg:text-5xl lg:leading-[1.05]">
              {headline}
              <span className="text-accent [text-shadow:0_0_24px_rgba(139,140,248,0.5)]">
                .
              </span>
            </h2>
          </Entrance>
          <Entrance delay={0.12}>
            {/* supports the showcase (who builds it, how) instead of repeating
                its list of system types */}
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground md:text-lg">
              {copy.intro}
            </p>
          </Entrance>
          <Entrance delay={0.18}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={copy.primaryHref}
                className={cn(buttonVariants({ variant: "cta" }), "h-11 px-6")}
              >
                {copy.primaryCta}
                <ArrowRight className="size-4 transition-transform group-hover/button:translate-x-0.5" />
              </Link>
              <Link
                href={copy.secondaryHref}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-11 px-6 backdrop-blur",
                )}
              >
                {copy.secondaryCta}
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              {copy.undecided}{" "}
              <Link
                href={copy.primaryHref}
                className="text-foreground/85 underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                {copy.undecidedLink}
              </Link>
              .
            </p>
          </Entrance>
          <Entrance delay={0.24}>
            <p className="mt-10 font-mono text-xs text-muted-foreground">
              <span className="tracking-widest uppercase">{copy.stackLabel}</span>
              <span aria-hidden className="mx-2">
                —
              </span>
              {site.coreStack.join(" · ")}
            </p>
          </Entrance>
        </div>
        <div className="relative hidden lg:block">
          <OrbitField />
          <Entrance delay={0.3}>
            <BuildStatusCard locale={locale} />
          </Entrance>
        </div>
      </Container>
    </section>
  );
}
