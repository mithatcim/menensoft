"use client";

import { createContext, useContext, useMemo } from "react";

/**
 * Published projects, made available to CLIENT components (Phase 38C).
 *
 * The hero, the opening showcase, the system layers and the inquiry wizard each
 * need to look a project up by slug to render a proof chip. They are client
 * components, so they cannot query the database — and must not. The root layout
 * (a server component) fetches the inventory once and hands it down here, rather
 * than drilling the same array through six levels of props to reach a chip.
 *
 * IT CARRIES THREE SHORT FIELDS, AND THAT IS DELIBERATE.
 *
 * This value is serialised into the RSC payload of EVERY page, including pages
 * that show no project at all. Passing the full project objects put every
 * problem paragraph, module note and constraint list — about 8.5 KB — into the
 * HTML of every page on the site, to render chips that display a name and link
 * to a slug. Measured, then cut: a summary is all the browser ever needed.
 *
 * Anything that renders a project in FULL (the project pages, the command deck)
 * is a server component and reads the database directly.
 */

export interface ProjectSummary {
  slug: string;
  name: string;
  /** The hero status card prints this; it is a short label, not a paragraph. */
  statusLabel: string;
}

const ProjectIndexContext = createContext<ProjectSummary[]>([]);

export function ProjectIndexProvider({
  projects,
  children,
}: {
  projects: ProjectSummary[];
  children: React.ReactNode;
}) {
  return (
    <ProjectIndexContext.Provider value={projects}>
      {children}
    </ProjectIndexContext.Provider>
  );
}

/** Every published project, in running order. */
export function usePublishedProjects(): ProjectSummary[] {
  return useContext(ProjectIndexContext);
}

/**
 * Look a project up by slug.
 *
 * Returns undefined for an unknown, draft or archived slug — exactly what the
 * old `getProject()` returned for a slug that did not exist, so every caller's
 * existing "no proof chip" branch keeps working unchanged.
 */
export function useProjectLookup(): (slug: string) => ProjectSummary | undefined {
  const projects = usePublishedProjects();

  return useMemo(() => {
    const bySlug = new Map(projects.map((project) => [project.slug, project]));
    return (slug: string) => bySlug.get(slug);
  }, [projects]);
}
