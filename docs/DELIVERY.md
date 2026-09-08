# Delivery

## Flow

Foundation on default branch → bounded work branch → implementation and tests → candidate commit → independent correctness review → independent user-risk/source review → deterministic release gate bound to candidate SHA → pull request → merge → Vercel preview/production → smoke test.

## Risk classes

- **R0:** documentation/format-only.
- **R1:** bounded non-consequential behavior.
- **R2:** routing, source governance, security/privacy, public API, database, or runtime AI.
- **R3:** unresolved legal/source-authority interpretation, credentials/permissions, billing, destructive production action, or explicit high-risk acceptance.

Every R1/R2 candidate requires two independent reviews and a deterministic gate bound to its exact SHA before merge. Material changes invalidate affected review evidence. The implementer cannot self-certify release readiness.

## Human gates

Login/MFA, credential or billing grants, unresolved authority interpretation, representative-user conclusions, and irreversible production actions remain human responsibilities.
