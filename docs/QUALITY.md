# Quality

## Continuous build mode

Quality work does not wait for the protected source/routing gate. The team may implement and run neutral UI checks, schema validation, unit tests, CI, accessibility/security plumbing, and privacy safeguards continuously without human approval. Human review is required only when results could interpret authority, activate source-backed routing, start participant sessions, support public usability/performance claims, or release the product.

## Test layers

- Schema and referential-integrity tests for sources and rules.
- Unit tests for every routing predicate and abstention branch.
- Integration tests for all four profession journeys and unsupported inputs.
- Accessibility checks plus keyboard-only and 200% zoom review.
- Manual screen-reader checks for questionnaire, validation, result, and escalation flows; verify WCAG 2.2 AA focus, reflow, contrast, status/error announcement, and non-color cues.
- Mobile and desktop browser checks.
- Link/freshness checks that report rather than silently rewrite evidence.
- Time-controlled request/cache/client tests proving an already-live release and a page loaded before expiry disable routing and remove rendered guidance at expiry; test bfcache, every route/result action, server-derived time/TTL, monotonic elapsed time, device-clock changes, suspended timers, offline/visibility/pageshow resume, failed revalidation, and fallback expiry to neutral no-link copy.
- Run both withdrawal paths: a successful source-withdrawal/redeploy within one business day and an intentionally blocked deploy that crosses the SLA, activates the independent Global Config kill switch, disables server and loaded-client routing, then follows authorized audited recovery. Global Config read failure must fail closed.
- Security checks for dependencies, secrets, headers, and input abuse.
- Privacy tests proving application code never sends answer values to URLs, storage, cookies, telemetry, errors, controlled logs, or outbound referrers; cover reload, back/forward cache, tab close/reopen, and shared-device reset. Review production third-party scripts, Vercel telemetry/log settings and retention, privacy notice accuracy, and browser-controlled limitations.
- Production smoke tests against the exact deployed candidate.

## Evaluation set

Before participant sessions, an independent source reviewer establishes the source-backed evaluation oracle, scenario allocation, recruitment minima, subgroup pass/escalation rules, and safety materials. Before public guidance, usability/performance claims, and release, the representative-user baseline is also required. This does not block BL-002's neutral, non-routable shell and CI. The protocol must include all profession/route/military-relationship groups and users facing screen-reader/keyboard, limited-English or low-literacy, weak-connectivity, small-screen, and PDF-access barriers. If a group cannot be recruited at the protocol's minimum, document the exclusion and prohibit broad usability/accessibility claims for that group. Before release, run ordinary routes, military-spouse routes, federal portability review, missing answers, stale/dead sources, conflict, and unsupported professions. Each case declares expected evidence, allowed pathways, required escalation, and forbidden authorization claims. BL-001 uses a baseline-only cohort; BL-007 uses a fresh randomized parallel cohort with matched scenario variants and independent adjudication.

## BL-002 accessibility validation scope

The BL-002 shell has no links, buttons, inputs, or other application controls, so there is no keyboard interaction path to exercise and no dynamic state to announce. Its bounded validation is a rendered browser check of the home page and neutral not-found page, plus deterministic assertions for `lang`, heading/landmark structure, focus-visible styling, reduced-motion handling, and the required security/privacy boundary. The exact check is recorded in the BL-002 pull request. Full rendered WCAG 2.2 AA automation, keyboard-only flow, reflow/contrast review, and manual screen-reader checks remain mandatory when interactive guidance is introduced and are release-gated by BL-008; this exception does not waive NFR-005/AC-006 for later work.

## Release thresholds

- 100% required automated checks pass.
- 100% correct safety-critical pathway/source assertions on approved cases, with no failing profession or route.
- 100% correct abstention for known conflicts and insufficient evidence.
- Zero claims that the application has granted authority to practice.
- At least 95% reach the correct next official source within five minutes overall and within each adequately sampled required subgroup. Full task completion within 10 minutes is secondary. Any subgroup below the primary threshold blocks the corresponding usability claim and triggers remediation or explicit scope limitation. Report denominator, confidence interval, sample size, time, and confusion.
- No unresolved critical/high defect.

Tests may be corrected when the requirement/evidence is wrong; they may not be weakened to accommodate an implementation failure.
