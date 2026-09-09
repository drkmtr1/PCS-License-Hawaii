# Architecture

## Decision

V1 will be a mostly static web application with a small request-time release-expiry gate on Vercel, version-controlled structured source/rule data, deterministic routing, and no persistent applicant data.

Supabase is not justified for V1. There is no account, case persistence, administrative workflow, or high-frequency source editing requirement. Avoiding a database removes keys, RLS policy surface, migrations, and unnecessary user-data risk. Revisit only through an ADR when evidence shows a database-backed workflow is necessary.

Runtime AI is also not justified for V1. Plain-language copy can be human-reviewed and stored with the rule records. Deterministic output is easier to audit, test, and trace.

## Logical components

1. BL-002 neutral accessible shell; the future questionnaire UI remains gated by approved claims and routing work.
2. Validated source/claim/conflict registry (BL-003); observed records are non-routable until BL-004 approval.
3. Validated deterministic rules (BL-003 integrity only; routing implementation is later work).
4. Pure routing function returning structured navigation results.
5. Result renderer with citations, freshness/conflict states, and authority escalation.
6. Build-time integrity checks and automated tests.
7. Server and client safety guards: the server controls document/data caching, supplies a trusted evaluation timestamp/TTL, and checks every request. The client uses monotonic elapsed time, checks before every routing/result action, and invalidates on timer, visibility/pageshow resume, discontinuity, or inability to revalidate.
8. A minimal Vercel Global Config `routingEnabled` kill switch, read server-side on every request and polled by loaded clients, disables all routing without a content deployment. Global Config is configuration only—not applicant storage.

## BL-002 implementation boundary

The initial Next.js App Router implementation is a static server-rendered shell with TypeScript, no runtime data store, no client state, no external links, and no routing behavior. It communicates only that the prototype is unavailable and cannot provide licensing advice or determine authorization. The CI contract runs typecheck, lint, policy tests, production dependency audit, and a production build. Source registries, claims, rules, contacts, questionnaire decisions, and result pathways are intentionally absent until their approved backlog items are eligible.

BL-003 adds an isolated, version-controlled evidence registry and validator. It enforces atomic source/claim/conflict references, HTTPS canonical URLs on the approved-host allowlist, freshness/applicability/terminal dates, approval evidence and expiry, conflict blocking, and rule expiry bounds. The application shell does not import this registry; an observed or evaluation-only record never activates routing.

## Data boundaries

Questionnaire answers remain in component memory only. Application code must not place them in URLs, browser storage, cookies, telemetry, error payloads, controlled logs, or outbound referrers. A visible reset clears answers; form restoration/autofill is disabled where practical. Lifecycle tests cover reload, back/forward cache, tab close/reopen, and shared-device reset while acknowledging browser-controlled crash/session restoration cannot be guaranteed. Hosting still receives ordinary access metadata, which the privacy notice and verified host configuration must disclose. Analytics are off by default and require separate privacy approval.

## Failure behavior

Invalid data fails the build. Unknown combinations, unavailable sources, and conflicts produce abstention. Every deployed rule has a claim expiry. The server compares its clock with the bundled earliest active-claim expiry on every request, returns a signed/bound trusted evaluation time and remaining TTL, and prevents CDN/browser caching from extending regulated guidance. The client uses monotonic elapsed time rather than device wall-clock time, checks before every routing/result action, and removes rendered guidance at expiry. Clock discontinuity, offline/visibility/pageshow resume, suspended-timer uncertainty, or failed revalidation fails closed. After expiry, the app may show a separately approved, independently expiring PVL-directory/contact fallback; otherwise it shows neutral no-link unavailability copy.

A daily source-health job checks links/fingerprints, alerts the named source owner, and creates review evidence. Confirmed dead/materially changed sources must be withdrawn and redeployed within one business day. Independently, Vercel Global Config holds a server-read `routingEnabled` kill switch that can be changed through protected dashboard/API access without rebuilding or deploying content; server middleware enforces it on every request and loaded clients poll/recheck before result actions. If withdrawal/redeploy misses the SLA, the authorized source-review lead sets the switch false. Failure to read the switch fails closed. Recovery requires documented authorization and a passing smoke test. The UI identifies the recorded verification date and never claims a live source was checked when it was not.
