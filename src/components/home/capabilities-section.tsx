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
import { SpotlightCard } from "@/components/shared/spotlight-card";
import { capabilities, type Capability, type CapabilityIcon } from "@/content/site";
import { cn } from "@/lib/utils";

const icons: Record<CapabilityIcon, LucideIcon> = {
  dashboard: LayoutDashboard,
  commerce: ShoppingCart,
  app: AppWindow,
  automation: Workflow,
};

/** Abstract admin-panel skeleton — decorative, no fake data. */
function AdminMock() {
  return (
    <div
      aria-hidden
      className="mt-6 overflow-hidden rounded-lg border border-border/60 bg-background/40"
    >
      <div className="flex">
        <div className="hidden w-14 shrink-0 flex-col gap-2 border-r border-border/60 p-3 sm:flex">
          <span className="h-2 w-full rounded bg-muted/70" />
          <span className="h-2 w-3/4 rounded bg-muted/50" />
          <span className="h-2 w-full rounded bg-muted/40" />
        </div>
        <div className="flex-1 space-y-2.5 p-4">
          <div className="flex gap-2">
            <span className="h-8 flex-1 rounded bg-muted/40" />
            <span className="h-8 flex-1 rounded bg-muted/30" />
            <span className="hidden h-8 flex-1 rounded bg-muted/20 sm:block" />
          </div>
          <span className="block h-2 w-full rounded bg-muted/50" />
          <span className="block h-2 w-5/6 rounded bg-muted/40" />
          <span className="block h-2 w-2/3 rounded bg-muted/30" />
        </div>
      </div>
    </div>
  );
}

/** Abstract input → tool → output strip — decorative only. */
function AutomationMock() {
  return (
    <div
      aria-hidden
      className="mt-6 flex items-center gap-2 rounded-lg border border-border/60 bg-background/40 p-4"
    >
      <span className="size-6 shrink-0 rounded border border-border bg-muted/40" />
      <span className="h-px flex-1 bg-gradient-to-r from-border to-accent/40" />
      <span className="size-6 shrink-0 rounded border border-accent/40 bg-accent/10" />
      <span className="h-px flex-1 bg-gradient-to-r from-accent/40 to-border" />
      <span className="size-6 shrink-0 rounded border border-border bg-muted/40" />
    </div>
  );
}

function Cell({
  capability,
  className,
  children,
}: {
  capability: Capability;
  className?: string;
  children?: React.ReactNode;
}) {
  const Icon = icons[capability.icon];
  return (
    <SpotlightCard
      className={cn(
        "flex flex-col bg-card p-6 transition-colors duration-300 hover:bg-muted/20 md:p-7",
        className,
      )}
    >
      <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-background/50">
        <Icon className="size-5 text-accent/80" />
      </div>
      <h3 className="mt-5 text-lg font-semibold tracking-tight">
        {capability.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {capability.description}
      </p>
      {children && <div className="mt-auto">{children}</div>}
    </SpotlightCard>
  );
}

export function CapabilitiesSection() {
  const byIcon = Object.fromEntries(
    capabilities.map((c) => [c.icon, c]),
  ) as Record<CapabilityIcon, Capability>;

  return (
    <section className="relative py-16 md:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_20%_0%,rgba(139,140,248,0.04),transparent)]"
      />
      <Container className="relative">
        <Reveal>
          <SectionHeading
            eyebrow="Capabilities"
            title="What I build"
            description="The kinds of software I can take from an idea to a working product."
          />
        </Reveal>
        <Reveal delay={0.08} className="mt-12">
          <div className="overflow-hidden rounded-xl border border-border bg-border">
            <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-3">
              <Cell capability={byIcon.dashboard} className="lg:col-span-2">
                <AdminMock />
              </Cell>
              <Cell capability={byIcon.commerce} />
              <Cell capability={byIcon.app} />
              <Cell capability={byIcon.automation} className="lg:col-span-2">
                <AutomationMock />
              </Cell>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
