import { createHash } from "node:crypto";

/**
 * Cookieless visitor identity (Phase 33E).
 *
 * The identifier is derived ON THE SERVER and never leaves it:
 *
 *   visitor_key = sha256(ANALYTICS_SALT + UTC-date + ip + user-agent + "menensoft")
 *
 * The IP is used in memory to compute the hash and is written nowhere — there is
 * no IP column in any table. The salt includes the current UTC date, so the same
 * person gets a different key tomorrow and cannot be followed across days.
 *
 * That single property is what buys the whole design: nothing is stored on the
 * visitor's device, so there is no cookie, no localStorage, no fingerprint — and
 * therefore no cookie banner on a lead-generation site. The cost is that we
 * cannot answer "did yesterday's visitor come back today?". This business does
 * not need that answer.
 *
 * The client never sees the key, never sends one, and has no identifier of any
 * kind to send.
 */

const SCOPE = "menensoft";

/** UTC, not local time: the rotation boundary must not depend on server timezone. */
export function saltForToday(base: string, now = new Date()): string {
  const day = now.toISOString().slice(0, 10); // YYYY-MM-DD
  return `${base}:${day}`;
}

export function isAnalyticsConfigured(): boolean {
  return Boolean(process.env.ANALYTICS_SALT);
}

/**
 * Returns null when ANALYTICS_SALT is unset. An unsalted hash of an IP + UA is
 * reversible in practice — the address space is small enough to enumerate — so
 * "no salt" must mean "no analytics", never "analytics with a weak key".
 */
export function visitorKey(req: Request, now = new Date()): string | null {
  const base = process.env.ANALYTICS_SALT;
  if (!base) return null;

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const ua = req.headers.get("user-agent") ?? "";

  return createHash("sha256")
    .update(`${saltForToday(base, now)}|${ip}|${ua}|${SCOPE}`)
    .digest("hex");
}

/**
 * Do Not Track / Global Privacy Control. Neither is legally binding everywhere,
 * and honouring them costs two lines and a rounding error in the numbers. Not
 * honouring them costs the right to claim this is privacy-conscious.
 */
export function optedOut(req: Request): boolean {
  return req.headers.get("dnt") === "1" || req.headers.get("sec-gpc") === "1";
}

/**
 * Coarse on purpose — three buckets are all the admin panel acts on, and a finer
 * parse would be a fingerprinting surface for no benefit. The raw UA is never
 * stored for analytics (only on a real lead, for debugging a real inquiry).
 */
export function deviceType(
  ua: string | null,
): "mobile" | "tablet" | "desktop" | "unknown" {
  if (!ua) return "unknown";
  const s = ua.toLowerCase();
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/.test(s))
    return "tablet";
  if (/mobi|iphone|ipod|android|blackberry|iemobile|opera mini/.test(s))
    return "mobile";
  return "desktop";
}

/**
 * Bots are dropped at WRITE time, not filtered at read time. Polluted analytics
 * cannot be un-polluted later, and every query downstream would have to remember
 * to exclude them.
 */
const BOT =
  /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|quora|pinterest|vkshare|whatsapp|telegram|discord|slack|preview|headless|lighthouse|pagespeed|gtmetrix|curl|wget|python-requests|axios|node-fetch|go-http|java\/|okhttp|postman|monitor|uptime|pingdom|semrush|ahrefs|mj12|dotbot|petal|yandex|baidu|sogou|duckduck|applebot|amazonbot|gptbot|claudebot|ccbot|perplexity/i;

export function isBot(ua: string | null): boolean {
  if (!ua || ua.length < 10) return true; // no UA at all is not a person
  return BOT.test(ua);
}

/**
 * HOST ONLY. A full referrer URL can carry the visitor's search query, a private
 * document path, or a token in a query string. Storing it would quietly turn an
 * analytics table into a leak of somebody else's site.
 */
export function referrerHost(
  referrer: string | null | undefined,
): string | null {
  if (!referrer) return null;
  try {
    const host = new URL(referrer).hostname.toLowerCase();
    if (!host || /[/?#]/.test(host)) return null;
    return host.slice(0, 120);
  } catch {
    return null;
  }
}
