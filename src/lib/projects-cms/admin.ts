import { fitSystems } from "@/content/fit";
import { getPool } from "@/lib/db/postgres";

import type {
  CmsProject,
  CmsTranslation,
  Locale,
  ProjectStatus,
} from "./index";

/**
 * Admin project CMS: queries and mutations (Phase 38B).
 *
 * Still invisible to the public. /projeler and friends read the typed files and
 * will keep doing so until 38C — this layer writes a database nobody is reading
 * yet, which is exactly what makes 38B safe: a mistake in the editor cannot
 * reach a visitor.
 *
 * Every value is a bound parameter. Auth is NOT checked here — it is checked in
 * the Server Actions, at the boundary where a request actually arrives.
 */

export const TIERS = ["delivered", "internal"] as const;
export const STATUSES = ["draft", "published", "archived"] as const;

/** The wizard's system ids. A project's fit_id has to be one of them or null. */
export const FIT_IDS = fitSystems.map((system) => system.id);

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  draft: "Taslak",
  published: "Yayında",
  archived: "Arşiv",
};

export const TIER_LABEL: Record<(typeof TIERS)[number], string> = {
  delivered: "Teslim edilmiş",
  internal: "İç / önceki çalışma",
};

/** Publishing needs these four, in BOTH locales. Everything else may be empty. */
export const REQUIRED_TRANSLATION_FIELDS = [
  "name",
  "one_liner",
  "problem",
  "status_label",
] as const;

export const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]{1,58}[a-z0-9]$/;

