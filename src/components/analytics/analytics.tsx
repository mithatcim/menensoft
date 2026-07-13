"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { type AnalyticsPayload, type EventType } from "@/lib/analytics/events";
import { type Locale } from "@/lib/locale";

/**
 * First-party analytics client (Phase 33E). Renders nothing; effects only.
 *
 * It carries NO identifier — not a cookie, not a localStorage key, not a
 * fingerprint. It cannot, because it does not have one: the visitor key is
 * derived server-side from the request and never sent to the browser. Nothing is
 * written to the visitor's device, which is exactly why this site needs no
 * cookie banner.
 *
 * It also cannot break the page. Every send is fire-and-forget, wrapped, and
 * ignored on failure. A missing pageview costs nothing; a JavaScript error on a
 * sales page costs a customer.
 */

const INQUIRY = /^\/(teklif-al|en\/start-project)(\?|$)/;
const PROJECT = /^\/(projeler|en\/projects)\/([a-z0-9-]+)\/?$/;

/** Client-side DNT/GPC check. The server checks the headers too — this just
 *  saves the request entirely rather than having it answered and dropped. */
function optedOut(): boolean {
  if (typeof navigator === "undefined") return false;
  const n = navigator as Navigator & {
    doNotTrack?: string;
    globalPrivacyControl?: boolean;
    msDoNotTrack?: string;
  };
  return (
    n.doNotTrack === "1" ||
    n.globalPrivacyControl === true ||
    n.msDoNotTrack === "1" ||
    (typeof window !== "undefined" &&
      (window as unknown as { doNotTrack?: string }).doNotTrack === "1")
  );
}

export function send(payload: AnalyticsPayload): void {
  if (optedOut()) return;
  try {
    const body = JSON.stringify(payload);
    // sendBeacon survives the page being torn down by a navigation — which is
    // precisely when a click event fires. A plain fetch() is cancelled and the
    // event is lost, so every outbound click would go unrecorded.
    if (navigator.sendBeacon) {
      const ok = navigator.sendBeacon(
        "/api/e",
        new Blob([body], { type: "application/json" }),
      );
      if (ok) return;
    }
    void fetch("/api/e", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // analytics must never surface to the visitor
  }
}

/** Used by the lead forms after a CONFIRMED successful submission. */
export function track(
  type: EventType,
  locale: Locale,
  meta?: Record<string, string | number>,
): void {
  send({
    type,
    path: window.location.pathname,
    locale,
    meta,
  });
}

export function Analytics({ locale = "tr" }: { locale?: Locale }) {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);
  const startedAt = useRef<number>(0);

  // ---- page views -----------------------------------------------------------
  useEffect(() => {
    if (!pathname || lastPath.current === pathname) return;
    lastPath.current = pathname;
    startedAt.current = Date.now();

    // After paint: analytics must never be in the critical path.
    const id = window.requestAnimationFrame(() => {
      send({
        type: "page_view",
        path: pathname,
        locale,
        // The server keeps only the HOSTNAME of this and throws the rest away.
        ref: document.referrer || undefined,
      });
    });
    return () => window.cancelAnimationFrame(id);
  }, [pathname, locale]);

  // ---- one delegated click listener for the whole site ----------------------
  //
  // No per-link onClick handlers, and no markup sprawl: the hooks already exist.
  // ContactLink has emitted data-contact since Phase 33B, the language switcher
  // has emitted data-lang-switch since the bilingual work, and a CTA is simply a
  // link to the inquiry studio — which is derivable from the href. Instrumenting
  // ~30 CTAs by hand is how five get tracked and one quietly does not.
  useEffect(() => {
    const onClick = (ev: MouseEvent) => {
      const el = (ev.target as HTMLElement | null)?.closest?.(
        "a[data-contact], a[data-lang-switch], a[href], button[data-analytics-event]",
      ) as HTMLElement | null;
      if (!el) return;

      const path = window.location.pathname;
      const base: Omit<AnalyticsPayload, "type"> = { path, locale };

      const contact = el.getAttribute("data-contact");
      if (contact === "email" || contact === "whatsapp") {
        // The channel only. Never the address, never the number, never the
        // message the link is carrying.
        send({
          ...base,
          type: contact === "email" ? "email_click" : "whatsapp_click",
          meta: { channel: contact },
        });
        return;
      }

      const lang = el.getAttribute("data-lang-switch");
      if (lang === "tr" || lang === "en") {
        send({ ...base, type: "language_switch", meta: { from: locale } });
        return;
      }

      const custom = el.getAttribute("data-analytics-event");
      if (custom) {
        send({
          ...base,
          type: custom as EventType,
          meta: { label: el.textContent?.trim().slice(0, 60) ?? "" },
        });
        return;
      }

      const href = el.getAttribute("href");
      if (!href || !href.startsWith("/")) return;

      if (INQUIRY.test(href)) {
        // ?tur= and ?proje= are the funnel's own vocabulary — a system id and a
        // project slug, both from a closed set. Neither is personal data.
        const q = new URLSearchParams(href.split("?")[1] ?? "");
        const meta: Record<string, string> = { to: href.split("?")[0] };
        const fit = q.get("tur");
        const project = q.get("proje");
        if (fit) meta.fit = fit;
        if (project) meta.project = project;
        const label = el.textContent?.trim().slice(0, 60);
        if (label) meta.label = label;
        send({ ...base, type: "cta_click", meta });
        return;
      }

      const proof = PROJECT.exec(href);
      if (proof) {
        send({
          ...base,
          type: "proof_click",
          meta: { project: proof[2], to: href },
        });
      }
    };

    document.addEventListener("click", onClick, { capture: true });
    return () =>
      document.removeEventListener("click", onClick, { capture: true });
  }, [locale]);

  // ---- duration ------------------------------------------------------------
  //
  // Fired when the tab is hidden, which is the last moment we are reliably
  // allowed to send anything. It only extends the session clock; it is not an
  // interaction and does not inflate the event log. The result is still an
  // ESTIMATE — the true dwell time of the final page is unknowable — and the
  // admin UI says so rather than pretending otherwise.
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState !== "hidden" || !startedAt.current) return;
      const seconds = Math.round((Date.now() - startedAt.current) / 1000);
      if (seconds < 2 || seconds > 3600) return;
      send({
        type: "heartbeat",
        path: window.location.pathname,
        locale,
        meta: { seconds },
      });
    };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, [locale]);

  return null;
}
