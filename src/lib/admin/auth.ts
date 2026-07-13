import {
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";

import { cookies } from "next/headers";

/**
 * Single-owner admin auth (Phase 33D).
 *
 * There is one admin. That fact is the design: a user table, a signup route, a
 * password-reset flow and a session store are all machinery for a problem this
 * project does not have — and every one of them is another door to leave
 * unlocked. So the credential lives in env, the session is a signed cookie, and
 * there is no registration route to forget to protect.
 *
 * Zero dependencies: Node's crypto does scrypt and HMAC. No auth library.
 *
 * Threat model, stated plainly. This protects against: password guessing (scrypt
 * + a database-backed login limiter), cookie forgery (HMAC over the payload),
 * cookie theft via JS (httpOnly), and CSRF (SameSite=Lax + Server Actions, which
 * are POST-only and same-origin). It does NOT protect against someone who has
 * your env vars — at that point they have DATABASE_URL too and the cookie is the
 * least of it.
 */

const COOKIE = "menensoft_admin";
const SESSION_DAYS = 7;
/** Scoped to /admin so the public site never carries the admin cookie at all. */
const COOKIE_PATH = "/admin";

export interface AdminConfig {
  email: string;
  passwordHash: string;
  sessionSecret: string;
}

/**
 * Admin env is optional at build time, exactly like DATABASE_URL. A local
 * `pnpm build` must not require real credentials — the admin routes render a
 * "setup needed" state instead, and they expose nothing while doing it.
 */
export function getAdminConfig(): AdminConfig | null {
  const email = process.env.ADMIN_EMAIL;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  if (!email || !passwordHash || !sessionSecret) return null;
  return { email, passwordHash, sessionSecret };
}

/* ------------------------------- password -------------------------------- */

/**
 * Format: scrypt:N:r:p:saltHex:hashHex — the parameters travel with the hash, so
 * they can be raised later without invalidating existing ones.
 *
 * COLONS, NOT DOLLARS. The conventional PHC form is `scrypt$N$r$p$salt$hash`,
 * and it is unusable here: this value lives in a .env file, and dotenv performs
 * variable expansion, so `$16384` is read as a reference to a variable named
 * `1` followed by the text `6384`. The hash silently arrives at the app as
 * "scrypt6384" and every correct password is rejected — with no error, because
 * nothing failed. It just doesn't match.
 *
 * Do not "fix" this back to dollars.
 */
export function hashPassword(password: string): string {
  const N = 16384;
  const r = 8;
  const p = 1;
  const salt = randomBytes(16);
  const key = scryptSync(password.normalize("NFKC"), salt, 64, { N, r, p });
  return `scrypt:${N}:${r}:${p}:${salt.toString("hex")}:${key.toString("hex")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [scheme, N, r, p, saltHex, hashHex] = stored.split(":");
    if (scheme !== "scrypt") return false;

    const salt = Buffer.from(saltHex, "hex");
    const expected = Buffer.from(hashHex, "hex");
    const actual = scryptSync(password.normalize("NFKC"), salt, expected.length, {
      N: Number(N),
      r: Number(r),
      p: Number(p),
    });

    // Constant-time: a plain === leaks how many leading bytes matched, which is
    // enough to reconstruct a hash one byte at a time given enough attempts.
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

/* -------------------------------- session -------------------------------- */

const b64url = (b: Buffer) => b.toString("base64url");

function sign(payload: string, secret: string): string {
  return b64url(createHmac("sha256", secret).update(payload).digest());
}

function createToken(email: string, secret: string): string {
  const exp = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = b64url(Buffer.from(JSON.stringify({ sub: email, exp })));
  return `${payload}.${sign(payload, secret)}`;
}

function readToken(token: string, config: AdminConfig): string | null {
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;

  const expected = sign(payload, config.sessionSecret);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const { sub, exp } = JSON.parse(
      Buffer.from(payload, "base64url").toString(),
    ) as { sub: string; exp: number };

    if (typeof exp !== "number" || Date.now() > exp) return null;
    // The email is re-checked against env on every request, so rotating
    // ADMIN_EMAIL invalidates every outstanding session for free.
    if (sub !== config.email) return null;
    return sub;
  } catch {
    return null;
  }
}

export async function startSession(email: string, config: AdminConfig) {
  const store = await cookies();
  store.set(COOKIE, createToken(email, config.sessionSecret), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: COOKIE_PATH,
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function endSession() {
  const store = await cookies();
  store.delete({ name: COOKIE, path: COOKIE_PATH });
}

/**
 * The single source of truth for "is this request the owner?".
 *
 * Called by the protected layout AND independently inside every Server Action.
 * A layout check alone is not protection: Server Actions are their own POST
 * endpoints and are invoked directly, not through the page that rendered the
 * form. Guarding only the page would leave the mutations wide open.
 */
export async function getAdminSession(): Promise<string | null> {
  const config = getAdminConfig();
  if (!config) return null;

  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;

  return readToken(token, config);
}
