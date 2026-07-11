import {
  type FitRecommendation,
  type FitSituation,
  type FitSystemOption,
} from "@/content/fit";

/**
 * English project-fit wizard content (/en/start-project). systemSlug and
 * sectorSlug reference ENGLISH slugs; project slugs are shared. Same rules:
 * no fixed prices, dates or outcome promises.
 */

export const fitSystemsEn: FitSystemOption[] = [
  {
    id: "e-ticaret",
    label: "E-commerce system",
    hint: "Storefront + admin panel + orders",
    systemSlug: "ecommerce-system",
    sectorSlug: "ecommerce-management-system",
    projectSlug: "ecommerce-cms",
    recText:
      "Storefront and management layer in one infrastructure: a system you own instead of a package that limits you. The first conversation covers your current platform and product structure.",
  },
  {
    id: "yonetim-paneli",
    label: "Admin panel",
    hint: "Data, roles, internal screens",
    systemSlug: "admin-panel",
    projectSlug: "ecommerce-cms",
    recText:
      "Data living in spreadsheets and chats moves into role-based, authorized screens. The first conversation covers which data is managed where today.",
  },
  {
    id: "kurumsal-site",
    label: "Corporate site + admin panel",
    hint: "Panel-managed site that collects inquiries",
    systemSlug: "corporate-website",
    sectorSlug: "psychology-clinic-appointment-system",
    projectSlug: "orva-psychology",
    recText:
      "Instead of a frozen brochure, a site updated from a panel that collects inquiries in a system. The first conversation covers what your current site can't do.",
  },
  {
    id: "dashboard",
    label: "Dashboard / reporting",
    hint: "Live status and summaries",
    systemSlug: "dashboard-reporting",
    sectorSlug: "operations-dashboard-system",
    projectSlug: "restaurant-qr-system",
    recText:
      "The state of the work becomes visible at a glance — without asking. The first conversation covers what you can't see today.",
  },
  {
    id: "otomasyon",
    label: "Workflow automation",
    hint: "Manual work moved into software",
    systemSlug: "workflow-automation",
    projectSlug: "restaurant-qr-system",
    recText:
      "A flow running by hand is captured once at the source and routed by rule. The first conversation maps the current process exactly as it is.",
  },
  {
    id: "operasyon",
    label: "Operations system",
    hint: "Multi-role station screens",
    systemSlug: "operations-system",
    sectorSlug: "restaurant-qr-ordering-system",
    projectSlug: "restaurant-qr-system",
    recText:
      "One input reaches every station on its own screen; status is the same for everyone. The first conversation covers the stations your work passes through.",
  },
  {
    id: "emin-degilim",
    label: "Not sure yet",
    hint: "Let's figure it out together",
  },
];

export const fitSituationsEn: FitSituation[] = [
  { id: "sifirdan", label: "I need a brand-new system from scratch" },
  { id: "yetersiz", label: "My current site/panel falls short" },
  { id: "manuel", label: "Work is tracked manually in Excel/WhatsApp" },
  { id: "platform", label: "I want to move off a ready-made platform" },
  { id: "fikir", label: "I want to turn an idea into a working product" },
  { id: "toparlama", label: "I want to clean up an existing system" },
];

export const unsureRecommendationsEn: Record<string, FitRecommendation> = {
  sifirdan: {
    label: "Scoping conversation + solution map",
    text: "Starting from scratch, the first job isn't picking a type — it's mapping the workflow. A short conversation clarifies whether you need a site, a panel or a system; the solution comes after that clarity.",
  },
  yetersiz: {
    label: "Site + panel renewal conversation",
    text: "A site that falls short is usually missing its panel: content can't be updated, inquiries get lost. A panel-managed corporate site structure addresses exactly that.",
    systemSlug: "corporate-website",
    projectSlug: "orva-psychology",
  },
  manuel: {
    label: "Workflow automation",
    text: "Work running on Excel and messages can move into a flow captured once at the source. The first conversation maps the manual process as it is; the boundary of the automation is drawn together.",
    systemSlug: "workflow-automation",
    projectSlug: "restaurant-qr-system",
  },
  platform: {
    label: "Moving to your own e-commerce infrastructure",
    text: "If you've hit the ceiling of a ready-made platform, we talk through a realistic path to infrastructure you own: data, product structure and order flow, step by step.",
    systemSlug: "ecommerce-system",
    sectorSlug: "ecommerce-management-system",
    projectSlug: "ecommerce-cms",
  },
  fikir: {
    label: "Product infrastructure conversation",
    text: "The road from idea to working product starts with the data model. A few sentences describing the idea are enough for the first message; which modules make the first version gets decided together.",
  },
  toparlama: {
    label: "Structure review conversation",
    text: "Before growing an existing system, what stays and what changes has to be clear. In your first message, describe what works and what doesn't today; you'll get an honest assessment back.",
  },
};

/** English resolution — mirrors resolveRecommendation for EN content. */
export function resolveRecommendationEn(
  systemId: string,
  situationId: string,
): FitRecommendation {
  const system = fitSystemsEn.find((s) => s.id === systemId);
  if (system && system.id !== "emin-degilim" && system.recText) {
    return {
      label: system.label,
      text: system.recText,
      systemSlug: system.systemSlug,
      sectorSlug: system.sectorSlug,
      projectSlug: system.projectSlug,
    };
  }
  return (
    unsureRecommendationsEn[situationId] ?? {
      label: "Scoping conversation",
      text: "Describe your situation in a few sentences; we'll clarify together whether you need a system, a site or a panel.",
    }
  );
}

export const fitNeedsEn: { id: string; label: string }[] = [
  { id: "admin-panel", label: "Admin panel" },
  { id: "odeme-siparis", label: "Payments / orders" },
  { id: "randevu", label: "Appointment flow" },
  { id: "uyelik", label: "Membership" },
  { id: "raporlama", label: "Reporting" },
  { id: "icerik", label: "Content management" },
  { id: "otomasyon", label: "Automation" },
  { id: "veri-tasima", label: "Data migration" },
  { id: "rol-yetki", label: "Roles / permissions" },
];
