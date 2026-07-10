"use client";

import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

import {
  CapabilityMatrix,
  SystemMap,
} from "@/components/projects/system-map";
import { BrowserFrame, ScreenshotSlot } from "@/components/shared/browser-frame";
import { TechTag } from "@/components/shared/tech-tag";
import { buttonVariants } from "@/components/ui/button";
import { projectImage, type Project } from "@/content/projects";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Projects Command Deck: a mission-control index for the project fleet.
 * Desktop: a tiered deck of selectable cards on the left with a sticky
 * inspection panel on the right. Mobile: the same deck as a vertical flow
 * where the selected card expands an inline preview — no sticky/pinned
 * behavior, no hover-only information.
 *
 * Everything shown comes from real project content; screenshot frames stay
 * honest reserved slots until real captures exist.
 */

interface Tier {
  id: string;
  label: string;
  quiet: boolean;
  match: (p: Project) => boolean;
}

const TIERS: Tier[] = [
  {
    id: "flagship",
    label: "Amiral gemisi — ürün altyapısı",
    quiet: false,
    match: (p) => p.slug === "ecommerce-cms",
  },
  {
    id: "delivered",
    label: "Tamamlanmış sistemler",
    quiet: false,
    match: (p) => p.tier === "delivered" && p.slug !== "ecommerce-cms",
  },
  {
    id: "internal",
    label: "İç altyapı & önceki çalışmalar",
    quiet: true,
    match: (p) => p.tier === "internal",
  },
];

function StatusBadge({ project }: { project: Project }) {
  return (
    <p className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
      <span
        aria-hidden
        className="size-1.5 rounded-full bg-accent/90 shadow-[0_0_8px_1px_rgba(139,140,248,0.5)]"
      />
      {project.statusLabel}
    </p>
  );
}

function PreviewBody({ project }: { project: Project }) {
  const quiet = project.tier === "internal";

  return (
    <div className="p-5 md:p-6">
      <StatusBadge project={project} />
      <h3 className="mt-3 text-xl font-semibold tracking-tight text-balance md:text-2xl">
        {project.name}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {project.oneLiner}
      </p>

      {/* system map beside the honest reserved frame */}
      <div className="mt-5 grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,236px)]">
        {project.flow && (
          <SystemMap
            flow={project.flow}
            modules={project.built}
            quiet={quiet}
          />
        )}
        <div>
          <BrowserFrame
            title={`/${project.slug}`}
            image={projectImage(project)}
          >
            <ScreenshotSlot label="Arayüz görseli için alan ayrıldı" />
          </BrowserFrame>
        </div>
      </div>

      <CapabilityMatrix slug={project.slug} quiet={quiet} className="mt-5" />

      <div className="mt-5 flex flex-wrap gap-2 border-t border-border/60 pt-4">
        {project.stack.map((tech) => (
          <TechTag key={tech}>{tech}</TechTag>
        ))}
      </div>

      {project.statusNote && (
        <div className="mt-4 rounded-lg border border-border/60 bg-background/40 p-3.5">
          <p className="font-mono text-xs tracking-widest text-muted-foreground/70 uppercase">
            Güncel kapsam
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            {project.statusNote}
          </p>
        </div>
      )}

      <div className="mt-5 flex items-center justify-between gap-4">
        <Link
          href={`/projects/${project.slug}`}
          className={cn(buttonVariants({ variant: "outline" }), "h-10 px-5")}
        >
          Proje detayını aç
          <ArrowUpRight className="size-4" />
        </Link>
        {/* dürüst telemetri: yalnızca gerçek içerikten türetilen sayılar */}
        <p className="font-mono text-xs text-muted-foreground/70">
          {project.built.length} modül · {project.stack.length} teknoloji
        </p>
      </div>
    </div>
  );
}

