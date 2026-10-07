import { describe, expect, it } from "vitest";
import { buildLlmUserPrompt, llmCacheKey, mergeFacts, parseLlmOutput, verifyLlmFacts } from "@/lib/ingest/llm-facts";
import { precheck } from "@/lib/match/precheck";
import { fact, makeAnswers } from "./fixtures";

const inclusion = [{ n: 1, text: "Metastatic HER2-positive breast cancer" }];
const exclusion = [{ n: 1, text: "Prior treatment with immune checkpoint inhibitors" }];

describe("LLM fact layer", () => {
  it("parses JSON (ignoring <think> blocks) and drops invalid facts individually", () => {
    const raw = `<think>hmm</think>{"facts":[{"key":"metastatic","value":"required","quote":"Metastatic HER2-positive","confidence":0.9},{"key":"made_up","value":"required","quote":"x","confidence":1}]}`;
    const out = parseLlmOutput(raw);
    expect(out.facts).toHaveLength(1);
    expect(out.invalid).toBe(1);
    expect(() => parseLlmOutput("no json")).toThrow();
  });
  it("keeps only verbatim quotes, mapping to the criterion", () => {
    const out = parseLlmOutput(JSON.stringify({ facts: [
      { key: "metastatic", value: "required", quote: "Metastatic HER2-positive", confidence: 0.9 },
      { key: "prior_immunotherapy", value: "excluded", quote: "immune checkpoint inhibitors", confidence: 0.8 },
      { key: "pregnancy", value: "excluded", quote: "Pregnant women are excluded", confidence: 0.9 },
      { key: "metastatic", value: "mentioned", quote: "Metastatic HER2", confidence: 0.5 },
    ] }));
    const v = verifyLlmFacts(out, inclusion, exclusion);
    expect(v.discarded).toBe(1);
    expect(v.facts.map((f) => `${f.key}:${f.value}:${f.ref.section}`)).toEqual(["metastatic:required:inclusion", "prior_immunotherapy:excluded:exclusion"]);
    expect(v.facts[0]?.quote).toBe(inclusion[0]?.text);
  });
  it("merges layers: agreement, disagreement (needs review), LLM-only, and direction for 'mentioned'", () => {
    const llm = (k: Parameters<typeof fact>[0], v: Parameters<typeof fact>[1]) => ({ ...fact(k, v), source: "llm" as const, confidence: 0.8 });
    const merged = mergeFacts(
      [fact("metastatic", "required"), fact("pregnancy", "excluded"), fact("prior_chemotherapy", "mentioned")],
      [llm("metastatic", "required"), llm("pregnancy", "required"), llm("concurrent_trial", "excluded"), llm("prior_chemotherapy", "excluded")],
    );
    expect(merged.find((f) => f.key === "metastatic")?.confidence).toBe(0.8);
    expect(merged.filter((f) => f.key === "pregnancy").every((f) => f.needsReview)).toBe(true);
    expect(merged.filter((f) => f.key === "pregnancy")).toHaveLength(2);
    expect(merged.find((f) => f.key === "concurrent_trial")?.source).toBe("llm");
    expect(merged.find((f) => f.key === "prior_chemotherapy")?.value).toBe("excluded");
    // needs-review facts never penalize in the pre-check
    expect(precheck(makeAnswers({ pregnant: "yes" }), merged.filter((f) => f.key === "pregnancy"))).toEqual([]);
  });
  it("builds a delimited prompt and stable cache keys", () => {
    expect(buildLlmUserPrompt(inclusion, exclusion)).toContain("I1. Metastatic");
    expect(llmCacheKey("NCT1", "2026-01-01")).toBe("NCT1|2026-01-01|facts-v1");
  });
});
