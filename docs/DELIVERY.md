# Delivery

## Flow

The continuous build track is: foundation on default branch → bounded work branch → implementation/tests/docs/CI → deterministic checks → pull request → merge. This track may continue without human approval for neutral, non-routable work. The protected release track adds independent correctness and user-risk/source review, a deterministic release gate bound to the candidate SHA, Vercel preview/production, and smoke testing before source-backed routing or public claims.

## Risk classes

- **R0:** documentation/format-only.
- **R1:** bounded non-consequential behavior.
- **R2:** routing, source governance, security/privacy, public API, database, or runtime AI.
- **R3:** unresolved legal/source-authority interpretation, credentials/permissions, billing, destructive production action, or explicit high-risk acceptance.

Every R1/R2 candidate requires two independent reviews and a deterministic gate bound to its exact SHA before merge. Material changes invalidate affected review evidence. The implementer cannot self-certify release readiness.

The review rule applies when a candidate changes routing, source governance, security/privacy posture, a public API, persistence, runtime AI, or another consequential behavior. It does not stop neutral scaffolding, tests, CI, documentation, or non-routable validation work from continuing on the continuous build track.

## Human gates

Login/MFA, credential or billing grants, unresolved authority interpretation, representative-user conclusions, and irreversible production actions remain human responsibilities.
