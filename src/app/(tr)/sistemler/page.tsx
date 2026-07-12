import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { ContactCTA } from "@/components/shared/contact-cta";
import { JsonLd } from "@/components/shared/json-ld";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { SpotlightCard } from "@/components/shared/spotlight-card";
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
              <Reveal key={system.slug} delay={Math.min(i * 0.05, 0.2)} className="h-full">
                <SpotlightCard
                  href={`/sistemler/${system.slug}`}
                  className="flex h-full flex-col rounded-xl border border-border bg-card/70 p-6 ring-1 ring-white/5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_28px_56px_-24px_rgba(0,0,0,0.85)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                      <span aria-hidden className="size-1.5 bg-accent/90" />
                      {system.eyebrow.replace("Sistem — ", "")}
                    </p>
                    <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </div>
                  <h2 className="mt-4 text-lg font-semibold tracking-tight text-balance">
                    {system.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {system.description}
                  </p>
                  <p className="mt-auto flex items-center gap-2 pt-5 font-mono text-xs text-muted-foreground/70">
                    <span aria-hidden className="size-1 rounded-full bg-accent/70" />
                    {system.modules.length} modül · {system.relatedProjects.length}{" "}
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
