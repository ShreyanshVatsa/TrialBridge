import type { BiomarkerId } from "@/config/biomarkers";
import type { IntakeAnswers, Treatment } from "@/lib/types/intake";
import type { Fact } from "@/lib/types/trial";
import type { PrecheckNote } from "@/lib/types/match";

/** Which intake treatment answers correspond to which prior-treatment fact. */
const TREATMENT_FACTS: Record<string, Exclude<Treatment, "none" | "not_sure">> = {
  prior_chemotherapy: "chemotherapy",
  prior_radiation: "radiation",
  prior_surgery: "surgery",
  prior_immunotherapy: "immunotherapy",
  prior_targeted_therapy: "targeted_therapy",
};

/**
 * Rule-based eligibility pre-check: compare intake answers with a trial's stored facts.
 * Only definite answers can create conflicts or support; "not sure", "don't know", and
 * "prefer not to say" never penalize. "mentioned" facts are ignored (direction unknown).
 */
export function precheck(answers: Pick<IntakeAnswers, "spread" | "treatments" | "biomarkers" | "pregnant" | "inAnotherTrial">, facts: readonly Fact[]): PrecheckNote[] {
  const notes: PrecheckNote[] = [];
  const t = new Set(answers.treatments);
  const treatmentsKnown = !t.has("not_sure");
  const hadNone = t.has("none") && t.size === 1;
  const hadAny = treatmentsKnown && !hadNone;
  const add = (f: Fact, kind: PrecheckNote["kind"]) => notes.push({ key: f.key, kind, quote: f.quote, ref: f.ref });

  for (const f of facts) {
    if (f.value === "mentioned") continue;
    const treatment = TREATMENT_FACTS[f.key];
    if (treatment) {
      if (!treatmentsKnown) continue;
      const had = t.has(treatment);
      if (f.value === "excluded" && had) add(f, "conflict");
      else if (f.value === "required" && !had) add(f, "conflict");
      else if (f.value === "required" && had) add(f, "support");
      continue;
    }
    switch (f.key) {
      case "metastatic":
        if (answers.spread === "yes") add(f, f.value === "excluded" ? "conflict" : "support");
        else if (answers.spread === "no" && f.value === "required") add(f, "conflict");
        break;
      case "newly_diagnosed":
        if (hadAny) add(f, "conflict");
        else if (hadNone) add(f, "support");
        break;
      case "previously_treated":
        if (hadNone) add(f, "conflict");
        else if (hadAny) add(f, "support");
        break;
      case "pregnancy":
        if (answers.pregnant === "yes") add(f, "conflict");
        break;
      case "concurrent_trial":
        if (answers.inAnotherTrial === "yes") add(f, "conflict");
        break;
      default:
        if (f.key.startsWith("biomarker:")) {
          const status = answers.biomarkers[f.key.slice("biomarker:".length) as BiomarkerId];
          if (status === "positive") add(f, f.value === "excluded" ? "conflict" : "support");
          else if (status === "negative" && f.value === "required") add(f, "conflict");
        }
    }
  }
  return notes;
}
