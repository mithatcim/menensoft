import {
  ArrowUpRight,
  Eye,
  Pencil,
  Plus,
  Search,
} from "lucide-react";
import Link from "next/link";

import { quickStatusAction } from "@/app/admin/project-actions";
import {
  STATUSES,
  STATUS_LABEL,
  TIERS,
  TIER_LABEL,
  listAdminProjects,
  type AdminFilters,
} from "@/lib/projects-cms/admin";
import { cn } from "@/lib/utils";

import type { ProjectStatus } from "@/lib/projects-cms";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

const STATUS_STYLE: Record<ProjectStatus, string> = {
  draft: "border-border text-muted-foreground",
  published: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  archived: "border-border/60 text-muted-foreground/60",
};

function LocaleChip({ locale, complete }: { locale: string; complete: boolean }) {
  return (
    <span
      title={
        complete
          ? `${locale.toUpperCase()} tamam`
          : `${locale.toUpperCase()} eksik — yayın için zorunlu alanlar dolu olmalı`
      }
      className={cn(
        "rounded px-1.5 py-0.5 font-mono text-[10px] tracking-widest uppercase",
        complete
          ? "bg-emerald-500/10 text-emerald-300"
          : "bg-amber-500/10 text-amber-300",
      )}
    >
      {locale}
      {complete ? " ✓" : " ✗"}
    </span>
  );
}

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const one = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const filters: AdminFilters = {
    q: one("q") ?? "",
    status: (one("status") as ProjectStatus | "all") ?? "all",
    tier: (one("tier") as (typeof TIERS)[number] | "all") ?? "all",
  };

  const rows = await listAdminProjects(filters);

  if (rows === null) {
    return (
      <p className="rounded-xl border border-border bg-card/60 p-6 text-sm text-muted-foreground">
        DATABASE_URL ayarlı değil — proje CMS okunamıyor.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Projeler</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            {rows.length} kayıt · herkese açık sayfalar{" "}
            <strong className="font-medium text-foreground/80">
              38C’ye kadar
            </strong>{" "}
            hâlâ typed dosyaları okuyor
          </p>
        </div>

        <Link
          href="/admin/projects/new"
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-foreground px-3 py-2 text-sm font-medium text-background"
        >
          <Plus className="size-4" />
          Yeni proje
        </Link>
      </div>

      <form className="flex flex-wrap gap-2 rounded-xl border border-border bg-card/60 p-3">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            name="q"
            defaultValue={filters.q}
            placeholder="Slug, başlık, tek cümle…"
            className="w-full rounded-lg border border-border bg-background py-2 pr-3 pl-9 text-sm outline-none focus:border-accent/60"
          />
        </div>

        <select
          name="status"
          defaultValue={filters.status}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="all">Tüm durumlar</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>

        <select
          name="tier"
          defaultValue={filters.tier}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="all">Tüm türler</option>
          {TIERS.map((t) => (
            <option key={t} value={t}>
              {TIER_LABEL[t]}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-foreground/30"
        >
          Filtrele
        </button>
      </form>

      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-card/30 p-8 text-center text-sm text-muted-foreground">
          Kayıt yok.
        </p>
      ) : (
        <ul className="space-y-2">
          {rows.map(({ project, complete }) => (
            <li
              key={project.id}
              className="rounded-xl border border-border bg-card/60 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "rounded border px-1.5 py-0.5 font-mono text-[10px] tracking-widest uppercase",
                        STATUS_STYLE[project.status],
                      )}
                    >
                      {STATUS_LABEL[project.status]}
                    </span>
                    <LocaleChip locale="tr" complete={complete.tr} />
                    <LocaleChip locale="en" complete={complete.en} />
                    {project.featured && (
                      <span className="rounded bg-accent/10 px-1.5 py-0.5 font-mono text-[10px] tracking-widest text-accent uppercase">
                        öne çıkan
                      </span>
                    )}
                  </div>

                  <p className="mt-1.5 truncate font-mono text-sm text-foreground">
                    {project.slug}
                  </p>
                  <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                    sıra {project.sort_order} · {TIER_LABEL[project.tier]}
                    {project.fit_id ? ` · ${project.fit_id}` : ""} ·{" "}
                    {project.updated_at.toLocaleDateString("tr-TR")}
                    {project.published_at
                      ? ` · yayın ${project.published_at.toLocaleDateString("tr-TR")}`
                      : ""}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                  <Link
                    href={`/admin/projects/${project.id}`}
                    aria-label="Düzenle"
                    className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs transition-colors hover:border-foreground/30"
                  >
                    <Pencil className="size-3.5" />
                    <span className="hidden sm:inline">Düzenle</span>
                  </Link>

                  <Link
                    href={`/admin/projects/${project.id}/preview`}
                    aria-label="Önizle"
                    className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs transition-colors hover:border-foreground/30"
                  >
                    <Eye className="size-3.5" />
                    <span className="hidden sm:inline">Önizle</span>
                  </Link>

                  {/* The public link is offered only when the project is actually
                      published AND the typed files still carry that slug. Until
                      38C, a CMS-only project has no public page — linking to one
                      would hand the owner a 404 and call it a feature. */}
                  {project.status === "published" && (
                    <Link
                      href={`/projeler/${project.slug}`}
                      target="_blank"
                      aria-label="Herkese açık sayfa"
                      className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs transition-colors hover:border-foreground/30"
                    >
                      <ArrowUpRight className="size-3.5" />
                      <span className="hidden sm:inline">Site</span>
                    </Link>
                  )}

                  <form action={quickStatusAction}>
                    <input type="hidden" name="id" value={project.id} />
                    <input
                      type="hidden"
                      name="next"
                      value={project.status === "archived" ? "draft" : "archived"}
                    />
                    <button
                      type="submit"
                      className="rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {project.status === "archived" ? "Geri al" : "Arşivle"}
                    </button>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs leading-relaxed text-muted-foreground">
        Kalıcı silme yok. Bir slug silinirse dünyadaki bağlantılar, fit.ts
        eşleşmeleri ve geçmiş taleplerin referansları onunla birlikte gider —
        arşiv geri alınabilir, silme alınamaz.
      </p>
    </div>
  );
}
