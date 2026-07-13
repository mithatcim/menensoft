import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { StatusBadge } from "@/components/admin/status-badge";
import { getLeadSummary } from "@/lib/admin/leads";

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
              {/* A proportion bar over real counts — not a traffic chart. There
                  is no visitor data yet and none is implied here. */}
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
  const s = await getLeadSummary();

  if (!s) {
    return (
      <p className="rounded-xl border border-border bg-card/60 p-6 text-sm text-muted-foreground">
        Veritabanı bağlantısı yok. DATABASE_URL ayarlandığında talepler burada
        görünür.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Özet</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Tüm sayılar form gönderimlerinden gelir. Ziyaretçi/trafik verisi henüz
          toplanmıyor.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Toplam talep" value={s.total} />
        <Stat label="Yeni" value={s.byStatus.new ?? 0} />
        <Stat label="Bugün" value={s.today} />
        <Stat label="Son 7 gün" value={s.last7} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Okundu" value={s.byStatus.read ?? 0} />
        <Stat label="İletişime geçildi" value={s.byStatus.contacted ?? 0} />
        <Stat label="Arşiv" value={s.byStatus.archived ?? 0} />
        <div className="flex items-center rounded-xl border border-dashed border-border bg-card/30 p-5">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Ziyaretçi, oturum ve sayfa görüntüleme metrikleri sonraki fazda
            gelecek.
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Breakdown title="Geldiği sayfa" rows={s.bySource} />
        <Breakdown title="Seçilen sistem" rows={s.byFit} labels={FIT_LABELS} />
        <Breakdown title="Dil" rows={s.byLanguage} />
      </div>

      <div>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-base font-semibold tracking-tight">Son talepler</h2>
          <Link
            href="/admin/leads"
            className="group inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Hepsini gör
            <ArrowUpRight className="size-3.5 text-accent" />
          </Link>
        </div>

        {s.latest.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-border bg-card/30 p-6 text-sm text-muted-foreground">
            Henüz talep yok.
          </p>
        ) : (
          <ul className="mt-4 overflow-hidden rounded-xl border border-border">
            {s.latest.map((lead) => (
              <li key={lead.id} className="border-b border-border/60 last:border-0">
                <Link
                  href={`/admin/leads/${lead.id}`}
                  className="flex items-center justify-between gap-4 bg-card px-5 py-3.5 transition-colors hover:bg-muted/40"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <StatusBadge status={lead.status} />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">
                        {lead.name}
                      </span>
                      <span className="block truncate font-mono text-xs text-muted-foreground">
                        {lead.email ?? lead.phone ?? "—"}
                      </span>
                    </span>
                  </span>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground">
                    {lead.created_at.toLocaleString("tr-TR", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
