import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { ContactCTA } from "@/components/shared/contact-cta";
import { JsonLd } from "@/components/shared/json-ld";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { SpotlightCard } from "@/components/shared/spotlight-card";
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
              description="Aynı sistem mantığı, farklı işletme gerçekleri. Sektörünüzü seçin; tipik problemi, kurulan modülleri ve ilgili gerçek projeleri görün."
            />
          </Reveal>
          <Reveal delay={0.06}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/teklif-al"
                className={cn(buttonVariants({ variant: "cta" }), "h-11 px-6")}
              >
                Teklif al
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
              <Reveal key={sector.slug} delay={Math.min(i * 0.05, 0.2)} className="h-full">
                <SpotlightCard
                  href={`/sektorler/${sector.slug}`}
                  className="flex h-full flex-col rounded-xl border border-border bg-card/70 p-6 ring-1 ring-white/5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_28px_56px_-24px_rgba(0,0,0,0.85)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                      <span aria-hidden className="size-1.5 bg-accent/90" />
                      {sector.eyebrow.replace("Sektör — ", "")}
                    </p>
                    <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </div>
                  <h2 className="mt-4 text-lg font-semibold tracking-tight text-balance">
                    {sector.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {sector.description}
                  </p>
                  <p className="mt-auto flex items-center gap-2 pt-5 font-mono text-xs text-muted-foreground/70">
                    <span aria-hidden className="size-1 rounded-full bg-accent/70" />
                    {sector.modules.length} modül · {sector.relatedProjects.length}{" "}
                    ilgili proje
                  </p>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
      <ContactCTA />
    </>
  );
}
