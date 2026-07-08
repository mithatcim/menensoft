import { Mail } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

export function ContactCTA() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="rounded-xl border border-border bg-card px-6 py-12 text-center md:px-12 md:py-16">
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
              className={cn(buttonVariants({ variant: "outline" }), "h-11 px-6")}
            >
              Contact details
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
