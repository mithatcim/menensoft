import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { QuoteBuilder } from "@/components/quote/quote-builder";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { site } from "@/content/site";
import { pageMeta } from "@/lib/seo";

/**
 * Başlık "Teklif al" değil (Faz 24) ama "teklif" kelimesini de terk etmiyor
 * (Faz 25): sayfa anında fiyat vermiyor, fakat teklif sürecinin başladığı yer
 * tam olarak burası. Başlık bunu olduğu gibi söylüyor — vaat değil, sıralama.
 * Rota /teklif-al olarak kalıyor.
 */
export const metadata = pageMeta({
  title: "Proje görüşmesi ve teklif süreci",
  description:
    "Menensoft ile proje görüşmesi başlatın: sistem türünü seçin, ihtiyacınızı yazın. Fiyat, kapsam ve modüllere göre belirlenir; net teklif, kapsam netleştikten sonra sunulur.",
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

/**
 * Teklif öncesi tipik itirazlar. İlk dördü kurulu cevaplara bağlanır; son
 * dördü Phase 22'de eklendi — ziyaretçinin göndermeden önce gerçekten sorduğu,
 * ama sayfanın hiçbir yerinde cevaplanmayan sorular. Hepsi gerçek bir sayfaya
 * gider; garanti, sabit fiyat ya da aciliyet yok.
 */
const OBJECTIONS = [
  {
    q: "Tek kişiyle çalışmak riskli mi?",
    a: "Riski kalabalık değil yapı azaltır: yazılı kapsam, dokümantasyon, devredilebilir kod tabanı.",
    href: "/sss#tek-kisi-riski",
  },
  {
    q: "Teklif ve fiyat nasıl belirlenir?",
    a: "Sabit liste yok; fiyat, kapsam ve modüllere göre belirlenir — kapsam netleşince net teklif.",
    href: "/sss#fiyat",
  },
  {
    q: "Ne kadar sürer?",
    a: "Kapsam netleşmeden tarih verilmez; gerçekçi çerçeve kapsamla birlikte konuşulur.",
    href: "/sss#sure",
  },
  {
    q: "Sonunda elimde ne olur?",
    a: "Çalışır sistem, yönetilebilir panel, dokümantasyon ve temiz devir.",
    href: "/sss#teslimde-ne-alinir",
  },
  {
    q: "Teknik detay bilmem gerekiyor mu?",
    a: "Hayır. İşin nasıl yürüdüğünü anlatmanız yeterli; teknik kararlar görüşmede birlikte netleşir.",
    href: "/surec",
  },
  {
    q: "Ne istediğimden emin değilsem?",
    a: "“Emin değilim” de geçerli bir başlangıç. İlk görüşmenin işi zaten ihtiyacı netleştirmek.",
    href: "/hazir-site-mi-ozel-sistem-mi",
  },
  {
    q: "İlk temas için WhatsApp yeterli mi?",
    a: "Yeterli. Kısa bir mesajla başlayın; ayrıntı gerekirse e-postaya geçeriz. İkisi de aynı yere düşer.",
    href: "/sss#iletisim",
  },
  {
    q: "Projem küçükse?",
    a: "Kapsam küçükse küçük kalır, şişirilmez. Uygun değilse bu da açıkça söylenir.",
    href: "/sss#fiyat",
  },
];

export default function QuotePage() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            as="h1"
            eyebrow="Proje görüşmesi"
            title="Proje görüşmesi başlatın"
            description="Proje görüşmesi, teklif sürecinin ilk adımıdır: ihtiyacınızı yazın, kapsamı beraber netleştirelim. Sistem türünü seçtiğiniz anda mesajınız hazırlanır; gönderim e-posta ya da WhatsApp üzerinden, doğrudan kurucuya gider."
          />
        </Reveal>

        {/* Sihirbaz artık kendi güven katmanını yanında taşıyor: gönder butonu
            ve fiyat/kapsam açıklaması seçim yapılırken ekranda kalır. */}
        <Reveal delay={0.06} className="mt-12">
          <QuoteBuilder />
        </Reveal>

        {/* mesajdan sonra ne olur */}
        <Reveal delay={0.05} className="mt-20">
          <h2 className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
            <span aria-hidden className="size-1.5 bg-accent/90" />
            Mesajdan sonra ne olur?
          </h2>
          <div className="mt-4 overflow-hidden rounded-xl border border-border bg-border">
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
                  <h3 className="mt-3 text-sm font-semibold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* tipik itirazlar — kısa cevap, tam cevap ilgili sayfada */}
        <Reveal delay={0.05} className="mt-12">
          <h2 className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
            <span aria-hidden className="size-1.5 bg-accent/90" />
            Göndermeden önce merak edilenler
          </h2>
          <div className="mt-4 overflow-hidden rounded-xl border border-border bg-border">
            <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4">
              {OBJECTIONS.map((item) => (
                <Link
                  key={item.q}
                  href={item.href}
                  className="group bg-card p-4 transition-colors hover:bg-muted/20 md:p-5"
                >
                  <h3 className="flex items-start justify-between gap-3 text-sm font-semibold tracking-tight">
                    {item.q}
                    <ArrowRight className="mt-0.5 size-3.5 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-accent" />
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {item.a}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </Reveal>

        {/* fiyat / kapsam eğitimi — rakam yok, dürüst çerçeve var */}
        <Reveal delay={0.05} className="mt-12">
          <div className="overflow-hidden rounded-xl border border-border bg-border">
            <div className="grid gap-px md:grid-cols-2">
              <div className="bg-card p-6">
                <h2 className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                  <span aria-hidden className="size-1.5 bg-accent/90" />
                  Kapsamı ne belirler?
                </h2>
                {/* Bu paragraf artık fiyat cümlesini tekrar etmiyor: aynı cümle
                    zaten yan paneldeki güven bloğunda ve "Fiyat nasıl çıkar?"
                    kartında geçiyordu. Başlık kapsamı soruyor — cevap da kapsamı
                    anlatıyor. */}
                <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                  Kapsamı, kaç ekranın ve kaç modülün kurulacağı çizer. Aşağıdaki
                  dört etken kapsamı — dolayısıyla bedeli — doğrudan belirler;
                  hangilerinin gerçekten gerektiği ilk görüşmede yazılı olarak
                  netleşir.
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
                    “Belirsiz işi şişirmek yerine netleştirmeyi tercih ederim.”
                  </p>
                  <footer className="font-mono text-xs text-muted-foreground">
                    — {site.founder}, kurucu
                  </footer>
                </blockquote>
              </div>
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
