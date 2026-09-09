import type { EvidenceBundle } from "./schema";

export interface EvidenceSummary {
  sourceCount: number;
  claimCount: number;
  conflictCount: number;
  ruleCount: number;
  enabledRuleCount: number;
  sourcesByState: Readonly<Record<string, number>>;
  claimsByState: Readonly<Record<string, number>>;
  conflictsByState: Readonly<Record<string, number>>;
}

function countStates<T extends { state: string }>(records: readonly T[]): Readonly<Record<string, number>> {
  return records.reduce<Record<string, number>>((counts, record) => {
    counts[record.state] = (counts[record.state] ?? 0) + 1;
    return counts;
  }, {});
}

/**
 * Returns a deterministic, telemetry-free inventory summary for developer checks.
 * It reports record states only; it does not approve, interpret, or route claims.
 */
export function summarizeEvidence(bundle: EvidenceBundle): EvidenceSummary {
  const rules = bundle.rules ?? [];
  return {
    sourceCount: bundle.sources.length,
    claimCount: bundle.claims.length,
    conflictCount: bundle.conflicts.length,
    ruleCount: rules.length,
    enabledRuleCount: rules.filter((rule) => rule.enabled).length,
    sourcesByState: countStates(bundle.sources),
    claimsByState: countStates(bundle.claims),
    conflictsByState: countStates(bundle.conflicts),
  };
}
