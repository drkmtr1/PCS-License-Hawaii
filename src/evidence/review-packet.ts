import type { ClaimRecord, ConflictRecord, EvidenceBundle, SourceRecord } from "./schema";
import { buildClaimReviewQueue, type ClaimReviewQueueItem } from "./review-queue";

export interface ClaimReviewPacketItem extends ClaimReviewQueueItem {
  source: Pick<SourceRecord, "authority" | "title" | "canonicalUrl" | "sourceType" | "jurisdiction" | "retrievedAt" | "fingerprint">;
  claim: Pick<ClaimRecord, "proposition" | "locator" | "evidence" | "applicability" | "effectiveFrom" | "effectiveTo">;
  conflictDetails: readonly Pick<ConflictRecord, "issue" | "sourceIds" | "claimIds" | "affectedRuleIds" | "resolutionBasis" | "fallbackCopy">[];
}

export interface ClaimReviewPacket {
  generatedFor: "human-review";
  requiresHumanApproval: true;
  activatesRouting: false;
  items: readonly ClaimReviewPacketItem[];
}

export class ReviewPacketValidationError extends Error {
  constructor(readonly code: "FLAGS" | "ORDER" | "APPROVED", message: string) {
    super(`${code}: ${message}`);
    this.name = "ReviewPacketValidationError";
  }
}

/** Fails closed if a handoff artifact no longer has its review-only boundary. */
export function validateClaimReviewPacket(packet: ClaimReviewPacket): void {
  if (packet.generatedFor !== "human-review" || packet.requiresHumanApproval !== true || packet.activatesRouting !== false) {
    throw new ReviewPacketValidationError("FLAGS", "packet must remain human-review-only and non-routable");
  }
  for (let index = 0; index < packet.items.length; index += 1) {
    const item = packet.items[index];
    if (item.state === "approved") throw new ReviewPacketValidationError("APPROVED", `approved claim ${item.claimId} is not eligible`);
    if (index > 0 && packet.items[index - 1].claimId.localeCompare(item.claimId) > 0) {
      throw new ReviewPacketValidationError("ORDER", "items must be sorted by claimId");
    }
  }
}

/**
 * Serializes a review packet for a version-controlled handoff artifact.
 * JSON output is stable because packet records are already sorted and fields are
 * constructed in a fixed order. This is serialization only, never approval data.
 */
export function serializeClaimReviewPacket(packet: ClaimReviewPacket): string {
  validateClaimReviewPacket(packet);
  return `${JSON.stringify(packet, null, 2)}\n`;
}

/**
 * Creates a deterministic, evidence-preserving packet for qualified human review.
 * It does not interpret source authority, approve claims, or activate routing.
 */
export function buildClaimReviewPacket(bundle: EvidenceBundle): ClaimReviewPacket {
  const claimsById = new Map(bundle.claims.map((claim) => [claim.claimId, claim]));
  const sourcesById = new Map(bundle.sources.map((source) => [source.sourceId, source]));
  const conflictsById = new Map(bundle.conflicts.map((conflict) => [conflict.conflictId, conflict]));

  const items = buildClaimReviewQueue(bundle).map((queueItem) => {
    const claim = claimsById.get(queueItem.claimId);
    const source = sourcesById.get(queueItem.sourceId);
    if (!claim || !source) throw new Error(`Review queue references missing record: ${queueItem.claimId}`);
    return {
      ...queueItem,
      source: {
        authority: source.authority,
        title: source.title,
        canonicalUrl: source.canonicalUrl,
        sourceType: source.sourceType,
        jurisdiction: source.jurisdiction,
        retrievedAt: source.retrievedAt,
        fingerprint: source.fingerprint,
      },
      claim: {
        proposition: claim.proposition,
        locator: claim.locator,
        evidence: claim.evidence,
        applicability: claim.applicability,
        effectiveFrom: claim.effectiveFrom,
        effectiveTo: claim.effectiveTo,
      },
      conflictDetails: queueItem.conflictIds.flatMap((conflictId) => {
        const conflict = conflictsById.get(conflictId);
        if (!conflict) throw new Error(`Review queue references missing conflict: ${conflictId}`);
        return [{
          issue: conflict.issue,
          sourceIds: [...conflict.sourceIds],
          claimIds: [...conflict.claimIds],
          affectedRuleIds: [...conflict.affectedRuleIds],
          resolutionBasis: conflict.resolutionBasis,
          fallbackCopy: conflict.fallbackCopy,
        }];
      }),
    };
  });

  return { generatedFor: "human-review", requiresHumanApproval: true, activatesRouting: false, items };
}
