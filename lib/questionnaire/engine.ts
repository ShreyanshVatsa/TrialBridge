/**
 * Adaptive questionnaire engine (QUESTIONNAIRE_SPEC §2, contract C3). Pure and deterministic: no I/O
 * except the three session helpers at the bottom (tab-scoped sessionStorage).
 *
 * Flow: the four essentials in fixed order (they are hard filters), then repeatedly the question with the
 * highest utility U(q) = IG(q) / cost(q) × tierFactor, where IG is the expected information gain about which
 * of the current top-K candidate trials fit, until a stop rule fires.
 *
 *   p(t)      ∝ exp(score_t / TAU) over the TOP_K best-scoring candidates
 *   L(t, a)   = e^-LAMBDA if answer a conflicts with trial t, e^+MU if it supports it, else 1
 *   p_a(t)    ∝ p(t) · L(t, a)
 *   IG(q)     = H(p) − Σ_a P(a) · H(p_a)        with P(a) from catalog priors; P(unknown) adds zero gain
 *
 * Unknown answers compile to nothing (rules.ts), so they never change scores, filters or counters.
 */
import type { CancerGroupId } from "@/config/cancer-groups";
import { precheckBonus, precheckPenalty } from "@/lib/match/score";
import {
  DEFER,
  PREFER_NOT,
  QuestionnaireStateSchema,
  UNKNOWN,
  type AnswerValue,
  type FactPolicyMap,
  type FindOutDef,
  type FindOutEntry,
  type QuestionDef,
  type QuestionnaireState,
} from "@/lib/types/questionnaire";
import {
  DEFAULT_BIOMARKER_PRIOR,
  DEFAULT_P_UNKNOWN,
  ESSENTIAL_ORDER,
  FAMILY_DOWNWEIGHT,
  HARD_EXCLUDED_LIKELIHOOD,
  HIGH_UNKNOWN_PRIOR,
  LAMBDA,
  MU,
  Q_SEX,
  SESSION_KEY,
  SESSION_MAX_AGE_MS,
  SEX_ASK_MIN_SHARE,
  STOP_RULES,
  TAU,
  TIER_FACTOR,
  TOP_K,
  UNKNOWN_STREAK,
} from "./constants";
import {
  activeQuestions,
  appliesToGroup,
  applyPolicy,
  compileAnswer,
  compileState,
  factRelation,
  groupOf,
  hardFilters,
  isNonResponse,
  isNonResponseId,
  passesHardFilters,
  prerequisitesHold,
  type CompactFact,
  type CompiledAnswer,
} from "./rules";

export type { CompactFact } from "./rules";

/** One candidate trial after the essentials' hard filters (group, age, distance). Sex is applied live. */
export interface PoolTrial {
  id: string;
  /** Prior relevance 0..1 (BM25 over the current profile text, normalized by the best score). */
  prior: number;
  facts: readonly CompactFact[];
  sex: "ALL" | "FEMALE" | "MALE";
}
export interface CandidatePool {
  group: CancerGroupId;
  trials: ReadonlyArray<PoolTrial>;
}

export type DoneReason = "small_set" | "low_gain" | "max_questions" | "exhausted";
export type NextStep =
  /** impact.total = trials with no likely conflict now; narrowedTo = "could narrow N to about M" (null = no change). */
  | { kind: "ask"; question: QuestionDef; utility: number; impact: { total: number; narrowedTo: number | null } }
  | { kind: "done"; reason: DoneReason };

export interface EngineOptions {
  /** FACT_POLICY (config/questionnaire/fact-policy.ts): penalize=false families never conflict. */
  policy?: FactPolicyMap;
}

export type Mode = QuestionnaireState["mode"];

// ---------------------------------------------------------------------------------------------
// State

export function createState(mode: Mode = "quick", now: number = Date.now()): QuestionnaireState {
  return { v: 2, area: "cancer", mode, answers: {}, history: [], deferred: [], updatedAt: now };
}

/** Switch quick/thorough at any time ("Add more detail for better matches"). */
export function setMode(state: QuestionnaireState, mode: Mode, now: number = Date.now()): QuestionnaireState {
  return { ...state, mode, updatedAt: now };
}

