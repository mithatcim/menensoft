import { STATUS_LABEL, type LeadStatus } from "@/lib/admin/leads";
import { cn } from "@/lib/utils";

/**
 * Eight states, three visual families (Phase 36A):
 *   - in play      → accent, it wants something from you
 *   - closed-won   → emerald, it paid
 *   - closed-lost / archived → dashed and muted, it is over
 *
 * The point is that a glance down the list tells you where your attention goes,
 * without reading a single word.
 */
const STYLE: Record<LeadStatus, string> = {
  new: "border-accent/50 bg-accent/10 text-accent",
  read: "border-border bg-muted/40 text-foreground/80",
  contacted: "border-sky-500/40 bg-sky-500/10 text-sky-400",
  qualified: "border-violet-500/40 bg-violet-500/10 text-violet-300",
  proposal_sent: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  won: "border-emerald-500/50 bg-emerald-500/15 text-emerald-400",
  lost: "border-dashed border-rose-500/40 bg-rose-500/5 text-rose-400/90",
  archived: "border-dashed border-border bg-transparent text-muted-foreground",
};

export function StatusBadge({ status }: { status: string }) {
  const s = (status in STYLE ? status : "new") as LeadStatus;
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-md border px-2 py-0.5 font-mono text-[11px] whitespace-nowrap",
        STYLE[s],
      )}
    >
      {STATUS_LABEL[s]}
    </span>
  );
}
