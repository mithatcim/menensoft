import { AlertTriangle, ArrowUpRight, CalendarClock, Inbox } from "lucide-react";
import Link from "next/link";

import { getAnalytics } from "@/lib/admin/analytics";
import {
  NOTE_TYPE_LABEL,
  PIPELINE,
  STALE_DAYS,
  STATUS_LABEL,
  getLeadSummary,
  type Lead,
} from "@/lib/admin/leads";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const FIT_LABELS: Record<string, string> = {
  "e-ticaret": "E-ticaret sistemi",
  "yonetim-paneli": "Yönetim paneli",
  "kurumsal-site": "Kurumsal site + admin",
  dashboard: "Dashboard / raporlama",
  otomasyon: "İş akışı otomasyonu",
  operasyon: "Operasyon sistemi",
  "emin-degilim": "Emin değilim",
};

const days = (d: Date) =>
  Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));

// "0 gündür bekliyor" is true and reads like a bug. A lead that landed this
// morning is the one you most want to answer — say so in words a human uses.
const waited = (d: Date) => {
  const n = days(d);
  return n === 0 ? "Bugün geldi" : `${n} gündür bekliyor`;
};

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card/60 p-5">
      <p className="font-mono text-xs tracking-widest text-muted-foreground/70 uppercase">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">
        {value}
      </p>
    </div>
  );
}

/**
 * The three queues that make this a to-do list rather than a report. Counts tell
 * you what happened; these tell you what to DO — which is the only thing a
 * dashboard is for when you are the only person who can act on it.
 */
