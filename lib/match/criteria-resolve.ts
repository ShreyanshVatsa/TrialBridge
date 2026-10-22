/**
 * Deterministic per-criterion resolver. Each split criterion item (lib/ingest/criteria-split.ts) is run
 * through the rule fact extractor ON ITS OWN, and the facts are compared with the patient's questionnaire answers:
 *   inclusion -> "met" | "not_met" | "unknown";  exclusion -> "excluded" | "not_excluded" | "unknown".
 * Only these facts settle an item: age, sex, cancer group/subtype (histology), ECOG, prior lines / treated status,
 * brain metastases, measurable disease, biomarkers, other malignancy and the health-history answers: HIV,
 * hepatitis B/C, organ transplant, donor stem cell transplant, autoimmune disease, kidney/liver/heart disease,
 * pregnancy and another treatment trial (exclusion items only). Everything else stays "unknown" for the LLM judge, and so does:
 *  - any fact whose question was answered "don't know", skipped, deferred or never asked (never "not_met");
 *  - items with a cohort/arm scope, real alternatives ("X or Y") in inclusion, or a time window the answers can't settle;
 *  - positive labels (met / not_excluded) when the item says more than the facts we checked (residual content).
 * Pure and synchronous; no I/O, no LLM.
 */
import { BIOMARKERS, type BiomarkerId } from "@/config/biomarkers";
import { CANCER_GROUPS, type CancerGroupId } from "@/config/cancer-groups";
import { factPolicy } from "@/config/questionnaire/fact-policy";
import { MARKER_QUALIFIER } from "./marker-qualifier";
import { cohortSpecific } from "@/lib/ingest/eligibility-facts";
import { factsForCriterion, preciseTreatedExclusion } from "@/lib/ingest/facts";
import type { SplitCriterion } from "@/lib/ingest/criteria-split";
import { cancerSynonyms, canonicalDrug, canonicalGene } from "@/lib/ingest/synonyms";
import type { CriterionLabel, CriterionLabelValue, TrialCriteriaLabels } from "@/lib/types/criteria";
import { isScopedParam, type FactKey, type FactParam, type FactValue, type TrialCard } from "@/lib/types/trial";
import type { QuestionDef, QuestionnaireState } from "@/lib/types/questionnaire";
import { activeQuestions, isNonResponse, isNonResponseId } from "@/lib/questionnaire/rules";

// ---------------------------------------------------------------------------------------------
// Patient profile: definite answers only, each with the question it came from.
// ---------------------------------------------------------------------------------------------

/** An inclusive numeric range; hi may be Infinity ("3 or more"). */
export type Range = readonly [lo: number, hi: number];

/** What the resolver knows about the patient. A field is absent when the answer is a non-response or not asked. */
export interface ResolverProfile {
  age?: number;
  sex?: "female" | "male";
  group?: CancerGroupId;
  /** Histology ids the patient's cancer is / is not (from the subtype option's catalog effects). */
  histologyIs?: ReadonlySet<string>;
  histologyIsNot?: ReadonlySet<string>;
  /** Extent of disease (solid tumors): the `spread` answer. */
  spread?: "not_spread" | "nearby" | "distant" | "removed";
  /** ECOG band, e.g. "0-1" -> [0, 1]. */
  ecog?: Range;
  /** Prior lines of therapy for this cancer; newly diagnosed / no treatment -> [0, 0]. */
  lines?: Range;
  /** Previously treated with systemic therapy for this cancer. */
  treated?: boolean;
  brainMets?: "none" | "treated_stable" | "active";
  measurable?: boolean;
  otherCancer?: "no" | "over_2y" | "recent";
  // Health history (definite answers only).
  hiv?: "no" | "controlled" | "other";
  hepatitis?: "no" | "hep_b" | "hep_c";
  transplant?: "none" | "organ" | "allo" | "auto";
  autoimmune?: "no" | "yes_inactive" | "yes_active";
  /** Serious organ problems named by a doctor; empty = "none of these". */
  organs?: ReadonlySet<"kidney" | "liver" | "heart">;
  pregnant?: boolean;
  inOtherTrial?: boolean;
  biomarkers?: Readonly<Partial<Record<BiomarkerId, "positive" | "negative">>>;
  /** Profile field -> question ids its value rests on. */
  sources: Readonly<Record<string, readonly string[]>>;
}

const ECOG_BANDS: Record<string, Range> = { "0-1": [0, 1], "2": [2, 2], "3-4": [3, 4] };
const LINE_BANDS: Record<string, Range> = { "1": [1, 1], "2": [2, 2], "3plus": [3, Infinity] };
const SYSTEMIC = new Set(["chemotherapy", "immunotherapy", "targeted_therapy", "hormone_therapy", "stem_cell_transplant"]);

/**
 * Definite answers of the counted questions (applicable and prerequisites holding, as the matcher uses them).
 * Non-responses ("unknown", skip, prefer not, deferred, not tested) leave the field absent.
 */
export function profileFromState(state: QuestionnaireState, catalog: readonly QuestionDef[]): ResolverProfile {
  const sources: Record<string, string[]> = {};
  const note = (field: string, q: string) => {
    const list = (sources[field] ??= []);
    if (!list.includes(q)) list.push(q);
  };
  const p: Mutable<ResolverProfile> = { sources };
  const counted = new Map<string, QuestionDef>(activeQuestions(state, catalog).map((q) => [q.id, q]));
  const a = (id: string) => (counted.has(id) && !isNonResponse(state.answers[id]) ? state.answers[id] : undefined);

  const age = state.answers.age;
  if (typeof age === "number" && Number.isFinite(age)) {
    p.age = age;
    note("age", "age");
  }
  const group = state.answers.cancer_type;
  if (typeof group === "string" && CANCER_GROUPS.some((g) => g.id === group)) {
    p.group = group as CancerGroupId;
    note("group", "cancer_type");
  }
  const sex = a("sex");
  if (sex === "female" || sex === "male") {
    p.sex = sex;
    note("sex", "sex");
  }

  const subtype = a("subtype");
  const eff = typeof subtype === "string" ? counted.get("subtype")?.effects.find((e) => e.option === subtype) : undefined;
  if (eff) {
    const is = new Set<string>();
    const isNot = new Set<string>();
    for (const r of eff.facts) {
      if (!r.fact.startsWith("histology:")) continue;
      const h = r.fact.slice("histology:".length);
      if (r.whenRequired === "support") is.add(h);
      else if (r.whenRequired === "conflict") isNot.add(h);
    }
    if (is.size || isNot.size) {
      p.histologyIs = is;
      p.histologyIsNot = isNot;
      note("histology", "subtype");
    }
  }

  const spread = a("spread");
  if (spread === "not_spread" || spread === "nearby" || spread === "distant" || spread === "removed") {
    p.spread = spread;
    note("spread", "spread");
  }
  const ecog = a("daily_activity");
  if (typeof ecog === "string" && ECOG_BANDS[ecog]) {
    p.ecog = ECOG_BANDS[ecog];
    note("ecog", "daily_activity");
  }

  // Treated status and line count: disease status, treatments and lines must not contradict each other.
  const status = a("disease_status");
  const treatments = a("treatments");
  const lines = a("lines");
  const lineBand = typeof lines === "string" ? LINE_BANDS[lines] : undefined;
  const votes: { treated: boolean; q: string }[] = [];
  if (status === "new") votes.push({ treated: false, q: "disease_status" });
  else if (status === "recurrent" || status === "on_treatment") votes.push({ treated: true, q: "disease_status" });
  if (Array.isArray(treatments) && !treatments.some(isNonResponseId)) {
    if (treatments.length === 1 && treatments[0] === "none") votes.push({ treated: false, q: "treatments" });
    else if (treatments.some((t) => SYSTEMIC.has(t))) votes.push({ treated: true, q: "treatments" });
  }
  if (lineBand) votes.push({ treated: true, q: "lines" });
  const first = votes[0];
  if (first && votes.every((v) => v.treated === first.treated)) {
    p.treated = first.treated;
    for (const v of votes) note("treated", v.q);
    if (!first.treated) {
      p.lines = [0, 0];
      for (const v of votes) note("lines", v.q);
    } else if (lineBand) {
      p.lines = lineBand;
      note("lines", "lines");
    }
  }

  const brain = a("brain_mets");
  if (brain === "none" || brain === "treated_stable" || brain === "active") {
    p.brainMets = brain;
    note("brainMets", "brain_mets");
  }
  const meas = a("measurable");
  if (meas === "yes" || meas === "no") {
    p.measurable = meas === "yes";
    note("measurable", "measurable");
  }
  const other = a("other_cancer");
  if (other === "no" || other === "over_2y" || other === "recent") {
    p.otherCancer = other;
    note("otherCancer", "other_cancer");
  }

  const hiv = a("hiv");
  if (hiv === "no" || hiv === "controlled" || hiv === "other") {
    p.hiv = hiv;
    note("hiv", "hiv");
  }
  const hep = a("hepatitis");
  if (hep === "no" || hep === "hep_b" || hep === "hep_c") {
    p.hepatitis = hep;
    note("hepatitis", "hepatitis");
  }
  const tx = a("transplant");
  if (tx === "none" || tx === "organ" || tx === "allo" || tx === "auto") {
    p.transplant = tx;
    note("transplant", "transplant");
  }
  const auto = a("autoimmune");
  if (auto === "no" || auto === "yes_inactive" || auto === "yes_active") {
    p.autoimmune = auto;
    note("autoimmune", "autoimmune");
  }
  const organs = a("organ_problems");
  if (Array.isArray(organs) && organs.length > 0 && !organs.some(isNonResponseId)) {
    // A multi-select answer: an organ not picked is one the patient does not report.
    p.organs = new Set(organs.filter((o): o is "kidney" | "liver" | "heart" => o === "kidney" || o === "liver" || o === "heart"));
    note("organs", "organ_problems");
  }
  const preg = a("pregnancy");
  if (preg === "yes" || preg === "no") {
    p.pregnant = preg === "yes";
    note("pregnant", "pregnancy");
  } else if (p.sex === "male") {
    p.pregnant = false;
    note("pregnant", "sex");
  }
  const trial = a("in_other_trial");
  if (trial === "yes" || trial === "no") {
    p.inOtherTrial = trial === "yes";
    note("inOtherTrial", "in_other_trial");
  }

  const markers: Partial<Record<BiomarkerId, "positive" | "negative">> = {};
  for (const qid of ["biomarkers", "deep_biomarkers"]) {
    const grid = a(qid);
    if (!grid || typeof grid !== "object" || Array.isArray(grid)) continue;
    for (const [m, v] of Object.entries(grid)) {
      if (v !== "positive" && v !== "negative") continue;
      markers[m as BiomarkerId] = v;
      note(`biomarker:${m}`, qid);
    }
  }
  if (Object.keys(markers).length) p.biomarkers = markers;
  return p;
}

