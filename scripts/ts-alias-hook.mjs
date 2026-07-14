/**
 * Enable "@/..." imports for plain `node` runs.
 *
 * Node 24 strips TypeScript types natively, so scripts can import the typed
 * content files directly — no bundler, no extra dependency. The one thing it
 * cannot do is resolve tsconfig path aliases, and src/content/en/projects.ts
 * imports its type as `import { type Project } from "@/content/projects"`.
 * Type stripping erases the `type` specifier but leaves the import statement
 * standing as a side-effect import, so the alias still has to resolve — and it
 * arrives extensionless, which Node will not guess for you either.
 *
 * Used by: node --import ./scripts/ts-alias-hook.mjs scripts/<script>.mjs
 */
import { register } from "node:module";

register("./ts-alias-resolver.mjs", import.meta.url);
