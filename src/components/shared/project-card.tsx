import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { TechTag } from "@/components/shared/tech-tag";
import { projectStatusLabel, type Project } from "@/content/projects";

function StatusBadge({ project }: { project: Project }) {
  return (
    <p className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
      <span aria-hidden className="size-1.5 rounded-full bg-amber-400/90" />
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

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-foreground/20 hover:bg-muted/20"
    >
      <div className="flex items-start justify-between gap-4">
        <StatusBadge project={project} />
        <HoverArrow className="mt-0.5" />
      </div>
      <h3 className="mt-4 text-lg font-semibold tracking-tight text-balance">
        {project.name}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {project.oneLiner}
      </p>
      <div className="mt-auto pt-6">
        <div className="flex flex-wrap gap-2 border-t border-border/60 pt-4">
          {project.stack.map((tech) => (
            <TechTag key={tech}>{tech}</TechTag>
          ))}
        </div>
      </div>
    </Link>
  );
}

/**
 * Full-width lead treatment for the first (flagship) project on the
 * projects page — resolves the 5-card grid into an intentional 1 + 4 layout.
 */
export function ProjectCardLead({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group grid gap-8 rounded-xl border border-border bg-card p-6 transition-colors hover:border-foreground/20 hover:bg-muted/20 md:grid-cols-[minmax(0,1fr)_minmax(0,320px)] md:p-8"
    >
      <div className="flex flex-col">
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
      <div className="hidden rounded-lg border border-border/60 bg-background/40 p-5 md:flex md:flex-col">
        <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          In this build
        </p>
        <ul className="mt-4 space-y-2.5">
          {project.built.map((item) => (
            <li
              key={item}
              className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
            >
              <span
                aria-hidden
                className="mt-2 size-1 shrink-0 bg-amber-400/80"
              />
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex justify-end pt-6">
          <HoverArrow />
        </div>
      </div>
    </Link>
  );
}