type Mutable<T> = { -readonly [K in keyof T]: T[K] };

// ---------------------------------------------------------------------------------------------
// Fact verdicts
// ---------------------------------------------------------------------------------------------

/** ok = the patient fits this fact; fail = the fact rules the patient out; open = the answers can't tell. */
type Verdict = "ok" | "fail" | "open";
interface Checked {
  key: string;
  verdict: Verdict;
  questions: readonly string[];
}

/**
 * Health-history fact keys, settled from the deep-dive answers, on exclusion items only: inclusion items naming
 * them are conditional ("HIV-infected participants must have controlled HIV", "the donor must be HIV negative").
 * "metastatic" is not here: the rule extractor also fires on brain-metastasis and radiosurgery wording.
 */
const HISTORY_KEYS = ["hiv", "hepatitis_b", "hepatitis_c", "organ_transplant", "allo_sct", "autoimmune", "kidney_disease", "liver_disease", "heart_disease", "pregnancy", "concurrent_trial"] as const;
const isHistoryKey = (k: string) => (HISTORY_KEYS as readonly string[]).includes(k);
/** Fact keys the resolver may settle (docs/dev/QUESTIONNAIRE_SPEC.md §3, plus the health-history keys). */
const ALLOWED_KEYS = new Set<string>(["ecog_max", "min_prior_lines", "max_prior_lines", "previously_treated", "newly_diagnosed", "brain_mets", "measurable_disease", "other_malignancy", ...HISTORY_KEYS]);
const allowedKey = (k: string) => ALLOWED_KEYS.has(k) || k.startsWith("biomarker:") || k.startsWith("histology:");

/** Does the patient HAVE the attribute? true / false / undefined (unknown). */
function hasAttr(key: string, p: ResolverProfile): boolean | undefined {
  const organ = (o: "kidney" | "liver" | "heart") => (p.organs ? p.organs.has(o) : undefined);
  switch (key) {
    case "hiv":
      return p.hiv === undefined ? undefined : p.hiv !== "no";
    // A single-choice answer names one infection; it says nothing about the other one.
    case "hepatitis_b":
      return p.hepatitis === undefined ? undefined : p.hepatitis === "hep_b" ? true : p.hepatitis === "no" ? false : undefined;
    case "hepatitis_c":
      return p.hepatitis === undefined ? undefined : p.hepatitis === "hep_c" ? true : p.hepatitis === "no" ? false : undefined;
    case "organ_transplant":
      return p.transplant === undefined ? undefined : p.transplant === "organ";
    case "allo_sct":
      return p.transplant === undefined ? undefined : p.transplant === "allo";
    case "autoimmune":
      return p.autoimmune === undefined ? undefined : p.autoimmune !== "no";
    case "kidney_disease":
      return organ("kidney");
    case "liver_disease":
      return organ("liver");
    case "heart_disease":
      return organ("heart");
    case "pregnancy":
      return p.pregnant;
    case "concurrent_trial":
      return p.inOtherTrial;
  }
  if (key === "previously_treated") return p.treated;
  if (key === "newly_diagnosed") return p.treated === undefined ? undefined : !p.treated;
  if (key === "measurable_disease") return p.measurable;
  if (key.startsWith("biomarker:")) {
    const s = p.biomarkers?.[key.slice("biomarker:".length) as BiomarkerId];
    return s === undefined ? undefined : s === "positive";
  }
  if (key.startsWith("histology:")) {
    const h = key.slice("histology:".length);
    if (p.histologyIs?.has(h)) return true;
    if (p.histologyIsNot?.has(h)) return false;
    return undefined;
  }
  return undefined;
}

const fromBool = (has: boolean | undefined, value: FactValue): Verdict => (has === undefined ? "open" : (value === "required") === has ? "ok" : "fail");
const inRange = (r: Range | undefined, ok: (lo: number, hi: number) => boolean | undefined): Verdict => {
  if (!r) return "open";
  const v = ok(r[0], r[1]);
  return v === undefined ? "open" : v ? "ok" : "fail";
};

/** Verdict of one extracted fact against the profile. Scoped (time-window) params are always open. */
function checkFact(f: { key: string; value: FactValue; param?: FactParam }, p: ResolverProfile): Verdict {
  if (f.value === "mentioned" || isScopedParam(f.param)) return "open";
  const n = typeof f.param === "number" ? f.param : undefined;
  switch (f.key) {
    case "ecog_max":
      if (f.value !== "required" || n === undefined) return "open";
      return inRange(p.ecog, (lo, hi) => (hi <= n ? true : lo > n ? false : undefined));
    case "min_prior_lines":
      if (f.value !== "required" || n === undefined) return "open";
      return inRange(p.lines, (lo, hi) => (lo >= n ? true : hi < n ? false : undefined));
    case "max_prior_lines":
      if (f.value !== "required" || n === undefined) return "open";
      return inRange(p.lines, (lo, hi) => (hi <= n ? true : lo > n ? false : undefined));
    case "brain_mets": {
      const b = p.brainMets;
      if (!b) return "open";
      if (f.value === "required") return b === "none" ? "fail" : "ok";
      if (f.param === "active_only") return b === "active" ? "fail" : "ok";
      return f.param === undefined ? (b === "none" ? "ok" : "fail") : "open";
    }
    case "other_malignancy": {
      const o = p.otherCancer;
      if (!o || f.value !== "excluded") return "open";
      if (o === "no") return "ok";
      if (f.param === undefined) return "fail";
      if (f.param === "active_only") return o === "over_2y" ? "ok" : "open";
      if (n === undefined) return "open";
      // "over_2y" = treated more than 2 years ago; "recent" = within the last 2 years.
      if (o === "over_2y") return n <= 2 ? "ok" : "open";
      return n >= 2 ? "fail" : "open";
    }
    // Carve-outs the answers settle (catalog effects in config/questionnaire/common.ts use the same params).
    case "hiv":
      if (f.value === "excluded" && f.param === "uncontrolled_only") return p.hiv === undefined ? "open" : p.hiv === "other" ? "fail" : "ok";
      return f.param === undefined ? fromBool(hasAttr(f.key, p), f.value) : "open";
    case "hepatitis_b":
    case "hepatitis_c":
      // "Active hepatitis only": the answer does not say whether the infection is active.
      if (f.param === "active_only") return hasAttr(f.key, p) === false ? "ok" : "open";
      return f.param === undefined ? fromBool(hasAttr(f.key, p), f.value) : "open";
    case "autoimmune":
      if (f.value === "excluded" && f.param === "active_only") return p.autoimmune === undefined ? "open" : p.autoimmune === "yes_active" ? "fail" : "ok";
      return f.param === undefined ? fromBool(hasAttr(f.key, p), f.value) : "open";
    default:
      if (!allowedKey(f.key)) return "open";
      // A carve-out param the answers do not model ("controlled", "within 5 years", ...) keeps a history fact open.
      if (f.param !== undefined && isHistoryKey(f.key)) return "open";
      return fromBool(hasAttr(f.key, p), f.value);
  }
}

const SOURCE_FIELD: Record<string, string> = {
  ecog_max: "ecog",
  min_prior_lines: "lines",
  max_prior_lines: "lines",
  previously_treated: "treated",
  newly_diagnosed: "treated",
  brain_mets: "brainMets",
  measurable_disease: "measurable",
  other_malignancy: "otherCancer",
  hiv: "hiv",
  hepatitis_b: "hepatitis",
  hepatitis_c: "hepatitis",
  organ_transplant: "transplant",
  allo_sct: "transplant",
  autoimmune: "autoimmune",
  kidney_disease: "organs",
  liver_disease: "organs",
  heart_disease: "organs",
  pregnancy: "pregnant",
  concurrent_trial: "inOtherTrial",
};
const sourcesOf = (key: string, p: ResolverProfile): readonly string[] => p.sources[key.startsWith("histology:") ? "histology" : (SOURCE_FIELD[key] ?? key)] ?? [];

// ---------------------------------------------------------------------------------------------
// Item-level checks the fact extractor does not cover: age, sex, cancer type
// ---------------------------------------------------------------------------------------------

const AGE_CONTEXT = /\bage[ds]?\b|\byears? old\b|\byrs? old\b|\bof age\b/i;
const AGE_NOT_PATIENT = /\bdiagnos|\bonset\b|\bat (?:the )?time of\b|\bchild(?:ren)?'s\b|\bpartner|\bparent|\blife expectancy\b|\bbone age\b|\bgestational\b|\bfor age\b|\bage[- ](?:adjusted|appropriate|specific|related|matched)|\(\s*\d+\s*-\s*age\b|\bif\b|\bmay\b|\ballowed\b|\bpermitted\b|\beligible\b|\bunless\b|\bexcept\b|\bage\s*(?:[<>]=?|[\u2264\u2265]|=<|>=)\s*\d+\s*(?:years?)?\s*:|\b(?:patients?|participants?|subjects?)\s+(?:who are\s+)?(?:aged?\s*)?(?:[<>]=?|[\u2264\u2265]|over|under|older|younger)\s*(?:than\s+)?(?:the age of\s+)?\d+[^.;]{0,30}\b(?:must|should|need|will|are|have)\b|\bQTc?\b|\bweight\b|\bBMI\b|\bcreatinine\b|\bbilirubin\b|\bULN\b/i;
/** The item is about age (not a lab threshold or a list that mentions age in passing). */
const AGE_LEAD = /^\W*(?:[a-z]\.\s*|\d+\.\s*)?(?:current\s+)?(?:(?:adult|pediatric|male|female|men|women|male or female|female or male|male and female)\s+)?(?:patients?|participants?|subjects?|individuals?|persons?|people|adults?|children|women|men)?\s*(?:must|should|need to|who are|that are|is|are)?\s*(?:be\s+)?(?:aged?|ages|age of|age range|between|[<>]=?|[\u2264\u2265]|=<|=>|\d|less than|greater than|more than|under|over|older than|younger than|at least|minimum age)/i;

