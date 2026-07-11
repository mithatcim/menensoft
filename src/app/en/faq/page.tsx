import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { ContactCTA } from "@/components/shared/contact-cta";
import { JsonLd } from "@/components/shared/json-ld";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { faqEn } from "@/content/en/faq";
import { faqSchema, graph } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Frequently asked questions",
  description:
    "What Menensoft builds, who the systems are for, how a project runs, what delivery includes and how pricing works — short, straight answers.",
  path: "/en/faq",
});

export default function EnFaqPage() {
  return (
    <>
      {/* FAQPage schema mirrors the visible English FAQ below */}
      <JsonLd data={graph(faqSchema(faqEn))} />
      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              as="h1"
              eyebrow="FAQ"
              title="Frequently asked questions"
              description="Short, honest answers: what Menensoft builds, how the process runs, what you receive at delivery. If your question isn't here, just write."
            />
          </Reveal>

          <div className="mt-12 max-w-3xl space-y-4">
            {faqEn.map((item, index) => (
              <Reveal key={item.id} delay={Math.min(index * 0.03, 0.15)}>
                <article
                  id={item.id}
                  className="scroll-mt-24 rounded-xl border border-border bg-card/70 p-6 ring-1 ring-white/5 md:p-7"
                >
                  <h2 className="flex gap-3 text-lg font-semibold tracking-tight text-balance">
                    <span
                      aria-hidden
                      className="mt-1 font-mono text-xs text-accent/80"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {item.question}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                    {item.answer}
                  </p>
                  {item.links && item.links.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                      {item.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="group inline-flex items-center gap-1.5 text-sm text-foreground/85 transition-colors hover:text-foreground"
                        >
                          {link.label}
                          <ArrowRight className="size-3.5 text-accent transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      ))}
                    </div>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
      <ContactCTA locale="en" />
    </>
  );
}
