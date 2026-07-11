import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { SpotlightCard } from "@/components/shared/spotlight-card";
import { buttonVariants } from "@/components/ui/button";
import { getProject } from "@/content/projects";
import { cn } from "@/lib/utils";

/**
 * Sektör ve sistem sayfalarının paylaştığı içerik blokları. Mission-control
 * dilini (mono eyebrow + accent kare, kart matrisleri, M-etiketli modüller)
 * yeni sayfalara taşır; animasyon sayfa tarafındaki Reveal sarmalayıcılardan
 * gelir. Hepsi server component'tir.
 */

export function AnswerSection({
  id,
  eyebrow,
  title,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
        <span aria-hidden className="size-1.5 bg-accent/90" />
        {eyebrow}
      </p>
      <h2 className="mt-3 text-xl font-semibold tracking-tight text-balance md:text-2xl">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function BulletPanel({
  title,
  items,
  quiet,
  className,
}: {
  title?: string;
  items: string[];
  quiet?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-5",
        quiet
          ? "border-dashed border-border bg-card/50"
          : "border-border bg-card/70 ring-1 ring-white/5",
        className,
      )}
    >
      {title && (
        <p
          className={cn(
            "flex items-center gap-2 font-mono text-xs tracking-widest uppercase",
            quiet ? "text-muted-foreground/70" : "text-muted-foreground",
          )}
        >
          <span
            aria-hidden
            className={cn(
              "size-1.5",
              quiet
                ? "rotate-45 border border-muted-foreground/50"
                : "bg-accent/90",
            )}
          />
          {title}
        </p>
      )}
      <ul className={cn("space-y-2.5", title && "mt-4")}>
        {items.map((item) => (
          <li
            key={item}
            className={cn(
              "flex gap-3 text-sm leading-relaxed",
              quiet ? "text-muted-foreground" : "text-foreground/90",
            )}
          >
            <span
              aria-hidden
              className={cn(
                "mt-2 size-1 shrink-0",
                quiet
                  ? "rotate-45 border border-muted-foreground/40"
                  : "rounded-full bg-accent/80",
              )}
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ModuleGrid({
  modules,
}: {
  modules: { name: string; note: string }[];
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {modules.map((module, i) => (
        <SpotlightCard
          key={module.name}
          className="rounded-xl border border-border bg-card/70 p-4 ring-1 ring-white/5 transition-colors duration-300 hover:border-accent/25"
        >
          <p className="flex items-center justify-between gap-3">
            <span className="font-mono text-xs text-accent/80">M{i + 1}</span>
            <span aria-hidden className="size-1.5 rounded-full bg-accent/70" />
          </p>
          <h3 className="mt-2 text-sm font-semibold tracking-tight">
            {module.name}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {module.note}
          </p>
        </SpotlightCard>
      ))}
    </div>
  );
}

/** Gerçek projelere dürüst etiketli bağlantılar. */
export function RelatedProjects({
  items,
}: {
  items: { slug: string; note: string }[];
}) {
  const resolved = items
    .map((item) => ({ project: getProject(item.slug), note: item.note }))
    .filter(
      (x): x is { project: NonNullable<ReturnType<typeof getProject>>; note: string } =>
        Boolean(x.project),
    );
  if (resolved.length === 0) return null;
  return (
    <ul className="space-y-2.5">
      {resolved.map(({ project, note }) => (
        <li key={project.slug}>
          <Link
            href={`/projeler/${project.slug}`}
            className="group block rounded-lg border border-border bg-background/50 px-4 py-3 transition-colors hover:border-accent/40 hover:bg-card"
          >
            <span className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-foreground/90 transition-colors group-hover:text-foreground">
                {project.name}
              </span>
              <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
            </span>
            <span className="mt-1 block font-mono text-xs text-muted-foreground/80">
              {note}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function ChipLinks({
  links,
}: {
  links: { label: string; href: string }[];
}) {
  if (links.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="group flex items-center gap-2 rounded-lg border border-border bg-background/50 px-3 py-1.5 text-sm transition-colors hover:border-accent/40 hover:bg-card"
        >
          <span aria-hidden className="size-1.5 rounded-full bg-accent/80" />
          <span className="text-foreground/85 transition-colors group-hover:text-foreground">
            {link.label}
          </span>
          <ArrowUpRight className="size-3.5 text-muted-foreground transition-colors group-hover:text-foreground" />
        </Link>
      ))}
    </div>
  );
}

/** Sayfa içi dönüşüm bandı — birincil CTA her zaman /teklif-al. */
export function CtaBand({
  title,
  text,
  secondaryLabel = "Süreci gör",
  secondaryHref = "/surec",
}: {
  title: string;
  text: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-accent/25 bg-accent/5 p-6 md:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_20%_0%,rgba(139,140,248,0.08),transparent)]"
      />
      <div className="relative">
        <h2 className="text-xl font-semibold tracking-tight text-balance md:text-2xl">
          {title}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          {text}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="/teklif-al"
            className={cn(buttonVariants({ variant: "cta" }), "h-11 px-6")}
          >
            Teklif al
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href={secondaryHref}
            className={cn(buttonVariants({ variant: "outline" }), "h-11 px-6")}
          >
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
