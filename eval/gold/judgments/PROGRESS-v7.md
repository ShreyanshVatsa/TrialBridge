# Vignette gold judging: progress log (v7)

## Data check (2026-10-19)
- Pool built from national-20261007-be78072b23; current build national-20261007-97a62a899d (criteria v2).
- Regenerated packets with `npx tsx scripts/eval/vignettes/judge-packets.ts`: 545 chunks, 5389 trials, output
  byte-identical to the existing packets (index.json and all .md). No pooled trial is missing from current data;
  nothing dropped. Criterion numbering in the packets already matches current data.
- judge-check on the 113 existing opus files: 112 ok, 1 invalid (v023-1, NCT07094204: quote "KRAS G12V, ..." not
  verbatim in I1). Fixed the quote (same label, same criterion); now 113 ok.

## Primary judge (opus) runs
Validate: `npx tsx scripts/eval/vignettes/judge-check.ts --judge=opus [--ids=v003]`
Order: index.json order, skipping valid files.

| run | chunks judged | total valid / 545 | next chunk |
|---|---|---|---|
| 0 (before v7) | 113 | 113 | v003-1 |
| 1 | 41 (v003-1 .. v033-5: vignettes v003 v004 v006 v012 v013 v014 v020 v022 v026 v028 v029 v033) | 154 | v039-1 |
| 2 | 9 (v039-1..4, v042-1..5) | 163 | v043-1 |
| 3 | 10 (v043-1..3, v046-1, v048-1..6) | 173 | v049-1 |
| 4 | 10 (v049-1, v053-1, v055-1/2/5/6, v056-1..3, v057-1) | 183 | v057-2 |
| 5 | 9 (v057-2/3, v058-1..3, v059-1..4) | 192 | v060-1 |
| 6 | 12 (v060-1..5, v061-1..3, v062-1, v063-1..3) | 204 | v064-1 |

### Run 1 notes
- Consistency rule applied (and back-applied to all opus files): when the patient's structured answer is
  "measurable: unknown" and the trial requires measurable disease, the label is "possibly", not "eligible"
  (7 labels changed: v013-1/3/4/5, v016-1, v033-2/4; 2 more in v029 fixed at review). Also no inferring an
  unstated biomarker (v029-1 NCT06625775 BRAF changed to unknown -> possibly).
- Borderline kept: v028-3 NCT06400472 excluded (adjuvant stage II patient; "advanced" is only in the title).
- Vignettes fully covered: 47 / 164. Some vignettes are partially covered from before v7 (e.g. v055-3/4 exist,
  v055-1/2 missing); index order handles them.
- Judging is done by blind Opus sub-agents (forks), whole vignettes per fork, each file checked right after writing.

### Provenance fix (run 2)
- judge-check.ts rewrites every valid file (judgedAt = today, normalised shape). The 111 pre-v7 files with unchanged
  labels were restored byte-for-byte from HEAD. Validation now uses a read-only copy of the check
  (scratchpad vcheck.ts, same JudgmentSchema + verifyJudgment), so files are not rewritten.
- Pre-v7 files with real changes (HEAD judgedAt and one-label-per-line formatting kept; only the changed line differs):
  | file | nctId | old -> new | reason |
  |---|---|---|---|
  | v016-1 | NCT01639508 | eligible -> possibly | requires measurable disease; patient's measurable = unknown |
  | v023-1 | NCT07094204 | possibly -> possibly | I1 quote made verbatim ("G12V, G12D, ... mutation"); label unchanged |
- Label changes inside v7-written files (no HEAD version): v013-1 NCT07140016, v013-3 NCT07111520, v013-4 NCT05363280,
  v013-5 NCT07491497, v033-2 NCT06959550, v033-4 NCT05086692, v029-2 NCT06149481: eligible -> possibly
  (measurable rule); v029-1 NCT06625775 eligible -> possibly (BRAF status unknown; was inferred);
  v028-3 NCT06400472 excluded -> possibly ("advanced" only in title; no numbered criterion fails).

