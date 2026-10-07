import type { FitLevel } from "@/lib/types/analysis";
import type { PrecheckNote } from "@/lib/types/match";
import { maxRrfScore } from "./rrf";

/**
 * Final ranking score. Every weight is named and explained so the formula is auditable:
 *
 *   final = RETRIEVAL_WEIGHT * retrieval            (0..1, how well the trial matches the profile text)
 *         - CONFLICT_PENALTY * min(conflicts, MAX_COUNTED_CONFLICTS)   (rule pre-check)
 *         + SUPPORT_BONUS    * min(supports,  MAX_COUNTED_SUPPORTS)
 *         + FIT_ADJUSTMENT[fit]                     (AI analysis, when available)
 *
 * "Not sure" / "don't know" answers never create conflicts (see precheck.ts), so they never penalize.
 */

/** Retrieval relevance (normalized RRF) is the backbone of the ranking. */
export const RETRIEVAL_WEIGHT = 1.0;
/** Each likely conflict with a stated criterion pushes a trial down noticeably... */
export const CONFLICT_PENALTY = 0.15;
/** ...but only the first few count, so one strict trial isn't buried by repeated signals. */
export const MAX_COUNTED_CONFLICTS = 3;
/** Matching a stated requirement (e.g. HER2-positive required, user is HER2-positive) helps slightly. */
export const SUPPORT_BONUS = 0.03;
export const MAX_COUNTED_SUPPORTS = 3;
/** AI fit level adjusts the score after analysis; "unclear" is neutral. */
export const FIT_ADJUSTMENT: Record<FitLevel, number> = {
  strong: 0.3,
  possible: 0.15,
  unclear: 0,
  unlikely: -0.3,
};

/** Normalize a raw RRF score to 0..1 given how many rankings were fused. */
export function normalizeRrf(rrf: number, rankingsUsed: number): number {
  if (rankingsUsed <= 0) return 0;
  return Math.min(1, rrf / maxRrfScore(rankingsUsed));
}

/** Penalty from pre-check conflicts (a positive number to subtract). */
export function precheckPenalty(notes: readonly PrecheckNote[]): number {
  const conflicts = notes.filter((n) => n.kind === "conflict").length;
  return CONFLICT_PENALTY * Math.min(conflicts, MAX_COUNTED_CONFLICTS);
}

/** Bonus from pre-check supports. */
export function precheckBonus(notes: readonly PrecheckNote[]): number {
  const supports = notes.filter((n) => n.kind === "support").length;
  return SUPPORT_BONUS * Math.min(supports, MAX_COUNTED_SUPPORTS);
}

/** Combine retrieval, rule pre-check, and (optional) AI fit into the final score. */
export function finalScore(input: { retrieval: number; precheck: readonly PrecheckNote[]; fit: FitLevel | null }): number {
  const fitAdj = input.fit ? FIT_ADJUSTMENT[input.fit] : 0;
  return RETRIEVAL_WEIGHT * input.retrieval - precheckPenalty(input.precheck) + precheckBonus(input.precheck) + fitAdj;
}
