import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { AnswerSection, BulletPanel, CtaBand } from "@/components/hub/blocks";
import { Container } from "@/components/layout/container";
import { ContactCTA } from "@/components/shared/contact-cta";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { SpotlightCard } from "@/components/shared/spotlight-card";
import { buttonVariants } from "@/components/ui/button";
import { notWeEn, whoFitsEn, whyPillarsEn } from "@/content/en/authority";
import { pageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = pageMeta({
  title: "Why Menensoft?",
  description:
    "Clear scope, ownership, an admin panel with every system, workflow fit and honest assessment: the six principles of working with Menensoft — plainly stated.",
  path: "/en/why-menensoft",
});

export default function EnWhyPage() {
  return (
    <>
      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              as="h1"
              eyebrow="Why Menensoft"
              title="Why Menensoft?"
              description="The answer isn't a slogan — it's a way of working: scope agreed in writing, systems delivered as yours, nothing shipped without a panel — and if a ready-made tool is enough, you'll be told so plainly."
            />
          </Reveal>
          <Reveal delay={0.06}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/en/start-project"
                className={cn(buttonVariants({ variant: "cta" }), "h-11 px-6")}
              >
                Start a project conversation
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/en/projects"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-11 px-6",
                )}
              >
                View projects
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="mt-14">
            <div className="overflow-hidden rounded-xl border border-border bg-border">
              <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-3">
                {whyPillarsEn.map((pillar, i) => (
                  <SpotlightCard
                    key={pillar.title}
                    className="bg-card p-6 transition-colors duration-300 hover:bg-muted/20"
                  >
                    <p className="font-mono text-xs text-accent/80">
                      P{i + 1}
                    </p>
                    <h2 className="mt-2 font-semibold tracking-tight">
                      {pillar.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {pillar.body}
                    </p>
                  </SpotlightCard>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="mt-16 max-w-3xl space-y-14">
            <Reveal>
              <AnswerSection eyebrow="Boundaries" title="What Menensoft is not">
                <p className="leading-relaxed text-muted-foreground">
                  Trust is built by drawing lines, not by exaggerating. Knowing
                  what Menensoft is <em>not</em> is the fastest way to
                  understand what it is:
                </p>
                <BulletPanel items={notWeEn} quiet className="mt-5" />
              </AnswerSection>
            </Reveal>

            <Reveal delay={0.04}>
              <AnswerSection eyebrow="Fit" title="Who is this approach right for?">
                <BulletPanel items={whoFitsEn} />
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  To see how the work runs step by step,{" "}
                  <Link
                    href="/en/process"
                    className="text-foreground/85 underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    read the process
                  </Link>
                  ; if you&apos;re weighing a ready-made site against a custom
                  system, the{" "}
                  <Link
                    href="/en/custom-system-vs-template"
                    className="text-foreground/85 underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    comparison page
                  </Link>{" "}
                  gives a clear frame.
                </p>
              </AnswerSection>
            </Reveal>

            <Reveal delay={0.04}>
              <CtaBand
                title="Tell me what you need — we'll clarify the scope together"
                text="Instead of selling a fixed package, the system need gets clarified first. Your message goes straight to the founder; the reply is an honest assessment."
                primaryLabel="Start a project"
                primaryHref="/en/start-project"
                secondaryLabel="Frequently asked questions"
                secondaryHref="/en/faq"
              />
            </Reveal>
          </div>
        </Container>
      </section>
      <ContactCTA locale="en" />
    </>
  );
}
