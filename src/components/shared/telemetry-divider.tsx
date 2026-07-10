/**
 * Connective tissue between home sections: a mono section index, a hairline
 * with a travelling pulse, and a quiet status tick. Pure CSS animation
 * (disabled under prefers-reduced-motion via globals).
 */
export function TelemetryDivider({
  code,
  label,
}: {
  code: string;
  label: string;
}) {
  return (
    <div aria-hidden className="mx-auto w-full max-w-6xl px-6">
      <div className="flex items-center gap-4 py-2">
        <span className="font-mono text-xs tracking-widest text-muted-foreground/60 uppercase">
          {code}
        </span>
        <span className="font-mono text-xs text-muted-foreground/40">
          {label}
        </span>
        <div className="relative h-px flex-1 bg-gradient-to-r from-border via-border to-transparent">
          <span className="animate-flow-x absolute top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/70" />
        </div>
        <span className="font-mono text-xs text-accent/40">ok</span>
      </div>
    </div>
  );
}
