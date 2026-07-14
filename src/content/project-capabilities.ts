/**
 * ⚠️  SEED / ROLLBACK FIXTURE — NOT LIVE CONTENT.
 *
 * The capability matrix moved into the Project CMS in Phase 38E. The live value
 * is the `capabilities` column on each project row, and the public components
 * read that and nothing else. Editing this file changes NOTHING a visitor sees.
 *
 * It exists so `pnpm cms:seed` knows what to put in that column for the original
 * five, and so `pnpm cms:verify` can prove it landed. To change what the site
 * shows, tick the boxes in /admin/projects.
 *
 * The judgements below were made in Phase 8 against each project's built-list and
 * are carried over VERBATIM — a migration that quietly re-scored a project would
 * be inventing editorial content:
 *
 * - ecommerce-cms: storefront (interface), admin dashboard, product/category
 *   management (data), visual page-building (content).
 * - restaurant-qr-system: QR menu (interface + ordering), waiter/kitchen/cashier
 *   screens (admin + operations), order routing across roles (automation),
 *   full-stack (data).
 * - orva-psychology: public website (interface), admin panel (admin), content
 *   management (content), stored content (data).
 * - log-management-platform: log collection/storage (data + security), review
 *   interface (admin), review workflow (operations).
 * - cendovar: membership accounts (data + membership), publishing signal records
 *   to members (automation + membership).
 */
export const projectCapabilities: Record<string, string[]> = {
  "ecommerce-cms": ["interface", "admin", "data", "content"],
  "restaurant-qr-system": [
    "interface",
    "admin",
    "data",
    "automation",
    "operations",
    "ordering",
  ],
  "orva-psychology": ["interface", "admin", "data", "content"],
  "log-management-platform": ["data", "admin", "operations", "security"],
  cendovar: ["data", "automation", "membership"],
};
