"use client";

import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useRef } from "react";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/shared/reveal";
import { fitSystemsEn } from "@/content/en/fit";
import { getProjectEn } from "@/content/en/projects";
import { fitSystems } from "@/content/fit";
import { getProject } from "@/content/projects";
import { type Locale } from "@/lib/locale";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Opening Sales Showcase — the homepage's first section (Phase 19).
 *
 * Each card is one real buyer problem → what Menensoft builds for it → the
 * system type → the real project it already runs in → a prefilled inquiry CTA.
 * A horizontally browsable snap rail: native CSS scroll-snap (no carousel
 * library, no hidden-content carousel), with arrow controls on desktop and
 * plain swipe on touch. Every card stays a normal focusable article, so the
 * rail is keyboard-reachable by tabbing through its links.
 *
 * All content is derived from existing truth: the system label and slug come
 * from the wizard's fit options, proof comes from real projects, and the CTA
 * prefills the wizard with the ids `?tur=` actually recognizes. Nothing here
 * is invented — no metrics, no clients, no fake dashboards.
 */

interface ShowcaseItem {
  /** A real wizard fit id — drives the system label, slug and ?tur= prefill. */
  fitId: string;
  problem: string;
  solution: string;
  /** Real project that proves this system type; honest links only. */
  projectSlug: string;
}

interface ShowcaseCopy {
  eyebrow: string;
  title: string;
  sub: string;
  railLabel: string;
  prev: string;
  next: string;
  problemLabel: string;
  solutionLabel: string;
  proofLabel: string;
  primary: string;
  systemLink: string;
  scrollHint: string;
  quoteBase: string;
  projectBase: string;
  systemBase: string;
  items: ShowcaseItem[];
}

