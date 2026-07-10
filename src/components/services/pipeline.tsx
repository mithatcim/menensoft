import {
  AppWindow,
  DraftingCompass,
  Inbox,
  PackageCheck,
  Terminal,
  type LucideIcon,
} from "lucide-react";

import { GrowLine } from "@/components/shared/grow-line";
import { Reveal } from "@/components/shared/reveal";

/**
 * Build pipeline: how a request becomes a working system. Presentation of
 * the real engagement model only — no invented process claims, no metrics.
 * Desktop: horizontal mission-control pipeline with drawing connectors and
 * travelling pulses. Mobile: stacked vertical sequence with staged reveals.
 */

interface PipelineStage {
  num: string;
  icon: LucideIcon;
  label: string;
  note: string;
}

const STAGES: PipelineStage[] = [
  {
    num: "01",
    icon: Inbox,
    label: "Intake",
    note: "You describe what you're trying to ship.",
  },
  {
    num: "02",
    icon: DraftingCompass,
    label: "Architecture",
    note: "Data model and system boundaries get drawn.",
  },
  {
    num: "03",
    icon: Terminal,
    label: "Implementation",
    note: "Backend logic and integrations get built.",
  },
  {
    num: "04",
    icon: AppWindow,
    label: "Interface",
    note: "The screens your team runs the day on.",
  },
  {
    num: "05",
    icon: PackageCheck,
    label: "Delivery",
    note: "A working system, handed over cleanly.",
  },
];

function StageNode({ stage }: { stage: PipelineStage }) {
  const Icon = stage.icon;
  return (
    <div className="relative flex-1 rounded-xl border border-border bg-background/40 p-4">
      <div className="flex items-center justify-between">
        <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-card">
          <Icon className="size-5 text-accent/90" />
        </div>
        <span className="font-mono text-xs text-accent/70">{stage.num}</span>
      </div>
      <p className="mt-3 text-sm font-semibold tracking-tight">{stage.label}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        {stage.note}
      </p>
    </div>
  );
}

function Connector({ delay }: { delay?: string }) {
  return (
    <div className="hidden w-10 shrink-0 items-center self-stretch lg:flex">
      <div className="relative w-full">
        <GrowLine className="w-full" />
        <span
          aria-hidden
          className="animate-flow-x absolute top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_8px_1px_rgba(139,140,248,0.5)]"
          style={delay ? { animationDelay: delay } : undefined}
        />
      </div>
    </div>
  );
}

export function ServicesPipeline() {
  return (
    <Reveal className="mt-12">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card/40 p-6 ring-1 ring-white/5 md:p-10">
        <div aria-hidden className="bg-grid absolute inset-0 opacity-25" />
        <div aria-hidden className="scanlines absolute inset-0 opacity-40" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,rgba(139,140,248,0.06),transparent)]"
        />

        <div className="relative">
          <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
            <span aria-hidden className="size-1.5 bg-accent/90" />
            Build pipeline — request to running system
          </p>

          {/* desktop: horizontal pipeline */}
          <div className="mt-8 hidden lg:flex lg:items-stretch">
            {STAGES.map((stage, index) => (
              <div key={stage.num} className="contents">
                {index > 0 && (
                  <Connector delay={`${(index - 1) * 0.7}s`} />
                )}
                <Reveal delay={index * 0.09} className="flex-1">
                  <StageNode stage={stage} />
                </Reveal>
              </div>
            ))}
          </div>

          {/* mobile/tablet: stacked vertical sequence */}
          <div className="mt-8 space-y-0 lg:hidden">
            {STAGES.map((stage, index) => (
              <div key={stage.num}>
                {index > 0 && (
                  <div
                    aria-hidden
                    className="ml-9 h-6 w-px bg-gradient-to-b from-border via-accent/40 to-border"
                  />
                )}
                <Reveal delay={0.04}>
                  <StageNode stage={stage} />
                </Reveal>
              </div>
            ))}
          </div>

          <p className="relative mt-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            The same arc every engagement follows: scope agreed in writing,
            built in small reviewable steps, delivered as one coherent system.
          </p>
        </div>
      </div>
    </Reveal>
  );
}
