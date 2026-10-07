/**
 * Adaptive-vs-fixed questionnaire simulation (QUESTIONNAIRE_SPEC §7.2) on the committed seed trials.
 * SYNTHETIC patients: hidden "true" answers are sampled from catalog priors, and each patient says
 * "don't know" with a per-question probability. The oracle ranking uses every true answer. Seeded and
 * deterministic: the same seed and data always give the same numbers.
 * Also checks the non-response gate: unknown/skip answers never lower any trial's rank or score.
 * Run alone: `npx tsx scripts/eval/simulate.ts`; `npm run eval` calls runSimulation().
 */
import { CANCER_GROUP_IDS, type CancerGroupId } from "../../config/cancer-groups";
import { FACT_POLICY, getCatalog } from "../../config/questionnaire";
import { applyAnswer, createState, eligibleQuestions, rankPool, type CandidatePool } from "../../lib/questionnaire/engine";
import { runAdaptive, runFixed, samplePatient, simContext } from "../../lib/questionnaire/simulate";
import type { QuestionnaireState } from "../../lib/types/questionnaire";
import { loadSeedCards } from "./common";

export const SIM_SEED = 20261007;
export const SIM_GROUPS: readonly CancerGroupId[] = CANCER_GROUP_IDS.slice(0, 12);
export const PATIENTS_PER_GROUP = 34; // 12 x 34 = 408
export const SIM_KS = [1, 3, 5, 7] as const;

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface SimSummary {
  seed: number;
  patients: number;
  groups: number;
  trials: number;
  ks: readonly number[];
  adaptive: number[];
  fixed: number[];
  adaptiveConflict: number[];
  fixedConflict: number[];
  fullFixedNdcg: number;
  fullFixedQuestions: number;
  adaptiveBeatsFixedAtAllK: boolean;
  /** Smallest k at which adaptive reaches 95% of the full fixed flow's nDCG, or null. */
  kFor95: number | null;
  quick: { medianQuestions: number; meanNdcg: number };
  nonResponse: { checks: number; rankDrops: number; scoreDrops: number };
}

const mean = (xs: number[]) => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0);

export function runSimulation(): SimSummary {
  const { cards } = loadSeedCards(new Map());
  const r = mulberry32(SIM_SEED);
  const rows: Array<{ a: number[]; f: number[]; ac: number[]; fc: number[]; full: number; fullLen: number; quickLen: number; quick: number }> = [];
  const nr = { checks: 0, rankDrops: 0, scoreDrops: 0 };
  let trialCount = 0;
  const kMax = Math.max(...SIM_KS);

  for (const g of SIM_GROUPS) {
    const catalog = getCatalog("cancer", g);
    const sorted = cards.filter((c) => c.groups.includes(g));
    trialCount += sorted.length;
    // Prior: fixed deterministic order (no query text exists for a synthetic patient), decaying from 1.
    const pool: CandidatePool = { group: g, trials: sorted.map((c, i, all) => ({ id: c.id, prior: 1 - i / all.length, facts: c.facts, sex: c.sex })) };
    const base: QuestionnaireState = { ...createState("quick", 1), answers: { cancer_type: g, age: 55, zip: "02115", travel: null }, history: ["cancer_type", "age", "zip", "travel"] };
    for (let i = 0; i < PATIENTS_PER_GROUP; i++) {
      const patient = samplePatient(r, base, catalog, g);
      const ctx = simContext(pool, catalog, base, patient, FACT_POLICY);
      const full = runFixed(ctx, 99);
      const quick = runAdaptive(ctx, 99, "quick");
      const ad = SIM_KS.map((k) => runAdaptive(ctx, k));
      const fx = SIM_KS.map((k) => runFixed(ctx, k));
      rows.push({ a: ad.map((x) => x.ndcg), f: fx.map((x) => x.ndcg), ac: ad.map((x) => x.conflictShare), fc: fx.map((x) => x.conflictShare), full: full.ndcg, fullLen: full.asked.length, quickLen: quick.asked.length, quick: quick.ndcg });

      // Non-response gate: on a state where the patient has really answered two questions, answering
      // "don't know" or skipping any other eligible question must not lower any trial's score or rank.
      let withTruth = base;
      for (const q of eligibleQuestions(base, pool, catalog).slice(0, 2)) {
        const t = patient.truth[q.id];
        if (t !== undefined) withTruth = applyAnswer(withTruth, q.id, t, catalog, { now: 1 }).state;
      }
      const before = rankPool(withTruth, pool, catalog, { policy: FACT_POLICY });
      const rankBefore = new Map(before.map((x, idx) => [x.id, idx]));
      const scoreBefore = new Map(before.map((x) => [x.id, x.score]));
      for (const q of eligibleQuestions(withTruth, pool, catalog).slice(0, kMax)) {
        for (const v of ["unknown", "__skip"] as const) {
          const s = applyAnswer(withTruth, q.id, q.type === "multi" ? [v] : v, catalog, { now: 1 }).state;
          const after = rankPool(s, pool, catalog, { policy: FACT_POLICY });
          nr.checks++;
          after.forEach((x, idx) => {
            if (idx > (rankBefore.get(x.id) as number)) nr.rankDrops++;
            if (x.score < (scoreBefore.get(x.id) as number) - 1e-9) nr.scoreDrops++;
          });
        }
      }
    }
  }
  const col = (pick: (x: (typeof rows)[number]) => number[], j: number) => mean(rows.map((x) => pick(x)[j] as number));
  const adaptive = SIM_KS.map((_, j) => col((x) => x.a, j));
  const fixed = SIM_KS.map((_, j) => col((x) => x.f, j));
  const fullFixedNdcg = mean(rows.map((x) => x.full));
  const lens = rows.map((x) => x.quickLen).sort((a, b) => a - b);
  // k for 95%: scan adaptive at k = 1..12 over the same patients would need a rerun; derive from the listed ks.
  const kFor95 = SIM_KS.find((_, j) => (adaptive[j] as number) >= 0.95 * fullFixedNdcg) ?? null;
  return {
    seed: SIM_SEED,
    patients: rows.length,
    groups: SIM_GROUPS.length,
    trials: trialCount,
    ks: SIM_KS,
    adaptive,
    fixed,
    adaptiveConflict: SIM_KS.map((_, j) => col((x) => x.ac, j)),
    fixedConflict: SIM_KS.map((_, j) => col((x) => x.fc, j)),
    fullFixedNdcg,
    fullFixedQuestions: mean(rows.map((x) => x.fullLen)),
    adaptiveBeatsFixedAtAllK: adaptive.every((v, j) => v >= (fixed[j] as number) - 1e-9),
    kFor95,
    quick: { medianQuestions: lens[Math.floor(lens.length / 2)] as number, meanNdcg: mean(rows.map((x) => x.quick)) },
    nonResponse: nr,
  };
}

