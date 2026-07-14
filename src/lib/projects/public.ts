import "server-only";

import { cache } from "react";

import { getPool } from "@/lib/db/postgres";

import { normalizeCapabilities } from "./capabilities";
import type { PublicProject } from "./types";

/**
 * The public project source of truth (Phase 38C).
 *
 * Until this phase the public site read src/content/projects.ts. It now reads
 * PostgreSQL, and only rows with status='published'. Drafts and archived
 * projects are filtered in SQL — not in a component, because a filter in a
 * component is one careless `.map` away from leaking an unpublished project.
 *
 * `import "server-only"` makes a stray client import fail at BUILD time rather
 * than shipping a connection string to a browser.
 *
 * A project must exist in BOTH locales to be public. Publishing one language
 * would emit an hreflang pair whose counterpart is empty, and the admin publish
 * gate already refuses it; the join here means even a row hand-edited in SQL
 * cannot slip past.
 */

export type Locale = "tr" | "en";

const COLUMNS = `
  p.slug, p.tier, p.featured, p.stack, p.year, p.live_url, p.repo_url,
  p.image, p.image_alt, p.fit_id, p.capabilities, p.sort_order,
  t.name, t.one_liner, t.problem, t.status_label, t.status_note,
  t.similar_cta, t.role, t.dossier_summary, t.meta_title, t.meta_description,
  t.og_title, t.og_description, t.built, t.flow, t.constraints_list, t.modules`;

const FROM = `
  from projects p
  join project_translations t on t.project_id = p.id and t.locale = $1
  join project_translations o on o.project_id = p.id and o.locale <> $1
   and length(trim(o.name)) > 0
   and length(trim(o.one_liner)) > 0
   and length(trim(o.problem)) > 0
   and length(trim(o.status_label)) > 0
  where p.status = 'published'
    and length(trim(t.name)) > 0
    and length(trim(t.one_liner)) > 0
    and length(trim(t.problem)) > 0
    and length(trim(t.status_label)) > 0`;