/** Desktop inspection panel — crossfades between selected projects. */
function PreviewPanel({ project }: { project: Project }) {
  const reduceMotion = useReducedMotion();
  return (
    <div
      role="region"
      aria-label="Seçili proje önizlemesi"
      className="overflow-hidden rounded-xl border border-border bg-card/60 ring-1 ring-white/5 backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 border-b border-border bg-background/40 px-4 py-2.5">
        <span aria-hidden className="flex gap-1.5">
          <span className="size-2.5 rounded-full border border-border bg-muted/60" />
          <span className="size-2.5 rounded-full border border-border bg-muted/60" />
          <span className="size-2.5 rounded-full border border-border bg-muted/60" />
        </span>
        <p className="min-w-0 flex-1 truncate text-center font-mono text-xs text-muted-foreground">
          deck://{project.slug}
        </p>
        <span
          aria-hidden
          className="size-1.5 rounded-full bg-accent shadow-[0_0_8px_1px_rgba(139,140,248,0.6)]"
        />
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={project.slug}
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: reduceMotion ? 0 : 0.28, ease: EASE_OUT }}
        >
          <PreviewBody project={project} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function DeckCard({
  project,
  index,
  quiet,
  flagship,
  selected,
  onSelect,
}: {
  project: Project;
  index: number;
  quiet: boolean;
  flagship: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={
        reduceMotion ? false : { opacity: 0, y: 34 + index * 8, scale: 0.965 }
      }
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.07, ease: EASE_OUT }}
      className={cn(
        "group relative w-full overflow-hidden rounded-xl border transition-all duration-300",
        flagship ? "p-6" : "p-5",
        quiet
          ? "border-dashed border-border bg-card/50"
          : "border-border bg-card/70",
        selected
          ? "border-accent/50 shadow-[0_20px_48px_-24px_rgba(99,102,241,0.4)] ring-1 ring-accent/25"
          : "ring-1 ring-white/5 hover:-translate-y-0.5 hover:border-foreground/20",
      )}
    >
      {/* full-card select action, under the content layer */}
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        aria-label={`Projeyi seç: ${project.name}`}
        className="absolute inset-0 z-10 cursor-pointer rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-0 left-0 z-20 w-0.5 transition-colors duration-300",
          selected ? "bg-accent" : "bg-transparent",
        )}
      />
      {/* content passes clicks through to the select button; the case-study
          anchor stays a real link so every project is reachable without JS */}
      <div className="pointer-events-none relative z-20">
        <div className="flex items-start justify-between gap-4">
          <StatusBadge project={project} />
          <span className="flex items-center gap-3">
            <span
              className={cn(
                "font-mono text-xs transition-colors",
                selected ? "text-accent" : "text-muted-foreground/50",
              )}
            >
              {selected ? "seçili" : "seç"}
            </span>
            <Link
              href={`/projects/${project.slug}`}
              aria-label={`${project.name} proje detayını aç`}
              className="pointer-events-auto -m-1 p-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowUpRight className="size-4" />
            </Link>
          </span>
        </div>
        <h3
          className={cn(
            "mt-3 font-semibold tracking-tight text-balance",
            flagship ? "text-xl md:text-2xl" : "text-lg",
            quiet && "text-foreground/85",
          )}
        >
          {project.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {project.oneLiner}
        </p>
        {flagship && (
          <p className="mt-2 hidden text-sm leading-relaxed text-muted-foreground/80 md:block">
            {project.problem}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export function ProjectCommandDeck({ projects }: { projects: Project[] }) {
  const [selectedSlug, setSelectedSlug] = useState(projects[0]?.slug);
  const reduceMotion = useReducedMotion();
  const selected =
    projects.find((p) => p.slug === selectedSlug) ?? projects[0];

  let cardIndex = 0;

  return (
    <div className="mt-10 items-start gap-8 lg:grid lg:grid-cols-[minmax(0,430px)_minmax(0,1fr)]">
      {/* deck */}
      <div className="space-y-8">
        {TIERS.map((tier) => {
          const tierProjects = projects.filter(tier.match);
          if (tierProjects.length === 0) return null;
          return (
            <div key={tier.id}>
              <p
                className={cn(
                  "flex items-center gap-2 font-mono text-xs tracking-widest uppercase",
                  tier.quiet
                    ? "text-muted-foreground/60"
                    : "text-muted-foreground",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "size-1.5",
                    tier.quiet ? "bg-muted-foreground/40" : "bg-accent/90",
                  )}
                />
                {tier.label}
              </p>
              <div className="mt-4 space-y-4">
                {tierProjects.map((project) => {
                  const index = cardIndex++;
                  const isSelected = project.slug === selected.slug;
                  return (
                    <div key={project.slug}>
                      <DeckCard
                        project={project}
                        index={index}
                        quiet={tier.quiet}
                        flagship={tier.id === "flagship"}
                        selected={isSelected}
                        onSelect={() => setSelectedSlug(project.slug)}
                      />
                      {/* mobile inline preview under the selected card */}
                      <div className="lg:hidden">
                        <AnimatePresence initial={false}>
                          {isSelected && (
                            <motion.div
                              key="preview"
                              initial={
                                reduceMotion
                                  ? false
                                  : { height: 0, opacity: 0 }
                              }
                              animate={{ height: "auto", opacity: 1 }}
                              exit={
                                reduceMotion
                                  ? { opacity: 0 }
                                  : { height: 0, opacity: 0 }
                              }
                              transition={{
                                duration: reduceMotion ? 0 : 0.35,
                                ease: EASE_OUT,
                              }}
                              className="overflow-hidden"
                            >
                              <div className="mt-3 rounded-xl border border-accent/25 bg-card/60 ring-1 ring-white/5">
                                <PreviewBody project={project} />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* desktop inspection panel */}
      <div className="sticky top-24 hidden lg:block">
        <PreviewPanel project={selected} />
      </div>
    </div>
  );
}
