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
  fitNeedsEn,
  fitSituationsEn,
  fitSystemsEn,
  resolveRecommendationEn,
} from "@/content/en/fit";
import { getProjectEn } from "@/content/en/projects";
import {
  fitNeeds,
  fitSituations,
  fitSystems,
  resolveRecommendation,
} from "@/content/fit";
import { getProject } from "@/content/projects";
import { site } from "@/content/site";
import { type Locale } from "@/lib/locale";
import { cn } from "@/lib/utils";

/**
 * Proje-uyum sihirbazı: iki kısa seçim + dürüst bir öneri. Backend yok,
 * sahte form yok — sonuç her zaman gerçek kanala (e-posta / WhatsApp)
 * önceden doldurulmuş mesaj olarak gider ve gönderilmeden önce aynen
 * görünür. İçerik src/content/fit.ts (TR) ve src/content/en/fit.ts (EN);
 * mesaj dili her zaman bulunulan rotanın diline uyar.
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

const WIZARD_COPY = {
  tr: {
    systems: fitSystems,
    situations: fitSituations,
    needs: fitNeeds,
    resolve: resolveRecommendation,
    lookupProject: getProject,
    subject: "Menensoft proje görüşmesi",
    bodyLabels: {
      system: "Sistem türü",
      situation: "Mevcut durum",
      needs: "Ek ihtiyaçlar",
      goal: "Hedef",
      existing: "Varsa mevcut site/sistem",
      delivery: "Teslim beklentisi",
      notes: "Ek not",
    },
    unset: "(henüz seçilmedi)",
    waIntro: "Merhaba, Menensoft proje görüşmesi talep ediyorum.",
    waGoal: "Hedef",
    stepLabels: ["Sistem türü", "Mevcut durum", "Öneri & mesaj"],
    q1: "01 — Ne yaptırmak istiyorsunuz?",
    q2: "02 — Şu an durumunuz hangisine daha yakın?",
    needsTitle: "İsteğe bağlı — ek ihtiyaçlar",
    resultEyebrow: "03 — Sana en yakın başlangıç noktası",
    linkSystem: "Sistem detayını incele",
    linkSolutions: "Çözüm haritasına bak",
    linkSector: "Sektör örneğini gör",
    linkProof: "Kanıt",
    linkProcess: "Süreci gör",
    previewTitle: "Mesajınız böyle açılacak — düzenleyebilirsiniz",
    copyIdle: "Mesajı kopyala",
    copyDone: "Kopyalandı",
    nextStepLabel: "Sonraki adım:",
    nextStepText:
      "mesajınıza kapsamı netleştiren birkaç somut soruyla dönüş yapılır — gerekiyorsa kısa bir görüşme.",
    honest: [
      "İlk mesaj için birkaç cümle yeterli — şartname gerekmez.",
      "Kapsam netleşmeden fiyat veya süre söylenmez.",
      "Amaç gereksiz modül eklemek değil; çalışan yapıyı kurmak.",
    ],
    ctaMail: "E-posta ile gönder",
    ctaWa: "WhatsApp'tan yaz",
    footnote: "mesajınız doğrudan kurucuya ulaşır.",
    escapePre: "Seçim yapmadan yazmak isterseniz:",
    escapeLink: "doğrudan e-posta gönderin",
    systemBase: "/sistemler",
    sectorBase: "/sektorler",
    projectBase: "/projeler",
    solutionsHref: "/cozumler",
    processHref: "/surec",
  },
  en: {
    systems: fitSystemsEn,
    situations: fitSituationsEn,
    needs: fitNeedsEn,
    resolve: resolveRecommendationEn,
    lookupProject: getProjectEn,
    subject: "Menensoft project inquiry",
    bodyLabels: {
      system: "System type",
      situation: "Current situation",
      needs: "Additional needs",
      goal: "Goal",
      existing: "Existing site/system",
      delivery: "Delivery expectation",
      notes: "Extra notes",
    },
    unset: "(not selected yet)",
    waIntro: "Hello, I'd like to request a Menensoft project review.",
    waGoal: "Goal",
    stepLabels: ["System type", "Current situation", "Recommendation & message"],
    q1: "01 — What do you want to build?",
    q2: "02 — Which is closest to your current situation?",
    needsTitle: "Optional — additional needs",
    resultEyebrow: "03 — Your closest starting point",
    linkSystem: "See the system in depth",
    linkSolutions: "Look at the solution map",
    linkSector: "See the sector example",
    linkProof: "Proof",
    linkProcess: "See the process",
    previewTitle: "Your message will open like this — you can edit it",
    copyIdle: "Copy message",
    copyDone: "Copied",
    nextStepLabel: "Next step:",
    nextStepText:
      "you'll get a reply with a few concrete questions that clarify the scope — and a short call if needed.",
    honest: [
      "A few sentences are enough for the first message — no spec required.",
      "No price or timeline is quoted before the scope is clear.",
      "The goal isn't adding modules; it's building the structure that works.",
    ],
    ctaMail: "Send by email",
    ctaWa: "Write on WhatsApp",
    footnote: "your message goes directly to the founder.",
    escapePre: "Prefer to write without selecting?",
    escapeLink: "send an email directly",
    systemBase: "/en/systems",
    sectorBase: "/en/sectors",
    projectBase: "/en/projects",
    solutionsHref: "/en/solutions",
    processHref: "/en/process",
  },
} as const;

type WizardCopy = (typeof WIZARD_COPY)[Locale];

function buildMailBody(
  copy: WizardCopy,
  systemLabel: string,
  situationLabel: string,
  needLabels: string[],
) {
  const L = copy.bodyLabels;
  return [
    `${L.system}: ${systemLabel}`,
    `${L.situation}: ${situationLabel}`,
    ...(needLabels.length ? [`${L.needs}: ${needLabels.join(", ")}`] : []),
    "",
    `${L.goal}:`,
    "",
    `${L.existing}:`,
    "",
    `${L.delivery}:`,
    "",
    `${L.notes}:`,
    "",
  ].join("\n");
}

function buildWhatsappText(
  copy: WizardCopy,
  systemLabel: string,
  situationLabel: string,
  needLabels: string[],
) {
  const L = copy.bodyLabels;
  return [
    copy.waIntro,
    `${L.system}: ${systemLabel}`,
    `${L.situation}: ${situationLabel}`,
    ...(needLabels.length ? [`${L.needs}: ${needLabels.join(", ")}`] : []),
    `${copy.waGoal}: `,
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

export function QuoteBuilder({ locale = "tr" }: { locale?: Locale }) {
  const copy = WIZARD_COPY[locale];
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

  const system = copy.systems.find((s) => s.id === systemId);
  const situation = copy.situations.find((s) => s.id === situationId);
  const done = Boolean(system && situation);
  const rec = done ? copy.resolve(system!.id, situation!.id) : null;
  const proofProject = rec?.projectSlug
    ? copy.lookupProject(rec.projectSlug)
    : null;

  const needLabels = copy.needs
    .filter((n) => needIds.includes(n.id))
    .map((n) => n.label);
  const systemLabel = system?.label ?? copy.unset;
  const situationLabel = situation?.label ?? copy.unset;
  const body = buildMailBody(copy, systemLabel, situationLabel, needLabels);
  const mailHref = `mailto:${site.email}?subject=${encodeURIComponent(
    copy.subject,
  )}&body=${encodeURIComponent(body)}`;
  const whatsappHref = site.whatsappUrl
    ? `${site.whatsappUrl}?text=${encodeURIComponent(
        buildWhatsappText(copy, systemLabel, situationLabel, needLabels),
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
        <StepChip
          num="01"
          label={copy.stepLabels[0]}
          state={system ? "done" : "active"}
        />
        <StepChip
          num="02"
          label={copy.stepLabels[1]}
          state={situation ? "done" : system ? "active" : "waiting"}
        />
        <StepChip
          num="03"
          label={copy.stepLabels[2]}
          state={done ? "active" : "waiting"}
        />
      </div>

      {/* 01 — sistem türü */}
      <section className="mt-8">
        <h2 className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
          <span aria-hidden className="size-1.5 bg-accent/90" />
          {copy.q1}
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {copy.systems.map((option) => {
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
            {copy.q2}
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {copy.situations.map((option) => {
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
            {copy.needsTitle}
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {copy.needs.map((need) => {
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
                {copy.resultEyebrow}
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
                    href={`${copy.systemBase}/${rec.systemSlug}`}
                    className="group inline-flex items-center gap-1.5 text-foreground/85 transition-colors hover:text-foreground"
                  >
                    {copy.linkSystem}
                    <ArrowUpRight className="size-3.5 text-accent transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                ) : (
                  <Link
                    href={copy.solutionsHref}
                    className="group inline-flex items-center gap-1.5 text-foreground/85 transition-colors hover:text-foreground"
                  >
                    {copy.linkSolutions}
                    <ArrowUpRight className="size-3.5 text-accent transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                )}
                {rec.sectorSlug && (
                  <Link
                    href={`${copy.sectorBase}/${rec.sectorSlug}`}
                    className="group inline-flex items-center gap-1.5 text-foreground/85 transition-colors hover:text-foreground"
                  >
                    {copy.linkSector}
                    <ArrowUpRight className="size-3.5 text-accent transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                )}
                {proofProject && (
                  <Link
                    href={`${copy.projectBase}/${proofProject.slug}`}
                    className="group inline-flex items-center gap-1.5 text-foreground/85 transition-colors hover:text-foreground"
                  >
                    {copy.linkProof}: {proofProject.name}
                    <ArrowUpRight className="size-3.5 text-accent transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                )}
                <Link
                  href={copy.processHref}
                  className="group inline-flex items-center gap-1.5 text-foreground/85 transition-colors hover:text-foreground"
                >
                  {copy.linkProcess}
                  <ArrowUpRight className="size-3.5 text-accent transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </div>

              {/* gönderilecek mesaj — olduğu gibi görünür, sahte form yok */}
              <div className="mt-6 rounded-lg border border-border bg-background/50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-mono text-xs tracking-widest text-muted-foreground/70 uppercase">
                    {copy.previewTitle}
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
                    {copied ? copy.copyDone : copy.copyIdle}
                  </button>
                </div>
                <pre className="mt-3 font-mono text-xs leading-relaxed whitespace-pre-wrap text-foreground/80">
                  {body}
                </pre>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground/85">
                  {copy.nextStepLabel}
                </span>{" "}
                {copy.nextStepText}
              </p>

              <ul className="mt-5 space-y-1.5">
                {copy.honest.map((line) => (
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
                  {copy.ctaMail}
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
                    {copy.ctaWa}
                  </a>
                )}
              </div>
              <p className="mt-4 font-mono text-xs text-muted-foreground/70">
                {site.email} — {copy.footnote}
              </p>
            </div>
          </section>
        )}
      </div>

      {/* düşük sürtünmeli kaçış: sihirbazsız yazmak isteyenler için */}
      <p className="mt-6 text-sm text-muted-foreground">
        {copy.escapePre}{" "}
        <a
          href={`mailto:${site.email}?subject=${encodeURIComponent(copy.subject)}`}
          className="text-foreground/85 underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          {copy.escapeLink}
        </a>
        .
      </p>
    </div>
  );
}
