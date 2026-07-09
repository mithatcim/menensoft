"use client";

import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Pointer-follow spotlight surface. Writes cursor position to CSS variables on
 * the element itself (no React state → no re-render per frame), which the
 * `.spotlight-layer` radial gradient reads. Renders as a Link when `href` is
 * provided, else a plain div.
 */
function handleMove(event: MouseEvent<HTMLElement>) {
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
  el.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
}

export function SpotlightCard({
  href,
  id,
  external,
  className,
  children,
}: {
  href?: string;
  id?: string;
  /** Open in a new tab with safe rel (for outbound links). */
  external?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const classes = cn("group relative overflow-hidden", className);
  const body = (
    <>
      <span
        aria-hidden
        className="spotlight-layer pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      {children}
    </>
  );

  if (href) {
    return (
      <Link
        id={id}
        href={href}
        onMouseMove={handleMove}
        className={classes}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        {body}
      </Link>
    );
  }

  return (
    <div id={id} onMouseMove={handleMove} className={classes}>
      {body}
    </div>
  );
}
