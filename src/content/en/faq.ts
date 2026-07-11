import { type FaqItem } from "@/content/faq";

/**
 * English FAQ — visible on /en/faq and mirrored into FAQPage JSON-LD there.
 * Adapted for natural English; same honesty rules (no fixed prices, no
 * guarantees-language, no invented facts).
 */

export const faqEn: FaqItem[] = [
  {
    id: "what-does-menensoft-do",
    question: "What does Menensoft build?",
    answer:
      "Menensoft builds working web systems for businesses: e-commerce systems, admin panels, dashboards and reporting screens, workflow automation, and corporate websites managed from a panel. Not one-page brochures — end-to-end systems with a data model, backend, admin panel and interface.",
    links: [
      { label: "Explore solutions", href: "/en/solutions" },
      { label: "See the projects", href: "/en/projects" },
    ],
  },
  {
    id: "who-is-it-for",
    question: "Who are these systems built for?",
    answer:
      "Small and mid-sized businesses running their operation on spreadsheets, chat threads and scattered tools; teams that have hit the limits of off-the-shelf platforms; businesses that want to manage their site from a panel without depending on a developer. Industry doesn't matter — what matters is a real workflow worth moving into software.",
  },
  {
    id: "site-or-system",
    question: "Is it only websites, or also panels and systems?",
    answer:
      "The core focus is systems: admin panels, dashboards, order and workflow screens. Corporate websites are built too — but usually delivered together with an admin panel that manages their content.",
    links: [{ label: "Solution areas", href: "/en/solutions" }],
  },
  {
    id: "ecommerce",
    question: "Can Menensoft build an e-commerce system?",
    answer:
      "Yes. There is a completed e-commerce product infrastructure covering the product catalog, category structure, storefront pages, content management and order screens. The system is built to be managed from a panel without touching code.",
    links: [{ label: "E-commerce project", href: "/en/projects/ecommerce-cms" }],
  },
  {
    id: "panels-dashboards",
    question: "Do you build admin panels and dashboards?",
    answer:
      "Yes. Role-based admin panels, data tables, search and filtering, live operational views and role-specific dashboard screens. These were built end to end in projects like the restaurant QR ordering system and the log management platform.",
    links: [{ label: "See the projects", href: "/en/projects" }],
  },
  {
    id: "data-migration",
    question: "Can existing data or systems be migrated?",
    answer:
      "It depends. What matters is whether the current data is accessible, what export options exist, and what the target data model looks like. If the data is reachable, migration is planned as its own work item during scoping; if not, that gets clarified first. No blanket migration promises — we look first, then say.",
    links: [{ label: "Start a project", href: "/en/start-project" }],
  },
  {
    id: "process",
    question: "How does a project run?",
    answer:
      "Five steps: request, scope clarification, architecture, development and delivery. Development does not start before the scope is agreed in writing, and work ships in small reviewable steps. The whole process is described on the process page.",
    links: [{ label: "See the process", href: "/en/process" }],
  },
  {
    id: "duration",
    question: "How long does a project take?",
    answer:
      "Any duration quoted before the scope is clear is a negotiation, not an estimate — which is why scoping always comes first. Module count, roles and permissions, integrations and content readiness set the timeline: a small site-plus-panel job and a multi-role operations system do not share a calendar. Once the scope is written down, a realistic time frame is discussed together; fixed dates are not promised before that.",
    links: [{ label: "See the process", href: "/en/process" }],
  },
  {
    id: "deliverables",
    question: "What do you receive at delivery?",
    answer:
      "A working web system, an admin panel with role-appropriate screens, a maintainable and reviewable codebase, documentation and a clean handoff. The goal is to leave you with a system you can run after delivery — not a black box tied to one person.",
  },
  {
    id: "are-projects-live",
    question: "Are the projects live?",
    answer:
      "The projects are completed, working systems; some were delivered to client needs, some serve as internal product infrastructure. Public live URLs are not published on this site; each project page transparently lists its scope, modules and architecture.",
    links: [{ label: "Project details", href: "/en/projects" }],
  },
  {
    id: "single-founder-risk",
    question: "Isn't working with a one-person brand risky?",
    answer:
      "Menensoft is run by a single founder-developer, and that is not hidden; the person you talk to is the person who builds the system. What reduces risk is structure, not headcount: scope agreed in writing, a maintainable codebase, documentation and clean handoff as standard. The delivered system is not a black box tied to one person — it is left in a shape another developer could take over. In return, no 24/7 support desk is promised — that is part of the honesty.",
    links: [{ label: "How Menensoft works", href: "/en/why-menensoft" }],
  },
  {
    id: "contact",
    question: "How do I get in touch?",
    answer:
      "The fastest channel is email: mithat.menen@gmail.com. WhatsApp works too. To request a project review, the start-project page has a ready-made flow; your message goes directly to the founder.",
    links: [
      { label: "Start a project", href: "/en/start-project" },
      { label: "Contact", href: "/en/contact" },
    ],
  },
  {
    id: "pricing",
    question: "How is the price determined?",
    answer:
      "Price is determined by scope and modules. There is no fixed price list; screen count, roles and permissions, integrations and content-management needs define the scope. Once the scope is agreed in writing you get a clear quote — the preference is to clarify unclear work, not to inflate it.",
    links: [{ label: "Start a project", href: "/en/start-project" }],
  },
];
