# Gold labels for eligibility facts, v1 (provisional)

`gold-v1.json` is an independent label set of what 120 trials' eligibility text requires, for measuring the rule layer
(`lib/ingest/eligibility-facts.ts`) against something that did not come from it.

## Status and limits
- Labeled by an AI reader (Claude), **not clinicians**. Provisional. Expect disagreement on judgment calls.
- Labels come from the trial's raw numbered inclusion/exclusion text only. Strict reading: if wording is vague, cohort-specific or
  investigator-dependent, the row is `ambiguous`, or carries `applies_to` and a lower `confidence`.
- 120 trials is small. Rare values (biomarkers, hepatitis `required`) have few examples; per-value precision/recall will be noisy.
- The pool is not the full national set: trials whose criteria text is shorter than 400 or longer than 8,000 characters were excluded
  (very long protocols were skipped for labeling effort), so very long cohort-heavy trials are under-represented.
- The text field is what CT.gov provides. Some criteria are truncated, stripped of symbols (">=", "<" lost in places), or defer to the
  protocol ("as described in the protocol"). Those rows are `low` or `medium` confidence.
- Some trials are not treatment trials (screening devices, supportive care, behavioral). They are kept (the national data has them) and
  mostly come out `not_stated`.

## Method
1. Sample: all trials in `public/data/shards/national-20261008-e97a2aa466/trials/*.json` (5,726), primary group = `card.groups[0]`.
   Excluded: any NCT ID appearing in `eval/`, `scripts/`, `tests/`, `config/questionnaire/precision.generated.ts` at sampling time
   (1,471 IDs; this covers all development and held-out IDs of earlier precision rounds without reading rule code), and trials with
   criteria text outside 400-8,000 chars. Remaining pool: 21 groups.
2. **Seed 20261007**, Python `random.Random`. Pools per group are shuffled (sorted-ID input), then drawn round-robin across the 21 groups
   (alphabetical) until 120 trials: 6 each, except kidney 5, uterine-cervical 5, thyroid 2 (small pools; remainder redistributed).
   Final order shuffled. `sample-gold.py` reproduces it.
3. Labeling: the labeler read only `card.inclusion` and `card.exclusion` (numbered), titles, and age/sex fields. It did **not** read
   `config/criteria.ts`, `lib/ingest/eligibility-facts.ts`, any generated precision file, existing label files' contents, or stored
   `facts`/`barriers` in the data. Allowed reading for schema only: `QUESTIONNAIRE_SPEC.md` s1, `lib/types/trial.ts`,
   `scripts/ingest/fact-precision.ts` (header and plumbing), `config/questionnaire/**` file names.
4. Every `quote` was machine-checked to be a verbatim substring (whitespace-normalised, trailing punctuation ignored) of that trial's
   criteria text. 0 mismatches.

## Blindness caveat
The labeler saw the NCT ID list used for exclusion only as a count/uniqueness filter, never the labels attached to them. It has general
knowledge of the fact schema (value/param, required/excluded/mentioned), which shaped the families, so labels are independent of rule
*behavior* but not of the *schema*.

## Schema
File: `{ meta, trials: [ { trial_id, group, title, labels: [Label] } ] }`. Each trial has, for each of the 10 families, one or more
rows; a family with nothing stated has a single row with `value: "not_stated"` (no quote). A family may have several rows
(e.g. two biomarkers, or different cohorts).

Label fields: `family`, `value`, `param`, `quote`, `scope`, `applies_to`, `confidence` (`high|medium|low`), `note`.

| family | values | param | scope |
|---|---|---|---|
| `lines_of_therapy` | `min_lines`, `max_lines`, `line_range`, `treatment_naive`, `first_line`, `ambiguous`, `not_stated` | number, or "a-b" string | - |
| `prior_drugs` | `required` (must have received), `excluded` (must not have received), `not_stated` | drug class/agent text | `any_history`, `within_N_<unit>`, `current` |
| `stage` | `required`, `excluded`, `not_stated` | stage/setting text (metastatic, locally advanced, adjuvant, resectable, stage IV, ...) | - |
| `relapsed_refractory` | `required`, `excluded`, `not_stated` | text | - |
| `other_cancer` | `excluded`, `allowed` (prior/concurrent malignancy explicitly permitted), `not_stated` | carve-outs | `active_only`, `any_history`, `within_N_years` |
| `hepatitis` | `excluded` (HBV/HCV positive excluded, no carve-out), `allowed_if_controlled` (positive allowed only with undetectable viral load/treated, or active-only exclusion), `required`, `not_stated` | HBV/HCV text | `active_only` |
| `biomarkers` | `required`, `excluded`, `ambiguous`, `not_stated` | marker and status, e.g. "PD-L1 TPS>50%" | - |
| `histology` | `required`, `excluded`, `not_stated` | histology/disease text | - |
| `ecog_max` | `max` (param = highest ECOG allowed), `ambiguous` (only Karnofsky/Lansky given), `not_stated` | number | - |
| `brain_mets` | `excluded` (any), `excluded_active_only` (untreated/active/symptomatic excluded), `allowed_stable_required` (treated and stable ok), `allowed`, `required`, `ambiguous`, `not_stated` | text | - |

Conventions: `applies_to` is set when a criterion covers one cohort/arm/phase/part only. A `treatment_naive`/`first_line` trial also
gets `relapsed_refractory: excluded` (confidence medium, "implied") when it requires newly diagnosed disease. Karnofsky/Lansky-only
criteria are `ecog_max: ambiguous` unless the text equates them to ECOG. Hormonal/radiation exclusions appear under `prior_drugs` with a
note ("radiation, not drug") so the scorer can drop or keep them.

## Using it
Map your fact keys to families (e.g. `min_prior_lines`/`max_prior_lines` -> `lines_of_therapy`, `prior_drug:*` -> `prior_drugs`,
`other_malignancy` -> `other_cancer`, `hepatitis_b|c` -> `hepatitis`, `biomarker:*` -> `biomarkers`, `histology:*` -> `histology`,
`ecog_max`, `brain_mets`, `metastatic|locally_advanced|adjuvant_setting|...` -> `stage`, `recurrent|previously_treated|platinum_*` ->
`relapsed_refractory`). Score `ambiguous` rows as excluded from precision/recall (or report separately). Do not tune rules against
this file: if used for tuning, it stops being independent. Keep it as the held-out check and create v2 for new rounds.
