import { site, type SkillGroup } from "@/content/site";

/**
 * English site identity and shared copy. Adapted — not literally translated —
 * for natural, business-focused English. Same honesty rules as the Turkish
 * content: founder-led positioning, no invented clients, metrics or claims.
 */

export const siteEn = {
  ...site,
  role: "Working web systems for businesses",
  positioning: "Menensoft — working web systems for businesses",
  headline: "Web systems that run your business.",
  subheadline:
    "E-commerce infrastructure, admin panels, dashboards and operations systems: custom software delivered working, from the database to the interface.",
  availability: "Open to new projects",
};

export const aboutEn = {
  intro: [
    "Menensoft is a software brand that builds working web systems for businesses. Behind the brand is one founder and developer — Mithat Yılmaz — who designs and builds every layer of a system end to end, from the data model to the interface.",
    "Most recent work is systems with a real operations side: a restaurant ordering system with waiter, kitchen and cashier screens; a psychology clinic website with its own admin panel; an e-commerce CMS with a visual page builder. The preference is always the same — deliver a working system, not a static page.",
    "Scope stays honest, work ships in small reviewable steps, and the stack favors reliable, well-understood technology over whatever is trending.",
  ],
  skills: [
    {
      title: "Frontend",
      items: ["TypeScript", "React", "Next.js (App Router)", "Tailwind CSS"],
    },
    {
      title: "Backend",
      items: ["Node.js", "REST APIs", "Next.js server side", "SQL databases"],
    },
    {
      title: "Tools & practice",
      items: ["Git & GitHub", "pnpm", "ESLint", "Playwright"],
    },
  ] satisfies SkillGroup[],
  principles: [
    "Build the whole system, not a single screen.",
    "Keep admin workflows practical.",
    "Make data, interface and operations fit together.",
    "Clear scope instead of inflated promises.",
    "Ship in small, reviewable steps.",
    "Design for maintainability and handoff.",
  ],
  stackPhilosophy:
    "One deliberately chosen, practical stack: TypeScript end to end, Next.js for interface and server side, Node.js and SQL databases behind it, Tailwind for disciplined UI. Reliable, well-understood technology over trends — because a system you can actually run is worth more than a stack you can brag about.",
  builds: [
    "E-commerce systems",
    "Admin panels & dashboards",
    "Workflow & operations tools",
    "Corporate sites with content management",
    "Prototype-to-product system development",
  ],
  avoids: [
    "Screens with no system behind them",
    "Vague scope",
    "Made-up metrics",
    "Unnecessary complexity",
    "Trend-chasing showmanship",
    "Animation that hurts usability",
  ],
  tooling:
    "Modern tooling including AI-assisted development speeds up planning, building and review — always with review discipline, never instead of it.",
};
