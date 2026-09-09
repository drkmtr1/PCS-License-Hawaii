import {
  CLAIM_STATES,
  CONFLICT_STATES,
  PROFESSIONS,
  SOURCE_FORMATS,
  SOURCE_STATES,
  SOURCE_TYPES,
  type ClaimRecord,
  type ConflictRecord,
  type EvidenceBundle,
  type ReviewEvidence,
  type RuleRecord,
  type SourceRecord,
} from "./schema";

export class EvidenceValidationError extends Error {
  constructor(readonly code: string, readonly path: string, message: string) {
    super(`${code} at ${path}: ${message}`);
    this.name = "EvidenceValidationError";
  }
}

const terminalSourceStates = new Set(["rejected", "stale", "dead", "withdrawn"]);
const terminalClaimStates = terminalSourceStates;
const blockedConflictStates = new Set(["open", "unresolved"]);
const reviewableSourceStates = new Set(["observed", "approved", "needs-human-review"]);
const reviewableClaimStates = new Set(["observed", "approved", "needs-human-review"]);
const approvedCanonicalHosts = new Set([
  "cca.hawaii.gov",
  "www.justice.gov",
  "data.capitol.hawaii.gov",
  "engage.hawaii.gov",
  "counselingcompact.gov",
  "test-takers.psiexams.com",
]);
const maxStringLength = 10_000;
const maxIdLength = 128;

function fail(code: string, path: string, message: string): never {
  throw new EvidenceValidationError(code, path, message);
}

function required(value: unknown, code: string, path: string): asserts value {
  if (typeof value !== "string" || value.trim().length === 0) fail(code, path, "required non-empty value");
  if (value.length > maxStringLength) fail("FIELD_LENGTH", path, `must be at most ${maxStringLength} characters`);
}

function iso(value: string, path: string): number {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(value)) fail("INVALID_DATE", path, "must be an ISO-8601 timestamp");
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) fail("INVALID_DATE", path, "must be an ISO-8601 date");
  return parsed;
}

function oneOf(value: unknown, allowed: readonly string[], code: string, path: string): void {
  if (typeof value !== "string" || !allowed.includes(value)) fail(code, path, `must be one of ${allowed.join(", ")}`);
}

function list(value: unknown, code: string, path: string): readonly unknown[] {
  if (!Array.isArray(value)) fail(code, path, "must be an array");
  return value;
}

function uniqueIds(value: unknown, code: string, path: string, requireOne = true): readonly string[] {
  const values = list(value, code, path);
  if (requireOne && values.length < 1) fail(code, path, "must contain at least one ID");
  const ids = values.map((item, index) => {
    required(item, code, `${path}[${index}]`);
    if (typeof item !== "string") fail(code, `${path}[${index}]`, "must be a string");
    if (item.length > maxIdLength) fail("FIELD_LENGTH", `${path}[${index}]`, `ID must be at most ${maxIdLength} characters`);
    return item;
  });
  if (new Set(ids).size !== ids.length) fail("DUPLICATE_REFERENCE", path, "must not repeat an ID");
  return ids;
}

function hasId(value: unknown, id: string): boolean {
  return Array.isArray(value) && value.includes(id);
}

function professions(value: unknown, path: string): void {
  const values = list(value, "INVALID_ARRAY", path);
  if (values.length < 1) fail("INVALID_ARRAY", path, "must contain at least one profession");
  values.forEach((profession, index) => oneOf(profession, PROFESSIONS, "INVALID_PROFESSION", `${path}[${index}]`));
}

function reviewEvidence(review: ReviewEvidence | undefined, path: string, now: number): void {
  if (!review || typeof review !== "object") fail("CLAIM_REVIEW", path, "requires review evidence");
  ["reviewerId", "qualification", "evidence"].forEach((field) => required(review[field as keyof ReviewEvidence], "MISSING_FIELD", `${path}.${field}`));
  iso(review.reviewedAt, `${path}.reviewedAt`);
  if (Date.parse(review.reviewedAt) > now) fail("FUTURE_DATE", `${path}.reviewedAt`, "cannot be in the future");
}

