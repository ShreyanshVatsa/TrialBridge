import { describe, expect, it } from "vitest";
import { parseAge, parseEligibility, unescapeMarkdown } from "@/lib/ingest/parse";
import { detectBarriers, sentences } from "@/lib/ingest/barriers";
import { extractRuleFacts, factsForCriterion } from "@/lib/ingest/facts";
import { mapGroups } from "@/lib/ingest/groups";

const ELIG = `Inclusion Criteria:

* Age ≥ 18 years
* Metastatic HER2-positive breast cancer
  * measurable disease per RECIST
* Able to read and speak English

Exclusion Criteria:

* Pregnant or breastfeeding
* Prior treatment with immune checkpoint inhibitors
* Participation in another interventional clinical trial
* Creatinine \\> 1.5 x ULN`;

describe("parseEligibility", () => {
  const { inclusion, exclusion } = parseEligibility(ELIG);
  it("numbers inclusion and exclusion criteria", () => {
    expect(inclusion.map((c) => c.n)).toEqual([1, 2, 3]);
    expect(exclusion).toHaveLength(4);
  });
  it("keeps nested bullets with their parent and unescapes markdown", () => {
    expect(inclusion[1]?.text).toContain("measurable disease");
    expect(exclusion[3]?.text).toBe("Creatinine > 1.5 x ULN");
  });
  it("handles numbered lists and text without headers", () => {
    const r = parseEligibility("1. First item\n2. Second item");
    expect(r.inclusion.map((c) => c.text)).toEqual(["First item", "Second item"]);
    expect(parseEligibility("Healthy adults.\n\nNo other conditions.").inclusion).toHaveLength(2);
  });
  it("unescapes markdown", () => {
    expect(unescapeMarkdown("\\< 5 \\* 2")).toBe("< 5 * 2");
  });
});

describe("parseAge", () => {
  it("parses units into years", () => {
    expect(parseAge("18 Years")).toBe(18);
    expect(parseAge("6 Months")).toBe(0.5);
    expect(parseAge(undefined)).toBeNull();
    expect(parseAge("N/A")).toBeNull();
  });
});

describe("detectBarriers", () => {
  const { inclusion, exclusion } = parseEligibility(ELIG);
  it("flags English requirement with the exact sentence", () => {
    const b = detectBarriers({ inclusion, exclusion, maxAge: null });
    expect(b).toEqual([{ type: "english_required", quote: "Able to read and speak English", ref: { section: "inclusion", n: 3 } }]);
  });
  it("does not flag when another language or an interpreter is allowed", () => {
    const r = parseEligibility("Inclusion Criteria:\n* Able to read English or Spanish\n* Must speak English, or have an interpreter available");
    expect(detectBarriers({ ...r, maxAge: null })).toEqual([]);
  });
  it("flags exclusion of non-English speakers", () => {
    const r = parseEligibility("Exclusion Criteria:\n* Unable to speak and read English.");
    expect(detectBarriers({ ...r, maxAge: null })[0]?.type).toBe("english_required");
  });
  it("flags upper age limit below 75 using the structured field", () => {
    expect(detectBarriers({ inclusion: [], exclusion: [], maxAge: 70, maxAgeRaw: "70 Years" })).toEqual([{ type: "upper_age_limit", quote: "Maximum age: 70 Years" }]);
    expect(detectBarriers({ inclusion: [], exclusion: [], maxAge: 75 })).toEqual([]);
  });
  it("flags disability exclusions without a medical reason only", () => {
    const flagged = parseEligibility("Exclusion Criteria:\n* Psychiatric illness/social situations that would limit compliance with study requirements");
    expect(detectBarriers({ ...flagged, maxAge: null })[0]?.type).toBe("disability_exclusion");
    const medical = parseEligibility("Exclusion Criteria:\n* Grade 2 or higher peripheral neuropathy or hearing impairment due to prior platinum toxicity");
    expect(detectBarriers({ ...medical, maxAge: null })).toEqual([]);
  });
  it("splits sentences verbatim", () => {
    expect(sentences("First. Second; Third\nFourth")).toEqual(["First.", "Second;", "Third", "Fourth"]);
  });
});

