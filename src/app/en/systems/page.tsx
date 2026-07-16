import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { HubCard } from "@/components/hub/hub-card";
import { ContactCTA } from "@/components/shared/contact-cta";
import { JsonLd } from "@/components/shared/json-ld";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { systemsEn } from "@/content/en/systems";
import { collectionPageSchema, graph } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = pageMeta({
  title: "Systems",
  description:
    "The system types Menensoft builds: admin panels, e-commerce systems, dashboards and reporting, workflow automation, corporate websites and operations systems.",
  path: "/en/systems",
});

export default function EnSystemsPage() {
  return (
    <>
      <div className="surface-light">
      <JsonLd
        data={graph(
          collectionPageSchema({
            name: "Systems",
            description: "The types of web systems Menensoft builds.",
            path: "/en/systems",
            items: systemsEn.map((s) => ({
              name: s.title,
              path: `/en/systems/${s.slug}`,
            })),
            inLanguage: "en",
          }),
        )}
      />
      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              as="h1"
              eyebrow="Systems"
              title="What kinds of systems get built?"
              description="A detailed buyer page for every system type: what it does, who it fits, which modules it can include, how the architecture is built and what you receive at delivery."
            />
          </Reveal>
          <Reveal delay={0.06}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/en/start-project"
                className={cn(buttonVariants({ variant: "cta" }), "h-11 px-6")}
              >
                Start a project
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/en/sectors"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-11 px-6",
                )}
              >
                Browse by sector
              </Link>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {systemsEn.map((system, i) => (
              <HubCard
                key={system.slug}
                locale="en"
                delay={Math.min(i * 0.05, 0.2)}
                eyebrow={system.eyebrow.replace("System — ", "")}
                title={system.title}
                description={system.description}
                detailHref={`/en/systems/${system.slug}`}
                detailLabel="View system detail"
                systemSlug={system.slug}
                proofSlugs={system.relatedProjects.map((p) => p.slug)}
              />
            ))}
          </div>
        </Container>
      </section>
      </div>
      <ContactCTA locale="en" />
    </>
  );
}
