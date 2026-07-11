import Link from "next/link";

import { Container } from "@/components/layout/container";
import { QuoteBuilder } from "@/components/quote/quote-builder";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { site } from "@/content/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Teklif al",
  description:
    "Menensoft ile proje görüşmesi başlatın: sistem türünü seçin, ihtiyacınızı yazın. Fiyat, kapsam ve modüllere göre belirlenir — önce kapsam netleşir, sonra çözüm önerilir.",
  path: "/teklif-al",
});

/** Kapsamı belirleyen etkenler — fiyat eğitimi, rakam vaadi yok. */
const SCOPE_FACTORS = [
  "Ekran ve modül sayısı",
  "Rol ve yetki yapısının derinliği",
  "Mevcut sistemlerle entegrasyonlar",
  "İçerik yönetimi ve panel ihtiyacı",
];

/** Mesaj sonrası ne olur — güven veren üç adım. */
const NEXT_STEPS = [
  {
    step: "01",
    title: "Mesajınız kurucuya ulaşır",
    description:
      "Form kuyruğu ya da destek botu yok; talebi doğrudan sistemi kuracak kişi okur.",
  },
  {
    step: "02",
    title: "Kapsam soruları gelir",
    description:
      "İhtiyacı netleştiren birkaç somut soru — gerekiyorsa kısa bir görüşme.",
  },
  {
    step: "03",
    title: "Net değerlendirme alırsınız",
    description:
      "Kapsam, yaklaşım ve fiyat çerçevesi hakkında dürüst bir dönüş; uymuyorsa açıkça söylenir.",
  },
];

export default function QuotePage() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            as="h1"
            eyebrow="Teklif al"
            title="Proje görüşmesi başlatın"
            description="İhtiyacınızı yazın, kapsamı beraber netleştirelim. İki kısa seçim size uygun çözümü gösterir ve mesajınızı hazırlar; gönderim e-posta ya da WhatsApp üzerinden, doğrudan kurucuya gider."
          />
        </Reveal>

        <Reveal delay={0.06} className="mt-12">
          <QuoteBuilder />
        </Reveal>

        {/* fiyat / kapsam eğitimi — rakam yok, dürüst çerçeve var */}
        <Reveal delay={0.05} className="mt-16">
          <div className="overflow-hidden rounded-xl border border-border bg-border">
            <div className="grid gap-px md:grid-cols-2">
              <div className="bg-card p-6">
                <h2 className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                  <span aria-hidden className="size-1.5 bg-accent/90" />
                  Fiyat nasıl belirlenir?
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                  Fiyat, kapsam ve modüllere göre belirlenir. Sabit bir liste
                  fiyatı yoktur; kapsam yazılı olarak netleştikten sonra net
                  bir teklif sunulur.
                </p>
                <ul className="mt-4 space-y-2">
                  {SCOPE_FACTORS.map((factor) => (
                    <li
                      key={factor}
                      className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                    >
                      <span
                        aria-hidden
                        className="mt-2 size-1 shrink-0 rounded-full bg-accent/80"
                      />
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-card/60 p-6">
                <h2 className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground/80 uppercase">
                  <span
                    aria-hidden
                    className="size-1.5 rotate-45 border border-muted-foreground/50"
                  />
                  Çalışma sözü
                </h2>
                <blockquote className="mt-4 space-y-3 border-l-2 border-accent/40 pl-4">
                  <p className="text-sm leading-relaxed text-foreground/90">
                    “Önce kapsam netleşir, sonra çözüm önerilir.”
                  </p>
                  <p className="text-sm leading-relaxed text-foreground/90">
                    “Belirsiz işi şişirmek yerine netleştirmeyi tercih
                    ederim.”
                  </p>
                  <footer className="font-mono text-xs text-muted-foreground">
                    — {site.founder}, kurucu
                  </footer>
                </blockquote>
              </div>
            </div>
          </div>
        </Reveal>

        {/* mesajdan sonra ne olur */}
        <Reveal delay={0.05} className="mt-16">
          <div className="overflow-hidden rounded-xl border border-border bg-border">
            <div className="grid gap-px sm:grid-cols-3">
              {NEXT_STEPS.map((item) => (
                <div key={item.step} className="bg-card p-5">
                  <p className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                    <span
                      aria-hidden
                      className="size-1.5 rounded-full bg-accent/80"
                    />
                    {item.step}
                  </p>
                  <h2 className="mt-3 text-sm font-semibold tracking-tight">
                    {item.title}
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* karar aşaması: teklif öncesi keşif bağlantıları */}
        <Reveal delay={0.05} className="mt-12">
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-5">
            <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground/80 uppercase">
              <span
                aria-hidden
                className="size-1.5 rotate-45 border border-muted-foreground/50"
              />
              Henüz karar aşamasında mısınız?
            </p>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <Link
                href="/hazir-site-mi-ozel-sistem-mi"
                className="text-foreground/85 underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                Hazır site mi, özel sistem mi?
              </Link>
              <Link
                href="/neden-menensoft"
                className="text-foreground/85 underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                Neden Menensoft?
              </Link>
              <Link
                href="/sektorler"
                className="text-foreground/85 underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                Sektörünüze göre inceleyin
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