const COPY: Record<Locale, ShowcaseCopy> = {
  tr: {
    eyebrow: "Sizi ne yavaşlatıyor?",
    title: "İşinizi yavaşlatan akışı, çalışan bir sisteme çevirelim.",
    sub: "Aşağıdaki altı problemden birini tanıyorsanız: neyin kurulduğunu, hangi projede çalıştığını ve nereden başlayacağınızı görün.",
    railLabel: "İşletme problemleri ve çözümleri",
    prev: "Önceki",
    next: "Sonraki",
    problemLabel: "Problem",
    solutionLabel: "Menensoft ne kurar",
    proofLabel: "Kanıt",
    primary: "Benzer sistemi konuşalım",
    systemLink: "Sistem detayını incele",
    scrollHint: "Kaydırarak inceleyin",
    quoteBase: "/teklif-al",
    projectBase: "/projeler",
    systemBase: "/sistemler",
    items: [
      {
        fitId: "operasyon",
        problem:
          "Siparişler WhatsApp, telefon ve Excel arasında dağılıyor; yoğun saatte iş kayboluyor.",
        solution:
          "Akış tek bir operasyon sistemine toplanır: sipariş kaynağında bir kez alınır, mutfak, kasa ve saha kendi ekranında aynı durumu görür.",
        projectSlug: "restaurant-qr-system",
      },
      {
        fitId: "kurumsal-site",
        problem:
          "Kurumsal siteniz var ama yönetim paneliniz yok; her içerik değişikliği geliştiriciye takılıyor.",
        solution:
          "Site, panelle birlikte kurulur: içerik ve gelen talepler geliştirici beklemeden yönetilir.",
        projectSlug: "orva-psychology",
      },
      {
        fitId: "e-ticaret",
        problem:
          "E-ticaret yönetimi çalışıyor ama ölçeklenmiyor; hazır paketin sınırına takıldınız.",
        solution:
          "Vitrin ve yönetim katmanı tek altyapıda toplanır; ürünler ve sayfalar kod yazmadan yönetilir.",
        projectSlug: "ecommerce-cms",
      },
      {
        fitId: "dashboard",
        problem:
          "Raporlama dağınık; işin durumunu öğrenmek için telefon açmak gerekiyor.",
        solution:
          "Kayıtlar aranabilir, incelenebilir ekranlara taşınır; işin anlık durumu tek bakışta görünür.",
        projectSlug: "log-management-platform",
      },
      {
        fitId: "otomasyon",
        problem:
          "Tekrarlanan işler ekibin zamanını yiyor; süreç kişiye bağımlı ilerliyor.",
        solution:
          "Manuel akış kurala bağlanır: girdi bir kez yakalanır, gerisi sistemde kendi başına ilerler.",
        projectSlug: "cendovar",
      },
      {
        fitId: "yonetim-paneli",
        problem:
          "Veri tablolarda ve mesajlarda yaşıyor; kimin neyi değiştirdiği belli değil.",
        solution:
          "Veri, rol bazlı yetkili ekranlara taşınır: yetki, doğrulama ve izlenebilirlik birlikte gelir.",
        projectSlug: "ecommerce-cms",
      },
    ],
  },
  en: {
    eyebrow: "What's slowing you down?",
    title: "Turn the flow that slows your business into a working system.",
    sub: "Recognize one of these six problems? See what gets built, the project it already runs in, and where to start.",
    railLabel: "Business problems and their systems",
    prev: "Previous",
    next: "Next",
    problemLabel: "Problem",
    solutionLabel: "What Menensoft builds",
    proofLabel: "Proof",
    primary: "Discuss a similar system",
    systemLink: "View system detail",
    scrollHint: "Scroll to browse",
    quoteBase: "/en/start-project",
    projectBase: "/en/projects",
    systemBase: "/en/systems",
    items: [
      {
        fitId: "operasyon",
        problem:
          "Orders are scattered across WhatsApp, phone calls and spreadsheets; work gets lost at rush hour.",
        solution:
          "The flow is gathered into one operations system: the order is captured once at the source, and kitchen, till and floor each see the same status on their own screen.",
        projectSlug: "restaurant-qr-system",
      },
      {
        fitId: "kurumsal-site",
        problem:
          "You have a corporate site but no admin panel; every content change waits on a developer.",
        solution:
          "The site ships with its panel: content and incoming inquiries are managed without waiting on anyone.",
        projectSlug: "orva-psychology",
      },
      {
        fitId: "e-ticaret",
        problem:
          "E-commerce works but doesn't scale; you've hit the ceiling of a ready-made package.",
        solution:
          "Storefront and management layer are gathered into one infrastructure; products and pages are managed without touching code.",
        projectSlug: "ecommerce-cms",
      },
      {
        fitId: "dashboard",
        problem:
          "Reporting is scattered; finding out where the work stands means phoning someone.",
        solution:
          "Records move into searchable, reviewable screens; the state of the work becomes visible at a glance.",
        projectSlug: "log-management-platform",
      },
      {
        fitId: "otomasyon",
        problem:
          "Repetitive work eats the team's hours; the process depends on one person.",
        solution:
          "The manual flow is put on rules: input is captured once, and the rest moves through the system on its own.",
        projectSlug: "cendovar",
      },
      {
        fitId: "yonetim-paneli",
        problem:
          "Data lives in spreadsheets and chat threads; nobody knows who changed what.",
        solution:
          "Data moves into role-based, authorized screens: permissions, validation and traceability come together.",
        projectSlug: "ecommerce-cms",
      },
    ],
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: 0.08 + i * 0.07, ease: EASE_OUT },
  }),
};

