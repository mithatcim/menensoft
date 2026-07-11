"use client";

import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { useState } from "react";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * System Layers: an exploded anatomy of a complete web system. Desktop shows
 * an isometric plane stack (CSS 3D transforms only — no WebGL) that assembles
 * on scroll; selecting a layer lifts and highlights its plane and swaps the
 * detail panel. Mobile shows a cascading flat stack with an inline accordion.
 * All copy describes what actually gets built at each layer — no metrics,
 * no claims.
 */

interface Layer {
  id: string;
  tag: string;
  title: string;
  line: string;
  chips: string[];
}

const LAYERS_EN: Layer[] = [
  {
    id: "input",
    tag: "REQ",
    title: "Input / request",
    line: "Where the workflow enters the system: forms, orders, requests, content.",
    chips: ["forms", "orders", "content"],
  },
  {
    id: "data",
    tag: "DATA",
    title: "Data model",
    line: "Schema and relations designed around how the business really works.",
    chips: ["schema", "relations", "SQL"],
  },
  {
    id: "logic",
    tag: "API",
    title: "Backend logic",
    line: "APIs, authentication and rules that keep data consistent.",
    chips: ["APIs", "auth", "validation"],
  },
  {
    id: "admin",
    tag: "ADMIN",
    title: "Admin & dashboards",
    line: "The control room: screens for the people who run the day.",
    chips: ["admin screens", "roles", "tables"],
  },
  {
    id: "auto",
    tag: "AUTO",
    title: "Automation",
    line: "Routing and repetitive work taken out of human hands.",
    chips: ["routing", "jobs", "integrations"],
  },
  {
    id: "ui",
    tag: "UI",
    title: "Interface",
    line: "The public surface: storefronts and the screens customers touch.",
    chips: ["storefront", "screens", "states"],
  },
  {
    id: "ship",
    tag: "SHIP",
    title: "Handoff",
    line: "Documentation and a clean handover: a system you can run.",
    chips: ["docs", "handover", "ownership"],
  },
];

const LAYERS: Layer[] = [
  {
    id: "input",
    tag: "REQ",
    title: "Girdi / talep",
    line: "İş akışının sisteme girdiği yer: formlar, siparişler, talepler, içerik.",
    chips: ["formlar", "siparişler", "içerik"],
  },
  {
    id: "data",
    tag: "DATA",
    title: "Veri modeli",
    line: "İşin gerçekte nasıl yürüdüğüne göre tasarlanmış şema ve ilişkiler.",
    chips: ["şema", "ilişkiler", "SQL"],
  },
  {
    id: "logic",
    tag: "API",
    title: "Backend mantığı",
    line: "Veriyi tutarlı tutan API'ler, kimlik doğrulama ve kurallar.",
    chips: ["API'ler", "auth", "doğrulama"],
  },
  {
    id: "admin",
    tag: "ADMIN",
    title: "Yönetim & dashboard",
    line: "Kontrol odası: günü yöneten insanlar için ekranlar.",
    chips: ["yönetim ekranları", "roller", "tablolar"],
  },
  {
    id: "auto",
    tag: "AUTO",
    title: "Otomasyon",
    line: "Yönlendirme ve tekrarlı işler insan elinden çıkar.",
    chips: ["yönlendirme", "görevler", "entegrasyonlar"],
  },
  {
    id: "ui",
    tag: "UI",
    title: "Arayüz",
    line: "Dışa açık yüzey: vitrinler ve müşterilerin dokunduğu ekranlar.",
    chips: ["vitrin", "ekranlar", "durumlar"],
  },
  {
    id: "ship",
    tag: "SHIP",
    title: "Teslim",
    line: "Dokümantasyon ve temiz devir: işletebileceğiniz bir sistem.",
    chips: ["dokümantasyon", "devir", "sahiplik"],
  },
];

const Z_GAP = 32;

const planeVariants: Variants = {
  hidden: (c: { i: number; base: number }) => ({
    opacity: 0,
    scale: 0.9,
    z: c.base + 150,
  }),
  on: (c: { i: number; base: number; selected: boolean }) => ({
    opacity: c.selected ? 1 : 0.8,
    scale: 1,
    z: c.base + (c.selected ? 26 : 0),
    transition: { duration: 0.7, delay: 0.1 + c.i * 0.07, ease: EASE_OUT },
  }),
};

