import { AppWindow, Database, Server, type LucideIcon } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/shared/reveal";

interface Stage {
  icon: LucideIcon;
  label: string;
  note: string;
}

const stages: Stage[] = [
  { icon: Database, label: "Database", note: "Schema & data model" },
  { icon: Server, label: "Backend & APIs", note: "Logic, auth, routing" },
  { icon: AppWindow, label: "Interface", note: "The screens people use" },
];

function StageNode({ stage }: { stage: Stage }) {
  const Icon = stage.icon;
  return (
    <div className="flex flex-1 items-center gap-4 rounded-xl border border-border bg-background/40 p-4">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-border bg-card">
        <Icon className="size-5 text-amber-400/90" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold tracking-tight">{stage.label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{stage.note}</p>
      </div>
    </div>
  );
}

function Connector({ delay }: { delay?: string }) {
  return (
    <div className="hidden md:flex md:w-14 md:items-center">
      <div className="relative h-px w-full bg-gradient-to-r from-border via-amber-400/40 to-border">
        <span
          aria-hidden
          className="animate-flow-x absolute top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400 shadow-[0_0_8px_1px_rgba(251,191,36,0.5)]"
          style={delay ? { animationDelay: delay } : undefined}
        />
      </div>
    </div>
  );
}

export function SystemFlowBand() {
  return (
    <section className="py-12 md:py-16">
      <Container>
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-border bg-card/40 p-6 ring-1 ring-white/5 md:p-10">
            <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
              <span aria-hidden className="size-1.5 bg-amber-400/90" />
              Database to interface
            </p>
            <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-stretch">
              <StageNode stage={stages[0]} />
              <Connector />
              <StageNode stage={stages[1]} />
              <Connector delay="1.4s" />
              <StageNode stage={stages[2]} />
            </div>
            <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              One person owning every layer, so the data model, the backend, and
              the interface actually fit together, instead of three teams
              guessing at each other&apos;s edges.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
