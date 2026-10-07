import type { IntakeAnswers } from "@/lib/types/intake";
import { MinimizedProfileSchema, type AgeBracket, type MinimizedProfile } from "@/lib/types/analysis";

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
 * Build the only profile shape allowed to reach the backend / AI providers.
 * Explicitly copies allowed fields (never spreads the input) and validates with the strict schema.
 * ZIP, travel distance, and exact age are dropped here.
 */
export function minimizeProfile(answers: IntakeAnswers): MinimizedProfile {
  return MinimizedProfileSchema.parse({
    cancerType: answers.cancerType,
    ageBracket: ageToBracket(answers.age),
    spread: answers.spread,
    treatments: [...answers.treatments],
    biomarkers: { ...answers.biomarkers },
    pregnant: answers.pregnant,
    concurrentTrial: answers.inAnotherTrial,
    language: answers.language,
  });
}
