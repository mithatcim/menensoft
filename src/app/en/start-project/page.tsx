import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { QuoteBuilder } from "@/components/quote/quote-builder";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { site } from "@/content/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Start a project",
  description:
    "Start a project conversation with Menensoft: pick a system type, describe your need. Price is set by scope and modules — scope is clarified first, then a solution is proposed.",
  path: "/en/start-project",
});

const SCOPE_FACTORS = [
  "Screen and module count",
  "Depth of roles and permissions",
  "Integrations with existing systems",
  "Content management and panel needs",
];

const NEXT_STEPS = [
  {
    step: "01",
    title: "Your message reaches the founder",
    description:
      "No form queue, no support bot; the request is read by the person who would build the system.",
  },
  {
    step: "02",
    title: "Scope questions come back",
    description:
      "A few concrete questions that clarify the need — a short call if useful.",
  },
  {
    step: "03",
    title: "You get a clear assessment",
    description:
      "An honest read on scope, approach and the price frame; if it's not a fit, that's said plainly.",
  },
];

const OBJECTIONS = [
  {
    q: "Is a one-person brand risky?",
    a: "Structure reduces the risk, not headcount: written scope, documentation, a transferable codebase.",
    href: "/en/faq#single-founder-risk",
  },
  {
    q: "How is the price set?",
    a: "No fixed list; price is set by scope and modules — a clear quote once the scope is agreed.",
    href: "/en/faq#pricing",
  },
  {
    q: "How long does it take?",
    a: "No dates before the scope is clear; a realistic frame is discussed with the scope.",
    href: "/en/faq#duration",
  },
  {
    q: "What do I end up with?",
    a: "A working system, a manageable panel, documentation and a clean handoff.",
    href: "/en/faq#deliverables",
  },
];

export default function EnStartProjectPage() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            as="h1"
            eyebrow="Start a project"
            title="Start a project conversation"
            description="Tell me what you need and we'll clarify the scope together. Two short selections show your closest starting point and prepare your message; it goes by email or WhatsApp, straight to the founder."
          />
        </Reveal>

        <Reveal delay={0.06} className="mt-12">
          <QuoteBuilder locale="en" />
        </Reveal>

        <Reveal delay={0.05} className="mt-16">
          <div className="overflow-hidden rounded-xl border border-border bg-border">
            <div className="grid gap-px md:grid-cols-2">
              <div className="bg-card p-6">
                <h2 className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                  <span aria-hidden className="size-1.5 bg-accent/90" />
                  How is the price determined?
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                  Price is determined by scope and modules. There is no fixed
                  price list; once the scope is agreed in writing you get a
                  clear quote.
                </p>
                <ul className="mt-4 space-y-2">
                  {SCOPE_FACTORS.map((factor) => (
                    <li
                      key={factor}
                      className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                    >
                      <span
                        aria-hidden
                        className="mt-2 size-1 shrink-0 rounded-full bg-accent/80"
                      />
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-card/60 p-6">
                <h2 className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground/80 uppercase">
                  <span
                    aria-hidden
                    className="size-1.5 rotate-45 border border-muted-foreground/50"
                  />
                  Working promise
                </h2>
                <blockquote className="mt-4 space-y-3 border-l-2 border-accent/40 pl-4">
                  <p className="text-sm leading-relaxed text-foreground/90">
                    “Scope gets clear first; the solution comes second.”
                  </p>
                  <p className="text-sm leading-relaxed text-foreground/90">
                    “I&apos;d rather clarify unclear work than inflate it.”
                  </p>
                  <footer className="font-mono text-xs text-muted-foreground">
                    — {site.founder}, founder
                  </footer>
                </blockquote>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05} className="mt-16">
          <div className="overflow-hidden rounded-xl border border-border bg-border">
            <div className="grid gap-px sm:grid-cols-3">
              {NEXT_STEPS.map((item) => (
                <div key={item.step} className="bg-card p-5">
                  <p className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                    <span
                      aria-hidden
                      className="size-1.5 rounded-full bg-accent/80"
                    />
                    {item.step}
                  </p>
                  <h2 className="mt-3 text-sm font-semibold tracking-tight">
                    {item.title}
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05} className="mt-12">
          <div className="overflow-hidden rounded-xl border border-border bg-border">
            <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4">
              {OBJECTIONS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group bg-card p-5 transition-colors hover:bg-muted/20"
                >
                  <h2 className="flex items-start justify-between gap-3 text-sm font-semibold tracking-tight">
                    {item.q}
                    <ArrowRight className="mt-0.5 size-3.5 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-accent" />
                  </h2>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {item.a}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05} className="mt-12">
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-5">
            <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground/80 uppercase">
              <span
                aria-hidden
                className="size-1.5 rotate-45 border border-muted-foreground/50"
              />
              Still deciding?
            </p>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <Link
                href="/en/custom-system-vs-template"
                className="text-foreground/85 underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                Ready-made site or custom system?
              </Link>
              <Link
                href="/en/why-menensoft"
                className="text-foreground/85 underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                Why Menensoft?
              </Link>
              <Link
                href="/en/sectors"
                className="text-foreground/85 underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                Browse by your sector
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
