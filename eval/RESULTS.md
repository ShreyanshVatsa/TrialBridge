# Evaluation results: v7

Hand-written summary (2026-10-19, branch v7). Every number was measured by a script in this repo; nothing is imputed. Nothing here is a clinical-accuracy claim: TREC labels are human relevance judgements for a research benchmark, the other labels are synthetic, rule-derived or AI-reader labels, and no real patient was evaluated.

Detailed, generated reports:
- `eval/matching/RESULTS.md` (+ `dev.json`, `test.json`, `test-runs-v7.json`): TREC criterion-matching eval, `npm run eval:matching`.
- `eval/REGRESSION.md` (+ `results.json`): regression eval with random/BM25 baselines and the hard-filter oracle, `npm run eval`.
- `eval/facts-labels-v3.json`: held-out precision of the v1 rule facts (v7).
- v6 summary: `git show v6.2:eval/RESULTS.md`.

Intervals are bootstrap 95% CIs over topics (TREC) or profiles (regression). "Distinguishable" means the paired-difference CI excludes 0.

## 1. Matching on TREC Clinical Trials (cancer topics, human qrels)

Arms: **baseline** = v5 pipeline order; **resolver** = deterministic per-criterion labels re-ranking the top 15 (Tier A first); **resolver+LLM** = resolver plus the Groq judge (gpt-oss-120b) on the unknown items of the top 5 (`MATCH_JUDGE.topN`; screening-only items not sent). The eval measures the judge without the 45 s production deadline (see section 3 for production).

### Held-out test: TREC 2022 (2 topics) + TREC 2023 breast-cancer templates (5 topics), run once

Frozen before any v7 tuning was measured; never used for a decision. 2023 templates give no age or sex (age 50, female assumed).

| metric | baseline | resolver | resolver+LLM |
| --- | --- | --- | --- |
| nDCG@10 | 0.749 [0.648, 0.845] | 0.805 [0.710, 0.895] | 0.819 [0.723, 0.912] |
| P@10 (eligible) | 0.571 [0.357, 0.771] | 0.614 [0.429, 0.800] | 0.629 [0.429, 0.829] |
| missed exclusions (TREC-excluded in Tier A of top 10) | 0.400 [0.186, 0.629] | 0.329 [0.171, 0.486] | 0.229 [0.086, 0.357] |

Paired vs baseline: resolver+LLM nDCG@10 **+0.069 [0.015, 0.120]**, P@10 **+0.057 [0.028, 0.086]**, missed exclusions **-0.171 [-0.286, -0.071]**; resolver alone nDCG@10 +0.056 [0.012, 0.107], missed exclusions -0.071 [-0.157, -0.014]. All distinguishable (better). Judge Tier B demotions in the top 10: 7, all TREC-excluded (7/7). JSON validity 10/10, coverage 99.2%, 6.0k tokens per patient.

v6 had no successful held-out judge result (both TREC 2022 topics degraded on malformed output).

### Dev: TREC 2021 (10 topics; v7 decisions were made here)

| metric | baseline | resolver | resolver+LLM |
| --- | --- | --- | --- |
| nDCG@10 | 0.491 [0.348, 0.630] | 0.521 [0.415, 0.641] | 0.550 [0.444, 0.665] |
| P@10 | 0.330 [0.210, 0.460] | 0.360 [0.250, 0.490] | 0.360 [0.240, 0.490] |
| missed exclusions | 0.330 [0.190, 0.490] | 0.280 [0.170, 0.400] | 0.270 [0.170, 0.370] |

resolver+LLM - baseline nDCG@10 +0.060 [0.002, 0.120] (distinguishable); v6 dev: 0.491 / 0.509 / 0.545. Judge: 10/10 topics ok, JSON 18/18, coverage 92.0%, 7.4k tokens per patient (v6: 44/48 valid, 81%, 20k tokens). Tier B in the top 10: judge 2 correct, 1 "wrong" (NCT04296942 requires prior front-line THP; the patient is untreated, so the judge follows the text and the TREC label looks mistaken), 1 not relevant; v6 judge: 3 correct, 4 wrong.

## 2. Regression eval (synthetic profiles, title/condition regex labels; a smoke test)

| metric | v6 (step 10) | v7 |
| --- | --- | --- |
| National pipeline nDCG@10 (40 profiles, 5,726 trials) | 0.775 [0.688, 0.850] | 0.779 [0.690, 0.856] |
| National BM25 / random | n/a | 0.685 / 0.384 |
| Hard-filter oracle, national top 15 | 0 of 600 | 0 of 600 (oracle changed: uncoded sites are "not checkable", disclosed) |
| v2 vs v1 (profiles without ECOG 2) | -0.004 [-0.022, 0.012] | -0.004 [-0.021, 0.014] |

## 3. Vignette benchmark (164 synthetic patients, LLM-judged gold)

