import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { CaseStudyHero } from "@/components/projects/case-study-hero";
import { SimilarSystemBand } from "@/components/projects/similar-system-band";
import { CapabilityMatrix } from "@/components/projects/system-map";
import {
  DossierConstraints,
  DossierModules,
  isCompactDossier,
} from "@/components/projects/system-dossier";
import {
  TeardownRail,
  type TeardownStage,
} from "@/components/projects/teardown-rail";
import {
  BrowserFrame,
  ReservedCaptureStrip,
} from "@/components/shared/browser-frame";
import { ContactCTA } from "@/components/shared/contact-cta";
import { FlowPanel } from "@/components/shared/flow-panel";
import { JsonLd } from "@/components/shared/json-ld";
import { Reveal } from "@/components/shared/reveal";
import { getProjectEn, projectsEn } from "@/content/en/projects";
import { projectImage } from "@/content/projects";
import { breadcrumbSchema, graph, projectSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projectsEn.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectEn(slug);
  if (!project) return {};
  return pageMeta({
    title: project.name,
    description: project.oneLiner,
    path: `/en/projects/${project.slug}`,
  });
}

/** Stage 01 covers constraints; the case-study hero above states the problem. */
const TEARDOWN_STAGES: TeardownStage[] = [
  { id: "input", num: "01", label: "Input", sub: "Constraints" },
  { id: "architecture", num: "02", label: "Architecture", sub: "System flow" },
  { id: "interface", num: "03", label: "Interface", sub: "What was built" },
  { id: "scope", num: "04", label: "Scope", sub: "Current status" },
];

function StageChip({ num, label }: { num: string; label: string }) {
  return (
    <p className="flex items-center gap-2.5 font-mono text-xs tracking-widest text-muted-foreground uppercase">
      <span className="flex size-6 items-center justify-center rounded-md border border-accent/30 bg-accent/5 text-accent">
        {num}
      </span>
      {label}
    </p>
  );
}

function StageHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-4 text-xl font-semibold tracking-tight">{children}</h2>
  );
}

export default async function EnProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectEn(slug);
  if (!project) notFound();

  const capture = projectImage(project);

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbSchema([
            { name: "Home", path: "/en" },
            { name: "Projects", path: "/en/projects" },
            { name: project.name, path: `/en/projects/${project.slug}` },
          ]),
          projectSchema(project, {
            path: `/en/projects/${project.slug}`,
            inLanguage: "en",
          }),
        )}
      />

      <CaseStudyHero project={project} locale="en" />

      <section className="py-14 md:py-20">
        <Container>
          <article className="max-w-3xl xl:max-w-[62rem]">
            <div className="xl:grid xl:grid-cols-[180px_minmax(0,1fr)] xl:gap-12">
              <div className="hidden xl:block">
                <div className="sticky top-28">
                  <TeardownRail
                    stages={TEARDOWN_STAGES}
                    ariaLabel="Teardown stages"
                  />
                </div>
              </div>

              <div className="max-w-3xl space-y-14">
                <Reveal>
                  <section
                    id="teardown-input"
                    data-teardown="input"
                    className="scroll-mt-28"
                  >
                    <StageChip num="01" label="Input — constraints" />
                    <StageHeading>Constraints and design decisions</StageHeading>
                    <p className="mt-3 mb-5 leading-relaxed text-muted-foreground">
                      The scope was drawn against these constraints — they are
                      the decisions that gave the system its shape.
                    </p>
                    <DossierConstraints
                      project={project}
                      locale="en"
                      showLabel={false}
                    />
                  </section>
                </Reveal>

                {project.flow && (
                  <Reveal delay={0.04}>
                    <section
                      id="teardown-architecture"
                      data-teardown="architecture"
                      className="scroll-mt-28"
                    >
                      {/* no FlowPanel label: the stage chip and h2 above already
                          say "System flow" — it read three times */}
                      <StageChip num="02" label="Architecture — system flow" />
                      <StageHeading>System flow</StageHeading>
                      <FlowPanel nodes={project.flow} className="mt-4" />
                    </section>
                  </Reveal>
                )}

                <Reveal delay={0.04}>
                  <section
                    id="teardown-interface"
                    data-teardown="interface"
                    className="scroll-mt-28"
                  >
                    <StageChip num="03" label="Interface — what was built" />
                    <StageHeading>What was built</StageHeading>

                    {/* Modules lead; the reserved capture follows as a slim
                        strip. Real structure outweighs an empty frame. */}
                    {project.modules ? (
                      <div className="mt-4">
                        <DossierModules project={project} />
                      </div>
                    ) : (
                      <div className="mt-4 overflow-hidden rounded-xl border border-border">
                        <ul className="divide-y divide-border/60">
                          {project.built.map((item) => (
                            <li
                              key={item}
                              className="flex items-center gap-3 bg-card px-5 py-3.5 text-sm leading-relaxed text-muted-foreground"
                            >
                              <span
                                aria-hidden
                                className="size-1.5 shrink-0 bg-accent/80"
                              />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="mt-4">
                      {capture ? (
                        <BrowserFrame
                          title={`/${project.slug}`}
                          image={capture}
                        />
                      ) : (
                        <ReservedCaptureStrip
                          label="Screenshot slot reserved — interface capture to be added"
                          cornerLabel="interface preview"
                        />
                      )}
                    </div>
                  </section>
                </Reveal>

                <Reveal delay={0.04}>
                  <section
                    id="teardown-scope"
                    data-teardown="scope"
                    className="scroll-mt-28"
                  >
                    <StageChip num="04" label="Scope — current status" />
                    <StageHeading>Scope and current status</StageHeading>
                    <div className="mt-4 rounded-xl border border-border bg-background/40 p-4">
                      <CapabilityMatrix
                        slug={project.slug}
                        quiet={isCompactDossier(project)}
                        locale="en"
                      />
                    </div>
                    <div className="mt-4 rounded-xl border border-border bg-card p-6">
                      <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                        <span
                          aria-hidden
                          className="size-1.5 rounded-full bg-accent/90"
                        />
                        Current status &amp; scope
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {project.statusNote ??
                          `${project.statusLabel}. Details get added as the project matures.`}
                      </p>
                    </div>
                  </section>
                </Reveal>
              </div>
            </div>
          </article>
        </Container>
      </section>

      <SimilarSystemBand project={project} locale="en" />
      <ContactCTA locale="en" />
    </>
  );
}
