---
name: premium-frontend-designer
description: Rulebook for premium UI quality on this portfolio site — typography scale, dark theme discipline, spacing system, motion restraint, hero standards, card polish. Use when designing, building, or reviewing any UI section or page.
---

# Premium Frontend Designer

The site must read as an expensive, credible developer portfolio with SaaS-grade
polish. Every rule below exists to prevent the two failure modes: generic template
and childish hacker theme.

## Typography

- Use a deliberate scale, not ad-hoc sizes. Reference scale:
  - Display (hero H1): `text-5xl`–`text-7xl`, tight tracking (`tracking-tight`), medium/semibold
  - Section heading (H2): `text-3xl`–`text-4xl`, `tracking-tight`
  - Card/sub heading (H3): `text-lg`–`text-xl`
  - Body: `text-base`, relaxed leading; secondary text `text-sm` muted
  - Overline/eyebrow labels: `text-xs`–`text-sm`, uppercase or mono, muted, used sparingly
- One primary sans (e.g. Inter or Geist via `next/font`) + one mono for code/terminal
  accents only. Never more than two font families.
- Line length for prose: max ~65–75ch. Never full-width paragraphs on desktop.

## Dark theme discipline

- Background: near-black neutral (e.g. zinc/neutral 950 range), NOT pure #000.
- Surfaces: one step lighter than background, consistent across all cards.
- Borders: subtle (`white/10` range), same treatment everywhere.
- Text: high-contrast foreground for headings, muted (60–70% range) for secondary.
- ONE accent color family, used sparingly: primary CTAs, small highlights, active states.
- Gradients: allowed only as faint, large-scale background tints or subtle text
  accents. Never rainbow, never more than one visible gradient per viewport.
- Blur/glow: at most one soft ambient glow per page section, low opacity. No
  glassmorphism panels everywhere.

## Spacing & layout rhythm

- Fixed container: consistent max-width (e.g. `max-w-6xl`) with consistent horizontal
  padding on every page.
- Section vertical padding from a consistent scale (e.g. `py-24`/`py-32` desktop,
  reduced proportionally on mobile). Every section uses the same scale.
- Grid gaps consistent (one gap value per grid density). No eyeballed one-off margins.
- Generous whitespace is part of the premium feel — do not cram.

## Hero (above the fold)

- Must establish in <3 seconds: who, what they build, and one primary CTA.
- Name/positioning headline, one supporting sentence, primary + secondary CTA,
  and at most one credibility strip (stack, availability, or selected work).
- No carousels, no auto-playing anything, no oversized illustrations.

## Cards & surfaces

- Consistent radius (one value, e.g. `rounded-xl`), consistent border, consistent
  padding scale, consistent hover treatment (subtle border/foreground shift —
  never scale jumps or layout shift).
- Project cards must carry real information hierarchy: name, one-line outcome,
  stack tags, link. Not just a screenshot in a box.

## Motion (Motion for React)

- Purpose: reinforce hierarchy and polish, never decorate.
- Allowed: short fade/slide on section entry (once, subtle, ≤0.5s, small distance),
  micro-transitions on hover/focus, page-level transitions if cheap.
- Forbidden: staggered animation on every element, parallax abuse, scroll-hijacking,
  infinite looping attention-grabbers, spring wobble on serious content.
- Respect `prefers-reduced-motion`.

## Developer aesthetic — controlled accent only

- Allowed: a small terminal-style snippet, mono-font labels, subtle grid/dot
  background texture at low opacity.
- Forbidden: green-on-black walls, fake code rain, glitch effects, "hacker" copy,
  ASCII banners, blinking cursors everywhere.

## Responsive-first

- Design mobile layout deliberately, not as a squashed desktop.
- No horizontal overflow at 360px. Test 360/390/768/1024/1440.
- Touch targets ≥44px. Mobile nav must be a designed component, not an afterthought.

## Definition of done for any section

1. Follows the typography scale and spacing scale above.
2. Consistent with existing sections (radii, borders, gaps, accent usage).
3. Verified in the browser at mobile and desktop widths (via qa-browser-tester
   when Playwright MCP is available).
4. Would not look out of place on a paid, premium SaaS marketing site.
