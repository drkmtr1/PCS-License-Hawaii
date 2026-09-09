# Decisions

## ADR-001 — Cautious GO for a four-profession V1

**Status:** Accepted, 2026-09-07.

Official sources are fragmented across controlling law/rules, federal enforcement guidance, PVL/board instructions, forms, MyPVL, and operational vendors. These categories carry different legal and operational weight. Profession routes differ materially, and dated state-facing guidance conflicts in framing with updated federal guidance. A small navigator can improve source discovery without making legal determinations.

Scope: RN/LPN, mental health counselor, electrician, and real estate salesperson/broker.

## ADR-002 — Deterministic, static, privacy-minimal architecture

**Status:** Accepted, 2026-09-07.

Use version-controlled source/rule files and a pure routing engine. Do not persist applicant answers. This maximizes auditability and makes conflict abstention testable.

## ADR-003 — Do not use Supabase in V1

**Status:** Accepted, 2026-09-07.

No demonstrated V1 need exists for authentication, persistence, source administration, reviewer workflow, or database-backed audit history. Reconsider only with approved requirements; any future exposed tables require least privilege and RLS.

## ADR-004 — Do not use runtime AI in V1

**Status:** Accepted, 2026-09-07.

Bounded human-authored explanations can satisfy the measurable task with lower unsupported-claim risk, latency, cost, and evaluation burden.

## ADR-005 — Use minimal Vercel Global Config for an independent safety kill switch

**Status:** Accepted for design; provisioning remains a human permission/cost gate, 2026-09-07.

The content-deployment path cannot safely disable itself if withdrawal/redeploy fails. A single server-read `routingEnabled` value in Vercel Global Config (formerly Edge Config) provides a low-latency maintenance switch updateable without redeployment. It stores no applicant or source data. Read failure disables routing; writes are restricted, audited, and unavailable to clients. This is the only V1 persistent runtime configuration justified beyond version-controlled files.

## ADR-006 — Defer BL-001 representative-user work to the pre-release gate

**Status:** Accepted by project owner, 2026-09-08.

BL-001's qualified human oracle/methods review and representative-user baseline remain required before BL-007 comparative evaluation or release. They no longer block BL-002's non-routable accessible shell and CI. This change does not authorize routing, licensing claims, source interpretation, application eligibility determinations, or deployment; those remain separately gated by approved claim records and source/conflict review.
