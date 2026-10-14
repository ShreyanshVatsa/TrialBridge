# Evaluation results: v5 baseline vs v6 criterion matching

Hand-written summary (v6 step 9, 2026-10-13). Every number below was measured by a script in this repo; nothing is imputed. Nothing here is a clinical-accuracy claim: TREC labels are human relevance judgements for a research benchmark, the other labels are synthetic or rule-derived, and no real patient was evaluated.

Detailed, generated reports:
- `eval/matching/RESULTS.md` (+ `dev.json`, `test.json`, `test-runs.json`): TREC criterion-matching eval, `npm run eval:matching`.
- `eval/REGRESSION.md` (+ `results.json`): regression eval with random/BM25 baselines and the hard-filter oracle, `npm run eval` (this file used to be generated as `eval/RESULTS.md`; the generator now writes `REGRESSION.md`).
- `eval/baseline/`: the step-1 baseline (SHA b0914f5, commands and raw outputs).
- `eval/trialgpt/README.md`: criterion splitter vs TrialGPT gold. `eval/rrf-k.md`: RRF k choice.

Intervals are bootstrap 95% CIs over topics (TREC) or profiles (regression). "Distinguishable" means the paired-difference CI excludes 0.

## 1. Matching on TREC Clinical Trials (cancer subset, human qrels)

Arms: **baseline** = v5 pipeline order; **resolver** = v6 deterministic per-criterion labels re-ranking the top 15 (Tier A then incScore); **resolver+LLM** = resolver plus the Groq judge (gpt-oss-120b) on the unknown items of the top 10. Dev = TREC 2021 (10 topics), test = TREC 2022 (2 topics).

### Dev, the 9 topics with a completed LLM run

| metric | baseline (v5) | resolver | resolver+LLM |
| --- | --- | --- | --- |
| nDCG@10 | 0.480 [0.338, 0.626] | 0.504 [0.394, 0.642] | 0.543 [0.423, 0.677] |
| P@10 (eligible) | 0.300 [0.178, 0.444] | 0.311 [0.189, 0.467] | 0.333 [0.211, 0.478] |
| missed exclusions (TREC-excluded trials in Tier A of top 10) | 0.367 [0.222, 0.522] | 0.344 [0.222, 0.489] | 0.322 [0.200, 0.467] |
| unknown share of criterion labels | n/a | 0.967 [0.951, 0.980] | 0.843 [0.769, 0.901] |

Paired differences vs baseline:
- resolver+LLM nDCG@10 **+0.063 [0.011, 0.119], distinguishable (better)**.
- resolver+LLM P@10 +0.033 [-0.011, 0.078]; missed exclusions -0.044 [-0.122, 0.022]: not distinguishable.
- resolver alone: nDCG@10 +0.024 [-0.050, 0.106], P@10 +0.011 [-0.033, 0.056], missed exclusions -0.022 [-0.078, 0.033]: none distinguishable.

All 10 dev topics (no LLM arm): baseline nDCG@10 0.491 [0.352, 0.623], resolver 0.509 [0.407, 0.630], difference +0.018 [-0.047, 0.093] (not distinguishable).

LLM judge on dev (eval request settings: 16000-char batches, max_tokens 3500, reasoning_effort low):
- JSON validity 38/42 completions (90.5%); coverage (items judged / sent) 1385/1748 (79.2%).
- Tokens per patient 19,797 [15,434, 24,215]; model latency per patient 15.5 s [12.1, 19.1] (sum of sequential calls); 0 calls over the app's 30 s timeout.
- One topic (2021-17) fell back to resolver-only after a malformed batch and is scored as such; one topic (2021-61) was blocked by the Groq free-tier daily cap and is not scored for the LLM arm.

### Test (TREC 2022, run once)

| metric | baseline (v5) | resolver |
| --- | --- | --- |
| nDCG@10 | 0.842 [0.821, 0.864] | 0.908 [0.889, 0.927] |
| P@10 | 0.800 [0.800, 0.800] | 0.850 [0.800, 0.900] |
| missed exclusions | 0.100 [0.100, 0.100] | 0.050 [0.000, 0.100] |

Resolver minus baseline nDCG@10 +0.065 [0.025, 0.106]. With only 2 topics this CI is not meaningful. The LLM arm on test was blocked by the Groq daily cap (0/2 topics), so **the LLM judge has no test-split result**.

