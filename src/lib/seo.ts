import type { Metadata } from "next";

import { site } from "@/content/site";

/**
 * Build consistent per-page metadata: a templated <title>, canonical URL, and
 * Open Graph / Twitter fields. Paths are relative and resolve against
 * `metadataBase` (set in the root layout).
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
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: ogTitle,
      description,
      url: path,
    },
    twitter: {
      title: ogTitle,
      description,
    },
  };
}
