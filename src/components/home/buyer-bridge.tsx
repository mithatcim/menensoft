import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Alıcı köprüsü: sinematik hikâyeden çıkan ziyaretçiye "bu benim işim için
 * de geçerli" dedirten satış bölümü. Üç adımlık yol + teslim kanıtı
 * çipleri + net CTA. Sahne yok, ağır animasyon yok — Reveal yeterli.
 */

const PATH_STEPS = [
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
];

/** Teslimde elde olan somut şeyler — uydurma metrik değil, yapı kanıtı. */
const DELIVERY_PROOF = [
  "Yönetilebilir panel",
  "İşinize göre veri modeli",
  "Role uygun kullanıcı akışları",
  "Dokümantasyon & teslim notları",
  "Düzenlenebilir, devredilebilir yapı",
  "Görüşme sonrası yazılı kapsam notu",
];

export function BuyerBridge() {
  return (
    <section className="relative py-16 md:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_20%_0%,rgba(139,140,248,0.05),transparent)]"
      />
      <Container className="relative">
        <Reveal>
          <SectionHeading
            eyebrow="İhtiyaçtan sisteme"
            title="Sizin ihtiyacınız da böyle bir sisteme dönüşür"
            description="Yukarıdaki akış her projede aynı işler: sipariş, randevu, panel ya da otomasyon — girdiniz ne olursa olsun yol üç adımdır."
          />
        </Reveal>

        <Reveal delay={0.06} className="mt-10">
          <div className="overflow-hidden rounded-xl border border-border bg-border">
            <div className="grid gap-px md:grid-cols-3">
              {PATH_STEPS.map((step) => (
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
            {/* teslim kanıtı: yapı üzerinden, uydurma rakam olmadan */}
            <div className="border-t border-border bg-background/30 px-6 py-5">
              <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                <span aria-hidden className="size-1.5 bg-accent/90" />
                Teslimde elinizde ne olur
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {DELIVERY_PROOF.map((item) => (
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
              href="/teklif-al"
              className={cn(buttonVariants({ variant: "cta" }), "h-11 px-6")}
            >
              Proje görüşmesi başlat
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/surec"
              className={cn(buttonVariants({ variant: "outline" }), "h-11 px-6")}
            >
              Süreci incele
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
