"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/shared/reveal";
import { buttonVariants } from "@/components/ui/button";
import { type Locale } from "@/lib/locale";
import { DECOR_PULSES, EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Build explainer — the passive counterpart to the opening kinetic stage
 * (Phase 20).
 *
 * This section used to be an interactive gateway with its own six-intent
 * selector. Once the opening stage became a six-problem kinetic stage over
 * the *same six wizard fit ids*, the two were the same interaction one screen
 * apart, and the smaller one read as a weaker echo of the larger.
 *
 * So the selector is gone. The stage above now owns "recognize your problem →
 * see the system that solves it, and start a conversation". This band owns the
 * one question the stage does not answer: what actually gets built, in what
 * order, when you say yes. It is deliberately passive — no controls, nothing
 * to choose, nothing competing with the stage.
 *
 * The four layers are the real shape of the work (they match the process page).
 * No invented metrics, no telemetry, no fake dashboards.
 */

interface BuildLayer {
  /** Short node label — also used in the flow rail. */
  node: string;
  title: string;
  body: string;
}

interface ExplainerCopy {
  eyebrow: string;
  title: string;
  sub: string;
  panelTitle: string;
  panelHint: string;
  primary: string;
  primaryHref: string;
  secondary: string;
  secondaryHref: string;
  layers: BuildLayer[];
}

const EXPLAINER: Record<Locale, ExplainerCopy> = {
  tr: {
    eyebrow: "Sistemin içi",
    title: "Peki bu sistem içeride nasıl kuruluyor?",
    sub: "Yukarıdaki problemlerden hangisini seçerseniz seçin, kurulan sistem aynı dört katmandan geçer. Görünen sayfa en sonda gelir.",
    panelTitle: "build://sistem",
    panelHint:
      "Sadece görünen sayfa değil; arkasındaki yönetilebilir yapı kurulur.",
    primary: "Proje görüşmesi başlat",
    primaryHref: "/teklif-al",
    secondary: "Süreci incele",
    secondaryHref: "/surec",
    layers: [
      {
        node: "Talep",
        title: "Girdi kaynağında yakalanır",
        body: "Sipariş, randevu ya da başvuru; nereden gelirse gelsin sistemde bir kez kaydedilir. Elle taşıma burada biter.",
      },
      {
        node: "Veri",
        title: "Yapı ve ilişkiler kurulur",
        body: "Yakalanan her şey, ilişkileri tanımlı bir veri modeline oturur: neyin neye bağlı olduğu baştan bellidir.",
      },
      {
        node: "Arayüz + Panel",
        title: "Her rol kendi ekranını görür",
        body: "Ekipler işlerini kendi ekranından yürütür; yönetim paneli veriyi kod yazmadan yönetir.",
      },
      {
        node: "Teslim",
        title: "Çalışır sistem devredilir",
        body: "Sistem çalışır halde, dokümantasyonla ve temiz bir devirle teslim edilir. Kara kutu bırakılmaz.",
      },
    ],
  },
  en: {
    eyebrow: "Inside the system",
    title: "So how does a system actually get built?",
    sub: "Whichever problem above is yours, the system that solves it passes through the same four layers. The visible page comes last.",
    panelTitle: "build://system",
    panelHint:
      "Not just the visible page — the manageable structure behind it.",
    primary: "Start a project conversation",
    primaryHref: "/en/start-project",
    secondary: "See the process",
    secondaryHref: "/en/process",
    layers: [
      {
        node: "Request",
        title: "Input is captured at the source",
        body: "An order, booking or application is recorded once, wherever it arrives from. Moving work by hand ends here.",
      },
      {
        node: "Data",
        title: "Structure and relationships are set",
        body: "Captured data lands in a model with defined relationships: what belongs to what is settled up front.",
      },
      {
        node: "Interface + panel",
        title: "Each role gets its own screen",
        body: "Teams do their work on their own screen; the admin panel manages the data without touching code.",
      },
      {
        node: "Handoff",
        title: "A working system is handed over",
        body: "The system ships working, with documentation and a clean handoff. No black box left behind.",
      },
    ],
  },
};

const layerVariants = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.1 + i * 0.12, ease: EASE_OUT },
  }),
};

