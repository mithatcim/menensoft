import { Container } from "@/components/layout/container";
import { ContactCTA } from "@/components/shared/contact-cta";
import { FlowPanel } from "@/components/shared/flow-panel";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
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
                    <span aria-hidden className="size-1.5 bg-amber-400/90" />
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

          <div className="mt-20">
            <Reveal>
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Skills
              </h2>
            </Reveal>
            <Reveal delay={0.08} className="mt-8">
              <div className="overflow-hidden rounded-xl border border-border bg-border">
                <div className="grid gap-px sm:grid-cols-3">
                  {about.skills.map((group) => (
                    <div key={group.title} className="bg-card p-6">
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
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <div className="mt-20">
            <Reveal>
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                How I build
              </h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
                The same workflow every project runs through.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="mt-8">
              <div className="overflow-hidden rounded-xl border border-border bg-border">
                <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4">
                  {workflow.map((step) => (
                    <div key={step.step} className="bg-card p-6">
                      <p className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                        <span
                          aria-hidden
                          className="size-1.5 rounded-full bg-amber-400/80"
                        />
                        {step.step}
                      </p>
                      <h3 className="mt-3 font-semibold tracking-tight">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  ))}
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
