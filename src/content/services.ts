/**
 * Services / capabilities content.
 *
 * Framed as offerings someone could actually hire — what's included and the
 * typical stack. No pricing, no invented process theater.
 */

export interface Service {
  id: string;
  title: string;
  summary: string;
  includes: string[];
  stack: string[];
  /** The concrete thing handed over at the end. */
  deliverable: string;
}

export interface WorkflowStep {
  step: string;
  title: string;
  description: string;
}

export const services: Service[] = [
  {
    id: "admin-panels",
    title: "Admin panels & dashboards",
    summary:
      "Internal tools your team uses every day: manage data, content, orders, and users from screens built for the job.",
    includes: [
      "CRUD screens for your core data",
      "Role-based access to sensitive areas",
      "Search, filtering, and data tables that stay fast",
      "Clean forms with proper validation",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "SQL databases"],
    deliverable:
      "A working admin panel your team can sign into and run the day on.",
  },
  {
    id: "ecommerce",
    title: "E-commerce systems",
    summary:
      "A storefront and the management layer behind it: products, categories, and content, all editable without code.",
    includes: [
      "Product catalog and category structure",
      "Clean, fast storefront product and category pages",
      "Content management for non-technical editors",
      "Order and inventory screens",
    ],
    stack: ["Next.js", "TypeScript", "React", "Tailwind CSS"],
    deliverable:
      "A storefront plus the management layer behind it, editable without code.",
  },
  {
    id: "full-stack-apps",
    title: "Full-stack web applications",
    summary:
      "SaaS-style products built end to end: data model, backend logic, and interface, shipped as one coherent system.",
    includes: [
      "Data modeling and API design",
      "Authentication and role handling",
      "Responsive, accessible UI",
      "Deployment-ready project setup",
    ],
    stack: ["Next.js", "TypeScript", "Node.js", "SQL databases"],
    deliverable:
      "One coherent codebase: data model, backend, and interface, ready to deploy.",
  },
  {
    id: "automation-tools",
    title: "Automation & internal tools",
    summary:
      "Purpose-built software that replaces a manual workflow: order routing, content pipelines, repetitive back-office work.",
    includes: [
      "Mapping the current manual process honestly",
      "A tool scoped to the workflow, not a platform fantasy",
      "Integrations with the systems you already use",
      "Documentation your team can follow",
    ],
    stack: ["TypeScript", "Node.js", "Next.js"],
    deliverable:
      "A tool that replaces the manual workflow it was scoped around, with documentation.",
  },
];

export const workflow: WorkflowStep[] = [
  {
    step: "01",
    title: "Scope",
    description: "Agree on what to build — and what to leave out.",
  },
  {
    step: "02",
    title: "Build",
    description: "Ship working software in small, reviewable steps.",
  },
  {
    step: "03",
    title: "Iterate",
    description: "Adjust from real usage and feedback, not assumptions.",
  },
  {
    step: "04",
    title: "Ship",
    description: "Deliver, document, and hand over cleanly.",
  },
];
