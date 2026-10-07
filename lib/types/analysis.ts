import { z } from "zod";
import { BiomarkerIdSchema, CancerGroupIdSchema, CriterionSectionSchema } from "./trial";
import { BiomarkerStatusSchema, LanguageSchema, PregnancySchema, SpreadSchema, TreatmentSchema, YesNoSchema } from "./intake";

/**
 * Data-minimization boundary. This strict schema is the ONLY shape of patient data that may
 * leave the browser or reach an AI provider. No ZIP, exact age, location, names, or free text.
 * `z.strictObject` rejects any extra field, so accidental leaks fail validation loudly.
 */
export const AGE_BRACKETS = ["18-29", "30-39", "40-49", "50-59", "60-69", "70-79", "80-89", "90+"] as const;
export const AgeBracketSchema = z.enum(AGE_BRACKETS);
export type AgeBracket = z.infer<typeof AgeBracketSchema>;

export const MinimizedProfileSchema = z.strictObject({
  cancerType: CancerGroupIdSchema,
  ageBracket: AgeBracketSchema,
  spread: SpreadSchema,
  treatments: z.array(TreatmentSchema).min(1).max(7),
  biomarkers: z.partialRecord(BiomarkerIdSchema, BiomarkerStatusSchema),
  pregnant: PregnancySchema,
  concurrentTrial: YesNoSchema,
  language: LanguageSchema,
});
export type MinimizedProfile = z.infer<typeof MinimizedProfileSchema>;

export const NctIdSchema = z.string().regex(/^NCT\d{8}$/);

/** POST /api/analyze request body. */
export const AnalyzeRequestSchema = z.strictObject({
  profile: MinimizedProfileSchema,
  nctIds: z.array(NctIdSchema).min(1).max(15),
  turnstileToken: z.string().min(1).max(2048),
});
export type AnalyzeRequest = z.infer<typeof AnalyzeRequestSchema>;

export const FitLevelSchema = z.enum(["strong", "possible", "unlikely", "unclear"]);
export type FitLevel = z.infer<typeof FitLevelSchema>;

export const AssessmentSchema = z.enum(["likely_met", "likely_not_met", "needs_doctor"]);
export type Assessment = z.infer<typeof AssessmentSchema>;

export const CriterionAssessmentSchema = z.strictObject({
  section: CriterionSectionSchema,
  number: z.number().int().positive(),
  /** Verbatim English criterion text (verified server-side against the trial's own copy). */
  quote: z.string().min(1).max(2000),
  assessment: AssessmentSchema,
  /** Plain-language explanation in the user's language. */
  explanation: z.string().min(1).max(600),
});
export type CriterionAssessment = z.infer<typeof CriterionAssessmentSchema>;

export const TrialAnalysisSchema = z.strictObject({
  nctId: NctIdSchema,
  fitLevel: FitLevelSchema,
  criteria: z.array(CriterionAssessmentSchema).max(12),
  doctorQuestions: z.array(z.string().min(1).max(300)).max(5),
  summary: z.string().min(1).max(400),
});
export type TrialAnalysis = z.infer<typeof TrialAnalysisSchema>;

/** What the AI model must return (validated before quote verification). */
export const ModelAnalysisOutputSchema = z.object({ trials: z.array(TrialAnalysisSchema) });

export const AnalyzeResponseSchema = z.strictObject({
  /** ok = AI analysis present; degraded = AI unavailable, use retrieval + rules only. */
  status: z.enum(["ok", "degraded"]),
  provider: z.string().nullable(),
  results: z.array(TrialAnalysisSchema),
  /** True when output language is Haitian Creole (AI output marked experimental). */
  experimental: z.boolean(),
  cached: z.boolean(),
  /** Machine-readable reason when degraded; UI maps it to a friendly, translated notice. */
  degradedReason: z.enum(["ai_unavailable", "rate_limited", "budget_exhausted", "invalid_output"]).optional(),
});
export type AnalyzeResponse = z.infer<typeof AnalyzeResponseSchema>;

/** Typed backend error envelope. Messages are safe to show; the UI maps `code` to translated text. */
export const ApiErrorCodeSchema = z.enum([
  "bad_request",
  "payload_too_large",
  "forbidden_origin",
  "turnstile_failed",
  "rate_limited",
  "not_found",
  "method_not_allowed",
  "internal",
]);
export type ApiErrorCode = z.infer<typeof ApiErrorCodeSchema>;
export const ApiErrorSchema = z.object({ error: z.object({ code: ApiErrorCodeSchema, message: z.string(), requestId: z.string() }) });
export type ApiError = z.infer<typeof ApiErrorSchema>;
