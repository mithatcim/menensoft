import { getPool } from "@/lib/db/postgres";

import type { Project, ProjectTier } from "@/lib/projects/types";

/**
 * Project CMS data access (Phase 38A).
 *
 * PREPARATION ONLY. Nothing public imports this yet — /projeler, /projeler/[slug],
 * /en/projects and /en/projects/[slug] all still read the typed content files,
 * and they will keep doing so until Phase 38C. This module exists so the
 * database content can be PROVED equal to those files before anything is
 * flipped over to it.
 *
 * The important function here is `toProject()`. The public pages are pure
 * functions of a `Project` object, so if the database can produce a `Project`
 * that is deep-equal to the typed one, the rendered pages are identical by
 * construction. That is the whole parity argument, and it is why this file maps
 * back to the EXISTING shape instead of inventing a new one.
 *
 * Every value is a bound parameter. Server-only: getPool() throws if it is ever
 * imported from the browser.
 */

export const LOCALES = ["tr", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export type ProjectStatus = "draft" | "published" | "archived";

/** A row as it lives in the database, before it is mapped back to `Project`. */
export interface CmsProject {
  id: string;
  slug: string;
  status: ProjectStatus;
  tier: ProjectTier;
  featured: boolean;
  sort_order: number;
  fit_id: string | null;
  /** 38E: capability matrix — a set of ids, language-neutral. */
  capabilities: string[];
  stack: string[];
  year: string | null;
  live_url: string | null;
  repo_url: string | null;
  image: string | null;
  image_alt: string | null;
  internal_notes: string | null;
  created_at: Date;
  updated_at: Date;
  published_at: Date | null;
  archived_at: Date | null;
}

export interface CmsTranslation {
  project_id: string;
  locale: Locale;
  name: string;
  one_liner: string;
  problem: string;
  status_label: string;
  status_note: string | null;
  similar_cta: string | null;
  role: string | null;
  dossier_summary: string | null;
  meta_title: string | null;
  meta_description: string | null;
  og_title: string | null;
  og_description: string | null;
  built: string[];
  flow: string[];
  constraints_list: string[];
  modules: { name: string; note: string }[];
}

export interface CmsProjectWithTranslations {
  project: CmsProject;
  translations: Partial<Record<Locale, CmsTranslation>>;
}

const PROJECT_COLS = `
  id, slug, status, tier, featured, sort_order, fit_id, capabilities, stack, year,
  live_url, repo_url, image, image_alt, internal_notes,
  created_at, updated_at, published_at, archived_at`;

const TRANSLATION_COLS = `
  project_id, locale, name, one_liner, problem, status_label, status_note,
  similar_cta, role, dossier_summary, meta_title, meta_description,
  og_title, og_description, built, flow, constraints_list, modules`;

/**
 * Map a CMS row back to the exact `Project` shape the public components consume.
 *
 * Optional fields are re-omitted rather than set to null: the typed files leave
 * `year`, `role`, `image` and friends OFF the object entirely when absent, and a
 * component that checks `project.image` behaves the same for `undefined` — but a
 * structural diff does not. Keeping the shapes identical is what lets the parity
 * proof be an equality check instead of a judgement call.
 */
export function toProject(
  row: CmsProject,
  t: CmsTranslation,
): Project {
  const project: Project = {
    slug: row.slug,
    name: t.name,
    oneLiner: t.one_liner,
    problem: t.problem,
    built: t.built,
    stack: row.stack,
    tier: row.tier,
    statusLabel: t.status_label,
    featured: row.featured,
  };

  if (row.year !== null) project.year = row.year;
  if (t.role !== null) project.role = t.role;
  if (t.status_note !== null) project.statusNote = t.status_note;
  if (t.similar_cta !== null) project.similarCta = t.similar_cta;
  if (t.flow.length > 0) project.flow = t.flow;
  if (t.dossier_summary !== null) project.dossierSummary = t.dossier_summary;
  if (t.constraints_list.length > 0) project.constraints = t.constraints_list;
  if (t.modules.length > 0) project.modules = t.modules;
  if (row.live_url !== null) project.liveUrl = row.live_url;
  if (row.repo_url !== null) project.repoUrl = row.repo_url;
  if (row.image !== null) project.image = row.image;
  if (row.image_alt !== null) project.imageAlt = row.image_alt;

  return project;
}

/**
 * Every project, any status, in running order. For the future admin list.
 * Returns null (not []) when there is no database — an empty list and "no
 * database" are different facts, and collapsing them is how a projects page
 * ends up publishing nothing during an outage.
 */
export async function listAllCmsProjects(): Promise<
  CmsProjectWithTranslations[] | null
> {
  const pool = getPool();
  if (!pool) return null;

  const { rows: projects } = await pool.query<CmsProject>(
    `select ${PROJECT_COLS} from projects order by sort_order, created_at`,
  );
  if (projects.length === 0) return [];

  const { rows: translations } = await pool.query<CmsTranslation>(
    `select ${TRANSLATION_COLS} from project_translations where project_id = any($1::uuid[])`,
    [projects.map((p) => p.id)],
  );

  const byProject = new Map<string, Partial<Record<Locale, CmsTranslation>>>();
  for (const t of translations) {
    const entry = byProject.get(t.project_id) ?? {};
    entry[t.locale] = t;
    byProject.set(t.project_id, entry);
  }

  return projects.map((project) => ({
    project,
    translations: byProject.get(project.id) ?? {},
  }));
}

/** Published projects for one locale, in running order, as public `Project`s. */
export async function listPublishedProjects(
  locale: Locale,
): Promise<Project[] | null> {
  const pool = getPool();
  if (!pool) return null;

  const { rows } = await pool.query<CmsProject & CmsTranslation>(
    `select ${PROJECT_COLS.split(",")
      .map((c) => `p.${c.trim()}`)
      .join(", ")},
            ${TRANSLATION_COLS.split(",")
              .map((c) => `t.${c.trim()}`)
              .join(", ")}
       from projects p
       join project_translations t on t.project_id = p.id and t.locale = $1
      where p.status = 'published'
      order by p.sort_order, p.created_at`,
    [locale],
  );

  return rows.map((row) => toProject(row, row));
}

/** One published project by slug. null = no database; undefined = no such project. */
export async function getPublishedProject(
  slug: string,
  locale: Locale,
): Promise<Project | null | undefined> {
  const pool = getPool();
  if (!pool) return null;

  const { rows } = await pool.query<CmsProject & CmsTranslation>(
    `select ${PROJECT_COLS.split(",")
      .map((c) => `p.${c.trim()}`)
      .join(", ")},
            ${TRANSLATION_COLS.split(",")
              .map((c) => `t.${c.trim()}`)
              .join(", ")}
       from projects p
       join project_translations t on t.project_id = p.id and t.locale = $2
      where p.status = 'published' and p.slug = $1`,
    [slug, locale],
  );

  const row = rows[0];
  return row ? toProject(row, row) : undefined;
}

/**
 * Which locales is a project actually finished in? Publishing a project that
 * exists in one language would publish a broken hreflang pair, so the admin
 * needs to be able to see this before it lets anyone hit publish.
 */
export function translationCompleteness(
  entry: CmsProjectWithTranslations,
): Record<Locale, boolean> {
  return {
    tr: Boolean(entry.translations.tr),
    en: Boolean(entry.translations.en),
  };
}

/** The slug a redirect points at, if the old slug is a retired one. */
export async function resolveSlugRedirect(
  oldSlug: string,
): Promise<string | null> {
  const pool = getPool();
  if (!pool) return null;

  const { rows } = await pool.query<{ slug: string }>(
    `select p.slug
       from project_slug_redirects r
       join projects p on p.id = r.project_id
      where r.old_slug = $1`,
    [oldSlug],
  );
  return rows[0]?.slug ?? null;
}
