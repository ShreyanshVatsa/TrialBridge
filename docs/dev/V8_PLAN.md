# v8 plan: matching accuracy and efficiency

Branch `v8` (from `cac-2026`), 2026-10-21. Decisions are made on dev data only: TREC 2021 dev (`npm run eval:matching -- --split=dev`), vignette dev (`npm run eval:vignettes -- --split=dev`, live code via `npx tsx scripts/eval/vignettes/live.ts`) and the regression eval (`npm run eval`). The TREC test split is frozen and is never run; the vignette test split runs once at the end. Every number below was measured by a script in this repo.

## 1. Efficiency profile (measured)

Tooling added in the first commit: User Timing marks on the search path (`tb:search:*`, `tb:results`, `tb:judge`, `tb:analysis`), the worker reports model-load and embed time, and `npx tsx scripts/perf/search-timings.ts [--mbps=N]` drives `/find/?demo=1` through Playwright Chromium against a local `wrangler dev` of the national build (cold = fresh browser context, warm = second navigation in the same context). Local machine, localhost server; the demo path starts the search at once, so nothing is hidden by the questionnaire prefetch.

| measure | cold, unthrottled | cold, 20 Mbps | warm |
| --- | --- | --- | --- |
| navigation to results | 1,200 ms | 4,761 ms | 369 ms |
| search start to results | 1,075 ms | 4,257 ms | 324 ms |
| shards (download + parse) | 229 ms | 1,702 ms | 100 ms |
| embedding worker (model load + embed) | 676 + 32 ms | 2,434 ms step | 163 + 31 ms |
| MiniSearch index parse | 33 ms | 33 ms | 30 ms |
| hard filters + BM25 + cosine + RRF + score | 15 ms | 16 ms | 14 ms |
| main-thread long tasks between search start and results | 1 (112 ms) | 1 | 1 (75 ms) |
| judge / explanation round trips (mock provider, incl. Turnstile) | 3.3 s / 1.7 s | | 3.2 s / 1.6 s |

Bytes transferred (compressed as served): app JS 657 KB, breast shards 3,610 KB (breast-1 + breast-2 + solid-basket: cards.json is 845 + 688 + 765 KB gz, index 236 + 210 + 212 KB, sites 179 + 104 + 49 KB, embeddings 92 + 92 + 101 KB), model 15,685 KB (int8 ONNX, brotli; 22.97 MB raw), ONNX Runtime wasm 3,636 KB (gz; 14.26 MB raw). Cold total about 23.5 MB; the model is two thirds of it. The warm run re-downloads shards and the wasm only because the local server's responses are not reused by Playwright's context; production serves them `immutable`.

Judge (TREC dev, `eval/matching/dev.json`): 7,388 tokens per patient (prompt 4,968, completion 2,420), 1.8 requests per patient, 6.2 s model latency per patient, coverage 92%. The system prompt alone is about 700 tokens and is re-sent with every request; the completion is dominated by a 25-word reason per item, including the "unknown" items (most of them). Free tier: 8,000 tokens per minute, so about one full judgment per minute.

Shard composition (breast-1 cards.json, raw bytes): split criteria 32%, rule facts with verbatim quotes 28%, the pre-v6 inclusion/exclusion split 28% (duplicated text), summary 4%. Dropping the duplicated split saves only 12% after gzip (849 -> 750 KB); a lite-first shard (no criteria, contacts, summary or fact quotes; full cards fetched for the top 15) would be 547 KB (-35%), i.e. about -0.9 MB on a 3.6 MB group download.

Embedding model: `Xenova/all-MiniLM-L6-v2` int8 (22.97 MB) is the smallest published variant; the q4 files are larger (model_q4 54.6 MB, model_q4f16 30.0 MB: the 30,522 x 384 token table stays fp32/fp16). A different model with the same BERT vocabulary saves at most 6 MB (3-layer MiniLM) at a quality cost. Not pursued.

## 2. Error analysis

### Vignette dev (94 vignettes, `npx tsx scripts/eval/vignettes/error-analysis.ts`)

816 top-10 slots of `pipeline:v7+resolver`; 443 (54.3%) are gold "excluded". For each, the primary judge's `not_met` evidence was mapped to the split criterion it quotes and the resolver was run on that item with the vignette's answers:

| bucket | n | share | meaning |
| --- | --- | --- | --- |
| extractor_gap | 182 | 41% | the criterion is about a questionnaire topic but no usable fact is extracted from it |
| resolver_gap | 151 | 34% | a directional fact the answers could settle exists, but the resolver left the item unknown (alternatives "X or Y", a precision-gated family, a cohort/step header, a time window) |
| free_text_only | 54 | 12% | the judge's reason rests on detail the questionnaire does not ask (named drugs, imaging findings, risk groups) |
| tier_b_shown | 44 | 10% | the resolver already failed the trial (Tier B) and it still shows because fewer than 10 of the re-ranked 15 are Tier A |
| no_answer | 12 | 3% | the question exists but the vignette answered unknown |