interface Row {
  slug: string;
  tier: "delivered" | "internal";
  featured: boolean;
  stack: string[];
  year: string | null;
  live_url: string | null;
  repo_url: string | null;
  image: string | null;
  image_alt: string | null;
  fit_id: string | null;
  capabilities: string[];
  sort_order: number;
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

/** SEO overrides, kept OUT of PublicProject so the render shape stays identical. */
export interface ProjectSeo {
  metaTitle: string | null;
  metaDescription: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
}

/**
 * Absent optional fields are OMITTED, not set to undefined-by-assignment. The
 * typed files left them off the object entirely, the components were written
 * against that, and the 38A parity proof compares presence — keeping the shapes
 * identical is what lets the cutover be verified instead of eyeballed.
 */
function toPublicProject(row: Row): PublicProject {
  const project: PublicProject = {
    slug: row.slug,
    name: row.name,
    oneLiner: row.one_liner,
    problem: row.problem,
    built: row.built,
    stack: row.stack,
    tier: row.tier,
    statusLabel: row.status_label,
    featured: row.featured,
  };

  if (row.year !== null) project.year = row.year;
  if (row.role !== null) project.role = row.role;
  if (row.status_note !== null) project.statusNote = row.status_note;
  if (row.similar_cta !== null) project.similarCta = row.similar_cta;
  if (row.flow.length > 0) project.flow = row.flow;
  if (row.dossier_summary !== null) project.dossierSummary = row.dossier_summary;
  if (row.constraints_list.length > 0) project.constraints = row.constraints_list;
  if (row.modules.length > 0) project.modules = row.modules;
  if (row.live_url !== null) project.liveUrl = row.live_url;
  if (row.repo_url !== null) project.repoUrl = row.repo_url;
  if (row.image !== null) project.image = row.image;
  if (row.image_alt !== null) project.imageAlt = row.image_alt;
  if (row.fit_id !== null) project.fitId = row.fit_id;

  // Normalised, not trusted: order comes from the canonical list, junk and
  // duplicates are dropped. The column has a CHECK too — belt and braces, because
  // this array is rendered straight into the page.
  const capabilities = normalizeCapabilities(row.capabilities);
  if (capabilities.length > 0) project.capabilities = capabilities;

  return project;
}

function toSeo(row: Row): ProjectSeo {
  return {
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    ogTitle: row.og_title,
    ogDescription: row.og_description,
  };
}

/* ------------------------------------------------------------------ guard -- */

/**
 * Is this a build/run that the outside world will see?
 *
 * VERCEL is set on Vercel. SITE_ENV=production is the switch for anywhere else —
 * and it exists because the old guard only knew about Vercel, which meant a
 * production build on a VPS would happily publish `http://localhost:3000` in
 * every canonical, every sitemap URL and every JSON-LD id, silently. NODE_ENV is
 * useless for this: a local `pnpm build` is also NODE_ENV=production.
 */
export function isPublicDeployment(): boolean {
  return Boolean(process.env.VERCEL) || process.env.SITE_ENV === "production";
}

class ProjectInventoryError extends Error {
  constructor(reason: string) {
    super(
      `Project inventory unusable (${reason}).\n\n` +
        `Since Phase 38C the public project pages read PostgreSQL, so a build in ` +
        `this state would publish an EMPTY /projeler, drop the sitemap from 60 ` +
        `URLs to 50, and break every hreflang pair for projects — quietly, with a ` +
        `green build.\n\n` +
        `Fix it before deploying:\n` +
        `  1. apply db/schema.sql to the target database\n` +
        `  2. set DATABASE_URL for the build\n` +
        `  3. run: pnpm cms:seed\n` +
        `  4. confirm: pnpm cms:verify\n\n` +
        `If you are intentionally building with no projects, you do not have a ` +
        `site to build.`,
    );
    this.name = "ProjectInventoryError";
  }
}

/**
 * Every published project for a locale, in running order.
 *
 * THROWS when the inventory is unusable on a public deployment. That is the whole
 * point: an empty projects page is worse than a failed build, because a failed
 * build is loud and an empty page is not. With no DATABASE_URL at all and no
 * production signal, it returns [] so a fresh clone still runs.
 *
 * A CONFIGURED-BUT-UNREACHABLE database throws EVERYWHERE, including locally.
 * Setting DATABASE_URL is a statement that there is a database; if that turns out
 * to be false, silently rendering a site with no projects is the one outcome
 * nobody wants. This was found the hard way, when Docker stopped mid-phase and
 * the build died with a raw ECONNREFUSED AggregateError that said nothing about
 * projects at all.
 */
export const getPublishedProjects = cache(async function getPublishedProjects(
  locale: Locale,
): Promise<PublicProject[]> {
  const pool = getPool();

  if (!pool) {
    if (isPublicDeployment()) throw new ProjectInventoryError("no DATABASE_URL");
    return [];
  }

  let rows: Row[];
  try {
    ({ rows } = await pool.query<Row>(
      `select ${COLUMNS} ${FROM} order by p.sort_order, p.slug`,
      [locale],
    ));
  } catch (cause) {
    const detail = cause instanceof Error ? cause.message : String(cause);
    throw new ProjectInventoryError(
      `DATABASE_URL is set but the database could not be read — ${detail}`,
    );
  }

  if (rows.length === 0 && isPublicDeployment()) {
    throw new ProjectInventoryError("zero published projects in the database");
  }

  return rows.map(toPublicProject);
});

export async function getFeaturedProjects(
  locale: Locale,
): Promise<PublicProject[]> {
  const all = await getPublishedProjects(locale);
  return all.filter((project) => project.featured);
}

/** One published project. undefined = not published / does not exist. */
export async function getPublishedProject(
  slug: string,
  locale: Locale,
): Promise<{ project: PublicProject; seo: ProjectSeo } | undefined> {
  const pool = getPool();
  if (!pool) return undefined;

  const { rows } = await pool.query<Row>(
    `select ${COLUMNS} ${FROM} and p.slug = $2`,
    [locale, slug],
  );

  const row = rows[0];
  return row ? { project: toPublicProject(row), seo: toSeo(row) } : undefined;
}

/** Published slugs, for generateStaticParams and the sitemap. */
export async function getPublishedSlugs(): Promise<string[]> {
  const projects = await getPublishedProjects("tr");
  return projects.map((project) => project.slug);
}

/**
 * The published slug set, for the two hot server endpoints — /api/lead and
 * /api/e — which validate against closed sets rather than shapes.
 *
 * Cached for a minute in module memory rather than per-request: the analytics
 * beacon fires on every navigation, and this list changes when the owner clicks
 * publish, which is roughly never. React's cache() is per-request and would not
 * help a beacon. The cost of the staleness is that a project published seconds
 * ago is not accepted as a ?proje= reference for up to a minute; the cost of not
 * caching is a SELECT on every page view.
 */
const SLUG_SET_TTL_MS = 60_000;
let slugSetCache: { at: number; slugs: Set<string> } | null = null;

export async function getPublishedSlugSet(): Promise<Set<string>> {
  const now = Date.now();
  if (slugSetCache && now - slugSetCache.at < SLUG_SET_TTL_MS) {
    return slugSetCache.slugs;
  }

  const pool = getPool();
  if (!pool) return new Set();

  const { rows } = await pool.query<{ slug: string }>(
    `select slug from projects where status = 'published'`,
  );
  const slugs = new Set(rows.map((row) => row.slug));
  slugSetCache = { at: now, slugs };
  return slugs;
}

/**
 * Is this path a real, published project page?
 *
 * Analytics and lead source-paths are matched against real routes, never against
 * a shape — otherwise a crafted path fills the table with junk. Project routes
 * used to live in the static inventory; now that they are database-backed, they
 * have to be checked here or every project pageview would be recorded as null.
 */
export async function isPublishedProjectPath(path: string): Promise<boolean> {
  const match = /^(?:\/projeler|\/en\/projects)\/([a-z0-9-]{2,60})$/.exec(path);
  if (!match) return false;

  const slugs = await getPublishedSlugSet();
  return slugs.has(match[1]);
}

/**
 * A retired slug's current target — but only if that target is still PUBLISHED.
 *
 * An archived project must not be reachable through its own old address. If it
 * were, un-publishing would be undone by any stale link on the internet, and the
 * redirect table would become a way to read content the owner took down.
 */
export async function resolveProjectRedirect(
  oldSlug: string,
): Promise<string | null> {
  const pool = getPool();
  if (!pool) return null;

  const { rows } = await pool.query<{ slug: string }>(
    `select p.slug
       from project_slug_redirects r
       join projects p on p.id = r.project_id
      where r.old_slug = $1 and p.status = 'published'`,
    [oldSlug],
  );

  const target = rows[0]?.slug ?? null;
  // Belt and braces: the table has a trigger that refuses a redirect whose
  // old_slug is a live project slug, but a redirect to ITSELF would loop
  // forever, and a loop on a public route is not something to find out about
  // from a visitor.
  return target && target !== oldSlug ? target : null;
}

/**
 * Just enough for a proof chip and the hero status card: slug, name, label.
 *
 * This is what crosses into the browser via the client-side project index, and
 * it is small on purpose — the index rides in the RSC payload of every page. See
 * src/components/projects/project-index.tsx.
 */
export async function getPublishedProjectSummaries(
  locale: Locale,
): Promise<{ slug: string; name: string; statusLabel: string }[]> {
  const projects = await getPublishedProjects(locale);
  return projects.map(({ slug, name, statusLabel }) => ({
    slug,
    name,
    statusLabel,
  }));
}
