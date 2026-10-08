import { BIOMARKERS } from "@/config/biomarkers";
import {
  ALLOWED,
  ALT_HEADER,
  ALTERNATIVE_NEAR,
  CONCURRENT_TRIAL,
  EXAMPLE_CONTEXT,
  LIST_CONTEXT,
  OR_NEAR,
  OTHER_MALIGNANCY,
  OTHER_STAGES,
  UNLESS,
  V2_MARKER_ASSERTED,
  V2_MARKER_PERMISSIVE,
  V2_MARKER_SUBGROUP_AFTER,
  V2_MARKER_TESTING,
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
import type { CancerGroupId } from "@/config/cancer-groups";
import type { Criterion, CriterionSection, Fact, FactKey, FactParam, FactValue } from "@/lib/types/trial";
import { cohortSpecific, diseasePopulationClause, effectiveSection, moreLenient, subPopulationClause, v2FactsForSegment } from "./eligibility-facts";

/** `quote` is set for v2 families (the clause); v1 facts quote the whole criterion. */
/** Biomarkers added in v2 (§1.4): stricter direction rules (no history in v1 tests). */
const V2_BIOMARKERS = new Set<string>(["MET", "RET", "HPV", "CLDN18", "PH", "NPM1", "TP53", "MGMT", "PIK3CA", "ESR1", "PALB2", "KIT"]);

type Candidate = { key: FactKey; value: FactValue; param?: FactParam; quote?: string };

/** Strength order when one key is found several times: a directional fact beats "mentioned". */
const STRENGTH: Record<FactValue, number> = { required: 2, excluded: 2, mentioned: 1 };

/** Split a criterion into clause-level segments so a negation or list in one sentence cannot affect another. */
export function segments(text: string): string[] {
  const guarded = text.replace(/\b(e\.g|i\.e|vs|approx|incl|etc)\./gi, (m) => m.replace(".", "\u0001"));
  return guarded
    .split(/\n+|(?<=[.;?!])\s+(?=[A-Z0-9(\[*\u2022-])|\s+(?=\d{1,2}(?:\.\d{1,2})+\.?\s+[A-Z])|(?<=\S)\s+(?=[*•]\s+\S)/)
    .map((x) => x.replace(/\u0001/g, ".").trim())
    .filter(Boolean);
}

/** Extract rule-layer candidate facts from a single criterion (v1 families; `v2: true` adds the v2 families). Pure; exported for tests. */
export function factsForCriterion(section: CriterionSection, text: string, opts: { v2?: boolean; groups?: readonly CancerGroupId[]; conditions?: readonly string[] } = {}): Candidate[] {
  const best = new Map<FactKey, Candidate>();
  const segs = segments(text);
  // A criterion that opens with a cohort/part header ("Part B:", "Additional criteria for participants with mCRPC:")
  // makes every clause in it cohort-specific.
  const cohort = segs.length > 1 && cohortSpecific(segs[0] ?? "");
  // Clauses under an "one of the following indications:" header are options, not requirements (reset by the next numbered item).
  let alt = false;
  for (const seg of segs) {
    if (/^\s*\d{1,2}[.)]\s/.test(seg) && !ALT_HEADER.test(seg)) alt = false;
    const v2 = opts.v2 ? v2FactsForSegment(section, seg, { groups: opts.groups ?? [], cohort, alt, ...(opts.conditions ? { conditions: opts.conditions } : {}) }) : [];
    const demote = opts.v2 && (cohort || cohortSpecific(seg) || subPopulationClause(section, seg, alt));
    const own = factsForSegment(section, seg, opts.groups ?? []).map((c) => (demote && c.quote !== undefined && c.value !== "mentioned" ? { key: c.key, value: "mentioned" as const, quote: c.quote } : c));
    for (const c of [...own, ...v2]) {
      const prev = best.get(c.key);
      if (!prev || STRENGTH[c.value] > STRENGTH[prev.value] || (STRENGTH[c.value] === STRENGTH[prev.value] && moreLenient(c.key, prev, c))) best.set(c.key, c);
    }
    if (ALT_HEADER.test(seg) && /[:;]\s*$|following/i.test(seg)) alt = true;
  }
  // "History of other malignancy, except for:" followed by an exception list: take the window from the list.
  const om = best.get("other_malignancy");
  if (opts.v2 && om && om.value === "excluded" && om.param === undefined && om.quote) {
    const at = segs.findIndex((x) => x === om.quote);
    if (at >= 0 && /\b(?:except(?:ion|ions)?(?: for| of)?|unless|other than|with the exception of)\s*:?\s*$/i.test(segs[at] as string)) {
      const tail = segs.slice(at + 1, at + 9).join(" ");
      const yr = /\b(?:free|remission|no evidence|diagnosed|treated|treatment|ago|since|prior|years? (?:of|from))\b[^.;]{0,50}?\b(\d{1,2}|one|two|three|four|five|ten)\s*(?:\(\d+\)\s*)?years?\b|\b(\d{1,2}|one|two|three|four|five|ten)\s*years?\b[^.;]{0,40}\b(?:free|remission|no evidence|ago|since|disease)\b/i.exec(tail);
      const n = yr ? Number(yr[1] ?? yr[2]) || ({ one: 1, two: 2, three: 3, four: 4, five: 5, ten: 10 } as Record<string, number>)[(yr[1] ?? yr[2] ?? "").toLowerCase()] : undefined;
      const param: FactParam | undefined = n && n > 0 && n <= 10 ? n : /\b(?:curative|cured|curatively|no evidence of disease|complete remission|NED)\b/i.test(tail) ? "active_only" : undefined;
      if (param !== undefined) best.set("other_malignancy", { ...om, param });
    }
  }
  return [...best.values()];
}

/** True when an unclosed "(" precedes `index`, i.e. the match sits inside a parenthetical. */
function insideParens(text: string, index: number): boolean {
  const before = text.slice(0, index);
  return before.lastIndexOf("(") > before.lastIndexOf(")");
}

function factsForSegment(section: CriterionSection, text: string, groups: readonly CancerGroupId[] = []): Candidate[] {
  const out: Candidate[] = [];
  const incl = section === "inclusion";

  // Prior treatments. Exclusion: having had it rules you out (unless it's only a washout window).
  for (const [key, re] of Object.entries(THERAPY_PATTERNS) as [keyof typeof THERAPY_PATTERNS, RegExp][]) {
    const m = re.exec(text);
    if (!m || !PRIOR_CONTEXT.test(text)) continue;
    // Negation only counts when it precedes the therapy word closely, inside the same clause
    // ("no prior chemotherapy"); the clause starts after the last comma/semicolon/colon.
    const lead = text.slice(Math.max(0, m.index - 60), m.index);
    const clause = lead.slice(Math.max(lead.lastIndexOf(","), lead.lastIndexOf(";"), lead.lastIndexOf(":")) + 1);
    const negated = NEGATION.test(clause) || /na[iï]ve/i.test(text.slice(m.index, m.index + m[0].length + 20));
    const context = EXAMPLE_CONTEXT.test(lead) || insideParens(text, m.index) || UNLESS.test(text);
    if (WASHOUT.test(text) || ALLOWED.test(text) || context) out.push({ key, value: "mentioned" });
    else if (incl) out.push({ key, value: negated ? "excluded" : "required" });
    // Exclusion: "not (yet) treated with X" describes people lacking X, so having had X is not an exclusion.
    else out.push({ key, value: negated ? "mentioned" : "excluded" });
  }

  // Metastatic disease. Brain/bone-metastasis-only exclusions do not exclude metastatic disease in general.
  // Alternatives ("Stage III or IV", "advanced or metastatic", "primary or metastatic") never decide it.
  if (NON_METASTATIC.test(text)) out.push({ key: "metastatic", value: incl ? "excluded" : "mentioned" });
  else {
    const mm = METASTATIC.exec(text);
    if (mm) {
      const near = text.slice(Math.max(0, mm.index - 45), mm.index + mm[0].length + 30);
      // Brain/CNS-only mentions and "may have / allowed" wording say who may join, not that metastatic disease is required.
      const alternative = ALTERNATIVE_NEAR.test(near) || OTHER_STAGES.test(text) || UNLESS.test(text) || (incl && (LOCAL_METASTASES_ONLY.test(text) || ALLOWED.test(text)));
      if (alternative) out.push({ key: "metastatic", value: "mentioned" });
      else if (incl) out.push({ key: "metastatic", value: "required" });
      else if (OTHER_MALIGNANCY.test(text)) out.push({ key: "metastatic", value: "mentioned" });
      else if (!LOCAL_METASTASES_ONLY.test(text)) out.push({ key: "metastatic", value: "excluded" });
    }
  }

  const untreatedWording = NEWLY_DIAGNOSED.test(text);
  if (incl && untreatedWording) out.push({ key: "newly_diagnosed", value: "required" });
  const pt = PREVIOUSLY_TREATED.exec(text);
  if (incl && pt) {
    // "No documented progression ...", "previously untreated ... or recurrent" do not mean "previously treated".
    const lead = text.slice(Math.max(0, pt.index - 40), pt.index);
    if (untreatedWording || NEGATION.test(lead) || ALTERNATIVE_NEAR.test(text.slice(Math.max(0, pt.index - 25), pt.index))) {
      out.push({ key: "previously_treated", value: "mentioned" });
    } else out.push({ key: "previously_treated", value: "required" });
  }

  // Pregnancy: exclusion criteria, or inclusion requiring a negative pregnancy test / not pregnant.
  if (PREGNANCY.test(text) && (!incl || /negative|not (be )?pregnant|non-?pregnant/i.test(text))) out.push({ key: "pregnancy", value: "excluded" });

  if (CONCURRENT_TRIAL.test(text)) {
    if (!incl || NEGATION.test(text)) out.push({ key: "concurrent_trial", value: "excluded" });
  }

  // Triple-negative breast cancer required => HER2-positive and HR-positive patients are excluded.
  // Only when TNBC is the criterion's subject, not one item in a list of tumor types or an "either ... or" option.
  const tn = TRIPLE_NEGATIVE.exec(text);
  const listy = LIST_CONTEXT.test(text);
  if (incl && tn) {
    const tnList = /[,;/]\s*$/.test(text.slice(Math.max(0, tn.index - 4), tn.index)) || /^\s*[,;/]/.test(text.slice(tn.index + tn[0].length, tn.index + tn[0].length + 3));
    const tnAlt = OR_NEAR.test(text.slice(Math.max(0, tn.index - 25), tn.index + tn[0].length + 40)) || /\beither\b/i.test(text);
    if (listy || tnList || tnAlt) out.push({ key: "biomarker:HER2", value: "mentioned" }, { key: "biomarker:HR", value: "mentioned" });
    else out.push({ key: "biomarker:HER2", value: "excluded" }, { key: "biomarker:HR", value: "excluded" });
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
    } else if (/^\s*(\+|-?\s*positive|-?\s*pos\b|amplif|overexpress|mutat|mutant|fusion|rearrang|-?\s*high\b|(promoter |gene )?methylat|-(associated|related|driven|mediated)\b)/i.test(suffix)) {
      pos = true;
      neg = false;
    } else if (/^\s*([-−](?![a-z0-9])|-?\s*negative|-?\s*neg\b|wild|-?\s*low\b|0\b|(promoter |gene )?unmethylat)/i.test(suffix)) {
      pos = false;
      neg = true;
    } else {
      const window = text.slice(Math.max(0, m.index - 30), m.index + m[0].length + 30);
      pos = POSITIVE_WORDS.test(window);
      neg = NEGATIVE_WORDS.test(window);
    }
    let value: FactValue = "mentioned";
    // v2 markers: test-status or permissive wording without a decisive suffix stays "mentioned".
    const decisive = m[0].endsWith("+") || m[0].endsWith("-") || /^\s*(\+|\(\+\)|-?\s*positive|-?\s*negative|amplif|mutat|fusion|rearrang|(promoter )?(un)?methylat|-?\s*high\b|-?\s*low\b)/i.test(suffix);
    // v2 markers offered as one of several alternatives ("MET or RET", lists) are never required/excluded.
    if (V2_BIOMARKERS.has(b.id) && (OR_NEAR.test(text.slice(Math.max(0, m.index - 30), m.index + m[0].length + 30)) || LIST_CONTEXT.test(text) || /,\s*$/.test(text.slice(Math.max(0, m.index - 3), m.index)) || /^\s*,/.test(text.slice(m.index + m[0].length, m.index + m[0].length + 3)))) pos = neg = false;
    // v2 markers: permissive/procedural/conditional wording, specimen-testing text, sub-group clauses and bare list bullets never decide.
    const v2Weak = V2_BIOMARKERS.has(b.id) && (V2_MARKER_PERMISSIVE.test(text) || (V2_MARKER_TESTING.test(text) && !V2_MARKER_ASSERTED.test(text)) || /\bor\s*$/i.test(text.trim()) || diseasePopulationClause(text, { groups }) || /^\s*(?:participants|patients|subjects)\s+with\s+(?:\w+\s+){0,3}(?:cancers?|carcinomas?)\s+(?:will|must|should|are)\b/i.test(text) || (/^\s*[*\u2022]\s/.test(text) && text.trim().split(/\s+/).length <= 6) || (section === "exclusion" && V2_MARKER_SUBGROUP_AFTER.test(text.slice(m.index + m[0].length, m.index + m[0].length + 40))));
    if (v2Weak) pos = neg = false;
    if (V2_BIOMARKERS.has(b.id) && !decisive && (/\b(status|analys[ie]s|testing|tested|test results?|assay|performed|known|may have|regardless|independent of|either|unknown|pending|e\.g|such as|including)\b/i.test(text) || insideParens(text, m.index))) pos = neg = false;
    // In inclusion text a marker offered as one of several options ("A or B", "one of the following cancers") is not required.
    const optional = incl && (listy || OR_NEAR.test(text.slice(Math.max(0, m.index - 20), m.index + m[0].length + 25)));
    if (pos !== neg && !optional) {
      // inclusion+positive => required; inclusion+negative => positive patients excluded;
      // exclusion+positive => excluded; exclusion+negative => negative patients excluded (positive required).
      // v2 markers read inclusion text phrased as an exclusion ("... will be excluded") as an exclusion.
      const inclusionLike = V2_BIOMARKERS.has(b.id) ? effectiveSection(section, text) === "inclusion" : incl;
      if (inclusionLike) value = pos ? "required" : "excluded";
      else value = pos ? "excluded" : "required";
    }
    if (out.some((o) => o.key === `biomarker:${b.id}`)) continue; // TNBC rule already set it
    out.push(V2_BIOMARKERS.has(b.id) ? { key: `biomarker:${b.id}`, value, quote: text } : { key: `biomarker:${b.id}`, value });
  }
  return out;
}

/**
 * Rule layer: one fact per key with a verbatim quote and criterion reference.
 * Keeps the first directional occurrence (inclusion before exclusion), else the first mention.
 */
export function extractRuleFacts(inclusion: Criterion[], exclusion: Criterion[], groups: readonly CancerGroupId[] = [], conditions: readonly string[] = []): Fact[] {
  const best = new Map<FactKey, Fact>();
  const scan = (section: CriterionSection, list: Criterion[]) => {
    for (const c of list) {
      for (const cand of factsForCriterion(section, c.text, { v2: true, groups, conditions })) {
        const prev = best.get(cand.key);
        if (prev && STRENGTH[prev.value] > STRENGTH[cand.value]) continue;
        if (prev && STRENGTH[prev.value] === STRENGTH[cand.value] && !moreLenient(cand.key, prev, cand)) continue;
        // v2 facts quote the clause; it must be a verbatim substring of the criterion (else quote the criterion).
        const quote = cand.quote && c.text.includes(cand.quote) ? cand.quote : c.text;
        best.set(cand.key, { key: cand.key, value: cand.value, quote, ref: { section, n: c.n }, source: "rule", ...(cand.param !== undefined ? { param: cand.param } : {}) });
      }
    }
  };
  scan("inclusion", inclusion);
  scan("exclusion", exclusion);
  return [...best.values()];
}
