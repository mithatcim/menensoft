import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { TechTag } from "@/components/shared/tech-tag";
import { projectStatusLabel, type Project } from "@/content/projects";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-foreground/25"
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold tracking-tight text-balance">
          {project.name}
        </h3>
        <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {project.oneLiner}
      </p>
      <div className="mt-auto pt-6">
        <p className="font-mono text-xs text-muted-foreground">
          {projectStatusLabel[project.status]}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <TechTag key={tech}>{tech}</TechTag>
          ))}
        </div>
      </div>
    </Link>
  );
}
