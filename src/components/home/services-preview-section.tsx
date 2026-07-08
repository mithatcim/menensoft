import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { services } from "@/content/services";

export function ServicesPreviewSection() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="Services"
          title="How I can help"
          description="Focused engagements with a concrete deliverable at the end."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/services#${service.id}`}
              className="group flex items-center justify-between gap-6 rounded-xl border border-border bg-card p-6 transition-colors hover:border-foreground/25"
            >
              <div>
                <h3 className="text-lg font-semibold tracking-tight">
                  {service.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {service.summary}
                </p>
              </div>
              <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