const ESSENTIALS: readonly string[] = ESSENTIAL_ORDER;
function isEssential(q: QuestionDef | undefined, id: string): boolean {
  return ESSENTIALS.includes(id) || q?.tier === "essential";
}

function without<T>(rec: Readonly<Record<string, T>> | undefined, key: string): Record<string, T> {
  const out: Record<string, T> = {};
  for (const [k, v] of Object.entries(rec ?? {})) if (k !== key) out[k] = v;
  return out;
}

function removeQuestion(state: QuestionnaireState, id: string): QuestionnaireState {
  const next: QuestionnaireState = {
    ...state,
    answers: without(state.answers, id),
    history: state.history.filter((x) => x !== id),
    deferred: state.deferred.filter((x) => x !== id),
  };
  if (state.gains) next.gains = without(state.gains, id);
  return next;
}

/**
 * Record an answer. `DEFER` ("My doctor can fill this in later") stores null and lists the question under
 * `deferred`; it counts as unknown for matching. Editing an earlier answer keeps its place in the history
 * and drops later answers whose prerequisites no longer hold (cascading), returned in `dropped` so the UI
 * can say so. `opts.gain` (the step's utility) orders the Find-out list.
 */
export function applyAnswer(
  state: QuestionnaireState,
  q: string,
  value: AnswerValue,
  catalog: readonly QuestionDef[],
  opts: { gain?: number; now?: number } = {},
): { state: QuestionnaireState; dropped: string[] } {
  const deferring = value === DEFER;
  let next: QuestionnaireState = {
    ...state,
    answers: { ...state.answers, [q]: deferring ? null : value },
    history: state.history.includes(q) ? [...state.history] : [...state.history, q],
    deferred: deferring ? [...state.deferred.filter((x) => x !== q), q] : state.deferred.filter((x) => x !== q),
    updatedAt: opts.now ?? Date.now(),
  };
  if (opts.gain !== undefined && Number.isFinite(opts.gain) && opts.gain >= 0) next.gains = { ...state.gains, [q]: opts.gain };

  const dropped: string[] = [];
  for (let changed = true; changed; ) {
    changed = false;
    const group = groupOf(next);
    for (const d of catalog) {
      if (d.id === q || next.answers[d.id] === undefined || isEssential(d, d.id)) continue;
      if (!appliesToGroup(d, group) || !prerequisitesHold(d, next)) {
        next = removeQuestion(next, d.id);
        dropped.push(d.id);
        changed = true;
      }
    }
  }
  return { state: next, dropped };
}

/**
 * Back: remove the most recent question from the history and its answer from the state, and return it with
 * the previous answer for pre-filling. Because the engine is deterministic, nextQuestion on the returned
 * state asks that same question again.
 */
export function goBack(state: QuestionnaireState, now: number = Date.now()): { state: QuestionnaireState; question: string | null; previous: AnswerValue | undefined } {
  const last = state.history[state.history.length - 1];
  if (last === undefined) return { state, question: null, previous: undefined };
  const prev = state.answers[last];
  const previous = prev === null && state.deferred.includes(last) ? DEFER : prev;
  return { state: { ...removeQuestion(state, last), updatedAt: now }, question: last, previous };
}

// ---------------------------------------------------------------------------------------------
// Scoring the pool

interface Scored {
  t: PoolTrial;
  score: number;
  conflict: boolean;
  support: boolean;
}

/** Trial-level relation of compiled answers: any conflicting fact => conflict, else any support => support. */
function trialRelation(compiled: readonly CompiledAnswer[], facts: readonly CompactFact[], policy: FactPolicyMap | undefined) {
  let conflict = false;
  let support = false;
  const notes: Array<{ key: CompactFact["key"]; kind: "conflict" | "support"; value: CompactFact["value"]; source?: "rule" | "llm"; confidence?: number }> = [];
  for (const f of facts) {
    const rel = applyPolicy(factRelation(compiled, f), f.key, policy);
    if (rel === "neutral") continue;
    if (rel === "conflict") conflict = true;
    else support = true;
    notes.push({ key: f.key, kind: rel, value: f.value, ...(f.source ? { source: f.source } : {}), ...(f.confidence !== undefined ? { confidence: f.confidence } : {}) });
  }
  return { conflict, support, notes };
}