function Queue({
  title,
  hint,
  icon: Icon,
  leads,
  accent,
  meta,
}: {
  title: string;
  hint: string;
  icon: typeof Inbox;
  leads: Lead[];
  accent?: boolean;
  meta: (l: Lead) => string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card/60 p-5",
        accent && leads.length > 0 ? "border-accent/40 bg-accent/5" : "border-border",
      )}
    >
      <h2 className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground/70 uppercase">
        <Icon className={cn("size-3.5", accent && leads.length > 0 && "text-accent")} />
        {title}
        {leads.length > 0 && (
          <span className="ml-auto tabular-nums text-foreground">
            {leads.length}
          </span>
        )}
      </h2>

      {leads.length === 0 ? (
        // An empty queue is good news and should read like it — not like a bug.
        <p className="mt-3 text-sm text-muted-foreground">{hint}</p>
      ) : (
        <ul className="mt-3 space-y-1">
          {leads.map((l) => (
            <li key={l.id}>
              <Link
                href={`/admin/leads/${l.id}`}
                className="group flex items-center justify-between gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted/40"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">
                    {l.name}
                  </span>
                  <span className="block truncate font-mono text-xs text-muted-foreground">
                    {meta(l)}
                  </span>
                </span>
                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Breakdown({
  title,
  rows,
  labels,
}: {
  title: string;
  rows: { key: string; count: number }[];
  labels?: Record<string, string>;
}) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <div className="rounded-xl border border-border bg-card/60 p-5">
      <h2 className="font-mono text-xs tracking-widest text-muted-foreground/70 uppercase">
        {title}
      </h2>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">Henüz veri yok.</p>
      ) : (
        <ul className="mt-4 space-y-2.5">
          {rows.map((r) => (
            <li key={r.key} className="text-sm">
              <div className="flex items-baseline justify-between gap-3">
                <span className="min-w-0 truncate text-foreground/85">
                  {labels?.[r.key] ?? r.key}
                </span>
                <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                  {r.count}
                </span>
              </div>
              <div className="mt-1 h-1 rounded-full bg-border">
                <div
                  className="h-1 rounded-full bg-accent/70"
                  style={{ width: `${(r.count / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default async function AdminDashboard() {
  const [s, a] = await Promise.all([getLeadSummary(), getAnalytics()]);

  if (!s) {
    return (
      <p className="rounded-xl border border-border bg-card/60 p-6 text-sm text-muted-foreground">
        Veritabanı bağlantısı yok. DATABASE_URL ayarlandığında talepler burada
        görünür.
      </p>
    );
  }

  const todo =
    s.needsReply.length + s.followUpsDue.length + s.stale.length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Bugün ne yapmalı</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {todo === 0
            ? "Bekleyen iş yok. Talep sayıları aşağıda; ziyaretçi verileri "
            : `${todo} talep sizden bir şey bekliyor. Ziyaretçi verileri `}
          <Link
            href="/admin/analytics"
            className="text-foreground/85 underline underline-offset-4 hover:text-foreground"
          >
            Analitik
          </Link>
          &apos;te.
        </p>
      </div>

      {/* ---- the three queues: this is the actual product ------------------ */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Queue
          title="Yanıt bekliyor"
          hint="Yanıtlanmamış talep yok."
          icon={Inbox}
          leads={s.needsReply}
          accent
          // no source path -> no dangling "· —"
          meta={(l) => [waited(l.created_at), l.source_path].filter(Boolean).join(" · ")}
        />
        <Queue
          title="Hatırlatma"
          hint="Bugün için planlanmış hatırlatma yok."
          icon={CalendarClock}
          leads={s.followUpsDue}
          accent
          meta={(l) => {
            const d = l.follow_up_at!;
            const late = d < new Date();
            return late
              ? `Gecikmiş · ${d.toLocaleDateString("tr-TR", { day: "2-digit", month: "long" })}`
              : `Bugün · ${STATUS_LABEL[l.status]}`;
          }}
        />
        <Queue
          title={`Soğuyor (${STALE_DAYS}+ gün)`}
          hint="İletişime geçilip unutulan talep yok."
          icon={AlertTriangle}
          leads={s.stale}
          meta={(l) =>
            `${STATUS_LABEL[l.status]} · ${days(l.updated_at)} gündür sessiz`
          }
        />
      </div>

      {/* ---- pipeline ------------------------------------------------------ */}
      <div>
        <h2 className="text-base font-semibold tracking-tight">Satış hattı</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {PIPELINE.map((st) => (
            <Link
              key={st}
              href={`/admin/leads?status=${st}`}
              className="group rounded-xl border border-border bg-card/60 p-4 transition-colors hover:border-accent/40"
            >
              {/* No truncate: a stage the owner cannot read ("TEKLİF GÖNDERİ…")
                  is a stage they stop trusting. Grid rows stretch, so letting
                  the long labels wrap costs nothing but a second line. */}
              <p className="font-mono text-[11px] leading-snug tracking-wider text-balance text-muted-foreground/70 uppercase">
                {STATUS_LABEL[st]}
              </p>
              <p className="mt-1.5 text-2xl font-semibold tracking-tight tabular-nums">
                {s.byStatus[st] ?? 0}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* ---- counts -------------------------------------------------------- */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Toplam talep" value={s.total} />
        <Stat label="Bugün" value={s.today} />
        <Stat label="Son 7 gün" value={s.last7} />
        {a?.hasAnyData ? (
          <Link
            href="/admin/analytics"
            className="group rounded-xl border border-border bg-card/60 p-5 transition-colors hover:border-accent/40"
          >
            <p className="flex items-center justify-between font-mono text-xs tracking-widest text-muted-foreground/70 uppercase">
              Ziyaretçi (bugün)
              <ArrowUpRight className="size-3.5 text-accent transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </p>
            <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">
              {a.overview.visitorsToday}
            </p>
            <p className="mt-1 font-mono text-xs text-muted-foreground/60">
              {a.overview.pageViewsToday} görüntüleme · {a.overview.ctaToday} CTA
            </p>
          </Link>
        ) : (
          <div className="flex items-center rounded-xl border border-dashed border-border bg-card/30 p-5">
            <p className="text-xs leading-relaxed text-muted-foreground">
              Ziyaretçi verisi yok.{" "}
              {a
                ? "Şema uygulandı ama henüz olay kaydedilmedi."
                : "Analitik tabloları okunamıyor."}
            </p>
          </div>
        )}
      </div>

      {/* ---- activity + breakdowns ----------------------------------------- */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* min-w-0: a grid item defaults to min-width:auto, so it can never be
            narrower than its content — and a note is arbitrary owner text with
            `truncate` (white-space:nowrap) on it, which reports its FULL width as
            min-content. Without this the longest note silently widens the mobile
            track and the whole dashboard scrolls sideways. */}
        <div className="min-w-0 rounded-xl border border-border bg-card/60 p-5">
          <h2 className="font-mono text-xs tracking-widest text-muted-foreground/70 uppercase">
            Son hareketler
          </h2>
          {s.recentActivity.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">Henüz hareket yok.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {s.recentActivity.map((n) => (
                <li key={n.id}>
                  <Link
                    href={`/admin/leads/${n.lead_id}`}
                    className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 rounded-md px-2 py-1 font-mono text-xs transition-colors hover:bg-muted/40"
                  >
                    <span className="text-muted-foreground/60">
                      {n.created_at.toLocaleString("tr-TR", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="text-accent">
                      {NOTE_TYPE_LABEL[n.note_type] ?? n.note_type}
                    </span>
                    <span className="font-sans font-medium text-foreground/90">
                      {n.lead_name}
                    </span>
                    <span className="min-w-0 truncate text-muted-foreground">
                      {n.note}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Breakdown title="Geldiği sayfa" rows={s.bySource} />
          <Breakdown title="Seçilen sistem" rows={s.byFit} labels={FIT_LABELS} />
        </div>
      </div>
    </div>
  );
}
