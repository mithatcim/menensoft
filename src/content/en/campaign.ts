import { type CampaignContent } from "@/content/campaign";

/**
 * English entry campaign copy (Phase 42A). Same offer, same honest framing as the
 * Turkish version. The primary CTA uses the ENGLISH wizard route (/en/start-project)
 * with the same locale-stable situation id the wizard reads in both languages —
 * `?durum=manuel`, NOT `?status=manual` (the wizard has no `status` param).
 */
export const campaignEn: CampaignContent = {
  offer: "Free System Review",
  disclaimer:
    "A short preliminary evaluation and project conversation — not a guaranteed technical audit report.",
  headline: "Your business should run on a working system, not only a website.",
  problem:
    "Many businesses still manage work through WhatsApp, spreadsheets, manual tracking, and disconnected tools. Even with a website, orders, applications, customers, stock, appointments, or team workflows can stay scattered.",
  solution:
    "Menensoft builds web admin panels, desktop applications, integrations, automations, and custom workflow systems. First we clarify the need, then we define the right system path.",
  bullets: [
    "Clarify whether you need a web panel, desktop app, or integration",
    "Organize orders, applications, appointments, stock, or customer flows",
    "Define the scope first, then plan the right system",
  ],
  primary: {
    label: "Tell us about your process",
    href: "/en/start-project?durum=manuel",
  },
  secondary: { label: "See example systems", href: "/en/projects" },
  whatsapp: {
    label: "Message on WhatsApp",
    body: "Hi, I'd like to briefly explain my business and figure out the right system.",
  },
  close: "Not now",
  closeLabel: "Close the campaign panel",
  trust: "A system approach developed through 5 real projects.",
};