function idSet<T extends object>(records: readonly T[], key: keyof T & string, collection: string): Map<string, T> {
  const map = new Map<string, T>();
  records.forEach((record, index) => {
    if (!record || typeof record !== "object") fail("BUNDLE_SHAPE", `${collection}[${index}]`, "must be an object");
    const value = record[key];
    required(value, "MISSING_ID", `${collection}[${index}].${key}`);
    if (typeof value !== "string") fail("MISSING_ID", `${collection}[${index}].${key}`, "must be a string");
    if (value.length > maxIdLength) fail("FIELD_LENGTH", `${collection}[${index}].${key}`, `ID must be at most ${maxIdLength} characters`);
    if (map.has(value)) fail("DUPLICATE_ID", `${collection}[${index}].${key}`, `duplicates ${value}`);
    map.set(value, record);
  });
  return map;
}

function validateSource(source: SourceRecord, index: number, now: number): void {
  const path = `sources[${index}]`;
  ["authority", "title", "canonicalUrl", "jurisdiction", "retrievalMethod", "accessibility", "fingerprint", "owner"].forEach((field) => required(source[field as keyof SourceRecord], "MISSING_FIELD", `${path}.${field}`));
  oneOf(source.state, SOURCE_STATES, "INVALID_STATE", `${path}.state`);
  oneOf(source.sourceType, SOURCE_TYPES, "INVALID_SOURCE_TYPE", `${path}.sourceType`);
  oneOf(source.format, SOURCE_FORMATS, "INVALID_FORMAT", `${path}.format`);
  professions(source.professions, `${path}.professions`);
  if (source.canonicalUrl.length > 2_048) fail("FIELD_LENGTH", `${path}.canonicalUrl`, "must be at most 2048 characters");
  let canonicalUrl: URL;
  try {
    canonicalUrl = new URL(source.canonicalUrl);
  } catch {
    fail("CANONICAL_URL", `${path}.canonicalUrl`, "must be a valid HTTPS URL");
  }
  if (canonicalUrl.protocol !== "https:" || !canonicalUrl.hostname || canonicalUrl.username || canonicalUrl.password || canonicalUrl.port || !approvedCanonicalHosts.has(canonicalUrl.hostname.toLowerCase())) fail("CANONICAL_URL", `${path}.canonicalUrl`, "must use HTTPS, an approved host, and no credentials");
  iso(source.retrievedAt, `${path}.retrievedAt`);
  if (Date.parse(source.retrievedAt) > now) fail("FUTURE_DATE", `${path}.retrievedAt`, "cannot be in the future");
  if (source.publishedAt) iso(source.publishedAt, `${path}.publishedAt`);
  if (source.effectiveAt) iso(source.effectiveAt, `${path}.effectiveAt`);
  if (source.nextReviewAt) iso(source.nextReviewAt, `${path}.nextReviewAt`);
  if (source.terminalAt) iso(source.terminalAt, `${path}.terminalAt`);
  if (!source.nextReviewAt && !source.terminalAt) fail("FRESHNESS_DATE", path, "requires nextReviewAt or terminalAt");
  if (source.state === "approved" && (!source.nextReviewAt || Date.parse(source.nextReviewAt) <= now)) fail("SOURCE_NOT_CURRENT", path, "approved source must have a future nextReviewAt");
  if (source.state === "approved" && source.effectiveAt && Date.parse(source.effectiveAt) > now) fail("SOURCE_NOT_CURRENT", path, "approved source cannot be effective in the future");
  if (terminalSourceStates.has(source.state) && !source.terminalAt) fail("TERMINAL_DATE", path, "terminal source state requires terminalAt");
  if (!terminalSourceStates.has(source.state) && source.terminalAt) fail("TERMINAL_DATE", path, "non-terminal source cannot carry terminalAt");
  if (terminalSourceStates.has(source.state) && source.terminalAt && Date.parse(source.terminalAt) > now) fail("TERMINAL_DATE", path, "terminalAt cannot be in the future");
  if (reviewableSourceStates.has(source.state) && source.nextReviewAt && Date.parse(source.nextReviewAt) <= now) fail("SOURCE_REVIEW_OVERDUE", path, "reviewable source nextReviewAt must be in the future");
}

