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
import { FlowPanel } from "@/components/shared/flow-panel";
import { JsonLd } from "@/components/shared/json-ld";
import { Reveal } from "@/components/shared/reveal";
import { buttonVariants } from "@/components/ui/button";
import { getSector } from "@/content/sectors";
import { workflow } from "@/content/services";
import { getSystem, systems } from "@/content/systems";
import { breadcrumbSchema, graph, serviceSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

interface SystemPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return systems.map((system) => ({ slug: system.slug }));
}

export async function generateMetadata({
  params,
}: SystemPageProps): Promise<Metadata> {
  const { slug } = await params;
  const system = getSystem(slug);
  if (!system) return {};
  return pageMeta({
    title: system.seoTitle,
    description: system.seoDescription,
    path: `/sistemler/${system.slug}`,
  });
}

export default async function SystemPage({ params }: SystemPageProps) {
  const { slug } = await params;
  const system = getSystem(slug);
  if (!system) notFound();

  const sectorLinks = system.relatedSectors
    .map((s) => getSector(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .map((s) => ({ label: s.title, href: `/sektorler/${s.slug}` }));

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbSchema([
            { name: "Ana sayfa", path: "" },
            { name: "Sistemler", path: "/sistemler" },
            { name: system.title, path: `/sistemler/${system.slug}` },
          ]),
          serviceSchema({
            name: system.title,
            description: system.seoDescription,
            path: `/sistemler/${system.slug}`,
          }),
        )}
      />
      <section className="py-16 md:py-24">
        <Container>
          <Link
            href="/sistemler"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Tüm sistemler
          </Link>

          <Reveal className="mt-8">
            <div className="max-w-3xl">
              <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                <span aria-hidden className="size-1.5 bg-accent/90" />
                {system.eyebrow}
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance md:text-5xl">
                {system.title}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                {system.description}
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
                  href="/surec"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-11 px-6",
                  )}
                >
                  Süreci gör
                </Link>
              </div>
            </div>
          </Reveal>

          <div className="mt-14 gap-12 lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            <div className="max-w-3xl space-y-14">
              <Reveal>
                <AnswerSection eyebrow="Tanım" title="Bu sistem ne işe yarar?">
                  <p className="leading-relaxed text-muted-foreground">
                    {system.whatItIs}
                  </p>
                </AnswerSection>
              </Reveal>

              <Reveal delay={0.04}>
                <AnswerSection eyebrow="Hedef" title="Kimler için uygun?">
                  <BulletPanel items={system.whoNeeds} />
                </AnswerSection>
              </Reveal>

              <Reveal delay={0.04}>
                <AnswerSection
                  eyebrow="Modüller"
                  title="Hangi modüller bulunabilir?"
                >
                  <ModuleGrid modules={system.modules} />
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    Sabit paket satmak yerine önce sistem ihtiyacı netleşir;
                    modüller kapsama işinize göre girer.
                  </p>
                </AnswerSection>
              </Reveal>

              <Reveal delay={0.04}>
                <AnswerSection eyebrow="Mimari" title="Mimari nasıl kurulur?">
                  <FlowPanel label="Sistem akışı" nodes={system.archFlow} />
                  <BulletPanel items={system.archNotes} className="mt-4" />
                </AnswerSection>
              </Reveal>

              <Reveal delay={0.04}>
                <AnswerSection
                  eyebrow="Yönetim"
                  title="Yönetim yüzeyi neye benzer?"
                >
                  <BulletPanel items={system.adminSurface} />
                </AnswerSection>
              </Reveal>

              <Reveal delay={0.04}>
                <AnswerSection eyebrow="Süreç" title="Kurulum nasıl ilerler?">
                  <div className="overflow-hidden rounded-xl border border-border bg-border">
                    <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4">
                      {workflow.map((step) => (
                        <div key={step.step} className="bg-card p-4">
                          <p className="font-mono text-xs text-accent/80">
                            {step.step}
                          </p>
                          <h3 className="mt-2 text-sm font-semibold tracking-tight">
                            {step.title}
                          </h3>
                          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                            {step.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    Sürecin tamamı — talepten teslime altı aşama —{" "}
                    <Link
                      href="/surec"
                      className="text-foreground/85 underline-offset-4 transition-colors hover:text-foreground hover:underline"
                    >
                      /surec
                    </Link>{" "}
                    sayfasında anlatılıyor.
                  </p>
                </AnswerSection>
              </Reveal>

              <Reveal delay={0.04}>
                <AnswerSection eyebrow="Teslim" title="Teslimde ne alınır?">
                  <BulletPanel items={system.deliverables} />
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    Amaç yalnızca güzel görünen sayfa değil, yönetilebilir
                    çalışan sistemdir: devirden sonra sistemi siz
                    işletebilirsiniz.
                  </p>
                </AnswerSection>
              </Reveal>

              <Reveal delay={0.04}>
                <CtaBand
                  title={system.ctaTitle}
                  text={system.ctaText}
                  secondaryLabel="Projeleri incele"
                  secondaryHref="/projeler"
                />
              </Reveal>
            </div>

            <aside className="mt-14 space-y-6 lg:sticky lg:top-24 lg:mt-0">
              <Reveal delay={0.08}>
                <div className="rounded-xl border border-border bg-card/60 p-5 ring-1 ring-white/5">
                  <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                    <span aria-hidden className="size-1.5 bg-accent/90" />
                    İlgili projeler
                  </p>
                  <div className="mt-4">
                    <RelatedProjects items={system.relatedProjects} />
                  </div>
                </div>
              </Reveal>
              {sectorLinks.length > 0 && (
                <Reveal delay={0.1}>
                  <div className="rounded-xl border border-border bg-card/60 p-5 ring-1 ring-white/5">
                    <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                      <span aria-hidden className="size-1.5 bg-accent/90" />
                      İlgili sektörler
                    </p>
                    <div className="mt-4">
                      <ChipLinks links={sectorLinks} />
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