## 2. Components

| component | v5 baseline | v6 | source |
| --- | --- | --- | --- |
| Criterion splitter vs TrialGPT gold (4,633 trials, unchanged text) | none (whole paragraphs) | 95.6% exact item count, boundary F1 0.986 | `eval/trialgpt/README.md` |
| Hand-checkable rule assertions (`eval/assertions.json`) | 38/38 pass + 7 documented known gaps | 45/45 pass, 0 known gaps | `eval/REGRESSION.md` |
| Rule-fact precision, 50-item hand sample | 66.0% (33/50) | 66.0% (not re-labeled) | `eval/REGRESSION.md` |
| Items the resolver settles, synthetic answers (1,000 real trials) | n/a | 5.4% with every question answered, 1.8% age only | DECISIONS.md step 3 |
| RRF k (dev TREC 2021, nDCG@10) | k=60: 0.4871 | k=20: 0.4907 (+0.0036, no significance test) | `eval/rrf-k.md` |

The 7 extractor gaps listed in the v5 report are fixed and each is a regression test (tests/unit/criteria-resolve.test.ts): washout windows (chemo 4 weeks, radiation 2 weeks, surgery 28 days) are scoped and never penalize; "Known EGFR or ALK" excludes both; "BRCA1 or BRCA2" requires BRCA; "Prior systemic therapy for metastatic disease" and "not received any prior therapy" set previously_treated excluded.

## 3. Regression eval (synthetic profiles, title/condition regex labels)

These labels are a smoke test: BM25 reads the same text. v5 = the report generated on 2026-10-12 (v5-eval-verify); v6 = `npm run eval` at step 9. Not paired across versions, so no difference CIs.

| metric | v5 | v6 |
| --- | --- | --- |
| National pipeline nDCG@10 (40 profiles, 5,726 trials) | 0.784 [0.684, 0.870] | 0.771 [0.684, 0.846] |
| National pipeline minus BM25 (paired, within version) | +0.084 [0.045, 0.126] | +0.098 [0.055, 0.143] |
| National excluded-label share of top 10 | 0.267 [0.153, 0.397] | 0.217 [0.130, 0.310] |
| Seed pipeline nDCG@10 (30 v1 profiles) | 0.809 [0.742, 0.870] | 0.811 [0.740, 0.874] |
| Hard-filter oracle, national top 15 | 0 of 600 flagged | 8 of 600 flagged (cancer group only; 5 with k=60) |
| Gate "v2 >= v1 on profiles without ECOG 2" | pass (0.829 vs 0.829) | **fail (0.830 vs 0.834)** |

## What improved
- On TREC dev, resolver+LLM beats the v5 order on nDCG@10 by +0.063 [0.011, 0.119], the only distinguishable gain on the dev split.
- The LLM judge settles about 12 points more of the criteria (unknown share 0.967 -> 0.843).
- The splitter matches TrialGPT's item boundaries closely (F1 0.986), and the 7 documented rule gaps are closed.

## What failed or got worse
- No metric other than dev nDCG@10 (LLM arm) is distinguishable from baseline; P@10 and missed exclusions move the right way but their CIs include 0.
- The judge returned malformed JSON in 4 of 42 dev completions, and coverage is 79%; one dev topic fell back to resolver-only.
- The deterministic resolver alone settles very little (3.3% of top-10 criterion labels on TREC dev, 5.4% with full synthetic answers), so in degraded mode almost everything is "unknown".
- Regression smoke gate "v2 >= v1" now fails by 0.004 (also at RRF k=60, so not caused by the k change), and the national top-15 oracle flags 8 group mismatches (was 0). BUGS.md.

## What is unvalidated
- The LLM judge on the TREC test split (blocked by the Groq daily cap), and on a full dev run (9/10 topics).
- Production judge settings: /api/match now uses the same request settings as the eval (step 9), but it has not been load-tested live.
- The vignette benchmark: `eval/gold/vignettes-gold-v1.json` is absent, so `npm run eval:vignettes` cannot run.
- Precision of the resolver's settled labels against gold labels (only a by-eye read of about 50 labels was done). A step-9 demo probe found two false exclusions for an EGFR-positive answer, now guarded (BUGS.md); the TREC numbers above were measured before that guard.
- Anything about real patients, real clinicians, or translations of the new checklist text.
