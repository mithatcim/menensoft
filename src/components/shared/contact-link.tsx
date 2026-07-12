import { type ComponentPropsWithoutRef } from "react";

import { site } from "@/content/site";

/**
 * The single place the site builds an email or WhatsApp link (Phase 33B).
 *
 * These links were previously hand-rolled in six files. That was fine while
 * they were inert, but Phase 33 wants to know whether a visitor actually
 * reached for a channel — and "add an onClick to every anchor" is how you end
 * up with five of them tracked and one quietly missed.
 *
 * So each link carries `data-contact="email" | "whatsapp"`. A single delegated
 * listener can pick every one of them up later without touching a call site
 * again. Deliberately NOT a client component: a `data-` attribute costs nothing
 * and keeps these pages shipping zero JavaScript, which is exactly what the
 * static site is for.
 *
 * There is no tracking here yet, and there must not be until Phase 33E.
 */

export type ContactChannel = "email" | "whatsapp";

/** `mailto:` with optional prefilled subject/body. Both are percent-encoded. */
export function mailtoHref({
  subject,
  body,
}: { subject?: string; body?: string } = {}): string | undefined {
  if (!site.email) return undefined;
  const params: string[] = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${site.email}${params.length ? `?${params.join("&")}` : ""}`;
}

/** `wa.me` with optional prefilled text. */
export function whatsappHref(text?: string): string | undefined {
  if (!site.whatsappUrl) return undefined;
  return text
    ? `${site.whatsappUrl}?text=${encodeURIComponent(text)}`
    : site.whatsappUrl;
}

interface ContactLinkProps extends Omit<
  ComponentPropsWithoutRef<"a">,
  "href" | "children"
> {
  channel: ContactChannel;
  /** Email only — ignored for WhatsApp, which has no subject. */
  subject?: string;
  /** Prefilled message. The email body and the WhatsApp text are the same text. */
  body?: string;
  children: React.ReactNode;
}

/**
 * Renders nothing when the channel has no real value in site config — the same
 * "no placeholder channels" rule the contact page has always followed.
 */
export function ContactLink({
  channel,
  subject,
  body,
  children,
  ...rest
}: ContactLinkProps) {
  const href =
    channel === "email" ? mailtoHref({ subject, body }) : whatsappHref(body);
  if (!href) return null;

  return (
    <a
      href={href}
      data-contact={channel}
      {...(channel === "whatsapp"
        ? { target: "_blank", rel: "noreferrer" }
        : {})}
      {...rest}
    >
      {children}
    </a>
  );
}
