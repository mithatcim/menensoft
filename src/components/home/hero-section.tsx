"use client";

import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { projects, projectStatusLabel } from "@/content/projects";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

function Entrance({
  delay,
  className,
  children,
}: {
  delay: number;
  className?: string;
  children: React.ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function BuildStatusCard() {
  return (
    <div className="relative">
      {/* offset deck layer for depth */}
      <div
        aria-hidden
        className="absolute inset-0 translate-x-3 translate-y-3 rounded-xl border border-border/50 bg-card/40"
      />
      <div className="relative overflow-hidden rounded-xl border border-border bg-card/90 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)] ring-1 ring-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-3 border-b border-border bg-background/40 px-4 py-3">
          <span aria-hidden className="flex gap-1.5">
            <span className="size-2.5 rounded-full border border-border bg-muted/60" />
            <span className="size-2.5 rounded-full border border-border bg-muted/60" />
            <span className="size-2.5 rounded-full border border-border bg-muted/60" />
          </span>
          <p className="flex-1 truncate font-mono text-xs text-muted-foreground">
            ~/projects — build status
          </p>
          <span aria-hidden className="size-1.5 rounded-full bg-amber-400" />
        </div>
        <ul className="divide-y divide-border/60">
          {projects.map((project) => (
            <li
              key={project.slug}
              className="flex items-center justify-between gap-6 px-4 py-2.5 font-mono text-xs"
            >
              <span className="truncate text-foreground/80">
                {project.slug}
              </span>
              <span className="flex shrink-0 items-center gap-2 text-muted-foreground">
                <span
                  aria-hidden
                  className="size-1 rounded-full bg-amber-400/80"
                />
                {projectStatusLabel[project.status].toLowerCase()}
              </span>
            </li>
          ))}
        </ul>
        <p className="border-t border-border px-4 py-3 font-mono text-xs text-muted-foreground">
          {`${projects.length} systems, designed and built end to end`}
        </p>
      </div>
    </div>
  );
}

export function HeroSection() {
  const headline = site.headline.replace(/\.$/, "");

  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black_10%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(255,214,170,0.09),transparent)]" />
        <div className="bg-noise absolute inset-0 opacity-[0.04]" />
      </div>
      <Container className="relative grid gap-16 pt-24 pb-24 md:pt-36 md:pb-32 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-center">
        <div>
          <Entrance delay={0}>
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 font-mono text-xs text-muted-foreground">
              <span aria-hidden className="size-1.5 rounded-full bg-amber-400" />
              {site.availability}
            </p>
          </Entrance>
          <Entrance delay={0.05}>
            <h1 className="mt-7 max-w-4xl text-5xl font-semibold tracking-tight text-balance md:text-7xl lg:text-8xl">
              {headline}
              <span className="text-amber-400">.</span>
            </h1>
          </Entrance>
          <Entrance delay={0.1}>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground md:text-xl">
              {site.subheadline}
            </p>
          </Entrance>
          <Entrance delay={0.15}>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                href="/projects"
                className={cn(
                  buttonVariants(),
                  "h-12 px-7 text-base shadow-[0_12px_32px_-12px_rgba(255,255,255,0.3)]",
                )}
              >
                View projects
                <ArrowRight className="size-4 transition-transform group-hover/button:translate-x-0.5" />
              </Link>
              <Link
                href="/contact"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-12 px-7 text-base",
                )}
              >
                Get in touch
              </Link>
            </div>
          </Entrance>
          <Entrance delay={0.2}>
            <p className="mt-16 font-mono text-xs text-muted-foreground">
              <span className="tracking-widest uppercase">Core stack</span>
              <span aria-hidden className="mx-2">
                —
              </span>
              {site.coreStack.join(" · ")}
            </p>
          </Entrance>
        </div>
        <Entrance delay={0.25} className="hidden lg:block">
          <BuildStatusCard />
        </Entrance>
      </Container>
    </section>
  );
}
