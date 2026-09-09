import type { ClaimRecord, EvidenceBundle } from "./schema";

export class DraftPreparationError extends Error {
  constructor(readonly code: string, readonly claimId: string, message: string) {
    super(`${code} for ${claimId}: ${message}`);
    this.name = "DraftPreparationError";
  }
}

function toReviewDraft(claim: ClaimRecord): ClaimRecord {
  if (claim.state !== "observed") return { ...claim };
  if (!claim.nextReviewAt) throw new DraftPreparationError("MISSING_REVIEW_DATE", claim.claimId, "observed claim requires nextReviewAt before draft conversion");

  const { reviewer: _reviewer, expiresAt: _expiresAt, ...evidence } = claim;
  return {
    ...evidence,
    state: "needs-human-review",
  };
}

/**
 * Prepares observed claims for human review without interpreting or approving them.
 * Dead, withdrawn, rejected, stale, and already-reviewed claims are preserved.
 */
export function prepareClaimReviewDrafts(bundle: EvidenceBundle): EvidenceBundle {
  return {
    ...bundle,
    claims: bundle.claims.map(toReviewDraft),
  };
}
