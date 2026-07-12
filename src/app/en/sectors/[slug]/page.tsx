import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  AnswerSection,
  BulletPanel,
  ChipLinks,
  CtaBand,
  ModuleGrid,
  RelatedProjects,
} from "@/components/hub/blocks";
import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/shared/json-ld";
import { Reveal } from "@/components/shared/reveal";
import { buttonVariants } from "@/components/ui/button";
import { getSectorEn, sectorsEn } from "@/content/en/sectors";
import { getSystemEn } from "@/content/en/systems";
import { breadcrumbSchema, graph, serviceSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";
import { inquiryHref } from "@/lib/inquiry";
import { cn } from "@/lib/utils";

interface SectorPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return sectorsEn.map((sector) => ({ slug: sector.slug }));
}

export async function generateMetadata({
  params,
}: SectorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const sector = getSectorEn(slug);
  if (!sector) return {};
  return pageMeta({
    title: sector.seoTitle,
    description: sector.seoDescription,
    path: `/en/sectors/${sector.slug}`,
  });
}

export default async function EnSectorPage({ params }: SectorPageProps) {
  const { slug } = await params;
  const sector = getSectorEn(slug);
  if (!sector) notFound();

  // A sector page is about the system that fits it: relatedSystems[0] is that
  // primary system, so the CTA prefills the wizard with it. The project (if any)
  // anchors the arrival confirmation. Both derived from existing content.
  const prefilledInquiry = inquiryHref({
    locale: "en",
    systemSlug: sector.relatedSystems[0],
    projectSlug: sector.relatedProjects[0]?.slug,
  });

  const systemLinks = sector.relatedSystems
    .map((s) => getSystemEn(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .map((s) => ({ label: s.title, href: `/en/systems/${s.slug}` }));

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbSchema([
            { name: "Home", path: "/en" },
            { name: "Sectors", path: "/en/sectors" },
            { name: sector.title, path: `/en/sectors/${sector.slug}` },
          ]),
          serviceSchema({
            name: sector.title,
            description: sector.seoDescription,
            path: `/en/sectors/${sector.slug}`,
          }),
        )}
      />
      <section className="py-16 md:py-24">
        <Container>
          <Link
            href="/en/sectors"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            All sectors
          </Link>

          <Reveal className="mt-8">
            <div className="max-w-3xl">
              <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                <span aria-hidden className="size-1.5 bg-accent/90" />
                {sector.eyebrow}
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance md:text-5xl">
                {sector.title}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                {sector.description}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href={prefilledInquiry}
                  className={cn(buttonVariants({ variant: "cta" }), "h-11 px-6")}
                >
                  Start a project conversation
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
            </div>
          </Reveal>

          <div className="mt-14 gap-12 lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            <div className="max-w-3xl space-y-14">
              <Reveal>
                <AnswerSection eyebrow="Problem" title="What jams in this sector?">
                  <p className="leading-relaxed text-muted-foreground">
                    {sector.problem}
                  </p>
                  <BulletPanel
                    title="Typical pains"
                    items={sector.pains}
                    quiet
                    className="mt-5"
                  />
                </AnswerSection>
              </Reveal>

              <Reveal delay={0.04}>
                <AnswerSection
                  eyebrow="Solution"
                  title="What does Menensoft build for this sector?"
                >
                  <BulletPanel items={sector.builds} />
                </AnswerSection>
              </Reveal>

              <Reveal delay={0.04}>
                <AnswerSection eyebrow="Modules" title="Which modules can it include?">
                  <ModuleGrid modules={sector.modules} />
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    Modules enter or leave the scope with the need; no fixed
                    package is sold — scope is set by your business.
                  </p>
                </AnswerSection>
              </Reveal>

              <Reveal delay={0.04}>
                <AnswerSection
                  eyebrow="Management"
                  title="What does the admin and dashboard side need?"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <BulletPanel title="Panel needs" items={sector.adminNeeds} />
                    <BulletPanel
                      title="Automation opportunities"
                      items={sector.automation}
                    />
                  </div>
                </AnswerSection>
              </Reveal>

              <Reveal delay={0.04}>
                <AnswerSection eyebrow="Delivery" title="What do you receive?">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <BulletPanel title="Delivered" items={sector.deliverables} />
                    <BulletPanel
                      title="What gets avoided"
                      items={sector.avoids}
                      quiet
                    />
                  </div>
                </AnswerSection>
              </Reveal>

              <Reveal delay={0.04}>
                <CtaBand
                  title={sector.ctaTitle}
                  text={sector.ctaText}
                  primaryLabel="Start a project"
                  primaryHref={prefilledInquiry}
                  locale="en"
                  contactFallback
                  secondaryLabel="See the process"
                  secondaryHref="/en/process"
                />
              </Reveal>
            </div>

            <aside className="mt-14 space-y-6 lg:sticky lg:top-24 lg:mt-0">
              <Reveal delay={0.08}>
                <div className="rounded-xl border border-border bg-card/60 p-5 ring-1 ring-white/5">
                  <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                    <span aria-hidden className="size-1.5 bg-accent/90" />
                    Related projects
                  </p>
                  <div className="mt-4">
                    <RelatedProjects items={sector.relatedProjects} locale="en" />
                  </div>
                </div>
              </Reveal>
              {systemLinks.length > 0 && (
                <Reveal delay={0.1}>
                  <div className="rounded-xl border border-border bg-card/60 p-5 ring-1 ring-white/5">
                    <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                      <span aria-hidden className="size-1.5 bg-accent/90" />
                      Related system types
                    </p>
                    <div className="mt-4">
                      <ChipLinks links={systemLinks} />
                    </div>
                  </div>
                </Reveal>
              )}
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
