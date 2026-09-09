# Evaluation and baseline protocol

**Backlog:** BL-001

**Status:** Protocol candidate; no representative-user results have been collected.

**Safety boundary:** This document does not approve licensing claims or determine authorization to practice.

## Decision questions

1. Can representative users identify the relevant official Hawaiʻi/federal sources and next responsible authority using current official resources alone?
2. Does PCS License Hawaiʻi improve task completion and time without reducing source/pathway correctness or creating authorization claims?
3. Do conflict, missing-evidence, accessibility, language, device, and connectivity conditions produce correct abstention and escalation?

## Independent evaluation oracle

Before any participant session, a qualified source reviewer and a qualified evaluation-methods lead must:

1. Create evaluation-only answer-key records with one proposition, one official source, one precise locator, a fingerprint, retrieval date, reviewer evidence, and a review deadline.
2. Independently specify for each scenario: required official sources/destinations, acceptable participant answers, required questions/escalations, forbidden answers, and scoring rationale.
3. Lock the scenario coverage matrix, sample/precision rationale, recruitment minima, subgroup decision rules, and analysis plan.
4. Treat CONFLICT-001 as an expected abstention/escalation case; the evaluation oracle may score recognition of the conflict but cannot approve user-facing routing copy or resolve legal authority.
5. Sign and date the oracle/protocol at an exact Git commit. Neither the implementer nor facilitator may serve as oracle approver or evaluation-methods approver.

Evaluation-only oracle records never activate application routing and do not satisfy BL-004 product-claim approval. BL-004 later converts the bounded oracle evidence into the application claim schema with independent routing/source review.

If facts or labels change after sessions begin, preserve both oracle versions and an impact log. Independently rescore prior sessions when the task and evidence remain materially equivalent; discard and rerun affected sessions when the task, expected route, source set, or difficulty changes.

## Scenario matrix

All facts are fictional and deliberately omit names, license numbers, employers, orders, health details, and other personal data. Participants must not substitute real personal information.

| Scenario | Fictional facts | Participant task | Candidate evidence to review | Safety-critical expected behavior |
|---|---|---|---|---|
| EV-RN-001 | Military spouse; relocating to Hawaiʻi under PCS orders; current unencumbered out-of-state RN license; accepted work with a Hawaiʻi health-care entity. | Find potential official routes, application channel, documents/questions to verify, and final authority. | CLM-HI-NUR-001, CLM-COMPACT-001, CONFLICT-001 | Evaluation oracle distinguishes ordinary/endorsement, employment-dependent permit, and TMS source categories; participant should flag federal uncertainty and never say practice may begin. |
| EV-MHC-001 | Military spouse; relocating under PCS orders; current out-of-state mental-health counselor license; no Hawaiʻi provisional-license assumption. | Find potential official routes, application destination, compact status, and unresolved questions. | CLM-HI-MHC-001, CLM-COMPACT-002, CONFLICT-001 | Evaluation oracle distinguishes general/TMS/provisional source categories; participant should not imply provisional relevance and should flag federal uncertainty. |
| EV-ELP-001 | Servicemember; relocating under orders; current out-of-state electrician credential; Hawaiʻi education/experience equivalence unknown. | Find the responsible board, ordinary application/exam workflow, and questions requiring board confirmation. | CLM-HI-ELP-001, CLM-HI-ELP-002, CONFLICT-001 | Do not infer reciprocity/equivalence or TMS availability; label PSI as an operational vendor; abstain on federal portability. |
| EV-REB-001 | Military spouse; relocating under PCS orders; active unencumbered out-of-state real-estate salesperson license. | Determine whether reciprocity exists, which equivalencies may be reviewed, the examination/application sequence, and who confirms it. | CLM-HI-REB-001, CLM-HI-REB-002, CONFLICT-001 | Do not confuse continuing-education renewal with initial licensure; do not promise an equivalency; abstain on federal portability. |
| EV-UNS-001 | User selects an unsupported profession. | Find the official starting point and safe next action. | Evaluation-only PVL directory/contact evidence with a current review deadline is required. | No inferred pathway; accept only the oracle-accepted current official directory/contact, or neutral no-link uncertainty if unavailable. |
| EV-CON-001 | A required source is conflicting, past review, changed, dead, or withdrawn. | Determine what can safely be said and who must answer. | Evaluation-only conflict/freshness fixtures, including CONFLICT-001. | Participant should abstain, avoid hidden precedence/authorization claims, and use only oracle-accepted current official escalation evidence. |

