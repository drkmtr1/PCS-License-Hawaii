# Security and privacy

## V1 posture

- Collect no account credentials, uploaded documents, free text, SSNs, license numbers, or copies of military orders.
- Keep structured questionnaire answers in component memory only; application code may not write them to URLs, storage, cookies, telemetry, error payloads, controlled logs, or outbound referrers.
- Treat source content and URLs as reviewed data; never execute retrieved content.
- Validate source/rule schemas and constrain all inputs by type, enum, and length.
- Use secure response headers, dependency review, secret scanning, and privacy-safe error messages.
- Never expose privileged service credentials to client code.

## Threats and controls

| Threat | Control |
|---|---|
| Fabricated or substituted source | Stable IDs, canonical domains, human approval, integrity tests |
| Source changes after review | Retrieval/verification dates, freshness windows, change review, abstention |
| Rule references missing/unapproved evidence | Build failure and negative tests |
| Malicious URL/input | Allowlisted schemes/domains for government, compact, and approved operational-vendor links; typed bounded inputs |
| Sensitive answers in logs/analytics | No answer logging; analytics off by default |
| Browser restoration/referrer disclosure | Disable restoration/autofill where practical, strict referrer policy, visible reset, and reload/bfcache/tab/shared-device lifecycle tests; disclose browser-controlled limitations |
| Unavoidable hosting metadata | Plain-language privacy notice, third-party inventory, and verified Vercel telemetry/log settings and retention |
| Dependency compromise | Lockfile, pinned automation versions, vulnerability and provenance review |
| Misleading degraded state | Neutral error, cached metadata clearly dated, authority escalation |
| Source-health retrieval abuse | Allowlist canonical HTTPS hosts, revalidate every redirect target, limit response bytes/type/time/redirect count, never execute content, and authenticate/protect job invocation and alert channels |
| Kill-switch tampering/outage | Server-only Global Config read token, tightly scoped write authority, audit logs, no client write path, fail-closed read errors, and authorized recovery drill |

Runtime AI and user-facing/runtime routing retrieval are not in V1, so model-data leakage and retrieved-content prompt injection are absent. The scheduled source-health retriever is operational tooling only and treats all responses as untrusted bytes under the controls above.
