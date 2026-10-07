import type { Site, TrialCard, FactKey, CriterionRef } from "./trial";
import type { FitLevel, TrialAnalysis } from "./analysis";

/** A note from the rule-based eligibility pre-check (lib/match/precheck.ts). */
export interface PrecheckNote {
  key: FactKey;
  /** conflict = the answer likely conflicts with this criterion; support = the answer likely matches it. */
  kind: "conflict" | "support";
  quote: string;
  ref: CriterionRef;
}

export interface NearestSite {
  site: Site;
  /** Great-circle miles from the user's ZIP centroid; null when coordinates are unavailable. */
  miles: number | null;
}

/** One ranked result produced by `searchTrials` and refined by `applyAnalysis`. */
export interface RankedTrial {
  card: TrialCard;
  sites: Site[];
  nearest: NearestSite | null;
  /** True when the user prefers a non-English language and the trial requires English. */
  languageWarning: boolean;
  precheck: PrecheckNote[];
  scores: {
    /** 1-based ranks; null = not retrieved by that method. */
    keywordRank: number | null;
    vectorRank: number | null;
    rrf: number;
    precheckPenalty: number;
    fit: FitLevel | null;
    final: number;
  };
  analysis: TrialAnalysis | null;
}

export type SearchStage = "loading_shards" | "loading_model" | "filtering" | "ranking" | "done";

export interface SearchProgress {
  stage: SearchStage;
  /** 0..1 for downloads, when known. */
  fraction?: number;
}

export interface SearchOutcome {
  results: RankedTrial[];
  /** How many trials passed hard filters. */
  candidateCount: number;
  /** Total trials searched in the loaded shard(s). */
  searchedCount: number;
  /** True if embeddings failed or timed out and ranking fell back to keyword-only. */
  keywordOnly: boolean;
}
