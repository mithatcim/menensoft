import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { ProjectCard } from "@/components/shared/project-card";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { type Locale } from "@/lib/locale";
import { getFeaturedProjects } from "@/lib/projects/public";

const FEATURED_COPY = {
  tr: {
    eyebrow: "Seçili işler",
    title: "Projeler",
    description:
      "Kurulan sistemlerden bir seçki: e-ticaret, operasyon ve platform çalışmaları.",
    all: "Tüm projeler",
    allHref: "/projeler",
  },
  en: {
    eyebrow: "Selected work",
    title: "Projects",
    description:
      "A selection of delivered systems: e-commerce, operations and platform work.",
    all: "All projects",
    allHref: "/en/projects",
  },
} as const;

export async function FeaturedProjectsSection({ locale = "tr" }: { locale?: Locale }) {
  const copy = FEATURED_COPY[locale];
  // Featured is now a database flag, so un-featuring a project in the panel
  // takes it off the homepage — it does not just stop being highlighted.
  const items = await getFeaturedProjects(locale);
  return (
    <section className="surface-light border-y border-border py-16 md:py-24">
      <Container>
        <Reveal>
          <div className="flex items-end justify-between gap-6">
            <SectionHeading
              eyebrow={copy.eyebrow}
              title={copy.title}
              description={copy.description}
            />
            <Link
              href={copy.allHref}
              className="hidden shrink-0 items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground md:inline-flex"
            >
              {copy.all}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((project, index) => (
            <Reveal key={project.slug} delay={index * 0.08} className="h-full">
              <ProjectCard project={project} locale={locale} />
            </Reveal>
          ))}
        </div>
        <div className="mt-8 md:hidden">
          <Link
            href={copy.allHref}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {copy.all}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
