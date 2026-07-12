import { type Project } from "@/content/projects";

/**
 * English project content. Slugs are shared with the Turkish inventory;
 * copy is adapted for natural English. Same honesty rules: completed /
 * delivered-working positioning without client names, revenue, user counts,
 * live URLs or launch claims.
 */

export const projectsEn: Project[] = [
  {
    slug: "ecommerce-cms",
    name: "E-commerce CMS & Visual Site Builder",
    oneLiner:
      "A content-managed e-commerce system where store pages are built visually, not in code.",
    problem:
      "Running an online store usually means juggling a store system and a separate site builder. This system merges the two: the panel that manages the products also manages the pages that sell them.",
    built: [
      "Product and category management",
      "Storefront with product and category pages",
      "Admin panel for product editing",
      "Visual page builder for storefront content",
    ],
    stack: ["Next.js", "TypeScript", "React", "Tailwind CSS"],
    tier: "delivered",
    statusLabel: "Completed product infrastructure",
    featured: true,
    role: "Designed and built end to end",
    statusNote:
      "Completed product infrastructure: the admin panel, storefront and visual page builder run together. Interface captures and architecture notes will be added.",
    similarCta: "I need a similar e-commerce system",
    flow: ["Admin & CMS", "Visual page builder", "Storefront"],
    dossierSummary:
      "One system where the panel that manages products also manages the pages that sell them. Admin panel, visual page builder and storefront run together — completed as production-ready product infrastructure.",
    constraints: [
      "A single management surface for commerce and content",
      "Store pages must be built visually, not in code",
      "Product data and page content must stay consistent between panel and storefront",
    ],
    modules: [
      {
        name: "Product & category management",
        note: "The data core of commerce: products, categories and their relations",
      },
      {
        name: "Admin panel",
        note: "Control screens where products and content are edited",
      },
      {
        name: "Visual page builder",
        note: "Storefront pages assembled visually from managed content",
      },
      {
        name: "Storefront",
        note: "Customer-facing product and category pages",
      },
    ],
  },
  {
    slug: "restaurant-qr-system",
    name: "Restaurant QR Menu & Operations System",
    oneLiner:
      "A QR-code menu and ordering system wired into waiter, kitchen and cashier screens.",
    problem:
      "Orders taken verbally get lost between the table, the kitchen and the till. In this system an order is captured once, at the table, and flows to every role that needs it.",
    built: [
      "QR menu guests open at the table",
      "Waiter screen for managing table orders",
      "Kitchen screen for incoming orders",
      "Cashier flow for settling bills",
    ],
    stack: ["Next.js", "TypeScript", "React"],
    tier: "delivered",
    statusLabel: "Completed operations system",
    featured: true,
    role: "Designed and built end to end",
    statusNote:
      "Completed operations system: an order flows from the QR menu to the waiter, kitchen and cashier screens in working condition. Delivered as a working build.",
    similarCta: "Discuss a similar operations system",
    flow: ["QR menu", "Waiter screen", "Kitchen screen", "Cashier"],
    dossierSummary:
      "A completed full-stack operations system: the order is captured once at the table and reaches the waiter, the kitchen and the cashier — every role that needs it — relying on the system, not on memory.",
    constraints: [
      "An order captured once at the source must reach three different roles",
      "Every station needs its own screen shaped for its own job",
      "Guests must be able to order from their own phone via QR",
    ],
    modules: [
      {
        name: "QR menu",
        note: "The menu interface guests open and order from at the table",
      },
      {
        name: "Waiter screen",
        note: "The operations screen where table orders are managed",
      },
      {
        name: "Kitchen screen",
        note: "The prep screen where incoming orders queue up",
      },
      {
        name: "Cashier flow",
        note: "The settlement step where bills are closed",
      },
    ],
  },
  {
    slug: "orva-psychology",
    name: "Orva Psychology — Website & Admin Panel",
    oneLiner:
      "A website plus content-management panel for a psychology clinic.",
    problem:
      "A clinic website only works if the people running the clinic can update it without touching code.",
    built: [
      "Public clinic website",
      "Admin panel managing site content",
      "Appointment request flow",
    ],
    stack: ["Next.js", "TypeScript", "React"],
    tier: "delivered",
    statusLabel: "Completed corporate site + panel",
    featured: true,
    role: "Designed and built end to end",
    statusNote:
      "Completed corporate site + panel: with content management and an appointment request flow — work completed and delivered to the client's needs.",
    similarCta: "I need a site and panel like this",
    flow: ["Admin panel", "Content management", "Corporate site"],
    dossierSummary:
      "A completed site + panel pair for a psychology clinic: the corporate site presents the clinic, while the panel lets the people running it manage content and appointment requests without touching code.",
    constraints: [
      "A non-technical team must be able to update the site themselves",
      "The corporate site and its content managed from one panel",
      "Appointment requests handled as a flow, not an inbox",
    ],
    modules: [
      {
        name: "Corporate clinic site",
        note: "The clinic's public face",
      },
      {
        name: "Admin panel",
        note: "Screens where content is managed without touching code",
      },
      {
        name: "Appointment request flow",
        note: "Requests collected and handled inside the panel",
      },
    ],
  },
  {
    slug: "log-management-platform",
    name: "Security Log Management Platform",
    oneLiner:
      "A platform that collects, stores and opens security event logs to review in one place.",
    problem:
      "Security logs scattered across systems are useless in the moment of an incident. Centralizing them turns retention and review into a workflow instead of archaeology.",
    built: [
      "Central log collection and storage",
      "Search and review interface over log records",
    ],
    stack: ["TypeScript", "Node.js"],
    tier: "internal",
    statusLabel: "Internal product infrastructure — working modules",
    featured: false,
    role: "Designed and built end to end",
    statusNote:
      "Internal product infrastructure: log collection, storage and review modules run in working condition. Hardening and compliance work was deliberately kept out of this scope.",
    similarCta: "Discuss a similar reporting system",
    flow: ["Log collection", "Storage", "Search & review"],
    dossierSummary:
      "Internal product infrastructure built for central security log management: collection, storage and a review interface in one place, as working modules.",
    constraints: [
      "Turn log retention and review into a workflow, not archaeology",
    ],
    modules: [
      {
        name: "Central collection & storage",
        note: "Security event records gathered in one place",
      },
      {
        name: "Search & review interface",
        note: "Screens where records are found and read",
      },
    ],
  },
  {
    slug: "cendovar",
    name: "Cendovar — Membership & Signal Platform",
    oneLiner:
      "A membership platform that publishes notification-style signal records to subscribed members.",
    problem:
      "Serving member-only content takes real account, access and publishing mechanics — not a mailing list held together with tape.",
    built: [
      "Membership accounts and subscription management",
      "Publishing signal records to subscribed members",
    ],
    stack: ["Next.js", "TypeScript", "React"],
    tier: "internal",
    statusLabel: "Earlier product work — completed infrastructure",
    featured: false,
    role: "Designed and built end to end",
    statusNote:
      "Earlier product work: the membership, access and publishing infrastructure is complete and in working condition.",
    similarCta: "I need a similar membership flow",
    flow: ["Membership & access", "Publishing", "Member delivery"],
    dossierSummary:
      "Completed membership/signal platform work: accounts, access control and the infrastructure for publishing notification-style signal records to members, in working condition.",
    constraints: [
      "Real account, access and publishing mechanics for member-only content",
    ],
    modules: [
      {
        name: "Membership & subscription management",
        note: "The account layer deciding who can access what",
      },
      {
        name: "Signal publishing",
        note: "Delivery of notification-style records to members",
      },
    ],
  },
];

export const featuredProjectsEn = projectsEn.filter((p) => p.featured);

export function getProjectEn(slug: string): Project | undefined {
  return projectsEn.find((p) => p.slug === slug);
}
