/**
 * Deterministic per-criterion resolver (v6 step 3). Each split criterion item (lib/ingest/criteria-split.ts) is run
 * through the rule fact extractor ON ITS OWN, and the facts are compared with the patient's questionnaire answers:
 *   inclusion -> "met" | "not_met" | "unknown";  exclusion -> "excluded" | "not_excluded" | "unknown".
 * Only these facts settle an item: age, sex, cancer group/subtype (histology), ECOG, prior lines / treated status,
 * brain metastases, measurable disease, biomarkers and other malignancy. Everything else stays "unknown" for the LLM
 * judge, and so does:
 *  - any fact whose question was answered "don't know", skipped, deferred or never asked (never "not_met");
 *  - items with a cohort/arm scope, real alternatives ("X or Y") in inclusion, or a time window the answers can't settle;
 *  - positive labels (met / not_excluded) when the item says more than the facts we checked (residual content).
 * Pure and synchronous; no I/O, no LLM.
 */
import { BIOMARKERS, type BiomarkerId } from "@/config/biomarkers";
import { CANCER_GROUPS, type CancerGroupId } from "@/config/cancer-groups";
import { factPolicy } from "@/config/questionnaire/fact-policy";
import { cohortSpecific } from "@/lib/ingest/eligibility-facts";
import { factsForCriterion } from "@/lib/ingest/facts";
import type { SplitCriterion } from "@/lib/ingest/criteria-split";
import { cancerSynonyms, canonicalDrug, canonicalGene } from "@/lib/ingest/synonyms";
import type { CriterionLabel, CriterionLabelValue, TrialCriteriaLabels } from "@/lib/types/criteria";
import { isScopedParam, type FactParam, type FactValue, type TrialCard } from "@/lib/types/trial";
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
  /** ECOG band, e.g. "0-1" -> [0, 1]. */
  ecog?: Range;
  /** Prior lines of therapy for this cancer; newly diagnosed / no treatment -> [0, 0]. */
  lines?: Range;
  /** Previously treated with systemic therapy for this cancer. */
  treated?: boolean;
  brainMets?: "none" | "treated_stable" | "active";
  measurable?: boolean;
  otherCancer?: "no" | "over_2y" | "recent";
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

/** Fact keys the resolver may settle (spec STEP 3). */
const ALLOWED_KEYS = new Set(["ecog_max", "min_prior_lines", "max_prior_lines", "previously_treated", "newly_diagnosed", "brain_mets", "measurable_disease", "other_malignancy"]);
const allowedKey = (k: string) => ALLOWED_KEYS.has(k) || k.startsWith("biomarker:") || k.startsWith("histology:");