export function OpeningShowcase({ locale = "tr" }: { locale?: Locale }) {
  const copy = COPY[locale];
  const reduceMotion = useReducedMotion() ?? false;
  const railRef = useRef<HTMLDivElement>(null);

  const fitPool = locale === "en" ? fitSystemsEn : fitSystems;
  const lookupProject = locale === "en" ? getProjectEn : getProject;

  const nudge = (direction: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector("article");
    const step = card ? card.getBoundingClientRect().width + 16 : 320;
    rail.scrollBy({
      left: direction * step,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <section className="relative overflow-hidden border-b border-border/60 pt-14 pb-12 md:pt-20 md:pb-16">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="bg-grid mask-radial-faded absolute inset-0 opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_0%,rgba(139,140,248,0.10),transparent)]" />
      </div>

      <Container className="relative">
        <Reveal>
          <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
            <span
              aria-hidden
              className="size-1.5 rounded-full bg-accent shadow-[0_0_8px_1px_rgba(139,140,248,0.6)]"
            />
            {copy.eyebrow}
          </p>
          {/* the page's largest heading, so the first section also reads as the
              loudest one (the hero below deliberately steps down a size) */}
          <h1 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-balance md:text-5xl md:leading-[1.08] lg:text-6xl lg:leading-[1.06]">
            {copy.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground md:text-lg">
            {copy.sub}
          </p>
        </Reveal>

        {/* rail controls: desktop arrows; touch just swipes */}
        <Reveal delay={0.06}>
          <div className="mt-8 flex items-center justify-between gap-4">
            <p className="font-mono text-xs tracking-widest text-muted-foreground/60 uppercase">
              {copy.scrollHint}
            </p>
            <div className="hidden items-center gap-2 md:flex">
              <button
                type="button"
                onClick={() => nudge(-1)}
                aria-label={copy.prev}
                className="flex size-9 items-center justify-center rounded-lg border border-border bg-card/60 text-muted-foreground transition-colors outline-none hover:border-foreground/25 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <ArrowLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => nudge(1)}
                aria-label={copy.next}
                className="flex size-9 items-center justify-center rounded-lg border border-border bg-card/60 text-muted-foreground transition-colors outline-none hover:border-foreground/25 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </Reveal>
      </Container>

      {/* the rail itself — native scroll-snap, nothing hidden behind a widget */}
      <Container className="relative mt-4">
        <div
          ref={railRef}
          role="group"
          aria-label={copy.railLabel}
          className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4"
        >
          {copy.items.map((item, index) => {
            const fit = fitPool.find((f) => f.id === item.fitId);
            const proof = lookupProject(item.projectSlug);
            const systemHref = fit?.systemSlug
              ? `${copy.systemBase}/${fit.systemSlug}`
              : undefined;
            const featured = index === 0;

            return (
              <motion.article
                key={`${item.fitId}-${index}`}
                custom={index}
                variants={cardVariants}
                initial={reduceMotion ? false : "hidden"}
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                className={cn(
                  "relative flex w-[280px] min-w-0 shrink-0 snap-start flex-col rounded-xl border bg-card/70 p-5 ring-1 backdrop-blur-sm transition-colors duration-300 sm:w-[330px]",
                  featured
                    ? "border-accent/35 ring-accent/15"
                    : "border-border ring-white/5 hover:border-foreground/25",
                )}
              >
                {featured && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-xl bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(139,140,248,0.08),transparent)]"
                  />
                )}

                <div className="relative flex items-center justify-between gap-3">
                  <span className="truncate rounded-md border border-accent/30 bg-accent/5 px-2 py-1 font-mono text-xs text-accent">
                    {fit?.label}
                  </span>
                  <span
                    aria-hidden
                    className="shrink-0 font-mono text-xs text-muted-foreground/40"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <p className="relative mt-4 flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground/70 uppercase">
                  <span
                    aria-hidden
                    className="size-1.5 rotate-45 border border-muted-foreground/50"
                  />
                  {copy.problemLabel}
                </p>
                <h2 className="relative mt-2 text-base leading-snug font-semibold tracking-tight text-balance">
                  {item.problem}
                </h2>

                <p className="relative mt-4 flex items-center gap-2 border-t border-border/60 pt-4 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                  <span aria-hidden className="size-1.5 bg-accent/90" />
                  {copy.solutionLabel}
                </p>
                <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.solution}
                </p>

                <div className="relative mt-auto pt-4">
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

                  <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <Link
                      href={`${copy.quoteBase}?tur=${item.fitId}`}
                      className="group/cta inline-flex items-center justify-center gap-1.5 rounded-lg border border-accent/40 bg-accent/10 px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-accent/60 hover:bg-accent/15"
                    >
                      {copy.primary}
                      <ArrowRight className="size-3.5 shrink-0 text-accent transition-transform group-hover/cta:translate-x-0.5" />
                    </Link>
                    {systemHref && (
                      <Link
                        href={systemHref}
                        className="group/sys inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {copy.systemLink}
                        <ArrowUpRight className="size-3.5 shrink-0 transition-transform group-hover/sys:-translate-y-0.5 group-hover/sys:translate-x-0.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
