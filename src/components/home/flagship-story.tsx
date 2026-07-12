"use client";

import { ArrowRight } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import Link from "next/link";
import { useRef, useState } from "react";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/shared/reveal";
import { buttonVariants } from "@/components/ui/button";
import {
  DECOR_PULSES,
  EASE_OUT,
  sceneFadeVariants as fadeVariants,
  sceneItemVariants as itemVariants,
  scenePanelVariants as panelVariants,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Flagship "systems story" v2: a cinematic mission-control sequence fusing
 * Input → Logic → Dashboard → Result with Problem → Architecture → Product.
 * Desktop pins the stage and each stage *assembles* (staggered children) as
 * scroll advances it; mobile and prefers-reduced-motion get a premium
 * stacked, non-pinned version whose panels assemble on scroll instead.
 * All visuals are abstract skeletons/diagrams — no screenshots, no data,
 * no claims.
 */

interface Stage {
  id: string;
  title: string;
  alt: string;
  body: string;
  telemetry: string[];
}

/** Sahne sözlüğü — TR varsayılan; EN /en ana sayfasından locale ile gelir. */
interface StoryCopy {
  stages: Stage[];
  eyebrow: string;
  heading: string;
  stageFooter: string;
  inputWords: string[];
  logicNodes: [string, string, string, string];
  resultParts: [string, string, string];
  lower: (s: string) => string;
}

const STAGES_EN: Stage[] = [
  {
    id: "01",
    title: "Input",
    alt: "The problem",
    body: "A real workflow, still unstructured: requests, orders and content moving between hands, chats and spreadsheets.",
    telemetry: ["capturing raw input", "mapping the workflow", "naming the problem"],
  },
  {
    id: "02",
    title: "Logic",
    alt: "The architecture",
    body: "The system takes shape: a data model, backend logic and clear boundaries between the parts.",
    telemetry: ["designing the schema", "wiring backend logic", "drawing the boundaries"],
  },
  {
    id: "03",
    title: "Dashboard",
    alt: "The product",
    body: "Screens people actually run the day on: admin panels, dashboards and storefronts.",
    telemetry: ["building the screens", "role-specific views", "state that stays consistent"],
  },
  {
    id: "04",
    title: "Result",
    alt: "A complete system",
    body: "One coherent system, owned end to end, from the database to the interface.",
    telemetry: ["database to interface", "one owner, every layer", "built to be run"],
  },
];

const STAGES: Stage[] = [
  {
    id: "01",
    title: "Girdi",
    alt: "Problem",
    body: "Henüz yapılandırılmamış gerçek bir iş akışı: eller, sohbetler ve tablolar arasında dolaşan talepler, siparişler ve içerik.",
    telemetry: ["ham girdi yakalanıyor", "iş akışı haritalanıyor", "problem adlandırılıyor"],
  },
  {
    id: "02",
    title: "Mantık",
    alt: "Mimari",
    body: "Sistem şekilleniyor: veri modeli, backend mantığı ve parçalar arasında net sınırlar.",
    telemetry: ["şema tasarlanıyor", "backend mantığı bağlanıyor", "sınırlar çiziliyor"],
  },
  {
    id: "03",
    title: "Dashboard",
    alt: "Ürün",
    body: "İnsanların günü gerçekten yönettiği ekranlar: yönetim panelleri, dashboardlar ve vitrinler.",
    telemetry: ["ekranlar kuruluyor", "role özel görünümler", "tutarlı kalan durum"],
  },
  {
    id: "04",
    title: "Sonuç",
    alt: "Eksiksiz bir sistem",
    body: "Veritabanından arayüze, uçtan uca sahiplenilmiş tek bir tutarlı sistem.",
    telemetry: ["veritabanından arayüze", "tek sahip, her katman", "işletilmek üzere kuruldu"],
  },
];

/* Scene variants are shared with the services request scene via lib/motion. */

const STORY_COPY: Record<"tr" | "en", StoryCopy> = {
  tr: {
    stages: STAGES,
    eyebrow: "Bir sistem nasıl kurulur",
    heading: "Ham girdiden çalışan ürüne.",
    stageFooter: "sistem aşaması",
    inputWords: ["talepler", "siparişler", "içerik", "kullanıcılar"],
    logicNodes: ["Veri modeli", "API", "Auth", "Yönlendirme"],
    resultParts: ["Veritabanı", "Backend", "Arayüz"],
    lower: (s) => s.toLocaleLowerCase("tr-TR"),
  },
  en: {
    stages: STAGES_EN,
    eyebrow: "How a system comes together",
    heading: "From raw input to a running product.",
    stageFooter: "system stage",
    inputWords: ["requests", "orders", "content", "users"],
    logicNodes: ["Data model", "API", "Auth", "Routing"],
    resultParts: ["Database", "Backend", "Interface"],
    lower: (s) => s.toLowerCase(),
  },
};

/* ----------------------------- stage visuals ---------------------------- */
/* Abstract, decorative skeletons only — never real data or captures. */

function InputVisual({ words }: { words: string[] }) {
  const scatter = [
    { l: "10%", t: "18%", w: "w-16" },
    { l: "34%", t: "62%", w: "w-20" },
    { l: "58%", t: "26%", w: "w-14" },
    { l: "74%", t: "58%", w: "w-16" },
    { l: "22%", t: "76%", w: "w-12" },
    { l: "66%", t: "80%", w: "w-14" },
    { l: "44%", t: "10%", w: "w-12" },
  ];
  return (
    <div aria-hidden className="relative h-full w-full">
      {scatter.map((s, i) => (
        <motion.span
          key={i}
          variants={itemVariants}
          style={{ left: s.l, top: s.t }}
          className={cn(
            "absolute h-2.5 rounded-sm bg-muted/50",
            s.w,
            i % 2 ? "opacity-60" : "opacity-90",
          )}
        />
      ))}
      {words.map((w, i) => (
        <motion.span
          key={w}
          variants={itemVariants}
          style={{ left: `${16 + i * 20}%`, top: `${38 + (i % 2) * 18}%` }}
          className="absolute font-mono text-xs text-muted-foreground/70"
        >
          {w}
        </motion.span>
      ))}
    </div>
  );
}

function LogicVisual({
  active,
  labels,
}: {
  active: boolean;
  labels: [string, string, string, string];
}) {
  const nodes = [
    { x: 22, y: 84, label: labels[0] },
    { x: 150, y: 24, label: labels[1] },
    { x: 150, y: 144, label: labels[2] },
    { x: 292, y: 84, label: labels[3] },
  ];
  const links = [
    "M106 92 L150 40",
    "M106 100 L150 152",
    "M234 40 L292 88",
    "M234 152 L292 100",
  ];
  return (
    <div aria-hidden className="flex h-full w-full items-center justify-center">
      <svg viewBox="0 0 380 190" className="h-auto w-full max-w-[380px]">
        {links.map((d, i) => (
          <motion.path
            key={d}
            d={d}
            fill="none"
            stroke="var(--accent)"
            strokeOpacity={0.45}
            strokeWidth={1.25}
            initial={false}
            animate={{ pathLength: active ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.25 + i * 0.12, ease: EASE_OUT }}
          />
        ))}
        {nodes.map((n) => (
          <motion.g key={n.label} variants={fadeVariants}>
            <rect
              x={n.x}
              y={n.y - 16}
              width={84}
              height={32}
              rx={7}
              className="fill-card stroke-border"
            />
            <text
              x={n.x + 42}
              y={n.y + 4}
              textAnchor="middle"
              className="fill-foreground/80 font-mono text-xs"
            >
              {n.label}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

function DashboardVisual() {
  return (
    <div
      aria-hidden
      className="mx-auto flex h-full w-full max-w-[440px] items-center"
    >
      <div className="w-full overflow-hidden rounded-lg border border-border/70 bg-background/40">
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-2 border-b border-border/60 px-3 py-2"
        >
          <span className="size-1.5 rounded-full bg-accent/80" />
          <span className="h-2 w-24 rounded bg-muted/50" />
        </motion.div>
        <div className="flex">
          <motion.div
            variants={itemVariants}
            className="hidden w-16 shrink-0 flex-col gap-2 border-r border-border/60 p-3 sm:flex"
          >
            <span className="h-2 w-full rounded bg-muted/70" />
            <span className="h-2 w-3/4 rounded bg-muted/50" />
            <span className="h-2 w-full rounded bg-muted/40" />
            <span className="h-2 w-2/3 rounded bg-muted/30" />
          </motion.div>
          <div className="flex-1 space-y-2.5 p-4">
            <motion.div variants={itemVariants} className="flex gap-2">
              <span className="h-10 flex-1 rounded bg-muted/40" />
              <span className="h-10 flex-1 rounded bg-muted/30" />
              <span className="h-10 flex-1 rounded bg-muted/25" />
            </motion.div>
            <motion.span
              variants={itemVariants}
              className="block h-2 w-full rounded bg-muted/50"
            />
            <motion.span
              variants={itemVariants}
              className="block h-2 w-5/6 rounded bg-muted/40"
            />
            <motion.span
              variants={itemVariants}
              className="block h-2 w-2/3 rounded bg-muted/30"
            />
            <motion.div
              variants={itemVariants}
              className="flex items-end gap-1.5 pt-1"
            >
              {[10, 16, 8, 20, 13, 18, 9].map((h, i) => (
                <span
                  key={i}
                  style={{ height: h * 2 }}
                  className={cn(
                    "w-4 rounded-sm",
                    i === 3 ? "bg-accent/50" : "bg-muted/40",
                  )}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultVisual({
  active,
  parts,
}: {
  active: boolean;
  parts: [string, string, string];
}) {
  return (
    <div aria-hidden className="flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-[430px] items-center gap-2">
        {parts.map((p, i) => (
          <div key={p} className="contents">
            {i > 0 && (
              <motion.div
                variants={fadeVariants}
                className="relative h-px flex-1 bg-gradient-to-r from-border via-accent/50 to-border"
              >
                <motion.span
                  className="absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_8px_1px_rgba(139,140,248,0.55)]"
                  initial={false}
                  animate={active ? { left: ["0%", "100%"] } : { left: "0%" }}
                  transition={
                    active
                      ? {
                          duration: 2.2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.5 + i * 0.6,
                        }
                      : { duration: 0 }
                  }
                />
              </motion.div>
            )}
            <motion.div
              variants={itemVariants}
              className="rounded-lg border border-accent/25 bg-card px-4 py-3 text-center"
            >
              <p className="font-mono text-xs text-foreground/85">{p}</p>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StageVisual({
  index,
  active,
  copy,
}: {
  index: number;
  active: boolean;
  copy: StoryCopy;
}) {
  switch (index) {
    case 0:
      return <InputVisual words={copy.inputWords} />;
    case 1:
      return <LogicVisual active={active} labels={copy.logicNodes} />;
    case 2:
      return <DashboardVisual />;
    default:
      return <ResultVisual active={active} parts={copy.resultParts} />;
  }
}

/* ------------------------------ HUD chrome ------------------------------ */

function CornerBracket({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("absolute size-4 border-accent/40", className)}
    />
  );
}

function StageFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {/* offset deck layer for spatial depth */}
      <div
        aria-hidden
        className="absolute inset-0 translate-x-3 translate-y-3 rounded-xl border border-border/50 bg-card/30"
      />
      <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-border bg-card/50 ring-1 ring-white/5 backdrop-blur-sm">
        <div aria-hidden className="scanlines absolute inset-0 opacity-60" />
        <CornerBracket className="top-3 left-3 border-t border-l" />
        <CornerBracket className="top-3 right-3 border-t border-r" />
        <CornerBracket className="bottom-3 left-3 border-b border-l" />
        <CornerBracket className="right-3 bottom-3 border-r border-b" />
        {children}
      </div>
    </div>
  );
}

/** Vertical connector bridging hero → story → projects into one flow. */
function HandoffConnector() {
  return (
    <div aria-hidden className="flex justify-center py-6">
      <div className="relative h-14 w-px bg-gradient-to-b from-border via-accent/40 to-border">
        {DECOR_PULSES && (
          <span className="animate-flow-y absolute left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_8px_1px_rgba(139,140,248,0.5)]" />
        )}
      </div>
    </div>
  );
}

function StoryHeading({ copy }: { copy: StoryCopy }) {
  return (
    <div>
      <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
        <span aria-hidden className="size-1.5 bg-accent/90" />
        {copy.eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance md:text-4xl">
        {copy.heading}
      </h2>
    </div>
  );
}

/* --------------------------- pinned (desktop) --------------------------- */

function PinnedStory({ copy }: { copy: StoryCopy }) {
  const STAGES = copy.stages;
  const outerRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.4,
  });
  useMotionValueEvent(smooth, "change", (v) => {
    setStage(Math.max(0, Math.min(3, Math.floor(v * 4))));
  });

  const stateFor = (i: number) =>
    i === stage ? "active" : i < stage ? "past" : "future";

  return (
    <div ref={outerRef} className="relative h-[380vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        {/* mission-control backdrop that deepens with each stage */}
        <motion.div
          aria-hidden
          className="bg-grid pointer-events-none absolute inset-0"
          initial={false}
          animate={{ opacity: 0.25 + stage * 0.12 }}
          transition={{ duration: 0.8, ease: EASE_OUT }}
        />
        <div
          aria-hidden
          className="scanlines pointer-events-none absolute inset-0 opacity-40"
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_50%,rgba(139,140,248,0.05),transparent)]"
          initial={false}
          animate={{ opacity: 0.5 + stage * 0.16 }}
          transition={{ duration: 0.8, ease: EASE_OUT }}
        />
        <Container className="relative w-full">
          <div className="flex items-end justify-between gap-6">
            <StoryHeading copy={copy} />
            <p className="shrink-0 font-mono text-sm text-muted-foreground">
              <span className="relative inline-block h-[1.25em] w-[2ch] overflow-hidden align-bottom">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.span
                    key={STAGES[stage].id}
                    initial={{ y: "0.9em", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "-0.9em", opacity: 0 }}
                    transition={{ duration: 0.3, ease: EASE_OUT }}
                    className="absolute inset-0 text-accent"
                  >
                    {STAGES[stage].id}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span aria-hidden> / 04</span>
            </p>
          </div>

          <div className="mt-12 grid grid-cols-[190px_minmax(0,1fr)_300px] items-center gap-12">
            {/* stage rail with locking nodes */}
            <div className="relative">
              <div
                aria-hidden
                className="absolute top-1 bottom-1 left-[5px] w-px bg-border"
              />
              <motion.div
                aria-hidden
                style={{ scaleY: smooth }}
                className="absolute top-1 bottom-1 left-[5px] w-px origin-top bg-accent/70"
              />
              <ul className="space-y-8">
                {STAGES.map((s, i) => (
                  <li key={s.id} className="relative pl-7">
                    <span aria-hidden className="absolute top-1.5 left-0">
                      <span
                        className={cn(
                          "block size-[11px] rounded-full border transition-all duration-500",
                          i < stage
                            ? "border-accent bg-accent"
                            : i === stage
                              ? "border-accent bg-accent/80 shadow-[0_0_10px_2px_rgba(139,140,248,0.4)]"
                              : "border-border bg-card",
                        )}
                      />
                      {i === stage && (
                        <span className="animate-node-pulse absolute inset-0 rounded-full border border-accent/50" />
                      )}
                    </span>
                    <p
                      className={cn(
                        "font-mono text-xs tracking-widest uppercase transition-colors duration-500",
                        i === stage
                          ? "text-foreground"
                          : i < stage
                            ? "text-muted-foreground"
                            : "text-muted-foreground/50",
                      )}
                    >
                      {s.id} {s.title}
                    </p>
                    <p
                      className={cn(
                        "mt-0.5 text-xs transition-colors duration-500",
                        i === stage
                          ? "text-muted-foreground"
                          : "text-muted-foreground/40",
                      )}
                    >
                      {s.alt}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* stage viewport: HUD frame, assembling panels, change sweep */}
            <StageFrame>
              <motion.div
                key={`sweep-${stage}`}
                aria-hidden
                initial={{ top: "-8%", opacity: 0.8 }}
                animate={{ top: "108%", opacity: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="pointer-events-none absolute inset-x-6 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"
              />
              {STAGES.map((s, i) => (
                <motion.div
                  key={s.id}
                  className="absolute inset-0 p-6 pt-8"
                  variants={panelVariants}
                  initial={false}
                  animate={stateFor(i)}
                >
                  <StageVisual index={i} active={i === stage} copy={copy} />
                </motion.div>
              ))}
              <p className="absolute bottom-3 left-5 font-mono text-xs tracking-[0.2em] text-muted-foreground/60 uppercase">
                {copy.stageFooter} — {copy.lower(STAGES[stage].title)}
              </p>
              <span
                aria-hidden
                className="absolute top-4 right-8 size-1.5 rounded-full bg-accent/80 shadow-[0_0_8px_1px_rgba(139,140,248,0.5)]"
              />
            </StageFrame>

            {/* telemetry + narrative, staggered per stage */}
            <div className="relative min-h-[16rem]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={STAGES[stage].id}
                  variants={panelVariants}
                  initial="future"
                  animate="active"
                  exit="past"
                >
                  <motion.p
                    variants={itemVariants}
                    className="text-lg leading-relaxed font-medium text-foreground"
                  >
                    {STAGES[stage].body}
                  </motion.p>
                  <ul className="mt-6 space-y-2 border-t border-border/60 pt-5">
                    {STAGES[stage].telemetry.map((t) => (
                      <motion.li
                        key={t}
                        variants={itemVariants}
                        className="flex items-center gap-2 font-mono text-xs text-muted-foreground"
                      >
                        <span
                          aria-hidden
                          className="size-1 rounded-full bg-accent/70"
                        />
                        {t}
                        <span
                          aria-hidden
                          className="ml-auto text-xs text-accent/50"
                        >
                          ok
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}

/* -------------------- stacked (mobile / reduced motion) ------------------ */

function StackedStory({ copy }: { copy: StoryCopy }) {
  const STAGES = copy.stages;
  const reduceMotion = useReducedMotion();
  return (
    <Container className="py-16 md:py-24">
      <Reveal>
        <StoryHeading copy={copy} />
      </Reveal>
      <div className="mt-10 space-y-6">
        {STAGES.map((s, i) => (
          <Reveal key={s.id} delay={0.04}>
            <div className="overflow-hidden rounded-xl border border-border bg-card/60 ring-1 ring-white/5">
              <div className="flex items-center justify-between border-b border-border/60 px-5 py-3">
                <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                  <span className="text-accent">{s.id}</span> {s.title}
                  <span aria-hidden className="mx-2">
                    ·
                  </span>
                  {s.alt}
                </p>
                <span aria-hidden className="size-1.5 rounded-full bg-accent/80" />
              </div>
              <motion.div
                className="relative h-44 border-b border-border/60 p-4"
                initial={reduceMotion ? false : "future"}
                whileInView={reduceMotion ? undefined : "active"}
                viewport={{ once: true, margin: "-60px" }}
              >
                <div aria-hidden className="scanlines absolute inset-0 opacity-50" />
                <StageVisual index={i} active copy={copy} />
              </motion.div>
              <p className="px-5 py-4 text-sm leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Container>
  );
}

/* ------------------------------- exit CTA -------------------------------- */

/**
 * The story is the longest stretch of the homepage and used to end with no way
 * to act. This gives it a conversion surface without touching the cinema:
 * primary → inquiry, secondary → proof.
 */
const EXIT_COPY = {
  tr: {
    line: "Bu akış her projede aynı işler. Sizin işinizin girdisi farklı olabilir.",
    primary: "Bu akışı kendi projenize uyarlayalım",
    primaryHref: "/teklif-al",
    secondary: "Projeleri incele",
    secondaryHref: "/projeler",
  },
  en: {
    line: "This flow plays out the same in every project. Only your input differs.",
    primary: "Apply this flow to your project",
    primaryHref: "/en/start-project",
    secondary: "View projects",
    secondaryHref: "/en/projects",
  },
} as const;

function StoryExit({ locale }: { locale: "tr" | "en" }) {
  const copy = EXIT_COPY[locale];
  return (
    <Container className="pb-14 md:pb-16">
      <Reveal>
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {copy.line}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href={copy.primaryHref}
              className={cn(buttonVariants({ variant: "cta" }), "h-11 px-6")}
            >
              {copy.primary}
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href={copy.secondaryHref}
              className={cn(buttonVariants({ variant: "outline" }), "h-11 px-6")}
            >
              {copy.secondary}
            </Link>
          </div>
        </div>
      </Reveal>
    </Container>
  );
}

/* -------------------------------- export -------------------------------- */

export function FlagshipStory({ locale = "tr" }: { locale?: "tr" | "en" }) {
  const reduceMotion = useReducedMotion();
  const copy = STORY_COPY[locale];

  return (
    <section className="relative border-y border-border/60">
      <HandoffConnector />
      {reduceMotion ? (
        <StackedStory copy={copy} />
      ) : (
        <>
          <div className="hidden lg:block">
            <PinnedStory copy={copy} />
          </div>
          <div className="lg:hidden">
            <StackedStory copy={copy} />
          </div>
        </>
      )}
      <StoryExit locale={locale} />
      <HandoffConnector />
    </section>
  );
}
