import { ArrowRight, GitBranch, Mail, MessageCircle } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { SpotlightCard } from "@/components/shared/spotlight-card";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/content/site";
import { pageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = pageMeta({
  title: "İletişim",
  description:
    "Projeniz için iletişime geçin — e-posta en hızlı kanaldır. WhatsApp ile de ulaşabilirsiniz.",
  path: "/iletisim",
});

export default function ContactPage() {
  // A channel only renders when its real value exists in site config.
  // No placeholders, no "coming soon" rows.
  const secondaryChannels = [
    site.whatsappUrl && {
      key: "whatsapp",
      label: "WhatsApp",
      href: site.whatsappUrl,
      icon: MessageCircle,
    },
    site.githubUrl && {
      key: "github",
      label: "GitHub",
      href: site.githubUrl,
      icon: GitBranch,
    },
  ].filter(Boolean) as {
    key: string;
    label: string;
    href: string;
    icon: typeof Mail;
  }[];

  return (
    <section className="py-16 md:py-24">
      <Container>
        <Reveal>
          {/* Başlık artık /teklif-al ile aynı değil: iki ayrı sayfa aynı h1'i
              ("Proje görüşmesi başlatın") taşıyordu. Burası doğrudan kanal,
              orası yönlendirilmiş akış. */}
          <SectionHeading
            as="h1"
            eyebrow="İletişim"
            title="Doğrudan kurucuya yazın"
            description="En hızlı kanal e-posta. Ne kurmak istediğinizi ve işin bugünkü durumunu kısaca anlatın; kapsam ve yaklaşım hakkında dürüst bir değerlendirme alırsınız."
          />
        </Reveal>

        <div className="mt-12 max-w-3xl">
          {site.email && (
            <Reveal>
              <SpotlightCard className="rounded-xl border border-border bg-card p-6 ring-1 ring-white/5 md:p-8">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_20%_0%,rgba(139,140,248,0.05),transparent)]"
                />
                <div className="relative">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                      <span
                        aria-hidden
                        className="size-1.5 rounded-full bg-accent/90"
                      />
                      E-posta
                    </h2>
                    <Mail aria-hidden className="size-4 text-muted-foreground" />
                  </div>
                  <a
                    href={`mailto:${site.email}`}
                    className="mt-5 inline-block font-mono text-lg text-foreground transition-colors hover:text-muted-foreground md:text-xl"
                  >
                    {site.email}
                  </a>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Doğrudan kurucuya ulaşır. Form yok, destek kuyruğu yok.
                  </p>
                  <div className="mt-7">
                    <a
                      href={`mailto:${site.email}`}
                      className={cn(
                        buttonVariants({ variant: "cta" }),
                        "h-11 px-6",
                      )}
                    >
                      <Mail className="size-4" />
                      E-posta gönder
                    </a>
                  </div>
                </div>
              </SpotlightCard>
            </Reveal>
          )}

          {secondaryChannels.length > 0 && (
            <Reveal delay={0.04}>
              <div className="mt-6 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
                {secondaryChannels.map((channel) => {
                  const Icon = channel.icon;
                  return (
                    <SpotlightCard
                      key={channel.key}
                      href={channel.href}
                      external
                      className="flex items-center justify-between gap-4 bg-card p-6 transition-colors hover:bg-muted/40"
                    >
                      <span className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                        <span
                          aria-hidden
                          className="size-1.5 rounded-full bg-accent/90"
                        />
                        {channel.label}
                      </span>
                      <Icon className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
                    </SpotlightCard>
                  );
                })}
              </div>
            </Reveal>
          )}

          <Reveal delay={0.08}>
            <div className="mt-12">
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
              {/* Sayfanın giriş paragrafı zaten "kapsam ve yaklaşım hakkında
                  dürüst bir değerlendirme alırsınız" diyor; aynı cümleyi bir
                  ekran sonra tekrarlamak yerine buraya eksik olan bilgi geldi. */}
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Hiçbiri elinizde yoksa da sorun değil — birkaç cümle yeterli.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-accent/25 bg-accent/5 px-6 py-5">
              <p className="text-sm leading-relaxed text-foreground/90">
                Mesajınızı hazırlayan bir akış ister misiniz? Sistem türünü
                seçin, şablon sizin için doldurulsun.
              </p>
              <Link
                href="/teklif-al"
                className={cn(buttonVariants({ variant: "cta" }), "h-10 px-5")}
              >
                Proje görüşmesi başlat
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
