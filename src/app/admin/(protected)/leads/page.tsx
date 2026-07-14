import { ArrowUpRight, CalendarClock, Download, Search } from "lucide-react";
import Link from "next/link";

import { StatusBadge } from "@/components/admin/status-badge";
import { inputClass } from "@/components/leads/field";
import { buttonVariants } from "@/components/ui/button";
import {
  LEAD_STATUSES,
  PAGE_SIZE,
  PRIORITIES,
  PRIORITY_LABEL,
  STATUS_LABEL,
  listLeads,
} from "@/lib/admin/leads";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const FIT_IDS = [
  "e-ticaret",
  "yonetim-paneli",
  "kurumsal-site",
  "dashboard",
  "otomasyon",
  "operasyon",
  "emin-degilim",
];

const SORTS: { id: string; label: string }[] = [
  { id: "newest", label: "En yeni" },
  { id: "waiting", label: "En uzun bekleyen" },
  { id: "followup", label: "Hatırlatma tarihi" },
  { id: "oldest", label: "En eski" },
];

const day = (d: Date | null) =>
  d ? d.toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit" }) : "—";

/**
 * Filters live in the query string (a GET form) rather than in component state:
 * a filtered view stays linkable and survives a reload. Every value is validated
 * server-side in `listLeads` and bound as a parameter, so a hand-edited query
 * string is inert — it matches nothing rather than doing anything.
 */
