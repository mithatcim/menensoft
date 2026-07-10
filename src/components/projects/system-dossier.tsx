import { SpotlightCard } from "@/components/shared/spotlight-card";
import { projectStatusLabel, type Project } from "@/content/projects";
import { cn } from "@/lib/utils";

/**
 * System Dossier pieces (Phase 8C). These render the owner-approved dossier
 * content from src/content/projects.ts and are composed into the existing
 * teardown stages: summary strip near the top, constraints inside stage 01,
 * module cards inside stage 03. Compact-tier projects (prototype/archived)
 * carry an explicit label so their brevity reads deliberate, not empty.
 * Server components; motion comes from the surrounding Reveal wrappers.
 */

export function isCompactDossier(project: Project) {
  return project.status === "prototype" || project.status === "archived";
}

export function DossierSummary({ project }: { project: Project }) {
  if (!project.dossierSummary) return null;
  const compact = isCompactDossier(project);
  const compactLabel =
    project.status === "archived" ? "archived prototype" : "internal prototype";

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card/60 ring-1 ring-white/5">
      <div aria-hidden className="scanlines absolute inset-0 opacity-30" />
      <div className="relative p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
            <span aria-hidden className="size-1.5 bg-accent/90" />
            System dossier
          </p>
          {compact && (
            <p className="rounded-md border border-border/60 bg-background/50 px-2 py-0.5 font-mono text-xs tracking-widest text-muted-foreground/80 uppercase">
              compact — {compactLabel}
            </p>
          )}
          <p className="ml-auto hidden font-mono text-xs text-muted-foreground/60 sm:block">
            {projectStatusLabel[project.status].toLowerCase()}
          </p>
        </div>
        <p
          className={cn(
            "mt-3 leading-relaxed text-pretty",
            compact
              ? "text-sm text-muted-foreground"
              : "text-base text-foreground/90 md:text-lg",
          )}
        >
          {project.dossierSummary}
        </p>
      </div>
    </div>
  );
}

export function DossierConstraints({ project }: { project: Project }) {
  if (!project.constraints || project.constraints.length === 0) return null;
  const compact = isCompactDossier(project);

  return (
    <div className="mt-5 rounded-xl border border-border/60 bg-background/40 p-4">
      <p className="font-mono text-xs tracking-widest text-muted-foreground/80 uppercase">
        {compact ? "What was explored" : "Constraints"}
      </p>
      <ul className="mt-3 space-y-2">
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
