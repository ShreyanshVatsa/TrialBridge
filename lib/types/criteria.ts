import type { SplitCriterion } from "@/lib/ingest/criteria-split";

export type InclusionLabel = "met" | "not_met" | "unknown" | "not_applicable";
export type ExclusionLabel = "excluded" | "not_excluded" | "unknown" | "not_applicable";
export type CriterionLabelValue = InclusionLabel | ExclusionLabel;

/** One criterion item's verdict. `source` says who settled it. */
export interface CriterionLabel {
  id: string;
  section: SplitCriterion["section"];
  label: CriterionLabelValue;
  source: "rule" | "llm" | "default";
  /** <=25 words, plain English. Never a quote of the criterion. */
  reason?: string;
  /** Numbered patient answers (A1..An) the verdict rests on. */
  answerIds?: string[];
}

export interface TrialCriteriaLabels {
  trialId: string;
  criteriaVersion: number;
  labels: CriterionLabel[];
  /** Provider that answered the LLM part, or null when resolver-only. */
  provider: string | null;
}
