"use client";

import {
  AppWindow,
  Building2,
  LayoutDashboard,
  Mail,
  MessageCircle,
  MoreHorizontal,
  ShoppingCart,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * Backend'siz teklif akışı: ziyaretçi sistem türünü seçer, e-posta veya
 * WhatsApp CTA'sı seçime göre önceden doldurulmuş açılır. Sahte form yok —
 * mesaj gerçek kanaldan, doğrudan kurucuya gider.
 */

interface SystemType {
  id: string;
  label: string;
  hint: string;
  icon: LucideIcon;
}

const SYSTEM_TYPES: SystemType[] = [
  {
    id: "e-ticaret",
    label: "E-ticaret",
    hint: "Vitrin + yönetim paneli + sipariş",
    icon: ShoppingCart,
  },
  {
    id: "admin-panel",
    label: "Admin panel",
    hint: "Veri, roller, iç ekranlar",
    icon: LayoutDashboard,
  },
  {
    id: "kurumsal-site",
    label: "Kurumsal site",
    hint: "Site + panelden içerik yönetimi",
    icon: Building2,
  },
  {
    id: "dashboard",
    label: "Dashboard",
    hint: "Canlı durum ve raporlama",
    icon: AppWindow,
  },
  {
    id: "otomasyon",
    label: "Otomasyon",
    hint: "Manuel iş akışının yazılıma taşınması",
    icon: Workflow,
  },
  {
    id: "diger",
    label: "Diğer",
    hint: "Aklınızdaki başka bir sistem",
    icon: MoreHorizontal,
  },
];

const MAIL_SUBJECT = "Menensoft proje görüşmesi";

function mailBody(systemLabel?: string) {
  return [
    `Sistem türü: ${systemLabel ?? "(henüz net değil)"}`,
    "",
    "İhtiyaç:",
    "",
    "Hedef:",
    "",
    "Mevcut sistem:",
    "",
    "Teslim beklentisi:",
    "",
  ].join("\n");
}

function whatsappText(systemLabel?: string) {
  return [
    "Merhaba, Menensoft proje görüşmesi talep ediyorum.",
    `Sistem türü: ${systemLabel ?? "(henüz net değil)"}`,
    "İhtiyaç: ",
  ].join("\n");
}

export function QuoteBuilder() {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedType = SYSTEM_TYPES.find((t) => t.id === selected);

  const mailHref = `mailto:${site.email}?subject=${encodeURIComponent(
    MAIL_SUBJECT,
  )}&body=${encodeURIComponent(mailBody(selectedType?.label))}`;
  const whatsappHref = site.whatsappUrl
    ? `${site.whatsappUrl}?text=${encodeURIComponent(
        whatsappText(selectedType?.label),
      )}`
    : undefined;

  return (
    <div>
      <h2 className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
        <span aria-hidden className="size-1.5 bg-accent/90" />
        Nasıl bir sisteme ihtiyacınız var?
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SYSTEM_TYPES.map((type) => {
          const Icon = type.icon;
          const isSel = selected === type.id;
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => setSelected(isSel ? null : type.id)}
              aria-pressed={isSel}
              className={cn(
                "group flex items-start gap-3 rounded-xl border p-4 text-left transition-all duration-300",
                isSel
                  ? "border-accent/50 bg-card/90 ring-1 ring-accent/25 shadow-[0_16px_40px_-24px_rgba(99,102,241,0.45)]"
                  : "border-border bg-card/60 ring-1 ring-white/5 hover:-translate-y-0.5 hover:border-foreground/20",
              )}
            >
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-lg border transition-colors",
                  isSel
                    ? "border-accent/40 bg-accent/10"
                    : "border-border bg-background/50",
                )}
              >
                <Icon
                  className={cn(
                    "size-4",
                    isSel ? "text-accent" : "text-muted-foreground",
                  )}
                />
              </span>
              <span className="min-w-0">
                <span className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold tracking-tight">
                    {type.label}
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "size-1.5 shrink-0 rounded-full transition-colors",
                      isSel ? "bg-accent" : "bg-muted-foreground/25",
                    )}
                  />
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                  {type.hint}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card/70 p-6 ring-1 ring-white/5">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {selectedType ? (
            <>
              Seçiminiz{" "}
              <span className="font-medium text-foreground">
                {selectedType.label}
              </span>{" "}
              olarak mesaja eklenecek. Konu satırı hazır:{" "}
              <span className="font-mono text-xs text-foreground/85">
                “{MAIL_SUBJECT}”
              </span>
            </>
          ) : (
            <>
              Sistem türünü seçmeseniz de olur — şablon ihtiyacınızı anlatmanız
              için hazır açılır.
            </>
          )}{" "}
          Şablonda dört kısa başlık var:{" "}
          <span className="text-foreground/85">
            ihtiyaç, hedef, mevcut sistem, teslim beklentisi
          </span>
          . Birkaç cümle yeterli; şartname gerekmez.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <a
            href={mailHref}
            className={cn(buttonVariants({ variant: "cta" }), "h-12 px-6")}
          >
            <Mail className="size-4" />
            E-posta ile teklif iste
          </a>
          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "outline" }), "h-12 px-6")}
            >
              <MessageCircle className="size-4" />
              WhatsApp ile yaz
            </a>
          )}
        </div>
        <p className="mt-4 font-mono text-xs text-muted-foreground/70">
          {site.email} — mesajınız doğrudan kurucuya ulaşır.
        </p>
      </div>
    </div>
  );
}
