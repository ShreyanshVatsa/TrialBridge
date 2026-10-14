import { describe, expect, it } from "vitest";
import { getCatalog } from "@/config/questionnaire";
import type { CancerGroupId } from "@/config/cancer-groups";
import { factsForCriterion } from "@/lib/ingest/facts";
import { hasAlternatives, normalizeMarkers, parseAgeBounds, profileFromState, resolveCriteria, resolveItem, unresolved, type ResolverProfile } from "@/lib/match/criteria-resolve";
import { precheck } from "@/lib/match/precheck";
import { compileState, factRelation } from "@/lib/questionnaire/rules";
import type { QuestionnaireState } from "@/lib/types/questionnaire";
import { isScopedParam, type Fact, type TrialCard } from "@/lib/types/trial";

const state = (group: CancerGroupId, answers: QuestionnaireState["answers"]): QuestionnaireState => ({
  v: 2,
  area: "cancer",
  mode: "thorough",
  answers: { cancer_type: group, age: 60, zip: "10001", travel: "100", ...answers },
  history: [],
  deferred: [],
  updatedAt: 0,
});
const profile = (group: CancerGroupId, answers: QuestionnaireState["answers"] = {}): ResolverProfile => profileFromState(state(group, answers), getCatalog("cancer", group));
const lab = (section: "inclusion" | "exclusion", text: string, p: ResolverProfile, extra: { scope?: string; groups?: CancerGroupId[] } = {}) =>
  resolveItem({ id: section === "inclusion" ? "I1" : "E1", section, text, ...(extra.scope ? { scope: extra.scope } : {}) }, p, { groups: extra.groups ?? [p.group ?? "other"] }).label;
const facts = (section: "inclusion" | "exclusion", text: string) => Object.fromEntries(factsForCriterion(section, text, { v2: true }).map((f) => [f.key, f.value]));

const TREATED = { spread: "distant", disease_status: "recurrent", treatments: ["chemotherapy"], lines: "1" };
const NEW = { spread: "distant", disease_status: "new", treatments: ["none"] };

