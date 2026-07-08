import { cn } from "@/lib/utils";

export function SectionHeading({
  as: Heading = "h2",
  eyebrow,
  title,
  description,
  className,
}: {
  as?: "h1" | "h2";
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow && (
        <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          {eyebrow}
        </p>
      )}
      <Heading
        className={cn(
          "mt-3 font-semibold tracking-tight text-balance",
          Heading === "h1"
            ? "text-4xl md:text-5xl"
            : "text-3xl md:text-4xl",
        )}
      >
        {title}
      </Heading>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
