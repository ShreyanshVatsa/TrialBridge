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
| 7 | 10 (v064-1..3, v065-1..4, v066-1..3) | 214 | v067-1 |
| 8 | 12 (v067-1..3, v068-1..3, v069-1..6) | 226 | v070-1 |
| 9 | 9 (v070-1/2, v071-1..3, v072-1..4) | 235 | v073-1 |
| 10 | 9 (v073-1..4, v074-1..5) | 244 | v075-1 |
| 11 | 12 (v075-1..8, v076-1, v077-1..3) | 256 | v078-1 |
| 12 | 11 (v078-1, v079-1..5, v080-1..5) | 267 | v081-1 |
| 13 | 10 (v081-1..3, v082-1..5, v083-1/2) | 277 | v083-3 |
| 14 | 12 (v083-3..6, v084-1..3, v085-1, v086-1..4) | 289 | v087-1 |
| 15 | 10 (v087-1, v088-1..4, v089-1..5) | 299 | v090-1 |
| 16 | 13 (v090-1..4, v091-1..4, v092-1, v093-1..3, v094-1 empty) | 312 | v095-1 |
| 17 | 12 (v095-1..5, v096-1..4, v097-1..3) | 324 | v098-1 |

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

### Run 7 (sequential, single agent, no forks)
- Written + validated (read-only vcheck): v064-1..3, v065-1..4, v066-1..3 (10 chunks; vignettes v064, v065, v066
  complete; all three are myeloma).
- Totals after run 7: 214 / 545 valid (full vcheck: 214 ok, 0 invalid), 66 / 164 vignettes complete. Next chunk: v067-1.
- Consistency calls this run (myeloma):
  - Plasma-cell disease states follow the prior-therapy rule, not the entity rule: smoldering-MM trials for an active-MM
    patient, and active NDMM/RRMM trials for a smoldering-MM patient, are excluded (SMM / "requiring treatment" /
    "diagnosis of MM per IMWG" criteria not_met). AL-amyloidosis trials are not_relevant for MM/SMM patients.
  - Untreated NDMM whose doctor is "possibly" planning a transplant: transplant-ineligible NDMM trials are possibly
    (ineligibility unknown); trials accepting "deferral of ASCT" likewise possibly.
  - Gain of 1q alone does not meet high-risk definitions that need 1q plus a translocation/del(1p32); other FISH
    results unknown -> possibly. "Classified as high-risk MM" with no definition -> unknown.
  - Title rule applied to MM: an R/R-titled trial with no numbered prior-therapy criterion is possibly for an
    untreated patient (v064-1 NCT04634552, v064-3 NCT05862012); an NDMM-titled trial with no numbered "newly
    diagnosed" criterion is possibly for a 3-line RRMM patient (v065-1 NCT07764978).
  - Lines counted per IMWG from the narrative (induction + ASCT + maintenance = 1 line): a narrative listing exactly
    three regimens fails ">= 4 prior lines" (excluded) and "no more than 2" (excluded), passes "1 to 3"/"1 to 4".
  - Stated ECOG 2 from fatigue/neuropathy fails ECOG 0-1 criteria, including ones that allow ECOG 2 only "solely due to
    local symptoms of myeloma" (v065-4 NCT07555938 excluded).
  - Bortezomib neuropathy of unstated grade: exclusions at grade >= 2 (or grade 2 with pain) are unknown (possibly);
    criteria that allow neuropathy up to grade 2 are not treated as failing (v065-2 NCT05714839 eligible).
  - "Triple-class refractory" counts as progression on/within 60 days of last therapy; refractoriness to a specific
    drug pair (carfilzomib AND pomalidomide) is not inferred (unknown).
  - "Diagnosed within the past 12 months" fails for SMM found 18 months ago (v066-3 NCT03937635 excluded).
  - Observational/follow-up studies tied to a treatment she has not had (post-cilta-cel follow-up, post-CAR-T cytopenia)
    and a respiratory-virus treatment study are not_relevant.

### Run 8 (sequential, single agent, no forks)
- Written + validated (read-only vcheck): v067-1..3, v068-1..3, v069-1..6 (12 chunks; vignettes v067 (MGUS), v068 (AL
  amyloidosis) and v069 (high-risk RRMM after 2 lines) complete).
