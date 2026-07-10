import { ArrowRight } from "lucide-react";
import { Fragment } from "react";

import { cn } from "@/lib/utils";

/** Abstract system-flow strip: mono node chips joined by arrows. */
export function FlowPanel({
  label = "System flow",
  nodes,
  className,
}: {
  label?: string;
  nodes: readonly string[];
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-5", className)}>
      <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
        <span aria-hidden className="size-1.5 bg-accent/90" />
        {label}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {nodes.map((node, index) => (
          <Fragment key={node}>
            {index > 0 && (
              <ArrowRight
                aria-hidden
                className="size-3.5 shrink-0 text-muted-foreground/60"
              />
            )}
            <span className="rounded-md border border-border bg-background/50 px-3 py-1.5 font-mono text-xs text-foreground/80">
              {node}
            </span>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
