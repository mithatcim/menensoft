import { ArrowRight, Mail } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/shared/reveal";
import { buttonVariants } from "@/components/ui/button";
import { siteEn } from "@/content/en/site";
import { site } from "@/content/site";
import { type Locale } from "@/lib/locale";
import { cn } from "@/lib/utils";

const COPY = {
  tr: {
    availability: site.availability,
    title: "Kurulacak bir sisteminiz mi var?",
    text: "İhtiyacınızı yazın; kapsam ve yaklaşım konusunda net, dürüst bir dönüş alın.",
    // Not "Proje görüşmesi başlat": the hero and the gateway already carry that
    // label on the homepage, and this band closes every page. Its own text is
    // about scope, so the button says so — one of the primaries voice.ts allows.
    primary: "Kapsamı netleştirelim",
    primaryHref: "/teklif-al",
    secondary: "E-posta gönder",
    footerPre: "ya da",
    footerLink: "iletişim bilgilerini görün",
    footerHref: "/iletisim",
  },
  en: {
    availability: siteEn.availability,
    title: "Have a system that needs building?",
    text: "Tell us what you need; you'll get a clear, honest read on scope and approach.",
    primary: "Let's define the scope",
    primaryHref: "/en/start-project",
    secondary: "Send an email",
    footerPre: "or",
    footerLink: "see the contact details",
    footerHref: "/en/contact",
  },
} as const;

export function ContactCTA({ locale = "tr" }: { locale?: Locale }) {
  const copy = COPY[locale];
  return (
    <section className="pt-4 pb-20 md:pt-6 md:pb-28">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-xl border border-border bg-card px-6 py-16 text-center ring-1 ring-white/5 md:px-12 md:py-24">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,rgba(139,140,248,0.07),transparent)]"
            />
            <div aria-hidden className="bg-noise absolute inset-0 opacity-[0.04]" />
            <div className="relative">
              <p className="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                <span aria-hidden className="size-1.5 rounded-full bg-accent" />
                {copy.availability}
              </p>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-balance md:text-5xl">
                {copy.title}
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {copy.text}
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href={copy.primaryHref}
                  className={cn(
                    buttonVariants({ variant: "cta" }),
                    "h-12 px-7 text-base",
                  )}
                >
                  {copy.primary}
                  <ArrowRight className="size-4" />
                </Link>
                <a
                  href={`mailto:${site.email}`}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-12 px-7 text-base",
                  )}
                >
                  <Mail className="size-4" />
                  {copy.secondary}
                </a>
              </div>
              <p className="mt-5 text-sm text-muted-foreground">
                {copy.footerPre}{" "}
                <Link
                  href={copy.footerHref}
                  className="text-foreground/85 underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  {copy.footerLink}
                </Link>
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
