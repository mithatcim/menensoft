"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import {
  endSession,
  getAdminConfig,
  getAdminSession,
  startSession,
  verifyPassword,
} from "@/lib/admin/auth";
import { isLeadStatus, setLeadStatus } from "@/lib/admin/leads";
import { clearRateLimit, clientHash, hitRateLimit } from "@/lib/db/rate-limit";

/**
 * Admin Server Actions (Phase 33D).
 *
 * EVERY mutating action re-checks the session itself. Guarding the layout is not
 * enough and it is worth being blunt about why: a Server Action is its own POST
 * endpoint. An attacker invokes it directly with its action id — they never load
 * the page whose layout would have stopped them. A layout check protects what
 * you can SEE; only an in-action check protects what you can DO.
 */

/** 5 failed attempts per 10 minutes per sender. */
const LOGIN_MAX = 5;
const LOGIN_WINDOW = "10 minutes";

export type LoginState = { error?: string };

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const config = getAdminConfig();
  if (!config) {
    return { error: "Admin ortam değişkenleri ayarlanmamış." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) {
    return { error: "E-posta ve parola gerekli." };
  }

  // Server Actions can't see the Request object, so the headers are read here.
  const h = await headers();
  const fakeReq = new Request("http://local/admin/login", { headers: h });
  const hash = clientHash(fakeReq, "admin-login");

  const rl = await hitRateLimit("adminLogin", hash, LOGIN_MAX, LOGIN_WINDOW);

  // FAIL CLOSED, unlike the lead limiter. The trade-off is deliberate and it
  // points the other way here: for leads, a broken limiter must never be why a
  // real lead is lost. For login, a broken limiter must never leave the only
  // door to the customer list unprotected. The cost of being wrong is a locked
  // out owner for a few minutes; the cost of the alternative is everything.
  if (rl.degraded) {
    return { error: "Giriş şu an doğrulanamıyor. Veritabanı erişilemez durumda." };
  }
  if (rl.limited) {
    return { error: "Çok fazla başarısız deneme. Birkaç dakika sonra tekrar deneyin." };
  }

  const emailOk = email.toLowerCase() === config.email.toLowerCase();
  const passwordOk = verifyPassword(password, config.passwordHash);

  // One message for both failures. "Wrong password" tells an attacker the email
  // was right, which is half the credential handed over for free.
  if (!emailOk || !passwordOk) {
    return { error: "E-posta ya da parola hatalı." };
  }

  // A few fat-fingered attempts before a correct one shouldn't leave the owner
  // sitting out the window.
  await clearRateLimit("adminLogin", hash);
  await startSession(config.email, config);
  redirect("/admin");
}

export async function logoutAction() {
  await endSession();
  redirect("/admin/login");
}

export async function updateLeadStatusAction(formData: FormData) {
  // The check that actually matters — inside the action, not on the page.
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!isLeadStatus(status)) return; // closed set; anything else is ignored
  await setLeadStatus(id, status);

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);
  revalidatePath("/admin");
}
