import { Container } from "@/components/layout/container";
import { ContactCTA } from "@/components/shared/contact-cta";
import { FlowPanel } from "@/components/shared/flow-panel";
import { GrowLine } from "@/components/shared/grow-line";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { SpotlightCard } from "@/components/shared/spotlight-card";
import { TechTag } from "@/components/shared/tech-tag";
import { workflow } from "@/content/services";
import { about, site } from "@/content/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "About",
  description: `${site.name} — ${site.role}. Background, skills, and how I work.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              as="h1"
              eyebrow="About"
              title={site.name}
              description={site.positioning}
            />
          </Reveal>

          <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16">
            <Reveal>
              <div className="max-w-3xl space-y-5">
                {about.intro.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="leading-relaxed text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="space-y-4">
                <FlowPanel
                  label="How a build is structured"
                  nodes={["Data model", "Backend", "Interface"]}
                />
                <div className="rounded-xl border border-border bg-card p-5">
                  <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                    <span aria-hidden className="size-1.5 bg-accent/90" />
                    Core stack
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {site.coreStack.map((tech) => (
                      <TechTag key={tech}>{tech}</TechTag>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <GrowLine className="mt-20" />

          {/* operating principles */}
          <div className="mt-16">
            <Reveal>
              <SectionHeading
                eyebrow="Operating principles"
                title="How I think about systems"
                description="The rules every build runs on, whatever its size."
              />
            </Reveal>
            <Reveal delay={0.08} className="mt-10">
              <div className="overflow-hidden rounded-xl border border-border bg-border">
                <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-3">
                  {about.principles.map((principle, i) => (
                    <SpotlightCard
                      key={principle}
                      className="bg-card p-5 transition-colors duration-300 hover:bg-muted/20"
                    >
                      <p className="font-mono text-xs text-accent/80">
                        P{i + 1}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed font-medium text-foreground/90">
                        {principle}
                      </p>
                    </SpotlightCard>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* what I build / what I avoid */}
          <div className="mt-20">
            <Reveal>
              <SectionHeading
                eyebrow="Build / avoid"
                title="What I build — and what I won't"
                description="Honest scope starts with saying no to the wrong work."
              />
            </Reveal>
            <Reveal delay={0.08} className="mt-10">
              <div className="overflow-hidden rounded-xl border border-border bg-border">
                <div className="grid gap-px md:grid-cols-2">
                  <div className="bg-card p-6">
                    <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                      <span aria-hidden className="size-1.5 bg-accent/90" />
                      I build
                    </p>
                    <ul className="mt-4 space-y-2.5">
                      {about.builds.map((item) => (
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
                  <div className="bg-card/60 p-6">
                    <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground/70 uppercase">
                      <span
                        aria-hidden
                        className="size-1.5 rotate-45 border border-muted-foreground/50"
                      />
                      I avoid
                    </p>
                    <ul className="mt-4 space-y-2.5">
                      {about.avoids.map((item) => (
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
                </div>
              </div>
            </Reveal>
          </div>

          {/* stack philosophy + skills */}
          <div className="mt-20">
            <Reveal>
              <SectionHeading
                eyebrow="Stack"
                title="Stack philosophy"
                description={about.stackPhilosophy}
              />
            </Reveal>
            <Reveal delay={0.08} className="mt-10">
              <div className="overflow-hidden rounded-xl border border-border bg-border">
                <div className="grid gap-px sm:grid-cols-3">
                  {about.skills.map((group) => (
                    <SpotlightCard
                      key={group.title}
                      className="bg-card p-6 transition-colors duration-300 hover:bg-muted/20"
                    >
                      <h3 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                        {group.title}
                      </h3>
                      <ul className="mt-4 space-y-2">
                        {group.items.map((item) => (
                          <li key={item} className="text-sm text-foreground">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </SpotlightCard>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* workflow + honest tooling line */}
          <div className="mt-20">
            <Reveal>
              <SectionHeading
                eyebrow="Process"
                title="How I build"
                description="The same workflow every project runs through."
              />
            </Reveal>
            <Reveal delay={0.08} className="mt-10">
              <div className="overflow-hidden rounded-xl border border-border bg-border">
                <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4">
                  {workflow.map((step) => (
                    <SpotlightCard
                      key={step.step}
                      className="bg-card p-6 transition-colors duration-300 hover:bg-muted/20"
                    >
                      <div className="flex size-8 items-center justify-center rounded-md border border-accent/30 bg-accent/5 font-mono text-xs text-accent/90">
                        {step.step}
                      </div>
                      <h3 className="mt-4 font-semibold tracking-tight">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                    </SpotlightCard>
                  ))}
                </div>
                <div className="border-t border-border bg-background/30 px-6 py-4">
                  <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                      <span aria-hidden className="size-1.5 bg-accent/90" />
                      Tooling
                    </span>
                    <span className="text-sm leading-relaxed text-muted-foreground">
                      {about.tooling}
                    </span>
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
      <ContactCTA />
    </>
  );
}
