import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { HubCard } from "@/components/hub/hub-card";
import { ContactCTA } from "@/components/shared/contact-cta";
import { JsonLd } from "@/components/shared/json-ld";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { sectors } from "@/content/sectors";
import { collectionPageSchema, graph } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = pageMeta({
  title: "Sektörler",
  description:
    "Menensoft sistemlerinin sektörlere uygulanışı: restoran QR sipariş, klinik randevu akışı, e-ticaret yönetimi, operasyon dashboard'ları, log yönetimi ve üyelik platformları.",
  path: "/sektorler",
});

export default function SectorsPage() {
  return (
    <>
      <JsonLd
        data={graph(
          collectionPageSchema({
            name: "Sektörler",
            description:
              "Menensoft web sistemlerinin sektör bazlı uygulamaları.",
            path: "/sektorler",
            items: sectors.map((s) => ({
              name: s.title,
              path: `/sektorler/${s.slug}`,
            })),
          }),
        )}
      />
      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              as="h1"
              eyebrow="Sektörler"
              title="Sektörünüze göre çalışan sistemler"
              description="Sistem sayfaları işleyişi anlatır; burası aynı yapının sizin işletmenize nasıl uygulandığını gösterir. Sektörünüzü seçin: tipik problem, kurulan modüller ve ilgili gerçek projeler."
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
                href="/sistemler"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-11 px-6",
                )}
              >
                Sistem türlerine göre incele
              </Link>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {sectors.map((sector, i) => (
              <HubCard
                key={sector.slug}
                locale="tr"
                delay={Math.min(i * 0.05, 0.2)}
                eyebrow={sector.eyebrow.replace("Sektör — ", "")}
                title={sector.title}
                description={sector.description}
                detailHref={`/sektorler/${sector.slug}`}
                detailLabel="Sektörü incele"
                systemSlug={sector.relatedSystems[0]}
                proofSlugs={sector.relatedProjects.map((p) => p.slug)}
              />
            ))}
          </div>
        </Container>
      </section>
      <ContactCTA />
    </>
  );
}
