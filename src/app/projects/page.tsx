import { Container } from "@/components/layout/container";
import { ContactCTA } from "@/components/shared/contact-cta";
import { ProjectCard, ProjectCardLead } from "@/components/shared/project-card";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import {
  projects,
  projectStatusLabel,
  type ProjectStatus,
} from "@/content/projects";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Projects",
  description:
    "Systems I've designed and built end to end — e-commerce, operations, and platform work.",
  path: "/projects",
});

function StatusRail() {
  const counts = new Map<ProjectStatus, number>();
  for (const project of projects) {
    counts.set(project.status, (counts.get(project.status) ?? 0) + 1);
  }
  return (
    <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2.5 border-y border-border/60 py-4">
      {[...counts.entries()].map(([status, count]) => (
        <span
          key={status}
          className="flex items-center gap-2 font-mono text-xs text-muted-foreground"
        >
          <span aria-hidden className="size-1.5 rounded-full bg-accent/80" />
          {count} × {projectStatusLabel[status].toLowerCase()}
        </span>
      ))}
    </div>
  );
}

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
          <Reveal delay={0.05}>
            <StatusRail />
          </Reveal>
          <Reveal className="mt-10">
            <ProjectCardLead project={lead} />
          </Reveal>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {rest.map((project, index) => (
              <Reveal
                key={project.slug}
                delay={index * 0.07}
                className="h-full"
              >
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
      <ContactCTA />
    </>
  );
}
