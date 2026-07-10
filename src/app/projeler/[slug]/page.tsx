import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { CapabilityMatrix } from "@/components/projects/system-map";
import {
  DossierConstraints,
  DossierModules,
  DossierSummary,
  isCompactDossier,
} from "@/components/projects/system-dossier";
import {
  TeardownRail,
  type TeardownStage,
} from "@/components/projects/teardown-rail";
import {
  BrowserFrame,
  ScreenshotSlot,
} from "@/components/shared/browser-frame";
import { ContactCTA } from "@/components/shared/contact-cta";
import { FlowPanel } from "@/components/shared/flow-panel";
import { Reveal } from "@/components/shared/reveal";
import { TechTag } from "@/components/shared/tech-tag";
import { buttonVariants } from "@/components/ui/button";
import { getProject, projectImage, projects } from "@/content/projects";
import { pageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

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

/** Teardown progression — presentation labels only, content stays real. */
const TEARDOWN_STAGES: TeardownStage[] = [
  { id: "input", num: "01", label: "Girdi", sub: "Problem" },
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

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <>
      <section className="py-16 md:py-24">
        <Container>
          <article className="max-w-3xl xl:max-w-[62rem]">
            <Link
              href="/projeler"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Tüm projeler
            </Link>

            <div className="max-w-3xl">
              <h1 className="mt-8 text-4xl font-semibold tracking-tight text-balance md:text-5xl">
                {project.name}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                {project.oneLiner}
              </p>

              <Reveal className="mt-12 overflow-hidden rounded-xl border border-border bg-border">
                <dl className="grid gap-px sm:grid-cols-3">
                  <div className="bg-card p-5 transition-colors hover:bg-muted/20">
                    <dt className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                      Durum
                    </dt>
                    <dd className="mt-3 flex items-center gap-2 text-sm">
                      <span
                        aria-hidden
                        className="size-1.5 rounded-full bg-accent/90"
                      />
                      {project.statusLabel}
                      {project.year && (
                        <span className="text-muted-foreground">
                          {project.year}
                        </span>
                      )}
                    </dd>
                  </div>
                  {project.role ? (
                    <div className="bg-card p-5 transition-colors hover:bg-muted/20">
                      <dt className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                        Rol
                      </dt>
                      <dd className="mt-3 text-sm">{project.role}</dd>
                    </div>
                  ) : (
                    <div className="bg-card p-5 transition-colors hover:bg-muted/20">
                      <dt className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                        Proje dosyası
                      </dt>
                      <dd className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        Detaylar proje olgunlaştıkça eklenir.
                      </dd>
                    </div>
                  )}
                  <div className="bg-card p-5 transition-colors hover:bg-muted/20">
                    <dt className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                      Teknoloji
                    </dt>
                    <dd className="mt-3 flex flex-wrap gap-2">
                      {project.stack.map((tech) => (
                        <TechTag key={tech}>{tech}</TechTag>
                      ))}
                    </dd>
                  </div>
                </dl>
              </Reveal>

              <Reveal delay={0.05} className="mt-6">
                <DossierSummary project={project} />
              </Reveal>
            </div>

            {/* system teardown: sticky rail on xl, stage chips everywhere */}
            <div className="mt-14 xl:grid xl:grid-cols-[180px_minmax(0,1fr)] xl:gap-12">
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
                    <StageChip num="01" label="Girdi — problem" />
                    <h2 className="mt-4 text-xl font-semibold tracking-tight">
                      Çözdüğü problem
                    </h2>
                    <p className="mt-3 leading-relaxed text-muted-foreground">
                      {project.problem}
                    </p>
                    <DossierConstraints project={project} />
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
                    <div className="mt-4">
                      <BrowserFrame
                        title={`/${project.slug}`}
                        image={projectImage(project)}
                      >
                        <ScreenshotSlot />
                      </BrowserFrame>
                    </div>
                    {project.modules ? (
                      <DossierModules project={project} />
                    ) : (
                      <div className="mt-5 overflow-hidden rounded-xl border border-border">
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
                  </section>
                </Reveal>

                <Reveal delay={0.04}>
                  <section
                    id="teardown-scope"
                    data-teardown="scope"
                    className="scroll-mt-28"
                  >
                    <StageChip num="04" label="Kapsam — güncel durum" />
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
                      {project.outcome && (
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                          {project.outcome}
                        </p>
                      )}
                      <p className="mt-4 border-t border-border/60 pt-4">
                        <Link
                          href="/teklif-al"
                          className="group inline-flex items-center gap-2 text-sm font-medium text-foreground/90 transition-colors hover:text-foreground"
                        >
                          Benzer bir sistem için teklif al
                          <ArrowUpRight className="size-4 text-accent transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </Link>
                      </p>
                      {(project.liveUrl || project.repoUrl) && (
                        <div className="mt-5 flex flex-wrap gap-3">
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className={cn(
                                buttonVariants({ variant: "outline" }),
                              )}
                            >
                              Canlı siteyi gör
                              <ArrowUpRight className="size-4" />
                            </a>
                          )}
                          {project.repoUrl && (
                            <a
                              href={project.repoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className={cn(
                                buttonVariants({ variant: "outline" }),
                              )}
                            >
                              Kod deposunu görüntüle
                              <ArrowUpRight className="size-4" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </section>
                </Reveal>
              </div>
            </div>
          </article>
        </Container>
      </section>
      <ContactCTA />
    </>
  );
}
