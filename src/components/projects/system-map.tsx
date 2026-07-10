"use client";

import { motion, useReducedMotion } from "motion/react";

import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Per-project system inspection pieces for the command deck.
 *
 * SystemMap renders the project's real flow as a vertical node chain with
 * drawn connectors, plus its real built-list as attached modules. It is
 * mounted fresh per selected project (keyed by the panel), so the draw
 * choreography replays on selection. CapabilityMatrix lights only the
 * capability categories a project's published built-list actually
 * exercises — dim cells are honest, not decorative.
 */

const rowVariant = {
  hidden: { opacity: 0, x: -10 },
  show: (d: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, delay: d, ease: EASE_OUT },
  }),
};

export function SystemMap({
  flow,
  modules,
  quiet,
  className,
}: {
  flow: string[];
  modules: string[];
  quiet?: boolean;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const shownModules = modules.slice(0, 4);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-background/40 p-4",
        className,
      )}
    >
      <div aria-hidden className="scanlines absolute inset-0 opacity-40" />
      <p className="relative flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
        <span aria-hidden className="size-1.5 bg-accent/90" />
        System map
      </p>

      {/* vertical flow chain with drawn connectors */}
      <div className="relative mt-4">
        {flow.map((node, i) => (
          <div key={node}>
            <motion.div
              custom={0.1 + i * 0.14}
              variants={rowVariant}
              initial={reduceMotion ? false : "hidden"}
              animate="show"
              className="flex items-center gap-2.5"
            >
              <span
                aria-hidden
                className={cn(
                  "size-1.5 shrink-0 rounded-full",
                  quiet ? "bg-accent/50" : "bg-accent/90",
                )}
              />
              <span className="rounded-md border border-border bg-card px-2.5 py-1 font-mono text-xs text-foreground/85">
                {node}
              </span>
            </motion.div>
            {i < flow.length - 1 && (
              <motion.span
                aria-hidden
                initial={reduceMotion ? false : { scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{
                  duration: 0.3,
                  delay: 0.18 + i * 0.14,
                  ease: EASE_OUT,
                }}
                className="ml-[2.5px] block h-4 w-px origin-top bg-gradient-to-b from-accent/50 to-border"
              />
            )}
          </div>
        ))}
      </div>

      {/* real modules attached to the chain */}
      {shownModules.length > 0 && (
        <div className="relative mt-4 border-t border-border/60 pt-3">
          <p className="font-mono text-xs tracking-widest text-muted-foreground/70 uppercase">
            Modules
          </p>
          <ul className="mt-2 space-y-1.5">
            {shownModules.map((m, i) => (
              <motion.li
                key={m}
                custom={0.35 + i * 0.08}
                variants={rowVariant}
                initial={reduceMotion ? false : "hidden"}
                animate="show"
                className="flex items-center gap-2 text-xs leading-relaxed text-muted-foreground"
              >
                <span aria-hidden className="size-1 shrink-0 bg-accent/60" />
                {m}
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ---------------------------- capability matrix --------------------------- */

const CATEGORIES = [
  { id: "interface", label: "Interface" },
  { id: "admin", label: "Admin / dashboard" },
  { id: "data", label: "Data model" },
  { id: "automation", label: "Automation" },
  { id: "operations", label: "Operations" },
  { id: "security", label: "Security / logging" },
  { id: "content", label: "Content mgmt" },
  { id: "ordering", label: "Ordering / workflow" },
  { id: "membership", label: "Membership / publishing" },
] as const;

/**
 * Lit categories per project, derived strictly from each published
 * built-list (see src/content/projects.ts):
 * - ecommerce-cms: storefront (interface), admin dashboard, product/category
 *   management (data), visual page-building (content).
 * - restaurant-qr-system: QR menu (interface + ordering), waiter/kitchen/
 *   cashier screens (admin + operations), order routing across roles
 *   (automation), full-stack (data).
 * - orva-psychology: public website (interface), admin panel (admin),
 *   content management (content), stored content (data).
 * - log-management-platform: log collection/storage (data + security),
 *   review interface (admin), review workflow (operations).
 * - cendovar: membership accounts (data + membership), publishing signal
 *   records to members (automation + membership).
 */
const LIT: Record<string, string[]> = {
  "ecommerce-cms": ["interface", "admin", "data", "content"],
  "restaurant-qr-system": [
    "interface",
    "admin",
    "data",
    "automation",
    "operations",
    "ordering",
  ],
  "orva-psychology": ["interface", "admin", "data", "content"],
  "log-management-platform": ["data", "admin", "operations", "security"],
  cendovar: ["data", "automation", "membership"],
};

export function CapabilityMatrix({
  slug,
  quiet,
  className,
}: {
  slug: string;
  quiet?: boolean;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const lit = new Set(LIT[slug] ?? []);

  return (
    <div className={className}>
      <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
        <span aria-hidden className="size-1.5 bg-accent/90" />
        Capability matrix
        <span className="text-muted-foreground/50">
          {lit.size} / {CATEGORIES.length}
        </span>
      </p>
      <div className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
        {CATEGORIES.map((cat, i) => {
          const on = lit.has(cat.id);
          return (
            <motion.div
              key={cat.id}
              custom={0.1 + i * 0.04}
              variants={rowVariant}
              initial={reduceMotion ? false : "hidden"}
              animate="show"
              className={cn(
                "flex items-center gap-2 rounded-md border px-2.5 py-1.5",
                on
                  ? cn(
                      "border-accent/25 bg-accent/5",
                      quiet && "border-accent/15 bg-accent/[0.03]",
                    )
                  : "border-border/50 bg-transparent",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "size-1.5 shrink-0 rounded-full",
                  on
                    ? quiet
                      ? "bg-accent/60"
                      : "bg-accent/90"
                    : "border border-muted-foreground/30",
                )}
              />
              <span
                className={cn(
                  "truncate text-xs",
                  on ? "text-foreground/85" : "text-muted-foreground/45",
                )}
              >
                {cat.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
