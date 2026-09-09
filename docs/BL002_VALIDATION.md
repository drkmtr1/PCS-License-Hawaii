# BL-002 validation record

**Application candidate SHA (before this evidence-record commit):** 7086bab221f00e52f2a2e5252616821630261122
**Evidence record:** This document is committed immediately after the application candidate; the pull request head contains both commits.
**Scope:** Neutral, non-routable shell and CI only.

## Deterministic checks

- `npm run check`: typecheck, lint, policy tests, production dependency audit, and Next.js production build passed.
- Production audit: `found 0 vulnerabilities`.
- Production header probe: HTTP 200 with CSP, HSTS, referrer, nosniff, frame, and permissions headers; production CSP contains no `unsafe-eval`.
- Policy tests assert no forms, external links, fetches, persistence, answer-bearing state, routing inputs, or licensing pathways; they also assert `lang`, semantic landmarks, focus-visible styling, reduced-motion handling, the header contract, and no tracked environment files or obvious credentials.

## Rendered browser check

The home page was loaded from the local development server at `/` and the neutral not-found state was included in the production build. The accessibility tree showed one main region, a level-one heading, a labelled status section with a level-two heading, and the explicit no-guidance boundary. The browser reported no current console errors or framework overlay after the development-only CSP exception was scoped correctly.

Because BL-002 has no application links, buttons, inputs, or dynamic state, keyboard interaction, focus traversal, and live-region announcements have no application behavior to exercise. Full rendered WCAG 2.2 AA automation, keyboard/screen-reader checks, reflow, and mobile/desktop interaction remain required when guidance is introduced and are release-gated by BL-008.
