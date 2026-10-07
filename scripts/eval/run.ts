/**
 * Offline evaluation (`npm run eval`): retrieval quality, hard-filter safety, rule-fact precision,
 * and mock AI analysis checks over the committed seed + eval/labels.json. Writes eval/RESULTS.md and
 * eval/results.json. Uses the mock AI provider only (`eval:live` is deferred).
 * Embedding variants compared: MiniLM vs bge-small, q8 vs fp32 weights, int8 vs float32 storage.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, cpSync } from "node:fs";
import path from "node:path";
import MiniSearch from "minisearch";
import { pipeline, env } from "@huggingface/transformers";
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
import { INT8_SCALE } from "../../config/embedding";
import { loadAssertionCases, runAssertions } from "./assertions";

const MODEL_DIR = path.resolve("data/cache/models");
const MODELS = {
  minilm: { id: "Xenova/all-MiniLM-L6-v2", queryPrefix: "" },
  bge: { id: "Xenova/bge-small-en-v1.5", queryPrefix: "Represent this sentence for searching relevant passages: " },
} as const;
type ModelKey = keyof typeof MODELS;
type Dtype = "q8" | "fp32";
const VARIANTS: { name: string; model: ModelKey; dtype: Dtype; storage: "int8" | "float32" }[] = [
  { name: "MiniLM q8 + int8 (production)", model: "minilm", dtype: "q8", storage: "int8" },
  { name: "MiniLM q8 + float32", model: "minilm", dtype: "q8", storage: "float32" },
  { name: "MiniLM fp32 + int8", model: "minilm", dtype: "fp32", storage: "int8" },
  { name: "bge-small q8 + int8", model: "bge", dtype: "q8", storage: "int8" },
  { name: "bge-small q8 + float32", model: "bge", dtype: "q8", storage: "float32" },
  { name: "bge-small fp32 + int8", model: "bge", dtype: "fp32", storage: "int8" },
];

async function ensureModel(id: string): Promise<void> {
  const files = ["config.json", "tokenizer.json", "tokenizer_config.json", "special_tokens_map.json", "onnx/model_quantized.onnx", "onnx/model.onnx"];
  const local = path.join("public/models", id);
  for (const f of files) {
    const dest = path.join(MODEL_DIR, id, f);
    if (existsSync(dest)) continue;
    mkdirSync(path.dirname(dest), { recursive: true });
    if (existsSync(path.join(local, f))) {
      cpSync(path.join(local, f), dest);
      continue;
    }
    const res = await fetch(`https://huggingface.co/${id}/resolve/main/${f}`, { signal: AbortSignal.timeout(600_000) });
    if (!res.ok) throw new Error(`download ${id}/${f}: ${res.status}`);
    writeFileSync(dest, new Uint8Array(await res.arrayBuffer()));
    console.log(`  downloaded ${id}/${f}`);
  }
}

async function embedAll(model: ModelKey, dtype: Dtype, texts: string[]): Promise<Float32Array[]> {
  const cacheFile = path.join("data/cache", `eval-emb-${model}-${dtype}.json`);
  let cache: Record<string, number[]> = {};
  if (existsSync(cacheFile)) cache = JSON.parse(readFileSync(cacheFile, "utf8")) as Record<string, number[]>;
  const todo = [...new Set(texts.filter((t) => !cache[t]))];
  if (todo.length) {
    await ensureModel(MODELS[model].id);
    env.localModelPath = MODEL_DIR + "/";
    env.allowRemoteModels = false;
    const fe = await pipeline("feature-extraction", MODELS[model].id, { dtype });
    for (let i = 0; i < todo.length; i += 32) {
      const batch = todo.slice(i, i + 32);
      const out = await fe(batch, { pooling: model === "bge" ? "cls" : "mean", normalize: true });
      const data = out.data as Float32Array;
      const dims = data.length / batch.length;
      batch.forEach((t, j) => (cache[t] = Array.from(data.subarray(j * dims, (j + 1) * dims))));
    }
    writeFileSync(cacheFile, JSON.stringify(cache));
  }
  return texts.map((t) => Float32Array.from(cache[t] as number[]));
}

const quantize = (v: Float32Array) => Int8Array.from(v, (x) => Math.max(-127, Math.min(127, Math.round(x * INT8_SCALE))));

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
    variantRows.push({
      name: v.name,
      embRecall: mean(rows.map((r) => r.embRecall)), embNdcg: mean(rows.map((r) => r.embNdcg)),
      hybRecall: mean(rows.map((r) => r.hybRecall)), hybNdcg: mean(rows.map((r) => r.hybNdcg)),
      sysRecall: mean(rows.map((r) => r.sysRecall)), sysNdcg: mean(rows.map((r) => r.sysNdcg)),
      excludedAt10: mean(rows.map((r) => r.excludedAt10)),
      violations: rows.reduce((s, r) => s + r.violations, 0), results: rows.reduce((s, r) => s + r.results, 0),
    });
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
  const totalViolations = variantRows.reduce((s, r) => s + r.violations, 0);
  const results = {
    date: new Date().toISOString().slice(0, 10),
    profiles: profiles.length,
    cancerTypes: new Set(profiles.map((p) => p.answers.cancerType)).size,
    states: new Set(profiles.map((p) => p.answers.zip.slice(0, 3))).size,
    keyword: { recall10: kwRecall, ndcg10: kwNdcg },
    variants: variantRows,
    hardFilterViolationRate: totalViolations / Math.max(1, variantRows.reduce((s, r) => s + r.results, 0)),
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

> **Synthetic, provisional.** ${profiles.length} synthetic patient profiles (not real people) across ${results.cancerTypes} cancer types and ${results.states} ZIP regions. Relevance labels come from hand-written per-profile rules over trial titles and conditions (\`scripts/eval/make-labels.ts\`), independent of the criteria facts and embeddings being evaluated, and are **not clinician-reviewed**. Treat the numbers as a regression baseline, not a clinical accuracy claim.

## Safety: hard filters
- **Hard-filter violation rate: ${pc(results.hardFilterViolationRate)}** (${totalViolations} violations in ${variantRows.reduce((s, r) => s + r.results, 0)} returned results across all variants). Every returned trial was re-checked independently for cancer type, age range, and travel distance.

## Retrieval (recall@10 and nDCG@10, mean over profiles)
- Keyword only (BM25, MiniSearch): recall@10 **${f3(kwRecall)}**, nDCG@10 **${f3(kwNdcg)}**

| Embedding variant | Emb. recall@10 | Emb. nDCG@10 | Hybrid recall@10 | Hybrid nDCG@10 | Full pipeline recall@10 | Full pipeline nDCG@10 | Excluded-label share of top 10 |
|---|---|---|---|---|---|---|---|
${table}

"Hybrid" = BM25 + embeddings fused with Reciprocal Rank Fusion (k = 60). "Full pipeline" = hybrid + rule-based pre-check scoring (what the app ranks with before AI). "Excluded-label share" = fraction of the top 10 that the labels mark as a clear mismatch (lower is better).

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
  if (totalViolations > 0) {
    console.error("Hard-filter violations found");
    process.exit(1);
  }
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
