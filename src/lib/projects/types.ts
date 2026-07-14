/**
 * The project shape, and the pure helpers over it.
 *
 * This lives in lib, not in content, because since Phase 38C the CONTENT comes
 * from the database — src/content/projects.ts is a rollback reference, not the
 * source of truth. A component importing a type from a content file it no longer
 * reads is exactly the kind of thing that makes people believe the old file is
 * still live. The dependency now points the right way: content imports the shape
 * from here.
 */

export type ProjectTier = "delivered" | "internal";

export interface Project {
  slug: string;
  name: string;
  oneLiner: string;
  problem: string;
  built: string[];
  stack: string[];
  /** Visual hierarchy: delivered work vs internal/earlier work. */
  tier: ProjectTier;
  /** Visitor-facing status label, per project, in the page's language. */
  statusLabel: string;
  featured: boolean;
  year?: string;
  role?: string;
  /** One honest paragraph about where the project stands today. */
  statusNote?: string;
  /** Project-specific "I want one like this" CTA. Target is always the wizard. */
  similarCta?: string;
  /** Abstract system flow, derived from what was actually built. */
  flow?: string[];
  dossierSummary?: string;
  constraints?: string[];
  modules?: { name: string; note: string }[];
  liveUrl?: string;
  repoUrl?: string;
  /** A real interface capture under /public; absent means an honest reserved frame. */
  image?: string;
  imageAlt?: string;
}

/**
 * A project as the public site sees it since 38C: the same shape, plus the fit
 * id the database now carries.
 *
 * `fitId` is optional and deliberately absent from `Project` itself. The typed
 * files never had it — the mapping lived in fit.ts — and adding it to the base
 * shape would make the 38A parity proof report an invented field on every
 * project. Components read `project.fitId ?? projectToFitType[slug]`, so a
 * project created in the admin panel gets its system chip from the database
 * while the five original ones keep resolving through the old map.
 */
export type PublicProject = Project & { fitId?: string };

export function projectImage(project: Project) {
  if (!project.image) return undefined;
  return {
    src: project.image,
    alt: project.imageAlt ?? `${project.name} arayüzü`,
  };
}
