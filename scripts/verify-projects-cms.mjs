/**
 * Phase 38A parity proof: can the database reproduce the typed project content
 * with zero loss?
 *
 *   pnpm cms:verify
 *
 * WHAT IS COMPARED, AND WHY IT IS SUFFICIENT
 *
 * Not rendered HTML. The public project pages are pure functions of a `Project`
 * object — they receive it, they read its fields, they render. Nothing else
 * varies: no timestamps, no request state, no randomness. So if the database can
 * produce a `Project` deep-equal to the typed one, the rendered pages are
 * identical by construction, and diffing HTML would only be re-testing React.
 *
 * The comparison is therefore on the render INPUT, and it is exact: every field,
 * every array element, in order, with key order normalised away. Presence is
 * compared too — a field absent in the typed object must be ABSENT in the mapped
 * one, not null. `undefined` and `null` look the same to a component but not to
 * a diff, and a silent null is exactly how content loss would hide.
 *
 * It imports the REAL data-access layer (src/lib/projects-cms), not a copy, so
 * what is proved here is the same code path Phase 38C will flip the public
 * routes onto.
 *
 * This proof is itself tested: corrupt a row in the database and it fails,
 * naming the field. A check that cannot fail proves nothing.
 */
import {
  listAllCmsProjects,
  listPublishedProjects,
  getPublishedProject,
  translationCompleteness,
} from "../src/lib/projects-cms/index.ts";

import { projects } from "../src/content/projects.ts";
import { projectsEn } from "../src/content/en/projects.ts";
import { projectToFitType } from "../src/content/fit.ts";
import { projectRoutes } from "../src/lib/routes.ts";

let failures = 0;

function ok(message) {
  console.log(`  OK   ${message}`);
}

function bad(message) {
  failures++;
  console.log(`  !!   ${message}`);
}

function check(condition, okMessage, badMessage) {
  if (condition) ok(okMessage);
  else bad(badMessage);
}

/** Sort object keys recursively; arrays keep their order (order IS content). */
function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, canonical(value[key])]),
    );
  }
  return value;
}

function eq(a, b) {
  return JSON.stringify(canonical(a)) === JSON.stringify(canonical(b));
}

/** First differing field, so a failure names the loss instead of implying it. */
function firstDiff(expected, actual) {
  const keys = [
    ...new Set([...Object.keys(expected), ...Object.keys(actual)]),
  ].sort();

  for (const key of keys) {
    const inExpected = key in expected;
    const inActual = key in actual;

    if (inExpected !== inActual) {
      return inExpected
        ? `field "${key}" LOST (present in file, missing in db)`
        : `field "${key}" INVENTED (in db, not in file)`;
    }
    if (!eq(expected[key], actual[key])) {
      return (
        `field "${key}" differs:\n` +
        `         file: ${JSON.stringify(expected[key])}\n` +
        `         db:   ${JSON.stringify(actual[key])}`
      );
    }
  }
  return "objects differ but no field diff found (should be impossible)";
}

/** Every `projectSlug` anywhere in a module — not just the export you remembered. */
function collectProjectSlugs(node, found = new Set()) {
  if (Array.isArray(node)) {
    node.forEach((child) => collectProjectSlugs(child, found));
  } else if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      if (key === "projectSlug" && typeof value === "string") found.add(value);
      else collectProjectSlugs(value, found);
    }
  }
  return found;
}

const LOCKED_SLUGS = [
  "ecommerce-cms",
  "restaurant-qr-system",
  "orva-psychology",
  "log-management-platform",
  "cendovar",
];

console.log("\n===== PHASE 38A — PROJECT CMS PARITY PROOF =====\n");

const all = await listAllCmsProjects();
if (all === null) {
  console.log("  !!   DATABASE_URL not set — nothing to verify.");
  process.exit(1);
}

/* --------------------------------------------------------------- counts --- */

check(
  all.length === projects.length,
  `${all.length} projects in db (matches the ${projects.length} in the file)`,
  `db has ${all.length} projects, the file has ${projects.length}`,
);

const trCount = all.filter((e) => e.translations.tr).length;
const enCount = all.filter((e) => e.translations.en).length;
check(
  trCount === 5 && enCount === 5,
  `translations complete: ${trCount} tr + ${enCount} en`,
  `translations incomplete: ${trCount} tr, ${enCount} en (expected 5 + 5)`,
);

const incomplete = all
  .filter((entry) => {
    const completeness = translationCompleteness(entry);
    return !completeness.tr || !completeness.en;
  })
  .map((entry) => entry.project.slug);
check(
  incomplete.length === 0,
  "every project is complete in BOTH locales (no broken hreflang pair)",
  `half-translated: ${incomplete.join(", ")}`,
);

/* ---------------------------------------------------------------- slugs --- */

const fileSlugs = projects.map((p) => p.slug);
const dbSlugs = all.map((entry) => entry.project.slug);

check(
  eq(fileSlugs, dbSlugs),
  `slugs preserved, in order: ${dbSlugs.join(", ")}`,
  `slug/order mismatch:\n       file: ${fileSlugs.join(", ")}\n       db:   ${dbSlugs.join(", ")}`,
);

