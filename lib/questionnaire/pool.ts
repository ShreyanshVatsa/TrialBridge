/**
 * Candidate pool for the adaptive questionnaire (QUESTIONNAIRE_SPEC §2.1). Built right after the essentials:
 * hard filters (group, age, distance) over the loaded shard plus a BM25-only prior relevance over the current
 * profile text. No embeddings, so it takes milliseconds and the live counter can appear immediately.
 * Sex is NOT applied here: it is a live hard filter (liveCount / scoring), so editing it never needs a rebuild.
 * Client-only; nothing leaves the browser (only static shard files are fetched).
 */
import MiniSearch from "minisearch";
import type { CancerGroupId } from "@/config/cancer-groups";
import { loadLiteShard, loadManifest, loadShard, lookupZip } from "@/lib/data/loader";
import type { LatLon } from "@/lib/geo/distance";
import { nearestSite, passesAge, passesDistance, passesGroup } from "@/lib/match/filters";
import { liteToEntries } from "@/lib/match/lite";
import { MINISEARCH_OPTIONS, MINISEARCH_SEARCH, type SearchDoc } from "@/lib/match/minisearch-config";
import { buildProfileText } from "@/lib/match/query";
import type { RankEntry } from "@/lib/match/rank";
import type { QuestionDef, QuestionnaireState } from "@/lib/types/questionnaire";
import type { Site, TrialCard } from "@/lib/types/trial";
import { Q_AGE, Q_TRAVEL } from "./constants";
import type { CandidatePool, PoolTrial } from "./engine";
import { travelMiles } from "./adapter";
import { groupOf } from "./rules";

export interface PoolEntry {
  card: Pick<TrialCard, "id" | "groups" | "minAge" | "maxAge" | "sex" | "facts">;
  sites: Site[];
}

/**
 * Pure core: hard filters + normalized BM25 prior. `bm25` returns raw keyword scores for the given candidate
 * ids; prior = score / best score (0 when the keyword search did not find the trial).
 */
export function poolFromEntries(input: {
  entries: readonly PoolEntry[];
  state: QuestionnaireState;
  origin: LatLon | null;
  bm25: (ids: ReadonlySet<string>) => ReadonlyMap<string, number>;
}): CandidatePool {
  const { state, origin } = input;
  const group = groupOf(state);
  if (!group) throw new Error("cancer_type must be answered before building the pool");
  const age = state.answers[Q_AGE];
  const maxMiles = origin ? travelMiles(state.answers[Q_TRAVEL]) : null;
  const kept = new Map<string, PoolEntry>();
  for (const e of input.entries) {
    if (kept.has(e.card.id) || !passesGroup(e.card, group)) continue;
    if (typeof age === "number" && !passesAge(e.card, age)) continue;
    if (!passesDistance(nearestSite(e.sites, origin), maxMiles)) continue;
    kept.set(e.card.id, e);
  }
  const scores = input.bm25(new Set(kept.keys()));
  const best = Math.max(0, ...scores.values());
  const trials: PoolTrial[] = [...kept.values()].map((e) => ({
    id: e.card.id,
    prior: best > 0 ? (scores.get(e.card.id) ?? 0) / best : 0,
    facts: e.card.facts,
    sex: e.card.sex,
  }));
  return { group, trials };
}

const indexCache = new Map<string, MiniSearch<SearchDoc>>();

/**
 * Load the group's shard(s) (already prefetched after cancer_type in the usual flow) and the ZIP centroid,
 * then build the pool. Call it again after answers change to refresh the BM25 prior; shards are cached.
 */
export async function buildCandidatePool(state: QuestionnaireState, opts: { signal?: AbortSignal; catalog?: readonly QuestionDef[] } = {}): Promise<CandidatePool> {
  const group = groupOf(state) as CancerGroupId;
  const zip = state.answers["zip"];
  const signalOpt = opts.signal ? { signal: opts.signal } : {};
  const manifest = await loadManifest();
  const ids = group === "other" ? [manifest.allShard] : (manifest.groups[group] ?? []);
  const infos = manifest.shards.filter((s) => ids.includes(s.id));
  const [shards, origin] = await Promise.all([
    Promise.all(
      infos.map(async (info) => {
        if (info.kind === "lite") {
          const lite = await loadLiteShard(info, manifest.shardBase, signalOpt);
          return { id: info.id, indexJson: lite.indexJson, entries: liteToEntries(lite, manifest.embedding.dims) as PoolEntry[] };
        }
        const s = await loadShard(info, manifest.shardBase, signalOpt);
        return { id: info.id, indexJson: s.indexJson, entries: s.cards.map((card): PoolEntry => ({ card, sites: s.sites[card.id] ?? [] })) };
      }),
    ),
    typeof zip === "string" ? lookupZip(zip, signalOpt).catch(() => null) : Promise.resolve(null),
  ]);
  if (opts.signal?.aborted) throw opts.signal.reason;
  const text = buildProfileText({ cancerType: group, spread: "not_sure", treatments: ["not_sure"], biomarkers: {}, questionnaire: state }, opts.catalog ?? []);
  const indexes = shards.map((s) => {
    let idx = indexCache.get(s.id);
    if (!idx) {
      idx = MiniSearch.loadJSON<SearchDoc>(s.indexJson, MINISEARCH_OPTIONS);
      indexCache.set(s.id, idx);
    }
    return idx;
  });
  const bm25 = (candidates: ReadonlySet<string>) => {
    const scores = new Map<string, number>();
    for (const idx of indexes)
      for (const r of idx.search(text, { ...MINISEARCH_SEARCH, filter: (res) => candidates.has(String(res.id)) })) scores.set(String(r.id), Math.max(scores.get(String(r.id)) ?? 0, r.score));
    return scores;
  };
  return poolFromEntries({ entries: shards.flatMap((s) => s.entries as RankEntry[] | PoolEntry[]), state, origin, bm25 });
}