/** Isometric plane stack (desktop). Planes are real buttons. */
function LayerStack({
  selected,
  onSelect,
  layers,
  ariaHighlight,
}: {
  selected: number;
  onSelect: (i: number) => void;
  layers: Layer[];
  ariaHighlight: string;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <div className="relative h-[460px] overflow-hidden [perspective:1100px]">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_55%_55%_at_50%_55%,rgba(139,140,248,0.07),transparent)]"
      />
      <div className="absolute top-[56%] left-1/2 [transform:rotateX(55deg)_rotateZ(-45deg)] [transform-style:preserve-3d]">
        {layers.map((layer, i) => {
          const base = (i - (layers.length - 1) / 2) * Z_GAP;
          const isSel = selected === i;
          return (
            <motion.button
              key={layer.id}
              type="button"
              onClick={() => onSelect(i)}
              aria-pressed={isSel}
              aria-label={`${ariaHighlight}: ${layer.title}`}
              custom={{ i, base, selected: isSel }}
              variants={planeVariants}
              initial={reduceMotion ? false : "hidden"}
              whileInView="on"
              viewport={{ once: true, margin: "-80px" }}
              className={cn(
                "absolute size-56 -translate-x-1/2 -translate-y-1/2 rounded-xl border backdrop-blur-[1px] transition-colors duration-300",
                isSel
                  ? "border-accent/60 bg-card/80 shadow-[0_0_36px_-6px_rgba(139,140,248,0.35)] ring-1 ring-accent/30"
                  : "border-border bg-card/60 ring-1 ring-white/5 hover:border-foreground/25",
              )}
            >
              <span
                className={cn(
                  "absolute top-4 left-4 origin-top-left font-mono text-xs tracking-widest [transform:rotateZ(45deg)_rotateX(-55deg)]",
                  isSel ? "text-accent" : "text-muted-foreground/70",
                )}
              >
                {layer.tag}
              </span>
              <span
                aria-hidden
                className={cn(
                  "absolute right-4 bottom-4 size-1.5 rounded-full",
                  isSel ? "bg-accent shadow-[0_0_8px_1px_rgba(139,140,248,0.6)]" : "bg-muted-foreground/30",
                )}
              />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/** Selected-layer detail (shared by desktop panel and mobile accordion). */
function LayerDetail({ layer }: { layer: Layer }) {
  return (
    <div className="p-5">
      <p className="text-sm leading-relaxed text-muted-foreground">
        {layer.line}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {layer.chips.map((chip) => (
          <span
            key={chip}
            className="rounded-md border border-border bg-background/50 px-2.5 py-1 font-mono text-xs text-foreground/80"
          >
            {chip}
          </span>
        ))}
      </div>
    </div>
  );
}

const LAYER_HEADINGS = {
  tr: {
    eyebrow: "Sistem katmanları",
    title: "Her katman, tek sahip.",
    description:
      "Eksiksiz bir web sistemi bir sayfa değil, bir yığındır. Her projede tasarlanıp kurulan katmanlar bunlar.",
    ariaHighlight: "Katmanı vurgula",
  },
  en: {
    eyebrow: "System layers",
    title: "Every layer, one owner.",
    description:
      "A complete web system is a stack, not a page. These are the layers designed and built in every project.",
    ariaHighlight: "Highlight layer",
  },
} as const;

export function SystemLayers({ locale = "tr" }: { locale?: "tr" | "en" }) {
  const [selected, setSelected] = useState(1); // data model — the foundation
  const reduceMotion = useReducedMotion();
  const layers = locale === "en" ? LAYERS_EN : LAYERS;
  const heading = LAYER_HEADINGS[locale];
  const layer = layers[selected];

  return (
    <section className="relative py-16 md:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow={heading.eyebrow}
            title={heading.title}
            description={heading.description}
          />
        </Reveal>

        {/* desktop: iso stack + selector list + detail */}
        <div className="mt-12 hidden items-center gap-12 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
          <LayerStack selected={selected} onSelect={setSelected} layers={layers} ariaHighlight={heading.ariaHighlight} />
          <div>
            <ul className="space-y-1.5">
              {layers.map((l, i) => (
                <li key={l.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(i)}
                    aria-pressed={selected === i}
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-lg border px-3.5 py-2.5 text-left transition-all duration-300",
                      selected === i
                        ? "border-accent/40 bg-card/80 ring-1 ring-accent/20"
                        : "border-transparent hover:border-border hover:bg-card/50",
                    )}
                  >
                    <span
                      className={cn(
                        "font-mono text-xs",
                        selected === i ? "text-accent" : "text-muted-foreground/50",
                      )}
                    >
                      L{i + 1}
                    </span>
                    <span
                      className={cn(
                        "text-sm font-medium tracking-tight",
                        selected === i ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {l.title}
                    </span>
                    <span
                      aria-hidden
                      className={cn(
                        "ml-auto size-1.5 rounded-full transition-colors",
                        selected === i ? "bg-accent" : "bg-muted-foreground/25",
                      )}
                    />
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card/60 ring-1 ring-white/5">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={layer.id}
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                  transition={{ duration: reduceMotion ? 0 : 0.25, ease: EASE_OUT }}
                >
                  <LayerDetail layer={layer} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* mobile: cascading flat stack with inline accordion */}
        <div className="mt-10 space-y-2 md:hidden">
          {layers.map((l, i) => {
            const isSel = selected === i;
            return (
              <Reveal key={l.id} delay={i * 0.04}>
                <div style={{ marginLeft: Math.min(i * 6, 24) }}>
                  <button
                    type="button"
                    onClick={() => setSelected(i)}
                    aria-pressed={isSel}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all duration-300",
                      isSel
                        ? "border-accent/40 bg-card/80 ring-1 ring-accent/20"
                        : "border-border bg-card/50",
                    )}
                  >
                    <span
                      className={cn(
                        "font-mono text-xs",
                        isSel ? "text-accent" : "text-muted-foreground/60",
                      )}
                    >
                      L{i + 1}
                    </span>
                    <span className="text-sm font-medium tracking-tight">
                      {l.title}
                    </span>
                    <span
                      aria-hidden
                      className={cn(
                        "ml-auto size-1.5 rounded-full",
                        isSel ? "bg-accent" : "bg-muted-foreground/25",
                      )}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isSel && (
                      <motion.div
                        key="detail"
                        initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        transition={{ duration: reduceMotion ? 0 : 0.3, ease: EASE_OUT }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 rounded-xl border border-accent/20 bg-card/60">
                          <LayerDetail layer={l} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
