import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { SpotlightCard } from "@/components/shared/spotlight-card";
import { buttonVariants } from "@/components/ui/button";
import { siteEn } from "@/content/en/site";
import { site } from "@/content/site";
import { ContactLink } from "@/components/shared/contact-link";
import { type Locale } from "@/lib/locale";
import { getPublishedProjects } from "@/lib/projects/public";
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
export async function RelatedProjects({
  items,
  locale = "tr",
}: {
  items: { slug: string; note: string }[];
  locale?: Locale;
}) {
  // Published projects only (38C): an archived project stops being proof.
  const published = await getPublishedProjects(locale);
  const lookup = (slug: string) =>
    published.find((project) => project.slug === slug);
  const base = locale === "en" ? "/en/projects" : "/projeler";
  const resolved = items
    .map((item) => ({ project: lookup(item.slug), note: item.note }))
    .filter(
      (
        x,
      ): x is {
        project: NonNullable<ReturnType<typeof lookup>>;
        note: string;
      } => Boolean(x.project),
    );
  if (resolved.length === 0) return null;
  return (
    <ul className="space-y-2.5">
      {resolved.map(({ project, note }) => (
        <li key={project.slug}>
          <Link
            href={`${base}/${project.slug}`}
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

/**
 * Copy for pages that close with CtaBand alone — the system and sector detail
 * pages, which dropped ContactCTA in Phase 27.
 *
 * `availability` reuses site.availability rather than inventing a new phrase, so
 * the signal reads identically to the pill ContactCTA still shows everywhere
 * else. `noSpec` is the site's own standing promise ("birkaç cümle yeterli —
 * şartname gerekmez"), not a capacity claim: no slots, no response time, no
 * guarantee of acceptance.
 */
const FALLBACK_COPY = {
  tr: {
    availability: site.availability,
    noSpec: "Şartname gerekmez",
    pre: "Sihirbazsız yazmayı tercih ederseniz",
    email: "doğrudan e-posta gönderin",
    or: "ya da",
    contact: "iletişim kanallarına bakın",
    contactHref: "/iletisim",
  },
  en: {
    availability: siteEn.availability,
    noSpec: "No spec required",
    pre: "Prefer to write without the wizard?",
    email: "send an email directly",
    or: "or",
    contact: "see the contact channels",
    contactHref: "/en/contact",
  },
} as const;

/**
 * Sayfa içi dönüşüm bandı — birincil CTA her zaman /teklif-al.
 *
 * Varsayılan etiket "Teklif al" değil: sayfa fiyatı kapsamdan önce vermiyor,
 * dolayısıyla teklif vaat eden bir buton yanlış beklenti kuruyordu. İkincil
 * etiket de Faz 23'te birleştirilen "Süreci incele" ile hizalandı.
 *
 * Faz 27: `contactFallback` ile bir e-posta/iletişim satırı taşıyabilir. Sistem
 * ve sektör detay sayfaları artık kapanışı yalnızca bu bantla yapıyor —
 * ardından gelen ContactCTA aynı hedefe giden üçüncü bir bant oluyordu — ve
 * ContactCTA'nın sunduğu doğrudan e-posta yolu bu satırla korunuyor.
 */
export function CtaBand({
  title,
  text,
  primaryLabel = "Proje görüşmesi başlat",
  primaryHref = "/teklif-al",
  secondaryLabel = "Süreci incele",
  secondaryHref = "/surec",
  locale = "tr",
  contactFallback = false,
}: {
  title: string;
  text: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  locale?: Locale;
  /** Render the direct email / contact line (pages that drop ContactCTA). */
  contactFallback?: boolean;
}) {
  const fb = FALLBACK_COPY[locale];

  return (
    <div className="relative overflow-hidden rounded-xl border border-accent/25 bg-accent/5 p-6 md:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_20%_0%,rgba(139,140,248,0.08),transparent)]"
      />
      <div className="relative">
        {/* The availability signal ContactCTA used to carry on these pages. It
            is a supporting line, not a third CTA, and it is gated on the same
            flag that means "this band is the page's only close" — so it can
            never double up with ContactCTA's pill on the pages that keep it. */}
        {contactFallback && (
          <p className="mb-3.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <span
                aria-hidden
                className="size-1.5 rounded-full bg-accent shadow-[0_0_8px_1px_rgba(139,140,248,0.6)]"
              />
              {fb.availability}
            </span>
            {/* the separator only reads as one when the row is on one line;
                below sm it wrapped and left a "·" dangling at the end of a line */}
            <span
              aria-hidden
              className="hidden text-muted-foreground/40 sm:inline"
            >
              ·
            </span>
            <span>{fb.noSpec}</span>
          </p>
        )}

        <h2 className="text-xl font-semibold tracking-tight text-balance md:text-2xl">
          {title}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          {text}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href={primaryHref}
            className={cn(buttonVariants({ variant: "cta" }), "h-11 px-6")}
          >
            {primaryLabel}
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href={secondaryHref}
            className={cn(buttonVariants({ variant: "outline" }), "h-11 px-6")}
          >
            {secondaryLabel}
          </Link>
        </div>

        {contactFallback && site.email && (
          <p className="mt-5 text-sm text-muted-foreground">
            {fb.pre}{" "}
            <ContactLink
              channel="email"
              className="text-foreground/85 underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              {fb.email}
            </ContactLink>{" "}
            {fb.or}{" "}
            <Link
              href={fb.contactHref}
              className="text-foreground/85 underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              {fb.contact}
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
}
