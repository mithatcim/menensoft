import { ArrowRight, Mail } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/shared/reveal";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

export function ContactCTA() {
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
                {site.availability}
              </p>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-balance md:text-5xl">
                Kurulacak bir sisteminiz mi var?
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                İhtiyacınızı yazın; kapsam ve yaklaşım konusunda net, dürüst
                bir dönüş alın.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/teklif-al"
                  className={cn(
                    buttonVariants({ variant: "cta" }),
                    "h-12 px-7 text-base",
                  )}
                >
                  Teklif al
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
                  E-posta gönder
                </a>
              </div>
              <p className="mt-5 text-sm text-muted-foreground">
                ya da{" "}
                <Link
                  href="/iletisim"
                  className="text-foreground/85 underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  iletişim bilgilerini görün
                </Link>
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
