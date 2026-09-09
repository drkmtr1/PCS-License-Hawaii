# Backlog

| ID | Scope | Risk | Requirements / AC | Exit evidence | Status |
|---|---|---:|---|---|---|
| BL-001 | Establish evaluation-only oracle, locked coverage/methods protocol, and official-resource baseline | R2/R3 | AC-007 | evaluation-only answer key, protocol, baseline; 2 reviews + SHA gate | Incomplete: qualified human oracle/methods approval, locked protocol/materials, and consent/safety arrangements are required before participant sessions; representative-user baseline results remain required before BL-007, BL-008, release, or performance claims; does not block non-routable BL-002 |
| BL-002 | Select web stack; scaffold accessible shell and CI | R1 | NFR-001–010, UX-001 | build/lint/test/a11y/privacy/expiry checks; 2 reviews + SHA gate | Ready after Stage 1 foundation; must expose only neutral non-guidance/unavailable states and no claims, rules, contacts, or questionnaire decisions |
| BL-003 | Implement claim/source/conflict schemas and integrity validation | R2 | FR-004, FR-006–007, AC-004–005 | schema and negative tests; 2 reviews + SHA gate | Ready after BL-002 |
| BL-004 | Convert bounded evaluation evidence into product claims; human-review claim, fallback, and conflict records | R2/R3 | FR-004–007 | one-proposition/one-locator approved routing claims with expiries, conflict decisions, exact fallback copy; 2 reviews + SHA gate | Human review required for conflicts; evaluation-only records do not activate routing |
| BL-005 | Implement pure deterministic routing engine | R2 | FR-002–007, AC-001–005 | unit/evaluation coverage; 2 reviews + SHA gate | Ready after BL-004 |
| BL-006 | Implement questionnaire, results, reset, escalation, trusted-time expiry/cache guards, daily source-health job, and Global Config kill switch | R2/R3 | FR-001–008, NFR-008–010, UX-001–006, AC-006, AC-008–011 | integration/a11y/privacy/viewport/clock/cache/expiry/withdrawal/kill-switch tests; 2 reviews + SHA gate | Ready after BL-005; provisioning/production authority may gate |
| BL-007 | Run comparative representative-user evaluation | R1/R3 | AC-007 | independently adjudicated, stratified result summary; 2 reviews + SHA gate | Representative users required |
| BL-008 | Security, accessibility, source-freshness, and release review | R2 | all FR/NFR/UX/AC and source policy | 2 reviews + SHA-bound release gate | Ready after BL-007 |
| BL-009 | Vercel preview, Global Config provisioning, production deployment, and smoke test | R2/R3 | AC-006–011 | verified URLs, exact SHA, smoke, privacy config, trusted-time/expiry/kill-switch gates, and error-log record | Credentials/billing may gate |
| BL-010 | V1 retrospective and maintenance handoff | R0 | product definition of done | retrospective document | Ready after production |

Deferred: accounts, uploads, saved profiles, submissions, CMS, database, runtime AI, comprehensive/semantic source monitoring beyond required link/fingerprint health checks, all-profession/nationwide coverage, and native mobile.
