import { BIOMARKERS } from "@/config/biomarkers";
import {
  ALLOWED,
  CONCURRENT_TRIAL,
  LOCAL_METASTASES_ONLY,
  METASTATIC,
  NEGATION,
  NEGATIVE_WORDS,
  NEWLY_DIAGNOSED,
  NON_METASTATIC,
  POSITIVE_WORDS,
  PREGNANCY,
  PREVIOUSLY_TREATED,
  PRIOR_CONTEXT,
  THERAPY_PATTERNS,
  TRIPLE_NEGATIVE,
  WASHOUT,
} from "@/config/criteria";
import type { Criterion, CriterionSection, Fact, FactKey, FactValue } from "@/lib/types/trial";

type Candidate = { key: FactKey; value: FactValue };

/** Strength order when one key is found several times: a directional fact beats "mentioned". */
const STRENGTH: Record<FactValue, number> = { required: 2, excluded: 2, mentioned: 1 };

/** Extract rule-layer candidate facts from a single criterion. Pure; exported for tests. */
export function factsForCriterion(section: CriterionSection, text: string): Candidate[] {
  const out: Candidate[] = [];
  const incl = section === "inclusion";

  // Prior treatments. Exclusion: having had it rules you out (unless it's only a washout window).
  for (const [key, re] of Object.entries(THERAPY_PATTERNS) as [keyof typeof THERAPY_PATTERNS, RegExp][]) {
    const m = re.exec(text);
    if (!m || !PRIOR_CONTEXT.test(text)) continue;
    // Negation only counts when it precedes the therapy word closely ("no prior chemotherapy").
    const before = text.slice(Math.max(0, m.index - 40), m.index);
    const negated = NEGATION.test(before) || /na[iï]ve/i.test(text.slice(m.index, m.index + m[0].length + 20));
    if (WASHOUT.test(text) || ALLOWED.test(text)) out.push({ key, value: "mentioned" });
    else if (incl) out.push({ key, value: negated ? "excluded" : "required" });
    else out.push({ key, value: "excluded" });
  }

  // Metastatic disease. Brain/bone-metastasis-only exclusions do not exclude metastatic disease in general.
  if (NON_METASTATIC.test(text)) out.push({ key: "metastatic", value: incl ? "excluded" : "mentioned" });
  else if (METASTATIC.test(text)) {
    if (incl) out.push({ key: "metastatic", value: "required" });
    else if (!LOCAL_METASTASES_ONLY.test(text)) out.push({ key: "metastatic", value: "excluded" });
  }

  if (incl && NEWLY_DIAGNOSED.test(text)) out.push({ key: "newly_diagnosed", value: "required" });
  if (incl && PREVIOUSLY_TREATED.test(text)) out.push({ key: "previously_treated", value: "required" });

  // Pregnancy: exclusion criteria, or inclusion requiring a negative pregnancy test / not pregnant.
  if (PREGNANCY.test(text) && (!incl || /negative|not (be )?pregnant|non-?pregnant/i.test(text))) out.push({ key: "pregnancy", value: "excluded" });

  if (CONCURRENT_TRIAL.test(text)) {
    if (!incl || NEGATION.test(text)) out.push({ key: "concurrent_trial", value: "excluded" });
  }

  // Triple-negative breast cancer required => HER2-positive and HR-positive patients are excluded.
  if (incl && TRIPLE_NEGATIVE.test(text)) {
    out.push({ key: "biomarker:HER2", value: "excluded" }, { key: "biomarker:HR", value: "excluded" });
  }

  // Biomarkers: direction from positive/negative wording near the marker.
  for (const b of BIOMARKERS) {
    const m = b.pattern.exec(text);
    if (!m) continue;
    // The marker's own suffix ("HER2-", "HER2+", "HER2-negative", "EGFR mutation") is decisive;
    // otherwise look at nearby words. This keeps "HR+/HER2-" from reading as HER2-positive.
    const suffix = text.slice(m.index + m[0].length, m.index + m[0].length + 16);
    let pos: boolean;
    let neg: boolean;
    if (m[0].endsWith("+")) {
      pos = true;
      neg = false;
    } else if (m[0].endsWith("-")) {
      pos = false;
      neg = true;
    } else if (/^\s*(\+|-?\s*positive|-?\s*pos\b|amplif|overexpress|mutat|mutant|fusion|rearrang|-?\s*high\b)/i.test(suffix)) {
      pos = true;
      neg = false;
    } else if (/^\s*([-−](?![a-z0-9])|-?\s*negative|-?\s*neg\b|wild|-?\s*low\b|0\b)/i.test(suffix)) {
      pos = false;
      neg = true;
    } else {
      const window = text.slice(Math.max(0, m.index - 30), m.index + m[0].length + 30);
      pos = POSITIVE_WORDS.test(window);
      neg = NEGATIVE_WORDS.test(window);
    }
    let value: FactValue = "mentioned";
    if (pos !== neg) {
      // inclusion+positive => required; inclusion+negative => positive patients excluded;
      // exclusion+positive => excluded; exclusion+negative => negative patients excluded (positive required).
      if (incl) value = pos ? "required" : "excluded";
      else value = pos ? "excluded" : "required";
    }
    if (out.some((o) => o.key === `biomarker:${b.id}`)) continue; // TNBC rule already set it
    out.push({ key: `biomarker:${b.id}`, value });
  }
  return out;
}

/**
 * Rule layer: one fact per key with a verbatim quote and criterion reference.
 * Keeps the first directional occurrence (inclusion before exclusion), else the first mention.
 */
export function extractRuleFacts(inclusion: Criterion[], exclusion: Criterion[]): Fact[] {
  const best = new Map<FactKey, Fact>();
  const scan = (section: CriterionSection, list: Criterion[]) => {
    for (const c of list) {
      for (const cand of factsForCriterion(section, c.text)) {
        const prev = best.get(cand.key);
        if (prev && STRENGTH[prev.value] >= STRENGTH[cand.value]) continue;
        best.set(cand.key, { key: cand.key, value: cand.value, quote: c.text, ref: { section, n: c.n }, source: "rule" });
      }
    }
  };
  scan("inclusion", inclusion);
  scan("exclusion", exclusion);
  return [...best.values()];
}
