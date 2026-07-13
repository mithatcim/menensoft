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
  Send,
  ShoppingCart,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Field, Honeypot, inputClass } from "@/components/leads/field";
import { buttonVariants } from "@/components/ui/button";
import { leadFormCopy } from "@/content/lead-form";
import { submitLead } from "@/lib/leads/client";
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
import { ContactLink } from "@/components/shared/contact-link";
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
    },
    unset: "(henüz seçilmedi)",
    unsure: "Henüz net değil",
    waIntro: "Merhaba, Menensoft proje görüşmesi talep ediyorum.",
    // Step 03 is "Öneri", not "Öneri & mesaj": since Phase 22 the message is
    // ready the moment a system is picked, so promising it at step 3 was stale.
    stepLabels: ["Sistem türü", "Mevcut durum", "Öneri"],
    q1: "01 — Ne yaptırmak istiyorsunuz?",
    q2: "02 — Şu an durumunuz hangisine daha yakın?",
    needsTitle: "İsteğe bağlı — ek ihtiyaçlar",
    // "Size", not "Sana": the rest of the site addresses the visitor formally,
    // and the single informal slip read as a different writer.
    resultEyebrow: "03 — Size en yakın başlangıç noktası",
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
      "Sistem türünü seçin — mesajınız burada oluşur, dilediğiniz gibi düzenleyip gönderirsiniz.",
    situationPrompt:
      "Durumunuzu da seçerseniz size en yakın başlangıç noktasını görürsünüz.",
    previewTitle: "Göndermeden önce düzenleyebilirsiniz",
    stale: "Seçimler değişti",
    regenerate: "Mesajı yeniden oluştur",
    copyIdle: "Mesajı kopyala",
    copyDone: "Kopyalandı",
    ctaMail: "E-posta ile gönder",
    ctaWa: "WhatsApp'tan yaz",
    footnote: "mesajınız doğrudan kurucuya ulaşır.",
    confidenceTitle: "İçiniz rahat olsun",
    confidence: [
      "Fiyat, kapsam ve modüllere göre belirlenir; kapsam netleşmeden fiyat ya da süre söylenmez.",
      "Şartname gerekmez — birkaç cümle ilk mesaj için yeterli.",
      // "who reads it" lives in the footnote right below this block and in the
      // next-steps timeline; this line now covers what you get BACK instead.
      "Dönüş, kapsamı netleştiren birkaç somut soruyla gelir; gerekirse kısa bir görüşme.",
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
    },
    unset: "(not selected yet)",
    unsure: "Not sure yet",
    waIntro: "Hello, I'd like to request a Menensoft project review.",
    stepLabels: ["System type", "Current situation", "Recommendation"],
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
      "Pick a system type — your message gets built here, and you can edit it however you like before sending.",
    situationPrompt:
      "Pick your situation too and you'll also get your closest starting point.",
    previewTitle: "You can edit it before sending",
    stale: "Selections changed",
    regenerate: "Regenerate message",
    copyIdle: "Copy message",
    copyDone: "Copied",
    ctaMail: "Send by email",
    ctaWa: "Write on WhatsApp",
    footnote: "your message goes directly to the founder.",
    confidenceTitle: "Nothing to worry about",
    confidence: [
      "Price is set by scope and modules; no price or timeline is quoted before the scope is clear.",
      "No spec required — a few sentences are enough for a first message.",
      "What comes back is a few concrete questions that clarify the scope — and a short call if useful.",
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
 * ONE message, not two (Phase 33B).
 *
 * Until now email and WhatsApp carried deliberately different payloads — an
 * 8-line body with two blanks for email, a leaner 5-line greeting for WhatsApp.
 * That only worked while the text was generated and read-only. Now the visitor
 * owns the text, so there is exactly one message and every channel sends what
 * they actually see: email, WhatsApp, copy.
 *
 * The default is tuned to WhatsApp length rather than email length. A message
 * short enough to paste into a chat window reads fine in an inbox; the reverse
 * is not true, and prefilling a chat with a form was the thing to avoid. The
 * old "Ek not:" blank is gone — the whole field is editable now, so a labelled
 * placeholder for "anything else" was asking the visitor to fill in a form
 * inside a textarea they can already type in.
 */
/**
 * Soft ceiling on the message. Not arbitrary: several mail clients truncate or
 * refuse a `mailto:` URL past roughly 2,000 characters, and the body is
 * percent-encoded before it gets there — Turkish characters cost 6 bytes each
 * once encoded. 1,500 leaves headroom for a fully non-ASCII message.
 */
const MESSAGE_MAX = 1500;

const draftKey = (locale: Locale) => `menensoft:inquiry-draft:${locale}`;

/** What survives a tab-local navigation. `d` is the visitor's text, `b` the
 *  generated text they started editing from. */
interface SavedSession {
  sys: string | null;
  sit: string | null;
  needs: string[];
  ref: string | null;
  d: string | null;
  b: string;
}

function buildMessage({
  copy,
  systemLabel,
  situationLabel,
  needLabels,
  referenceName,
}: MessageInput) {
  const L = copy.bodyLabels;
  return [
    copy.waIntro,
    "",
    `${L.system}: ${systemLabel}`,
    `${L.situation}: ${situationLabel}`,
    ...(needLabels.length ? [`${L.needs}: ${needLabels.join(", ")}`] : []),
    ...(referenceName ? [`${L.reference}: ${referenceName}`] : []),
    "",
    `${L.goal}: `,
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

  /**
   * The visitor's own text. `null` means "hasn't typed yet", which is not the
   * same as an empty string — while it is null the textarea simply mirrors the
   * generated message and keeps following the selections.
   */
  const [draft, setDraft] = useState<string | null>(null);
  /**
   * The generated text the visitor started editing from. Used to tell "they
   * changed a selection after editing" (offer to regenerate) apart from "they
   * only reworded it" (say nothing — their text is still current).
   */
  const [baseline, setBaseline] = useState<string>("");
  /** Guards the save effect so the empty first render can't erase the session. */
  const [hydrated, setHydrated] = useState(false);

  // --- lead form (Phase 33C) -------------------------------------------------
  const form = leadFormCopy[locale];
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  // Lazy initializer, not an effect: state initializers re-run on the client
  // during hydration, so this is the real moment the visitor saw the form — not
  // the build time baked into the prerendered HTML.
  const [formStartedAt] = useState(() => Date.now());
  const [leadErrors, setLeadErrors] = useState<Record<string, string>>({});
  const [sendState, setSendState] = useState<
    "idle" | "sending" | "sent" | "failed"
  >("idle");
  const sent = sendState === "sent";

  // ?tur= / ?durum= / ?proje= preselection. The URL is deliberately read once
  // on mount: useSearchParams + Suspense would drop this page's static HTML to
  // a fallback, and a no-JS visitor would never see step 1 at all. Every param
  // is validated against real content, so junk values degrade to "not selected"
  // instead of rendering a broken state.
  //
  // The session is restored in the same pass. Selections are restored, not just
  // the text: the message only renders once a system is chosen, so bringing back
  // a draft without the choice it was written under leaves the visitor's own
  // words stranded on a page that shows them nothing.
  //
  // The URL always outranks the session — an explicit ?tur= from a system page
  // is a fresh intent, and a stale saved choice must not silently override it.
  // If the restored draft no longer matches the restored selections, that is
  // exactly what the regenerate prompt exists to say.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tur = params.get("tur");
    const durum = params.get("durum");
    const proje = params.get("proje");

    let saved: Partial<SavedSession> = {};
    try {
      const raw = window.sessionStorage.getItem(draftKey(locale));
      if (raw) saved = JSON.parse(raw) as Partial<SavedSession>;
    } catch {
      // private mode / quota / malformed value — the generated message still works
    }

    /* eslint-disable react-hooks/set-state-in-effect -- one-off URL+session read on mount, no render cascade */
    // validated against THIS locale's pool: the ids happen to be locale-stable,
    // but hardcoding the Turkish pool here (as this once did) meant /en silently
    // depended on that coincidence
    const isSystem = (v?: string | null) =>
      Boolean(v && copy.systems.some((s) => s.id === v));
    const isSituation = (v?: string | null) =>
      Boolean(v && copy.situations.some((s) => s.id === v));

    if (isSystem(tur)) setSystemId(tur);
    else if (isSystem(saved.sys)) setSystemId(saved.sys!);

    if (isSituation(durum)) setSituationId(durum);
    else if (isSituation(saved.sit)) setSituationId(saved.sit!);

    if (proje && copy.lookupProject(proje)) setReferenceSlug(proje);
    else if (saved.ref && copy.lookupProject(saved.ref)) {
      setReferenceSlug(saved.ref);
    }

    if (saved.needs?.length) {
      const valid = saved.needs.filter((n) =>
        copy.needs.some((x) => x.id === n),
      );
      if (valid.length) setNeedIds(valid);
    }

    if (typeof saved.d === "string" && typeof saved.b === "string") {
      setBaseline(saved.b);
      setDraft(saved.d);
    }

    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [copy, locale]);

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

  const generated = buildMessage(message);
  const edited = draft !== null;
  /** What every channel sends. There is no second version of this text. */
  const body = edited ? draft : generated;
  /**
   * Selections moved on after the visitor made the text their own. Their words
   * stay untouched; they get offered the regenerate, they don't get overruled
   * by it.
   */
  const stale = edited && generated !== baseline;

  // One save for the whole wizard, not one per field. Runs only after the
  // restore pass, so the empty first render cannot wipe the saved session.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.sessionStorage.setItem(
        draftKey(locale),
        JSON.stringify({
          sys: systemId,
          sit: situationId,
          needs: needIds,
          ref: referenceSlug,
          d: draft,
          b: baseline,
        } satisfies SavedSession),
      );
    } catch {
      // storage unavailable — editing still works, it just won't survive a reload
    }
  }, [
    hydrated,
    locale,
    systemId,
    situationId,
    needIds,
    referenceSlug,
    draft,
    baseline,
  ]);

  /**
   * Send-through-the-site (Phase 33C). The message stays the source of truth:
   * whatever is in the textarea is what the form posts, what the email carries
   * and what WhatsApp carries. There is still exactly one message.
   */
  const onSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sendState === "sending") return;

    const next: Record<string, string> = {};
    if (!leadName.trim()) next.name = form.errName;
    if (!leadEmail.trim() && !leadPhone.trim()) next.email = form.errReach;
    else if (
      leadEmail.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadEmail.trim())
    ) {
      next.email = form.errEmail;
    }
    if (!body.trim()) next.form = form.errMessage;
    setLeadErrors(next);
    if (Object.keys(next).length) return;

    setSendState("sending");
    const res = await submitLead({
      name: leadName.trim(),
      email: leadEmail.trim() || undefined,
      phone: leadPhone.trim() || undefined,
      message: body,
      language: locale,
      contactPreference: "form",
      selectedFitId: systemId,
      selectedSituation: situationId,
      referenceProjectSlug: referenceSlug,
      sourcePath: locale === "en" ? "/en/start-project" : "/teklif-al",
      company,
      formStartedAt: formStartedAt,
    });

    if (res.ok) {
      setSendState("sent");
      return;
    }
    if (res.code === "rate_limit") {
      setLeadErrors({ form: form.errRate });
      setSendState("idle");
      return;
    }
    if (res.code === "validation" && res.field === "email") {
      setLeadErrors({ email: form.errEmail });
      setSendState("idle");
      return;
    }
    // unconfigured / server / network: not the visitor's fault, and their text
    // is untouched. The email and WhatsApp buttons below still carry it.
    setSendState("failed");
  };

  const editMessage = (value: string) => {
    // First keystroke: remember what they started from, so a later selection
    // change is detectable without diffing against a moving target.
    if (!edited) setBaseline(generated);
    setDraft(value);
  };

  const regenerate = () => {
    setDraft(null);
    setBaseline("");
  };

  const subject =
    system && system.id !== UNSURE_ID
      ? copy.subjectFor(system.label)
      : copy.subjectGeneric;

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

  const showArrival =
    Boolean(referenceProject) || Boolean(system && !situation);

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
                      {/* flex-wrap, not a plain row: the Turkish label's longest
                          word plus a shrink-0 button is wider than the panel at
                          390px, and the button was being clipped by the card. */}
                      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                        <label
                          htmlFor="inquiry-message"
                          className="min-w-0 font-mono text-xs tracking-widest text-muted-foreground/70 uppercase"
                        >
                          {copy.previewTitle}
                        </label>
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

                      {/* The page has always said "you can edit this before you
                          send it". Until now that was a read-only <pre>. */}
                      <textarea
                        id="inquiry-message"
                        value={body}
                        onChange={(e) => editMessage(e.target.value)}
                        maxLength={MESSAGE_MAX}
                        spellCheck={false}
                        rows={9}
                        className={cn(
                          "mt-3 field-sizing-content max-h-72 min-h-44 w-full resize-y rounded-md border border-border/70 bg-background/70 p-3 font-mono text-xs leading-relaxed text-foreground/90 transition-colors",
                          "hover:border-foreground/20 focus-visible:border-accent/50 focus-visible:ring-1 focus-visible:ring-accent/30 focus-visible:outline-none",
                        )}
                      />

                      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
                        {/* Only speaks up when the visitor's text has actually
                            fallen out of step with their selections. Their words
                            are never overwritten — regenerating is their call. */}
                        {stale ? (
                          <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1 font-mono text-xs text-muted-foreground">
                            <span className="text-accent">{copy.stale}</span>
                            <span aria-hidden>·</span>
                            <button
                              type="button"
                              onClick={regenerate}
                              className={cn(
                                "rounded-sm text-foreground/85 underline underline-offset-4 transition-colors hover:text-foreground",
                                optionFocus,
                              )}
                            >
                              {copy.regenerate}
                            </button>
                          </p>
                        ) : (
                          <span />
                        )}
                        <span
                          className={cn(
                            "shrink-0 font-mono text-xs tabular-nums",
                            body.length >= MESSAGE_MAX
                              ? "text-accent"
                              : "text-muted-foreground/50",
                          )}
                        >
                          {body.length}/{MESSAGE_MAX}
                        </span>
                      </div>
                    </div>

                    {!situation && !edited && (
                      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                        {copy.situationPrompt}
                      </p>
                    )}

                    {/* Order matters, and it flips at the breakpoint.
                        On desktop the panel is sticky and nothing is below the
                        fold, so the form leads. On MOBILE the channels lead:
                        Phase 22 fought the send CTA down from 2900px to 1654px,
                        and putting three form fields above the buttons quietly
                        pushed it back to ~2070px. A WhatsApp-first Turkish buyer
                        should not have to scroll past a form they never intended
                        to fill. One tap stays one tap. */}
                    <div className="mt-4 flex flex-col gap-4">
                      <div className="order-1 grid grid-cols-2 gap-2.5 lg:order-2">
                        <ContactLink
                          channel="email"
                          subject={subject}
                          body={body}
                          title={copy.ctaMail}
                          className={cn(
                            buttonVariants({ variant: "outline" }),
                            "h-11 w-full px-3",
                          )}
                        >
                          <Mail className="size-4" />
                          {form.preferenceEmail}
                        </ContactLink>
                        <ContactLink
                          channel="whatsapp"
                          body={body}
                          title={copy.ctaWa}
                          className={cn(
                            buttonVariants({ variant: "outline" }),
                            "h-11 w-full px-3",
                          )}
                        >
                          <MessageCircle className="size-4" />
                          {form.preferenceWhatsapp}
                        </ContactLink>
                      </div>

                      {sent ? (
                        <div className="order-2 rounded-lg border border-accent/30 bg-accent/5 p-4 lg:order-1">
                          <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                            <Check className="size-4 text-accent" />
                            {form.successTitle}
                          </p>
                          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                            {form.successBody}
                          </p>
                        </div>
                      ) : (
                        <form
                          onSubmit={onSubmitLead}
                          noValidate
                          className="order-2 lg:order-1"
                        >
                          <Honeypot
                            label={form.honeypot}
                            value={company}
                            onChange={setCompany}
                          />

                          {/* Name plus one way to reply. Nothing else — every extra
                            field here is a chance to lose someone who was already
                            willing to write. */}
                          <div className="space-y-3">
                            <Field
                              id="lead-name"
                              label={form.name}
                              error={leadErrors.name}
                            >
                              <input
                                id="lead-name"
                                name="name"
                                autoComplete="name"
                                className={inputClass}
                                placeholder={form.namePlaceholder}
                                value={leadName}
                                onChange={(e) => setLeadName(e.target.value)}
                              />
                            </Field>
                            <Field
                              id="lead-email"
                              label={form.email}
                              error={leadErrors.email}
                            >
                              <input
                                id="lead-email"
                                name="email"
                                type="email"
                                inputMode="email"
                                autoComplete="email"
                                className={inputClass}
                                placeholder={form.emailPlaceholder}
                                value={leadEmail}
                                onChange={(e) => setLeadEmail(e.target.value)}
                              />
                            </Field>
                            <Field
                              id="lead-phone"
                              label={form.phone}
                              hint={form.phoneOptional}
                            >
                              <input
                                id="lead-phone"
                                name="phone"
                                type="tel"
                                inputMode="tel"
                                autoComplete="tel"
                                className={inputClass}
                                placeholder={form.phonePlaceholder}
                                value={leadPhone}
                                onChange={(e) => setLeadPhone(e.target.value)}
                              />
                            </Field>
                          </div>

                          {leadErrors.form && (
                            <p
                              role="alert"
                              className="mt-3 rounded-md border border-accent/30 bg-accent/5 px-3 py-2 text-xs leading-relaxed text-foreground/90"
                            >
                              {leadErrors.form}
                            </p>
                          )}

                          {/* The database failing must never read as the message
                            being lost. It is still in the textarea above, and the
                            two buttons below still carry it. */}
                          {sendState === "failed" && (
                            <div
                              role="alert"
                              className="mt-3 rounded-lg border border-accent/30 bg-accent/5 p-3.5"
                            >
                              <p className="text-xs font-medium text-foreground">
                                {form.errFallbackTitle}
                              </p>
                              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                {form.errFallbackBody}
                              </p>
                            </div>
                          )}

                          <button
                            type="submit"
                            disabled={sendState === "sending"}
                            className={cn(
                              buttonVariants({ variant: "cta" }),
                              "mt-4 h-11 w-full px-5 disabled:opacity-60",
                            )}
                          >
                            <Send className="size-4" />
                            {sendState === "sending"
                              ? form.submitting
                              : form.submit}
                          </button>
                        </form>
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
            <ContactLink
              channel="email"
              subject={copy.subjectGeneric}
              className="text-foreground/85 underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              {copy.escapeLink}
            </ContactLink>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