describe("known extractor gaps (eval/RESULTS.md), fixed", () => {
  it("washout windows are excluded only within the window (scoped param, never a blanket conflict)", () => {
    const cases: [string, string, string][] = [
      ["Prior chemotherapy within 4 weeks of enrollment", "prior_chemotherapy", "within_4_weeks"],
      ["Radiation therapy within 2 weeks before the first dose", "prior_radiation", "within_2_weeks"],
      ["Major surgery within 28 days of study treatment", "prior_surgery", "within_28_days"],
    ];
    for (const [text, key, param] of cases) {
      const f = factsForCriterion("exclusion", text).find((x) => x.key === key);
      expect(f, text).toMatchObject({ value: "excluded", param });
      expect(isScopedParam(f?.param)).toBe(true);
      // A patient who had that treatment (at some unknown time) is not penalized by the window.
      const fact: Fact = { key: f!.key, value: "excluded", param: f!.param!, quote: text, ref: { section: "exclusion", n: 1 }, source: "rule" };
      expect(precheck({ spread: "yes", treatments: ["chemotherapy", "radiation", "surgery"], biomarkers: {}, pregnant: "no", inAnotherTrial: "no" }, [fact])).toEqual([]);
      const compiled = compileState(state("lung", { treatments: ["chemotherapy", "radiation", "surgery"] }), getCatalog("cancer", "lung"));
      expect(factRelation(compiled, fact)).toBe("neutral");
      expect(lab("exclusion", text, profile("lung", TREATED))).toBe("unknown");
    }
  });
  it("prior chemo/radiation/surgery windows stay mentioned in inclusion text", () => {
    expect(facts("inclusion", "Prior chemotherapy within 4 weeks of enrollment").prior_chemotherapy).toBe("mentioned");
  });
  it("qualified marker wording is never a hard failure for a positive test (other than / resistance / exon / variant)", () => {
    const p = profile("lung", { biomarkers: { EGFR: "positive" } });
    for (const text of ["Subject's cancer has a known oncogenic driver alteration other than EGFR.", "Known EGFR mutations that cause resistance to osimertinib", "EGFR exon 20 insertion mutation", "Known EGFR T790M mutation"]) {
      expect(lab("exclusion", text, p), text).toBe("unknown");
    }
    expect(lab("exclusion", "Known EGFR mutation", p)).toBe("excluded");
  });
  it('"Known EGFR or ALK" excludes both markers', () => {
    expect(facts("exclusion", "Known EGFR or ALK alterations")).toMatchObject({ "biomarker:EGFR": "excluded", "biomarker:ALK": "excluded" });
    expect(lab("exclusion", "Known EGFR or ALK alterations", profile("lung", { biomarkers: { EGFR: "positive" } }))).toBe("excluded");
    expect(lab("exclusion", "Known EGFR or ALK alterations", profile("lung", { biomarkers: { ALK: "positive", EGFR: "negative" } }))).toBe("excluded");
    // Both negative: the "or" list may name more than we check, so it is left to the judge.
    expect(lab("exclusion", "Known EGFR or ALK alterations", profile("lung", { biomarkers: { ALK: "negative", EGFR: "negative" } }))).toBe("unknown");
  });
  it('"BRCA1 or BRCA2" means BRCA required', () => {
    expect(facts("inclusion", "BRCA1 or BRCA2 germline mutation")).toEqual({ "biomarker:BRCA": "required" });
    expect(lab("inclusion", "BRCA1 or BRCA2 germline mutation", profile("ovarian", { biomarkers: { BRCA: "positive" } }))).toBe("met");
    expect(lab("inclusion", "BRCA1 or BRCA2 germline mutation", profile("ovarian", { biomarkers: { BRCA: "negative" } }))).toBe("not_met");
    expect(lab("inclusion", "BRCA1 or BRCA2 germline mutation", profile("ovarian", { biomarkers: { BRCA: "unknown" } }))).toBe("unknown");
  });
  it('"Prior systemic therapy for metastatic disease" excludes previously treated patients', () => {
    expect(facts("exclusion", "Prior systemic therapy for metastatic disease")).toEqual({ previously_treated: "excluded" });
    expect(lab("exclusion", "Prior systemic therapy for metastatic disease", profile("lung", TREATED))).toBe("excluded");
    expect(lab("exclusion", "Prior systemic therapy for metastatic disease", profile("lung", NEW))).toBe("not_excluded");
  });
  it('"not received any prior therapy" excludes previously treated patients', () => {
    const t = "Patients who have not received any prior therapy for this cancer";
    expect(facts("inclusion", t)).toEqual({ previously_treated: "excluded" });
    expect(lab("inclusion", t, profile("breast", TREATED))).toBe("not_met");
    expect(lab("inclusion", t, profile("breast", NEW))).toBe("met");
  });
  it("v1 pre-check reads an excluded previously_treated fact the right way round", () => {
    const fact: Fact = { key: "previously_treated", value: "excluded", quote: "q", ref: { section: "inclusion", n: 1 }, source: "rule" };
    const base = { spread: "yes" as const, biomarkers: {}, pregnant: "no" as const, inAnotherTrial: "no" as const };
    expect(precheck({ ...base, treatments: ["chemotherapy"] }, [fact]).map((n) => n.kind)).toEqual(["conflict"]);
    expect(precheck({ ...base, treatments: ["none"] }, [fact]).map((n) => n.kind)).toEqual(["support"]);
    expect(precheck({ ...base, treatments: ["not_sure"] }, [fact])).toEqual([]);
  });
});

describe("resolver: non-responses are never not_met", () => {
  const items: ["inclusion" | "exclusion", string][] = [
    ["inclusion", "ECOG performance status 0-1"],
    ["inclusion", "Measurable disease per RECIST 1.1"],
    ["inclusion", "At least 2 prior lines of systemic therapy"],
    ["inclusion", "HER2-positive breast cancer"],
    ["exclusion", "Known active brain metastases"],
    ["exclusion", "History of other malignancy within the past 5 years"],
  ];
  it.each(["unknown", "__skip", "deferred"])("answer %s => unknown", (nr) => {
    const p = profile("breast", { spread: "distant", daily_activity: nr, measurable: nr, lines: nr, disease_status: nr, brain_mets: nr, other_cancer: nr, biomarkers: { HER2: nr === "deferred" ? "not_tested" : nr } });
    for (const [s, t] of items) expect(lab(s, t, p), t).toBe("unknown");
  });
  it("not asked => unknown", () => {
    const p = profile("breast");
    for (const [s, t] of items) expect(lab(s, t, p), t).toBe("unknown");
  });
  it("an answer whose prerequisite fails is not counted (brain_mets needs spread = distant)", () => {
    expect(lab("exclusion", "Known active brain metastases", profile("lung", { spread: "not_spread", brain_mets: "active" }))).toBe("unknown");
    expect(lab("exclusion", "Known active brain metastases", profile("lung", { spread: "distant", brain_mets: "active" }))).toBe("excluded");
  });
  it("contradictory treatment answers leave treated status unknown", () => {
    const p = profile("lung", { disease_status: "new", treatments: ["chemotherapy"] });
    expect(p.treated).toBeUndefined();
    expect(lab("inclusion", "Newly diagnosed disease", p)).toBe("unknown");
  });
});

