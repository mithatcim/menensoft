import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Reveal } from "@/components/shared/reveal";
import { SpotlightCard } from "@/components/shared/spotlight-card";
import { fitIdForSystem, inquiryHref } from "@/lib/inquiry";
import { type Locale } from "@/lib/locale";
import { getPublishedProjects } from "@/lib/projects/public";
import { cn } from "@/lib/utils";

/**
 * Shared card for the Systems and Sectors hubs (Phase 26).
 *
 * These hubs used to print a count — "3 modül · 3 ilgili proje" — where the
 * real project's name belonged, and their cards linked nowhere but the detail
 * page. A count is the weakest thing a card can say: it tells a buyer that
 * proof exists without ever showing it.
 *
 * So the card now names the project that proves the system and links to it,
 * and carries a prefilled inquiry CTA. Proof convinces, the CTA converts —
 * they are deliberately different links: proof goes to the project page, never
 * straight to the wizard.
 *
 * The whole card can no longer be one big link (it holds three of them now),
 * which is also why SpotlightCard is used without `href`.
 *
 * Internal-tier projects keep the honest treatment they have everywhere else:
 * dashed border, muted dot. A sector page must never imply that internal work
 * was client work.
 */

const COPY = {
  tr: {
    proofLabel: "Kanıt",
    inquiry: "Bu sistemi konuşalım",
    projectBase: "/projeler",
  },
  en: {
    proofLabel: "Proof",
    inquiry: "Discuss this system",
    projectBase: "/en/projects",
  },
} as const;

/**
 * Where a card lists several honest proofs, prefer the one that spreads the
 * evidence instead of repeating the same project. Keyed by fit id because that
 * is locale-stable (the system slugs are not), and only ever applied when the
 * slug is genuinely in THAT card's own related list — proof is never borrowed
 * from an unrelated project. Same discipline as ServicesPreview (Phase 19B).
 *
 * Without this, /sistemler proved six systems with only three projects and the
 * two internal-tier ones never appeared at all.
 */
const PREFERRED_PROOF: Record<string, string> = {
  dashboard: "log-management-platform",
  otomasyon: "cendovar",
};

function pickProof(slugs: string[], fitId: string | undefined) {
  const preferred = fitId ? PREFERRED_PROOF[fitId] : undefined;
  if (preferred && slugs.includes(preferred)) return preferred;
  return slugs[0];
}

export interface HubCardProps {
  eyebrow: string;
  title: string;
  description: string;
  /** The hub's own detail page. */
  detailHref: string;
  detailLabel: string;
  /** The system this card is about — drives the ?tur= prefill. */
  systemSlug?: string;
  /** This card's own related project slugs, in the content's own order. */
  proofSlugs?: string[];
  locale?: Locale;
  delay?: number;
}

export async function HubCard({
  eyebrow,
  title,
  description,
  detailHref,
  detailLabel,
  systemSlug,
  proofSlugs = [],
  locale = "tr",
  delay = 0,
}: HubCardProps) {
  const copy = COPY[locale];
  // Published projects only (38C): an archived project stops being proof.
  const published = await getPublishedProjects(locale);
  const lookupProject = (slug: string) =>
    published.find((project) => project.slug === slug);

  const fitId = fitIdForSystem(systemSlug, locale);
  const proofSlug = pickProof(proofSlugs, fitId);
  const proof = proofSlug ? lookupProject(proofSlug) : undefined;
  const internal = proof?.tier === "internal";

  return (
    <Reveal delay={delay} className="h-full min-w-0">
      <SpotlightCard className="flex h-full flex-col rounded-xl border border-border bg-card/70 p-5 ring-1 ring-white/5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_28px_56px_-24px_rgba(0,0,0,0.85)] md:p-6">
        {/* The title IS the detail link and the arrow says so — the same
            affordance the card had before Phase 26, when the whole card was one
            <a>. A separate "view detail" link in the CTA row linked the same
            page a second time and wrapped onto its own line on mobile. */}
        <div className="flex items-start justify-between gap-4">
          <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
            <span aria-hidden className="size-1.5 bg-accent/90" />
            {eyebrow}
          </p>
          <ArrowUpRight
            aria-hidden
            className="size-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
          />
        </div>

        <h2 className="mt-3.5 text-lg font-semibold tracking-tight text-balance md:mt-4">
          <Link
            href={detailHref}
            aria-label={detailLabel}
            className="transition-colors hover:text-accent"
          >
            {title}
          </Link>
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        <div className="mt-auto pt-4 md:pt-5">
          {/* the count this replaces said proof existed; this shows it */}
          {proof && (
            <Link
              href={`${copy.projectBase}/${proof.slug}`}
              className={cn(
                "group/proof flex w-full min-w-0 items-center gap-2 rounded-lg border bg-background/50 px-2.5 py-1.5 text-xs transition-colors hover:bg-card",
                internal
                  ? "border-dashed border-border hover:border-foreground/25"
                  : "border-border hover:border-accent/40",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "size-1.5 shrink-0 rounded-full",
                  internal ? "bg-muted-foreground/50" : "bg-accent/80",
                )}
              />
              <span className="shrink-0 font-mono tracking-widest text-muted-foreground/70 uppercase">
                {copy.proofLabel}
              </span>
              <span className="min-w-0 flex-1 truncate text-foreground/85">
                {proof.name}
              </span>
              <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground transition-colors group-hover/proof:text-foreground" />
            </Link>
          )}

          <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-2 md:mt-3">
            <Link
              href={inquiryHref({ locale, systemSlug })}
              className="group/cta inline-flex items-center justify-center gap-1.5 rounded-lg border border-accent/40 bg-accent/10 px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-accent/60 hover:bg-accent/15"
            >
              {copy.inquiry}
              <ArrowRight className="size-3.5 shrink-0 text-accent transition-transform group-hover/cta:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </SpotlightCard>
    </Reveal>
  );
}