/** Does the patient HAVE the attribute? true / false / undefined (unknown). */
function hasAttr(key: string, p: ResolverProfile): boolean | undefined {
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
export function checkFact(f: { key: string; value: FactValue; param?: FactParam }, p: ResolverProfile): Verdict {
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
    default:
      if (allowedKey(f.key)) return fromBool(hasAttr(f.key, p), f.value);
      return "open";
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
  const range = /\b(\d{1,3})\s*(?:-|–|to|and)\s*(\d{1,3})\s*(?:years?|yrs?)\b/i.exec(t);
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
// Item shape: windows, alternatives, residual content
// ---------------------------------------------------------------------------------------------

const TIME_WINDOW = /\bwithin\s+(?:the\s+)?(?:(?:last|past|previous|prior)\s+)?(?:\d+|one|two|three|four|five|six|eight|twelve)\b|\b(?:in|during)\s+the\s+(?:last|past|previous|prior)\s+(?:\d+|one|two|three|four|five|six|twelve)?\s*(?:days?|weeks?|months?|years?)\b|\b\d+\s*(?:days?|weeks?|months?|half-lives)\s+(?:prior|before|of|after|since)\b|\bwash-?out\b|\blast dose\b|(?:>=|\u2265|at least)\s*\d+\s*(?:days?|weeks?|months?)\b/i;

/** "or" forms that are not alternatives between criteria: number ranges, comparators, method pairs, sex pairs. */
const BENIGN_OR = [
  /\b\d+(?:\.\d+)?\s*(?:,\s*\d+\s*,?\s*)?(?:or|and\/or)\s*\d+(?:\.\d+)?\b/gi,
  /\b(?:equal to|greater than|less than|more than|fewer than|higher than|lower than|older|younger|above|below|at least)\s+(?:or|and\/or)\s+/gi,
  /\b(?:or|and\/or)\s+(?:equal|older|younger|greater|less|more|above|below|higher|lower|over|under)\b/gi,
  /\b(?:histologic(?:al)?ly|cytologic(?:al)?ly|pathologic(?:al)?ly|radiographic(?:al)?ly|clinically)\s*(?:,\s*\w+\s*,?\s*)?(?:or|and\/or)\s*(?:histologic|cytologic|pathologic|radiographic|clinical)\w*/gi,
  /\b(?:male|men|female|women)\s+(?:or|and\/or)\s+(?:male|men|female|women)\b/gi,
  /\b(?:ECOG|Eastern Cooperative Oncology Group)\b[^.;]{0,40}?\b(?:or|and\/or)\b/gi,
  /\b(?:BRCA ?1|BRCA)\s*(?:or|and\/or|\/)\s*BRCA ?2\b/gi,
  /\b(?:IDH ?1)\s*(?:or|and\/or|\/)\s*IDH ?2\b/gi,
  /\b(?:ER|estrogen receptor)\s*(?:and\/or|or|\/)\s*(?:PR|progesterone receptor)\b/gi,
];
/** True when the item offers alternatives that a fact-by-fact check would misread. Exported for tests. */
export function hasAlternatives(text: string): boolean {
  let t = text;
  for (const re of BENIGN_OR) t = t.replace(re, " ");
  return /\b(?:or|and\/or|either|one of the following|any of the following|at least one of)\b/i.test(t);
}

/** Words that carry no criterion content of their own. */
const FILLER = new Set(
  "a an the of to in on for with without by at as and is are be been being must should will have has had having patients patient participants participant subjects subject who which that this these those any all no not none known documented confirmed histologically cytologically pathologically diagnosis diagnosed evidence history prior previous previously current currently presence present status disease cancer carcinoma tumor tumors tumour malignancy defined per score level levels test tested testing result results positive negative mutation mutations mutated alteration alterations amplification amplified expression overexpression fusion rearrangement wild type wildtype germline somatic years year old age aged older younger or than equal greater less at least more over under between ecog performance eastern cooperative oncology group karnofsky kps lansky line lines regimen regimens therapy therapies treatment treatments treated untreated systemic received receiving newly brain cns central nervous system metastases metastasis metastatic leptomeningeal active stable symptomatic untreated measurable evaluable recist criteria lesion lesions according version male female men women other another second malignancies malignant cancers neoplasm neoplasms only also i ii iii iv ie eg e.g i.e".split(" "),
);
const TOKEN = /[A-Za-z][A-Za-z0-9-]*/g;

/** Content words the checked facts do not account for (marker names and the patient's cancer-type words excluded). */
function residualWords(text: string, p: ResolverProfile): string[] {
  let t = text;
  for (const b of BIOMARKERS) t = t.replace(new RegExp(b.pattern.source, `${b.pattern.flags.replace("g", "")}g`), " ");
  if (p.group) for (const re of groupTerms(p.group)) t = t.replace(new RegExp(re.source, `${re.flags.replace("g", "")}g`), " ");
  return (t.match(TOKEN) ?? []).map((w) => w.toLowerCase()).filter((w) => !FILLER.has(w) && !/^\d/.test(w) && w.length > 1);
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
// Resolver
// ---------------------------------------------------------------------------------------------

/** A resolver label. `questions` = questionnaire ids the verdict rests on (the LLM judge numbers answers A1..An). */
export interface ResolvedLabel extends CriterionLabel {
  source: "rule" | "default";
  questions?: string[];
}

export interface ResolveContext {
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
  sex: "This rule is for a different sex.",
  ecog_max: "Your daily activity level is outside what this rule allows.",
  min_prior_lines: "This rule needs more past treatments than you reported.",
  max_prior_lines: "This rule allows fewer past treatments than you reported.",
  previously_treated: "Your answers about past treatment do not fit this rule.",
  newly_diagnosed: "Your answers about past treatment do not fit this rule.",
  brain_mets: "Your answer about cancer in the brain does not fit this rule.",
  measurable_disease: "Your answer about measurable disease does not fit this rule.",
  other_malignancy: "Your answer about other cancers does not fit this rule.",
};
const failReason = (key: string) => FAIL_REASON[key] ?? (key.startsWith("biomarker:") ? `Your ${key.slice(10)} test result does not fit this rule.` : "Your cancer subtype does not fit this rule.");

/** The item really names another cancer (the extractor also fires on "prior treatment with a cancer vaccine"). */
const OTHER_CANCER_WORDS = /\bmalignan\w*|\b(?:other|another|second|additional|concurrent|synchronous|separate|prior|previous)\s+(?:\w+\s+){0,2}(?:cancers?|tumou?rs?|neoplasms?|carcinomas?)\b(?!\s+(?:vaccine|therapy|treatment|drug))/i;
/** "ECOG = 3": an exact value, which the extractor reads as a ceiling. */
const ECOG_EXACT = /(?:^|[^<>=\u2264\u2265])=\s*[1-4]\b(?!\s*-)/;
const TREATED_KEYS = new Set(["previously_treated", "newly_diagnosed", "min_prior_lines", "max_prior_lines"]);
const UNTREATED_NON_CANCER = /\buntreated\s+(?:\w+\s+){0,2}(?:brain|cns|metasta\w*|lesions?|infections?|spinal|cord compression|leptomeningeal|hypertension|thyroid|disease of)\b/i;
/**
 * Biomarker wording narrower than a positive/negative answer: "other than EGFR", "EGFR mutations that cause
 * resistance to osimertinib", "exon 20 insertion", "T790M". A positive test does not settle these (step 9 demo probe).
 */
const MARKER_QUALIFIER = /\b(?:other than|besides|aside from|except|resistan\w*|exon\s*\d+|insertions?|deletions?|co-?mutations?|acquired|sensitizing|activating|variants? of unknown)\b|\b[A-Z]\d{2,4}[A-Z*]\b/i;
const CARVE_OUT = /\b(?:unless|except|other than|with the exception of|permitted|allowed|acceptable|may (?:be|have)|eligible if|are eligible)\b/i;
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

/** Label one criterion item. Pure. */
export function resolveItem(item: SplitCriterion, p: ResolverProfile, ctx: ResolveContext): ResolvedLabel {
  const incl = item.section === "inclusion";
  if (item.scope || cohortSpecific(item.text) || SUB_LABELS(item.text) >= 2) return label(item, "unknown", "Applies only to one group in the study.");
  const text = normalizeMarkers(item.text);
  const facts = factsForCriterion(item.section, text, { v2: true, groups: ctx.groups, ...(ctx.conditions ? { conditions: ctx.conditions } : {}) });
  const directional = facts.filter((f) => f.value !== "mentioned");
  const checks: Checked[] = [];
  for (const c of [checkAge(text, p, item.section), checkSex(text, p, item.section), incl ? checkCancerType(text, p, ctx.groups) : null]) if (c) checks.push(c);
  const untreatedOther = UNTREATED_NON_CANCER.test(text);
  const carveOut = CARVE_OUT.test(text);
  for (const f of directional) {
    if (!allowedKey(f.key)) continue;
    // "untreated brain metastases / lesion / infection" is not about treatment history; carve-outs ("unless",
    // "adjuvant therapy is permitted") are not modeled for treated status and line counts.
    const loose = (TREATED_KEYS.has(f.key) && (untreatedOther || carveOut)) || (f.key === "other_malignancy" && !OTHER_CANCER_WORDS.test(text)) || (f.key === "ecog_max" && ECOG_EXACT.test(text)) || (f.key.startsWith("biomarker:") && MARKER_QUALIFIER.test(text));
    checks.push({ key: f.key, verdict: loose ? "open" : checkFact(f, p), questions: sourcesOf(f.key, p) });
  }
  const outside = directional.filter((f) => !allowedKey(f.key));
  if (checks.length === 0) return label(item, "unknown", "Our questions do not cover this rule.");

  // A time window our answers can't settle ("within 4 weeks"); the other-cancer years window is settled by checkFact.
  const window = TIME_WINDOW.test(text) && !checks.every((c) => c.key === "other_malignancy");
  if (window) return label(item, "unknown", "Depends on dates your answers do not include.");

  const alternatives = hasAlternatives(text) || markerList(text);
  // Policy gate: families below the precision gate never create a hard failure.
  const fails = checks.filter((c) => c.verdict === "fail" && (c.key === "age" || c.key === "sex" || c.key === "cancer_type" || factPolicy(c.key).penalize));
  // Inclusion alternatives: one failing option does not fail the item. Exclusion alternatives are a list of
  // excluding conditions, so any one of them that applies excludes.
  if (fails.length > 0 && !(incl && (alternatives || PERMISSIVE_ITEM.test(text)))) {
    const f = fails[0] as Checked;
    return label(item, incl ? "not_met" : "excluded", failReason(f.key), f.questions, ctx);
  }
  if (alternatives) return label(item, "unknown", "This rule has options we cannot check one by one.");

  // Positive labels: every directional fact is one we checked and fits, nothing else is asked, no drug is named.
  const allOk = checks.every((c) => c.verdict === "ok");
  const mentionedAllowed = facts.some((f) => f.value === "mentioned" && allowedKey(f.key));
  const maxResidual = checks.some((c) => c.key === "cancer_type") ? 0 : MAX_RESIDUAL;
  if (allOk && outside.length === 0 && !mentionedAllowed && !carveOut && !mentionsDrug(text) && residualWords(text, p).length <= maxResidual) {
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

