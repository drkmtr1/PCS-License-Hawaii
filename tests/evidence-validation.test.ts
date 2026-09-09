import { describe, expect, it } from "vitest";
import { conflicts, observedEvidence } from "../src/evidence/registry";
import { summarizeEvidence } from "../src/evidence/summary";
import { DraftPreparationError, prepareClaimReviewDrafts } from "../src/evidence/drafts";
import { buildClaimReviewQueue } from "../src/evidence/review-queue";
import { buildClaimReviewPacket, serializeClaimReviewPacket, validateClaimReviewPacket } from "../src/evidence/review-packet";
import { EvidenceValidationError, validateEvidence } from "../src/evidence/validation";
import type { ClaimRecord, ConflictRecord, EvidenceBundle, RuleRecord, SourceRecord } from "../src/evidence/schema";

const at = new Date("2026-09-08T00:00:00Z");

function validApprovedBundle(): EvidenceBundle {
  const source: SourceRecord = {
    sourceId: "SRC-1",
    authority: "Example authority",
    title: "Example source",
    canonicalUrl: "https://cca.hawaii.gov/example",
    sourceType: "agency-instructions",
    professions: ["all"],
    jurisdiction: "Example",
    retrievedAt: "2026-09-01T00:00:00Z",
    retrievalMethod: "live page review",
    format: "html",
    accessibility: "HTML",
    fingerprint: "fingerprint-1",
    state: "approved",
    nextReviewAt: "2026-12-01T00:00:00Z",
    owner: "review lead",
  };
  const claim: ClaimRecord = {
    claimId: "CLM-1",
    sourceId: source.sourceId,
    proposition: "One atomic proposition.",
    locator: "Heading 1",
    evidence: "One short evidence passage.",
    applicability: "Example only",
    affectedProfessions: ["all"],
    state: "approved",
    conflictIds: [],
    reviewer: { reviewerId: "reviewer-1", qualification: "qualified reviewer", reviewedAt: "2026-09-02T00:00:00Z", evidence: "review record" },
    expiresAt: "2026-11-01T00:00:00Z",
  };
  const rule: RuleRecord = { ruleId: "RULE-1", claimIds: [claim.claimId], enabled: true, expiresAt: "2026-10-15T00:00:00Z" };
  return { sources: [source], claims: [claim], conflicts: [], rules: [rule] };
}

function expectCode(fn: () => void, code: string): void {
  expect(fn).toThrowError(expect.objectContaining({ code } satisfies Partial<EvidenceValidationError>));
}

