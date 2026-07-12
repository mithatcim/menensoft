import { ArrowRight, GitBranch, Mail, MessageCircle } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { SpotlightCard } from "@/components/shared/spotlight-card";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/content/site";
import { ContactForm } from "@/components/leads/contact-form";
import { ContactLink } from "@/components/shared/contact-link";
import { pageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = pageMeta({
  title: "İletişim",
  description:
    "E-posta, WhatsApp ya da kısa bir proje brifi — üçü de doğrudan kurucuya ulaşır. Şartname gerekmez.",
  path: "/iletisim",
});

export default function ContactPage() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <Reveal>
          {/* Bu sayfa Phase 33B'den beri navigasyonun birincil hedefi: artık
              yalnızca e-posta kanalı değil, üç kapıyı da açan giriş noktası.
              Başlık /teklif-al ile aynı değil — orası yönlendirilmiş akış. */}
          <SectionHeading
            as="h1"
            eyebrow="İletişim"
            title="Doğrudan yazın, ya da kısa bir brif oluşturun"
            description="Basit bir soru için e-posta veya WhatsApp yeterli. Bir sistem konuşacaksanız kısa brif, kapsamı daha ilk mesajda netleştirir. Üçü de doğrudan kurucuya ulaşır."
          />
        </Reveal>

        <div className="mt-12 max-w-5xl">
          {/* Üç kanal, üç farklı işe yarar — hangisinin ne zaman doğru olduğunu
              söylemeden üçünü yan yana koymak seçim değil, kararsızlık üretir. */}
          <div className="grid gap-4 md:grid-cols-3">
            {site.email && (
              <Reveal>
                <SpotlightCard className="flex h-full flex-col rounded-xl border border-border bg-card p-6 ring-1 ring-white/5">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                      <span
                        aria-hidden
                        className="size-1.5 rounded-full bg-accent/90"
                      />
                      Doğrudan yazın
                    </h2>
                    <Mail
                      aria-hidden
                      className="size-4 text-muted-foreground"
                    />
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    Ayrıntı taşımak istediğinizde e-posta en rahatı. Form yok,
                    destek kuyruğu yok.
                  </p>
                  <ContactLink
                    channel="email"
                    className="mt-4 inline-block font-mono text-sm break-all text-foreground/90 transition-colors hover:text-foreground"
                  >
                    {site.email}
                  </ContactLink>
                  <div className="mt-6 pt-1">
                    <ContactLink
                      channel="email"
                      className={cn(
                        buttonVariants({ variant: "cta" }),
                        "h-10 w-full px-5",
                      )}
                    >
                      <Mail className="size-4" />
                      E-posta gönder
                    </ContactLink>
                  </div>
                </SpotlightCard>
              </Reveal>
            )}

            {site.whatsappUrl && (
              <Reveal delay={0.04}>
                <SpotlightCard className="flex h-full flex-col rounded-xl border border-border bg-card p-6 ring-1 ring-white/5">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                      <span
                        aria-hidden
                        className="size-1.5 rounded-full bg-accent/90"
                      />
                      WhatsApp
                    </h2>
                    <MessageCircle
                      aria-hidden
                      className="size-4 text-muted-foreground"
                    />
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    Kısa bir sorunuz varsa en hızlı yol. İlk temas için tek
                    başına yeterli.
                  </p>
                  <div className="mt-auto pt-6">
                    <ContactLink
                      channel="whatsapp"
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "h-10 w-full px-5",
                      )}
                    >
                      <MessageCircle className="size-4" />
                      WhatsApp&apos;tan yaz
                    </ContactLink>
                  </div>
                </SpotlightCard>
              </Reveal>
            )}

            <Reveal delay={0.08}>
              <SpotlightCard className="flex h-full flex-col rounded-xl border border-accent/25 bg-card p-6 ring-1 ring-accent/10">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_20%_0%,rgba(139,140,248,0.06),transparent)]"
                />
                <div className="relative flex h-full flex-col">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                      <span
                        aria-hidden
                        className="size-1.5 rounded-full bg-accent/90"
                      />
                      Kısa brif
                    </h2>
                    <ArrowRight
                      aria-hidden
                      className="size-4 text-muted-foreground"
                    />
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    Bir sistem konuşacaksanız: sistem türünü seçin, mesajınız
                    hazırlansın. Düzenleyip e-posta ya da WhatsApp ile
                    gönderirsiniz.
                  </p>
                  <div className="mt-auto pt-6">
                    <Link
                      href="/teklif-al"
                      className={cn(
                        buttonVariants({ variant: "cta" }),
                        "h-10 w-full px-5",
                      )}
                    >
                      Kısa brif oluştur
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </div>
              </SpotlightCard>
            </Reveal>
          </div>

          {/* Dördüncü kapı, üçünün yerine geçmiyor: e-posta istemcisi açmak
              istemeyen ziyaretçi için. Form başarısız olursa üstteki kanallar
              yine orada — ve mesajı kaybolmadan onlara devredilir. */}
          <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
            <Reveal delay={0.1}>
              <ContactForm locale="tr" />
            </Reveal>

            <div className="space-y-6">
              <Reveal delay={0.12}>
                <h2 className="text-xl font-semibold tracking-tight">
                  Mesajınıza eklemeniz faydalı olur
                </h2>
                <div className="mt-4 overflow-hidden rounded-xl border border-border">
                  <ul className="divide-y divide-border/60">
                    {[
                      "Ne kurmak istediğiniz, bir iki cümleyle",
                      "İşin bugünkü durumu: fikir mi, tasarım mı, mevcut kod mu",
                      "Aklınızdaki kabaca zaman planı",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-3 bg-card px-5 py-3.5 text-sm leading-relaxed text-muted-foreground"
                      >
                        <span
                          aria-hidden
                          className="size-1.5 shrink-0 bg-accent/80"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Hiçbiri elinizde yoksa da sorun değil — birkaç cümle yeterli.
                  Şartname beklenmiyor.
                </p>
              </Reveal>

              {site.githubUrl && (
                <Reveal delay={0.14}>
                  <div className="rounded-xl border border-border bg-card/50 p-6">
                    <h2 className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground/80 uppercase">
                      <span
                        aria-hidden
                        className="size-1.5 rotate-45 border border-muted-foreground/50"
                      />
                      Kod
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      Yazılan işin bir kısmı açık.
                    </p>
                    <a
                      href={site.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="group mt-4 inline-flex items-center gap-2 font-mono text-sm text-foreground/85 transition-colors hover:text-foreground"
                    >
                      <GitBranch className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
                      GitHub
                    </a>
                  </div>
                </Reveal>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
