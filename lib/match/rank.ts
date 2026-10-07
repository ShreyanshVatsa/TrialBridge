import type { LatLon } from "@/lib/geo/distance";
import type { IntakeAnswers } from "@/lib/types/intake";
import type { Site, TrialCard } from "@/lib/types/trial";
import type { RankedTrial, SearchOutcome } from "@/lib/types/match";
import { cosineSimilarity } from "./cosine";
import { nearestSite, passesAge, passesDistance, passesGroup } from "./filters";
import { reciprocalRankFusion } from "./rrf";
import { precheck } from "./precheck";
import { finalScore, normalizeRrf, precheckPenalty } from "./score";

/** How many results are kept for AI analysis (the UI shows 10, then "show more"). */
export const TOP_N = 15;

export interface RankEntry {
  card: TrialCard;
  sites: Site[];
  /** The trial's stored (int8) embedding. */
  vector: ArrayLike<number>;
}

export interface RankInput {
  entries: RankEntry[];
  answers: Pick<IntakeAnswers, "cancerType" | "age" | "travelMiles" | "language" | "spread" | "treatments" | "biomarkers" | "pregnant" | "inAnotherTrial">;
  /** User's ZIP centroid; null if unknown (distance filter is then skipped). */
  origin: LatLon | null;
  /** BM25 keyword search returning trial IDs best-first. */
  keywordSearch: (ids: ReadonlySet<string>) => string[];
  /** Profile embedding; null => keyword-only ranking. */
  queryVector: ArrayLike<number> | null;
  limit?: number;
}

/**
 * Pure ranking pipeline: hard filters -> BM25 + cosine rankings -> RRF -> rule pre-check -> score.
 * Hard filters are absolute: a trial failing group, age, or distance never appears.
 */
export function rankTrials(input: RankInput): SearchOutcome {
  const { answers, origin } = input;
  const maxMiles = origin ? answers.travelMiles : null;

  // 1. Hard filters.
  const candidates = new Map<string, RankEntry & { nearest: ReturnType<typeof nearestSite> }>();
  for (const e of input.entries) {
    if (candidates.has(e.card.id)) continue; // a trial can appear in several shard parts
    if (!passesGroup(e.card, answers.cancerType) || !passesAge(e.card, answers.age)) continue;
    const nearest = nearestSite(e.sites, origin);
    if (!passesDistance(nearest, maxMiles)) continue;
    candidates.set(e.card.id, { ...e, nearest });
  }
  const ids = new Set(candidates.keys());

  // 2. Two independent rankings over the candidates.
  const keywordRanking = input.keywordSearch(ids).filter((id) => ids.has(id));
  const rankings: string[][] = [keywordRanking];
  if (input.queryVector) {
    const q = input.queryVector;
    const vectorRanking = [...candidates.values()]
      .map((c) => ({ id: c.card.id, sim: cosineSimilarity(q, c.vector) }))
      .sort((a, b) => b.sim - a.sim || a.id.localeCompare(b.id))
      .map((x) => x.id);
    rankings.push(vectorRanking);
  }

  // 3. Fuse with RRF; candidates found by neither method still appear (score 0) after the rest.
  const fused = reciprocalRankFusion(rankings);
  const fusedIds = new Set(fused.map((f) => f.id));
  for (const id of [...ids].sort()) if (!fusedIds.has(id)) fused.push({ id, score: 0, ranks: rankings.map(() => null) });

  // 4. Pre-check + final score.
  const ranked: RankedTrial[] = fused.map((f) => {
    const c = candidates.get(f.id) as RankEntry & { nearest: ReturnType<typeof nearestSite> };
    const notes = precheck(answers, c.card.facts);
    const retrieval = normalizeRrf(f.score, rankings.length);
    return {
      card: c.card,
      sites: c.sites,
      nearest: c.nearest,
      languageWarning: answers.language !== "en" && c.card.barriers.some((b) => b.type === "english_required"),
      precheck: notes,
      scores: {
        keywordRank: f.ranks[0] ?? null,
        vectorRank: f.ranks[1] ?? null,
        rrf: f.score,
        retrieval,
        precheckPenalty: precheckPenalty(notes),
        fit: null,
        final: finalScore({ retrieval, precheck: notes, fit: null }),
      },
      analysis: null,
    };
  });
  ranked.sort((a, b) => b.scores.final - a.scores.final || b.scores.rrf - a.scores.rrf || a.card.id.localeCompare(b.card.id));

  return {
    results: ranked.slice(0, input.limit ?? TOP_N),
    candidateCount: candidates.size,
    searchedCount: new Set(input.entries.map((e) => e.card.id)).size,
    keywordOnly: !input.queryVector,
  };
}
