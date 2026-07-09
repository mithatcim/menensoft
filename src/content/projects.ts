/**
 * Project case-study content.
 *
 * Statuses and featured selection were confirmed by the site owner on
 * 2026-07-08 (Phase 3 content pass + credibility-safety correction).
 * Labels say "completed"/"built as", never "in use", until real-world usage
 * is explicitly confirmed. Descriptions state only what exists; no clients,
 * metrics, or production claims are invented. Optional fields (year,
 * outcome, liveUrl, repoUrl) are omitted until real values exist — never
 * filled with placeholders.
 */

export type ProjectStatus =
  | "active-build"
  | "completed-system"
  | "completed-website"
  | "prototype"
  | "archived";

export const projectStatusLabel: Record<ProjectStatus, string> = {
  "active-build": "Active product build",
  "completed-system": "Completed full-stack system",
  "completed-website": "Completed website & admin panel",
  prototype: "Internal product prototype",
  archived: "Archived prototype",
};

export interface Project {
  slug: string;
  name: string;
  oneLiner: string;
  problem: string;
  built: string[];
  stack: string[];
  status: ProjectStatus;
  featured: boolean;
  /** Year(s) of the build — only when confirmed. */
  year?: string;
  /** Who built it and in what capacity. */
  role?: string;
  /** One honest sentence about where the project stands right now. */
  statusNote?: string;
  /** Abstract system flow, derived strictly from what was built. */
  flow?: string[];
  /** A verifiable result — only when one actually exists. */
  outcome?: string;
  liveUrl?: string;
  repoUrl?: string;
  /**
   * Path to a real interface screenshot under /public (e.g.
   * "/projects/ecommerce-cms/builder.png"). Omit until a real capture exists;
   * the UI falls back to an honest "capture to be added" slot.
   */
  image?: string;
  imageAlt?: string;
}

/** Frame image for a project, or undefined when no real capture exists yet. */
export function projectImage(project: Project) {
  if (!project.image) return undefined;
  return {
    src: project.image,
    alt: project.imageAlt ?? `${project.name} interface`,
  };
}

export const projects: Project[] = [
  {
    slug: "ecommerce-cms",
    name: "E-commerce CMS & Visual Site Builder",
    oneLiner:
      "A content-managed e-commerce system where store pages are assembled visually instead of hard-coded.",
    problem:
      "Running an online store usually means juggling a shop system and a separate site builder. This combines the two: the same admin that manages products also manages the pages that sell them.",
    built: [
      "Product and category management",
      "Storefront with product and category pages",
      "Admin dashboard for editing products",
      "Visual page-building for storefront content",
    ],
    stack: ["Next.js", "TypeScript", "React", "Tailwind CSS"],
    status: "active-build",
    featured: true,
    role: "Designed and built end to end",
    statusNote:
      "In active development as the flagship product build. The admin, storefront, and visual page-building already work together; screenshots and architecture notes will be added as the product matures.",
    flow: ["Admin & CMS", "Visual page builder", "Storefront"],
  },
  {
    slug: "restaurant-qr-system",
    name: "Restaurant QR Menu & Operations System",
    oneLiner:
      "QR-code menu ordering connected to dedicated waiter, kitchen, and cashier screens.",
    problem:
      "Orders taken verbally get lost between the table, the kitchen, and the register. Here the order is captured once, at the table, and flows to every role that needs it.",
    built: [
      "QR menu that guests open at the table",
      "Waiter screen for managing table orders",
      "Kitchen display for incoming orders",
      "Cashier flow for settling bills",
    ],
    stack: ["Next.js", "TypeScript", "React"],
    status: "completed-system",
    featured: true,
    role: "Designed and built end to end",
    statusNote:
      "Built as a full-stack operations system where orders move from QR menu to waiter, kitchen, and cashier screens.",
    flow: ["QR menu", "Waiter screen", "Kitchen display", "Cashier"],
  },
  {
    slug: "orva-psychology",
    name: "Orva Psychology — Website & Admin Panel",
    oneLiner:
      "A website for a psychology practice, paired with an admin panel for managing its content.",
    problem:
      "A practice site is only useful if the people running the practice can update it themselves, without touching code.",
    built: [
      "Public-facing practice website",
      "Admin panel for managing site content",
    ],
    stack: ["Next.js", "TypeScript", "React"],
    status: "completed-website",
    featured: true,
    role: "Designed and built end to end",
    statusNote:
      "Built as a website and admin panel for a psychology practice, with content management and appointment request flows.",
    flow: ["Admin panel", "Content management", "Public website"],
  },
  {
    slug: "log-management-platform",
    name: "Security Log Management Platform",
    oneLiner:
      "A platform for collecting, storing, and reviewing security event logs in one place.",
    problem:
      "Security-relevant logs scattered across systems are useless in an incident. Centralizing them makes retention and review a workflow instead of an archaeology project.",
    built: [
      "Centralized log collection and storage",
      "Interface for searching and reviewing log records",
    ],
    stack: ["TypeScript", "Node.js"],
    status: "prototype",
    featured: false,
    role: "Designed and built end to end",
    statusNote:
      "An early internal prototype focused on log collection, storage, and review. Hardening, retention policy, and compliance work are out of scope at this stage.",
    flow: ["Log collection", "Storage", "Search & review"],
  },
  {
    slug: "cendovar",
    name: "Cendovar — Membership & Signal Platform",
    oneLiner:
      "A membership platform that publishes notification-style signal records to its subscribed members.",
    problem:
      "Delivering gated content to members needs real account, access, and publishing mechanics, not a mailing list held together with tape.",
    built: [
      "Membership accounts and subscription handling",
      "Publishing signal records to subscribed members",
    ],
    stack: ["Next.js", "TypeScript", "React"],
    status: "archived",
    featured: false,
    role: "Designed and built end to end",
    statusNote:
      "An archived prototype. The membership, access, and publishing mechanics were built and working before the project was set aside.",
    flow: ["Membership & access", "Publishing", "Member delivery"],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
