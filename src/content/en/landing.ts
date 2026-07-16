import type { LandingPage } from "@/content/landing";

/**
 * English landing pages. Same slugs-by-pairing rule as everything else: each one
 * has a Turkish counterpart, because the sitemap pairs every Turkish route with
 * its English twin and a route without a twin puts a 404 URL in the sitemap.
 *
 * Same honesty rules: no invented clients, no invented metrics, and no claim the
 * site cannot back with a real project.
 */
export const landingPagesEn: LandingPage[] = [
  {
    slug: "ecommerce-website",
    eyebrow: "E-commerce infrastructure",
    title: "E-commerce website development",
    intro:
      "One system where the panel that manages your products also manages the pages that sell them. Not a theme with plugins stacked on top — an infrastructure where product data and storefront are managed from the same place.",
    whoFor: [
      "Businesses selling their own products, managing their own stock and categories",
      "Teams that have hit the limits of a hosted platform and want their own flow",
      "Owners who want to build storefront pages from a panel, not in code",
    ],
    problems: [
      "The store system and the site builder are managed separately and disagree",
      "Product data lives in one place; the page selling it is updated in another",
      "Every campaign page needs a developer",
      "Nobody is sure a panel change actually reached the storefront",
    ],
    features: [
      "Product and category management — the data core of commerce",
      "A storefront with working product and category pages",
      "A visual page builder: storefront pages are built without code",
      "One management surface for commerce and content",
      "Consistent data between the panel and the storefront",
    ],
    process: [
      { step: "Scope", note: "What you sell, and which flow is actually needed" },
      { step: "Data model", note: "Products, categories and relations, done right first" },
      { step: "Panel", note: "The control screens where products and content are edited" },
      { step: "Storefront", note: "Customer pages fed by the managed content" },
    ],
    faq: [
      {
        q: "Why a custom system instead of a hosted e-commerce platform?",
        a: "A hosted platform starts you fast, then constrains you. When your flow differs from the one the platform assumes, every exception becomes a plugin or a workaround. A custom system takes longer to start and is then shaped around your business.",
      },
      {
        q: "Can I update the storefront pages myself?",
        a: "Yes. That is exactly what the visual page builder is for: storefront pages are built and updated from the panel, without code.",
      },
      {
        q: "How do product data and page content stay consistent?",
        a: "They are not two systems. The panel that manages products also manages the pages that sell them, so they cannot drift apart.",
      },
      {
        q: "Has this been built before?",
        a: "Yes. The E-commerce CMS & Visual Site Builder is completed product infrastructure: admin panel, storefront and visual page builder run together.",
      },
    ],
    relatedProjects: ["ecommerce-cms"],
    relatedSystems: ["e-ticaret-sistemi", "admin-panel"],
    relatedSectors: ["e-ticaret-yonetim-sistemi"],
    fitId: "e-ticaret",
    ctaTitle: "Let's talk about your e-commerce infrastructure",
    ctaText:
      "Tell us what you sell and where it breaks today; we'll work out which structure you actually need.",
    seoTitle: "E-commerce website development — infrastructure with an admin panel",
    seoDescription:
      "E-commerce infrastructure where the panel that manages products also manages the pages that sell them. Visual page builder, product/category management, a working storefront.",
  },

  {
    slug: "website-with-admin-panel",
    eyebrow: "Admin panel",
    title: "Website with an admin panel",
    intro:
      "A website whose content you manage yourself. Nothing waits on a developer: you edit in the panel, and what you publish goes live the moment you publish it.",
    whoFor: [
      "Businesses that want to update their own site",
      "Teams whose content changes often and cannot wait on an agency",
      "Organisations where non-technical people must be able to manage content",
    ],
    problems: [
      "Changing a single sentence requires a developer",
      "Content updates take days, and opportunities pass",
      "Nobody can tell who changed what",
      "An unfinished draft could accidentally reach the live site",
    ],
    features: [
      "An admin panel where content is edited",
      "Draft vs published: unfinished content does not reach the site",
      "Role-based access — people see only what they should",
      "Changes go live immediately; no rebuild required",
      "Structured fields: the panel cannot break the site",
    ],
    process: [
      { step: "Fields", note: "Which content genuinely needs to change" },
      { step: "Panel", note: "A structured editor for exactly those fields" },
      { step: "Publish flow", note: "Draft, preview, publish — in that order" },
      { step: "Handover", note: "You are shown how to run it" },
    ],
    faq: [
      {
        q: "When does a change I make in the panel go live?",
        a: "The moment you save it. No rebuild, no deploy to wait for.",
      },
      {
        q: "Could I accidentally publish something half-finished?",
        a: "No. Draft and published content are separate, and publishing is a deliberate, separate action. You can preview before it goes anywhere.",
      },
      {
        q: "Can the panel break the site?",
        a: "No, because it works with structured fields. There is no free-form HTML; every field renders into a designed component.",
      },
      {
        q: "Is there a real example of this panel?",
        a: "Yes. The Orva Psychology project shipped a website and an admin panel together, and this site's own project content is managed the same way.",
      },
    ],
    relatedProjects: ["orva-psychology", "ecommerce-cms"],
    relatedSystems: ["admin-panel", "kurumsal-web-sitesi"],
    relatedSectors: ["psikoloji-klinik-randevu-sistemi"],
    fitId: "yonetim-paneli",
    ctaTitle: "Let's talk about your panel",
    ctaText:
      "Tell us which content you want to manage yourself; we'll work out what the panel needs to cover.",
    seoTitle: "Website with an admin panel — manage your own content",
    seoDescription:
      "A website with an admin panel: update content yourself, work with a draft/publish split, stop waiting on a developer for every change. Structured fields, role-based access.",
  },

  {
    slug: "qr-menu-system",
    eyebrow: "Restaurant & café",
    title: "QR menu system",
    intro:
      "A menu your guest opens on their own phone, with no printing. No redesign and no print shop for a price change: you update the menu in the panel and it is live at once.",
    whoFor: [
      "Restaurants and cafés whose menu changes often",
      "Owners who want out of print cost and print delay",
      "Businesses that want the menu connected to the order flow",
    ],
    problems: [
      "A menu change requires reprinting and redesign",
      "Price updates reach the tables days later",
      "Sold-out items stay on the menu",
      "The menu is a PDF with no connection to the order flow",
    ],
    features: [
      "A QR menu that opens fast on a phone, with no app to install",
      "Items, prices and categories managed from the panel",
      "The menu can be connected to the order flow — not just a picture",
      "Take a sold-out item off the menu instantly",
    ],
    process: [
      { step: "Menu model", note: "Categories, items, prices, variants" },
      { step: "QR flow", note: "From the table to the menu, from the menu to the order" },
      { step: "Panel", note: "The screen where the menu is managed" },
      { step: "Operations", note: "Optional: connect it to the order flow" },
    ],
    faq: [
      {
        q: "Does the guest have to install an app?",
        a: "No. Scanning the QR code opens the menu in their browser.",
      },
      {
        q: "Can I update the menu myself?",
        a: "Yes — items, prices and categories are managed from the panel. No printing, no redesign.",
      },
      {
        q: "Is a QR menu the same as an ordering system?",
        a: "No. The QR menu is what the guest sees; the ordering system is how that order reaches the kitchen and the till. They can be built together or separately.",
      },
      {
        q: "Has this been built before?",
        a: "Yes. The Restaurant QR Menu & Operations System shipped the QR menu, order routing and role-based screens together.",
      },
    ],
    relatedProjects: ["restaurant-qr-system"],
    relatedSystems: ["operasyon-sistemi", "is-akisi-otomasyonu"],
    relatedSectors: ["restoran-qr-siparis-sistemi"],
    fitId: "operasyon",
    ctaTitle: "Let's talk about your menu",
    ctaText:
      "Tell us how often your menu changes and how orders flow today; we'll tell you where to start.",
    seoTitle: "QR menu system — a digital restaurant menu managed from a panel",
    seoDescription:
      "A QR menu with no printing: update items, prices and categories from the panel and publish instantly. Optionally connected to the order flow.",
  },

  {
    slug: "restaurant-ordering-system",
    eyebrow: "Restaurant & café",
    title: "Restaurant ordering system",
    intro:
      "One flow from table to kitchen. Orders are not carried by hand between waiter, kitchen and till — they route themselves to the right station, and their status appears on every screen at once.",
    whoFor: [
      "Restaurants and cafés losing orders at peak hours",
      "Owners whose end-of-day totals never match the orders taken",
      "Teams who want the paper traffic between waiter, kitchen and till gone",
    ],
    problems: [
      "Orders are carried by hand between waiter, kitchen and till",
      "At peak hours orders get lost or fall out of sequence",
      "End-of-day totals do not match the orders actually taken",
      "The only way to know the state of service is to walk the floor",
    ],
    features: [
      "A workflow that routes each order to the right station",
      "Separate role screens for waiter, kitchen and till",
      "A kitchen screen showing queued orders and their status",
      "A till screen with the bill and the end-of-day view",
      "Status changes reflected on every screen instantly",
    ],
    process: [
      { step: "Flow", note: "How an order actually moves today" },
      { step: "Roles", note: "Who should see which screen — and who should not" },
      { step: "Routing", note: "The order reaching its station on its own" },
      { step: "End of day", note: "Totals that match the orders taken" },
    ],
    faq: [
      {
        q: "Can I have the ordering system without a QR menu?",
        a: "Yes. The QR menu is the guest side; the ordering system is the kitchen and till side. Either can be built on its own.",
      },
      {
        q: "Will every member of staff see everything?",
        a: "No. Access is role-based: waiter, kitchen and till each see only their own screen.",
      },
      {
        q: "Why don't end-of-day totals match, and how does this fix it?",
        a: "An order carried by hand leaves no record somewhere along the way. When the order is born in the system, the record already exists — the end-of-day view is not a reconstruction, it is the orders themselves.",
      },
      {
        q: "Has this been built before?",
        a: "Yes. The Restaurant QR Menu & Operations System shipped table-to-kitchen flow with role screens.",
      },
    ],
    relatedProjects: ["restaurant-qr-system"],
    relatedSystems: ["operasyon-sistemi", "is-akisi-otomasyonu"],
    relatedSectors: ["restoran-qr-siparis-sistemi"],
    fitId: "operasyon",
    ctaTitle: "Let's talk about your order flow",
    ctaText:
      "Tell us how an order gets from the table to the kitchen today; we'll find where it breaks.",
    seoTitle: "Restaurant ordering system — one flow from table to kitchen",
    seoDescription:
      "Order routing, kitchen and till screens, role-based access. Instead of paper tickets and shouted orders, a working operations system that carries a full service.",
  },

  {
    slug: "psychologist-website",
    eyebrow: "Psychology & clinic",
    title: "Psychologist website",
    intro:
      "A site your clients trust and you run yourself. You update the content from a panel and route appointment and contact requests into one flow — without waiting on an agency for every change.",
    whoFor: [
      "Psychologists running their own clinic or practice",
      "Practitioners who want to update their own content, articles and services",
      "Clinics that want appointment and contact traffic in one orderly flow",
    ],
    problems: [
      "The site was built once and nobody can update it now",
      "Adding a service or an article requires a developer",
      "Appointment requests scatter across WhatsApp, phone and email",
      "A template cannot carry the seriousness client trust requires",
    ],
    features: [
      "A corporate site whose content is managed from a panel",
      "Structured fields for services, articles and team content",
      "One orderly flow for contact and appointment requests",
      "A restrained approach to data that respects client privacy",
    ],
    process: [
      { step: "Content", note: "Which sections genuinely need updating" },
      { step: "Site", note: "A calm, fast structure that earns trust" },
      { step: "Panel", note: "The screen where content is managed" },
      { step: "Contact", note: "Appointment and contact requests in one flow" },
    ],
    faq: [
      {
        q: "Can I update the site myself?",
        a: "Yes. Services, articles and page content are managed from the panel; no technical knowledge is needed.",
      },
      {
        q: "How is client data protected?",
        a: "Data that is not collected cannot leak. The form takes only what it needs, no unnecessary personal data is stored, and the privacy page says plainly what is collected.",
      },
      {
        q: "Can an appointment system be built too?",
        a: "It depends on scope. The simple form is a contact/appointment request flow; a calendar and session management is a separate scope, worked out in conversation.",
      },
      {
        q: "Has this been built before?",
        a: "Yes. The Orva Psychology project shipped a website and an admin panel together.",
      },
    ],
    relatedProjects: ["orva-psychology"],
    relatedSystems: ["kurumsal-web-sitesi", "admin-panel"],
    relatedSectors: ["psikoloji-klinik-randevu-sistemi"],
    fitId: "kurumsal-site",
    ctaTitle: "Let's talk about your clinic's site",
    ctaText:
      "Tell us what you cannot update yourself today; we'll work out what the site needs to cover.",
    seoTitle: "Psychologist website — a clinic site managed from a panel",
    seoDescription:
      "A website with an admin panel for psychologists and clinics: update your own content, collect appointment and contact requests in one flow. Calm, fast, privacy-respecting.",
  },

  {
    slug: "custom-software-development",
    eyebrow: "Custom software",
    title: "Custom software development",
    intro:
      "For workflows that do not fit inside an off-the-shelf product: software shaped around the work itself — web panels, desktop applications and integrations. Not a template — the data model, the panel and the interface are designed around your flow.",
    whoFor: [
      "Businesses whose work does not match the flow a product assumes",
      "Teams whose systems have become a pile of plugins and workarounds",
      "Owners who want to digitise a process end to end",
    ],
    problems: [
      "The product does 80% of the job and the rest is closed by hand every day",
      "Every exception moves into a plugin or a spreadsheet",
      "Data lives in several places and nobody knows which is right",
      "As the system grows, nobody can explain how it works",
    ],
    features: [
      "A data model built around the workflow",
      "An admin panel that genuinely carries the process",
      "Role-based access and an auditable record of actions",
      "A handover-ready structure: the code and the decisions can be explained",
    ],
    process: [
      { step: "Scope", note: "Which process, and where it breaks" },
      { step: "Model", note: "Data and flow, done right first" },
      { step: "Panel", note: "The screens that carry the process" },
      { step: "Handover", note: "How it works is explained; the code is yours" },
    ],
    faq: [
      {
        q: "When is custom software needed instead of an off-the-shelf product?",
        a: "When the exceptions have become the rule. If you correct the product by hand every day, those corrections already ARE your real system — they simply have not been written down in software.",
      },
      {
        q: "Isn't this more expensive?",
        a: "It takes longer to start. In exchange, the gap you close by hand every month disappears. Which is more expensive depends on what that gap actually costs you.",
      },
      {
        q: "Will I own the code?",
        a: "Yes. The structure is built to be handed over; the decisions and the code are delivered in an explainable state.",
      },
      {
        q: "Where do we start?",
        a: "With the process, not the software. First we get clear on where the flow breaks; the scope comes out of that.",
      },
    ],
    relatedProjects: ["log-management-platform", "cendovar", "ecommerce-cms"],
    relatedSystems: ["is-akisi-otomasyonu", "operasyon-sistemi", "admin-panel"],
    relatedSectors: ["operasyon-dashboard-sistemi", "guvenlik-log-yonetimi"],
    fitId: "otomasyon",
    ctaTitle: "Let's talk about your process",
    ctaText:
      "Tell us the gap you close by hand today; we'll find what actually belongs in software.",
    seoTitle: "Custom software development — a system built around your work",
    seoDescription:
      "Custom software for workflows that do not fit an off-the-shelf product: the data model, admin panel and interface are built around your process. Explainable, handover-ready.",
  },

  {
    slug: "web-systems-for-business",
    eyebrow: "For businesses",
    title: "Web systems for business",
    intro:
      "Not a brochure site — a working system. A web-based structure that actually carries one of your processes: data goes in, work flows, status is visible, and it is managed from a panel.",
    whoFor: [
      "Businesses with a site that contributes nothing to the work",
      "Teams still running the process in spreadsheets and WhatsApp",
      "Owners who want the web as a tool, not a window display",
    ],
    problems: [
      "The site is a brochure; it carries no work at all",
      "The real work runs in spreadsheets, WhatsApp and on paper",
      "Nobody knows where the data is or which copy is correct",
      "The state of the work is only knowable by asking someone",
    ],
    features: [
      "An admin panel that carries the process",
      "Role-based access: everyone sees their own screen",
      "Screens that show the state of the work at a glance",
      "Panel-managed content that goes live the moment it is published",
    ],
    process: [
      { step: "Process", note: "How the work actually runs today" },
      { step: "Scope", note: "What genuinely needs to be digitised" },
      { step: "System", note: "Built with its panel, flow and screens" },
      { step: "Handover", note: "The team is shown how to run it" },
    ],
    faq: [
      {
        q: "What's the difference between a website and a web system?",
        a: "A site tells; a system carries. A site holds content; in a system, data goes in, work flows and status is visible.",
      },
      {
        q: "Isn't this too big for a small business?",
        a: "The scope comes out of the work. A small system that carries one step of one process properly is worth more than a large one nobody uses.",
      },
      {
        q: "Will my current site be replaced?",
        a: "Not necessarily. Usually the site stays, and the panel and flow that carry the work are built on top.",
      },
      {
        q: "Which systems can be built?",
        a: "E-commerce infrastructure, admin panels, operations systems, dashboards and workflow automation — each with a real, delivered example on the projects page.",
      },
    ],
    relatedProjects: ["ecommerce-cms", "restaurant-qr-system", "cendovar"],
    relatedSystems: ["admin-panel", "operasyon-sistemi", "dashboard-raporlama"],
    relatedSectors: ["operasyon-dashboard-sistemi", "uyelik-platformu"],
    ctaTitle: "Let's talk about your work",
    ctaText:
      "Tell us which work runs in which tool today; we'll find what belongs on the web.",
    seoTitle: "Web systems for business — not a brochure site, a working system",
    seoDescription:
      "A web system that actually carries one of your processes: admin panel, role-based access, live status screens. Move the work out of spreadsheets and WhatsApp into one system.",
  },
];

export function getLandingPageEn(slug: string): LandingPage | undefined {
  return landingPagesEn.find((p) => p.slug === slug);
}