export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const one = (k: string) => {
    const v = sp[k];
    return typeof v === "string" ? v : undefined;
  };

  const filters = {
    status: one("status"),
    language: one("language"),
    fit: one("fit"),
    priority: one("priority"),
    followUp: one("followUp"),
    q: one("q"),
    sort: one("sort"),
    page: Number(one("page") ?? 1) || 1,
  };

  const result = await listLeads(filters);

  if (!result) {
    return (
      <p className="rounded-xl border border-border bg-card/60 p-6 text-sm text-muted-foreground">
        Veritabanı bağlantısı yok. DATABASE_URL ayarlandığında talepler burada
        görünür.
      </p>
    );
  }

  const { leads, total, page, pages } = result;
  const qs = (over: Record<string, string | number | undefined>) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...filters, ...over })) {
      if (v !== undefined && v !== "" && !(k === "page" && v === 1)) {
        p.set(k, String(v));
      }
    }
    const s = p.toString();
    return s ? `/admin/leads?${s}` : "/admin/leads";
  };

  const now = new Date();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="text-xl font-semibold tracking-tight">Talepler</h1>
        <div className="flex items-center gap-3">
          <p className="font-mono text-xs text-muted-foreground">
            {total} kayıt
            {pages > 1 && ` · sayfa ${page}/${pages}`}
          </p>
          {/* Insurance. Your leads should never be trapped behind a psql prompt. */}
          <a
            href="/admin/leads.csv"
            className={cn(buttonVariants({ variant: "outline" }), "h-9 px-3 text-xs")}
          >
            <Download className="size-3.5" />
            CSV
          </a>
        </div>
      </div>

      {/* GET form: the URL is the state. */}
      <form
        method="get"
        className="grid gap-3 rounded-xl border border-border bg-card/60 p-4 sm:grid-cols-2 lg:grid-cols-6"
      >
        <div className="lg:col-span-2">
          <label htmlFor="q" className="sr-only">
            Ara
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground/60" />
            <input
              id="q"
              name="q"
              defaultValue={filters.q ?? ""}
              placeholder="Ad, e-posta, telefon, mesaj…"
              className={cn(inputClass, "pl-9")}
            />
          </div>
        </div>

        <select
          name="status"
          defaultValue={filters.status ?? ""}
          aria-label="Durum"
          className={inputClass}
        >
          <option value="">Tüm durumlar</option>
          <option value="open">Açık (kapanmamış)</option>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>

        <select
          name="followUp"
          defaultValue={filters.followUp ?? ""}
          aria-label="Hatırlatma"
          className={inputClass}
        >
          <option value="">Hatırlatma: hepsi</option>
          <option value="due">Bugün / gecikmiş</option>
          <option value="overdue">Yalnızca gecikmiş</option>
          <option value="none">Hatırlatması yok</option>
        </select>

        <select
          name="priority"
          defaultValue={filters.priority ?? ""}
          aria-label="Öncelik"
          className={inputClass}
        >
          <option value="">Tüm öncelikler</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {PRIORITY_LABEL[p]}
            </option>
          ))}
        </select>

        <select
          name="sort"
          defaultValue={filters.sort ?? "newest"}
          aria-label="Sıralama"
          className={inputClass}
        >
          {SORTS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>

        <select
          name="fit"
          defaultValue={filters.fit ?? ""}
          aria-label="Sistem"
          className={inputClass}
        >
          <option value="">Tüm sistemler</option>
          {FIT_IDS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          <select
            name="language"
            defaultValue={filters.language ?? ""}
            aria-label="Dil"
            className={inputClass}
          >
            <option value="">Dil</option>
            <option value="tr">TR</option>
            <option value="en">EN</option>
          </select>
          <button
            type="submit"
            className={cn(buttonVariants({ variant: "cta" }), "h-11 shrink-0 px-4")}
          >
            Filtrele
          </button>
        </div>
      </form>

      {leads.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-card/30 p-8 text-center text-sm text-muted-foreground">
          Bu filtreye uyan talep yok.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <ul>
            {leads.map((lead) => {
              const overdue =
                lead.follow_up_at &&
                lead.follow_up_at < now &&
                !["won", "lost", "archived"].includes(lead.status);
              return (
                <li
                  key={lead.id}
                  className="border-b border-border/60 last:border-0"
                >
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className={cn(
                      "group flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between",
                      overdue ? "bg-accent/5" : "bg-card",
                    )}
                  >
                    <span className="flex min-w-0 items-start gap-3">
                      <StatusBadge status={lead.status} />
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-baseline gap-x-2">
                          <span className="text-sm font-medium">{lead.name}</span>
                          <span className="font-mono text-xs text-muted-foreground">
                            {lead.email ?? lead.phone ?? "—"}
                          </span>
                          {lead.priority === "high" && (
                            <span className="rounded border border-border px-1 font-mono text-[10px] text-muted-foreground">
                              {PRIORITY_LABEL.high}
                            </span>
                          )}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                          {lead.message.split("\n").find((l) => l.trim()) ?? ""}
                        </span>
                        {/* Mobile carries the dates inline — a table at 390px is
                            a table nobody reads. */}
                        <span className="mt-1 flex flex-wrap items-center gap-x-3 font-mono text-[11px] text-muted-foreground/70 sm:hidden">
                          {lead.selected_fit_id && <span>{lead.selected_fit_id}</span>}
                          <span>{day(lead.created_at)}</span>
                          {lead.follow_up_at && (
                            <span className={cn(overdue && "text-accent")}>
                              ⏰ {day(lead.follow_up_at)}
                            </span>
                          )}
                        </span>
                      </span>
                    </span>

                    <span className="hidden shrink-0 flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted-foreground sm:flex">
                      {lead.follow_up_at && (
                        <span
                          className={cn(
                            "flex items-center gap-1",
                            overdue && "text-accent",
                          )}
                          title="Hatırlatma"
                        >
                          <CalendarClock className="size-3.5" />
                          {day(lead.follow_up_at)}
                        </span>
                      )}
                      {lead.selected_fit_id && (
                        <span className="rounded border border-border px-1.5 py-0.5">
                          {lead.selected_fit_id}
                        </span>
                      )}
                      <span className="uppercase">{lead.language}</span>
                      <span
                        className="hidden lg:inline"
                        title="Son iletişim"
                      >
                        {day(lead.last_contacted_at)}
                      </span>
                      <span>{day(lead.created_at)}</span>
                      <ArrowUpRight className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Never load the whole table into a page: at 20 a time this stays fast
          whether there are 5 leads or 50,000. */}
      {pages > 1 && (
        <div className="flex items-center justify-between gap-4">
          {page > 1 ? (
            <Link
              href={qs({ page: page - 1 })}
              className={cn(buttonVariants({ variant: "outline" }), "h-9 px-4")}
            >
              Önceki
            </Link>
          ) : (
            <span />
          )}
          <p className="font-mono text-xs text-muted-foreground">
            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} / {total}
          </p>
          {page < pages ? (
            <Link
              href={qs({ page: page + 1 })}
              className={cn(buttonVariants({ variant: "outline" }), "h-9 px-4")}
            >
              Sonraki
            </Link>
          ) : (
            <span />
          )}
        </div>
      )}
    </div>
  );
}
