/**
 * Route-enter transition. template.tsx re-mounts on every navigation, so the
 * CSS `.page-enter` animation replays and gives a subtle page-to-page settle.
 * CSS-only (SSR-safe, no layout shift, disabled under prefers-reduced-motion);
 * wraps only page content, so it never becomes a containing block for the
 * fixed header/ambient layers in the root layout.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
