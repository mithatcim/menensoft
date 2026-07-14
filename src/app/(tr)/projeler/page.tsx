import { Container } from "@/components/layout/container";
import { ProjectCommandDeck } from "@/components/projects/command-deck";
import { ContactCTA } from "@/components/shared/contact-cta";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { getPublishedProjects } from "@/lib/projects/public";
import type { ProjectTier, PublicProject } from "@/lib/projects/types";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Projeler",
  description:
    "Uçtan uca tasarlanıp geliştirilen sistemler — e-ticaret altyapısı, operasyon sistemleri ve kurumsal web çalışmaları.",
  path: "/projeler",
});

const TIER_LABEL: Record<ProjectTier, string> = {
  delivered: "tamamlanmış sistem",
  internal: "iç altyapı / önceki çalışma",
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

export default async function ProjectsPage() {
  const projects = await getPublishedProjects("tr");

  return (
    <>
      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              as="h1"
              eyebrow="Projeler — komuta güvertesi"
              title="Kurulan sistemler"
              description="Uçtan uca tasarlanıp geliştirilen sistemler: ürün altyapılarından operasyon sistemlerine ve iç altyapı çalışmalarına. İncelemek için bir proje seçin; her proje sayfası bugün var olanı listeler."
            />
          </Reveal>
          <Reveal delay={0.05}>
            <StatusRail projects={projects} />
          </Reveal>
          <ProjectCommandDeck projects={projects} />
        </Container>
      </section>
      <ContactCTA />
    </>
  );
}
