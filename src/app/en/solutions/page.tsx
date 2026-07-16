import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { ContactCTA } from "@/components/shared/contact-cta";
import { JsonLd } from "@/components/shared/json-ld";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { SpotlightCard } from "@/components/shared/spotlight-card";
import { buttonVariants } from "@/components/ui/button";
import { getPublishedProjects } from "@/lib/projects/public";
import {
  audienceEn,
  avoidedEn,
  solutionsEn,
  triggersEn,
} from "@/content/en/solutions";
import { graph, serviceSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";
import { inquiryHref } from "@/lib/inquiry";
import { cn } from "@/lib/utils";
import { landingPagesEn } from "@/content/en/landing";

export const metadata = pageMeta({
  title: "Solutions",
  description:
    "E-commerce systems, admin panels, dashboards, workflow automation, corporate websites and operations systems — working web systems built end to end for your business.",
  path: "/en/solutions",
});

/**
 * Phase 27: the "What you receive" block is gone. The same promise appeared in
 * five places -- the homepage BuyerBridge, every system detail page, every sector
 * detail page and the FAQ -- and this was the vaguest of them. Every card on this
 * page already links to a detail page that answers it concretely. The three that
 * remain (who it fits, when you need it, what gets avoided) exist only here.
 */
const CONVERSION_BLOCKS = [
  { title: "Who it fits", items: audienceEn, quiet: false },
  { title: "When you need this", items: triggersEn, quiet: false },
  { title: "What gets avoided", items: avoidedEn, quiet: true },
];

export default async function EnSolutionsPage() {
  // Published projects only — see the Turkish page.
  const published = await getPublishedProjects("en");
  const bySlug = new Map(published.map((p) => [p.slug, p]));

  return (
    <>
      <div className="surface-light">
      <JsonLd
        data={graph(
          solutionsEn.map((s) =>
            serviceSchema({
              name: s.title,
              description: s.problem,
              path: `/en/solutions#${s.id}`,
            }),
          ),
        )}
      />
      <section className="pt-16 pb-10 md:pt-24 md:pb-12">
        <Container>
          <Reveal>
            <SectionHeading
              as="h1"
              eyebrow="Solutions"
              title="Which problem do you want to solve?"
              description="A quick map of six solution areas: recognize the problem, see what gets built, follow the proof to a project. For depth, every area has a detailed system page."
            />
          </Reveal>
          <Reveal delay={0.06}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/en/start-project"
                className={cn(buttonVariants({ variant: "cta" }), "h-11 px-6")}
              >
                Start a project
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/en/projects"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-11 px-6",
                )}
              >
                View projects
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="py-8 md:py-12">
        <Container>
          <div className="grid gap-5 md:gap-6">
            {solutionsEn.map((solution) => {
              const related = solution.relatedSlugs
                .map((slug) => bySlug.get(slug))
                .filter((p): p is NonNullable<typeof p> => Boolean(p));
              return (
                <Reveal key={solution.id}>
                  <SpotlightCard
                    id={solution.id}
                    className="scroll-mt-24 rounded-xl border border-border bg-card/70 ring-1 ring-white/5 backdrop-blur-sm transition-all duration-300 hover:border-accent/25 hover:ring-accent/10"
                  >
                    <div className="p-5 md:p-8">
                      <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
                        {solution.title}
                      </h2>
                      <div className="mt-4 grid gap-5 md:mt-6 md:grid-cols-2 md:gap-8">
                        <div>
                          <h3 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                            The problem it solves
                          </h3>
                          <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                            {solution.problem}
                          </p>
                          {related.length > 0 && (
                            <div className="mt-3.5 md:mt-5">
                              <h3 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                                Proven in
                              </h3>
                              <div className="mt-3 flex flex-wrap gap-2">
                                {related.map((project) => (
                                  <Link
                                    key={project.slug}
                                    href={`/en/projects/${project.slug}`}
                                    className="group flex items-center gap-2 rounded-lg border border-border bg-background/50 px-3 py-1.5 text-sm transition-colors hover:border-accent/40 hover:bg-card"
                                  >
                                    <span
                                      aria-hidden
                                      className="size-1.5 rounded-full bg-accent/80"
                                    />
                                    <span className="text-foreground/85">
                                      {project.name}
                                    </span>
                                    <ArrowUpRight className="size-3.5 text-muted-foreground transition-colors group-hover:text-foreground" />
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                            What gets built
                          </h3>
                          <ul className="mt-3 space-y-1.5 md:space-y-2">
                            {solution.builds.map((item) => (
                              <li
                                key={item}
                                className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                              >
                                <span
                                  aria-hidden
                                  className="mt-2 size-1 shrink-0 rounded-full bg-accent/80"
                                />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border bg-background/30 px-5 py-3.5 md:px-8 md:py-4">
                      <Link
                        href={inquiryHref({
                          locale: "en",
                          systemSlug: solution.systemSlug,
                        })}
                        className="group inline-flex items-center gap-2 py-1 text-sm font-medium text-foreground/90 transition-colors hover:text-foreground"
                      >
                        Discuss this system
                        <ArrowRight className="size-4 text-accent transition-transform group-hover:translate-x-0.5" />
                      </Link>
                      <Link
                        href={`/en/systems/${solution.systemSlug}`}
                        className="group inline-flex items-center gap-2 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        See the system in depth
                        <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </SpotlightCard>
                </Reveal>
              );
            })}
          </div>

          <div className="mt-14 md:mt-24">
            <Reveal>
              <SectionHeading
                eyebrow="Clear scope"
                title="The right work, the right expectations"
                description="Working facts, not sales polish: who these systems serve, when they're needed, what delivery includes — and what gets a plain no."
              />
            </Reveal>
            <Reveal delay={0.08} className="mt-8 md:mt-10">
              <div className="overflow-hidden rounded-xl border border-border bg-border">
                <div className="grid gap-px sm:grid-cols-3">
                  {CONVERSION_BLOCKS.map((block) => (
                    <div
                      key={block.title}
                      className={cn(
                        "p-4 md:p-6",
                        block.quiet ? "bg-card/60" : "bg-card",
                      )}
                    >
                      <h3
                        className={cn(
                          "flex items-center gap-2 font-mono text-xs tracking-widest uppercase",
                          block.quiet
                            ? "text-muted-foreground/70"
                            : "text-muted-foreground",
                        )}
                      >
                        <span
                          aria-hidden
                          className={cn(
                            "size-1.5",
                            block.quiet
                              ? "rotate-45 border border-muted-foreground/50"
                              : "bg-accent/90",
                          )}
                        />
                        {block.title}
                      </h3>
                      <ul className="mt-3.5 space-y-2 md:mt-4 md:space-y-2.5">
                        {block.items.map((item) => (
                          <li
                            key={item}
                            className={cn(
                              "flex gap-3 text-sm leading-relaxed",
                              block.quiet
                                ? "text-muted-foreground"
                                : "text-foreground/90",
                            )}
                          >
                            <span
                              aria-hidden
                              className={cn(
                                "mt-2 size-1 shrink-0",
                                block.quiet
                                  ? "rotate-45 border border-muted-foreground/40"
                                  : "rounded-full bg-accent/80",
                              )}
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Phase 40 — landing pages are linked from here. Adding seven more links
          to the footer would be footer spam; this hub is already in the main nav
          and the context is right. */}
      <section className="pb-16 md:pb-24">
        <Container>
          <Reveal>
            <h2 className="text-xl font-semibold tracking-tight">
              What are you looking for?
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Commonly searched topics — each one links to a system that was
              actually built.
            </p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {landingPagesEn.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/en/${p.slug}`}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-card/60 px-4 py-3 transition-colors hover:border-accent/40"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">
                        {p.title}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                        {p.eyebrow}
                      </span>
                    </span>
                    <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-accent" />
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>
      </div>
      <ContactCTA locale="en" />
    </>
  );
}
