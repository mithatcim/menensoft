import { Mail } from "lucide-react";
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
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,rgba(255,214,170,0.07),transparent)]"
            />
            <div aria-hidden className="bg-noise absolute inset-0 opacity-[0.04]" />
            <div className="relative">
              <p className="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                <span aria-hidden className="size-1.5 rounded-full bg-amber-400" />
                {site.availability}
              </p>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-balance md:text-5xl">
                Have a product to build?
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Tell me what you&apos;re trying to ship. I&apos;ll reply with an
                honest take on scope and approach.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={`mailto:${site.email}`}
                  className={cn(
                    buttonVariants({ variant: "cta" }),
                    "h-12 px-7 text-base",
                  )}
                >
                  <Mail className="size-4" />
                  Email me
                </a>
                <Link
                  href="/contact"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-12 px-7 text-base",
                  )}
                >
                  Contact details
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
