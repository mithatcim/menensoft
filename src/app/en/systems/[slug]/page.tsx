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
import { FlowPanel } from "@/components/shared/flow-panel";
import { JsonLd } from "@/components/shared/json-ld";
import { Reveal } from "@/components/shared/reveal";
import { buttonVariants } from "@/components/ui/button";
import { getSectorEn } from "@/content/en/sectors";
import { getSystemEn, systemsEn } from "@/content/en/systems";
import { breadcrumbSchema, graph, serviceSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";
import { inquiryHref } from "@/lib/inquiry";
import { cn } from "@/lib/utils";

/** English mirror of the four-step engagement facts. */
const WORKFLOW_EN = [
  {
    step: "01",
    title: "Scope",
    description: "What gets built — and what stays out — is agreed first.",
  },
  {
    step: "02",
    title: "Build",
    description: "Working software ships in small, reviewable steps.",
  },
  {
    step: "03",
    title: "Iterate",
    description: "Adjusted to real use and feedback, not assumptions.",
  },
  {
    step: "04",
    title: "Handoff",
    description: "A working system; documented and cleanly handed over.",
  },
];

interface SystemPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return systemsEn.map((system) => ({ slug: system.slug }));
}

export async function generateMetadata({
  params,
}: SystemPageProps): Promise<Metadata> {
  const { slug } = await params;
  const system = getSystemEn(slug);
  if (!system) return {};
  return pageMeta({
    title: system.seoTitle,
    description: system.seoDescription,
    path: `/en/systems/${system.slug}`,
  });
}

export default async function EnSystemPage({ params }: SystemPageProps) {
  const { slug } = await params;
  const system = getSystemEn(slug);
  if (!system) notFound();

  // Every inquiry CTA on this page is about THIS system, so it prefills the
  // wizard instead of dropping the visitor on an empty one. The project (if
  // any) anchors the arrival confirmation. Both derived from existing content.
  const prefilledInquiry = inquiryHref({
    locale: "en",
    systemSlug: system.slug,
    projectSlug: system.relatedProjects[0]?.slug,
  });

  const sectorLinks = system.relatedSectors
    .map((s) => getSectorEn(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .map((s) => ({ label: s.title, href: `/en/sectors/${s.slug}` }));

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbSchema([
            { name: "Home", path: "/en" },
            { name: "Systems", path: "/en/systems" },
            { name: system.title, path: `/en/systems/${system.slug}` },
          ]),
          serviceSchema({
            name: system.title,
            description: system.seoDescription,
            path: `/en/systems/${system.slug}`,
          }),
        )}
      />
      <section className="py-16 md:py-24">
        <Container>
          <Link
            href="/en/systems"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            All systems
          </Link>

          <Reveal className="mt-8">
            <div className="max-w-3xl">
              <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                <span aria-hidden className="size-1.5 bg-accent/90" />
                {system.eyebrow}
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance md:text-5xl">
                {system.title}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                {system.description}
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
                  href="/en/process"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-11 px-6",
                  )}
                >
                  See the process
                </Link>
              </div>
            </div>
          </Reveal>

          <div className="mt-14 gap-12 lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            <div className="max-w-3xl space-y-14">
              <Reveal>
                <AnswerSection eyebrow="Definition" title="What is this system for?">
                  <p className="leading-relaxed text-muted-foreground">
                    {system.whatItIs}
                  </p>
                </AnswerSection>
              </Reveal>

              <Reveal delay={0.04}>
                <AnswerSection eyebrow="Fit" title="Who is it for?">
                  <BulletPanel items={system.whoNeeds} />
                </AnswerSection>
              </Reveal>

              <Reveal delay={0.04}>
                <AnswerSection
                  eyebrow="Modules"
                  title="Which modules can it include?"
                >
                  <ModuleGrid modules={system.modules} />
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    No fixed package is sold; the system need is clarified
                    first, and modules enter the scope based on your business.
                  </p>
                </AnswerSection>
              </Reveal>

              <Reveal delay={0.04}>
                <AnswerSection eyebrow="Architecture" title="How is it built?">
                  <FlowPanel label="System flow" nodes={system.archFlow} />
                  <BulletPanel items={system.archNotes} className="mt-4" />
                </AnswerSection>
              </Reveal>

              <Reveal delay={0.04}>
                <AnswerSection
                  eyebrow="Management"
                  title="What does the admin surface look like?"
                >
                  <BulletPanel items={system.adminSurface} />
                </AnswerSection>
              </Reveal>

              <Reveal delay={0.04}>
                <AnswerSection eyebrow="Process" title="How does the build run?">
                  <div className="overflow-hidden rounded-xl border border-border bg-border">
                    <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4">
                      {WORKFLOW_EN.map((step) => (
                        <div key={step.step} className="bg-card p-4">
                          <p className="font-mono text-xs text-accent/80">
                            {step.step}
                          </p>
                          <h3 className="mt-2 text-sm font-semibold tracking-tight">
                            {step.title}
                          </h3>
                          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                            {step.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    The full six-stage flow — from request to delivery — is on{" "}
                    <Link
                      href="/en/process"
                      className="text-foreground/85 underline-offset-4 transition-colors hover:text-foreground hover:underline"
                    >
                      the process page
                    </Link>
                    .
                  </p>
                </AnswerSection>
              </Reveal>

              <Reveal delay={0.04}>
                <AnswerSection eyebrow="Delivery" title="What do you receive?">
                  <BulletPanel items={system.deliverables} />
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    The goal is not just a good-looking page but a manageable,
                    working system: after handoff, you can run it yourself.
                  </p>
                </AnswerSection>
              </Reveal>

              <Reveal delay={0.04}>
                <CtaBand
                  title={system.ctaTitle}
                  text={system.ctaText}
                  primaryLabel="Start a project"
                  primaryHref={prefilledInquiry}
                  locale="en"
                  contactFallback
                  secondaryLabel="View projects"
                  secondaryHref="/en/projects"
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
                    <RelatedProjects items={system.relatedProjects} locale="en" />
                  </div>
                </div>
              </Reveal>
              {sectorLinks.length > 0 && (
                <Reveal delay={0.1}>
                  <div className="rounded-xl border border-border bg-card/60 p-5 ring-1 ring-white/5">
                    <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                      <span aria-hidden className="size-1.5 bg-accent/90" />
                      Related sectors
                    </p>
                    <div className="mt-4">
                      <ChipLinks links={sectorLinks} />
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
