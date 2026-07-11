import type { Metadata } from "next";

import { site } from "@/content/site";
import { alternatePathFor, localeOfPath } from "@/lib/locale";

/**
 * Build consistent per-page metadata: a templated <title>, canonical URL,
 * reciprocal tr/en hreflang alternates, and Open Graph / Twitter fields.
 * Paths are relative and resolve against `metadataBase` (set in the root
 * layouts). The alternate-language path is derived from src/lib/locale.ts;
 * x-default points at the Turkish (primary) version.
 */
export function pageMeta({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const ogTitle = `${title} — ${site.name}`;
  const locale = localeOfPath(path);
  const altPath = alternatePathFor(path);
  const trPath = locale === "tr" ? path : altPath;
  const enPath = locale === "en" ? path : altPath;
  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: { tr: trPath, en: enPath, "x-default": trPath },
    },
    openGraph: {
      title: ogTitle,
      description,
      url: path,
      locale: locale === "tr" ? "tr_TR" : "en_US",
    },
    twitter: {
      title: ogTitle,
      description,
    },
  };
}
