import { z } from "zod";

import { fitNeeds, fitSituations, fitSystems } from "@/content/fit";
import { projects } from "@/content/projects";
import { allCanonicalRoutes } from "@/lib/routes";

/**
 * Server-side validation for the only public write endpoint on the site
 * (Phase 33C). Imported exclusively by the route handler — never by a client
 * component, so zod stays out of the browser bundle.
 *
 * Everything the client sends is treated as hostile. The rule applied throughout
 * is: anything that has a known set of legal values is checked AGAINST that set,
 * not merely against its type. `selected_fit_id`, `selected_situation`, the
 * reference project and the source path are all closed sets derived from real
 * content, so a junk value is dropped to null rather than written to the
 * database. Free text (name, message) is length-capped instead.
 */

/** Ids are locale-stable, so one pool covers both languages. */
const FIT_IDS = new Set(fitSystems.map((s) => s.id));
const SITUATION_IDS = new Set(fitSituations.map((s) => s.id));
const PROJECT_SLUGS = new Set(projects.map((p) => p.slug));
const CANONICAL_PATHS = new Set(allCanonicalRoutes);

// `fitNeeds` is imported to keep this file's dependency on the content model
// explicit — needs are folded into the message text by the wizard, not stored
// as a column, so there is nothing to validate here.
void fitNeeds;

/**
 * Deliberately not zod's email(): its rules have shifted between major versions,
 * and this is a contact field, not an identity claim. A single @ with a dot in
 * the domain rejects the obvious junk without bouncing a real, odd address.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const trimmed = (max: number) =>
  z
    .string()
    .transform((s) => s.trim())
    .pipe(z.string().max(max));

const optionalText = (max: number) =>
  z
    .string()
    .transform((s) => s.trim())
    .pipe(z.string().max(max))
    .optional()
    .transform((v) => (v ? v : undefined));

export const leadSchema = z
  .object({
    name: trimmed(120).pipe(z.string().min(1)),
    email: optionalText(200),
    phone: optionalText(40),
    message: trimmed(1500).pipe(z.string().min(1)),
    language: z.enum(["tr", "en"]),
    contactPreference: z
      .enum(["form", "email", "whatsapp", "unknown"])
      .optional(),

    selectedFitId: z.string().max(64).nullish(),
    selectedSituation: z.string().max(64).nullish(),
    referenceProjectSlug: z.string().max(120).nullish(),
    sourcePath: z.string().max(200).nullish(),

    company: z.string().max(200).optional(),
    formStartedAt: z.number().int().positive().optional(),
  })
  .refine((v) => Boolean(v.email) || Boolean(v.phone), {
    message: "email_or_phone_required",
    path: ["email"],
  })
  .refine((v) => !v.email || EMAIL_RE.test(v.email), {
    message: "invalid_email",
    path: ["email"],
  });

export type LeadInput = z.infer<typeof leadSchema>;

/** Junk in a closed-set field is dropped, not stored and not an error — a bad
 *  ?tur= in the URL must never cost a real visitor their message. */
export const cleanFitId = (v?: string | null) =>
  v && FIT_IDS.has(v) ? v : null;
export const cleanSituation = (v?: string | null) =>
  v && SITUATION_IDS.has(v) ? v : null;
export const cleanProjectSlug = (v?: string | null) =>
  v && PROJECT_SLUGS.has(v) ? v : null;
export const cleanSourcePath = (v?: string | null) =>
  v && CANONICAL_PATHS.has(v) ? v : null;

/**
 * Coarse on purpose. Three buckets are all the admin panel will ever act on,
 * and a finer parse would be a fingerprinting surface for no benefit. The raw
 * UA is stored on the lead itself for the rare case of debugging a real inquiry.
 */
export function deviceTypeFromUA(ua: string | null): string | null {
  if (!ua) return null;
  const s = ua.toLowerCase();
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/.test(s))
    return "tablet";
  if (/mobi|iphone|ipod|android|blackberry|iemobile|opera mini/.test(s)) {
    return "mobile";
  }
  return "desktop";
}

/** Derived, not asked: one fewer field on a form that must stay short. */
export function derivePreference(
  explicit: string | undefined,
  email?: string,
  phone?: string,
): "form" | "email" | "whatsapp" | "unknown" {
  if (
    explicit === "email" ||
    explicit === "whatsapp" ||
    explicit === "form" ||
    explicit === "unknown"
  ) {
    return explicit;
  }
  if (email) return "email";
  if (phone) return "whatsapp";
  return "unknown";
}

/** Bots submit in milliseconds. Humans do not. */
export const MIN_FILL_MS = 3000;
/** Rejects a clock-skewed or forged timestamp rather than trusting it. */
export const MAX_FILL_MS = 1000 * 60 * 60 * 12;
