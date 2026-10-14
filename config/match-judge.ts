/**
 * LLM criterion judge (v6 step 4) settings. The judge runs on the top N trials after retrieval and sees only
 * the criterion items the deterministic resolver left "unknown".
 */
export const MATCH_JUDGE = {
  /** Trials judged per request (top N after retrieval). */
  topN: 10,
  /** Unknown criterion items accepted per trial (a long trial is chunked across requests, never truncated silently). */
  maxItemsPerTrial: 120,
  /** Plain-language reason length cap, in words. */
  reasonMaxWords: 25,
  /** Characters of the trial summary shown to the model for context (TrialGPT also shows the summary). */
  summaryChars: 400,
  /** Re-asks of one batch after malformed / empty output before failing over (each re-ask reserves budget). */
  invalidOutputRetries: 1,
} as const;
