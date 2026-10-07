/**
 * Named constants of the adaptive questionnaire engine (QUESTIONNAIRE_SPEC §2). Every number that
 * shapes which question is asked next lives here, with the reason, so the behavior is auditable.
 */

/** Essential questions, always first and in this order. They are hard filters and cannot be skipped. */
export const Q_CANCER_TYPE = "cancer_type";
export const Q_AGE = "age";
export const Q_ZIP = "zip";
export const Q_TRAVEL = "travel";
export const ESSENTIAL_ORDER = [Q_CANCER_TYPE, Q_AGE, Q_ZIP, Q_TRAVEL] as const;

/** Information gain is measured over the K best-scoring candidates (the ones a patient would actually see). */
export const TOP_K = 60;
/** Softmax temperature over candidate scores: p(t) ∝ exp(score / TAU). Scores live roughly in 0..1, so 0.15
 *  makes a 0.15 score gap ≈ e (2.7x) more probability mass, i.e. the same size as one rule conflict. */
export const TAU = 0.15;
/** Likelihood of an answer for a trial it conflicts with: e^-LAMBDA. */
export const LAMBDA = 1.2;
/** Likelihood of an answer for a trial it supports: e^+MU. LAMBDA : MU mirrors CONFLICT_PENALTY : SUPPORT_BONUS damped. */
export const MU = 0.4;
/** Likelihood used when a hypothetical answer would hard-filter the trial (definite sex). Not exactly 0 to keep logs finite. */
export const HARD_EXCLUDED_LIKELIHOOD = 1e-9;

/** Tier multipliers on utility. Deep-dive questions are optional in quick mode, so they are demoted. */
export const TIER_FACTOR = {
  quick: { essential: Number.POSITIVE_INFINITY, helpful: 1.0, deep: 0.6 },
  thorough: { essential: Number.POSITIVE_INFINITY, helpful: 1.0, deep: 1.0 },
} as const;

export interface StopRule {
  /** Stop when the best remaining utility (bits per unit of answer difficulty) falls below this. */
  minUtility: number;
  /** Stop after this many adaptive (non-essential) questions. */
  maxQuestions: number;
  /** Stop when this few trials have no likely conflict (null = never in this mode). */
  smallSet: number | null;
}
export const STOP_RULES: Record<"quick" | "thorough", StopRule> = {
  quick: { minUtility: 0.05, maxQuestions: 7, smallSet: 12 },
  thorough: { minUtility: 0.01, maxQuestions: 20, smallSet: null },
};

/** The sex question is shown only when at least this share of current candidates is sex-restricted. */
export const SEX_ASK_MIN_SHARE = 0.05;
export const Q_SEX = "sex";

/** After this many "don't know"-type answers in a row of the same kind... */
export const UNKNOWN_STREAK = 2;
/** ...questions of that kind that patients often cannot answer (prior P(unknown) >= HIGH_UNKNOWN_PRIOR)... */
export const HIGH_UNKNOWN_PRIOR = 0.6;
/** ...have their utility multiplied by this. */
export const FAMILY_DOWNWEIGHT = 0.5;

/** Default P(unknown) when the catalog gives no prior for the group; definite options share the rest equally. */
export const DEFAULT_P_UNKNOWN = 0.2;
/** Default biomarker priors per marker (spec §7.2: patients answer "don't know" to biomarkers ~40% of the time). */
export const DEFAULT_BIOMARKER_PRIOR = { positive: 0.2, negative: 0.4, unknown: 0.4 } as const;

/** Session resume: tab-scoped sessionStorage only (never localStorage, IndexedDB or a server). */
export const SESSION_KEY = "tb-questionnaire-v2";
/** Saved state older than this is discarded on load. */
export const SESSION_MAX_AGE_MS = 12 * 60 * 60 * 1000;