Before recruitment, the reviewers must expand these seeds into a locked coverage matrix mapping every in-scope route, spouse and servicemember relationship, missing-material-answer branch, unsupported case, and current/past-review/dead/changed/withdrawn/conflict state to at least one independently scoreable matched scenario variant. No session may begin with a coverage cell empty. At BL-004, product output will separately require approved unexpired claims for every route, destination, and escalation statement.

## Baseline starting bundle

For the official-resource-only condition, provide the same neutral starting bundle to every participant:

- [Hawaiʻi DCCA/PVL](https://cca.hawaii.gov/pvl/)
- [DCCA boards and programs](https://cca.hawaii.gov/pvl/boards-and-programs/)
- [U.S. DOJ professional license portability](https://www.justice.gov/servicemembers/professional-license-portability)

Do not provide profession-specific deep links, hints, or source interpretations. Use a clean standardized study browser profile with no saved history/logins, extensions, AI assistant, or personalization. Navigation is allowlisted to official federal/state/compact domains and official pages' named operational vendors; search engines, private advice sites, AI summaries, and the PCS License Hawaiʻi domain are blocked for the baseline condition. Log every attempted departure, redirect, dead link, PDF/accessibility barrier, external vendor, and contact destination. Participants stop at an application, login, form-submission, email, or phone destination and must not submit/contact anything.

## Study design

The study has two preregistered phases:

1. **BL-001 baseline:** a baseline-only cohort uses official resources. No product exists or is shown. Results establish current task completion, accuracy, time, and friction.
2. **BL-007 comparison:** a fresh cohort with no BL-001 participation is randomized and stratified to product or official-resource conditions using matched equivalent scenario variants. The evaluation lead preregisters allocation and equivalence; participants never repeat a scenario or cross conditions.

A facilitator may clarify the task but may not interpret sources, suggest a pathway, or help navigate. A second evaluator scores restricted pseudonymized recordings/notes against the locked oracle without condition labels where practical. Stop a task at 10 minutes, but treat correct-next-official-source within five minutes as the primary endpoint; full completion by 10 minutes is secondary. Do not ask whether someone is legally eligible or invite real licensing facts. The study tests navigation, not legal judgment.

## Required recruitment coverage

The qualified evaluation-methods lead preregisters sample size/precision rationale, numerical minima, scenario allocation, subgroup denominators, pass/escalation rules, and missing-data handling before recruitment. The study must cover every profession/route/military-relationship scenario and these risk dimensions:

- keyboard-only and screen-reader use;
- limited English or low licensing/legal literacy;
- weak connectivity;
- small-screen/mobile use;
- difficulty accessing or understanding PDFs.

Provide accessible and, when needed, professionally translated consent/task materials; interpreters may translate neutrally but may not explain licensing content. Verify session and recording tools with the participant's assistive technology before scoring. Record self-described accessibility needs only at the least granular level needed for analysis and with participant consent. If a required group cannot meet its locked minimum, document the exclusion and do not make broad usability/accessibility claims for that group.

## Metrics and scoring

| Metric | Scoring |
|---|---|
| Primary user endpoint | Participant reaches the correct next official source within five minutes; report proportion and confidence interval. Product target is at least 95% overall and per adequately sampled required subgroup. Baseline is descriptive. |
| Full task completion | All oracle-required source, destination, and escalation elements found within 10 minutes; secondary user outcome. |
| Completion time | Start to first correct next official source and to last required element. |
| Participant source/pathway accuracy | Score against the evaluation oracle and report errors as user outcomes, not application safety failures. |
| Participant unsupported statements | Count statements outside the evaluation oracle or implying authorization; report as comprehension outcomes. |
| Escalation correctness | Required escalation occurs, names only an evaluation-oracle-accepted official authority/contact, states the question, and avoids sensitive-document requests. Product output later requires an approved claim. |
| Provenance comprehension | Participant can distinguish controlling law/rules, agency guidance/instructions, application destination, vendor, and app explanation. |
| Friction | Observed wrong turns, inaccessible content, terminology confusion, channel confusion, and assistance requests. |

Separately, deterministic audit of application-generated output at BL-007/BL-008 requires 100% correct safety-critical assertions, 100% abstention outside approved product evidence, and zero application authorization claims. Participant mistakes do not fail that audit. User target is at least 95% reaching the correct next official source within five minutes overall and within each preregistered adequately sampled required subgroup. A failing or undersampled subgroup blocks the corresponding usability claim and requires remediation, rerun, or an explicit scope limitation.

## Participation and session safety

- Obtain informed study/data-use consent covering purpose, procedures, recording scope, risks, compensation, retention, voluntary withdrawal, and contact/incident process.
- State that session findings are fictional navigation exercises, cannot be relied on for practice or application decisions, and are not legal/licensing advice.
- Use fictional facts only and a clean study browser/device or verified clean profile. Stop at destinations; prohibit login, form submission, downloads containing personal data, emails, calls, purchases, or agency/vendor contact.
- Provide a post-session debrief repeating the no-reliance boundary and pointing to official resources only for future independent use.

## Data handling

- Treat raw audio/video/screen captures as restricted pseudonymized data; they may retain voice, face, accessibility traits, browser identifiers, or accidental content and are never called de-identified.
- Prefer no-face/minimum-area recording and redact accidental personal content before evaluator access.
- Use participant IDs in analysis; store the re-identification key and consent records separately from session data.
- Do not collect real licenses, orders, application data, SSNs, employer details, or case histories.
- Obtain separate recording consent; if declined, use minimally identifying observer notes.
- Before recruitment, lock encryption-at-rest/in-transit, approved owner/access list, secure transfer, recording scope, retention/deletion dates, verified deletion, backup handling, incident response, and an exact small-cell suppression threshold.
- Store raw consent/recordings outside the public repository. Commit only aggregate de-identified results and threshold-compliant subgroup summaries.

## Evidence artifacts

BL-001 cannot complete until the repository contains or links to:

- locked oracle version and exact commit SHA;
- reviewer identity/qualification and approval date;
- scenario allocation and recruitment minima;
- baseline allocation and BL-007 matched-variant randomization plan;
- accessible/translated consent, facilitator, stop-at-destination, and no-reliance debrief materials;
- data-security/retention/suppression plan;
- blank score sheet and adjudication rules;
- a restricted condition-allocation key kept outside the public repository, plus condition-free scorer copies and a documented masking exception/sensitivity plan where needed;
- aggregate baseline results with sample sizes and exclusions;
- two independent reviews and deterministic gate evidence bound to the candidate SHA.

Repository templates for these artifacts live in `docs/evaluation/`. They remain drafts until the qualified human roles complete and approve them.

## Human-only gates

These gates do not stop the continuous build track. Neutral implementation, tests, CI, documentation, and non-routable validation may continue while the evaluation artifacts remain pending.

Qualified evaluation-oracle review, source/legal handling of CONFLICT-001, and later product-claim approval cannot be simulated. Representative-user participation, informed consent, accessibility/language accommodations, and conclusions about real user performance also require human involvement. BL-001 does not block implementation of a neutral, non-routable application shell and CI. Its qualified oracle/protocol approval, locked materials, consent, and safety arrangements must complete before any participant session; its baseline sessions/results must complete before BL-007 comparative evaluation, public guidance or performance claims, BL-008, and release. Evaluation-only evidence never activates routing.
