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
  EASE_OUT,
  sceneFadeVariants as fadeVariants,
  sceneItemVariants as itemVariants,
  scenePanelVariants as panelVariants,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Request → System → Handoff: the services page's cinematic scene. Six beats
 * showing how a real business need becomes a working web system. Desktop
 * pins the stage and advances it with scroll (same proven mechanics as the
 * home flagship story — native scroll, no traps); mobile and
 * prefers-reduced-motion get stacked, staged cards. All visuals are abstract
 * schematics; all copy is the existing honest engagement model — no
 * timelines, guarantees, metrics, or agency theater.
 */

interface Beat {
  id: string;
  title: string;
  alt: string;
  body: string;
  telemetry: string[];
}

const BEATS: Beat[] = [
  {
    id: "01",
    title: "Talep",
    alt: "Sizden gelen",
    body: "Kendi cümlelerinizle gerçek bir iş ihtiyacı: zaman sızdıran bir iş akışı, bir fikir, bir mağaza, yürütülecek bir operasyon.",
    telemetry: ["düz cümlelerle bir problem", "şartname gerekmez", "doğrudan görüşme"],
  },
  {
    id: "02",
    title: "Kısıtlar",
    alt: "Şekillendiren",
    body: "İhtiyaç yapılandırılır: kapsam, veri, kullanıcılar, iş kuralları ve birlikte yaşayacağı sistemler.",
    telemetry: ["kapsam yazılı netleşir", "veri & kullanıcılar haritalanır", "entegrasyonlar belirlenir"],
  },
  {
    id: "03",
    title: "Mimari",
    alt: "Sistem şekilleniyor",
    body: "Veri modeli, backend mantığı, roller ve ekran yapısı — henüz hiçbir şey kurulmadan çizilir.",
    telemetry: ["veri modeli çizilir", "roller & sınırlar belirlenir", "ekranlar yapılandırılır"],
  },
  {
    id: "04",
    title: "Geliştirme",
    alt: "Kurulum",
    body: "Frontend, backend ve yönetim paneli küçük, incelenebilir adımlarla kurulur: yapıştırılmış parçalar değil, tek tutarlı kod tabanı.",
    telemetry: ["küçük incelenebilir adımlar", "backend & panel bağlanır", "entegrasyonlar kurulur"],
  },
  {
    id: "05",
    title: "Arayüz",
    alt: "Ekranlar",
    body: "İnsanların gerçekten kullandığı yüzeyler: dashboard, vitrin ya da site, iç panel.",
    telemetry: ["dashboard & panel", "dışa açık yüzey", "tutarlı kalan durumlar"],
  },
  {
    id: "06",
    title: "Teslim",
    alt: "İşletebileceğiniz bir sistem",
    body: "Temiz teslim edilen, çalışan bir web sistemi: incelenebilir kapsam, sürdürülebilir yapı, takip edebileceğiniz dokümantasyon.",
    telemetry: ["çalışan sistem", "temiz teslim", "dokümantasyon dahil"],
  },
];

/* Scene variants are shared with the home flagship story via lib/motion. */

/* ------------------------------ beat visuals ----------------------------- */
/* Abstract schematics only — no real data, no fake claims. */

function RequestVisual() {
  return (
    <div aria-hidden className="flex h-full w-full items-center justify-center">
      <div className="w-full max-w-[320px] overflow-hidden rounded-lg border border-border/70 bg-background/40">
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-2 border-b border-border/60 px-3 py-2"
        >
          <span className="size-1.5 rounded-full bg-accent/80" />
          <span className="font-mono text-xs text-muted-foreground">
            gelen talep
          </span>
        </motion.div>
        <div className="space-y-2 p-4">
          {["w-5/6", "w-full", "w-2/3", "w-3/4"].map((w, i) => (
            <motion.span
              key={i}
              variants={itemVariants}
              className={cn("block h-2 rounded bg-muted/50", w)}
            />
          ))}
          <motion.p
            variants={itemVariants}
            className="pt-1 font-mono text-xs text-muted-foreground/60"
          >
            — kendi cümlelerinizle
          </motion.p>
        </div>
      </div>
    </div>
  );
}