Topic of the judge's evidence: lines / treated status 94, stage or disease status 91, biomarker 87, performance status 46, histology 26, prior drug 19, measurable disease 16, brain metastases 16, health history 6, labs 2. Resolver-gap fact keys: previously_treated 52, ecog_max 18, biomarker:HER2 14, min/max_prior_lines 10 each, hiv 10, pregnancy 9, hepatitis 16, biomarker:HR 8. Stage facts (`metastatic`, `locally_advanced`, `adjuvant_setting`, `resectable`) are not settled by the resolver at all although `spread` is answered.

Gold-eligible trials: 152; 59 in the top 10, 77 in the top 15, 129 in the top 50, 23 not in the stored top 50 (retrieval miss, 15%).

Pool bias: a ranking that surfaces trials outside the judged pool is under-credited (unjudged = non-relevant). The top-10 judged share is 0.915 for the v7 ranking, 0.80 when the resolver re-ranks 30 and 0.64 at 50, so pool-size decisions cannot be read off this benchmark.

### TREC dev (10 topics, `eval/matching/dev.json`)

Resolver arm: 30 of 100 top-10 slots are TREC-excluded and only 2 are Tier B (the structured answers are coarse; the detail that excludes is in the topic text). The judge's Tier B demotions are precise (dev 2 correct / 1 disputed / 1 not relevant; held-out 7/7) but it sees only the top 5. Baseline nDCG@10 0.491, resolver 0.521, judge 0.550.

### Experiments already run (dev) and not adopted

- Resolver pool 30 / 50 instead of 15: TREC dev resolver nDCG@10 0.529 / 0.511 vs 0.521 (n.s.) with worse missed exclusions (0.34 / 0.38 vs 0.28); vignette dev confounded by pool bias. Kept 15.
- Tier A ordered by retrieval rank instead of incScore: TREC dev 0.503 vs 0.521, vignette dev 0.321 vs 0.325. Kept incScore.

## 3. Ranked plan (expected gain / effort)

