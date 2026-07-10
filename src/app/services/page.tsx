import {
  AppWindow,
  LayoutDashboard,
  ShoppingCart,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { ServicesPipeline } from "@/components/services/pipeline";
import { ContactCTA } from "@/components/shared/contact-cta";
import { GrowLine } from "@/components/shared/grow-line";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { SpotlightCard } from "@/components/shared/spotlight-card";
import { TechTag } from "@/components/shared/tech-tag";
import { services, workflow } from "@/content/services";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Services",
  description:
    "Admin panels, e-commerce systems, full-stack web applications, and automation tools — built end to end.",
  path: "/services",
});

const serviceIcons: Record<string, LucideIcon> = {
  "admin-panels": LayoutDashboard,
  ecommerce: ShoppingCart,
  "full-stack-apps": AppWindow,
  "automation-tools": Workflow,
};

export default function ServicesPage() {
  return (
    <>
      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              as="h1"
              eyebrow="Services"
              title="What I can build for you"
              description="Project-based work that ends with working software: not a deck, not a throwaway prototype. You work directly with me, and scope is agreed before anything gets built."
            />
          </Reveal>

          <ServicesPipeline />

          <div className="mt-16 grid gap-6 md:mt-20">
            {services.map((service) => {
              const Icon = serviceIcons[service.id] ?? AppWindow;
              return (
                <Reveal key={service.id}>
                  <SpotlightCard
                    id={service.id}
                    className="scroll-mt-24 rounded-xl border border-border bg-card/70 ring-1 ring-white/5 backdrop-blur-sm transition-all duration-300 hover:border-accent/25 hover:ring-accent/10"
                  >
                    <div className="p-6 md:p-8">
                      <div className="flex items-start justify-between gap-6">
                        <div>
                          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
                            {service.title}
                          </h2>
                          <p className="mt-2 max-w-2xl leading-relaxed text-muted-foreground">
                            {service.summary}
                          </p>
                        </div>
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-border bg-background/50">
                          <Icon className="size-5 text-accent/80" />
                        </div>
                      </div>
                      <div className="mt-8 grid gap-8 md:grid-cols-2">
                        <div>
                          <h3 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                            What&apos;s included
                          </h3>
                          <ul className="mt-4 space-y-2">
                            {service.includes.map((item) => (
                              <li
                                key={item}
                                className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                              >
                                <span
                                  aria-hidden
                                  className="mt-2 size-1 shrink-0 rounded-full bg-foreground/40"
                                />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                            Typical stack
                          </h3>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {service.stack.map((tech) => (
                              <TechTag key={tech}>{tech}</TechTag>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-border bg-background/30 px-6 py-4 md:px-8">
                      <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                          <span
                            aria-hidden
                            className="size-1.5 bg-accent/90"
                          />
                          What you get
                        </span>
                        <span className="text-sm leading-relaxed text-foreground/90">
                          {service.deliverable}
                        </span>
                      </p>
                    </div>
                  </SpotlightCard>
                </Reveal>
              );
            })}
          </div>

          <div className="mt-20 md:mt-24">
            <Reveal>
              <SectionHeading
                eyebrow="Process"
                title="How I work"
                description="A simple, honest workflow. No process theater."
              />
            </Reveal>
            <Reveal delay={0.08}>
              <div className="relative mt-12">
                <GrowLine className="absolute inset-x-8 top-9 hidden lg:block" />
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {workflow.map((step) => (
                    <SpotlightCard
                      key={step.step}
                      className="rounded-xl border border-border bg-card/70 p-6 ring-1 ring-white/5 backdrop-blur-sm transition-colors duration-300 hover:border-foreground/15"
                    >
                      <div className="flex size-9 items-center justify-center rounded-lg border border-accent/30 bg-accent/5 font-mono text-sm text-accent/90">
                        {step.step}
                      </div>
                      <h3 className="mt-4 text-lg font-semibold tracking-tight">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                    </SpotlightCard>
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
