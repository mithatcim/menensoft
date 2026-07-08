import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { ContactCTA } from "@/components/shared/contact-cta";
import { ProjectCard } from "@/components/shared/project-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Systems I've designed and built end to end — e-commerce, operations, and platform work.",
};

export default function ProjectsPage() {
  return (
    <>
      <section className="py-16 md:py-24">
        <Container>
          <SectionHeading
            as="h1"
            eyebrow="Projects"
            title="Selected work"
            description="Systems I've designed and built end to end. Case studies are drafts while the projects evolve — details get added as each one matures."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </Container>
      </section>
      <ContactCTA />
    </>
  );
}
