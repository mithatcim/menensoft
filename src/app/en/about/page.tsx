import { Container } from "@/components/layout/container";
import { ContactCTA } from "@/components/shared/contact-cta";
import { FlowPanel } from "@/components/shared/flow-panel";
import { GrowLine } from "@/components/shared/grow-line";
import { JsonLd } from "@/components/shared/json-ld";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { SpotlightCard } from "@/components/shared/spotlight-card";
import { TechTag } from "@/components/shared/tech-tag";
import { aboutEn, siteEn } from "@/content/en/site";
import { site } from "@/content/site";
import { graph, personSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "About",
  description: `${siteEn.positioning}. Founder: ${site.founder}. Approach, skills and how the work runs.`,
  path: "/en/about",
});

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

export default function EnAboutPage() {
  return (
    <>
      <JsonLd data={graph(personSchema())} />
      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              as="h1"
              eyebrow="About"
              title={site.name}
              description={siteEn.positioning}
            />
          </Reveal>

          <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16">
            <Reveal>
              <div className="max-w-3xl space-y-5">
                {aboutEn.intro.map((paragraph) => (
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

          <div className="mt-16">
            <Reveal>
              <SectionHeading
                eyebrow="Operating principles"
                title="How systems are approached"
                description="These rules aren't aesthetic preference — they're risk control for you: clear scope prevents surprise costs, a maintainable structure reduces person-dependency, practical panel flows keep your business running after handoff."
              />
            </Reveal>
            <Reveal delay={0.08} className="mt-10">
              <div className="overflow-hidden rounded-xl border border-border bg-border">
                <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-3">
                  {aboutEn.principles.map((principle, i) => (
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

          <div className="mt-20">
            <Reveal>
              <SectionHeading
                eyebrow="Built / avoided"
                title="What gets built — and what doesn't"
                description="Honest scope starts with saying no to the wrong work."
              />
            </Reveal>
            <Reveal delay={0.08} className="mt-10">
              <div className="overflow-hidden rounded-xl border border-border bg-border">
                <div className="grid gap-px md:grid-cols-2">
                  <div className="bg-card p-6">
                    <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                      <span aria-hidden className="size-1.5 bg-accent/90" />
                      Built
                    </p>
                    <ul className="mt-4 space-y-2.5">
                      {aboutEn.builds.map((item) => (
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
                      Avoided
                    </p>
                    <ul className="mt-4 space-y-2.5">
                      {aboutEn.avoids.map((item) => (
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

          <div className="mt-20">
            <Reveal>
              <SectionHeading
                eyebrow="Stack"
                title="Stack philosophy"
                description={aboutEn.stackPhilosophy}
              />
            </Reveal>
            <Reveal delay={0.08} className="mt-10">
              <div className="overflow-hidden rounded-xl border border-border bg-border">
                <div className="grid gap-px sm:grid-cols-3">
                  {aboutEn.skills.map((group) => (
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

          <div className="mt-20">
            <Reveal>
              <SectionHeading
                eyebrow="Process"
                title="How the work runs"
                description="The same workflow every project passes through."
              />
            </Reveal>
            <Reveal delay={0.08} className="mt-10">
              <div className="overflow-hidden rounded-xl border border-border bg-border">
                <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4">
                  {WORKFLOW_EN.map((step) => (
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
                      {aboutEn.tooling}
                    </span>
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
      <ContactCTA locale="en" />
    </>
  );
}
