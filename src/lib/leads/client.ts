import { type LeadPayload, type LeadResult } from "./types";

/**
 * Browser-side submit helper (Phase 33C). Deliberately thin and dependency-free
 * — the real validation is server-side, because that is the only place it counts.
 *
 * Never throws. Every failure path resolves to a typed `{ ok: false }`, because
 * the caller's job on failure is always the same: keep the visitor's message on
 * screen and point at email/WhatsApp. An exception escaping into a form's submit
 * handler would just be one more way to lose a lead.
 */
export async function submitLead(payload: LeadPayload): Promise<LeadResult> {
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await res.json().catch(() => null)) as LeadResult | null;
    if (data && typeof data === "object" && "ok" in data) return data;

    return { ok: false, code: "server", message: "unexpected_response" };
  } catch {
    // offline, DNS, blocked request — indistinguishable from here, and the
    // visitor's next step is the same in every case
    return { ok: false, code: "server", message: "network_error" };
  }
}
