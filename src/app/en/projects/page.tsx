import { Container } from "@/components/layout/container";
import { ProjectCommandDeck } from "@/components/projects/command-deck";
import { ContactCTA } from "@/components/shared/contact-cta";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { getPublishedProjects } from "@/lib/projects/public";
import type { ProjectTier, PublicProject } from "@/lib/projects/types";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Projects",
  description:
    "Systems designed and built end to end — e-commerce infrastructure, operations systems and corporate web work.",
  path: "/en/projects",
});

const TIER_LABEL: Record<ProjectTier, string> = {
  delivered: "completed system",
  internal: "internal infrastructure / earlier work",
};

function StatusRail({ projects }: { projects: PublicProject[] }) {
  const counts = new Map<ProjectTier, number>();
  for (const project of projects) {
    counts.set(project.tier, (counts.get(project.tier) ?? 0) + 1);
  }
  return (
    <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2.5 border-y border-border/60 py-4">
      {[...counts.entries()].map(([tier, count]) => (
        <span
          key={tier}
          className="flex items-center gap-2 font-mono text-xs text-muted-foreground"
        >
          <span aria-hidden className="size-1.5 rounded-full bg-accent/80" />
          {count} × {TIER_LABEL[tier]}
        </span>
      ))}
    </div>
  );
}

export default async function EnProjectsPage() {
  const projects = await getPublishedProjects("en");

  return (
    <>
      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              as="h1"
              eyebrow="Projects — command deck"
              title="Delivered systems"
              description="Systems designed and built end to end: from product infrastructure to operations systems and internal platform work. Select a project to inspect it; every project page lists what exists today."
            />
          </Reveal>
          <Reveal delay={0.05}>
            <StatusRail projects={projects} />
          </Reveal>
          <ProjectCommandDeck projects={projects} locale="en" />
        </Container>
      </section>
      <ContactCTA locale="en" />
    </>
  );
}
