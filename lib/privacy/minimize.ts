import type { IntakeAnswers } from "@/lib/types/intake";
import {
  ACTIVITY_BANDS,
  AI_TREATMENTS,
  BRAIN_METS,
  DISEASE_STATUSES,
  MinimizedProfileSchema,
  PRIOR_LINES,
  STAGE_CATEGORIES,
  type AgeBracket,
  type MinimizedProfile,
} from "@/lib/types/analysis";
import { DRUG_CLASS_IDS, GROUP_STATUS_IDS, SUBTYPE_IDS } from "@/config/questionnaire/ids";
import type { AnswerValue, QuestionnaireState } from "@/lib/types/questionnaire";

/** Map an exact age to its decade bracket so the exact age never leaves the browser. */
export function ageToBracket(age: number): AgeBracket {
  if (age < 30) return "18-29";
  if (age < 40) return "30-39";
  if (age < 50) return "40-49";
  if (age < 60) return "50-59";
  if (age < 70) return "60-69";
  if (age < 80) return "70-79";
  if (age < 90) return "80-89";
  return "90+";
}

/**
 * A definite answer that is a member of the closed list, else undefined. "not_sure", unknown, skip,
 * prefer not and deferred answers are all omitted: an omitted field and "not sure" mean the same to the
 * model, and omission keeps the analysis cache hit rate up.
 */
function oneOf<T extends string>(v: AnswerValue | undefined, allowed: readonly T[]): T | undefined {
  return typeof v === "string" && v !== "not_sure" && (allowed as readonly string[]).includes(v) ? (v as T) : undefined;
}

/**
 * The coarse v2 fields (QUESTIONNAIRE_SPEC §4.2), copied one by one from the questionnaire state. Nothing
 * else in the state (HIV, hepatitis, transplant, autoimmune, organ problems, other cancer, sex, measurable
 * disease, phase preference, deferred and find-out lists) is ever read here.
 */
function v2Fields(state: QuestionnaireState): Partial<MinimizedProfile> {
  const a = state.answers;
  const out: Partial<MinimizedProfile> = { v: 2 };
  const subtype = oneOf(a["subtype"], SUBTYPE_IDS);
  if (subtype) out.subtype = subtype;
  const stage = oneOf(a["spread"], STAGE_CATEGORIES);
  if (stage) out.stageCategory = stage;
  const status = oneOf(a["disease_status"], DISEASE_STATUSES);
  if (status) out.diseaseStatus = status;
  const treatments = a["treatments"];
  const lines = Array.isArray(treatments) && treatments.length === 1 && treatments[0] === "none" ? "0" : oneOf(a["lines"], PRIOR_LINES);
  if (lines) out.priorLines = lines;
  const activity = oneOf(a["daily_activity"], ACTIVITY_BANDS);
  if (activity) out.activityBand = activity;
  const brain = oneOf(a["brain_mets"], BRAIN_METS);
  if (brain) out.brainMets = brain;
  const groupStatus = oneOf(a["group_status"], GROUP_STATUS_IDS);
  if (groupStatus) out.groupStatus = groupStatus;
  const drugs = a["prior_drugs"];
  if (Array.isArray(drugs)) {
    const classes = [...new Set(drugs.filter((d): d is (typeof DRUG_CLASS_IDS)[number] => (DRUG_CLASS_IDS as readonly string[]).includes(d)))].sort();
    if (classes.length > 0) out.priorDrugClasses = classes;
  }
  return out;
}

/** Treatments for AI: the questionnaire's multi-select (incl. hormone therapy, stem cell transplant) when present. */
function aiTreatments(answers: IntakeAnswers): MinimizedProfile["treatments"] {
  const t = answers.questionnaire?.answers["treatments"];
  if (Array.isArray(t)) {
    const known = t.filter((x): x is (typeof AI_TREATMENTS)[number] => (AI_TREATMENTS as readonly string[]).includes(x));
    if (known.length > 0 && known.length === t.length) return [...new Set(known)];
    return ["not_sure"];
  }
  return [...answers.treatments];
}

function concurrentTrial(answers: IntakeAnswers): MinimizedProfile["concurrentTrial"] {
  if (!answers.questionnaire) return answers.inAnotherTrial;
  const v = answers.questionnaire.answers["in_other_trial"];
  return v === "yes" || v === "no" ? v : "not_sure";
}

/**
 * Build the only profile shape allowed to reach the backend / AI providers.
 * Explicitly copies allowed fields (never spreads the input) and validates with the strict schema.
 * ZIP, travel distance, exact age and personal health history are dropped here.
 */
export function minimizeProfile(answers: IntakeAnswers): MinimizedProfile {
  return MinimizedProfileSchema.parse({
    cancerType: answers.cancerType,
    ageBracket: ageToBracket(answers.age),
    spread: answers.spread,
    treatments: aiTreatments(answers),
    biomarkers: { ...answers.biomarkers },
    pregnant: answers.pregnant,
    concurrentTrial: concurrentTrial(answers),
    language: answers.language,
    ...(answers.questionnaire ? v2Fields(answers.questionnaire) : {}),
  });
}
