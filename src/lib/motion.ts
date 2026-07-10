import type { Variants } from "motion/react";

/** Shared premium easing (fast-out, settle). */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/**
 * Global intensity lever for purely decorative infinite animations
 * (telemetry pulses, connector pulses, reserved-frame scan sweeps).
 * Set to false to calm the whole site in one change — content motion
 * (reveals, scene assembly, selection transitions) is unaffected.
 * prefers-reduced-motion overrides everything regardless of this flag.
 */
export const DECOR_PULSES = true;

/* ------------------------- pinned-scene variants -------------------------
 * Shared by the home flagship story and the services request scene so both
 * scenes speak exactly the same motion language. Stage panels crossfade with
 * weight; their children assemble with stagger.
 */

export const scenePanelVariants: Variants = {
  active: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: EASE_OUT,
      staggerChildren: 0.07,
      delayChildren: 0.18,
    },
  },
  past: {
    opacity: 0,
    y: -26,
    scale: 0.97,
    transition: { duration: 0.55, ease: EASE_OUT },
  },
  future: {
    opacity: 0,
    y: 26,
    scale: 0.97,
    transition: { duration: 0.55, ease: EASE_OUT },
  },
};

export const sceneItemVariants: Variants = {
  active: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } },
  past: { opacity: 0, y: -8 },
  future: { opacity: 0, y: 10 },
};

export const sceneFadeVariants: Variants = {
  active: { opacity: 1, transition: { duration: 0.5, ease: EASE_OUT } },
  past: { opacity: 0 },
  future: { opacity: 0 },
};
