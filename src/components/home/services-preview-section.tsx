import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { SpotlightCard } from "@/components/shared/spotlight-card";
import { solutions } from "@/content/solutions";

export function ServicesPreviewSection() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <Reveal>
          <div className="flex items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Çözümler"
              title="Çözüm alanları"
              description="Altı çözüm alanı, tek yaklaşım: teslimden sonra gerçekten işletebileceğiniz sistemler."
            />
            <Link
              href="/cozumler"
              className="hidden shrink-0 items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground md:inline-flex"
            >
              Tüm çözümler
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </Reveal>
        <Reveal delay={0.08} className="mt-12">
          <div className="overflow-hidden rounded-xl border border-border bg-border">
            <div className="grid gap-px md:grid-cols-2">
              {solutions.map((solution) => (
                <SpotlightCard
                  key={solution.id}
                  href={`/cozumler#${solution.id}`}
                  className="flex items-center justify-between gap-6 bg-card p-6 transition-colors hover:bg-muted/40"
                >
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight">
                      {solution.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {solution.problem}
                    </p>
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-foreground" />
                </SpotlightCard>
              ))}
            </div>
          </div>
        </Reveal>
        <div className="mt-8 md:hidden">
          <Link
            href="/cozumler"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Tüm çözümler
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