describe("rule facts", () => {
  const { inclusion, exclusion } = parseEligibility(ELIG);
  const facts = extractRuleFacts(inclusion, exclusion);
  const get = (k: string) => facts.find((f) => f.key === k);
  it("extracts metastatic, biomarker, pregnancy, concurrent-trial, prior-therapy facts with quotes", () => {
    expect(get("metastatic")?.value).toBe("required");
    expect(get("biomarker:HER2")?.value).toBe("required");
    expect(get("pregnancy")?.value).toBe("excluded");
    expect(get("concurrent_trial")?.value).toBe("excluded");
    expect(get("prior_immunotherapy")?.value).toBe("excluded");
    expect(get("prior_immunotherapy")?.ref).toEqual({ section: "exclusion", n: 2 });
    for (const f of facts) expect([...inclusion, ...exclusion].some((c) => c.text === f.quote)).toBe(true);
  });
  it("treats washouts and 'allowed' as mentioned, and negation as excluded", () => {
    const v = (s: "inclusion" | "exclusion", t: string, k: string) => factsForCriterion(s, t).find((f) => f.key === k)?.value;
    expect(v("exclusion", "Chemotherapy within 4 weeks prior to study entry", "prior_chemotherapy")).toBe("mentioned");
    expect(v("inclusion", "Prior radiation therapy is allowed", "prior_radiation")).toBe("mentioned");
    expect(v("inclusion", "No prior chemotherapy for metastatic disease", "prior_chemotherapy")).toBe("excluded");
    expect(v("inclusion", "Must have received prior chemotherapy", "prior_chemotherapy")).toBe("required");
    expect(v("inclusion", "HER2-negative breast cancer", "biomarker:HER2")).toBe("excluded");
    expect(v("inclusion", "Has metastatic TNBC", "biomarker:HER2")).toBe("excluded");
    expect(v("inclusion", "Locally advanced HR+/HER2- breast cancer", "biomarker:HER2")).toBe("excluded");
    expect(v("inclusion", "Locally advanced HR+/HER2- breast cancer", "biomarker:HR")).toBe("required");
    expect(v("inclusion", "HR- and HER2+ disease", "biomarker:HR")).toBe("excluded");
    expect(v("inclusion", "Documented EGFR mutation (exon 19 deletion)", "biomarker:EGFR")).toBe("required");
    expect(v("exclusion", "Known EGFR mutation or ALK rearrangement", "biomarker:ALK")).toBe("excluded");
    expect(v("inclusion", "Triple-negative breast cancer", "biomarker:HR")).toBe("excluded");
    expect(v("exclusion", "Known brain metastases", "metastatic")).toBeUndefined();
    expect(v("inclusion", "Non-metastatic disease", "metastatic")).toBe("excluded");
    expect(v("inclusion", "Newly diagnosed, previously untreated AML", "newly_diagnosed")).toBe("required");
    expect(v("inclusion", "Relapsed or refractory disease", "previously_treated")).toBe("required");
  });
});

describe("mapGroups", () => {
  it("maps MeSH to groups, falls back to text, flags baskets, and defaults to other", () => {
    expect(mapGroups(["Breast Neoplasms"], [])).toEqual(["breast"]);
    expect(mapGroups([], ["Non-small Cell Lung Cancer"])).toEqual(["lung"]);
    expect(mapGroups([], ["Advanced Solid Tumor"])).toEqual(["solid-tumors"]);
    expect(mapGroups(["Breast Neoplasms", "Lung Neoplasms", "Colorectal Neoplasms", "Prostatic Neoplasms"], [])).toContain("solid-tumors");
    expect(mapGroups([], ["Healthy"])).toEqual(["other"]);
  });
});
