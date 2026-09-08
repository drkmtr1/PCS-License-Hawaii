# Quality

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

Before implementation, an independent source reviewer establishes the source-backed oracle, scenario allocation, recruitment minima, subgroup pass/escalation rules, and baseline. The protocol must include all profession/route/military-relationship groups and users facing screen-reader/keyboard, limited-English or low-literacy, weak-connectivity, small-screen, and PDF-access barriers. If a group cannot be recruited at the protocol's minimum, document the exclusion and prohibit broad usability/accessibility claims for that group. Before release, run ordinary routes, military-spouse routes, federal portability review, missing answers, stale/dead sources, conflict, and unsupported professions. Each case declares claim IDs, allowed pathways, required escalation, and forbidden authorization claims. Baseline and product tasks are counterbalanced and adjudicated independently.

## Release thresholds

- 100% required automated checks pass.
- 100% correct safety-critical pathway/source assertions on approved cases, with no failing profession or route.
- 100% correct abstention for known conflicts and insufficient evidence.
- Zero claims that the application has granted authority to practice.
- At least 95% task completion overall and within each adequately sampled required subgroup; any subgroup below threshold blocks the corresponding usability claim and triggers remediation or explicit scope limitation. Report sample size, time, and confusion separately.
- No unresolved critical/high defect.

Tests may be corrected when the requirement/evidence is wrong; they may not be weakened to accommodate an implementation failure.
