import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { ContactCTA } from "@/components/shared/contact-cta";
import { TechTag } from "@/components/shared/tech-tag";
import { getProject, projects, projectStatusLabel } from "@/content/projects";

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
  return {
    title: project.name,
    description: project.oneLiner,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <>
      <section className="py-16 md:py-24">
        <Container>
          <article className="max-w-3xl">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              All projects
            </Link>

            <h1 className="mt-8 text-4xl font-semibold tracking-tight text-balance md:text-5xl">
              {project.name}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {project.oneLiner}
            </p>

            <div className="mt-12 overflow-hidden rounded-xl border border-border bg-border">
              <dl className="grid gap-px sm:grid-cols-3">
                <div className="bg-card p-5">
                  <dt className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                    Status
                  </dt>
                  <dd className="mt-3 flex items-center gap-2 text-sm">
                    <span
                      aria-hidden
                      className="size-1.5 rounded-full bg-amber-400/90"
                    />
                    {projectStatusLabel[project.status]}
                  </dd>
                </div>
                <div className="bg-card p-5">
                  <dt className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                    Stack
                  </dt>
                  <dd className="mt-3 flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <TechTag key={tech}>{tech}</TechTag>
                    ))}
                  </dd>
                </div>
                <div className="bg-card p-5">
                  <dt className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                    Case study
                  </dt>
                  <dd className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Draft — details get added as the build matures.
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-14 space-y-12">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">
                  The problem it handles
                </h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {project.problem}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold tracking-tight">
                  What I built
                </h2>
                <div className="mt-4 overflow-hidden rounded-xl border border-border">
                  <ul className="divide-y divide-border/60">
                    {project.built.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-3 bg-card px-5 py-3.5 text-sm leading-relaxed text-muted-foreground"
                      >
                        <span
                          aria-hidden
                          className="size-1.5 shrink-0 bg-amber-400/80"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                  <span
                    aria-hidden
                    className="size-1.5 rounded-full bg-amber-400/90"
                  />
                  Current status &amp; scope
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {projectStatusLabel[project.status]}. Screenshots,
                  architecture notes, and outcomes will be added as this
                  project matures.
                </p>
              </div>
            </div>
          </article>
        </Container>
      </section>
      <ContactCTA />
    </>
  );
}
