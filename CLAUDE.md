# Personal Portfolio — Full Stack Developer & Digital Product Builder

Premium multi-page personal website. Not a CV site — it must communicate the ability
to build real digital products: admin panels, SaaS-like systems, e-commerce, automation
tools, full-stack applications.

## Status

- Phase: MVP foundation scaffolded (2026-07-08). Next.js 16 (App Router) + TypeScript +
  Tailwind v4 + shadcn/ui + motion + lucide-react. All six routes, typed content files,
  and core components exist with honest draft content (TODOs marked in `src/content`).
- Dev note: port 3000 is often occupied by the separate eticaret app — `pnpm dev`
  falls back to http://localhost:3001. Check the dev server output for the real port.
- Local-first development. Deploy target is Vercel later — **do not deploy**.

## Locked decisions (2026-07-08)

- Package manager: **pnpm** (not npm).
- Playwright MCP must be verified available before any UI implementation.
- First version is local-only. Do not deploy.
- Site language: English. Turkish may come later — do NOT implement multilingual
  routing or i18n infrastructure in the MVP.
- Visual direction: premium developer portfolio + premium SaaS landing page.
- All copy/content lives in typed files under `src/content`.
- Honest placeholder content only where real content is missing — clearly placeholder,
  never invented facts.
- Do not overbuild: no advanced animation, no contact form backend, no speculative features
  until explicitly requested.

## Tech stack (fixed — do not add alternatives)

- Next.js (App Router) + TypeScript
- Tailwind CSS
- shadcn/ui
- Motion for React (`motion` package)
- lucide-react
- Package manager: pnpm

## Commands

- `pnpm dev` — start dev server (default http://localhost:3000)
- `pnpm build` — production build (use to verify before claiming done)
- `pnpm lint` — lint

## Design language (non-negotiable)

- Premium developer portfolio / SaaS-like visual quality. Dark, polished, structured.
- The site must look expensive and credible — never childish, never "hacker theme".
- Terminal/developer aesthetic is allowed only as a small, controlled accent.
- Restraint: no neon overload, no random gradients, no excessive blur, no noisy animations.
- Strong typography scale, consistent spacing rhythm, responsive-first.
- Full rules live in `.claude/skills/premium-frontend-designer/SKILL.md`.

## Content rules

- No fake testimonials, no fake client logos, no invented production clients.
- No exaggerated founder/visionary language. Concrete and believable only.
- Content strategy rules: `.claude/skills/portfolio-content-strategist/SKILL.md`.

## Workflow

- Architecture/structure decisions → `frontend-architect` agent.
- Visual quality decisions → `visual-designer` agent.
- Verification of rendered UI → `qa-browser-tester` agent (Playwright MCP when available).
- Never claim the UI looks good from source code alone when browser tooling is available.
- Prefer reusable components; avoid overengineering and premature abstraction.

## Hard constraints

- Do NOT read `.env` or secret files.
- No backend, database, auth, or admin panel in this project.
- No unnecessary dependencies — every new package needs a stated reason.
- No paid APIs, no analytics/tracking scripts.
- Do not deploy or push to remote unless explicitly asked.
