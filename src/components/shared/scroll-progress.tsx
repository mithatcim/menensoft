"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Thin scroll-position bar pinned to the top edge of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-amber-400/70 via-amber-300 to-amber-400/30"
    />
  );
}
