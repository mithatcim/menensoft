"use client";

import { motion, useReducedMotion } from "motion/react";

import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Hairline that draws itself from the left as it enters the viewport. */
export function GrowLine({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      aria-hidden
      className={cn(
        "h-px origin-left bg-gradient-to-r from-border via-accent/40 to-border",
        className,
      )}
      initial={reduceMotion ? false : { scaleX: 0 }}
      whileInView={reduceMotion ? undefined : { scaleX: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1.1, ease: EASE_OUT }}
    />
  );
}
