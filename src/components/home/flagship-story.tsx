"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import { useRef, useState } from "react";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/shared/reveal";
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

const STAGES: Stage[] = [
  {
    id: "01",
    title: "Input",
    alt: "The problem",
    body: "A real workflow, still unstructured: requests, orders, and content moving through hands, chats, and spreadsheets.",
    telemetry: ["capturing raw input", "mapping the workflow", "naming the problem"],
  },
  {
    id: "02",
    title: "Logic",
    alt: "The architecture",
    body: "The system takes shape: a data model, backend logic, and clear boundaries between the parts.",
    telemetry: ["designing the schema", "wiring backend logic", "drawing the boundaries"],
  },
  {
    id: "03",
    title: "Dashboard",
    alt: "The product",
    body: "Screens people actually run the day on: admin panels, dashboards, and storefronts.",
    telemetry: ["building the screens", "role-based views", "state that stays honest"],
  },
  {
    id: "04",
    title: "Result",
    alt: "A complete system",
    body: "One coherent system, owned end to end, from the database to the interface.",
    telemetry: ["database to interface", "one person, every layer", "built to be run"],
  },
];

/* Scene variants are shared with the services request scene via lib/motion. */

/* ----------------------------- stage visuals ---------------------------- */
/* Abstract, decorative skeletons only — never real data or captures. */

function InputVisual() {
  const scatter = [
    { l: "10%", t: "18%", w: "w-16" },
    { l: "34%", t: "62%", w: "w-20" },
    { l: "58%", t: "26%", w: "w-14" },
    { l: "74%", t: "58%", w: "w-16" },
    { l: "22%", t: "76%", w: "w-12" },
    { l: "66%", t: "80%", w: "w-14" },
    { l: "44%", t: "10%", w: "w-12" },
  ];
  const words = ["requests", "orders", "content", "users"];
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

function LogicVisual({ active }: { active: boolean }) {
  const nodes = [
    { x: 22, y: 84, label: "Data model" },
    { x: 150, y: 24, label: "API" },
    { x: 150, y: 144, label: "Auth" },
    { x: 292, y: 84, label: "Routing" },
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

function ResultVisual({ active }: { active: boolean }) {
  const parts = ["Database", "Backend", "Interface"];
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

function StageVisual({ index, active }: { index: number; active: boolean }) {
  switch (index) {
    case 0:
      return <InputVisual />;
    case 1:
      return <LogicVisual active={active} />;
    case 2:
      return <DashboardVisual />;
    default:
      return <ResultVisual active={active} />;
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

function StoryHeading() {
  return (
    <div>
      <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
        <span aria-hidden className="size-1.5 bg-accent/90" />
        How a system comes together
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance md:text-4xl">
        From raw input to running product.
      </h2>
    </div>
  );
}

/* --------------------------- pinned (desktop) --------------------------- */

function PinnedStory() {
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
            <StoryHeading />
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
                  <StageVisual index={i} active={i === stage} />
                </motion.div>
              ))}
              <p className="absolute bottom-3 left-5 font-mono text-xs tracking-[0.2em] text-muted-foreground/60 uppercase">
                system stage — {STAGES[stage].title.toLowerCase()}
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

function StackedStory() {
  const reduceMotion = useReducedMotion();
  return (
    <Container className="py-16 md:py-24">
      <Reveal>
        <StoryHeading />
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
                <StageVisual index={i} active />
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

/* -------------------------------- export -------------------------------- */

export function FlagshipStory() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative border-y border-border/60">
      <HandoffConnector />
      {reduceMotion ? (
        <StackedStory />
      ) : (
        <>
          <div className="hidden lg:block">
            <PinnedStory />
          </div>
          <div className="lg:hidden">
            <StackedStory />
          </div>
        </>
      )}
      <HandoffConnector />
    </section>
  );
}
