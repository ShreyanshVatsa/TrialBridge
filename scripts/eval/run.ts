/**
 * Offline evaluation (`npm run eval`): retrieval quality, hard-filter safety, rule-fact precision,
 * and mock AI analysis checks over the committed seed + eval/labels.json. Writes eval/RESULTS.md and
 * eval/results.json. Uses the mock AI provider only (`eval:live` is deferred).
 * Embedding variants compared: MiniLM vs bge-small, q8 vs fp32 weights, int8 vs float32 storage.
 */
import { readFileSync, writeFileSync } from "node:fs";
import MiniSearch from "minisearch";
import { MODELS, embedAll, quantize, type Dtype, type ModelKey } from "./embed";
import { loadSeedCards, loadZip, zipCentroid } from "./common";
import { embeddingText } from "../../lib/ingest/record";
import { buildProfileText } from "../../lib/match/query";
import { cosineSimilarity } from "../../lib/match/cosine";
import { reciprocalRankFusion } from "../../lib/match/rrf";
import { rankTrials, type RankEntry } from "../../lib/match/rank";
import { nearestSite, passesAge, passesDistance, passesGroup } from "../../lib/match/filters";
import { MINISEARCH_OPTIONS, MINISEARCH_SEARCH, toSearchDoc, type SearchDoc } from "../../lib/match/minisearch-config";
import { minimizeProfile } from "../../lib/privacy/minimize";
import { mockProvider } from "../../functions/lib/ai/mock";
import { parseModelOutput } from "../../functions/lib/ai/output";
import { verifyQuotes } from "../../functions/lib/quotes";
import type { IntakeAnswers } from "../../lib/types/intake";
import type { TrialCard } from "../../lib/types/trial";
import { loadAssertionCases, runAssertions } from "./assertions";
import { runSimulation, simulationMarkdown } from "./simulate";
import { loadNational } from "./national";
import { FACT_POLICY, getCatalog } from "../../config/questionnaire";
import { applyAnswer, eligibleQuestions } from "../../lib/questionnaire/engine";
import type { QuestionnaireState } from "../../lib/types/questionnaire";

const VARIANTS: { name: string; model: ModelKey; dtype: Dtype; storage: "int8" | "float32" }[] = [
  { name: "MiniLM q8 + int8 (production)", model: "minilm", dtype: "q8", storage: "int8" },
  { name: "MiniLM q8 + float32", model: "minilm", dtype: "q8", storage: "float32" },
  { name: "MiniLM fp32 + int8", model: "minilm", dtype: "fp32", storage: "int8" },
  { name: "bge-small q8 + int8", model: "bge", dtype: "q8", storage: "int8" },
  { name: "bge-small q8 + float32", model: "bge", dtype: "q8", storage: "float32" },
  { name: "bge-small fp32 + int8", model: "bge", dtype: "fp32", storage: "int8" },
];


function recallAt(ranked: string[], rel: Set<string>, k = 10): number {
  if (rel.size === 0) return NaN;
  return ranked.slice(0, k).filter((id) => rel.has(id)).length / Math.min(rel.size, k);
}
function ndcgAt(ranked: string[], rel: Set<string>, k = 10): number {
  if (rel.size === 0) return NaN;
  const dcg = ranked.slice(0, k).reduce((s, id, i) => s + (rel.has(id) ? 1 / Math.log2(i + 2) : 0), 0);
  let idcg = 0;
  for (let i = 0; i < Math.min(rel.size, k); i++) idcg += 1 / Math.log2(i + 2);
  return dcg / idcg;
}
const mean = (xs: number[]) => {
  const v = xs.filter((x) => !Number.isNaN(x));
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : NaN;
};
const f3 = (x: number) => (Number.isNaN(x) ? "n/a" : x.toFixed(3));
const pc = (x: number) => `${(x * 100).toFixed(1)}%`;

interface Profile {
  id: string;
  note: string;
  answers: IntakeAnswers;
  state: QuestionnaireState;
  relevant: string[];
  excluded: string[];
}

