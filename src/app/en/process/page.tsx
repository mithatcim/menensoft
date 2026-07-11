import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { RequestScene } from "@/components/services/request-scene";
import { ContactCTA } from "@/components/shared/contact-cta";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { pageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = pageMeta({
  title: "Process",
  description:
    "How a web system project runs at Menensoft: request, scope clarification, architecture, build and delivery — real working steps, not sales polish.",
  path: "/en/process",
});

const YOU_PROVIDE = [
  "Your need in your own words — no spec required",
  "A short summary of the current process or tool",
  "Someone who can make scope decisions",
  "Reasonable turnaround on feedback",
];

const WE_DELIVER = [
  "A web system in working condition",
  "An admin panel with role-appropriate screens",
  "Documentation and a clean handoff",
  "Clear scope, a maintainable codebase",
];

const WORKFLOW_EN = [
  {
    step: "01",
    title: "Scope",
    description: "What gets built — and what stays out — is agreed first.",
  },
  {
    step: "02",
    title: "Build",
    description: "Working software ships in small, reviewable steps.",
  },
  {
    step: "03",
    title: "Iterate",
    description: "Adjusted to real use and feedback, not assumptions.",
  },
  {
    step: "04",
    title: "Handoff",
    description: "A working system; documented and cleanly handed over.",
  },
];

export default function EnProcessPage() {
  return (
    <>
      <section className="pt-16 pb-6 md:pt-24 md:pb-8">
        <Container>
          <Reveal>
            <SectionHeading
              as="h1"
              eyebrow="Process"
              title="From request to running system"
              description="How a project conversation becomes a real system: the full six-beat flow is below. Development doesn't start before the scope is agreed in writing, and work ships in small reviewable steps."
            />
          </Reveal>
        </Container>
      </section>

      <RequestScene locale="en" />

      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Mutual clarity"
              title="What's expected of you, what's delivered to you"
              description="Both sides of the process are clear from the start. Vague expectations produce vague deliveries — neither has a place here."
            />
          </Reveal>
          <Reveal delay={0.08} className="mt-10">
            <div className="overflow-hidden rounded-xl border border-border bg-border">
              <div className="grid gap-px md:grid-cols-2">
                <div className="bg-card/60 p-6">
                  <h3 className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground/80 uppercase">
                    <span
                      aria-hidden
                      className="size-1.5 rotate-45 border border-muted-foreground/50"
                    />
                    What you bring
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {YOU_PROVIDE.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                      >
                        <span
                          aria-hidden
                          className="mt-2 size-1 shrink-0 rotate-45 border border-muted-foreground/40"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-card p-6">
                  <h3 className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                    <span aria-hidden className="size-1.5 bg-accent/90" />
                    What Menensoft delivers
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {WE_DELIVER.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 text-sm leading-relaxed text-foreground/90"
                      >
                        <span
                          aria-hidden
                          className="mt-2 size-1 shrink-0 rounded-full bg-accent/80"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="mt-20 md:mt-24">
            <Reveal>
              <SectionHeading
                eyebrow="Working steps"
                title="Four concrete steps"
                description="The working facts behind the flow above. No process theater."
              />
            </Reveal>
            <Reveal delay={0.08} className="mt-10">
              <div className="overflow-hidden rounded-xl border border-border bg-border">
                <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4">
                  {WORKFLOW_EN.map((step) => (
                    <div key={step.step} className="bg-card p-5">
                      <p className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                        <span
                          aria-hidden
                          className="size-1.5 rounded-full bg-accent/80"
                        />
                        {step.step}
                      </p>
                      <h3 className="mt-3 font-semibold tracking-tight">
                        {step.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.05}>
            <div className="mt-14 flex flex-wrap items-center gap-3">
              <Link
                href="/en/start-project"
                className={cn(buttonVariants({ variant: "cta" }), "h-11 px-6")}
              >
                Start a project conversation
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/en/faq"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-11 px-6",
                )}
              >
                Frequently asked questions
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
      <ContactCTA locale="en" />
    </>
  );
}
