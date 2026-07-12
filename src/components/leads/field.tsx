"use client";

import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Form primitives shared by the inquiry studio's send panel and the contact
 * page's short-message form (Phase 33C). One place, so the two forms cannot
 * drift into looking like they came from different sites.
 */

export const inputClass = cn(
  "w-full rounded-md border border-border/70 bg-background/70 px-3 py-2 text-sm text-foreground",
  "placeholder:text-muted-foreground/50",
  "transition-colors hover:border-foreground/20",
  "focus-visible:border-accent/50 focus-visible:ring-1 focus-visible:ring-accent/30 focus-visible:outline-none",
  // 44px tall: a phone keyboard is unforgiving and this is the last step before
  // the visitor becomes a lead. Not the place to save 6px.
  "min-h-11",
);

export function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="flex items-baseline justify-between gap-2 font-mono text-xs tracking-widest text-muted-foreground/70 uppercase"
      >
        <span className="min-w-0">{label}</span>
        {hint && (
          <span className="shrink-0 text-muted-foreground/40 normal-case">
            {hint}
          </span>
        )}
      </label>
      <div className="mt-1.5">{children}</div>
      {/* role=alert so a screen reader hears the problem instead of silently
          failing to submit — the classic way an inaccessible form loses a lead */}
      {error && (
        <p role="alert" className="mt-1.5 text-xs leading-relaxed text-accent">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * A field no human ever sees, so a value in it is a bot. Hidden from assistive
 * tech too (aria-hidden + tabIndex -1) — a screen-reader user must not be
 * offered a trap they could fall into.
 *
 * Not `display: none`: some bots skip fields that are obviously hidden. This one
 * is out of the layout but nominally "present".
 */
export function Honeypot({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
    >
      <label htmlFor="lead-company">{label}</label>
      <input
        id="lead-company"
        name="company"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