/** Score every pool trial that passes the live hard filters (definite sex) under the current answers. */
function scorePool(state: QuestionnaireState, pool: CandidatePool, catalog: readonly QuestionDef[], policy: FactPolicyMap | undefined): Scored[] {
  const compiled = compileState(state, catalog).filter((c) => c.rules.size > 0 || c.hardFilter);
  const filters = hardFilters(compiled);
  const out: Scored[] = [];
  for (const t of pool.trials) {
    if (!passesHardFilters(t.sex, filters)) continue;
    const r = trialRelation(compiled, t.facts, policy);
    out.push({ t, score: t.prior - precheckPenalty(r.notes) + precheckBonus(r.notes), conflict: r.conflict, support: r.support });
  }
  return out;
}

/**
 * Live counter: "N possible trials near you · M with no likely conflicts". Hard filters change `total`;
 * definite answers change `noConflict`. Unknown answers change neither.
 */
export function liveCount(state: QuestionnaireState, pool: CandidatePool, catalog: readonly QuestionDef[], opts: EngineOptions = {}): { total: number; noConflict: number; supported: number } {
  const scored = scorePool(state, pool, catalog, opts.policy);
  let noConflict = 0;
  let supported = 0;
  for (const s of scored) {
    if (s.conflict) continue;
    noConflict++;
    if (s.support) supported++;
  }
  return { total: scored.length, noConflict, supported };
}

// ---------------------------------------------------------------------------------------------
// Information gain

/** Shannon entropy in bits. */
export function entropy(p: readonly number[]): number {
  let h = 0;
  for (const x of p) if (x > 0) h -= x * Math.log2(x);
  return h;
}

/** Softmax of scores / TAU (max-shifted for numerical stability). */
export function softmax(scores: readonly number[], tau: number = TAU): number[] {
  if (scores.length === 0) return [];
  const m = Math.max(...scores);
  const e = scores.map((s) => Math.exp((s - m) / tau));
  const z = e.reduce((a, b) => a + b, 0);
  return e.map((x) => x / z);
}

interface Hypothesis {
  value: AnswerValue;
  p: number;
}

/** Definite answer hypotheses with P(a), grouped into independent sub-questions (one per biomarker). */
function hypotheses(q: QuestionDef, group: CancerGroupId): Hypothesis[][] {
  const priors = q.priors?.[group];
  if (q.type === "biomarker_grid") {
    return (q.biomarkers ?? []).map((m) => {
      const pos = priors?.[`${m}:positive`] ?? DEFAULT_BIOMARKER_PRIOR.positive;
      const neg = priors?.[`${m}:negative`] ?? DEFAULT_BIOMARKER_PRIOR.negative;
      const unk = priors?.[`${m}:unknown`] ?? priors?.[UNKNOWN] ?? DEFAULT_BIOMARKER_PRIOR.unknown;
      const z = pos + neg + unk || 1;
      return [
        { value: { [m]: "positive" }, p: pos / z },
        { value: { [m]: "negative" }, p: neg / z },
      ];
    });
  }
  if (q.type !== "single" && q.type !== "multi") return [];
  const definite = (q.options ?? []).map((o) => o.id).filter((id) => !isNonResponseId(id));
  if (definite.length === 0) return [[]];
  const asValue = (id: string): AnswerValue => (q.type === "multi" ? [id] : id);
  if (!priors) {
    const each = (1 - DEFAULT_P_UNKNOWN) / definite.length;
    return [definite.map((id) => ({ value: asValue(id), p: each }))];
  }
  const nonResp = Object.entries(priors).filter(([k]) => isNonResponseId(k)).reduce((s, [, v]) => s + v, 0);
  const z = definite.reduce((s, id) => s + (priors[id] ?? 0), 0) + nonResp || 1;
  return [definite.map((id) => ({ value: asValue(id), p: (priors[id] ?? 0) / z }))];
}

/** P(the patient cannot answer): explicit prior, the biomarker default, or DEFAULT_P_UNKNOWN. */
export function unknownPrior(q: QuestionDef, group: CancerGroupId): number {
  const subs = hypotheses(q, group);
  if (subs.length === 0) return 0;
  const per = subs.map((h) => 1 - h.reduce((s, x) => s + x.p, 0));
  return per.reduce((a, b) => a + b, 0) / per.length;
}

