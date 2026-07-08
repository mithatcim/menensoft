/**
 * Project case-study content.
 *
 * DRAFT CONTENT — every entry is an honest draft derived from the project's
 * actual scope. None of these are claimed to be public production products,
 * no clients are named, and no metrics are stated. TODO: the owner must
 * confirm status, feature lists, and stacks before publishing.
 */

export type ProjectStatus = "in-development" | "personal" | "live";

export const projectStatusLabel: Record<ProjectStatus, string> = {
  "in-development": "In development",
  personal: "Personal project",
  live: "Live",
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
    status: "in-development",
    featured: true,
  },
  {
    slug: "log-management-platform",
    name: "Security Log Management Platform",
    oneLiner:
      "An NCSP-style platform for collecting, storing, and reviewing security event logs in one place.",
    problem:
      "Security-relevant logs scattered across systems are useless in an incident. Centralizing them makes retention and review a workflow instead of an archaeology project.",
    built: [
      "Centralized log collection and storage",
      "Interface for searching and reviewing log records",
    ],
    stack: ["TypeScript", "Node.js"],
    status: "in-development",
    featured: true,
  },
  {
    slug: "restaurant-qr-system",
    name: "Restaurant QR Menu & Operations System",
    oneLiner:
      "QR-code menu ordering connected to dedicated waiter, kitchen, and cashier screens.",
    problem:
      "Orders taken verbally get lost between the table, the kitchen, and the register. Here the order is captured once — at the table — and flows to every role that needs it.",
    built: [
      "QR menu that guests open at the table",
      "Waiter screen for managing table orders",
      "Kitchen display for incoming orders",
      "Cashier flow for settling bills",
    ],
    stack: ["Next.js", "TypeScript", "React"],
    status: "in-development",
    featured: true,
  },
  {
    slug: "orva-psychology",
    name: "Orva Psychology — Website & Admin Panel",
    oneLiner:
      "A website for a psychology practice, paired with an admin panel for managing its content.",
    problem:
      "A practice site is only useful if the people running the practice can update it themselves — without touching code.",
    built: [
      "Public-facing practice website",
      "Admin panel for managing site content",
    ],
    stack: ["Next.js", "TypeScript", "React"],
    status: "in-development",
    featured: false,
  },
  {
    slug: "cendovar",
    name: "Cendovar — Membership & Signal Platform",
    oneLiner:
      "A membership platform where subscribers receive signals published to them.",
    problem:
      "Delivering gated content to paying members needs real account, access, and publishing mechanics — not a mailing list held together with tape.",
    built: [
      "Membership and subscription handling",
      "Signal publishing to members",
    ],
    stack: ["Next.js", "TypeScript", "React"],
    status: "in-development",
    featured: false,
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