1. Resolver coverage from better criterion parsing (highest): inclusion alternatives evaluated clause by clause (all options fail -> not_met: "HER2-positive or triple-negative" for an HR+/HER2- patient), stage items from the `spread` answer with a narrow parser (metastatic / stage IV / early-stage / non-metastatic / resected), treated-status and line-count items with narrow high-precision patterns ("no prior systemic therapy", "previously untreated", "more than N lines", "first-line") instead of the gated whole-trial facts, registration/screening step headers not read as cohorts. Measured on vignette dev + TREC dev + `npm run eval`.
2. Judge tokens: shorter system prompt, reasons only for definite labels, no empty `answerIds`, items the resolver now settles not sent. Target under 4.5k tokens per patient (two patients per minute). One paced dev LLM run (about 60k tokens) to confirm nDCG@10 and coverage do not get worse.
3. Fusion weights re-fit with leave-one-out cross-validation on vignette dev (tooling in `scripts/eval/fusion-fit.ts`); adopt only if the CV estimate and TREC dev do not get worse.
4. BM25 query construction (group label, subtype terms, stop words) on both dev sets.
5. Deferred: lite-first group shards (-0.9 MB per group, medium effort, below the model's 15.7 MB), prior_* extractor precision (the held-out label set is 10 items per key; re-tuning on it would make it dev data), a smaller embedding model (quality cost for at most 6 MB).

Safety principles kept throughout: no "eligible" wording, hard filters in code, nothing new leaves the browser (`lib/privacy/minimize.ts` unchanged), quote verification unchanged.

## 4. Results log (appended per step)

### Step 1: resolver coverage from better criterion parsing (kept)

`lib/match/criteria-resolve.ts`: (a) extent of disease from the `spread` answer (`checkStage`: metastatic / stage IV / distant, non-metastatic / M0, advanced / unresectable, early-stage / stage I-III; site-specific metastases, treatment settings, subgroup rules and "pain due to metastases" are ignored; exclusion items only when the item is about the extent itself); (b) treated status and line counts from the item's own wording (`checkTreated`: "newly diagnosed", "previously untreated", "no prior systemic therapy" vs "relapsed or refractory", "progressed on", "at least N prior lines"; a setting qualifier such as "for metastatic disease" is answered by the line count after progression; class-, drug-, toxicity-, count- and window-specific history items stay unknown), plain line counts now settle (the extractor already demotes class-specific and conditional counts); (c) definitions in brackets or parentheses and definition sub-bullets no longer count as alternatives, more benign "or" pairs (extent pairs in any order, relapsed/refractory, squamous/non-squamous, local/central, IHC/ISH, stage lists), assessment windows ("ECOG within 30 days prior to randomization") are not patient time windows, registration/screening step headers are not cohorts, "one-line" is read as "one line". Unit tests added (tests/unit/criteria-resolve.test.ts, 51).

| measure | before (v7) | after |
| --- | --- | --- |
| vignette dev nDCG@10 (pipeline+resolver, pool 15) | 0.325 [0.267, 0.386] | 0.358 [0.295, 0.422]; paired +0.033 [0.016, 0.051] |
| vignette dev excluded share in top 10 | 0.545 | 0.535; paired -0.010 [-0.022, 0.001] |
| vignette dev Tier B precision (hard failures in the re-ranked 15, gold excluded / possibly or eligible) | | stage 63 / 2, treated status 32 / 2, lines 14 / 0, ECOG 99 / 1 |
| TREC dev resolver nDCG@10 (no judge) | 0.521 [0.415, 0.641] | 0.525 [0.416, 0.647]; vs baseline +0.034 [-0.032, 0.108] |
| TREC dev missed exclusions / P@10 | 0.280 / 0.360 | 0.270 / 0.370 |
| items settled, every question answered (1,000 trials, seed 7) | 6.1% | 6.8% (not_met 143, excluded 46) |
| `npm run eval` national pipeline nDCG@10 / oracle | 0.779 / 0 of 600 | 0.779 / 0 of 600 (unchanged: the pre-check does not use the resolver) |

Mechanism: 41% + 34% of the gold-excluded trials in the dev top 10 failed on a stage, treated-status, line-count or alternative-wording criterion the resolver could not read (section 2). Kept: vignette dev CI excludes 0, TREC dev not worse.

### Step 2: option-by-option alternatives, negated marker lists, subtype and hepatitis items (kept)

`lib/match/criteria-resolve.ts`: an inclusion item with alternatives is not met only when every option fails on a checked fact ("HER2-positive or triple-negative" for an HR+/HER2- patient; "EGFR mutation or ALK rearrangement" for a double-negative patient), with definitions stripped and benign pairs removed before the split and no split under a leading negation; markers in a negated list ("without EGFR, ALK, or ROS1 alterations", "no known alterations in NTRK, BRAF ...") are each required absent, and the list is left out of the alternatives check; a plain "histologically confirmed <subtype>" item is settled by the patient's subtype answer (the histology family stays below the whole-trial gate for scoring); a plain hepatitis B / C exclusion is settled by the hepatitis answer, while items with activity or test wording (active, HBsAg, RNA, antibody, on treatment) never fail on a "yes"; "known BRAF mutational status" is a test requirement, not a positive result; "Patients in Phase 2b ..." and "For IDH-mutated glioma, ..." are subgroup rules; an age item with several ranges stays unknown; stage words in a treatment context ("≤ 1 cycle of SoC for metastatic disease") are not the patient's stage. Unit tests: 52.

| measure | after step 1 | after step 2 |
| --- | --- | --- |
| vignette dev nDCG@10 (pipeline+resolver) | 0.358 | 0.362 [0.303, 0.426]; paired vs v7 +0.037 [0.021, 0.054] |
| vignette dev excluded share in top 10 | 0.535 | 0.535; paired vs v7 -0.010 [-0.023, 0.002] |
| vignette dev Tier B precision of the new reasons (gold excluded / possibly or eligible / not relevant) | | options 3 / 0 / 2, subtype 6 / 0 / 9, hepatitis 1 / 0 / 1 |
| TREC dev resolver nDCG@10 / missed exclusions | 0.525 / 0.270 | 0.526 [0.416, 0.648] / 0.270 |
| items settled, every question answered (1,000 trials) | 6.8% | 6.9% (not_met 167) |

Note: splitting "No known EGFR mutation or ALK rearrangement" into options scored 0.005 higher on dev because it wrongly failed three gold-excluded trials on an unrelated item; the negation guard keeps the correct reading ("met" for a double-negative patient) at the small cost.

### Step 3: BM25 / embedding query names positive markers only (kept)

`lib/questionnaire/rules.ts`, `lib/match/query.ts`: a negative biomarker answer used to add "<marker> negative." to the profile text that both BM25 and the embedding read; neither understands negation, so an EGFR-negative patient's query pulled in EGFR-required trials.

| measure | before | after |
| --- | --- | --- |
| TREC dev retrieval order nDCG@10 (`scripts/eval/trec/pipeline.ts`, 10 topics) | 0.491 | 0.521; paired +0.030 [0.000, 0.075] |
| vignette dev nDCG@10 (pipeline+resolver) | 0.362 | 0.367 [0.305, 0.431]; paired +0.005 [-0.009, 0.021]; vs v7 +0.042 [0.021, 0.063] |
| vignette dev excluded share in top 10 | 0.535 | 0.517; paired -0.018 [-0.033, -0.004] |
| vignette dev recall@50 of eligible | 0.804 | 0.772; paired -0.033 [-0.098, 0.012] (top-10 judged share 0.917 -> 0.903: part of the change surfaces unpooled trials) |

Tried and not adopted: also dropping treatment-history terms ("prior chemotherapy", "one prior line of therapy", "treatment naive"): TREC dev +0.072 [-0.004, 0.147], vignette dev -0.002 [-0.022, 0.016] with recall@50 -0.040; adding the group's synonym list ("NSCLC, SCLC, mesothelioma"): vignette dev +0.008 but TREC dev 0.521 -> 0.443. Fusion weights refit by 10-fold cross-validation on vignette dev (`scripts/eval/vignettes/fit-weights.ts`): CV retrieval-order nDCG@10 0.406 vs shipped 0.394, paired +0.011 [-0.013, 0.037], fold weights unstable (penalty -2 or -3, bonus 2 or 3): not adopted.

Process note: the first run of `scripts/eval/trec/pipeline.ts` for these variants aggregated all 17 topics (its CLI had no split filter), so a mean over dev + test topics was printed once; per-topic test numbers were not read and nothing was decided on it. The script now runs the dev split by default and the test split only with an explicit flag; the numbers above are dev-only reruns.

### Step 4: judge output shrink (kept): prompt analyze-v3.2

`prompts/analyze-v3.ts`, `config/match-judge.ts`: the model gives a reason and answer ids only for definite labels (an "unknown" item is `{"id":"I3","label":"unknown"}`), the request header is shorter and the trial summary is capped at 300 characters. The TrialGPT reasoning steps are kept: a first version with the instructions cut to half the length labelled more items unknown and scored lower on TREC dev (table). Three paced LLM dev runs (TREC 2021, 10 topics, same resolver and query as the final code):

| judge prompt | nDCG@10 (resolver+LLM) | vs baseline | missed exclusions | P@10 | unknown share | coverage | tokens / patient | calls / patient | model latency |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| v3.1 (v7 text) on the v8 resolver | 0.558 [0.453, 0.669] | +0.067 [0.007, 0.131] | 0.270 | 0.370 | 0.860 | 92.4% | 7,356 [5,815, 9,013] | 1.8 | 6.1 s |
| short instructions + compact output (not adopted) | 0.534 [0.410, 0.660] | +0.043 [0.001, 0.084] | 0.280 | 0.350 | 0.904 | 96.1% | 6,019 [4,863, 7,207] | 1.5 | 4.6 s |
| **v3.2: TrialGPT steps + compact output (kept)** | 0.565 [0.450, 0.685] | +0.044 [-0.007, 0.101] | 0.240 | 0.390 | 0.876 | 98.9% | 6,527 [5,389, 7,761] | 1.6 | 6.0 s |

Paired vs the v7 prompt (same topics): short instructions -0.024 [-0.053, 0.001]; v3.2 +0.007 [-0.018, 0.046]. Kept v3.2: not worse, -11% tokens per patient (completion 23.9k -> 21.5k over 10 patients, prompt 49.6k -> 43.8k), coverage 92% -> 99%. Judge Tier B demotions in the dev top 10: 5 TREC-excluded, 1 not relevant, 1 TREC-eligible (NCT02066532, 2021-61: "no prior HER2-directed therapy" read against an untreated patient). Groq free tier today: about 115k tokens spent on these three runs.

### Step 5: benign pairs collapsed before fact extraction (kept)

`lib/match/criteria-resolve.ts`: the whole-item extractor demotes a marker next to an "or" to "mentioned", so "advanced or metastatic ER+/HER2- breast cancer" gave no usable HR/HER2 fact; the resolver now collapses extent pairs ("locally advanced or metastatic" -> "metastatic") and method pairs ("histologically or cytologically" -> "histologically") in the text it hands to the extractor. "Stage IV Breast Cancer:" is read as a disease label, not a study-stage cohort; an exclusion head may end with punctuation; stage words that only name the setting of a treatment-history rule no longer block a positive label.

| measure | after step 3 | after step 5 |
| --- | --- | --- |
| vignette dev nDCG@10 (pipeline+resolver) | 0.367 | 0.368 [0.306, 0.431]; vs v7 +0.043 [0.021, 0.064] |
| vignette dev excluded share in top 10 | 0.517 | 0.516; vs v7 -0.029 [-0.048, -0.011] |
| TREC dev resolver nDCG@10 (no judge; baseline is 0.521 after step 3) | | 0.545 [0.432, 0.665]; vs baseline +0.024 [-0.040, 0.096]; missed exclusions 0.280, P@10 0.390 |
| items settled, every question answered (1,000 trials) | 6.9% | 7.1% |