/** Likelihood of a hypothetical answer for one trial. */
function likelihood(c: CompiledAnswer, t: PoolTrial, policy: FactPolicyMap | undefined): number {
  if (c.hardFilter && !passesHardFilters(t.sex, c.hardFilter)) return HARD_EXCLUDED_LIKELIHOOD;
  const r = trialRelation([c], t.facts, policy);
  if (r.conflict) return Math.exp(-LAMBDA);
  if (r.support) return Math.exp(MU);
  return 1;
}

/** Expected information gain (bits) of asking q, over the top-K candidate distribution p. Never negative. */
export function informationGain(q: QuestionDef, group: CancerGroupId, top: readonly PoolTrial[], p: readonly number[], policy?: FactPolicyMap): number {
  if (top.length === 0) return 0;
  const h0 = entropy(p);
  let gain = 0;
  for (const sub of hypotheses(q, group)) {
    let g = 0;
    for (const h of sub) {
      if (h.p <= 0) continue;
      const c = compileAnswer(q, h.value);
      const post = top.map((t, i) => (p[i] ?? 0) * likelihood(c, t, policy));
      const z = post.reduce((a, b) => a + b, 0);
      const hp = z > 0 ? entropy(post.map((x) => x / z)) : 0;
      g += h.p * (h0 - hp);
    }
    // Floating-point noise below 1e-12 bits is not information (all likelihoods equal => exactly no gain).
    if (g > 1e-12) gain += g;
  }
  return gain;
}

/** "Answering this could narrow N trials to about M": M = min over definite answers of the no-conflict count. */
function impactOf(q: QuestionDef, group: CancerGroupId, scored: readonly Scored[], policy: FactPolicyMap | undefined) {
  const base = scored.filter((s) => !s.conflict);
  const total = base.length;
  let narrowed = total;
  for (const sub of hypotheses(q, group)) {
    for (const h of sub) {
      const c = compileAnswer(q, h.value);
      const m = base.filter((s) => (!c.hardFilter || passesHardFilters(s.t.sex, c.hardFilter)) && !trialRelation([c], s.t.facts, policy).conflict).length;
      narrowed = Math.min(narrowed, m);
    }
  }
  return { total, narrowedTo: narrowed < total ? narrowed : null };
}

// ---------------------------------------------------------------------------------------------
// Eligibility and stop rules

function asksSex(q: QuestionDef): boolean {
  return q.id === Q_SEX || q.effects.some((e) => e.hardFilter?.sex !== undefined);
}

/** Questions that may be asked now (adaptive phase): enabled, applicable, prerequisites met, unanswered, not deferred. */
export function eligibleQuestions(state: QuestionnaireState, pool: CandidatePool | null, catalog: readonly QuestionDef[]): QuestionDef[] {
  const group = groupOf(state);
  const out: QuestionDef[] = [];
  let sexShare: number | null = null;
  for (const q of catalog) {
    if (!q.enabled || isEssential(q, q.id)) continue;
    if (state.answers[q.id] !== undefined || state.deferred.includes(q.id)) continue;
    if (!appliesToGroup(q, group) || !prerequisitesHold(q, state)) continue;
    if (asksSex(q)) {
      // Ask sex only when it can matter: >= 5% of current candidates are sex-restricted.
      if (sexShare === null) {
        const trials = pool?.trials ?? [];
        sexShare = trials.length === 0 ? 0 : trials.filter((t) => t.sex !== "ALL").length / trials.length;
      }
      if (sexShare < SEX_ASK_MIN_SHARE) continue;
    }
    out.push(q);
  }
  return out;
}

/** Number of "don't know"-type answers in a row at the end of the history, and their kind. */
function unknownStreak(state: QuestionnaireState, byId: ReadonlyMap<string, QuestionDef>): { family: string | null; count: number } {
  let family: string | null = null;
  let count = 0;
  for (let i = state.history.length - 1; i >= 0; i--) {
    const id = state.history[i] as string;
    const q = byId.get(id);
    if (!q || isEssential(q, id)) break;
    if (family !== null && q.type !== family) break;
    const v = state.answers[id];
    let n = 0;
    if (isNonResponse(v)) n = q.type === "biomarker_grid" && v && typeof v === "object" ? Math.max(1, Object.keys(v).length) : 1;
    if (n === 0) break;
    family = q.type;
    count += n;
  }
  return { family, count };
}

