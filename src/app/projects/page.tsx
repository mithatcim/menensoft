import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { ContactCTA } from "@/components/shared/contact-cta";
import { ProjectCard, ProjectCardLead } from "@/components/shared/project-card";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Systems I've designed and built end to end — e-commerce, operations, and platform work.",
};

export default function ProjectsPage() {
  const [lead, ...rest] = projects;

  return (
    <>
      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              as="h1"
              eyebrow="Projects"
              title="Selected work"
              description="Systems I design and build end to end, from active product builds to completed systems and internal prototypes. Case studies are still growing; each project page lists what exists today."
            />
          </Reveal>
          <Reveal className="mt-12">
            <ProjectCardLead project={lead} />
          </Reveal>
          <Reveal delay={0.08} className="mt-6 grid gap-6 md:grid-cols-2">
            {rest.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </Reveal>
        </Container>
      </section>
      <ContactCTA />
    </>
  );
}
