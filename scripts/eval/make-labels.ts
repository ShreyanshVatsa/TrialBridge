/**
 * Generate eval/labels.json: 30 SYNTHETIC patient profiles (no real people) with provisional
 * relevance labels. Labeling rule per profile is hand-written below and uses only each trial's
 * TITLE + CONDITIONS (independent of the criteria-derived facts and the embeddings being evaluated):
 *   relevant = passes hard filters AND title/conditions match `rel` AND do not match `not`
 *   excluded = passes hard filters AND title/conditions match `not` (clear mismatch for this profile)
 * Run once: `npx tsx scripts/eval/make-labels.ts`; labels are committed and reviewed.
 */
import { writeFileSync } from "node:fs";
import type { IntakeAnswers } from "../../lib/types/intake";
import { nearestSite, passesAge, passesDistance, passesGroup } from "../../lib/match/filters";
import { loadSeedCards, loadZip, zipCentroid } from "./common";

type P = { id: string; note: string; a: IntakeAnswers; rel: RegExp; not?: RegExp };
const base = { language: "en", pregnant: "no", inAnotherTrial: "no" } as const;
const A = (o: Partial<IntakeAnswers> & Pick<IntakeAnswers, "cancerType" | "zip" | "age">): IntakeAnswers => ({
  travelMiles: 250, spread: "not_sure", treatments: ["not_sure"], biomarkers: {}, ...base, ...o,
});

