import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { ContactCTA } from "@/components/shared/contact-cta";
import { SectionHeading } from "@/components/shared/section-heading";
import { about, site } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: `${site.name} — ${site.role}. Background, skills, and how I work.`,
};

export default function AboutPage() {
  return (
    <>
      <section className="py-16 md:py-24">
        <Container>
          <SectionHeading
            as="h1"
            eyebrow="About"
            title={site.name}
            description={site.positioning}
          />

          <div className="mt-10 max-w-3xl space-y-5">
            {about.intro.map((paragraph) => (
              <p
                key={paragraph}
                className="leading-relaxed text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-20">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Skills
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {about.skills.map((group) => (
                <div
                  key={group.title}
                  className="rounded-xl border border-border bg-card p-6"
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
