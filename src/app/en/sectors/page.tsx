import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { HubCard } from "@/components/hub/hub-card";
import { ContactCTA } from "@/components/shared/contact-cta";
import { JsonLd } from "@/components/shared/json-ld";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { sectorsEn } from "@/content/en/sectors";
import { collectionPageSchema, graph } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = pageMeta({
  title: "Sectors",
  description:
    "How Menensoft systems apply across sectors: restaurant QR ordering, clinic appointment flows, e-commerce management, operations dashboards, log management and membership platforms.",
  path: "/en/sectors",
});

export default function EnSectorsPage() {
  return (
    <>
      <JsonLd
        data={graph(
          collectionPageSchema({
            name: "Sectors",
            description: "Sector-specific applications of Menensoft web systems.",
            path: "/en/sectors",
            items: sectorsEn.map((s) => ({
              name: s.title,
              path: `/en/sectors/${s.slug}`,
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
              eyebrow="Sectors"
              title="Working systems, by your sector"
              description="The system pages explain how things work; this page shows the same structures applied to your business. Pick your sector: the typical problem, the modules built and the real related projects."
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
                href="/en/systems"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-11 px-6",
                )}
              >
                Browse by system type
              </Link>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {sectorsEn.map((sector, i) => (
              <HubCard
                key={sector.slug}
                locale="en"
                delay={Math.min(i * 0.05, 0.2)}
                eyebrow={sector.eyebrow.replace("Sector — ", "")}
                title={sector.title}
                description={sector.description}
                detailHref={`/en/sectors/${sector.slug}`}
                detailLabel="View sector detail"
                systemSlug={sector.relatedSystems[0]}
                proofSlugs={sector.relatedProjects.map((p) => p.slug)}
              />
            ))}
          </div>
        </Container>
      </section>
      <ContactCTA locale="en" />
    </>
  );
}