`npm run eval:vignettes -- --split=dev|test` against `eval/gold/vignettes-gold-v1.json`: 164 hand-written synthetic vignettes, 5,389 pooled (vignette, trial) pairs labelled eligible / possibly / excluded / not_relevant by an LLM judge (306 / 852 / 2,814 / 1,417), every evidence quote machine-checked verbatim against the cited criterion. An independent fresh-context LLM judge ("judge-b", blind to the primary labels and notes) re-judged a seeded 20% sample (32 vignettes, 109 chunks, 1,095 pairs): raw agreement 0.902, **Cohen's kappa 0.841** (dev 0.869, test 0.814), relevant-vs-not agreement 0.956. 107 contested pairs plus a 15% random sample are in `eval/gold/vignettes-review-packet-v1.md` for owner review. The pool and the gold were frozen before v7 rankings were added (`scripts/eval/vignettes/add-pipeline.ts`); 93-95% of the v7 top 10s were already pooled, unpooled trials count as non-relevant. **pipeline:v7+resolver** = what the app shows before the AI judge answers. The AI judge arm was not run here (164 patients x ~7k tokens is over the free daily quota).

| split | system | nDCG@10 (graded) | recall@50 eligible | excluded share in top 10 | dNDCG vs v4 |
| --- | --- | --- | --- | --- | --- |
| dev (94) | pipeline:v4 | 0.288 [0.236, 0.345] | 0.791 | 0.560 | ref |
| dev | pipeline:v7 | 0.298 [0.243, 0.354] | 0.804 | 0.584 | +0.010 [-0.017, 0.038] |
| dev | pipeline:v7+resolver | 0.325 [0.267, 0.386] | 0.804 | 0.545 | **+0.038 [0.003, 0.072]** |
| test (70) | pipeline:v4 | 0.307 [0.249, 0.365] | 0.845 | 0.477 | ref |
| test | pipeline:v7 | 0.315 [0.253, 0.377] | 0.854 | 0.525 | +0.008 [-0.024, 0.039] |
| test | pipeline:v7+resolver | 0.295 [0.237, 0.352] | 0.854 | 0.487 | -0.012 [-0.051, 0.027] |

Baselines (dev / test nDCG@10): BM25 0.219 / 0.256, embeddings 0.194 / 0.217, ClinicalTrials.gov search 0.135 / 0.169; the pipeline beats all three, distinguishably, on both splits. The v7 resolver lowers the share of excluded trials in the top 10 on both splits (dev 0.584 to 0.545, test 0.525 to 0.487) and helps nDCG on dev, but on test its nDCG change is not distinguishable from zero and points down (-0.020 [-0.063, 0.020] vs pipeline:v7; -0.023 vs v4 with contested pairs dropped). About half of every system's top 10 is labelled "excluded" by the gold: retrieval finds the right disease, and most of the remaining error is eligibility detail the questionnaire does not capture.

## 4. Production on the free tier (live)

`scripts/eval/matching/live-check.ts`: 5 TREC dev patients judged back to back through the production judge (45 s deadline, real Groq client, token budget, no pacing or cache): 5 of 5 judged, none degraded, coverage 20-100% per patient. Groq's free tier allows 8000 tokens per minute and one patient costs about 7k, so sustained capacity is about one full judgment per minute; patients beyond that get partial AI coverage (the rest stays "unknown", which never lowers a trial) or, when the daily budget is gone, a rules-only reading with a banner saying so.

## 5. Components

| component | v6 | v7 | source |
| --- | --- | --- | --- |
| Cached judge completions the parser reads fully | 3 rejected, 6 silently losing trials | 51/53 ok, 2 empty (re-asked), 0 rejected | `scripts/eval/matching/replay-cache.ts` |
| Items the resolver settles, every question answered (1,000 trials) | 5.3% | 6.1% (plan target 12% not reached) | `scripts/eval/resolve-share.ts` |
| Held-out v1 rule-fact precision (100 items, AI-reader labels) | not measured | prior_* 0-60%, metastatic 70%, newly_diagnosed 50%, previously_treated 60%, pregnancy 90%, concurrent_trial 90% | `eval/facts-labels-v3.json` |
| Criterion items checked at screening (not sent to the judge) | n/a | 15.8% | `lib/match/screening.ts` |

## What improved
- The judge now works: valid output on every completion in v7 runs, per-batch failure isolation, and the first successful held-out result (+0.069 nDCG@10, distinguishable, 7/7 correct demotions).
- Missed exclusions on the held-out set fell from 0.40 to 0.23.
- A pre-existing inversion ("HR-positive" read as HR-negative, 58 criterion items) is fixed.
- Low-precision v1 rule facts can no longer put a trial in Tier B.

## What failed or stayed weak
- The resolver alone settles little (6.1% with full answers; target 12% missed).
- TREC has only 17 cancer topics; the held-out set is 7 topics (target 20 missed), so CIs stay wide.
- Free-tier throughput: about one full judgment per minute.

## What is unvalidated
- The vignette gold is LLM-judged (two independent LLM judge runs, kappa 0.841), not clinician-reviewed; the owner review packet is unfilled.
- The resolver's vignette gain does not replicate on the vignette test split (TREC held-out: +0.056 nDCG for the resolver alone, distinguishable; vignette test: -0.012, not distinguishable).
- Precision of the judge's met/not-met labels item by item (only Tier B demotions are checked against TREC).
- Translations of the new checklist and privacy text (English fallback where missing).
- Anything about real patients or clinicians.
