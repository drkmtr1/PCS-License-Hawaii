export const SOURCE_STATES = [
  "observed",
  "approved",
  "rejected",
  "needs-human-review",
  "stale",
  "dead",
  "withdrawn",
] as const;

export const CLAIM_STATES = SOURCE_STATES;
export const CONFLICT_STATES = ["open", "unresolved", "resolved-objectively", "withdrawn"] as const;
export const PROFESSIONS = ["rn-lpn", "mental-health-counselor", "electrician", "real-estate", "unsupported", "all"] as const;
export const SOURCE_TYPES = ["controlling-law-or-rule", "enforcement-guidance", "agency-instructions", "application-form", "operational-portal", "compact-authority", "military-context", "private-operational-vendor"] as const;
export const SOURCE_FORMATS = ["html", "pdf", "portal", "other"] as const;

export type SourceState = (typeof SOURCE_STATES)[number];
export type ClaimState = (typeof CLAIM_STATES)[number];
export type ConflictState = (typeof CONFLICT_STATES)[number];
export type Profession = "rn-lpn" | "mental-health-counselor" | "electrician" | "real-estate" | "unsupported" | "all";
export type SourceType = "controlling-law-or-rule" | "enforcement-guidance" | "agency-instructions" | "application-form" | "operational-portal" | "compact-authority" | "military-context" | "private-operational-vendor";
export type SourceFormat = "html" | "pdf" | "portal" | "other";

export interface SourceRecord {
  sourceId: string;
  authority: string;
  title: string;
  canonicalUrl: string;
  sourceType: SourceType;
  professions: readonly Profession[];
  jurisdiction: string;
  retrievedAt: string;
  retrievalMethod: string;
  publishedAt?: string;
  effectiveAt?: string;
  format: SourceFormat;
  accessibility: string;
  fingerprint: string;
  state: SourceState;
  nextReviewAt?: string;
  terminalAt?: string;
  owner: string;
}

export interface ReviewEvidence {
  reviewerId: string;
  qualification: string;
  reviewedAt: string;
  evidence: string;
}

export interface ClaimRecord {
  claimId: string;
  sourceId: string;
  proposition: string;
  locator: string;
  evidence: string;
  applicability: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  affectedProfessions: readonly Profession[];
  state: ClaimState;
  conflictIds: readonly string[];
  reviewer?: ReviewEvidence;
  nextReviewAt?: string;
  terminalAt?: string;
  expiresAt?: string;
}

export interface ConflictAuditEntry {
  at: string;
  actor: string;
  action: string;
  evidence: string;
}

export interface ConflictRecord {
  conflictId: string;
  sourceIds: readonly string[];
  claimIds: readonly string[];
  issue: string;
  affectedRuleIds: readonly string[];
  detectedAt: string;
  owner: string;
  state: ConflictState;
  resolutionBasis?: string;
  fallbackCopy?: string;
  fallbackReview?: ReviewEvidence;
  approver?: ReviewEvidence;
  nextReviewAt?: string;
  terminalAt?: string;
  auditHistory: readonly ConflictAuditEntry[];
}

export interface RuleRecord {
  ruleId: string;
  claimIds: readonly string[];
  enabled: boolean;
  expiresAt?: string;
}

export interface EvidenceBundle {
  sources: readonly SourceRecord[];
  claims: readonly ClaimRecord[];
  conflicts: readonly ConflictRecord[];
  rules?: readonly RuleRecord[];
}
