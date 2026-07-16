import { ArrowUpRight, Check } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { ContactCTA } from "@/components/shared/contact-cta";
import { JsonLd } from "@/components/shared/json-ld";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { type LandingPage } from "@/content/landing";
import { getSector } from "@/content/sectors";
import { getSectorEn } from "@/content/en/sectors";
import { getSystem } from "@/content/systems";
import { getSystemEn } from "@/content/en/systems";
import { type Locale } from "@/lib/locale";
import { getPublishedProjects } from "@/lib/projects/public";
import {
  breadcrumbSchema,
  faqSchema,
  graph,
  serviceSchema,
} from "@/lib/schema";
import { cn } from "@/lib/utils";

/**
 * Yüksek niyetli arama sayfası (Phase 40).
 *
 * Tek bir bileşen, iki dil. İçerik src/content/landing.ts (+ en/) dosyalarından
 * gelir; burada hiçbir iddia üretilmez — sayfa yalnızca var olanı gösterir.
 *
 * İlgili projeler VERİTABANINDAN okunur (38C'den beri tek doğruluk kaynağı o):
 * arşivlenmiş bir proje bu sayfalardan da kendiliğinden düşer. Ölü bağlantı
 * kalmaz.
 *
 * FAQPage şeması yalnızca sayfada GÖRÜNEN sorulardan üretilir. Görünmeyen
 * içeriği iddia eden bir şema, Google'ın manuel işlem uyguladığı şeydir.
 */

const COPY = {
  tr: {
    whoFor: "Bu sayfa kimin için?",
    problems: "Çözülen problemler",
    features: "Kurulan yapı",
    process: "Nasıl ilerliyoruz",
    faq: "Sık sorulanlar",
    relatedProjects: "Gerçekten kurulmuş işler",
    relatedSystems: "İlgili sistemler",
    relatedSectors: "İlgili sektörler",
    projectsHref: "/projeler",
    systemsHref: "/sistemler",
    sectorsHref: "/sektorler",
    quoteBase: "/teklif-al",
    home: "Ana sayfa",
    cta: "Projeyi konuşalım",
    seeProject: "Projeyi incele",
  },
  en: {
    whoFor: "Who is this for?",
    problems: "Problems it solves",
    features: "What gets built",
    process: "How we proceed",
    faq: "Frequently asked",
    relatedProjects: "Systems actually delivered",
    relatedSystems: "Related systems",
    relatedSectors: "Related sectors",
    projectsHref: "/en/projects",
    systemsHref: "/en/systems",
    sectorsHref: "/en/sectors",
    quoteBase: "/en/start-project",
    home: "Home",
    cta: "Let's talk",
    seeProject: "See the project",
  },
} as const;

