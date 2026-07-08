import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(255,255,255,0.08),transparent)]"
      />
      <Container className="relative pt-24 pb-20 md:pt-36 md:pb-28">
        <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 font-mono text-xs text-muted-foreground">
          <span aria-hidden className="size-1.5 rounded-full bg-emerald-400" />
          {site.availability}
        </p>
        <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight text-balance md:text-6xl lg:text-7xl">
          {site.headline}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground">
          {site.subheadline}
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            href="/projects"
            className={cn(buttonVariants(), "h-11 px-6")}
          >
            View projects
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/contact"
            className={cn(buttonVariants({ variant: "outline" }), "h-11 px-6")}
          >
            Get in touch
          </Link>
        </div>
        <p className="mt-14 font-mono text-xs text-muted-foreground">
          <span className="tracking-widest uppercase">Core stack</span>
          <span aria-hidden className="mx-2">
            —
          </span>
          {site.coreStack.join(" · ")}
        </p>
      </Container>
    </section>
  );
}
