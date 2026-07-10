import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { ProjectCard } from "@/components/shared/project-card";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { featuredProjects } from "@/content/projects";

export function FeaturedProjectsSection() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <Reveal>
          <div className="flex items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Seçili işler"
              title="Projeler"
              description="Kurulan sistemlerden bir seçki: e-ticaret, operasyon ve platform çalışmaları."
            />
            <Link
              href="/projeler"
              className="hidden shrink-0 items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground md:inline-flex"
            >
              Tüm projeler
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project, index) => (
            <Reveal key={project.slug} delay={index * 0.08} className="h-full">
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
        <div className="mt-8 md:hidden">
          <Link
            href="/projeler"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Tüm projeler
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