export interface TranslationInput {
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

export interface ProjectInput {
  slug: string;
  tier: (typeof TIERS)[number];
  fit_id: string | null;
  featured: boolean;
  sort_order: number;
  stack: string[];
  year: string | null;
  live_url: string | null;
  repo_url: string | null;
  image: string | null;
  image_alt: string | null;
  internal_notes: string | null;
  translations: Record<Locale, TranslationInput>;
}

export interface AdminProjectRow {
  project: CmsProject;
  translations: Partial<Record<Locale, CmsTranslation>>;
  complete: Record<Locale, boolean>;
}

/* ------------------------------------------------------------ completeness -- */

/** A locale is complete when it could survive a publish, not merely when a row exists. */
export function isLocaleComplete(t: CmsTranslation | undefined): boolean {
  if (!t) return false;
  return REQUIRED_TRANSLATION_FIELDS.every(
    (field) => typeof t[field] === "string" && t[field].trim().length > 0,
  );
}

/* ------------------------------------------------------------------ queries -- */

export interface AdminFilters {
  q?: string;
  status?: ProjectStatus | "all";
  tier?: (typeof TIERS)[number] | "all";
}

export async function listAdminProjects(
  filters: AdminFilters = {},
): Promise<AdminProjectRow[] | null> {
  const pool = getPool();
  if (!pool) return null;

  const where: string[] = [];
  const params: unknown[] = [];

  if (filters.status && filters.status !== "all") {
    params.push(filters.status);
    where.push(`p.status = $${params.length}`);
  }
  if (filters.tier && filters.tier !== "all") {
    params.push(filters.tier);
    where.push(`p.tier = $${params.length}`);
  }
  if (filters.q?.trim()) {
    params.push(`%${filters.q.trim()}%`);
    // Search the slug AND the translated text, in either language: the owner
    // remembers a project by its name, not by the slug they typed a year ago.
    where.push(`(
      p.slug ilike $${params.length}
      or exists (
        select 1 from project_translations t
         where t.project_id = p.id
           and (t.name ilike $${params.length} or t.one_liner ilike $${params.length})
      )
    )`);
  }

  const { rows: projects } = await pool.query<CmsProject>(
    `select id, slug, status, tier, featured, sort_order, fit_id, stack, year,
            live_url, repo_url, image, image_alt, internal_notes,
            created_at, updated_at, published_at, archived_at
       from projects p
       ${where.length ? `where ${where.join(" and ")}` : ""}
      order by p.sort_order, p.created_at`,
    params,
  );
  if (projects.length === 0) return [];

  const { rows: translations } = await pool.query<CmsTranslation>(
    `select project_id, locale, name, one_liner, problem, status_label,
            status_note, similar_cta, role, dossier_summary, meta_title,
            meta_description, og_title, og_description, built, flow,
            constraints_list, modules
       from project_translations
      where project_id = any($1::uuid[])`,
    [projects.map((p) => p.id)],
  );

  const byProject = new Map<string, Partial<Record<Locale, CmsTranslation>>>();
  for (const t of translations) {
    const entry = byProject.get(t.project_id) ?? {};
    entry[t.locale] = t;
    byProject.set(t.project_id, entry);
  }

  return projects.map((project) => {
    const entry = byProject.get(project.id) ?? {};
    return {
      project,
      translations: entry,
      complete: {
        tr: isLocaleComplete(entry.tr),
        en: isLocaleComplete(entry.en),
      },
    };
  });
}

export async function getAdminProject(
  id: string,
): Promise<AdminProjectRow | null | undefined> {
  const pool = getPool();
  if (!pool) return null;

  const { rows } = await pool.query<CmsProject>(
    `select id, slug, status, tier, featured, sort_order, fit_id, stack, year,
            live_url, repo_url, image, image_alt, internal_notes,
            created_at, updated_at, published_at, archived_at
       from projects where id = $1`,
    [id],
  );
  const project = rows[0];
  if (!project) return undefined;

  const { rows: translations } = await pool.query<CmsTranslation>(
    `select project_id, locale, name, one_liner, problem, status_label,
            status_note, similar_cta, role, dossier_summary, meta_title,
            meta_description, og_title, og_description, built, flow,
            constraints_list, modules
       from project_translations where project_id = $1`,
    [id],
  );

  const entry: Partial<Record<Locale, CmsTranslation>> = {};
  for (const t of translations) entry[t.locale] = t;

  return {
    project,
    translations: entry,
    complete: { tr: isLocaleComplete(entry.tr), en: isLocaleComplete(entry.en) },
  };
}

/** Retired slugs that will 308 to this project once 38C consumes them. */
export async function listSlugRedirects(
  projectId: string,
): Promise<{ old_slug: string; created_at: Date }[]> {
  const pool = getPool();
  if (!pool) return [];

  const { rows } = await pool.query<{ old_slug: string; created_at: Date }>(
    `select old_slug, created_at from project_slug_redirects
      where project_id = $1 order by created_at desc`,
    [projectId],
  );
  return rows;
}

/* ---------------------------------------------------------------- mutations -- */

const TRANSLATION_UPSERT = `
  insert into project_translations
    (project_id, locale, name, one_liner, problem, status_label, status_note,
     similar_cta, role, dossier_summary, meta_title, meta_description,
     og_title, og_description, built, flow, constraints_list, modules)
  values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
          $15::jsonb, $16::jsonb, $17::jsonb, $18::jsonb)
  on conflict (project_id, locale) do update set
    name = excluded.name,
    one_liner = excluded.one_liner,
    problem = excluded.problem,
    status_label = excluded.status_label,
    status_note = excluded.status_note,
    similar_cta = excluded.similar_cta,
    role = excluded.role,
    dossier_summary = excluded.dossier_summary,
    meta_title = excluded.meta_title,
    meta_description = excluded.meta_description,
    og_title = excluded.og_title,
    og_description = excluded.og_description,
    built = excluded.built,
    flow = excluded.flow,
    constraints_list = excluded.constraints_list,
    modules = excluded.modules,
    updated_at = now()`;

function translationParams(
  projectId: string,
  locale: Locale,
  t: TranslationInput,
) {
  return [
    projectId,
    locale,
    t.name,
    t.one_liner,
    t.problem,
    t.status_label,
    t.status_note,
    t.similar_cta,
    t.role,
    t.dossier_summary,
    t.meta_title,
    t.meta_description,
    t.og_title,
    t.og_description,
    JSON.stringify(t.built),
    JSON.stringify(t.flow),
    JSON.stringify(t.constraints_list),
    JSON.stringify(t.modules),
  ];
}

/** New projects always start as drafts. There is no "create published" path. */
export async function createProject(input: ProjectInput): Promise<string> {
  const pool = getPool();
  if (!pool) throw new Error("no_database");

  const client = await pool.connect();
  try {
    await client.query("begin");

    const { rows } = await client.query<{ id: string }>(
      `insert into projects
         (slug, status, tier, featured, sort_order, fit_id, stack, year,
          live_url, repo_url, image, image_alt, internal_notes)
       values ($1, 'draft', $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10, $11, $12)
       returning id`,
      [
        input.slug,
        input.tier,
        input.featured,
        input.sort_order,
        input.fit_id,
        JSON.stringify(input.stack),
        input.year,
        input.live_url,
        input.repo_url,
        input.image,
        input.image_alt,
        input.internal_notes,
      ],
    );
    const id = rows[0].id;

    for (const locale of ["tr", "en"] as const) {
      await client.query(
        TRANSLATION_UPSERT,
        translationParams(id, locale, input.translations[locale]),
      );
    }

    await client.query("commit");
    return id;
  } catch (err) {
    await client.query("rollback");
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Update a project. If the slug changed, the OLD slug is written into
 * project_slug_redirects in the same transaction — a slug change and the record
 * that keeps its old URL alive must not be able to come apart.
 */
export async function updateProject(
  id: string,
  input: ProjectInput,
): Promise<void> {
  const pool = getPool();
  if (!pool) throw new Error("no_database");

  const client = await pool.connect();
  try {
    await client.query("begin");

    const { rows: current } = await client.query<{ slug: string }>(
      `select slug from projects where id = $1 for update`,
      [id],
    );
    if (!current[0]) throw new Error("not_found");
    const oldSlug = current[0].slug;

    await client.query(
      `update projects set
         slug = $2, tier = $3, featured = $4, sort_order = $5, fit_id = $6,
         stack = $7::jsonb, year = $8, live_url = $9, repo_url = $10,
         image = $11, image_alt = $12, internal_notes = $13, updated_at = now()
       where id = $1`,
      [
        id,
        input.slug,
        input.tier,
        input.featured,
        input.sort_order,
        input.fit_id,
        JSON.stringify(input.stack),
        input.year,
        input.live_url,
        input.repo_url,
        input.image,
        input.image_alt,
        input.internal_notes,
      ],
    );

    if (oldSlug !== input.slug) {
      // on conflict do nothing: the same slug may be retired, reused and retired
      // again, and a duplicate redirect row is not an error worth losing an edit
      // over. The table's trigger still refuses a redirect that would shadow a
      // live project.
      await client.query(
        `insert into project_slug_redirects (old_slug, project_id)
         values ($1, $2)
         on conflict (old_slug) do update set project_id = excluded.project_id`,
        [oldSlug, id],
      );
    }

    for (const locale of ["tr", "en"] as const) {
      await client.query(
        TRANSLATION_UPSERT,
        translationParams(id, locale, input.translations[locale]),
      );
    }

    await client.query("commit");
  } catch (err) {
    await client.query("rollback");
    throw err;
  } finally {
    client.release();
  }
}

export async function setProjectStatus(
  id: string,
  status: ProjectStatus,
): Promise<void> {
  const pool = getPool();
  if (!pool) throw new Error("no_database");

  await pool.query(
    `update projects set
       status = $2,
       updated_at = now(),
       published_at = case
         when $2 = 'published' then coalesce(published_at, now())
         else published_at
       end,
       archived_at = case when $2 = 'archived' then now() else null end
     where id = $1`,
    [id, status],
  );
}

/** Is this slug free? Excludes the project being edited. */
export async function slugTaken(
  slug: string,
  exceptId?: string,
): Promise<boolean> {
  const pool = getPool();
  if (!pool) return false;

  const { rows } = await pool.query(
    `select 1 from projects where slug = $1 and ($2::uuid is null or id <> $2)`,
    [slug, exceptId ?? null],
  );
  return rows.length > 0;
}