const PROFILES: P[] = [
  { id: "p01", note: "HER2+ metastatic breast, prior chemo, Boston", a: A({ cancerType: "breast", zip: "02115", age: 52, spread: "yes", treatments: ["chemotherapy"], biomarkers: { HER2: "positive" } }), rel: /breast/i, not: /HER2[- ]?(negative|-)|triple|TNBC|HR\+\/HER2-/i },
  { id: "p02", note: "Triple-negative breast, Houston", a: A({ cancerType: "breast", zip: "77030", age: 44, spread: "yes", biomarkers: { HER2: "negative", HR: "negative" } }), rel: /breast/i, not: /HER2[- ]?positive|HER2\+|HR[- ]?positive|HR\+/i },
  { id: "p03", note: "HR+/HER2- breast, Chicago, 500 mi", a: A({ cancerType: "breast", zip: "60611", age: 63, travelMiles: 500, biomarkers: { HR: "positive", HER2: "negative" } }), rel: /breast/i, not: /HER2[- ]?positive|HER2\+|triple|TNBC/i },
  { id: "p04", note: "Early breast, newly diagnosed, NYC", a: A({ cancerType: "breast", zip: "10032", age: 38, spread: "no", treatments: ["none"] }), rel: /breast/i, not: /metastatic|advanced/i },
  { id: "p05", note: "EGFR+ NSCLC, prior targeted, LA area", a: A({ cancerType: "lung", zip: "94143", age: 67, travelMiles: 500, spread: "yes", treatments: ["targeted_therapy"], biomarkers: { EGFR: "positive" } }), rel: /non-small|NSCLC/i, not: /(?<!non-)(?<!non )small cell lung|\bSCLC\b|mesothelioma/i },
  { id: "p06", note: "Small cell lung, Ohio", a: A({ cancerType: "lung", zip: "44195", age: 70, travelMiles: 500 }), rel: /(?<!non-)(?<!non )small cell|\bSCLC\b|extensive[- ]stage/i, not: /NSCLC|non-small|mesothelioma/i },
  { id: "p07", note: "Advanced NSCLC after immunotherapy, Philadelphia", a: A({ cancerType: "lung", zip: "19104", age: 61, spread: "yes", treatments: ["immunotherapy", "chemotherapy"] }), rel: /lung|NSCLC/i, not: /\bSCLC\b|mesothelioma/i },
  { id: "p08", note: "Lung cancer, not sure of details, Atlanta", a: A({ cancerType: "lung", zip: "30322", age: 58, travelMiles: 500 }), rel: /lung|NSCLC|SCLC/i },
  { id: "p09", note: "Metastatic colorectal, KRAS+, Minnesota", a: A({ cancerType: "colorectal", zip: "55905", age: 59, travelMiles: 500, spread: "yes", treatments: ["chemotherapy"], biomarkers: { KRAS: "positive" } }), rel: /colorectal|colon|rectal/i, not: /anal|KRAS wild/i },
  { id: "p10", note: "Rectal cancer, newly diagnosed, Durham", a: A({ cancerType: "colorectal", zip: "27710", age: 47, spread: "no", treatments: ["none"] }), rel: /rect|colorectal/i, not: /metastatic|anal/i },
  { id: "p11", note: "Colorectal, MSI-high, Seattle", a: A({ cancerType: "colorectal", zip: "98109", age: 55, travelMiles: 500, biomarkers: { "MSI-H": "positive" } }), rel: /colorectal|colon|rectal/i, not: /anal/i },
  { id: "p12", note: "Metastatic castration-resistant prostate, Dallas/Houston", a: A({ cancerType: "prostate", zip: "77030", age: 72, spread: "yes", treatments: ["surgery", "radiation"] }), rel: /prostat/i, not: /localized|low[- ]risk|active surveillance/i },
  { id: "p13", note: "Localized prostate, St. Louis", a: A({ cancerType: "prostate", zip: "63110", age: 66, travelMiles: 500, spread: "no", treatments: ["none"] }), rel: /prostat/i, not: /metastatic|castration/i },
  { id: "p14", note: "Prostate, BRCA+, Baltimore", a: A({ cancerType: "prostate", zip: "21287", age: 69, biomarkers: { BRCA: "positive" } }), rel: /prostat/i },
  { id: "p15", note: "AML, FLT3+, Houston", a: A({ cancerType: "leukemia", zip: "77030", age: 64, biomarkers: { FLT3: "positive" } }), rel: /acute myeloid|AML|leukemia/i, not: /chronic lymphocytic|\bCLL\b|acute lymphoblastic|\bALL\b/i },
  { id: "p16", note: "CLL, Columbus/Ohio, 500 mi", a: A({ cancerType: "leukemia", zip: "44195", age: 71, travelMiles: 500 }), rel: /chronic lymphocytic|\bCLL\b|leukemia/i, not: /acute myeloid|\bAML\b/i },
  { id: "p17", note: "Relapsed ALL adult, LA", a: A({ cancerType: "leukemia", zip: "90095", age: 34, treatments: ["chemotherapy"] }), rel: /lymphoblastic|\bALL\b|leukemia/i, not: /chronic lymphocytic|\bCLL\b/i },
  { id: "p18", note: "Relapsed DLBCL, NYC", a: A({ cancerType: "lymphoma", zip: "10032", age: 60, treatments: ["chemotherapy", "immunotherapy"] }), rel: /lymphoma|DLBCL/i },
  { id: "p19", note: "Hodgkin lymphoma young adult, Denver", a: A({ cancerType: "lymphoma", zip: "80045", age: 26, travelMiles: 500 }), rel: /lymphoma|hodgkin/i },
  { id: "p20", note: "Relapsed multiple myeloma, Rochester MN", a: A({ cancerType: "myeloma", zip: "55905", age: 68, treatments: ["chemotherapy", "targeted_therapy"] }), rel: /myeloma/i, not: /newly diagnosed/i },
  { id: "p21", note: "Newly diagnosed myeloma, Nashville", a: A({ cancerType: "myeloma", zip: "37232", age: 62, travelMiles: 500, treatments: ["none"] }), rel: /myeloma/i, not: /relapsed|refractory/i },
  { id: "p22", note: "BRAF+ metastatic melanoma, Phoenix", a: A({ cancerType: "melanoma", zip: "85054", age: 57, travelMiles: 500, spread: "yes", biomarkers: { BRAF: "positive" } }), rel: /melanoma/i },
  { id: "p23", note: "Melanoma after immunotherapy, Ann Arbor", a: A({ cancerType: "melanoma", zip: "48109", age: 49, travelMiles: 500, treatments: ["immunotherapy"] }), rel: /melanoma/i },
  { id: "p24", note: "Metastatic pancreatic, Miami", a: A({ cancerType: "pancreatic", zip: "33136", age: 66, travelMiles: 500, spread: "yes", treatments: ["chemotherapy"] }), rel: /pancrea/i, not: /resectable(?! .*(un|borderline))|neuroendocrine/i },
  { id: "p25", note: "Pancreatic, BRCA+, New Orleans, anywhere", a: A({ cancerType: "pancreatic", zip: "70112", age: 58, travelMiles: null, biomarkers: { BRCA: "positive" } }), rel: /pancrea/i, not: /neuroendocrine/i },
  { id: "p26", note: "Platinum-resistant ovarian, Salt Lake City, anywhere", a: A({ cancerType: "ovarian", zip: "84112", age: 61, travelMiles: null, treatments: ["chemotherapy", "surgery"] }), rel: /ovar|fallopian|peritoneal/i },
  { id: "p27", note: "Ovarian BRCA+, Boston", a: A({ cancerType: "ovarian", zip: "02115", age: 54, biomarkers: { BRCA: "positive" } }), rel: /ovar|fallopian|peritoneal/i },
  { id: "p28", note: "Recurrent glioblastoma, San Francisco", a: A({ cancerType: "brain", zip: "94143", age: 55, travelMiles: 500, treatments: ["surgery", "radiation", "chemotherapy"] }), rel: /glioblastoma|glioma|GBM/i, not: /newly diagnosed|pediatric/i },
  { id: "p29", note: "IDH-mutant glioma, Durham, anywhere", a: A({ cancerType: "brain", zip: "27710", age: 39, travelMiles: null, biomarkers: { IDH: "positive" } }), rel: /glioma|astrocytoma|oligodendroglioma|glioblastoma/i, not: /IDH[- ]?wild/i },
  { id: "p30", note: "Metastatic urothelial (bladder), Spanish speaker, Houston", a: A({ cancerType: "bladder", zip: "77030", age: 73, travelMiles: 500, language: "es", spread: "yes", treatments: ["chemotherapy"] }), rel: /urothelial|bladder/i, not: /non[- ]muscle|NMIBC|BCG/i },
];

