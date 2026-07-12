import Link from "next/link";

import { AnswerSection, BulletPanel, CtaBand } from "@/components/hub/blocks";
import { Container } from "@/components/layout/container";
import { ContactCTA } from "@/components/shared/contact-cta";
import { EarlyCta } from "@/components/shared/early-cta";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import {
  comparisonDimensions,
  comparisonShortAnswer,
  decisionQuestions,
  decisionVerdict,
  whenCustom,
  whenReadyMade,
} from "@/content/authority";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Hazır site mi, özel sistem mi?",
  description:
    "Hazır web sitesi ne zaman yeterlidir, özel sistem ne zaman mantıklıdır? Sahiplik, içerik yönetimi, iş akışı uyumu ve maliyet yapısı üzerinden dürüst bir karşılaştırma.",
  path: "/hazir-site-mi-ozel-sistem-mi",
});

export default function ComparisonPage() {
  return (
    <>
      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              as="h1"
              eyebrow="Karar rehberi"
              title="Hazır site mi, özel sistem mi?"
              description="Bu sorunun dürüst bir cevabı var ve her zaman 'özel sistem' değil. Aşağıdaki çerçeve, kararı satış diliyle değil işinizin gerçekleriyle vermenize yardım eder."
            />
          </Reveal>

          {/* kısa cevap — alıntılanabilir blok */}
          <Reveal delay={0.05}>
            <div className="mt-10 max-w-3xl rounded-xl border border-accent/25 bg-accent/5 p-6">
              <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                <span aria-hidden className="size-1.5 bg-accent/90" />
                Kısa cevap
              </p>
              <p className="mt-3 leading-relaxed text-foreground/90">
                {comparisonShortAnswer}
              </p>
            </div>
          </Reveal>

          <div className="mt-14 max-w-3xl space-y-14">
            <Reveal>
              <AnswerSection
                eyebrow="Durumlar"
                title="Hangisi ne zaman mantıklı?"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <BulletPanel
                    title="Hazır site yeterli olur"
                    items={whenReadyMade}
                    quiet
                  />
                  <BulletPanel
                    title="Özel sistem mantıklı olur"
                    items={whenCustom}
                  />
                </div>
              </AnswerSection>
            </Reveal>

            {/* Faz 30: ilk CTA 3989px'te duruyordu. Ayrımı gördükten sonra
                harekete geçilebilmeli. Her iki tarafa da dürüst davranır:
                hazır site yetiyorsa özel sistem gerekmez, bunu söylemek de
                işin parçası. */}
            <EarlyCta
              eyebrow="Hangisine yakınsınız?"
              text="Hazır site tarafındaysanız özel sistem gerekmiyor olabilir — bunu açıkça söylemek de işin parçası. Özel sistem tarafındaysanız, kapsamı birlikte netleştirelim."
              ctaLabel="Kapsamı netleştirelim"
              ctaHref="/teklif-al"
            />

            <Reveal delay={0.04}>
              <AnswerSection
                eyebrow="Karşılaştırma"
                title="Altı boyutta fark nedir?"
              >
                <div className="overflow-hidden rounded-xl border border-border bg-border">
                  <div className="grid gap-px">
                    {comparisonDimensions.map((dim) => (
                      <div key={dim.name} className="bg-card p-5">
                        <h3 className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                          <span aria-hidden className="size-1.5 bg-accent/90" />
                          {dim.name}
                        </h3>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <div className="rounded-lg border border-dashed border-border bg-background/40 p-3.5">
                            <p className="font-mono text-xs text-muted-foreground/70">
                              hazır site
                            </p>
                            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                              {dim.ready}
                            </p>
                          </div>
                          <div className="rounded-lg border border-accent/20 bg-accent/[0.04] p-3.5">
                            <p className="font-mono text-xs text-accent/80">
                              özel sistem
                            </p>
                            <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">
                              {dim.custom}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </AnswerSection>
            </Reveal>

            <Reveal delay={0.04}>
              <AnswerSection
                eyebrow="Karar"
                title="Üç soruyla karar verin"
              >
                <ol className="space-y-3">
                  {decisionQuestions.map((q, i) => (
                    <li
                      key={q}
                      className="flex gap-4 rounded-xl border border-border bg-card/70 p-4 ring-1 ring-white/5"
                    >
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-md border border-accent/30 bg-accent/5 font-mono text-xs text-accent">
                        {i + 1}
                      </span>
                      <span className="text-sm leading-relaxed text-foreground/90">
                        {q}
                      </span>
                    </li>
                  ))}
                </ol>
                <p className="mt-5 rounded-xl border border-dashed border-border bg-card/50 p-4 text-sm leading-relaxed text-muted-foreground">
                  {decisionVerdict}
                </p>
              </AnswerSection>
            </Reveal>

            <Reveal delay={0.04}>
              <AnswerSection eyebrow="Sonraki adım" title="Hâlâ kararsız mısınız?">
                <p className="leading-relaxed text-muted-foreground">
                  Kurulabilecek sistem türlerini{" "}
                  <Link
                    href="/sistemler"
                    className="text-foreground/85 underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    /sistemler
                  </Link>{" "}
                  sayfasında, sektörünüze göre örnekleri{" "}
                  <Link
                    href="/sektorler"
                    className="text-foreground/85 underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    /sektorler
                  </Link>{" "}
                  sayfasında bulabilirsiniz. En hızlısı: durumunuzu yazın,
                  hangisinin mantıklı olduğunu beraber netleştirelim.
                </p>
              </AnswerSection>
            </Reveal>

            <Reveal delay={0.04}>
              <CtaBand
                title="Durumunuzu yazın, dürüst bir değerlendirme alın"
                text="İhtiyaç hazır araçla çözülüyorsa bunu söyleriz. Sisteme taşınacak gerçek bir akış varsa, kapsamı beraber netleştiririz."
                secondaryLabel="Sistem türlerini gör"
                secondaryHref="/sistemler"
              />
            </Reveal>
          </div>
        </Container>
      </section>
      <ContactCTA />
    </>
  );
}
