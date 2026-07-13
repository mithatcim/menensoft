import { cn } from "@/lib/utils";

const STATUS = {
  new: { label: "Yeni", className: "border-accent/50 bg-accent/10 text-accent" },
  read: {
    label: "Okundu",
    className: "border-border bg-muted/40 text-foreground/80",
  },
  contacted: {
    label: "İletişim kuruldu",
    className: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
  },
  archived: {
    label: "Arşiv",
    className: "border-dashed border-border bg-transparent text-muted-foreground",
  },
} as const;

export function StatusBadge({ status }: { status: string }) {
  const s = STATUS[status as keyof typeof STATUS] ?? STATUS.new;
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-md border px-2 py-0.5 font-mono text-[11px] whitespace-nowrap",
        s.className,
      )}
    >
      {s.label}
    </span>
  );
}
