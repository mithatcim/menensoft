/**
 * Seed the five existing projects into the CMS tables (Phase 38A).
 *
 *   node --env-file=.env.local --import ./scripts/ts-alias-hook.mjs \
 *     scripts/seed-projects-cms.mjs
 *
 * This copies src/content/projects.ts and src/content/en/projects.ts into
 * `projects` + `project_translations` VERBATIM. It does not rewrite, tidy,
 * translate or "improve" a single character — the whole value of Phase 38A is
 * that the database can be proved identical to the files, and a seed that
 * edits on the way in destroys that proof before it can be run.
 *
 * Idempotent: upserts on slug and on (project_id, locale). Re-running changes
 * nothing except updated_at. It is the same script that will run against
 * production, so it has to be safe to run twice by accident.
 *
 * It touches ONLY project tables. Leads, analytics and admin rows are not read
 * and not written.
 */
import pg from "pg";

import { projects } from "../src/content/projects.ts";
import { projectsEn } from "../src/content/en/projects.ts";
import { projectToFitType } from "../src/content/fit.ts";
import { projectCapabilities } from "../src/content/project-capabilities.ts";

// Env comes from node --env-file=.env.local — no dotenv dependency, and no
// variable expansion, which is what corrupted the admin hash once already.
const { DATABASE_URL } = process.env;
if (!DATABASE_URL) {
  console.error(
    "DATABASE_URL is not set. Run with:\n" +
      "  node --env-file=.env.local --import ./scripts/ts-alias-hook.mjs scripts/seed-projects-cms.mjs\n" +
      "Nothing was written.",
  );
  process.exit(1);
}

const pool = new pg.Pool({
  connectionString: DATABASE_URL,
  ssl: /localhost|127\.0\.0\.1/.test(DATABASE_URL)
    ? false
    : { rejectUnauthorized: true },
});

/** The typed shape uses `constraints`; the column is `constraints_list`. */
function translationRow(p) {
  return {
    name: p.name,
    one_liner: p.oneLiner,
    problem: p.problem,
    status_label: p.statusLabel,
    status_note: p.statusNote ?? null,
    similar_cta: p.similarCta ?? null,
    role: p.role ?? null,
    dossier_summary: p.dossierSummary ?? null,
    // SEO overrides stay NULL on purpose. Today meta title is derived from
    // `name` and description from `oneLiner`; writing those same strings into
    // override columns would silently turn a derived value into a frozen copy,
    // and the two would drift apart the first time someone edited the name.
    meta_title: null,
    meta_description: null,
    og_title: null,
    og_description: null,
    built: JSON.stringify(p.built ?? []),
    flow: JSON.stringify(p.flow ?? []),
    constraints_list: JSON.stringify(p.constraints ?? []),
    modules: JSON.stringify(p.modules ?? []),
  };
}

const enBySlug = new Map(projectsEn.map((p) => [p.slug, p]));

(async () => {
  const client = await pool.connect();
  let created = 0;
  let updated = 0;
  let translations = 0;

  try {
    await client.query("begin");

    for (const [index, tr] of projects.entries()) {
      const en = enBySlug.get(tr.slug);
      if (!en) {
        throw new Error(
          `"${tr.slug}" has no English counterpart. Seeding a project with one ` +
            `locale would publish a broken hreflang pair; fix the content first.`,
        );
      }

      const { rows } = await client.query(
        `insert into projects
           (slug, status, tier, featured, sort_order, fit_id, stack, year,
            live_url, repo_url, image, image_alt, capabilities, published_at)
         values ($1, 'published', $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10, $11,
                 $12::jsonb, now())
         on conflict (slug) do update set
           status       = 'published',
           tier         = excluded.tier,
           featured     = excluded.featured,
           sort_order   = excluded.sort_order,
           fit_id       = excluded.fit_id,
           stack        = excluded.stack,
           year         = excluded.year,
           live_url     = excluded.live_url,
           repo_url     = excluded.repo_url,
           image        = excluded.image,
           image_alt    = excluded.image_alt,
           capabilities = excluded.capabilities,
           updated_at   = now(),
           archived_at  = null,
           -- never re-stamp a publish date that already exists
           published_at = coalesce(projects.published_at, now())
         returning id, (xmax = 0) as inserted`,
        [
          tr.slug,
          tr.tier,
          tr.featured,
          index, // array order IS the running order; preserve it exactly
          projectToFitType[tr.slug] ?? null,
          JSON.stringify(tr.stack ?? []),
          tr.year ?? null,
          tr.liveUrl ?? null,
          tr.repoUrl ?? null,
          tr.image ?? null,
          tr.imageAlt ?? null,
          // Carried over VERBATIM. Re-scoring a project during a migration would
          // be inventing editorial content nobody reviewed.
          JSON.stringify(projectCapabilities[tr.slug] ?? []),
        ],
      );

      const { id, inserted } = rows[0];
      if (inserted) created++;
      else updated++;

      for (const [locale, project] of [
        ["tr", tr],
        ["en", en],
      ]) {
        const r = translationRow(project);
        await client.query(
          `insert into project_translations
             (project_id, locale, name, one_liner, problem, status_label,
              status_note, similar_cta, role, dossier_summary,
              meta_title, meta_description, og_title, og_description,
              built, flow, constraints_list, modules)
           values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
                   $15::jsonb, $16::jsonb, $17::jsonb, $18::jsonb)
           on conflict (project_id, locale) do update set
             name             = excluded.name,
             one_liner        = excluded.one_liner,
             problem          = excluded.problem,
             status_label     = excluded.status_label,
             status_note      = excluded.status_note,
             similar_cta      = excluded.similar_cta,
             role             = excluded.role,
             dossier_summary  = excluded.dossier_summary,
             meta_title       = excluded.meta_title,
             meta_description = excluded.meta_description,
             og_title         = excluded.og_title,
             og_description   = excluded.og_description,
             built            = excluded.built,
             flow             = excluded.flow,
             constraints_list = excluded.constraints_list,
             modules          = excluded.modules,
             updated_at       = now()`,
          [
            id,
            locale,
            r.name,
            r.one_liner,
            r.problem,
            r.status_label,
            r.status_note,
            r.similar_cta,
            r.role,
            r.dossier_summary,
            r.meta_title,
            r.meta_description,
            r.og_title,
            r.og_description,
            r.built,
            r.flow,
            r.constraints_list,
            r.modules,
          ],
        );
        translations++;
      }
    }

    await client.query("commit");
  } catch (err) {
    await client.query("rollback");
    console.error("\nSeed FAILED and was rolled back. Nothing was written.\n");
    console.error(err.message);
    process.exit(1);
  } finally {
    client.release();
  }

  const { rows: counts } = await pool.query(
    `select
       (select count(*) from projects)                                as projects,
       (select count(*) from project_translations where locale='tr')  as tr,
       (select count(*) from project_translations where locale='en')  as en,
       (select count(*) from projects where status='published')       as published`,
  );

  console.log(`  created:      ${created}`);
  console.log(`  updated:      ${updated}`);
  console.log(`  translations: ${translations} written`);
  console.log(
    `  in db:        ${counts[0].projects} projects (${counts[0].published} published), ` +
      `${counts[0].tr} tr + ${counts[0].en} en translations`,
  );

  await pool.end();
})();