function Bullets({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-4 space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
          <Check className="mt-0.5 size-4 shrink-0 text-accent/80" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export async function LandingPageView({
  page,
  locale = "tr",
}: {
  page: LandingPage;
  locale?: Locale;
}) {
  const copy = COPY[locale];
  const base = locale === "en" ? "/en" : "";

  // Projects come from the database. An archived project disappears from these
  // pages too, instead of leaving a dead link behind.
  const published = await getPublishedProjects(locale);
  const projects = page.relatedProjects
    .map((slug) => published.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const lookupSystem = locale === "en" ? getSystemEn : getSystem;
  const lookupSector = locale === "en" ? getSectorEn : getSector;

  const systems = page.relatedSystems
    .map((slug) => lookupSystem(slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  const sectors = page.relatedSectors
    .map((slug) => lookupSector(slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const path = `${base}/${page.slug}`;
  const quoteHref = page.fitId
    ? `${copy.quoteBase}?tur=${page.fitId}`
    : copy.quoteBase;

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbSchema([
            { name: copy.home, path: base || "/" },
            { name: page.title, path },
          ]),
          serviceSchema({
            name: page.title,
            description: page.seoDescription,
            path,
          }),
          // Only the questions actually rendered below. A schema that claims
          // content the page does not show is what Google issues manual actions
          // for.
          faqSchema(page.faq.map((f) => ({ question: f.q, answer: f.a }))),
        )}
      />

      {/* Phase 41B: landing content is a light band (token-clean). The dark
          ContactCTA below closes it — light content, dark call to action. */}
      <section className="surface-light py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              as="h1"
              eyebrow={page.eyebrow}
              title={page.title}
              description={page.intro}
            />
          </Reveal>

          <Reveal delay={0.05}>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href={quoteHref}
                className={cn(buttonVariants(), "h-11 px-6")}
              >
                {copy.cta}
                <ArrowUpRight className="size-4" />
              </Link>
              <Link
                href={`${base}/iletisim`.replace("/en/iletisim", "/en/contact")}
                className={cn(buttonVariants({ variant: "outline" }), "h-11 px-6")}
              >
                {locale === "en" ? "Contact" : "İletişim"}
              </Link>
            </div>
          </Reveal>

          {/* who / problems */}
          <div className="mt-16 grid gap-10 md:grid-cols-2 md:gap-12">
            <Reveal>
              <section>
                <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                  {copy.whoFor}
                </h2>
                <Bullets items={page.whoFor} />
              </section>
            </Reveal>
            <Reveal delay={0.05}>
              <section>
                <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                  {copy.problems}
                </h2>
                <Bullets items={page.problems} />
              </section>
            </Reveal>
          </div>

          {/* features */}
          <Reveal>
            <section className="mt-16">
              <h2 className="text-xl font-semibold tracking-tight">
                {copy.features}
              </h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {page.features.map((f) => (
                  <div
                    key={f}
                    className="rounded-xl border border-border bg-card/60 p-4 text-sm leading-relaxed text-foreground/90"
                  >
                    {f}
                  </div>
                ))}
              </div>
            </section>
          </Reveal>

          {/* process */}
          <Reveal>
            <section className="mt-16">
              <h2 className="text-xl font-semibold tracking-tight">
                {copy.process}
              </h2>
              <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {page.process.map((s, i) => (
                  <li
                    key={s.step}
                    className="rounded-xl border border-border bg-card/60 p-4"
                  >
                    <p className="font-mono text-xs tracking-widest text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <p className="mt-1.5 text-sm font-medium">{s.step}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {s.note}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          </Reveal>

          {/* proof: real projects, from the database */}
          {projects.length > 0 && (
            <Reveal>
              <section className="mt-16">
                <h2 className="text-xl font-semibold tracking-tight">
                  {copy.relatedProjects}
                </h2>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {projects.map((p) => (
                    <Link
                      key={p.slug}
                      href={`${copy.projectsHref}/${p.slug}`}
                      className="group rounded-xl border border-border bg-card/60 p-5 transition-colors hover:border-accent/40"
                    >
                      <p className="font-mono text-xs text-muted-foreground">
                        {p.statusLabel}
                      </p>
                      <p className="mt-1.5 font-medium">{p.name}</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {p.oneLiner}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-sm text-accent">
                        {copy.seeProject}
                        <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            </Reveal>
          )}

          {/* FAQ — the visible source of the FAQPage schema above */}
          <Reveal>
            <section className="mt-16">
              <h2 className="text-xl font-semibold tracking-tight">{copy.faq}</h2>
              <div className="mt-5 divide-y divide-border/60 overflow-hidden rounded-xl border border-border">
                {page.faq.map((f) => (
                  <div key={f.q} className="bg-card/60 p-5">
                    <h3 className="text-sm font-medium text-foreground">{f.q}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {f.a}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </Reveal>

          {/* internal linking — no orphan pages */}
          {(systems.length > 0 || sectors.length > 0) && (
            <Reveal>
              <section className="mt-16 grid gap-8 md:grid-cols-2">
                {systems.length > 0 && (
                  <div>
                    <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                      {copy.relatedSystems}
                    </h2>
                    <ul className="mt-3 space-y-1.5">
                      {systems.map((s) => (
                        <li key={s.slug}>
                          <Link
                            href={`${copy.systemsHref}/${s.slug}`}
                            className="inline-flex items-center gap-1.5 text-sm text-foreground/90 underline-offset-4 transition-colors hover:text-accent hover:underline"
                          >
                            {s.title}
                            <ArrowUpRight className="size-3.5 text-accent/70" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {sectors.length > 0 && (
                  <div>
                    <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                      {copy.relatedSectors}
                    </h2>
                    <ul className="mt-3 space-y-1.5">
                      {sectors.map((s) => (
                        <li key={s.slug}>
                          <Link
                            href={`${copy.sectorsHref}/${s.slug}`}
                            className="inline-flex items-center gap-1.5 text-sm text-foreground/90 underline-offset-4 transition-colors hover:text-accent hover:underline"
                          >
                            {s.title}
                            <ArrowUpRight className="size-3.5 text-accent/70" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            </Reveal>
          )}
          <Reveal>
            <section className="mt-16 rounded-2xl border border-accent/25 bg-accent/[0.04] p-6 md:p-8">
              <h2 className="text-xl font-semibold tracking-tight">
                {page.ctaTitle}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {page.ctaText}
              </p>
              <Link
                href={quoteHref}
                className={cn(buttonVariants(), "mt-5 h-11 px-6")}
              >
                {copy.cta}
                <ArrowUpRight className="size-4" />
              </Link>
            </section>
          </Reveal>
        </Container>
      </section>

      {/* The landing page IS about one system, so the inquiry link carries the
          preselection — exactly what the system/sector detail pages do. */}
      <ContactCTA locale={locale} inquiryHref={quoteHref} />
    </>
  );
}
