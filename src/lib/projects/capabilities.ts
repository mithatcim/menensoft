/**
 * The capability matrix: the nine things a system can demonstrate.
 *
 * The IDS are language-neutral and the LABELS are translated, which is why this
 * lives on the project row (a jsonb array of ids) and not in project_translations.
 * Whether a system has an admin dashboard is a fact about the system, not about
 * the language you describe it in.
 *
 * It is a SET, not a score: a capability is lit or it is not. That was true of the
 * static map this replaced, and inventing a 0–5 scale here would have been
 * inventing data the owner has no way to justify.
 *
 * The closed set is enforced in three places, deliberately: this module (so the
 * editor can only offer real ids), the validator (so a crafted POST cannot write
 * a junk id), and a CHECK constraint on the table (so nothing can, ever).
 */

export const CAPABILITIES = [
  { id: "interface", tr: "Arayüz", en: "Interface" },
  { id: "admin", tr: "Yönetim / dashboard", en: "Admin / dashboard" },
  { id: "data", tr: "Veri modeli", en: "Data model" },
  { id: "automation", tr: "Otomasyon", en: "Automation" },
  { id: "operations", tr: "Operasyon", en: "Operations" },
  { id: "security", tr: "Güvenlik / log", en: "Security / logs" },
  { id: "content", tr: "İçerik yönetimi", en: "Content management" },
  { id: "ordering", tr: "Sipariş / iş akışı", en: "Orders / workflow" },
  { id: "membership", tr: "Üyelik / yayınlama", en: "Membership / publishing" },
] as const;

export type CapabilityId = (typeof CAPABILITIES)[number]["id"];

export const CAPABILITY_IDS: readonly string[] = CAPABILITIES.map((c) => c.id);

export function isCapabilityId(value: unknown): value is CapabilityId {
  return typeof value === "string" && CAPABILITY_IDS.includes(value);
}

/** Labels in one locale, in the fixed display order. */
export function capabilityLabels(locale: "tr" | "en") {
  return CAPABILITIES.map((c) => ({ id: c.id, label: c[locale] }));
}

/**
 * Drop junk, drop duplicates, keep the canonical display order.
 *
 * Order comes from CAPABILITIES, never from the stored array — otherwise the grid
 * would reshuffle itself depending on the sequence the owner happened to tick the
 * boxes in.
 */
export function normalizeCapabilities(value: unknown): CapabilityId[] {
  if (!Array.isArray(value)) return [];
  const chosen = new Set(value.filter(isCapabilityId));
  return CAPABILITIES.map((c) => c.id).filter((id) => chosen.has(id));
}

/**
 * Does this project have a matrix at all?
 *
 * Lives here, not in the component: system-map.tsx is a "use client" module, and
 * a server component cannot CALL a function exported from one — it can only
 * render it. The build compiled fine and then died at prerender, which is a good
 * reminder that "compiled" is not "works".
 */
export function hasCapabilities(project: { capabilities?: string[] }): boolean {
  return (project.capabilities?.length ?? 0) > 0;
}
