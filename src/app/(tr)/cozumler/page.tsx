import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { ContactCTA } from "@/components/shared/contact-cta";
import { JsonLd } from "@/components/shared/json-ld";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { SpotlightCard } from "@/components/shared/spotlight-card";
import { buttonVariants } from "@/components/ui/button";
import { getPublishedProjects } from "@/lib/projects/public";
import {
  audience,
  avoided,
  solutions,
  triggers,
} from "@/content/solutions";
import { graph, servicesSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";
import { inquiryHref } from "@/lib/inquiry";
import { cn } from "@/lib/utils";
import { landingPages } from "@/content/landing";

export const metadata = pageMeta({
  title: "Çözümler",
  description:
    "E-ticaret sistemi, yönetim paneli, dashboard, iş akışı otomasyonu, kurumsal web sitesi ve operasyon sistemleri — işletmeniz için uçtan uca kurulan web sistemleri.",
  path: "/cozumler",
});

/**
 * Dönüşüm bandındaki bloklar — içerik src/content/solutions.ts'ten gelir.
 *
 * Faz 27: "Teslimde ne alırsınız" bloğu kaldırıldı. Aynı vaat sitede beş yerde
 * duruyordu — ana sayfadaki BuyerBridge, her sistem detayı, her sektör detayı ve
 * /sss — ve buradaki en genel hâliydi. Bu sayfadaki her kart zaten o soruyu somut
 * olarak cevaplayan detay sayfasına bağlanıyor. Kalan üç blok (kime uygun, ne
 * zaman gerekir, nelerden kaçınılır) yalnızca burada var.
 */
const CONVERSION_BLOCKS = [
  { title: "Kimler için uygun", items: audience, quiet: false },
  { title: "Ne zaman ihtiyaç duyarsınız", items: triggers, quiet: false },
  { title: "Nelerden kaçınılır", items: avoided, quiet: true },
];

export default async function SolutionsPage() {
  // Proof chips resolve against PUBLISHED projects only: an archived project
  // must stop being offered as proof, not linger as a dead link.
  const published = await getPublishedProjects("tr");
  const bySlug = new Map(published.map((p) => [p.slug, p]));

  return (
    <>
      <JsonLd data={graph(servicesSchema())} />
      {/* Phase 41C: the whole explanatory body is a light band; the dark
          ContactCTA below closes it. Cards keep their token border on light —
          the ring-white sheen just fades, which is correct. */}
      <div className="surface-light">
      <section className="pt-16 pb-10 md:pt-24 md:pb-12">
        <Container>
          <Reveal>
            <SectionHeading
              as="h1"
              eyebrow="Çözümler"
              title="Hangi problemi çözmek istiyorsunuz?"
              description="Altı çözüm alanının hızlı haritası: problemi tanıyın, ne kurulduğunu görün, kanıt için projeye gidin. Derine inmek isterseniz her alanın ayrıntılı sistem sayfası var."
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
                href="/projeler"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-11 px-6",
                )}
              >
                Projeleri incele
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="py-8 md:py-12">
        <Container>
          <div className="grid gap-5 md:gap-6">
            {solutions.map((solution) => {
              const related = solution.relatedSlugs
                .map((slug) => bySlug.get(slug))
                .filter((p): p is NonNullable<typeof p> => Boolean(p));
              return (
                <Reveal key={solution.id}>
                  <SpotlightCard
                    id={solution.id}
                    className="scroll-mt-24 rounded-xl border border-border bg-card/70 ring-1 ring-white/5 backdrop-blur-sm transition-all duration-300 hover:border-accent/25 hover:ring-accent/10"
                  >
                    <div className="p-5 md:p-8">
                      <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
                        {solution.title}
                      </h2>
                      <div className="mt-4 grid gap-5 md:mt-6 md:grid-cols-2 md:gap-8">
                        <div>
                          <h3 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                            Çözülen problem
                          </h3>
                          <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                            {solution.problem}
                          </p>
                          {related.length > 0 && (
                            <div className="mt-3.5 md:mt-5">
                              <h3 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                                Kanıtlandığı projeler
                              </h3>
                              <div className="mt-3 flex flex-wrap gap-2">
                                {related.map((project) => (
                                  <Link
                                    key={project.slug}
                                    href={`/projeler/${project.slug}`}
                                    className="group flex items-center gap-2 rounded-lg border border-border bg-background/50 px-3 py-1.5 text-sm transition-colors hover:border-accent/40 hover:bg-card"
                                  >
                                    <span
                                      aria-hidden
                                      className="size-1.5 rounded-full bg-accent/80"
                                    />
                                    <span className="text-foreground/85">
                                      {project.name}
                                    </span>
                                    <ArrowUpRight className="size-3.5 text-muted-foreground transition-colors group-hover:text-foreground" />
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                            Neler kurulur
                          </h3>
                          <ul className="mt-3 space-y-1.5 md:space-y-2">
                            {solution.builds.map((item) => (
                              <li
                                key={item}
                                className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                              >
                                <span
                                  aria-hidden
                                  className="mt-2 size-1 shrink-0 rounded-full bg-accent/80"
                                />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border bg-background/30 px-5 py-3.5 md:px-8 md:py-4">
                      <Link
                        href={inquiryHref({
                          locale: "tr",
                          systemSlug: solution.systemSlug,
                        })}
                        className="group inline-flex items-center gap-2 py-1 text-sm font-medium text-foreground/90 transition-colors hover:text-foreground"
                      >
                        Bu sistemi konuşalım
                        <ArrowRight className="size-4 text-accent transition-transform group-hover:translate-x-0.5" />
                      </Link>
                      <Link
                        href={`/sistemler/${solution.systemSlug}`}
                        className="group inline-flex items-center gap-2 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        Sistem detayını incele
                        <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </SpotlightCard>
                </Reveal>
              );
            })}
          </div>

          {/* dönüşüm bandı: kim, ne zaman, ne alınır, nelerden kaçınılır */}
          <div className="mt-14 md:mt-24">
            <Reveal>
              <SectionHeading
                eyebrow="Net kapsam"
                title="Doğru iş, doğru beklenti"
                description="Satış cilası değil, çalışma gerçekleri: bu sistemler kimin işine yarar, ne zaman gerekir, teslimde ne alınır — ve nelere hayır denir."
              />
            </Reveal>
            <Reveal delay={0.08} className="mt-8 md:mt-10">
              <div className="overflow-hidden rounded-xl border border-border bg-border">
                <div className="grid gap-px sm:grid-cols-3">
                  {CONVERSION_BLOCKS.map((block) => (
                    <div
                      key={block.title}
                      className={cn(
                        "p-4 md:p-6",
                        block.quiet ? "bg-card/60" : "bg-card",
                      )}
                    >
                      <h3
                        className={cn(
                          "flex items-center gap-2 font-mono text-xs tracking-widest uppercase",
                          block.quiet
                            ? "text-muted-foreground/70"
                            : "text-muted-foreground",
                        )}
                      >
                        <span
                          aria-hidden
                          className={cn(
                            "size-1.5",
                            block.quiet
                              ? "rotate-45 border border-muted-foreground/50"
                              : "bg-accent/90",
                          )}
                        />
                        {block.title}
                      </h3>
                      <ul className="mt-3.5 space-y-2 md:mt-4 md:space-y-2.5">
                        {block.items.map((item) => (
                          <li
                            key={item}
                            className={cn(
                              "flex gap-3 text-sm leading-relaxed",
                              block.quiet
                                ? "text-muted-foreground"
                                : "text-foreground/90",
                            )}
                          >
                            <span
                              aria-hidden
                              className={cn(
                                "mt-2 size-1 shrink-0",
                                block.quiet
                                  ? "rotate-45 border border-muted-foreground/40"
                                  : "rounded-full bg-accent/80",
                              )}
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Phase 40 — arama sayfaları buradan bağlanır: footer'a 7 link daha
          eklemek "footer spam" olurdu; bu hub zaten ana menüde ve bağlam doğru. */}
      <section className="pb-16 md:pb-24">
        <Container>
          <Reveal>
            <h2 className="text-xl font-semibold tracking-tight">Aradığınız sistem</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Sık aranan başlıklar — her biri gerçekten kurulmuş bir işe bağlanır.
            </p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {landingPages.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/${p.slug}`}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-card/60 px-4 py-3 transition-colors hover:border-accent/40"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">
                        {p.title}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                        {p.eyebrow}
                      </span>
                    </span>
                    <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-accent" />
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>
      </div>
      <ContactCTA />
    </>
  );
}
