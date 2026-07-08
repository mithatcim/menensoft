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
          <div className="relative overflow-hidden rounded-xl border border-border bg-card px-6 py-14 text-center md:px-12 md:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,rgba(255,214,170,0.06),transparent)]"
            />
            <div className="relative">
              <h2 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">
                Have a product to build?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
                Tell me what you&apos;re trying to ship. I&apos;ll reply with an
                honest take on scope and approach.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={`mailto:${site.email}`}
                  className={cn(buttonVariants(), "h-11 px-6")}
                >
                  <Mail className="size-4" />
                  Email me
                </a>
                <Link
                  href="/contact"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-11 px-6",
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
