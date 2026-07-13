import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { type PrivacySection } from "@/content/privacy";

/**
 * Shared privacy page body (Phase 33F). One component, two locales — the two
 * pages must not be able to drift apart in structure, only in language.
 *
 * Deliberately plain: no cards, no spotlight, no motion beyond the site's normal
 * reveal. A privacy page that looks marketed is a privacy page nobody believes.
 */
export function PrivacyBody({
  eyebrow,
  title,
  description,
  updated,
  sections,
}: {
  eyebrow: string;
  title: string;
  description: string;
  updated: string;
  sections: readonly PrivacySection[];
}) {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            as="h1"
            eyebrow={eyebrow}
            title={title}
            description={description}
          />
          <p className="mt-6 font-mono text-xs text-muted-foreground/60">
            {updated}
          </p>
        </Reveal>

        <div className="mt-14 max-w-3xl space-y-12">
          {sections.map((section, i) => (
            <Reveal key={section.title} delay={Math.min(i * 0.02, 0.1)}>
              <section>
                <h2 className="text-lg font-semibold tracking-tight md:text-xl">
                  {section.title}
                </h2>

                <div className="mt-3 space-y-3">
                  {section.body.map((p) => (
                    <p
                      key={p}
                      className="text-sm leading-relaxed text-muted-foreground md:text-base"
                    >
                      {p}
                    </p>
                  ))}
                </div>

                {section.items && (
                  <ul className="mt-4 space-y-2.5">
                    {section.items.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 text-sm leading-relaxed text-foreground/85"
                      >
                        <span
                          aria-hidden
                          className="mt-2 size-1 shrink-0 rounded-full bg-accent/80"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {/* The honest caveats — the lines a template would have left out. */}
                {section.note && (
                  <p className="mt-4 border-l-2 border-accent/40 pl-4 text-sm leading-relaxed text-muted-foreground">
                    {section.note}
                  </p>
                )}
              </section>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
