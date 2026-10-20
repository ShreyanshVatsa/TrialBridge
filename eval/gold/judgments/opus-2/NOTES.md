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
