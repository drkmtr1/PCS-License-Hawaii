# Deployment

## Target

Vercel is the preferred host if the selected web stack remains compatible. GitHub integration should create an immutable preview for each pull request. Production must promote the exact reviewed preview artifact rather than rebuild an unreviewed candidate.

## Required gates

1. Candidate SHA is stable.
2. Build, lint, unit, integration, WCAG 2.2 AA, privacy, integrity, trusted-time source-expiry, daily-health-job, successful and failed-withdrawal/kill-switch drills, security, and evaluation checks pass.
3. Two independent R2 reviews bind to that SHA.
4. Preview smoke tests pass on mobile and desktop, including questionnaire, results, citations, unsupported input, conflict/abstention, and keyboard flow.
5. The reviewed preview is promoted to production.
6. Production smoke tests, privacy/telemetry settings review, trusted-time expiry test, Global Config/read-failure kill-switch test, health-job evidence, and an error-log scan pass.

Pin deployment tooling and lock dependencies. Keep Vercel tokens, project identifiers, Global Config read/write credentials, protected health-job invocation values, and alert-delivery configuration in server-only protected environment settings; never commit `.vercel` project metadata or credentials or expose server secrets to client bundles. Provisioning or plan/cost commitments require human approval. Verify all required runtime configuration under NFR-002/NFR-009/NFR-010 before preview promotion.

Production success may be recorded only with the live URL, deployment status, candidate SHA, framework, build duration, smoke-test evidence, and post-deploy error scan.
