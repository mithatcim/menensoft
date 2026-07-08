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
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 font-mono text-xs text-muted-foreground">
              {projectStatusLabel[project.status]}
            </p>

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
                <ul className="mt-3 space-y-2">
                  {project.built.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 leading-relaxed text-muted-foreground"
                    >
                      <span
                        aria-hidden
                        className="mt-2.5 size-1 shrink-0 rounded-full bg-foreground/40"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold tracking-tight">Stack</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <TechTag key={tech}>{tech}</TechTag>
                  ))}
                </div>
              </div>

              <p className="rounded-xl border border-border bg-card p-4 font-mono text-xs leading-relaxed text-muted-foreground">
                Draft case study — screenshots, architecture notes, and
                outcomes will be added as this project matures.
              </p>
            </div>
          </article>
        </Container>
      </section>
      <ContactCTA />
    </>
  );
}