/** Age bounds stated by an item, or null. Exported for tests. */
export function parseAgeBounds(text: string): { min?: number; minStrict?: boolean; max?: number; maxStrict?: boolean } | null {
  if (!AGE_CONTEXT.test(text) || AGE_NOT_PATIENT.test(text)) return null;
  const t = text.replace(/≥/g, ">=").replace(/≤/g, "<=");
  const out: { min?: number; minStrict?: boolean; max?: number; maxStrict?: boolean } = {};
  const ranges = [...t.matchAll(/\b(\d{1,3})\s*(?:-|–|to|and)\s*(\d{1,3})\s*(?:years?|yrs?)\b/gi)];
  if (ranges.length > 1) return null; // several ranges ("2 to 17 years for X, 2 to 21 years for Y"): per-group rules
  const range = ranges[0];
  if (range && /\bbetween\b|\baged?\b|\bages\b|-|–|\bto\b/i.test(t)) return { min: Number(range[1]), max: Number(range[2]) };
  const min =
    /(?:>=|=>|\bat least|\bminimum(?: age)?(?: of)?|\baged?\s*>=)\s*(\d{1,3})\s*(?:years?|yrs?)?/i.exec(t) ??
    /\b(\d{1,3})\s*(?:years?|yrs?)(?:\s+of\s+age)?(?:\s+old)?\s*(?:or|and)\s*(?:older|above|over|greater)\b/i.exec(t);
  const minStrict = /(?:>(?!=)|\bolder than|\bover|\bgreater than|\bmore than)\s*(\d{1,3})\s*(?:years?|yrs?)?/i.exec(t);
  if (min) out.min = Number(min[1]);
  else if (minStrict && !/\bor\s+(?:equal|older)/i.test(t)) [out.min, out.minStrict] = [Number(minStrict[1]), true];
  const max = /(?:<=|=<|\bup to|\bmaximum(?: age)?(?: of)?|\bno older than|\bnot older than)\s*(\d{1,3})\s*(?:years?|yrs?)?/i.exec(t) ?? /\b(\d{1,3})\s*(?:years?|yrs?)(?:\s+of\s+age)?\s*or\s*(?:younger|less|under)\b/i.exec(t);
  const maxStrict = /(?:<(?!=)|\byounger than|\bunder|\bless than)\s*(\d{1,3})\s*(?:years?|yrs?)/i.exec(t);
  if (max) out.max = Number(max[1]);
  else if (maxStrict) [out.max, out.maxStrict] = [Number(maxStrict[1]), true];
  return out.min !== undefined || out.max !== undefined ? out : null;
}

function checkAge(text: string, p: ResolverProfile, section: SplitCriterion["section"]): Checked | null {
  if (!AGE_LEAD.test(text.trim()) && !/^\W*(?:age|aged)\b/i.test(text.trim())) return null;
  const b = parseAgeBounds(text);
  if (!b) return null;
  if (p.age === undefined) return { key: "age", verdict: "open", questions: [] };
  const a = p.age;
  const okMin = b.min === undefined || (b.minStrict ? a > b.min : a >= b.min);
  const okMax = b.max === undefined || (b.maxStrict ? a < b.max : a <= b.max);
  // An exclusion states who is ruled out ("Age < 18"): being inside its bounds is the failure.
  const inside = okMin && okMax;
  return { key: "age", verdict: inside === (section === "inclusion") ? "ok" : "fail", questions: p.sources.age ?? [] };
}

const SEX_ITEM = /^(?:(?:patients?|participants?|subjects?|must be|be)\s+)*(?:(female|women|woman)|(male|men|man)|(?:male|men)\s+(?:or|and|and\/or)\s+(?:female|women)|(?:female|women)\s+(?:or|and|and\/or)\s+(?:male|men))(?:\s+(?:patients?|participants?|subjects?))?(?:\s+only)?(?:\s+(?:aged?|>=|≥|\d).*)?[.;]?$/i;

function checkSex(text: string, p: ResolverProfile, section: SplitCriterion["section"]): Checked | null {
  const m = SEX_ITEM.exec(text.trim());
  if (!m) return null;
  if (!p.sex) return { key: "sex", verdict: "open", questions: [] };
  const named = m[1] ? "female" : m[2] ? "male" : null;
  if (section === "exclusion") return named === null ? null : { key: "sex", verdict: named === p.sex ? "fail" : "ok", questions: p.sources.sex ?? [] };
  return { key: "sex", verdict: named === null || named === p.sex ? "ok" : "fail", questions: p.sources.sex ?? [] };
}

/** Name patterns per cancer group, expanded with NCIt cancer-type synonyms of the group's label. */
const groupTerms = (() => {
  const cache = new Map<CancerGroupId, RegExp[]>();
  return (g: CancerGroupId): RegExp[] => {
    const hit = cache.get(g);
    if (hit) return hit;
    const def = CANCER_GROUPS.find((x) => x.id === g);
    const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const syn = def ? [def.label, ...def.synonyms].flatMap((t) => [t, ...cancerSynonyms(t)]).filter((t) => t.length >= 5) : [];
    const out = [...(def?.text ?? []), ...syn.map((t) => new RegExp(`\\b${esc(t)}\\b`, "i"))];
    cache.set(g, out);
    return out;
  };
})();

/** "Histologically confirmed <patient's cancer>": met when the item names only the patient's own cancer group. */
function checkCancerType(text: string, p: ResolverProfile, trialGroups: readonly CancerGroupId[]): Checked | null {
  if (!p.group || p.group === "other" || p.group === "solid-tumors") return null;
  if (!/\b(cancer|carcinoma|adenocarcinoma|tumou?r|neoplasm|malignan|lymphoma|leuk[a]?emia|myeloma|melanoma|sarcoma|glioma|glioblastoma|nsclc|sclc|hcc|rcc|dlbcl|aml|cll)\b/i.test(text)) return null;
  // Brain/bone/CNS metastases name a site of spread, not the cancer type.
  const clean = text.replace(/\b(brain|cns|central nervous system|bone|liver|leptomeningeal|spinal)\s+metasta\w*/gi, " ");
  const named = (g: CancerGroupId) => groupTerms(g).some((re) => re.test(clean));
  if (!named(p.group)) return null;
  const others = CANCER_GROUPS.filter((g) => g.id !== p.group && g.id !== "other" && g.id !== "solid-tumors" && named(g.id));
  if (others.length > 0 || !trialGroups.includes(p.group)) return null;
  return { key: "cancer_type", verdict: "ok", questions: p.sources.group ?? [] };
}

// ---------------------------------------------------------------------------------------------
// Extent of disease (the `spread` answer) and treatment history (disease status, treatments, lines)
// ---------------------------------------------------------------------------------------------

/** Metastases named by site are a finding, not the extent of disease; a treatment's setting is not the patient's stage. */
const STAGE_NOISE = [
  /\b(?:brain|cns|central nervous system|leptomeningeal|spinal|spinal cord|bone|liver|lung|hepatic|pulmonary|nodal|lymph node|peritoneal|skin|cutaneous|osseous|visceral|extracranial|intracranial)(?:[- ]only)?[- ](?:only\s+)?metasta\w*/gi,
  /\bmetasta\w*\s+(?:to|in|of|involving)\s+(?:the\s+)?(?:brain|cns|central nervous system|bones?|spine|spinal cord|liver|lungs?|leptomeninges|lymph nodes?|skin)\b/gi,
  /\b(?:in|for)\s+(?:the\s+|their\s+)?(?:\w+[- ])?(?:metastatic|advanced|recurrent|adjuvant|neo-?adjuvant|locally advanced|unresectable|curative|palliative|first[- ]line|1L|2L)\s+(?:disease\s+)?setting\b/gi,
  /\b(?:therap\w*|treatments?|treated|chemotherapy|immunotherapy|endocrine|hormonal|regimens?|lines?|cycles?|doses?|courses?|agents?|drugs?|surgery|radiation|radiotherapy|SoC|standard of care|received|receipt of|given|administered)\s+(?:for|in|of|as)\s+(?:the\s+|their\s+)?(?:\w+\s+){0,3}?(?:metastatic|advanced|recurrent|unresectable|locally advanced|early[- ]stage|localized)\b(?:\s+(?:disease|cancer|tumou?rs?|setting|\w+))?/gi,
  /\bhistory of\s+(?:\w+\s+){0,2}(?:metasta\w*)/gi,
];
const STAGE_MET = /\bmetastatic\b|\bstage\s*(?:iv|4)[a-c]?\b|\bdistant\s+(?:metasta\w*|disease|spread)|\bM1[a-c]?\b/i;
const STAGE_NON_MET = /\bnon-?metastatic\b|\bno (?:evidence of |known |clinical or radiographic evidence of )?(?:distant )?metasta\w*|\bwithout (?:distant )?metasta\w*|\bM0\b|\bnegative for (?:any )?(?:distant )?metasta\w*|\babsence of (?:distant )?metasta\w*|\b(?:must not|cannot|may not|should not|do not|does not|not)\s+(?:have|had|be|present with)\s+(?:\w+\s+){0,4}?(?:metastatic|stage\s*(?:iv|4)\b|distant)/i;
/** The stage word describes something else: pain from metastases, a subgroup's own rule, a lesion site. */
const STAGE_OTHER_ROLE = /\b(?:due to|secondary to|from|related to|caused by|pain|symptoms?|complications?|lesions? (?:of|in)|biopsy of|sites? of)\s+(?:\w+\s+){0,2}?(?:metastatic|metasta\w*|stage\s*(?:iv|4))\b/i;
/** An exclusion item that is about the extent of disease itself, not a long rule that mentions it. */
const STAGE_EXCLUSION_HEAD = /^\W*(?:[A-Za-z0-9 /-]{2,40}:\s*)?(?:(?:known|documented|definitive|clinical or radiologic(?:al)? evidence of|evidence of|presence of|history of|current|patients? with|participants? with|subjects? with|has|have|having|diagnosis of|confirmed)\s+)*(?:(?:\w+[- ]){0,3}?)(?:metastatic|stage\s*(?:iv|4)[a-c]?|distant metasta\w*|M1[a-c]?)\b[^.;:]{0,60}[.;]?\s*$/i;
const STAGE_ADVANCED = /\blocally advanced\b|\badvanced\b|\bunresectable\b|\binoperable\b|\bnot amenable to (?:curative |surgical )?(?:resection|surgery|local therapy)/i;
const STAGE_EARLY = /\bearly[- ]stage\b|\blocali[sz]ed\b|\bstage\s*(?:0|i{1,3}|[1-3])[a-c]?\b/i;
/** The stage words belong to a resection or adjuvant context ("completely resected stage II"), where `removed` patients fit. */
const STAGE_RESECTED = /\bresect|\badjuvant\b|\bafter (?:definitive )?surgery\b|\bpost-?operative\b|\bno evidence of (?:residual )?disease\b|\bNED\b/i;

