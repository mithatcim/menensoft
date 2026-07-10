"use client";

import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Fragment } from "react";

import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Abstract system-flow strip: mono node chips joined by arrows.
 * Nodes light up sequentially as the panel scrolls into view.
 */
export function FlowPanel({
  label = "System flow",
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
      <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
        <span aria-hidden className="size-1.5 bg-accent/90" />
        {label}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {nodes.map((node, index) => (
          <Fragment key={node}>
            {index > 0 && (
              <motion.span
                aria-hidden
                className="flex shrink-0"
                initial={reduceMotion ? false : { opacity: 0 }}
                whileInView={reduceMotion ? undefined : { opacity: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.35,
                  delay: index * 0.14,
                  ease: EASE_OUT,
                }}
              >
                <ArrowRight className="size-3.5 text-accent/60" />
              </motion.span>
            )}
            <motion.span
              className="rounded-md border border-border bg-background/50 px-3 py-1.5 font-mono text-xs text-foreground/80"
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
