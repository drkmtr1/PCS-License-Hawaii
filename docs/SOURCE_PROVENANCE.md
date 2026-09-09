# Source provenance

## Authority hierarchy

The hierarchy is a research and citation priority, not an automatic legal-precedence engine:

1. Controlling enacted federal/state law and formally adopted rules.
2. Official federal enforcement guidance (for example, U.S. DOJ SCRA guidance).
3. Official compact commission/authority material.
4. Hawaiʻi DCCA/PVL and responsible board/program instructions.
5. Official application forms and MyPVL destinations.
6. Official military resources used only for navigation/context.

No software component may decide which conflicting authority legally controls unless explicit supersession is objectively documented and human-approved.

Source records may be collected, fingerprinted, validated, and kept non-routable during continuous development without human approval. Human approval remains required before source interpretation becomes an approved product claim or routing input.

## Required records

A **source record** contains `sourceId`, authority, title, canonical URL, source type, profession, jurisdiction, retrieval date/method, publication/effective date when stated, accessibility/format, content fingerprint, next-review/expiry date, owner, and source state.

A **claim record** contains `claimId`, exactly one `sourceId`, one independently reviewable proposition, one precise section/page/paragraph locator, a short evidence passage or normalized factual observation, applicability/effective dates, affected professions, reviewer identity/date/evidence, claim state, conflict IDs, and state-dependent dates. `approved` requires `expiresAt`; non-approved states require `nextReviewAt` or a terminal-state date and cannot route. Multi-source or multi-proposition statements are split into atomic claims and composed only at rule/output level. Each rule question, predicate, result sentence, checklist item, destination, and escalation statement references claim IDs—not merely a page. A claim cannot expire after its source; a rule citing multiple claims expires at the earliest claim expiry.

Allowed source/claim states are `observed`, `approved`, `rejected`, `needs-human-review`, `stale`, `dead`, and `withdrawn`. Routing may cite only unexpired `approved` claims.

A **conflict record** contains `conflictId`, all claim/source IDs, exact issue statement, affected rules/output, detected date, owner/qualifications, `conflictState`, resolution basis/evidence, approved fallback copy, approver/date, next review, and audit history. Allowed conflict states are `open`, `unresolved`, `resolved-objectively`, and `withdrawn`. Validation rejects every active-rule reference to a claim linked to `open` or `unresolved`. Both conflict resolution and fallback copy require source-risk review.

## Freshness policy

- Review volatile web instructions at least every 90 days and before release.
- Review statutes/rules at least every 180 days and after each relevant legislative session or known amendment.
- Record missing publication/update dates; never infer them from a URL alone.
- A missed review window marks a source `stale` and prevents definitive routing.
- A moved source may retain identity only after title/authority/content equivalence is verified.
- Dead, inaccessible, materially changed, or conflicting sources cause abstention and escalation.
- Every deploy checks active claim windows and bundles the earliest expiry. The server supplies trusted evaluation time/TTL; every request and client action uses server time plus monotonic elapsed time, not device wall clock. Timer, visibility/pageshow/bfcache resume, discontinuity, offline state, or failed revalidation fails closed. Cache controls prevent extension. A PVL-directory/contact fallback has its own approved claim/expiry; otherwise neutral no-link copy is served.
- A daily source-health job checks links/content fingerprints, stores evidence, and alerts the named owner. Confirmed death/material change opens review immediately; emergency withdrawal and priority redeploy must disable affected results within one business day. If that deployment fails or misses SLA, an authorized lead sets the independently stored Vercel Global Config `routingEnabled` switch false without deployment. Server middleware enforces it on every request; loaded clients poll and recheck before actions; unreadable state fails closed. Recovery is authorized, audited, and smoke-tested.

## Conflict policy

Preserve both claims, their dates, authorities, and exact locators. Mark affected rules inactive until a qualified human reviewer confirms objective supersession or approves exact neutral fallback copy that makes no legal conclusion. Never silently select a winner.

## Source types and destinations

