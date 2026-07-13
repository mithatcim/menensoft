import { ArrowUpRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { getAnalytics } from "@/lib/admin/analytics";

export const dynamic = "force-dynamic";

const EVENT_LABEL: Record<string, string> = {
  session_start: "Oturum başladı",
  page_view: "Sayfa görüntüleme",
  cta_click: "CTA tıklaması",
  proof_click: "Proje (kanıt) tıklaması",
  email_click: "E-posta tıklaması",
  whatsapp_click: "WhatsApp tıklaması",
  form_submit: "Form gönderimi",
  language_switch: "Dil değişimi",
  heartbeat: "Süre sinyali",
};

const DEVICE_LABEL: Record<string, string> = {
  mobile: "Mobil",
  tablet: "Tablet",
  desktop: "Masaüstü",
  unknown: "Bilinmiyor",
};

function fmtDuration(s: number) {
  if (!s) return "—";
  if (s < 60) return `${s} sn`;
  return `${Math.floor(s / 60)} dk ${s % 60} sn`;
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card/60 p-5">
      <p className="font-mono text-xs tracking-widest text-muted-foreground/70 uppercase">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">
        {value}
      </p>
      {hint && (
        <p className="mt-1 font-mono text-xs text-muted-foreground/60">
          {hint}
        </p>
      )}
    </div>
  );
}

function Bars({
  title,
  rows,
  labels,
  note,
}: {
  title: string;
  rows: { key: string; count: number }[];
  labels?: Record<string, string>;
  note?: string;
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
              {/* Proportion of a real count. Not a time series, not a trend line
                  — we have neither, and drawing one would be a lie. */}
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
      {note && (
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground/60">
          {note}
        </p>
      )}
    </div>
  );
}

