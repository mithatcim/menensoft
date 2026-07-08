---
name: visual-browser-auditor
description: Procedure for auditing the actually rendered UI in a browser (Playwright MCP) — not the source code. Use when verifying visual quality, responsiveness, or interactions, or when asked whether the site "looks good".
---

# Visual Browser Auditor

Source code cannot prove visual quality. This skill defines how to audit the real
rendered site.

## Preconditions

1. Check for Playwright MCP browser tools in the current session.
   - If unavailable, report: "Playwright MCP not available — visual audit not
     performed" and suggest: `claude mcp add playwright npx @playwright/mcp@latest`.
     Do not substitute source-code reading and call it a visual audit.
2. Ensure the dev server is running (`npm run dev`, default http://localhost:3000).
   Start it in the background if needed and wait until it responds.

## Audit procedure

For every page in the nav, at 1440×900 (desktop) and 390×844 (mobile):

1. Load the page; capture a screenshot.
2. Check console for errors and failed requests.
3. Scroll the full page; look for:
   - horizontal overflow (any width down to 360px)
   - text overlap, truncation, contrast failures, tiny tap targets
   - inconsistent section spacing, misaligned grids, uneven card heights
   - broken/missing images, layout shift while loading
4. Exercise interactions: nav links, mobile menu open/close, buttons, hover and
   focus states, form fields (if any).
5. Verify every internal link resolves (no 404s).

## Output format — concise audit

```
## Visual Audit — <date>

### Critical issues        (broken pages/nav, unusable layouts, console errors)
### Visual quality issues  (typography, spacing, contrast, alignment, polish)
### Responsive issues      (per viewport, with the width where it breaks)
### Interaction issues     (menus, links, hover/focus, forms)
### Recommended fixes      (ordered by impact, concrete — file/component level)
```

- Every issue: page, viewport, symptom, suggested fix. Screenshot evidence for
  anything non-obvious.
- Never report "looks good" without listing what was actually opened and checked.
- Judge against `.claude/skills/premium-frontend-designer/SKILL.md` — the bar is
  premium SaaS polish, not merely "not broken".
