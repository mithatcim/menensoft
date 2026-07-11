import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/shared/reveal";
import { SpotlightCard } from "@/components/shared/spotlight-card";

/**
 * Ziyaretçi yolu: sisteme ihtiyacın varsa → çözümleri/sektörleri incele →
 * kararsızsan rehberi oku → teklif al. Üç sessiz keşif kartı; ağır sahne yok.
 */
const HUBS = [
  {
    href: "/sektorler",
    eyebrow: "Sektörler",
    title: "Sektörünüze göre inceleyin",
    text: "Restoran, klinik, e-ticaret, operasyon, log yönetimi ve üyelik: tipik problem ve kurulan modüller.",
  },
  {
    href: "/sistemler",
    eyebrow: "Sistemler",
    title: "Sistem türüne göre inceleyin",
    text: "Admin panel, e-ticaret, dashboard, otomasyon, kurumsal site ve operasyon sistemi — ne işe yarar, nasıl kurulur.",
  },
  {
    href: "/hazir-site-mi-ozel-sistem-mi",
    eyebrow: "Karar rehberi",
    title: "Hazır site mi, özel sistem mi?",
    text: "Dürüst karşılaştırma: hangisi ne zaman mantıklı, altı boyutta fark nedir, üç soruyla nasıl karar verilir.",
  },
];

export function ExploreHubs() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="grid gap-6 md:grid-cols-3">
          {HUBS.map((hub, i) => (
            <Reveal key={hub.href} delay={i * 0.06} className="h-full">
              <SpotlightCard
                href={hub.href}
                className="flex h-full flex-col rounded-xl border border-border bg-card/70 p-6 ring-1 ring-white/5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                    <span aria-hidden className="size-1.5 bg-accent/90" />
                    {hub.eyebrow}
                  </p>
                  <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>
                <h2 className="mt-4 text-lg font-semibold tracking-tight text-balance">
                  {hub.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {hub.text}
                </p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
