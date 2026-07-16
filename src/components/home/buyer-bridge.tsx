import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { type Locale } from "@/lib/locale";
import { cn } from "@/lib/utils";

/**
 * Alıcı köprüsü: sinematik hikâyeden çıkan ziyaretçiye "bu benim işim için
 * de geçerli" dedirten satış bölümü. Üç adımlık yol + teslim kanıtı
 * çipleri + net CTA. TR varsayılan; EN /en ana sayfasından gelir.
 */

const COPY = {
  tr: {
    eyebrow: "İhtiyaçtan sisteme",
    title: "Sizin ihtiyacınız da böyle bir sisteme dönüşür",
    description:
      "Yukarıdaki akış her projede aynı işler: sipariş, randevu, panel ya da otomasyon — girdiniz ne olursa olsun yol üç adımdır.",
    steps: [
      {
        num: "01",
        title: "İhtiyacınızı yazın",
        text: "Birkaç cümle yeterli: ne sıkışıyor, bugün nasıl yürüyor. Şartname gerekmez.",
      },
      {
        num: "02",
        title: "Kapsam birlikte netleşir",
        text: "Hangi modüller gerekiyor, hangileri gerekmez — yazılı ve dürüst bir çerçeve.",
      },
      {
        num: "03",
        title: "Çalışır sistem teslim edilir",
        text: "Panelden yönettiğiniz, dokümante edilmiş, devredilebilir bir yapı.",
      },
    ],
    proofLabel: "Teslimde elinizde ne olur",
    proof: [
      "Yönetilebilir panel",
      "İşinize göre veri modeli",
      "Role uygun kullanıcı akışları",
      "Dokümantasyon & teslim notları",
      "Düzenlenebilir, devredilebilir yapı",
      "Görüşme sonrası yazılı kapsam notu",
    ],
    // Deliberately NOT "Proje görüşmesi başlat": the hero and the gateway above
    // already carry that exact label, and voice.ts asks for closings to vary by
    // page. This band's own step 01 says "İhtiyacınızı yazın" — the CTA now
    // simply keeps that promise. Same destination, one primary action per page.
    primary: "İhtiyacınızı yazın",
    primaryHref: "/teklif-al",
    secondary: "Süreci incele",
    secondaryHref: "/surec",
  },
  en: {
    eyebrow: "From need to system",
    title: "Your need turns into a system the same way",
    description:
      "The flow above plays out the same in every project: orders, appointments, a panel or automation — whatever your input is, the road has three steps.",
    steps: [
      {
        num: "01",
        title: "Describe your need",
        text: "A few sentences are enough: what's jamming, how it runs today. No spec required.",
      },
      {
        num: "02",
        title: "Scope gets agreed together",
        text: "Which modules you need and which you don't — a written, honest frame.",
      },
      {
        num: "03",
        title: "A working system is delivered",
        text: "A documented, transferable structure you manage from a panel.",
      },
    ],
    proofLabel: "What you hold at delivery",
    proof: [
      "A manageable admin panel",
      "A data model shaped to your business",
      "Role-appropriate user flows",
      "Documentation & handoff notes",
      "An editable, transferable structure",
      "A written scope note after the first call",
    ],
    primary: "Describe your need",
    primaryHref: "/en/start-project",
    secondary: "See the process",
    secondaryHref: "/en/process",
  },
} as const;

export function BuyerBridge({ locale = "tr" }: { locale?: Locale }) {
  const copy = COPY[locale];
  return (
    <section className="surface-light relative border-y border-border py-16 md:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_20%_0%,rgba(139,140,248,0.05),transparent)]"
      />
      <Container className="relative">
        <Reveal>
          <SectionHeading
            eyebrow={copy.eyebrow}
            title={copy.title}
            description={copy.description}
          />
        </Reveal>

        <Reveal delay={0.06} className="mt-10">
          <div className="overflow-hidden rounded-xl border border-border bg-border">
            <div className="grid gap-px md:grid-cols-3">
              {copy.steps.map((step) => (
                <div key={step.num} className="bg-card p-6">
                  <p className="flex items-center gap-2.5 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                    <span className="flex size-6 items-center justify-center rounded-md border border-accent/30 bg-accent/5 text-accent">
                      {step.num}
                    </span>
                  </p>
                  <h3 className="mt-4 font-semibold tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-border bg-background/30 px-6 py-5">
              <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                <span aria-hidden className="size-1.5 bg-accent/90" />
                {copy.proofLabel}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {copy.proof.map((item) => (
                  <span
                    key={item}
                    className="rounded-md border border-border bg-card px-2.5 py-1 font-mono text-xs text-foreground/80"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={copy.primaryHref}
              className={cn(buttonVariants({ variant: "cta" }), "h-11 px-6")}
            >
              {copy.primary}
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href={copy.secondaryHref}
              className={cn(buttonVariants({ variant: "outline" }), "h-11 px-6")}
            >
              {copy.secondary}
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