async function main(): Promise<void> {
  const labels = JSON.parse(readFileSync("eval/labels.json", "utf8")) as { profiles: Profile[] };
  const zips = loadZip();
  const { cards, sites } = loadSeedCards(zips);
  const byId = new Map(cards.map((c) => [c.id, c]));
  const index = new MiniSearch<SearchDoc>(MINISEARCH_OPTIONS);
  index.addAll(cards.map(toSearchDoc));

  const profiles = labels.profiles.map((p) => ({ ...p, origin: zipCentroid(zips, p.answers.zip), query: buildProfileText(p.answers) }));
  const candidatesFor = (p: (typeof profiles)[number]) =>
    new Set(cards.filter((c) => passesGroup(c, p.answers.cancerType) && passesAge(c, p.answers.age) && passesDistance(nearestSite(sites.get(c.id) ?? [], p.origin), p.origin ? p.answers.travelMiles : null)).map((c) => c.id));
  const keywordRank = (p: (typeof profiles)[number], ids: Set<string>) =>
    index.search(p.query, { ...MINISEARCH_SEARCH, filter: (r) => ids.has(String(r.id)) }).map((r) => String(r.id));

  // Keyword-only baseline.
  const kw = profiles.map((p) => {
    const rel = new Set(p.relevant);
    const r = keywordRank(p, candidatesFor(p));
    return { recall: recallAt(r, rel), ndcg: ndcgAt(r, rel) };
  });

  const variantRows: { name: string; embRecall: number; embNdcg: number; hybRecall: number; hybNdcg: number; sysRecall: number; sysNdcg: number; excludedAt10: number; violations: number; results: number }[] = [];
  const productionSystem = new Map<string, string[]>();
  const V1_PROFILES = 30; // p01-p30: the v1 labels, so the headline stays comparable across versions
  let prodRows: Array<{ sysNdcg: number; excludedAt10: number }> = [];
  for (const v of VARIANTS) {
    process.stdout.write(`Variant: ${v.name}\n`);
    const docVecs = await embedAll(v.model, v.dtype, cards.map(embeddingText));
    const qVecs = await embedAll(v.model, v.dtype, profiles.map((p) => MODELS[v.model].queryPrefix + p.query));
    const stored = docVecs.map((d) => (v.storage === "int8" ? quantize(d) : d));
    const vecOf = new Map(cards.map((c, i) => [c.id, stored[i] as ArrayLike<number>]));
    const rows = profiles.map((p, pi) => {
      const rel = new Set(p.relevant);
      const exc = new Set(p.excluded);
      const ids = candidatesFor(p);
      const q = qVecs[pi] as Float32Array;
      const embR = [...ids].map((id) => ({ id, s: cosineSimilarity(q, vecOf.get(id) as ArrayLike<number>) })).sort((a, b) => b.s - a.s).map((x) => x.id);
      const hybR = reciprocalRankFusion([keywordRank(p, ids), embR]).map((f) => f.id);
      const entries: RankEntry[] = cards.map((c) => ({ card: c, sites: sites.get(c.id) ?? [], vector: vecOf.get(c.id) as ArrayLike<number> }));
      const sys = rankTrials({ entries, answers: p.answers, origin: p.origin, keywordSearch: (s) => keywordRank(p, new Set(s)), queryVector: q });
      const sysIds = sys.results.map((r) => r.card.id);
      if (v === VARIANTS[0]) productionSystem.set(p.id, sysIds);
      // Independent hard-filter re-check of every returned result.
      const violations = sys.results.filter((r) => {
        const c = byId.get(r.card.id) as TrialCard;
        return !passesGroup(c, p.answers.cancerType) || !passesAge(c, p.answers.age) || !passesDistance(nearestSite(sites.get(c.id) ?? [], p.origin), p.origin ? p.answers.travelMiles : null);
      }).length;
      return {
        embRecall: recallAt(embR, rel), embNdcg: ndcgAt(embR, rel), hybRecall: recallAt(hybR, rel), hybNdcg: ndcgAt(hybR, rel),
        sysRecall: recallAt(sysIds, rel), sysNdcg: ndcgAt(sysIds, rel),
        excludedAt10: exc.size ? sysIds.slice(0, 10).filter((id) => exc.has(id)).length / Math.min(10, sysIds.length || 1) : NaN,
        violations, results: sys.results.length,
      };
    });
    if (v === VARIANTS[0]) prodRows = rows;
    const h = rows.slice(0, V1_PROFILES);
    variantRows.push({
      name: v.name,
      embRecall: mean(h.map((r) => r.embRecall)), embNdcg: mean(h.map((r) => r.embNdcg)),
      hybRecall: mean(h.map((r) => r.hybRecall)), hybNdcg: mean(h.map((r) => r.hybNdcg)),
      sysRecall: mean(h.map((r) => r.sysRecall)), sysNdcg: mean(h.map((r) => r.sysNdcg)),
      excludedAt10: mean(h.map((r) => r.excludedAt10)),
      violations: rows.reduce((s, r) => s + r.violations, 0), results: rows.reduce((s, r) => s + r.results, 0),
    });
  }


  // v2 questionnaire pipeline (production embedding variant) vs the v1 pipeline on all labeled profiles.
  const prodV = VARIANTS[0] as (typeof VARIANTS)[number];
  const docVecs = await embedAll(prodV.model, prodV.dtype, cards.map(embeddingText));
  const prodVecs = new Map(cards.map((c, i) => [c.id, quantize(docVecs[i] as Float32Array) as ArrayLike<number>]));
  const entries: RankEntry[] = cards.map((c) => ({ card: c, sites: sites.get(c.id) ?? [], vector: prodVecs.get(c.id) as ArrayLike<number> }));
  const v2Answers = (p: (typeof profiles)[number], state: QuestionnaireState): IntakeAnswers => ({ ...p.answers, questionnaire: state });
  const v2Queries = profiles.map((p) => buildProfileText(v2Answers(p, p.state), getCatalog("cancer", p.answers.cancerType)));
  const v2Vecs = await embedAll(prodV.model, prodV.dtype, v2Queries.map((t) => MODELS[prodV.model].queryPrefix + t));
  const rankV2 = (p: (typeof profiles)[number], state: QuestionnaireState, qv: Float32Array, text: string) => {
    const catalog = getCatalog("cancer", p.answers.cancerType);
    return rankTrials({ entries, answers: v2Answers(p, state), origin: p.origin, keywordSearch: (ids) => index.search(text, { ...MINISEARCH_SEARCH, filter: (r) => ids.has(String(r.id)) }).map((r) => String(r.id)), queryVector: qv, catalog, policy: FACT_POLICY });
  };
  let v2Violations = 0, v2Results = 0, nrChecks = 0, nrMismatch = 0;
  const v2Rows = profiles.map((p, pi) => {
    const rel = new Set(p.relevant), exc = new Set(p.excluded);
    const out = rankV2(p, p.state, v2Vecs[pi] as Float32Array, v2Queries[pi] as string);
    const ids = out.results.map((r) => r.card.id);
    const sexAnswer = p.state.answers["sex"];
    for (const r of out.results) {
      const c = byId.get(r.card.id) as TrialCard;
      const bad = !passesGroup(c, p.answers.cancerType) || !passesAge(c, p.answers.age) || !passesDistance(nearestSite(sites.get(c.id) ?? [], p.origin), p.origin ? p.answers.travelMiles : null) || (sexAnswer === "female" && c.sex === "MALE") || (sexAnswer === "male" && c.sex === "FEMALE");
      if (bad) v2Violations++;
    }
    v2Results += out.results.length;
    // Non-response gate on real profiles: answering "unknown" to every other eligible question changes nothing.
    const catalog = getCatalog("cancer", p.answers.cancerType);
    let withUnknown = p.state;
    for (const q of eligibleQuestions(p.state, null, catalog)) withUnknown = applyAnswer(withUnknown, q.id, q.type === "multi" ? ["unknown"] : "unknown", catalog, { now: 1 }).state;
    const same = rankV2(p, withUnknown, v2Vecs[pi] as Float32Array, v2Queries[pi] as string).results.map((r) => r.card.id);
    nrChecks++;
    if (same.join() !== ids.join()) nrMismatch++;
    return { sysNdcg: ndcgAt(ids, rel), sysRecall: recallAt(ids, rel), excludedAt10: exc.size ? ids.slice(0, 10).filter((id) => exc.has(id)).length / Math.min(10, ids.length || 1) : NaN };
  });
  if (process.env.EVAL_DEBUG) profiles.forEach((p, i) => console.log(p.id, f3((prodRows[i] as { sysNdcg: number }).sysNdcg), f3((v2Rows[i] as { sysNdcg: number }).sysNdcg)));
  const v1All = { ndcg: mean(prodRows.map((r) => r.sysNdcg)), excluded: mean(prodRows.map((r) => r.excludedAt10)) };
  const v2All = { ndcg: mean(v2Rows.map((r) => r.sysNdcg)), recall: mean(v2Rows.map((r) => r.sysRecall)), excluded: mean(v2Rows.map((r) => r.excludedAt10)) };
  const v2First30 = mean(v2Rows.slice(0, V1_PROFILES).map((r) => r.sysNdcg));
  const v2Excl30 = mean(v2Rows.slice(0, V1_PROFILES).map((r) => r.excludedAt10));
  const v1First30 = mean(prodRows.slice(0, V1_PROFILES).map((r) => r.sysNdcg));
  // Profiles with a definite ECOG 2 answer are scored separately: v2 correctly demotes trials limited to ECOG 0-1, but the
  // title-based labels cannot see ECOG, so those labels mark such trials relevant and v2 "loses" by design.
  const ecog2 = profiles.map((p) => p.state.answers["daily_activity"] === "2");
  const sub = <T,>(xs: T[], want: boolean) => xs.filter((_, i) => ecog2[i] === want);
  const v1Cmp = mean(sub(prodRows, false).map((r) => r.sysNdcg)), v2Cmp = mean(sub(v2Rows, false).map((r) => r.sysNdcg));
  const v1E2 = mean(sub(prodRows, true).map((r) => r.sysNdcg)), v2E2 = mean(sub(v2Rows, true).map((r) => r.sysNdcg));
  const nE2 = ecog2.filter(Boolean).length;
  const sim = runSimulation();
  const national = loadNational();
  // The national shards can be mid-swap while an ingest runs; a missing file then only skips this optional section.
  let simNat: ReturnType<typeof runSimulation> | null = null;
  try {
    simNat = national ? runSimulation({ national }) : null;
  } catch (err) {
    console.warn(`national simulation skipped: ${err instanceof Error ? err.message : String(err)}`);
  }

  // Rule-fact precision on the hand-labeled sample.
  const factLabels = JSON.parse(readFileSync("eval/facts-labels.json", "utf8")) as { items: { correct: boolean; key: string }[] };
  const factCorrect = factLabels.items.filter((i) => i.correct).length;

  // Hand-checkable rule assertions (second, independent evidence source).
  const assertions = runAssertions(loadAssertionCases());

  // Mock AI analysis over the production system's top 15.
  let jsonValid = 0, calls = 0, quotesTotal = 0, quotesFailed = 0, agree = 0, labeled = 0;
  for (const p of profiles) {
    const ids = productionSystem.get(p.id) ?? [];
    if (!ids.length) continue;
    const serverTrials = ids.map((id) => byId.get(id) as TrialCard).map((c) => ({ id: c.id, title: c.title, summary: c.summary, inclusion: c.inclusion, exclusion: c.exclusion, minAge: c.minAge, maxAge: c.maxAge, groups: c.groups, facts: c.facts, barriers: c.barriers }));
    calls++;
    const raw = await mockProvider.complete({ messages: [], profile: minimizeProfile(p.answers), trials: serverTrials });
    let parsed;
    try {
      parsed = parseModelOutput(raw);
      jsonValid++;
    } catch {
      continue;
    }
    const check = verifyQuotes(parsed, serverTrials);
    quotesTotal += check.total;
    quotesFailed += check.failed;
    const rel = new Set(p.relevant), exc = new Set(p.excluded);
    for (const a of check.analyses) {
      if (rel.has(a.nctId)) {
        labeled++;
        if (a.fitLevel === "strong" || a.fitLevel === "possible") agree++;
      } else if (exc.has(a.nctId)) {
        labeled++;
        if (a.fitLevel === "unlikely") agree++;
      }
    }
  }

  const kwRecall = mean(kw.map((r) => r.recall)), kwNdcg = mean(kw.map((r) => r.ndcg));
  const prod = variantRows[0];
  if (!prod) throw new Error("no variants");
  const totalViolations = variantRows.reduce((s, r) => s + r.violations, 0) + v2Violations;
  const results = {
    date: new Date().toISOString().slice(0, 10),
    profiles: profiles.length,
    cancerTypes: new Set(profiles.map((p) => p.answers.cancerType)).size,
    states: new Set(profiles.map((p) => p.answers.zip.slice(0, 3))).size,
    keyword: { recall10: kwRecall, ndcg10: kwNdcg },
    variants: variantRows,
    v2: { profiles: profiles.length, v1PipelineNdcg: v1All.ndcg, v2PipelineNdcg: v2All.ndcg, comparable: { n: profiles.length - nE2, v1: v1Cmp, v2: v2Cmp }, ecog2: { n: nE2, v1: v1E2, v2: v2E2 }, v1First30: v1First30, v2First30, v2Excluded30: v2Excl30, v2Excluded: v2All.excluded, v1Excluded: v1All.excluded, violations: v2Violations, nonResponseChecks: nrChecks, nonResponseMismatches: nrMismatch },
    simulation: sim,
    simulationNational: simNat,
    hardFilterViolationRate: totalViolations / Math.max(1, variantRows.reduce((s, r) => s + r.results, 0) + v2Results),
    facts: { sample: factLabels.items.length, correct: factCorrect, precision: factCorrect / factLabels.items.length },
    assertions: { total: assertions.total, passed: assertions.passed, regressions: assertions.failed.length, knownGaps: assertions.knownFailing.length },
    mockAi: { calls, jsonValidRate: jsonValid / Math.max(1, calls), quotePassRate: 1 - quotesFailed / Math.max(1, quotesTotal), quotes: quotesTotal, agreement: agree / Math.max(1, labeled), labeled },
  };
  writeFileSync("eval/results.json", JSON.stringify(results, null, 1));

  const table = variantRows
    .map((r) => `| ${r.name} | ${f3(r.embRecall)} | ${f3(r.embNdcg)} | ${f3(r.hybRecall)} | ${f3(r.hybNdcg)} | ${f3(r.sysRecall)} | ${f3(r.sysNdcg)} | ${f3(r.excludedAt10)} |`)
    .join("\n");
  const md = `# Evaluation results

Generated by \`npm run eval\` on ${results.date}. Data: the committed ClinicalTrials.gov seed (${cards.length} real trials). Mock AI provider only.

> **Synthetic, provisional.** ${profiles.length} synthetic patient profiles (p01-p30 are the v1 labels; p31-p40 were added for the questionnaire, with hand-written v2 answers incl. unknowns) (not real people) across ${results.cancerTypes} cancer types and ${results.states} ZIP regions. Relevance labels come from hand-written per-profile rules over trial titles and conditions (\`scripts/eval/make-labels.ts\`), independent of the criteria facts and embeddings being evaluated, and are **not clinician-reviewed**. Treat the numbers as a regression baseline, not a clinical accuracy claim.

## Safety: hard filters
- **Hard-filter violation rate: ${pc(results.hardFilterViolationRate)}** (${totalViolations} violations in ${variantRows.reduce((s, r) => s + r.results, 0) + v2Results} returned results across all variants and the v2 questionnaire pipeline; the v2 re-check also covers a definite sex answer). Every returned trial was re-checked independently for cancer type, age range, and travel distance.

## Retrieval (recall@10 and nDCG@10, mean over the 30 v1 profiles, legacy answers)
- Keyword only (BM25, MiniSearch): recall@10 **${f3(kwRecall)}**, nDCG@10 **${f3(kwNdcg)}**

| Embedding variant | Emb. recall@10 | Emb. nDCG@10 | Hybrid recall@10 | Hybrid nDCG@10 | Full pipeline recall@10 | Full pipeline nDCG@10 | Excluded-label share of top 10 |
|---|---|---|---|---|---|---|---|
${table}

"Hybrid" = BM25 + embeddings fused with Reciprocal Rank Fusion (k = 60). "Full pipeline" = hybrid + rule-based pre-check scoring (what the app ranks with before AI). "Excluded-label share" = fraction of the top 10 that the labels mark as a clear mismatch (lower is better).

## Questionnaire v2 pipeline vs v1 (production embeddings, ${profiles.length} profiles)
| Pipeline | nDCG@10 (p01-p30) | nDCG@10 (all ${profiles.length}) | Excluded-label share of top 10 (p01-p30) |
|---|---|---|---|
| v1 (legacy answers) | ${f3(v1First30)} | ${f3(v1All.ndcg)} | ${f3(variantRows[0]?.excludedAt10 ?? NaN)} |
| v2 (questionnaire state, catalog pre-check, sex filter) | ${f3(v2First30)} | ${f3(v2All.ndcg)} | ${f3(v2Excl30)} |

Split by whether the profile has a definite ECOG 2 answer (${nE2} profiles do): without ECOG 2 (${profiles.length - nE2} profiles) v1 ${f3(v1Cmp)} vs v2 ${f3(v2Cmp)}; with ECOG 2 v1 ${f3(v1E2)} vs v2 ${f3(v2E2)}. The labels are title/condition rules and cannot see ECOG, so for ECOG 2 patients they call ECOG 0-1-only trials relevant while v2 (correctly, by design) flags them as conflicts and ranks them lower. That drop is expected, not a retrieval regression, and the v2 >= v1 gate is therefore applied to the profiles without ECOG 2.

- Gates: v1 labels nDCG@10 >= 0.800 (**${v1First30 >= 0.8 ? "pass" : "FAIL"}**, ${f3(v1First30)}); v2 >= v1 on the ${profiles.length - nE2} profiles without ECOG 2 (**${v2Cmp >= v1Cmp - 1e-9 ? "pass" : "FAIL"}**, ${f3(v2Cmp)} vs ${f3(v1Cmp)}); hard-filter violations 0 (**${totalViolations === 0 ? "pass" : "FAIL"}**); excluded share on p01-p30 <= 0.271 (**${(variantRows[0]?.excludedAt10 ?? 1) <= 0.2715 && v2Excl30 <= 0.2715 ? "pass" : "FAIL"}**, v1 ${f3(variantRows[0]?.excludedAt10 ?? NaN)}, v2 ${f3(v2Excl30)}).
- Unknown/skip never reduces rank: answering "don't know" to every other eligible question left the top-15 order identical for **${nrChecks - nrMismatch}/${nrChecks}** profiles.
- Caveat: the labels use only title and condition text, so they cannot reward answers about ECOG, prior drugs, lines, or brain metastases; v2's benefit there cannot show up in these numbers. v2 >= v1 therefore mostly checks that the new pre-check does not hurt and that group, subtype and biomarker answers are used.

${simulationMarkdown(sim, simNat)}
## Eligibility facts (rule layer)
- Precision on a ${results.facts.sample}-item hand-labeled random sample: **${pc(results.facts.precision)}** (${factCorrect}/${results.facts.sample}). Labels and reasons: \`eval/facts-labels.json\`. Typical errors: alternatives read as requirements ("recurrent OR metastatic"), planned (future) procedures read as prior treatment, and lists of eligible subtypes read as exclusions. Uncertain directions are stored as "mentioned" and never penalize; the optional local-LLM layer marks disagreements "needs review", which the pre-check also ignores.

### Hand-checkable assertions (second evidence source)
- \`eval/assertions.json\`: ${assertions.total} short criterion sentences with the facts a human reader expects, written before running the extractor and independent of both label files above. Exact-match on the set of facts per sentence.
- Regression cases passing: **${assertions.passed}/${assertions.total - assertions.knownFailing.length - assertions.knownStale.length}**. Documented known gaps (extractor wrong today, not hidden): **${assertions.knownFailing.length}**${assertions.knownFailing.length ? ":\n" + assertions.knownFailing.map((o) => `  - ${o.case.section}: "${o.case.text}" expected ${JSON.stringify(o.case.expect)}, got ${JSON.stringify(o.got)}`).join("\n") : "."}
- The suite is deliberately small and hand-checkable; it catches rule regressions but says nothing about the prevalence of each error on real trials (that is what the 50-item sample estimates, imprecisely).

## AI analysis (mock provider)
- JSON validity: **${pc(results.mockAi.jsonValidRate)}** (${calls} batched calls)
- Quote verification pass rate: **${pc(results.mockAi.quotePassRate)}** (${quotesTotal} quoted criteria)
- Agreement with labels (relevant => strong/possible, excluded => unlikely): **${pc(results.mockAi.agreement)}** over ${labeled} labeled trials
- Live providers (\`npm run eval:live\`) are deferred.

## Model choice
See DECISIONS.md. Production uses the variant in the first row unless another variant is clearly better on hybrid nDCG@10 without a larger download.

## What this evidence does and does not show
- **Hard-filter safety (0% violations)** is the strongest result: it is a deterministic invariant re-checked independently of the ranker, and does not depend on labels. It was measured on the seed, but the filters are pure functions of cancer group, age, and distance, so the property transfers to the national set; it is not re-measured there by this script.
- **Retrieval quality is weakly evidenced.** Hybrid nDCG@10 is not meaningfully better than keyword-only (differences of ~0.00-0.01 on 30 profiles are within noise); the full-pipeline gain comes from the rule-based pre-check, which uses the same fact layer whose precision is imperfect, and the labels are coarse and synthetic.
- **No national-scale or real-user evaluation exists.** Seed nDCG moves when rules change (0.819 to 0.800 after the M-series rule fixes) because penalties reorder results, not necessarily because quality changed.
- Nothing here is a clinical accuracy claim. No labels were fabricated: all label files are either rule-derived (\`labels.json\`), hand-reviewed (\`facts-labels.json\`), or hand-authored (\`assertions.json\`), and each says so.

## Limitations
- Small seed (${cards.length} trials) and coarse, rule-generated labels: many profiles have most candidates labeled relevant, so recall@10 is bounded and differences between variants are small.
- Labels do not reflect detailed eligibility (labs, performance status, prior lines of therapy).
`;
  writeFileSync("eval/RESULTS.md", md);
  console.log(`\nKeyword recall@10 ${f3(kwRecall)} nDCG ${f3(kwNdcg)}`);
  for (const r of variantRows) console.log(`${r.name.padEnd(32)} emb ${f3(r.embNdcg)} hyb ${f3(r.hybNdcg)} sys ${f3(r.sysNdcg)} (recall ${f3(r.sysRecall)}) excl@10 ${f3(r.excludedAt10)} viol ${r.violations}`);
  console.log(`facts precision ${pc(results.facts.precision)}; mock AI json ${pc(results.mockAi.jsonValidRate)} quotes ${pc(results.mockAi.quotePassRate)} agreement ${pc(results.mockAi.agreement)}`);
  console.log(`v2 pipeline nDCG@10 ${f3(v2All.ndcg)} (v1 ${f3(v1All.ndcg)}), p01-p30 v1 ${f3(v1First30)} v2 ${f3(v2First30)}; non-response mismatches ${nrMismatch}/${nrChecks}`);
  if (simNat) console.log(`national simulation: adaptive ${simNat.adaptive.map(f3).join("/")} fixed ${simNat.fixed.map(f3).join("/")}; non-response drops ${simNat.nonResponse.rankDrops + simNat.nonResponse.scoreDrops}`);
  console.log(`simulation: adaptive ${sim.adaptive.map(f3).join("/")} fixed ${sim.fixed.map(f3).join("/")} at k=${sim.ks.join(",")}; non-response drops ${sim.nonResponse.rankDrops + sim.nonResponse.scoreDrops}`);
  const failures: string[] = [];
  if (totalViolations > 0) failures.push("hard-filter violations found");
  if (v1First30 < 0.8) failures.push(`v1 full-pipeline nDCG@10 ${f3(v1First30)} < 0.800`);
  if (v2Cmp < v1Cmp - 1e-9) failures.push(`v2 nDCG@10 ${f3(v2Cmp)} < v1 ${f3(v1Cmp)} (profiles without ECOG 2)`);
  if ((variantRows[0]?.excludedAt10 ?? 1) > 0.2715 || v2Excl30 > 0.2715) failures.push("excluded-label share above 0.271");
  if (nrMismatch > 0 || sim.nonResponse.rankDrops > 0 || sim.nonResponse.scoreDrops > 0 || (simNat && (simNat.nonResponse.rankDrops > 0 || simNat.nonResponse.scoreDrops > 0))) failures.push("unknown/skip answers changed a ranking");
  if (failures.length) {
    console.error(`Eval gates failed: ${failures.join("; ")}`);
    process.exit(1);
  }
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
