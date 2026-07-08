import {
  AppWindow,
  LayoutDashboard,
  ShoppingCart,
  Workflow,
  type LucideIcon,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { capabilities, type CapabilityIcon } from "@/content/site";

const icons: Record<CapabilityIcon, LucideIcon> = {
  dashboard: LayoutDashboard,
  commerce: ShoppingCart,
  app: AppWindow,
  automation: Workflow,
};

export function CapabilitiesSection() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Capabilities"
            title="What I build"
            description="The kinds of software I can take from an idea to a working product."
          />
        </Reveal>
        <Reveal delay={0.08} className="mt-12">
          <div className="overflow-hidden rounded-xl border border-border bg-border">
            <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4">
              {capabilities.map((capability) => {
                const Icon = icons[capability.icon];
                return (
                  <div key={capability.title} className="bg-card p-6 md:p-7">
                    <Icon className="size-5 text-muted-foreground" />
                    <h3 className="mt-5 text-lg font-semibold tracking-tight">
                      {capability.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {capability.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
