import type { ClaimRecord, ConflictRecord, EvidenceBundle } from "./schema";

export interface ReviewQueueConflict {
  conflictId: string;
  state: ConflictRecord["state"] | "unknown";
}

export interface ClaimReviewQueueItem {
  claimId: string;
  sourceId: string;
  state: ClaimRecord["state"];
  affectedProfessions: readonly ClaimRecord["affectedProfessions"][number][];
  conflictIds: readonly string[];
  conflicts: readonly ReviewQueueConflict[];
  hasOpenConflict: boolean;
  nextReviewAt?: string;
}

/**
 * Builds a deterministic work queue for non-terminal claims awaiting review.
 * The queue reports recorded state only; it cannot approve, interpret, or route claims.
 */
export function buildClaimReviewQueue(bundle: EvidenceBundle): readonly ClaimReviewQueueItem[] {
  const conflictsById = new Map(bundle.conflicts.map((conflict) => [conflict.conflictId, conflict]));
  return bundle.claims
    .filter((claim) => claim.state === "observed" || claim.state === "needs-human-review")
    .map((claim) => {
      const conflicts: ReviewQueueConflict[] = claim.conflictIds.map((conflictId) => ({
        conflictId,
        state: conflictsById.get(conflictId)?.state ?? "unknown",
      }));
      return {
        claimId: claim.claimId,
        sourceId: claim.sourceId,
        state: claim.state,
        affectedProfessions: [...claim.affectedProfessions],
        conflictIds: [...claim.conflictIds],
        conflicts,
        hasOpenConflict: conflicts.some(({ state }) => state === "open" || state === "unresolved" || state === "unknown"),
        nextReviewAt: claim.nextReviewAt,
      };
    })
    .sort((left, right) => left.claimId.localeCompare(right.claimId));
}
