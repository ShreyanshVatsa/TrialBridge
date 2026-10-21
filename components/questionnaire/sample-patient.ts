import { emptyState, type AnswerValue, type QuestionnaireState } from "./contract";
import { applyAnswer, getCatalog } from "./engine";

/**
 * A made-up patient for demos and first-time visitors ("Try a sample patient", `/find/?demo=1`). Not a real
 * person: the answers were invented to show a typical flow (metastatic HER2-positive breast cancer near Boston).
 * Answers are applied through the engine so prerequisites and drops behave exactly as if they had been typed.
 */
export const SAMPLE_PATIENT: Readonly<Record<string, AnswerValue>> = {
  cancer_type: "breast",
  age: 58,
  zip: "02115",
  travel: 250,
  sex: "female",
  spread: "distant",
  daily_activity: "0-1",
  brain_mets: "none",
  biomarkers: { HER2: "positive", HR: "negative" },
};

export function samplePatientState(): QuestionnaireState {
  const catalog = getCatalog("cancer", "breast");
  let state = emptyState();
  for (const [id, value] of Object.entries(SAMPLE_PATIENT)) state = applyAnswer(state, id, value, catalog).state;
  return state;
}

/** True when the page was opened with `?demo=1` (the video / judge shortcut straight to results). */
export function demoRequested(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("demo") === "1";
}