const zips = loadZip();
const { cards, sites } = loadSeedCards(zips);
const labels = PROFILES.map((p) => {
  const origin = zipCentroid(zips, p.a.zip);
  const pass = cards.filter((c) => passesGroup(c, p.a.cancerType) && passesAge(c, p.a.age) && passesDistance(nearestSite(sites.get(c.id) ?? [], origin), p.a.travelMiles));
  const text = (c: (typeof cards)[number]) => `${c.title} ${c.conditions.join(" ")}`;
  const relevant = pass.filter((c) => p.rel.test(text(c)) && !(p.not && p.not.test(text(c)))).map((c) => c.id);
  const excluded = p.not ? pass.filter((c) => p.not?.test(text(c))).map((c) => c.id) : [];
  return { id: p.id, note: p.note, answers: p.a, relevant, excluded, candidates: pass.length };
});
for (const l of labels) console.log(`${l.id} ${l.note.padEnd(55)} candidates=${l.candidates} relevant=${l.relevant.length} excluded=${l.excluded.length}`);
writeFileSync(
  "eval/labels.json",
  JSON.stringify({ note: "SYNTHETIC, PROVISIONAL. Synthetic patient profiles (not real people). Relevance labels from hand-written per-profile title/condition rules (scripts/eval/make-labels.ts) over the committed ClinicalTrials.gov seed; not clinician-reviewed.", generatedAt: new Date().toISOString().slice(0, 10), profiles: labels }, null, 1),
);
