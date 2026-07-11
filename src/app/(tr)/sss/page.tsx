import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { ContactCTA } from "@/components/shared/contact-cta";
import { JsonLd } from "@/components/shared/json-ld";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { faq } from "@/content/faq";
import { faqSchema, graph } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Sıkça sorulan sorular",
  description:
    "Menensoft ne yapar, kimler için web sistemi geliştirir, süreç nasıl ilerler, teslimde ne alınır ve fiyat nasıl belirlenir — kısa ve net cevaplar.",
  path: "/sss",
});

export default function FaqPage() {
  return (
    <>
      {/* FAQPage şeması yalnızca burada — soruların tamamı sayfada görünür */}
      <JsonLd data={graph(faqSchema())} />
      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              as="h1"
              eyebrow="SSS"
              title="Sıkça sorulan sorular"
              description="Kısa ve dürüst cevaplar: Menensoft'un ne kurduğu, sürecin nasıl ilerlediği ve teslimde ne alındığı. Cevabını bulamadığınız soru için doğrudan yazın."
            />
          </Reveal>

          <div className="mt-12 max-w-3xl space-y-4">
            {faq.map((item, index) => (
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
      <ContactCTA />
    </>
  );
}
