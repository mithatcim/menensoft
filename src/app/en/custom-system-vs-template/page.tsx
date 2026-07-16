import Link from "next/link";

import { AnswerSection, BulletPanel, CtaBand } from "@/components/hub/blocks";
import { Container } from "@/components/layout/container";
import { ContactCTA } from "@/components/shared/contact-cta";
import { EarlyCta } from "@/components/shared/early-cta";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import {
  comparisonDimensionsEn,
  comparisonShortAnswerEn,
  decisionQuestionsEn,
  decisionVerdictEn,
  whenCustomEn,
  whenReadyMadeEn,
} from "@/content/en/authority";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Ready-made site or custom system?",
  description:
    "When is a ready-made website enough, and when does a custom system make sense? An honest comparison across ownership, content management, workflow fit and cost structure.",
  path: "/en/custom-system-vs-template",
});

export default function EnComparisonPage() {
  return (
    <>
      <div className="surface-light">
      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              as="h1"
              eyebrow="Decision guide"
              title="Ready-made site or custom system?"
              description="This question has an honest answer, and it isn't always 'custom system'. The frame below helps you decide by your business's realities, not by sales language."
            />
          </Reveal>

          <Reveal delay={0.05}>
            <div className="mt-10 max-w-3xl rounded-xl border border-accent/25 bg-accent/5 p-6">
              <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                <span aria-hidden className="size-1.5 bg-accent/90" />
                Short answer
              </p>
              <p className="mt-3 leading-relaxed text-foreground/90">
                {comparisonShortAnswerEn}
              </p>
            </div>
          </Reveal>

          <div className="mt-14 max-w-3xl space-y-14">
            <Reveal>
              <AnswerSection eyebrow="Situations" title="When does each make sense?">
                <div className="grid gap-4 sm:grid-cols-2">
                  <BulletPanel
                    title="A ready-made site is enough"
                    items={whenReadyMadeEn}
                    quiet
                  />
                  <BulletPanel
                    title="A custom system makes sense"
                    items={whenCustomEn}
                  />
                </div>
              </AnswerSection>
            </Reveal>

            {/* Phase 30: the first CTA sat at 4084px. A visitor should be able
                to act once they've seen the distinction. Honest to both sides:
                if a template is enough, saying so is part of the job. */}
            <EarlyCta
              locale="en"
              eyebrow="Which side are you closer to?"
              text="If you're on the ready-made side, you may not need a custom system — saying that plainly is part of the job. If you're on the custom side, let's clarify the scope together."
              ctaLabel="Let's define the scope"
              ctaHref="/en/start-project"
            />

            <Reveal delay={0.04}>
              <AnswerSection
                eyebrow="Comparison"
                title="How do they differ across six dimensions?"
              >
                <div className="overflow-hidden rounded-xl border border-border bg-border">
                  <div className="grid gap-px">
                    {comparisonDimensionsEn.map((dim) => (
                      <div key={dim.name} className="bg-card p-5">
                        <h3 className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                          <span aria-hidden className="size-1.5 bg-accent/90" />
                          {dim.name}
                        </h3>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <div className="rounded-lg border border-dashed border-border bg-background/40 p-3.5">
                            <p className="font-mono text-xs text-muted-foreground/70">
                              ready-made
                            </p>
                            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                              {dim.ready}
                            </p>
                          </div>
                          <div className="rounded-lg border border-accent/20 bg-accent/[0.04] p-3.5">
                            <p className="font-mono text-xs text-accent/80">
                              custom system
                            </p>
                            <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">
                              {dim.custom}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </AnswerSection>
            </Reveal>

            <Reveal delay={0.04}>
              <AnswerSection eyebrow="Decision" title="Decide with three questions">
                <ol className="space-y-3">
                  {decisionQuestionsEn.map((q, i) => (
                    <li
                      key={q}
                      className="flex gap-4 rounded-xl border border-border bg-card/70 p-4 ring-1 ring-white/5"
                    >
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-md border border-accent/30 bg-accent/5 font-mono text-xs text-accent">
                        {i + 1}
                      </span>
                      <span className="text-sm leading-relaxed text-foreground/90">
                        {q}
                      </span>
                    </li>
                  ))}
                </ol>
                <p className="mt-5 rounded-xl border border-dashed border-border bg-card/50 p-4 text-sm leading-relaxed text-muted-foreground">
                  {decisionVerdictEn}
                </p>
              </AnswerSection>
            </Reveal>

            <Reveal delay={0.04}>
              <AnswerSection eyebrow="Next step" title="Still undecided?">
                <p className="leading-relaxed text-muted-foreground">
                  See the system types on{" "}
                  <Link
                    href="/en/systems"
                    className="text-foreground/85 underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    the systems page
                  </Link>{" "}
                  and sector-specific examples on{" "}
                  <Link
                    href="/en/sectors"
                    className="text-foreground/85 underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    the sectors page
                  </Link>
                  . The fastest route: describe your situation and we&apos;ll
                  work out together which one makes sense.
                </p>
              </AnswerSection>
            </Reveal>

            <Reveal delay={0.04}>
              <CtaBand
                title="Describe your situation, get an honest assessment"
                text="If your need is solvable with a ready-made tool, we'll say so. If there's a real workflow to move into software, we'll clarify the scope together."
                primaryLabel="Start a project"
                primaryHref="/en/start-project"
                secondaryLabel="See the system types"
                secondaryHref="/en/systems"
              />
            </Reveal>
          </div>
        </Container>
      </section>
      </div>
      <ContactCTA locale="en" />
    </>
  );
}