function adaptiveAsked(state: QuestionnaireState, byId: ReadonlyMap<string, QuestionDef>): number {
  return state.history.filter((id) => !isEssential(byId.get(id), id)).length;
}

/** The first unanswered essential (fixed order), if any. */
function nextEssential(state: QuestionnaireState, catalog: readonly QuestionDef[]): QuestionDef | null {
  const byId = new Map(catalog.map((q) => [q.id as string, q]));
  const ordered = [...ESSENTIALS.map((id) => byId.get(id)).filter((q): q is QuestionDef => q !== undefined), ...catalog.filter((q) => q.tier === "essential" && !ESSENTIALS.includes(q.id))];
  const group = groupOf(state);
  for (const q of ordered) {
    if (state.answers[q.id] !== undefined && state.answers[q.id] !== null) continue;
    if (!ESSENTIALS.includes(q.id) && (!appliesToGroup(q, group) || !prerequisitesHold(q, state))) continue;
    return q;
  }
  return null;
}

/** Utility of each eligible question now (for tests, debugging and the "about N more" estimate). */
export function rankQuestions(state: QuestionnaireState, pool: CandidatePool, catalog: readonly QuestionDef[], opts: EngineOptions = {}): Array<{ question: QuestionDef; gain: number; utility: number }> {
  const group = groupOf(state) ?? pool.group;
  const byId = new Map(catalog.map((q) => [q.id as string, q]));
  const scored = scorePool(state, pool, catalog, opts.policy);
  const top = [...scored].sort((a, b) => b.score - a.score || a.t.id.localeCompare(b.t.id)).slice(0, TOP_K);
  const p = softmax(top.map((s) => s.score));
  const trials = top.map((s) => s.t);
  const streak = unknownStreak(state, byId);
  const out: Array<{ question: QuestionDef; gain: number; utility: number }> = [];
  for (const q of eligibleQuestions(state, pool, catalog)) {
    const gain = informationGain(q, group, trials, p, opts.policy);
    let utility = (gain / q.cost) * TIER_FACTOR[state.mode][q.tier];
    if (streak.count >= UNKNOWN_STREAK && streak.family === q.type && unknownPrior(q, group) >= HIGH_UNKNOWN_PRIOR) utility *= FAMILY_DOWNWEIGHT;
    out.push({ question: q, gain, utility });
  }
  return out;
}

/**
 * The next step: an essential (fixed order), else the eligible question with the highest utility (ties broken
 * by catalog order), else "done" with the stop reason. Deterministic for a given state, pool and catalog.
 */
export function nextQuestion(state: QuestionnaireState, pool: CandidatePool, catalog: readonly QuestionDef[], opts: EngineOptions = {}): NextStep {
  const essential = nextEssential(state, catalog);
  if (essential) return { kind: "ask", question: essential, utility: Number.POSITIVE_INFINITY, impact: { total: pool.trials.length, narrowedTo: null } };

  const rule = STOP_RULES[state.mode];
  const byId = new Map(catalog.map((q) => [q.id as string, q]));
  const ranked = rankQuestions(state, pool, catalog, opts);
  if (ranked.length === 0) return { kind: "done", reason: "exhausted" };
  if (adaptiveAsked(state, byId) >= rule.maxQuestions) return { kind: "done", reason: "max_questions" };
  const scored = scorePool(state, pool, catalog, opts.policy);
  if (rule.smallSet !== null && scored.filter((s) => !s.conflict).length <= rule.smallSet) return { kind: "done", reason: "small_set" };

  let best = ranked[0] as (typeof ranked)[number];
  for (const r of ranked) if (r.utility > best.utility) best = r;
  if (!(best.utility >= rule.minUtility)) return { kind: "done", reason: "low_gain" };
  const group = groupOf(state) ?? pool.group;
  return { kind: "ask", question: best.question, utility: best.utility, impact: impactOf(best.question, group, scored, opts.policy) };
}

