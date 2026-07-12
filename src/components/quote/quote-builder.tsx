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
 * Project inquiry studio (Phase 22).
 *
 * Two short choices and an honest recommendation. No backend, no fake form —
 * the result always goes to a real channel (email / WhatsApp) as a prefilled
 * message that the visitor sees verbatim before sending.
 *
 * The layout exists to fix a measured defect: the send CTA used to sit ~2
 * screens down on desktop and ~3.4 screens down on mobile, and everything that
 * calms a nervous buyer — how price is set, what happens next, the objections —
 * sat BELOW it. Buyers were deciding before they were reassured.
 *
 * So on desktop the summary, the message preview, the send buttons and the
 * confidence lines all live in a sticky panel that never leaves the screen
 * while the visitor chooses. On mobile they render immediately after the last
 * required choice, before any supporting content.
 *
 * Content: src/content/fit.ts (TR) and src/content/en/fit.ts (EN). The message
 * language always follows the route's language.
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

/** The "not sure yet" option — never used to build a subject line. */
const UNSURE_ID = "emin-degilim";

const WIZARD_COPY = {
  tr: {
    systems: fitSystems,
    situations: fitSituations,
    needs: fitNeeds,
    resolve: resolveRecommendation,
    lookupProject: getProject,
    subjectGeneric: "Menensoft proje görüşmesi",
    subjectFor: (label: string) => `Menensoft — ${label} görüşmesi`,
    bodyLabels: {
      system: "Sistem türü",
      situation: "Mevcut durum",
      needs: "Ek ihtiyaçlar",
      reference: "Referans aldığım proje",
      goal: "Hedef",
      notes: "Ek not",
    },
    unset: "(henüz seçilmedi)",
    unsure: "Henüz net değil",
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
    // arrival
    arrivalFrom: (name: string) => `${name} sayfasından geldiniz.`,
    arrivalSelected: (label: string) => `${label} seçili.`,
    arrivalChange: "Seçimi değiştir",
    // summary panel
    summaryTitle: "Mesajınız",
    summaryEmpty:
      "Sistem türünü seçin — mesajınız burada oluşur ve göndermeden önce aynen görünür.",
    situationPrompt:
      "Durumunuzu da seçerseniz size en yakın başlangıç noktası da gelir.",
    previewTitle: "Göndermeden önce düzenleyebilirsiniz",
    copyIdle: "Mesajı kopyala",
    copyDone: "Kopyalandı",
    ctaMail: "E-posta ile gönder",
    ctaWa: "WhatsApp'tan yaz",
    footnote: "mesajınız doğrudan kurucuya ulaşır.",
    confidenceTitle: "İçiniz rahat olsun",
    confidence: [
      "Fiyat kapsam ve modüllere göre belirlenir; kapsam netleşmeden fiyat ya da süre söylenmez.",
      "Şartname gerekmez — birkaç cümle ilk mesaj için yeterli.",
      "Mesajınızı sistemi kuracak kişi okur; kapsamı netleştiren birkaç soruyla dönüş yapılır.",
      "İlk temas için WhatsApp da yeterli; e-posta sadece daha fazla ayrıntı taşır.",
    ],
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
    subjectGeneric: "Menensoft project inquiry",
    subjectFor: (label: string) => `Menensoft — ${label} inquiry`,
    bodyLabels: {
      system: "System type",
      situation: "Current situation",
      needs: "Additional needs",
      reference: "Reference project",
      goal: "Goal",
      notes: "Extra notes",
    },
    unset: "(not selected yet)",
    unsure: "Not sure yet",
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
    arrivalFrom: (name: string) => `You came from the ${name} page.`,
    arrivalSelected: (label: string) => `${label} selected.`,
    arrivalChange: "Change selection",
    summaryTitle: "Your message",
    summaryEmpty:
      "Pick a system type — your message gets built here, and you see it as-is before sending.",
    situationPrompt:
      "Pick your situation too and you'll also get your closest starting point.",
    previewTitle: "You can edit it before sending",
    copyIdle: "Copy message",
    copyDone: "Copied",
    ctaMail: "Send by email",
    ctaWa: "Write on WhatsApp",
    footnote: "your message goes directly to the founder.",
    confidenceTitle: "Nothing to worry about",
    confidence: [
      "Price is set by scope and modules; no price or timeline is quoted before the scope is clear.",
      "No spec required — a few sentences are enough for a first message.",
      "The person who would build the system reads it, and replies with a few questions that clarify the scope.",
      "WhatsApp is enough for first contact; email just carries more detail.",
    ],
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

interface MessageInput {
  copy: WizardCopy;
  systemLabel: string;
  situationLabel: string;
  needLabels: string[];
  referenceName?: string;
}

/**
 * Two blanks, not four. "Existing site/system" and "delivery expectation" used
 * to ship as empty fields here — but those are exactly the scope questions the
 * page promises the founder will ask back. Requiring them up front contradicts
 * "a few sentences are enough, no spec required".
 */
function buildMailBody({
  copy,
  systemLabel,
  situationLabel,
  needLabels,
  referenceName,
}: MessageInput) {
  const L = copy.bodyLabels;
  return [
    `${L.system}: ${systemLabel}`,
    `${L.situation}: ${situationLabel}`,
    ...(needLabels.length ? [`${L.needs}: ${needLabels.join(", ")}`] : []),
    ...(referenceName ? [`${L.reference}: ${referenceName}`] : []),
    "",
    `${L.goal}:`,
    "",
    `${L.notes}:`,
    "",
  ].join("\n");
}

/**
 * WhatsApp stays leaner than email: a greeting, the selection, and one open
 * line. It deliberately drops the optional needs list — the panel promises
 * "WhatsApp is enough for first contact; email just carries more detail", and
 * the payload should keep that promise rather than dump a form into a chat.
 * The email body is a strict superset of this.
 */
function buildWhatsappText({
  copy,
  systemLabel,
  situationLabel,
  referenceName,
}: MessageInput) {
  const L = copy.bodyLabels;
  return [
    copy.waIntro,
    `${L.system}: ${systemLabel}`,
    `${L.situation}: ${situationLabel}`,
    ...(referenceName ? [`${L.reference}: ${referenceName}`] : []),
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
        state === "waiting"
          ? "text-muted-foreground/50"
          : "text-muted-foreground",
      )}
    >
      <span
        className={cn(
          "flex size-6 items-center justify-center rounded-md border",
          state === "done" && "border-accent/50 bg-accent/10 text-accent",
          state === "active" &&
            "border-accent/30 bg-accent/5 text-accent shadow-[0_0_10px_-2px_rgba(139,140,248,0.5)]",
          state === "waiting" &&
            "border-border bg-card text-muted-foreground/50",
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
  /** Set only from a valid ?proje= — the project page the visitor came from. */
  const [referenceSlug, setReferenceSlug] = useState<string | null>(null);

  // ?tur= / ?durum= / ?proje= preselection. The URL is deliberately read once
  // on mount: useSearchParams + Suspense would drop this page's static HTML to
  // a fallback, and a no-JS visitor would never see step 1 at all. Every param
  // is validated against real content, so junk values degrade to "not selected"
  // instead of rendering a broken state.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tur = params.get("tur");
    const durum = params.get("durum");
    const proje = params.get("proje");
    /* eslint-disable react-hooks/set-state-in-effect -- one-off URL read on mount, no render cascade */
    // validated against THIS locale's pool: the ids happen to be locale-stable,
    // but hardcoding the Turkish pool here (as this once did) meant /en silently
    // depended on that coincidence
    if (tur && copy.systems.some((s) => s.id === tur)) setSystemId(tur);
    if (durum && copy.situations.some((s) => s.id === durum)) {
      setSituationId(durum);
    }
    if (proje && copy.lookupProject(proje)) setReferenceSlug(proje);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [copy]);

  const system = copy.systems.find((s) => s.id === systemId);
  const situation = copy.situations.find((s) => s.id === situationId);
  const referenceProject = referenceSlug
    ? copy.lookupProject(referenceSlug)
    : undefined;

  const done = Boolean(system && situation);
  const rec = done ? copy.resolve(system!.id, situation!.id) : null;
  const proofProject = rec?.projectSlug
    ? copy.lookupProject(rec.projectSlug)
    : null;

  const needLabels = copy.needs
    .filter((n) => needIds.includes(n.id))
    .map((n) => n.label);

  const systemLabel = system?.label ?? copy.unset;
  // A visitor who hasn't picked a situation isn't blocked — the message just
  // says so honestly. "Can I start even if I'm not sure?" has to be yes.
  const situationLabel = situation?.label ?? copy.unsure;

  const message: MessageInput = {
    copy,
    systemLabel,
    situationLabel,
    needLabels,
    referenceName: referenceProject?.name,
  };
  const body = buildMailBody(message);

  const subject =
    system && system.id !== UNSURE_ID
      ? copy.subjectFor(system.label)
      : copy.subjectGeneric;

  const mailHref = `mailto:${site.email}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
  const whatsappHref = site.whatsappUrl
    ? `${site.whatsappUrl}?text=${encodeURIComponent(buildWhatsappText(message))}`
    : undefined;

  /** The send action unlocks on the first choice, not the second. */
  const canSend = Boolean(system);

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
      // no clipboard access — the message is already visible, so stay quiet
    }
  };

  const optionFocus =
    "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

  const showArrival = Boolean(referenceProject) || Boolean(system && !situation);

  return (
    <div>
      {/* Arrival confirmation: the prefill used to work but stay silent, so a
          visitor arriving from a project page met a generic seven-card grid
          with one card quietly highlighted. */}
      {showArrival && (
        <div className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-accent/25 bg-accent/5 px-4 py-3">
          <span
            aria-hidden
            className="size-1.5 shrink-0 rounded-full bg-accent shadow-[0_0_8px_1px_rgba(139,140,248,0.6)]"
          />
          <p className="min-w-0 text-sm text-foreground/90">
            {system && copy.arrivalSelected(system.label)}
            {referenceProject && (
              <span className="text-muted-foreground">
                {" "}
                {copy.arrivalFrom(referenceProject.name)}
              </span>
            )}
          </p>
          {system && (
            <button
              type="button"
              onClick={() => setSystemId(null)}
              className={cn(
                "ml-auto shrink-0 rounded-md border border-border px-2.5 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground",
                optionFocus,
              )}
            >
              {copy.arrivalChange}
            </button>
          )}
        </div>
      )}

      {/* On mobile the order is: choose a system -> see your message and the send
          button -> refine if you want. The summary is its own grid item rather
          than living at the bottom of the left column, because sending unlocks
          on the FIRST choice; burying the CTA under the (optional) second and
          third steps is exactly the defect this phase exists to fix. */}
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)] lg:gap-12">
        {/* ---------------------------- left: the choices --------------------------- */}
        <div className="order-1 lg:col-start-1 lg:row-start-1">
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

          <section className="mt-8">
            <h2 className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
              <span aria-hidden className="size-1.5 bg-accent/90" />
              {copy.q1}
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
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
        </div>

        {/* --------------- the ask, and the reasons not to fear it ---------------
            Sticky on desktop so the send button and the reassurance never leave
            the screen. On mobile it sits directly under the system choice — the
            only choice sending actually requires. */}
        <div className="order-2 lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:self-start">
          <div className="lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-xl border border-accent/25 bg-card/80 ring-1 ring-accent/10">
              <div className="border-b border-border/60 bg-accent/5 px-5 py-3.5">
                <h2 className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                  <span aria-hidden className="size-1.5 bg-accent/90" />
                  {copy.summaryTitle}
                </h2>
              </div>

              <div className="p-5">
                {!canSend ? (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {copy.summaryEmpty}
                  </p>
                ) : (
                  <>
                    <div className="rounded-lg border border-border bg-background/50 p-3.5">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-mono text-xs tracking-widest text-muted-foreground/70 uppercase">
                          {copy.previewTitle}
                        </p>
                        <button
                          type="button"
                          onClick={copyMessage}
                          className={cn(
                            "flex shrink-0 items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-xs transition-colors",
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
                      <pre
                        aria-live="polite"
                        className="mt-3 font-mono text-xs leading-relaxed whitespace-pre-wrap text-foreground/80"
                      >
                        {body}
                      </pre>
                    </div>

                    {!situation && (
                      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                        {copy.situationPrompt}
                      </p>
                    )}

                    <div className="mt-4 flex flex-col gap-2.5">
                      <a
                        href={mailHref}
                        className={cn(
                          buttonVariants({ variant: "cta" }),
                          "h-11 w-full px-5",
                        )}
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
                            "h-11 w-full px-5",
                          )}
                        >
                          <MessageCircle className="size-4" />
                          {copy.ctaWa}
                        </a>
                      )}
                    </div>
                    {/* break-all only on the address: applied to the whole line
                        it chopped the Turkish mid-word ("kuruc / uya ulaşır") */}
                    <p className="mt-3 font-mono text-xs leading-relaxed text-muted-foreground/70">
                      <span className="break-all">{site.email}</span> —{" "}
                      {copy.footnote}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* the objections that used to live below the send button */}
            <div className="mt-4 rounded-xl border border-border bg-card/50 p-5">
              <h2 className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground/80 uppercase">
                <span
                  aria-hidden
                  className="size-1.5 rotate-45 border border-muted-foreground/50"
                />
                {copy.confidenceTitle}
              </h2>
              <ul className="mt-3 space-y-2">
                {copy.confidence.map((line) => (
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
            </div>
          </div>
        </div>

        {/* ------------- optional refinement: situation + extra needs ------------- */}
        <div className="order-3 lg:col-start-1 lg:row-start-2">
          {system && (
            <section>
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
                          ? "border-accent/50 bg-card/90 text-foreground ring-1 ring-accent/25"
                          : "border-border bg-card/60 text-foreground/85 ring-1 ring-white/5 hover:border-foreground/20",
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
        </div>

        {/* ---------- the recommendation: real content, but not the ask ---------- */}
        <div className="order-4 lg:col-start-1 lg:row-start-3">
          {done && rec && (
            <section className="overflow-hidden rounded-xl border border-border bg-card/60 ring-1 ring-white/5">
              <div className="border-b border-border/60 px-6 py-4">
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
              </div>
            </section>
          )}

          {/* low-friction escape: for people who'd rather just write */}
          <p className="mt-6 text-sm text-muted-foreground">
            {copy.escapePre}{" "}
            <a
              href={`mailto:${site.email}?subject=${encodeURIComponent(copy.subjectGeneric)}`}
              className="text-foreground/85 underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              {copy.escapeLink}
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
