import { ArrowLeft, Mail, MessageCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { updateLeadStatusAction } from "@/app/admin/actions";
import { CopyMessage } from "@/components/admin/copy-message";
import { StatusBadge } from "@/components/admin/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { LEAD_STATUSES, getLead } from "@/lib/admin/leads";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUS_ACTION: Record<string, string> = {
  new: "Yeni olarak işaretle",
  read: "Okundu",
  contacted: "İletişim kuruldu",
  archived: "Arşivle",
};

/** Only digits survive; a phone that isn't dialable isn't linked. */
function waHref(phone: string | null): string | null {
  if (!phone) return null;
  const digits = phone.replace(/[^\d]/g, "");
  if (digits.length < 10) return null;
  return `https://wa.me/${digits}`;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-border/60 px-5 py-3 last:border-0 sm:flex-row sm:items-baseline sm:gap-4">
      <dt className="w-48 shrink-0 font-mono text-xs tracking-widest text-muted-foreground/70 uppercase">
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
  const lead = await getLead(id);

  // undefined = no database (an outage), null = no such lead (a bad link).
  // Collapsing them would show "not found" during an outage, which sends you
  // hunting for a deleted row that is actually still there.
  if (lead === undefined) {
    return (
      <p className="rounded-xl border border-border bg-card/60 p-6 text-sm text-muted-foreground">
        Veritabanı bağlantısı yok.
      </p>
    );
  }
  if (!lead) notFound();

  const wa = waHref(lead.phone);

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
        <StatusBadge status={lead.status} />
      </div>

      {/* Reply, without leaving the panel. */}
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
      </div>

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
          <Row label="Oturum" value={lead.session_id} />
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

      {/* The action re-checks the session server-side; this form is only the
          trigger, never the guard. */}
      <section className="rounded-xl border border-border bg-card/60 p-5">
        <h2 className="font-mono text-xs tracking-widest text-muted-foreground/70 uppercase">
          Durum
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {LEAD_STATUSES.map((s) => (
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
                  "h-9 px-4 text-xs disabled:opacity-100",
                )}
              >
                {STATUS_ACTION[s]}
              </button>
            </form>
          ))}
        </div>
      </section>
    </div>
  );
}
