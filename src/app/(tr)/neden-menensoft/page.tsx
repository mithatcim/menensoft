import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { AnswerSection, BulletPanel, CtaBand } from "@/components/hub/blocks";
import { Container } from "@/components/layout/container";
import { ContactCTA } from "@/components/shared/contact-cta";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { SpotlightCard } from "@/components/shared/spotlight-card";
import { buttonVariants } from "@/components/ui/button";
import { notWe, whoFits, whyPillars } from "@/content/authority";
import { pageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = pageMeta({
  title: "Neden Menensoft?",
  description:
    "Net kapsam, sahiplik, yönetim paneli, iş akışına uyum ve dürüst değerlendirme: Menensoft ile çalışmanın altı ilkesi — abartısız, olduğu gibi.",
  path: "/neden-menensoft",
});

export default function WhyPage() {
  return (
    <>
      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              as="h1"
              eyebrow="Neden Menensoft"
              title="Neden Menensoft?"
              description="Cevap bir slogan değil, bir çalışma şekli: kapsam yazılı netleşir, sistem size ait teslim edilir, panelsiz iş bırakılmaz — ve hazır araç yeterliyse bu açıkça söylenir."
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

          {/* altı ilke */}
          <Reveal delay={0.08} className="mt-14">
            <div className="overflow-hidden rounded-xl border border-border bg-border">
              <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-3">
                {whyPillars.map((pillar, i) => (
                  <SpotlightCard
                    key={pillar.title}
                    className="bg-card p-6 transition-colors duration-300 hover:bg-muted/20"
                  >
                    <p className="font-mono text-xs text-accent/80">
                      P{i + 1}
                    </p>
                    <h2 className="mt-2 font-semibold tracking-tight">
                      {pillar.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {pillar.body}
                    </p>
                  </SpotlightCard>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="mt-16 max-w-3xl space-y-14">
            <Reveal>
              <AnswerSection eyebrow="Sınırlar" title="Ne değiliz?">
                <p className="leading-relaxed text-muted-foreground">
                  Güven, abartıyla değil sınır çizerek kurulur. Menensoft&apos;un
                  ne olmadığını bilmek, ne olduğunu anlamanın en kısa yolu:
                </p>
                <BulletPanel items={notWe} quiet className="mt-5" />
              </AnswerSection>
            </Reveal>

            <Reveal delay={0.04}>
              <AnswerSection
                eyebrow="Uyum"
                title="Bu yaklaşım kimin için doğru?"
              >
                <BulletPanel items={whoFits} />
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Nasıl çalışıldığını adım adım görmek için{" "}
                  <Link
                    href="/surec"
                    className="text-foreground/85 underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    süreci inceleyin
                  </Link>
                  ; hazır site ile özel sistem arasında kararsızsanız{" "}
                  <Link
                    href="/hazir-site-mi-ozel-sistem-mi"
                    className="text-foreground/85 underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    karşılaştırma sayfası
                  </Link>{" "}
                  net bir çerçeve verir.
                </p>
              </AnswerSection>
            </Reveal>

            <Reveal delay={0.04}>
              <CtaBand
                title="İhtiyacını yaz, kapsamı beraber netleştirelim"
                text="Sabit paket satmak yerine önce sistem ihtiyacı netleşir. Mesajınız doğrudan kurucuya ulaşır; dönüş dürüst bir değerlendirmedir."
                secondaryLabel="Sık sorulan sorular"
                secondaryHref="/sss"
              />
            </Reveal>
          </div>
        </Container>
      </section>
      <ContactCTA />
    </>
  );
}
