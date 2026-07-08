/**
 * Global site identity and shared copy.
 *
 * DRAFT CONTENT — written from known facts only. Anything marked TODO
 * must be confirmed or replaced by the site owner before publishing.
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
  role: "Full Stack Developer & Digital Product Builder",

  // Hero
  headline: "I design and build digital products end to end.",
  subheadline:
    "Admin panels, e-commerce systems, ordering platforms, and internal tools — complete, working software from the database to the interface.",

  // TODO: confirm this availability statement is accurate before publishing.
  availability: "Open to new projects",

  email: "mitopasa42@gmail.com",

  coreStack: ["TypeScript", "React", "Next.js", "Node.js", "Tailwind CSS"],
} as const;

export const capabilities: Capability[] = [
  {
    title: "Admin panels & dashboards",
    description:
      "The screens a business actually runs on — managing products, orders, content, and users.",
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
      "Purpose-built tools that replace manual workflows — like routing orders between staff roles.",
    icon: "automation",
  },
];

export const about = {
  // DRAFT — short professional narrative. TODO: owner should review and
  // personalize; nothing here should stay if it isn't accurate.
  intro: [
    "I'm Mithat, a full-stack developer. I build web products end to end — the data model, the backend, and the interface people actually use.",
    "Most of my recent work is product-shaped: an e-commerce CMS with a visual site builder, a restaurant ordering system with waiter, kitchen, and cashier screens, a security log management platform, and a membership platform. I like owning the whole build, not a slice of it.",
    "I keep scope honest, ship in small steps, and prefer reliable, well-understood technology over whatever is trending.",
  ],
  // TODO: confirm the backend/tooling lists match real experience.
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