function validateClaim(claim: ClaimRecord, index: number, sources: Map<string, SourceRecord>, conflicts: Map<string, ConflictRecord>, now: number): void {
  const path = `claims[${index}]`;
  ["sourceId", "proposition", "locator", "evidence", "applicability"].forEach((field) => required(claim[field as keyof ClaimRecord], "MISSING_FIELD", `${path}.${field}`));
  oneOf(claim.state, CLAIM_STATES, "INVALID_STATE", `${path}.state`);
  professions(claim.affectedProfessions, `${path}.affectedProfessions`);
  const claimConflictIds = uniqueIds(claim.conflictIds, "INVALID_ARRAY", `${path}.conflictIds`, false);
  const source = sources.get(claim.sourceId);
  if (!source) fail("UNKNOWN_SOURCE", `${path}.sourceId`, claim.sourceId);
  const sourceProfessions = source.professions;
  if (!sourceProfessions.includes("all") && claim.affectedProfessions.some((profession) => !sourceProfessions.includes(profession))) fail("CLAIM_PROFESSION_SCOPE", path, "claim professions must be covered by the source professions");
  if (claimConflictIds.some((id) => !conflicts.has(id))) fail("UNKNOWN_CONFLICT", `${path}.conflictIds`, "references an unknown conflict");
  claimConflictIds.forEach((id) => {
    const conflict = conflicts.get(id);
    if (conflict && !hasId(conflict.claimIds, claim.claimId)) fail("CONFLICT_CLAIM_LINK", `${path}.conflictIds`, `conflict ${id} does not reference this claim`);
  });
  if (claim.effectiveFrom) iso(claim.effectiveFrom, `${path}.effectiveFrom`);
  if (claim.effectiveTo) iso(claim.effectiveTo, `${path}.effectiveTo`);
  if (claim.effectiveFrom && claim.effectiveTo && Date.parse(claim.effectiveFrom) > Date.parse(claim.effectiveTo)) fail("DATE_RANGE", path, "effectiveFrom cannot be after effectiveTo");
  if (claim.nextReviewAt) iso(claim.nextReviewAt, `${path}.nextReviewAt`);
  if (claim.terminalAt) iso(claim.terminalAt, `${path}.terminalAt`);
  if (claim.expiresAt) iso(claim.expiresAt, `${path}.expiresAt`);
  if (claim.effectiveFrom && Date.parse(claim.effectiveFrom) > now && claim.state === "approved") fail("CLAIM_NOT_ACTIVE", path, "approved claim cannot be effective in the future");
  if (claim.effectiveTo && claim.expiresAt && Date.parse(claim.expiresAt) > Date.parse(claim.effectiveTo)) fail("CLAIM_APPLICABILITY_EXPIRY", path, "claim expires after its applicability window");
  if (claim.effectiveFrom && Date.parse(claim.effectiveFrom) > now && claim.expiresAt && Date.parse(claim.expiresAt) <= now) fail("CLAIM_NOT_ACTIVE", path, "claim cannot expire before its future effective date");
  if (claim.state === "approved") {
    if (!claim.expiresAt || Date.parse(claim.expiresAt) <= now) fail("CLAIM_NOT_CURRENT", path, "approved claim requires a future expiresAt");
    reviewEvidence(claim.reviewer, `${path}.reviewer`, now);
  } else {
    if (claim.reviewer) reviewEvidence(claim.reviewer, `${path}.reviewer`, now);
    if (!claim.nextReviewAt && !claim.terminalAt) fail("FRESHNESS_DATE", path, "non-approved claim requires nextReviewAt or terminalAt");
  }
  if (terminalClaimStates.has(claim.state) && !claim.terminalAt) fail("TERMINAL_DATE", path, "terminal claim state requires terminalAt");
  if (!terminalClaimStates.has(claim.state) && claim.terminalAt) fail("TERMINAL_DATE", path, "non-terminal claim cannot carry terminalAt");
  if (terminalClaimStates.has(claim.state) && claim.terminalAt && Date.parse(claim.terminalAt) > now) fail("TERMINAL_DATE", path, "terminalAt cannot be in the future");
  if (reviewableClaimStates.has(claim.state) && claim.nextReviewAt && Date.parse(claim.nextReviewAt) <= now) fail("CLAIM_REVIEW_OVERDUE", path, "reviewable claim nextReviewAt must be in the future");
  if (claim.expiresAt) {
    if (source?.nextReviewAt && Date.parse(claim.expiresAt) > Date.parse(source.nextReviewAt)) fail("CLAIM_SOURCE_EXPIRY", path, "claim expires after its source review window");
  }
}

