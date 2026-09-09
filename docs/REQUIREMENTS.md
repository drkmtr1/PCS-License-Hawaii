# Requirements

## Functional

- **FR-001** A user can select one of the four supported profession groups.
- **FR-002** The questionnaire asks only questions that affect an approved rule.
- **FR-003** Deterministic rules return potential pathways, not eligibility decisions.
- **FR-004** Every question, predicate, pathway, explanation, document item, destination, and escalation statement references one or more approved claim IDs with exact locators.
- **FR-005** Results include official application destination and responsible authority.
- **FR-006** Results expose retrieval/verification date, freshness, and conflict state.
- **FR-007** Unsupported, incomplete, expired, stale, dead, changed, or conflicting cases abstain and give actionable escalation guidance.
- **FR-008** Direct URLs render a valid page or a comprehensible unsupported state.

## Nonfunctional

- **NFR-001** No account is required. Application-controlled code never writes answers to URLs, browser storage, cookies, telemetry, errors, controlled logs, or outbound referrers; form restoration/autofill is disabled where practical, and a visible reset clears in-memory answers.
- **NFR-002** Production output contains no secret or privileged key.
- **NFR-003** Structured sources, claims, conflicts, and rules fail validation on missing/duplicate IDs, invalid references, absent locators, or incomplete state-dependent review/expiry evidence; every approved claim requires a valid `expiresAt`.
- **NFR-004** The primary path works on current mobile and desktop browsers.
- **NFR-005** The application conforms to WCAG 2.2 AA, including keyboard order, visible focus, status/error announcements, contrast and non-color cues, 200% zoom/reflow, 24-by-24 CSS-pixel minimum targets, reduced motion, and manual screen-reader checks.
- **NFR-006** External links are clearly identified and failures never become positive claims.
- **NFR-007** Security headers and input length/type constraints are enforced.
- **NFR-008** The server supplies trusted evaluation time/TTL and every request/client action enforces the earliest active-claim expiry using monotonic elapsed time, not device wall-clock time. Timer, visibility/pageshow, bfcache, clock discontinuity, offline resume, and failed revalidation all invalidate or fail closed. Cache policy cannot extend guidance. An official-directory/contact fallback needs its own approved unexpired claim; otherwise neutral no-link copy is shown. Daily source-health checks alert a named owner, and confirmed withdrawal/redeploy completes within one business day.
- **NFR-009** Production has a reviewed third-party-script inventory, verified Vercel telemetry/log settings and retention, an accurate privacy notice, and documented unavoidable hosting metadata.
- **NFR-010** A protected Vercel Global Config `routingEnabled` kill switch is independently operable without content deployment, read server-side on every request, polled by loaded clients, and fail-closed when unreadable. Missing withdrawal SLA disables all routing; recovery requires authorized review and smoke evidence.

## UX and responsibility

- **UX-001** Primary flow is profession → necessary questions → guidance → official action.
- **UX-002** Official source text, application explanation, and unresolved ambiguity are visually distinct.
- **UX-003** Legal and licensing terminology has plain-language explanations.
- **UX-004** Each result states that the responsible authority—not this application—makes the licensing determination.
- **UX-005** Escalation identifies a verified contact, office/availability when published, the question to ask, information not to send, fallback contact, and a neutral warning not to begin practice based on this application's guidance.
- **UX-006** External PDFs and private operational vendors are labeled by type, format, and accessibility limitation, with an accessible authority contact fallback.

## Acceptance criteria

- **AC-001** A valid representative scenario for each profession returns only source-backed pathways.
- **AC-002** An unsupported profession returns no inferred pathway and links to the PVL directory.
- **AC-003** Missing material answers cause a neutral request for information, not an inferred answer.
- **AC-004** An active rule cannot reference a stale, dead, withdrawn, expired, or unapproved claim, or any claim linked to an `open`/`unresolved` conflict; affected cases abstain and escalate.
- **AC-005** Automated integrity tests reject nonexistent, unapproved, expired, duplicate, or unlocated claim IDs and any output field lacking claim evidence.
- **AC-006** Keyboard, mobile viewport, WCAG 2.2 AA automation, manual screen-reader/error-flow, unit, integration, and production smoke checks pass.
- **AC-007** Deterministic product-output audit records 100% correct safety-critical assertions on approved cases, 100% abstention outside evidence, and zero application authorization claims. Representative-user evaluation records at least 95% reaching the correct next official source within five minutes overall and per adequately sampled required subgroup; full completion within 10 minutes is secondary. Report per profession/route/subgroup.
- **AC-008** Automated privacy checks show no answer values in URL/history, storage, cookies, telemetry, error payloads, logs under application control, or outbound referrers.
- **AC-009** Time-controlled tests prove request, cache, bfcache, every route/result action, and a page loaded before but used after expiry all fail closed; rendered guidance disappears on expiry. Tests include backward/forward device-clock changes, suspended timers, offline/visibility/pageshow resume, trusted-time failure, and monotonic TTL handling. An expired fallback becomes neutral no-link copy. Daily health-check evidence, alert ownership, and the successful one-business-day withdrawal drill pass.
- **AC-010** Reload, back/forward cache, tab close/reopen, and shared-device reset tests pass; production privacy review verifies third-party scripts, host telemetry/log retention, and notice accuracy, while documenting browser behaviors outside application control.
- **AC-011** A drill intentionally blocks withdrawal deployment, crosses the SLA, changes Global Config without deployment, and proves server requests and already-loaded clients disable all routing. Recovery is authorized, audited, and smoke-tested. Global Config read failure also fails closed.
