import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  AnswerSection,
  BulletPanel,
  ChipLinks,
  CtaBand,
  ModuleGrid,
  RelatedProjects,
} from "@/components/hub/blocks";
import { Container } from "@/components/layout/container";
import { ContactCTA } from "@/components/shared/contact-cta";
import { JsonLd } from "@/components/shared/json-ld";
import { Reveal } from "@/components/shared/reveal";
import { buttonVariants } from "@/components/ui/button";
import { getSector, sectors } from "@/content/sectors";
import { getSystem } from "@/content/systems";
import { breadcrumbSchema, graph, serviceSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

interface SectorPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return sectors.map((sector) => ({ slug: sector.slug }));
}

export async function generateMetadata({
  params,
}: SectorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const sector = getSector(slug);
  if (!sector) return {};
  return pageMeta({
    title: sector.seoTitle,
    description: sector.seoDescription,
    path: `/sektorler/${sector.slug}`,
  });
}

export default async function SectorPage({ params }: SectorPageProps) {
  const { slug } = await params;
  const sector = getSector(slug);
  if (!sector) notFound();

  const systemLinks = sector.relatedSystems
    .map((s) => getSystem(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .map((s) => ({ label: s.title, href: `/sistemler/${s.slug}` }));

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbSchema([
            { name: "Ana sayfa", path: "" },
            { name: "Sektörler", path: "/sektorler" },
            { name: sector.title, path: `/sektorler/${sector.slug}` },
          ]),
          serviceSchema({
            name: sector.title,
            description: sector.seoDescription,
            path: `/sektorler/${sector.slug}`,
          }),
        )}
      />
      <section className="py-16 md:py-24">
        <Container>
          <Link
            href="/sektorler"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Tüm sektörler
          </Link>

          <Reveal className="mt-8">
            <div className="max-w-3xl">
              <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                <span aria-hidden className="size-1.5 bg-accent/90" />
                {sector.eyebrow}
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance md:text-5xl">
                {sector.title}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                {sector.description}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/teklif-al"
                  className={cn(buttonVariants({ variant: "cta" }), "h-11 px-6")}
                >
                  Proje görüşmesi başlat
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/projeler"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-11 px-6",
                  )}
                >
                  Projeleri incele
                </Link>
              </div>
            </div>
          </Reveal>

          <div className="mt-14 gap-12 lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            {/* ana içerik: cevap odaklı bölümler */}
            <div className="max-w-3xl space-y-14">
              <Reveal>
                <AnswerSection eyebrow="Problem" title="Bu sektörde ne sıkışıyor?">
                  <p className="leading-relaxed text-muted-foreground">
                    {sector.problem}
                  </p>
                  <BulletPanel
                    title="Tipik sancılar"
                    items={sector.pains}
                    quiet
                    className="mt-5"
                  />
                </AnswerSection>
              </Reveal>

              <Reveal delay={0.04}>
                <AnswerSection
                  eyebrow="Çözüm"
                  title="Menensoft bu sektör için ne kurar?"
                >
                  <BulletPanel items={sector.builds} />
                </AnswerSection>
              </Reveal>

              <Reveal delay={0.04}>
                <AnswerSection
                  eyebrow="Modüller"
                  title="Hangi modüller bulunabilir?"
                >
                  <ModuleGrid modules={sector.modules} />
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    Modüller ihtiyaca göre kapsama girer ya da çıkar; sabit
                    paket satılmaz, kapsam işinize göre netleşir.
                  </p>
                </AnswerSection>
              </Reveal>

              <Reveal delay={0.04}>
                <AnswerSection
                  eyebrow="Yönetim"
                  title="Yönetim ve dashboard tarafında ne gerekir?"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <BulletPanel title="Panel ihtiyacı" items={sector.adminNeeds} />
                    <BulletPanel
                      title="Otomasyon fırsatları"
                      items={sector.automation}
                    />
                  </div>
                </AnswerSection>
              </Reveal>

              <Reveal delay={0.04}>
                <AnswerSection eyebrow="Teslim" title="Teslimde ne alırsınız?">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <BulletPanel title="Teslim edilenler" items={sector.deliverables} />
                    <BulletPanel
                      title="Nelerden kaçınılır"
                      items={sector.avoids}
                      quiet
                    />
                  </div>
                </AnswerSection>
              </Reveal>

              <Reveal delay={0.04}>
                <CtaBand title={sector.ctaTitle} text={sector.ctaText} />
              </Reveal>
            </div>

            {/* yan panel: ilgili projeler ve sistemler */}
            <aside className="mt-14 space-y-6 lg:sticky lg:top-24 lg:mt-0">
              <Reveal delay={0.08}>
                <div className="rounded-xl border border-border bg-card/60 p-5 ring-1 ring-white/5">
                  <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                    <span aria-hidden className="size-1.5 bg-accent/90" />
                    İlgili projeler
                  </p>
                  <div className="mt-4">
                    <RelatedProjects items={sector.relatedProjects} />
                  </div>
                </div>
              </Reveal>
              {systemLinks.length > 0 && (
                <Reveal delay={0.1}>
                  <div className="rounded-xl border border-border bg-card/60 p-5 ring-1 ring-white/5">
                    <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                      <span aria-hidden className="size-1.5 bg-accent/90" />
                      İlgili sistem türleri
                    </p>
                    <div className="mt-4">
                      <ChipLinks links={systemLinks} />
                    </div>
                  </div>
                </Reveal>
              )}
            </aside>
          </div>
        </Container>
      </section>
      <ContactCTA />
    </>
  );
}
