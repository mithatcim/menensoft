import { fitSystemsEn } from "@/content/en/fit";
import { fitSystems } from "@/content/fit";
import { type Locale } from "@/lib/locale";

/**
 * Prefilled inquiry links (Phase 26).
 *
 * Before this, not a single inquiry CTA on the Solutions / Systems / Sectors
 * pages carried `?tur=` — roughly thirty buttons across both locales dropped
 * the visitor on an empty wizard and made them re-select the very thing they
 * had just clicked. The homepage stage, ServicesPreview and the project pages
 * had all been wired; this whole family never was.
 *
 * Nothing new is invented to fix it. Every mapping already exists in content:
 * the wizard's fit options carry the system slug they belong to, so the slug a
 * page is already about is enough to derive its fit id. Solutions map through
 * `solution.systemSlug`, systems through their own slug, and sectors through
 * `relatedSystems[0]` — their primary system.
 *
 * Fit ids are locale-stable; the SYSTEM slugs are not (e-ticaret-sistemi vs
 * ecommerce-system), so the lookup has to be locale-aware. It degrades to the
 * bare inquiry route when nothing maps, rather than emitting a `?tur=` the
 * wizard would silently ignore.
 */

const QUOTE_BASE: Record<Locale, string> = {
  tr: "/teklif-al",
  en: "/en/start-project",
};

/** Locale-specific system slug -> the wizard fit id that owns it. */
export function fitIdForSystem(
  systemSlug: string | undefined,
  locale: Locale = "tr",
): string | undefined {
  if (!systemSlug) return undefined;
  const pool = locale === "en" ? fitSystemsEn : fitSystems;
  return pool.find((f) => f.systemSlug === systemSlug)?.id;
}

/**
 * Build an inquiry href, prefilled as far as the page's own context allows.
 * `projectSlug` is only passed where a page is genuinely anchored to one real
 * project, so the inquiry studio can confirm where the visitor came from.
 */
export function inquiryHref({
  locale = "tr",
  systemSlug,
  projectSlug,
}: {
  locale?: Locale;
  /** The system this page/card is about. Omit for generic entry points. */
  systemSlug?: string;
  /** A real project slug that anchors this page. */
  projectSlug?: string;
}): string {
  const base = QUOTE_BASE[locale];
  const fitId = fitIdForSystem(systemSlug, locale);

  const params: string[] = [];
  if (fitId) params.push(`tur=${fitId}`);
  if (projectSlug) params.push(`proje=${projectSlug}`);

  return params.length ? `${base}?${params.join("&")}` : base;
}
