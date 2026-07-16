"use client";

import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { siteEn } from "@/content/en/site";
import { usePublishedProjects } from "@/components/projects/project-index";
import { site } from "@/content/site";
import { type Locale } from "@/lib/locale";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Kahraman bölümünün dil sözlüğü — TR varsayılan, EN /en sayfalarından gelir.
 *
 * Phase 41A: the hero is the FIRST section again and carries the page's single
 * h1. A visitor must learn what Menensoft builds, who for, and what to do — in
 * the first screen, before the problem showcase below. So the copy is a direct
 * offer, not the Phase 19B "brand reinforcement" band that assumed the showcase
 * had already spoken.
 *
 * `headline`/`sub` are LOCAL to the hero. site.headline and site.subheadline are
 * left untouched — site.subheadline still feeds the page's metadata/OG/JSON-LD
 * description, and changing the visible hero must not drift the SEO description.
 *
 * Service chips link to the Phase 40 landing pages (contextual, not footer spam).
 * The credibility strip is honest: five real projects, nothing invented.
 */
const HERO_COPY = {
  tr: {
    site,
    eyebrow: "Menensoft — işletmeler için yazılım sistemleri",
    headline: "İşletmeniz için çalışan yazılım sistemleri kuruyoruz",
    sub: "Web tabanlı admin panelleri, masaüstü uygulamalar, entegrasyonlar, otomasyonlar ve özel iş akışı sistemleri. Tanıtım sayfasından öte; veri girilen, panelden yönetilen ve işi gerçekten taşıyan çözümler.",
    chips: [
      { label: "Web & admin panelleri", href: "/admin-panelli-web-sitesi" },
      { label: "Masaüstü & özel yazılım", href: "/ozel-yazilim-gelistirme" },
      { label: "Entegrasyon & otomasyon", href: "/sistemler/is-akisi-otomasyonu" },
      { label: "E-ticaret / QR / randevu", href: "/cozumler" },
    ],
    primaryCta: "Projemi anlatalım",
    primaryHref: "/teklif-al",
    secondaryCta: "Sistemleri incele",
    secondaryHref: "/cozumler",
    credibility: [
      "5 gerçek proje",
      "uçtan uca geliştirme",
      "devredilebilir kod",
    ],
    cardTitle: "~/projeler — sistem durumu",
    cardFooter: (n: number) =>
      `${n} sistem — uçtan uca tasarlandı ve geliştirildi`,
    lower: (s: string) => s.toLocaleLowerCase("tr-TR"),
  },
  en: {
    site: siteEn,
    eyebrow: "Menensoft — software systems for business",
    headline: "We build working software systems for your business",
    sub: "Web admin panels, desktop applications, integrations, automations and custom workflow systems. More than a brochure site — tools that take data in, are managed from a panel, and genuinely carry the work.",
    chips: [
      { label: "Web & admin panels", href: "/en/website-with-admin-panel" },
      { label: "Desktop & custom software", href: "/en/custom-software-development" },
      { label: "Integrations & automation", href: "/en/systems/workflow-automation" },
      { label: "E-commerce / QR / booking", href: "/en/solutions" },
    ],
    primaryCta: "Tell me about your project",
    primaryHref: "/en/start-project",
    secondaryCta: "Explore systems",
    secondaryHref: "/en/solutions",
    credibility: ["5 real projects", "end-to-end development", "handover-ready code"],
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
  // 38C: the status card lists the real published inventory, so archiving a
  // project removes it from the hero instead of leaving a ghost row.
  const projects = usePublishedProjects();
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
          {projects.map((project) => (
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
          {copy.cardFooter(projects.length)}
        </p>
      </div>
    </div>
  );
}

export function HeroSection({ locale = "tr" }: { locale?: Locale }) {
  const copy = HERO_COPY[locale];

  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(139,140,248,0.10),transparent)]" />
      </div>
      {/* Phase 41A: the hero is the first section again, so it carries the h1 and
          states the offer directly. The right-column status card is lg-only and
          adds no mobile height; the left column stays tight so the H1, sub,
          chips and both CTAs fit the first screen on a phone. */}
      <Container className="relative grid gap-12 pt-14 pb-16 md:pt-20 md:pb-20 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-center">
        <div>
          <Entrance delay={0}>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
              <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                <span aria-hidden className="h-px w-6 bg-accent/60" />
                {copy.eyebrow}
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
            {/* h1: the hero is the first section again and owns the page's single
                h1. The opening showcase below was demoted to h2. */}
            <h1 className="mt-6 max-w-3xl text-3xl font-semibold tracking-tight text-balance md:text-5xl md:leading-[1.08] lg:text-6xl lg:leading-[1.06]">
              {copy.headline}
              <span className="text-accent [text-shadow:0_0_24px_rgba(139,140,248,0.5)]">
                .
              </span>
            </h1>
          </Entrance>
          <Entrance delay={0.12}>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground md:text-lg">
              {copy.sub}
            </p>
          </Entrance>
          <Entrance delay={0.16}>
            {/* Service chips → Phase 40 landing pages. Contextual, not footer
                spam, and they tell the visitor concretely what gets built. */}
            <ul className="mt-6 flex flex-wrap gap-2">
              {copy.chips.map((chip) => (
                <li key={chip.href}>
                  <Link
                    href={chip.href}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/70 px-3.5 py-1.5 text-sm text-foreground/90 backdrop-blur transition-colors hover:border-accent/50 hover:text-foreground"
                  >
                    {chip.label}
                    <ArrowRight className="size-3.5 text-accent/70" />
                  </Link>
                </li>
              ))}
            </ul>
          </Entrance>
          <Entrance delay={0.22}>
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
          </Entrance>
          <Entrance delay={0.28}>
            {/* Honest credibility strip — five real projects, nothing invented. */}
            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
              {copy.credibility.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 font-mono text-xs text-muted-foreground"
                >
                  <span aria-hidden className="size-1.5 rounded-full bg-accent/70" />
                  {item}
                </li>
              ))}
            </ul>
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
