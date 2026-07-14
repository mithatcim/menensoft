import {
  FIT_IDS,
  REQUIRED_TRANSLATION_FIELDS,
  SLUG_PATTERN,
  TIERS,
  type ProjectInput,
  type TranslationInput,
} from "./admin";

import type { Locale } from "./index";

/**
 * Parse and validate the editor form (Phase 38B).
 *
 * SERVER-SIDE AND MANDATORY. The browser may also mark a field red, but that is
 * a courtesy to the owner, not a control: a Server Action is its own POST
 * endpoint and nothing stops a request from arriving without ever having loaded
 * the form. So everything the database will store is re-derived and re-checked
 * here, from the raw FormData.
 *
 * There is no HTML, no markdown, no rich text — by decision. Every field is
 * plain text, a string list, or a {name, note} pair, and each one renders into a
 * designed component. That removes the XSS surface rather than defending it: we
 * never store markup, so we never have to sanitise it on the way out. Angle
 * brackets are rejected outright in fields that reach a public page, because a
 * project name has no legitimate reason to contain one.
 */

export interface ValidationResult {
  ok: boolean;
  errors: Record<string, string>;
  input: ProjectInput;
}

/** Nothing that renders publicly may carry markup. */
const MARKUP = /[<>]/;

const MAX = {
  name: 120,
  one_liner: 300,
  problem: 2000,
  status_label: 80,
  status_note: 1200,
  similar_cta: 200,
  role: 200,
  dossier_summary: 1200,
  meta_title: 120,
  meta_description: 320,
  og_title: 120,
  og_description: 320,
  item: 300,
  internal_notes: 4000,
} as const;

function str(form: FormData, key: string): string {
  return String(form.get(key) ?? "").trim();
}

function orNull(value: string): string | null {
  return value.length > 0 ? value : null;
}

/** One item per line. Empty lines are dropped, not stored as empty strings. */
function lines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

/** `Name :: note` per line. A pair with no separator is a user error, not data. */
function parseModules(
  value: string,
  errors: Record<string, string>,
  field: string,
): { name: string; note: string }[] {
  const out: { name: string; note: string }[] = [];

  for (const line of lines(value)) {
    const at = line.indexOf("::");
    if (at === -1) {
      errors[field] = `Her satır "Ad :: Not" biçiminde olmalı. Hatalı: "${line.slice(0, 40)}"`;
      continue;
    }
    const name = line.slice(0, at).trim();
    const note = line.slice(at + 2).trim();
    if (!name || !note) {
      errors[field] = `"Ad :: Not" — iki taraf da dolu olmalı. Hatalı: "${line.slice(0, 40)}"`;
      continue;
    }
    out.push({ name, note });
  }
  return out;
}

function checkText(
  value: string,
  field: string,
  max: number,
  errors: Record<string, string>,
  { allowMarkup = false }: { allowMarkup?: boolean } = {},
): void {
  if (value.length > max) {
    errors[field] = `En fazla ${max} karakter (şu an ${value.length}).`;
  } else if (!allowMarkup && MARKUP.test(value)) {
    errors[field] = "HTML/etiket kabul edilmiyor — bu alan düz metindir.";
  }
}

function parseTranslation(
  form: FormData,
  locale: Locale,
  errors: Record<string, string>,
): TranslationInput {
  const p = (field: string) => str(form, `${locale}_${field}`);
  const key = (field: string) => `${locale}_${field}`;

  const text = {
    name: p("name"),
    one_liner: p("one_liner"),
    problem: p("problem"),
    status_label: p("status_label"),
    status_note: p("status_note"),
    similar_cta: p("similar_cta"),
    role: p("role"),
    dossier_summary: p("dossier_summary"),
    meta_title: p("meta_title"),
    meta_description: p("meta_description"),
    og_title: p("og_title"),
    og_description: p("og_description"),
  };

  for (const [field, value] of Object.entries(text)) {
    checkText(value, key(field), MAX[field as keyof typeof MAX], errors);
  }

  const built = lines(p("built"));
  const flow = lines(p("flow"));
  const constraints_list = lines(p("constraints_list"));
  const modules = parseModules(p("modules"), errors, key("modules"));

  for (const [field, list] of [
    ["built", built],
    ["flow", flow],
    ["constraints_list", constraints_list],
  ] as const) {
    const tooLong = list.find((item) => item.length > MAX.item);
    if (tooLong) {
      errors[key(field)] = `Bir satır ${MAX.item} karakteri aşıyor.`;
    } else if (list.some((item) => MARKUP.test(item))) {
      errors[key(field)] = "HTML/etiket kabul edilmiyor — bu alan düz metindir.";
    }
  }
  if (
    modules.some(
      (m) => MARKUP.test(m.name) || MARKUP.test(m.note),
    )
  ) {
    errors[key("modules")] = "HTML/etiket kabul edilmiyor — bu alan düz metindir.";
  }

  return {
    name: text.name,
    one_liner: text.one_liner,
    problem: text.problem,
    status_label: text.status_label,
    status_note: orNull(text.status_note),
    similar_cta: orNull(text.similar_cta),
    role: orNull(text.role),
    dossier_summary: orNull(text.dossier_summary),
    meta_title: orNull(text.meta_title),
    meta_description: orNull(text.meta_description),
    og_title: orNull(text.og_title),
    og_description: orNull(text.og_description),
    built,
    flow,
    constraints_list,
    modules,
  };
}