describe("resolver: facts", () => {
  it("ECOG bands against the ceiling", () => {
    expect(lab("inclusion", "ECOG performance status 0-2", profile("lung", { daily_activity: "0-1" }))).toBe("met");
    expect(lab("inclusion", "ECOG performance status of 0 or 1", profile("lung", { daily_activity: "2" }))).toBe("not_met");
    expect(lab("inclusion", "ECOG performance status ≤ 2", profile("lung", { daily_activity: "2" }))).toBe("met");
    expect(lab("inclusion", "ECOG performance status 0-1", profile("lung", { daily_activity: "3-4" }))).toBe("not_met");
  });
  it("prior lines (family below the precision gate: supports only, never a hard failure)", () => {
    expect(lab("inclusion", "At least 2 prior lines of systemic therapy", profile("lung", { ...TREATED, lines: "1" }))).toBe("unknown");
    expect(lab("inclusion", "At least 2 prior lines of systemic therapy", profile("lung", { ...TREATED, lines: "3plus" }))).toBe("met");
    expect(lab("inclusion", "At least 2 prior lines of systemic therapy", profile("lung", { ...TREATED, lines: "unknown" }))).toBe("unknown");
  });
  it("brain metastases with and without the active-only carve-out", () => {
    const t = "Active, untreated brain metastases";
    expect(lab("exclusion", t, profile("lung", { spread: "distant", brain_mets: "none" }))).toBe("not_excluded");
    expect(lab("exclusion", t, profile("lung", { spread: "distant", brain_mets: "treated_stable" }))).toBe("not_excluded");
    expect(lab("exclusion", t, profile("lung", { spread: "distant", brain_mets: "active" }))).toBe("excluded");
  });
  it("measurable disease", () => {
    expect(lab("inclusion", "Measurable disease per RECIST 1.1", profile("lung", { spread: "distant", measurable: "yes" }))).toBe("met");
    expect(lab("inclusion", "Measurable disease per RECIST 1.1", profile("lung", { spread: "distant", measurable: "no" }))).toBe("not_met");
  });
  it("other malignancy windows", () => {
    const t = "History of other malignancy within the past 5 years";
    expect(lab("exclusion", t, profile("lung", { other_cancer: "no" }))).toBe("not_excluded");
    expect(lab("exclusion", t, profile("lung", { other_cancer: "recent" }))).toBe("excluded");
    expect(lab("exclusion", t, profile("lung", { other_cancer: "over_2y" }))).toBe("unknown");
    // "prior treatment with a cancer vaccine" is not another cancer.
    expect(lab("exclusion", "Has received prior treatment with a cancer vaccine", profile("lung", { other_cancer: "no" }))).toBe("unknown");
  });
  it("biomarkers, including HGNC aliases", () => {
    expect(normalizeMarkers("CD274-positive tumor")).toBe("PD-L1-positive tumor");
    expect(lab("inclusion", "CD274-positive tumor", profile("lung", { biomarkers: { "PD-L1": "positive" } }))).toBe("met");
    expect(lab("inclusion", "HER2-positive breast cancer", profile("breast", { biomarkers: { HER2: "negative" } }))).toBe("not_met");
    expect(lab("exclusion", "Patients with MSI-high (dMMR) tumors", profile("colorectal", { biomarkers: { "MSI-H": "negative" } }))).toBe("not_excluded");
  });
  it("age, both sections, and age mentioned in passing", () => {
    expect(lab("inclusion", "Age ≥ 18 years", profile("lung"))).toBe("met");
    expect(lab("inclusion", "Age ≥ 18 years", profileFromState(state("lung", { age: 16 }), getCatalog("cancer", "lung")))).toBe("not_met");
    expect(lab("exclusion", "Age < 18 years", profile("lung"))).toBe("not_excluded");
    expect(lab("exclusion", "Age < 18 years", profileFromState(state("lung", { age: 16 }), getCatalog("cancer", "lung")))).toBe("excluded");
    expect(lab("inclusion", "Total bilirubin =< 1.5 times the institutional upper limit of normal for age", profile("lung"))).toBe("unknown");
    expect(lab("inclusion", "Patients < 18 years old must have a body weight ≥ 40 kg.", profile("lung"))).toBe("unknown");
    expect(parseAgeBounds("Between 18 and 75 years of age")).toEqual({ min: 18, max: 75 });
    expect(parseAgeBounds("18 years of age or older")).toEqual({ min: 18 });
  });
  it("sex", () => {
    expect(lab("inclusion", "Female", profile("breast", { sex: "female" }))).toBe("met");
    expect(lab("inclusion", "Female", profile("breast", { sex: "male" }))).toBe("not_met");
    expect(lab("inclusion", "Female", profile("breast", { sex: "prefer_not" }))).toBe("unknown");
  });
  it("cancer type and subtype", () => {
    expect(lab("inclusion", "Histologically or cytologically confirmed melanoma", profile("melanoma"))).toBe("met");
    // A named subtype the patient did not report is not settled by the group alone.
    expect(lab("inclusion", "Patients diagnosed with acute promyelocytic leukemia", profile("leukemia"))).toBe("unknown");
    expect(lab("exclusion", "Small cell lung cancer histology.", profile("lung", { subtype: "nsclc_adeno" }))).toBe("not_excluded");
  });
});