/**
 * Extent of disease stated by the item against the `spread` answer. Only the plain cases are settled: metastatic /
 * stage IV / distant disease, non-metastatic, advanced or unresectable, and early-stage / stage I-III wording that does
 * not also offer stage IV. Site-specific metastases and treatment settings are ignored (STAGE_NOISE).
 */
function checkStage(text: string, p: ResolverProfile, section: SplitCriterion["section"]): Checked | null {
  if (SUBGROUP_RULE.test(text) || STAGE_OTHER_ROLE.test(text)) return null;
  let t = text;
  for (const re of STAGE_NOISE) t = t.replace(re, " ");
  if (section === "exclusion" && !STAGE_EXCLUSION_HEAD.test(t)) return null;
  const nonMet = STAGE_NON_MET.test(t);
  // "No metastatic disease" is a non-metastatic statement, not a metastatic one.
  const met = STAGE_MET.test(t.replace(new RegExp(`${STAGE_NON_MET.source}(?:\\s*\\([^)]*\\))?`, "gi"), " "));
  const advanced = STAGE_ADVANCED.test(t);
  const early = STAGE_EARLY.test(t);
  if (!met && !nonMet && !advanced && !early) return null;
  const open = (): Checked => ({ key: "stage", verdict: "open", questions: [] });
  const sp = p.spread;
  if (!sp) return open();
  const q = p.sources.spread ?? [];
  const out = (verdict: Verdict): Checked => ({ key: "stage", verdict, questions: q });
  if (section === "exclusion") {
    // "Metastatic disease", "stage IV": excluded for distant spread; anything else stays open.
    if (met && !nonMet && !early) return out(sp === "distant" ? "fail" : "ok");
    return open();
  }
  if (met && nonMet) return open(); // "metastatic or non-metastatic"
  if (nonMet) return out(sp === "distant" ? "fail" : "ok");
  if (met) {
    if (early && !advanced) return open(); // "stage I-IV", "any stage"
    if (sp === "distant") return out("ok");
    if (sp === "nearby") return out(advanced || /\bstage\s*(?:iii|3)\b/i.test(t) ? "ok" : "fail");
    if (sp === "removed") return STAGE_RESECTED.test(t) ? open() : out("fail");
    return out("fail");
  }
  if (advanced) {
    if (sp === "distant" || sp === "nearby") return out("ok");
    if (sp === "not_spread") return out("fail");
    return open();
  }
  // Early-stage wording only.
  if (sp === "distant") return out("fail");
  if (sp === "not_spread") return out("ok");
  return open();
}

/** "newly diagnosed", "previously untreated", "no prior systemic therapy": the item wants an untreated patient. */
const UNTREATED_REQUIRED = /\b(?:newly diagnosed|previously untreated|treatment[- ]na[iï]ve|therapy[- ]na[iï]ve|untreated|no (?:prior|previous) (?:systemic |anti-?cancer )?(?:therapy|treatment)|not (?:have )?(?:previously )?(?:received|had|been treated with) (?:any )?(?:prior |previous )?(?:systemic |anti-?cancer )?(?:therapy|treatment))\b/i;
/** Wording that makes a treatment-history item about one class, drug, toxicity or count rather than "any treatment". */
const TREATMENT_SPECIFIC = /\banti-?(?:[A-Z]|\w+-)|\b(?:chemotherap\w*|immunotherap\w*|targeted|endocrine|hormon\w*|radiat\w*|radiotherap\w*|ADCs?|antibod\w*|inhibit\w*|agents?|directed|specific|toxicit\w*|recover\w*|unresolved|adverse|investigational|vaccine|transplant\w*|CAR-?T|cell therap\w*|degrader|conjugate|platinum|taxane|anthracycline|maintenance|consolidation|intervening|study (?:drug|treatment)|\d+\s*(?:lines?|regimens?)|(?:one|two|three|four|five)\s*(?:lines?|regimens?)|lines? of|regimens?)\b/i;
/** Plain "any prior systemic therapy" exclusion wording. */
const PRIOR_SYSTEMIC_EXCLUSION = /\b(?:any|prior|previous|received|receipt of)\s+(?:prior\s+|previous\s+)?(?:systemic|anti-?cancer|anti-?neoplastic)\s+(?:anti-?cancer\s+)?(?:therapy|therapies|treatments?)\b|\bprior (?:systemic )?(?:therapy|treatment) (?:for|in)\b/i;
/** "relapsed or refractory", "progressed on prior therapy", "after at least one prior line": the item wants a treated patient. */
const TREATED_REQUIRED = /\b(?:relapsed|refractory|previously treated|pre-?treated|progress(?:ed|ion|ing) (?:on|after|following|during|despite)|failed|failure of|intolerant to|after (?:at least )?(?:one|1|two|2|three|3|\d+) (?:or more )?(?:prior |previous )?(?:lines?|regimens?|therap)|at least (?:one|1|two|2|three|3|\d+) (?:prior |previous )?(?:lines?|regimens?|systemic))\b/i;
/** The treatment history is counted in one setting ("for metastatic disease", "in the recurrent setting"). */
const SETTING_QUALIFIED = /\b(?:for|in)\s+(?:the\s+|their\s+)?(?:\w+[- ]){0,3}?(?:metastatic|advanced|recurrent|unresectable|inoperable|locally advanced|relapsed)\b/i;

/** Lines of therapy received after progression, when the answers say so (newly diagnosed = 0). */
function priorLines(p: ResolverProfile): Range | undefined {
  return p.lines;
}

/**
 * Treated-status verdict for one item, from the questionnaire's treated flag and line count. The rule families behind
 * these keys are below the precision gate on whole-trial facts, so only items whose own wording is unambiguous are
 * settled here: a plain "untreated required" or "treated required" statement (inclusion) or a plain "prior therapy"
 * exclusion, with no carve-out, no option wording and nothing addressed to a subgroup. A setting qualifier ("for
 * metastatic disease") is answered by the line count after progression, not by the treated flag.
 */
function checkTreated(text: string, p: ResolverProfile, section: SplitCriterion["section"]): Checked | null {
  if (CARVE_OUT.test(text) || PERMISSIVE_ITEM.test(text) || UNTREATED_NON_CANCER.test(text) || SUBGROUP_RULE.test(text)) return null;
  const untreated = UNTREATED_REQUIRED.test(text);
  const treated = TREATED_REQUIRED.test(text);
  const lines = priorLines(p);
  const q = [...(p.sources.treated ?? []), ...(p.sources.lines ?? [])];
  const out = (verdict: Verdict): Checked => ({ key: "treated", verdict, questions: q });
  const specific = TREATMENT_SPECIFIC.test(text) || mentionsDrug(text);
  if (section === "inclusion") {
    if (untreated === treated) return null; // neither, or both ("relapsed or newly diagnosed")
    if (untreated) {
      // "No prior therapy with CDK4/6 inhibition" is about one class: not settled by the treated flag.
      if (specific && !/\b(?:newly diagnosed|previously untreated|treatment[- ]na[iï]ve)\b/i.test(text)) return null;
      if (SETTING_QUALIFIED.test(text)) return lines ? out(lines[0] >= 1 ? "fail" : "ok") : out("open");
      return p.treated === undefined ? out("open") : out(p.treated ? "fail" : "ok");
    }
    return p.treated === undefined ? out("open") : out(p.treated ? "ok" : "fail");
  }
  // Exclusion: plain "any prior systemic therapy (for metastatic disease)" excludes a treated patient; anything about
  // a class, a named drug, a count, toxicity or a washout window is not settled here.
  if (!PRIOR_SYSTEMIC_EXCLUSION.test(text) || specific || /\bwithin\b|\bwash-?out\b/i.test(text)) return null;
  if (SETTING_QUALIFIED.test(text)) return lines ? out(lines[0] >= 1 ? "fail" : "ok") : out("open");
  return p.treated === undefined ? out("open") : out(p.treated ? "fail" : "ok");
}

// ---------------------------------------------------------------------------------------------
// Item shape: windows, alternatives, residual content
// ---------------------------------------------------------------------------------------------

/**
 * "within 28 days prior to randomization", "performed within 7 days before registration": when the test is done, not
 * when something happened to the patient. Removed before the time-window check.
 */