function ConstraintsVisual() {
  const chips = ["kapsam", "veri", "kullanıcılar", "iş kuralları", "entegrasyonlar", "operasyon"];
  return (
    <div aria-hidden className="flex h-full w-full items-center justify-center">
      <div className="flex max-w-[360px] flex-wrap justify-center gap-2">
        {chips.map((chip) => (
          <motion.span
            key={chip}
            variants={itemVariants}
            className="rounded-md border border-accent/25 bg-accent/5 px-3 py-1.5 font-mono text-xs text-foreground/85"
          >
            {chip}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

function ArchitectureVisual({ active }: { active: boolean }) {
  const nodes = [
    { x: 22, y: 84, label: "Veri modeli" },
    { x: 150, y: 24, label: "Backend" },
    { x: 150, y: 144, label: "Roller" },
    { x: 292, y: 84, label: "Ekranlar" },
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

function ImplementationVisual() {
  const rows = ["frontend", "backend", "yönetim paneli", "iş akışları", "entegrasyonlar"];
  return (
    <div aria-hidden className="flex h-full w-full items-center justify-center">
      <div className="w-full max-w-[320px] space-y-2">
        {rows.map((row, i) => (
          <motion.div
            key={row}
            variants={itemVariants}
            className="flex items-center gap-3 rounded-md border border-border/60 bg-background/40 px-3 py-2"
          >
            <span
              className={cn(
                "size-2 shrink-0 rounded-sm",
                i < 3 ? "bg-accent/70" : "border border-accent/40",
              )}
            />
            <span className="font-mono text-xs text-foreground/80">{row}</span>
            <span
              className={cn(
                "ml-auto h-1.5 rounded bg-muted/50",
                ["w-16", "w-12", "w-14", "w-10", "w-12"][i],
              )}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function InterfaceVisual() {
  return (
    <div aria-hidden className="flex h-full w-full items-center justify-center gap-4">
      {/* dashboard skeleton */}
      <motion.div
        variants={itemVariants}
        className="w-[46%] overflow-hidden rounded-lg border border-border/70 bg-background/40"
      >
        <div className="flex items-center gap-1.5 border-b border-border/60 px-2.5 py-1.5">
          <span className="size-1 rounded-full bg-accent/80" />
          <span className="h-1.5 w-12 rounded bg-muted/50" />
        </div>
        <div className="flex">
          <div className="w-8 shrink-0 space-y-1.5 border-r border-border/60 p-2">
            <span className="block h-1.5 w-full rounded bg-muted/60" />
            <span className="block h-1.5 w-3/4 rounded bg-muted/40" />
          </div>
          <div className="flex-1 space-y-1.5 p-2.5">
            <div className="flex gap-1.5">
              <span className="h-5 flex-1 rounded bg-muted/40" />
              <span className="h-5 flex-1 rounded bg-muted/30" />
            </div>
            <span className="block h-1.5 w-full rounded bg-muted/50" />
            <span className="block h-1.5 w-2/3 rounded bg-muted/40" />
          </div>
        </div>
      </motion.div>
      {/* storefront/site skeleton */}
      <motion.div
        variants={itemVariants}
        className="w-[46%] overflow-hidden rounded-lg border border-border/70 bg-background/40"
      >
        <div className="border-b border-border/60 px-2.5 py-1.5">
          <span className="block h-1.5 w-16 rounded bg-muted/50" />
        </div>
        <div className="space-y-1.5 p-2.5">
          <span className="block h-8 w-full rounded bg-muted/30" />
          <div className="flex gap-1.5">
            <span className="h-6 flex-1 rounded bg-muted/40" />
            <span className="h-6 flex-1 rounded bg-muted/35" />
            <span className="h-6 flex-1 rounded bg-muted/30" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function HandoffVisual({ active }: { active: boolean }) {
  const parts = ["Veritabanı", "Backend", "Arayüz"];
  const marks = ["incelenebilir kapsam", "sürdürülebilir", "dokümante"];
  return (
    <div
      aria-hidden
      className="flex h-full w-full flex-col items-center justify-center gap-5"
    >
      <div className="flex w-full max-w-[400px] items-center gap-2">
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
                      ? { duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.5 + i * 0.6 }
                      : { duration: 0 }
                  }
                />
              </motion.div>
            )}
            <motion.div
              variants={itemVariants}
              className="rounded-lg border border-accent/25 bg-card px-3.5 py-2.5 text-center"
            >
              <p className="font-mono text-xs text-foreground/85">{p}</p>
            </motion.div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {marks.map((m) => (
          <motion.span
            key={m}
            variants={itemVariants}
            className="rounded-md border border-border bg-background/50 px-2.5 py-1 font-mono text-xs text-muted-foreground"
          >
            {m}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

function BeatVisual({ index, active }: { index: number; active: boolean }) {
  switch (index) {
    case 0:
      return <RequestVisual />;
    case 1:
      return <ConstraintsVisual />;
    case 2:
      return <ArchitectureVisual active={active} />;
    case 3:
      return <ImplementationVisual />;
    case 4:
      return <InterfaceVisual />;
    default:
      return <HandoffVisual active={active} />;
  }
}

/* ------------------------------- HUD chrome ------------------------------ */

function CornerBracket({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("absolute size-4 border-accent/40", className)}
    />
  );
}

function SceneHeading() {
  return (
    <div>
      <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
        <span aria-hidden className="size-1.5 bg-accent/90" />
        Kurulum hattı — talepten çalışan sisteme
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance md:text-4xl">
        Bir talep, işletebileceğiniz bir sisteme dönüşür.
      </h2>
    </div>
  );
}

/* --------------------------- pinned (desktop) ---------------------------- */

function PinnedScene() {
  const outerRef = useRef<HTMLDivElement>(null);
  const [beat, setBeat] = useState(0);
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
    setBeat(Math.max(0, Math.min(5, Math.floor(v * 6))));
  });

  const stateFor = (i: number) =>
    i === beat ? "active" : i < beat ? "past" : "future";

  return (
    <div ref={outerRef} className="relative h-[540vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div
          aria-hidden
          className="bg-grid pointer-events-none absolute inset-0"
          initial={false}
          animate={{ opacity: 0.22 + beat * 0.08 }}
          transition={{ duration: 0.8, ease: EASE_OUT }}
        />
        <div
          aria-hidden
          className="scanlines pointer-events-none absolute inset-0 opacity-40"
        />
        <Container className="relative w-full">
          <div className="flex items-end justify-between gap-6">
            <SceneHeading />
            <p className="shrink-0 font-mono text-sm text-muted-foreground">
              <span className="relative inline-block h-[1.25em] w-[2ch] overflow-hidden align-bottom">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.span
                    key={BEATS[beat].id}
                    initial={{ y: "0.9em", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "-0.9em", opacity: 0 }}
                    transition={{ duration: 0.3, ease: EASE_OUT }}
                    className="absolute inset-0 text-accent"
                  >
                    {BEATS[beat].id}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span aria-hidden> / 06</span>
            </p>
          </div>

          <div className="mt-10 grid grid-cols-[200px_minmax(0,1fr)_300px] items-center gap-12">
            {/* beat rail */}
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
              <ul className="space-y-5">
                {BEATS.map((b, i) => (
                  <li key={b.id} className="relative pl-7">
                    <span aria-hidden className="absolute top-1 left-0">
                      <span
                        className={cn(
                          "block size-[11px] rounded-full border transition-all duration-500",
                          i < beat
                            ? "border-accent bg-accent"
                            : i === beat
                              ? "border-accent bg-accent/80 shadow-[0_0_10px_2px_rgba(139,140,248,0.4)]"
                              : "border-border bg-card",
                        )}
                      />
                      {i === beat && (
                        <span className="animate-node-pulse absolute inset-0 rounded-full border border-accent/50" />
                      )}
                    </span>
                    <p
                      className={cn(
                        "font-mono text-xs tracking-widest uppercase transition-colors duration-500",
                        i === beat
                          ? "text-foreground"
                          : i < beat
                            ? "text-muted-foreground"
                            : "text-muted-foreground/50",
                      )}
                    >
                      {b.id} {b.title}
                    </p>
                    <p
                      className={cn(
                        "mt-0.5 text-xs transition-colors duration-500",
                        i === beat
                          ? "text-muted-foreground"
                          : "text-muted-foreground/40",
                      )}
                    >
                      {b.alt}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* beat viewport with HUD frame + depth layer */}
            <div className="relative">
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
                <motion.div
                  key={`sweep-${beat}`}
                  aria-hidden
                  initial={{ top: "-8%", opacity: 0.8 }}
                  animate={{ top: "108%", opacity: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="pointer-events-none absolute inset-x-6 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"
                />
                {BEATS.map((b, i) => (
                  <motion.div
                    key={b.id}
                    className="absolute inset-0 p-6 pt-8"
                    variants={panelVariants}
                    initial={false}
                    animate={stateFor(i)}
                  >
                    <BeatVisual index={i} active={i === beat} />
                  </motion.div>
                ))}
                <p className="absolute bottom-3 left-5 font-mono text-xs tracking-[0.2em] text-muted-foreground/60 uppercase">
                  hat aşaması — {BEATS[beat].title.toLocaleLowerCase("tr-TR")}
                </p>
                <span
                  aria-hidden
                  className="absolute top-4 right-8 size-1.5 rounded-full bg-accent/80 shadow-[0_0_8px_1px_rgba(139,140,248,0.5)]"
                />
              </div>
            </div>

            {/* narrative + telemetry */}
            <div className="relative min-h-[16rem]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={BEATS[beat].id}
                  variants={panelVariants}
                  initial="future"
                  animate="active"
                  exit="past"
                >
                  <motion.p
                    variants={itemVariants}
                    className="text-lg leading-relaxed font-medium text-foreground"
                  >
                    {BEATS[beat].body}
                  </motion.p>
                  <ul className="mt-6 space-y-2 border-t border-border/60 pt-5">
                    {BEATS[beat].telemetry.map((t) => (
                      <motion.li
                        key={t}
                        variants={itemVariants}
                        className="flex items-center gap-2 font-mono text-xs text-muted-foreground"
                      >
                        <span aria-hidden className="size-1 rounded-full bg-accent/70" />
                        {t}
                        <span aria-hidden className="ml-auto text-xs text-accent/50">
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

function StackedScene() {
  const reduceMotion = useReducedMotion();
  return (
    <Container className="py-12 md:py-16">
      <Reveal>
        <SceneHeading />
      </Reveal>
      <div className="mt-10 space-y-6">
        {BEATS.map((b, i) => (
          <Reveal key={b.id} delay={0.04}>
            <div className="overflow-hidden rounded-xl border border-border bg-card/60 ring-1 ring-white/5">
              <div className="flex items-center justify-between border-b border-border/60 px-5 py-3">
                <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                  <span className="text-accent">{b.id}</span> {b.title}
                  <span aria-hidden className="mx-2">
                    ·
                  </span>
                  {b.alt}
                </p>
                <span aria-hidden className="size-1.5 rounded-full bg-accent/80" />
              </div>
              <motion.div
                className="relative h-48 border-b border-border/60 p-4"
                initial={reduceMotion ? false : "future"}
                whileInView={reduceMotion ? undefined : "active"}
                viewport={{ once: true, margin: "-60px" }}
              >
                <div aria-hidden className="scanlines absolute inset-0 opacity-50" />
                <BeatVisual index={i} active />
              </motion.div>
              <p className="px-5 py-4 text-sm leading-relaxed text-muted-foreground">
                {b.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Container>
  );
}

/* --------------------------------- export -------------------------------- */

export function RequestScene() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative border-y border-border/60">
      {reduceMotion ? (
        <StackedScene />
      ) : (
        <>
          <div className="hidden lg:block">
            <PinnedScene />
          </div>
          <div className="lg:hidden">
            <StackedScene />
          </div>
        </>
      )}
    </section>
  );
}