function validateConflict(conflict: ConflictRecord, index: number, sources: Map<string, SourceRecord>, claims: Map<string, ClaimRecord>, rules: Map<string, RuleRecord>, now: number): void {
  const path = `conflicts[${index}]`;
  ["issue", "owner"].forEach((field) => required(conflict[field as keyof ConflictRecord], "MISSING_FIELD", `${path}.${field}`));
  oneOf(conflict.state, CONFLICT_STATES, "INVALID_STATE", `${path}.state`);
  const sourceIds = uniqueIds(conflict.sourceIds, "CONFLICT_SOURCE_REF", `${path}.sourceIds`);
  const claimIds = uniqueIds(conflict.claimIds, "CONFLICT_CLAIM_REF", `${path}.claimIds`);
  const affectedRuleIds = uniqueIds(conflict.affectedRuleIds, "CONFLICT_RULE_REF", `${path}.affectedRuleIds`, false);
  if (sourceIds.some((id) => !sources.has(id))) fail("CONFLICT_SOURCE_REF", path, "must reference existing source IDs");
  if (claimIds.some((id) => !claims.has(id))) fail("CONFLICT_CLAIM_REF", path, "must reference existing claim IDs");
  if (affectedRuleIds.some((id) => !rules.has(id))) fail("CONFLICT_RULE_REF", `${path}.affectedRuleIds`, "must reference existing rule IDs");
  claimIds.forEach((claimId) => {
    const claim = claims.get(claimId);
    if (claim && !hasId(claim.conflictIds, conflict.conflictId)) fail("CONFLICT_CLAIM_LINK", `${path}.claimIds`, `claim ${claimId} does not reference this conflict`);
    if (claim && !sourceIds.includes(claim.sourceId)) fail("CONFLICT_SOURCE_LINK", `${path}.sourceIds`, `claim ${claimId} source is not listed`);
  });
  iso(conflict.detectedAt, `${path}.detectedAt`);
  if (Date.parse(conflict.detectedAt) > now) fail("FUTURE_DATE", `${path}.detectedAt`, "cannot be in the future");
  if (conflict.nextReviewAt) iso(conflict.nextReviewAt, `${path}.nextReviewAt`);
  if (conflict.terminalAt) iso(conflict.terminalAt, `${path}.terminalAt`);
  list(conflict.auditHistory, "INVALID_ARRAY", `${path}.auditHistory`).forEach((entry, entryIndex) => {
    if (!entry || typeof entry !== "object") fail("INVALID_ARRAY", `${path}.auditHistory[${entryIndex}]`, "must be an object");
    const auditEntry = entry as ConflictRecord["auditHistory"][number];
    iso(auditEntry.at, `${path}.auditHistory[${entryIndex}].at`);
    if (Date.parse(auditEntry.at) > now) fail("FUTURE_DATE", `${path}.auditHistory[${entryIndex}].at`, "cannot be in the future");
    required(auditEntry.actor, "MISSING_FIELD", `${path}.auditHistory[${entryIndex}].actor`);
    required(auditEntry.action, "MISSING_FIELD", `${path}.auditHistory[${entryIndex}].action`);
    required(auditEntry.evidence, "MISSING_FIELD", `${path}.auditHistory[${entryIndex}].evidence`);
  });
  if (conflict.approver) reviewEvidence(conflict.approver, `${path}.approver`, now);
  if (conflict.fallbackReview) reviewEvidence(conflict.fallbackReview, `${path}.fallbackReview`, now);
  if (conflict.resolutionBasis !== undefined) required(conflict.resolutionBasis, "CONFLICT_RESOLUTION", `${path}.resolutionBasis`);
  if (conflict.fallbackCopy !== undefined) required(conflict.fallbackCopy, "FALLBACK_COPY", `${path}.fallbackCopy`);
  if (conflict.fallbackCopy && !conflict.fallbackReview) fail("FALLBACK_REVIEW", path, "fallback copy requires explicit source-risk review evidence");
  if (blockedConflictStates.has(conflict.state) && conflict.approver) fail("OPEN_CONFLICT_APPROVAL", path, "open/unresolved conflict cannot have resolution approval");
  if (blockedConflictStates.has(conflict.state) && conflict.fallbackCopy) fail("OPEN_CONFLICT_FALLBACK", path, "open/unresolved conflict cannot have fallback copy");
  if (conflict.state === "resolved-objectively") {
    if (conflict.resolutionBasis === undefined || !conflict.approver) fail("CONFLICT_RESOLUTION", path, "objective resolution requires basis and approver");
  }
  if (!conflict.nextReviewAt && !conflict.terminalAt) fail("CONFLICT_REVIEW_DATE", path, "requires nextReviewAt or terminalAt");
  if (conflict.state !== "withdrawn" && conflict.nextReviewAt && Date.parse(conflict.nextReviewAt) <= now) fail("CONFLICT_REVIEW_OVERDUE", path, "conflict review is overdue");
  if (conflict.state === "withdrawn" && !conflict.terminalAt) fail("TERMINAL_DATE", path, "withdrawn conflict requires terminalAt");
  if (conflict.state !== "withdrawn" && conflict.terminalAt) fail("TERMINAL_DATE", path, "non-terminal conflict cannot carry terminalAt");
  if (conflict.state === "withdrawn" && conflict.terminalAt && Date.parse(conflict.terminalAt) > now) fail("TERMINAL_DATE", path, "terminalAt cannot be in the future");
}

