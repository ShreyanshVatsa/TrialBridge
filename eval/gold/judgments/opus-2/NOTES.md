# opus-2 consistency notes

## Run 1 (2026-10-20)

Chunks done (25): v004-1; v012-1..5; v015-1..4; v022-1; v024-1..3; v026-1..2; v028-1..3; v030-1;
v037-1..2; v048-1..3. Next: v048-4 (v048 is mid-vignette; patient = relapsed Ph-neg B-ALL post allo-HCT,
15% blasts, CD19/CD22+, prior blinatumomab, mild chronic skin GVHD on topical steroid only, off systemic IS).

Verdict semantics: "met" = patient passes the criterion (for exclusion criteria too: met = not excluded by it);
"not_met" = patient fails it / is excluded by it.

Label conventions used:
- Wrong subtype/stage/setting of the SAME cancer (HER2+ trial for HER2- breast, metastatic-only trial for
  resected/early disease, Ph+ ALL trial for Ph- ALL, rectal-only trial for colon patient, MSS-only trial for
  MSI-H) -> excluded.
- Different cancer (SCLC/NEC trial for NSCLC or mesothelioma, NSCLC trial for mesothelioma, AML/MDS/CML/CLL/
  lymphoma trial for ALL, gyn trial for CRC) -> not_relevant.
- Non-treatment studies for people without cancer (screening, polyp surveillance, prevention), clinician/staff
  studies, device registries, survivor cohorts, CAR-T long-term follow-up -> not_relevant.
- Supportive/behavioral studies that target the patient's actual situation (prehab during rectal TNT,
  intraoperative imaging agent with surgery planned) -> judged normally (eligible/possibly/excluded).
- Trials whose only stage mismatch is in the title/conditions (criteria text never states metastatic) ->
  not_relevant with an "unknown" evidence verdict and a note (cannot cite not_met).
- Pan-tumor basket requiring "no standard therapy left / refractory": patient with standard options still
  available (e.g. post-osimertinib, platinum not yet given) -> possibly; patient untreated/on curative therapy
  -> excluded.
- Measurable disease required and patient's measurability is "unknown" -> cite as unknown and downgrade to
  possibly. Lab values, ECOG detail, lifestyle screening items (exercise minutes) do NOT downgrade.
- Biomarkers: if the patient states a full gene panel was "otherwise negative" (v012), treat rare panel-
  detectable alterations (TP53 Y220C, MTAP del, SMARCA4, CKIT/PDGFRA, RAS) as negative -> excluded.
  If genes were never tested / unknown (v015, v024, v026) -> unknown -> possibly.
- Remission-requiring transplant trials while patient has active relapse (15% blasts) -> excluded (current
  stated fact), even for second-transplant trials.
- Prior allo-HCT with ongoing mild skin cGVHD: criterion "no evidence of acute or chronic GVHD" -> not_met;
  ambiguous "active GVHD" -> unknown; "GVHD requiring systemic immunosuppression" / topical steroids permitted
  -> met. 211At-BC8 trials: excluded either way (myeloablative branch excluded; RIC branch needs no GVHD).
- Autoimmune-disorder trial (AIM-NIVO) for patient without autoimmune disease -> not_relevant; with
  autoimmune disease but wrong disease setting -> excluded.

## Run 2 (2026-10-20)

Chunks done (27): v048-4..6; v060-1..7; v064-1..3; v068-1..3; v071-1..3; v072-1..4; v073-1..4.
Next: v074-1. Totals after run: 52 ok / 0 invalid / 57 missing of 109.

New judgment calls:
- Same-disease trial whose relapsed/refractory setting appears ONLY in title/conditions (criteria give no
  prior-line rule) for an untreated patient -> not_relevant with an "unknown" verdict (extends the
  title-only stage rule to setting).
- AL amyloidosis vs multiple myeloma treated as different diseases: MM trials for an AL patient, and AL
  trials for an MM patient -> not_relevant (cite the diagnosis criterion and the AL/MM exclusion as not_met).
  Smoldering-myeloma trials for active MM -> excluded (same disease, wrong stage).
- Uveal melanoma trials for cutaneous melanoma -> excluded (wrong subtype of same cancer); Merkel, cSCC,
  BCC trials -> not_relevant.
- Hodgkin (cHL) patient vs B-NHL trials -> not_relevant; trials naming NLPHL only also not_relevant for cHL.
- Patient mid-first-line with restaging pending (v072): "progressed on anti-PD-1" requirements -> unknown ->
  possibly. A hard explicit "BRAF V600 must have received BRAF/MEK" with no exception -> excluded (stated
  fact: no BRAF/MEK yet); if the criterion has an investigator-discretion/refusal exception -> possibly.
  First-line-only (no prior systemic for metastatic disease) trials -> excluded.
- Trials requiring transplant-ineligibility for a 67-year-old whose doctor proposes possible transplant
  -> possibly (unknown). Post-ASCT maintenance trials for untreated patient -> excluded.
- Isolated 1q gain: not assumed to meet composite high-risk definitions (needs co-occurring lesion) ->
  unknown -> possibly; trials listing "high-risk MM" without definition -> unknown.
- Chronic HBV on entecavir with undetectable load: "active hepatitis B" -> met; "chronic or active
  hepatitis B" / "positive HBsAg" -> not_met (excluded).
- Prior allo-HCT exclusion "at any time" -> excluded; heavily pretreated BCMA-exposed patient: trials
  excluding any prior BCMA T-cell therapy -> excluded; cohorts explicitly for BCMA-exposed (Arm B/Arm E)
  -> eligible when listed criteria are met.
- Ongoing low-dose oral budesonide for active immune colitis (v073): criteria excluding "systemic or
  enteric corticosteroids", "oral steroids", "any immunosuppressive medication within 14 days", or
  "active ... autoimmune disorders including IBD" -> not_met (excluded); thresholds ">10 mg prednisone"
  -> met; vaguer "active autoimmune disease requiring systemic treatment" -> unknown -> possibly.
- Patient-support / services observational studies (LLS services) for an eligible blood-cancer patient
  -> possibly when treatment timing is unknown (judged normally, not not_relevant). Post-trial-access
  continuation studies and respiratory-virus treatment studies -> not_relevant.