describe("resolver: items left to the judge", () => {
  const p = profile("lung", { ...TREATED, daily_activity: "3-4", brain_mets: "active", biomarkers: { EGFR: "negative", ALK: "negative" } });
  it("scoped items", () => {
    expect(lab("inclusion", "ECOG performance status 0-1", p, { scope: "Cohort A" })).toBe("unknown");
    expect(lab("inclusion", "Part B: ECOG performance status 0-1", p)).toBe("unknown");
  });
  it("inclusion alternatives", () => {
    expect(hasAlternatives("EGFR mutation or ALK rearrangement")).toBe(true);
    expect(hasAlternatives("ECOG performance status of 0 or 1")).toBe(false);
    expect(hasAlternatives("Histologically or cytologically confirmed NSCLC")).toBe(false);
    expect(lab("inclusion", "EGFR mutation or ALK rearrangement", p)).toBe("unknown");
  });
  it("time windows the answers can't settle", () => {
    expect(lab("exclusion", "Brain metastases treated within 4 weeks of enrollment", p)).toBe("unknown");
  });
  it("permissive wording and carve-outs", () => {
    expect(lab("inclusion", "Patients with untreated brain metastases are allowed provided they are asymptomatic", p)).toBe("unknown");
    expect(lab("exclusion", "Prior systemic therapy for metastatic disease, unless given more than 12 months ago", p)).toBe("unknown");
  });
  it("items outside the listed facts", () => {
    expect(lab("inclusion", "Absolute neutrophil count ≥ 1.5 × 10^9/L", p)).toBe("unknown");
    expect(lab("exclusion", "Pregnant or breastfeeding", p)).toBe("unknown");
  });
  it("positive labels need the item to be about the checked facts", () => {
    const ok = profile("lung", { daily_activity: "0-1" });
    expect(lab("inclusion", "ECOG performance status 0-1 and adequate bone marrow, liver and kidney function", ok)).toBe("unknown");
    expect(lab("inclusion", "ECOG 0-1 and prior treatment with osimertinib", ok)).toBe("unknown");
  });
});

describe("resolveCriteria", () => {
  const card: Pick<TrialCard, "id" | "groups" | "conditions" | "criteria" | "criteriaVersion"> = {
    id: "NCT00000001",
    groups: ["lung"],
    conditions: ["Non-small Cell Lung Cancer"],
    criteriaVersion: 1,
    criteria: [
      { id: "I1", section: "inclusion", text: "Age ≥ 18 years" },
      { id: "I2", section: "inclusion", text: "ECOG performance status 0-1" },
      { id: "I3", section: "inclusion", text: "Adequate organ function" },
      { id: "E1", section: "exclusion", text: "Known active brain metastases" },
    ],
  };
  it("labels every item in order, resolver-only, with question ids and optional answer ids", () => {
    const p = profile("lung", { spread: "distant", daily_activity: "2", brain_mets: "none" });
    const r = resolveCriteria(card, p, { answerIds: { age: "A2", daily_activity: "A5", brain_mets: "A7" } });
    expect(r).toMatchObject({ trialId: "NCT00000001", criteriaVersion: 1, provider: null });
    expect(r.labels.map((l) => [l.id, l.label])).toEqual([["I1", "met"], ["I2", "not_met"], ["I3", "unknown"], ["E1", "not_excluded"]]);
    expect(r.labels[1]).toMatchObject({ source: "rule", questions: ["daily_activity"], answerIds: ["A5"] });
    expect(r.labels[2]).toMatchObject({ source: "default" });
    expect(unresolved(r.labels)).toEqual(["I3"]);
    for (const l of r.labels) expect((l.reason ?? "").split(/\s+/).length).toBeLessThanOrEqual(25);
  });
  it("cards without split criteria give no labels", () => {
    expect(resolveCriteria({ ...card, criteria: undefined, criteriaVersion: undefined }, profile("lung")).labels).toEqual([]);
  });
});
