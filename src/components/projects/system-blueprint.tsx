"use client";

import { motion, useReducedMotion } from "motion/react";

import type { Project } from "@/lib/projects/types";
import { type Locale } from "@/lib/locale";
import { DECOR_PULSES, EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * System blueprint — the large schematic that anchors a project page's fold
 * (Phase 21).
 *
 * This is NOT a screenshot and must never be mistaken for one. It carries no
 * browser chrome (no traffic-light dots, no URL bar) precisely because that
 * chrome would read as "this is the running app". It is openly a schematic:
 * corner brackets, a technical grid, mono labels, the project's real flow as a
 * wired node chain, and its real modules as attached chips.
 *
 * Every value comes from src/content/projects.ts — `flow`, `modules` and
 * `statusLabel` are all real, owner-approved content. Nothing is invented: no
 * metrics, no counts presented as results, no mock UI, no fake dashboard.
 *
 * Until real interface captures exist, this diagram is what carries the visual
 * proof load. That is the point: the proof here is structure.
 */

const BLUEPRINT_COPY = {
  tr: { frame: "şema", flow: "Akış", modules: "Modüller" },
  en: { frame: "blueprint", flow: "Flow", modules: "Modules" },
} as const;

const nodeVariants = {
  hidden: { opacity: 0, x: -8 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, delay: 0.1 + i * 0.1, ease: EASE_OUT },
  }),
};

const chipVariants = {
  hidden: { opacity: 0, y: 8 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: 0.35 + i * 0.08, ease: EASE_OUT },
  }),
};

function Bracket({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={cn("absolute size-5 border-accent/40", className)}
    />
  );
}

export function SystemBlueprint({
  project,
  locale = "tr",
  className,
}: {
  project: Project;
  locale?: Locale;
  className?: string;
}) {
  const copy = BLUEPRINT_COPY[locale];
  const reduceMotion = useReducedMotion() ?? false;
  const quiet = project.tier === "internal";

  const flow = project.flow ?? [];
  const modules = project.modules ?? [];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-card/50 p-5 ring-1 ring-white/5 md:p-8",
        className,
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="bg-grid absolute inset-0 opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(139,140,248,0.08),transparent)]" />
      </div>

      <Bracket className="top-3 left-3 border-t border-l" />
      <Bracket className="top-3 right-3 border-t border-r" />
      <Bracket className="bottom-3 left-3 border-b border-l" />
      <Bracket className="right-3 bottom-3 border-r border-b" />

      {/* schematic header — a mono label, deliberately not browser chrome */}
      <div className="relative flex items-center gap-3 border-b border-border/60 pb-4">
        <span
          aria-hidden
          className={cn(
            "size-1.5 rounded-full",
            quiet
              ? "bg-muted-foreground/50"
              : "bg-accent shadow-[0_0_8px_1px_rgba(139,140,248,0.6)]",
          )}
        />
        <p className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">
          {copy.frame} :: {project.slug}
        </p>
      </div>

      {/* real flow, wired top to bottom */}
      {flow.length > 0 && (
        <div className="relative mt-5 md:mt-6">
          <p className="font-mono text-xs tracking-widest text-muted-foreground/70 uppercase">
            {copy.flow}
          </p>
          <div className="mt-4">
            {flow.map((node, i) => {
              const last = i === flow.length - 1;
              return (
                <div key={node}>
                  <motion.div
                    custom={i}
                    variants={nodeVariants}
                    initial={reduceMotion ? false : "hidden"}
                    whileInView="show"
                    viewport={{ once: true, margin: "-40px" }}
                    className="flex items-center gap-3"
                  >
                    <span
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-md border font-mono text-[0.625rem]",
                        last && !quiet
                          ? "border-accent/50 bg-accent/10 text-accent"
                          : "border-border bg-background/60 text-muted-foreground",
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "min-w-0 flex-1 truncate rounded-lg border bg-background/50 px-3 py-2 font-mono text-xs",
                        last && !quiet
                          ? "border-accent/40 text-accent"
                          : "border-border text-foreground/85",
                      )}
                    >
                      {node}
                    </span>
                  </motion.div>

                  {!last && (
                    <div className="relative ml-[13px] h-5 w-px">
                      <motion.span
                        aria-hidden
                        initial={reduceMotion ? false : { scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.3,
                          delay: 0.16 + i * 0.1,
                          ease: EASE_OUT,
                        }}
                        className="absolute inset-0 origin-top bg-gradient-to-b from-accent/50 to-border"
                      />
                      {DECOR_PULSES && !quiet && (
                        <span className="animate-flow-y absolute left-1/2 size-1 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_6px_1px_rgba(139,140,248,0.6)]" />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* real modules, attached to the chain */}
      {modules.length > 0 && (
        <div className="relative mt-5 border-t border-border/60 pt-4 md:mt-6 md:pt-5">
          <p className="font-mono text-xs tracking-widest text-muted-foreground/70 uppercase">
            {copy.modules}
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {modules.map((module, i) => (
              <motion.li
                key={module.name}
                custom={i}
                variants={chipVariants}
                initial={reduceMotion ? false : "hidden"}
                whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs",
                  quiet
                    ? "border-dashed border-border bg-background/40 text-muted-foreground"
                    : "border-border bg-background/50 text-foreground/85",
                )}
              >
                <span className="font-mono text-accent/80">M{i + 1}</span>
                {module.name}
              </motion.li>
            ))}
          </ul>
        </div>
      )}

      {/* No status footer here: the case-study hero's status badge sits inches
          away in the same fold and says exactly the same thing. One statement of
          status per screen. */}
    </div>
  );
}