- Totals after run 8: 226 / 545 valid (full vcheck: 226 ok, 0 invalid), 69 / 164 vignettes complete. Next chunk: v070-1.
- Consistency calls this run:
  - MGUS follows the plasma-cell prior-therapy rule: SMM, NDMM and RRMM trials are excluded (SMM / MM diagnosis /
    prior-line criteria not_met); a trial that names MGUS in an exclusion is excluded on it. Waldenstrom and AL trials
    are not_relevant for MGUS.
  - AL amyloidosis patient (the reverse of run 7): myeloma-only trials (MM diagnosis required, or AL/amyloidosis
    excluded) and lymphoma trials are not_relevant. AL trials for R/R disease are possibly for a patient still on
    first-line Dara-VCD with a suboptimal response (refractoriness, NT-proBNP cutoffs, Mayo IIIa vs IIIb, NYHA unknown).
  - Basket trial TAPUR (solid tumor / MM / B-NHL only) is not_relevant for AL; excluded for MGUS (in the plasma-cell
    family but not MM and needing no treatment).
  - Post-trial-access and long-term follow-up studies for a drug the patient never had are not_relevant (as run 7);
    a treatment trial requiring prior cilta-cel (selinexor maintenance post CAR-T) is excluded.
  - Standard washouts (patient "just finished" a regimen) do not downgrade a label on their own (as v045); timing
    criteria that cannot be met by waiting are judged normally.
  - Progression on or right after KPd counts as pomalidomide- and carfilzomib-refractory (fails pomalidomide-refractory
    exclusions); daratumumab given only in induction is not assumed refractory (unknown).
  - "At least 3 lines OR no available therapies" is not_met for a fit patient after 2 lines (as run 4).
  - Randomised trials whose comparator regimens all contain drugs the patient is refractory to, with an
    "eligible for a standard regimen per investigator" criterion, are possibly (v069-2 NCT07391657).
  - Title rule reused for NCT07764978 (NDMM-titled, no numbered newly-diagnosed criterion): possibly for RRMM (v069-5).
  - Transplant-support studies (plerixafor, online education) are possibly when a further transplant is not stated;
    "first transplant" studies are excluded after a prior ASCT.
  - Alkylator exposure is not inferred from "stem cell transplant" (melphalan not stated): unknown.
  - An RT trial whose ECOG text reads ">= 2" (likely a typo) was not cited; labelled possibly on lesion count (v069-1).

### Run 9 (sequential, single agent, no forks)
- Written + validated (read-only vcheck): v070-1/2, v071-1..3, v072-1..4 (9 chunks; vignettes v070 (78M myeloma on
  unnamed pill + weekly shot, markers rising), v071 (penta-exposed RRMM after cilta-cel, teclistamab and allo-HCT,
  chronic HBV on entecavir) and v072 (BRAF V600E stage IV cutaneous melanoma, 2 months into first-line ipi/nivo) complete).
  Stopped at a vignette boundary (v073 has 4 chunks).
- Totals after run 9: 235 / 545 valid (full vcheck: 235 ok, 0 invalid), 72 / 164 vignettes complete. Next chunk: v073-1.
- Consistency calls this run:
  - Myeloma treated for years with unnamed drugs and unknown line count: SMM / NDMM / frontline trials are excluded
    (prior-therapy rule); all RRMM line- or class-count criteria are unknown (possibly). Rising markers are not taken as
    IMWG progression (unknown), so a deep-responder de-escalation trial (limited-duration teclistamab) is possibly.
  - Chronic hepatitis B on entecavir with undetectable viral load is HBsAg-positive chronic HBV: it fails criteria that bar
    "chronic or active hepatitis B", "hepatitis B infection" or a positive HBsAg/HBcAg test (excluded); it passes
    criteria that bar only "active" or "uncontrolled" HBV; "excluded unless criteria can be met" is unknown.
  - Mis-sectioned exclusions (exclusion text listed under INCLUSION, e.g. "Have received prior treatment with CAR T
    therapy" in DURGA-2, "History of allogeneic and autologous stem cell transplantation" in linvoseltamab combos) are
    cited with their inclusion number and verdict not_met when the patient has the barred history.
  - Allo-HCT date not stated: "allo-HCT within 6 months" exclusions are unknown (possibly) even when the timeline makes
    it unlikely.
  - Patient mid first-line ICI with first restaging pending (no progression and no response known): "no prior systemic
    therapy for advanced disease" trials are excluded; trials requiring progression on PD-1 are possibly (unknown, not
    not_met), unlike run 6 where the patient was known to be responding.
  - BRAF V600 melanoma: criteria that require prior BRAF/MEK therapy with no waiver for declining (JZP898, IGNYTE-3)
    are not_met (excluded); ones that allow "declined"/"not indicated" or a second-line-ICI exception are unknown.
    NRAS-mutant trials excluding known BRAF mutations are excluded.
  - Uveal melanoma, cSCC, Merkel and neuroendocrine trials are not_relevant for cutaneous melanoma (entity rule); a
    GNAQ/11 trial whose only numbered diagnosis is metastatic uveal melanoma is not_relevant.
  - Solid-tumor or melanoma cohorts with no numbered prior-therapy or progression rule (DB-1311 basket) are possibly for a
    patient mid first-line (title rule, as run 5); a trial that explicitly adds a novel agent to ipi-then-nivo and allows
    prior PD-1 (alintegimod) is eligible.

