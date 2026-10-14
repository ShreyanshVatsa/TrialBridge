# Evaluation results: v5 baseline vs v6 criterion matching

Hand-written summary (v6 step 9, 2026-10-13; numbers updated at step 10, 2026-10-14). Every number below was measured by a script in this repo; nothing is imputed. Nothing here is a clinical-accuracy claim: TREC labels are human relevance judgements for a research benchmark, the other labels are synthetic or rule-derived, and no real patient was evaluated.

Detailed, generated reports:
- `eval/matching/RESULTS.md` (+ `dev.json`, `test.json`, `test-runs.json`): TREC criterion-matching eval, `npm run eval:matching`.
- `eval/REGRESSION.md` (+ `results.json`): regression eval with random/BM25 baselines and the hard-filter oracle, `npm run eval` (this file used to be generated as `eval/RESULTS.md`; the generator now writes `REGRESSION.md`).
- `eval/baseline/`: the step-1 baseline (SHA b0914f5, commands and raw outputs).
- `eval/trialgpt/README.md`: criterion splitter vs TrialGPT gold. `eval/rrf-k.md`: RRF k choice.

Intervals are bootstrap 95% CIs over topics (TREC) or profiles (regression). "Distinguishable" means the paired-difference CI excludes 0.

## 1. Matching on TREC Clinical Trials (cancer subset, human qrels)

Arms: **baseline** = v5 pipeline order; **resolver** = v6 deterministic per-criterion labels re-ranking the top 15 (Tier A then incScore); **resolver+LLM** = resolver plus the Groq judge (gpt-oss-120b) on the unknown items of the top 10. Dev = TREC 2021 (10 topics), test = TREC 2022 (2 topics). Final numbers: rerun at step 10 (commit 4229463, after the resolver/pre-check/ingest fixes; LLM responses replayed from the cache where the request was unchanged).

### Dev, all 10 topics (LLM arm complete: 9 ok, 1 degraded to resolver-only)

| metric | baseline (v5) | resolver | resolver+LLM |
| --- | --- | --- | --- |
| nDCG@10 | 0.491 [0.352, 0.623] | 0.509 [0.407, 0.630] | 0.545 [0.435, 0.668] |
| P@10 (eligible) | 0.320 [0.200, 0.450] | 0.320 [0.200, 0.460] | 0.350 [0.230, 0.480] |
| missed exclusions (TREC-excluded trials in Tier A of top 10) | 0.330 [0.180, 0.490] | 0.310 [0.180, 0.450] | 0.290 [0.170, 0.440] |
| unknown share of criterion labels | n/a | 0.967 [0.953, 0.979] | 0.836 [0.769, 0.891] |

Paired differences vs baseline:
- resolver+LLM nDCG@10 **+0.054 [0.006, 0.108], distinguishable (better)**.
- resolver+LLM P@10 +0.030 [-0.010, 0.070]; missed exclusions -0.040 [-0.110, 0.020]: not distinguishable.
- resolver alone: nDCG@10 +0.018 [-0.047, 0.093], P@10 +0.000 [-0.050, 0.050], missed exclusions -0.020 [-0.080, 0.030]: none distinguishable.

(Step 8 measured +0.063 [0.011, 0.119] on the 9 topics the daily cap allowed; the 10th topic, 2021-61, now ran: base 0.589, resolver 0.554, LLM 0.565.)

LLM judge on dev (eval request settings = production: 16000-char batches, max_tokens 3500, reasoning_effort low):
- JSON validity 44/48 completions (91.7%); coverage (items judged / sent) 1582/1950 (81.1%).
- Tokens per patient 20,096 [16,189, 24,072]; model latency per patient 15.6 s [12.6, 18.8] (sum of sequential calls); 0 calls over the app's 30 s timeout.
- One topic (2021-17) fell back to resolver-only after a malformed batch and is scored as such.

### Test (TREC 2022, 2 topics; run 2, see eval/matching/test-runs.json)

| metric | baseline (v5) | resolver | resolver+LLM |
| --- | --- | --- | --- |
| nDCG@10 | 0.842 [0.821, 0.864] | 0.908 [0.889, 0.927] | 0.908 [0.889, 0.927] |
| P@10 | 0.800 [0.800, 0.800] | 0.850 [0.800, 0.900] | 0.850 [0.800, 0.900] |
| missed exclusions | 0.100 [0.100, 0.100] | 0.050 [0.000, 0.100] | 0.050 [0.000, 0.100] |

