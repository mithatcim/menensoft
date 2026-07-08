import { Mail } from "lucide-react";
import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch about a project — email is the fastest way.",
};

export default function ContactPage() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            as="h1"
            eyebrow="Contact"
            title="Get in touch"
            description="Email is the fastest way to reach me. Tell me what you're building and where it stands."
          />
        </Reveal>

        <div className="mt-12 max-w-3xl">
          {/* WhatsApp is intentionally omitted until a real number exists —
              add a second channel cell here once one is provided. */}
          <Reveal>
            <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 ring-1 ring-white/5 md:p-8">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_20%_0%,rgba(255,214,170,0.05),transparent)]"
              />
              <div className="relative">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                    <span
                      aria-hidden
                      className="size-1.5 rounded-full bg-amber-400/90"
                    />
                    Email
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
                  Direct to my inbox. No forms, no ticket queue.
                </p>
                <div className="mt-7">
                  <a
                    href={`mailto:${site.email}`}
                    className={cn(
                      buttonVariants(),
                      "h-11 px-6 shadow-[0_12px_32px_-12px_rgba(255,255,255,0.25)]",
                    )}
                  >
                    <Mail className="size-4" />
                    Write me an email
                  </a>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mt-12">
              <h2 className="text-xl font-semibold tracking-tight">
                Useful things to include
              </h2>
              <div className="mt-4 overflow-hidden rounded-xl border border-border">
                <ul className="divide-y divide-border/60">
                  {[
                    "What you're building, in a sentence or two",
                    "Where it stands: an idea, a design, or existing code",
                    "Any rough timeline you have in mind",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 bg-card px-5 py-3.5 text-sm leading-relaxed text-muted-foreground"
                    >
                      <span
                        aria-hidden
                        className="size-1.5 shrink-0 bg-amber-400/80"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                You&apos;ll get a reply with an honest take on scope and
                approach.
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