check(
  eq(LOCKED_SLUGS, dbSlugs),
  "the five locked slugs are exactly the five in the database",
  `locked slugs drifted: ${dbSlugs.join(", ")}`,
);

/* ------------------------------------------- field-by-field, both locales --- */

for (const [locale, typed] of [
  ["tr", projects],
  ["en", projectsEn],
]) {
  const mapped = await listPublishedProjects(locale);

  if (!mapped) {
    bad(`${locale}: listPublishedProjects returned null`);
    continue;
  }
  if (mapped.length !== typed.length) {
    bad(`${locale}: ${mapped.length} projects from db, ${typed.length} in file`);
    continue;
  }

  let lossy = 0;
  for (const [index, expected] of typed.entries()) {
    const actual = mapped[index];

    if (actual.slug !== expected.slug) {
      bad(
        `${locale}[${index}]: order differs — expected ${expected.slug}, got ${actual.slug}`,
      );
      lossy++;
      continue;
    }
    if (!eq(expected, actual)) {
      bad(`${locale}/${expected.slug}: ${firstDiff(expected, actual)}`);
      lossy++;
    }
  }

  if (lossy === 0) {
    const fields = new Set(typed.flatMap((p) => Object.keys(p)));
    ok(
      `${locale.toUpperCase()}: all ${typed.length} projects deep-equal to the file ` +
        `(${fields.size} distinct fields, arrays in order, nothing lost or invented)`,
    );
  }
}

/* ------------------------------------------------------- per-slug lookup --- */

let lookupFailures = 0;
for (const slug of LOCKED_SLUGS) {
  for (const locale of ["tr", "en"]) {
    const project = await getPublishedProject(slug, locale);
    if (!project) {
      bad(`getPublishedProject("${slug}", "${locale}") did not resolve`);
      lookupFailures++;
    }
  }
}
if (lookupFailures === 0) {
  ok("all 5 slugs resolve through the CMS helper in both locales");
}

/* ------------------------------------------ the couplings that would break --- */

const dbSlugSet = new Set(dbSlugs);

const fitMapKeys = Object.keys(projectToFitType);
const orphanFitKeys = fitMapKeys.filter((slug) => !dbSlugSet.has(slug));
check(
  orphanFitKeys.length === 0,
  `all ${fitMapKeys.length} projectToFitType keys resolve to a real project`,
  `projectToFitType points at missing projects: ${orphanFitKeys.join(", ")}`,
);

// The mapping must have SURVIVED into the database too, or 38C loses the
// wizard's system mapping the moment fit.ts stops being the source of truth.
const fitIdMismatch = all.filter(
  (entry) =>
    (projectToFitType[entry.project.slug] ?? null) !== entry.project.fit_id,
);
check(
  fitIdMismatch.length === 0,
  "every project carries its fit_id in the database (wizard mapping preserved)",
  `fit_id mismatch: ${fitIdMismatch
    .map((e) => `${e.project.slug} db=${e.project.fit_id}`)
    .join(", ")}`,
);

// Walk the WHOLE fit module. `projectSlug` lives in fitSystems AND in
// unsureRecommendations; checking only the first would quietly miss half the
// references the inquiry wizard depends on.
const fitModule = await import("../src/content/fit.ts");
const referencedSlugs = [...collectProjectSlugs({ ...fitModule })];
const orphanReferences = referencedSlugs.filter((slug) => !dbSlugSet.has(slug));
check(
  orphanReferences.length === 0,
  `all ${referencedSlugs.length} projectSlug references across the fit module resolve ` +
    `(${referencedSlugs.join(", ")})`,
  `fit content points at missing projects: ${orphanReferences.join(", ")}`,
);

/* ------------------------------------------------------ ?proje= + sitemap --- */

// validate.ts builds its closed set from projects.ts directly, and that array is
// proved field-equal above — so the accepted set is correct transitively. What
// still has to be checked is that the DB agrees on the SET itself.
check(
  eq([...fileSlugs].sort(), [...dbSlugs].sort()),
  "?proje= accepted set (built from projects.ts) matches the database exactly",
  "?proje= closed set and the database disagree",
);

const dbRoutes = dbSlugs.map((slug) => `/projeler/${slug}`);
check(
  eq(projectRoutes, dbRoutes),
  `sitemap project routes identical (${dbRoutes.length} TR + ${dbRoutes.length} EN)`,
  `route inventory differs:\n       file: ${projectRoutes.join(", ")}\n       db:   ${dbRoutes.join(", ")}`,
);

/* -------------------------------------------------------------- verdict --- */

if (failures === 0) {
  console.log(
    "\n==================== PARITY PROVEN ====================\n" +
      "The database reproduces the typed project content exactly.\n" +
      "Public routes still read the files. Nothing was flipped.\n",
  );
} else {
  console.log(`\n==================== ${failures} FAILURE(S) ====================\n`);
}

process.exit(failures === 0 ? 0 : 1);
