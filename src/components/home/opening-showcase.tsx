"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { ArrowLeft, ArrowRight, ArrowUpRight, MoveHorizontal } from "lucide-react";
import { useReducedMotion } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/shared/reveal";
import { fitSystemsEn } from "@/content/en/fit";
import { getProjectEn } from "@/content/en/projects";
import { fitSystems } from "@/content/fit";
import { getProject } from "@/content/projects";
import { type Locale } from "@/lib/locale";
import { DECOR_PULSES } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Opening Sales Showcase V2 — the kinetic sales stage (Phase 20).
 *
 * The homepage's first section and the site's first impression. Six real buyer
 * problems on a draggable, autoplaying perspective stage: problem → what
 * Menensoft builds → system type → the real project it already runs in →
 * a prefilled inquiry CTA.
 *
 * Deliberately NOT a slider: no dots, no oversized arrows, no equal-weight
 * cards. The active card is large and bright, its neighbours are scaled,
 * dimmed and angled away on a perspective field, and progress is a segmented
 * rail rather than pips.
 *
 * Embla drives drag/snap/loop only — it is headless, so every pixel here is
 * ours. It is used for two things Motion does not give us: clickAllowed()
 * (so a drag that ends on a link does not navigate) and correct touch-action
 * handling (so a horizontal drag never steals vertical page scroll).
 *
 * All content is derived from existing truth: system labels and slugs come
 * from the wizard's fit options, proof from real projects, and each CTA
 * prefills the wizard with an id `?tur=` actually recognizes. Nothing is
 * invented — no metrics, no clients, no fake dashboards.
 */

type EmblaApi = NonNullable<UseEmblaCarouselType[1]>;

interface StageItem {
  /** A real wizard fit id — drives the system label, slug and ?tur= prefill. */
  fitId: string;
  /** Short, recognizable statement of the buyer's problem. */
  headline: string;
  /** The problem in a little more detail — what it costs the business. */
  detail: string;
  /** What Menensoft builds in response. */
  builds: string;
  /** Real project that proves this system type; honest links only. */
  projectSlug: string;
}

interface StageCopy {
  eyebrow: string;
  title: string;
  sub: string;
  stageLabel: string;
  prev: string;
  next: string;
  goTo: (n: number, total: number) => string;
  problemLabel: string;
  buildsLabel: string;
  proofLabel: string;
  primary: string;
  systemLink: string;
  dragHint: string;
  quoteBase: string;
  projectBase: string;
  systemBase: string;
  items: StageItem[];
}

