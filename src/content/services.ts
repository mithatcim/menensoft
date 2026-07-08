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
  },
  {
    id: "ecommerce",
    title: "E-commerce systems",
    summary:
      "A storefront and the management layer behind it — products, categories, and content, all editable without code.",
    includes: [
      "Product catalog and category structure",
      "Storefront pages built for conversion, not clutter",
      "Content management for non-technical editors",
      "Order and inventory screens",
    ],
    stack: ["Next.js", "TypeScript", "React", "Tailwind CSS"],
  },
  {
    id: "full-stack-apps",
    title: "Full-stack web applications",
    summary:
      "SaaS-style products built end to end — data model, backend logic, and the interface, shipped as one coherent system.",
    includes: [
      "Data modeling and API design",
      "Authentication and role handling",
      "Responsive, accessible UI",
      "Deployment-ready project setup",
    ],
    stack: ["Next.js", "TypeScript", "Node.js", "SQL databases"],
  },
  {
    id: "automation-tools",
    title: "Automation & internal tools",
    summary:
      "Purpose-built software that replaces a manual workflow — order routing, content pipelines, repetitive back-office work.",
    includes: [
      "Mapping the current manual process honestly",
      "A tool scoped to the workflow, not a platform fantasy",
      "Integrations with the systems you already use",
      "Documentation your team can follow",
    ],
    stack: ["TypeScript", "Node.js", "Next.js"],
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
