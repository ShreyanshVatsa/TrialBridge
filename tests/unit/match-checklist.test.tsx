import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { CriteriaChecklist, DegradedMatchBanner, HardFailureNote, TierBHeader, WhyRankedLine, markOf } from "@/components/results/match-checklist";
import { en } from "@/components/i18n/en";
import type { CriterionLabel, SplitCriterionRecord, TrialMatchScore } from "@/lib/types";

const criteria: SplitCriterionRecord[] = [
  { id: "I1", section: "inclusion", text: "Age 18 years or older" },
  { id: "I2", section: "inclusion", text: "Histologically confirmed breast cancer", scope: "Cohort A" },
  { id: "I3", section: "inclusion", text: "ECOG 0-1" },
  { id: "E1", section: "exclusion", text: "Active brain metastases" },
  { id: "E2", section: "exclusion", text: "Pregnant or breastfeeding" },
];

const labels: CriterionLabel[] = [
  { id: "I1", section: "inclusion", label: "met", source: "rule", reason: "You said you are 54." },
  { id: "I2", section: "inclusion", label: "unknown", source: "default" },
  { id: "I3", section: "inclusion", label: "not_met", source: "llm", reason: "Your answers say you need help with daily tasks.", answerIds: ["A4"] },
  { id: "E1", section: "exclusion", label: "not_excluded", source: "rule" },
  { id: "E2", section: "exclusion", label: "not_applicable", source: "rule" },
  // A label whose id is not in our stored criteria is never shown (no model text).
  { id: "I99", section: "inclusion", label: "met", source: "llm", reason: "MODEL INVENTED ITEM" },
];

function score(over: Partial<TrialMatchScore> = {}): TrialMatchScore {
  return {
    trialId: "NCT00000001",
    incScore: 0.33,
    tier: "A",
    hardFailures: [],
    counts: { met: 2, notMet: 0, excluded: 0, unknown: 1, notApplicable: 1 },
    retrievalRank: 4,
    degraded: false,
    ...over,
  };
}

const html = (el: React.ReactElement) => renderToStaticMarkup(el);

describe("markOf", () => {
  it("maps labels to check marks", () => {
    expect(markOf("met")).toBe("pass");
    expect(markOf("not_excluded")).toBe("pass");
    expect(markOf("not_met")).toBe("fail");
    expect(markOf("excluded")).toBe("fail");
    expect(markOf("unknown")).toBe("unknown");
    expect(markOf("not_applicable")).toBe("na");
  });
});

describe("CriteriaChecklist", () => {
  const out = html(<CriteriaChecklist labels={labels} criteria={criteria} />);

  it("is a collapsed <details> with a ✓/✗/? tally", () => {
    expect(out).toMatch(/^<details/);
    expect(out).not.toMatch(/<details[^>]*open/);
    expect(out).toContain("✓ 2 look met");
    expect(out).toContain("✗ 1 may not fit");
    expect(out).toContain("? 1 unknown");
  });

  it("shows our stored criterion text by id, never text for unknown ids", () => {
    for (const c of criteria.slice(0, 4)) expect(out).toContain(c.text);
    expect(out).not.toContain("MODEL INVENTED ITEM");
    expect(out).not.toContain('data-id="I99"');
  });

  it("marks each row and shows status words, reasons, source and scope", () => {
    expect(out).toContain('data-mark="pass" data-id="I1"');
    expect(out).toContain('data-mark="unknown" data-id="I2"');
    expect(out).toContain('data-mark="fail" data-id="I3"');
    expect(out).toContain('data-mark="pass" data-id="E1"');
    expect(out).toContain(en.match.status.met);
    expect(out).toContain(en.match.status.not_met);
    expect(out).toContain(en.match.status.unknown);
    expect(out).toContain(en.match.status.not_excluded);
    expect(out).toContain("Your answers say you need help with daily tasks.");
    expect(out).toContain(en.match.source.llm);
    expect(out).toContain("Cohort A");
    expect(out).toContain("Inclusion criterion 3");
  });

  it("hides not-applicable items and counts them instead", () => {
    expect(out).not.toContain("Pregnant or breastfeeding");
    expect(out).toContain("1 requirement did not apply to you and is hidden.");
  });

  it("groups rows by section, inclusion first", () => {
    expect(out.indexOf(en.match.inclusionHeading)).toBeLessThan(out.indexOf(en.match.exclusionHeading));
  });

  it("can open by default and renders nothing without stored criteria", () => {
    expect(html(<CriteriaChecklist labels={labels} criteria={criteria} defaultOpen />)).toMatch(/^<details[^>]*open/);
    expect(html(<CriteriaChecklist labels={labels} criteria={undefined} />)).toBe("");
  });

  it("never uses the word eligible", () => {
    expect(out.toLowerCase()).not.toContain("eligib");
  });
});

describe("WhyRankedLine", () => {
  it("tier A: met of checked, plus unknowns", () => {
    const out = html(<WhyRankedLine score={score()} position={2} />);
    expect(out).toContain("Number 2: looks to meet 2 of 3 requirements we could check");
    expect(out).toContain("1 requirement is still unknown.");
  });
  it("tier A with nothing met yet", () => {
    const out = html(<WhyRankedLine score={score({ counts: { met: 0, notMet: 0, excluded: 0, unknown: 0, notApplicable: 0 } })} position={1} />);
    expect(out).toContain("We could not check the requirements yet");
  });
  it("tier B: listed lower with the failure count", () => {
    const fail = labels[2]!;
    const out = html(<WhyRankedLine score={score({ tier: "B", hardFailures: [fail, { ...fail, id: "E1" }] })} position={7} />);
    expect(out).toContain("Number 7: listed lower because 2 requirements may rule you out.");
  });
});

describe("HardFailureNote / TierBHeader / DegradedMatchBanner", () => {
  it("quotes our stored text for the failing criterion with its reason", () => {
    const out = html(<HardFailureNote failures={[labels[2]!]} criteria={criteria} />);
    expect(out).toContain("ECOG 0-1");
    expect(out).toContain("Your answers say you need help with daily tasks.");
    expect(out).toContain(en.match.hardFailureTitle);
  });
  it("renders nothing when no failing id is in our criteria", () => {
    expect(html(<HardFailureNote failures={[labels[5]!]} criteria={criteria} />)).toBe("");
  });
  it("tier B header and degraded banner use the English copy", () => {
    expect(html(<TierBHeader />)).toContain(en.match.tierBTitle);
    expect(html(<DegradedMatchBanner />)).toContain(en.match.degraded);
  });
});
