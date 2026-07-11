"use client";

import {
  AppWindow,
  ArrowUpRight,
  Building2,
  Check,
  CircuitBoard,
  Copy,
  HelpCircle,
  LayoutDashboard,
  Mail,
  MessageCircle,
  ShoppingCart,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import {
  fitNeeds,
  fitSituations,
  fitSystems,
  resolveRecommendation,
} from "@/content/fit";
import { getProject } from "@/content/projects";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * Proje-uyum sihirbazı: iki kısa seçim + dürüst bir öneri. Backend yok,
 * sahte form yok — sonuç her zaman gerçek kanala (e-posta / WhatsApp)
 * önceden doldurulmuş mesaj olarak gider ve mesaj gönderilmeden önce
 * aynen görünür. İçerik src/content/fit.ts'te yaşar.
 */

const ICONS: Record<string, LucideIcon> = {
  "e-ticaret": ShoppingCart,
  "yonetim-paneli": LayoutDashboard,
  "kurumsal-site": Building2,
  dashboard: AppWindow,
  otomasyon: Workflow,
  operasyon: CircuitBoard,
  "emin-degilim": HelpCircle,
};

const MAIL_SUBJECT = "Menensoft proje görüşmesi";

const HONEST_LINES = [
  "İlk mesaj için birkaç cümle yeterli — şartname gerekmez.",
  "Kapsam netleşmeden fiyat veya süre söylenmez.",
  "Amaç gereksiz modül eklemek değil; çalışan yapıyı kurmak.",
];

function mailBody(
  systemLabel: string,
  situationLabel: string,
  needLabels: string[],
) {
  return [
    `Sistem türü: ${systemLabel}`,
    `Mevcut durum: ${situationLabel}`,
    ...(needLabels.length ? [`Ek ihtiyaçlar: ${needLabels.join(", ")}`] : []),
    "",
    "Hedef:",
    "",
    "Varsa mevcut site/sistem:",
    "",
    "Teslim beklentisi:",
    "",
    "Ek not:",
    "",
  ].join("\n");
}

function whatsappText(
  systemLabel: string,
  situationLabel: string,
  needLabels: string[],
) {
  return [
    "Merhaba, Menensoft proje görüşmesi talep ediyorum.",
    `Sistem türü: ${systemLabel}`,
    `Mevcut durum: ${situationLabel}`,
    ...(needLabels.length ? [`Ek ihtiyaçlar: ${needLabels.join(", ")}`] : []),
    "Hedef: ",
  ].join("\n");
}

function StepChip({
  num,
  label,
  state,
}: {
  num: string;
  label: string;
  state: "done" | "active" | "waiting";
}) {
  return (
    <span
      className={cn(
        "flex items-center gap-2 font-mono text-xs tracking-widest uppercase",
        state === "waiting" ? "text-muted-foreground/50" : "text-muted-foreground",
      )}
    >
      <span
        className={cn(
          "flex size-6 items-center justify-center rounded-md border",
          state === "done" && "border-accent/50 bg-accent/10 text-accent",
          state === "active" &&
            "border-accent/30 bg-accent/5 text-accent shadow-[0_0_10px_-2px_rgba(139,140,248,0.5)]",
          state === "waiting" && "border-border bg-card text-muted-foreground/50",
        )}
      >
        {num}
      </span>
      {label}
    </span>
  );
}

export function QuoteBuilder() {
  const [systemId, setSystemId] = useState<string | null>(null);
  const [situationId, setSituationId] = useState<string | null>(null);
  const [needIds, setNeedIds] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  // ?tur=&durum= önseçimi — proje sayfalarındaki "benzer sistem" bağlantıları
  // buraya bağlanır. URL bilinçli olarak mount'ta bir kez okunur:
  // useSearchParams + Suspense kullanmak statik HTML'i fallback'e düşürür ve
  // JS'siz ziyaretçi sihirbazın 1. adımını hiç göremezdi. Tek seferlik
  // harici-sistem okuması olduğu için kural burada kapatılıyor.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tur = params.get("tur");
    const durum = params.get("durum");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- tek seferlik URL okuması, kaskad render yok
    if (tur && fitSystems.some((s) => s.id === tur)) setSystemId(tur);
    if (durum && fitSituations.some((s) => s.id === durum))
      setSituationId(durum);
  }, []);

  const system = fitSystems.find((s) => s.id === systemId);
  const situation = fitSituations.find((s) => s.id === situationId);
  const done = Boolean(system && situation);
  const rec = done ? resolveRecommendation(system!.id, situation!.id) : null;
  const proofProject = rec?.projectSlug ? getProject(rec.projectSlug) : null;

  const needLabels = fitNeeds
    .filter((n) => needIds.includes(n.id))
    .map((n) => n.label);
  const systemLabel = system?.label ?? "(henüz seçilmedi)";
  const situationLabel = situation?.label ?? "(henüz seçilmedi)";
  const body = mailBody(systemLabel, situationLabel, needLabels);
  const mailHref = `mailto:${site.email}?subject=${encodeURIComponent(
    MAIL_SUBJECT,
  )}&body=${encodeURIComponent(body)}`;
  const whatsappHref = site.whatsappUrl
    ? `${site.whatsappUrl}?text=${encodeURIComponent(
        whatsappText(systemLabel, situationLabel, needLabels),
      )}`
    : undefined;

  const toggleNeed = (id: string) =>
    setNeedIds((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id],
    );

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // pano erişimi yoksa sessiz kal — mesaj zaten görünür durumda
    }
  };

  const optionFocus =
    "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

  return (
    <div>
      {/* adım göstergesi */}
      <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
        <StepChip num="01" label="Sistem türü" state={system ? "done" : "active"} />
        <StepChip
          num="02"
          label="Mevcut durum"
          state={situation ? "done" : system ? "active" : "waiting"}
        />
        <StepChip num="03" label="Öneri & mesaj" state={done ? "active" : "waiting"} />
      </div>

      {/* 01 — sistem türü */}
      <section className="mt-8">
        <h2 className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
          <span aria-hidden className="size-1.5 bg-accent/90" />
          01 — Ne yaptırmak istiyorsunuz?
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {fitSystems.map((option) => {
            const Icon = ICONS[option.id] ?? HelpCircle;
            const isSel = systemId === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setSystemId(isSel ? null : option.id)}
                aria-pressed={isSel}
                className={cn(
                  "group flex items-start gap-3 rounded-xl border p-4 text-left transition-all duration-300",
                  optionFocus,
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
                      {option.label}
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
                    {option.hint}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 02 — mevcut durum */}
      {system && (
        <section className="mt-10">
          <h2 className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
            <span aria-hidden className="size-1.5 bg-accent/90" />
            02 — Şu an durumunuz hangisine daha yakın?
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {fitSituations.map((option) => {
              const isSel = situationId === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSituationId(isSel ? null : option.id)}
                  aria-pressed={isSel}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition-all duration-300",
                    optionFocus,
                    isSel
                      ? "border-accent/50 bg-card/90 ring-1 ring-accent/25 text-foreground"
                      : "border-border bg-card/60 ring-1 ring-white/5 text-foreground/85 hover:border-foreground/20",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "size-1.5 shrink-0 rounded-full transition-colors",
                      isSel ? "bg-accent" : "bg-muted-foreground/25",
                    )}
                  />
                  {option.label}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* isteğe bağlı ek ihtiyaçlar — mesajı zenginleştirir */}
      {system && situation && (
        <section className="mt-10">
          <h2 className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
            <span
              aria-hidden
              className="size-1.5 rotate-45 border border-muted-foreground/50"
            />
            İsteğe bağlı — ek ihtiyaçlar
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {fitNeeds.map((need) => {
              const isSel = needIds.includes(need.id);
              return (
                <button
                  key={need.id}
                  type="button"
                  onClick={() => toggleNeed(need.id)}
                  aria-pressed={isSel}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all duration-200",
                    optionFocus,
                    isSel
                      ? "border-accent/50 bg-accent/10 text-foreground"
                      : "border-border bg-card/60 text-foreground/80 hover:border-foreground/20",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "flex size-3.5 items-center justify-center rounded-sm border transition-colors",
                      isSel
                        ? "border-accent bg-accent/80 text-background"
                        : "border-muted-foreground/40",
                    )}
                  >
                    {isSel && <Check className="size-2.5" />}
                  </span>
                  {need.label}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* 03 — öneri ve mesaj */}
      <div aria-live="polite">
        {done && rec && (
          <section className="mt-10 overflow-hidden rounded-xl border border-accent/25 bg-card/80 ring-1 ring-accent/10">
            <div className="border-b border-border/60 bg-accent/5 px-6 py-4">
              <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                <span aria-hidden className="size-1.5 bg-accent/90" />
                03 — Sana en yakın başlangıç noktası
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-balance md:text-2xl">
                {rec.label}
              </h2>
            </div>
            <div className="p-6">
              <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                {rec.text}
              </p>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                {rec.systemSlug ? (
                  <Link
                    href={`/sistemler/${rec.systemSlug}`}
                    className="group inline-flex items-center gap-1.5 text-foreground/85 transition-colors hover:text-foreground"
                  >
                    Sistem detayını incele
                    <ArrowUpRight className="size-3.5 text-accent transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                ) : (
                  <Link
                    href="/cozumler"
                    className="group inline-flex items-center gap-1.5 text-foreground/85 transition-colors hover:text-foreground"
                  >
                    Çözüm haritasına bak
                    <ArrowUpRight className="size-3.5 text-accent transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                )}
                {rec.sectorSlug && (
                  <Link
                    href={`/sektorler/${rec.sectorSlug}`}
                    className="group inline-flex items-center gap-1.5 text-foreground/85 transition-colors hover:text-foreground"
                  >
                    Sektör örneğini gör
                    <ArrowUpRight className="size-3.5 text-accent transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                )}
                {proofProject && (
                  <Link
                    href={`/projeler/${proofProject.slug}`}
                    className="group inline-flex items-center gap-1.5 text-foreground/85 transition-colors hover:text-foreground"
                  >
                    Kanıt: {proofProject.name}
                    <ArrowUpRight className="size-3.5 text-accent transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                )}
                <Link
                  href="/surec"
                  className="group inline-flex items-center gap-1.5 text-foreground/85 transition-colors hover:text-foreground"
                >
                  Süreci gör
                  <ArrowUpRight className="size-3.5 text-accent transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </div>

              {/* gönderilecek mesaj — olduğu gibi görünür, sahte form yok */}
              <div className="mt-6 rounded-lg border border-border bg-background/50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-mono text-xs tracking-widest text-muted-foreground/70 uppercase">
                    Mesajınız böyle açılacak — düzenleyebilirsiniz
                  </p>
                  <button
                    type="button"
                    onClick={copyMessage}
                    className={cn(
                      "flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-xs transition-colors",
                      optionFocus,
                      copied
                        ? "border-accent/50 bg-accent/10 text-accent"
                        : "border-border text-muted-foreground hover:border-foreground/25 hover:text-foreground",
                    )}
                  >
                    {copied ? (
                      <Check className="size-3" />
                    ) : (
                      <Copy className="size-3" />
                    )}
                    {copied ? "Kopyalandı" : "Mesajı kopyala"}
                  </button>
                </div>
                <pre className="mt-3 font-mono text-xs leading-relaxed whitespace-pre-wrap text-foreground/80">
                  {body}
                </pre>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground/85">
                  Sonraki adım:
                </span>{" "}
                mesajınıza kapsamı netleştiren birkaç somut soruyla dönüş
                yapılır — gerekiyorsa kısa bir görüşme.
              </p>

              <ul className="mt-5 space-y-1.5">
                {HONEST_LINES.map((line) => (
                  <li
                    key={line}
                    className="flex gap-2.5 text-xs leading-relaxed text-muted-foreground"
                  >
                    <span
                      aria-hidden
                      className="mt-1.5 size-1 shrink-0 rounded-full bg-accent/60"
                    />
                    {line}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href={mailHref}
                  className={cn(buttonVariants({ variant: "cta" }), "h-12 px-6")}
                >
                  <Mail className="size-4" />
                  E-posta ile gönder
                </a>
                {whatsappHref && (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "h-12 px-6",
                    )}
                  >
                    <MessageCircle className="size-4" />
                    WhatsApp&apos;tan yaz
                  </a>
                )}
              </div>
              <p className="mt-4 font-mono text-xs text-muted-foreground/70">
                {site.email} — mesajınız doğrudan kurucuya ulaşır.
              </p>
            </div>
          </section>
        )}
      </div>

      {/* düşük sürtünmeli kaçış: sihirbazsız yazmak isteyenler için */}
      <p className="mt-6 text-sm text-muted-foreground">
        Seçim yapmadan yazmak isterseniz:{" "}
        <a
          href={`mailto:${site.email}?subject=${encodeURIComponent(MAIL_SUBJECT)}`}
          className="text-foreground/85 underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          doğrudan e-posta gönderin
        </a>
        .
      </p>
    </div>
  );
}
