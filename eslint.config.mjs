import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),

  /**
   * Phase 38D — the project fixtures must never become live content again.
   *
   * Since 38C the public site reads projects from PostgreSQL. The typed files
   * survive only as the seed source, the parity reference and the rollback path.
   * A banner at the top of them says so — but a comment is advice. Six months
   * from now somebody needs a project name in a component, autocomplete offers
   * `projects` from @/content/projects, and the site quietly has two sources of
   * truth again, one of which no longer updates.
   *
   * This makes that a lint ERROR instead. The scripts that legitimately read the
   * fixtures (cms:seed, cms:verify) live in scripts/ and are not matched here.
   */
  {
    files: [
      "src/app/**/*.{ts,tsx}",
      "src/components/**/*.{ts,tsx}",
      "src/lib/**/*.{ts,tsx}",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@/content/projects",
              importNames: ["projects", "featuredProjects", "getProject"],
              message:
                "Project content lives in the CMS database since 38C. Use @/lib/projects/public (server components) or the project index context (client components). @/content/projects is a seed/rollback fixture — importing its data resurrects a second, stale source of truth.",
            },
            {
              name: "@/content/en/projects",
              importNames: ["projectsEn", "featuredProjectsEn", "getProjectEn"],
              message:
                "Project content lives in the CMS database since 38C. Use @/lib/projects/public (server components) or the project index context (client components). @/content/en/projects is a seed/rollback fixture.",
            },
            {
              name: "@/content/fit",
              importNames: ["projectToFitType"],
              message:
                "A project's system type is the fit_id column on its row — read project.fitId. projectToFitType is a seed fixture for the original five and knows nothing about projects created in the panel.",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
