"use client";

import { motion, useReducedMotion } from "motion/react";
import { Fragment } from "react";

import { DECOR_PULSES, EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Abstract system-flow strip: mono node chips joined by connector lines.
 * Nodes light up sequentially as the panel scrolls into view, and once
 * assembled a small data pulse travels each connector (DECOR_PULSES-gated,
 * dropped entirely under prefers-reduced-motion) — the flow reads as running,
 * not just listed.
 *
 * `label` is optional: on the project pages the stage chip and the h2 directly
 * above already say "Sistem akışı", so printing it a third time inside the
 * panel was pure noise. Pass a label only where nothing above names the panel.
 */
export function FlowPanel({
  label,
  nodes,
  className,
}: {
  label?: string;
  nodes: readonly string[];
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={cn("rounded-xl border border-border bg-card p-5", className)}>
      {label && (
        <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
          <span aria-hidden className="size-1.5 bg-accent/90" />
          {label}
        </p>
      )}
      <div className={cn("flex flex-wrap items-center gap-2", label && "mt-4")}>
        {nodes.map((node, index) => (
          <Fragment key={node}>
            {index > 0 && (
              <motion.span
                aria-hidden
                className="relative h-px w-6 shrink-0 bg-gradient-to-r from-border via-accent/50 to-border"
                initial={reduceMotion ? false : { opacity: 0 }}
                whileInView={reduceMotion ? undefined : { opacity: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.35,
                  delay: index * 0.14,
                  ease: EASE_OUT,
                }}
              >
                {DECOR_PULSES && !reduceMotion && (
                  <motion.span
                    className="absolute top-1/2 size-1 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_6px_1px_rgba(99,102,241,0.5)]"
                    initial={{ left: "0%", opacity: 0 }}
                    animate={{ left: ["0%", "100%"], opacity: [0, 1, 0] }}
                    transition={{
                      duration: 1.6,
                      repeat: Infinity,
                      repeatDelay: 1.2,
                      delay: 1 + index * 0.5,
                      ease: "easeInOut",
                    }}
                  />
                )}
              </motion.span>
            )}
            <motion.span
              className="rounded-md border border-accent/30 bg-background px-3 py-1.5 font-mono text-xs text-foreground/90 shadow-sm"
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.45,
                delay: index * 0.14,
                ease: EASE_OUT,
              }}
            >
              {node}
            </motion.span>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