export default async function AdminAnalyticsPage() {
  const a = await getAnalytics();

  if (!a) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold tracking-tight">Analitik</h1>
        <div className="rounded-xl border border-border bg-card/60 p-6">
          <p className="text-sm text-muted-foreground">
            Analitik tabloları okunamıyor. Ya <code>DATABASE_URL</code> ayarlı
            değil ya da güncel şema uygulanmadı.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-lg border border-border bg-background/60 p-3 font-mono text-xs text-foreground/80">
            docker exec -i websitem-pg psql -U menensoft -d menensoft &lt;
            db/schema.sql
          </pre>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground/70">
            Ayrıca <code>ANALYTICS_SALT</code> gerekir — yoksa olay toplama
            kapalıdır. Ayrıntı: POSTGRES_SETUP.md
          </p>
        </div>
      </div>
    );
  }

  const { overview: o } = a;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Analitik</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Birinci taraf, çerezsiz. Ziyaretçi kimliği sunucuda türetilir ve her
          gün döner.
        </p>
      </div>

      {/* The honest caveats, on the page rather than in a doc nobody opens. */}
      <div className="flex gap-3 rounded-xl border border-border bg-card/40 p-4">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-accent" />
        <div className="space-y-1 text-xs leading-relaxed text-muted-foreground">
          <p>
            <strong className="font-medium text-foreground/90">
              Ham IP saklanmaz
            </strong>{" "}
            — sütun bile yoktur. Çerez, localStorage ve parmak izi kullanılmaz;
            bu yüzden çerez banner&apos;ı da yoktur.
          </p>
          <p>
            <strong className="font-medium text-foreground/90">
              Süreler yaklaşıktır
            </strong>{" "}
            — son sayfanın gerçek okunma süresi ölçülemez.
          </p>
          <p>
            Bu sayılar{" "}
            <strong className="font-medium text-foreground/90">
              DNT/Sec-GPC açık ziyaretçileri ve botları içermez
            </strong>{" "}
            — yani gerçek trafiğin bir alt kümesidir. Kimlik günler arasında
            taşınmaz: dünkü ziyaretçi bugün yeni sayılır.
          </p>
        </div>
      </div>

      {!a.hasAnyData ? (
        <p className="rounded-xl border border-dashed border-border bg-card/30 p-8 text-center text-sm text-muted-foreground">
          Henüz hiç olay kaydedilmedi. Şema uygulandıysa ve{" "}
          <code>ANALYTICS_SALT</code> ayarlıysa, siteyi bir tarayıcıda gezin —
          olaylar burada belirir.
        </p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat
              label="Ziyaretçi (bugün)"
              value={o.visitorsToday}
              hint={`son 7 gün: ${o.visitors7}`}
            />
            <Stat
              label="Oturum (bugün)"
              value={o.sessionsToday}
              hint={`son 7 gün: ${o.sessions7}`}
            />
            <Stat
              label="Sayfa görüntüleme"
              value={o.pageViewsToday}
              hint={`son 7 gün: ${o.pageViews7}`}
            />
            <Stat
              label="Ort. süre (yaklaşık)"
              value={fmtDuration(o.avgDurationToday)}
              hint="bugünkü oturumlar"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="CTA tıklaması (bugün)" value={o.ctaToday} />
            <Stat label="E-posta tıklaması" value={o.emailToday} />
            <Stat label="WhatsApp tıklaması" value={o.whatsappToday} />
            <Stat label="Form gönderimi" value={o.formToday} />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Bars
              title="Cihaz (30 gün)"
              rows={a.devices}
              labels={DEVICE_LABEL}
            />
            <Bars
              title="Ülke (30 gün)"
              rows={a.countries}
              note="Yalnızca hosting başlığından gelir; yerelde boştur."
            />
            <Bars
              title="Olay türü (30 gün)"
              rows={a.eventCounts}
              labels={EVENT_LABEL}
            />
          </div>

          <div className="rounded-xl border border-border bg-card/60 p-5">
            <h2 className="font-mono text-xs tracking-widest text-muted-foreground/70 uppercase">
              En çok görüntülenen sayfalar (30 gün)
            </h2>
            {a.topPages.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Henüz veri yok.
              </p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                {/* Cell padding, not just row padding: without it adjacent
                    columns touch and the header renders as "SÜREÇİHAZ". */}
                <table className="w-full text-sm [&_td]:pr-6 [&_td:last-child]:pr-0 [&_th]:pr-6 [&_th:last-child]:pr-0">
                  <thead>
                    <tr className="border-b border-border/60 text-left font-mono text-xs text-muted-foreground/60 uppercase">
                      <th className="pb-2 font-normal">Yol</th>
                      <th className="pb-2 text-right font-normal">
                        Görüntüleme
                      </th>
                      <th className="pb-2 text-right font-normal">Oturum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {a.topPages.map((p) => (
                      <tr
                        key={p.path}
                        className="border-b border-border/40 last:border-0"
                      >
                        <td className="py-2 font-mono text-xs text-foreground/85">
                          {p.path}
                        </td>
                        <td className="py-2 text-right font-mono text-xs tabular-nums">
                          {p.views}
                        </td>
                        <td className="py-2 text-right font-mono text-xs tabular-nums text-muted-foreground">
                          {p.sessions}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card/60 p-5">
            <h2 className="font-mono text-xs tracking-widest text-muted-foreground/70 uppercase">
              Son oturumlar
            </h2>
            <div className="mt-4 overflow-x-auto">
              {/* Same fix as the table above: without cell padding the columns
                  touch and the header renders as "SÜREÇİHAZ". */}
              <table className="w-full text-sm [&_td]:pr-6 [&_td:last-child]:pr-0 [&_th]:pr-6 [&_th:last-child]:pr-0">
                <thead>
                  <tr className="border-b border-border/60 text-left font-mono text-xs text-muted-foreground/60 uppercase">
                    <th className="pb-2 font-normal">Başlangıç</th>
                    <th className="pb-2 font-normal">Giriş → çıkış</th>
                    <th className="pb-2 text-right font-normal">Sayfa</th>
                    <th className="pb-2 text-right font-normal">Süre</th>
                    <th className="pb-2 font-normal">Cihaz</th>
                    <th className="pb-2 font-normal">Ülke</th>
                    <th className="pb-2 font-normal">Kaynak</th>
                    <th className="pb-2" />
                  </tr>
                </thead>
                <tbody>
                  {a.recentSessions.map((s) => (
                    <tr
                      key={s.id}
                      className="border-b border-border/40 last:border-0"
                    >
                      <td className="py-2 font-mono text-xs whitespace-nowrap text-muted-foreground">
                        {s.created_at.toLocaleString("tr-TR", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-2 font-mono text-xs text-foreground/85">
                        <span className="block max-w-[16rem] truncate">
                          {s.first_path ?? "—"}
                          {s.last_path && s.last_path !== s.first_path && (
                            <span className="text-muted-foreground">
                              {" → "}
                              {s.last_path}
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="py-2 text-right font-mono text-xs tabular-nums">
                        {s.pageview_count}
                      </td>
                      <td className="py-2 text-right font-mono text-xs whitespace-nowrap tabular-nums text-muted-foreground">
                        {fmtDuration(s.duration_seconds)}
                      </td>
                      <td className="py-2 font-mono text-xs text-muted-foreground">
                        {DEVICE_LABEL[s.device_type ?? "unknown"] ?? "—"}
                      </td>
                      <td className="py-2 font-mono text-xs text-muted-foreground">
                        {s.country ?? "—"}
                      </td>
                      <td className="py-2 font-mono text-xs text-muted-foreground">
                        {s.referrer_host ?? "doğrudan"}
                      </td>
                      <td className="py-2 text-right">
                        <Link
                          href={`/admin/sessions/${s.id}`}
                          className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
                        >
                          Aç
                          <ArrowUpRight className="size-3.5 text-accent" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card/60 p-5">
            <h2 className="font-mono text-xs tracking-widest text-muted-foreground/70 uppercase">
              Son olaylar
            </h2>
            <ul className="mt-4 space-y-1.5">
              {a.latestEvents.map((e) => (
                <li
                  key={e.id}
                  className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 font-mono text-xs"
                >
                  <span className="text-muted-foreground/60">
                    {e.created_at.toLocaleTimeString("tr-TR", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </span>
                  <span className="text-accent">
                    {EVENT_LABEL[e.event_type] ?? e.event_type}
                  </span>
                  <span className="text-foreground/80">{e.path ?? "—"}</span>
                  {e.metadata && Object.keys(e.metadata).length > 0 && (
                    <span className="text-muted-foreground/60">
                      {JSON.stringify(e.metadata)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
