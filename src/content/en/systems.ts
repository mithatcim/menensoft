import { type SystemType } from "@/content/systems";

/**
 * English system-type content (/en/systems). English slugs mapped in
 * src/lib/locale.ts; relatedSectors reference ENGLISH sector slugs.
 * Honest project links only; soft wording where the relation is indirect.
 */

export const systemsEn: SystemType[] = [
  {
    slug: "admin-panel",
    eyebrow: "System — Admin panel",
    title: "Admin panel",
    description:
      "The internal surface your team signs into and runs the day on: data, content, orders and users managed from one panel with role-based permissions.",
    whatItIs:
      "An admin panel is the internal system that lets you manage your business data through authorized screens instead of spreadsheets and chat threads: record editing, search and filtering, role-based access and consistent validation gathered on one surface.",
    whoNeeds: [
      "Businesses managing data in Excel and chat groups",
      "Teams waiting on a developer for every content change",
      "Managers who can't answer who changed what",
      "Operations where several people touch the same data",
    ],
    modules: [
      { name: "Record management", note: "Create, edit and archive core data" },
      { name: "Data tables", note: "Fast access via search, filters and sorting" },
      { name: "Roles & permissions", note: "Graded access to sensitive areas" },
      { name: "Forms & validation", note: "Bad records blocked at the door" },
      { name: "Content screens", note: "Copy and images managed from the panel" },
    ],
    archFlow: ["Data model", "Backend", "Panel", "Roles"],
    archNotes: [
      "The schema is designed around the business's real relations",
      "Backend rules keep data consistent on every screen",
      "Panel screens expand or narrow by role",
    ],
    adminSurface: [
      "All management screens behind one login",
      "Menus and permissions scoped by role",
      "Quick search and filtered lists",
      "Validated, mistake-resistant forms",
    ],
    deliverables: [
      "A working admin panel and its screens",
      "Role-based access structure",
      "A maintainable codebase",
      "Documentation and a clean handoff",
    ],
    relatedSectors: [
      "ecommerce-management-system",
      "psychology-clinic-appointment-system",
      "operations-dashboard-system",
    ],
    relatedProjects: [
      { slug: "ecommerce-cms", note: "Product and content management panel" },
      { slug: "restaurant-qr-system", note: "Role-based operations screens" },
      { slug: "orva-psychology", note: "Content and request management panel" },
    ],
    ctaTitle: "Move your data into a panel",
    ctaText:
      "Where does your data live today, and who manages it? Write it down; we'll sketch the panel screens together.",
    seoTitle: "Admin Panel Development",
    seoDescription:
      "Custom admin panel development for businesses: record management, data tables, role-based permissions and validated forms. One management surface instead of spreadsheets and chat traffic.",
  },
  {
    slug: "ecommerce-system",
    eyebrow: "System — E-commerce",
    title: "E-commerce system",
    description:
      "Storefront and management layer in one infrastructure: product catalog, fast customer pages, order screens and content management that needs no code.",
    whatItIs:
      "An e-commerce system unites the two faces of online selling in one infrastructure: the fast storefront your customers see and the panel where your team manages products, orders and content. A system you own, instead of a package you rent.",
    whoNeeds: [
      "Sellers who hit the customization ceiling of ready-made platforms",
      "Businesses whose product structure doesn't fit templates",
      "Teams that want to manage content without technical support",
      "Anyone who wants to own their infrastructure and data",
    ],
    modules: [
      { name: "Products & catalog", note: "Products, categories and relations" },
      { name: "Storefront", note: "Fast, clean product and category pages" },
      { name: "Visual page builder", note: "Page layouts built without code" },
      { name: "Order screens", note: "Order list and status tracking" },
      { name: "Content management", note: "Campaigns and page content from the panel" },
    ],
    archFlow: ["Catalog", "Backend", "Storefront", "Orders"],
    archNotes: [
      "Product data flows to the storefront from a single source",
      "Order records land in the panel screens",
      "Page layouts are managed visually, separate from content",
    ],
    adminSurface: [
      "Product and price management",
      "Order tracking",
      "Content and page-layout management",
      "Editor / admin permission split",
    ],
    deliverables: [
      "A working storefront + panel infrastructure",
      "Product, order and content screens",
      "Visual page-building system",
      "Documentation and a clean handoff",
    ],
    relatedSectors: [
      "ecommerce-management-system",
      "operations-dashboard-system",
    ],
    relatedProjects: [
      {
        slug: "ecommerce-cms",
        note: "The product infrastructure built as this system type",
      },
    ],
    ctaTitle: "Build sales infrastructure you own",
    ctaText:
      "Which platform are you on today, and what can't you change? Write it down; let's talk through a realistic path to owning your stack.",
    seoTitle: "Custom E-commerce System Development",
    seoDescription:
      "An e-commerce system you own instead of renting: product catalog, fast storefront, order screens, visual page builder and content management in one infrastructure.",
  },
  {
    slug: "dashboard-reporting",
    eyebrow: "System — Dashboard & reporting",
    title: "Dashboard and reporting",
    description:
      "Live screens showing the state of the work at a glance: role-specific views, status flows and summaries nobody compiles by hand.",
    whatItIs:
      "A dashboard system moves operational knowledge out of people's heads and onto screens: who is waiting on what, where each job stands, how the day is going — visible at a glance, without asking. Reports aren't compiled by hand; they're fed from a single source.",
    whoNeeds: [
      "Managers who learn work status by phoning someone",
      "Teams compiling end-of-day tables by hand",
      "Operations where several roles work at once",
      "Businesses with records but no visibility",
    ],
    modules: [
      { name: "Live status screen", note: "The real-time operational picture" },
      { name: "Role-specific views", note: "Each role watches its own work" },
      { name: "Lists & filters", note: "Fast access to records" },
      { name: "Status flow", note: "Waiting, in progress, done" },
      { name: "Summaries", note: "End-of-day and period views" },
    ],
    archFlow: ["Events", "Data layer", "Views", "Action"],
    archNotes: [
      "Every screen is fed from a single data source",
      "Status changes reflect instantly in the right views",
      "Views are designed per role, not from a generic template",
    ],
    adminSurface: [
      "Role-based dashboard screens",
      "Record and status management",
      "Filtered, searchable lists",
      "Summary views",
    ],
    deliverables: [
      "Working dashboard screens",
      "Record management with status flows",
      "Role-based access",
      "Documentation and a clean handoff",
    ],
    relatedSectors: [
      "operations-dashboard-system",
      "security-log-management",
      "restaurant-qr-ordering-system",
    ],
    relatedProjects: [
      { slug: "restaurant-qr-system", note: "Role-based live operations screens" },
      { slug: "log-management-platform", note: "Review and status screens" },
      { slug: "ecommerce-cms", note: "Similar structure in management screens" },
    ],
    ctaTitle: "See your business on one screen",
    ctaText:
      "What can't you see today? Write it down; we'll look together at which views you actually need.",
    seoTitle: "Dashboard and Reporting System",
    seoDescription:
      "Live dashboards and reporting screens for businesses: role-specific views, status flows, filtered lists and summaries nobody compiles by hand — in one system.",
  },
  {
    slug: "workflow-automation",
    eyebrow: "System — Workflow automation",
    title: "Workflow automation",
    description:
      "Purpose-built software that takes over repetitive manual work: input captured once, routed by rule, delivered to everyone involved through the system.",
    whatItIs:
      "Workflow automation moves a person-dependent manual process into software: a request or order is recorded once at the source, routed to the right person by rules, and tracked through its states. The goal is not to build a platform — it is to take over one real workflow.",
    whoNeeds: [
      "Teams entering the same data into several places by hand",
      "Businesses losing requests in message traffic",
      "Operations that run on one specific person's memory",
      "Anyone who wants the hours back from repetitive work",
    ],
    modules: [
      { name: "Input capture", note: "Requests, orders or records from one point" },
      { name: "Rule engine", note: "Records routed to the right station" },
      { name: "Status tracking", note: "Every step of the flow visible" },
      { name: "Integration", note: "Connections to the systems you already use" },
      { name: "Notification flow", note: "The right person notified by the system" },
    ],
    archFlow: ["Input", "Rules", "Routing", "Tracking"],
    archNotes: [
      "The current manual process is mapped honestly first",
      "The tool is sized to the flow; no platform fantasies",
      "Every step's status stays visible in the system",
    ],
    adminSurface: [
      "Flow records with their status",
      "Rule and routing settings",
      "Visibility into stuck work",
      "Intervention scoped by permission",
    ],
    deliverables: [
      "A working workflow system",
      "Management and tracking screens",
      "Integrations and documentation",
      "A clean handoff",
    ],
    relatedSectors: [
      "restaurant-qr-ordering-system",
      "psychology-clinic-appointment-system",
      "membership-platform",
    ],
    relatedProjects: [
      { slug: "restaurant-qr-system", note: "Order routing flow" },
      { slug: "orva-psychology", note: "Appointment request flow" },
      { slug: "cendovar", note: "Similar structure in publish-to-members flow" },
    ],
    ctaTitle: "Hand your manual flow to a system",
    ctaText:
      "Which job runs by hand, and where does it break? Write it down; we'll draw the boundary of the automation together.",
    seoTitle: "Workflow Automation Development",
    seoDescription:
      "Purpose-built workflow automation for manual processes: input capture, rule-based routing, status tracking and integrations. A system instead of person-dependency.",
  },
  {
    slug: "corporate-website",
    eyebrow: "System — Corporate website",
    title: "Corporate website + panel",
    description:
      "A fast, trustworthy site with a panel behind it managing content and inquiries: a corporate surface that updates without a developer and collects requests.",
    whatItIs:
      "A corporate site delivered with a panel is more than a brochure: content updates from the panel, visitor inquiries collect inside the system, and the page structure is built for search engines. The site doesn't freeze — it lives with the business.",
    whoNeeds: [
      "Businesses waiting on a developer for every content change",
      "Teams whose inquiries get lost in an email inbox",
      "Anyone who wants a fast, credible corporate face",
      "Service businesses collecting appointment or quote requests",
    ],
    modules: [
      { name: "Corporate pages", note: "Services, team and informational structure" },
      { name: "Content management", note: "Copy and images from the panel" },
      { name: "Inquiry flow", note: "Form submissions landing in the panel" },
      { name: "SEO structure", note: "Semantic, fast, crawlable pages" },
      { name: "Permission split", note: "Content editor and admin roles" },
    ],
    archFlow: ["Content", "Panel", "Site", "Inquiries"],
    archNotes: [
      "Content lives in the panel; the site is fed from it",
      "Inquiries collect in the system, not an inbox",
      "Pages are built with one h1 and a clean hierarchy",
    ],
    adminSurface: [
      "Page and content management",
      "Incoming inquiries with status",
      "Team/service information management",
      "Role-based access",
    ],
    deliverables: [
      "A working corporate site + panel",
      "Content and inquiry screens",
      "SEO-ready page structure",
      "Documentation and a clean handoff",
    ],
    relatedSectors: ["psychology-clinic-appointment-system"],
    relatedProjects: [
      {
        slug: "orva-psychology",
        note: "The site + panel built as this system type",
      },
    ],
    ctaTitle: "Make your site manageable",
    ctaText:
      "What can't your current site do? Write it down; we'll plan how the site should live with a panel behind it.",
    seoTitle: "Corporate Website with Admin Panel",
    seoDescription:
      "A corporate website managed from a panel: content management, an inquiry-collection flow, fast SEO-ready pages and role-based access. A living site, not a frozen brochure.",
  },
  {
    slug: "operations-system",
    eyebrow: "System — Operations system",
    title: "Operations system",
    description:
      "One flow for multi-role businesses: input captured once at the source, every station working on its own screen, one shared live status for everyone.",
    whatItIs:
      "An operations system is the multi-role software that carries a business's day: an order or request is recorded once, reaches every station — kitchen, till, field — on its own screen, and every role sees the same live status.",
    whoNeeds: [
      "Businesses hand-carrying one input to several stations",
      "Teams that need screens running through a whole shift",
      "Operations losing work in role confusion",
      "Multi-station work like restaurants, service and field ops",
    ],
    modules: [
      { name: "Input capture", note: "Order/request recorded once at the source" },
      { name: "Station screens", note: "A separate working screen per role" },
      { name: "Live status", note: "The same real-time picture for every role" },
      { name: "Flow management", note: "Work progressing across stations" },
      { name: "End of day", note: "Operational summaries" },
    ],
    archFlow: ["Capture", "Route", "Stations", "Status"],
    archNotes: [
      "Shared state is managed from a single source",
      "Screens are designed around each station's real job",
      "The system is built for the tempo of a working day",
    ],
    adminSurface: [
      "Station and role management",
      "Live operations view",
      "Record and status screens",
      "End-of-day summaries",
    ],
    deliverables: [
      "A working multi-role operations system",
      "Station screens",
      "Live status infrastructure",
      "Documentation and a clean handoff",
    ],
    relatedSectors: [
      "restaurant-qr-ordering-system",
      "operations-dashboard-system",
      "security-log-management",
    ],
    relatedProjects: [
      {
        slug: "restaurant-qr-system",
        note: "The operations system built as this system type",
      },
      {
        slug: "log-management-platform",
        note: "Similar structure in the review workflow",
      },
    ],
    ctaTitle: "Put your operation on one flow",
    ctaText:
      "Which stations does your work pass through, and where does it break? Write it down; we'll scope it together.",
    seoTitle: "Operations System Development",
    seoDescription:
      "An operations system for multi-role businesses: input captured once, every station on its own screen, one live status for everyone. Infrastructure delivered working.",
  },
];

export function getSystemEn(slug: string): SystemType | undefined {
  return systemsEn.find((s) => s.slug === slug);
}
