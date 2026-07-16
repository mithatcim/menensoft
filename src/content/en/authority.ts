import {
  type ComparisonDimension,
  type Pillar,
} from "@/content/authority";

/**
 * English authority/comparison content (/en/why-menensoft and
 * /en/custom-system-vs-template). Persuasive but honest: no competitor
 * bashing, no invented numbers, ready-made tools endorsed where they fit.
 */

export const whyPillarsEn: Pillar[] = [
  {
    title: "Clear scope",
    body: "Before development starts, what will be built — and what won't — is agreed in writing. Unclear work gets clarified, not inflated.",
  },
  {
    title: "Ownership",
    body: "The delivered system is yours: the codebase, the data model and the admin panel. No dependency on rented templates or closed boxes.",
  },
  {
    title: "Admin panel",
    body: "Every system ships manageable. Content, products, requests — updated from the panel without waiting for a developer.",
  },
  {
    title: "Workflow fit",
    body: "The system is sized to your business; your business is not bent to a template. The existing flow is mapped honestly first, then built.",
  },
  {
    title: "Maintainability",
    body: "Small reviewable steps, clean structure, documentation. The system keeps living with you after the handoff.",
  },
  {
    title: "Honest assessment",
    body: "If a ready-made tool is enough, you'll be told so plainly. Recommending custom software for every job isn't selling — it's waste.",
  },
];

export const notWeEn = [
  "Not a faceless agency: you work directly with the founder-led team behind the brand — led by Mithat Yılmaz — with no layer in between.",
  "Not a template reseller: there is no swap-the-logo-on-a-theme business model here.",
  "Not a vendor that says yes to everything: if the scope doesn't fit the work, that is said openly.",
  "Not a promise machine: you will find no client names, made-up numbers or ranking pledges here.",
];

export const whoFitsEn = [
  "Businesses moving a workflow into software who like working directly with the builder",
  "Anyone who wants panel-managed infrastructure they actually own",
  "Buyers looking for a project relationship with clear scope and concrete deliverables",
  "Teams that want a long-lived, transferable system",
];

/* ------------------- ready-made site vs custom system ------------------- */

export const comparisonShortAnswerEn =
  "Short answer: if all you need is a brochure, a ready-made site is usually enough. If you have a workflow to move into software — orders, requests, appointments, content management — a custom, panel-managed system makes sense.";

export const whenReadyMadeEn = [
  "All you need is a few brochure pages",
  "Content rarely changes and a few form emails are enough",
  "Budget and time are very tight, and your flow is standard",
  "Living within a ready-made platform's rules doesn't bother you",
];

export const whenCustomEn = [
  "A workflow — orders, requests, appointments — is moving into software",
  "Your team will manage content and data from a panel",
  "Several roles work on the same data",
  "You've hit the ceiling of a ready-made package and want ownership",
  "The way you operate is expected to grow and change",
];

export const comparisonDimensionsEn: ComparisonDimension[] = [
  {
    name: "Ownership",
    ready: "The infrastructure belongs to the platform; you rent it.",
    custom: "The codebase and data model are yours.",
  },
  {
    name: "Content management",
    ready: "As much as the platform's panel allows.",
    custom: "The panel is designed around your business's real fields.",
  },
  {
    name: "Workflow fit",
    ready: "Your flow is bent to the template's mold.",
    custom: "The system is sized to your flow.",
  },
  {
    name: "Growth and customization",
    ready: "Stays within plugin and theme limits.",
    custom: "Modules grow with the need.",
  },
  {
    name: "Cost structure",
    ready: "Low entry; ongoing rent and plugin costs.",
    custom: "A project price by scope — set by scope and modules.",
  },
  {
    name: "Maintenance and handoff",
    ready: "Updates tied to the platform.",
    custom: "A documented, transferable structure.",
  },
];

export const decisionQuestionsEn = [
  "Do you have a real workflow to move into software?",
  "Will your team manage the content or the data?",
  "Is the way you operate expected to grow or change soon?",
];

export const decisionVerdictEn =
  "If most answers are yes, a custom system is worth a conversation. If not, use a ready-made tool — and if your need turns out to be solvable with one, we'll say so plainly; selling custom software for the wrong job serves no one.";
