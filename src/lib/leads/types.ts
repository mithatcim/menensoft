/**
 * The wire contract between the forms and /api/lead (Phase 33C).
 *
 * Dependency-free on purpose: this is imported by client components, and the
 * zod schema that actually validates it lives in `validate.ts`, which only the
 * route handler imports. The browser never needs the validator, so it never
 * ships it.
 */

export type Locale = "tr" | "en";
export type ContactPreference = "form" | "email" | "whatsapp" | "unknown";

export interface LeadPayload {
  name: string;
  email?: string;
  phone?: string;
  message: string;
  language: Locale;
  contactPreference?: ContactPreference;

  selectedFitId?: string | null;
  selectedSituation?: string | null;
  referenceProjectSlug?: string | null;
  sourcePath?: string | null;

  /** Honeypot. A human never sees this field, so a human never fills it. */
  company?: string;
  /** Epoch ms when the form was first rendered — bots submit implausibly fast. */
  formStartedAt?: number;
}

/**
 * Why the failure matters: the UI reacts differently to each. `unconfigured`
 * and `server` mean "the database let you down, not you" — the message is kept
 * and email/WhatsApp are offered. `validation` means "fix a field".
 */
export type LeadErrorCode =
  "validation" | "rate_limit" | "unconfigured" | "server";

export type LeadResult =
  | { ok: true; id: string }
  | { ok: false; code: LeadErrorCode; message: string; field?: string };
