import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getSession } from "@/lib/admin/analytics";

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

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-border/60 px-5 py-3 last:border-0 sm:flex-row sm:items-baseline sm:gap-4">
      <dt className="w-44 shrink-0 font-mono text-xs tracking-widest text-muted-foreground/70 uppercase">
        {label}
      </dt>
      <dd className="min-w-0 text-sm break-words text-foreground/90">
        {value || <span className="text-muted-foreground/50">—</span>}
      </dd>
    </div>
  );
}

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getSession(id);

  // undefined = no database, null = no such session. Collapsing them would say
  // "not found" during an outage and send you hunting for a row that is there.
  if (data === undefined) {
    return (
      <p className="rounded-xl border border-border bg-card/60 p-6 text-sm text-muted-foreground">
        Analitik tabloları okunamıyor.
      </p>
    );
  }
  if (!data) notFound();

  const { session: s, events } = data;

  return (
    <div className="space-y-6">
      <Link
        href="/admin/analytics"
        className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Analitiğe dön
      </Link>

      <div>
        <h1 className="text-xl font-semibold tracking-tight">Oturum</h1>
        <p className="mt-1 font-mono text-xs text-muted-foreground">
          {s.created_at.toLocaleString("tr-TR", {
            dateStyle: "full",
            timeStyle: "short",
          })}
        </p>
      </div>

      <section className="overflow-hidden rounded-xl border border-border bg-card/60">
        <dl>
          <Row label="Giriş sayfası" value={s.first_path} />
          <Row label="Çıkış sayfası" value={s.last_path} />
          <Row label="Sayfa görüntüleme" value={s.pageview_count} />
          <Row
            label="Süre (yaklaşık)"
            value={
              <>
                {fmtDuration(s.duration_seconds)}{" "}
                <span className="text-xs text-muted-foreground/60">
                  — son sayfada geçen gerçek süre ölçülemez
                </span>
              </>
            }
          />
          <Row label="Dil" value={s.locale?.toUpperCase()} />
          <Row label="Cihaz" value={DEVICE_LABEL[s.device_type ?? "unknown"]} />
          <Row label="Ülke" value={s.country} />
          <Row
            label="Kaynak"
            value={
              s.referrer_host ? (
                s.referrer_host
              ) : (
                <span className="text-muted-foreground/70">
                  doğrudan (referrer yok)
                </span>
              )
            }
          />
        </dl>
      </section>

      {/* No lead is linked here, and none is invented. Leads carry no session_id
          yet — connecting them would need the session id on the client, which
          would mean giving the browser an identifier, which is the one thing this
          design refuses to do. Left honestly absent. */}
      <section className="rounded-xl border border-dashed border-border bg-card/30 p-5">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Bu oturuma bağlı bir talep gösterilmiyor: lead kayıtları oturum
          kimliği taşımıyor. Bağlamak için tarayıcıya bir kimlik vermek
          gerekirdi — bu tasarımın tam olarak reddettiği şey. Uydurulmuş bir
          eşleşme göstermektense boş bırakıldı.
        </p>
      </section>

      <section className="rounded-xl border border-border bg-card/60 p-5">
        <h2 className="font-mono text-xs tracking-widest text-muted-foreground/70 uppercase">
          Yol ({events.length} olay)
        </h2>
        <ol className="mt-4 space-y-0">
          {events.map((e, i) => (
            <li
              key={e.id}
              className="flex gap-4 border-l border-border pl-4 pb-4 last:pb-0"
            >
              <span className="-ml-[21px] mt-1 size-2 shrink-0 rounded-full bg-accent/70 ring-4 ring-background" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                  <span className="font-mono text-xs text-muted-foreground/60">
                    {e.created_at.toLocaleTimeString("tr-TR", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </span>
                  <span className="font-mono text-xs text-accent">
                    {EVENT_LABEL[e.event_type] ?? e.event_type}
                  </span>
                  {i > 0 && (
                    <span className="font-mono text-xs text-muted-foreground/50">
                      +
                      {Math.round(
                        (e.created_at.getTime() -
                          events[i - 1].created_at.getTime()) /
                          1000,
                      )}
                      sn
                    </span>
                  )}
                </div>
                <p className="mt-0.5 font-mono text-xs break-all text-foreground/85">
                  {e.path ?? "—"}
                </p>
                {e.metadata && Object.keys(e.metadata).length > 0 && (
                  <p className="mt-0.5 font-mono text-xs text-muted-foreground/60">
                    {JSON.stringify(e.metadata)}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
