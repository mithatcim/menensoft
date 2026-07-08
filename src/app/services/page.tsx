import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { ContactCTA } from "@/components/shared/contact-cta";
import { SectionHeading } from "@/components/shared/section-heading";
import { TechTag } from "@/components/shared/tech-tag";
import { services, workflow } from "@/content/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Admin panels, e-commerce systems, full-stack web applications, and automation tools — built end to end.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="py-16 md:py-24">
        <Container>
          <SectionHeading
            as="h1"
            eyebrow="Services"
            title="What I can build for you"
            description="Project-based work that ends with working software: not a deck, not a throwaway prototype. You work directly with me, and scope is agreed before anything gets built."
          />

          <div className="mt-12 grid gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                id={service.id}
                className="scroll-mt-24 rounded-xl border border-border bg-card p-6 md:p-8"
              >
                <h2 className="text-xl font-semibold tracking-tight">
                  {service.title}
                </h2>
                <p className="mt-2 max-w-2xl leading-relaxed text-muted-foreground">
                  {service.summary}
                </p>
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
            ))}
          </div>

          <div className="mt-20 md:mt-24">
            <SectionHeading
              eyebrow="Process"
              title="How I work"
              description="A simple, honest workflow. No process theater."
            />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {workflow.map((step) => (
                <div
                  key={step.step}
                  className="rounded-xl border border-border bg-card p-6"
                >
                  <p className="font-mono text-xs text-muted-foreground">
                    {step.step}
                  </p>
                  <h3 className="mt-3 text-lg font-semibold tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
      <ContactCTA />
    </>
  );
}
