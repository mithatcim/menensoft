"use client";

import {
  AppWindow,
  ArrowRight,
  ArrowUpRight,
  CircuitBoard,
  LayoutDashboard,
  ShoppingCart,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { Fragment, useState } from "react";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { projectsEn } from "@/content/en/projects";
import { projects } from "@/content/projects";
import { type Locale } from "@/lib/locale";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Capability Console: a selectable console of the five kinds of systems on
 * offer. Each channel shows what it means, what gets built, an abstract mini
 * flow, and cross-links to the real projects that exercise it. The
 * capability→project mapping below is derived strictly from each project's
 * published built-list — no invented proof, no metrics.
 */

interface Channel {
  id: string;
  icon: LucideIcon;
  label: string;
  meaning: string;
  builds: string[];
  flow: [string, string, string];
  /** Slugs of real projects whose built-lists exercise this capability. */
  provenIn: string[];
}

const CHANNELS_EN: Channel[] = [
  {
    id: "ecommerce",
    icon: ShoppingCart,
    label: "E-commerce systems",
    meaning: "The storefront and the management layer behind it — editable without code.",
    builds: [
      "Product catalog and category structure",
      "Clean, fast storefront product pages",
      "Content management for non-technical editors",
      "Order and stock screens",
    ],
    flow: ["Storefront", "Admin", "Orders"],
    provenIn: ["ecommerce-cms"],
  },
  {
    id: "admin",
    icon: LayoutDashboard,
    label: "Admin panels",
    meaning: "Internal tools your team signs into and runs the day on.",
    builds: [
      "Management screens for your core data",
      "Role-based access to sensitive areas",
      "Search, filtering and fast data tables",
      "Clean forms with proper validation",
    ],
    flow: ["Data", "Screens", "Roles"],
    provenIn: ["ecommerce-cms", "orva-psychology"],
  },
  {
    id: "dashboards",
    icon: AppWindow,
    label: "Dashboard screens",
    meaning: "Operational screens showing the state of the work at a glance.",
    builds: [
      "Live operational views for daily work",
      "Role-specific screens for each job",
      "Lists, filters and states that stay current",
      "Clear status without digging",
    ],
    flow: ["Events", "Views", "Action"],
    provenIn: ["restaurant-qr-system", "log-management-platform"],
  },
  {
    id: "automation",
    icon: Workflow,
    label: "Automation tools",
    meaning: "Purpose-built software that takes over a manual workflow.",
    builds: [
      "The current manual process mapped honestly",
      "A tool sized to the workflow, not a platform fantasy",
      "Integration with the systems you already use",
      "Documentation your team can follow",
    ],
    flow: ["Input", "Rules", "Routing"],
    provenIn: ["restaurant-qr-system", "cendovar"],
  },
  {
    id: "operational",
    icon: CircuitBoard,
    label: "Operations systems",
    meaning: "Multi-role systems where one captured input flows to every station that needs it.",
    builds: [
      "The workflow captured once, at the source",
      "A separate screen for each station in the flow",
      "State shared across every role",
      "Built to carry a working day",
    ],
    flow: ["Capture", "Flow", "Every role"],
    provenIn: ["restaurant-qr-system", "log-management-platform"],
  },
];

const CHANNELS: Channel[] = [
  {
    id: "ecommerce",
    icon: ShoppingCart,
    label: "E-ticaret sistemleri",
    meaning:
      "Vitrin ve arkasındaki yönetim katmanı — kod bilmeden düzenlenebilir.",
    builds: [
      "Ürün kataloğu ve kategori yapısı",
      "Temiz ve hızlı vitrin ürün sayfaları",
      "Teknik olmayan editörler için içerik yönetimi",
      "Sipariş ve stok ekranları",
    ],
    flow: ["Vitrin", "Yönetim", "Sipariş"],
    provenIn: ["ecommerce-cms"],
  },
  {
    id: "admin",
    icon: LayoutDashboard,
    label: "Yönetim panelleri",
    meaning: "Ekibinizin giriş yapıp günü yönettiği iç araçlar.",
    builds: [
      "Çekirdek verileriniz için yönetim ekranları",
      "Hassas alanlara rol bazlı erişim",
      "Arama, filtreleme ve hızlı veri tabloları",
      "Doğru doğrulamalı temiz formlar",
    ],
    flow: ["Veri", "Ekranlar", "Roller"],
    provenIn: ["ecommerce-cms", "orva-psychology"],
  },
  {
    id: "dashboards",
    icon: AppWindow,
    label: "Dashboard ekranları",
    meaning:
      "İşin anlık durumunu tek bakışta gösteren operasyon ekranları.",
    builds: [
      "Günlük iş için canlı operasyon görünümleri",
      "Her görev için role özel ekranlar",
      "Güncel kalan listeler, filtreler ve durumlar",
      "Aramadan görünen net durum bilgisi",
    ],
    flow: ["Olaylar", "Görünümler", "Aksiyon"],
    provenIn: ["restaurant-qr-system", "log-management-platform"],
  },
  {
    id: "automation",
    icon: Workflow,
    label: "Otomasyon araçları",
    meaning: "Manuel bir iş akışının yerini alan, amaca özel yazılım.",
    builds: [
      "Mevcut manuel sürecin dürüstçe haritalanması",
      "Platform fantezisi değil, iş akışına göre ölçülmüş bir araç",
      "Halihazırda kullandığınız sistemlerle entegrasyon",
      "Ekibinizin takip edebileceği dokümantasyon",
    ],
    flow: ["Girdi", "Kurallar", "Yönlendirme"],
    provenIn: ["restaurant-qr-system", "cendovar"],
  },
  {
    id: "operational",
    icon: CircuitBoard,
    label: "Operasyon sistemleri",
    meaning:
      "Tek bir girdinin ihtiyacı olan her istasyona aktığı çok rollü sistemler.",
    builds: [
      "İş akışı kaynağında bir kez yakalanır",
      "Akıştaki her istasyon için ayrı ekran",
      "Tüm roller arasında paylaşılan durum",
      "Bir iş gününü taşıyacak şekilde kurulur",
    ],
    flow: ["Yakala", "Akıt", "Her rol"],
    provenIn: ["restaurant-qr-system", "log-management-platform"],
  },
];

function MiniFlow({ flow }: { flow: [string, string, string] }) {
  return (
    <div aria-hidden className="flex flex-wrap items-center gap-1.5">
      {flow.map((node, i) => (
        <Fragment key={node}>
          {i > 0 && <ArrowRight className="size-3 shrink-0 text-accent/60" />}
          <span className="rounded-md border border-border bg-background/50 px-2.5 py-1 font-mono text-xs text-foreground/80">
            {node}
          </span>
        </Fragment>
      ))}
    </div>
  );
}

function ChannelDetail({
  channel,
  locale,
}: {
  channel: Channel;
  locale: Locale;
}) {
  const pool = locale === "en" ? projectsEn : projects;
  const provenLabel = locale === "en" ? "Proven in" : "Kanıtlandığı projeler";
  const projectBase = locale === "en" ? "/en/projects" : "/projeler";
  const proven = channel.provenIn
    .map((slug) => pool.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="p-5 md:p-6">
      <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
        {channel.meaning}
      </p>
      <div className="mt-4">
        <MiniFlow flow={channel.flow} />
      </div>
      <ul className="mt-5 space-y-2 border-t border-border/60 pt-4">
        {channel.builds.map((item) => (
          <li
            key={item}
            className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
          >
            <span aria-hidden className="mt-2 size-1 shrink-0 bg-accent/80" />
            {item}
          </li>
        ))}
      </ul>
      {proven.length > 0 && (
        <div className="mt-5 border-t border-border/60 pt-4">
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            {provenLabel}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {proven.map((project) => (
              <Link
                key={project.slug}
                href={`${projectBase}/${project.slug}`}
                className="group flex items-center gap-2 rounded-lg border border-border bg-background/50 px-3 py-1.5 text-sm transition-colors hover:border-accent/40 hover:bg-card"
              >
                <span
                  aria-hidden
                  className="size-1.5 rounded-full bg-accent/80"
                />
                <span className="text-foreground/85">{project.name}</span>
                <span className="font-mono text-xs text-muted-foreground/70">
                  {locale === "en" ? project.statusLabel.toLowerCase() : project.statusLabel.toLocaleLowerCase("tr-TR")}
                </span>
                <ArrowUpRight className="size-3.5 text-muted-foreground transition-colors group-hover:text-foreground" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const CONSOLE_HEADINGS = {
  tr: {
    eyebrow: "Yetkinlik konsolu",
    title: "Neler kuruluyor",
    description:
      "Beş sistem türü, tek çatı altında. Bir kanal seçin; neyi kapsadığını ve hangi projelerde kanıtlandığını inceleyin.",
  },
  en: {
    eyebrow: "Capability console",
    title: "What gets built",
    description:
      "Five kinds of systems, one owner. Select a channel to see what it covers and where it has been proven.",
  },
} as const;

export function CapabilityConsole({ locale = "tr" }: { locale?: Locale }) {
  const [selected, setSelected] = useState(0);
  const reduceMotion = useReducedMotion();
  const channels = locale === "en" ? CHANNELS_EN : CHANNELS;
  const heading = CONSOLE_HEADINGS[locale];
  const channel = channels[selected];

  return (
    <section className="relative py-16 md:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_0%,rgba(139,140,248,0.05),transparent)]"
      />
      <Container className="relative">
        <Reveal>
          <SectionHeading
            eyebrow={heading.eyebrow}
            title={heading.title}
            description={heading.description}
          />
        </Reveal>

        {/* desktop: channel rail + detail viewport */}
        <Reveal delay={0.06} className="mt-12 hidden md:block">
          <div className="overflow-hidden rounded-xl border border-border bg-border">
            <div className="grid grid-cols-[minmax(0,300px)_minmax(0,1fr)] gap-px">
              <ul className="flex flex-col gap-px bg-border">
                {channels.map((c, i) => {
                  const Icon = c.icon;
                  const isSel = selected === i;
                  return (
                    <li key={c.id} className="flex-1 bg-card">
                      <button
                        type="button"
                        onClick={() => setSelected(i)}
                        aria-pressed={isSel}
                        className={cn(
                          "relative flex h-full w-full items-center gap-3 px-5 py-4 text-left transition-colors duration-300",
                          isSel ? "bg-muted/25" : "hover:bg-muted/15",
                        )}
                      >
                        <span
                          aria-hidden
                          className={cn(
                            "absolute inset-y-0 left-0 w-0.5 transition-colors duration-300",
                            isSel ? "bg-accent" : "bg-transparent",
                          )}
                        />
                        <Icon
                          className={cn(
                            "size-4.5 shrink-0 transition-colors",
                            isSel ? "text-accent" : "text-muted-foreground",
                          )}
                        />
                        <span
                          className={cn(
                            "text-sm font-medium tracking-tight",
                            isSel ? "text-foreground" : "text-muted-foreground",
                          )}
                        >
                          {c.label}
                        </span>
                        <span
                          className={cn(
                            "ml-auto font-mono text-xs transition-colors",
                            isSel ? "text-accent" : "text-muted-foreground/40",
                          )}
                        >
                          {isSel ? "on" : `0${i + 1}`}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="relative bg-card">
                <div aria-hidden className="scanlines absolute inset-0 opacity-40" />
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={channel.id}
                    initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                    transition={{ duration: reduceMotion ? 0 : 0.28, ease: EASE_OUT }}
                    className="relative"
                  >
                    <ChannelDetail channel={channel} locale={locale} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Reveal>

        {/* mobile: accordion console */}
        <div className="mt-10 space-y-2 md:hidden">
          {channels.map((c, i) => {
            const Icon = c.icon;
            const isSel = selected === i;
            return (
              <Reveal key={c.id} delay={i * 0.04}>
                <button
                  type="button"
                  onClick={() => setSelected(i)}
                  aria-pressed={isSel}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all duration-300",
                    isSel
                      ? "border-accent/40 bg-card/80 ring-1 ring-accent/20"
                      : "border-border bg-card/50",
                  )}
                >
                  <Icon
                    className={cn(
                      "size-4 shrink-0",
                      isSel ? "text-accent" : "text-muted-foreground",
                    )}
                  />
                  <span className="text-sm font-medium tracking-tight">
                    {c.label}
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "ml-auto size-1.5 rounded-full",
                      isSel ? "bg-accent" : "bg-muted-foreground/25",
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isSel && (
                    <motion.div
                      key="detail"
                      initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: reduceMotion ? 0 : 0.3, ease: EASE_OUT }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 rounded-xl border border-accent/20 bg-card/60">
                        <ChannelDetail channel={c} locale={locale} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
