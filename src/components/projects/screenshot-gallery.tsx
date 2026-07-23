"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/shared/reveal";
import { projectGalleries } from "@/content/project-gallery";
import { type Locale } from "@/lib/locale";

/**
 * Proje ekran görüntüsü galerisi (Phase 46). Gerçek üründen kareler: ızgarada
 * featured olanlar, lightbox'ta tamamı. Ziyaretçi denetiminin en büyük bulgusu
 * "sitede tek bir gerçek ürün görseli yok"tu — bu bileşen o boşluğu kapatır.
 * Görseller sahibinden; filigran maskeli, müşteri verisi yok.
 *
 * Lightbox document.body'ye PORTAL edilir: aksi halde proje sayfasının
 * template'indeki .page-enter animasyonu (transform) fixed konumlamayı kendi
 * kutusuna hapseder ve büyütülmüş görsel ekranı düzgün kaplamaz.
 */

const COPY = {
  tr: {
    eyebrow: "Panelden kareler",
    title: "Gerçek üründen ekran görüntüleri",
    note: (n: number) =>
      `${n} ekran — bir kareye tıklayın, ok tuşlarıyla gezinin.`,
    close: "Galeriyi kapat",
    prev: "Önceki",
    next: "Sonraki",
  },
  en: {
    eyebrow: "Inside the panel",
    title: "Screenshots from the real product",
    note: (n: number) => `${n} screens — click one, browse with arrow keys.`,
    close: "Close gallery",
    prev: "Previous",
    next: "Next",
  },
} as const;

export function ScreenshotGallery({
  slug,
  locale = "tr",
}: {
  slug: string;
  locale?: Locale;
}) {
  const items = projectGalleries[slug];
  const copy = COPY[locale];
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- portal target only exists after mount
    setMounted(true);
  }, []);

  const step = useCallback(
    (d: number) => {
      if (!items) return;
      setOpen((cur) => (cur === null ? cur : (cur + d + items.length) % items.length));
    },
    [items],
  );

  // Escape/arrows + background scroll lock (with scrollbar compensation so the
  // page underneath does not jump) while the lightbox is open.
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", onKey);
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPad = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPad;
    };
  }, [open, step]);

  if (!items?.length) return null;
  const featured = items.filter((i) => i.featured);
  const active = open !== null ? items[open] : null;

  return (
    <>
      <section className="border-t border-border/60 py-16 md:py-20">
        <Container>
          <Reveal>
            <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
              <span aria-hidden className="size-1.5 bg-accent/90" />
              {copy.eyebrow}
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
              {copy.title}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {copy.note(items.length)}
            </p>
          </Reveal>
          <Reveal delay={0.06} className="mt-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((item) => (
                <button
                  key={item.file}
                  type="button"
                  onClick={() => setOpen(items.indexOf(item))}
                  className="group overflow-hidden rounded-xl border border-border bg-card text-left shadow-sm transition-all hover:border-accent/50 hover:shadow-[0_16px_40px_-24px_rgba(49,46,129,0.35)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <span className="block overflow-hidden border-b border-border/60">
                    <Image
                      src={`/projects/${slug}/${item.file}.png`}
                      alt={locale === "en" ? item.en : item.tr}
                      width={1911}
                      height={916}
                      sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 92vw"
                      className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </span>
                  <span className="flex items-center justify-between gap-2 px-4 py-3">
                    <span className="truncate text-sm text-foreground/90">
                      {locale === "en" ? item.en : item.tr}
                    </span>
                    <span
                      aria-hidden
                      className="size-1.5 shrink-0 rounded-full bg-accent/70"
                    />
                  </span>
                </button>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      {mounted &&
        active &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={locale === "en" ? active.en : active.tr}
            className="fixed inset-0 z-[130] flex flex-col bg-foreground/70 backdrop-blur-sm"
            onClick={() => setOpen(null)}
          >
            <div
              className="flex items-center justify-between gap-3 px-4 py-3 text-background"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="min-w-0 truncate font-mono text-sm">
                {locale === "en" ? active.en : active.tr}
                <span className="ml-3 opacity-70">
                  {(open ?? 0) + 1} / {items.length}
                </span>
              </p>
              <button
                type="button"
                aria-label={copy.close}
                onClick={() => setOpen(null)}
                className="rounded-md p-2 transition-colors hover:bg-background/20 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <X className="size-5" />
              </button>
            </div>
            <div
              className="relative flex min-h-0 flex-1 items-center justify-center gap-3 px-3 pb-6 sm:px-16"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label={copy.prev}
                onClick={() => step(-1)}
                className="absolute left-2 z-10 rounded-full bg-background/90 p-2 text-foreground shadow-md transition-colors hover:bg-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none md:left-6"
              >
                <ChevronLeft className="size-5" />
              </button>
              {/* plain img: a lightbox scales to whatever the viewport is; the
                  file is a local PNG already, so next/image buys nothing here */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={active.file}
                src={`/projects/${slug}/${active.file}.png`}
                alt={locale === "en" ? active.en : active.tr}
                className="max-h-full max-w-full rounded-lg border border-border/40 object-contain shadow-2xl"
              />
              <button
                type="button"
                aria-label={copy.next}
                onClick={() => step(1)}
                className="absolute right-2 z-10 rounded-full bg-background/90 p-2 text-foreground shadow-md transition-colors hover:bg-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none md:right-6"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
