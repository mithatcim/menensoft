"use client";

import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  CircuitBoard,
  Gauge,
  LayoutDashboard,
  ShoppingCart,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/shared/reveal";
import { buttonVariants } from "@/components/ui/button";
import { fitSystemsEn } from "@/content/en/fit";
import { getProjectEn } from "@/content/en/projects";
import { fitSystems } from "@/content/fit";
import { getProject } from "@/content/projects";
import { type Locale } from "@/lib/locale";
import { DECOR_PULSES, EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Visual Gateway Band — compact interactive bridge between the hero and the
 * flagship story. The visitor picks a business intent; the console panel
 * animates a system flow (input → structure → surface → handoff), shows a
 * short honest line and a real proof project, and the primary CTA rewrites
 * itself to preselect the project-fit wizard (?tur=<fit id>).
 *
 * Everything shown is derived from real content (src/content/fit.ts and its
 * English mirror + real projects) — no invented metrics, telemetry, or proof.
 * Intent ids match the wizard's recognized fit ids so the ?tur= prefill
 * actually lands on a preselected step.
 */

const ICONS: Record<string, LucideIcon> = {
  "e-ticaret": ShoppingCart,
  "yonetim-paneli": LayoutDashboard,
  dashboard: Gauge,
  operasyon: CircuitBoard,
  otomasyon: Workflow,
  "kurumsal-site": Building2,
};

interface GatewayIntent {
  /** Matches a src/content/fit.ts id → drives ?tur=, system + proof lookup. */
  id: string;
  label: string;
  /** Panel title (the system name). */
  title: string;
  /** Four flow nodes: input → structure → surface → handoff. */
  nodes: [string, string, string, string];
  line: string;
  cta: string;
}

interface GatewayCopy {
  eyebrow: string;
  title: string;
  sub: string;
  panelHint: string;
  proofLabel: string;
  systemLink: string;
  secondary: string;
  secondaryHref: string;
  quoteBase: string;
  systemBase: string;
  projectBase: string;
  intents: GatewayIntent[];
}

const GATEWAY: Record<Locale, GatewayCopy> = {
  tr: {
    eyebrow: "İhtiyaçtan sisteme — görsel geçiş",
    title: "İhtiyacınızı çalışan bir sisteme bağlayın.",
    sub: "Neye ihtiyacınız olduğunu seçin; bir fikir veri, arayüz, panel ve teslim akışına dönüşür.",
    panelHint: "Sadece görünen sayfa değil, yönetilebilir yapı kurulur.",
    proofLabel: "Kanıt",
    systemLink: "Sistem detayını gör",
    secondary: "Projeleri incele",
    secondaryHref: "/projeler",
    quoteBase: "/teklif-al",
    systemBase: "/sistemler",
    projectBase: "/projeler",
    intents: [
      {
        id: "e-ticaret",
        label: "E-ticaret kurmak istiyorum",
        title: "E-ticaret sistemi",
        nodes: ["Ürün girişi", "Veri modeli", "Vitrin + Panel", "Teslim"],
        line: "Vitrin ve yönetim katmanı tek altyapıda: ürünleri yöneten panel, onları satan sayfaları da yönetir.",
        cta: "E-ticaret sistemi için görüşme başlat",
      },
      {
        id: "yonetim-paneli",
        label: "Yönetim paneli istiyorum",
        title: "Yönetim paneli",
        nodes: ["Veri", "Roller", "Yönetim ekranları", "Teslim"],
        line: "Tablolarda ve mesajlarda yaşayan veri, rol bazlı yetkili ekranlara taşınır.",
        cta: "Yönetim paneli için görüşme başlat",
      },
      {
        id: "dashboard",
        label: "İşleri takip etmek istiyorum",
        title: "Dashboard / raporlama",
        nodes: ["Olaylar", "Veri katmanı", "Canlı ekran", "Teslim"],
        line: "İşin anlık durumu, sormadan tek bakışta görünür hale gelir.",
        cta: "Dashboard için görüşme başlat",
      },
      {
        id: "operasyon",
        label: "Randevu / sipariş akışı istiyorum",
        title: "Operasyon sistemi",
        nodes: ["Sipariş / talep", "Yönlendirme", "İstasyon ekranları", "Teslim"],
        line: "Tek girdi ihtiyacı olan her istasyona kendi ekranıyla ulaşır; durum herkes için aynıdır.",
        cta: "Operasyon akışı için görüşme başlat",
      },
      {
        id: "otomasyon",
        label: "Manuel işi otomatikleştirmek istiyorum",
        title: "İş akışı otomasyonu",
        nodes: ["Girdi", "Kurallar", "Otomatik akış", "Teslim"],
        line: "Elle dönen iş kaynağında bir kez yakalanır, kurala göre yönlenir.",
        cta: "Otomasyon için görüşme başlat",
      },
      {
        id: "kurumsal-site",
        label: "Kurumsal site + panel istiyorum",
        title: "Kurumsal site + panel",
        nodes: ["İçerik", "Panel", "Site + Talep", "Teslim"],
        line: "Donmuş vitrin yerine panelden güncellenen, talepleri sistemde toplayan bir site.",
        cta: "Kurumsal site için görüşme başlat",
      },
    ],
  },
  en: {
    eyebrow: "From need to system — visual gateway",
    title: "Connect a business need to a working system.",
    sub: "Choose what you need; a request becomes data, interface, admin flow and handoff.",
    panelHint: "Not just the visible page — the manageable structure behind it.",
    proofLabel: "Proof",
    systemLink: "View system detail",
    secondary: "View projects",
    secondaryHref: "/en/projects",
    quoteBase: "/en/start-project",
    systemBase: "/en/systems",
    projectBase: "/en/projects",
    intents: [
      {
        id: "e-ticaret",
        label: "I need an e-commerce system",
        title: "E-commerce system",
        nodes: ["Product input", "Data model", "Storefront + Panel", "Handoff"],
        line: "Storefront and management layer in one infrastructure: the panel that manages products also manages the pages that sell them.",
        cta: "Start an e-commerce system conversation",
      },
      {
        id: "yonetim-paneli",
        label: "I need an admin panel",
        title: "Admin panel",
        nodes: ["Data", "Roles", "Admin screens", "Handoff"],
        line: "Data living in spreadsheets and chats moves into role-based, authorized screens.",
        cta: "Start an admin panel conversation",
      },
      {
        id: "dashboard",
        label: "I need to track operations",
        title: "Dashboard / reporting",
        nodes: ["Events", "Data layer", "Live screen", "Handoff"],
        line: "The state of the work becomes visible at a glance — without asking.",
        cta: "Start a dashboard conversation",
      },
      {
        id: "operasyon",
        label: "I need an appointment / order flow",
        title: "Operations system",
        nodes: ["Order / request", "Routing", "Station screens", "Handoff"],
        line: "One input reaches every station on its own screen; status is the same for everyone.",
        cta: "Start an operations system conversation",
      },
      {
        id: "otomasyon",
        label: "I want to automate manual work",
        title: "Workflow automation",
        nodes: ["Input", "Rules", "Automated flow", "Handoff"],
        line: "A flow running by hand is captured once at the source and routed by rule.",
        cta: "Start an automation conversation",
      },
      {
        id: "kurumsal-site",
        label: "I need a website with a panel",
        title: "Corporate website + panel",
        nodes: ["Content", "Panel", "Site + inquiries", "Handoff"],
        line: "Instead of a frozen brochure, a site updated from a panel that collects inquiries in a system.",
        cta: "Start a corporate website conversation",
      },
    ],
  },
};

const nodeVariants = {
  hidden: { opacity: 0, y: 8 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: 0.12 + i * 0.1, ease: EASE_OUT },
  }),
};