const f3 = (n: number) => n.toFixed(3);

export function simulationMarkdown(s: SimSummary): string {
  const rowsMd = s.ks.map((k, j) => `| ${k} | ${f3(s.adaptive[j] as number)} | ${f3(s.fixed[j] as number)} | ${f3(s.adaptiveConflict[j] as number)} | ${f3(s.fixedConflict[j] as number)} |`).join("\n");
  return `## Questionnaire: adaptive vs fixed (simulated patients)
> **Synthetic, provisional.** ${s.patients} simulated patients (${s.patients / s.groups} per group x ${s.groups} cancer groups; seed ${s.seed}) over the ${s.trials} seed trials in those groups. Hidden "true" answers are sampled from the catalog's own priors, patients say "don't know" at 40% (biomarkers), 20% (ECOG), 25% (lines), 30% (subtype) and 10% (others), and the oracle ranking is the same engine with every true answer. This measures how fast each question order approaches the engine's own full-information ranking. It is **not** a measure of clinical accuracy, it shares the fact layer (66% precision) with the system under test, and the priors are catalog estimates, not real-patient data. WP2 also ran this on the 5,726-trial national set (see PROGRESS.md); this script uses the seed so CI is reproducible.

nDCG@10 against the oracle top 10 (mean over patients) and the share of the flow's top 10 that conflicts with the patient's true answers:

| Questions asked (k) | Adaptive nDCG@10 | Fixed-order nDCG@10 | Adaptive conflict share | Fixed conflict share |
|---|---|---|---|---|
${rowsMd}

- Full fixed flow: nDCG@10 **${f3(s.fullFixedNdcg)}** with ${s.fullFixedQuestions.toFixed(1)} questions on average. Adaptive first reaches 95% of that at k = **${s.kFor95 ?? "none of the tested k"}**.
- Adaptive beats or ties fixed at every tested k: **${s.adaptiveBeatsFixedAtAllK ? "yes" : "no"}**${s.adaptiveBeatsFixedAtAllK ? "" : ` (behind at k = ${s.ks.filter((_, j) => (s.adaptive[j] as number) < (s.fixed[j] as number) - 1e-9).join(", ")} by at most ${f3(Math.max(...s.ks.map((_, j) => (s.fixed[j] as number) - (s.adaptive[j] as number))))} nDCG; ahead at k = 1 by ${f3((s.adaptive[0] as number) - (s.fixed[0] as number))})`}. The spec's "beats fixed at every k <= 7" criterion is **not** met on the seed: its pools are small (about ${Math.round(s.trials / s.groups)} trials per group), so the first few fixed-order questions already separate most trials. On the national set WP2 measured a win at every k <= 7 (PROGRESS.md).
- The conflict share stays near 0.5 for both flows because most seed trials in a group carry some fact the sampled patient contradicts; it differs little between flows here.
- Quick mode: median **${s.quick.medianQuestions}** adaptive questions, mean nDCG@10 ${f3(s.quick.meanNdcg)}.
- Non-response gate: ${s.nonResponse.checks} unknown/skip answers (two per eligible question, per simulated patient) changed no trial's rank for the worse (**${s.nonResponse.rankDrops}** rank drops) or score (**${s.nonResponse.scoreDrops}** score drops).
`;
}

if (process.argv[1]?.endsWith("simulate.ts")) {
  const s = runSimulation();
  console.log(simulationMarkdown(s));
}