const ASSESSMENT_WINDOW = /\b(?:ECOG|performance status|Zubrod|Karnofsky|evaluation|assessment|assessed|performed|obtained|documented|measured|evaluated|laboratory|labs?|scans?|imaging|tests?|tested|testing)\b[^.;]{0,60}?within\s+(?:the\s+)?\d+\s+(?:days?|weeks?)\s+(?:prior to|before|of|preceding)\s+(?:the\s+)?(?:date of\s+|first\s+|start of\s+|initiation of\s+)?(?:randomi[sz]ation|registration|enrol?lment|allocation|study entry|screening|study treatment|study drug|treatment start|dosing|first dose|cycle 1|C1D1|baseline|protocol therapy|study (?:entry|start))\b/gi;
/** "Stage IV Breast Cancer:" names the disease the item is about, not a study stage (cohort). */
const STAGE_LABEL = /^\W*stage\s*(?:iv|4|i{1,3}|[1-3])[a-c]?\s+(?:\w+\s+){0,3}?(?:cancer|carcinoma|disease|tumou?rs?|nsclc|sclc|melanoma|lymphoma|myeloma|sarcoma)\s*:\s*/i;
/**
 * Pairs the whole-item extractor would read as options although they name one attribute ("advanced or metastatic",
 * "histologically or cytologically confirmed"): collapsed to one word in the text the extractor sees.
 */
const EXTRACT_COLLAPSE: [RegExp, string][] = [
  [/\b(?:locally advanced|locally recurrent|advanced|unresectable|inoperable|incurable|recurrent)\b(?:\s*(?:,|\/|or|and\/or|and)\s*(?:locally advanced|locally recurrent|advanced|unresectable|inoperable|incurable|recurrent)\b)*\s*(?:,|\/|or|and\/or|and)\s*metastatic\b/gi, "metastatic"],
  [/\bmetastatic\b\s*(?:,|\/|or|and\/or|and)\s*(?:locally advanced|locally recurrent|advanced|unresectable|inoperable|incurable|recurrent)\b(?:\s*(?:,|\/|or|and\/or|and)\s*(?:locally advanced|locally recurrent|advanced|unresectable|inoperable|incurable|recurrent)\b)*/gi, "metastatic"],
  [/\b(histologic(?:al)?ly|histopathologic(?:al)?ly|cytologic(?:al)?ly|pathologic(?:al)?ly)\s*(?:,\s*\w+\s*,?\s*)?(?:,?\s*(?:or|and\/or|and)\s*(?:histologic|histopathologic|cytologic|pathologic|radiographic|radiologic|clinical)\w*)+/gi, "$1"],
];
/** "STEP 1: REGISTRATION (SCREENING):", "REGISTRATION ELIGIBILITY CRITERIA (STEP 1)": the registration step of every participant, not a cohort. */
const REGISTRATION_HEADER = /^\W*(?:step\s*\d+\s*[:\-]?\s*)?(?:registration|screening|pre-?registration|eligibility)\s*(?:\((?:screening|step\s*\d+)\))?\s*(?:eligibility\s*)?(?:criteria)?\s*(?:\(step\s*\d+\))?\s*:\s*/i;
const TIME_WINDOW = /\bwithin\s+(?:the\s+)?(?:(?:last|past|previous|prior)\s+)?(?:\d+|one|two|three|four|five|six|eight|twelve)\b|\b(?:in|during)\s+the\s+(?:last|past|previous|prior)\s+(?:\d+|one|two|three|four|five|six|twelve)?\s*(?:days?|weeks?|months?|years?)\b|\b\d+\s*(?:days?|weeks?|months?|half-lives)\s+(?:prior|before|of|after|since)\b|\bwash-?out\b|\blast dose\b|(?:>=|\u2265|at least)\s*\d+\s*(?:days?|weeks?|months?)\b/i;

/** "or" forms that are not alternatives between criteria: number ranges, comparators, method pairs, sex pairs. */
const BENIGN_OR = [
  /\b\d+(?:\.\d+)?\s*(?:,\s*\d+\s*,?\s*)?(?:or|and\/or)\s*\d+(?:\.\d+)?\b/gi,
  // Stage lists ("stage I or II", "stages IIIB/IIIC or IV") name a range of one attribute.
  /\bstages?\s*(?:0|i{1,3}|iv|[1-4])[a-c]?(?:\s*(?:,|\/|or|and\/or|and|-|–|to)\s*(?:stages?\s*)?(?:0|i{1,3}|iv|[1-4])[a-c]?\b)+/gi,
  /\b(?:equal to|greater than|less than|more than|fewer than|higher than|lower than|older|younger|above|below|at least)\s+(?:or|and\/or)\s+/gi,
  /\b(?:or|and\/or)\s+(?:equal|older|younger|greater|less|more|above|below|higher|lower|over|under)\b/gi,
  /\b(?:histologic(?:al)?ly|histopathologic(?:al)?ly|cytologic(?:al)?ly|pathologic(?:al)?ly|radiographic(?:al)?ly|radiologic(?:al)?ly|clinically)\s*(?:,\s*\w+\s*,?\s*)?(?:,?\s*(?:or|and\/or|and)\s*(?:histologic|histopathologic|cytologic|pathologic|radiographic|radiologic|clinical)\w*)+/gi,
  /\b(?:on|during|prior to|before|at)\s+or\s+(?:after|following|during|within|after)\b/gi,
  /\b(?:receiving|be receiving|is receiving|are receiving)\s+or\s+(?:plans?|planning|intend\w*|scheduled|about)\s+to\b/gi,
  /\b(?:male|men|female|women)\s+(?:or|and\/or)\s+(?:male|men|female|women)\b/gi,
  /\b(?:ECOG|Eastern Cooperative Oncology Group)\b[^.;]{0,40}?\b(?:or|and\/or)\b/gi,
  /\b(?:BRCA ?1|BRCA)\s*(?:or|and\/or|\/)\s*BRCA ?2\b/gi,
  /\b(?:IDH ?1)\s*(?:or|and\/or|\/)\s*IDH ?2\b/gi,
  /\b(?:ER|estrogen receptor)\s*(?:and\/or|or|\/)\s*(?:PR|progesterone receptor)\b/gi,
  // Specimen, disease-extent and test-method pairs describe how or where, not a second criterion.
  /\b(?:tissue|blood|plasma|serum|archival|fresh|liquid)\s+(?:biopsy\s+)?(?:or|and\/or)\s+(?:tissue|blood|plasma|serum|archival|fresh|liquid)\b/gi,
  /\b(?:locally advanced|locally recurrent|advanced|metastatic|unresectable|inoperable|incurable|recurrent|stage\s*(?:iv|4|iii|3)[a-c]?)\b(?:\s*(?:,|\/|or|and\/or|and)\s*(?:locally advanced|locally recurrent|advanced|metastatic|unresectable|inoperable|incurable|recurrent|stage\s*(?:iv|4|iii|3)[a-c]?)\b)+/gi,
  // Disease-status pairs ("relapsed or refractory"), histology-inclusive pairs ("squamous or non-squamous") and
  // testing-site pairs ("local or central") describe one state or one method, not two criteria.
  /\b(?:relapsed|relapsing|recurrent|refractory|progressive|progressed|persistent|resistant)\s*(?:\/|,|or|and\/or|and)\s*(?:relapsed|relapsing|recurrent|refractory|progressive|progressed|persistent|resistant)\b/gi,
  /\b(?:squamous|non-?squamous|nonsquamous)\s+(?:or|and\/or|and)\s+(?:squamous|non-?squamous|nonsquamous)\b/gi,
  /\b(?:local|central|locally|centrally)\s+(?:or|and\/or)\s+(?:local|central|locally|centrally)\b/gi,
  /\b(?:IHC|ISH|FISH|NGS|PCR)\s*(?:\/|or|and\/or)\s*(?:IHC|ISH|FISH|NGS|PCR)\b/gi,
  /\b(?:surgical resection|surgery|resection)\s+(?:or|and\/or)\s+(?:radiation(?: therapy)?|radiotherapy)\b/gi,
  // One excluding condition named two ways, or two infections both settled by one answer.
  /\b(?:pregnant|pregnancy)\s*(?:,\s*)?(?:or|and\/or|\/)\s*(?:(?:are|is)\s+)?(?:breast-?\s?feeding|lactating|nursing)\b/gi,
  /\b(?:hepatitis\s*B|HBV)\s*(?:,\s*)?(?:or|and\/or|\/)\s*(?:hepatitis\s*)?(?:C|HCV)\b/gi,
  /\b(?:FISH|IHC|NGS|PCR|ctDNA|cfDNA|CISH)\b[^.;]{0,60}?\b(?:or|and\/or)\s*(?:\(\d\)\s*)?(?:a |an |the )?(?:fluorescence|immuno\w*|next|tissue|circulating|cell-free|cfDNA|ctDNA|FISH|IHC|NGS|PCR|CISH|blood|plasma|polymerase|sequencing|in situ)/gi,
];
/**
 * Definitions and asides that are not criteria of their own: bracketed and parenthetical text ("(ER and/or PR >1%)"),
 * and sub-bullets that define a term ("HER2 negativity is defined as either of the following").
 */
const DEFINITION_LINE = /^\s*[-*\u2022]\s+[^\n]*\b(?:defined as|is defined|are defined|will be defined|definition of|will be included|is considered|are considered)\b[^\n]*$/gim;
export function stripDefinitions(text: string): string {
  let t = text.replace(/\[[^\]]*\]/g, " ");
  for (let i = 0; i < 3; i++) t = t.replace(/\([^()]*\)/g, " ");
  return t.replace(DEFINITION_LINE, " ");
}

/** True when the item offers alternatives that a fact-by-fact check would misread. Exported for tests. */
export function hasAlternatives(text: string): boolean {
  let t = text;
  for (const re of BENIGN_OR) t = t.replace(re, " ");
  t = stripDefinitions(t);
  for (const re of BENIGN_OR) t = t.replace(re, " ");
  return /\b(?:or|and\/or|either|one of the following|any of the following|at least one of)\b/i.test(t);
}