/** The animated system-flow rail for the selected intent. */
function FlowRail({
  nodes,
  reduceMotion,
}: {
  nodes: readonly string[];
  reduceMotion: boolean;
}) {
  return (
    <div>
      {/* travelling pulse rail — decorative, gated by DECOR_PULSES + reduced-motion */}
      <div className="relative mb-3 h-px w-full bg-gradient-to-r from-border via-accent/40 to-border">
        {DECOR_PULSES && (
          <span className="animate-flow-x absolute top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_8px_1px_rgba(139,140,248,0.6)]" />
        )}
      </div>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
        {nodes.map((node, i) => (
          <div key={node} className="flex items-center gap-2">
            {i > 0 && (
              <ArrowRight
                aria-hidden
                className="size-3 shrink-0 text-accent/50"
              />
            )}
            <motion.span
              custom={i}
              variants={nodeVariants}
              initial={reduceMotion ? false : "hidden"}
              animate="show"
              className={cn(
                "rounded-md border bg-background/50 px-2.5 py-1 font-mono text-xs text-foreground/85",
                i === nodes.length - 1
                  ? "border-accent/40 text-accent"
                  : "border-border",
              )}
            >
              {node}
            </motion.span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function VisualGateway({ locale = "tr" }: { locale?: Locale }) {
  const copy = GATEWAY[locale];
  const reduceMotion = useReducedMotion() ?? false;
  const [selected, setSelected] = useState(0);
  const [interacted, setInteracted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const fitPool = locale === "en" ? fitSystemsEn : fitSystems;
  const lookupProject = locale === "en" ? getProjectEn : getProject;

  const intent = copy.intents[selected];
  const fit = fitPool.find((f) => f.id === intent.id);
  const proof = fit?.projectSlug ? lookupProject(fit.projectSlug) : null;
  const ctaHref = `${copy.quoteBase}?tur=${intent.id}`;
  const systemHref = fit?.systemSlug
    ? `${copy.systemBase}/${fit.systemSlug}`
    : undefined;
  const proofHref = proof ? `${copy.projectBase}/${proof.slug}` : undefined;

  // Gentle auto-cycle before first interaction; never under reduced motion,
  // stops permanently once the visitor engages (click or keyboard focus).
  useEffect(() => {
    if (reduceMotion || interacted) return;
    const timer = setInterval(() => {
      setSelected((s) => (s + 1) % copy.intents.length);
    }, 4200);
    return () => clearInterval(timer);
  }, [reduceMotion, interacted, copy.intents.length]);

  const engage = () => setInteracted(true);
  const choose = (i: number) => {
    setInteracted(true);
    setSelected(i);
  };

  return (
    <section
      ref={sectionRef}
      onFocusCapture={engage}
      className="relative overflow-hidden border-b border-border/60 py-14 md:py-16"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="bg-grid mask-radial-faded absolute inset-0 opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_0%,rgba(139,140,248,0.06),transparent)]" />
      </div>

      <Container className="relative">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:items-start lg:gap-10">
          {/* left: heading + intent selector */}
          <div>
            <Reveal>
              <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                <span aria-hidden className="size-1.5 bg-accent/90" />
                {copy.eyebrow}
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-balance md:text-3xl">
                {copy.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {copy.sub}
              </p>
            </Reveal>

            <Reveal delay={0.06}>
              <div
                role="group"
                aria-label={copy.eyebrow}
                className="mt-6 flex flex-col gap-2"
              >
                {copy.intents.map((it, i) => {
                  const Icon = ICONS[it.id] ?? ShoppingCart;
                  const isSel = selected === i;
                  return (
                    <button
                      key={it.id}
                      type="button"
                      onClick={() => choose(i)}
                      aria-pressed={isSel}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg border px-3.5 py-2.5 text-left text-sm transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        isSel
                          ? "border-accent/50 bg-card/80 ring-1 ring-accent/20"
                          : "border-border bg-card/40 text-foreground/80 hover:border-foreground/20 hover:bg-card/60",
                      )}
                    >
                      <Icon
                        className={cn(
                          "size-4 shrink-0 transition-colors",
                          isSel ? "text-accent" : "text-muted-foreground",
                        )}
                      />
                      <span className="min-w-0 flex-1 truncate">{it.label}</span>
                      <span
                        aria-hidden
                        className={cn(
                          "size-1.5 shrink-0 rounded-full transition-colors",
                          isSel ? "bg-accent" : "bg-muted-foreground/25",
                        )}
                      />
                    </button>
                  );
                })}
              </div>
            </Reveal>
          </div>

          {/* right: console panel */}
          <Reveal delay={0.1}>
            <div className="relative overflow-hidden rounded-xl border border-border bg-card/60 ring-1 ring-white/5 backdrop-blur-sm">
              <div aria-hidden className="scanlines absolute inset-0 opacity-30" />
              {/* corner brackets */}
              <span
                aria-hidden
                className="absolute top-3 left-3 size-4 border-t border-l border-accent/40"
              />
              <span
                aria-hidden
                className="absolute top-3 right-3 size-4 border-t border-r border-accent/40"
              />
              <span
                aria-hidden
                className="absolute bottom-3 left-3 size-4 border-b border-l border-accent/40"
              />
              <span
                aria-hidden
                className="absolute right-3 bottom-3 size-4 border-r border-b border-accent/40"
              />

              {/* console header strip */}
              <div className="relative flex items-center gap-3 border-b border-border bg-background/40 px-4 py-2.5">
                <span aria-hidden className="flex gap-1.5">
                  <span className="size-2.5 rounded-full border border-border bg-muted/60" />
                  <span className="size-2.5 rounded-full border border-border bg-muted/60" />
                  <span className="size-2.5 rounded-full border border-border bg-muted/60" />
                </span>
                <p className="min-w-0 flex-1 truncate text-center font-mono text-xs text-muted-foreground">
                  gateway://{intent.id}
                </p>
                <span
                  aria-hidden
                  className="size-1.5 rounded-full bg-accent shadow-[0_0_8px_1px_rgba(139,140,248,0.6)]"
                />
              </div>

              {/* animated console body */}
              <div className="relative p-5 md:p-6" aria-live="polite">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={intent.id}
                    initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.3,
                      ease: EASE_OUT,
                    }}
                  >
                    <h3 className="text-lg font-semibold tracking-tight md:text-xl">
                      {intent.title}
                    </h3>
                    <div className="mt-4">
                      <FlowRail nodes={intent.nodes} reduceMotion={reduceMotion} />
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      {intent.line}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                      {proof && proofHref && (
                        <Link
                          href={proofHref}
                          onClick={engage}
                          className="group inline-flex items-center gap-2 rounded-lg border border-border bg-background/50 px-3 py-1.5 text-xs transition-colors hover:border-accent/40 hover:bg-card"
                        >
                          <span
                            aria-hidden
                            className="size-1.5 rounded-full bg-accent/80"
                          />
                          <span className="font-mono tracking-widest text-muted-foreground/70 uppercase">
                            {copy.proofLabel}
                          </span>
                          <span className="text-foreground/85">{proof.name}</span>
                          <ArrowUpRight className="size-3.5 text-muted-foreground transition-colors group-hover:text-foreground" />
                        </Link>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* CTA footer — dynamic primary reflects the selected intent */}
              <div className="relative border-t border-border bg-background/30 px-5 py-4 md:px-6">
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={ctaHref}
                    onClick={engage}
                    className={cn(
                      buttonVariants({ variant: "cta" }),
                      "h-11 px-5",
                    )}
                  >
                    {intent.cta}
                    <ArrowRight className="size-4" />
                  </Link>
                  <Link
                    href={copy.secondaryHref}
                    onClick={engage}
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "h-11 px-5",
                    )}
                  >
                    {copy.secondary}
                  </Link>
                  {systemHref && (
                    <Link
                      href={systemHref}
                      onClick={engage}
                      className="group ml-auto hidden items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
                    >
                      {copy.systemLink}
                      <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>
                  )}
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground/70">
                  {copy.panelHint}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
