import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { RequestScene } from "@/components/services/request-scene";
import { ContactCTA } from "@/components/shared/contact-cta";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { workflow } from "@/content/services";
import { pageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = pageMeta({
  title: "Süreç",
  description:
    "Bir web sistemi projesi Menensoft'ta nasıl ilerler: talep, kapsam netleştirme, mimari, geliştirme ve teslim — satış cilası değil, gerçek çalışma adımları.",
  path: "/surec",
});

/** Sizden beklenen / teslim edilen — dürüst iki taraf. */
const YOU_PROVIDE = [
  "İhtiyacın kendi cümlelerinizle anlatımı — şartname gerekmez",
  "Mevcut sürecin ya da aracın kısa bir özeti",
  "Kapsam kararlarını verebilecek bir muhatap",
  "Geri bildirim için makul dönüş süresi",
];

const WE_DELIVER = [
  "Çalışır durumda bir web sistemi",
  "Yönetim paneli ve role uygun ekranlar",
  "Dokümantasyon ve temiz devir",
  "Net kapsam, sürdürülebilir kod tabanı",
];

export default function ProcessPage() {
  return (
    <>
      <section className="pt-16 pb-6 md:pt-24 md:pb-8">
        <Container>
          <Reveal>
            <SectionHeading
              as="h1"
              eyebrow="Süreç"
              title="Talepten çalışan sisteme"
              description="Bir proje görüşmesi nasıl gerçek bir sisteme dönüşür: altı aşamalı akışın tamamı aşağıda. Kapsam yazılı olarak netleşmeden geliştirme başlamaz; iş küçük ve incelenebilir adımlarla ilerler."
            />
          </Reveal>
        </Container>
      </section>

      {/* sinematik altı aşamalı akış */}
      <RequestScene />

      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Karşılıklı netlik"
              title="Sizden beklenen, size teslim edilen"
              description="Sürecin iki tarafı da baştan bellidir. Belirsiz beklenti, belirsiz teslim üretir — ikisine de yer yok."
            />
          </Reveal>
          <Reveal delay={0.08} className="mt-10">
            <div className="overflow-hidden rounded-xl border border-border bg-border">
              <div className="grid gap-px md:grid-cols-2">
                <div className="bg-card/60 p-6">
                  <h3 className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground/80 uppercase">
                    <span
                      aria-hidden
                      className="size-1.5 rotate-45 border border-muted-foreground/50"
                    />
                    Sizden beklenen
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {YOU_PROVIDE.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                      >
                        <span
                          aria-hidden
                          className="mt-2 size-1 shrink-0 rotate-45 border border-muted-foreground/40"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-card p-6">
                  <h3 className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                    <span aria-hidden className="size-1.5 bg-accent/90" />
                    Menensoft&apos;un teslim ettiği
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {WE_DELIVER.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 text-sm leading-relaxed text-foreground/90"
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
          </Reveal>

          {/* somut çalışma adımları — kompakt matris */}
          <div className="mt-20 md:mt-24">
            <Reveal>
              <SectionHeading
                eyebrow="Çalışma adımları"
                title="Dört somut adım"
                description="Yukarıdaki akışın arkasındaki çalışma gerçekleri. Süreç tiyatrosu yok."
              />
            </Reveal>
            <Reveal delay={0.08} className="mt-10">
              <div className="overflow-hidden rounded-xl border border-border bg-border">
                <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4">
                  {workflow.map((step) => (
                    <div key={step.step} className="bg-card p-5">
                      <p className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                        <span
                          aria-hidden
                          className="size-1.5 rounded-full bg-accent/80"
                        />
                        {step.step}
                      </p>
                      <h3 className="mt-3 font-semibold tracking-tight">
                        {step.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.05}>
            <div className="mt-14 flex flex-wrap items-center gap-3">
              <Link
                href="/teklif-al"
                className={cn(buttonVariants({ variant: "cta" }), "h-11 px-6")}
              >
                Proje görüşmesi başlat
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/sss"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-11 px-6",
                )}
              >
                Sık sorulan sorular
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
      <ContactCTA />
    </>
  );
}