### Run 10 (sequential, single agent, no forks)
- Written + validated (read-only vcheck): v073-1..4, v074-1..5 (9 chunks; vignettes v073 (69F BRAF-WT cutaneous melanoma
  after adjuvant pembrolizumab and nivolumab/relatlimab, treated stable brain met, immune colitis on low-dose budesonide)
  and v074 (60F metastatic uveal melanoma to liver, HLA-A*02:01 negative, systemic-treatment-naive) complete).
  Stopped at a vignette boundary (v075 has 8 chunks).
- Totals after run 10: 244 / 545 valid (full vcheck: 244 ok, 0 invalid), 74 / 164 vignettes complete. Next chunk: v075-1.
- Consistency calls this run:
  - Ongoing immune colitis on low-dose oral budesonide, called active by her oncologist: fails unqualified "active
    autoimmune disease" / "history of active autoimmune disorders" exclusions and ones that name oral or enteric
    corticosteroids or any current immunosuppressive medication (excluded); criteria limited to autoimmune disease
    "requiring systemic treatment", "serious autoimmune disease", steroid thresholds (> 10 mg prednisone) or "systemic
    corticosteroids" are unknown (possibly); unresolved-irAE / grade <= 1 recovery criteria are unknown (colitis grade not stated).
  - Whether immune colitis counts as anti-PD-1 "intolerance" or a reaction making re-treatment unadvisable is unknown.
  - Adjuvant pembrolizumab + 1 metastatic line = 2 lines (patient's own count); she passes "<= 2 lines" and
    "<= 2 lines for advanced melanoma" criteria. IGNYTE-3 without prior anti-CTLA-4 is possibly via its "not a candidate
    for anti-CTLA-4 (e.g. irAE history)" clause.
  - Uveal melanoma patient: melanoma trials that require cutaneous / non-uveal melanoma or exclude uveal by a numbered
    criterion are excluded (they study melanoma and a criterion rules her out); uveal-only trials remain not_relevant for
    cutaneous patients (run 9), and mucosal-only trials are not_relevant for uveal (entity rule). Basket trials whose
    histology list omits melanoma entirely are not_relevant.
  - HLA-A*02:01-negative: tebentafusp and IMA203 (HLA-A*02:01-positive) trials excluded; "prior tebentafusp required if
    HLA-A*02:01 positive" clauses count as met.
  - Treatment-naive metastatic uveal melanoma: trials requiring progression on or receipt of prior standard therapy are
    excluded; "progressed on standard therapy OR no standard therapy exists" is unknown (investigator call); metastatic
    uveal trials allowing treatment-naive patients with no failing numbered criterion are eligible (NCT06121180,
    NCT06581406 RP2 ICI-naive, NBM-BMX, IDE196). A first-in-human basket naming melanoma without a numbered prior-therapy
    rule is possibly (title rule).
  - Unreported genomic drivers (KRAS G12D, RAS/NRAS, MET amp, B7-H3, HER3, GPER, MC1R uptake) are unknown -> possibly.
  - Survivorship / behavior / procedure-support studies (sun protection, sentinel-node anesthetic, abdominoplasty laser,
    actinic keratosis prevention, bone density on curative anti-PD-1) are not_relevant.

### Run 11 (sequential, single agent, no forks)
- Melanoma-subtype relabel (consistency fix, applied before judging). Rule: melanoma subtypes (cutaneous, acral, mucosal,
  uveal) are subtypes of one disease. A trial limited to another melanoma subtype is "excluded" (not "not_relevant"),
  citing the inclusion criterion that names the subtype with verdict not_met. This supersedes the run 9/10 notes that kept
  uveal-only trials not_relevant for cutaneous patients and mucosal-only trials not_relevant for a uveal patient.
  Non-melanoma skin cancers (cSCC, BCC, Merkel) remain different diseases (not_relevant). Only the label and note changed
  on each line; evidence (already not_met on the subtype criterion), judgedAt and layout kept.
  | file | nctId | old -> new |
  |---|---|---|
  | v072-1 | NCT06581406 | not_relevant -> excluded |
  | v072-1 | NCT07015190 | not_relevant -> excluded |
  | v072-2 | NCT07136181 | not_relevant -> excluded |
  | v072-3 | NCT06070012 | not_relevant -> excluded |
  | v072-3 | NCT03947385 | not_relevant -> excluded |
  | v073-1 | NCT07276386 | not_relevant -> excluded |
  | v073-3 | NCT07015190 | not_relevant -> excluded |
  | v074-3 | NCT04318717 | not_relevant -> excluded (mucosal-only trial, uveal patient) |
  Kept not_relevant: v074-1 NCT05896839 (kidney-transplant-recipient population) and procedure/survivorship studies.
- Written + validated (read-only vcheck): v075-1..8, v076-1, v077-1..3 (12 chunks; vignettes v075 (74F recurrent sinonasal
  mucosal melanoma in neck nodes after pembrolizumab, KIT-mutant, ECOG 2), v076 (82M kidney-transplant recipient, metastatic
  cSCC after cemiplimab, ECOG 2) and v077 (77M resected stage III Merkel cell on adjuvant avelumab, no evidence of disease)
  complete).
- Totals after run 11: 256 / 545 valid (full vcheck: 256 ok, 0 invalid), 77 / 164 vignettes complete. Next chunk: v078-1.
- Consistency calls this run:
  - "daily activity: 2" with a naps-in-the-afternoon narrative is ECOG 2 (as run 7): every ECOG/Zubrod 0-1 criterion is
    not_met (excluded), including trials whose subtype and prior-therapy rules she otherwise fits.
  - Mucosal melanoma patient: cutaneous-only melanoma trials and ones excluding mucosal melanoma are excluded (subtype rule);
    uveal-only trials are excluded too.
  - Regional nodal recurrence ("spread: nearby") fails stage IV / brain-metastasis requirements (excluded) but meets
    "locally advanced or metastatic"; "unresectable" requirements are unknown when resectability is not stated (possibly).
  - Progression ~10 months into pembrolizumab meets "relapse within 12 months of initiation" and anti-PD-1-refractory
    criteria; ICI-naive trials (no prior PD-1/PD-L1, first-line ICI) are excluded. KIT mutation of unstated variant against
    a CKIT-activating-mutation cohort is unknown (possibly).
  - Resected, disease-free patient on adjuvant ICI: advanced/measurable-disease trials for his tumor type (or solid-tumor
    baskets that list it or are open-ended) are excluded; trials whose tumor list omits his cancer are not_relevant.
    Adjuvant avelumab counts as prior anti-PD-L1 and fails CPI-naive criteria.
  - AIM-NIVO (NCT03816345) for a patient with prior anti-PD-1/PD-L1 and no autoimmune disease: excluded on E3, as in v014.
  - Supportive/behavioral studies tied to future therapy the description does not state (exercise during immunotherapy,
    oral-agent symptom monitoring, goals-of-care program) are possibly; procedure studies for a surgery the patient is not
    having (ALND/ILND lymphatic reconstruction) are not_relevant.

### Run 12 (sequential, single agent, no forks)
- Written + validated (read-only vcheck): v078-1, v079-1..5, v080-1..5 (11 chunks; vignettes v078 (66M locally advanced
  BCC after two hedgehog inhibitors, controlled HIV with CD4 > 600), v079 (34F BRAF V600K cutaneous melanoma after ipi/nivo,
  dabrafenib/trametinib and encorafenib/binimetinib, growing brain metastases after WBRT, ECOG 3-4) and v080 (63M metastatic
  KRAS G12D PDAC, eight cycles into first-line FOLFIRINOX, CT stable but CA 19-9 rising) complete).
- Totals after run 12: 267 / 545 valid (full vcheck: 267 ok, 0 invalid), 80 / 164 vignettes complete. Next chunk: v081-1.
- Consistency calls this run:
  - Basal cell carcinoma is a different disease from melanoma, cSCC and Merkel (not_relevant), as with the other
    non-melanoma skin cancers. Controlled HIV fails "HIV" / "known HIV infection" exclusions (excluded); "acquired immune
    deficiency diseases" with exceptions not shown is unknown.
  - ECOG 3-4 ("mostly in bed") fails every ECOG/Zubrod 0-1 / 0-2 / Karnofsky >= 70 criterion (excluded, as run 6). Trials
    with no numbered performance-status criterion are judged on the rest (v079-5 NCT06413680 anti-PD-1-progressed melanoma
    cohort eligible; v079-3 STAR0602 and AU-007 possibly on CNS/BRAF wording).
  - Brain lesions "still growing" after WBRT fail criteria barring progressing or active CNS metastases (excluded).
  - Patient stable on first-line chemo (CT stable, marker rising): criteria that require radiographic progression on, or
    intolerance to, prior therapy, or exhaustion of standard therapy, are not_met (excluded, as run 6 for a responding
    patient); first-line / treatment-naive trials are excluded; cohorts that only require "1 prior line" or "at least 1
    systemic therapy" without a progression clause are possibly; trials with no prior-therapy rule ("treatment naive or
    prior standard therapy") are eligible. A rising CA 19-9 alone is not radiographic progression, but it fails a criterion
    that explicitly requires a stable or decreasing tumor marker (v080-5 NCT06747845 excluded); "steadily rising tumor
    marker" treatment-failure wording is unknown (SHARON possibly).
  - FOLFIRINOX counts as prior irinotecan (topoisomerase-1 inhibitor) for exclusions on prior TOP1 therapy in the advanced
    setting (v080-2 HER3-DXd excluded). KRAS G12D fails KRAS G12C / G12V / KRAS-wild-type requirements (excluded).
  - Eight FOLFIRINOX cycles (~16 weeks) meet "minimum of 16 weeks" and "8-12 cycles" maintenance criteria.
  - AIM-NIVO for a patient with no autoimmune disease and no prior PD-1 is not_relevant (as v015/v024).

### Run 13 (sequential, single agent, no forks)
- Written + validated (read-only vcheck): v081-1..3, v082-1..5, v083-1/2 (10 chunks; vignettes v081 (71F untreated borderline
  resectable PDAC, neoadjuvant chemo planned, no molecular testing, lives in South Dakota) and v082 (47F metastatic G2
  non-functional pNET after lanreotide and everolimus, KRAS/BRCA/MSI negative) complete; v083 (56M resected stage IIB PDAC,
  germline BRCA2, KRAS+, NED on adjuvant mFOLFIRINOX cycle 10/12) partial, 2 of 6 chunks).
- Totals after run 13: 277 / 545 valid (full vcheck: 277 ok, 0 invalid), 82 / 164 vignettes complete. Next chunk: v083-3.
- Consistency calls this run:
  - Pancreatic NET vs pancreatic adenocarcinoma are different diseases (entity rule): PDAC-only trials, and pancreatic
    cohorts limited to adenocarcinoma or excluding neuroendocrine histology, are not_relevant for a pNET patient (and NET
    trials for a PDAC patient). Within the neuroendocrine family, a poorly differentiated / high-grade NEC trial is excluded
    for a well-differentiated G2 NET (subtype rule); a carcinoid-syndrome trial is excluded for a non-functional NET.
  - pNET after SSA + everolimus: "progressed on all available standard of care", "no satisfactory alternative", "refractory
    to all standard therapies" and "no available therapeutic options" are not_met (PRRT and other lines remain); plain
    "failed / progressed after standard therapy" (no "all") is met. Prior everolimus fails mTOR-inhibitor exclusions.
  - Borderline resectable, untreated, non-metastatic PDAC: metastatic-only, second-line, resected/adjuvant and
    "unresectable / surgery with curative intent not an option" trials are excluded; a neoadjuvant-imaging study for
    localized PDAC headed to surgery after chemo is eligible. A state-residency requirement she fails (Minnesota) is excluded.
  - "No actionable mutations" is not read as HER2/MET amplification-negative (unknown -> possibly); it is read as no RAS
    mutation for a RAS-mutation basket when KRAS is also negative (excluded).
  - Resected, NED patient on adjuvant therapy: trials needing measurable, unresectable, metastatic or untreated disease are
    excluded (as run 11); pre-operative procedure studies (distal pancreatectomy fistula prevention, prehab before planned
    surgery) are not_relevant after his Whipple.

### Run 14 (sequential, single agent, no forks)
- Written + validated (read-only vcheck): v083-3..6, v084-1..3, v085-1, v086-1..4 (12 chunks; vignettes v083 (56M resected
  stage IIB PDAC, germline BRCA2, NED on adjuvant mFOLFIRINOX), v084 (68F MSI-H metastatic PDAC after gem/nab, FOLFOX and
  pembrolizumab, progressing, ECOG 2, bilirubin rising), v085 (79M pancreatic cancer of unstated histology on unnamed chemo
  combinations in Anchorage, prior MI with stents, almost everything unknown) and v086 (44F unresectable LAPC, stable after
  FOLFIRINOX + capecitabine chemoradiation, germline PALB2, KRAS-mutant, MSS) complete).
- Totals after run 14: 289 / 545 valid (full vcheck: 289 ok, 0 invalid), 86 / 164 vignettes complete. Next chunk: v087-1.
- Consistency calls this run:
  - Resected, NED patient still on adjuvant chemo: adjuvant/maintenance trials for resected PDAC (APOLLO olaparib, daraxonrasib
    RASolute, MTB-matched therapy for node-positive resected PDAC) are eligible; a "completed most recent treatment within
    12 weeks" criterion is unknown while the last cycles finish (standard-timing rule). Neoadjuvant, "newly diagnosed",
    upfront-resectable, unresectable/metastatic and measurable-disease trials are excluded; a psychosocial study during
    neoadjuvant therapy is excluded on its numbered "already received >= 2 cycles" exclusion; imaging and peri-operative
    analgesia studies around a surgery he already had are not_relevant (as run 13).
  - ECOG 2 (rests about half the day) fails every ECOG 0-1 criterion (excluded), as in runs 7/11/12; ECOG 0-2 trials and ones
    allowing ECOG 2 case-by-case are judged on the rest (unknown biomarkers -> possibly).
  - Unstated KRAS variant: KRAS G12D / G12C / G12V requirements are unknown, never inferred from "KRAS positive"; generic
    "KRAS mutation" / "RAS mutation" / "KRAS alteration" criteria are met. APL-101's mis-sectioned "known actionable ...
    KRAS" exclusion is not_met for a KRAS-mutant tumor (excluded).
  - Unresectable LAPC stable after first-line FOLFIRINOX + chemoradiation: criteria needing progression/intolerance on standard
    therapy (with no other prong) are not_met (excluded, as run 12); ones with a "declined" or "standard therapy considered
    inappropriate" prong are unknown (possibly); "treatment naive or prior standard therapy" trials are eligible (RMC-6236);
    a maintenance trial requiring stable disease for 3 months after >= 1 line is eligible. Trials barring prior abdominal /
    overlapping-field radiation are excluded after chemoradiation. Metastatic-only trials are excluded for non-metastatic LAPC.
    Pemigatinib's "progressive disease following prior regimen, or stopped for toxicity" is not_met for a stable patient.
  - Unstated pancreatic histology (v085): a resected-pNET adjuvant trial is excluded on the stated fact that surgery was never
    an option; first-line metastatic trials are excluded after a year of chemo for never-resectable disease; any-histology and
    PDAC trials with unknown biomarkers/lines/ECOG are possibly.
  - Basket trials whose histology list omits pancreatic cancer (TAK-505, MK-5684) are not_relevant; AIM-NIVO for a patient with
    prior pembrolizumab is excluded on E3, and not_relevant for one with no autoimmune disease and no prior PD-1 (as before).

### Run 15 (sequential, single agent, no forks)
- Written + validated (read-only vcheck): v087-1, v088-1..4, v089-1..5 (10 chunks; vignettes v087 (75M recurrent KRAS-WT PDAC
  after gem/cape adjuvant and gem/nab, possible NRG1 fusion, ECOG 3-4, chronic HBV on tenofovir), v088 (58F platinum-sensitive
  recurrent HGSOC, gBRCA1, after olaparib maintenance, partial response to second-line carboplatin/PLD, discussing maintenance)
  and v089 (66F platinum-resistant HGSOC after ~5 lines incl. niraparib, MIRV and a current phase 2 trial ADC, CA-125 rising with
  scan pending, ECOG 2, creatinine 1.6) complete).
- Totals after run 15: 299 / 545 valid (full vcheck: 299 ok, 0 invalid), 89 / 164 vignettes complete. Next chunk: v090-1.
- Consistency calls this run:
  - Ovarian histologic subtypes follow the subtype rule: low-grade serous-only and mucinous-only trials are excluded for a
    high-grade serous patient (not not_relevant). Endometrial-cancer trials remain not_relevant for ovarian patients.
  - Platinum status: platinum-resistant-only trials/cohorts are excluded for a platinum-sensitive patient, and PSOC-only cohorts
    fail for a platinum-resistant one. Frontline (newly diagnosed, neoadjuvant, first-line maintenance, PARPi-naive) trials are
    excluded for recurrent disease; prehab before NACT/IDS and risk-reducing-surgery studies are not_relevant.
  - Patient responding to her latest platinum (partial response, maintenance planned): criteria requiring progression on/after
    the most recent therapy, "progressive cancer at enrollment" or exhausted standard therapy are not_met (excluded), as runs 6/12.
    A post-platinum maintenance trial (MIRV + olaparib for PSOC after prior PARPi) is possibly on unknown FRalpha. A 2L-titled PSOC
    trial with no numbered line cap is possibly for a patient who already had 2L (title rule).
  - Line counting for ovarian: maintenance is part of the preceding line; a current investigational ADC counts as a line. A
    patient with ~5 lines fails "no more than 3/4 prior lines" caps (excluded). Where a line cap can be waived by sponsor approval
    (BL-B01D1 E33), the label is possibly.
  - Progression pending ("CA-125 rising, scan next week will probably show progression") is unknown, not met, for criteria
    requiring documented progression. Payload of an unnamed experimental ADC is unknown against TOP1-ADC exclusions.
  - "Sits much of the afternoon" with daily activity 2 is ECOG 2 (fails every ECOG 0-1 criterion; ECOG 0-2 trials judged on the
    rest). ECOG 3-4 (v087) fails ECOG <= 2 / Zubrod 0-2 and pemigatinib's "ECOG 2 case-by-case" too.
  - MSI-H-negative tumor fails MSI-H/dMMR basket requirements (excluded). Phase 1 ovarian/solid-tumor trials with no failing
    numbered criterion are eligible (NTB-928, HWK-016); ones gated on an unreported biomarker (CLDN6, BRAF, mesothelin, HER2) are
    possibly.

### Run 16 (sequential, single agent, no forks)
- Written + validated (read-only vcheck): v090-1..4, v091-1..4, v092-1, v093-1..3, plus v094-1 (0 trials; written as
  `{"labels":[]}` like v018-1/v041-1/v050-1). Vignettes v090 (29F newly diagnosed stage I ovarian immature teratoma, surgery
  planned), v091 (51F recurrent platinum-resistant KRAS G12V low-grade serous ovarian carcinoma after carboplatin/paclitaxel and
  letrozole, diet-controlled celiac disease), v092 (72F stage IIIB HGSOC mid neoadjuvant carboplatin/paclitaxel, ECOG 2, valve
  surgery + AF), v093 (62F resected stage IIIA HGSOC, MSI-H / Lynch MSH2, NED on bevacizumab + olaparib maintenance, prior colon
  cancer at 49) and v094 complete.
- Totals after run 16: 312 / 545 valid (full vcheck: 312 ok, 0 invalid), 94 / 164 vignettes complete. Next chunk: v095-1.
- Consistency calls this run:
  - Ovarian germ cell tumors (immature teratoma) are a different disease from epithelial ovarian carcinoma (entity rule, as pNET
    vs PDAC): epithelial-only ovarian trials, and ovarian trials that bar non-epithelial / germ-cell histology, are not_relevant
    for a germ cell patient; a germ cell trial is not_relevant for an HGSOC patient (v092-1 NCT03067181). The ovarian subtype
    rule (excluded) applies only within epithelial carcinoma. Open-ended advanced solid tumor baskets are excluded for her
    localized, untreated tumor (as run 11); trials whose tumor list omits germ cell tumors are not_relevant.
  - LGSOC vs HGSOC follows the subtype rule both ways (excluded): HGSOC-only trials and ones barring low-grade tumors for the LGSOC
    patient; the LGSOC avutometinib/defactinib trial for the HGSOC patient.
  - KRAS-mutant recurrent LGSOC: "received all standard therapies" / "no satisfactory alternative" criteria are not_met while
    MEK-based therapy (avutometinib + defactinib) remains (run 13 'all' rule); plain "failed standard therapy" is met; criteria
    with an investigator / refusal waiver are unknown (possibly).
  - Celiac disease controlled by diet: passes "active autoimmune disease" and "requiring systemic treatment" exclusions (and an
    explicit celiac-by-diet carve-out); fails unqualified "active or history of autoimmune disease" (excluded, as Hashimoto's in
    run 5). AIM-NIVO is possibly for this patient (autoimmune disease, no prior PD-1, metastatic; tumor type PI case-by-case).
  - Growing peritoneal nodules count as abdominal carcinomatosis (fails a "history of ... abdominal carcinomatosis" exclusion);
    "liver surface nodules" are not assumed to be liver metastases (unknown).
  - NED patient on first-line maintenance (v093): every recurrent / platinum-resistant / measurable-disease trial is excluded;
    first-line maintenance trials requiring PARPi-naive entry or no planned PARPi are excluded because she is on olaparib.
    Trials whose only numbered criterion is the tumor type (Sofe-M, HWK-016) stay possibly by the v028-3 title rule.
  - Supportive studies tied to a therapy outside her disease's standard care (anti-EGFR skin toxicity for ovarian cancer) are
    not_relevant; ones tied to undecided future chemo (weekly-paclitaxel neuropathy prevention) are possibly. Location-limited
    non-treatment programs near the patient (PAYMENT at PeaceHealth for a Portland patient, Healthy Oregon Project) are possibly
    (as v032-1); a palliative RT study is excluded for a patient on concurrent cytotoxic chemotherapy.

### Run 17 (sequential, single agent, no forks)
- Written + validated (read-only vcheck): v095-1..5, v096-1..4, v097-1..3 (12 chunks; vignettes v095 (40F recurrent platinum-resistant
  HGSOC, gBRCA2, after carbo/paclitaxel + niraparib, second platinum, weekly paclitaxel + bev and topotecan, treated stable brain met,
  controlled HIV), v096 (57M first-recurrence IDH-wt MGMT-methylated GBM after RT/TMZ + 6 adjuvant TMZ, low-dose dexamethasone) and
  v097 (66F newly diagnosed IDH-wt MGMT-unmethylated GBM after subtotal resection, chemoradiation not yet started, ECOG 2) complete).
- Totals after run 17: 324 / 545 valid (full vcheck: 324 ok, 0 invalid), 97 / 164 vignettes complete. Next chunk: v098-1.
- Consistency calls this run:
  - Controlled HIV (undetectable viral load, CD4 not stated): fails unqualified "HIV" / "history of HIV" / "positive HIV serology" /
    "HIV on antiretroviral therapy" / "ongoing HIV infection" / "negative screen for infectious disease markers" criteria (excluded, as
    runs 4/6/12); criteria that define well-controlled HIV with a CD4 threshold (CD4 >= 250/350) are unknown (possibly); "HIV with
    exceptions / unless protocol-specific criteria" and "immunodeficiency" without HIV named are unknown.
  - PROC line counting (v095): carbo/paclitaxel + niraparib maintenance = 1 line, second platinum = 2, weekly paclitaxel + bev = 3,
    topotecan = 4; the last two are PROC regimens (2 cytotoxic PROC regimens). Caps of "1-3 prior lines", "no more than 3", "1 to 3
    prior lines of cytotoxic therapy" and "no more than one PROC regimen" are not_met (excluded); caps of 4 or more are met. Multi-cohort
    trials where only some cohorts fail (Rina-S Part K, ART0380 escalation) are possibly.
  - Topotecan counts as prior topoisomerase-1 inhibitor (fails "no previous TOP1 agents"); it is not a TOP1 ADC (passes ADC-only exclusions).
  - "Patients must have no available therapeutic options known to confer clinical benefit" is not_met for PROC after 4 lines while
    standard single agents she has not had (PLD, gemcitabine) remain (run 13 'all/no options' rule).
  - Glioma follows the subtype rule: IDH-mutant-only glioma trials/modules are excluded for IDH-wt GBM; meningioma, brain metastases,
    leptomeningeal metastases, pediatric DMG and PCPG/NET trials are not_relevant. Newly diagnosed GBM trials (pre-RT, adjuvant-phase,
    no-progression-after-RT) are excluded for a recurrent patient, and recurrent-GBM trials are excluded for a newly diagnosed one
    (prior-therapy rule). MGMT status is a subtype-like fact: MGMT-unmethylated-only trials are excluded for a methylated tumor.
  - Pre-operative studies (window-of-opportunity, sonobiopsy, intraoperative devices) after resection is done: a treatment window
    trial is excluded on its "candidate for surgical resection" criterion; a diagnostic pre-op study is not_relevant (as run 13);
    for a recurrence where re-resection is not stated, surgery-dependent criteria are unknown (possibly).
  - Unspecified "low dose of dexamethasone" is unknown against dexamethasone caps <= 2-4 mg; it meets caps of <= 6-8 mg.
  - ECOG 2 described as "up and about but not able to do her usual work" meets KPS >= 60 / > 60 criteria; KPS >= 70 is unknown.
  - Open-ended advanced/metastatic or refractory solid-tumor baskets (or ones needing extracranial measurable disease) are excluded
    for newly diagnosed, untreated GBM (as run 16); baskets whose tumor list omits GBM are not_relevant.
  - Imaging/biomarker studies whose entry fits the patient's current stage (PET before cranial RT, T2* MRI during standard chemoRT)
    are eligible; a supportive study during planned chemoRT (escitalopram) is eligible; taxane/platinum neuropathy-prevention studies
    are excluded for a taxane-exposed ovarian patient and not_relevant for a GBM patient on temozolomide.
  - Healthy Oregon Project (NCT04494945) kept possibly for a Baltimore patient (site encounter unknown), as v032-1/v090-2.

