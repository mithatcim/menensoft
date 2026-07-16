"use client";

import { ArrowRight, MessageCircle, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { ContactLink } from "@/components/shared/contact-link";
import { buttonVariants } from "@/components/ui/button";
import { campaign } from "@/content/campaign";
import { campaignEn } from "@/content/en/campaign";
import { type Locale } from "@/lib/locale";
import { cn } from "@/lib/utils";

/**
 * Entry campaign panel (Phase 42A).
 *
 * A premium, once-per-session conversion panel that guides a visitor into the
 * EXISTING inquiry wizard (/teklif-al?durum=manuel). It is client-only and never
 * server-rendered: initial state is closed, so the server and the first client
 * render both emit nothing and there is no hydration mismatch and no layout shift.
 *
 * STORAGE: one functional flag, `menensoft_campaign_seen`, in sessionStorage —
 * written only when the visitor ACTS (dismiss or CTA). It is not an identifier,
 * it is never sent to the server, and it clears when the tab closes. This is the
 * same "functional, non-identity browser storage" the language hint and the
 * wizard draft already use, and the privacy page documents it.
 *
 * It fires no analytics of its own: the CTA is a plain link to /teklif-al, which
 * the site's existing delegated listener already records as a cta_click.
 */

const SEEN_KEY = "menensoft_campaign_seen";
const DELAY_MS = 1200;

/**
 * Deny-list. Everything NOT here is a marketing surface and gets the panel — so
 * new marketing pages are covered automatically. The wizard, contact and privacy
 * pages are exactly where a campaign panel would be noise instead of help. Admin
 * has its own root layout and never mounts this component at all.
 */
const EXCLUDED = [
  "/teklif-al",
  "/iletisim",
  "/gizlilik",
  "/en/start-project",
  "/en/contact",
  "/en/privacy",
];

function isExcluded(pathname: string): boolean {
  return EXCLUDED.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function CampaignModal({ locale = "tr" }: { locale?: Locale }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const copy = locale === "en" ? campaignEn : campaign;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- portal target only exists after mount
    setMounted(true);
  }, []);

  // Arm the panel: after a short delay OR the first engagement signal, whichever
  // comes first. Re-evaluated on route change so a visitor who lands on an
  // excluded page first can still see it once they reach a marketing page.
  useEffect(() => {
    if (isExcluded(pathname)) return;

    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      // private mode / storage blocked — we simply show once and never persist
    }
    if (seen) return;

    let done = false;
    const openOnce = () => {
      if (done) return;
      done = true;
      cleanup();
      setOpen(true);
    };

    const timer = window.setTimeout(openOnce, DELAY_MS);
    // Engagement signals only — deliberately NOT click/pointerdown, so opening
    // the panel never hijacks a link the visitor is actually pressing.
    const opts = { passive: true } as const;
    window.addEventListener("scroll", openOnce, opts);
    window.addEventListener("keydown", openOnce, opts);
    window.addEventListener("touchstart", openOnce, opts);

    function cleanup() {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", openOnce);
      window.removeEventListener("keydown", openOnce);
      window.removeEventListener("touchstart", openOnce);
    }
    return cleanup;
  }, [pathname]);

  const markSeen = useCallback(() => {
    try {
      window.sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // worst case the panel may appear again on the next navigation
    }
  }, []);

  const dismiss = useCallback(() => {
    markSeen();
    setOpen(false);
  }, [markSeen]);

  // While open: Escape to close, a minimal dependency-free focus trap, and a
  // background scroll lock that compensates for the scrollbar so nothing shifts.
  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    panel?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        dismiss();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === panel)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey, true);

    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPad = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPad;
      if (previouslyFocused && document.contains(previouslyFocused)) {
        previouslyFocused.focus();
      }
    };
  }, [open, dismiss]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6">
          {/* Light scrim — a soft navy veil with a faint blur, never a black wall. */}
          <motion.div
            key="scrim"
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            onClick={dismiss}
            className="absolute inset-0 bg-foreground/20 backdrop-blur-[2px]"
          />

          <motion.div
            key="panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="campaign-title"
            aria-describedby="campaign-desc"
            tabIndex={-1}
            initial={
              reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }
            }
            transition={{
              duration: reduceMotion ? 0 : 0.28,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={cn(
              "relative z-[101] flex max-h-[85dvh] w-full flex-col overflow-y-auto outline-none",
              "border border-border bg-card text-foreground",
              "shadow-[0_24px_60px_-20px_rgba(30,27,75,0.35)]",
              "rounded-t-2xl pb-[max(1.5rem,env(safe-area-inset-bottom))]",
              "sm:max-w-lg sm:rounded-2xl sm:pb-0",
            )}
          >
            {/* accent hairline across the very top edge */}
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"
            />

            <div className="p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-xs tracking-wide text-accent">
                  <span
                    aria-hidden
                    className="size-1.5 rounded-full bg-accent"
                  />
                  {copy.offer}
                </span>
                <button
                  type="button"
                  onClick={dismiss}
                  aria-label={copy.closeLabel}
                  className="-mt-1 -mr-2 inline-flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <X className="size-5" />
                </button>
              </div>

              <h2
                id="campaign-title"
                className="mt-4 text-xl font-semibold tracking-tight text-balance sm:text-2xl"
              >
                {copy.headline}
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {copy.disclaimer}
              </p>

              <p
                id="campaign-desc"
                className="mt-4 text-sm leading-relaxed text-muted-foreground"
              >
                {copy.problem}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                {copy.solution}
              </p>

              <ul className="mt-4 space-y-2">
                {copy.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex gap-2.5 text-sm leading-relaxed text-foreground/90"
                  >
                    <span
                      aria-hidden
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-accent/80"
                    />
                    {b}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                <Link
                  href={copy.primary.href}
                  onClick={markSeen}
                  className={cn(
                    buttonVariants({ variant: "cta" }),
                    "h-11 flex-1 px-5",
                  )}
                >
                  {copy.primary.label}
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href={copy.secondary.href}
                  onClick={markSeen}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-11 flex-1 px-5",
                  )}
                >
                  {copy.secondary.label}
                </Link>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <ContactLink
                  channel="whatsapp"
                  body={copy.whatsapp.body}
                  onClick={markSeen}
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  <MessageCircle className="size-4" aria-hidden />
                  {copy.whatsapp.label}
                </ContactLink>
                <button
                  type="button"
                  onClick={dismiss}
                  className="rounded text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  {copy.close}
                </button>
              </div>

              <p className="mt-5 flex items-center gap-2 border-t border-border/60 pt-4 font-mono text-xs text-muted-foreground">
                <span aria-hidden className="size-1 rounded-full bg-accent/70" />
                {copy.trust}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