/** Rough "about N more questions" for the header (never a fake percentage). */
export function estimateRemaining(state: QuestionnaireState, pool: CandidatePool, catalog: readonly QuestionDef[], opts: EngineOptions = {}): number {
  if (nextEssential(state, catalog)) return ESSENTIALS.filter((id) => state.answers[id] === undefined).length;
  const byId = new Map(catalog.map((q) => [q.id as string, q]));
  const rule = STOP_RULES[state.mode];
  const worthAsking = rankQuestions(state, pool, catalog, opts).filter((r) => r.utility >= rule.minUtility).length;
  return Math.max(0, Math.min(worthAsking, rule.maxQuestions - adaptiveAsked(state, byId)));
}

/** "Answer N more optional questions": eligible Deep-dive questions left after stopping. */
export function remainingOptional(state: QuestionnaireState, pool: CandidatePool, catalog: readonly QuestionDef[]): number {
  return eligibleQuestions(state, pool, catalog).filter((q) => q.tier === "deep").length;
}

// ---------------------------------------------------------------------------------------------
// "Find out at your next appointment" (§5.3)

/**
 * One item per question answered "not sure", skipped or deferred ("prefer not to say" is a choice, not a
 * gap, so it is left out) that has a find-out definition. Most useful first (utility when asked), then
 * catalog order; items sharing the same "what to ask" text appear once. Never sent anywhere.
 */
export function findOutList(state: QuestionnaireState, catalog: readonly QuestionDef[], items?: Readonly<Record<string, FindOutDef>>): FindOutEntry[] {
  const order = new Map(catalog.map((q, i) => [q.id as string, i]));
  const entries: FindOutEntry[] = [];
  for (const q of activeQuestions(state, catalog)) {
    const v = state.answers[q.id];
    const deferred = state.deferred.includes(q.id);
    const gap =
      deferred ||
      (typeof v === "string" && isNonResponseId(v) && v !== PREFER_NOT) ||
      (Array.isArray(v) && v.length > 0 && v.every((x) => isNonResponseId(x) && x !== PREFER_NOT)) ||
      (v !== null && typeof v === "object" && !Array.isArray(v) && Object.values(v).some((x) => isNonResponseId(x)));
    if (!gap) continue;
    const def = items?.[q.id] ?? (q.findOutKey ? { whatKey: q.findOutKey, whereKey: q.findOutKey, whyKey: q.whyKey } : null);
    if (!def) continue;
    entries.push({ question: q.id, whatKey: def.whatKey, whereKey: def.whereKey, whyKey: def.whyKey, deferred });
  }
  const gain = (id: string) => state.gains?.[id] ?? -1;
  entries.sort((a, b) => gain(b.question) - gain(a.question) || (order.get(a.question) ?? 0) - (order.get(b.question) ?? 0));
  const seen = new Set<string>();
  return entries.filter((e) => (seen.has(e.whatKey) ? false : (seen.add(e.whatKey), true)));
}

/** Questions to reopen for "Fill in what you found out" (exactly the Find-out items). */
export function findOutQuestions(state: QuestionnaireState, catalog: readonly QuestionDef[], items?: Readonly<Record<string, FindOutDef>>): string[] {
  return findOutList(state, catalog, items).map((e) => e.question);
}

// ---------------------------------------------------------------------------------------------
// Session resume: sessionStorage only (tab-scoped, gone when the tab closes). Never localStorage/IndexedDB/server.

function storage(): Storage | null {
  try {
    return typeof sessionStorage === "undefined" ? null : sessionStorage;
  } catch {
    return null;
  }
}

export function saveSession(state: QuestionnaireState): void {
  try {
    storage()?.setItem(SESSION_KEY, JSON.stringify(state));
  } catch {
    /* storage full or blocked: resume is a convenience only */
  }
}

/** The saved state, or null when absent, invalid (zod) or older than 12 hours (then it is also removed). */
export function loadSession(now: number = Date.now()): QuestionnaireState | null {
  const s = storage();
  if (!s) return null;
  try {
    const raw = s.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = QuestionnaireStateSchema.safeParse(JSON.parse(raw));
    if (parsed.success && now - parsed.data.updatedAt <= SESSION_MAX_AGE_MS && parsed.data.updatedAt <= now + 60_000) return parsed.data;
  } catch {
    /* fall through: discard */
  }
  clearSession();
  return null;
}

export function clearSession(): void {
  try {
    storage()?.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}
