import { SpotlightCard } from "@/components/shared/spotlight-card";
import type { Project } from "@/lib/projects/types";
import { type Locale } from "@/lib/locale";
import { cn } from "@/lib/utils";

const DOSSIER_COPY = {
  tr: {
    dossier: "Sistem dosyası",
    compact: "kompakt dosya",
    explored: "Neye odaklandı",
    constraints: "Kısıtlar",
    lower: (s: string) => s.toLocaleLowerCase("tr-TR"),
  },
  en: {
    dossier: "System dossier",
    compact: "compact dossier",
    explored: "What it focused on",
    constraints: "Constraints",
    lower: (s: string) => s.toLowerCase(),
  },
} as const;

/**
 * System Dossier pieces (Phase 8C). These render the owner-approved dossier
 * content from src/content/projects.ts and are composed into the existing
 * teardown stages: summary strip near the top, constraints inside stage 01,
 * module cards inside stage 03. Internal-tier projects render the compact
 * dossier so their brevity reads deliberate, not empty.
 * Server components; motion comes from the surrounding Reveal wrappers.
 */

export function isCompactDossier(project: Project) {
  return project.tier === "internal";
}

/**
 * Phase 21: DossierSummary is gone. The case-study hero now leads with
 * `dossierSummary` itself, so a second panel repeating it a screen later was
 * pure duplication. The compact-dossier distinction it used to carry lives on
 * in the hero's tier-aware status badge.
 */

export function DossierConstraints({
  project,
  locale = "tr",
  showLabel = true,
}: {
  project: Project;
  locale?: Locale;
  /** Off when the surrounding stage heading already names this block. */
  showLabel?: boolean;
}) {
  if (!project.constraints || project.constraints.length === 0) return null;
  const compact = isCompactDossier(project);
  const copy = DOSSIER_COPY[locale];

  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-4">
      {showLabel && (
        <p className="mb-3 font-mono text-xs tracking-widest text-muted-foreground/80 uppercase">
          {compact ? copy.explored : copy.constraints}
        </p>
      )}
      <ul className="space-y-2">
        {project.constraints.map((c) => (
          <li
            key={c}
            className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
          >
            <span
              aria-hidden
              className="mt-2 size-1 shrink-0 rotate-45 bg-accent/70"
            />
            {c}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DossierModules({ project }: { project: Project }) {
  if (!project.modules || project.modules.length === 0) return null;
  const compact = isCompactDossier(project);

  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-2">
      {project.modules.map((module, i) => (
        <SpotlightCard
          key={module.name}
          className={cn(
            "rounded-xl border bg-card/70 p-4 ring-1 transition-colors duration-300",
            compact
              ? "border-dashed border-border ring-white/5"
              : "border-border ring-white/5 hover:border-accent/25",
          )}
        >
          <p className="flex items-center justify-between gap-3">
            <span className="font-mono text-xs text-accent/80">
              M{i + 1}
            </span>
            <span
              aria-hidden
              className={cn(
                "size-1.5 rounded-full",
                compact ? "bg-accent/40" : "bg-accent/80",
              )}
            />
          </p>
          <h3
            className={cn(
              "mt-2 text-sm font-semibold tracking-tight",
              compact && "text-foreground/85",
            )}
          >
            {module.name}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {module.note}
          </p>
        </SpotlightCard>
      ))}
    </div>
  );
}
