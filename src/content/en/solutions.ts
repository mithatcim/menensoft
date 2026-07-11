import { type SolutionCategory } from "@/content/solutions";

/**
 * English solution categories (/en/solutions). systemSlug references
 * ENGLISH system slugs; relatedSlugs are the shared project slugs.
 */

export const solutionsEn: SolutionCategory[] = [
  {
    id: "ecommerce",
    title: "E-commerce systems",
    problem:
      "Online sales infrastructure that a ready-made package restricts, that depends on code for every change, or that can't be managed at all.",
    builds: [
      "Product catalog, category structure and fast storefront pages",
      "Content and page layouts managed without code",
      "Order and stock screens",
      "An e-commerce system you own, integrated with its admin panel",
    ],
    relatedSlugs: ["ecommerce-cms"],
    systemSlug: "ecommerce-system",
  },
  {
    id: "admin-panels",
    title: "Admin panels",
    problem:
      "Business data living in spreadsheets, messages and scattered tools; nobody knows who changed what.",
    builds: [
      "Admin panel screens for your core data",
      "Role-based access and permissions",
      "Search, filtering and fast data tables",
      "Validated forms and a consistent record flow",
    ],
    relatedSlugs: ["ecommerce-cms", "orva-psychology"],
    systemSlug: "admin-panel",
  },
  {
    id: "dashboard-reporting",
    title: "Dashboards and reporting",
    problem:
      "The state of the work only discoverable by asking around; no single picture visible at a glance.",
    builds: [
      "Live operational views",
      "Role-specific dashboard screens",
      "Lists, filters and status flows that stay current",
      "Log and record review screens",
    ],
    relatedSlugs: ["restaurant-qr-system", "log-management-platform"],
    systemSlug: "dashboard-reporting",
  },
  {
    id: "workflow-automation",
    title: "Workflow automation",
    problem:
      "Repetitive manual work leaking hours; processes that depend on one person and produce errors.",
    builds: [
      "The current manual process mapped and simplified",
      "Purpose-built software sized to the workflow",
      "Integration with the systems you already use",
      "End-to-end flows like order routing and appointment requests",
    ],
    relatedSlugs: ["restaurant-qr-system", "cendovar"],
    systemSlug: "workflow-automation",
  },
  {
    id: "corporate-site-panel",
    title: "Corporate website + admin panel",
    problem:
      "There is a site, but every content change needs a developer; keeping it current has become a burden.",
    builds: [
      "A fast, trustworthy corporate website",
      "Content managed from a panel — no developer dependency",
      "Appointment and inquiry flows",
      "Semantic structure built for search engines",
    ],
    relatedSlugs: ["orva-psychology"],
    systemSlug: "corporate-website",
  },
  {
    id: "operations-systems",
    title: "Operations systems",
    problem:
      "A single order or request hand-carried to several stations — kitchen, till, field.",
    builds: [
      "A workflow captured once at the source",
      "A separate screen per role — like a restaurant QR ordering system",
      "Live status shared across roles",
      "Infrastructure built to carry a working day",
    ],
    relatedSlugs: ["restaurant-qr-system", "log-management-platform"],
    systemSlug: "operations-system",
  },
];

/** Who it fits — conversion band. */
export const audienceEn = [
  "Small and mid-sized businesses running operations on spreadsheets and messages",
  "Teams that hit the limits of ready-made packages and want their own system",
  "Businesses that want a panel-managed site without developer dependency",
  "Operations teams moving an internal process into custom software",
];

/** When you need this — conversion band. */
export const triggersEn = [
  "Orders, requests or appointments carried by hand and getting lost",
  "The same data entered into several places over and over",
  "Work status only discoverable by phoning someone",
  "A developer needed for every content change",
];

/** What you receive — conversion band. */
export const deliverablesEn = [
  "A web system delivered in working condition",
  "An admin panel with role-appropriate screens",
  "A maintainable, reviewable codebase",
  "Documentation, clear scope and a clean handoff",
];

/** What Menensoft avoids — the honesty band. */
export const avoidedEn = [
  "Template-on-template solutions that don't fit your business",
  "Open-ended billing on vague scope",
  "Platform fantasies beyond the actual need",
  "Untransferable black boxes tied to one person",
];
