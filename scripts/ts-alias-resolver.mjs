/** Module-resolution hook: maps the "@/..." tsconfig alias onto src/. */
const SRC = new URL("../src/", import.meta.url).href;

export async function resolve(specifier, context, next) {
  if (!specifier.startsWith("@/")) return next(specifier, context);

  const base = SRC + specifier.slice(2);
  const candidates = [base + ".ts", base + ".tsx", base + "/index.ts", base];

  for (const candidate of candidates) {
    try {
      return await next(candidate, context);
    } catch {
      // try the next extension
    }
  }
  throw new Error(`ts-alias-resolver could not resolve "${specifier}"`);
}
