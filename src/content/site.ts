/**
 * Global site identity and shared copy.
 *
 * Positioning confirmed by the site owner on 2026-07-08: systems-focused,
 * "Full Stack Developer — building complete web systems". Copy states only
 * known facts; skills list only technologies used in the projects on this
 * site.
 */

export interface SkillGroup {
  title: string;
  items: string[];
}

export type CapabilityIcon = "dashboard" | "commerce" | "app" | "automation";

export interface Capability {
  title: string;
  description: string;
  icon: CapabilityIcon;
}

export const site = {
  name: "Mithat Yılmaz",
  role: "Full Stack Developer",
  positioning: "Full Stack Developer — building complete web systems",

  // Hero
  headline: "I build complete web systems.",
  subheadline:
    "Admin panels, dashboards, storefronts, and operations tools: working software built end to end, from the database to the interface.",

  availability: "Available for selected projects",

  email: "mitopasa42@gmail.com",

  coreStack: ["TypeScript", "React", "Next.js", "Node.js", "Tailwind CSS"],
} as const;

export const capabilities: Capability[] = [
  {
    title: "Admin panels & dashboards",
    description:
      "The screens a business runs on: managing products, orders, content, and users.",
    icon: "dashboard",
  },
  {
    title: "E-commerce systems",
    description:
      "Storefronts and the management layer behind them: products, categories, and page content.",
    icon: "commerce",
  },
  {
    title: "Full-stack web applications",
    description:
      "SaaS-style products with real data models, role-based screens, and a clean interface.",
    icon: "app",
  },
  {
    title: "Automation & internal tools",
    description:
      "Purpose-built tools that replace manual workflows, like routing orders between staff roles.",
    icon: "automation",
  },
];

export const about = {
  // Reviewed in the Phase 3 content pass (2026-07-08). Nothing here should
  // stay if it isn't accurate.
  intro: [
    "I'm Mithat, a full-stack developer. I build complete web systems: the data model, the backend, and the interface people actually use.",
    "Most of my recent work is systems with an operational back side: a restaurant ordering system with waiter, kitchen, and cashier screens, a psychology practice website with its own admin panel, and the flagship build in progress, an e-commerce CMS with a visual site builder. The work ranges from active product builds to completed full-stack systems and internal prototypes. I like owning the whole build, not a slice of it.",
    "I keep scope honest, ship in small steps, and prefer reliable, well-understood technology over whatever is trending.",
  ],
  skills: [
    {
      title: "Frontend",
      items: ["TypeScript", "React", "Next.js (App Router)", "Tailwind CSS"],
    },
    {
      title: "Backend",
      items: ["Node.js", "REST APIs", "Next.js server-side", "SQL databases"],
    },
    {
      title: "Tooling & practice",
      items: ["Git & GitHub", "pnpm", "ESLint", "Playwright"],
    },
  ] satisfies SkillGroup[],
};