function validateRule(rule: RuleRecord, index: number, claims: Map<string, ClaimRecord>, conflicts: Map<string, ConflictRecord>, sources: Map<string, SourceRecord>, now: number): void {
  const path = `rules[${index}]`;
  required(rule.ruleId, "MISSING_ID", `${path}.ruleId`);
  if (typeof rule.enabled !== "boolean") fail("RULE_SHAPE", `${path}.enabled`, "must be boolean");
  const ruleClaimIds = uniqueIds(rule.claimIds, "RULE_EVIDENCE", `${path}.claimIds`);
  if (rule.expiresAt) iso(rule.expiresAt, `${path}.expiresAt`);
  const referenced = ruleClaimIds.map((id) => {
    const claim = claims.get(id);
    if (!claim) fail("UNKNOWN_CLAIM", `${path}.claimIds`, id);
    return claim;
  });
  if (!rule.enabled) return;
  const ruleExpiry = rule.expiresAt;
  if (!ruleExpiry || Date.parse(ruleExpiry) <= now) fail("RULE_NOT_CURRENT", path, "enabled rule requires a future expiresAt");
  const earliestClaimExpiry = Math.min(...referenced.map((claim) => {
    if (claim.state !== "approved" || !claim.expiresAt) fail("RULE_UNAPPROVED_CLAIM", path, claim.claimId);
    const source = sources.get(claim.sourceId);
    if (!source || source.state !== "approved") fail("RULE_UNAPPROVED_SOURCE", path, claim.sourceId);
    if (claim.effectiveFrom && Date.parse(claim.effectiveFrom) > now) fail("RULE_CLAIM_NOT_ACTIVE", path, claim.claimId);
    if (claim.effectiveTo && Date.parse(claim.effectiveTo) <= now) fail("RULE_CLAIM_NOT_ACTIVE", path, claim.claimId);
    if (claim.effectiveTo && Date.parse(ruleExpiry) > Date.parse(claim.effectiveTo)) fail("RULE_CLAIM_WINDOW", path, claim.claimId);
    claim.conflictIds.forEach((conflictId) => {
      const conflict = conflicts.get(conflictId);
      if (conflict && blockedConflictStates.has(conflict.state)) fail("RULE_BLOCKED_CONFLICT", path, conflictId);
    });
    conflicts.forEach((conflict) => {
      if (blockedConflictStates.has(conflict.state) && conflict.claimIds.includes(claim.claimId)) fail("RULE_BLOCKED_CONFLICT", path, conflict.conflictId);
    });
    return Date.parse(claim.expiresAt);
  }));
  if (Date.parse(ruleExpiry) > earliestClaimExpiry) fail("RULE_EXPIRY", path, "cannot outlive its earliest claim expiry");
}

export function validateEvidence(bundle: EvidenceBundle, at = new Date()): void {
  const now = at.getTime();
  if (!Number.isFinite(now)) fail("INVALID_CLOCK", "at", "validation time must be valid");
  list(bundle.sources, "BUNDLE_SHAPE", "sources");
  list(bundle.claims, "BUNDLE_SHAPE", "claims");
  list(bundle.conflicts, "BUNDLE_SHAPE", "conflicts");
  if (bundle.rules !== undefined) list(bundle.rules, "BUNDLE_SHAPE", "rules");
  const sources = idSet(bundle.sources, "sourceId", "sources");
  const claims = idSet(bundle.claims, "claimId", "claims");
  const conflicts = idSet(bundle.conflicts, "conflictId", "conflicts");
  const rules = idSet(bundle.rules ?? [], "ruleId", "rules");
  bundle.sources.forEach((source, index) => validateSource(source, index, now));
  bundle.claims.forEach((claim, index) => validateClaim(claim, index, sources, conflicts, now));
  bundle.conflicts.forEach((conflict, index) => validateConflict(conflict, index, sources, claims, rules, now));
  (bundle.rules ?? []).forEach((rule, index) => validateRule(rule, index, claims, conflicts, sources, now));
}
