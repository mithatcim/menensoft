import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Fragment } from "react";

import { BrowserFrame, ScreenshotSlot } from "@/components/shared/browser-frame";
import { SpotlightCard } from "@/components/shared/spotlight-card";
import { TechTag } from "@/components/shared/tech-tag";
import {
  projectImage,
  projectStatusLabel,
  type Project,
} from "@/content/projects";
import { cn } from "@/lib/utils";

function StatusBadge({ project }: { project: Project }) {
  return (
    <p className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
      <span
        aria-hidden
        className="size-1.5 rounded-full bg-accent/90 shadow-[0_0_8px_1px_rgba(139,140,248,0.5)]"
      />
      {projectStatusLabel[project.status]}
    </p>
  );
}

function HoverArrow({ className }: { className?: string }) {
  return (
    <ArrowUpRight
      className={`size-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground ${className ?? ""}`}
    />
  );
}

const LIFT =
  "transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_56px_-24px_rgba(0,0,0,0.85)]";

/** Desktop hover overlay: the project's real system flow as a mini diagram. */
function FlowOverlay({ flow }: { flow: string[] }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 hidden translate-y-2 border-t border-accent/25 bg-background/95 px-5 py-3.5 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:block"
    >
      <div className="flex flex-wrap items-center gap-1.5">
        {flow.map((node, index) => (
          <Fragment key={node}>
            {index > 0 && (
              <ArrowRight className="size-3 shrink-0 text-accent/60" />
            )}
            <span className="font-mono text-xs text-foreground/80">
              {node}
            </span>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  // Prototype/archived work reads intentionally quieter than shipped work;
  // shipped work carries a faint accent edge and livelier hover.
  const quiet = project.status === "prototype" || project.status === "archived";

  return (
    <SpotlightCard
      href={`/projects/${project.slug}`}
      className={cn(
        "flex h-full flex-col rounded-xl border bg-card/70 p-6 backdrop-blur-sm",
        quiet
          ? "border-dashed border-border ring-1 ring-white/5 hover:border-foreground/20"
          : "border-border ring-1 ring-accent/10 hover:border-accent/30 hover:ring-accent/20",
        LIFT,
      )}
    >
      <div className="relative flex items-start justify-between gap-4">
        <StatusBadge project={project} />
        <HoverArrow className="mt-0.5" />
      </div>
      <h3
        className={cn(
          "relative mt-4 text-lg font-semibold tracking-tight text-balance",
          quiet && "text-foreground/85",
        )}
      >
        {project.name}
      </h3>
      <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
        {project.oneLiner}
      </p>
      <div className="relative mt-auto pt-6">
        <div className="flex flex-wrap gap-2 border-t border-border/60 pt-4">
          {project.stack.map((tech) => (
            <TechTag key={tech}>{tech}</TechTag>
          ))}
        </div>
      </div>
      {project.flow && <FlowOverlay flow={project.flow} />}
    </SpotlightCard>
  );
}

/**
 * Full-width flagship treatment for the first project on the projects page:
 * content on the left, browser-frame placeholder and system flow on the right.
 */
export function ProjectCardLead({ project }: { project: Project }) {
  return (
    <SpotlightCard
      href={`/projects/${project.slug}`}
      className={cn(
        "grid gap-8 rounded-xl border border-border bg-card/70 p-6 ring-1 ring-white/5 backdrop-blur-sm md:grid-cols-[minmax(0,1fr)_minmax(0,380px)] md:p-8",
        LIFT,
      )}
    >
      <div className="relative flex flex-col">
        <div className="flex items-start justify-between gap-4">
          <StatusBadge project={project} />
          <HoverArrow className="mt-0.5 md:hidden" />
        </div>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-balance md:text-3xl">
          {project.name}
        </h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          {project.oneLiner}
        </p>
        <p className="mt-3 hidden text-sm leading-relaxed text-muted-foreground/80 md:block">
          {project.problem}
        </p>
        <div className="mt-auto pt-6">
          <div className="flex flex-wrap gap-2 border-t border-border/60 pt-4">
            {project.stack.map((tech) => (
              <TechTag key={tech}>{tech}</TechTag>
            ))}
          </div>
        </div>
      </div>
      <div className="relative hidden md:block">
        <BrowserFrame title={`/${project.slug}`} image={projectImage(project)}>
          <ScreenshotSlot label="Interface capture to be added" />
        </BrowserFrame>
        {project.flow && (
          <div className="mt-4 flex flex-wrap items-center gap-1.5 px-1">
            {project.flow.map((node, index) => (
              <Fragment key={node}>
                {index > 0 && (
                  <ArrowRight
                    aria-hidden
                    className="size-3 shrink-0 text-muted-foreground/50"
                  />
                )}
                <span className="font-mono text-xs text-muted-foreground">
                  {node}
                </span>
              </Fragment>
            ))}
          </div>
        )}
      </div>
    </SpotlightCard>
  );
}
