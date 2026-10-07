/**
 * Browser search orchestration (client-only): load shard(s) + ZIP centroid + profile embedding
 * in parallel, then run the pure ranking pipeline (rank.ts). Nothing leaves the browser.
 */
import MiniSearch from "minisearch";
import { IntakeAnswersSchema, type IntakeAnswers } from "@/lib/types/intake";
import type { SearchOutcome, SearchProgress } from "@/lib/types/match";
import { loadLiteShard, loadManifest, loadShard, loadTrials, lookupZip } from "@/lib/data/loader";
import { hydrateResults, liteToEntries } from "./lite";
import { MINISEARCH_OPTIONS, MINISEARCH_SEARCH, type SearchDoc } from "./minisearch-config";
import { buildProfileText } from "./query";
import { embedProfile } from "./embedder";
import { rankTrials, type MatchContext, type RankEntry } from "./rank";
import { FACT_POLICY, getCatalog } from "@/config/questionnaire";

export { applyAnalysis } from "./apply";

const indexCache = new Map<string, MiniSearch<SearchDoc>>();
function getIndex(shard: { info: { id: string }; indexJson: string }): MiniSearch<SearchDoc> {
  let idx = indexCache.get(shard.info.id);
  if (!idx) {
    idx = MiniSearch.loadJSON<SearchDoc>(shard.indexJson, MINISEARCH_OPTIONS);
    indexCache.set(shard.info.id, idx);
  }
  return idx;
}

export interface SearchOptions extends MatchContext {
  onProgress?: (p: SearchProgress) => void;
  signal?: AbortSignal;
}

/** Catalog + fact policy that give questionnaire answers their meaning (explicit options win). */
function matchContext(a: IntakeAnswers, opts: SearchOptions): MatchContext {
  if (!a.questionnaire) return {};
  return { catalog: opts.catalog ?? getCatalog("cancer", a.cancerType), policy: opts.policy ?? FACT_POLICY };
}

export async function searchTrials(answers: IntakeAnswers, opts: SearchOptions = {}): Promise<SearchOutcome> {
  const a = IntakeAnswersSchema.parse(answers);
  const report = opts.onProgress ?? (() => undefined);
  const ctx = matchContext(a, opts);
  const queryText = buildProfileText(a, ctx.catalog);

  report({ stage: "loading_shards", fraction: 0 });
  const manifest = await loadManifest();
  const dims = manifest.embedding.dims;
  const shardIds = a.cancerType === "other" ? [manifest.allShard] : (manifest.groups[a.cancerType] ?? []);
  const infos = manifest.shards.filter((s) => shardIds.includes(s.id));
  if (infos.length === 0) return { results: [], candidateCount: 0, searchedCount: 0, keywordOnly: false };

  // Start the embedding immediately; it runs in the worker while shards download.
  let modelFraction = 0;
  const vectorPromise = embedProfile(queryText, {
    ...(opts.signal ? { signal: opts.signal } : {}),
    onProgress: (f) => {
      modelFraction = f;
    },
  });

  const shardFractions = infos.map(() => 0);
  const signalOpt = opts.signal ? { signal: opts.signal } : {};
  const progressFor = (i: number) => (f: number) => {
    shardFractions[i] = f;
    report({ stage: "loading_shards", fraction: shardFractions.reduce((x, y) => x + y, 0) / infos.length });
  };
  const [shards, origin] = await Promise.all([
    Promise.all(
      infos.map(async (info, i) => {
        if (info.kind === "lite") {
          const lite = await loadLiteShard(info, manifest.shardBase, { ...signalOpt, onProgress: progressFor(i) });
          return { info, indexJson: lite.indexJson, entries: liteToEntries(lite, dims) };
        }
        const s = await loadShard(info, manifest.shardBase, { ...signalOpt, onProgress: progressFor(i) });
        const entries: RankEntry[] = s.cards.map((card, j) => ({ card, sites: s.sites[card.id] ?? [], vector: s.embeddings.subarray(j * dims, (j + 1) * dims) }));
        return { info, indexJson: s.indexJson, entries };
      }),
    ),
    lookupZip(a.zip, signalOpt).catch(() => null),
  ]);

  report({ stage: "loading_model", fraction: modelFraction });
  const vector = await vectorPromise;
  if (opts.signal?.aborted) throw opts.signal.reason;

  report({ stage: "ranking" });
  const entries: RankEntry[] = shards.flatMap((s) => s.entries);
  const indexes = shards.map(getIndex);
  const keywordSearch = (ids: ReadonlySet<string>) => {
    const scores = new Map<string, number>();
    for (const idx of indexes) {
      for (const r of idx.search(queryText, { ...MINISEARCH_SEARCH, filter: (res) => ids.has(String(res.id)) })) {
        const id = String(r.id);
        scores.set(id, Math.max(scores.get(id) ?? 0, r.score));
      }
    }
    return [...scores.entries()].sort((x, y) => y[1] - x[1] || x[0].localeCompare(y[0])).map(([id]) => id);
  };

  let outcome = rankTrials({ entries, answers: a, origin, keywordSearch, queryVector: vector, ...ctx });
  if (infos.some((i) => i.kind === "lite")) {
    // Lite index: load full cards for just the top results from per-trial buckets.
    const full = await loadTrials(outcome.results.map((r) => r.card.id), signalOpt);
    outcome = hydrateResults(outcome, full, a, origin, ctx);
  }
  // Never drop the distance limit silently: tell the UI when it could not be applied.
  if (a.travelMiles !== null && !origin) outcome = { ...outcome, distanceUnavailable: true };
  if (origin && "approximate" in origin && origin.approximate) outcome = { ...outcome, zipApproximate: true };
  report({ stage: "done" });
  return outcome;
}

/**
 * Warm caches while the user is still answering intake questions: download the shard(s) for the
 * chosen cancer type and load the embedding model in the worker. Safe to call repeatedly; never
 * throws. Nothing about the user is sent anywhere (only static files are fetched).
 */
export function prefetchSearch(cancerType: IntakeAnswers["cancerType"]): void {
  void (async () => {
    try {
      embedProfile("warm up", { timeoutMs: 120_000 }).catch(() => null);
      const manifest = await loadManifest();
      const ids = cancerType === "other" ? [manifest.allShard] : (manifest.groups[cancerType] ?? []);
      await Promise.all(
        manifest.shards
          .filter((s) => ids.includes(s.id))
          .map((info) => (info.kind === "lite" ? loadLiteShard(info, manifest.shardBase) : loadShard(info, manifest.shardBase))),
      );
    } catch {
      /* best effort: the real search retries and reports errors */
    }
  })();
}
