import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Reveal } from "@/components/shared/reveal";
import { getProjectEn } from "@/content/en/projects";
import { getProject } from "@/content/projects";
import { type Locale } from "@/lib/locale";
import { cn } from "@/lib/utils";

/**
 * Early conversion strip for the tail pages (Phase 30).
 *
 * /hakkimda, /surec and /hazir-site-mi-ozel-sistem-mi were the last pages still
 * carrying the defect every other page in the funnel had fixed: the ask arrived
 * four to six screens down. /hakkimda was the worst — a single CTA at 5304px
 * and not one link to a real project, even though its own intro paragraph names
 * three of them in prose.
 *
 * So this is a compact strip, not a landing-page band: an eyebrow, one honest
 * line, optional proof chips, one CTA. It is deliberately generic — these pages
 * are about the brand and the process, not one system type, so guessing a `?tur=`
 * here would be a lie about what the visitor asked for.
 *
 * Proof chips link to real projects only, and keep the tier treatment they have
 * everywhere else: internal-tier work gets a dashed border and a muted dot, so
 * it can never read as client delivery.
 */

const COPY = {
  tr: { proofLabel: "Kanıt", projectBase: "/projeler" },
  en: { proofLabel: "Proof", projectBase: "/en/projects" },
} as const;

export function EarlyCta({
  locale = "tr",
  eyebrow,
  text,
  ctaLabel,
  ctaHref,
  proofSlugs = [],
  className,
}: {
  locale?: Locale;
  eyebrow: string;
  text: string;
  ctaLabel: string;
  /** Generic by design — no ?tur= on brand/process pages. */
  ctaHref: string;
  /** Real project slugs only. */
  proofSlugs?: string[];
  className?: string;
}) {
  const copy = COPY[locale];
  const lookup = locale === "en" ? getProjectEn : getProject;
  const proofs = proofSlugs
    .map((s) => lookup(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <Reveal className={className}>
      <div className="relative overflow-hidden rounded-xl border border-accent/25 bg-accent/5 p-5 md:p-6">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_20%_0%,rgba(139,140,248,0.07),transparent)]"
        />
        <div className="relative">
          <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
            <span aria-hidden className="size-1.5 bg-accent/90" />
            {eyebrow}
          </p>
          <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-foreground/90 md:text-base">
            {text}
          </p>

          {proofs.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {proofs.map((project) => {
                const internal = project.tier === "internal";
                return (
                  <li key={project.slug} className="min-w-0">
                    <Link
                      href={`${copy.projectBase}/${project.slug}`}
                      className={cn(
                        "group/proof flex min-w-0 items-center gap-2 rounded-lg border bg-background/50 px-2.5 py-1.5 text-xs transition-colors hover:bg-card",
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
                      <span className="min-w-0 truncate text-foreground/85">
                        {project.name}
                      </span>
                      <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground transition-colors group-hover/proof:text-foreground" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="mt-5">
            <Link
              href={ctaHref}
              className="group/cta inline-flex items-center justify-center gap-1.5 rounded-lg border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent/60 hover:bg-accent/15"
            >
              {ctaLabel}
              <ArrowRight className="size-4 shrink-0 text-accent transition-transform group-hover/cta:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