/** Words that carry no criterion content of their own. */
const FILLER = new Set(
  "a an the of to in on for with without by at as and is are be been being must should will have has had having patients patient participants participant subjects subject who which that this these those any all no not none known documented confirmed histologically cytologically pathologically diagnosis diagnosed evidence history prior previous previously current currently presence present status disease cancer carcinoma tumor tumors tumour malignancy defined per score level levels test tested testing result results positive negative mutation mutations mutated alteration alterations amplification amplified expression overexpression fusion rearrangement wild type wildtype germline somatic years year old age aged older younger or than equal greater less at least more over under between ecog performance eastern cooperative oncology group karnofsky kps lansky line lines regimen regimens therapy therapies treatment treatments treated untreated systemic received receiving newly brain cns central nervous system metastases metastasis metastatic leptomeningeal active stable symptomatic untreated measurable evaluable recist criteria lesion lesions according version male female men women other another second malignancies malignant cancers neoplasm neoplasms only also i ii iii iv ie eg e.g i.e advanced locally unresectable inoperable distant stage staged early localized localised non-metastatic nonmetastatic solid relapsed refractory recurrent progressed progression anti-cancer anticancer".split(" "),
);
const TOKEN = /[A-Za-z][A-Za-z0-9-]*/g;

/**
 * Words that name a health-history fact. They count as explained only when that fact was checked, so
 * "adequate liver function" (a lab rule) is never read as settled by the organ answer.
 */
const HISTORY_WORDS: Record<string, string> = {
  hiv: "hiv human immunodeficiency virus infection infections seropositive seropositivity aids viral load detectable undetectable uncontrolled",
  hepatitis_b: "hepatitis hbv viral infection infections chronic hbsag",
  hepatitis_c: "hepatitis hcv viral infection infections chronic",
  organ_transplant: "organ solid transplant transplantation recipient recipients allograft",
  allo_sct: "allogeneic stem cell hematopoietic transplant transplantation hsct sct bone marrow",
  autoimmune: "autoimmune disease diseases disorder disorders",
  kidney_disease: "kidney renal disease dialysis failure",
  liver_disease: "liver hepatic disease cirrhosis failure",
  // Not "cardiac": the question asks about heart failure or a recent heart attack, not any cardiac disease.
  heart_disease: "heart disease failure congestive myocardial infarction",
  pregnancy: "pregnant pregnancy breastfeeding breast-feeding breast feeding lactating nursing women woman",
  concurrent_trial: "concurrent concurrently enrolled enrollment participation participating another clinical trial trials study studies interventional",
};

/** Content words the checked facts do not account for (marker names and the patient's cancer-type words excluded). */
function residualWords(text: string, p: ResolverProfile, checkedKeys: readonly string[] = []): string[] {
  const explained = new Set(checkedKeys.flatMap((k) => (HISTORY_WORDS[k] ?? "").split(" ").filter(Boolean)));
  let t = text;
  for (const b of BIOMARKERS) t = t.replace(new RegExp(b.pattern.source, `${b.pattern.flags.replace("g", "")}g`), " ");
  if (p.group) for (const re of groupTerms(p.group)) t = t.replace(new RegExp(re.source, `${re.flags.replace("g", "")}g`), " ");
  return (t.match(TOKEN) ?? []).map((w) => w.toLowerCase()).filter((w) => !FILLER.has(w) && !explained.has(w) && !/^\d/.test(w) && w.length > 1);
}
/** Positive labels need the item to be about the checked facts: at most this many unexplained content words. */
const MAX_RESIDUAL = 2;

