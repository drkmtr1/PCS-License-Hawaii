# BL-003 validation record

**Date:** 2026-09-08  
**Backlog:** BL-003, claim/source/conflict schemas and integrity validation  
**Scope:** version-controlled evidence data and build-time validation only

## Evidence and boundary

`src/evidence/schema.ts` defines the source, claim, conflict, review-evidence, and rule record shapes. `src/evidence/registry.ts` records only the bounded Stage 0 observations already listed in `docs/SOURCE_PROVENANCE.md`. Those records are `observed`, `needs-human-review`, or `dead`; none is an approved product claim, and the Next.js shell does not import the registry. BL-003 therefore cannot activate questionnaire questions, routing, destinations, contacts, or licensing guidance.

`src/evidence/validation.ts` rejects malformed or unsafe evidence before it can be used by a later backlog item. It checks duplicate IDs, runtime enum/array shape, HTTPS canonical URLs on the approved-host allowlist (without credentials), strict ISO timestamps, future-date misuse, required retrieval/provenance fields, source and claim review windows, reviewer evidence, source-bounded claim expiries, active applicability windows, terminal-state dates, bidirectional conflict links, unresolved-conflict fallback/approval, explicit fallback source-risk review, rule claim references, approved source/claim state, blocked conflicts, and rule expiry bounds.

`src/evidence/summary.ts` provides a deterministic developer summary of record counts and states. It has no network, telemetry, approval, source interpretation, or routing behavior.

`src/evidence/drafts.ts` prepares only `observed` claims for a later human-review queue by changing their state to `needs-human-review` and removing approval-only fields. It preserves source, locator, evidence, applicability, profession, conflict, and review-window data; dead or otherwise non-observed claims are unchanged. It never creates an approved claim or routing input.

`src/evidence/review-queue.ts` creates a stable, sorted manifest of non-terminal draft claims with their recorded source/conflict IDs, states, professions, review dates, and open-conflict flags. It is a work queue only; it cannot approve, interpret, or route a claim.

`src/evidence/review-packet.ts` creates a deterministic, evidence-preserving packet from that queue. It includes recorded source provenance, proposition/locator/evidence/applicability fields, and linked conflict details for qualified human inspection. The packet is explicitly marked `requiresHumanApproval: true` and `activatesRouting: false`; it never interprets authority, adds approval evidence, or enables a rule.

## Requirement and acceptance mapping

| Requirement | Implementation/evidence |
|---|---|
| FR-004 | Atomic `ClaimRecord.sourceId`, `locator`, `evidence`, and `RuleRecord.claimIds`; no routing consumer is present in BL-003. |
| FR-006 | Source/claim/conflict records retain retrieval, review, terminal, expiry, state, and audit fields. |
| FR-007 | Non-approved, terminal, stale, dead, withdrawn, and open/unresolved-conflict records cannot satisfy an enabled rule. |
| NFR-003 | Runtime schema checks reject missing/duplicate IDs, invalid references, missing locators/fields, invalid states, incomplete review/expiry evidence, and unbounded approved claims. |
| AC-004 | Enabled rules require current approved claims and sources, reject claims linked from either side to an open/unresolved conflict, and cannot outlive the earliest claim expiry. |
| AC-005 | Negative tests cover nonexistent sources, duplicate IDs, insecure URLs, missing locators, missing approval expiry, blocked conflicts, asymmetric conflict links, and rule expiry overflow. |

## Automated validation

The repository check runs the focused validator suite before the full test suite:

```text
npm run validate:evidence
npm test
npm run check
```

Expected evidence for this candidate is a passing focused suite and passing typecheck, lint, full tests, production dependency audit, and Next.js production build. `git diff --check` must also pass. The exact application candidate commit and final PR head are recorded below after the implementation commit and the evidence-record follow-up commit are created; a hash is never self-referential.

## Review gate

BL-003 is R2. Independent correctness and user-risk reviews are required before merge. Reviewers must confirm that the validator enforces integrity only, that observed/evaluation-only records remain non-routable, and that no source-authority interpretation or authorization claim has been introduced.

**Application candidate SHA (before evidence-record follow-up):** `c1b2368d7ff71f4b109888574bc956f49ccf1717`
**Evidence-record follow-up SHA:** pending commit  
**Final PR head / CI:** `5ba9d94f80edba26d1ab3a8b4f36eaf5039e83a0`; PR #5 merged to `main` as `5091eb1fbbc6b251cc361d1b349e37f7d1e4103e`; GitHub `validate` passed
