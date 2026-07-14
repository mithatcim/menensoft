import {
  ArrowLeft,
  ArrowUpRight,
  CalendarClock,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  addNoteAction,
  markContactedAction,
  setFollowUpAction,
  setPriorityAction,
  updateLeadStatusAction,
} from "@/app/admin/actions";
import { CopyMessage } from "@/components/admin/copy-message";
import { StatusBadge } from "@/components/admin/status-badge";
import { inputClass } from "@/components/leads/field";
import { buttonVariants } from "@/components/ui/button";
import {
  NOTE_TYPE_LABEL,
  PIPELINE,
  PRIORITIES,
  PRIORITY_LABEL,
  STATUS_LABEL,
  getLead,
  markRead,
  type NoteType,
} from "@/lib/admin/leads";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const fmt = (d: Date | null) =>
  d
    ? d.toLocaleString("tr-TR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

const fmtDay = (d: Date | null) =>
  d ? d.toLocaleDateString("tr-TR", { day: "2-digit", month: "long" }) : null;

const inputDate = (d: Date | null) =>
  d ? d.toISOString().slice(0, 10) : "";

/** Only digits survive; a phone that isn't dialable isn't linked. */
function waHref(phone: string | null): string | null {
  if (!phone) return null;
  const digits = phone.replace(/[^\d]/g, "");
  return digits.length >= 10 ? `https://wa.me/${digits}` : null;
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

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getLead(id);

  // undefined = no database (an outage), null = no such lead (a bad link).
  // Collapsing them would show "not found" during an outage and send you hunting
  // for a row that is actually still there.
  if (data === undefined) {
    return (
      <p className="rounded-xl border border-border bg-card/60 p-6 text-sm text-muted-foreground">
        Veritabanı bağlantısı yok.
      </p>
    );
  }
  if (!data) notFound();

  const { lead, notes } = data;

  // Opening a lead IS reading it. A separate "mark as read" button is a button
  // nobody presses, and then read_at is a column that lies.
  await markRead(lead.id);

  const wa = waHref(lead.phone);
  const overdue =
    lead.follow_up_at &&
    lead.follow_up_at < new Date() &&
    !["won", "lost", "archived"].includes(lead.status);

  return (
    <div className="space-y-6">
      <Link
        href="/admin/leads"
        className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Taleplere dön
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight">{lead.name}</h1>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            {lead.created_at.toLocaleString("tr-TR", {
              dateStyle: "full",
              timeStyle: "short",
            })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {lead.priority && (
            <span className="rounded-md border border-border px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
              {PRIORITY_LABEL[lead.priority]}
            </span>
          )}
          <StatusBadge status={lead.status} />
        </div>
      </div>

      {/* ---- reply, and log it in one click --------------------------------
          Two buttons, not three steps. A "call them, then come back and tick a
          box, then write a note" ritual is a ritual that gets skipped, and then
          last_contacted_at is a column that lies. */}
      <div className="flex flex-wrap gap-2.5">
        {lead.email && (
          <a
            href={`mailto:${lead.email}?subject=${encodeURIComponent("Menensoft — mesajınız hakkında")}`}
            className={cn(buttonVariants({ variant: "cta" }), "h-10 px-5")}
          >
            <Mail className="size-4" />
            E-posta ile yanıtla
          </a>
        )}
        {wa && (
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: "outline" }), "h-10 px-5")}
          >
            <MessageCircle className="size-4" />
            WhatsApp
          </a>
        )}
        {(
          [
            ["call", Phone],
            ["whatsapp", MessageCircle],
            ["email", Mail],
          ] as const
        ).map(([channel, Icon]) => (
          <form key={channel} action={markContactedAction}>
            <input type="hidden" name="id" value={lead.id} />
            <input type="hidden" name="channel" value={channel} />
            <button
              type="submit"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-10 px-3 text-xs",
              )}
              title={`${NOTE_TYPE_LABEL[channel as NoteType]} ile iletişime geçildi olarak işaretle`}
            >
              <Icon className="size-3.5" />
              {NOTE_TYPE_LABEL[channel as NoteType]} yapıldı
            </button>
          </form>
        ))}
      </div>

      {/* ---- pipeline ------------------------------------------------------ */}
      <section className="rounded-xl border border-border bg-card/60 p-5">
        <h2 className="font-mono text-xs tracking-widest text-muted-foreground/70 uppercase">
          Satış hattı
        </h2>
        {/* Stages are SKIPPABLE on purpose. Forcing a lead through qualified and
            proposal_sent is how those stages stop being updated — and a stage
            nobody updates does not go blank, it goes WRONG. */}
        <div className="mt-3 flex flex-wrap gap-2">
          {PIPELINE.map((s) => (
            <form key={s} action={updateLeadStatusAction}>
              <input type="hidden" name="id" value={lead.id} />
              <input type="hidden" name="status" value={s} />
              <button
                type="submit"
                disabled={lead.status === s}
                className={cn(
                  buttonVariants({
                    variant: lead.status === s ? "cta" : "outline",
                  }),
                  "h-9 px-3 text-xs disabled:opacity-100",
                )}
              >
                {STATUS_LABEL[s]}
              </button>
            </form>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border/60 pt-4">
          <form action={updateLeadStatusAction}>
            <input type="hidden" name="id" value={lead.id} />
            <input type="hidden" name="status" value="archived" />
            <button
              type="submit"
              disabled={lead.status === "archived"}
              className="rounded-md border border-dashed border-border px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
            >
              Arşivle
            </button>
          </form>
          <span className="font-mono text-xs text-muted-foreground/50">
            arşiv bir satış aşaması değil — depolamadır
          </span>

          <form
            action={setPriorityAction}
            className="ml-auto flex items-center gap-2"
          >
            <input type="hidden" name="id" value={lead.id} />
            <label
              htmlFor="priority"
              className="font-mono text-xs tracking-widest text-muted-foreground/70 uppercase"
            >
              Öncelik
            </label>
            <select
              id="priority"
              name="priority"
              defaultValue={lead.priority ?? ""}
              className={cn(inputClass, "h-9 min-h-0 w-32 py-1")}
            >
              <option value="">—</option>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {PRIORITY_LABEL[p]}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className={cn(buttonVariants({ variant: "outline" }), "h-9 px-3 text-xs")}
            >
              Kaydet
            </button>
          </form>
        </div>
      </section>

      {/* ---- follow-up ----------------------------------------------------- */}
      <section
        className={cn(
          "rounded-xl border bg-card/60 p-5",
          overdue ? "border-accent/50 bg-accent/5" : "border-border",
        )}
      >
        <h2 className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground/70 uppercase">
          <CalendarClock className="size-3.5" />
          Hatırlatma
        </h2>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <form action={setFollowUpAction} className="flex flex-wrap items-end gap-3">
            <input type="hidden" name="id" value={lead.id} />
            <div>
              <label
                htmlFor="follow_up_at"
                className="block font-mono text-xs text-muted-foreground/60"
              >
                Tekrar bak
              </label>
              <input
                id="follow_up_at"
                name="follow_up_at"
                type="date"
                defaultValue={inputDate(lead.follow_up_at)}
                className={cn(inputClass, "mt-1 h-10 min-h-0 w-44")}
              />
            </div>
            <button
              type="submit"
              className={cn(buttonVariants({ variant: "cta" }), "h-10 px-4 text-xs")}
            >
              Kaydet
            </button>
          </form>

          {lead.follow_up_at && (
            <form action={setFollowUpAction}>
              <input type="hidden" name="id" value={lead.id} />
              <input type="hidden" name="follow_up_at" value="" />
              <button
                type="submit"
                className="h-10 rounded-md border border-border px-3 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Kaldır
              </button>
            </form>
          )}

          <p
            className={cn(
              "font-mono text-xs",
              overdue ? "text-accent" : "text-muted-foreground/60",
            )}
          >
            {lead.follow_up_at
              ? overdue
                ? `Gecikmiş — ${fmtDay(lead.follow_up_at)}`
                : `Planlı: ${fmtDay(lead.follow_up_at)}`
              : "Hatırlatma yok"}
          </p>
        </div>
      </section>

      {/* ---- message ------------------------------------------------------- */}
      <section className="rounded-xl border border-border bg-card/60">
        <div className="flex items-center justify-between gap-3 border-b border-border/60 px-5 py-3">
          <h2 className="font-mono text-xs tracking-widest text-muted-foreground/70 uppercase">
            Mesaj
          </h2>
          <CopyMessage text={lead.message} />
        </div>
        <pre className="px-5 py-4 font-mono text-xs leading-relaxed whitespace-pre-wrap text-foreground/90">
          {lead.message}
        </pre>
      </section>

      {/* ---- timeline ------------------------------------------------------ */}
      <section className="rounded-xl border border-border bg-card/60 p-5">
        <h2 className="font-mono text-xs tracking-widest text-muted-foreground/70 uppercase">
          Zaman çizelgesi
        </h2>

        <form action={addNoteAction} className="mt-4">
          <input type="hidden" name="id" value={lead.id} />
          <label htmlFor="note" className="sr-only">
            Not
          </label>
          <textarea
            id="note"
            name="note"
            rows={3}
            maxLength={2000}
            required
            placeholder="Telefonla görüşüldü, restoran QR menü istiyor. Salı tekrar aranacak."
            className={cn(inputClass, "min-h-20 resize-y leading-relaxed")}
          />
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <label htmlFor="note_type" className="sr-only">
              Not türü
            </label>
            <select
              id="note_type"
              name="note_type"
              defaultValue="note"
              className={cn(inputClass, "h-9 min-h-0 w-36 py-1")}
            >
              {(["note", "call", "whatsapp", "email"] as const).map((t) => (
                <option key={t} value={t}>
                  {NOTE_TYPE_LABEL[t]}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className={cn(buttonVariants({ variant: "cta" }), "h-9 px-4 text-xs")}
            >
              Not ekle
            </button>
          </div>
        </form>

        {notes.length === 0 ? (
          <p className="mt-5 text-sm text-muted-foreground">
            Henüz not yok. Görüşmeden sonra buraya yazın — aklınızda tutmayın.
          </p>
        ) : (
          <ol className="mt-6 space-y-0">
            {notes.map((n) => (
              <li
                key={n.id}
                className="flex gap-4 border-l border-border pl-4 pb-4 last:pb-0"
              >
                <span
                  className={cn(
                    "-ml-[21px] mt-1.5 size-2 shrink-0 rounded-full ring-4 ring-background",
                    n.note_type === "status_change"
                      ? "bg-accent/80"
                      : n.note_type === "follow_up"
                        ? "bg-amber-500/70"
                        : n.note_type === "system"
                          ? "bg-muted-foreground/40"
                          : "bg-emerald-500/60",
                  )}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
                    <span className="font-mono text-xs text-muted-foreground/60">
                      {fmt(n.created_at)}
                    </span>
                    <span className="font-mono text-xs text-accent">
                      {NOTE_TYPE_LABEL[n.note_type] ?? n.note_type}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm leading-relaxed break-words whitespace-pre-wrap text-foreground/90">
                    {n.note}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* ---- details ------------------------------------------------------- */}
      <section className="overflow-hidden rounded-xl border border-border bg-card/60">
        <dl>
          <Row label="E-posta" value={lead.email} />
          <Row label="Telefon" value={lead.phone} />
          <Row label="Tercih ettiği kanal" value={lead.contact_preference} />
          <Row label="Dil" value={lead.language.toUpperCase()} />
          <Row label="Geldiği sayfa" value={lead.source_path} />
          <Row label="Seçilen sistem" value={lead.selected_fit_id} />
          <Row label="Mevcut durum" value={lead.selected_situation} />
          <Row label="Referans proje" value={lead.reference_project_slug} />
          <Row label="Cihaz" value={lead.device_type} />
          <Row label="Ülke" value={lead.country} />
          <Row label="İlk okunma" value={fmt(lead.read_at)} />
          <Row label="Son iletişim" value={fmt(lead.last_contacted_at)} />
          {lead.won_at && <Row label="Kazanıldı" value={fmt(lead.won_at)} />}
          {lead.lost_at && <Row label="Kaybedildi" value={fmt(lead.lost_at)} />}
          <Row
            label="User agent"
            value={
              lead.user_agent && (
                <span className="font-mono text-xs text-muted-foreground">
                  {lead.user_agent}
                </span>
              )
            }
          />
        </dl>
      </section>

      {/* ---- linked session (Phase 36A) ------------------------------------
          Either it matched or it didn't, and we say which. No guessing, no
          "probably this session" — a fabricated match is worse than no match. */}
      <section
        className={cn(
          "rounded-xl border p-5",
          lead.session_id
            ? "border-border bg-card/60"
            : "border-dashed border-border bg-card/30",
        )}
      >
        <h2 className="font-mono text-xs tracking-widest text-muted-foreground/70 uppercase">
          Site oturumu
        </h2>
        {lead.session_id ? (
          <>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Bu lead, aynı günkü anonim site oturumuyla eşleşti. Formu
              göndermeden önce hangi sayfaları gezdiğini görebilirsiniz.
            </p>
            <Link
              href={`/admin/sessions/${lead.session_id}`}
              className="group mt-3 inline-flex items-center gap-1.5 font-mono text-xs text-foreground/85 transition-colors hover:text-foreground"
            >
              Oturum yolunu aç
              <ArrowUpRight className="size-3.5 text-accent transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </>
        ) : (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Bu lead için eşleşen oturum bulunamadı. (Analitik kapalıysa, ziyaretçi
            DNT/GPC kullanıyorsa ya da oturum penceresi kapandıysa normaldir.)
          </p>
        )}
      </section>
    </div>
  );
}
