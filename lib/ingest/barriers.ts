import {
  DISABILITY_PATTERNS,
  ENGLISH_ALTERNATIVE,
  ENGLISH_REQUIRED_EXCLUSION,
  ENGLISH_REQUIRED_INCLUSION,
  MEDICAL_REASON,
  UPPER_AGE_LIMIT_THRESHOLD,
} from "@/config/barriers";
import type { Barrier, Criterion, CriterionRef, CriterionSection } from "@/lib/types/trial";

/**
 * Split a criterion into sentences (on ". " / "; " / newlines) so a barrier quote is the exact
 * triggering sentence rather than a whole long criterion. Each returned piece is a verbatim substring.
 */
export function sentences(text: string): string[] {
  return text
    .split(/(?<=[.;])\s+(?=[A-Z(])|\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function firstMatch(section: CriterionSection, list: Criterion[], test: (sentence: string) => boolean): (CriterionRef & { quote: string }) | null {
  for (const c of list) {
    for (const s of sentences(c.text)) if (test(s)) return { section, n: c.n, quote: s };
  }
  return null;
}

export interface BarrierInput {
  inclusion: Criterion[];
  exclusion: Criterion[];
  maxAge: number | null;
  /** Original structured field, e.g. "70 Years", used as the quote for age barriers. */
  maxAgeRaw?: string;
}

/** Detect access barriers. Returns at most one flag per barrier type, each with its exact quote. */
export function detectBarriers(t: BarrierInput): Barrier[] {
  const out: Barrier[] = [];

  const english =
    firstMatch("inclusion", t.inclusion, (s) => ENGLISH_REQUIRED_INCLUSION.some((re) => re.test(s)) && !ENGLISH_ALTERNATIVE.test(s)) ??
    firstMatch("exclusion", t.exclusion, (s) => ENGLISH_REQUIRED_EXCLUSION.some((re) => re.test(s)) && !ENGLISH_ALTERNATIVE.test(s));
  if (english) out.push({ type: "english_required", quote: english.quote, ref: { section: english.section, n: english.n } });

  if (t.maxAge !== null && t.maxAge < UPPER_AGE_LIMIT_THRESHOLD) {
    out.push({ type: "upper_age_limit", quote: `Maximum age: ${t.maxAgeRaw ?? `${t.maxAge} Years`}` });
  }

  const disability = firstMatch("exclusion", t.exclusion, (s) => DISABILITY_PATTERNS.some((re) => re.test(s)) && !MEDICAL_REASON.test(s));
  if (disability) out.push({ type: "disability_exclusion", quote: disability.quote, ref: { section: disability.section, n: disability.n } });

  return out;
}
