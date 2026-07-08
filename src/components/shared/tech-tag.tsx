export function TechTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-border bg-secondary/40 px-2 py-1 font-mono text-xs text-muted-foreground">
      {children}
    </span>
  );
}
