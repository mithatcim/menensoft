"use client";

import { createContext, useContext, useMemo } from "react";

import type { PublicProject } from "@/lib/projects/types";

/**
 * Published projects, made available to CLIENT components (Phase 38C).
 *
 * The hero, the opening showcase, the system layers and the inquiry wizard all
 * need to look a project up by slug to render a proof chip. They are client
 * components, so they cannot query the database — and they must not: that is the
 * one rule the whole data model rests on.
 *
 * So the root layout (a server component) fetches the published inventory once
 * and hands it down through this provider. The alternative was drilling the same
 * array through six levels of props to reach a chip.
 *
 * What crosses to the browser is exactly what the page already renders: names,
 * one-liners, slugs, stacks. There are no drafts here (the query filters on
 * status='published'), no internal notes, and no connection string.
 */

const ProjectIndexContext = createContext<PublicProject[]>([]);

export function ProjectIndexProvider({
  projects,
  children,
}: {
  projects: PublicProject[];
  children: React.ReactNode;
}) {
  return (
    <ProjectIndexContext.Provider value={projects}>
      {children}
    </ProjectIndexContext.Provider>
  );
}

/** Every published project, in running order. */
export function usePublishedProjects(): PublicProject[] {
  return useContext(ProjectIndexContext);
}

/**
 * Look a project up by slug.
 *
 * Returns undefined for an unknown, draft or archived slug — the same shape the
 * old `getProject()` returned for a slug that did not exist, so every caller's
 * existing "no proof chip" branch keeps working unchanged.
 */
export function useProjectLookup(): (slug: string) => PublicProject | undefined {
  const projects = usePublishedProjects();

  return useMemo(() => {
    const bySlug = new Map(projects.map((project) => [project.slug, project]));
    return (slug: string) => bySlug.get(slug);
  }, [projects]);
}
