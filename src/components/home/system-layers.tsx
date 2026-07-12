"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";
import Link from "next/link";
import { useState } from "react";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { getProjectEn } from "@/content/en/projects";
import { getProject } from "@/content/projects";
import { type Locale } from "@/lib/locale";
import { DECOR_PULSES, EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * System Layers — the "what gets built under the hood" section (Phase 17).
 *
 * This absorbed the old CapabilityConsole: each layer now carries not just an
 * anatomy line but the capability it creates, what gets delivered, the real
 * project it was built in, and where to go next. The old section had 21
 * controls across three duplicate surfaces (iso planes + desktop list + mobile
 * accordion) and zero conversion exits; there are now 7 real controls (one
 * rail, shared across breakpoints), the iso plane stack is purely decorative,
 * and every layer offers both a proof path and an inquiry path.
 *
 * Distinct from the Visual Gateway on purpose: the Gateway asks "what do you
 * need?", this asks "what is actually built under the hood?".
 * All proof is real — layers with no honest project link to the process page.
 */

interface Layer {
  id: string;
  tag: string;
  title: string;
  /** What the layer does. */
  meaning: string;
  /** Why it matters to the buyer — the capability it creates. */
  value: string;
  /** Concrete things delivered at this layer. */
  delivers: [string, string, string];
  /** Real project where this layer was built; omitted when none is honest. */
  projectSlug?: string;
  /** Related system page (localized slug); omitted when none fits honestly. */
  systemSlug?: string;
}

interface LayersCopy {
  eyebrow: string;
  title: string;
  description: string;
  valueLabel: string;
  deliversLabel: string;
  proofLabel: string;
  projectLink: string;
  systemLink: string;
  processLink: string;
  processHref: string;
  primaryCta: string;
  quoteHref: string;
  projectBase: string;
  systemBase: string;
  railLabel: string;
  layers: Layer[];
}

const COPY: Record<Locale, LayersCopy> = {
  tr: {
    eyebrow: "Sistem katmanları",
    title: "Her katman, tek sahip.",
    description:
      "Çalışan bir sistem sayfa değil, yığındır: kapsamdan teslime kadar her katman burada tasarlanıp kurulur. Bir katman seçin; ne yaptığını, neden önemli olduğunu ve hangi projede kurulduğunu görün.",
    valueLabel: "Neden önemli",
    deliversLabel: "Teslim edilen",
    proofLabel: "Kurulduğu proje",
    projectLink: "İlgili projeyi gör",
    systemLink: "Sistem detayını incele",
    processLink: "Süreci gör",
    processHref: "/surec",
    primaryCta: "Bu yapıyı kendi projem için konuşalım",
    quoteHref: "/teklif-al",
    projectBase: "/projeler",
    systemBase: "/sistemler",
    railLabel: "Sistem katmanları",
    layers: [
      {
        id: "scope",
        tag: "SCOPE",
        title: "Kapsam ve akış",
        meaning:
          "İşin bugün nasıl yürüdüğü haritalanır; neyin kurulacağı ve neyin kurulmayacağı yazılı olarak netleşir.",
        value:
          "Sürpriz maliyet ve belirsiz teslim burada, daha tek satır kod yazılmadan önlenir.",
        delivers: ["Yazılı kapsam", "İş akışı haritası", "Modül sınırları"],
      },
      {
        id: "data",
        tag: "DATA",
        title: "Veri modeli",
        meaning:
          "Şema ve ilişkiler, işin gerçek düzenine göre tasarlanır — şablona göre değil.",
        value:
          "Veri doğru kurulmazsa üstündeki her ekran eğri durur; doğru kurulursa sistem büyümeye dayanır.",
        delivers: ["Şema ve ilişkiler", "Tutarlılık kuralları", "Büyümeye açık yapı"],
        projectSlug: "ecommerce-cms",
        systemSlug: "admin-panel",
      },
      {
        id: "admin",
        tag: "ADMIN",
        title: "Yönetim paneli",
        meaning:
          "Ekibin günü yönettiği yetkili ekranlar: kayıt, içerik, sipariş ve kullanıcı yönetimi.",
        value:
          "Her içerik değişikliği için geliştirici beklemezsiniz; sistem sizin elinizde kalır.",
        delivers: ["Rol bazlı erişim", "Veri tabloları ve arama", "Doğrulamalı formlar"],
        projectSlug: "orva-psychology",
        systemSlug: "admin-panel",
      },
      {
        id: "ui",
        tag: "UI",
        title: "Kullanıcı arayüzü",
        meaning:
          "Müşterinin ve ekibin dokunduğu yüzey: vitrin, kurumsal site, istasyon ekranları.",
        value:
          "Hızlı ve anlaşılır arayüz, gerçekten kullanılan sistem demektir.",
        delivers: ["Vitrin / site sayfaları", "Role özel ekranlar", "Tutarlı durum gösterimi"],
        projectSlug: "ecommerce-cms",
        systemSlug: "kurumsal-web-sitesi",
      },
      {
        id: "automation",
        tag: "AUTO",
        title: "İş otomasyonu",
        meaning:
          "Girdi kaynağında bir kez yakalanır ve kurala göre doğru istasyona yönlenir.",
        value:
          "Elle taşınan iş ortadan kalkar; süreç kişiye bağımlı olmaktan çıkar.",
        delivers: ["Kural bazlı yönlendirme", "Durum takibi", "Entegrasyonlar"],
        projectSlug: "restaurant-qr-system",
        systemSlug: "is-akisi-otomasyonu",
      },
      {
        id: "reporting",
        tag: "REPORT",
        title: "Raporlama",
        meaning:
          "Kayıtlar aranabilir, incelenebilir ve özetlenebilir hale gelir.",
        value:
          "İşin durumu telefonla sorulmadan, tek bakışta görünür.",
        delivers: ["Arama ve filtre", "İnceleme ekranları", "Gün sonu özetleri"],
        projectSlug: "log-management-platform",
        systemSlug: "dashboard-raporlama",
      },
      {
        id: "handoff",
        tag: "SHIP",
        title: "Teslim ve devredilebilir yapı",
        meaning:
          "Dokümantasyon, sürdürülebilir kod tabanı ve temiz devir ile sistem size bırakılır.",
        value:
          "Kişiye bağımlı bir kara kutu değil; teslimden sonra işletebileceğiniz bir yapı.",
        delivers: ["Dokümantasyon", "Sürdürülebilir kod tabanı", "Temiz devir"],
      },
    ],
  },
  en: {
    eyebrow: "System layers",
    title: "Every layer, one owner.",
    description:
      "A working system is a stack, not a page: every layer from scope to handoff is designed and built here. Pick a layer to see what it does, why it matters, and where it was built.",
    valueLabel: "Why it matters",
    deliversLabel: "Delivered",
    proofLabel: "Built in",
    projectLink: "View related project",
    systemLink: "View system detail",
    processLink: "See the process",
    processHref: "/en/process",
    primaryCta: "Discuss this structure for my project",
    quoteHref: "/en/start-project",
    projectBase: "/en/projects",
    systemBase: "/en/systems",
    railLabel: "System layers",
    layers: [
      {
        id: "scope",
        tag: "SCOPE",
        title: "Scope and flow",
        meaning:
          "How the work runs today gets mapped; what will be built — and what won't — is agreed in writing.",
        value:
          "Surprise costs and vague delivery are prevented here, before a line of code is written.",
        delivers: ["Written scope", "Workflow map", "Module boundaries"],
      },
      {
        id: "data",
        tag: "DATA",
        title: "Data model",
        meaning:
          "Schema and relations are designed around how the business really works — not around a template.",
        value:
          "Get the data wrong and every screen above it leans; get it right and the system takes growth.",
        delivers: ["Schema and relations", "Consistency rules", "Room to grow"],
        projectSlug: "ecommerce-cms",
        systemSlug: "admin-panel",
      },
      {
        id: "admin",
        tag: "ADMIN",
        title: "Admin surface",
        meaning:
          "The authorized screens your team runs the day on: records, content, orders and users.",
        value:
          "You stop waiting on a developer for every change — the system stays in your hands.",
        delivers: ["Role-based access", "Data tables and search", "Validated forms"],
        projectSlug: "orva-psychology",
        systemSlug: "admin-panel",
      },
      {
        id: "ui",
        tag: "UI",
        title: "User interface",
        meaning:
          "The surface customers and staff actually touch: storefront, corporate site, station screens.",
        value:
          "A fast, legible interface is what turns a system into one that actually gets used.",
        delivers: ["Storefront / site pages", "Role-specific screens", "Consistent state"],
        projectSlug: "ecommerce-cms",
        systemSlug: "corporate-website",
      },
      {
        id: "automation",
        tag: "AUTO",
        title: "Workflow automation",
        meaning:
          "Input is captured once at the source and routed by rule to the right station.",
        value:
          "Hand-carried work disappears, and the process stops depending on one person.",
        delivers: ["Rule-based routing", "Status tracking", "Integrations"],
        projectSlug: "restaurant-qr-system",
        systemSlug: "workflow-automation",
      },
      {
        id: "reporting",
        tag: "REPORT",
        title: "Reporting",
        meaning:
          "Records become searchable, reviewable and summarizable.",
        value:
          "The state of the work is visible at a glance — without phoning anyone.",
        delivers: ["Search and filters", "Review screens", "End-of-day summaries"],
        projectSlug: "log-management-platform",
        systemSlug: "dashboard-reporting",
      },
      {
        id: "handoff",
        tag: "SHIP",
        title: "Handoff structure",
        meaning:
          "Documentation, a maintainable codebase and a clean handover leave the system with you.",
        value:
          "Not a black box tied to one person — a structure you can run after delivery.",
        delivers: ["Documentation", "Maintainable codebase", "Clean handover"],
      },
    ],
  },
};

const Z_GAP = 32;

/** Decorative isometric plane stack — cinema only; the rail owns interaction. */
const planeVariants: Variants = {
  hidden: (c: { base: number }) => ({ opacity: 0, scale: 0.9, z: c.base + 150 }),
  on: (c: { i: number; base: number; selected: boolean }) => ({
    opacity: c.selected ? 1 : 0.75,
    scale: 1,
    z: c.base + (c.selected ? 30 : 0),
    transition: { duration: 0.7, delay: 0.1 + c.i * 0.07, ease: EASE_OUT },
  }),
};

function LayerStack({
  selected,
  layers,
}: {
  selected: number;
  layers: Layer[];
}) {
  const reduceMotion = useReducedMotion();
  return (
    <div
      aria-hidden
      className="relative h-[460px] overflow-hidden [perspective:1100px]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_55%_at_50%_55%,rgba(139,140,248,0.07),transparent)]" />
      <div className="absolute top-[56%] left-1/2 [transform:rotateX(55deg)_rotateZ(-45deg)] [transform-style:preserve-3d]">
        {layers.map((layer, i) => {
          const base = (i - (layers.length - 1) / 2) * Z_GAP;
          const isSel = selected === i;
          return (
            <motion.div
              key={layer.id}
              custom={{ i, base, selected: isSel }}
              variants={planeVariants}
              initial={reduceMotion ? false : "hidden"}
              whileInView="on"
              viewport={{ once: true, margin: "-80px" }}
              className={cn(
                "absolute size-56 -translate-x-1/2 -translate-y-1/2 rounded-xl border backdrop-blur-[1px] transition-colors duration-300",
                isSel
                  ? "border-accent/60 bg-card/80 shadow-[0_0_36px_-6px_rgba(139,140,248,0.35)] ring-1 ring-accent/30"
                  : "border-border bg-card/60 ring-1 ring-white/5",
              )}
            >
              <span
                className={cn(
                  "absolute top-4 left-4 origin-top-left font-mono text-xs tracking-widest [transform:rotateZ(45deg)_rotateX(-55deg)]",
                  isSel ? "text-accent" : "text-muted-foreground/70",
                )}
              >
                {layer.tag}
              </span>
              <span
                className={cn(
                  "absolute right-4 bottom-4 size-1.5 rounded-full",
                  isSel
                    ? "bg-accent shadow-[0_0_8px_1px_rgba(139,140,248,0.6)]"
                    : "bg-muted-foreground/30",
                )}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: 0.06 + i * 0.07, ease: EASE_OUT },
  }),
};

export function SystemLayers({ locale = "tr" }: { locale?: Locale }) {
  const copy = COPY[locale];
  const reduceMotion = useReducedMotion() ?? false;
  const [selected, setSelected] = useState(1); // data model — the foundation

  const layer = copy.layers[selected];
  const lookupProject = locale === "en" ? getProjectEn : getProject;
  const proof = layer.projectSlug ? lookupProject(layer.projectSlug) : null;
  const proofHref = proof ? `${copy.projectBase}/${proof.slug}` : undefined;
  const systemHref = layer.systemSlug
    ? `${copy.systemBase}/${layer.systemSlug}`
    : undefined;

  return (
    <section className="relative py-16 md:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow={copy.eyebrow}
            title={copy.title}
            description={copy.description}
          />
        </Reveal>

        {/* concise, non-spammy status: selection is user-driven only */}
        <p className="sr-only" role="status">
          {layer.title}
        </p>

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] lg:gap-12">
          {/* cinematic decorative stack (desktop only) */}
          <div className="hidden lg:block">
            <LayerStack selected={selected} layers={copy.layers} />
          </div>

          <div>
            {/* the single control set: one rail, all breakpoints (7 controls) */}
            <Reveal>
              <div
                role="group"
                aria-label={copy.railLabel}
                className="relative"
              >
                {/* system spine with a travelling pulse */}
                <div
                  aria-hidden
                  className="absolute top-2 bottom-2 left-[7px] w-px bg-gradient-to-b from-border via-accent/40 to-border"
                >
                  {DECOR_PULSES && (
                    <span className="animate-flow-y absolute left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_8px_1px_rgba(139,140,248,0.5)]" />
                  )}
                </div>

                <ul className="space-y-1">
                  {copy.layers.map((l, i) => {
                    const isSel = selected === i;
                    return (
                      <li key={l.id} className="relative pl-6 sm:pl-7">
                        <span aria-hidden className="absolute top-1/2 left-0">
                          <span
                            className={cn(
                              "block size-[15px] -translate-y-1/2 rounded-full border transition-all duration-300",
                              isSel
                                ? "border-accent bg-accent/80 shadow-[0_0_10px_2px_rgba(139,140,248,0.4)]"
                                : "border-border bg-card",
                            )}
                          />
                          {isSel && !reduceMotion && (
                            <span className="animate-node-pulse absolute top-1/2 left-0 size-[15px] -translate-y-1/2 rounded-full border border-accent/50" />
                          )}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelected(i)}
                          aria-pressed={isSel}
                          className={cn(
                            "flex w-full items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:gap-3 sm:px-3.5",
                            isSel
                              ? "border-accent/40 bg-card/80 ring-1 ring-accent/20"
                              : "border-transparent hover:border-border hover:bg-card/50",
                          )}
                        >
                          <span
                            className={cn(
                              "shrink-0 font-mono text-xs tracking-widest",
                              isSel ? "text-accent" : "text-muted-foreground/60",
                            )}
                          >
                            {l.tag}
                          </span>
                          {/* min-w-0 lets the long layer names wrap instead of
                              forcing the row wider than a 360px viewport */}
                          <span
                            className={cn(
                              "min-w-0 flex-1 text-sm font-medium tracking-tight",
                              isSel ? "text-foreground" : "text-muted-foreground",
                            )}
                          >
                            {l.title}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Reveal>

            {/* the layer dossier: meaning + buyer value + delivered + proof */}
            <Reveal delay={0.06}>
              <div className="relative mt-5 overflow-hidden rounded-xl border border-border bg-card/60 ring-1 ring-white/5 backdrop-blur-sm">
                <div
                  aria-hidden
                  className="scanlines absolute inset-0 opacity-25"
                />
                <div className="relative p-5 md:p-6">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={layer.id}
                      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                      transition={{
                        duration: reduceMotion ? 0 : 0.28,
                        ease: EASE_OUT,
                      }}
                    >
                      <p className="text-sm leading-relaxed text-foreground/90 md:text-base">
                        {layer.meaning}
                      </p>

                      <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <motion.div
                          custom={0}
                          variants={itemVariants}
                          initial={reduceMotion ? false : "hidden"}
                          animate="show"
                        >
                          <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                            <span aria-hidden className="size-1.5 bg-accent/90" />
                            {copy.valueLabel}
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                            {layer.value}
                          </p>
                        </motion.div>

                        <motion.div
                          custom={1}
                          variants={itemVariants}
                          initial={reduceMotion ? false : "hidden"}
                          animate="show"
                        >
                          <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                            <span aria-hidden className="size-1.5 bg-accent/90" />
                            {copy.deliversLabel}
                          </p>
                          <ul className="mt-2 space-y-1.5">
                            {layer.delivers.map((d) => (
                              <li
                                key={d}
                                className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground"
                              >
                                <span
                                  aria-hidden
                                  className="mt-1.5 size-1 shrink-0 rounded-full bg-accent/70"
                                />
                                {d}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      </div>

                      {/* proof path — real project, or the process page when no
                          honest project proof exists for this layer */}
                      <motion.div
                        custom={2}
                        variants={itemVariants}
                        initial={reduceMotion ? false : "hidden"}
                        animate="show"
                        className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border/60 pt-4"
                      >
                        {proof && proofHref ? (
                          <Link
                            href={proofHref}
                            className="group inline-flex items-center gap-2 rounded-lg border border-border bg-background/50 px-3 py-1.5 text-xs transition-colors hover:border-accent/40 hover:bg-card"
                          >
                            <span
                              aria-hidden
                              className="size-1.5 rounded-full bg-accent/80"
                            />
                            <span className="font-mono tracking-widest text-muted-foreground/70 uppercase">
                              {copy.proofLabel}
                            </span>
                            <span className="text-foreground/85">
                              {proof.name}
                            </span>
                            <ArrowUpRight className="size-3.5 text-muted-foreground transition-colors group-hover:text-foreground" />
                          </Link>
                        ) : (
                          <Link
                            href={copy.processHref}
                            className="group inline-flex items-center gap-1.5 text-sm text-foreground/85 transition-colors hover:text-foreground"
                          >
                            {copy.processLink}
                            <ArrowUpRight className="size-3.5 text-accent transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                          </Link>
                        )}
                        {systemHref && (
                          <Link
                            href={systemHref}
                            className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                          >
                            {copy.systemLink}
                            <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                          </Link>
                        )}
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* inquiry path — balanced against the proof path above */}
                <div className="relative border-t border-border bg-background/30 px-5 py-4 md:px-6">
                  {/* buttonVariants sets whitespace-nowrap; this CTA's label is
                      long enough to force a 360px viewport wider than itself,
                      so it wraps and goes full-width on small screens */}
                  <Link
                    href={copy.quoteHref}
                    className={cn(
                      buttonVariants({ variant: "cta" }),
                      "h-auto min-h-11 w-full justify-center px-5 py-2.5 text-center whitespace-normal sm:w-auto",
                    )}
                  >
                    {copy.primaryCta}
                    <ArrowRight className="size-4 shrink-0" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
