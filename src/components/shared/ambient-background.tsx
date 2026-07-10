/**
 * Fixed, site-wide atmosphere: a feathered technical grid, two slowly drifting
 * violet/indigo ambient glows (the deeper indigo is depth only, never an
 * interactive accent), film grain, and a grounding bottom vignette.
 *
 * CSS-only (no JS, no per-frame work). All drift animation is disabled under
 * prefers-reduced-motion via globals.css.
 */
export function AmbientBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="bg-grid mask-radial-faded absolute inset-0 opacity-60" />
      <div className="animate-drift-a absolute -top-[15%] left-[8%] h-[70vh] w-[70vh] rounded-full bg-[radial-gradient(circle,rgba(139,140,248,0.10),transparent_62%)]" />
      <div className="animate-drift-b absolute -bottom-[12%] right-[4%] h-[58vh] w-[58vh] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.06),transparent_62%)]" />
      <div className="bg-noise absolute inset-0 opacity-[0.035]" />
      <div className="from-background absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t to-transparent" />
    </div>
  );
}
