import { getCancerGroup } from "@/config/cancer-groups";
import { BIOMARKERS } from "@/config/biomarkers";
import type { IntakeAnswers } from "@/lib/types/intake";
import type { QuestionDef } from "@/lib/types/questionnaire";
import { compileState, queryTermsOf } from "@/lib/questionnaire/rules";

const TREATMENT_WORDS: Record<string, string> = {
  chemotherapy: "prior chemotherapy",
  radiation: "prior radiation therapy",
  surgery: "prior surgery resection",
  immunotherapy: "prior immunotherapy checkpoint inhibitor",
  targeted_therapy: "prior targeted therapy",
};

/**
 * Standardized English profile text used for BOTH keyword search and the profile embedding.
 * Built only from structured answers (no ZIP, no exact age), so it is safe to compute anywhere.
 */
export function buildProfileText(a: Pick<IntakeAnswers, "cancerType" | "spread" | "treatments" | "biomarkers" | "questionnaire">, catalog?: readonly QuestionDef[]): string {
  const parts: string[] = [groupText(a.cancerType)];
  // v2: the chosen options' English query terms, in catalog order. Unknown / skip / prefer not add nothing.
  if (a.questionnaire && catalog) return [...parts, ...queryTermsOf(compileState(a.questionnaire, catalog))].join(" ");
  if (a.spread === "yes") parts.push("Metastatic advanced stage IV disease.");
  else if (a.spread === "no") parts.push("Localized early stage disease.");

  const treated = a.treatments.filter((t) => t in TREATMENT_WORDS);
  if (treated.length) parts.push(`Previously treated with ${treated.map((t) => TREATMENT_WORDS[t]).join(", ")}.`);
  else if (a.treatments.includes("none")) parts.push("Newly diagnosed, previously untreated.");

  for (const b of BIOMARKERS) {
    const s = a.biomarkers[b.id];
    if (s === "positive") parts.push(`${b.label} positive.`);
    else if (s === "negative") parts.push(`${b.label} negative.`);
  }
  return parts.join(" ");
}

function groupText(cancerType: IntakeAnswers["cancerType"]): string {
  if (cancerType === "other") return "Cancer.";
  const g = getCancerGroup(cancerType);
  return `${g.label}. ${g.synonyms.join(", ")}.`;
}
