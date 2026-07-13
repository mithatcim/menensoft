"use client";

import { Languages, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { alternatePathFor, type Locale } from "@/lib/locale";
import { cn } from "@/lib/utils";

/**
 * Language suggestion banner (Phase 33F).
 *
 * A SUGGESTION, never a redirect. Phase 33A settled this: Googlebot crawls
 * predominantly from US IP addresses, so an IP-based redirect from "/" to "/en"
 * would show Google an English page where the Turkish homepage should be — and
 * quietly push the canonical root of a Turkish-language business out of the
 * Turkish index. That risk lands on rankings, where you would not notice it for
 * weeks. A banner costs one click and risks nothing.
 *
 * So: no middleware, no geolocation, no IP lookup, no server involvement at all.
 * The only signal is `navigator.languages`, which the visitor's own browser
 * already sends everywhere.
 *
 * STORAGE: one functional flag in localStorage, written only when the visitor
 * ACTS — dismisses or switches. It records a choice they made; it is not an
 * identifier, it is never sent to the server, and it has nothing to do with
 * analytics (which remains cookieless and storage-free by design). This is why
 * the site still needs no consent banner.
 */

const KEY = "menensoft_language_hint";

const COPY = {
  tr: {
    // Shown on a Turkish page to someone whose browser is not Turkish.
    message: "Bu sayfanın İngilizce sürümü de var.",
    action: "English",
    dismiss: "Kapat",
    dismissLabel: "Dil önerisini kapat",
  },
  en: {
    // Shown on an English page to someone whose browser prefers Turkish.
    message: "Bu sayfa Türkçe olarak da mevcut.",
    action: "Türkçe",
    dismiss: "Dismiss",
    dismissLabel: "Dismiss language suggestion",
  },
} as const;

/** True when the browser's preferred languages include Turkish. */
function prefersTurkish(): boolean {
  const langs = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];
  return langs.some((l) => l.toLowerCase().startsWith("tr"));
}

export function LanguageHint({ locale = "tr" }: { locale?: Locale }) {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  // Decided after mount, never during render — and this one genuinely cannot be
  // a lazy initializer. The server has no idea what languages this browser
  // prefers or what it has stored, so deciding during render would produce a
  // hydration mismatch on every single page. A one-off read on mount is correct
  // here; there is no render cascade.
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(KEY);
    } catch {
      // private mode / storage blocked — then we simply never suggest anything
    }
    if (stored) return; // already chose or dismissed: never nag again

    const turkish = prefersTurkish();
    // Suggest only when the browser disagrees with the page. A Turkish speaker
    // on a Turkish page gets nothing, which is the common case and should stay
    // silent.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only signal, unavailable during render
    setShow(locale === "tr" ? !turkish : turkish);
  }, [locale, pathname]);

  if (!show) return null;

  const copy = COPY[locale];
  // The equivalent page, not the homepage. The same mapping the header switcher
  // uses, so /projeler/<slug> lands on /en/projects/<slug> rather than on /en.
  const target = alternatePathFor(pathname);

  const remember = (value: "switched" | "dismissed") => {
    try {
      window.localStorage.setItem(KEY, value);
    } catch {
      // nothing to do — the banner just may appear again next visit
    }
    setShow(false);
  };

  return (
    // IN FLOW, not a floating overlay — and this is the whole point.
    //
    // It started as a fixed bar pinned to the bottom of the viewport, and QA
    // caught it sitting on top of "Bu sistemi konuşalım" and a proof link. A
    // fixed overlay ALWAYS covers something at some scroll position; padding the
    // body only rescues the very bottom of the page, not the middle. A CTA a
    // banner is covering is a CTA nobody clicks, and this site's entire job is
    // getting that click.
    //
    // So it reserves its own space, directly under the header, and scrolls away
    // with the page. It covers nothing, it blocks nothing, and it cannot be
    // mistaken for a cookie wall — which is the other thing it must never be.
    <div
      role="region"
      aria-label={locale === "tr" ? "Dil önerisi" : "Language suggestion"}
      className="border-b border-border bg-card/60"
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-2">
        <Languages aria-hidden className="size-4 shrink-0 text-accent" />

        <p className="min-w-0 text-sm text-foreground/90">{copy.message}</p>

        {/* A real link to the equivalent page — not the homepage. Landing a
            visitor on the wrong page is a worse outcome than the wrong language.
            It carries data-lang-switch, so Phase 33E's delegated listener records
            it as a language_switch exactly like the header switcher. */}
        <Link
          href={target}
          hrefLang={locale === "tr" ? "en" : "tr"}
          data-lang-switch={locale === "tr" ? "en" : "tr"}
          onClick={() => remember("switched")}
          className={cn(
            "shrink-0 rounded-md border border-accent/40 bg-accent/10 px-2.5 py-1 font-mono text-xs text-accent transition-colors hover:bg-accent/20",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
          )}
        >
          {copy.action}
        </Link>

        <button
          type="button"
          onClick={() => remember("dismissed")}
          aria-label={copy.dismissLabel}
          title={copy.dismiss}
          className={cn(
            "-mr-1 shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
          )}
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
