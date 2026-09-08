# Stage 0 discovery

**Research date:** 2026-09-07

**Decision:** **GO**, with source-review gates.

## Evidence table

| Area | Observed evidence (claim IDs in `SOURCE_PROVENANCE.md`) | Product implication | Assumption / unresolved question |
|---|---|---|---|
| User problem | PVL reports 52 professions across 25 boards/commissions and 27 programs; application information is distributed across directory, profession pages, PDFs, statutes/rules, and MyPVL (`CLM-HI-001`). | Cross-source navigation has plausible value. | Representative users must validate actual time/confusion reduction. |
| Federal portability | DOJ reports that the SCRA portability provision began in 2023 and changed materially in December 2024; its current page describes covered license, military-order move, and application to the new-state authority (`CLM-FED-001`). | Federal guidance must be dated, cited, and reviewed separately from state routes. | The app cannot determine that a particular license is covered or resolve legal interpretation. |
| Source conflict | Hawaiʻi's 2024 Military Consumer Guide describes five criteria and “eligible for a license”; current DOJ guidance presents a changed three-part framing and “considered valid” language. The PDF's canonical URL also returned 404 during review (`CONFLICT-001`). | Preserve evidence and abstain; do not encode a federal-portability outcome until human review. | Whether the state guide is obsolete, supplementary, or reconcilable is an R3 authority question. |
| Nursing workflow | DCCA nursing pages distinguish RN/LPN exam/without-exam routes, endorsement, employment-dependent temporary permits, combined mail-only permit+endorsement, and temporary military-spouse licensing (`CLM-HI-NUR-001`). State material reports Hawaiʻi is not currently an NLC member (`CLM-COMPACT-001`). | Strong V1 candidate with meaningful branching and channel differences. | Compact facts still expire and require pre-release re-verification. |
| Mental health counseling | DCCA offers general licensure and temporary military-spouse licensing; associate provisional applications opened in 2026 (`CLM-HI-MHC-001`). Hawaiʻi is absent from the current Counseling Compact member list (`CLM-COMPACT-002`). | Strong V1 candidate and freshness test case. | Determine whether provisional licensure is relevant to already-licensed movers. |
| Electrician | DCCA board instructions require application materials, coursework/experience verification, board approval before examination, and a private exam administrator (`CLM-HI-ELP-001`, `CLM-HI-ELP-002`). | Useful contrast: trade route and no located profession-specific TMS form. | Absence of a located form is not proof of ineligibility; escalate to board/PVL. |
| Real estate | REB states Hawaiʻi has no reciprocity; qualified out-of-state licensees may seek prelicense-education and uniform-exam equivalencies, and brokers may seek experience equivalency (`CLM-HI-REB-001`, `CLM-HI-REB-002`). | Useful contrast with commission-specific workflow. | Confirm how current federal portability guidance is operationalized by REB. |
| Existing alternatives | PVL/MyPVL publish instructions and accept applications; DOJ explains federal portability; Military OneSource provides cross-state context. Stage 0 did not locate one bounded, profession-aware Hawaiʻi flow with explicit conflict/freshness behavior. | Build a thin navigator linking outward, not a replacement portal. | The search was not an exhaustive market study; user testing may show direct official sources are adequate and reverse the decision. |
| Privacy | The navigation question can be answered without orders, scans, SSN, account, or saved case. | Keep inputs ephemeral and structured. | Analytics must be privacy-reviewed if added. |
| Architecture | Four-profession deterministic content can be version-controlled and build-validated. | No database or runtime AI for V1. | Revisit only if human review/update workflow becomes unmanageable. |

## Current workflow observed

1. Identify the profession's DCCA board/program.
2. Read a profession landing page and one or more application PDFs.
3. Compare ordinary, endorsement/reciprocity, temporary, and military-connected routes.
4. Separately assess federal SCRA portability and any interstate compact.
5. Reconcile application channel differences (MyPVL, mail, hand delivery, external exam provider).
6. Contact the board/PVL when terms, dates, or authorities conflict.

Friction includes inconsistent terminology, multiple application channels, PDF-heavy instructions, missing/unclear update dates, and federal guidance newer than some state-facing material.

## Alternatives assessment

- **DCCA/PVL and profession pages:** official agency sources with broad coverage, but organized by regulator rather than mover scenario.
- **MyPVL:** application destination; it does not replace pre-application route comparison.
- **U.S. DOJ:** authoritative federal guidance; not profession-specific Hawaiʻi workflow.
- **Military OneSource/state-policy resources:** useful orientation and compact tracking; users still must reach the responsible authority.
- **Private prep/transfer services:** potentially useful for education or paid assistance, but not suitable as rule authority.

## Selected scope rationale

RN/LPN and mental health counseling have explicit state temporary military-spouse materials. Electrician and real estate introduce materially different board/exam/experience workflows and test safe behavior when a profession-specific temporary form is not located. Four groups are enough to test shared and divergent patterns without implying all-profession coverage.

## Baseline plan

Before feature implementation, an independent source reviewer defines four scenario packets and a source-backed oracle. Give representative users only the official-source starting links. Record task completion, elapsed time, pathway/source selected, unsupported claims, escalation, provenance comprehension, and observed friction. Counterbalance and repeat with PCS License Hawaiʻi using the same rubric. Do not claim comparative success until representative-user results exist.

## GO conditions

Proceed because claim-level observations support a bounded navigation gap and a low-data, auditable intervention. GO approves product discovery direction, not individual routing claims. Release remains conditional on human approval of claim records, explicit treatment of the DOJ/Hawaiʻi conflict, compact-status re-verification, two independent R2 reviews per candidate, and representative-user evaluation.