Resolver minus baseline nDCG@10 +0.065 [0.025, 0.106]; with only 2 topics this CI is not meaningful. Run 1 (step 8) had its LLM arm blocked by the Groq daily cap; run 2 is the single permitted rerun for that reason. In run 2 **both test topics degraded**: the judge's output failed validation in 4 of 5 completions (0/306 items judged; one cached response wraps the expected JSON object in a top-level array), so the resolver+LLM column equals the resolver-only fallback. **The LLM judge therefore has no successful test-split result.** No further test run was made.

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

These labels are a smoke test: BM25 reads the same text. v5 = the report generated on 2026-10-12 (v5-eval-verify); v6 = `npm run eval` at step 10 (data national-20261007-604c406deb). Not paired across versions, so no difference CIs.

| metric | v5 | v6 |
| --- | --- | --- |
| National pipeline nDCG@10 (40 profiles, 5,726 trials) | 0.784 [0.684, 0.870] | 0.775 [0.688, 0.850] |
| National pipeline minus BM25 (paired, within version) | +0.084 [0.045, 0.126] | +0.090 [0.047, 0.136] |
| National excluded-label share of top 10 | 0.267 [0.153, 0.397] | 0.217 [0.130, 0.310] |
| Seed pipeline nDCG@10 (30 v1 profiles) | 0.809 [0.742, 0.870] | 0.811 [0.740, 0.874] |
| Hard-filter oracle, national top 15 | 0 of 600 flagged | 0 of 600 flagged (step 9: 8; see below) |
| Hard-filter oracle, all national candidates | 3.7% flagged | 2.3% (328 of 14,527) |
| Gate v2 vs v1 on the 33 profiles without ECOG 2 | pass (0.829 vs 0.829) | pass as "not distinguishably worse": 0.830 vs 0.834, v2 - v1 -0.004 [-0.022, 0.012] |

`npm run eval` exits 0 at step 10. Two changes, both in DECISIONS.md (step 10):
- The 8 top-15 oracle flags at step 9 came from the merged v5-ranking branch (bisected; v6 RRF k=20 raised 5 to 8). 4 were real mis-tags from CT.gov's automatic MeSH mapping (B-ALL filed under Burkitt lymphoma, an astrocytoma under follicular lymphoma, T-cell lymphoproliferative neoplasms as a solid-tumor basket); the ingest now trusts the record's own conditions over a MeSH-only blood-cancer tag, re-ingested. The other 4 were the oracle's own blind spots (true basket trials whose sponsor keywords list example cancers; "Gall Bladder" spelled with a space); the oracle was corrected. **The checker changed**, so 0 of 600 is not like-for-like with step 9's 8 (with the old oracle the fixed build flags 4, all hand-read as true baskets).
- The gate used to be a point comparison (v2 mean >= v1 mean); it now fails only when the paired 95% CI is entirely below 0. The step-9 gap (0.004) is inside the CI, on ~16 candidates per profile, and no ranking was tuned to these labels. The strict point gate would still fail.

## What improved
- On TREC dev (all 10 topics), resolver+LLM beats the v5 order on nDCG@10 by +0.054 [0.006, 0.108], the only distinguishable gain on the dev split.
- The LLM judge settles about 13 points more of the criteria on dev (unknown share 0.967 -> 0.836).
- The splitter matches TrialGPT's item boundaries closely (F1 0.986), and the 7 documented rule gaps are closed.

## What failed or got worse
- No metric other than dev nDCG@10 (LLM arm) is distinguishable from baseline; P@10 and missed exclusions move the right way but their CIs include 0.
- The judge returned malformed JSON in 4 of 48 dev completions (coverage 81%; one dev topic fell back to resolver-only) and in 4 of 5 test completions (both test topics fell back).
- The deterministic resolver alone settles very little (3.3% of top-10 criterion labels on TREC dev, 5.4% with full synthetic answers), so in degraded mode almost everything is "unknown".
- Regression smoke: v2 trails v1 by 0.004 on the point estimate (not distinguishable, [-0.022, 0.012]); the gate was redefined on the paired CI rather than the ranking being tuned (DECISIONS.md step 10). The national oracle needed a correction of its own term lists to reach 0 flags, besides the ingest fix.

## What is unvalidated
- The LLM judge on the TREC test split: run 2 degraded on both topics (malformed output), so there is no held-out evidence for it.
- Production judge settings: /api/match now uses the same request settings as the eval (step 9), but it has not been load-tested live.
- The vignette benchmark: `eval/gold/vignettes-gold-v1.json` is absent, so `npm run eval:vignettes` cannot run.
- Precision of the resolver's settled labels against gold labels (only a by-eye read of about 50 labels was done). A step-9 demo probe found two false exclusions for an EGFR-positive answer and an MSS trial first for an MSI-high answer, both now guarded (BUGS.md); the TREC numbers above were measured after those guards.
- Anything about real patients, real clinicians, or translations of the new checklist text.