const COPY: Record<Locale, StageCopy> = {
  tr: {
    eyebrow: "Sizi ne yavaşlatıyor?",
    title: "İşinizi yavaşlatan akışı, çalışan bir sisteme çevirelim.",
    sub: "Altı gerçek işletme problemi. Her biri için ne kurulduğunu, hangi projede çalıştığını ve nereden başlayacağınızı görün.",
    stageLabel: "İşletme problemleri ve çözüm sistemleri",
    prev: "Önceki problem",
    next: "Sonraki problem",
    goTo: (n, total) => `${n} / ${total} — bu probleme geç`,
    problemLabel: "Problem",
    buildsLabel: "Menensoft ne kurar",
    proofLabel: "Kanıt",
    // "Bu sistemi konuşalım", not "Benzer sistemi konuşalım": on the homepage the
    // visitor hasn't seen a project yet, so "similar" has nothing to be similar
    // to. This also matches ServicesPreview — one system-level CTA, one wording.
    primary: "Bu sistemi konuşalım",
    systemLink: "Sistem detayını incele",
    dragHint: "Sürükleyin",
    quoteBase: "/teklif-al",
    projectBase: "/projeler",
    systemBase: "/sistemler",
    items: [
      {
        fitId: "operasyon",
        headline: "Siparişler üç ayrı kanalda dağılıyor.",
        detail:
          "WhatsApp, telefon ve Excel arasında gidip gelen talepler yoğun saatte kayboluyor; kimin neyi aldığı ancak sorularak öğreniliyor.",
        builds:
          "Akış tek bir operasyon sistemine toplanır: sipariş kaynağında bir kez alınır, mutfak, kasa ve saha kendi ekranında aynı durumu görür.",
        projectSlug: "restaurant-qr-system",
      },
      {
        fitId: "kurumsal-site",
        headline: "Her içerik değişikliği geliştiriciye takılıyor.",
        detail:
          "Kurumsal siteniz var ama yönetim paneliniz yok. Bir fiyat, bir metin ya da yeni bir hizmet eklemek için sıraya girmeniz gerekiyor.",
        builds:
          "Site, panelle birlikte kurulur: içerik ve gelen talepler geliştirici beklemeden yönetilir.",
        projectSlug: "orva-psychology",
      },
      {
        fitId: "e-ticaret",
        headline: "Hazır paketin sınırına takıldınız.",
        detail:
          "E-ticaret çalışıyor ama ölçeklenmiyor. İstediğiniz her değişiklik ya eklenti bekliyor ya da mümkün değil.",
        builds:
          "Vitrin ve yönetim katmanı tek altyapıda toplanır; ürünler ve sayfalar kod yazmadan yönetilir.",
        projectSlug: "ecommerce-cms",
      },
      {
        fitId: "dashboard",
        headline: "İşin durumunu öğrenmek için telefon açmak gerekiyor.",
        detail:
          "Raporlama dağınık; veriler farklı yerlerde duruyor ve tek bakışta görünen net bir tablo yok.",
        builds:
          "Kayıtlar aranabilir, incelenebilir ekranlara taşınır; işin anlık durumu tek bakışta görünür.",
        projectSlug: "log-management-platform",
      },
      {
        fitId: "otomasyon",
        headline: "Aynı işi her gün elle tekrar ediyorsunuz.",
        detail:
          "Tekrarlanan adımlar ekibin saatlerini yiyor ve süreç kişiye bağımlı ilerlediği için hata üretiyor.",
        builds:
          "Manuel akış kurala bağlanır: girdi bir kez yakalanır, gerisi sistemde kendi başına ilerler.",
        projectSlug: "cendovar",
      },
      {
        fitId: "yonetim-paneli",
        headline: "Kimin neyi değiştirdiği belli değil.",
        detail:
          "İş verisi tablolarda ve mesaj gruplarında yaşıyor; yetki yok, doğrulama yok, geri dönüp bakma imkânı yok.",
        builds:
          "Veri, rol bazlı yetkili ekranlara taşınır: yetki, doğrulama ve izlenebilirlik birlikte gelir.",
        projectSlug: "ecommerce-cms",
      },
    ],
  },
  en: {
    eyebrow: "What's slowing you down?",
    title: "Turn the flow that slows your business into a working system.",
    sub: "Six real business problems. For each one, see what gets built, the project it already runs in, and where to start.",
    stageLabel: "Business problems and the systems that solve them",
    prev: "Previous problem",
    next: "Next problem",
    goTo: (n, total) => `${n} / ${total} — go to this problem`,
    problemLabel: "Problem",
    buildsLabel: "What Menensoft builds",
    proofLabel: "Proof",
    primary: "Discuss this system",
    systemLink: "View system detail",
    dragHint: "Drag to explore",
    quoteBase: "/en/start-project",
    projectBase: "/en/projects",
    systemBase: "/en/systems",
    items: [
      {
        fitId: "operasyon",
        headline: "Orders are scattered across three channels.",
        detail:
          "Requests bounce between WhatsApp, phone calls and spreadsheets, and work gets lost at rush hour. Who took what is anyone's guess.",
        builds:
          "The flow is gathered into one operations system: the order is captured once at the source, and kitchen, till and floor each see the same status on their own screen.",
        projectSlug: "restaurant-qr-system",
      },
      {
        fitId: "kurumsal-site",
        headline: "Every content change waits on a developer.",
        detail:
          "You have a corporate site but no admin panel. Changing a price, a paragraph or adding a service means joining a queue.",
        builds:
          "The site ships with its panel: content and incoming inquiries are managed without waiting on anyone.",
        projectSlug: "orva-psychology",
      },
      {
        fitId: "e-ticaret",
        headline: "You've hit the ceiling of a ready-made package.",
        detail:
          "E-commerce works but doesn't scale. Every change you want either waits on a plugin or simply isn't possible.",
        builds:
          "Storefront and management layer are gathered into one infrastructure; products and pages are managed without touching code.",
        projectSlug: "ecommerce-cms",
      },
      {
        fitId: "dashboard",
        headline: "Finding out where the work stands means phoning someone.",
        detail:
          "Reporting is scattered, the data sits in different places, and there is no clear picture at a glance.",
        builds:
          "Records move into searchable, reviewable screens; the state of the work becomes visible at a glance.",
        projectSlug: "log-management-platform",
      },
      {
        fitId: "otomasyon",
        headline: "You redo the same work by hand every day.",
        detail:
          "Repetitive steps eat the team's hours, and because the process depends on one person, it produces mistakes.",
        builds:
          "The manual flow is put on rules: input is captured once, and the rest moves through the system on its own.",
        projectSlug: "cendovar",
      },
      {
        fitId: "yonetim-paneli",
        headline: "Nobody knows who changed what.",
        detail:
          "Business data lives in spreadsheets and chat threads: no permissions, no validation, no way to look back.",
        builds:
          "Data moves into role-based, authorized screens: permissions, validation and traceability come together.",
        projectSlug: "ecommerce-cms",
      },
    ],
  },
};

