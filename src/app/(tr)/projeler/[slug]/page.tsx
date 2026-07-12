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
import { getProject, projectImage, projects } from "@/content/projects";
import { graph, projectBreadcrumbSchema, projectSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return pageMeta({
    title: project.name,
    description: project.oneLiner,
    path: `/projeler/${project.slug}`,
  });
}

/**
 * Teardown progression. Stage 01 now covers the constraints, not the problem:
 * the case-study hero above states the problem, and repeating that paragraph a
 * screen later was the page's clearest piece of duplication.
 */
const TEARDOWN_STAGES: TeardownStage[] = [
  { id: "input", num: "01", label: "Girdi", sub: "Kısıtlar" },
  { id: "architecture", num: "02", label: "Mimari", sub: "Sistem akışı" },
  { id: "interface", num: "03", label: "Arayüz", sub: "Neler kuruldu" },
  { id: "scope", num: "04", label: "Kapsam", sub: "Güncel durum" },
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

/** Every teardown stage owns a real h2 — the outline was h1 → one h2 before. */
function StageHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-4 text-xl font-semibold tracking-tight">{children}</h2>
  );
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const capture = projectImage(project);

  return (
    <>
      <JsonLd
        data={graph(projectBreadcrumbSchema(project), projectSchema(project))}
      />

      <CaseStudyHero project={project} />

      <section className="py-14 md:py-20">
        <Container>
          <article className="max-w-3xl xl:max-w-[62rem]">
            <div className="xl:grid xl:grid-cols-[180px_minmax(0,1fr)] xl:gap-12">
              <div className="hidden xl:block">
                <div className="sticky top-28">
                  <TeardownRail stages={TEARDOWN_STAGES} />
                </div>
              </div>

              <div className="max-w-3xl space-y-14">
                <Reveal>
                  <section
                    id="teardown-input"
                    data-teardown="input"
                    className="scroll-mt-28"
                  >
                    <StageChip num="01" label="Girdi — kısıtlar" />
                    <StageHeading>Kısıtlar ve tasarım kararları</StageHeading>
                    <p className="mt-3 mb-5 leading-relaxed text-muted-foreground">
                      Sistem bu kısıtlara göre kuruldu.
                    </p>
                    <DossierConstraints project={project} showLabel={false} />
                  </section>
                </Reveal>

                {project.flow && (
                  <Reveal delay={0.04}>
                    <section
                      id="teardown-architecture"
                      data-teardown="architecture"
                      className="scroll-mt-28"
                    >
                      <StageChip num="02" label="Mimari — sistem akışı" />
                      <StageHeading>Sistem akışı</StageHeading>
                      <FlowPanel
                        label="Sistem akışı"
                        nodes={project.flow}
                        className="mt-4"
                      />
                    </section>
                  </Reveal>
                )}

                <Reveal delay={0.04}>
                  <section
                    id="teardown-interface"
                    data-teardown="interface"
                    className="scroll-mt-28"
                  >
                    <StageChip num="03" label="Arayüz — neler kuruldu" />
                    <StageHeading>Neler kuruldu</StageHeading>

                    {/* The real modules lead. Until interface captures exist,
                        the built structure IS the proof — so it gets the visual
                        weight, and the reserved capture sits under it as a slim
                        strip instead of a 530px empty frame above it. */}
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
                        <ReservedCaptureStrip />
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
                    <StageChip num="04" label="Kapsam — güncel durum" />
                    <StageHeading>Kapsam ve güncel durum</StageHeading>
                    <div className="mt-4 rounded-xl border border-border bg-background/40 p-4">
                      <CapabilityMatrix
                        slug={project.slug}
                        quiet={isCompactDossier(project)}
                      />
                    </div>
                    <div className="mt-4 rounded-xl border border-border bg-card p-6">
                      <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                        <span
                          aria-hidden
                          className="size-1.5 rounded-full bg-accent/90"
                        />
                        Güncel durum &amp; kapsam
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {project.statusNote ??
                          `${project.statusLabel}. Detaylar proje olgunlaştıkça eklenir.`}
                      </p>
                    </div>
                  </section>
                </Reveal>
              </div>
            </div>
          </article>
        </Container>
      </section>

      <SimilarSystemBand project={project} />
      <ContactCTA />
    </>
  );
}
