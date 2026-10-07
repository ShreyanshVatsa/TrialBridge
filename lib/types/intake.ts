import { z } from "zod";
import { BiomarkerIdSchema, CancerGroupIdSchema } from "./trial";
import { QuestionnaireStateSchema } from "./questionnaire";

/**
 * Intake answers. These live ONLY in browser memory and are never sent to the backend as-is.
 * Use `minimizeProfile()` (lib/types/minimize.ts) to derive what may be sent to AI.
 */

export const LANGUAGES = ["en", "es", "pt", "ht"] as const;
export const LanguageSchema = z.enum(LANGUAGES);
export type Language = z.infer<typeof LanguageSchema>;

export const TREATMENTS = ["chemotherapy", "radiation", "surgery", "immunotherapy", "targeted_therapy", "none", "not_sure"] as const;
export const TreatmentSchema = z.enum(TREATMENTS);
export type Treatment = z.infer<typeof TreatmentSchema>;

export const SpreadSchema = z.enum(["yes", "no", "not_sure"]);
export type Spread = z.infer<typeof SpreadSchema>;

export const BiomarkerStatusSchema = z.enum(["positive", "negative", "dont_know"]);
export type BiomarkerStatus = z.infer<typeof BiomarkerStatusSchema>;

export const PregnancySchema = z.enum(["yes", "no", "not_sure", "prefer_not"]);
export type Pregnancy = z.infer<typeof PregnancySchema>;

export const YesNoSchema = z.enum(["yes", "no"]);

/** Selected cancer group, or "other" for "Other / not sure" (searches the cross-group index). */
export const IntakeCancerTypeSchema = CancerGroupIdSchema;

export const ZipSchema = z.string().regex(/^\d{5}$/, "Enter a 5-digit ZIP code");
/** Travel distance in miles; null means "willing to travel anywhere". */
export const TRAVEL_OPTIONS = [25, 50, 100, 250, 500, null] as const;
export const TravelMilesSchema = z.number().int().positive().max(5000).nullable();
/** Intake accepts 18-110. Under 18 is handled by the UI with a pediatric-resources message. */
export const AgeSchema = z.number().int().min(18).max(110);

export const IntakeAnswersSchema = z.strictObject({
  cancerType: IntakeCancerTypeSchema,
  zip: ZipSchema,
  travelMiles: TravelMilesSchema,
  age: AgeSchema,
  language: LanguageSchema,
  spread: SpreadSchema,
  treatments: z.array(TreatmentSchema).min(1),
  biomarkers: z.partialRecord(BiomarkerIdSchema, BiomarkerStatusSchema),
  pregnant: PregnancySchema,
  inAnotherTrial: YesNoSchema,
  /** v2 adaptive questionnaire state (browser-only). When present, matching uses the catalog-driven pre-check. */
  questionnaire: QuestionnaireStateSchema.optional(),
});
export type IntakeAnswers = z.infer<typeof IntakeAnswersSchema>;