Distinguish controlling law/rules, enforcement guidance, agency instructions, application forms, operational portals, compact authorities, official military context, and private operational vendors. A private vendor is never labeled a government authority; record the authority relationship, data/privacy notice, destination purpose, and accessible fallback.

## Stage 0 observed source inventory

These records support the product GO decision only. They are not approved routing evidence.

| Source ID | Authority / type | Source | Retrieval method/date | State / next action |
|---|---|---|---|---|
| SRC-FED-DOJ-001 | U.S. DOJ / enforcement guidance | [Professional License Portability](https://www.justice.gov/servicemembers/professional-license-portability) | Live page, 2026-09-07 | Observed; R3 review before rule use |
| SRC-HI-PVL-001 | Hawaiʻi DCCA/PVL / agency landing page | [PVL home](https://cca.hawaii.gov/pvl/) | Live page, 2026-09-07 | Observed |
| SRC-HI-PVL-002 | Hawaiʻi DCCA/PVL / guidance PDF | [Military Consumer Guide](https://cca.hawaii.gov/wp-content/uploads/2024/11/Military-Consumer-Guide-Website.pdf) | Search-indexed PDF content; canonical URL returned 404 on 2026-09-07 | Dead; conflict evidence only, locate replacement/archive |
| SRC-HI-NUR-001 | Hawaiʻi DCCA/PVL Board of Nursing / agency instructions | [Nursing forms](https://cca.hawaii.gov/pvl/boards/nursing/application_publications/) | Live page, 2026-09-07 | Observed |
| SRC-HI-MHC-001 | Hawaiʻi DCCA/PVL / agency instructions | [Mental health counselor forms](https://cca.hawaii.gov/pvl/programs/mental/application_publication/) | Live page, 2026-09-07 | Observed |
| SRC-HI-ELP-001 | Hawaiʻi DCCA/PVL Board of Electricians and Plumbers / agency instructions | [Application forms](https://cca.hawaii.gov/pvl/boards/electrician/application_publication/) | Live page, 2026-09-07 | Observed |
| SRC-HI-ELP-002 | Hawaiʻi DCCA/PVL Board of Electricians and Plumbers / agency instructions | [Exam workflow](https://cca.hawaii.gov/pvl/boards/electrician/application-deadline-examination-dates/) | Live DCCA page naming vendor, 2026-09-07 | Observed |
| SRC-VENDOR-PSI-001 | PSI / private operational vendor | [Hawaiʻi trade exam portal](https://test-takers.psiexams.com/hitrade) | Destination named by DCCA, 2026-09-07 | Observed; review privacy/accessibility before linking |
| SRC-HI-REB-001 | Hawaiʻi DCCA Real Estate Branch / agency instructions | [Applicant pathways](https://cca.hawaii.gov/reb/real_ed/real_ed-exam_lic/) | Live page, 2026-09-07 | Observed |
| SRC-HI-REB-002 | Hawaiʻi DCCA Real Estate Branch / FAQ | [Licensing FAQ](https://cca.hawaii.gov/reb/faqs-re_faqs/) | Live page, 2026-09-07 | Observed |
| SRC-HI-LAW-001 | Hawaiʻi Legislature / enacted statute | [HRS 457-7](https://data.capitol.hawaii.gov/hrscurrent/Vol10_Ch0436-0474/HRS0457/HRS_0457-0007.htm) | Live page, 2026-09-07 | Observed; legal-source review required |
| SRC-COMPACT-NLC-001 | State of Hawaiʻi / current state program material | [2026 state application](https://engage.hawaii.gov/wp-content/uploads/2026/01/Compiled-RHT-Application_Redacted29.pdf) | PDF indexed on 2026-09-07 | Observed; confirm again with NLC/state board before approval |
| SRC-COMPACT-CC-001 | Counseling Compact Commission / compact authority | [Member-state map/list](https://counselingcompact.gov/map/) | Live list, 2026-09-07 | Observed; Hawaiʻi absent; expires in 90 days |

## Stage 0 observed claims

These are discovery summaries, not approvable routing claims. Some intentionally summarize several observations. BL-004 must split each into one-proposition/one-precise-locator atomic claim, compare it to the live/archived source, add a content fingerprint and `expiresAt`, and approve it before routing.

| Claim ID | Source | Locator | Normalized observation | State |
|---|---|---|---|---|
| CLM-HI-001 | SRC-HI-PVL-001 | “Who We Are” and quick-access sections | PVL reports 52 professions/vocations, 25 boards/commissions, and 27 programs, with separate board/program and MyPVL destinations. | Observed; expiry set on approval |
| CLM-FED-001 | SRC-FED-DOJ-001 | “About Professional License Portability Under the SCRA” and eligibility/application FAQs | DOJ reports enactment in 2023, material amendment in December 2024, and current covered-license/military-move/application framing. | Needs human review; CONFLICT-001; no active expiry |
| CLM-HI-GUIDE-001 | SRC-HI-PVL-002 | “Portability Qualifications,” PDF p. 33 | The 2024 state guide lists five portability criteria and says a qualifying applicant is eligible for a similar-scope Hawaiʻi license. | Dead; CONFLICT-001; no active expiry |
| CLM-HI-NUR-001 | SRC-HI-NUR-001 | RN/LPN, temporary permit, combined permit+endorsement, and TMS sections | Nursing routes differ by prior license, employment, military relationship, and online versus mail/hand-delivery channel. | Observed; expiry set on approval |
| CLM-HI-MHC-001 | SRC-HI-MHC-001 | License, associate provisional, and TMS sections | The page lists general, associate provisional, and temporary military-spouse pathways. | Observed; expiry set on approval |
| CLM-HI-ELP-001 | SRC-HI-ELP-001 | “Electrician and Plumber License” forms list | DCCA lists application, academic coursework, experience verification, and license-verification materials. | Observed; expiry set on approval |
| CLM-HI-ELP-002 | SRC-HI-ELP-002 | “Application Deadline” and “Examination” sections | DCCA says the board approves an applicant before the applicant registers with PSI for examination. | Observed; expiry set on approval |
| CLM-HI-REB-001 | SRC-HI-REB-001 | Prelicense education, uniform examination, and broker experience equivalency sections | Qualified out-of-state applicants may seek prelicense-education and uniform-exam equivalency, with broker-experience equivalency where applicable. | Observed; expiry set on approval |
| CLM-HI-REB-002 | SRC-HI-REB-002 | FAQ “What if I am licensed … in a state other than Hawaii?” | REB says Hawaiʻi is not reciprocal with any other state. | Observed; expiry set on approval |
| CLM-COMPACT-001 | SRC-COMPACT-NLC-001 | Section D.2 “Licensure compacts” | Current state material says Hawaiʻi is not an NLC member. | Observed; reverify before approval; no active expiry |
| CLM-COMPACT-002 | SRC-COMPACT-CC-001 | “List of Member states” | Hawaiʻi is absent from the current Counseling Compact member list. | Observed; expires 2026-12-06 |

## Open conflict record

| Field | CONFLICT-001 |
|---|---|
| Claims | CLM-FED-001, CLM-HI-GUIDE-001 |
| Issue | Federal guidance changed after the dated Hawaiʻi guide; eligibility criteria, application materials, and effect are framed differently, and the state PDF is now unavailable at its canonical URL. |
| Affected output | Any federal SCRA portability question, predicate, explanation, checklist, or result for all professions. |
| State | Open; all affected routing disabled. |
| Owner/qualification | Project source-review lead; assignment to a qualified source/legal reviewer is required before state may change. |
| Allowed fallback | None. No user-facing copy derived from this conflict may ship while open. A generic PVL-directory/contact fallback must be supported by a separate approved claim. |
| Approver / approval date | Unassigned / none. |
| Detected / next review | 2026-09-07 / 2026-09-14. |
| Audit | Opened during Stage 0; canonical state PDF returned 404 during independent review. |
