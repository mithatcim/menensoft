import { Container } from "@/components/layout/container";
import { ProjectCommandDeck } from "@/components/projects/command-deck";
import { ContactCTA } from "@/components/shared/contact-cta";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { projectsEn } from "@/content/en/projects";
import { type ProjectTier } from "@/content/projects";
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

function StatusRail() {
  const counts = new Map<ProjectTier, number>();
  for (const project of projectsEn) {
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

export default function EnProjectsPage() {
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
            <StatusRail />
          </Reveal>
          <ProjectCommandDeck projects={projectsEn} locale="en" />
        </Container>
      </section>
      <ContactCTA locale="en" />
    </>
  );
}
