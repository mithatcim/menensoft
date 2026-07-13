/**
 * The analytics wire contract (Phase 33E).
 *
 * Dependency-free: imported by client components, so nothing heavy comes with it.
 * Validation lives server-side in the route, which is the only place it counts.
 */

export const EVENT_TYPES = [
  "session_start",
  "page_view",
  "cta_click",
  "proof_click",
  "email_click",
  "whatsapp_click",
  "form_submit",
  "language_switch",
  "heartbeat",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

/**
 * What the browser is allowed to send. Note what is NOT here and cannot be:
 * no identifier (the client has none), no IP, no user-agent, no message, no
 * email, no phone. The server derives everything sensitive from the request
 * itself, so the client has nothing worth lying about.
 */
export interface AnalyticsPayload {
  type: EventType;
  path: string;
  locale: "tr" | "en";
  /** Full referrer — the SERVER reduces it to a hostname and discards the rest. */
  ref?: string;
  /** Small, bounded, non-personal. See ALLOWED_META_KEYS in the route. */
  meta?: Record<string, string | number>;
}
