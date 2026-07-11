"use client";

import { motion, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export interface TeardownStage {
  /** Matches the section's data-teardown attribute. */
  id: string;
  num: string;
  label: string;
  sub: string;
}

/**
 * Sticky teardown progression rail for case-study pages (desktop only).
 * Watches the server-rendered stage sections via IntersectionObserver and a
 * passive scroll listener — no pinned scenes, no scroll hijacking. Under
 * prefers-reduced-motion the rail renders fully lit and static.
 */
export function TeardownRail({
  stages,
  ariaLabel = "İnceleme aşamaları",
}: {
  stages: TeardownStage[];
  ariaLabel?: string;
}) {
  const reduceMotion = useReducedMotion();
  const [scrollActive, setScrollActive] = useState(0);
  const progress = useSpring(0, { stiffness: 90, damping: 28, mass: 0.4 });
  // Under reduced motion the rail renders fully lit and static.
  const active = reduceMotion ? stages.length - 1 : scrollActive;

  useEffect(() => {
    if (reduceMotion) {
      progress.jump(1);
      return;
    }
    const els = stages
      .map((s) => document.querySelector(`[data-teardown="${s.id}"]`))
      .filter((el): el is Element => el !== null);
    if (els.length === 0) return;

    // active stage = the section crossing the vertical center band
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = els.indexOf(entry.target);
            if (index >= 0) setScrollActive(index);
          }
        }
      },
      { rootMargin: "-45% 0px -45%", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));

    // rail fill = reading progress across the staged sections
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const first = els[0].getBoundingClientRect();
        const last = els[els.length - 1].getBoundingClientRect();
        const start = first.top + window.scrollY - window.innerHeight * 0.6;
        const end =
          last.top + window.scrollY + last.height - window.innerHeight * 0.45;
        const p = (window.scrollY - start) / Math.max(1, end - start);
        progress.set(Math.min(1, Math.max(0, p)));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduceMotion, stages, progress]);

  return (
    <nav aria-label={ariaLabel} className="relative">
      <div
        aria-hidden
        className="absolute top-1 bottom-1 left-[5px] w-px bg-border"
      />
      <motion.div
        aria-hidden
        style={{ scaleY: progress }}
        className="absolute top-1 bottom-1 left-[5px] w-px origin-top bg-accent/70"
      />
      <ul className="space-y-7">
        {stages.map((stage, index) => (
          <li key={stage.id} className="relative pl-6">
            <span
              aria-hidden
              className={cn(
                "absolute top-1 left-0 size-[11px] rounded-full border transition-all duration-500",
                index <= active
                  ? "border-accent bg-accent/80 shadow-[0_0_10px_2px_rgba(139,140,248,0.35)]"
                  : "border-border bg-card",
              )}
            />
            <a
              href={`#teardown-${stage.id}`}
              className="group block outline-none"
            >
              <p
                className={cn(
                  "font-mono text-xs tracking-widest uppercase transition-colors duration-500 group-hover:text-foreground group-focus-visible:text-foreground",
                  index === active
                    ? "text-foreground"
                    : "text-muted-foreground/70",
                )}
              >
                {stage.num} {stage.label}
              </p>
              <p
                className={cn(
                  "mt-0.5 text-xs transition-colors duration-500",
                  index === active
                    ? "text-muted-foreground"
                    : "text-muted-foreground/40",
                )}
              >
                {stage.sub}
              </p>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
