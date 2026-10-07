import type { LatLon } from "@/lib/geo/distance";
import type { IntakeAnswers } from "@/lib/types/intake";
import type { Site, TrialCard } from "@/lib/types/trial";
import type { RankedTrial, SearchOutcome } from "@/lib/types/match";
import { cosineSimilarity } from "./cosine";
import type { FactPolicyMap, QuestionDef } from "@/lib/types/questionnaire";
import type { PrecheckNote } from "@/lib/types/match";
import { compileState, hardFilters } from "@/lib/questionnaire/rules";
import { nearestSite, passesAge, passesDistance, passesGroup, passesSex } from "./filters";
import { reciprocalRankFusion } from "./rrf";
import { answerEvaluator, precheck } from "./precheck";
import { finalScore, normalizeRrf, phaseBonus, precheckPenalty } from "./score";

/** How many results are kept for AI analysis (the UI shows 10, then "show more"). */
export const TOP_N = 15;

export interface RankEntry {
  card: TrialCard;
  sites: Site[];
  /** The trial's stored (int8) embedding. */
  vector: ArrayLike<number>;
}

export type RankAnswers = Pick<IntakeAnswers, "cancerType" | "age" | "travelMiles" | "language" | "spread" | "treatments" | "biomarkers" | "pregnant" | "inAnotherTrial" | "questionnaire">;

/** v2 questionnaire matching context: the catalog (and fact policy) that give answers their meaning. */
export interface MatchContext {
  catalog?: readonly QuestionDef[];
  policy?: FactPolicyMap;
}

/**
 * Pre-check for either intake, prepared once per search: the v2 questionnaire (catalog-driven, answers compiled a
 * single time, plus the phase preference) when a questionnaire state and catalog are present, else the v1
 * fixed-flow `precheck`. Also returns the definite-sex hard filter (null = no filter), read from the same
 * compiled answers.
 */
export function prepareMatching(answers: RankAnswers, ctx: MatchContext = {}): { precheck: (card: Pick<TrialCard, "facts" | "phases">) => { notes: PrecheckNote[]; phase: number }; sex: "FEMALE" | "MALE" | null } {
  const state = answers.questionnaire;
  if (state && ctx.catalog) {
    const compiled = compileState(state, ctx.catalog);
    const evaluate = answerEvaluator(compiled, ctx.policy);
    const pref = state.answers["phase_pref"];
    const prefId = typeof pref === "string" ? pref : null;
    return { precheck: (card) => ({ notes: evaluate(card.facts), phase: phaseBonus(prefId, card.phases) }), sex: hardFilters(compiled).sex ?? null };
  }
  return { precheck: (card) => ({ notes: precheck(answers, card.facts), phase: 0 }), sex: null };
}

/** Per-trial pre-check for either intake (see `prepareMatching`; use that when checking many trials). */
export function trialPrecheck(answers: RankAnswers, card: Pick<TrialCard, "facts" | "phases">, ctx: MatchContext = {}): { notes: PrecheckNote[]; phase: number } {
  return prepareMatching(answers, ctx).precheck(card);
}

/** The definite-sex hard filter from the questionnaire (null = no filter). */
export function sexFilter(answers: RankAnswers, ctx: MatchContext = {}): "FEMALE" | "MALE" | null {
  return prepareMatching(answers, ctx).sex;
}

export interface RankInput extends MatchContext {
  entries: RankEntry[];
  answers: RankAnswers;
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
 * Hard filters are absolute: a trial failing group, age, distance, or a definite sex never appears.
 */
export function rankTrials(input: RankInput): SearchOutcome {
  const { answers, origin } = input;
  const maxMiles = origin ? answers.travelMiles : null;
  const matching = prepareMatching(answers, input);
  const sex = matching.sex;

  // 1. Hard filters.
  const candidates = new Map<string, RankEntry & { nearest: ReturnType<typeof nearestSite> }>();
  for (const e of input.entries) {
    if (candidates.has(e.card.id)) continue; // a trial can appear in several shard parts
    if (!passesGroup(e.card, answers.cancerType) || !passesAge(e.card, answers.age) || !passesSex(e.card, sex)) continue;
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

  // 4. Pre-check (v1 rules or the v2 catalog) + final score.
  const ranked: RankedTrial[] = fused.map((f) => {
    const c = candidates.get(f.id) as RankEntry & { nearest: ReturnType<typeof nearestSite> };
    const { notes, phase } = matching.precheck(c.card);
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
        phaseBonus: phase,
        final: finalScore({ retrieval, precheck: notes, fit: null, phase }),
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