describe("evidence schema and integrity validation", () => {
  it("builds a deterministic non-routable review queue", () => {
    const draft = prepareClaimReviewDrafts(observedEvidence);
    const queue = buildClaimReviewQueue(draft);
    expect(queue.map((item) => item.claimId)).toEqual(["CLM-FED-001", "CLM-HI-PVL-001"]);
    expect(queue[0]).toMatchObject({
      sourceId: "SRC-FED-DOJ-001",
      state: "needs-human-review",
      conflictIds: ["CONFLICT-001"],
      hasOpenConflict: true,
    });
    expect(queue[1]).toMatchObject({
      sourceId: "SRC-HI-PVL-001",
      state: "needs-human-review",
      conflictIds: [],
      hasOpenConflict: false,
    });
    expect(queue.every((item) => item.state !== "approved")).toBe(true);

    const unknownConflict = { ...draft, claims: draft.claims.map((claim, index) => index === 0 ? { ...claim, conflictIds: ["CONFLICT-MISSING"] } : claim) };
    const unknownQueue = buildClaimReviewQueue(unknownConflict);
    const unknownItem = unknownQueue.find((item) => item.claimId === "CLM-HI-PVL-001");
    expect(unknownItem?.conflicts).toEqual([{ conflictId: "CONFLICT-MISSING", state: "unknown" }]);
    expect(unknownItem?.hasOpenConflict).toBe(true);
  });

  it("builds an evidence-preserving packet without approval or routing", () => {
    const packet = buildClaimReviewPacket(prepareClaimReviewDrafts(observedEvidence));
    expect(packet).toMatchObject({ generatedFor: "human-review", requiresHumanApproval: true, activatesRouting: false });
    expect(packet.items.map((item) => item.claimId)).toEqual(["CLM-FED-001", "CLM-HI-PVL-001"]);
    expect(packet.items[0]).toMatchObject({
      source: { canonicalUrl: "https://www.justice.gov/servicemembers/professional-license-portability" },
      claim: { proposition: expect.any(String), locator: expect.any(String), evidence: expect.any(String) },
      conflictDetails: [{ issue: expect.any(String), affectedRuleIds: [] }],
    });
    expect(packet.items.every((item) => item.state !== "approved")).toBe(true);
    const missingConflict = prepareClaimReviewDrafts(observedEvidence);
    missingConflict.claims[0].conflictIds = ["CONFLICT-MISSING"];
    expect(() => buildClaimReviewPacket(missingConflict)).toThrow("missing conflict");
    const serialized = serializeClaimReviewPacket(packet);
    expect(serialized.endsWith("\n")).toBe(true);
    expect(JSON.parse(serialized)).toEqual(packet);
    expect(() => validateClaimReviewPacket({ ...packet, activatesRouting: true } as unknown as typeof packet)).toThrow("FLAGS");
    expect(() => validateClaimReviewPacket({ ...packet, items: [...packet.items].reverse() })).toThrow("ORDER");
  });

  it("prepares observed claims for review without approving or routing them", () => {
    const draft = prepareClaimReviewDrafts(observedEvidence);
    expect(draft.claims[0].state).toBe("needs-human-review");
    expect(draft.claims[0].reviewer).toBeUndefined();
    expect(draft.claims[0].expiresAt).toBeUndefined();
    expect(draft.claims[0].conflictIds).toEqual(observedEvidence.claims[0].conflictIds);
    expect(draft.claims[2].state).toBe("dead");
    expect(() => validateEvidence(draft, at)).not.toThrow();
    expect(observedEvidence.claims[0].state).toBe("observed");
  });

  it("rejects draft conversion when an observed claim has no review date", () => {
    const incomplete = { ...observedEvidence, claims: observedEvidence.claims.map((claim, index) => index === 0 ? { ...claim, nextReviewAt: undefined } : claim) };
    expect(() => prepareClaimReviewDrafts(incomplete)).toThrowError(expect.objectContaining({ code: "MISSING_REVIEW_DATE" } satisfies Partial<DraftPreparationError>));
  });

  it("summarizes registry state without approving or routing evidence", () => {
    expect(summarizeEvidence(observedEvidence)).toEqual({
      sourceCount: 3,
      claimCount: 3,
      conflictCount: 1,
      ruleCount: 0,
      enabledRuleCount: 0,
      sourcesByState: { observed: 1, "needs-human-review": 1, dead: 1 },
      claimsByState: { observed: 1, "needs-human-review": 1, dead: 1 },
      conflictsByState: { open: 1 },
    });
  });

  it("accepts the observed Stage 0 bundle without activating routing", () => {
    expect(() => validateEvidence(observedEvidence, at)).not.toThrow();
    expect(observedEvidence.claims.every((claim) => claim.state !== "approved")).toBe(true);
    expect(observedEvidence.conflicts).toEqual(conflicts);
  });

  it("accepts an approved claim only with a current approved source and bounded rule", () => {
    expect(() => validateEvidence(validApprovedBundle(), at)).not.toThrow();
  });

  it("rejects duplicate IDs, unknown references, and insecure URLs", () => {
    const duplicate = validApprovedBundle();
    duplicate.sources = [...duplicate.sources, duplicate.sources[0]];
    expectCode(() => validateEvidence(duplicate, at), "DUPLICATE_ID");

    const unknown = validApprovedBundle();
    unknown.claims[0].sourceId = "SRC-MISSING";
    expectCode(() => validateEvidence(unknown, at), "UNKNOWN_SOURCE");

    const insecure = validApprovedBundle();
    insecure.sources[0].canonicalUrl = "http://example.gov/source";
    expectCode(() => validateEvidence(insecure, at), "CANONICAL_URL");
  });

  it("rejects missing locators, unbounded approvals, and blocked conflicts", () => {
    const missingLocator = validApprovedBundle();
    missingLocator.claims[0].locator = "";
    expectCode(() => validateEvidence(missingLocator, at), "MISSING_FIELD");

    const missingExpiry = validApprovedBundle();
    delete missingExpiry.claims[0].expiresAt;
    expectCode(() => validateEvidence(missingExpiry, at), "CLAIM_NOT_CURRENT");

    const blocked: EvidenceBundle = validApprovedBundle();
    const conflict: ConflictRecord = {
      conflictId: "CONFLICT-1",
      sourceIds: [blocked.sources[0].sourceId],
      claimIds: [blocked.claims[0].claimId],
      issue: "Unresolved issue",
      affectedRuleIds: ["RULE-1"],
      detectedAt: "2026-09-01T00:00:00Z",
      owner: "review lead",
      state: "open",
      nextReviewAt: "2026-12-01T00:00:00Z",
      auditHistory: [],
    };
    blocked.conflicts = [conflict];
    blocked.claims[0].conflictIds = [conflict.conflictId];
    expectCode(() => validateEvidence(blocked, at), "RULE_BLOCKED_CONFLICT");
  });

  it("rejects incomplete provenance and claims that outlive source review", () => {
    const missingMethod = validApprovedBundle();
    missingMethod.sources[0].retrievalMethod = "";
    expectCode(() => validateEvidence(missingMethod, at), "MISSING_FIELD");

    const sourceWindow = validApprovedBundle();
    sourceWindow.claims[0].expiresAt = "2026-12-15T00:00:00Z";
    expectCode(() => validateEvidence(sourceWindow, at), "CLAIM_SOURCE_EXPIRY");
  });

  it("rejects rules that outlive their earliest claim expiry", () => {
    const bundle = validApprovedBundle();
    bundle.rules![0].expiresAt = "2026-12-01T00:00:00Z";
    expectCode(() => validateEvidence(bundle, at), "RULE_EXPIRY");
  });

  it("rejects asymmetric conflict links and duplicate rule IDs", () => {
    const asymmetric = validApprovedBundle();
    asymmetric.conflicts = [{
      conflictId: "CONFLICT-1",
      sourceIds: [asymmetric.sources[0].sourceId],
      claimIds: [asymmetric.claims[0].claimId],
      issue: "Unresolved issue",
      affectedRuleIds: ["RULE-1"],
      detectedAt: "2026-09-01T00:00:00Z",
      owner: "review lead",
      state: "open",
      nextReviewAt: "2026-12-01T00:00:00Z",
      auditHistory: [],
    }];
    expectCode(() => validateEvidence(asymmetric, at), "CONFLICT_CLAIM_LINK");

    const duplicateRules = validApprovedBundle();
    duplicateRules.rules = [duplicateRules.rules![0], { ...duplicateRules.rules![0] }];
    expectCode(() => validateEvidence(duplicateRules, at), "DUPLICATE_ID");
  });

  it("rejects empty approval evidence and non-ISO timestamps", () => {
    const emptyReviewer = validApprovedBundle();
    emptyReviewer.claims[0].reviewer!.reviewerId = "";
    expectCode(() => validateEvidence(emptyReviewer, at), "MISSING_FIELD");

    const nonIso = validApprovedBundle();
    nonIso.sources[0].retrievedAt = "2026-09-01";
    expectCode(() => validateEvidence(nonIso, at), "INVALID_DATE");

    const malformedUrl = validApprovedBundle();
    malformedUrl.sources[0].canonicalUrl = "https://";
    expectCode(() => validateEvidence(malformedUrl, at), "CANONICAL_URL");

    const unapprovedHost = validApprovedBundle();
    unapprovedHost.sources[0].canonicalUrl = "https://example.com/source";
    expectCode(() => validateEvidence(unapprovedHost, at), "CANONICAL_URL");
  });

  it("rejects inactive applicability, terminal-date misuse, and unreviewed fallback copy", () => {
    const futureClaim = validApprovedBundle();
    futureClaim.claims[0].effectiveFrom = "2026-10-01T00:00:00Z";
    expectCode(() => validateEvidence(futureClaim, at), "CLAIM_NOT_ACTIVE");

    const terminalSource = validApprovedBundle();
    terminalSource.sources[0].terminalAt = "2026-09-07T00:00:00Z";
    expectCode(() => validateEvidence(terminalSource, at), "TERMINAL_DATE");

    const fallback = validApprovedBundle();
    fallback.conflicts = [{
      conflictId: "CONFLICT-1",
      sourceIds: [fallback.sources[0].sourceId],
      claimIds: [fallback.claims[0].claimId],
      issue: "Resolved issue",
      affectedRuleIds: ["RULE-1"],
      detectedAt: "2026-09-01T00:00:00Z",
      owner: "review lead",
      state: "resolved-objectively",
      resolutionBasis: "Independent source comparison",
      approver: { reviewerId: "reviewer-1", qualification: "qualified reviewer", reviewedAt: "2026-09-02T00:00:00Z", evidence: "resolution review" },
      fallbackCopy: "Use the authority contact while this source is reviewed.",
      nextReviewAt: "2026-12-01T00:00:00Z",
      auditHistory: [],
    }];
    fallback.claims[0].conflictIds = ["CONFLICT-1"];
    expectCode(() => validateEvidence(fallback, at), "FALLBACK_REVIEW");
  });

  it("fails closed on overdue conflict reviews and future-effective evidence", () => {
    const resolved = validApprovedBundle();
    resolved.conflicts = [{
      conflictId: "CONFLICT-1",
      sourceIds: [resolved.sources[0].sourceId],
      claimIds: [resolved.claims[0].claimId],
      issue: "Resolved issue",
      affectedRuleIds: ["RULE-1"],
      detectedAt: "2026-09-01T00:00:00Z",
      owner: "review lead",
      state: "resolved-objectively",
      resolutionBasis: "Independent source comparison",
      approver: { reviewerId: "reviewer-1", qualification: "qualified reviewer", reviewedAt: "2026-09-02T00:00:00Z", evidence: "resolution review" },
      nextReviewAt: "2026-09-07T00:00:00Z",
      auditHistory: [],
    }];
    resolved.claims[0].conflictIds = ["CONFLICT-1"];
    expectCode(() => validateEvidence(resolved, at), "CONFLICT_REVIEW_OVERDUE");

    const futureSource = validApprovedBundle();
    futureSource.sources[0].effectiveAt = "2026-10-01T00:00:00Z";
    expectCode(() => validateEvidence(futureSource, at), "SOURCE_NOT_CURRENT");

    const futureAudit = validApprovedBundle();
    futureAudit.conflicts = [{
      conflictId: "CONFLICT-1",
      sourceIds: [futureAudit.sources[0].sourceId],
      claimIds: [futureAudit.claims[0].claimId],
      issue: "Unresolved issue",
      affectedRuleIds: ["RULE-1"],
      detectedAt: "2026-09-01T00:00:00Z",
      owner: "review lead",
      state: "open",
      nextReviewAt: "2026-12-01T00:00:00Z",
      auditHistory: [{ at: "2026-09-09T00:00:00Z", actor: "review lead", action: "opened conflict", evidence: "future event" }],
    }];
    futureAudit.claims[0].conflictIds = ["CONFLICT-1"];
    expectCode(() => validateEvidence(futureAudit, at), "FUTURE_DATE");
  });

  it("rejects claims outside the source profession scope", () => {
    const bundle = validApprovedBundle();
    bundle.sources[0].professions = ["rn-lpn"];
    bundle.claims[0].affectedProfessions = ["electrician"];
    expectCode(() => validateEvidence(bundle, at), "CLAIM_PROFESSION_SCOPE");
  });
});
