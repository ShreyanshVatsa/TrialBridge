import type { FitLevel } from "@/lib/types/analysis";
import type { PrecheckNote } from "@/lib/types/match";
import { maxRrfScore } from "./rrf";

/**
 * Final ranking score. Every weight is named and explained so the formula is auditable:
 *
 *   final = RETRIEVAL_WEIGHT * retrieval                         (0..1, how well the trial matches the profile text)
 *         - Σ over the MAX_COUNTED_CONFLICTS largest conflicts of
 *               CONFLICT_PENALTY * factWeight(conflict) * reliability(conflict)     (rule pre-check)
 *         + SUPPORT_BONUS * min(supports, MAX_COUNTED_SUPPORTS)
 *         + BIOMARKER_MATCH_BONUS  (once, when a biomarker the trial requires is one the patient has)
 *         + phase preference bonus (±PHASE_PREF_BONUS, a preference, never a filter)
 *         + FIT_ADJUSTMENT[fit]                                   (AI analysis, when available)
 *
 * "Not sure" / "don't know" / "skip" / "prefer not to say" answers never create notes (see precheck.ts),
 * so they never penalize. Facts never exclude a trial: only hard filters (group, age, distance, a definite
 * sex) do that, in filters.ts.
 */

/** Retrieval relevance (normalized RRF) is the backbone of the ranking. */
export const RETRIEVAL_WEIGHT = 1.0;
/** Each likely conflict with a stated criterion pushes a trial down noticeably... */
export const CONFLICT_PENALTY = 0.15;
/** ...but only the first few count, so one strict trial isn't buried by repeated signals. Raised from 3 to 4
 *  in v2: more questions mean more legitimate signals, and it is still capped. */
export const MAX_COUNTED_CONFLICTS = 4;
/** Matching a stated requirement (e.g. HER2-positive required, user is HER2-positive) helps slightly. */
export const SUPPORT_BONUS = 0.03;
export const MAX_COUNTED_SUPPORTS = 3;

/** How much one conflict on a fact key counts, relative to a typical rule (1.0). */
export const DEFAULT_FACT_WEIGHT = 1.0;
/** Keys with a high carve-out rate ("unless treated more than 2 years ago", "unless controlled") or that patients
 *  describe only coarsely: half weight, because the criterion often has an exception we cannot see. */
export const LOW_CERTAINTY_FACT_WEIGHT = 0.5;
export const LOW_CERTAINTY_KEYS: readonly string[] = ["other_malignancy", "kidney_disease", "liver_disease", "heart_disease", "measurable_disease"];
/** A trial that REQUIRES a specific subtype or biomarker is the most specific gate there is. */
export const SPECIFIC_REQUIREMENT_WEIGHT = 1.2;
/** Rule facts are trusted as extracted (families below the precision gate are already switched off by fact
 *  policy); LLM facts count in proportion to the model's stated confidence. */
export const RULE_RELIABILITY = 1.0;

/** A required biomarker the patient has is strong positive evidence (counted once per trial). */
export const BIOMARKER_MATCH_BONUS = 0.08;
/** Phase preference nudges, never filters. */
export const PHASE_PREF_BONUS = 0.03;

/** AI fit level adjusts the score after analysis; "unclear" is neutral. */
export const FIT_ADJUSTMENT: Record<FitLevel, number> = {
  strong: 0.3,
  possible: 0.15,
  unclear: 0,
  unlikely: -0.3,
};

type NoteLike = Pick<PrecheckNote, "key" | "kind"> & Partial<Pick<PrecheckNote, "value" | "source" | "confidence">>;

/** FACT_WEIGHT[key]: 1.2 for required histology/biomarker gates, 0.5 for high carve-out keys, else 1.0. */
export function factWeight(n: NoteLike): number {
  if (LOW_CERTAINTY_KEYS.includes(n.key)) return LOW_CERTAINTY_FACT_WEIGHT;
  if (n.value === "required" && (n.key.startsWith("histology:") || n.key.startsWith("biomarker:"))) return SPECIFIC_REQUIREMENT_WEIGHT;
  return DEFAULT_FACT_WEIGHT;
}

/** RELIABILITY[source]: rule 1.0; llm = its confidence (1.0 when missing). */
export function reliability(n: NoteLike): number {
  return n.source === "llm" ? (n.confidence ?? 1) : RULE_RELIABILITY;
}

/** Normalize a raw RRF score to 0..1 given how many rankings were fused. */
export function normalizeRrf(rrf: number, rankingsUsed: number): number {
  if (rankingsUsed <= 0) return 0;
  return Math.min(1, rrf / maxRrfScore(rankingsUsed));
}

/** Penalty from pre-check conflicts (a positive number to subtract): the largest MAX_COUNTED_CONFLICTS weighted conflicts. */
export function precheckPenalty(notes: readonly NoteLike[]): number {
  const each = notes.filter((n) => n.kind === "conflict").map((n) => CONFLICT_PENALTY * factWeight(n) * reliability(n));
  each.sort((a, b) => b - a);
  return each.slice(0, MAX_COUNTED_CONFLICTS).reduce((s, x) => s + x, 0);
}

/** Bonus from pre-check supports, plus the one-off biomarker match bonus. */
export function precheckBonus(notes: readonly NoteLike[]): number {
  const supports = notes.filter((n) => n.kind === "support");
  const biomarkerMatch = supports.some((n) => n.value === "required" && n.key.startsWith("biomarker:"));
  return SUPPORT_BONUS * Math.min(supports.length, MAX_COUNTED_SUPPORTS) + (biomarkerMatch ? BIOMARKER_MATCH_BONUS : 0);
}

/**
 * Phase preference (questionnaire `phase_pref`): "phase1_ok" favors first-in-human studies slightly;
 * "later_phase" favors phase 3 and disfavors phase 1-only studies. Anything else (no preference, unknown) is 0.
 */
export function phaseBonus(pref: string | null | undefined, phases: readonly string[]): number {
  const isEarly = phases.length > 0 && phases.every((p) => p === "PHASE1" || p === "EARLY_PHASE1");
  if (pref === "phase1_ok") return isEarly ? PHASE_PREF_BONUS : 0;
  if (pref === "later_phase") {
    if (isEarly) return -PHASE_PREF_BONUS;
    return phases.includes("PHASE3") ? PHASE_PREF_BONUS : 0;
  }
  return 0;
}

/** Combine retrieval, rule pre-check, phase preference and (optional) AI fit into the final score. */
export function finalScore(input: { retrieval: number; precheck: readonly NoteLike[]; fit: FitLevel | null; phase?: number }): number {
  const fitAdj = input.fit ? FIT_ADJUSTMENT[input.fit] : 0;
  return RETRIEVAL_WEIGHT * input.retrieval - precheckPenalty(input.precheck) + precheckBonus(input.precheck) + (input.phase ?? 0) + fitAdj;
}