export function VisualGateway({ locale = "tr" }: { locale?: Locale }) {
  const copy = EXPLAINER[locale];
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <section className="relative overflow-hidden border-b border-border/60 py-10 md:py-16">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="bg-grid mask-radial-faded absolute inset-0 opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_0%,rgba(139,140,248,0.06),transparent)]" />
      </div>

      <Container className="relative">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:items-start lg:gap-12">
          {/* left: the question this band answers */}
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                <span aria-hidden className="size-1.5 bg-accent/90" />
                {copy.eyebrow}
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-balance md:text-3xl">
                {copy.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {copy.sub}
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 md:mt-7">
                <Link
                  href={copy.primaryHref}
                  className={cn(buttonVariants({ variant: "cta" }), "h-11 px-5")}
                >
                  {copy.primary}
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href={copy.secondaryHref}
                  className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {copy.secondary}
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </Reveal>
          </div>

          {/* right: the console — now a static read, not a selector */}
          <Reveal delay={0.1}>
            <div className="relative overflow-hidden rounded-xl border border-border bg-card/60 ring-1 ring-white/5 backdrop-blur-sm">
              <div aria-hidden className="scanlines absolute inset-0 opacity-30" />
              <span
                aria-hidden
                className="absolute top-3 left-3 size-4 border-t border-l border-accent/40"
              />
              <span
                aria-hidden
                className="absolute top-3 right-3 size-4 border-t border-r border-accent/40"
              />
              <span
                aria-hidden
                className="absolute bottom-3 left-3 size-4 border-b border-l border-accent/40"
              />
              <span
                aria-hidden
                className="absolute right-3 bottom-3 size-4 border-r border-b border-accent/40"
              />

              <div className="relative flex items-center gap-3 border-b border-border bg-background/40 px-4 py-2.5">
                <span aria-hidden className="flex gap-1.5">
                  <span className="size-2.5 rounded-full border border-border bg-muted/60" />
                  <span className="size-2.5 rounded-full border border-border bg-muted/60" />
                  <span className="size-2.5 rounded-full border border-border bg-muted/60" />
                </span>
                <p className="min-w-0 flex-1 truncate text-center font-mono text-xs text-muted-foreground">
                  {copy.panelTitle}
                </p>
                <span
                  aria-hidden
                  className="size-1.5 rounded-full bg-accent shadow-[0_0_8px_1px_rgba(139,140,248,0.6)]"
                />
              </div>

              {/* the four layers, read top to bottom, wired together.
                  Tightened on mobile: four stacked layers with body copy are
                  inherently tall, and the desktop rhythm pushed this section
                  past 1.3 screens on a phone. */}
              <ol className="relative p-4 md:p-6">
                {copy.layers.map((layer, i) => {
                  const last = i === copy.layers.length - 1;
                  return (
                    <motion.li
                      key={layer.node}
                      custom={i}
                      variants={layerVariants}
                      initial={reduceMotion ? false : "hidden"}
                      whileInView="show"
                      viewport={{ once: true, margin: "-60px" }}
                      className="relative flex gap-3.5 pb-4 last:pb-0 md:gap-4 md:pb-6"
                    >
                      {/* connector rail between layers */}
                      <div className="relative flex shrink-0 flex-col items-center">
                        <span
                          className={cn(
                            "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-lg border font-mono text-xs",
                            last
                              ? "border-accent/50 bg-accent/10 text-accent"
                              : "border-border bg-background/60 text-muted-foreground",
                          )}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {!last && (
                          <span
                            aria-hidden
                            className="relative mt-1 w-px flex-1 bg-gradient-to-b from-accent/40 to-border"
                          >
                            {DECOR_PULSES && (
                              <span className="animate-flow-y absolute left-1/2 size-1 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_8px_1px_rgba(139,140,248,0.6)]" />
                            )}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1 pt-0.5">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span
                            className={cn(
                              "rounded-md border px-2 py-0.5 font-mono text-xs",
                              last
                                ? "border-accent/40 bg-accent/5 text-accent"
                                : "border-border bg-background/50 text-foreground/85",
                            )}
                          >
                            {layer.node}
                          </span>
                          <h3 className="text-sm font-semibold tracking-tight">
                            {layer.title}
                          </h3>
                        </div>
                        {/* Desktop only. On a phone these four paragraphs were
                            the entire problem: 272px (TR) / 295px (EN) of pure
                            body copy, over half the layer stack. Each layer's
                            title is already a complete one-line statement of
                            what that layer does, so mobile keeps chip + title
                            and reads as a tighter flow diagram; the elaboration
                            stays on desktop where there is room for it. */}
                        <p className="mt-1.5 hidden text-sm leading-relaxed text-muted-foreground md:mt-2 md:block">
                          {layer.body}
                        </p>
                      </div>
                    </motion.li>
                  );
                })}
              </ol>

              <p className="relative border-t border-border bg-background/30 px-5 py-4 text-xs leading-relaxed text-muted-foreground/70 md:px-6">
                {copy.panelHint}
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