function checkUrl(
  value: string,
  field: string,
  errors: Record<string, string>,
): string | null {
  if (!value) return null;
  if (!/^https?:\/\/\S+$/.test(value)) {
    errors[field] = "https:// ile başlayan geçerli bir adres olmalı (ya da boş).";
    return null;
  }
  return value;
}

export function parseProjectForm(form: FormData): ValidationResult {
  const errors: Record<string, string> = {};

  const slug = str(form, "slug").toLowerCase();
  if (!slug) {
    errors.slug = "Slug zorunlu.";
  } else if (!SLUG_PATTERN.test(slug)) {
    // The pattern is also a CHECK constraint in the database. Both exist: this
    // one produces a sentence a human can act on, that one is the guarantee.
    errors.slug =
      "Yalnızca küçük harf, rakam ve tire; 3–60 karakter; tire ile başlayıp bitemez.";
  }

  const tier = str(form, "tier");
  if (!TIERS.includes(tier as (typeof TIERS)[number])) {
    errors.tier = "Geçersiz tür.";
  }

  const fitRaw = str(form, "fit_id");
  let fit_id: string | null = null;
  if (fitRaw) {
    if (!FIT_IDS.includes(fitRaw)) errors.fit_id = "Bilinmeyen sistem türü.";
    else fit_id = fitRaw;
  }

  const sortRaw = str(form, "sort_order");
  const sort_order = Number.parseInt(sortRaw || "0", 10);
  if (!Number.isInteger(sort_order) || sort_order < 0 || sort_order > 999) {
    errors.sort_order = "0–999 arası bir tam sayı olmalı.";
  }

  const stack = lines(str(form, "stack"));
  if (stack.some((item) => MARKUP.test(item) || item.length > MAX.item)) {
    errors.stack = "Her satır düz metin ve kısa olmalı.";
  }

  const year = str(form, "year");
  if (year && !/^[0-9]{4}(-[0-9]{4})?$/.test(year)) {
    errors.year = "Yıl 2024 ya da 2024-2025 biçiminde olmalı (ya da boş).";
  }

  const live_url = checkUrl(str(form, "live_url"), "live_url", errors);
  const repo_url = checkUrl(str(form, "repo_url"), "repo_url", errors);

  const image = str(form, "image");
  if (image && !/^\/[\w\-./]*$/.test(image) && !/^https?:\/\/\S+$/.test(image)) {
    errors.image =
      "/gorseller/ornek.png gibi bir yol ya da https:// ile başlayan bir adres olmalı.";
  }

  const image_alt = str(form, "image_alt");
  checkText(image_alt, "image_alt", MAX.one_liner, errors);

  const internal_notes = str(form, "internal_notes");
  // Internal notes never reach a visitor, so markup is harmless here — but the
  // ceiling still applies.
  checkText(internal_notes, "internal_notes", MAX.internal_notes, errors, {
    allowMarkup: true,
  });

  const translations = {
    tr: parseTranslation(form, "tr", errors),
    en: parseTranslation(form, "en", errors),
  };

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    input: {
      slug,
      tier: tier as (typeof TIERS)[number],
      fit_id,
      featured: form.get("featured") === "on",
      sort_order: Number.isInteger(sort_order) ? sort_order : 0,
      stack,
      year: orNull(year),
      live_url,
      repo_url,
      image: orNull(image),
      image_alt: orNull(image_alt),
      internal_notes: orNull(internal_notes),
      translations,
    },
  };
}

const FIELD_LABEL: Record<string, string> = {
  name: "başlık",
  one_liner: "tek cümle",
  problem: "problem",
  status_label: "durum etiketi",
};

/**
 * Publish rules. A project that exists in one language would publish a broken
 * hreflang pair — the sitemap promises a counterpart that says nothing.
 */
export function publishBlockers(input: ProjectInput): string[] {
  const blockers: string[] = [];

  for (const locale of ["tr", "en"] as const) {
    const missing = REQUIRED_TRANSLATION_FIELDS.filter(
      (field) => !input.translations[locale][field]?.trim(),
    ).map((field) => FIELD_LABEL[field]);

    if (missing.length > 0) {
      blockers.push(
        `${locale.toUpperCase()} eksik: ${missing.join(", ")}.`,
      );
    }
  }
  return blockers;
}
