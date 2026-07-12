import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { HubCard } from "@/components/hub/hub-card";
import { ContactCTA } from "@/components/shared/contact-cta";
import { JsonLd } from "@/components/shared/json-ld";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { systems } from "@/content/systems";
import { collectionPageSchema, graph } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = pageMeta({
  title: "Sistemler",
  description:
    "Menensoft'un kurduğu sistem türleri: admin panel, e-ticaret sistemi, dashboard ve raporlama, iş akışı otomasyonu, kurumsal web sitesi ve operasyon sistemi.",
  path: "/sistemler",
});

export default function SystemsPage() {
  return (
    <>
      <JsonLd
        data={graph(
          collectionPageSchema({
            name: "Sistemler",
            description: "Menensoft'un kurduğu web sistemi türleri.",
            path: "/sistemler",
            items: systems.map((s) => ({
              name: s.title,
              path: `/sistemler/${s.slug}`,
            })),
          }),
        )}
      />
      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              as="h1"
              eyebrow="Sistemler"
              title="Ne tür sistemler kurulur?"
              description="Her sistem türünün ayrıntılı alıcı sayfası: ne işe yarar, kimler için uygun, hangi modüller bulunur, mimari nasıl kurulur ve teslimde ne alınır."
            />
          </Reveal>
          <Reveal delay={0.06}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/teklif-al"
                className={cn(buttonVariants({ variant: "cta" }), "h-11 px-6")}
              >
                Proje görüşmesi başlat
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/sektorler"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-11 px-6",
                )}
              >
                Sektöre göre incele
              </Link>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {systems.map((system, i) => (
              <HubCard
                key={system.slug}
                locale="tr"
                delay={Math.min(i * 0.05, 0.2)}
                eyebrow={system.eyebrow.replace("Sistem — ", "")}
                title={system.title}
                description={system.description}
                detailHref={`/sistemler/${system.slug}`}
                detailLabel="Sistem detayını incele"
                systemSlug={system.slug}
                proofSlugs={system.relatedProjects.map((p) => p.slug)}
              />
            ))}
          </div>
        </Container>
      </section>
      <ContactCTA />
    </>
  );
}