/** A drug name (generic, brand or code) in the item: drug-specific criteria are not settled by our answers. */
function mentionsDrug(text: string): boolean {
  const words = text.split(/[\s,;:()[\]{}"'/]+/).map((w) => w.replace(/^[.]+|[.]+$/g, "")).filter((w) => w.length >= 4);
  return words.some((w, i) => canonicalDrug(w) !== null || (i + 1 < words.length && canonicalDrug(`${w} ${words[i + 1]}`) !== null));
}

/** HGNC aliases of tracked markers rewritten to the symbol our extractor knows ("CD274" -> "PD-L1", "ERBB1" -> "EGFR"). */
const MARKER_BY_GENE: Record<string, string> = { ERBB2: "HER2", CD274: "PD-L1", EGFR: "EGFR", ALK: "ALK", ROS1: "ROS1", KRAS: "KRAS", BRAF: "BRAF", NTRK1: "NTRK", FLT3: "FLT3", MET: "MET", RET: "RET", NPM1: "NPM1", TP53: "TP53", MGMT: "MGMT", PIK3CA: "PIK3CA", ESR1: "ESR1", PALB2: "PALB2", KIT: "KIT", CLDN18: "CLDN18" };
export function normalizeMarkers(text: string): string {
  return text.replace(/\b[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)*\b/g, (w) => {
    if (w.length < 3 || w.length > 10) return w;
    if (BIOMARKERS.some((b) => b.pattern.test(w))) return w;
    const sym = canonicalGene(w);
    const marker = sym ? MARKER_BY_GENE[sym] : undefined;
    return marker && marker !== w ? marker : w;
  });
}

// ---------------------------------------------------------------------------------------------
// Marker lists under a negation, and inclusion alternatives checked option by option
// ---------------------------------------------------------------------------------------------

/** "without EGFR, ALK, or ROS1 alterations", "negative for EGFR mutation/ALK translocation", "no known alterations in NTRK, BRAF ...". */
const NEGATED_LIST = /\b(?:without|negative for|no known|no documented|no evidence of|does not have|do not have|must not have|not harbou?r\w*|absence of|lack(?:ing|s)? of|wild[- ]?type for|free of)\s+(?:a\s+|an\s+|any\s+|known\s+|documented\s+|actionable\s+|targetable\s+|tumou?r\s+|genomic\s+)*((?:[^.;:]){3,160})/gi;
/** Qualifiers that keep a marker open even in a negated list (a specific variant, resistance, exon 20 insertion). */
const NEGATED_LIST_QUALIFIER = /\b(?:other than|besides|aside from|except|resistan\w*|exon\s*20|insertions?|co-?mutations?|acquired|variants? of unknown)\b|\b[A-Z]\d{2,4}[A-Z*]\b/i;
/**
 * Markers named in a negated list of an inclusion item: each one is required to be absent (the "or" is a conjunction).
 * Returns biomarker keys; the caller adds `excluded` facts for them.
 */
export function negatedMarkers(section: SplitCriterion["section"], text: string): { keys: string[]; altText: string } {
  if (section !== "inclusion") return { keys: [], altText: text };
  const out = new Set<string>();
  let altText = text;
  for (const m of text.matchAll(NEGATED_LIST)) {
    const span = m[1] ?? "";
    if (NEGATED_LIST_QUALIFIER.test(span)) continue;
    const head = span.slice(0, 120);
    let found = false;
    for (const b of BIOMARKERS) {
      if (!b.pattern.test(head)) continue;
      out.add(b.id);
      found = true;
    }
    // Inside a negated marker list the "or" is a conjunction: that span is left out of the alternatives check.
    if (found) altText = altText.replace(m[0], " ");
  }
  return { keys: [...out].map((id) => `biomarker:${id}`), altText };
}

/** Top-level alternatives of an inclusion item (definitions and benign pairs removed), or null when it has none. */
function splitAlternatives(text: string): string[] | null {
  let t = text;
  for (const re of BENIGN_OR) t = t.replace(re, " ");
  t = stripDefinitions(t);
  for (const re of BENIGN_OR) t = t.replace(re, " ");
  if (/\b(?:either|one of the following|any of the following|at least one of)\b/i.test(t)) return null;
  const parts = t.split(/\s*(?:,\s*)?\b(?:or|and\/or)\b\s*/i).map((x) => x.trim()).filter((x) => x.length >= 4);
  return parts.length >= 2 && parts.length <= 4 ? parts : null;
}

/** The directional, resolver-settled facts of one clause as verdicts (biomarkers, histology, MSI wording, stage, treated status). */
function clauseVerdicts(clause: string, p: ResolverProfile, ctx: ResolveContext): Verdict[] {
  const out: Verdict[] = [];
  const facts = factsForCriterion("inclusion", clause, { v2: true, groups: ctx.groups, ...(ctx.conditions ? { conditions: ctx.conditions } : {}) });
  const msi = msiDirection("inclusion", clause);
  if (msi && !facts.some((f) => f.key === "biomarker:MSI-H" && f.value !== "mentioned")) facts.push({ key: "biomarker:MSI-H", value: msi });
  for (const f of facts) {
    if (f.value === "mentioned" || !(f.key.startsWith("biomarker:") || f.key.startsWith("histology:"))) continue;
    if (f.key.startsWith("biomarker:") && MARKER_QUALIFIER.test(clause)) continue;
    out.push(checkFact(f, p));
  }
  const stage = checkStage(clause, p, "inclusion");
  if (stage) out.push(stage.verdict);
  const treated = checkTreated(clause, p, "inclusion");
  if (treated) out.push(treated.verdict);
  return out;
}

/**
 * An inclusion item with alternatives is not met when EVERY option fails on a checked fact ("HER2-positive or
 * triple-negative breast cancer" for an HR-positive, HER2-negative patient). An option with nothing checkable, or with
 * an open verdict, keeps the item unknown.
 */
function allAlternativesFail(text: string, p: ResolverProfile, ctx: ResolveContext): boolean {
  const parts = splitAlternatives(text);
  if (!parts) return false;
  // A negation before the first option scopes over all of them ("no known X or Y"): the split would misread it.
  if (/\b(?:no|not|without|absence|neither|lack|free of|negative for)\b/i.test(parts[0] as string)) return false;
  return parts.every((clause) => {
    const v = clauseVerdicts(clause, p, ctx);
    return v.length > 0 && v.some((x) => x === "fail") && !v.some((x) => x === "open");
  });
}

// ---------------------------------------------------------------------------------------------
// Resolver
// ---------------------------------------------------------------------------------------------

/** A resolver label. `questions` = questionnaire ids the verdict rests on (the LLM judge numbers answers A1..An). */
interface ResolvedLabel extends CriterionLabel {
  source: "rule" | "default";
  questions?: string[];
}

interface ResolveContext {
  groups: readonly CancerGroupId[];
  conditions?: readonly string[];
  /** Question id -> numbered answer id ("A3"), when the caller numbers answers; fills `answerIds`. */
  answerIds?: Readonly<Record<string, string>>;
}

const label = (item: SplitCriterion, value: CriterionLabelValue, reason: string, questions: readonly string[] = [], ctx?: ResolveContext): ResolvedLabel => {
  const out: ResolvedLabel = { id: item.id, section: item.section, label: value, source: value === "unknown" ? "default" : "rule", reason };
  if (questions.length) {
    out.questions = [...new Set(questions)];
    const ids = ctx?.answerIds ? out.questions.map((q) => ctx.answerIds?.[q]).filter((x): x is string => !!x) : [];
    if (ids.length) out.answerIds = ids;
  }
  return out;
};

const FAIL_REASON: Record<string, string> = {
  age: "Your age is outside the age range for this rule.",
  stage: "Your answer about how far the cancer has spread does not fit this rule.",
  treated: "Your answers about past treatment do not fit this rule.",
  sex: "This rule is for a different sex.",
  ecog_max: "Your daily activity level is outside what this rule allows.",
  min_prior_lines: "This rule needs more past treatments than you reported.",
  max_prior_lines: "This rule allows fewer past treatments than you reported.",
  previously_treated: "Your answers about past treatment do not fit this rule.",
  newly_diagnosed: "Your answers about past treatment do not fit this rule.",
  brain_mets: "Your answer about cancer in the brain does not fit this rule.",
  measurable_disease: "Your answer about measurable disease does not fit this rule.",
  other_malignancy: "Your answer about other cancers does not fit this rule.",
  hiv: "Your answer about HIV does not fit this rule.",
  hepatitis_b: "Your answer about hepatitis does not fit this rule.",
  hepatitis_c: "Your answer about hepatitis does not fit this rule.",
  organ_transplant: "Your answer about transplants does not fit this rule.",
  allo_sct: "Your answer about transplants does not fit this rule.",
  autoimmune: "Your answer about autoimmune disease does not fit this rule.",
  kidney_disease: "Your answer about kidney problems does not fit this rule.",
  liver_disease: "Your answer about liver problems does not fit this rule.",
  heart_disease: "Your answer about heart problems does not fit this rule.",
  pregnancy: "This rule is about pregnancy or breastfeeding.",
  concurrent_trial: "This rule is about being in another treatment study.",
};
const failReason = (key: string) => FAIL_REASON[key] ?? (key.startsWith("biomarker:") ? `Your ${key.slice(10)} test result does not fit this rule.` : "Your cancer subtype does not fit this rule.");

/** The item really names another cancer (the extractor also fires on "prior treatment with a cancer vaccine"). */
const OTHER_CANCER_WORDS = /\bmalignan\w*|\b(?:other|another|second|additional|concurrent|synchronous|separate|prior|previous)\s+(?:\w+\s+){0,2}(?:cancers?|tumou?rs?|neoplasms?|carcinomas?)\b(?!\s+(?:vaccine|therapy|treatment|drug))/i;
/** "ECOG = 3": an exact value, which the extractor reads as a ceiling. */
const ECOG_EXACT = /(?:^|[^<>=\u2264\u2265])=\s*[1-4]\b(?!\s*-)/;
/** "Known BRAF mutational status", "documented PD-L1 status": the result must be known, not positive. */
const MARKER_STATUS_ONLY = /\b(?:known|documented|available|determined|confirmed|tested|testing|evaluable|results? of)\s+(?:\w+\s+){0,3}?status\b(?![^.;]{0,40}\b(?:positive|negative|mutant|mutated|mutations?|amplif\w*|express\w*|wild[- ]?type|deficien\w*|rearrang\w*|fusion|high|low|\+|-)\b)/i;
/** Activity, control or test wording on a health-history item that a yes/no answer does not settle. */
const HISTORY_QUALIFIER = /\b(?:active|uncontrolled|untreated|unresolved|requiring|detectable|undetectable|viral load|RNA|DNA|HBsAg|antibod\w*|antigen|on (?:antiviral |antiretroviral )?treatment|receiving|positive test|positive for|seropositiv\w*|within|in the (?:last|past))\b/i;
/** A plain subtype statement ("histologically confirmed non-squamous NSCLC"), where the patient's subtype answer applies. */
const HISTOLOGY_ITEM = /\b(?:histolog\w*|cytolog\w*|patholog\w*|confirmed|diagnos\w*|documented|proven|biopsy)\b/i;
const TREATED_KEYS = new Set(["previously_treated", "newly_diagnosed", "min_prior_lines", "max_prior_lines"]);
const STAGE_KEYS = new Set(["metastatic", "locally_advanced", "adjuvant_setting"]);
const UNTREATED_NON_CANCER = /\buntreated\s+(?:\w+\s+){0,2}(?:brain|cns|metasta\w*|lesions?|infections?|spinal|cord compression|leptomeningeal|hypertension|thyroid|disease of)\b/i;
const CARVE_OUT = /\b(?:unless|except|other than|with the exception of|permitted|allowed|acceptable|may (?:be|have)|eligible if|are eligible)\b/i;
/**
 * A rule addressed to a subgroup ("ER/PR+ patients must be refractory to...", "Patients with brain metastases
 * must be stable..."): it sets a condition for that subgroup, so the subgroup's own fact never fails the patient
 * (TREC 2021-61, NCT01677455: an HR-negative patient was excluded by an ER/PR+ condition).
 */
const SUBGROUP_RULE = /\b[A-Za-z0-9/-]*[A-Za-z0-9][+-]\s+(?:patients?|participants?|subjects?|women|men|tumou?rs?|disease)\s+(?:must|should|need|are required|will need|have to)\b|\b(?:patients?|participants?|subjects?)\s+(?:with|who (?:are|have))\s+[^.;,]{1,80}?\s+(?:must|should|need to|will need to|are required to)\b|^\W*(?:for|in)\s+(?:(?:patients?|participants?|subjects?|those)\s+)?(?:with\s+)?[^,;:]{1,60},\s/i;
/** "Patients in Phase 2b with ...": a cohort named mid-sentence. */
const PHASE_COHORT = /\b(?:in|for|of|during)\s+(?:the\s+)?phase\s*(?:1|2|3|i{1,3})[ab]?\b(?!\s*(?:trial|study|clinical))/i;
/** Inclusion wording that says who MAY join, not who must. */
const PERMISSIVE_ITEM = /\b(?:allowed|permitted|acceptable|may (?:be|have|enroll|participate)|eligible if|are (?:also )?eligible|will (?:also )?be (?:equally )?considered|can be enrolled)\b/i;
/** Sub-bullets labeled by a population ("- NSCLC: ...", "- Cohort B: ..."). */
const SUB_LABELS = (text: string) => (text.match(/(?:^|\s)[-*\u2022]\s+[A-Za-z0-9][A-Za-z0-9 /()+-]{0,40}:/g) ?? []).length;
/** A comma list naming three or more markers or genes ("BRCA2, PALB2, BRCA1, ATM"): options, not all required. */
function markerList(text: string): boolean {
  if ((text.match(/,/g) ?? []).length < 2) return false;
  const seen = new Set<string>();
  for (const b of BIOMARKERS) if (b.pattern.test(text)) seen.add(b.id);
  for (const w of text.match(/\b[A-Z][A-Z0-9]{2,9}\b/g) ?? []) {
    const g = canonicalGene(w);
    if (g) seen.add(g);
  }
  return seen.size >= 3;
}

/**
 * MSI status words. MSI-H, MSI-high and dMMR name the positive state of our "MSI-H / dMMR" marker on their own; MSS,
 * microsatellite stable, pMMR and MSI-low name the negative state, which the shared extractor does not read (seen as an MSS
 * trial ranked #1 for an MSI-high answer). Negative wording is matched first and removed, so
 * "non-MSI-H" and "not MSI-H" read as negative.
 */
const MSI_NEG = /\b(?:non-?|not\s+)(?:MSI-?H(?:igh)?|dMMR)\b|\bMSS\b|\bmicrosatellite[- ]stab(?:le|ility)\b|\bpMMR\b|\bmismatch[- ]repair[- ]proficien\w*|\bproficient\s+mismatch[- ]repair\b|\bMMR[- ]proficien\w*|\bMSI-?L(?:ow)?\b/gi;
const MSI_POS = /\bMSI-?H(?:igh)?\b|\bmicrosatellite[- ]instability[- ]high\b|\bhigh(?:[- ]level)?\s+microsatellite[- ]instability\b|\bdMMR\b|\bmismatch[- ]repair[- ]deficien\w*|\bdeficient\s+mismatch[- ]repair\b|\bMMR[- ]deficien\w*/i;
/** "required" / "excluded" for biomarker:MSI-H from MSI status words; null when absent, mixed, optional or qualified. */
function msiDirection(section: "inclusion" | "exclusion", text: string): "required" | "excluded" | null {
  const neg = MSI_NEG.test(text);
  MSI_NEG.lastIndex = 0;
  const pos = MSI_POS.test(text.replace(MSI_NEG, " "));
  if (pos === neg) return null; // neither, or both ("MSI-H or MSS", "regardless of MSI-H/MSS status")
  if (/\b(?:regardless|irrespective|independent of|any MSI|status (?:is )?(?:unknown|pending)|either|unless|except|other than)\b/i.test(text) || hasAlternatives(text.replace(/\bMSI-?H(?:igh)?\s*(?:\/|or|and\/or)\s*dMMR\b|\bdMMR\s*(?:\/|or|and\/or)\s*MSI-?H(?:igh)?\b|\bMSS\s*(?:\/|or|and\/or)\s*pMMR\b|\bpMMR\s*(?:\/|or|and\/or)\s*MSS\b/gi, "MSI"))) return null;
  // inclusion: positive state required / negative state means positive patients are excluded; exclusion flips.
  if (section === "inclusion") return pos ? "required" : "excluded";
  return pos ? "excluded" : "required";
}

/** Label one criterion item. Pure. */
export function resolveItem(item: SplitCriterion, p: ResolverProfile, ctx: ResolveContext): ResolvedLabel {
  const incl = item.section === "inclusion";
  const body = item.text.replace(REGISTRATION_HEADER, "").replace(STAGE_LABEL, "");
  if (item.scope || cohortSpecific(body) || PHASE_COHORT.test(body) || SUB_LABELS(body) >= 2) return label(item, "unknown", "Applies only to one group in the study.");
  // "one-line of therapy" -> "one line of therapy" so the line-count parser sees the unit.
  const text = normalizeMarkers(body).replace(/\b(\d+|one|two|three|four)-(lines?|regimens?)\b/gi, "$1 $2");
  let factText = text;
  for (const [re, to] of EXTRACT_COLLAPSE) factText = factText.replace(re, to);
  const facts = factsForCriterion(item.section, factText, { v2: true, groups: ctx.groups, ...(ctx.conditions ? { conditions: ctx.conditions } : {}) });
  const msi = msiDirection(item.section, text);
  if (msi) {
    const i = facts.findIndex((f) => f.key === "biomarker:MSI-H");
    if (i < 0) facts.push({ key: "biomarker:MSI-H", value: msi });
    else if (facts[i]?.value === "mentioned") facts[i] = { ...facts[i], key: "biomarker:MSI-H", value: msi };
  }
  // "without EGFR, ALK, or ROS1 alterations": every listed marker must be absent.
  const { keys: negated, altText } = negatedMarkers(item.section, text);
  for (const key of negated as FactKey[]) {
    const i = facts.findIndex((f) => f.key === key);
    if (i < 0) facts.push({ key, value: "excluded" });
    else facts[i] = { ...facts[i], key, value: "excluded" };
  }
  const directional = facts.filter((f) => f.value !== "mentioned");
  const checks: Checked[] = [];
  const treatedCheck = checkTreated(text, p, item.section);
  const stageCheck = checkStage(text, p, item.section);
  for (const c of [checkAge(text, p, item.section), checkSex(text, p, item.section), incl ? checkCancerType(text, p, ctx.groups) : null, stageCheck, treatedCheck]) if (c) checks.push(c);
  const untreatedOther = UNTREATED_NON_CANCER.test(text);
  const carveOut = CARVE_OUT.test(text);
  for (const f of directional) {
    if (!allowedKey(f.key)) continue;
    // The item's own treated-status reading (checkTreated) replaces the whole-trial fact for these keys.
    if (treatedCheck && (f.key === "previously_treated" || f.key === "newly_diagnosed")) continue;
    // "untreated brain metastases / lesion / infection" is not about treatment history; carve-outs ("unless",
    // "adjuvant therapy is permitted") are not modeled for treated status and line counts.
    const loose =
      SUBGROUP_RULE.test(text) ||
      (TREATED_KEYS.has(f.key) && (untreatedOther || carveOut)) ||
      (f.key === "other_malignancy" && !OTHER_CANCER_WORDS.test(text)) ||
      (f.key === "ecog_max" && ECOG_EXACT.test(text)) ||
      (f.key.startsWith("biomarker:") && !negated.includes(f.key) && MARKER_QUALIFIER.test(text)) ||
      // "Known BRAF mutational status": a test result must exist, either way.
      (f.key.startsWith("biomarker:") && MARKER_STATUS_ONLY.test(text));
    let verdict: Verdict = loose || (incl && isHistoryKey(f.key)) ? "open" : checkFact(f, p);
    // "Active hepatitis B without antiviral treatment", "HCV RNA positive": activity or test detail a yes/no answer
    // does not give, so a reported infection never fails the item (a reported "no" still clears it).
    if (verdict === "fail" && (f.key === "hepatitis_b" || f.key === "hepatitis_c" || f.key === "hiv") && f.param === undefined && HISTORY_QUALIFIER.test(text)) verdict = "open";
    // Health-history facts settle exclusion items only (inclusion wording about them is conditional, and inclusion
    // pregnancy items ask for a test or contraception that "not pregnant" alone does not meet).
    checks.push({ key: f.key, verdict, questions: sourcesOf(f.key, p) });
  }
  // Stage facts of the whole-trial extractor are explained by the item's own stage reading.
  // Stage facts of the whole-trial extractor are explained by the item's own stage reading, or name the setting of a
  // treatment-history rule ("prior therapy for metastatic disease").
  const outside = directional.filter((f) => !allowedKey(f.key) && !(STAGE_KEYS.has(f.key) && (stageCheck || treatedCheck || STAGE_MET.test(text) || STAGE_ADVANCED.test(text) || STAGE_EARLY.test(text))));
  const alternatives = hasAlternatives(altText) || markerList(altText);
  // "EGFR mutation or ALK rearrangement": the whole-item extractor demotes markers next to "or", so options are
  // checked one by one here; the item is not met only when every option fails on a checked fact.
  const everyOptionFails = incl && alternatives && !PERMISSIVE_ITEM.test(text) && !TIME_WINDOW.test(text.replace(ASSESSMENT_WINDOW, " ")) && allAlternativesFail(altText, p, ctx);
  if (everyOptionFails) return label(item, "not_met", "None of the options in this rule fit your answers.", checks.flatMap((c) => c.questions), ctx);
  if (checks.length === 0) return label(item, "unknown", "Our questions do not cover this rule.");

  // A time window our answers can't settle ("within 4 weeks"); the other-cancer years window is settled by checkFact.
  const window = TIME_WINDOW.test(text.replace(ASSESSMENT_WINDOW, " ")) && !checks.every((c) => c.key === "other_malignancy");
  if (window) return label(item, "unknown", "Depends on dates your answers do not include.");

  // Policy gate: families below the precision gate never create a hard failure.
  // Line counts: a plain count (the extractor already demotes class-specific and conditional counts to "mentioned")
  // with no carve-out or option wording is settled by the lines answer.
  const linesPrecise = !carveOut && !PERMISSIVE_ITEM.test(text) && !SUBGROUP_RULE.test(text);
  // Histology (a family below the whole-trial precision gate): the patient's own subtype answer settles a plain
  // "histologically confirmed <subtype>" item. Health-history families below the gate settle a plain exclusion
  // (no carve-out, no time or activity qualifier) when the patient reports the condition.
  const histologyPrecise = HISTOLOGY_ITEM.test(text) && !carveOut;
  const historyPrecise = !incl && !carveOut;
  const fails = checks.filter((c) => c.verdict === "fail" && (c.key === "age" || c.key === "sex" || c.key === "cancer_type" || c.key === "stage" || c.key === "treated" || (factPolicy(c.key).penalize && !factPolicy(c.key).belowGate) || (c.key === "previously_treated" && preciseTreatedExclusion(item.section, text) && !TREATMENT_SPECIFIC.test(text) && !mentionsDrug(text)) || ((c.key === "min_prior_lines" || c.key === "max_prior_lines") && linesPrecise) || (c.key.startsWith("histology:") && histologyPrecise) || (isHistoryKey(c.key) && historyPrecise)));
  // Inclusion alternatives: one failing option does not fail the item. Exclusion alternatives are a list of
  // excluding conditions, so any one of them that applies excludes.
  if (fails.length > 0 && !(incl && (alternatives || PERMISSIVE_ITEM.test(text)))) {
    const f = fails[0] as Checked;
    return label(item, incl ? "not_met" : "excluded", failReason(f.key), f.questions, ctx);
  }
  if (alternatives) return label(item, "unknown", "This rule has options we cannot check one by one.");

  // Positive labels: every directional fact is one we checked and fits, nothing else is asked, no drug is named.
  const allOk = checks.every((c) => c.verdict === "ok");
  const mentionedAllowed = facts.some((f) => f.value === "mentioned" && allowedKey(f.key) && !(f.key === "other_malignancy" && !OTHER_CANCER_WORDS.test(text)));
  // Health-history items allow one unexplained word ("significant", "uncontrolled"); an item ending in ":"
  // introduces a list we do not see, so it never gets a positive label.
  const maxResidual = checks.some((c) => c.key === "cancer_type") ? 0 : checks.some((c) => isHistoryKey(c.key)) ? 1 : MAX_RESIDUAL;
  if (allOk && !/:\s*$/.test(text) && outside.length === 0 && !mentionedAllowed && !carveOut && !mentionsDrug(text) && residualWords(text, p, checks.map((c) => c.key)).length <= maxResidual) {
    return label(item, incl ? "met" : "not_excluded", incl ? "Your answers fit this rule." : "Your answers say this does not apply to you.", checks.flatMap((c) => c.questions), ctx);
  }
  return label(item, "unknown", "Your answers do not settle this rule.");
}

/** Resolver labels for every split criterion of a trial (resolver-only: provider null). */
export function resolveCriteria(
  card: Pick<TrialCard, "id" | "groups" | "conditions" | "criteria" | "criteriaVersion">,
  profile: ResolverProfile,
  opts: { answerIds?: Readonly<Record<string, string>> } = {},
): TrialCriteriaLabels & { labels: ResolvedLabel[] } {
  const ctx: ResolveContext = { groups: card.groups, conditions: card.conditions, ...(opts.answerIds ? { answerIds: opts.answerIds } : {}) };
  return { trialId: card.id, criteriaVersion: card.criteriaVersion ?? 0, labels: (card.criteria ?? []).map((c) => resolveItem(c, profile, ctx)), provider: null };
}

/** Items the resolver left unknown: what the LLM judge receives. */
export function unresolved(labels: readonly CriterionLabel[]): string[] {
  return labels.filter((l) => l.label === "unknown").map((l) => l.id);
}

