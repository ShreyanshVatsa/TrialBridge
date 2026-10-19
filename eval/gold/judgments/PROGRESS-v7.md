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