### Run 2 (sequential, single agent, no forks)
- Written + validated (read-only vcheck): v039-1..4, v042-1..5 (9 chunks, vignettes v039 and v042 complete).
- Totals after run 2: 163 / 545 valid, 49 / 164 vignettes complete. Next chunk: v043-1.
- Throughput note: one agent reads ~25-30k tokens per chunk, so about 10 chunks per run fit before context gets tight.
- Consistency calls this run: bone-only disease after prostatectomy fails trials that require a fresh soft-tissue
  biopsy (excluded); MSI-H counts as a known actionable alteration where a trial excludes those (possibly).
- Validation: `npx tsx <scratchpad>/vcheck.ts [vNNN]` (read-only; judge-check.ts would rewrite judgedAt).

### Run 3 (sequential, single agent, no forks)
- Written + validated (read-only vcheck): v043-1..3, v046-1, v048-1..6 (10 chunks; vignettes v043, v046, v048 complete).
  v044-1, v045-1..5 and v047-1..4 already existed (pre-v7) and were skipped.
- Totals after run 3: 173 / 545 valid, 52 / 164 vignettes complete. Next chunk: v049-1.
- Consistency calls this run:
  - Hormone-sensitive mPC on ADT + ARPI: mCRPC-only trials excluded on the numbered CRPC criterion; a trial whose
    numbered criteria never state castration resistance (v043-3 NCT06785636) is "possibly" (title rule).
  - PSA exactly 0.2 counts as meeting ">= 0.2" and as failing an exclusion at "<= 0.2" (v043-2 NCT06592924 eligible,
    NCT07190300 excluded).
  - Relapsed ALL after allo-HCT with mild chronic skin GVHD on topical steroid only: trials that require
    "no evidence of GVHD" are excluded; trials that only bar GVHD needing systemic therapy pass that criterion;
    "active GVHD" with no qualifier is unknown (possibly). Prior-allo trials with E "prior myeloablative allo-HCT"
    plus I "RIC allo-HCT must have no ongoing GVHD" are excluded either way.
  - Transplant protocols that require morphologic remission now (no "at time of transplant" wording) are excluded
    for a patient with 15% blasts; ones that say "at time of transplant" for a planned second transplant are possibly.
  - Supportive-services observational study (NCT05745285) kept "possibly", as in v047-2.


### Run 4 (sequential, single agent, no forks)
- Written + validated (read-only vcheck): v049-1, v053-1, v055-1, v055-2, v055-5, v055-6, v056-1..3, v057-1
  (10 chunks; vignettes v049, v053, v055, v056 complete; v057 partial, 1 of its chunks done). v055-3/4 already existed (pre-v7).
- Totals after run 4: 183 / 545 valid, 56 / 164 vignettes complete. Next chunk: v057-2.
- Consistency calls this run:
  - AML/myeloid trials for an MDS patient (and the reverse) are not_relevant; a trial whose conditions include MDS but
    that requires untreated/HMA-naive MDS is excluded for an HMA-treated MDS patient.
  - AML in first remission with molecular MRD (on aza/ven): trials requiring relapsed/refractory AML or untreated AML
    are excluded (same as pre-v7 v055-3/4). Controlled HIV fails any criterion barring known HIV / positive HIV
    antibody / "negative HIV test"; it passes criteria that only bar detectable viral load.
  - ELN risk is not inferred from NPM1+/FLT3- alone (karyotype unstated): CR1 transplant trials needing
    intermediate/high risk are possibly (v055-5 NCT05429632).
  - Cumulative anthracycline dose is not inferred from "six cycles of R-CHOP": a ">150 mg/m2" exclusion is unknown
    (v056-1 NCT06564038 possibly).
  - Time since an event given only as a season ("CAR-T in the spring") is unknown against day windows (possibly).
  - "At least 2 prior lines OR not eligible for / no other available therapy": a fit patient after one line with
    standard options remaining is excluded on that criterion (v057-1 NCT07226843, NCT05780034).
  - Patient-supplied R-CHOP implies CD20+ DLBCL for a "CD20+ B-cell NHL" criterion (v056-2 NCT06536049 eligible).
  - Different lymphoma entities (FL vs LBCL vs MCL vs T-cell) are not_relevant to each other, as with other diseases.

