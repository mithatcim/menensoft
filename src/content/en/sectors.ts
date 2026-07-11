import { type Sector } from "@/content/sectors";

/**
 * English sector content (/en/sectors). Buyer-readable English slugs mapped
 * to the Turkish inventory in src/lib/locale.ts. relatedSystems reference
 * ENGLISH system slugs. Same honesty rules as the Turkish content.
 */

export const sectorsEn: Sector[] = [
  {
    slug: "restaurant-qr-ordering-system",
    eyebrow: "Sector — Restaurants & cafés",
    title: "Restaurant QR ordering system",
    description:
      "One flow from table to kitchen: QR menu, order routing and role-based operations screens. Instead of paper slips and shouted orders, a working system that carries a full service day.",
    problem:
      "At rush hour, orders are taken verbally, scribbled on paper and walked to the kitchen. Orders get lost, sequence breaks, and the till doesn't reconcile at close. The problem isn't the staff — it's the flow itself.",
    pains: [
      "Orders carried by hand between waiter, kitchen and cashier",
      "Orders lost or resequenced during rush hours",
      "Menu changes require reprinting and redesign",
      "End-of-day totals don't match the orders taken",
      "You only know how service is going by walking the floor",
    ],
    builds: [
      "A QR menu guests open on their own phone",
      "Separate role screens for waiter, kitchen and cashier",
      "A workflow that routes each order to the right station",
      "Menu, items and prices managed from a panel",
      "Live screens showing the day's operation at a glance",
    ],
    modules: [
      { name: "QR menu", note: "Fast-loading menu on the guest's phone, no printing" },
      { name: "Order flow", note: "Automatic routing from table to kitchen" },
      { name: "Kitchen screen", note: "Incoming orders queued with their status" },
      { name: "Cashier screen", note: "Bills and end-of-day view" },
      { name: "Menu management", note: "Items, prices and categories updated in the panel" },
      { name: "Role management", note: "Each employee sees only their own screen" },
    ],
    adminNeeds: [
      "A panel for menu and price updates",
      "Live tracking of in-service orders",
      "Role-based access: waiter, kitchen, cashier",
      "End-of-day summary view",
    ],
    automation: [
      "Orders routed to the right station automatically",
      "Status changes reflected instantly on every screen",
      "Hand-carried paper slips eliminated entirely",
    ],
    relatedProjects: [
      {
        slug: "restaurant-qr-system",
        note: "The system built end to end for this sector",
      },
    ],
    relatedSystems: [
      "operations-system",
      "dashboard-reporting",
      "workflow-automation",
    ],
    deliverables: [
      "A working QR ordering and operations system",
      "Waiter, kitchen and cashier screens",
      "Menu management panel",
      "Documentation and a clean handoff",
    ],
    avoids: [
      "Half-solutions pretending to be a POS device",
      "Ready-made ordering templates that don't fit your floor",
      "Scope inflated with modules you'll never use",
    ],
    ctaTitle: "Untangle your restaurant's order flow",
    ctaText:
      "Tell us your table count, your current setup and where the flow jams; we'll work out together what to systemize first.",
    seoTitle: "Restaurant QR Ordering System",
    seoDescription:
      "QR menu, order routing and role-based operations screens for restaurants and cafés: waiter, kitchen, cashier. A panel-managed ordering system delivered working.",
  },
  {
    slug: "psychology-clinic-appointment-system",
    eyebrow: "Sector — Psychology & clinics",
    title: "Clinic website and appointment request system",
    description:
      "A trustworthy corporate site with a panel behind it managing content and appointment requests. Clients write from the site, requests land in the panel, and content updates without waiting for a developer.",
    problem:
      "Clinic websites are usually built once and then freeze: content can't be updated, appointment requests drown in phone and message traffic, and there's nothing manageable behind the site.",
    pains: [
      "Appointment requests scattered across phone, DMs and email",
      "Updating practitioner and service info requires a developer",
      "Adding articles or informational content becomes a chore",
      "No way to track which request was answered",
      "The site looks trustworthy but has no system behind it",
    ],
    builds: [
      "A fast, trustworthy clinic website",
      "An appointment request flow: submissions land in the panel",
      "An admin panel for practitioners, services and content",
      "A simple workflow tracking each request's status",
      "Semantic page structure search engines can read",
    ],
    modules: [
      { name: "Corporate site", note: "Practitioners, services and informational pages" },
      { name: "Appointment requests", note: "Site submissions landing in the panel" },
      { name: "Content management", note: "Pages and posts updated from the panel" },
      { name: "Request tracking", note: "New, answered and closed states" },
      { name: "Practitioner profiles", note: "Team and specialty management" },
    ],
    adminNeeds: [
      "Editing content and practitioner info from the panel",
      "Seeing appointment requests in one list",
      "Marking request states",
      "Access separated by permission",
    ],
    automation: [
      "Site form submissions recorded in the panel automatically",
      "Request status flow removing manual follow-up",
      "Publishing content without waiting for a developer",
    ],
    relatedProjects: [
      {
        slug: "orva-psychology",
        note: "The site + panel work built for this sector",
      },
    ],
    relatedSystems: ["corporate-website", "admin-panel", "workflow-automation"],
    deliverables: [
      "A working corporate site and admin panel",
      "Appointment request flow",
      "Content management screens",
      "Documentation and a clean handoff",
    ],
    avoids: [
      "Overpromising language that erodes trust in healthcare",
      "Frozen brochure sites that can't be updated",
      "Ready-made appointment templates that don't fit how the clinic works",
    ],
    ctaTitle: "Sort out your clinic's site and appointment flow",
    ctaText:
      "Describe your current site and where appointment traffic gets lost today; we'll plan together how requests should land in a panel.",
    seoTitle: "Psychology Clinic Website and Appointment System",
    seoDescription:
      "Corporate website, appointment request flow and content management panel for psychology clinics and counseling practices. A system managed without depending on a developer.",
  },
  {
    slug: "ecommerce-management-system",
    eyebrow: "Sector — Online retail",
    title: "E-commerce management system",
    description:
      "Storefront and management layer as one system: product catalog, content, order screens and visual page building. Infrastructure you own, without hitting the limits of a ready-made package.",
    problem:
      "Off-the-shelf e-commerce platforms are fast at the start; but once you hit the customization ceiling, every change is either impossible or a fight against the platform. The business grows, the system stays small.",
    pains: [
      "Product and category structure doesn't match how the business really works",
      "Changing a page layout means wrestling the theme",
      "Content teams wait on technical support for everything",
      "Order and stock data live in different places",
      "The infrastructure is rented; the data and flow aren't yours",
    ],
    builds: [
      "Product catalog, category structure and fast storefront pages",
      "Page layouts built visually, managed without code",
      "Order and stock screens",
      "Content management for non-technical editors",
      "Product infrastructure you own, open to growth",
    ],
    modules: [
      { name: "Products & catalog", note: "Managing products, categories and relations" },
      { name: "Storefront", note: "Fast, clean customer pages" },
      { name: "Visual page builder", note: "Pages assembled visually, not in code" },
      { name: "Order screens", note: "Orders tracked from the panel" },
      { name: "Content management", note: "Copy and images updated from the panel" },
      { name: "Roles & permissions", note: "Editor and admin separation" },
    ],
    adminNeeds: [
      "Fast panel screens for product and price management",
      "Order list and status tracking",
      "A separate permission area for content editors",
      "Consistent data between storefront and panel",
    ],
    automation: [
      "Product data reflected to the storefront automatically",
      "Order records collected into a single flow",
      "Repetitive content chores moved into the panel",
    ],
    relatedProjects: [
      {
        slug: "ecommerce-cms",
        note: "The product infrastructure built for this sector",
      },
    ],
    relatedSystems: ["ecommerce-system", "admin-panel", "dashboard-reporting"],
    deliverables: [
      "A working e-commerce infrastructure: storefront + panel",
      "Product, order and content screens",
      "Visual page-building system",
      "Documentation and a clean handoff",
    ],
    avoids: [
      "Patch jobs stacked on top of a ready-made package",
      "Marketplace fantasies beyond the actual need",
      "Rented infrastructure whose ownership never becomes yours",
    ],
    ctaTitle: "Move your sales onto infrastructure you own",
    ctaText:
      "Which platform are you on today, and where did you hit the ceiling? Write it down; we'll map the scope of owning your own stack.",
    seoTitle: "E-commerce Management System",
    seoDescription:
      "For online retailers: e-commerce infrastructure you own — product catalog, storefront, order screens, content management and a visual page builder in one system.",
  },
  {
    slug: "operations-dashboard-system",
    eyebrow: "Sector — Operations-driven businesses",
    title: "Operations dashboard system",
    description:
      "Live screens showing the state of the work at a glance: orders, requests, tasks and statuses. Instead of asking by phone, look at a screen and know.",
    problem:
      "In work carried by several people, status lives in people's heads. The manager has to ask where things stand; the answers come late, incomplete or contradictory.",
    pains: [
      "Work status only discoverable by phoning someone",
      "The same information looks different in different hands",
      "End-of-day tables compiled by hand",
      "Unclear which jobs are waiting and which are done",
      "The data exists, but no screen shows it at a glance",
    ],
    builds: [
      "Live operations screens designed per role",
      "Status flows: waiting, in progress, done",
      "Fast access with lists, filters and search",
      "End-of-day and period summary views",
      "Infrastructure collecting operations data in one source",
    ],
    modules: [
      { name: "Live status screen", note: "The real-time picture, role-based" },
      { name: "Work lists", note: "Filterable, searchable records" },
      { name: "Status flow", note: "Tracking each record's life cycle" },
      { name: "Summary views", note: "End-of-day and period summaries" },
      { name: "Permission layer", note: "Who sees what, who changes what" },
    ],
    adminNeeds: [
      "Role-specific dashboard screens",
      "Managing records with their status",
      "Quick access via filters and search",
      "Summaries replacing hand-built reports",
    ],
    automation: [
      "Status changes reflected instantly on the right screens",
      "Hand-compiled end-of-day tables automated",
      "Consistent views fed from a single source",
    ],
    relatedProjects: [
      {
        slug: "restaurant-qr-system",
        note: "Related work with multi-role live operations screens",
      },
      {
        slug: "log-management-platform",
        note: "Similar structure in record collection and review screens",
      },
    ],
    relatedSystems: ["dashboard-reporting", "operations-system", "admin-panel"],
    deliverables: [
      "Working dashboard and operations screens",
      "Record management with status flows",
      "Role-based access",
      "Documentation and a clean handoff",
    ],
    avoids: [
      "Showpiece dashboards full of charts nobody reads",
      "Ready-made dashboard templates that don't fit the workflow",
      "Extra tools that scatter data and break the single source",
    ],
    ctaTitle: "See your operation on one screen",
    ctaText:
      "What do you currently learn only by phoning someone? Write it down; we'll decide together which screens you actually need.",
    seoTitle: "Operations Dashboard System",
    seoDescription:
      "Live status screens, work lists and role-based dashboards for operations-driven businesses. The state of the work visible at a glance — without asking.",
  },
  {
    slug: "security-log-management",
    eyebrow: "Sector — Security & IT teams",
    title: "Security log management",
    description:
      "Infrastructure that collects scattered system logs in one place, stores them and makes them reviewable: collection, storage, review screens and a review workflow.",
    problem:
      "Logs pile up across systems in different formats. When an incident hits, finding a record takes hours; regular review never happens because there is no practical screen for it.",
    pains: [
      "Records scattered across multiple systems",
      "Tracing an incident takes hours",
      "Regular log review practically impossible",
      "No trace of who reviewed what",
      "Retention and access rules undefined",
    ],
    builds: [
      "Log collection and single-source storage",
      "Fast review screens with search and filtering",
      "A review workflow: reviewed, flagged, closed",
      "An access and permission layer",
      "Operational summary views",
    ],
    modules: [
      { name: "Collection layer", note: "Records accumulating in one source" },
      { name: "Storage", note: "Structured, queryable retention" },
      { name: "Review screen", note: "Search, filters and detail view" },
      { name: "Review workflow", note: "Tracking review states" },
      { name: "Permission layer", note: "Role-based access to sensitive records" },
    ],
    adminNeeds: [
      "Fast search and filtering in review screens",
      "Marking review states",
      "Role-based access separation",
      "Summary and status views",
    ],
    automation: [
      "Records accumulating without manual collection",
      "Review flow progressing by status",
      "Repetitive scanning chores moved onto a screen",
    ],
    relatedProjects: [
      {
        slug: "log-management-platform",
        note: "Internal product infrastructure built in this space — working modules",
      },
    ],
    relatedSystems: ["dashboard-reporting", "admin-panel", "operations-system"],
    deliverables: [
      "Working log collection and review infrastructure",
      "Review workflow screens",
      "Role-based access structure",
      "Documentation and a clean handoff",
    ],
    avoids: [
      "Packages posing as enterprise SIEM",
      "Setups that hoard data nobody ever reviews",
      "Complex interfaces the team won't use",
    ],
    ctaTitle: "Make your log flow reviewable",
    ctaText:
      "Which systems' records do you collect, and what can't you look at when an incident hits? Write it down; we'll scope a reviewable flow.",
    seoTitle: "Security Log Management System",
    seoDescription:
      "Log collection, storage and review infrastructure for IT and security teams: search, filtering, a review workflow and role-based access in one system.",
  },
  {
    slug: "membership-platform",
    eyebrow: "Sector — Membership & communities",
    title: "Membership platform",
    description:
      "Member accounts, content access and a publish-to-members flow: membership infrastructure managed from a panel, from sign-up to content delivery.",
    problem:
      "Membership businesses usually run on chat groups and hand-kept lists. Who is a member, who can access what, and how content reaches members — none of it is systematic.",
    pains: [
      "The member list lives in spreadsheets and messaging apps",
      "Content delivered to members one by one, by hand",
      "Unclear whose access is currently active",
      "Sign-ups and renewals tracked manually",
      "Management effort grows linearly as you grow",
    ],
    builds: [
      "Member accounts and access management",
      "A publish flow delivering content/records to members",
      "Panel screens tracking membership states",
      "Sign-up and access rules turned into a system",
      "Infrastructure that decouples growth from management effort",
    ],
    modules: [
      { name: "Member accounts", note: "Sign-up, login and account state" },
      { name: "Access management", note: "Who accesses what, until when" },
      { name: "Publishing flow", note: "Systematic delivery of content to members" },
      { name: "Membership panel", note: "Member list and status tracking" },
    ],
    adminNeeds: [
      "Member list and status screens",
      "Tracking access periods",
      "Managing the publish flow from the panel",
      "Permission separation",
    ],
    automation: [
      "Published content reaching members without manual distribution",
      "Access states processed by rule",
      "Hand-kept lists eliminated",
    ],
    relatedProjects: [
      {
        slug: "cendovar",
        note: "Earlier product work on membership and publishing infrastructure",
      },
    ],
    relatedSystems: ["workflow-automation", "admin-panel"],
    deliverables: [
      "Working membership and access infrastructure",
      "Publishing flow",
      "Membership management panel",
      "Documentation and a clean handoff",
    ],
    avoids: [
      "Fantasies of cloning community platforms",
      "Complex subscription systems built before the need exists",
      "Half-automations that fall back to manual management",
    ],
    ctaTitle: "Move your membership flow into a system",
    ctaText:
      "How do members sign up today, and how does content reach them? Write it down; we'll design the systematic version of that flow together.",
    seoTitle: "Membership Platform Development",
    seoDescription:
      "For membership businesses: member accounts, access management and a publish-to-members flow — a panel-managed membership platform instead of hand-kept lists.",
  },
];

export function getSectorEn(slug: string): Sector | undefined {
  return sectorsEn.find((s) => s.slug === slug);
}