/**
 * Depth falloff. Higher = neighbours drop away faster from the centre.
 * At 0.75 an immediately-adjacent card sits at ~0.75 of full falloff, which is
 * what actually makes the stage read as a stage: at the first value I tried
 * (0.42) the neighbours were barely dimmed or angled and the whole thing still
 * looked like a flat row of equal cards.
 */
const TWEEN_FACTOR_BASE = 0.75;

export function OpeningShowcase({ locale = "tr" }: { locale?: Locale }) {
  const copy = COPY[locale];
  const total = copy.items.length;
  const reduceMotion = useReducedMotion() ?? false;

  const fitPool = locale === "en" ? fitSystemsEn : fitSystems;
  const lookupProject = locale === "en" ? getProjectEn : getProject;

  // Lazy useState, not useRef: the plugin instance must be stable across
  // renders AND readable during render (to hand to useEmblaCarousel), and
  // reading a ref during render is exactly what react-hooks/refs forbids.
  //
  // playOnInit: false — autoplay only starts once the stage is actually in
  // view (see the IntersectionObserver below), never while it is off-screen.
  const [autoplay] = useState(() =>
    Autoplay({
      delay: 5200,
      playOnInit: false,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
      stopOnFocusIn: true,
    }),
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", duration: 28, skipSnaps: false },
    [autoplay],
  );

  const sectionRef = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState(0);
  const [interacted, setInteracted] = useState(false);
  /** rotateY/translateZ only where it reads well — mobile stays flat. */
  const [depth, setDepth] = useState(false);

  const tweenNodes = useRef<HTMLElement[]>([]);
  const tweenFactor = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setDepth(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const setTweenNodes = useCallback((api: EmblaApi) => {
    tweenNodes.current = api
      .slideNodes()
      .map((slide) => slide.querySelector(".stage-card") as HTMLElement);
  }, []);

  const setTweenFactor = useCallback((api: EmblaApi) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * api.scrollSnapList().length;
  }, []);

  /**
   * Scale/dim/angle each card by its distance from the centre of the stage.
   * Driven by Embla's scroll progress, so it tracks the drag 1:1 rather than
   * snapping between states — that continuity is what makes it read as a
   * physical stage instead of a slider.
   */
  const applyDepth = useCallback(
    (api: EmblaApi, eventName?: string) => {
      const engine = api.internalEngine();
      const scrollProgress = api.scrollProgress();
      const slidesInView = api.slidesInView();
      const isScroll = eventName === "scroll";

      api.scrollSnapList().forEach((scrollSnap, snapIndex) => {
        let diffToTarget = scrollSnap - scrollProgress;
        const slidesInSnap = engine.slideRegistry[snapIndex];

        slidesInSnap.forEach((slideIndex) => {
          if (isScroll && !slidesInView.includes(slideIndex)) return;

          // a looping slide can be rendered on the far side of the track;
          // measure the distance it is actually being drawn at
          if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach((loopItem) => {
              const target = loopItem.target();
              if (slideIndex === loopItem.index && target !== 0) {
                const sign = Math.sign(target);
                if (sign === -1) {
                  diffToTarget = scrollSnap - (1 + scrollProgress);
                }
                if (sign === 1) {
                  diffToTarget = scrollSnap + (1 - scrollProgress);
                }
              }
            });
          }

          const node = tweenNodes.current[slideIndex];
          if (!node) return;

          const raw = diffToTarget * tweenFactor.current;
          const distance = Math.min(Math.abs(raw), 1); // 0 = dead centre
          const side = Math.sign(raw); // <0 left of centre, >0 right

          const scale = 1 - 0.16 * distance;
          const opacity = 1 - 0.55 * distance;
          const rotate = depth ? -side * 12 * distance : 0;
          const z = depth ? -120 * distance : 0;

          node.style.transform = `translateZ(${z.toFixed(2)}px) rotateY(${rotate.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
          node.style.opacity = opacity.toFixed(3);
        });
      });
    },
    [depth],
  );

  const clearDepth = useCallback(() => {
    tweenNodes.current.forEach((node) => {
      if (!node) return;
      node.style.transform = "";
      node.style.opacity = "";
    });
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    setTweenNodes(emblaApi);
    setTweenFactor(emblaApi);

    // reduced motion: cards stay flat, full-strength and readable; the stage
    // degrades to a plain draggable rail with no depth animation at all
    if (reduceMotion) {
      clearDepth();
      return;
    }

    applyDepth(emblaApi);
    emblaApi
      .on("reInit", setTweenNodes)
      .on("reInit", setTweenFactor)
      .on("reInit", applyDepth)
      .on("scroll", applyDepth)
      .on("slideFocus", applyDepth);

    return () => {
      emblaApi
        .off("reInit", setTweenNodes)
        .off("reInit", setTweenFactor)
        .off("reInit", applyDepth)
        .off("scroll", applyDepth)
        .off("slideFocus", applyDepth);
    };
  }, [
    emblaApi,
    reduceMotion,
    setTweenNodes,
    setTweenFactor,
    applyDepth,
    clearDepth,
  ]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    const onPointerDown = () => setInteracted(true);
    onSelect();
    emblaApi.on("select", onSelect).on("reInit", onSelect);
    emblaApi.on("pointerDown", onPointerDown);
    return () => {
      emblaApi.off("select", onSelect).off("reInit", onSelect);
      emblaApi.off("pointerDown", onPointerDown);
    };
  }, [emblaApi]);

  // Autoplay runs only while the stage is on screen, never under reduced
  // motion, and never again once the visitor has engaged with it.
  useEffect(() => {
    if (!emblaApi || reduceMotion || interacted) return;
    const node = sectionRef.current;
    if (!node) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!autoplay.isPlaying()) autoplay.play();
        } else {
          autoplay.stop();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(node);
    return () => {
      io.disconnect();
      autoplay.stop();
    };
  }, [emblaApi, reduceMotion, interacted, autoplay]);

  const scrollTo = useCallback(
    (index: number) => {
      setInteracted(true);
      emblaApi?.scrollTo(index);
    },
    [emblaApi],
  );

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!emblaApi) return;
    const keys: Record<string, () => void> = {
      ArrowLeft: () => emblaApi.scrollPrev(),
      ArrowRight: () => emblaApi.scrollNext(),
      Home: () => emblaApi.scrollTo(0),
      End: () => emblaApi.scrollTo(total - 1),
    };
    const action = keys[event.key];
    if (!action) return;
    event.preventDefault();
    setInteracted(true);
    action();
  };

  const activeItem = copy.items[selected];
  const activeFit = fitPool.find((f) => f.id === activeItem.fitId);

  return (
    <section
      ref={sectionRef}
      onKeyDown={onKeyDown}
      className="relative flex min-h-[85vh] flex-col justify-center overflow-hidden border-b border-border/60 py-12 md:py-14"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="bg-grid mask-radial-faded absolute inset-0 opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_0%,rgba(139,140,248,0.12),transparent)]" />
      </div>

      {/* Announces only the active system, and only once the visitor has
          engaged — so the pre-interaction autoplay never spams assistive tech. */}
      <p className="sr-only" role="status">
        {interacted && activeFit ? activeFit.label : ""}
      </p>

      <Container className="relative">
        <Reveal>
          <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
            <span
              aria-hidden
              className="size-1.5 rounded-full bg-accent shadow-[0_0_8px_1px_rgba(139,140,248,0.6)]"
            />
            {copy.eyebrow}
          </p>
          <h1 className="mt-5 max-w-4xl text-3xl font-semibold tracking-tight text-balance md:text-5xl md:leading-[1.08] lg:text-6xl lg:leading-[1.06]">
            {copy.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground md:text-lg">
            {copy.sub}
          </p>
        </Reveal>
      </Container>

      {/* The stage. Full-bleed on purpose: the neighbouring cards must run off
          both edges of the screen, which is what makes it read as a stage you
          are looking into rather than a widget sitting in a column. */}
      <div
        className="relative mt-8 overflow-hidden [perspective:1600px] md:mt-10"
        role="group"
        aria-roledescription="carousel"
        aria-label={copy.stageLabel}
      >
        {/* Drag-vs-link is handled by Embla itself: its drag handler binds a
            capture-phase click listener on this root and preventDefault()s the
            click once the pointer has travelled past dragThreshold. So a drag
            that happens to end on top of a card's CTA does not navigate, while
            a genuine click still does. That behaviour — plus correct
            touch-action so a horizontal drag never steals vertical page scroll
            — is the whole reason this section carries the dependency. */}
        <div ref={emblaRef} className="overflow-hidden">
          <div className="-ml-4 flex touch-pan-y md:-ml-6 [transform-style:preserve-3d]">
            {copy.items.map((item, index) => {
              const fit = fitPool.find((f) => f.id === item.fitId);
              const proof = lookupProject(item.projectSlug);
              const systemHref = fit?.systemSlug
                ? `${copy.systemBase}/${fit.systemSlug}`
                : undefined;
              const isActive = index === selected;

              return (
                <div
                  key={`${item.fitId}-${index}`}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} / ${total}`}
                  onFocusCapture={() => {
                    if (index !== selected) scrollTo(index);
                  }}
                  className="min-w-0 flex-[0_0_86%] pl-4 sm:flex-[0_0_66%] md:pl-6 lg:flex-[0_0_640px] xl:flex-[0_0_700px]"
                >
                  {/* .stage-card is the node the depth tween transforms.
                      No backdrop-blur here on purpose: compositing a blur on
                      six large moving cards is the one thing guaranteed to
                      make this stage jank. The blur lives on the static
                      background instead. */}
                  <article
                    className={cn(
                      "stage-card relative flex h-full flex-col rounded-2xl border p-5 ring-1 transition-[border-color,box-shadow] duration-500 md:p-8",
                      isActive
                        ? "border-accent/40 bg-card/90 ring-accent/20 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.9)]"
                        : "border-border bg-card/70 ring-white/5",
                    )}
                  >
                    {isActive && (
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(139,140,248,0.10),transparent)]"
                      />
                    )}

                    {/* card-internal motion: a pulse travelling the active
                        card's top edge. Decorative, gated by DECOR_PULSES and
                        killed by the global reduced-motion rule. */}
                    {isActive && (
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent md:inset-x-8"
                      >
                        {DECOR_PULSES && (
                          <span className="animate-flow-x absolute top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_8px_1px_rgba(139,140,248,0.7)]" />
                        )}
                      </div>
                    )}

                    <div className="relative flex items-center justify-between gap-3">
                      <span
                        className={cn(
                          "truncate rounded-md border px-2.5 py-1 font-mono text-xs transition-colors duration-500",
                          isActive
                            ? "border-accent/40 bg-accent/10 text-accent"
                            : "border-border bg-background/50 text-muted-foreground",
                        )}
                      >
                        {fit?.label}
                      </span>
                      <span
                        aria-hidden
                        className="shrink-0 font-mono text-xs text-muted-foreground/40"
                      >
                        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                      </span>
                    </div>

                    <p className="relative mt-5 flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground/70 uppercase md:mt-6">
                      <span
                        aria-hidden
                        className="size-1.5 rotate-45 border border-muted-foreground/50"
                      />
                      {copy.problemLabel}
                    </p>
                    <h2 className="relative mt-2.5 text-lg leading-snug font-semibold tracking-tight text-balance md:mt-3 md:text-2xl">
                      {item.headline}
                    </h2>
                    <p className="relative mt-2.5 text-sm leading-relaxed text-pretty text-muted-foreground md:mt-3 md:text-base">
                      {item.detail}
                    </p>

                    <p className="relative mt-5 flex items-center gap-2 border-t border-border/60 pt-5 font-mono text-xs tracking-widest text-muted-foreground uppercase md:mt-6 md:pt-6">
                      <span aria-hidden className="size-1.5 bg-accent/90" />
                      {copy.buildsLabel}
                    </p>
                    <p className="relative mt-2.5 text-sm leading-relaxed text-pretty text-foreground/85 md:mt-3">
                      {item.builds}
                    </p>

                    <div className="relative mt-auto pt-5 md:pt-6">
                      {proof && (
                        <Link
                          href={`${copy.projectBase}/${proof.slug}`}
                          className="group/proof flex w-full min-w-0 items-center gap-2 rounded-lg border border-border bg-background/50 px-3 py-2 text-xs transition-colors hover:border-accent/40 hover:bg-card"
                        >
                          <span
                            aria-hidden
                            className="size-1.5 shrink-0 rounded-full bg-accent/80"
                          />
                          <span className="shrink-0 font-mono tracking-widest text-muted-foreground/70 uppercase">
                            {copy.proofLabel}
                          </span>
                          <span className="min-w-0 flex-1 truncate text-foreground/85">
                            {proof.name}
                          </span>
                          <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground transition-colors group-hover/proof:text-foreground" />
                        </Link>
                      )}

                      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
                        <Link
                          href={`${copy.quoteBase}?tur=${item.fitId}`}
                          className={cn(
                            "group/cta inline-flex items-center justify-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                            isActive
                              ? "border-accent/50 bg-accent/15 text-foreground hover:border-accent/70 hover:bg-accent/20"
                              : "border-accent/30 bg-accent/5 text-foreground/90 hover:border-accent/50",
                          )}
                        >
                          {copy.primary}
                          <ArrowRight className="size-3.5 shrink-0 text-accent transition-transform group-hover/cta:translate-x-0.5" />
                        </Link>
                        {systemHref && (
                          <Link
                            href={systemHref}
                            className="group/sys inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                          >
                            {copy.systemLink}
                            <ArrowUpRight className="size-3.5 shrink-0 transition-transform group-hover/sys:-translate-y-0.5 group-hover/sys:translate-x-0.5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Controls: a segmented progress rail (not dots), a drag hint that
          retires once the visitor has engaged, and small demoted arrows. */}
      <Container className="relative mt-8">
        <div className="flex items-center gap-5">
          <p
            className={cn(
              "hidden shrink-0 items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground/60 uppercase transition-opacity duration-500 sm:flex",
              interacted && "opacity-0",
            )}
          >
            <MoveHorizontal aria-hidden className="size-3.5" />
            {copy.dragHint}
          </p>

          <div className="flex min-w-0 flex-1 items-center gap-1.5">
            {copy.items.map((item, index) => (
              <button
                key={`seg-${item.fitId}-${index}`}
                type="button"
                onClick={() => scrollTo(index)}
                aria-label={copy.goTo(index + 1, total)}
                aria-current={index === selected}
                className="group/seg relative h-6 min-w-0 flex-1 outline-none"
              >
                <span
                  className={cn(
                    "absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full transition-colors duration-300 group-hover/seg:bg-foreground/40 group-focus-visible/seg:bg-foreground/60",
                    index === selected ? "bg-accent" : "bg-border",
                  )}
                />
                {index === selected && (
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_10px_1px_rgba(139,140,248,0.6)]"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setInteracted(true);
                emblaApi?.scrollPrev();
              }}
              aria-label={copy.prev}
              className="flex size-9 items-center justify-center rounded-lg border border-border bg-card/60 text-muted-foreground transition-colors outline-none hover:border-foreground/25 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setInteracted(true);
                emblaApi?.scrollNext();
              }}
              aria-label={copy.next}
              className="flex size-9 items-center justify-center rounded-lg border border-border bg-card/60 text-muted-foreground transition-colors outline-none hover:border-foreground/25 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