### Run 5 (sequential, single agent, no forks)
- Written + validated (read-only vcheck): v057-2, v057-3, v058-1..3, v059-1..4 (9 chunks; vignettes v057, v058, v059
  complete). Stopped at a vignette boundary (v060 has 5 chunks).
- Totals after run 5: 192 / 545 valid (full vcheck: 192 ok, 0 invalid), 59 / 164 vignettes complete. Next chunk: v060-1.
- Consistency calls this run:
  - "History of autoimmune disease" (no qualifier) fails for Hashimoto's thyroiditis on levothyroxine (excluded,
    v057-2 NCT07101328, NCT06948786); "active autoimmune disease" and "requiring treatment" variants pass.
  - Stated EF "around 40%" fails LVEF >= 45% criteria and "EF < 45%" exclusions (excluded); a "<= 40%" exclusion or
    ">= 40%" cutoff is unknown (possibly). ECOG 2 fails ECOG 0-1 criteria (excluded).
  - Monitored AF / reduced EF: "known significant heart disease" / "significant cardiovascular disease" is unknown
    (possibly); criteria that bar only "uncontrolled" cardiac disease pass (v058-3 NCT05602363 eligible).
  - Never-treated chronic hepatitis C is treated as viremic, active HCV: fails "positive HCV antibody unless negative
    PCR", "detectable viral load", "potentially active HCV" and "known hepatitis C" criteria (excluded); a generic
    "active or uncontrolled infection / unacceptable risk" exclusion is unknown (possibly).
  - Prior-therapy rule: R/R-only trials (or 2+ prior lines) are excluded for an untreated patient. Early-phase
    trials that list the disease with no R/R qualifier and no numbered prior-therapy criterion (v059-2 NCT05006716,
    v059-3 NCT05544019) are possibly, not eligible.
  - Disease stated "on both sides of the diaphragm" fails stage I-II-only criteria (v059-3 NCT07029217 excluded).
  - MZL vs FL trials are different entities (not_relevant), consistent with the lymphoma-entity rule from run 4.

### Run 6 (sequential, single agent, no forks)
- Written + validated (read-only vcheck): v060-1..5, v061-1..3, v062-1, v063-1..3 (12 chunks; vignettes v060, v061,
  v062, v063 complete). v060-6/7 already existed (pre-v7) and were skipped.
- Totals after run 6: 204 / 545 valid (full vcheck: 204 ok, 0 invalid), 63 / 164 vignettes complete. Next chunk: v064-1.
- Consistency calls this run:
  - Hodgkin vs any NHL (B- or T-cell) are different entities (not_relevant), extending the lymphoma-entity rule.
    A trial whose numbered criteria never name the disease but whose title/conditions are NHL-only
    (v060-5 NCT07121946) is not_relevant, citing a generic criterion with a note.
  - "No standard therapy available or considered unsuitable per Investigator" (no prior-lines prong) is unknown, not
    not_met, when the team is still weighing transplant vs trial (v060-1 NCT04999384 possibly); a "refusal of standard
    therapy" alternative is likewise unknown (v060-4 NCT04752826).
  - BV + nivolumab given together counts as both prior brentuximab and prior anti-PD-1: fails "NO prior checkpoint
    inhibitors" / "NO prior brentuximab" cohorts and anti-PD-1 exclusions; a 2nd-line BV+nivo study capped at 1 prior
    line is excluded.
  - Patient mid first-line chemo and responding: R/R-only and "no prior systemic therapy" trials are both excluded;
    CR1-consolidation ASCT trials are possibly (end-of-induction CR unknown).
  - ECOG 3-4 ("mostly in a chair or bed") fails every ECOG 0-2 / 0-1 / Zubrod 0-2 criterion (excluded).
  - Controlled HIV fails "known history of HIV" / "seronegative for HIV" / "HIV infection" criteria (excluded); passes
    "uncontrolled HIV" and "undetectable viral load" variants (as in run 4).
  - Allo-HCT transplant protocols requiring CR/PR are excluded for a patient whose latest scan shows progression.
  - The target of a current investigational antibody is unknown: a BAFF-R-directed-therapy exclusion is unknown
    (v063-2 NCT07101328 possibly).
  - GCB DLBCL fails "non-GCB DLBCL" criteria and GCB-DLBCL exclusions (excluded).

