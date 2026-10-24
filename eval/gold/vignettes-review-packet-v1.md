# Vignette gold: reviewer packet

LLM-judged labels (not clinicians). Please overwrite "Reviewer verdict" with eligible | possibly | excluded | not_relevant where you disagree with the primary label.
Patients are in eval/gold/vignettes-v1.json; criteria text is in the trial records (NCT id). Section 1 lists every pair where the two judges disagree (107); section 2 is a seeded random 15% sample of the other judged pairs (792 of 5282).

## 1. Judge disagreements (107)

- v004 NCT06126276 Testing the Use of Neratinib or the Combination of Neratinib and Palbociclib Targeted Treatment for HER2+ Soli
  judge-a: **not_relevant** - I2 not_met: "Patients must have a HER2 amplified solid tumor except breast cancer." (HER2-amplified non-breast tumors; patient has early HER2- breast cancer.)
  judge-b: **excluded** - I2 not_met: "Patients must have a HER2 amplified solid tumor except breast cancer." (HER2-amplified non-breast basket; patient has HER2-negative breast cancer.)
  Reviewer verdict: [ ]

- v012 NCT05010109 Cardiovascular Injury and Cardiac Fitness in Locally Advanced Non-Small Cell Lung Cancer Patients Receiving Mo
  judge-a: **not_relevant** - I2 not_met: "The recommended treatment is thoracic radiation therapy combined with concurrent systemic therapy" (Cardiac-fitness study in locally advanced NSCLC getting chemoradiation; patient is stage IV on targeted therapy.)
  judge-b: **excluded** - I2 not_met: "The recommended treatment is thoracic radiation therapy combined with concurrent systemic therapy" (Locally advanced chemoradiation cohort study; patient has stage IV disease on targeted therapy.)
  Reviewer verdict: [ ]

- v012 NCT05983432 Evaluate BL-B01D1 in Patients With Metastatic or Unresectable Non-Small Cell Lung Cancer (NSCLC) and Other Sol
  judge-a: **eligible** - I19 met: "Evidence of documented EGFR TKI-sensitizing deletion mutation in EGFR Exon 19 (ex19del)" / E22 met: "Participants treated with more than two systemic chemotherapies prior to randomization." / E9 met: "Participants with previously treated brain metastases may participate" (EGFR-mutant NSCLC cohort; no prior chemo.)
  judge-b: **possibly** - I19 met: "Evidence of documented EGFR TKI-sensitizing deletion mutation in EGFR Exon 19 (ex19del)" / I9 unknown: "Has at least one measurable lesion based on RECIST V1.1" / E9 met: "Participants with previously treated brain metastases may participate provided they are clinically stable for at least 4 weeks" (Phase 1 EGFRm NSCLC cohort fits; measurability unknown.)
  Reviewer verdict: [ ]

- v012 NCT06706076 A Study of BH-30643 in Subjects With Locally Advanced or Metastatic NSCLC Harboring EGFR and/or HER2 Mutations
  judge-a: **eligible** - I2 met: "metastatic NSCLC with EGFR or HER2 mutations in the kinase domain of exons 18, 19, 20, or 21" / I4 met: "Eastern Cooperative Oncology Group Performance Status" (EGFR exon 19 deletion NSCLC.)
  judge-b: **possibly** - I2 met: "locally advanced or metastatic NSCLC with EGFR or HER2 mutations in the kinase domain of exons 18, 19, 20, or 21" / I3 unknown: "Has at least 1 measurable target extracranial lesion according to RECIST v1.1." (EGFR ex19 fits; measurability not stated.)
  Reviewer verdict: [ ]

- v012 NCT06892548 A Clinical Study to Investigate the Efficacy and Safety of an Investigational Combination Therapy With BNT324 
  judge-a: **eligible** - I2 met: "Participants with AGA-positive disease must have received targeted therapy prior to enrollment in this study." / I3 met: "Part 2 Cohort 6: Participants with NSCLC AGA positive" (AGA-positive NSCLC cohort after osimertinib.)
  judge-b: **possibly** - I2 met: "Participants with AGA-positive disease must have received targeted therapy prior to enrollment in this study." / I3 met: "Part 2 Cohort 6: Participants with NSCLC AGA positive" / I4 unknown: "Have measurable disease defined by RECIST version 1.1."
  Reviewer verdict: [ ]

- v012 NCT06922591 Study to Evaluate the Safety, Tolerability & Efficacy of TNG462 in Combination in PDAC & NSCLC Patients
  judge-a: **possibly** - I3 unknown: "Has a tumor with loss of MTAP protein or bi-allelic deletion of the MTAP gene" / I6 met: "Has received prior standard therapy" (MTAP status not stated; RAS arms not applicable (KRAS negative).)
  judge-b: **excluded** - I4 not_met: "Arms A and B only: Has a tumor with a RAS mutation" / I3 unknown: "Has a tumor with loss of MTAP protein or bi-allelic deletion of the MTAP gene" (NSCLC arms need RAS mutation; patient KRAS negative with otherwise negative panel.)
  Reviewer verdict: [ ]

- v012 NCT07020117 A Study of [225Ac]Ac-AKY-1189 in Patients With Solid Tumors
  judge-a: **eligible** - I7 met: "Documented disease progression on prior line of therapy for metastatic disease" / I6 met: "Patients with CNS metastases are eligible if they have received therapy and are neurologically stable" / I3 met: "ECOG Performance Status of 0 or 1" (NSCLC listed; progressed on osimertinib.)
  judge-b: **possibly** - I7 met: "Documented disease progression on prior line of therapy for metastatic disease" / I2 unknown: "Radiologic confirmation on CT of at least one measurable tumor lesion per RECIST v1.1" / I6 met: "Patients with CNS metastases are eligible if they have received therapy and are neurologically stable, asymptomatic and not receiving corticosteroids" (Phase 1 radioligand; NSCLC listed.)
  Reviewer verdict: [ ]

- v012 NCT07085091 A First in Human Study of ALX2004 With Advanced or Metastatic Selected Solid Tumors
  judge-a: **eligible** - I1 met: "Participants with locally advanced, recurrent or metastatic histologically confirmed HNSCC, NSCLC, ESCC, CRC" / I2 met: "For participants with a targetable molecular alteration: received appropriate standard targeted therapy and no more than 2 prior lines of systemic chemotherapy" (EGFR NSCLC after osimertinib fits the NSCLC cohort.)
  judge-b: **possibly** - I1 met: "Participants with locally advanced, recurrent or metastatic histologically confirmed HNSCC, NSCLC, ESCC, CRC" / I2 met: "NSCLC - For participants with a targetable molecular alteration: received appropriate standard targeted therapy" / I2 unknown: "for whom no approved or standard therapy is available" (First-in-human; cohort fit depends on remaining standard options.)
  Reviewer verdict: [ ]

- v012 NCT07098338 A Study of Novel Combinations in Non-Small Cell Lung Cancer (NSCLC)
  judge-a: **eligible** - I13 met: "Documented positive AGA and had progressed on prior targeted therapy" / I12 met: "advanced or metastatic non-squamous NSCLC" / E5 met: "Unstable brain metastases" (Sub-study 3 fits EGFR NSCLC after osimertinib.)
  judge-b: **possibly** - I13 met: "Documented positive AGA and had progressed on prior targeted therapy" / I12 met: "Histologically or cytologically documented advanced or metastatic non-squamous NSCLC" / I3 unknown: "At least 1 lesion that qualifies as a RECIST 1.1 Target Lesion (TL) at baseline." (Sub-study 3 fits; target lesion not confirmed.)
  Reviewer verdict: [ ]

- v012 NCT07111520 A Clinical Trial to Test if an Investigational Combination Therapy With BNT326 and BNT327 is Safe and Potentia
  judge-a: **eligible** - I13 met: "Have documented positive test results for an EGFR-sensitizing mutation (EGFR-sensitizing mutation Exon 21-L858R and 19del)." / I13 met: "which must include treatment with an approved EGFR TKI, with at least one being a third-generation EGFR TKI" / E8 met: "Have clinically active central nervous system metastases, defined as untreated and symptomatic" (EGFR-activating cohort after osimertinib fits; measurability not stated.)
  judge-b: **possibly** - I13 met: "Have documented positive test results for an EGFR-sensitizing mutation (EGFR-sensitizing mutation Exon 21-L858R and 19del)." / I13 met: "Participants must have received one or two prior lines of systemic therapy for advanced and/or metastatic disease, which must include treatment with an approved EGFR TKI, with at least one being a third-generation EGFR TKI." / I2 unknown: "Have measurable disease defined by RECIST v1.1." (EGFR-activating post-osimertinib cohort fits; measurability not stated.)
  Reviewer verdict: [ ]

- v012 NCT07115043 A Study to Investigate Safety of AZD6750 in Adult Participants With Select Advanced or Metastatic Solid Tumors
  judge-a: **eligible** - I14 met: "Have received at least one prior regimen in metastatic setting (2L+ NSCLC). Participants with actionable tumor alterations should have received targeted therapy if locally available" / E7 met: "Brain metastases unless treated, asymptomatic, stable" (2L+ stage IV NSCLC after targeted therapy.)
  judge-b: **possibly** - I14 met: "Have received at least one prior regimen in metastatic setting (2L+ NSCLC). Participants with actionable tumor alterations should have received targeted therapy if locally available" / I4 unknown: "At least one measurable lesion according to RECIST v1.1," / E7 met: "Brain metastases unless treated, asymptomatic, stable, and not requiring continuous corticosteroids"
  Reviewer verdict: [ ]

- v012 NCT07579221 Ph1/2 Trial Of Navlimetostat With Pumitamig In MTAP-Deficient Advanced Non-Small Cell Lung Cancer
  judge-a: **possibly** - I4 unknown: "MTAP loss as defined by homozygous deletion on NGS and/or by absent MTAP protein expression by IHC" / I9 met: "must have received appropriate targeted therapy EGFR" / E14 met: "Patients with treated brain metastases are eligible" (MTAP status not stated.)
  judge-b: **excluded** - I4 not_met: "MTAP loss as defined by homozygous deletion on NGS and/or by absent MTAP protein expression by IHC." / I9 met: "Patients with actionable genomic alterations for which targeted therapy is considered standard front-line must have received appropriate targeted therapy" (Full gene panel otherwise negative besides EGFR, so no MTAP deletion reported.)
  Reviewer verdict: [ ]

- v015 NCT07357597 An Open-label, Single-arm Study of Prophylaxis for Datopotamab Deruxtecan (Dato-DXd) -Related Stomatitis in El
  judge-a: **not_relevant** - I4 not_met: "Patients with locally advanced or metastatic EGFRm NSCLC who have received prior EGFR-directed therapy and platinum-based chemotherapy." (Stomatitis prophylaxis for Dato-DXd recipients (breast or EGFRm NSCLC); not a treatment study for this patient.)
  judge-b: **excluded** - I4 not_met: "Patients with locally advanced or metastatic EGFRm NSCLC who have received prior EGFR-directed therapy and platinum-based chemotherapy." (Supportive study for Dato-DXd recipients; patient EGFR-negative, early stage.)
  Reviewer verdict: [ ]

- v024 NCT03816345 Testing an Immunotherapy Anti-cancer Drug, Nivolumab, for Advanced Cancers in Patients With Autoimmune Disorde
  judge-a: **not_relevant** - I1 not_met: "histologically confirmed malignancy that is radiologically evaluable and metastatic or unresectable" (Nivolumab for cancer patients with autoimmune disorders; patient has no autoimmune disease and non-metastatic pMMR rectal cancer.)
  judge-b: **excluded** - I1 not_met: "Patients can have either histologically confirmed malignancy that is radiologically evaluable and metastatic or unresectable, or have a malignancy for which a PD-1/PD-L1 inhibitor has been approved in the adjuvant setting" (Non-metastatic pMMR rectal cancer; also no autoimmune disease.)
  Reviewer verdict: [ ]

- v024 NCT06565052 The Impact of PReOPerative Exercise and NutritionaL Optimization on Perioperative Outcomes for Patients Underg
  judge-a: **possibly** - I3 met: "Diagnosis of clinical stage II-III rectal cancer." / I4 met: "Planned, ongoing or just completed neoadjuvant treatment" / E6 unknown: "Currently participating in more than 60 minutes of moderate-to-vigorous aerobic exercise per week" (Prehab exercise/nutrition trial fits stage III rectal on TNT with surgery planned; current exercise level unknown.)
  judge-b: **eligible** - I3 met: "Diagnosis of clinical stage II-III rectal cancer." / I4 met: "Planned, ongoing or just completed neoadjuvant treatment, including either 1) chemoradiation, 2) total neoadjuvant therapy (TNT), or 3) chemotherapy only; and anticipated surgical resection to follow." / E6 unknown: "Currently participating in more than 60 minutes of moderate-to-vigorous aerobic exercise per week over the past month." (Prehabilitation study during TNT with surgery planned.)
  Reviewer verdict: [ ]

- v024 NCT07351071 Post-Market Study of the Signia Circular Stapler With Tri-Staple Technology in Left-sided Colon, Sigmoid, and 
  judge-a: **possibly** - I3 unknown: "Subject is intended to undergo an elective left sided colon/colorectal procedure" / I15 unknown: "Subject has undergone chemotherapy or received biologics within 6 weeks prior to the day of the procedure" (Stapler device study for rectal resection with anastomosis; depends on whether surgery happens and chemo timing.)
  judge-b: **not_relevant** - I3 unknown: "Subject is intended to undergo an elective left sided colon/colorectal procedure where a creation of an anastomosis will be completed with the Signia™ circular stapler" (Surgical stapler device study, not a cancer treatment study.)
  Reviewer verdict: [ ]

- v026 NCT05592626 A Study of a Selective T Cell Receptor (TCR) Targeting, Bifunctional Antibody-fusion Molecule STAR0602 in Part
  judge-a: **excluded** - E14 not_met: "Hepatic metastases unless adequately treated" / I3 met: "Microsatellite Instability (MSI-H)/DNA mismatch repair (dMMR)" (MSI-H fits phase 1, but untreated liver metastases excluded.)
  judge-b: **possibly** - I3 met: "Microsatellite Instability (MSI-H)/DNA mismatch repair (dMMR)" / I1 unknown: "for which standard curative therapies do not exist or are no longer effective or have intolerable toxicities" (Phase 1 MSI-H cohort; patient has not yet had standard immunotherapy.)
  Reviewer verdict: [ ]

- v026 NCT06937177 Safely Optimizing Body Weight With Mifomelatide (TCMCB07) in Patients With Newly Diagnosed Colorectal Cancer (
  judge-a: **not_relevant** - I6 met: "Newly diagnosed colorectal adenocarcinoma (CRC) or pancreatic ductal adenocarcinoma (PDAC)" / E9 not_met: "History of another malignancy except basal cell carcinoma of the skin" (Supportive weight/cachexia study, not cancer treatment; prior endometrial cancer also conflicts.)
  judge-b: **possibly** - I6 met: "Newly diagnosed colorectal adenocarcinoma (CRC) or pancreatic ductal adenocarcinoma (PDAC) that is unresectable, locally advanced (i.e., surgery with curative intent is not an option) or metastatic." / I7 unknown: "Patients must be initiating treatment with one of the following chemotherapy regimens:" / I18 unknown: "CRC Cohort i. Must have a BMI ≤ 29 kg/m^2." (Supportive weight study; depends on starting chemo (vs immunotherapy) and BMI.)
  Reviewer verdict: [ ]

- v026 NCT07143487 Family Communications After Genetic Testing
  judge-a: **not_relevant** - I2 met: "Patients with a newly diagnosed (within 3 months of registration), primary colorectal adenocarcinoma" / I7 unknown: "known hereditary colon cancer syndromes" (Family genetic-testing communication study, not a treatment study.)
  judge-b: **possibly** - I2 met: "Patients with a newly diagnosed (within 3 months of registration), primary colorectal adenocarcinoma, stage I to IV" / I7 unknown: "Have not received germline testing in the 2 years prior to enrollment or known hereditary colon cancer syndromes" / I8 unknown: "Patients must have at least 2 living FDRs who meet the eligibility criteria" (Genetic-testing communication study; suspected (not confirmed) Lynch syndrome may disqualify.)
  Reviewer verdict: [ ]

- v026 NCT07283939 Studying the PAGODA Algorithm for Chemotherapy Dose Changes to Prevent Unplanned Treatment Delays
  judge-a: **not_relevant** - I1 not_met: "Cycle 1, day 1 of FOLFOX-based chemotherapy must be completed 1 to 8 days prior to registration" (Chemotherapy dose-adjustment algorithm study, not a cancer treatment trial.)
  judge-b: **possibly** - I1 unknown: "Cycle 1, day 1 of FOLFOX-based chemotherapy must be completed 1 to 8 days prior to registration" / I1 met: "Prior systemic therapy for GI cancer (other than cycle 1 of FOLFOX-based chemotherapy) is not allowed." (Chemo dose-algorithm study; only applies if first-line FOLFOX is chosen.)
  Reviewer verdict: [ ]

- v028 NCT06400472 A Study of Sofe-M in Participants With Selected Advanced Solid Tumors
  judge-a: **possibly** - I2 met: "pancreatic cancer, or colorectal cancer (CRC)" / I1 met: "Have one of the following solid tumor cancers:" (CRC is in the escalation list; no numbered criterion requires advanced disease (only the title says advanced). Resected stage II on adjuvant therapy: discuss.)
  judge-b: **not_relevant** - I2 unknown: "Dose Escalation: Ovarian (epithelial ovarian, primary peritoneal, and fallopian tube) cancer, endometrial cancer, cervical cancer, non-small cell lung cancer (NSCLC), triple negative breast cancer (TNBC), pancreatic cancer, or colorectal cancer (CRC)" (Phase 1 for advanced solid tumors (title); patient has resected, non-advanced colon cancer.)
  Reviewer verdict: [ ]

- v028 NCT06746012 Designing a Dyad-Based mHealth Intervention to Improve Adherence to Lifestyle Recommendations in Colorectal Ca
  judge-a: **not_relevant** - I5 not_met: "Completed treatment (i.e., neo-adjuvant, adjuvant cytotoxic chemotherapy, radiation, or surgical resection) at least six months prior" / E4 not_met: "Scheduled to receive any form of cancer therapy during study participation" (Lifestyle mHealth survivorship study, not a treatment trial.)
  judge-b: **excluded** - I5 not_met: "Completed treatment (i.e., neo-adjuvant, adjuvant cytotoxic chemotherapy, radiation, or surgical resection) at least six months prior" / E4 not_met: "Scheduled to receive any form of cancer therapy during study participation" (Survivorship study; patient still on adjuvant capecitabine.)
  Reviewer verdict: [ ]

- v048 NCT06807606 Optimized Cord Blood Transplantation for the Treatment of Patients With High-risk Hematologic Malignancies Who
  judge-a: **possibly** - I2 met: "Patient must have relapsed >100 days since first transplant." / I6 met: "To be eligible for this study, patients need to have received one prior allogeneic stem cell transplantation." / I4 unknown: "Patients in morphologic remission with less than 5% blasts at time of transplant" (Second (cord) transplant after post-allo relapse; needs remission by transplant time (currently 15% blasts).)
  judge-b: **excluded** - I4 not_met: "Patients in morphologic remission with less than 5% blasts at time of transplant" / I2 met: "Patient must have relapsed >100 days since first transplant." / I6 met: "patients need to have received one prior allogeneic stem cell transplantation" (Second-transplant trial fits her history, but she currently has 15% blasts; would need reinduction to remission first.)
  Reviewer verdict: [ ]

- v060 NCT03125642 Auto Stem Cell Transplant for Lymphoma Patients
  judge-a: **possibly** - I2 met: "Patients with histologically proven HL will be eligible for transplantation after failing prior therapy." / I2 unknown: "For stage I/II patients treated with primary chemotherapy-radiation, they must have failed (no CR or progression after CR) at least one salvage combination chemotherapy treatment regimen" / E2 unknown: "Eligible for any higher priority transplant protocols" (Autologous transplant for relapsed HL fits; his salvage was brentuximab + nivolumab, not combination chemotherapy, so the stage I/II salvage rule is unclear.)
  judge-b: **eligible** - I2 met: "Patients with histologically proven HL will be eligible for transplantation after failing prior therapy." / I3 met: "Karnofsky Performance Status ≥ 80% for patients ≥ 16 years of age" / E3 met: "Chemotherapy resistant disease" (Autologous transplant for relapsed HL with partial response to second-line salvage; no prior transplant.)
  Reviewer verdict: [ ]

- v064 NCT04634552 A Study of Talquetamab in Participants With Relapsed or Refractory Multiple Myeloma
  judge-a: **possibly** - I1 met: "Documented initial diagnosis of multiple myeloma" / I3 met: "Eastern Cooperative Oncology Group (ECOG) performance status score of 0 to 2" (Title is relapsed/refractory MM, but no numbered criterion requires prior therapy (title rule).)
  judge-b: **not_relevant** - I1 unknown: "Documented initial diagnosis of multiple myeloma according to international myeloma working group (IMWG) diagnostic criteria" (Relapsed/refractory setting stated only in title; criteria give no prior-line rule to cite.)
  Reviewer verdict: [ ]

- v064 NCT05862012 Study of ISB 2001 in Relapsed/Refractory Multiple Myeloma (TRIgnite-1)
  judge-a: **possibly** - I1 met: "Participants with pathologically confirmed MM with measurable M-protein" / I3 unknown: "Must have adequate hematologic, hepatic, renal, and cardiac functions" (Title is relapsed/refractory MM, but no numbered criterion requires prior therapy (title rule); renal function with creatinine 2.0 unknown.)
  judge-b: **not_relevant** - I1 unknown: "Participants with pathologically confirmed MM with measurable M-protein" (Relapsed/refractory setting stated only in title/conditions; criteria give no prior-line rule to cite.)
  Reviewer verdict: [ ]

- v064 NCT06768489 A Study of JNJ-79635322 in Combination With Daratumumab With or Without Lenalidomide for Multiple Myeloma, New
  judge-a: **possibly** - I2 met: "Newly diagnosed MM naïve to multiple myeloma (or other related plasma cell neoplasm)-directed treatments" / I7 met: "Have an ECOG performance status of 0 to 1" / E8 unknown: "Multiple myeloma, requiring treatment" (Untreated NDMM is one of several regimens; flat-listed SMM-cohort exclusions make cohort placement the deciding question.)
  judge-b: **eligible** - I2 met: "Treatment regimens A2 and A4: Newly diagnosed MM naïve to multiple myeloma (or other related plasma cell neoplasm)-directed treatments" / I5 met: "Have measurable disease at screening" (Phase 1 NDMM cohorts fit (untreated, measurable); early phase is against his stated preference.)
  Reviewer verdict: [ ]

- v064 NCT06892522 A Study to Assess Change in Disease Activity and Adverse Events (AE)s in Adult Participants With Multiple Myel
  judge-a: **eligible** - I1 met: "Eastern cooperative oncology group (ECOG) performance of <= 1." / I2 met: "with either newly diagnosed or relapsed or refractory (RR) MM, depending on the substudy" (Includes newly diagnosed MM substudies; nothing stated rules him out.)
  judge-b: **possibly** - I2 met: "with either newly diagnosed or relapsed or refractory (RR) MM, depending on the substudy" / I1 met: "Eastern cooperative oncology group (ECOG) performance of <= 1." (Multi-substudy T-cell engager platform; fit depends on an open newly diagnosed substudy.)
  Reviewer verdict: [ ]

- v071 NCT05652335 A Study of JNJ-79635322 in Participants With Relapsed or Refractory Multiple Myeloma or Previously Treated Amy
  judge-a: **possibly** - I3 met: "Part 2: Have relapsed or refractory disease, have been treated with a PI, IMiD and an anti-CD38 based therapy" / I4 met: "Must have an Eastern Cooperative Oncology Group (ECOG) status of 0 or 1" / E6 unknown: "Prior allogeneic transplant within 6 months before the start of study treatment administration" (Trispecific phase 1 fits; HBV is controlled (not active); allo-HCT date is not stated.)
  judge-b: **eligible** - I3 met: "should have been treated with at least 3 prior lines of therapy" / I4 met: "Must have an Eastern Cooperative Oncology Group (ECOG) status of 0 or 1" / E9 met: "active hepatitis B or C infection" (HBV suppressed on entecavir; allo-HCT appears >6 months ago (before teclistamab).)
  Reviewer verdict: [ ]

- v072 NCT04913285 A Study to Evaluate KIN-2787 in Participants With BRAF and/or NRAS Mutation Positive Solid Tumors
  judge-a: **possibly** - I3 met: "Known BRAF Class I, Class II, or Class III alteration or melanoma with an NRAS mutation as confirmed by previous genomic analysis of tumor tissue or ctDNA." / I5 met: "ECOG performance status 0-1" / E1 unknown: "Known participants who have received local therapy with either surgery and/or radiation therapy" (BRAF V600E (class I) melanoma fits; E1 wording is garbled (likely about brain metastases); he is mid first-line ipi/nivo, a backup option.)
  judge-b: **eligible** - I3 met: "Known BRAF Class I, Class II, or Class III alteration or melanoma with an NRAS mutation" / I2 met: "Metastatic or advanced stage solid tumor" / E2 met: "In Part B Dose Expansion, previous treatment with any approved or in-development small molecule BRAF-, MEK-, or MAPK-directed inhibitor therapy." (BRAF V600E metastatic melanoma, BRAF/MEK-naive; enrollment would follow current ipi-nivo.)
  Reviewer verdict: [ ]

- v072 NCT06264180 VO and Nivolumab vs Physician's Choice in Advanced Melanoma That Progressed on Anti-PD-1 & Anti-CTLA-4 Drugs [
  judge-a: **excluded** - I8 not_met: "Patients with BRAF mutation should have received prior BRAF-directed therapy (with or without a MEK inhibitor) prior to randomization, unless deemed not clinically indicated at Investigator's discretion due to concurrent medical condition or prior toxicity." / I3 unknown: "Confirmed disease progression (PD) on an anti-PD-1 antibody treatment and an anti-CTLA-4 antibody treatment" (Needs progression on ipi/nivo (unknown) and, for BRAF-mutant disease, prior BRAF-directed therapy, which he has not had.)
  judge-b: **possibly** - I3 unknown: "Confirmed disease progression (PD) on an anti-PD-1 antibody treatment and an anti-CTLA-4 antibody treatment" / I8 unknown: "Patients with BRAF mutation should have received prior BRAF-directed therapy (with or without a MEK inhibitor) prior to randomization, unless deemed not clinically indicated" (Fits only after confirmed progression on ipi-nivo; BRAF therapy expected first unless not indicated.)
  Reviewer verdict: [ ]

- v072 NCT06953089 DB-1311 in Combination With BNT327 or DB-1305 in Advanced/Metastatic Solid Tumors
  judge-a: **possibly** - I7 met: "For Melanoma patients: Histologically or cytologically confirmed diagnosis of unresectable Stage III or metastatic melanoma." / I4 met: "Has an Eastern Cooperative Oncology Group (ECOG) performance status (PS) of 0-1" / I6 unknown: "Has adequate treatment washout period prior to the first dose of trial treatment." (Melanoma cohort with no numbered prior-therapy rule; he is mid first-line ipi/nivo, so this is a backup option.)
  judge-b: **eligible** - I7 met: "For Melanoma patients: Histologically or cytologically confirmed diagnosis of unresectable Stage III or metastatic melanoma." / I2 met: "At least one measurable lesion as assessed by the Investigator according to RECIST v1.1 criteria." / E7 met: "Any autoimmune, connective tissue or inflammatory disorders." (Melanoma cohort; washout after current ipi-nivo required.)
  Reviewer verdict: [ ]

- v073 NCT06961357 Clinical Trial of CD40L-augmented TIL for Patients With Advanced Melanoma
  judge-a: **possibly** - I2 met: "Participants must have failed, be refractory to, or unable to tolerate at least one line of standard of care in the opinion of the Investigator." / I8 met: "Participants with brain metastases are eligible provided that the brain metastases have been successfully treated with stereotactic radiosurgery or resection and clinically stable for at least 4 weeks" / I13 unknown: "Participants should have at least one surgically accessible lesion for tumor harvest for preparation of TIL" / E4 unknown: "Participants taking systemic steroid therapy (other than replacement therapy or prednisone equivalent of ≤10mg daily)" (TIL trial fits post-PD-1/LAG-3 cutaneous melanoma; harvestable lesion and budesonide dose equivalence unknown.)
  judge-b: **eligible** - I2 met: "Participants must have failed, be refractory to, or unable to tolerate at least one line of standard of care in the opinion of the Investigator." / I8 met: "Participants with brain metastases are eligible provided that the brain metastases have been successfully treated with stereotactic radiosurgery or resection and clinically stable" / E10 met: "Participants with active autoimmune diseases currently requiring systemic treatment with immunosuppressive doses of corticosteroids (>10 mg of prednisone-equivalent daily dosing)" (Low-dose budesonide below the steroid threshold; age 69 needs cardiac evaluation.)
  Reviewer verdict: [ ]

- v073 NCT07070232 A Clinical Study to Test if an Investigational Treatment Called BNT326 is Safe and Potentially Beneficial When
  judge-a: **possibly** - I7 met: "Participants must have previously received a PD-1 or PD-L1 inhibitor" / I3 met: "Have measurable disease defined by RECIST v1.1." / E11 unknown: "Specific to pumitamig: Have a history of intolerance to treatment with an anti-vascular endothelial growth factor, anti-PD-1/PDL-1, or similar substance" (Cutaneous melanoma cohort after PD-1 progression fits; whether her immune colitis counts as anti-PD-1 intolerance (pumitamig arms) is unclear.)
  judge-b: **eligible** - I7 met: "Participants must have previously received a PD-1 or PD-L1 inhibitor" / I3 met: "Have measurable disease defined by RECIST v1.1." / I4 met: "Have ECOG performance status of 0 or 1." (Cohort 1A: cutaneous melanoma progressing after anti-PD-1; BRAF wild-type.)
  Reviewer verdict: [ ]

- v074 NCT05086692 A Beta-only IL-2 ImmunoTherapY Study
  judge-a: **possibly** - I4 unknown: "Histologically or cytologically confirmed locally advanced or metastatic solid tumor (see tumor types listed under conditions)" / I6 met: "Measurable disease as per Response Evaluation Criteria in Solid Tumors, (RECIST v1.1) and documented by CT and/or MRI." (Listed melanoma types are acral, mucosal and cutaneous, not uveal; generic solid tumor entry may allow her.)
  judge-b: **excluded** - I4 not_met: "Histologically or cytologically confirmed locally advanced or metastatic solid tumor (see tumor types listed under conditions)" (Listed melanoma types are acral, mucosal and cutaneous; uveal not included.)
  Reviewer verdict: [ ]

- v074 NCT05533697 Study of mRNA-4359 Administered Alone and in Combination With Immune Checkpoint Blockade in Participants With 
  judge-a: **eligible** - I6 met: "Arm 2a: Locally advanced or metastatic melanoma who have not yet received any prior systemic therapy for their melanoma in this setting." / I7 met: "All participants must have measurable disease as determined by RECIST v1.1." / I10 met: "Participant has an Eastern Cooperative Oncology Group (ECOG) performance status of ≤1." (Treatment-naive metastatic melanoma expansion arm; no numbered criterion excludes uveal melanoma.)
  judge-b: **possibly** - I6 met: "Arm 2a: Locally advanced or metastatic melanoma who have not yet received any prior systemic therapy for their melanoma in this setting." / I7 met: "All participants must have measurable disease as determined by RECIST v1.1." (First-line melanoma expansion arms do not specify subtype; escalation arm is cutaneous only. Uveal fit to discuss.)
  Reviewer verdict: [ ]

- v074 NCT06242470 A Study of MGC026 in Participants With Advanced Solid Tumors
  judge-a: **possibly** - I4 met: "Unresectable, locally advanced or metastatic solid tumors including:" / I5 met: "Measurable disease per RECIST v1.1." (Phase 1 B7-H3 ADC basket listing melanoma; no numbered prior-therapy rule, but it is a first-in-human study for advanced disease and she is treatment-naive.)
  judge-b: **eligible** - I4 met: "Unresectable, locally advanced or metastatic solid tumors including" / I5 met: "Measurable disease per RECIST v1.1." / E5 met: "Prior treatment with any B7-H3 targeted agent for cancer or any ADC with a topoisomerase payload." (Melanoma listed; no prior-therapy requirement; untreated metastatic uveal melanoma fits.)
  Reviewer verdict: [ ]

- v074 NCT06956690 A Phase 1/2 Clinical Trial to Assess the Safety, Tolerability, Pharmacokinetics and Preliminary Efficacy of HM
  judge-a: **possibly** - I4 unknown: "Relapsed or refractory solid tumors, with documented HER3+ expression such as Pancreatic Ductal Adenocarcinoma (PDAC) and gastric cancers, may be allowed in the protocol following sponsor approval on a case-by -case basis." / I3 unknown: "relapsed or refractory to or ineligible for standard therapy, or for whom no standard therapy is available" (Melanoma cohort is cutaneous; uveal could enter only as another HER3+ tumor by sponsor approval; HER3 status unknown.)
  judge-b: **excluded** - I4 not_met: "Unresectable or metastatic cutaneous melanoma (HER3+)" / I5 unknown: "willingness to undergo fresh tumor biopsy for retrospective assessment of HER3+ status" (Melanoma cohort is cutaneous only; uveal primary, and patient is untreated rather than relapsed/refractory.)
  Reviewer verdict: [ ]

- v074 NCT07555210 Pilot Study of Bone Mineral Density Changes During Anti-PD-1 Immunotherapy
  judge-a: **not_relevant** - E2 not_met: "Patients with metastatic disease." / I2 not_met: "Patients planning to start or within the first four weeks of treatment with anti-PD-1 immune checkpoint inhibitor therapy" (Bone-density observational study during curative-intent anti-PD-1; she is metastatic and not on anti-PD-1.)
  judge-b: **excluded** - E2 not_met: "Patients with metastatic disease." / I2 not_met: "for curative intent for a known cancer diagnosis"
  Reviewer verdict: [ ]

- v074 NCT07584226 A First-in-human Study of RLY-8161 in Advanced NRAS-Mutant Solid Tumors
  judge-a: **possibly** - I5 unknown: "One or more documented primary oncogenic NRAS mutation(s)." / I3 unknown: "Disease is refractory to standard therapy (including targeted therapy), participant is intolerant of standard therapy, or participant has declined standard therapy." (No genomic testing reported; NRAS status unknown and she has not yet had standard therapy.)
  judge-b: **excluded** - I3 not_met: "Disease is refractory to standard therapy (including targeted therapy), participant is intolerant of standard therapy, or participant has declined standard therapy." / I5 unknown: "One or more documented primary oncogenic NRAS mutation(s)." (Untreated and has not declined standard therapy; NRAS never tested.)
  Reviewer verdict: [ ]

- v075 NCT03816345 Testing an Immunotherapy Anti-cancer Drug, Nivolumab, for Advanced Cancers in Patients With Autoimmune Disorde
  judge-a: **excluded** - E3 not_met: "Patients with prior therapy with an anti-PD-1 or anti-PD-L1" (Nivolumab study for cancer patients with autoimmune disease; she has none and has had pembrolizumab.)
  judge-b: **not_relevant** - I20 not_met: "Patients with more than one autoimmune disease are eligible." / E3 not_met: "Patients with prior therapy with an anti-PD-1 or anti-PD-L1" (Trial for cancer patients with autoimmune disorders; patient has none and already had pembrolizumab.)
  Reviewer verdict: [ ]

- v075 NCT04318717 Pembrolizumab and Hypofractionated Radiation Therapy for the Treatment of Mucosal Melanoma
  judge-a: **possibly** - I1 unknown: "Histologically or cytologically confirmed mucosal melanoma that has undergone surgical resection. Patient must not have received prior radiation therapy within the area of interest." / E2 unknown: "Received radiation therapy within the area of interest." / E4 met: "Metastatic disease." / I3 met: "Eastern Cooperative Oncology Group (ECOG) performance status ≤ 2" (Head and neck mucosal melanoma trial; prior sinonasal radiation overlap with the neck field and resection of the nodal recurrence are not stated.)
  judge-b: **excluded** - E2 not_met: "Received radiation therapy within the area of interest." (Sinonasal primary already irradiated; now recurrent nodal disease after pembrolizumab.)
  Reviewer verdict: [ ]

- v075 NCT04771520 Avapritinib for the Treatment of CKIT or PDGFRA Mutation-Positive Locally Advanced or Metastatic Malignant Sol
  judge-a: **possibly** - I7 unknown: "Documented pathogenic CKIT activating mutation (Cohort 1)" / I3 met: "Patient has a locally advanced or metastatic solid tumor and has progressed on appropriate standard therapy" / E3 unknown: "Patients with tyrosine kinase inhibitor-resistant CKIT mutation V654A or T670I." / I17 met: "Eastern Cooperative Oncology Group performance status of 0-2." (KIT-mutant mucosal melanoma after anti-PD-1 fits the CKIT cohort; whether her exact KIT variant is a listed activating mutation is not stated.)
  judge-b: **eligible** - I3 met: "Patient has a locally advanced or metastatic solid tumor and has progressed on appropriate standard therapy" / I7 met: "Documented pathogenic CKIT activating mutation (Cohort 1)" / I17 met: "Eastern Cooperative Oncology Group performance status of 0-2." (KIT-mutant mucosal melanoma progressed on pembrolizumab; exact KIT variant to be verified against appendix.)
  Reviewer verdict: [ ]

- v075 NCT05098210 Personalized Neo-Antigen Peptide Vaccine for the Treatment of Stage IIIC-IV Melanoma, Hormone Receptor Positiv
  judge-a: **possibly** - I18 unknown: "Histologically confirmed metastatic (recurrent or de novo stage IV) or unresectable locally advanced (stage IIIC or IIID) cutaneous, acral, conjunctival or mucosal melanoma" / I2 met: "Eastern Cooperative Oncology Group (ECOG) performance status (PS) 0, 1, or 2" / I21 met: "History of detectable disease during/after treatment with a PD-1 or PD-L1 inhibitor" / I20 met: "MELANOMA SPECIFIC: Known BRAF mutational status" (Mucosal melanoma after anti-PD-1 and ECOG 2 fit; whether her neck nodal recurrence counts as unresectable stage IIIC/IIID is not stated.)
  judge-b: **eligible** - I18 met: "cutaneous, acral, conjunctival or mucosal melanoma" / I2 met: "Eastern Cooperative Oncology Group (ECOG) performance status (PS) 0, 1, or 2" / I19 met: "have persistent/recurrent disease after at least one line of therapy prior to enrollment on the study" / I20 met: "MELANOMA SPECIFIC: Known BRAF mutational status" (Mucosal melanoma progressing after ~10 months of pembrolizumab; ECOG 2 allowed.)
  Reviewer verdict: [ ]

- v075 NCT05144698 RAPA-201 Therapy of Solid Tumors
  judge-a: **possibly** - I3 unknown: "Advanced metastatic, recurrent, and unresectable solid tumor that has relapsed after ≥ one prior line of therapy." / I7 met: "relapse within 12-months of initiation of anti-PD-(L)1-containing therapy" / I2 met: "Eastern Cooperative Oncology Group (ECOG) performance status of ≤ 2." (Relapse about ten months into pembrolizumab and ECOG 2 fit; unresectability of the nodal recurrence is not stated.)
  judge-b: **eligible** - I2 met: "Eastern Cooperative Oncology Group (ECOG) performance status of ≤ 2." / I7 met: "relapse within 12-months of initiation of anti-PD-(L)1-containing therapy" / I9 met: "malignant melanoma" (Progressed ~10 months into pembrolizumab (most recent line); ECOG 2 allowed.)
  Reviewer verdict: [ ]

- v075 NCT06398418 R-5780-01 In Combination With PD-1 Checkpoint Inhibitors (Checkpoint Protein on Immune Cells Called T Cells) i
  judge-a: **possibly** - I3 unknown: "Unresectable stage III or stage IV melanoma" / I4 met: "Refractory to anti-PD (checkpoint Protein on Immune Cells called T cells)-1/L1 therapy per RECIST v1.1" / I6 met: "Eastern Cooperative Oncology Group (ECOG) performance status of 0, 1 or 2" / E12 met: "More than 4 prior systemic therapies" (Anti-PD-1-refractory melanoma, ECOG 2 and age 74 all fit; whether her neck nodal recurrence is unresectable is not stated.)
  judge-b: **eligible** - I4 met: "Refractory to anti-PD (checkpoint Protein on Immune Cells called T cells)-1/L1 therapy per RECIST v1.1" / I6 met: "Eastern Cooperative Oncology Group (ECOG) performance status of 0, 1 or 2" / I3 met: "Unresectable stage III or stage IV melanoma" (PD-1-refractory recurrent nodal melanoma, age 74 within 18-80, ECOG 2 allowed.)
  Reviewer verdict: [ ]

- v080 NCT04503265 A Trial of AMXI-5001 for Treatment in Patients With Advanced Malignancies
  judge-a: **excluded** - I2 not_met: "Malignancy has progressed after standard therapy" / E1 unknown: "Receiving cancer treatment at the time of enrollment" (Requires intolerance, refractoriness or progression; he is stable and tolerating first-line FOLFIRINOX.)
  judge-b: **possibly** - I2 unknown: "Malignancy has progressed after standard therapy" / E1 unknown: "Receiving cancer treatment at the time of enrollment" (Currently on FOLFIRINOX with stable imaging; eligible only after progression/stopping.)
  Reviewer verdict: [ ]

- v080 NCT04939610 A Study of 177Lu-FAP-2286 in Advanced Solid Tumors
  judge-a: **excluded** - I14 not_met: "Participants must have progressed after at least 1, but no more than two prior chemotherapy regimens for locally advanced unresectable or metastatic disease." / I14 not_met: "Participants have not received prior systemic therapy for metastatic disease." / I12 not_met: "Tumor must be refractory to or have progressed following prior treatment" (PDAC monotherapy needs progression, combination needs no prior therapy; he is stable on first-line FOLFIRINOX.)
  judge-b: **possibly** - I14 unknown: "Participants must have progressed after at least 1, but no more than two prior chemotherapy regimens for locally advanced unresectable or metastatic disease." / I7 met: "Have an Eastern Oncology Group (ECOG) performance status of 0 or 1." (PDAC monotherapy group needs progression after first line; imaging stable, CA 19-9 rising.)
  Reviewer verdict: [ ]

- v080 NCT05417594 Study of AZD9574 as Monotherapy and in Combination With Anti-cancer Agents in Participants With Advanced Solid
  judge-a: **excluded** - I2 not_met: "Progressive cancer at the time of enrollment." / I7 unknown: "Histologically or cytologically confirmed advanced/metastatic pancreatic cancer and evidence of a predicted loss of function germline or tumour mutation" (Requires progressive cancer; latest CT stable on first-line FOLFIRINOX. BRCA1/2 and PALB2 negative; RAD51C/D not reported.)
  judge-b: **possibly** - I7 not_met: "Histologically or cytologically confirmed advanced/metastatic pancreatic cancer and evidence of a predicted loss of function germline or tumour mutation in one of the following homologous recombination repair genes: BRCA1, BRCA2, PALB2, RAD51C, or RAD51D." / I44 unknown: "Participants with non-breast and non-gastric cancers must have HER2-overexpression (IHC 3+ or IHC 2+" / I2 unknown: "Progressive cancer at the time of enrollment." (BRCA1/2 and PALB2 negative so PARPi pancreatic module does not fit; only HER2 module (untested) remains.)
  Reviewer verdict: [ ]

- v080 NCT06040541 Study of RMC-9805 in Participants With KRAS G12D-Mutant Solid Tumors
  judge-a: **excluded** - I2 not_met: "Received and progressed or been intolerant to prior standard therapy" / I1 met: "with a KRAS G12D-mutation" (KRAS G12D fits, but he has not progressed on or been intolerant to first-line FOLFIRINOX.)
  judge-b: **possibly** - I1 met: "Pathologically documented, locally advanced or metastatic solid tumor with a KRAS G12D-mutation" / I2 unknown: "Received and progressed or been intolerant to prior standard therapy" (KRAS G12D; awaiting progression on first-line FOLFIRINOX.)
  Reviewer verdict: [ ]

- v080 NCT06242470 A Study of MGC026 in Participants With Advanced Solid Tumors
  judge-a: **possibly** - I4 met: "pancreatic carcinoma" / I2 unknown: "Adequate performance and laboratory parameters" / E4 unknown: "Treatment with surgery, systemic cancer therapy, immunotherapy, chimeric antigen receptor-T therapy, or anti-hormonal within protocol specified intervals." (First-in-human basket listing pancreatic carcinoma; no numbered prior-therapy or progression rule (title rule).)
  judge-b: **eligible** - I4 met: "pancreatic carcinoma" / I5 met: "Measurable disease per RECIST v1.1." / E5 met: "Prior treatment with any B7-H3 targeted agent for cancer or any ADC with a topoisomerase payload." (No prior-line requirement; would start after FOLFIRINOX washout.)
  Reviewer verdict: [ ]

- v080 NCT06411691 KRAS-Targeted Vaccine Combined With Balstilimab and Botensilimab for Patients With Stage IV MMR-p Colorectal C
  judge-a: **possibly** - I7 met: "Cohort A: Have received 4-6 months of FOLFIRINOX or gemcitabine+nab-paclitaxel for the 1st line treatment of metastatic unresectable PDAC." / I6 unknown: "Have one of the KRAS mutations included in the vaccine at the time of vaccination expressed in tumor." / I10 unknown: "Eastern Cooperative Oncology Group (ECOG) performance status 0." (About 4 months of first-line FOLFIRINOX; vaccine KRAS variants and strict ECOG 0 need confirming.)
  judge-b: **eligible** - I7 met: "Cohort A: Have received 4-6 months of FOLFIRINOX or gemcitabine+nab-paclitaxel for the 1st line treatment of metastatic unresectable PDAC." / I6 met: "Have one of the KRAS mutations included in the vaccine at the time of vaccination expressed in tumor." / I10 met: "Eastern Cooperative Oncology Group (ECOG) performance status 0." (About 4 months of first-line FOLFIRINOX, KRAS G12D; fully active (walks miles, works).)
  Reviewer verdict: [ ]

- v080 NCT06465069 A Study of LY4052031 in Participants With Advanced or Metastatic Urothelial Cancer or Other Solid Tumors
  judge-a: **excluded** - I4 not_met: "Cohort A1/C: Individual has received all standard therapies for which the participant was deemed to be an appropriate candidate by the treating investigator; OR there is no standard therapy available for the disease." / I2 met: "pancreatic cancer" (Requires exhausted standard therapy; he is still on first line with later standard lines available.)
  judge-b: **possibly** - I4 unknown: "Cohort A1/C: Individual has received all standard therapies for which the participant was deemed to be an appropriate candidate by the treating investigator" / I9 met: "Have an Eastern Cooperative Oncology Group (ECOG) performance status of 0 or 1" (Pancreatic cancer cohort; second-line standard options still available.)
  Reviewer verdict: [ ]

- v080 NCT06582017 Safety, PK and Efficacy of QXL138AM in Patients With Solid Tumors and Multiple Myeloma
  judge-a: **excluded** - I2 not_met: "Patients must have no available therapeutic options known to confer clinical benefit for their tumor type." (Stable on first-line FOLFIRINOX with standard later lines still available.)
  judge-b: **possibly** - I2 unknown: "Patients must have no available therapeutic options known to confer clinical benefit for their tumor type." (Still on first-line therapy with second-line options remaining.)
  Reviewer verdict: [ ]

- v080 NCT06723236 A Study of MGC028 in Participants With Advanced Solid Tumors
  judge-a: **possibly** - I3 met: "following at least 1 systemic therapy" / I1 not_met: "pancreatic carcinoma that is refractory to standard therapy" / I6 unknown: "Participants have acceptable physical condition and laboratory values." (Dose escalation needs refractory disease, but the pancreatic expansion cohort only requires at least one prior systemic therapy.)
  judge-b: **eligible** - I3 met: "following at least 1 systemic therapy" / I4 met: "Participants must have at least one lesion that meets the definition of measurable disease by RECIST v1.1." (Pancreatic expansion cohort requires >=1 prior systemic therapy, not progression; needs 4-week washout.)
  Reviewer verdict: [ ]

- v080 NCT06747845 Maintenance Niraparib Plus Ipilimumab in Patients With Metastatic Pancreatic Adenocarcinoma Whose Disease Has 
  judge-a: **excluded** - I5 not_met: "This requires at least stable imaging and a stable or decreasing tumor marker as applicable" / I4 met: "Participants must have received 8-12 cycles (4-6 months) of first-line FOLFIRINOX or modified FOLFIRINOX for metastatic disease with stable disease or better." (Eight cycles with stable CT fit, but his CA 19-9 is rising and the trial requires a stable or falling marker.)
  judge-b: **possibly** - I4 met: "Participants must have received 8-12 cycles (4-6 months) of first-line FOLFIRINOX or modified FOLFIRINOX for metastatic disease with stable disease or better." / I5 unknown: "This requires at least stable imaging and a stable or decreasing tumor marker as applicable and as determined by the investigator." / E3 met: "Patients with known pathogenic/likely pathogenic germline or somatic alteration(s) in BRCA1, BRCA2, PALB2, RAD51C, or RAD51D." (8 cycles with stable CT fits, but CA 19-9 starting to rise may fail the stable-marker requirement.)
  Reviewer verdict: [ ]

- v080 NCT06835569 A Study to Learn About Study Medicine ALTA3263 in Adults With Advanced Solid Tumors With KRAS Mutations
  judge-a: **excluded** - I1 met: "harboring a KRAS mutation" / I3 not_met: "Progressed on, intolerant to, or declined prior standard-of-care therapy" (Stable and tolerating first-line FOLFIRINOX; not yet progressed, intolerant or declining.)
  judge-b: **possibly** - I1 met: "Histologically confirmed diagnosis of a solid tumor malignancy harboring a KRAS mutation" / I3 unknown: "Progressed on, intolerant to, or declined prior standard-of-care therapy" (Not yet progressed on first-line FOLFIRINOX.)
  Reviewer verdict: [ ]

- v080 NCT07049055 A Clinical Trial to Evaluate EDV Nanocell Therapy With Gemcitabine and Nab-paclitaxel in Pancreatic Cancer
  judge-a: **excluded** - I7 not_met: "Documented disease progression with first line FOLFIRINOX or NALIRIFOX therapy" / I6 unknown: "Subjects must have tumors that express EGFR." (Second-line trial requiring progression on FOLFIRINOX; his latest CT is stable.)
  judge-b: **possibly** - I7 unknown: "Documented disease progression with first line FOLFIRINOX or NALIRIFOX therapy" / I6 unknown: "Subjects must have tumors that express EGFR." (Post-FOLFIRINOX second-line design; imaging stable with rising CA 19-9; EGFR untested.)
  Reviewer verdict: [ ]

- v080 NCT07277413 A Study of IDE892 as Monotherapy and Combination in MTAP-deleted Advanced Solid Tumors
  judge-a: **excluded** - E28 not_met: "Must have progressed following at least 1 prior line of therapy" / I5 unknown: "Have evidence of homozygous loss of MTAP or MTAP deletion" (Mis-sectioned inclusion requires progression after a prior line; he is stable on first-line FOLFIRINOX. MTAP status unknown.)
  judge-b: **possibly** - I5 unknown: "Have evidence of homozygous loss of MTAP or MTAP deletion" / E28 unknown: "Must have progressed following at least 1 prior line of therapy" (MTAP status untested; not yet progressed on first-line FOLFIRINOX.)
  Reviewer verdict: [ ]

- v080 NCT07450859 A Study of Nuzefatide Pevedotin (BT5528) in Patients With Metastatic Pancreatic Ductal Adenocarcinoma (PDAC)
  judge-a: **excluded** - I6 not_met: "with evidence of radiographic progression" / I5 met: "Histologically confirmed metastatic pancreatic ductal adenocarcinoma (PDAC)." (Second-line trial requiring radiographic progression; latest CT shows stable liver disease.)
  judge-b: **possibly** - I6 unknown: "Participants must have failed whose disease has progressed on or after only 1 prior line of therapy" / I5 met: "Histologically confirmed metastatic pancreatic ductal adenocarcinoma (PDAC)." (Second-line PDAC trial; imaging currently stable with rising CA 19-9, radiographic progression not yet documented.)
  Reviewer verdict: [ ]

- v080 NCT07458347 A Phase 1 Dose-escalation Trial of KST-6051 in Participants With Advanced Solid Tumors With Kirsten Rat Sarcom
  judge-a: **excluded** - I5 not_met: "Progressed on or intolerant to standard treatment(s)." / I4 met: "Documentation of KRAS mutation prior to the first dose of trial drug(s)." (Not yet progressed on or intolerant to first-line therapy.)
  judge-b: **possibly** - I4 met: "Documentation of KRAS mutation prior to the first dose of trial drug(s)." / I5 unknown: "Progressed on or intolerant to standard treatment(s)." (Not yet progressed on first-line therapy.)
  Reviewer verdict: [ ]

- v080 NCT07629960 A First-in-Human Trial of BLU-924 (SAR449336) in Advanced Solid Tumors Harboring KRAS Mutations
  judge-a: **excluded** - I4 not_met: "Patients must have received all standard therapies for their cancer type in the metastatic setting" / I1 met: "single KRAS G12C, G12D, G12V, G12A, G12S, or G13D mutation" (Requires all standard metastatic therapies; he is still on first line.)
  judge-b: **possibly** - I1 met: "with evidence of a single KRAS G12C, G12D, G12V, G12A, G12S, or G13D mutation" / I4 unknown: "Patients must have received all standard therapies for their cancer type in the metastatic setting" (Second-line standard therapy still available.)
  Reviewer verdict: [ ]

- v081 NCT06445062 Study of RAS(ON) Inhibitors in Patients With Gastrointestinal Solid Tumors
  judge-a: **possibly** - I5 not_met: "Pathologically or cytologically documented pancreatic carcinoma or poorly differentiated pancreatic carcinoma with metastatic disease" / I6 unknown: "Presence of RAS G12D mutation (Subprotocol D, E, F, G)" (Metastatic requirement covers subprotocols A-C/G; D-F need only RAS G12D, which is untested. Likely metastatic-only in practice.)
  judge-b: **excluded** - I5 not_met: "Pathologically or cytologically documented pancreatic carcinoma or poorly differentiated pancreatic carcinoma with metastatic disease" / I6 unknown: "Presence of RAS G12D mutation"
  Reviewer verdict: [ ]

- v081 NCT07817147 CREO - Microwave Ablation Feasibility Study
  judge-a: **possibly** - I3 unknown: "Histologically confirmed locally advanced, unresectable or metastatic cancer (Stage III or IV)" / E1 met: "Participant is a candidate for upfront resection of pancreatic cancer" / I5 met: "The tumor(s) must be ≥1 cm in diameter" (Borderline resectable, not upfront resection; stage III/IV status not stated.)
  judge-b: **excluded** - I3 not_met: "Histologically confirmed locally advanced, unresectable or metastatic cancer (Stage III or IV)" (Borderline resectable disease planned for neoadjuvant chemotherapy then surgery.)
  Reviewer verdict: [ ]

- v086 NCT05005403 Study to Assess Adverse Events and Pharmacokinetics in Adult Participants With Non-Small Cell Lung Cancer, Hea
  judge-a: **excluded** - I10 not_met: "Pancreatic Adenocarcinoma (PDAC) - Advanced/metastatic progressed after SOC." (PDAC cohort requires progression after standard care; her LAPC is stable.)
  judge-b: **possibly** - I10 unknown: "Pancreatic Adenocarcinoma (PDAC) - Advanced/metastatic progressed after SOC." / I2 met: "Eastern Cooperative Oncology Group (ECOG) performance status of <= 0 or 1" (Advanced PDAC after SOC, but disease currently stable rather than progressed.)
  Reviewer verdict: [ ]

- v086 NCT06040541 Study of RMC-9805 in Participants With KRAS G12D-Mutant Solid Tumors
  judge-a: **excluded** - I2 not_met: "Received and progressed or been intolerant to prior standard therapy" / I1 unknown: "locally advanced or metastatic solid tumor with a KRAS G12D-mutation" (Requires progression or intolerance on standard therapy; her disease is stable. KRAS variant unstated.)
  judge-b: **possibly** - I1 unknown: "Pathologically documented, locally advanced or metastatic solid tumor with a KRAS G12D-mutation" / I2 unknown: "Received and progressed or been intolerant to prior standard therapy" (KRAS variant not stated; no progression yet.)
  Reviewer verdict: [ ]

- v086 NCT06885697 Anti-Mesothelin TNaive/SCM hYP218 (TNhYP218) CAR T Cells in Participants With Mesothelin-Expressing Solid Tumo
  judge-a: **excluded** - I4 not_met: "Participant must have progressed on at least one FDA-approved systemic therapy considered standard of care for their tumor type." / I6 unknown: "Tumor must have MSLN positivity" (Requires progression on standard therapy; her disease is stable.)
  judge-b: **possibly** - I4 unknown: "Participant must have progressed on at least one FDA-approved systemic therapy considered standard of care for their tumor type." / I6 unknown: "Tumor must have MSLN positivity of 2+ to 3+ in >= 50% cancer cells by immunohistochemistry" (Pancreatic patients may undergo leukapheresis during frontline; MSLN untested, no progression yet.)
  Reviewer verdict: [ ]

- v086 NCT06906562 A Phase II Nationwide, Fully Decentralized, Telemedicine Study of Pemigatinib in Adult Patients With Advanced 
  judge-a: **excluded** - I6 not_met: "Patients should have had evidence of progressive disease following their prior regimen, or if prior treatment was discontinued due to toxicity must have continued evidence of measurable or evaluable disease." / I2 unknown: "determination of FGFR gene fusions/translocations or activating mutations" (Requires progression after prior regimen (or stopping for toxicity); her LAPC is stable after completing therapy. FGFR untested.)
  judge-b: **possibly** - I2 unknown: "Written documentation of local or central Clinical Laboratory Improvement Act (CLIA)-certified laboratory determination of FGFR gene fusions/translocations or activating mutations" / I6 unknown: "Patients should have had evidence of progressive disease following their prior regimen" (FGFR status not reported (KRAS-mutant allowed only in cohort 2); stable after first line.)
  Reviewer verdict: [ ]

- v086 NCT07066657 A Study of MRG007 (ARR-217) in Patients With Advanced Solid Tumors
  judge-a: **excluded** - I4 not_met: "Patients with histologically and cytologically confirmed advanced or metastatic solid tumor who have failed or intolerant to standard therapy" (Requires failure of standard therapy; her LAPC is stable after FOLFIRINOX and chemoradiation.)
  judge-b: **possibly** - I4 unknown: "Patients with histologically and cytologically confirmed advanced or metastatic solid tumor who have failed or intolerant to standard therapy, or without alternative standard therapy." / I3 met: "Tumor specimen available for CDH17 testing, or agree to biopsy at baseline." (Stable after first-line therapy; standard second-line options remain.)
  Reviewer verdict: [ ]

- v086 NCT07127874 A Study of PHN-012 in Patients With Advanced Solid Tumors
  judge-a: **excluded** - I3 not_met: "Has received at least one prior systemic therapy and radiologically or clinically determined progressive disease during or after the most recent line of therapy" (Requires progression after the last line; her LAPC is stable.)
  judge-b: **possibly** - I2 met: "Pancreatic ductal adenocarcinoma (PDAC)." / I3 unknown: "Has received at least one prior systemic therapy and radiologically or clinically determined progressive disease during or after the most recent line of therapy" (No progression yet after first-line therapy; prior irinotecan is not an ADC so E1 not triggered.)
  Reviewer verdict: [ ]

- v086 NCT07192432 Gene Therapy for HER-Positive Cancer (SENTRY-HER2)
  judge-a: **excluded** - I3 not_met: "Part 1: presence of advanced or metastatic disease that has progressed during or following previous treatment" / I4 not_met: "Part 2: Early stage HER-2 positive cancers" / I2 unknown: "Histologically or cytologically confirmed diagnosis of HER-2 positive solid tumor" (Part 1 needs progression (hers is stable); Part 2 is early-stage disease. HER2 untested.)
  judge-b: **possibly** - I2 unknown: "Histologically or cytologically confirmed diagnosis of HER-2 positive solid tumor as defined in the protocol" / I3 unknown: "Part 1: presence of advanced or metastatic disease that has progressed during or following previous treatment" (HER2 status not reported; disease currently stable.)
  Reviewer verdict: [ ]

- v086 NCT07223047 A Study to Evaluate the Safety, Tolerability, and Efficacy of BMS-986523 Alone and in Combination With Anti-Ca
  judge-a: **possibly** - I1 met: "locally advanced and unresectable or metastatic solid tumor malignancy with a known Kirsten rat sarcoma viral oncogene homolog (KRAS) alteration" / I3 unknown: "Participants must have previously received, be ineligible for, or decline" (KRAS-mutant LAPC fits; whether FOLFIRINOX satisfies the protocol-defined SoC for her arm is unknown.)
  judge-b: **eligible** - I1 met: "Participants must have a histologically confirmed diagnosis of a locally advanced and unresectable or metastatic solid tumor malignancy with a known Kirsten rat sarcoma viral oncogene homolog (KRAS) alteration" / I3 met: "Participants must have previously received, be ineligible for, or decline (after having been provided adequate information to make an informed decision) the protocol defined standard of care (SoC) treatments." (KRAS-mutant LAPC after completed first-line FOLFIRINOX and chemoradiation.)
  Reviewer verdict: [ ]

- v086 NCT07349537 Study of RMC-5127 in Patients With Advanced KRAS G12V-Mutant Solid Tumors
  judge-a: **excluded** - I4 not_met: "Received and progressed or been intolerant to prior standard therapy (including targeted therapy) appropriate for tumor type and stage." / I3 unknown: "KRAS G12V-mutated solid tumor malignancy" (Requires progression or intolerance; her LAPC is stable. KRAS variant unstated.)
  judge-b: **possibly** - I3 unknown: "Pathologically documented, locally advanced or metastatic KRAS G12V-mutated solid tumor malignancy." / I4 unknown: "Received and progressed or been intolerant to prior standard therapy" (KRAS variant not stated; no progression yet.)
  Reviewer verdict: [ ]

- v086 NCT07458347 A Phase 1 Dose-escalation Trial of KST-6051 in Participants With Advanced Solid Tumors With Kirsten Rat Sarcom
  judge-a: **excluded** - I5 not_met: "Progressed on or intolerant to standard treatment(s)." / I4 met: "Documentation of KRAS mutation prior to the first dose of trial drug(s)." (KRAS-mutant fits, but her disease is stable on standard therapy (no progression or intolerance).)
  judge-b: **possibly** - I4 met: "Documentation of KRAS mutation prior to the first dose of trial drug(s)." / I5 unknown: "Progressed on or intolerant to standard treatment(s)." (Stable disease after FOLFIRINOX and chemoradiation; no progression yet.)
  Reviewer verdict: [ ]

- v093 NCT06400472 A Study of Sofe-M in Participants With Selected Advanced Solid Tumors
  judge-a: **possibly** - I2 met: "Dose Escalation: Ovarian (epithelial ovarian, primary peritoneal, and fallopian tube) cancer" (No numbered stage or measurability criterion ('advanced' only in title, as v028-3); she is NED on maintenance, so fit is doubtful.)
  judge-b: **not_relevant** - I2 unknown: "Ovarian (epithelial ovarian, primary peritoneal, and fallopian tube) cancer" (Advanced-solid-tumor dose-finding study (title); patient is NED on first-line maintenance. Criteria do not state stage, so no not_met.)
  Reviewer verdict: [ ]

- v093 NCT07470853 A Study of MUC16-Directed Antibody Drug Conjugate HWK-016 in Participants With Advanced Solid Tumors.
  judge-a: **possibly** - I2 met: "Ovarian Cancer" (Only the tumor type is a numbered criterion ('advanced' and PROC only in title/conditions); she is NED on maintenance, so fit is doubtful.)
  judge-b: **not_relevant** - I2 unknown: "Ovarian Cancer" (Advanced-solid-tumor/PROC ADC study per title; patient NED on first-line maintenance. Criteria list only tumor types.)
  Reviewer verdict: [ ]

- v102 NCT04196413 GD2 CAR T Cells in Diffuse Intrinsic Pontine Gliomas (DIPG) & Spinal Diffuse Midline Glioma(DMG)
  judge-a: **not_relevant** - I1 not_met: "Disease Status: Diagnosis of H3K27M mutant diffuse midline glioma (DMG)" (H3K27M diffuse midline glioma trial; he has IDH-wildtype GBM (DMG trials not_relevant, as run 17).)
  judge-b: **excluded** - I1 not_met: "Diagnosis of H3K27M mutant diffuse midline glioma (DMG)" / E4 not_met: "Current systemic corticosteroid therapy above physiologic replacement levels." (IDH-wildtype GBM, not H3K27M DMG; on dexamethasone 8 mg/day.)
  Reviewer verdict: [ ]

- v102 NCT05212272 MRI in High-Grade Glioma Patients Undergoing Chemoradiation
  judge-a: **excluded** - I4 not_met: "Anticipated to receive 6 weeks of chemoradiation" (Imaging study during upfront chemoradiation; he finished chemoradiation long ago and is not planned for another course.)
  judge-b: **not_relevant** - I4 not_met: "Anticipated to receive 6 weeks of chemoradiation" (Imaging study during initial chemoradiation; patient is far past that.)
  Reviewer verdict: [ ]

- v102 NCT07831369 VISTA: Valproic Acid, Irinotecan, and Simvastatin for Recurrent Glioma
  judge-a: **eligible** - I2 met: "For glioblastoma, at least one prior treatment, which needs to include temozolomide and/or radiation" / I4 met: "Evidence of progression by RANO 2.0 criteria on MRI within last four weeks" / E2 met: "Prior treatment with irinotecan" (Recurrent GBM after RT/TMZ, currently growing, no irinotecan listed; the trial has no performance-status or steroid limit.)
  judge-b: **possibly** - I2 met: "For glioblastoma, at least one prior treatment, which needs to include temozolomide and/or radiation" / I4 unknown: "Evidence of progression by RANO 2.0 criteria on MRI within last four weeks" / E4 unknown: "Anticancer treatment within 4 weeks, 6 weeks if nitrosourea" (No performance-status or steroid limits listed; must come off the current experimental trial; scan timing unknown.)
  Reviewer verdict: [ ]

- v103 NCT06414460 Study of ISM3412 in Participants With Locally Advanced/Metastatic Solid Tumors
  judge-a: **not_relevant** - E9 not_met: "Known active central nervous system (CNS) primary tumor or untreated CNS metastases." (MTAP solid-tumor basket that bars primary CNS tumors (run 18 rule).)
  judge-b: **excluded** - E9 not_met: "Known active central nervous system (CNS) primary tumor or untreated CNS metastases." / I2 unknown: "confirmed homozygous MTAP deletion"
  Reviewer verdict: [ ]

- v103 NCT07403721 AMG 436 as Monotherapy and Combination Therapy in Participants With MSI-H/dMMR Solid Tumors
  judge-a: **not_relevant** - E1 not_met: "Participants with primary central nervous system (CNS) tumors." (MSI-H solid-tumor trial that bars primary CNS tumors.)
  judge-b: **excluded** - E1 not_met: "Participants with primary central nervous system (CNS) tumors."
  Reviewer verdict: [ ]

- v108 NCT06770582 Testing the Addition of the Immunotherapy Drug, Pembrolizumab, to Radiation Therapy Compared to the Usual Chem
  judge-a: **excluded** - I1 not_met: "Pathologically (histologically) proven diagnosis of T1 high-grade non-muscle invasive urothelial carcinoma of the bladder without radiographic evidence of regional nodal disease or metastatic disease (N0, M0) on CT, MRI, or positron emission tomography (PET)/CT scan who would otherwise be treated with cystectomy off-trial." / I5 unknown: "Restaging TURBT must be performed" / I12 met: "Eastern Cooperative Oncology Group (ECOG) performance status of 0-2" (RT trial for cystectomy-recommended high-risk T1 NMIBC; her urologist plans standard BCG for a new tumor (T stage, variant features not stated).)
  judge-b: **possibly** - I1 unknown: "Pathologically (histologically) proven diagnosis of T1 high-grade non-muscle invasive urothelial carcinoma of the bladder" / I3 unknown: "High grade T1 disease history that must meet at least ONE of the three criteria below:" / I12 met: "Eastern Cooperative Oncology Group (ECOG) performance status of 0-2" / I26 unknown: "New York Heart Association Functional Classification II or better" (High-grade NMIBC; T1 status, high-risk features and restaging TURBT unknown; urologist currently plans BCG; heart failure class unknown.)
  Reviewer verdict: [ ]

- v109 NCT06656390 A Study to Evaluate the Safety, Tolerability, Pharmacokinetics (PK), and Antitumor Activity of ALK201 in Parti
  judge-a: **possibly** - I2 met: "At least 1 measurable lesion per RECIST v1.1" / I4 met: "Eastern Cooperative Oncology Group Performance Status (ECOG PS) score of 0 or 1" / E1 met: "Active or pre-existing autoimmune diseases that may relapse" (Advanced solid tumor phase 1/2 with no numbered stage or prior-therapy rule; 'advanced' is only in the title (title rule), and she is headed to curative neoadjuvant chemo.)
  judge-b: **not_relevant** - I2 unknown: "At least 1 measurable lesion per RECIST v1.1" (Phase 1 advanced-solid-tumor study (title); patient is untreated with curative-intent neoadjuvant chemo and surgery planned. Criteria do not state stage.)
  Reviewer verdict: [ ]

- v121 NCT05270213 Evaluation of RBS2418 in Subjects With Advanced, Metastatic Solid Tumors
  judge-a: **excluded** - I3 not_met: "Male and female subjects with advanced unresectable, recurrent or metastatic tumors who have received standard of care (SOC) therapy for their advanced/metastatic tumors and have no other SOC therapy available." / I6 met: "Have measurable disease based on RECIST 1.1." (Further standard HCC options remain after atezolizumab/bevacizumab and lenvatinib (e.g. cabozantinib, regorafenib).)
  judge-b: **possibly** - I3 unknown: "who have received standard of care (SOC) therapy for their advanced/metastatic tumors and have no other SOC therapy available" / I6 met: "Have measurable disease based on RECIST 1.1." / E14 met: "subjects with a history of HCV are eligible as long as viral RNA is below level of detection" (Progressed on atezo/bev and lenvatinib; further standard second/third-line options may remain.)
  Reviewer verdict: [ ]

- v121 NCT06656390 A Study to Evaluate the Safety, Tolerability, Pharmacokinetics (PK), and Antitumor Activity of ALK201 in Parti
  judge-a: **possibly** - I2 met: "At least 1 measurable lesion per RECIST v1.1" / I4 met: "Eastern Cooperative Oncology Group Performance Status (ECOG PS) score of 0 or 1" / I5 unknown: "Adequate organ function" (Advanced solid tumor phase 1 with no tumor-type or prior-therapy rule listed; organ function with cirrhosis and low platelets unknown.)
  judge-b: **eligible** - I1 met: "Men and women ≥18 and ≤75 years old on the day of signing the ICF" / I2 met: "At least 1 measurable lesion per RECIST v1.1" / I4 met: "Eastern Cooperative Oncology Group Performance Status (ECOG PS) score of 0 or 1" (Advanced solid tumor study with no prior-therapy restriction; age 71 within limit.)
  Reviewer verdict: [ ]

- v132 NCT01365169 Association Between Health Care Provider (HCP)-Assessed ECOG Performance Status (PS) and Overall Survival, and
  judge-a: **possibly** - I14 met: "Diagnosis of a metastatic or locally unresectable solid tumor (TAPS study)" / I17 met: "ECOG performance status score between 0-3 (TAPS study)" / I10 unknown: "Lives in the Houston or surrounding area, or resides in this same area during the time period that coincides with this study (Arms 1-4)" (Observational activity study; the TAPS arm (metastatic solid tumor, ECOG 0-3) fits, but Houston-area residence is not stated.)
  judge-b: **eligible** - I14 met: "Diagnosis of a metastatic or locally unresectable solid tumor (TAPS study)" / I17 met: "ECOG performance status score between 0-3 (TAPS study)" (Observational activity/performance-status study; the TAPS cohort fits metastatic laryngeal SCC with ECOG 2.)
  Reviewer verdict: [ ]

- v132 NCT06532279 Testing the Addition of the Drug BMX-001, a Radioprotector, or a Placebo to the Usual Chemoradiation Therapy f
  judge-a: **excluded** - I6 not_met: "No definitive clinical or radiologic evidence of metastatic (M1) disease related to current diagnosis." / I1 not_met: "Patients must be planned to receive radiation and concurrent cisplatin chemotherapy as definitive therapy." (Radioprotector during definitive cisplatin-RT; he is metastatic and had CRT in 2021.)
  judge-b: **not_relevant** - I1 not_met: "Patients must be planned to receive radiation and concurrent cisplatin chemotherapy as definitive therapy." (Radioprotector during definitive chemoradiation; patient is metastatic and not planned for chemoradiation.)
  Reviewer verdict: [ ]

- v132 NCT06662058 Remote Audiometry to Monitor for Treatment-Related Hearing Loss in Patients With H&N SCC Receiving Cisplatin a
  judge-a: **possibly** - I2 met: "Patients can have previously untreated or recurrent/metastatic disease" / I3 unknown: "Subjects who will be treated with cisplatin chemotherapy and/or radiation. For radiation alone, patients should have tumors near the inner ear" (Hearing-monitoring study; he is due brain radiation only, and whether the target is near the inner ear is not stated.)
  judge-b: **not_relevant** - I3 not_met: "Subjects who will be treated with cisplatin chemotherapy and/or radiation. For radiation alone, patients should have tumors near the inner ear" (Hearing-monitoring study for cisplatin or ear-adjacent radiation; patient only has brain-metastasis radiation planned.)
  Reviewer verdict: [ ]

- v132 NCT06914999 Comparing an Investigational Scan (F-18 NaF PET/CT) to Standard of Care Imaging (F-18 FDG PET/CT) for Evaluati
  judge-a: **excluded** - I2 not_met: "receiving curative-intent, organ preservation (non-surgical)" / I3 not_met: "Treatment with concurrent chemoradiotherapy per institutional standard of care at the discretion of Medical Oncology." (Imaging study during curative chemoradiation; his laryngeal cancer is metastatic and CRT was in 2021.)
  judge-b: **not_relevant** - I3 not_met: "Treatment with concurrent chemoradiotherapy per institutional standard of care at the discretion of Medical Oncology." (Imaging study during curative chemoradiation; patient is metastatic and heavily pretreated.)
  Reviewer verdict: [ ]

- v139 NCT03526835 A Study of Bispecific Antibody MCLA-158 in Patients With Advanced Solid Tumors
  judge-a: **not_relevant** - I9 not_met: "Expansion cohorts: patients with locally advanced unresectable or metastatic disease for the following indications:" (Petosemtamab expansion cohorts are HNSCC and colorectal only (as v128-5/v133).)
  judge-b: **possibly** - I1 met: "Histologically or cytologically confirmed solid tumors with evidence of metastatic or locally advanced disease not amenable to standard therapy with curative intent." / I9 not_met: "Expansion cohorts: patients with locally advanced unresectable or metastatic disease for the following indications:" / I5 met: "Eastern Cooperative Oncology Group (ECOG) performance status of 0 or 1." (Gastric cancer only fits the general (escalation) criteria; open expansion cohorts are HNSCC/CRC; would require washout from current regimen.)
  Reviewer verdict: [ ]

- v139 NCT03816345 Testing an Immunotherapy Anti-cancer Drug, Nivolumab, for Advanced Cancers in Patients With Autoimmune Disorde
  judge-a: **excluded** - E3 not_met: "Patients with prior therapy with an anti-PD-1 or anti-PD-L1" (AIM-NIVO bars prior anti-PD-1; she is on nivolumab and has no autoimmune disease.)
  judge-b: **not_relevant** - I20 not_met: "Patients with more than one autoimmune disease are eligible." / E3 not_met: "Patients with prior therapy with an anti-PD-1 or anti-PD-L1" (Nivolumab study for patients with autoimmune disorders; patient has none.)
  Reviewer verdict: [ ]

- v139 NCT06242470 A Study of MGC026 in Participants With Advanced Solid Tumors
  judge-a: **possibly** - I4 met: "colorectal cancer gastric or gastroesophageal cancer" / I5 met: "Measurable disease per RECIST v1.1." (B7-H3 ADC phase 1 listing gastric cancer with no numbered prior-therapy rule; she is mid first line (title rule).)
  judge-b: **eligible** - I4 met: "colorectal cancer gastric or gastroesophageal cancer" / I5 met: "Measurable disease per RECIST v1.1." / E5 met: "Prior treatment with any B7-H3 targeted agent for cancer or any ADC with a topoisomerase payload." (Metastatic gastric cancer; no prior-line requirement stated (would need washout from current regimen).)
  Reviewer verdict: [ ]

- v164 NCT01891318 Neoadjuvant Radiosurgery for Resectable Brain Metastases: Phase I/II Study
  judge-a: **excluded** - I1 not_met: "Have a prior histologic diagnosis of cancer other than small cell lung cancer, lymphoma, and germ cell histologies" / I2 not_met: "Magnetic resonance imaging (MRI) evidence of 1-4 brain metastases, with at least one lesion > 20 mm and ≤ 50 mm" (Bars germ cell histology, and his only brain met is already resected and irradiated.)
  judge-b: **not_relevant** - I1 not_met: "Have a prior histologic diagnosis of cancer other than small cell lung cancer, lymphoma, and germ cell histologies" (Germ cell histology excluded; brain metastasis already resected and irradiated.)
  Reviewer verdict: [ ]

- v164 NCT03184038 Neurocognition in Patients With Multiple Brain Metastases Treated With Radiosurgery
  judge-a: **excluded** - I1 not_met: "Pathologically proven solid tumor malignancy (except for small cell lung cancer [SCLC], germ cell tumor)" (Brain-met radiosurgery study that bars germ cell tumors; his met is also already treated.)
  judge-b: **not_relevant** - I1 not_met: "Pathologically proven solid tumor malignancy (except for small cell lung cancer [SCLC], germ cell tumor)"
  Reviewer verdict: [ ]

- v164 NCT03550391 Stereotactic Radiosurgery Compared With Hippocampal-Avoidant Whole Brain Radiotherapy (HA-WBRT) Plus Memantine
  judge-a: **excluded** - E7 not_met: "Primary germ cell tumour, small cell carcinoma, or lymphoma." / I1 not_met: "Patients must have 5 or more brain metastases" (Brain-met radiation trial that bars germ cell tumors; he has one treated met.)
  judge-b: **not_relevant** - I1 not_met: "Patients must have 5 or more brain metastases" (Single treated, stable brain metastasis.)
  Reviewer verdict: [ ]

- v164 NCT03750227 Pre-Operative or Post-Operative Stereotactic Radiosurgery in Treating Patients With Operative Metastatic Brain
  judge-a: **excluded** - E7 not_met: "Known or clinically suspected primary germ cell tumor, small cell carcinoma, or lymphoma" / I3 not_met: "Clinical indication for surgical resection of one brain metastasis" (Bars germ cell tumors, and his brain met was already resected and irradiated.)
  judge-b: **not_relevant** - E7 not_met: "Known or clinically suspected primary germ cell tumor, small cell carcinoma, or lymphoma" / I3 not_met: "Clinical indication for surgical resection of one brain metastasis" (Germ cell primaries excluded; his brain metastasis is already treated.)
  Reviewer verdict: [ ]

- v164 NCT04343157 UCSD Image-Guided Cognitive-Sparing Radiosurgery for Intracranial Lesions
  judge-a: **excluded** - E8 not_met: "Metastases from primary germ cell tumor, small cell carcinoma, or primary CNS lymphoma (ineligible for SRS)" (Cognitive-sparing SRS study bars germ cell tumor metastases.)
  judge-b: **not_relevant** - I2 not_met: "Eligible for intracranial SRS: Limited brain metastases targets geometrically feasible for SRS (intact or resected tumor bed), meningioma, or cerebral AVM" (Brain metastasis already treated with surgery and radiation; no SRS planned.)
  Reviewer verdict: [ ]

- v164 NCT04689048 Assess Use of 18F-Fluciclovine for Patients With Large Brain Metastases Treated With Staged Stereotactic Radio
  judge-a: **excluded** - I3 not_met: "Confirmed diagnosis of brain metastases with at least one untreated lesion >2 cm in maximum diameter" (Imaging for large untreated brain mets before staged SRS; his single met was treated and is stable.)
  judge-b: **not_relevant** - I3 not_met: "Confirmed diagnosis of brain metastases with at least one untreated lesion >2 cm in maximum diameter" (Brain metastasis already treated and stable.)
  Reviewer verdict: [ ]

- v164 NCT04899908 Stereotactic Brain-directed Radiation With or Without Aguix Gadolinium-Based Nanoparticles in Brain Metastases
  judge-a: **excluded** - I1 not_met: "at least one intracranial measurable lesion spanning ≥5mm in maximal unidimensional size and radiographically consistent with or pathologically proven to be a brain metastasis" (Brain-directed radiation for active brain mets; his only lesion was resected and irradiated and is stable.)
  judge-b: **not_relevant** - I1 not_met: "at least one intracranial measurable lesion spanning ≥5mm in maximal unidimensional size" (Brain metastasis treated and quiet; no lesion needing radiation.)
  Reviewer verdict: [ ]

- v164 NCT05222620 SRS Compared With FSRS for Treatment of Intact Metastatic Brain Disease, FRACTIONATE Trial
  judge-a: **excluded** - I5 not_met: "At least one intact metastasis (not previously treated with radiosurgery) must measure >= 2.0 cm and =< 4.0 cm" (Needs an intact brain metastasis; his was treated with surgery and radiation and is stable.)
  judge-b: **not_relevant** - I5 not_met: "At least one intact metastasis (not previously treated with radiosurgery) must measure >= 2.0 cm and =< 4.0 cm" (No intact brain metastasis needing radiosurgery.)
  Reviewer verdict: [ ]

- v164 NCT06048094 18F-Fluciclovine PET Amino Acid Evaluation of Brain Metastasis Treated With Stereotactic Radiosurgery
  judge-a: **excluded** - I3 not_met: "Planned treatment with SRS as per the treating physician team" (Imaging for brain metastases about to get SRS; his single brain met was treated last year and is stable.)
  judge-b: **not_relevant** - I3 not_met: "Planned treatment with SRS as per the treating physician team" (Imaging study for brain metastases about to receive SRS; his single brain metastasis was already treated and is stable.)
  Reviewer verdict: [ ]

- v164 NCT06649058 EXCLAIM: Exploring Combined Local and Systemic Approaches In Brain Metastasis: a Multi-cohort Randomized Phase
  judge-a: **excluded** - I9 not_met: "At least one measurable intracranial target lesion which was not previously treated with SRS." / I13 not_met: "ECOG performance status ≤ 1." (Needs an untreated brain met; his only one was resected and irradiated. ECOG 2 also fails.)
  judge-b: **not_relevant** - I9 not_met: "At least one measurable intracranial target lesion which was not previously treated with SRS." (No untreated brain metastasis; single lesion already treated.)
  Reviewer verdict: [ ]

- v164 NCT06725953 Remote Physical Activity Programming to Improve Outcomes in Cancer Survivors With and Without Type 2 Diabetes
  judge-a: **possibly** - I4 met: "underwent treatment within the last three years for a non-central nervous system-related cancer with said treatment having included chemotherapy" / I5 unknown: "self-reported cognitive difficulties following cancer treatment" (Remote exercise program after chemotherapy; cognitive complaints and diabetes status not stated.)
  judge-b: **not_relevant** - I5 unknown: "self-reported cognitive difficulties following cancer treatment" (Remote exercise program for cancer survivors with post-treatment cognitive complaints; patient has active relapsed disease and no cognitive complaints reported.)
  Reviewer verdict: [ ]

- v164 NCT06974370 Avoiding Radiation Therapy Due to Intracranial Response to Chemotherapy, Targeted Therapy and/or Immuno-ONcolo
  judge-a: **excluded** - I10 not_met: "Systemic therapy has started within 4 weeks of MRI brain showing new or progressive disease" / E2 not_met: "Prior radiotherapy to the active brain metastases" (For new or progressing brain mets treated with systemic therapy; his single met was resected and irradiated and has stayed quiet.)
  judge-b: **not_relevant** - I10 not_met: "Systemic therapy has started within 4 weeks of MRI brain showing new or progressive disease or plan to start systemic therapy within 4 weeks of MRI brain showing new or progressive disease." / E2 not_met: "Prior radiotherapy to the active brain metastases" (Study for new/progressive brain metastases managed without radiation; his single brain metastasis was resected, irradiated and is stable.)
  Reviewer verdict: [ ]

- v164 NCT07132190 Stereotactic Radiation for Growing/Changing Brain Metastases With Same-Day Radiation Planning and Treatment Wi
  judge-a: **excluded** - I2 not_met: "Growth of 1.0mm per week or more, on average, based on the two most recent brain MRIs preceding study enrollment" (SRS for growing or changing brain mets; his treated met has stayed quiet.)
  judge-b: **not_relevant** - I1 not_met: "with at least one intact, residual or recurrent, intracranial lesion radiographically consistent with or pathologically proven to be a brain metastasis" (Treated brain metastasis has stayed quiet.)
  Reviewer verdict: [ ]

- v164 NCT07227610 Brain Metastases in Greater Size - Hypofractionated Options Trial (BIGSHOT)
  judge-a: **excluded** - I5 not_met: "Radiographic confirmation of brain metastasis measuring ≥2 cm and ≤ 5 cm in maximum diameter" (SRS for a large untreated brain met; his single met was treated last year and is quiet.)
  judge-b: **not_relevant** - I5 not_met: "Radiographic confirmation of brain metastasis measuring ≥2 cm and ≤ 5 cm in maximum diameter" (No current brain metastasis needing radiation.)
  Reviewer verdict: [ ]

- v164 NCT07248228 Memory Avoidance Whole Brain Radiotherapy vs Hippocampal Avoidance Whole Brain Radiotherapy (Athena 2 Trial)
  judge-a: **excluded** - I7 not_met: "Participant has at least 10 brain metastases or is otherwise suitable for WBRT" (Whole-brain RT trial; one treated, stable brain met.)
  judge-b: **not_relevant** - I5 not_met: "Participant must be considered a candidate for WBRT by the treating physician"
  Reviewer verdict: [ ]

## 2. Random 15% sample (792)

- v001 NCT02926690 Safety Study of MELK Inhibitor to Treat Patients With Advanced Breast Cancer and Triple Negative Breast Cancer
  judge-a: **possibly** - I4 met: "Patients with a documented (histologically- or cytologically-proven) breast cancer that is locally advanced or metastatic." / I5 met: "Patients with a malignancy that is either relapsed/refractory to standard therapy" / E9 unknown: "AST or ALT ≥ 3 × the ULN for the institution value" (Phase 1 dose escalation for advanced breast cancer; labs and investigator judgement on standard options decide.)
  Reviewer verdict: [ ]

- v001 NCT04468061 Sacituzumab Govitecan +/- Pembrolizumab in Metastatic TNBC
  judge-a: **excluded** - I2 not_met: "Estrogen-receptor and progesterone-receptor expression both ≤ 5% by immunohistochemistry (IHC)" / I4 not_met: "Participants must be treatment-naïve in the metastatic setting." (Metastatic TNBC first-line trial; patient is ER+ and pretreated.)
  Reviewer verdict: [ ]

- v001 NCT06312176 A Study of Sacituzumab Tirumotecan (MK-2870) as a Single Agent and in Combination With Pembrolizumab (MK-3475)
  judge-a: **eligible** - I1 met: "unresectable locally advanced or metastatic centrally-confirmed hormone receptor positive (HR+)/human epidermal growth factor receptor 2 negative (HER2-) breast cancer" / I2 met: "Has radiographic disease progression on one or more lines of endocrine therapy" / E4 met: "Has received prior chemotherapy for unresectable locally advanced or metastatic breast cancer" / I4 met: "performance status of 0 to 1" (HR+/HER2- MBC progressed on ET + CDK4/6i, no prior chemo, ECOG 0-1.)
  Reviewer verdict: [ ]

- v001 NCT06582017 Safety, PK and Efficacy of QXL138AM in Patients With Solid Tumors and Multiple Myeloma
  judge-a: **possibly** - I2 met: "Histopathologically confirmed diagnosis of an advanced, unresectable, or metastatic solid tumor" / I2 unknown: "Patients must have no available therapeutic options known to confer clinical benefit for their tumor type." / E8 unknown: "Received prior anticancer therapy within 28 days" (Phase 1 solid tumor incl breast; requires exhaustion of standard options, which is unclear for this patient.)
  Reviewer verdict: [ ]

- v001 NCT06827236 A Clinical Study to Find the Optimal Dose of an Investigational Treatment Called BNT323 When Used in Combinati
  judge-a: **possibly** - I2 met: "* Is locally advanced, unresectable or metastatic." / I3 met: "Have measurable disease defined by RECIST v1.1." / E5 met: "Had prior treatment with topoisomerase I inhibitors" / I4 unknown: "Has left ventricular ejection fraction ≥55%" (Advanced BC across HER2 subgroups; HER2-low/ultralow/null status and cohort fit unknown.)
  Reviewer verdict: [ ]

- v001 NCT06876714 ShortStop-HER2: 12 Months vs. 6 Months of HER2-targeted Medications for People With HER2+ Breast Cancer Who Ha
  judge-a: **excluded** - I3 not_met: "HER2+ by American Society of Clinical Oncology (ASCO)/College of American Pathologists (CAP) guidelines" / I17 not_met: "No stage IV (metastatic) breast cancer" (Early HER2+ adjuvant trial; patient is HER2-negative and metastatic.)
  Reviewer verdict: [ ]

- v001 NCT07492641 BGB-43395 Plus Letrozole Versus CDK4/6i Plus Letrozole for Patients With Advanced or Metastatic HR+/HER2- Brea
  judge-a: **excluded** - E1 not_met: "Participants who have received prior systemic treatment in the advanced or metastatic setting." / I2 met: "Participants with histologically confirmed locally advanced or metastatic HR+ HER2- breast cancer." (First-line HR+/HER2- trial; patient already treated in metastatic setting.)
  Reviewer verdict: [ ]

- v001 NCT07647328 A Phase IIIb Study to Evaluate Camizestrant Plus Ribociclib in ER-positive, HER2-negative Advanced Breast Canc
  judge-a: **excluded** - I5 not_met: "Previously untreated with any systemic anti-cancer therapy for their locoregionally recurrent or metastatic ER+ disease." / I4 met: "Histologically or cytologically documented diagnosis of ER+, HER2- BC" (First-line trial; patient has had 2 metastatic lines.)
  Reviewer verdict: [ ]

- v002 NCT01530373 Solifenacin Compared to Clonidine for Reducing Hot Flashes Among Breast Cancer Patients
  judge-a: **not_relevant** - I2 not_met: "Currently taking aromatase inhibitors or tamoxifen" / E4 not_met: "Concurrent or planned chemotherapy or radiotherapy (within next 3 months)" (Hot-flash supportive care study for women on endocrine therapy; not a treatment study for untreated TNBC, and planned chemo excludes.)
  Reviewer verdict: [ ]

- v002 NCT05020860 Correlation of Clinical Response to Pathologic Response in Patients With Early Breast Cancer
  judge-a: **eligible** - I2 met: "Tumor may be triple negative" / I4 met: "Tumors must be at least 2 cm by clinical exam or ultrasound" / E6 met: "Prior treatment for currently diagnosed breast cancer" / I6 met: "ECOG performance status of 0 or 1" (Untreated stage III TNBC, 4 cm, ECOG 0-1 planned for neoadjuvant therapy.)
  Reviewer verdict: [ ]

- v002 NCT05187832 A Study of AND019 in Women With ER Positive HER2 Negative Advanced or Metastatic Breast Cancer
  judge-a: **excluded** - I2 not_met: "advanced or metastatic ER+/HER2- breast cancer" (ER+ postmenopausal advanced disease; patient is HR-negative, early stage.)
  Reviewer verdict: [ ]

- v002 NCT05376878 An Investigational Scan (64Cu-DOTA-Trastuzumab PET/MRI) in Imaging Patients With HER2+ Breast Cancer With Brai
  judge-a: **excluded** - I2 not_met: "Women with documented metastatic HER2 positive breast cancer" (HER2+ brain metastasis imaging; patient is HER2-negative, non-metastatic.)
  Reviewer verdict: [ ]

- v002 NCT05422794 Testing the Addition of Anti-Cancer Drug, ZEN003694 (ZEN-3694) and PD-1 Inhibitor (Pembrolizumab), to Standard
  judge-a: **excluded** - I1 met: "confirmed diagnosis of TNBC" / I3 not_met: "Participants must have disease that is unresectable locally advanced or metastatic" (TNBC trial for unresectable/metastatic disease; patient has operable stage III planned for neoadjuvant therapy and surgery.)
  Reviewer verdict: [ ]

- v002 NCT05464082 Functional Precision Oncology to Predict, Prevent, and Treat Early Metastatic Recurrence of TNBC
  judge-a: **eligible** - I3 met: "Subject has Stage I-III disease." / I4 met: "Histologically or cytologically confirmed invasive breast carcinoma that is triple negative (TNBC)" / I8 met: "Patient is considered for preoperative cytotoxic chemotherapy per standard of care" / I7 met: "Primary tumor OR local lymph node metastasis that is ≥ 1.5 cm" (Untreated stage III TNBC, 4 cm tumor, planned preoperative chemo.)
  Reviewer verdict: [ ]

- v002 NCT05696626 Evaluation of Lasofoxifene Combined With Abemaciclib Compared With Fulvestrant Combined With Abemaciclib in Lo
  judge-a: **excluded** - I3 not_met: "Histological or cytological confirmation of ER+/HER2 - disease" / I5 unknown: "At least 1 or more ESR1 point mutations" (ER-positive metastatic ESR1-mutant trial; patient is HR-negative and non-metastatic.)
  Reviewer verdict: [ ]

- v002 NCT05879926 Evaluating the Addition of Adjuvant Chemotherapy to Ovarian Function Suppression Plus Endocrine Therapy in Pre
  judge-a: **excluded** - I2 not_met: "The tumor must be ER and/or PgR-positive" / I2 unknown: "ipsilateral nodes must be pN0 or pN1" (ER/PgR-positive required; patient is HR negative TNBC.)
  Reviewer verdict: [ ]

- v002 NCT06224673 ARX788 for Treating Patients With HER2-low Locally Advanced Unresectable or Metastatic Breast Cancer
  judge-a: **excluded** - I5 not_met: "Pathologically documented HER2-low locally advanced unresectable or metastatic breast cancer (MBC)." / I11 not_met: "Participants must have received at least one prior line of chemotherapy or ADC therapy" (Requires unresectable/metastatic HER2-low disease after prior chemo; patient has operable untreated stage III (HER2-low status unknown).)
  Reviewer verdict: [ ]

- v002 NCT06435429 A Study Comparing the Efficacy and Safety of Zanidatamab to Trastuzumab, Each in Combination With Physician's 
  judge-a: **excluded** - I3 not_met: "Has histologically confirmed HER2-positive breast cancer" / I5 not_met: "Must have received at least 2 lines of HER2-directed therapy for their metastatic disease." (HER2-positive metastatic trial; patient is HER2-negative and untreated.)
  Reviewer verdict: [ ]

- v002 NCT06910657 IDOV-Immune for Advanced Solid Tumors
  judge-a: **excluded** - I2 not_met: "advanced solid tumors that have progressed despite standard therapy, or for which no standard therapy exists" (For refractory advanced solid tumors; patient is untreated with standard curative options.)
  Reviewer verdict: [ ]

- v002 NCT07054190 A Study to Test Inavolisib Treatments in Participants With Early-Stage, PIK3CA-Mutated Breast Cancer
  judge-a: **excluded** - I1 met: "invasive Stage II-III BC" / I4 not_met: "Documented ER-positive tumor" / I7 unknown: "Confirmed PIK3CA mutation" (Neoadjuvant stage II-III fits, but requires ER-positive disease; patient is HR-negative.)
  Reviewer verdict: [ ]

- v003 NCT05270213 Evaluation of RBS2418 in Subjects With Advanced, Metastatic Solid Tumors
  judge-a: **possibly** - I3 unknown: "have no other SOC therapy available" / I7 met: "Have a performance status of 0, 1 or 2" / I6 unknown: "Have measurable disease based on RECIST 1.1." (Phase 1 all-comers; depends on whether HER2 standard options remain and measurable disease.)
  Reviewer verdict: [ ]

- v003 NCT05785754 DCSZ11 as a Monotherapy and in Combination in Patients With Advanced or Metastatic Solid Tumors
  judge-a: **possibly** - I4 met: "advanced (metastatic and/or unresectable) solid tumor that has progressed on or after standard therapy" / I16 met: "Eastern Cooperative Oncology Group (ECOG) performance status 0 to 2." / I11 unknown: "agree to have a fresh biopsy at Screening and on treatment" (Phase 1a escalation open to any pretreated solid tumor; expansion cohorts not breast.)
  Reviewer verdict: [ ]

- v003 NCT06590857 Trial of 225Ac-DOTATATE (RYZ101) in Subjects With ER+, HER2-negative Unresectable or Metastatic Breast Cancer 
  judge-a: **excluded** - I2 not_met: "Histologically confirmed, ER+, HER2-negative, locally advanced and unresectable or metastatic breast cancer" (HER2-negative only; patient HER2-positive.)
  Reviewer verdict: [ ]

- v003 NCT06982521 Phase 3 Study of RLY-2608 + Fulvestrant vs Capivasertib + Fulvestrant as Treatment for Locally Advanced or Met
  judge-a: **excluded** - I4 not_met: "HR+/HER2- locally advanced or metastatic breast cancer" / I1 not_met: "Patient has ECOG performance status of 0-1"
  Reviewer verdict: [ ]

- v003 NCT07413939 RO7771950 Versus Tucatinib in Combination With Trastuzumab and Capecitabine in People With Locally Advanced or
  judge-a: **excluded** - I5 met: "Prior anti-HER2 antibody-drug conjugate (ADC), such as trastuzumab-deruxtecan (T-DXd) or trastuzumab emtansine (T-DM1), in any treatment setting" / I8 not_met: "Eastern Cooperative Oncology Group (ECOG) performance status 0 or 1." (HER2+ post-ADC fits, but ECOG 2.)
  Reviewer verdict: [ ]

- v005 NCT04852887 De-Escalation of Breast Radiation Trial for Hormone Sensitive, HER-2 Negative, Oncotype Recurrence Score Less 
  judge-a: **excluded** - E1 not_met: "Definitive clinical or radiologic evidence of metastatic disease." / E1 not_met: "Patient had a mastectomy." (Early-stage lumpectomy radiation trial; patient metastatic post-mastectomy.)
  Reviewer verdict: [ ]

- v005 NCT06380751 Saruparib (AZD5305) Plus Camizestrant or Plus Endocrine Therapy, Compared With CDK4/6 Inhibitor Plus Endocrine
  judge-a: **eligible** - I1 met: "adult males" / I2 met: "HR-positive, HER2-negative breast cancer" / I6 met: "Documented germline tumour loss of function mutation in BRCA1, BRCA2, or PALB2" / E16 met: "Prior treatment with systemic anti-cancer therapy for locoregionally recurrent or metastatic disease is not permitted" (HR+/HER2- BRCA2 advanced, untreated in metastatic setting.)
  Reviewer verdict: [ ]

- v005 NCT06492616 A Study of Elacestrant Versus Standard Endocrine Therapy in Women and Men With ER+,HER2-, Early Breast Cancer 
  judge-a: **excluded** - I1 not_met: "early stage resected invasive breast cancer without evidence of recurrence or distant metastases" (Early breast cancer adjuvant trial; patient has distant recurrence.)
  Reviewer verdict: [ ]

- v005 NCT06966700 A Clinical Study of Sacituzumab Tirumotecan (Sac-TMT, MK-2870) in People With Breast Cancer (MK-2870-032)
  judge-a: **excluded** - I2 not_met: "Has previously untreated high-risk, early-stage, non-metastatic (M0) breast cancer" / E2 not_met: "Metastatic (Stage IV) breast cancer" (Early untreated TNBC/HR-low trial.)
  Reviewer verdict: [ ]

- v005 NCT07391774 Testing Whether Hormone Therapy With Ribociclib is as Effective as Chemotherapy Followed by Hormone Therapy Wi
  judge-a: **excluded** - I14 not_met: "Patient must have no evidence of locoregional or distant metastatic disease" / I3 met: "Patient must be a postmenopausal woman or a man" (Adjuvant early-stage trial; patient has metastatic recurrence.)
  Reviewer verdict: [ ]

- v006 NCT02945579 Multicenter Trial for Eliminating Breast Cancer Surgery or Radiotherapy in Exceptional Responders to Neoadjuva
  judge-a: **excluded** - E2 not_met: "Clinical or pathologic evidence for distant metastases." (Early-stage neoadjuvant de-escalation study; patient has lung and liver metastases.)
  Reviewer verdict: [ ]

- v006 NCT05020574 Microbiome and Association With Implant Infections
  judge-a: **not_relevant** - I3 not_met: "Scheduled to undergo mastectomy with the immediate placement of tissue expanders or implant placement" (Implant infection microbiome study for surgical patients, not a treatment study for metastatic TNBC.)
  Reviewer verdict: [ ]

- v006 NCT05422794 Testing the Addition of Anti-Cancer Drug, ZEN003694 (ZEN-3694) and PD-1 Inhibitor (Pembrolizumab), to Standard
  judge-a: **eligible** - I3 met: "Participants must have disease that is unresectable locally advanced or metastatic" / I5 met: "Any number of prior lines of therapy are allowed in the metastatic setting" / I22 met: "Human immunodeficiency virus (HIV)-infected patients on effective anti-retroviral therapy with undetectable viral load" (Metastatic TNBC dose-escalation cohort allows any lines; controlled HIV allowed. Expansion cohort (0-1 lines) would not fit.)
  Reviewer verdict: [ ]

- v006 NCT06263543 Sequencing Antibody Drug Conjugates in ER+/HER2 LOW/ULTRA LOW MBC
  judge-a: **excluded** - I5 not_met: "breast cancer that is hormone receptor positive" (ER+ HER2-low trial; patient is triple-negative.)
  Reviewer verdict: [ ]

- v006 NCT06492759 High Dose Radiation Therapy With Pembrolizumab and Chemotherapy for the Treatment of Patients With PD-L1 Posit
  judge-a: **excluded** - I3 not_met: "PD-L1 positive as defined by Dako 22c3 assay" / E1 not_met: "Prior chemotherapy or targeted therapy for metastatic triple negative breast cancer" (PD-L1-positive first-line trial; patient is PD-L1 negative and pretreated.)
  Reviewer verdict: [ ]

- v006 NCT06518837 Tirzepatide for Weight Loss Intervention in Early-Stage Hormone Receptor Positive/HER2 Negative Breast Cancer
  judge-a: **excluded** - E2 not_met: "Have stage IV, metastatic breast cancer." / E3 not_met: "Have HER2-positive or triple-negative breast cancer." (Weight-loss study in early HR+ disease; patient is metastatic TNBC.)
  Reviewer verdict: [ ]

- v006 NCT06586957 A Study With NKT3964 for Adults With Advanced/Metastatic Solid Tumors
  judge-a: **excluded** - I7 met: "Triple-negative breast cancer (TNBC; HER2, estrogen receptor and progesterone receptor negative)" / E11 not_met: "Known human immunodeficiency virus (HIV), active hepatitis B or C infection" (TNBC escalation cohort fits but known HIV excludes.)
  Reviewer verdict: [ ]

- v006 NCT06790693 A Study Evaluating the Efficacy and Safety of Inavolisib Plus CDK4/6 Inhibitor and Letrozole vs Placebo + CDK4
  judge-a: **excluded** - I2 not_met: "Documented ER-positive and/or progesterone receptor-positive tumor" / E3 not_met: "Any prior systemic therapy for locally advanced unresectable or metastatic breast cancer" (HR+ PIK3CA first-line trial; patient is TNBC and pretreated.)
  Reviewer verdict: [ ]

- v006 NCT06966700 A Clinical Study of Sacituzumab Tirumotecan (Sac-TMT, MK-2870) in People With Breast Cancer (MK-2870-032)
  judge-a: **excluded** - E2 not_met: "Metastatic (Stage IV) breast cancer" / E3 not_met: "Has received any prior treatment" (Untreated early-stage TNBC trial; patient is metastatic and treated.)
  Reviewer verdict: [ ]

- v006 NCT07276880 Preoperative Chemotherapy, Pembrolizumab and Low or High Dose RADiation in an Expansion Cohort of Node(+), Tri
  judge-a: **excluded** - E3 not_met: "Prior ipsilateral invasive breast, chest wall or thoracic radiotherapy" / E4 not_met: "Prior ipsilateral invasive breast cancer, contralateral breast cancer or a known" (Preoperative node-positive TNBC study; patient is metastatic after prior surgery and radiation.)
  Reviewer verdict: [ ]

- v007 NCT06492616 A Study of Elacestrant Versus Standard Endocrine Therapy in Women and Men With ER+,HER2-, Early Breast Cancer 
  judge-a: **excluded** - I4 not_met: "have received at least 24 months but not more than 60 months of endocrine therapy" / I1 not_met: "early stage resected invasive breast cancer without evidence of recurrence or distant metastases" (Adjuvant switch after 2-5 years of ET; patient is untreated and unresected.)
  Reviewer verdict: [ ]

- v007 NCT07085767 Palazestrant in Combination With Ribociclib for the First-line Treatment of ER+/HER2- Advanced Breast Cancer
  judge-a: **excluded** - I5 not_met: "Eastern Cooperative Oncology Group (ECOG) performance status of 0 or 1." / I2 unknown: "ER+, HER2- locally advanced or metastatic breast cancer that is not amenable to curative therapy." / I4 met: "De novo advanced breast cancer" (First-line ER+/HER2- advanced fits, but ECOG 0-1 required; patient ECOG 3-4.)
  Reviewer verdict: [ ]

- v008 NCT05503797 A Study to Assess the Efficacy and Safety of FORE8394 in Participants With Cancer Harboring BRAF Alterations
  judge-a: **excluded** - I4 unknown: "Documentation of BRAF gene fusion in tumor and/or blood" / I7 not_met: "Received all available standard therapy, is intolerant to available therapies, or the investigator has determined that treatment with standard therapy is not appropriate" / I21 not_met: "rare BRAF V600E-mutated solid tumor that is unresectable, locally advanced or metastatic" (BRAF-altered basket for refractory/advanced tumors; patient is receiving curative standard therapy for early disease; BRAF status unknown.)
  Reviewer verdict: [ ]

- v008 NCT06058377 Adding an Immunotherapy Drug, MEDI4736 (Durvalumab), to the Usual Chemotherapy Treatment (Paclitaxel, Cyclopho
  judge-a: **excluded** - I2 not_met: "Participants with HER2 positive disease by ASCO CAP guidelines are ineligible" / I11 not_met: "Participants must not have received any prior treatment for their current breast cancer" (HR+/HER2- trial; patient HER2-positive and already treated.)
  Reviewer verdict: [ ]

- v008 NCT06085833 ARTIDIS Nanomechanical Generated Measurements for Early Breast Lesions
  judge-a: **not_relevant** - I3 not_met: "Indication for breast biopsy for diagnostic purposes" (Diagnostic device study for breast lesions needing biopsy; patient already diagnosed and on treatment.)
  Reviewer verdict: [ ]

- v008 NCT06179303 Functional Imaging in Prediction of Response to Abemaciclib for Advanced Hormone Receptor-Positive, HER2-Negat
  judge-a: **excluded** - I1 not_met: "Men or women with metastatic or locally advanced unresectable breast cancer" / I2 not_met: "Histologically confirmed ER+ / HER2-negative, breast cancer" (Advanced ER+/HER2- imaging trial; patient HER2+, HR-, early stage.)
  Reviewer verdict: [ ]

- v008 NCT06590857 Trial of 225Ac-DOTATATE (RYZ101) in Subjects With ER+, HER2-negative Unresectable or Metastatic Breast Cancer 
  judge-a: **excluded** - I2 not_met: "Histologically confirmed, ER+, HER2-negative, locally advanced and unresectable or metastatic breast cancer" (ER+/HER2- metastatic trial; patient HER2+, HR-, early stage.)
  Reviewer verdict: [ ]

- v008 NCT06790693 A Study Evaluating the Efficacy and Safety of Inavolisib Plus CDK4/6 Inhibitor and Letrozole vs Placebo + CDK4
  judge-a: **excluded** - I2 not_met: "Documented ER-positive and/or progesterone receptor-positive tumor" / I3 not_met: "Documented HER2-negative tumor" (HR+/HER2- PIK3CA advanced trial; patient HER2+, HR-, early stage.)
  Reviewer verdict: [ ]

- v009 NCT03606967 Testing the Addition of an Individualized Vaccine to Durvalumab and Tremelimumab and Chemotherapy in Patients 
  judge-a: **possibly** - I1 unknown: "Patients must have a histologically confirmed diagnosis of metastatic invasive triple negative breast cancer." / I4 unknown: "PD-L1 negative" / I7 met: "No prior therapy for metastatic TNBC." (First-line metastatic TNBC; metastatic status, TNBC subtype and PD-L1 status all unknown pending scans and reports.)
  Reviewer verdict: [ ]

- v009 NCT05503797 A Study to Assess the Efficacy and Safety of FORE8394 in Participants With Cancer Harboring BRAF Alterations
  judge-a: **possibly** - I29 unknown: "Histologic diagnosis of a solid tumor harboring a BRAF V600E mutation" / I4 unknown: "Documentation of BRAF gene fusion" / I7 not_met: "Received all available standard therapy" (Tumour-agnostic BRAF basket; BRAF status unknown and patient has not yet had standard therapy for the recurrence. Weak fit.)
  Reviewer verdict: [ ]

- v009 NCT05929768 Shorter Chemo-Immunotherapy Without Anthracycline Drugs for Early-Stage Triple Negative Breast Cancer
  judge-a: **excluded** - I9 not_met: "Participants must not have received prior systemic therapy or radiation therapy with curative intent for the current breast cancer" / I10 not_met: "Participants must not have had previous definitive ipsilateral breast surgery" / I1 unknown: "HER2-negative breast cancer (TNBC)" (Neoadjuvant trial for newly diagnosed early-stage TNBC; patient had mastectomy, chemo and radiation and now has recurrence.)
  Reviewer verdict: [ ]

- v009 NCT06435429 A Study Comparing the Efficacy and Safety of Zanidatamab to Trastuzumab, Each in Combination With Physician's 
  judge-a: **excluded** - I5 not_met: "Must have received at least 2 lines of HER2-directed therapy for their metastatic disease." / I4 not_met: "who have progressed on, or are intolerant to, previous T-DXd treatment" / I3 unknown: "Has histologically confirmed HER2-positive breast cancer" (Heavily pretreated metastatic HER2+ trial; recurrence is newly diagnosed with no therapy in the advanced setting.)
  Reviewer verdict: [ ]

- v009 NCT07173751 ROSETTA Breast-01: The Effects and Safety of Pumitamig in Patients With Triple-Negative Breast Cancer
  judge-a: **possibly** - I2 unknown: "Have confirmed locally recurrent inoperable or metastatic TNBC" / I1 unknown: "Are considered ineligible for combination treatment with a monospecific PD(L)1 targeting immunotherapy plus chemotherapy" / E2 met: "Have received prior systemic anticancer therapy for advanced disease." / I3 unknown: "Have at least one measurable lesion" (First-line recurrent TNBC trial; subtype, PD-L1, operability and measurable disease unknown.)
  Reviewer verdict: [ ]

- v010 NCT02945579 Multicenter Trial for Eliminating Breast Cancer Surgery or Radiotherapy in Exceptional Responders to Neoadjuva
  judge-a: **excluded** - E2 not_met: "Clinical or pathologic evidence for distant metastases." (Early-stage neoadjuvant de-escalation study; patient has distant metastases.)
  Reviewer verdict: [ ]

- v010 NCT05736367 Investigating the Metabolic Pathways in Hormone Receptor Positive/HER2 Negative Breast Cancer
  judge-a: **excluded** - I2 not_met: "Have early stage, clinical or anatomic stage I, II or III breast cancer" / I3 not_met: "Candidates for intended curative primary resection" (Early-stage surgical research study; patient metastatic.)
  Reviewer verdict: [ ]

- v010 NCT05950945 Trastuzumab Deruxtecan (T-DXd) in Patients Who Have Hormone Receptor-negative and Hormone Receptor-positive HE
  judge-a: **excluded** - E1 not_met: "Prior treatment with an antibody drug conjugate (ADC)." / I5 not_met: "Has had at least one and up to two prior lines of therapy in the metastatic setting." / I9 not_met: "Has an Eastern Cooperative Oncology Group performance status of 0 or 1." (Prior T-DXd, too many lines, ECOG 2.)
  Reviewer verdict: [ ]

- v010 NCT06245889 PET Dynamics to Response-Adapted Neoadjuvant Therapy in TNBC
  judge-a: **excluded** - I1 not_met: "Stage II-III TNBC" / E2 not_met: "Evidence of metastatic disease" (Neoadjuvant TNBC; patient HR+ metastatic.)
  Reviewer verdict: [ ]

- v010 NCT06435429 A Study Comparing the Efficacy and Safety of Zanidatamab to Trastuzumab, Each in Combination With Physician's 
  judge-a: **excluded** - I3 not_met: "Has histologically confirmed HER2-positive breast cancer" / I15 not_met: "Has ECOG performance status of 0 or 1." (HER2-positive only; patient is HER2-low/negative.)
  Reviewer verdict: [ ]

- v010 NCT06678269 A Study of Abemaciclib and Radiation Therapy in People With Metastatic Breast Cancer
  judge-a: **possibly** - I4 unknown: "Plan for ablative radiotherapy (SBRT) to a bone metastasis." / I7 met: "Any line of prior treatments (hormonal therapy and chemotherapy) is permitted" / I18 met: "Eastern Cooperative Oncology Group (ECOG) status of ≤2" / I8 unknown: "treating physician has intent to resume abemaciclib (at any dose) following radiotherapy" (Phase 1 HR+/HER2- mBC; requires a bone metastasis for SBRT and abemaciclib plan, neither stated.)
  Reviewer verdict: [ ]

- v011 NCT05812807 Pembrolizumab vs. Observation in People With Triple-negative Breast Cancer Who Had a Pathologic Complete Respo
  judge-a: **excluded** - I4 not_met: "Patients must have no residual invasive disease in the breast or lymph nodes after the completion of neoadjuvant therapy" / I5 met: "Patients must have received neoadjuvant chemotherapy in combination with pembrolizumab" (Requires pCR; patient had residual disease at mastectomy.)
  Reviewer verdict: [ ]

- v011 NCT06227377 QTX3034 in Patients With KRAS G12D Mutation
  judge-a: **excluded** - I1 not_met: "locally advanced or metastatic malignancy with KRAS G12D mutation" / I3 not_met: "Evaluable or Measurable disease per RECIST 1.1." (Advanced KRAS G12D tumors; patient has no advanced/evaluable disease and no known KRAS G12D.)
  Reviewer verdict: [ ]

- v011 NCT06603844 First-in-human Study of CRB-601-01 to Treat Patients With Advanced Solid Tumor.
  judge-a: **excluded** - I1 not_met: "locally advanced or metastatic solid tumors that have progressed after at least one line of therapy" / I2 not_met: "Measurable disease on imaging as assessed by RECIST 1.1" (Advanced-tumor trial; patient has no evident disease.)
  Reviewer verdict: [ ]

- v011 NCT06999187 A Study of DR-0202 in Patients With Locally Advanced or Metastatic, Relapsed or Refractory Carcinomas
  judge-a: **excluded** - I1 not_met: "unresectable, locally advanced or metastatic" / I2 not_met: "Relapsed or refractory with at least 2 prior lines of therapy" (Requires relapsed/refractory advanced disease after 2+ lines; patient has resected disease, 1 line.)
  Reviewer verdict: [ ]

- v012 NCT04771520 Avapritinib for the Treatment of CKIT or PDGFRA Mutation-Positive Locally Advanced or Metastatic Malignant Sol
  judge-a: **excluded** - I7 not_met: "Documented pathogenic CKIT activating mutation (Cohort 1) OR pathogenic PDGFRA activating mutation (Cohort 2)" (Gene panel otherwise negative beyond EGFR.)
  judge-b: **excluded** - I7 not_met: "Documented pathogenic CKIT activating mutation (Cohort 1) OR pathogenic PDGFRA activating mutation (Cohort 2)" (Full gene panel otherwise negative besides EGFR, so no CKIT/PDGFRA mutation.)
  Reviewer verdict: [ ]

- v012 NCT05098132 Study of STK-012 Alone and With Other Treatments in Patients With Advanced Lung Cancer and Other Cancers
  judge-a: **excluded** - I4 not_met: "No prior systemic therapy for advanced/metastatic NSQ NSCLC." / I4 not_met: "No known actionable EGFR, ALK, ROS1, or other actionable genomic aberrations" (First-line driver-negative NSCLC; patient EGFR+ and treated.)
  judge-b: **excluded** - I4 not_met: "No known actionable EGFR, ALK, ROS1, or other actionable genomic aberrations" / I4 not_met: "No prior systemic therapy for advanced/metastatic NSQ NSCLC."
  Reviewer verdict: [ ]

- v012 NCT05443126 A Study of EP0031 (Lunbotinib) in Patients With Advanced RET-altered Malignancies
  judge-a: **excluded** - I2 not_met: "with documented RET-altered NSCLC" / E2 not_met: "Any known major driver gene alterations other than RET." (Patient is EGFR exon 19 and RET negative.)
  judge-b: **excluded** - I2 not_met: "documented RET-altered NSCLC" / E2 not_met: "Any known major driver gene alterations other than RET." (RET-negative, EGFR-driven.)
  Reviewer verdict: [ ]

- v012 NCT06010329 A Study to Evaluate the Efficacy and Safety of Sutetinib Maleate Capsule in Locally Advanced or Metastatic NSC
  judge-a: **excluded** - I3 not_met: "Confirmation that the tumor harbors an uncommon epidermal growth factor receptor (EGFR) mutation" / E1 not_met: "Participant ever used the epidermal growth factor receptor-tyrosine kinase inhibitor (EGFR TKI) for anti-tumor therapy prior to enrollment (Cohort 1)" (Exon 19 deletion is a common mutation.)
  judge-b: **excluded** - I3 not_met: "Confirmation that the tumor harbors an uncommon epidermal growth factor receptor (EGFR) mutation" / E1 not_met: "Participant ever used the epidermal growth factor receptor-tyrosine kinase inhibitor (EGFR TKI) for anti-tumor therapy prior to enrollment (Cohort 1)"
  Reviewer verdict: [ ]

- v012 NCT06625775 Open-Label Study of BBO-10203 in Subjects With Advanced Solid Tumors
  judge-a: **excluded** - I1 not_met: "KRAS mutant advanced non-small cell lung cancer (aNSCLC)" / E2 not_met: "tumors with other targetable driver mutations (eg, EGFR" (KRAS negative, EGFR+.)
  judge-b: **excluded** - I1 not_met: "KRAS mutant advanced non-small cell lung cancer (aNSCLC)" / E2 not_met: "tumors with other targetable driver mutations (eg, EGFR"
  Reviewer verdict: [ ]

- v012 NCT06758401 This is a Study to Learn About How the Combination of the Study Medicines Sigvotatug Vedotin Plus Pembrolizuma
  judge-a: **excluded** - I3 not_met: "Tumor has PD-L1 expression in" / I2 not_met: "Participants with known AGAs including EGFR, ALK, ROS1, NTRK, BRAF, RET, and MET" (First-line PD-L1-high trial; patient PD-L1 <1%, EGFR+.)
  judge-b: **excluded** - I3 not_met: "Tumor has PD-L1 expression in ≥50% of tumor cells (TPS ≥50%)" / I2 not_met: "Participants with known AGAs including EGFR, ALK, ROS1, NTRK, BRAF, RET, and MET, for which there are approved and available first-line therapies per local SOC are ineligible."
  Reviewer verdict: [ ]

- v012 NCT06910657 IDOV-Immune for Advanced Solid Tumors
  judge-a: **possibly** - I2 unknown: "advanced solid tumors that have progressed despite standard therapy, or for which no standard therapy exists" (Chemotherapy still a standard option.)
  judge-b: **possibly** - I2 unknown: "Histologically or cytologically confirmed advanced solid tumors that have progressed despite standard therapy, or for which no standard therapy exists." / I4 unknown: "Measurable disease per RECIST v1.1."
  Reviewer verdict: [ ]

- v012 NCT07046923 A Study of LY4175408 in Participants With Advanced Cancer
  judge-a: **possibly** - I2 met: "Non-small cell lung cancer (NSCLC)" / I3 unknown: "Received all standard therapies for which the individual was deemed to be an appropriate candidate" / E3 met: "uncontrolled central nervous system (CNS) metastases" (Only osimertinib so far; chemo-naive, so standard-therapy requirement is a care-team call.)
  judge-b: **possibly** - I2 met: "Non-small cell lung cancer (NSCLC)" / I3 unknown: "Received all standard therapies for which the individual was deemed to be an appropriate candidate by the treating investigator" / E3 met: "Individual with known or suspected history of uncontrolled central nervous system (CNS) metastases." (Phase 1; platinum chemo still a standard option after osimertinib.)
  Reviewer verdict: [ ]

- v012 NCT07155174 A Study to Evaluate the Optimal Dose, Adverse Events and Change in Disease Activity of Intravenous ABBV-706 in
  judge-a: **not_relevant** - I1 not_met: "extensive stage small cell lung cancer (ES-SCLC)" (Small cell lung cancer trial; patient has adenocarcinoma.)
  judge-b: **not_relevant** - I1 not_met: "Diagnosis of histologically or cytologically confirmed extensive stage small cell lung cancer (ES-SCLC)"
  Reviewer verdict: [ ]

- v013 NCT02133196 T Cell Receptor Immunotherapy for Patients With Metastatic Non-Small Cell Lung Cancer
  judge-a: **possibly** - I2 met: "Measurable metastatic (stage IV) or unresectable non-small cell lung cancer" / I2 unknown: "Patients with 3 or fewer brain metastases that are less than 1 cm in diameter and asymptomatic are eligible." / I2 met: "All patients must have had at least one appropriate first line systemic therapy and progressed." (Metastatic NSCLC TIL/TCR; small asymptomatic brain mets allowed if under 1 cm; lesion size and resectable lesion unknown.)
  Reviewer verdict: [ ]

- v013 NCT03191149 Testing Osimertinib as a Treatment for Lung Cancers With an EGFR Exon 20 Change
  judge-a: **excluded** - I3 not_met: "An EGFR exon 20 insertion mutation must be detected in the tumor tissue." (EGFR exon 20 insertion trial; patient EGFR negative.)
  Reviewer verdict: [ ]

- v013 NCT04606446 Study of PF-07248144 in Advanced or Metastatic Solid Tumors
  judge-a: **possibly** - I2 unknown: "NSCLC that is intolerant or resistant to standard therapy or for which no standard therapy is available" / I15 met: "Eastern Cooperative Oncology Group (ECOG) Performance Status PS 0 or 1" / I14 unknown: "Participants must have at least 1 measurable lesion" (Part 1A monotherapy allows NSCLC resistant to standard therapy; whether ALK+ post-lorlatinib qualifies is investigator judgment.)
  Reviewer verdict: [ ]

- v013 NCT05624996 Testing the Addition of High Dose, Targeted Radiation to the Usual Treatment for Locally-Advanced Inoperable N
  judge-a: **excluded** - I1 not_met: "non-operable stage IIB or III, node positive" / I5 not_met: "No evidence of distant metastases" (Locally advanced stage IIB-III NSCLC for curative chemoradiation; patient has distant metastases.)
  Reviewer verdict: [ ]

- v013 NCT06116682 Targeted Treatment for Advanced Non-Small Cell Lung Cancer That Has Increased Copies of the MET Gene (An Expan
  judge-a: **excluded** - I7 not_met: "ALK gene fusion" / I2 unknown: "Participants must have documentation of NSCLC with MET amplification" (Lung-MAP MET amplification sub-study requires no other actionable alteration such as ALK fusion.)
  Reviewer verdict: [ ]

- v013 NCT06305715 Radiation Prior to TKI to Delay Progression in Advanced Driver-Mutated Non-small Cell Lung Cancers (RadiaNCe L
  judge-a: **excluded** - I6 not_met: "Patient must not have received prior targeted therapy for NSCLC." (Radiation before first-line TKI; patient already received ALK TKIs.)
  Reviewer verdict: [ ]

- v013 NCT06767514 Clinical Study of Ivonescimab for First-line Treatment of Metastatic NSCLC Patients With High PD-L1
  judge-a: **excluded** - I6 not_met: "Tumor demonstrates high PD-L1 expression" / I8 not_met: "No prior systemic treatment for metastatic NSCLC." (First-line PD-L1-high NSCLC without actionable alterations; patient PD-L1 negative, ALK+, pretreated.)
  Reviewer verdict: [ ]

- v013 NCT06868485 A Study to Assess the Efficacy of WSD0922-FU in Patients With C797S+ Advanced Non-small Cell Lung Cancer
  judge-a: **excluded** - I5 not_met: "Evidence of radiological disease progression while on a previous continuous treatment with first-line Osimertinib treatment." / I6 not_met: "Documented EGFR mutation" (EGFR C797S after osimertinib; patient EGFR negative, ALK+.)
  Reviewer verdict: [ ]

- v013 NCT07037758 A Study of Tarlatamab in Combination With AB248 in Participants With Extensive Stage Small Cell Lung Cancer (D
  judge-a: **not_relevant** - I3 not_met: "Participants with histologically or cytologically confirmed ES-SCLC" (Extensive-stage small cell lung cancer; patient has NSCLC.)
  Reviewer verdict: [ ]

- v013 NCT07111520 A Clinical Trial to Test if an Investigational Combination Therapy With BNT326 and BNT327 is Safe and Potentia
  judge-a: **possibly** - I11 met: "Must have received at least one prior systemic therapy for advanced disease, which must have included targeted treatment for actionable genomic alterations" / I3 met: "Have Eastern Cooperative Oncology Group performance status of 0 or 1." / E8 met: "Have clinically active central nervous system metastases, defined as untreated and symptomatic" / I2 unknown: "Have measurable disease defined by RECIST v1.1." (AGA-positive (ALK) cohort after targeted therapy with progression; only untreated AND symptomatic CNS mets excluded.)
  Reviewer verdict: [ ]

- v015 NCT04939610 A Study of 177Lu-FAP-2286 in Advanced Solid Tumors
  judge-a: **excluded** - I13 not_met: "Have cytologically or histologically and radiologically confirmed recurrent or metastatic disease" / I9 not_met: "Have measurable disease per RECIST v1.1" (NSCLC cohort requires recurrent/metastatic measurable disease after progression; patient has none.)
  judge-b: **excluded** - I13 not_met: "Have cytologically or histologically and radiologically confirmed recurrent or metastatic disease"
  Reviewer verdict: [ ]

- v015 NCT05624996 Testing the Addition of High Dose, Targeted Radiation to the Usual Treatment for Locally-Advanced Inoperable N
  judge-a: **excluded** - I1 not_met: "non-operable stage IIB or III, node positive" (Patient's tumour was surgically resected.)
  judge-b: **excluded** - I1 not_met: "Pathologically (histologically or cytologically) proven diagnosis of non-operable stage IIB or III" (Patient already had lobectomy.)
  Reviewer verdict: [ ]

- v015 NCT06162221 Study of RAS(ON) Inhibitors in Patients With Advanced RAS-mutated NSCLC
  judge-a: **excluded** - I7 not_met: "Must have pathologically documented, locally advanced or metastatic RAS-mutated NSCLC" / I3 met: "ECOG PS is 0 to 1" (Requires advanced/metastatic RAS-mutated NSCLC; patient's stage IIB disease was resected, RAS status unknown.)
  judge-b: **excluded** - I7 not_met: "Must have pathologically documented, locally advanced or metastatic RAS-mutated NSCLC (Subprotocol B)" (Patient has resected stage IIB disease on adjuvant pembrolizumab; no advanced disease; RAS untested.)
  Reviewer verdict: [ ]

- v015 NCT06452277 A Study to Learn More About How Well Sevabertinib Works and How Safe it is Compared With Standard Treatment, i
  judge-a: **excluded** - I2 not_met: "metastatic non-squamous NSCLC at screening" / I3 unknown: "Documented activating HER2 mutation in the tyrosine kinase domain (TKD)" (Squamous histology and no advanced disease.)
  judge-b: **excluded** - I2 not_met: "metastatic non-squamous NSCLC at screening" / I3 unknown: "Documented activating HER2 mutation in the tyrosine kinase domain (TKD)"
  Reviewer verdict: [ ]

- v015 NCT06498635 Immunotherapy After Surgery for People Who Have No Remaining Cancer Cells After Standard Treatment for Early-S
  judge-a: **excluded** - I7 not_met: "Participants must have received at least two cycles of neoadjuvant platinum-based chemotherapy and anti-PD-1 or anti-PD-L1 therapy" / I4 not_met: "Participants must have a pathologic complete response (pCR)" (Patient had upfront lobectomy then adjuvant chemo, not neoadjuvant chemoimmunotherapy with pCR.)
  judge-b: **excluded** - I7 not_met: "Participants must have received at least two cycles of neoadjuvant platinum-based chemotherapy and anti-PD-1 or anti-PD-L1 therapy." / I4 not_met: "Participants must have a pathologic complete response (pCR)" (Upfront surgery then adjuvant chemo; no neoadjuvant therapy.)
  Reviewer verdict: [ ]

- v015 NCT07291037 Phase III Study of Datopotamab Deruxtecan Versus Docetaxel in Previously Treated TROP2-positive Advanced or Me
  judge-a: **excluded** - E1 not_met: "Squamous, mixed NSCLC, or small cell lung cancer (SCLC) histology." / I1 not_met: "Stage IIIB, IIIC, or Stage IV non-squamous non-small cell lung cancer" (Squamous histology and no advanced disease.)
  judge-b: **excluded** - E1 not_met: "Squamous, mixed NSCLC, or small cell lung cancer (SCLC) histology." / I1 not_met: "Pathologically documented Stage IIIB, IIIC, or Stage IV non-squamous non-small cell lung cancer (NSCLC)"
  Reviewer verdict: [ ]

- v015 NCT07491497 A Phase 1/2 Study of TRI-611 in ALK-Positive NSCLC
  judge-a: **excluded** - I1 not_met: "Pathologically confirmed diagnosis of ALK-positive non-small cell lung cancer (NSCLC)" (Patient is ALK negative.)
  judge-b: **excluded** - I1 not_met: "Pathologically confirmed diagnosis of ALK-positive non-small cell lung cancer (NSCLC)"
  Reviewer verdict: [ ]

- v016 NCT03808337 Investigating the Effectiveness of Stereotactic Body Radiotherapy (SBRT) in Addition to Standard of Care Treat
  judge-a: **excluded** - I2 not_met: "NSCLC with EGFR, ALK, or ROS1 targetable molecular alterations who had a history of disease progression on first-line tyrosine kinase inhibitor" / I2 not_met: "Non-small cell lung cancer (NSCLC) without known targetable molecular alterations in EGFR, ALK, or ROS1" (ROS1+ NSCLC only eligible after progression on first-line TKI; patient untreated.)
  Reviewer verdict: [ ]

- v016 NCT04105270 RMT in Combination With Durvalumab + Chemo in Untreated Adenocarcinoma NSCLC. A Randomized Double Blind Phase 
  judge-a: **excluded** - I1 not_met: "does not have an EGFR sensitizing (activating) mutation or ALK or ROS1 translocation" (First-line chemo-immunotherapy trial excluding ROS1 translocation; patient ROS1 positive.)
  Reviewer verdict: [ ]

- v016 NCT06712316 Safety, Efficacy, and Pharmacokinetics of BNT327 in Combination With Chemotherapy and Other Investigational Ag
  judge-a: **possibly** - I1 met: "Have systemic treatment naive, histologically or cytologically confirmed diagnosis" / I3 met: "Eastern Cooperative Oncology Group Performance Status of 0 or 1" / I2 unknown: "Have at least one measurable lesion as the targeted lesion based on RECIST v1.1" / E8 unknown: "Other protocol defined Inclusion/Exclusion criteria apply" (Untreated stage IV NSCLC fits listed criteria; measurability unknown and unlisted criteria may exclude ROS1-driven disease.)
  Reviewer verdict: [ ]

- v016 NCT07277413 A Study of IDE892 as Monotherapy and Combination in MTAP-deleted Advanced Solid Tumors
  judge-a: **excluded** - E23 not_met: "has progressed after prior treatment with platinum chemotherapy and a PD-1/PD-L1 inhibitor" / I2 not_met: "NSCLC that has progressed on at least one prior line of treatment" / I5 unknown: "Have evidence of homozygous loss of MTAP or MTAP deletion" (NSCLC criteria require progression after platinum and PD-1/PD-L1 therapy; patient is untreated. MTAP status unknown.)
  Reviewer verdict: [ ]

- v017 NCT03851445 Lung-MAP: A Master Screening Protocol for Previously-Treated Non-Small Cell Lung Cancer
  judge-a: **eligible** - I7 met: "Disease must be Stage IV as defined in Section 4.0, or recurrent." / I10 met: "the patient must have received at least one line of a platinum-based chemotherapy regimen or anti-PD-1/PD-L1 therapy" / I15 met: "Patients must have Zubrod performance status 0-1" (Recurrent NSCLC progressing after platinum plus pembrolizumab, PS 0-1; HER2 not an excluded alteration in the screening protocol.)
  Reviewer verdict: [ ]

- v017 NCT04105270 RMT in Combination With Durvalumab + Chemo in Untreated Adenocarcinoma NSCLC. A Randomized Double Blind Phase 
  judge-a: **excluded** - I5 not_met: "Prior systemic therapy for advanced/metastatic NSCLC makes the patient ineligible for this study." / E7 not_met: "Prior treatment with any other anti-PD-1, or PD-L1" (Untreated-only trial; patient had chemo-pembrolizumab.)
  Reviewer verdict: [ ]

- v017 NCT04181060 Osimertinib With or Without Bevacizumab as Initial Treatment for Patients With EGFR-Mutant Lung Cancer
  judge-a: **excluded** - I3 not_met: "Patient must have somatic activating sensitizing mutation in EGFR" / I9 not_met: "Patient must not have had any prior systemic treatment for metastatic disease" (EGFR-negative; already treated with chemo-immunotherapy.)
  Reviewer verdict: [ ]

- v017 NCT04302025 A Study of Multiple Therapies in Biomarker-selected Participants With Resectable Stages IB-III Non-small Cell 
  judge-a: **excluded** - I2 not_met: "Newly diagnosed early-stage NSCLC" / E3 not_met: "Participants with prior lung cancer" / I5 not_met: "PD-L1 expression in ≥ 1% tumor cells" (Resectable newly diagnosed NSCLC with listed biomarkers; patient is recurrent, previously treated, PD-L1 0 and HER2-driven.)
  Reviewer verdict: [ ]

- v017 NCT04939610 A Study of 177Lu-FAP-2286 in Advanced Solid Tumors
  judge-a: **possibly** - I14 met: "Participants must have progressed after at least 1 but not more than 2 prior systemic regimens including chemotherapy and immunotherapy." / I14 unknown: "Participants with NSCLC harboring mutations amenable to targeted therapy treatment, are eligible if received targeted therapy" / I13 met: "recurrent or metastatic disease" (NSCLC cohort fits; unclear whether HER2-mutant patient needs prior targeted therapy.)
  Reviewer verdict: [ ]

- v017 NCT06116682 Targeted Treatment for Advanced Non-Small Cell Lung Cancer That Has Increased Copies of the MET Gene (An Expan
  judge-a: **excluded** - I7 not_met: "Participants must not have other known actionable oncogenic alterations" / I2 unknown: "Participants must have documentation of NSCLC with MET amplification" (MET amplification substudy excludes known HER2 mutation; patient has HER2 exon 20 insertion.)
  Reviewer verdict: [ ]

- v017 NCT06892548 A Clinical Study to Investigate the Efficacy and Safety of an Investigational Combination Therapy With BNT324 
  judge-a: **excluded** - I2 not_met: "Participants with AGA-positive disease must have received targeted therapy prior to enrollment in this study." / I2 met: "Participants with NSCLC are eligible with any or no PD-L1 expression." (HER2-mutant (AGA-positive) without prior targeted therapy.)
  Reviewer verdict: [ ]

- v017 NCT07428044 A Study of Trastuzumab Deruxtecan in People With Non-Small Cell Lung Cancer
  judge-a: **excluded** - I2 not_met: "Neoadjuvant Therapy" / E3 not_met: "Any previous therapy for lung cancer, including chemotherapy, targeted therapy, immunotherapy, or radiotherapy, within 3 years" / E4 not_met: "Previous lung cancer in remission for <3 years" (Neoadjuvant T-DXd for untreated resectable stage II-IIIB; patient has recurrent disease already treated with chemo-immunotherapy.)
  Reviewer verdict: [ ]

- v019 NCT07099898 A Study of GSK5764227 in Participants With Relapsed Small Cell Lung Cancer (SCLC) [EMBOLD SCLC-301]
  judge-a: **not_relevant** - I3 not_met: "Has histologically or cytologically confirmed extensive-stage small cell lung cancer (ES-SCLC)." (Small cell lung cancer trial; patient has NSCLC.)
  Reviewer verdict: [ ]

- v020 NCT04267848 Testing the Addition of a Type of Drug Called Immunotherapy to the Usual Chemotherapy Treatment for Non-small 
  judge-a: **excluded** - I6 not_met: "Completely resected stage IIA, IIB IIIA or IIIB (T3-4N2) non-small cell lung cancer" / I22 not_met: "known history of hepatitis B" (Adjuvant trial for resected early-stage NSCLC; patient has stage IV disease and hepatitis B.)
  Reviewer verdict: [ ]

- v020 NCT06116682 Targeted Treatment for Advanced Non-Small Cell Lung Cancer That Has Increased Copies of the MET Gene (An Expan
  judge-a: **excluded** - I2 unknown: "NSCLC with MET amplification" / I7 not_met: "RET gene rearrangement" (MET-amplification substudy excludes other actionable alterations such as RET fusion.)
  Reviewer verdict: [ ]

- v020 NCT06568939 A Study to Assess Adverse Events and How Intravenously (IV) Infused Telisotuzumab Vedotin (ABBV-399) Moves Thr
  judge-a: **possibly** - I2 unknown: "Must have c-Met overexpressing non-small cell lung cancer (NSCLC)" / I5 met: "Actionable alterations in genes other than EGFR are permitted." / I9 met: "Must have progressed on at least 1 line of prior therapy" / E11 unknown: "Clinically significant liver disease, including hepatitis" (c-Met status unknown; controlled hepatitis B may or may not count as significant liver disease.)
  Reviewer verdict: [ ]

- v020 NCT07005102 A Study to Assess Adverse Events, Change in Disease Activity of Intravenous Telisotuzumab Adizutecan in Combin
  judge-a: **excluded** - I7 not_met: "documented classical EGFR mutation (Exon 19 Del or Exon 21 L858R)" (EGFR-mutant first-line trial; patient is EGFR negative, RET fusion.)
  Reviewer verdict: [ ]

- v021 NCT06043817 First-In-Human Study of STX-721/PFL-721 in Participants With Locally Advanced or Metastatic Non-Small Cell Lun
  judge-a: **not_relevant** - I1 not_met: "Has histologically- or cytologically confirmed diagnosis of NSCLC" (EGFR/HER2 exon 20 NSCLC; patient has SCLC.)
  Reviewer verdict: [ ]

- v021 NCT06561685 A Study of LY4050784 in Participants With Advanced or Metastatic Solid Tumors
  judge-a: **excluded** - I1 unknown: "metastatic solid tumor malignancy with SMARCA4 (BRG1) alteration" / I7 not_met: "Have an Eastern Cooperative Oncology Group (ECOG) performance status score of 0 or 1" (SMARCA4-altered tumor basket (status untested); ECOG 0-1 required and patient is ECOG 3-4.)
  Reviewer verdict: [ ]

- v021 NCT06681220 Biomarker Directed Trial of Temozolomide and Stenoparib in Relapsed SCLC
  judge-a: **excluded** - I4 met: "Patients must have received first-line therapy with Carboplatin and Etoposide." / I5 not_met: "ECOG Performance status 0-2." (Relapsed SCLC after carboplatin/etoposide fits, but patient is ECOG 3-4.)
  Reviewer verdict: [ ]

- v021 NCT06875310 A Study of Adagrasib Plus Pembrolizumab Plus Chemotherapy vs. Placebo Plus Pembrolizumab Plus Chemotherapy in 
  judge-a: **not_relevant** - I1 not_met: "non-squamous NSCLC with evidence of KRAS G12C mutation" (KRAS G12C NSCLC first line; patient has SCLC.)
  Reviewer verdict: [ ]

- v021 NCT07325136 A Study to Assess the Safety and Tolerability of BMS-986525 Alone and in Combination Therapy in Participants W
  judge-a: **eligible** - I1 met: "relapsed/refractory small cell lung cancer (R/R-SCLC)" / I2 met: "Participants must have received at least 1 platinum-based chemotherapy regimen" / I3 met: "participants have progressed on, are ineligible for or not have access to an anti-PD- (L)1 therapy" / E1 met: "Participants must not have any untreated CNS metastases." (Listed criteria met; other protocol criteria (likely performance status) need review given ECOG 3-4.)
  Reviewer verdict: [ ]

- v021 NCT07365319 A Safety and Efficacy Study of EIK1001 in Combination With Pembrolizumab and Chemotherapy in Participants With
  judge-a: **not_relevant** - I3 not_met: "Participant has histologically or cytologically confirmed Stage 4 NSCLC" / E1 not_met: "has small cell elements present histologically" (First-line NSCLC; patient has SCLC.)
  Reviewer verdict: [ ]

- v021 NCT07472517 DAREON ® -Lung-1: A Study in People With Advanced Small Cell Lung Cancer to Compare Obrixtamig Plus Atezolizum
  judge-a: **excluded** - I2 not_met: "Patients without any previous systemic anti-cancer treatment for ES-SCLC." / I6 not_met: "Eastern Cooperative Oncology Group (ECOG) score of 0 or 1" (First-line ES-SCLC; patient already treated and has poor performance status.)
  Reviewer verdict: [ ]

- v022 NCT06014502 Study to Evaluate IMGS-001 Treatment in Patients With Relapsed or Refractory Advanced Solid Tumors
  judge-a: **excluded** - I1 not_met: "progressed after receiving appropriate lines of standard therapy known to potentially confer clinical benefit" / I2 not_met: "cancer in one of the following pre-specified tumor types" (Escalation needs progression after standard therapy (patient untreated); mesothelioma not an expansion tumor type.)
  judge-b: **excluded** - I1 not_met: "Patients must have histologically confirmed locally advanced, or metastatic solid tumors who have progressed after receiving appropriate lines of standard therapy known to potentially confer clinical benefit." (Mesothelioma only fits dose escalation, which needs prior standard therapy; patient untreated.)
  Reviewer verdict: [ ]

- v022 NCT06995898 The Vanguard Study: Testing a New Way to Screen for Cancer
  judge-a: **not_relevant** - E1 not_met: "Solid malignant tumor or blood cancer diagnosis, with or without treatment, within the last 5 years" (Cancer screening study for people without cancer.)
  judge-b: **not_relevant** - E1 not_met: "Solid malignant tumor or blood cancer diagnosis, with or without treatment, within the last 5 years" (Screening study for people without cancer.)
  Reviewer verdict: [ ]

- v022 NCT07361497 A Study to Evaluate Pumitamig Versus Durvalumab Following Concurrent Chemoradiation Therapy in Participants Wi
  judge-a: **not_relevant** - I1 not_met: "non-small cell lung cancer (NSCLC) with unresectable Stage III disease" (Stage III NSCLC after chemoradiation; patient has mesothelioma.)
  judge-b: **not_relevant** - I1 not_met: "Participants must have a histologically- or cytologically-confirmed diagnoses of non-small cell lung cancer (NSCLC) with unresectable Stage III disease."
  Reviewer verdict: [ ]

- v023 NCT03051464 Randomizing Two Radiotherapy Boost Options to Avoid Rectal Cancer Surgery
  judge-a: **excluded** - E2 not_met: "Evidence of distant metastasis" / I3 not_met: "No metastatic lesion" / I1 not_met: "Rectal cancer patients" (Localized rectal cancer organ-preservation trial; patient has metastatic sigmoid colon cancer.)
  Reviewer verdict: [ ]

- v023 NCT03526835 A Study of Bispecific Antibody MCLA-158 in Patients With Advanced Solid Tumors
  judge-a: **excluded** - I19 not_met: "Patients must be RAS/ RAF WT" / I14 not_met: "No oncogenic missense mutations in KRAS" / I15 met: "A microsatellite stable (MSS) tumor." (All mCRC cohorts require RAS wild-type; patient is KRAS G12D.)
  Reviewer verdict: [ ]

- v023 NCT06625775 Open-Label Study of BBO-10203 in Subjects With Advanced Solid Tumors
  judge-a: **eligible** - I1 met: "KRAS mutant advanced colorectal cancer (aCRC)" / I7 met: "Must have progression on, or disease recurrence after at least one line of SOC treatment" / I3 met: "Eastern Cooperative Oncology Group (ECOG) performance status (PS) 0-1" (KRAS G12D (not G12R), MSS, HER2/BRAF negative mCRC progressing after 1 line.)
  Reviewer verdict: [ ]

- v023 NCT07436728 A Study of TAK-505 in Adults With Solid Tumors
  judge-a: **excluded** - I5 met: "Colorectal cancer (CRC)." / I13 not_met: "Participants who have received or been intolerant to treatment with either trifluridine/tipiracil (TAS-102), regorafenib or fruquintinib." (CRC cohort requires prior TAS-102/regorafenib/fruquintinib; patient only had 1 line FOLFOX/bev.)
  Reviewer verdict: [ ]

- v024 NCT05592626 A Study of a Selective T Cell Receptor (TCR) Targeting, Bifunctional Antibody-fusion Molecule STAR0602 in Part
  judge-a: **excluded** - I1 not_met: "for which standard curative therapies do not exist or are no longer effective" / I5 met: "CRC with pMMR/MSS (without TMB-H requirement)" (pMMR CRC cohort exists, but patient is on curative-intent therapy for non-metastatic disease.)
  judge-b: **excluded** - I1 not_met: "Participants must have histologically confirmed solid tumors that are unresectable, locally advanced, or metastatic and for which standard curative therapies do not exist or are no longer effective or have intolerable toxicities." (Patient is on curative-intent therapy.)
  Reviewer verdict: [ ]

- v024 NCT05673148 Testing the Addition of Total Ablative Therapy to Usual Systemic Therapy Treatment for Limited Metastatic Colo
  judge-a: **excluded** - I2 not_met: "Pathologically proven diagnosis of metastatic colorectal adenocarcinoma" / I17 not_met: "first-line systemic therapy for metastatic disease" (Oligometastatic CRC trial; patient has no metastases.)
  judge-b: **excluded** - I2 not_met: "Pathologically proven diagnosis of metastatic colorectal adenocarcinoma with metastases"
  Reviewer verdict: [ ]

- v024 NCT05919264 FOG-001 in Locally Advanced or Metastatic Solid Tumors
  judge-a: **excluded** - I4 not_met: "Diagnosis of treatment-refractory advanced/metastatic solid tumor" / I13 unknown: "Diagnosis of locally advanced or metastatic non-MSI-H or non-dMMR CRC" (Phase 1/2 for advanced/unresectable CRC; patient is on curative-intent TNT, not refractory or metastatic.)
  judge-b: **excluded** - I4 not_met: "Diagnosis of treatment-refractory advanced/metastatic solid tumor" / I27 not_met: "Diagnosis of locally advanced or metastatic non-MSI-H or non-dMMR (by local testing) CRC" (Cohorts target unresectable/metastatic CRC; patient is on curative-intent total neoadjuvant therapy.)
  Reviewer verdict: [ ]

- v024 NCT06131840 A Study of SGN-CEACAM5C in Adults With Advanced Solid Tumors
  judge-a: **excluded** - I2 not_met: "must have histologically- or cytologically-confirmed metastatic or unresectable solid tumor malignancy" (Requires metastatic/unresectable relapsed CRC; patient is non-metastatic on curative-intent treatment.)
  judge-b: **excluded** - I2 not_met: "must have histologically- or cytologically-confirmed metastatic or unresectable solid tumor malignancy"
  Reviewer verdict: [ ]

- v024 NCT06205485 Neoadjuvant Chemotherapy, Excision And Observation vs Chemoradiotherapy For Rectal Cancer
  judge-a: **excluded** - I3 not_met: "cN0 stage based on pelvic MRI" / E4 not_met: "Previous pelvic radiation for any reason" / E7 not_met: "Prior treatment for rectal cancer." / I1 met: "mismatch repair proficient" (Node-positive and already treated with short-course RT and FOLFOX; trial needs cN0 untreated rectal cancer.)
  judge-b: **excluded** - I3 not_met: "cN0 stage based on pelvic MRI" / E7 not_met: "Prior treatment for rectal cancer." / I1 met: "mismatch repair proficient" (Node-positive T3 and already on short-course RT plus FOLFOX.)
  Reviewer verdict: [ ]

- v024 NCT06625775 Open-Label Study of BBO-10203 in Subjects With Advanced Solid Tumors
  judge-a: **excluded** - I1 not_met: "Locally advanced and unresectable or metastatic" / I1 unknown: "KRAS mutant advanced colorectal cancer (aCRC)" (Advanced KRAS-mutant CRC; patient resectable/non-metastatic, KRAS unknown.)
  judge-b: **excluded** - I1 not_met: "KRAS mutant advanced colorectal cancer (aCRC)" (Non-metastatic, curative-intent treatment; KRAS unknown.)
  Reviewer verdict: [ ]

- v024 NCT07091032 Building Connections
  judge-a: **not_relevant** - E2 not_met: "has colorectal cancer documented in the problem list" / I3 not_met: "Average-risk patients without recommended colorectal or cervical cancer screenings" (Primary care screening/obesity/mental health program for people without colorectal cancer.)
  judge-b: **not_relevant** - E2 not_met: "has colorectal cancer documented in the problem list" (Primary-care screening/behavioral study, not for cancer patients.)
  Reviewer verdict: [ ]

- v025 NCT06352359 Safety, Pharmacokinetics (PK), and Efficacy of ONC 841 in Advanced Solid Tumors
  judge-a: **excluded** - I1 not_met: "Must have ECOG score ≤ 1." (Solid tumor phase 1 but patient is ECOG 2.)
  Reviewer verdict: [ ]

- v025 NCT07393906 Colorectal Cancer Prevention Research Study: Eat Right, Screen Right
  judge-a: **not_relevant** - I1 met: "18 years or older" (Colorectal cancer prevention/screening education study, not treatment for metastatic disease.)
  Reviewer verdict: [ ]

- v026 NCT05080673 Five or Ten Year Colonoscopy for 1-2 Non-Advanced Adenomatous Polyps
  judge-a: **not_relevant** - I3 not_met: "first-time diagnosis of 1-2 non-advanced tubular adenomas" (Colonoscopy surveillance for polyps, not cancer treatment.)
  judge-b: **not_relevant** - I3 not_met: "Participants with a first-time diagnosis of 1-2 non-advanced tubular adenomas" (Polyp surveillance study for people without cancer.)
  Reviewer verdict: [ ]

- v026 NCT06218914 Phase 1 Study to Investigate TCRTs KRAS Mutation in Unresectable, Advanced, and/or Metastatic Solid Tumors
  judge-a: **excluded** - I4 not_met: "after at least 1 line of approved systemic standard of care (SOC) treatment regimen" / I3 unknown: "Tumors must harbor a KRAS G12D variant mutation" (Requires prior SOC line; patient untreated.)
  judge-b: **excluded** - I4 not_met: "after at least 1 line of approved systemic standard of care (SOC) treatment regimen" / I3 unknown: "Tumors must harbor a KRAS G12D variant mutation"
  Reviewer verdict: [ ]

- v026 NCT07030257 Study of CP-383 in Patients With Advanced or Metastatic Solid Tumors
  judge-a: **excluded** - I2 not_met: "Not eligible or able to take existing standard therapies for cancer" (Requires no standard options; patient newly diagnosed, untreated, fit for standard therapy.)
  judge-b: **excluded** - I2 not_met: "Not eligible or able to take existing standard therapies for cancer" (Treatment-naive with standard options available.)
  Reviewer verdict: [ ]

- v026 NCT07058012 A Phase II Platform Study to Evaluate Treatment With Cemiplimab Monotherapy or Cemiplimab Plus Fianlimab or Ot
  judge-a: **excluded** - E2 not_met: "Patients with MSI-high (dMMR) tumors." / I6 not_met: "All patients must have had a complete (R0) resection of their primary tumor" (MRD after curative therapy, MSS only.)
  judge-b: **excluded** - E2 not_met: "Patients with MSI-high (dMMR) tumors." / I6 not_met: "All patients must have had a complete (R0) resection of their primary tumor"
  Reviewer verdict: [ ]

- v026 NCT07221357 A Study to Evaluate the Safety and Efficacy of Pumitamig in Combination With Chemotherapy Versus Bevacizumab i
  judge-a: **excluded** - I2 not_met: "Participant must have no known presence of mismatch repair deficient (dMMR) or microsatellite instability-high (MSI-H) colorectal cancer" / I1 met: "previously untreated, histologically confirmed recurrent or metastatic colorectal adenocarcinoma" (Known MSI-H excluded.)
  judge-b: **excluded** - I2 not_met: "Participant must have no known presence of mismatch repair deficient (dMMR) or microsatellite instability-high (MSI-H) colorectal cancer (CRC)" / I1 met: "Participant must previously untreated, histologically confirmed recurrent or metastatic colorectal adenocarcinoma, not amenable to curative surgery."
  Reviewer verdict: [ ]

- v027 NCT03659448 Performance of SGM-101 for the Delineation of Primary and Recurrent Tumor and Metastases in Patients Undergoin
  judge-a: **not_relevant** - I1 not_met: "scheduled for curative colorectal cancer surgery" / E5 not_met: "Known positive test for human immunodeficiency virus (HIV)" (Colorectal cancer surgery imaging agent; patient has anal SCC on chemoradiation and is HIV positive.)
  Reviewer verdict: [ ]

- v027 NCT04585750 The Evaluation of PC14586 in Patients With Advanced Solid Tumors Harboring a TP53 Y220C Mutation (PYNNACLE)
  judge-a: **excluded** - I4 not_met: "Previously treated with one or more lines of anticancer therapy and progressive disease" / I2 unknown: "Locally advanced or metastatic solid malignancy with a TP53 Y220C mutation" (No progression; patient is mid first-line curative chemoradiation. TP53 untested.)
  Reviewer verdict: [ ]

- v027 NCT06281678 A Study of IBI363 in Subjects with Advanced Solid Malignancies
  judge-a: **excluded** - E2 not_met: "Received Nitrosoureas and mitomycin C within 6 weeks prior to first dose of study drug" / I3 met: "Eastern Cooperative Oncology Group (ECOG) performance status (PS) of 0 or 1" (Currently receiving mitomycin; listed cohorts are melanoma, NSCLC, CRC, RCC and patient's disease is not advanced.)
  Reviewer verdict: [ ]

- v027 NCT06710756 Lead-212 PSV359 Therapy for Patients With Solid Tumors
  judge-a: **excluded** - I5 not_met: "Progressive disease despite standard therapy or for whom no standard therapy exists" / I6 unknown: "Positive [203Pb]Pb-PSV359 SPECT/CT scan" (Patient is on standard curative chemoradiation without progression.)
  Reviewer verdict: [ ]

- v027 NCT07143487 Family Communications After Genetic Testing
  judge-a: **not_relevant** - I2 not_met: "primary colorectal adenocarcinoma, stage I to IV" (Genetic testing communication study for colorectal adenocarcinoma; not anal SCC, not a treatment study.)
  Reviewer verdict: [ ]

- v027 NCT07284849 A Study to Evaluate the Efficacy and Safety of Standard-of-Care Chemotherapy and Bevacizumab With or Without I
  judge-a: **not_relevant** - I1 not_met: "Stage IV colorectal adenocarcinoma not amenable to curative resection." (Metastatic MSS colorectal adenocarcinoma; patient has locoregional anal SCC.)
  Reviewer verdict: [ ]

- v027 NCT07822919 A Study of AWT020 in Participants With Advanced Solid Tumors
  judge-a: **excluded** - I3 not_met: "Disease progression after at least one systemic therapy" / I2 not_met: "Pathologically confirmed, unresectable advanced solid tumor." (Patient is on first curative chemoradiation without progression.)
  Reviewer verdict: [ ]

- v028 NCT05489211 Study of Dato-DXd as Monotherapy and in Combination With Anti-cancer Agents in Patients With Advanced Solid Tu
  judge-a: **excluded** - I2 not_met: "Documented advanced or metastatic malignancy" / I5 not_met: "At least 1 measurable lesion not previously irradiated" (Advanced disease trial; patient has resected stage II, no disease.)
  judge-b: **excluded** - I2 not_met: "Documented advanced or metastatic malignancy" (Resected stage II colon cancer on adjuvant therapy.)
  Reviewer verdict: [ ]

- v028 NCT05630794 Testing for Safety and Colorectal Cancer Preventive Effects of ONC201
  judge-a: **not_relevant** - E3 not_met: "Prior history of invasive colorectal cancer" / I1 not_met: "Be identified as high risk for recurrent colorectal adenomas" (Polyp prevention study for people without invasive cancer.)
  judge-b: **not_relevant** - E3 not_met: "Prior history of invasive colorectal cancer" (Polyp prevention study for people without invasive cancer.)
  Reviewer verdict: [ ]

- v028 NCT05863195 Testing Pump Chemotherapy in Addition to Standard of Care Chemotherapy Versus Standard of Care Chemotherapy Al
  judge-a: **excluded** - I2 not_met: "Patient must have confirmed unresectable liver confined metastatic colorectal cancer (CRC)." / I18 not_met: "Patient must not have microsatellite instability-high (MSI-H) colorectal cancer." (Unresectable liver metastases, MSI-H excluded; patient resected stage II MSI-H.)
  judge-b: **excluded** - I2 not_met: "Patient must have confirmed unresectable liver confined metastatic colorectal cancer (CRC)." / I18 not_met: "Patient must not have microsatellite instability-high (MSI-H) colorectal cancer."
  Reviewer verdict: [ ]

- v028 NCT06205485 Neoadjuvant Chemotherapy, Excision And Observation vs Chemoradiotherapy For Rectal Cancer
  judge-a: **excluded** - I1 not_met: "Histologically confirmed invasive, well-moderately differentiated rectal adenocarcinoma, mismatch repair proficient." / E5 not_met: "Patients who have had primary lesion excised prior to enrollment." (Untreated pMMR rectal cancer; patient had resected MSI-H colon cancer.)
  judge-b: **excluded** - I1 not_met: "Histologically confirmed invasive, well-moderately differentiated rectal adenocarcinoma, mismatch repair proficient." (Colon (not rectal), MSI-H, already resected.)
  Reviewer verdict: [ ]

- v029 NCT04991948 Study of Pembrolizumab Treatment After CYAD-101 With FOLFOX Preconditioning in Metastatic Colorectal Cancer
  judge-a: **possibly** - I2 met: "Confirmed non-microsatellite instability high (non-MSI-H)/mismatch-repair proficient (pMMR) tumor status" / I2 unknown: "Recurrent/progressing disease after at least one line of systemic therapy for metastatic disease which must include FOLFOX chemotherapy" / I2 unknown: "The patient is due to receive FOLFOX chemotherapy" (FOLFOX was adjuvant; whether that counts and whether FOLFOX is planned next is unclear.)
  Reviewer verdict: [ ]

- v029 NCT05692024 COffee and Metabolites Modulating the Gut MicrobiomE in Colorectal caNCER
  judge-a: **excluded** - I2 not_met: "histologically confirmed stage I, II, or III colon or rectal adenocarcinoma and have completed standard treatment" (For stage I-III survivors after treatment; patient is metastatic on chemo.)
  Reviewer verdict: [ ]

- v029 NCT06102902 Testing the Addition of Anti-cancer Drug, ZEN003694, to the Usual Chemotherapy Treatment, Cetuximab Plus Encor
  judge-a: **excluded** - I1 unknown: "with known BRAF V600E mutation" / I18 not_met: "Patients must have received prior treatment with the combination of encorafenib and cetuximab." (Requires BRAF V600E and prior encorafenib + cetuximab; KRAS G12V patient never had these.)
  Reviewer verdict: [ ]

- v029 NCT06149481 Phase I/II Study of the Combination Immunotherapy Regimen: SX-682, TriAdeno Vaccine, Retifanlimab and IL-15 Ag
  judge-a: **possibly** - I2 met: "Participants with histologically confirmed colorectal cancer and evidence of metastatic disease." / I3 met: "Participants must have received, been ineligible to receive, or refused to receive two lines of standard systemic therapy" / I7 met: "ECOG performance status <= 2." / I6 unknown: "Measurable disease per RECIST 1.1." (Metastatic CRC after two lines fits; measurable disease is unknown.)
  Reviewer verdict: [ ]

- v029 NCT06330064 A Study to Evaluate the Efficacy and Safety of Ifinatamab Deruxtecan (I-DXd) in Subjects With Recurrent or Met
  judge-a: **excluded** - I21 met: "unresectable or metastatic CRC with microsatellite stable status (MSS)" / I24 not_met: "No prior treatment with topoisomerase I inhibitors, such as irinotecan or topotecan." (CRC cohort excludes prior irinotecan; patient is on FOLFIRI.)
  Reviewer verdict: [ ]

- v029 NCT06565052 The Impact of PReOPerative Exercise and NutritionaL Optimization on Perioperative Outcomes for Patients Underg
  judge-a: **excluded** - I3 not_met: "Diagnosis of clinical stage II-III rectal cancer." / I4 not_met: "anticipated surgical resection to follow" (Prehabilitation before rectal surgery for stage II-III.)
  Reviewer verdict: [ ]

- v029 NCT06638502 Safety of HRX215 in Patients After Minor and Major Liver Resection
  judge-a: **not_relevant** - I1 not_met: "planned for R0-intended hepatectomy for colorectal liver metastases" (Liver-regeneration drug after hepatectomy; patient has liver and lung mets with no planned resection.)
  Reviewer verdict: [ ]

- v029 NCT06910657 IDOV-Immune for Advanced Solid Tumors
  judge-a: **possibly** - I2 unknown: "advanced solid tumors that have progressed despite standard therapy, or for which no standard therapy exists" / I3 met: "ECOG performance status ≤ 1." (Phase 1 oncolytic virus basket incl. CRC; standard options not yet exhausted.)
  Reviewer verdict: [ ]

- v029 NCT07416552 A Study to Investigate CEA-PRIT 2.0 in Participants With Metastatic Colorectal Cancer (mCRC)
  judge-a: **possibly** - I3 met: "Confirmed MSS and/or proficient mismatch repair (MMR) status" / I4 unknown: "Experienced disease progression during or within 3 months following the last administration of systemic anti-cancer therapies for metastatic disease" (MSS mCRC fits; radiographic progression on current FOLFIRI-bev not yet documented.)
  Reviewer verdict: [ ]

- v029 NCT07812805 SKL35501 With SKL35502 Imaging in Adults With NTSR1 Positive Advanced Solid Tumors
  judge-a: **possibly** - I5 met: "Selected advanced solid tumors (PDAC, CRC, BTC, HNSCC, EC, and GC)" / I6 unknown: "Sufficient target (NTSR1) expression on SKL35502 imaging" (CRC after prior lines fits; NTSR1 imaging positivity decides.)
  Reviewer verdict: [ ]

- v030 NCT07018869 Evaluating Whether an Educational Website Called Current Together After Cancer (CTAC) Improves Follow-up Care 
  judge-a: **excluded** - I5 not_met: "Patient participants must not have recurrent or metastatic (stage IV) colorectal cancer" / I9 not_met: "Zubrod performance status of 0-2" (Survivorship education study for resected stage II/III; patient has recurrent disease and ECOG 3-4.)
  judge-b: **excluded** - I5 not_met: "Patient participants must not have recurrent or metastatic (stage IV) colorectal cancer" / I9 not_met: "Patient participants must have Zubrod performance status of 0-2"
  Reviewer verdict: [ ]

- v031 NCT05379985 Study of RMC-6236 in Patients With Advanced Solid Tumors Harboring Specific Mutations in RAS
  judge-a: **excluded** - I1 not_met: "specific KRAS G12 mutations (dose escalation) or RAS mutations (dose optimization/expansion)" (Patient is RAS wild type; WT allowed only for PDAC.)
  Reviewer verdict: [ ]

- v031 NCT06311214 Personalized Antibody-Drug Conjugate Therapy Based on RNA and Protein Testing for the Treatment of Advanced or
  judge-a: **possibly** - I3 met: "Patients can be on therapy at the time of initiating the Screening Protocol if the patient is interested in treatment on ADC MATCH upon progression" / E39 not_met: "Patients with histologically documented advanced breast cancer, non-small cell lung cancer (NSCLC), colorectal carcinoma (CRC)" / I38 unknown: "Patient must have high Nectin-4 protein expression (IHC 2+ or 3+)" (HER2 and Trop-2 cohorts exclude CRC; Nectin-4 cohort possible pending expression testing.)
  Reviewer verdict: [ ]

- v031 NCT06634875 Isunakinra Alone and in Combination With Pembrolizumab in Patients With Colorectal Cancer (MSS)
  judge-a: **excluded** - I1 not_met: "Tumor is determined to be RAS-mutated (KRAS, NRAS or HRAS)" (Patient is RAS wild type.)
  Reviewer verdict: [ ]

- v031 NCT06731894 Phytocannabinoids for Reducing Chronic Chemotherapy-Induced Peripheral Neuropathy in Breast and Colon Cancer S
  judge-a: **not_relevant** - I9 unknown: "Patients must have either neuropathy ≥ 1 according to Common Terminology Criteria for Adverse Events (CTCAE) version (v) 5.0 scale" / E1 unknown: "Current active treatment with chemotherapy, radiation or surgery in the past 3 months" (Supportive-care study of neuropathy in survivors; patient has active metastatic disease and reports no neuropathy.)
  Reviewer verdict: [ ]

- v032 NCT04929223 A Study Evaluating the Safety and Efficacy of Targeted Therapies in Subpopulations of Patients With Metastatic
  judge-a: **excluded** - I8 not_met: "Metastatic disease" / I9 not_met: "Prior therapies for metastatic disease" (No metastases; untreated.)
  Reviewer verdict: [ ]

- v032 NCT05877599 A Study of NT-175 in Adult Participants With Advanced Malignancies That Are Positive for HLA-A*02:01 and the T
  judge-a: **excluded** - I5 not_met: "Subject has advanced solid cancer, defined as unresectable, advanced, and/or metastatic disease (Stage III or IV) after at least 1 line of approved systemic standard of care (SOC) treatment regimen" / I4 unknown: "Tumors must harbor a TP53 R175H variant mutation" (Untreated localized disease.)
  Reviewer verdict: [ ]

- v032 NCT05919264 FOG-001 in Locally Advanced or Metastatic Solid Tumors
  judge-a: **excluded** - I27 not_met: "Diagnosis of locally advanced or metastatic non-MSI-H or non-dMMR (by local testing) CRC" / I6 not_met: "Diagnosis of treatment-refractory advanced/metastatic non-MSI-H or non-dMMR CRC." (pMMR fits, but disease is early stage and untreated.)
  Reviewer verdict: [ ]

- v033 NCT05174286 Community Health Workers United to Reduce Colorectal Cancer and Cardiovascular Disease Among People at Higher 
  judge-a: **not_relevant** - I3 not_met: "Not up-to-date with CRC" (Screening outreach for people without CRC.)
  Reviewer verdict: [ ]

- v033 NCT05379595 A Study of Amivantamab Monotherapy and in Addition to Standard-of-Care Chemotherapy in Participants With Advan
  judge-a: **possibly** - I2 unknown: "wild-type Kirsten rat sarcoma viral oncogene (KRAS), neuroblastoma RAS viral oncogene homolog (NRAS), v-raf murine sarcoma viral oncogene homolog B (BRAF)" / I3 met: "have received no more than 1 prior line of systemic therapy in the metastatic setting" / I5 met: "Participant must have Eastern Cooperative Oncology Group (ECOG) performance status (PS) 0 or 1" (KRAS/BRAF wild-type; NRAS and HER2 not stated; amivantamab+FOLFOX cohort could fit after 1 line.)
  Reviewer verdict: [ ]

- v033 NCT05854498 Liposomal Irinotecan With TAS102 and Bevacizumab for Patients With Metastatic Colorectal Cancer
  judge-a: **excluded** - I4 not_met: "The cancer must be mismatch repair proficient." / I5 not_met: "Patients must have had prior treatment with 5-fluorouracil, oxaliplatin, irinotecan containing regimens." (pMMR refractory only.)
  Reviewer verdict: [ ]

- v033 NCT05870800 Phase II Open-label Trial of Neoadjuvant Immunochemotherapy for Resectable Non-metastatic Colon cancER: NICER
  judge-a: **excluded** - I4 not_met: "MSS or pMMR tumor" / I5 not_met: "resectable non-metastatic adenocarcinoma of the colon" (Neoadjuvant MSS non-metastatic study.)
  Reviewer verdict: [ ]

- v033 NCT05985954 Open-label Phase 1b Study of Ulixertinib and Cetuximab or Ulixertinib in Combination With Cetuximab and Encora
  judge-a: **excluded** - I8 not_met: "Prior treatment with at least one systemic chemotherapy regimen for mCRC" / I10 not_met: "Cohort A: anti-EGFR therapy (cetuximab or panitumumab)" (Needs prior chemo and anti-EGFR or BRAF therapy; patient had only pembrolizumab.)
  Reviewer verdict: [ ]

- v033 NCT06205836 Cemiplimab With or Without Fianlimab to Treat Older Patients With Localized or Locally Advanced MSI-H Colorect
  judge-a: **excluded** - I3 not_met: "localized or locally advanced mismatch repair deficient (dMMR) or microsatellite unstable (MSI-H) colorectal cancer" / I4 not_met: "Must not have received any prior systemic treatment or radiation." (Localized untreated MSI-H only; patient metastatic and ICI-treated.)
  Reviewer verdict: [ ]

- v033 NCT06638502 Safety of HRX215 in Patients After Minor and Major Liver Resection
  judge-a: **possibly** - I1 unknown: "planned for R0-intended hepatectomy for colorectal liver metastases" (Liver-resection support drug; only if a hepatectomy is planned.)
  Reviewer verdict: [ ]

- v033 NCT07167446 Neuroprotective Potential of Cannabidiol (CBD) in Preventing Oxaliplatin (Ox)-Induced Neuropathy
  judge-a: **possibly** - I1 unknown: "planned to receive Ox based chemotherapy in metastatic setting" / I4 met: "No prior platinum exposure" (Supportive CBD study if next line is oxaliplatin-based.)
  Reviewer verdict: [ ]

- v033 NCT07811193 A Study to Evaluate the Efficacy of VVD-133214 in Combination With Pembrolizumab Compared With Pembrolizumab A
  judge-a: **excluded** - E1 not_met: "Prior systemic treatment for advanced CRC." / I3 not_met: "No prior systemic treatment for metastatic disease" (First-line MSI-H CRC study; patient already had pembrolizumab for metastatic disease.)
  Reviewer verdict: [ ]

- v034 NCT05519449 Study of JANX007 in Subjects With Metastatic Castration-Resistant Prostate Cancer (ENGAGER-PSMA-01)
  judge-a: **eligible** - I3 met: "Having mCRPC that progressed after at least one novel anti-androgen therapy and at least one taxane containing regimen" / I2 met: "Histologically or cytologically confirmed adenocarcinoma of the prostate" / E2 met: "Prior treatment with PSMA-targeted CAR-T cell therapy"
  Reviewer verdict: [ ]

- v034 NCT06780670 Open-label Study Comparing AAA817 Versus Standard of Care in the Treatment of Previously Treated PSMA-positive
  judge-a: **excluded** - I6 not_met: "progressed on or after [177Lu]Lu-PSMA targeted therapy" / I5 met: "castrate level of serum/plasma testosterone" (Requires prior Lu-PSMA progression; patient had only ARPI and docetaxel.)
  Reviewer verdict: [ ]

- v034 NCT07365995 A Phase III Trial of BNT324 Versus Docetaxel in Metastatic Castration-resistant Prostate Cancer
  judge-a: **excluded** - I5 not_met: "Must not have received systemic cytotoxic chemotherapy, including taxane-based chemotherapy, for mCRPC." / I4 met: "Had previously received one or two prior androgen receptor pathway inhibitor treatments" (Patient received docetaxel for CRPC.)
  Reviewer verdict: [ ]

- v035 NCT04704505 Bipolar Androgen Therapy (BAT) and Radium-223 (RAD) in Metastatic Castration-resistant Prostate Cancer (mCRPC)
  judge-a: **excluded** - I3 not_met: "Castrate-resistant prostate cancer, in the setting of castrate levels of testosterone" / I6 not_met: "Patients must be on bone health agents, either zoledronic acid or denosumab, for at least 4 weeks before enrollment." (mCRPC required; patient untreated hormone-sensitive.)
  Reviewer verdict: [ ]

- v035 NCT05396872 Patient Decision-making About Precision Oncology in Veterans With Advanced Prostate Cancer
  judge-a: **not_relevant** - I16 unknown: "San Francisco Veteran Health Care System (SFVAHCS)" / I7 met: "Documentation of locally advanced (pelvic lymph node-positive), metastatic, or castration-resistant prostate cancer" (Decision-making interview study at a VA, not a treatment study.)
  Reviewer verdict: [ ]

- v035 NCT05939414 An Open-label Study Comparing Lutetium (177Lu) Vipivotide Tetraxetan Versus Observation in PSMA Positive OMPC.
  judge-a: **excluded** - E1 not_met: "Participants with de novo OMPC at screening" / I2 not_met: "Participants must have biochemically recurrent disease after definitive treatment to prostate" (Recurrent oligometastatic disease after definitive therapy; patient de novo with widespread mets.)
  Reviewer verdict: [ ]

- v035 NCT06217822 First-in-human Study of 225Ac-PSMA-Trillium (BAY 3563254) in Participants With Advanced Metastatic Castration-
  judge-a: **excluded** - I1 not_met: "mCRPC with pathological confirmation of adenocarcinoma" / I2 not_met: "Previous treatment with at least 1 novel androgen axis drug (NAAD)" (mCRPC after NAAD; patient untreated hormone-sensitive.)
  Reviewer verdict: [ ]

- v035 NCT06855277 Study Comparing AAA817+ARPI Versus Standard of Care in Adult Participants With PSMA-positive mCRPC
  judge-a: **excluded** - I8 not_met: "Participant must have been diagnosed with mCRPC with documented progressive disease while on treatment with ARPI" / I7 met: "Participants must have PSMA-PET positive disease" (Requires mCRPC progressing on ARPI; patient untreated mHSPC.)
  Reviewer verdict: [ ]

- v035 NCT07216248 Optimal PSA Triggered Individual Management of Androgen Sensitive Prostate Cancer
  judge-a: **eligible** - I3 met: "Hormone-sensitive prostate cancer with histologically/cytologically confirmed adenocarcinoma" / I6 met: "PSA ≥ 1 ng/mL before start of therapy for metastatic disease" / E2 met: "Participant received androgen deprivation therapy (defined as leuprolide or surgical castration) for metastatic hormone-sensitive prostate cancer." / I5 unknown: "Baseline testosterone >50 ng/dl before start of therapy for metastatic disease" (First-line mHSPC relugolix+ARPI; must enrol before planned leuprolide shots start.)
  Reviewer verdict: [ ]

- v035 NCT07258407 A Clinical Trial Evaluating the Safety of TD001 In Patients With PSMA-Expressing Metastatic Prostate Cancer
  judge-a: **excluded** - I2 not_met: "PSMA-expressing metastatic CRPC with documented progression" / I6 not_met: "Prior treatment with at least one androgen receptor pathway inhibitor (ARPI) drug." (mCRPC post-ARPI; patient untreated hormone-sensitive.)
  Reviewer verdict: [ ]

- v036 NCT06059118 Difluoromethylornithine and High Dose Testosterone With Enzalutamide in Metastatic Castration-Resistant Prosta
  judge-a: **excluded** - I6 not_met: "Metastatic disease radiographically documented by CT or bone scan." / I7 not_met: "Must have had disease progression while on abiraterone acetate" (mCRPC post-abiraterone; patient localized, untreated.)
  Reviewer verdict: [ ]

- v036 NCT06067269 Hormone Therapy (Apalutamide) and Image-guided Stereotactic Body Radiation Therapy for the Treatment of Patien
  judge-a: **excluded** - I3 not_met: "Classified as having National Comprehensive Cancer Network unfavorable intermediate risk prostate cancer" / I1 met: "Confirmed diagnosis of prostate adenocarcinoma" (Unfavorable intermediate risk only; patient is high-risk (Gleason 9, PSA 22).)
  Reviewer verdict: [ ]

- v036 NCT06136624 Study of Opevesostat (MK-5684) Versus Alternative NHA in mCRPC (MK-5684-003)
  judge-a: **excluded** - I3 not_met: "Has current evidence of distant metastatic disease (M1 disease)" / I5 not_met: "Has received 1 but no more than 2 taxane-based chemotherapy regimens" (Post-taxane mCRPC; patient localized, untreated.)
  Reviewer verdict: [ ]

- v036 NCT06353386 Substudy 01A: Safety and Efficacy of Opevesostat (MK-5684)-Based Treatment Combinations or Opevesostat Alone i
  judge-a: **excluded** - I5 not_met: "Current evidence of metastatic disease." / I6 not_met: "Prior treatment with 1 to 2 novel hormonal agent(s) (NHA)" (mCRPC; patient localized, untreated.)
  Reviewer verdict: [ ]

- v036 NCT06813898 An Investigational Scan (rhPSMA-7.3 PET/CT) for Detecting Biochemically Recurrent Prostate Cancer, ENLIGHTEN T
  judge-a: **excluded** - I1 not_met: "Men with a history of prostate adenocarcinoma treated with local therapy" / I2 not_met: "Men must have biochemical recurrence" (Biochemical recurrence imaging study; patient untreated, newly diagnosed.)
  Reviewer verdict: [ ]

- v036 NCT07226986 A Phase Ib/II Open-label Study of AMO959 With Lutetium (177Lu) Vipivotide Tetraxetan (AAA617) in Combination W
  judge-a: **excluded** - I8 not_met: "Participant must have been diagnosed with mCRPC with documented progressive disease while on treatment with ARPI" (mCRPC after ARPI; patient localized, untreated.)
  Reviewer verdict: [ ]

- v036 NCT07719361 A Study in Patients With Metastatic Castration-Resistant Prostate Cancer
  judge-a: **excluded** - I4 not_met: "Progressed on Androgen Deprivation Therapy (ADT) and at least one prior potent Androgen Receptor (AR) pathway inhibitor" / I5 not_met: "Ongoing primary ADT" (mCRPC after ADT+ARPI; patient untreated.)
  Reviewer verdict: [ ]

- v039 NCT04868604 64Cu-SAR-bisPSMA and 67Cu-SAR-bisPSMA for Identification and Treatment of PSMA-expressing Metastatic Castrate 
  judge-a: **possibly** - E11 not_met: "Prior treatment with any poly (adenosine diphosphate-ribose) polymerase inhibitors (PARPi) is also excluded." / I6 unknown: "Positive 64Cu-SAR-bisPSMA PET/CT scan" / I8 met: "Have progressive metastatic castration-resistant prostate cancer (mCRPC) despite prior androgen deprivation therapy" (Expansion excludes prior PARPi, so only dose escalation could fit; PSMA PET positivity unknown.)
  Reviewer verdict: [ ]

- v039 NCT06134232 Metastatic Castrate-Resistant Prostate Cancer Subjects Treated With PROVENGE® + One Infusion of Sipuleucel-T
  judge-a: **excluded** - I4 not_met: "Have received all 3 infusions of PROVENGE® prior to randomization" (Requires prior completion of all 3 PROVENGE infusions; patient has not had sipuleucel-T.)
  Reviewer verdict: [ ]

- v039 NCT06217822 First-in-human Study of 225Ac-PSMA-Trillium (BAY 3563254) in Participants With Advanced Metastatic Castration-
  judge-a: **possibly** - I6 met: "Participants must not have received any taxane regimens since becoming castration-resistant" / I2 met: "Previous treatment with at least 1 novel androgen axis drug (NAAD)" / I12 unknown: "Participants must have at least one PSMA-positive (prostate-specific membrane antigen) distant metastatic lesion" (Taxane-naive mCRPC fits Group B; PSMA PET positivity unknown.)
  Reviewer verdict: [ ]

- v039 NCT06925737 A Clinical Study of Ifinatamab Deruxtecan (I-DXd) in People With Metastatic Prostate Cancer (MK-2400-001)
  judge-a: **eligible** - I4 met: "Has current evidence of distant metastatic disease (M1 disease)" / I5 met: "Has received prior treatment with 1 or 2 androgen receptor pathway inhibitors (ARPIs)" / E7 met: "Has received prior treatment with a taxane-based chemotherapy agent for metastatic castration-resistant prostate cancer (mCRPC)" (M1 disease progressing on ADT after one ARPI, no taxane for mCRPC.)
  Reviewer verdict: [ ]

- v039 NCT07162194 MRI-Based Machine Learning Approach Versus Radiologist MRI Reading for the Detection of Prostate Cancer, The P
  judge-a: **not_relevant** - I1 not_met: "Patients undergoing transperineal MRI/TRUS fusion prostate biopsy (PBx) as per standard of care" / E1 not_met: "PROSTATE BIOPSY COHORT: Patients with a history of prostate cancer" (MRI machine-learning detection study for biopsy or prostatectomy patients.)
  Reviewer verdict: [ ]

- v039 NCT07225946 A Study of Pasritamig With Docetaxel Versus Docetaxel in Participants With Metastatic Castration-Resistant Pro
  judge-a: **eligible** - I2 met: "Have disease that is metastatic at the time of screening" / I4 met: "on at least 1 novel androgen receptor pathway inhibition (ARPI) but no more than 2 different ARPI" / E2 met: "who have not received treatment with a poly (ADP-ribose) polymerase (PARP) inhibitor" / E4 met: "Received cytotoxic chemotherapy for prostate cancer in any setting" (mCRPC after apalutamide, BRCA2 already treated with olaparib, chemo-naive, ECOG 0-1.)
  Reviewer verdict: [ ]

- v039 NCT07545811 Study of JANX014 in Subjects With Metastatic Castration-Resistant Prostate Cancer
  judge-a: **eligible** - I5 met: "Have received ≤ 2 anti-androgen therapies in either the HSPC or CRPC setting" / E2 met: "Prior treatment with any CAR-T cell therapy, approved or investigational T-cell engager therapy, and prior receipt of radioligand therapy" (Fits dose expansion: one ARPI, no taxane; no prior radioligand or T-cell engager.)
  Reviewer verdict: [ ]

- v039 NCT07611110 AZD2265 Compared With Standard of Care in PSMA-positive Metastatic Castration-resistant Prostate Cancer (VECTR
  judge-a: **excluded** - I5 not_met: "Previously treated with at least 2 cycles of PSMA-directed β-emitting radioconjugate." / I6 not_met: "Previously treated with at least 1 taxane-based chemotherapy regimen" (Requires prior PSMA beta-radioconjugate and taxane; patient has had neither.)
  Reviewer verdict: [ ]

- v039 NCT07719361 A Study in Patients With Metastatic Castration-Resistant Prostate Cancer
  judge-a: **eligible** - I3 met: "Progressing PSA, defined as two consecutive increases" / I4 met: "Progressed on Androgen Deprivation Therapy (ADT) and at least one prior potent Androgen Receptor (AR) pathway inhibitor" / E5 met: "Prior treatment with AR degraders" (Rising PSA after ADT plus apalutamide; no AR degrader exposure.)
  Reviewer verdict: [ ]

- v040 NCT06629779 A Study to Learn How PF-06821497 (Mevrometostat) Works in Men With Metastatic Castration-resistant Prostate Ca
  judge-a: **excluded** - I3 not_met: "Progressive disease in the setting of medical or surgical castration." / E2 not_met: "Known history of active inflammatory gastrointestinal disease" (mCRPC trial; patient is castration-sensitive with undetectable PSA and has active Crohn's.)
  Reviewer verdict: [ ]

- v042 NCT05417594 Study of AZD9574 as Monotherapy and in Combination With Anti-cancer Agents in Participants With Advanced Solid
  judge-a: **possibly** - I7 unknown: "evidence of a predicted loss of function germline or tumour mutation in one of the following homologous recombination repair genes:BRCA1, BRCA2, PALB2, RAD51C, or RAD51D" / I65 not_met: "Must have at least one lesion, not previously irradiated that can be accurately measured at baseline" (Prostate arm needs an HRR gene mutation; BRCA negative, PALB2/RAD51C/D status not stated. Module 5 needs a measurable lesion (patient has none).)
  Reviewer verdict: [ ]

- v042 NCT05882253 Prostate Cancer IMAGing IN Early Detection (IMAGINED Trial)
  judge-a: **not_relevant** - E1 not_met: "prior diagnosis of prostate cancer (Grade Group >1)" / E2 not_met: "metastatic prostate cancer" (Early-detection imaging study for men without diagnosed cancer.)
  Reviewer verdict: [ ]

- v042 NCT05939414 An Open-label Study Comparing Lutetium (177Lu) Vipivotide Tetraxetan Versus Observation in PSMA Positive OMPC.
  judge-a: **excluded** - E4 not_met: "Participants who have discontinued ADT due to disease progression are not eligible" / I8 not_met: "Non-castration testosterone level >100 ng/dL at screening" (Oligometastatic hormone-sensitive trial; patient is castration resistant on ADT plus enzalutamide.)
  Reviewer verdict: [ ]

- v042 NCT06067841 A Study to Assess BMS-986460 in Participants With Metastatic Castration-resistant Prostate Cancer
  judge-a: **eligible** - I3 met: "Participant must have prostate specific antigen (PSA) of ≥ 2 ng/mL at Screening" / I4 met: "Participant must have progressed on androgen deprivation therapy (ADT) and at least one prior secondary hormonal therapy" (PSA 9 after progression on ADT and enzalutamide, ECOG 0-1.)
  Reviewer verdict: [ ]

- v042 NCT06863272 A Clinical Study of Ifinatamab Deruxtecan Based Treatment Combinations or as Monotherapy to Treat Metastatic C
  judge-a: **eligible** - I4 met: "Has current evidence of distant metastatic disease" / I5 met: "Has received prior treatment with 1 or 2 androgen receptor pathway inhibitors (ARPIs) and progressed during or after treatment" / E8 met: "Has received prior treatment with taxane-based chemotherapy agent for metastatic castration-resistant prostate cancer (mCRPC)." (Distant mets progressing on ADT after one ARPI, no taxane for mCRPC, ECOG 0-1; BRCA negative so PARPi not indicated.)
  Reviewer verdict: [ ]

- v042 NCT07145255 Phase 1/2 Dose Finding, Safety and PK Study in Advanced Refractory Solid Tumors
  judge-a: **possibly** - I6 unknown: "for which there are no standard-of-care treatment options known to confer a clinical benefit or for which the patient is ineligible or declines" / I9 met: "For Dose Escalation (Phase 1a), patients may have evaluable disease or measurable disease" (mCRPC after ARPI allowed in dose escalation with evaluable disease; requires no standard options left (chemo/immunotherapy still available) - investigator call.)
  Reviewer verdict: [ ]

- v043 NCT03678025 Standard Systemic Therapy With or Without Definitive Treatment in Treating Participants With Metastatic Prosta
  judge-a: **excluded** - I5 not_met: "Patients must have received no more than 28 weeks of standard systemic therapy (SST)." / I6 met: "Patients must not have progressed while on SST." (De novo mHSPC fits, but patient has had about 8 months (>28 weeks) of systemic therapy.)
  Reviewer verdict: [ ]

- v043 NCT03866382 Testing the Effectiveness of Two Immunotherapy Drugs (Nivolumab and Ipilimumab) With One Anti-cancer Targeted 
  judge-a: **not_relevant** - I2 not_met: "Bone-only metastatic GU tumors (non-prostate) (Cohort J) - All genitourinary histologies, except prostate are eligible" / I2 not_met: "Only treatment-naïve primary small cell of prostate with any amount of small cell component allowed" (Rare GU histologies; prostate cancer only as treatment-naive small cell, not this treated hormone-sensitive patient.)
  Reviewer verdict: [ ]

- v043 NCT04729114 A Safety and Dose-finding Study of PRL-02 Depot in Men With Advanced Prostate Cancer
  judge-a: **excluded** - I11 not_met: "Participants with mCSPC or nmCSPC with biochemical recurrence should have received <6 months of ADT" (mCSPC cohort needs <6 months of ADT; patient has had about 8 months.)
  Reviewer verdict: [ ]

- v043 NCT05422911 Abiraterone, Enzalutamide, or Apalutamide in Castrate-sensitive Prostate Cancer.
  judge-a: **excluded** - E2 not_met: "abiraterone acetate, apalutamide or enzalutamide or darolutamide for the treatment of prostate cancer" / I6 not_met: "Have previously begun within 120 days of randomization or will receive androgen-deprivation therapy" (ARPI-naive mCSPC trial; patient already on darolutamide and ADT for ~8 months.)
  Reviewer verdict: [ ]

- v043 NCT05838716 Vitamin D for Prostate Endocrine Therapy
  judge-a: **excluded** - I1 not_met: "Be diagnosed with Stage I-IV prostate cancer without metastases to bone" (Patient has bone metastases.)
  Reviewer verdict: [ ]

- v043 NCT06228053 Study of SX-682 Plus Enzalutamide in Men With ARPI-Resistant Metastatic Castration Resistant Prostate Cancer
  judge-a: **excluded** - I2 not_met: "Diagnosis of mCRPC with (a) any histology" (ARPI-resistant mCRPC trial; patient is responding hormone-sensitive disease.)
  Reviewer verdict: [ ]

- v043 NCT07103018 A Clinical Study of KTX-2001 in Subjects With Metastatic Castration-Resistant Prostate Cancer (STRIKE-001)
  judge-a: **excluded** - I3 not_met: "Male participants with mCRPC as defined by PCWG3 criteria." / I6 not_met: "Participants should have progressed on or after receiving an ARPI" (mCRPC after ARPI progression; patient is hormone sensitive and responding.)
  Reviewer verdict: [ ]

- v045 NCT03013998 Study of Biomarker-Based Treatment of Acute Myeloid Leukemia
  judge-a: **eligible** - I4 met: "Group B: Patients must have relapsed or refractory AML according to WHO classification" / I1 met: "Adults, age ≥60 yrs at diagnosis" (Beat AML master protocol Group B accepts relapsed AML; patient 66 with relapse.)
  Reviewer verdict: [ ]

- v045 NCT05429632 Mocravimod as Adjunctive and Maintenance Treatment in AML Patients Undergoing Allo-HCT
  judge-a: **possibly** - I1 met: "Diagnosis of AML (excluding acute promyelocytic leukemia)" / I2 unknown: "or AML of any risk in CR2" / I3 unknown: "Planned allogeneic HCT" / I6 met: "age ≥ 18 years and ≤ 75 years" (Transplant trial needs CR2 and planned allo-HCT; patient currently relapsed on gilteritinib, could qualify if CR2 achieved.)
  Reviewer verdict: [ ]

- v045 NCT05875805 A Telehealth Advance Care Planning Intervention
  judge-a: **not_relevant** - I3 met: "A diagnosis of AML, MDS, and similar myeloid malignancies" / I2 met: "Age ≥60 years" (Advance care planning intervention, not a treatment study, though AML age 60+ population matches.)
  Reviewer verdict: [ ]

- v045 NCT06222580 SNDX-5613 and Gilteritinib for the Treatment of Relapsed or Refractory FLT3-Mutated Acute Myeloid Leukemia and
  judge-a: **possibly** - I4 met: "FLT-3 mutated disease of the ITD or TKD subtype, AND" / I4 met: "NPM1 mutation, MLL gene rearrangement" / I6 unknown: "Not suitable for immediate myeloablative/intensive chemotherapy" / I5 unknown: "Patients must be receiving itraconazole, ketoconazole, posaconazole, or voriconazole" (Relapsed FLT3-ITD/NPM1 AML fits; prior gilteritinib allowed; unfit-for-intensive status and azole prophylaxis unknown.)
  Reviewer verdict: [ ]

- v045 NCT06423911 Study of Olverembatinib (HQP1351) in Patients With CML-CP
  judge-a: **not_relevant** - I3 not_met: "Diagnosis of CML-CP" (Chronic myeloid leukemia trial; patient has AML.)
  Reviewer verdict: [ ]

- v045 NCT06501196 A Study of BH-30236 in Relapsed/ Refractory Acute Myelogenous Leukemia and Higher Risk Myelodysplastic Syndrom
  judge-a: **eligible** - I2 met: "Diagnosis of relapsed/refractory acute myelogenous leukemia (R/R) AML" / I3 met: "Prior treatment history must include 1-5 prior lines of therapy." / I4 met: "ECOG performance status ≤2." (Relapsed AML with 2 prior lines and good performance status.)
  Reviewer verdict: [ ]

- v045 NCT06852222 A Study of Bleximenib, Venetoclax and Azacitidine For Treatment of Participants With Newly Diagnosed Acute Mye
  judge-a: **excluded** - I2 not_met: "Previously untreated lysine N-methyltransferase 2A gene rearranged (KMT2Ar) or nucleophosmin 1 gene mutated (NPM1m) acute myeloid leukemia" / I3 not_met: "Ineligible for intensive chemotherapy" (Newly diagnosed unfit population; patient previously treated with intensive chemo and relapsed.)
  Reviewer verdict: [ ]

- v045 NCT07223814 Bleximenib in Combination With Standard Induction and Consolidation Therapy Followed by Maintenance for Treatm
  judge-a: **excluded** - I2 not_met: "New diagnosis of AML" / E1 not_met: "Prior (chemo-)therapy for AML" (Frontline NPM1 trial; patient already had 7+3 induction and has relapsed.)
  Reviewer verdict: [ ]

- v047 NCT02115295 Cladribine, Idarubicin, Cytarabine, and Venetoclax in Treating Patients With Acute Myeloid Leukemia, High-Risk
  judge-a: **not_relevant** - I1 not_met: "Patients with a diagnosis of AML, Acute Biphenotypic Leukemia, or high risk MDS" (AML/MDS/myeloid blast phase CML; patient has B-ALL.)
  Reviewer verdict: [ ]

- v047 NCT04269902 Testing Early Treatment for Patients With High-Risk Chronic Lymphocytic Leukemia (CLL) or Small Lymphocytic Le
  judge-a: **not_relevant** - I1 not_met: "Participants must have a confirmed diagnosis of chronic lymphocytic leukemia (CLL) or small lymphocytic lymphoma (SLL)" (CLL/SLL trial; patient has Ph+ B-ALL.)
  Reviewer verdict: [ ]

- v047 NCT04747912 Study of Chemotherapy-Free Induction Regimen for Ph+ Acute Lymphoblastic Leukemia With Inotuzumab Ozogamicin (
  judge-a: **excluded** - I1 not_met: "Must be a newly diagnosed and untreated patient with Ph+ B-cell Acute Lymphoblastic Leukemia" / E4 not_met: "Any prior therapy for ALL" (Already treated with hyper-CVAD plus dasatinib.)
  Reviewer verdict: [ ]

- v047 NCT05592015 Ruxolitinib for the Treatment of T-Cell Large Granular Lymphocytic Leukemia
  judge-a: **not_relevant** - I2 not_met: "Diagnosis of T-LGLL" (T-cell LGL leukemia trial; patient has Ph+ B-ALL.)
  Reviewer verdict: [ ]

- v047 NCT05884333 Cord Blood Transplant in Adults With Blood Cancers
  judge-a: **eligible** - I8 met: "Presence of any high-risk cytogenetic abnormalities such as t(9;22)" / I8 met: "Persistence or recurrence of minimal residual disease on therapy." / E6 met: "Prior allogeneic transplantation." (Ph+ ALL in CR1 with persistent MRD, age 24 within 21-65; no prior transplant.)
  Reviewer verdict: [ ]

- v047 NCT06034275 Study of VIP943 in Subjects With Advanced CD123+ Hematologic Malignancies
  judge-a: **excluded** - I1 not_met: "Subjects must have exhausted all available standard therapies or be deemed ineligible for potential available therapies." / I2 not_met: "Evidence of ≥5% bone marrow or blood blasts (acute leukemia)" / I3 unknown: "Evidence of CD123 expression from a local laboratory." (B-ALL included, but patient is in remission on ongoing standard therapy.)
  Reviewer verdict: [ ]

- v047 NCT06680752 Clinical Study of ARD103 CAR-T Therapy for Patients With R/R AML or MDS
  judge-a: **not_relevant** - I1 not_met: "Documented diagnosis of AML with either refractory or relapsed disease or diagnosis of MDS" (AML/MDS CAR-T; patient has ALL.)
  Reviewer verdict: [ ]

- v047 NCT06852222 A Study of Bleximenib, Venetoclax and Azacitidine For Treatment of Participants With Newly Diagnosed Acute Mye
  judge-a: **not_relevant** - I2 not_met: "Previously untreated lysine N-methyltransferase 2A gene rearranged (KMT2Ar) or nucleophosmin 1 gene mutated (NPM1m) acute myeloid leukemia (AML)" (AML trial; patient has ALL.)
  Reviewer verdict: [ ]

- v047 NCT06859424 A Platform Protocol to Investigate Post-Transplant Cyclophosphamide-Based Graft-Versus-Host Disease Prophylaxi
  judge-a: **possibly** - I9 met: "AML, ALL, or other acute leukemia in first remission or beyond with ≤ 5% marrow blasts" / I5 unknown: "Available partially HLA-MMUD" / E1 unknown: "Suitable HLA-matched related or 8/8 high-resolution matched unrelated donor available" (Fits ALL CR1 transplant; requires mismatched unrelated donor and no matched sibling (brother being tested).)
  Reviewer verdict: [ ]

- v048 NCT03326921 HA-1 T TCR T Cell Immunotherapy for the Treatment of Patients With Relapsed or Refractory Acute Leukemia After
  judge-a: **possibly** - I7 met: "Acute lymphoid leukemia (ALL) of any subtype" / I2 unknown: "Subject must express HLA-A*0201" / I3 unknown: "Subject must have the HA-1(H) genotype" / E4 met: "Subjects who have ongoing grade IV acute GVHD or severe chronic GVHD following most recent transplant." (Post-transplant relapse of ALL fits; HLA-A*0201 and HA-1 genotype (and donor typing) unknown.)
  judge-b: **possibly** - I7 met: "With relapse or refractory disease (>= 5% marrow blasts, or circulating blasts) at any time after HCT" / I2 unknown: "Subject must express HLA-A*0201" / I3 unknown: "Subject must have the HA-1(H) genotype" / E4 met: "Subjects who have ongoing grade IV acute GVHD or severe chronic GVHD following most recent transplant." (Post-HCT relapse fits; HLA-A*0201 / HA-1 genotype not stated.)
  Reviewer verdict: [ ]

- v048 NCT03471260 Ivosidenib and Venetoclax With or Without Azacitidine in Treating Patients With IDH1 Mutated Hematologic Malig
  judge-a: **not_relevant** - I4 not_met: "Relapsed/refractory AML, or treatment-naïve patients with AML who are not eligible for standard induction chemotherapy." (IDH1-mutated myeloid malignancies; patient has B-ALL.)
  judge-b: **not_relevant** - I4 not_met: "Relapsed/refractory AML, or treatment-naïve patients with AML who are not eligible for standard induction chemotherapy."
  Reviewer verdict: [ ]

- v048 NCT05292664 Venetoclax Basket Trial for High Risk Hematologic Malignancies
  judge-a: **excluded** - I26 not_met: "Age: ≥ 1 and ≤ 21 years of age" / I22 met: "B-cell or T-cell acute lymphoblastic leukemia (ALL), mixed phenotype acute lymphoblastic leukemia (MPAL) or lymphoblastic lymphoma (LBL) in first or greater relapse" (ALL cohort is limited to age 21 or younger; patient is 31 (other cohorts are myeloid).)
  judge-b: **excluded** - I26 not_met: "Age: ≥ 1 and ≤ 21 years of age" / I22 met: "B-cell or T-cell acute lymphoblastic leukemia (ALL), mixed phenotype acute lymphoblastic leukemia (MPAL) or lymphoblastic lymphoma (LBL) in first or greater relapse" (ALL cohort C limited to age 1-21; patient is 31 (and has ongoing skin cGVHD).)
  Reviewer verdict: [ ]

- v048 NCT06013423 Cord Blood Transplant, Cyclophosphamide, Fludarabine, and Total-Body Irradiation in Treating Patients With Hig
  judge-a: **excluded** - E6 not_met: "Prior allogeneic transplantation." (Cord blood transplant protocol excludes prior allogeneic transplant; patient also not in remission.)
  judge-b: **excluded** - E6 not_met: "Prior allogeneic transplantation." / I5 not_met: "Complete second remission (CR2) or greater (CR2+)." (Cord blood transplant: prior allo-HCT excluded and remission required; patient relapsed with 15% blasts.)
  Reviewer verdict: [ ]

- v048 NCT06644183 Roginolisib (IOA-244) With Venetoclax and Rituximab for Refractory/Relapsed Chronic Lymphocytic Leukemia (CLL)
  judge-a: **not_relevant** - I1 not_met: "Patients with relapsed/refractory CLL who meet iwCLL criteria for requiring treatment." (CLL trial; patient has B-ALL.)
  judge-b: **not_relevant** - I1 not_met: "Patients with relapsed/refractory CLL who meet iwCLL criteria for requiring treatment."
  Reviewer verdict: [ ]

- v048 NCT07040982 Asciminib as Maintenance Treatment After Cellular Therapies for Adults With Philadelphia Chromosome Positive A
  judge-a: **excluded** - I3 not_met: "Participant was diagnosed with Ph+ ALL according to World Health Organization criteria." (Ph+ ALL maintenance; patient is Philadelphia-negative and in relapse.)
  judge-b: **excluded** - I3 not_met: "Participant was diagnosed with Ph+ ALL according to World Health Organization criteria." (Ph+ ALL maintenance; patient is Ph-negative and in relapse.)
  Reviewer verdict: [ ]

- v051 NCT06577441 Testing the Addition of an IDH2 Inhibitor, Enasidenib, to Usual Treatment (Cedazuridine-Decitabine) for Higher
  judge-a: **not_relevant** - I3 not_met: "Patients must have a morphologically-confirmed diagnosis of MDS" (IDH2 MDS trial; patient has CML.)
  Reviewer verdict: [ ]

- v051 NCT06943872 A Study to Investigate Progression-Free Survival With Sonrotoclax Plus Obinutuzumab Or Sonrotoclax Plus Rituxi
  judge-a: **not_relevant** - I1 not_met: "Confirmed diagnosis of CLL/SLL" (CLL/SLL trial; patient has CML.)
  Reviewer verdict: [ ]

- v051 NCT07605416 Testing an Experimental Approach to Treat Patients With Plasma Cell Leukemia, The QUANTUM Trial
  judge-a: **not_relevant** - I1 not_met: "Documented diagnosis of primary plasma cell leukemia" (Plasma cell leukemia trial; patient has CML.)
  Reviewer verdict: [ ]

- v052 NCT04068597 Study to Evaluate CCS1477 (Inobrodib) in Haematological Malignancies
  judge-a: **not_relevant** - I3 not_met: "relapsed or refractory haematological malignancies (NHL, MM and AML)" / I4 not_met: "Must have previously received standard therapy" (R/R NHL/MM/AML trial; patient has untreated CML.)
  Reviewer verdict: [ ]

- v052 NCT06136559 A Study of Nemtabrutinib (MK-1026) Versus Comparator (Investigator's Choice of Ibrutinib or Acalabrutinib) in 
  judge-a: **not_relevant** - I2 not_met: "Confirmed diagnosis of CLL/SLL" (First-line CLL/SLL trial; patient has CML.)
  Reviewer verdict: [ ]

- v052 NCT07007312 Studies to Assess Ziftomenib in Combination With Ven+Aza or 7+3 in Patients With Untreated NPM1-m or KMT2A-r A
  judge-a: **not_relevant** - I3 not_met: "Diagnosis of AML per the 2022 WHO Classification" / E3 not_met: "Known history of BCR-ABL mutation." (NPM1/KMT2A AML trial; patient has BCR-ABL positive CML.)
  Reviewer verdict: [ ]

- v055 NCT04260022 Study of HQP1351 in Subjects With Refractory CML and Ph+ ALL
  judge-a: **not_relevant** - I1 not_met: "patients must have CML in any phase (CP, AP, or BP of any phenotype) or Ph+ ALL" (CML/Ph+ ALL trial; patient has AML.)
  Reviewer verdict: [ ]

- v055 NCT04269902 Testing Early Treatment for Patients With High-Risk Chronic Lymphocytic Leukemia (CLL) or Small Lymphocytic Le
  judge-a: **not_relevant** - I1 not_met: "Participants must have a confirmed diagnosis of chronic lymphocytic leukemia (CLL) or small lymphocytic lymphoma (SLL)" (CLL/SLL trial; patient has AML.)
  Reviewer verdict: [ ]

- v055 NCT04988555 A Phase 1/2 Study of Enzomenib (DSP-5336) in Patients With Acute Leukemia (Horizen-1)
  judge-a: **excluded** - I2 not_met: "Have a diagnosis of relapsed or refractory AML, ALL or acute leukemia of ambiguous lineage" / I8 not_met: "Must not have received treatment for AML with the exception of hydroxyurea for control of white blood cell counts." (NPM1 fits, but cohorts need R/R AML or untreated AML; patient is in first remission on aza/ven.)
  Reviewer verdict: [ ]

- v055 NCT06001788 Safety and Tolerability of Ziftomenib Combinations in Patients With Relapsed/Refractory Acute Myeloid Leukemia
  judge-a: **excluded** - I1 not_met: "Has been diagnosed with relapsed/refractory AML." / I2 met: "Has a documented NPM1 mutation or KMT2A rearrangement." (NPM1 fits but requires relapsed/refractory AML; patient is in first remission.)
  Reviewer verdict: [ ]

- v055 NCT06222580 SNDX-5613 and Gilteritinib for the Treatment of Relapsed or Refractory FLT3-Mutated Acute Myeloid Leukemia and
  judge-a: **excluded** - I4 not_met: "FLT-3 mutated disease of the ITD or TKD subtype" / I4 not_met: "Relapsed or Refractory Acute Myeloid Leukemia" (Requires FLT3-mutated R/R AML; patient is FLT3-negative and in remission.)
  Reviewer verdict: [ ]

- v055 NCT06824168 Evaluation of Two Dose Levels of Quizartinib as Maintenance in FLT3-ITD (+) Acute Myeloid Leukemia Patients in
  judge-a: **excluded** - I3 not_met: "Participant has confirmed FLT3-ITD-positive" (FLT3-ITD maintenance trial; patient is FLT3-negative.)
  Reviewer verdict: [ ]

- v055 NCT07211958 Study of Revumenib in Combination With Intensive Chemotherapy in Newly Diagnosed Acute Myeloid Leukemia (AML) 
  judge-a: **excluded** - I1 not_met: "Participants must have newly diagnosed and previously untreated AML and be candidates for intensive chemotherapy." / I2 met: "Presence of an NPM1 mutation." (NPM1 fits but requires untreated AML for intensive chemo; patient already on aza/ven.)
  Reviewer verdict: [ ]

- v055 NCT07581002 A Study to Assess Adverse Events and Change in Disease Activity When Intravenous (IV) Pivekimab Sunirine is Gi
  judge-a: **excluded** - I1 not_met: "Participants must have newly diagnosed, untreated confirmed acute myeloid leukemia" / E4 not_met: "Participants must not have received a hypomethylating agent, any BCL-2 inhibitors including venetoclax" (Requires untreated AML; patient already received azacitidine + venetoclax.)
  Reviewer verdict: [ ]

- v056 NCT04502394 Safety and Efficacy of KRT-232 in Combination With Acalabrutinib in Subjects With R/R DLBCL or R/R CLL
  judge-a: **possibly** - I1 unknown: "Confirmed diagnosis of TP53wt DLBCL (WHO); R/R DLBCL after at least 2 prior lines of treatment" / E2 met: "Prior treatment with any BTK inhibitor" (R/R DLBCL after two lines fits; TP53 wild-type status not stated.)
  Reviewer verdict: [ ]

- v056 NCT04848064 Third-Party Natural Killer Cells and Mogamulizumab for the Treatment of Relapsed or Refractory Cutaneous T-cel
  judge-a: **not_relevant** - I4 not_met: "relapsed or refractory cutaneous T-cell lymphoma" (CTCL/ATLL trial; patient has DLBCL.)
  Reviewer verdict: [ ]

- v056 NCT06526793 Surovatamig (AZD0486) as Monotherapy in Participants With Relapsed/Refractory (R/R) B-cell NHL
  judge-a: **possibly** - I2 met: "Histologically confirmed relapsed refractory FL (Module 1) and LBCL (Module 2) after at least 2 prior lines of therapy" / I2 unknown: "Locally confirmed CD-19 expression in lymphoma cells after progression from last CD 19 directed therapy" / I4 unknown: "CAR T- cell therapy within 6 months" (LBCL after two lines fits; needs CD19 expression after axi-cel and at least 6 months since CAR-T (given in spring).)
  Reviewer verdict: [ ]

- v056 NCT06536049 Epcoritamab Plus Ibrutinib for the Treatment of Relapsed or Refractory Aggressive B-Cell Non-Hodgkin Lymphoma
  judge-a: **eligible** - I4 met: "≥ 2 prior systemic lymphoma treatments OR" / I4 met: "Prior treatment with CAR T cells is allowed if ≥ 30 days prior to enrollment" / I7 met: "Measurable disease (defined as > 1.5 cm in diameter) or at least one PET fludeoxyglucose F-18 (FDG) avid area of disease" / E1 met: "Prior therapy with a bispecific antibody targeting CD3 and CD20" (R/R DLBCL after R-CHOP and axi-cel (spring), PET-avid nodes, no prior CD20 bispecific.)
  Reviewer verdict: [ ]

- v056 NCT06708897 A Study of Lonitoclax (ZE50-0134) in Relapsed or Refractory B-cell Malignancies
  judge-a: **not_relevant** - I3 not_met: "Relapsed or refractory CLL or SLL" (CLL/SLL, MZL and WM trial; patient has DLBCL.)
  Reviewer verdict: [ ]

- v057 NCT06649812 Testing the Effectiveness of a Combination Targeted Therapy (ViPOR) for Patients With Relapsed and/or Refracto
  judge-a: **not_relevant** - I2 not_met: "Patient must have histologically or cytologically confirmed aggressive B-cell lymphoma as follows:" (Aggressive DLBCL/HGBCL trial; patient has grade 2 FL.)
  Reviewer verdict: [ ]

- v057 NCT06651177 Evaluation of Tirzepatide as an Adjunct to Buprenorphine for the Treatment of Opioid Use Disorder
  judge-a: **not_relevant** - I2 not_met: "Must have moderate to severe OUD;" (Opioid use disorder study; not a lymphoma trial.)
  Reviewer verdict: [ ]

- v057 NCT06839053 Sonrotoclax, Rituximab, and Zanubrutinib in Treating Participants With Chronic Lymphocytic Leukemia, Small Lym
  judge-a: **not_relevant** - I4 not_met: "CLL/SLL COHORT: CLL/SLL diagnosis that meets the International Workshop on Chronic Lymphocytic Leukemia criteria:" (CLL/SLL and MCL trial; patient has FL.)
  Reviewer verdict: [ ]

- v058 NCT05260957 CAR-T Cell Therapy, Mosunetuzumab and Polatuzumab for Treatment of Refractory/Relapsed Aggressive Non-Hodgkin'
  judge-a: **excluded** - I11 not_met: "should be at least 45% (LVEF ≥ 45%)" / I2 met: "Mantle Cell lymphoma (MCL)" (MCL relapsed after ASCT fits, but LVEF must be at least 45% and his ejection fraction is around 40%.)
  Reviewer verdict: [ ]

- v058 NCT06393738 A Study of ARV-393 in Relapsed/Refractory Non-Hodgkin Lymphoma.
  judge-a: **excluded** - I4 not_met: "Eastern Cooperative Oncology Group (ECOG) performance status (PS) of 0 or 1" / E12 not_met: "Cardiac ejection fraction <45%." / I1 met: "Have relapsed/refractory NHL and >=2 prior systemic therapies, (including rituximab)" (Heavily pretreated B-NHL fits, but ECOG 0-1 is required (he is 2) and EF below 45% is excluded (his is about 40%).)
  Reviewer verdict: [ ]

- v058 NCT06717347 A Study to Evaluate Zilovertamab Vedotin (MK-2140) Combination With Rituximab Plus Cyclophosphamide, Doxorubic
  judge-a: **not_relevant** - I1 not_met: "Has histologically confirmed diagnosis of diffuse large B-cell lymphoma (DLBCL)" (Untreated DLBCL trial; patient has relapsed MCL.)
  Reviewer verdict: [ ]

- v058 NCT07221500 A Study of NX-5948 in Adults With CLL/SLL Previously Treated With a Bruton's Tyrosine Kinase Inhibitor and a B
  judge-a: **not_relevant** - I2 not_met: "Confirmed relapsed/refractory CLL/SLL that meets iwCLL criteria for diagnosis and systemic treatment" (CLL/SLL trial; patient has MCL.)
  Reviewer verdict: [ ]

- v059 NCT03666000 Dose-escalation and Dose-expansion Study of Safety of Azer-cel (PBCAR0191) in Participants With Relapsed/Refra
  judge-a: **excluded** - I28 not_met: "Participant must have received at least 1-2 prior lines of therapy, depending on histological subtype" / I23 met: "MZL that is fluorodeoxyglucose (FDG)-avid on positron emission tomography (PET) scan" (Allogeneic CAR-T with an MZL cohort, but r/r disease after 1-2 prior lines is required; she is untreated.)
  Reviewer verdict: [ ]

- v059 NCT06026319 CD79b-19 CAR T Cells in Non-Hodgkin Lymphoma
  judge-a: **excluded** - I4 not_met: "Diagnosis of histologically or cytologically confirmed relapsed/refractory (R/R) Non Hodgkins lymphoma" / I5 not_met: "R/R disease after 2 or more prior lines of systemic therapy" (MZL cohort requires R/R disease after 2+ prior lines; she is newly diagnosed and untreated.)
  Reviewer verdict: [ ]

- v059 NCT06149286 A Trial to Find Out if Odronextamab Combined With Lenalidomide is Safe and Works Better Than Rituximab Combine
  judge-a: **excluded** - I2 not_met: "Must have refractory disease or relapsed after at least 1 prior line (with a duration of at least 2 cycles) of systemic chemo-immunotherapy or immunotherapy." / I1 met: "MZL (nodal, splenic, or extra nodal MZL)" (MZL is included but must be relapsed/refractory after prior therapy; she is untreated.)
  Reviewer verdict: [ ]

- v059 NCT06393738 A Study of ARV-393 in Relapsed/Refractory Non-Hodgkin Lymphoma.
  judge-a: **excluded** - I1 not_met: "Have relapsed/refractory NHL and >=2 prior systemic therapies, (including rituximab)" (R/R NHL after 2+ prior therapies; she is newly diagnosed and untreated.)
  Reviewer verdict: [ ]

- v059 NCT06717347 A Study to Evaluate Zilovertamab Vedotin (MK-2140) Combination With Rituximab Plus Cyclophosphamide, Doxorubic
  judge-a: **not_relevant** - I1 not_met: "Has histologically confirmed diagnosis of diffuse large B-cell lymphoma (DLBCL)" (Untreated DLBCL trial; patient has MZL.)
  Reviewer verdict: [ ]

- v059 NCT07029217 A Study of Reduced Dose Radiation Therapy for People With B-Cell Lymphomas
  judge-a: **excluded** - I3 not_met: "Patients must have stage I or II disease" / I4 met: "Patients should be newly diagnosed or previously observed with no prior lymphoma-directed therapy" (Radiotherapy for early-stage FL/MZL; her disease is on both sides of the diaphragm (stage III or higher).)
  Reviewer verdict: [ ]

- v059 NCT07226843 A Study of LY4584180 in Adult Participants With Previously Treated Blood Cancers
  judge-a: **excluded** - I1 not_met: "Has been treated for the following blood cancers and has received at least 2 prior lines of systemic therapy or not eligible for available therapy:" / E4 not_met: "Has known hepatitis B or C infection" (Previously treated NHL study; she is untreated with standard options available and has known chronic hepatitis C.)
  Reviewer verdict: [ ]

- v060 NCT04545762 Anti-CD19 Chimeric Antigen Receptor T Cells for Treatment of Relapsed or Refractory Non-Hodgkin Lymphoma
  judge-a: **not_relevant** - I4 not_met: "Participants must have a diagnosis of relapsed or refractory Burkitt Lymphoma" / I8 not_met: "Participants must have a diagnosis of relapsed or refractory Marginal Zone Lymphoma (MZL), or Lymphoplasmacytic Lymphoma (LPL)/Waldenström Macroglobulinemia (WM)" (CD19 CAR-T for B-cell NHL cohorts; patient has Hodgkin lymphoma.)
  judge-b: **not_relevant** - I4 not_met: "Participants must have a diagnosis of relapsed or refractory Burkitt Lymphoma" / I8 not_met: "Participants must have a diagnosis of relapsed or refractory Marginal Zone Lymphoma (MZL), or Lymphoplasmacytic Lymphoma (LPL)/Waldenström Macroglobulinemia (WM):" (CD19 CAR-T for Burkitt/MZL/WM; patient has classical Hodgkin lymphoma.)
  Reviewer verdict: [ ]

- v060 NCT04775745 Study of Oral Administration of LP-168 in Patients With Relapsed or Refractory B-cell Malignancies.
  judge-a: **not_relevant** - I2 not_met: "Subjects are eligible with B-cell malignancies, WM, FL, MCL, MZL, DLBCL, HCL, CLL, SLL" (B-cell NHL/CLL trial; patient has classical Hodgkin lymphoma.)
  judge-b: **not_relevant** - I2 not_met: "Subjects are eligible with B-cell malignancies, WM, FL, MCL, MZL, DLBCL, HCL, CLL, SLL, based upon 2016 updated WHO classification."
  Reviewer verdict: [ ]

- v060 NCT04792489 DALY II USA/ MB-CART2019.1 for DLBCL
  judge-a: **not_relevant** - I1 not_met: "Histologically confirmed B-cell non-Hodgkin's lymphoma" (CD19/CD20 CAR-T for B-cell NHL; patient has Hodgkin lymphoma.)
  judge-b: **not_relevant** - I1 not_met: "Histologically confirmed B-cell non-Hodgkin's lymphoma:"
  Reviewer verdict: [ ]

- v060 NCT05077527 Immune Cell Therapy (CAR-T) for the Treatment of Patients With HIV and B-Cell Non-Hodgkin Lymphoma
  judge-a: **not_relevant** - I3 not_met: "Participant must have R/R aggressive B-cell NHL of the following histologies:" (CAR-T for HIV-associated B-cell NHL; patient has Hodgkin lymphoma and no HIV.)
  judge-b: **not_relevant** - I3 not_met: "Participant must have R/R aggressive B-cell NHL of the following histologies:"
  Reviewer verdict: [ ]

- v060 NCT06475235 Pembrolizumab + Chemotherapy in Newly Diagnosed PCNSL
  judge-a: **not_relevant** - I1 not_met: "Subjects with pathologically confirmed newly diagnosed primary CNS diffuse large B-cell lymphoma (DLBCL)" (Primary CNS lymphoma trial; patient has Hodgkin lymphoma.)
  judge-b: **not_relevant** - I1 not_met: "Subjects with pathologically confirmed newly diagnosed primary CNS diffuse large B-cell lymphoma (DLBCL)"
  Reviewer verdict: [ ]

- v060 NCT06536049 Epcoritamab Plus Ibrutinib for the Treatment of Relapsed or Refractory Aggressive B-Cell Non-Hodgkin Lymphoma
  judge-a: **not_relevant** - I1 not_met: "One of the following CD20+ B-cell non-Hodgkin lymphoma subtypes" (Aggressive B-cell NHL trial; patient has classical Hodgkin lymphoma.)
  judge-b: **not_relevant** - I1 not_met: "One of the following CD20+ B-cell non-Hodgkin lymphoma subtypes"
  Reviewer verdict: [ ]

- v060 NCT07029217 A Study of Reduced Dose Radiation Therapy for People With B-Cell Lymphomas
  judge-a: **not_relevant** - I1 not_met: "Patients must be diagnosed with a follicular lymphoma or marginal zone lymphoma" (Early-stage indolent FL/MZL radiation trial; patient has relapsed Hodgkin lymphoma.)
  judge-b: **not_relevant** - I1 not_met: "Patients must be diagnosed with a follicular lymphoma or marginal zone lymphoma."
  Reviewer verdict: [ ]

- v060 NCT07439653 A Study of TORL-5-700 in Relapsed/Refractory Non Hodgkin's Lymphoma
  judge-a: **not_relevant** - I1 not_met: "Confirmed B-NHL" (B-cell NHL trial; patient has Hodgkin lymphoma.)
  judge-b: **not_relevant** - I1 not_met: "Confirmed B-NHL, including but not limited to de novo DLBCL"
  Reviewer verdict: [ ]

- v060 NCT07691606 A Study of ARC-02 in B-cell NHL
  judge-a: **not_relevant** - I1 not_met: "A documented diagnosis of B-cell Non- Hodgkin Lymphoma (NHL)" (B-cell NHL trial; patient has Hodgkin lymphoma.)
  judge-b: **not_relevant** - I1 not_met: "A documented diagnosis of B-cell Non- Hodgkin Lymphoma (NHL) per 2016 World Health Organization criteria"
  Reviewer verdict: [ ]

- v061 NCT03418038 Ascorbic Acid and Chemotherapy for the Treatment of Relapsed or Refractory Lymphoma, CCUS, and Chronic Myelomo
  judge-a: **excluded** - I2 not_met: "Biopsy-proven relapsed or refractory lymphomas" / I3 not_met: "Arm C patients include relapsed or refractory lymphoma patients of any type for which the recommended treatment includes one of the platinum-based regimens" (Arm C takes any R/R lymphoma, but he is mid first-line CHOEP and responding, not relapsed or refractory.)
  Reviewer verdict: [ ]

- v061 NCT05976763 Testing Continuous Versus Intermittent Treatment With the Study Drug Zanubrutinib for Older Patients With Prev
  judge-a: **not_relevant** - I1 not_met: "Histologically confirmed mantle cell lymphoma" (Mantle cell lymphoma trial; patient has PTCL-NOS.)
  Reviewer verdict: [ ]

- v061 NCT06544265 SynKIR-310 for Relapsed/Refractory B-NHL
  judge-a: **not_relevant** - I2 not_met: "Histologically confirmed diagnosis of B-NHL before enrollment." (B-cell NHL trial; patient has T-cell lymphoma.)
  Reviewer verdict: [ ]

- v061 NCT06561048 Soquelitinib vs Standard of Care in Participants With Relapsed/Refractory Peripheral T-cell Lymphoma Not Other
  judge-a: **excluded** - I3 met: "Histologically confirmed PTCL-NOS, FHTCLs or sALCL" / I4 not_met: "Progressed on, be refractory to, relapsed, or intolerant to standard therapy for their cancer." (PTCL-NOS fits, but the trial is for R/R disease; he is responding to first-line CHOEP.)
  Reviewer verdict: [ ]

- v061 NCT06879340 Evaluating the Safety and Efficacy of DuoCAR20.19.22-D95 in Adult Patients With Relapsed or Refractory B-cell 
  judge-a: **not_relevant** - I3 not_met: "Patients must have histologically confirmed aggressive B-Cell NHL or ALL as stated below:" (B-cell NHL / B-ALL CAR-T; patient has T-cell lymphoma.)
  Reviewer verdict: [ ]

- v061 NCT07192471 A First-in-Human Study of KK2223 in Participants With Relapsed or Refractory T Cell Non-Hodgkin Lymphoma
  judge-a: **excluded** - I1 met: "PTCL (including nodal T-follicular helper cell lymphoma, ALCL, PTCL NOS)" / I2 not_met: "PTCL participants must have relapsed/refractory/intolerant to ≥1 systemic therapy" (R/R T-cell NHL trial; he is responding to first-line CHOEP, not relapsed or refractory.)
  Reviewer verdict: [ ]

- v062 NCT04999384 First in Human, Dose Escalation Study of AN4005
  judge-a: **excluded** - I1 not_met: "Eastern Cooperative Oncology Group (ECOG) Performance Status of 0 or 1." / I1 unknown: "relapsed or refractory (r/r) lymphoma, and for whom standard life-prolonging measures are not available" (R/R lymphoma first-in-human study; she is ECOG 3-4.)
  Reviewer verdict: [ ]

- v062 NCT06651177 Evaluation of Tirzepatide as an Adjunct to Buprenorphine for the Treatment of Opioid Use Disorder
  judge-a: **not_relevant** - I2 not_met: "Must have moderate to severe OUD;" (Opioid use disorder study; not a lymphoma study.)
  Reviewer verdict: [ ]

- v062 NCT06717347 A Study to Evaluate Zilovertamab Vedotin (MK-2140) Combination With Rituximab Plus Cyclophosphamide, Doxorubic
  judge-a: **excluded** - I3 not_met: "Has received no prior treatment for their DLBCL" / I4 not_met: "Has an Eastern Cooperative Oncology Group (ECOG) performance status of 0 to 2" (Untreated DLBCL trial; her lymphoma has been treated and has recurred, and she is ECOG 3-4.)
  Reviewer verdict: [ ]

- v063 NCT03328078 CA-4948-101: Open-Label, Dose Escalation and Expansion Trial of Emavusertib (CA-4948) in Relapsed or Refractor
  judge-a: **not_relevant** - I4 not_met: "Histopathologically confirmed diagnosis of PCNSL" / E1 not_met: "systemic presence of lymphoma" (R/R PCNSL trial; she has systemic double-hit DLBCL.)
  Reviewer verdict: [ ]

- v063 NCT05006716 A Dose-Escalation and Expansion Study of Tacabrutideg (BGB-16673) in Participants With B-Cell Malignancies
  judge-a: **excluded** - I1 met: "R/R diffuse large B-cell lymphoma (DLBCL)" / E5 not_met: "germinal center B-cell (GCB), DLBCL" (GCB DLBCL is excluded; her DLBCL is germinal center type.)
  Reviewer verdict: [ ]

- v063 NCT05633615 Testing Drug Treatments After CAR T-cell Therapy in Patients With Relapsed/Refractory Diffuse Large B-cell Lym
  judge-a: **possibly** - I1 met: "Participants must have a histologically confirmed diagnosis of diffuse large B-cell lymphoma" / I6 unknown: "participants must be felt to be a candidate for CAR T-cell therapy with plans to be treated with Food and Drug Administration (FDA) approved commercially available CD19 CAR T-cell construct." / I26 met: "Participants with known human immunodeficiency virus (HIV)-infection must be on effective anti-retroviral therapy" (R/R DLBCL with controlled HIV fits; the trial needs planned commercial CD19 CAR-T, which is not mentioned.)
  Reviewer verdict: [ ]

- v063 NCT05780034 A Study of AC676 for the Treatment of Relapsed/Refractory B-Cell Malignancies
  judge-a: **excluded** - I2 not_met: "non-GCB Diffuse Large B-cell Lymphoma (DLBCL)" (DLBCL cohort is non-GCB only; her DLBCL is germinal center type.)
  Reviewer verdict: [ ]

- v063 NCT06013423 Cord Blood Transplant, Cyclophosphamide, Fludarabine, and Total-Body Irradiation in Treating Patients With Hig
  judge-a: **excluded** - E6 not_met: "Prior allogeneic transplantation." / E9 not_met: "HIV infection." (Cord blood transplant trial; prior allogeneic transplant and HIV are exclusions.)
  Reviewer verdict: [ ]

- v063 NCT06561048 Soquelitinib vs Standard of Care in Participants With Relapsed/Refractory Peripheral T-cell Lymphoma Not Other
  judge-a: **not_relevant** - I3 not_met: "Histologically confirmed PTCL-NOS, FHTCLs or sALCL" (PTCL trial; patient has DLBCL.)
  Reviewer verdict: [ ]

- v063 NCT06697184 A Study to Investigate the Safety of Novel Dose Ramp-up Schedule(s) When Initiating Sonrotoclax in Participant
  judge-a: **not_relevant** - I5 not_met: "Confirmed diagnosis of CLL" (Sonrotoclax ramp-up study in CLL/MCL; patient has DLBCL.)
  Reviewer verdict: [ ]

- v063 NCT07225985 Pralatrexate With Bendamustine and Total-Body Irradiation Followed by Donor Stem Cell Transplant for the Treat
  judge-a: **not_relevant** - I2 not_met: "T-cell non-Hodgkin lymphoma (T-NHL)" (T-cell NHL transplant trial; patient has B-cell DLBCL.)
  Reviewer verdict: [ ]

- v064 NCT03937635 Lenalidomide, and Dexamethasone With or Without Daratumumab in Treating Patients With High-Risk Smoldering Mye
  judge-a: **excluded** - I1 not_met: "Patients must be diagnosed with asymptomatic high-risk smoldering multiple myeloma (SMM)" / I3 not_met: "must demonstrate 10-59% clonal plasma cells" (Smoldering myeloma trial; he has symptomatic MM with 60% marrow plasma cells.)
  judge-b: **excluded** - I1 not_met: "Patients must be diagnosed with asymptomatic high-risk smoldering multiple myeloma (SMM) within the past 12 months." / I9 unknown: "Patients must have no lytic lesions, no known plasmacytoma, and no unexplained hypercalcemia" (Smoldering myeloma only; he has symptomatic myeloma with 60% plasma cells and renal impairment.)
  Reviewer verdict: [ ]

- v064 NCT04973605 A Phase 1b/2 Study of Sonrotoclax (BGB-11417) as Monotherapy and in Various Combinations With Dexamethasone Pl
  judge-a: **excluded** - I5 not_met: "Participant has documented relapsed or progressive MM on or after any regimen" / I7 unknown: "Positivity for t(11;14) translocation" (Relapsed/refractory t(11;14) MM trial; he is untreated.)
  judge-b: **excluded** - I5 not_met: "Participant has documented relapsed or progressive MM on or after any regimen or who are refractory to the most recent line of therapy." / I7 unknown: "Positivity for t(11;14) translocation must be confirmed"
  Reviewer verdict: [ ]

- v064 NCT05552222 A Study of Teclistamab in Combination With Daratumumab and Lenalidomide (Tec-DR) and Talquetamab in Combinatio
  judge-a: **possibly** - I2 unknown: "deferral of high-dose chemotherapy with ASCT as initial treatment" / E1 met: "Received any prior therapy for multiple myeloma or smoldering myeloma" / E6 unknown: "Myeloma Frailty Index of >=2" (Untreated NDMM; fits if transplant is ineligible or deferred, which is still being decided.)
  judge-b: **possibly** - I2 unknown: "Be newly diagnosed and not considered a candidate for high-dose chemotherapy with autologous stem cell transplant (ASCT) due to: ineligible due to advanced age OR; ineligible due to the presence of comorbid condition(s) likely to have a negative impact on tolerability of high-dose chemotherapy with ASCT OR; deferral of high-dose chemotherapy with ASCT as initial treatment" / E1 met: "Received any prior therapy for multiple myeloma or smoldering myeloma other than a short course of corticosteroids" (Untreated NDMM fits; requires transplant ineligibility or deferral, which is undecided.)
  Reviewer verdict: [ ]

- v064 NCT06679101 A Study of Belantamab Mafodotin Administered in Combination With Lenalidomide and Dexamethasone (BRd) Versus D
  judge-a: **possibly** - I3 met: "NDMM with a requirement for treatment as documented per IMWG criteria." / I6 unknown: "Newly diagnosed and not considered candidate for high-dose chemotherapy with autologous stem cell transplant (ASCT)" / E2 met: "Prior systemic therapy for multiple myeloma, or smoldering multiple myeloma." (Untreated NDMM fits; trial needs transplant ineligibility, while his doctor is considering a transplant.)
  judge-b: **possibly** - I6 unknown: "Newly diagnosed and not considered candidate for high-dose chemotherapy with autologous stem cell transplant (ASCT)" / E2 met: "Prior systemic therapy for multiple myeloma, or smoldering multiple myeloma." (Phase 3 for transplant-ineligible NDMM; transplant still being considered for him.)
  Reviewer verdict: [ ]

- v064 NCT07053436 Horizon Two: HR NDMM (MMRC-100)
  judge-a: **possibly** - I3 met: "Symptomatic and transplant eligible newly diagnosed multiple myeloma histologically confirmed per IMWG criteria that is high-risk" / I4 unknown: "One of these translocations-t(4;14) or t(14;16) or t(14;20)-co-occurring with +1q and/or del(1p32)" / I10 unknown: "Adequate renal function, defined as calculated creatinine clearance ≥ 30 mL/min" (High-risk NDMM; gain of 1q alone does not qualify, so other FISH findings decide it. CrCl with creatinine 2.0 unknown.)
  judge-b: **possibly** - I3 unknown: "Symptomatic and transplant eligible newly diagnosed multiple myeloma histologically confirmed per IMWG criteria that is high-risk as defined by at least one of the following:" / I4 unknown: "One of these translocations-t(4;14) or t(14;16) or t(14;20)-co-occurring with +1q and/or del(1p32)" (Only +1q reported; qualifies only if a co-occurring translocation, del(1p32), TP53/del17p or EMD is present.)
  Reviewer verdict: [ ]

- v064 NCT07258511 A Study Comparing JNJ-79635322 and an Anti-B-cell Maturation Antigen (BCMA)xCD3 Bispecific Antibody in Partici
  judge-a: **excluded** - I4 not_met: "Received at least 3 prior lines of antimyeloma therapy" (RRMM trial; he is untreated.)
  judge-b: **excluded** - I4 not_met: "Received at least 3 prior lines of antimyeloma therapy including a proteasome inhibitor (PI), an immunomodulatory drug (IMiD), and an anti-cluster of differentiation (CD)38 antibody"
  Reviewer verdict: [ ]

- v064 NCT07284758 A Study to Evaluate the Efficacy of Cemsidomide + Dexamethasone in Participants With Relapsed/Refractory Multi
  judge-a: **excluded** - I4 not_met: "Received at least 3 prior anti-myeloma regimens" (Heavily pretreated RRMM trial; he is untreated.)
  judge-b: **excluded** - I4 not_met: "Received at least 3 prior anti-myeloma regimens"
  Reviewer verdict: [ ]

- v065 NCT05137054 A Study to Examine the Effects of Novel Therapy Linvoseltamab in Combination With Other Cancer Treatments for 
  judge-a: **excluded** - I2 not_met: "Eastern Cooperative Oncology Group (ECOG) performance status ≤1" / I10 met: "Progressive RRMM in participants with triple-class refractory disease (anti-CD38 antibody, IMiD, PI) after at least 3 lines of therapy" (Triple-class refractory RRMM fits, but she is ECOG 2.)
  Reviewer verdict: [ ]

- v065 NCT05552222 A Study of Teclistamab in Combination With Daratumumab and Lenalidomide (Tec-DR) and Talquetamab in Combinatio
  judge-a: **excluded** - I2 not_met: "Be newly diagnosed and not considered a candidate for high-dose chemotherapy" / E1 not_met: "Received any prior therapy for multiple myeloma or smoldering myeloma" (Newly diagnosed MM trial; she has had three lines.)
  Reviewer verdict: [ ]

- v065 NCT05561387 Comparing Combinations of Drugs to Treat Newly Diagnosed Multiple Myeloma (NDMM) When a Stem Cell Transplant i
  judge-a: **excluded** - E1 not_met: "Participants must not have received any prior systemic therapy for multiple myeloma" (Newly diagnosed transplant-ineligible MM trial; she has had three lines.)
  Reviewer verdict: [ ]

- v065 NCT05789303 Study of Belantamab Mafodotin With Carfilzomib, Pomalidomide, and Dexamethasone in Relapsed Multiple Myeloma
  judge-a: **possibly** - I13 met: "Subjects with relapsed or refractory multiple myeloma requiring systemic therapy, who have progressed after 2+ prior lines of anti-myeloma treatments." / I15 unknown: "subjects cannot be refractory to both carfilzomib and pomalidomide" / E13 unknown: "Significant neuropathy (Grades 3-4, or Grade 2 with pain)" (RRMM after 3 lines fits; whether she is refractory to both carfilzomib and pomalidomide, and neuropathy grade, are unknown.)
  Reviewer verdict: [ ]

- v065 NCT06433947 Study to Assess Safety and Tolerability of OPN-6602 in Subjects With Relapsed and/or Refractory Multiple Myelo
  judge-a: **possibly** - I2 met: "Relapsed or refractory to 3 or more different prior lines of therapy for MM that included immunomodulatory agents, proteosome inhibitors, and anti-CD38 antibody" / I2 unknown: "not a candidate for or intolerant to established therapy known to provide clinical benefit" (Triple-class refractory after 3 lines fits; whether established options (CAR-T, bispecifics) are unsuitable is unknown.)
  Reviewer verdict: [ ]

- v065 NCT06518551 Elotuzumab + Iberdomide + Dexamethasone Post Ide-Cel in RRMM
  judge-a: **excluded** - I4 not_met: "patient has received ide-cel in accordance with the FDA approved US Prescribing Information" / I3 not_met: "Patient who has been treated with at least 4 prior lines of anti-myeloma treatment" (Post ide-cel maintenance trial after 4+ lines; she has had 3 lines and no CAR-T.)
  Reviewer verdict: [ ]

- v065 NCT06679101 A Study of Belantamab Mafodotin Administered in Combination With Lenalidomide and Dexamethasone (BRd) Versus D
  judge-a: **excluded** - I3 not_met: "NDMM with a requirement for treatment as documented per IMWG criteria." / E2 not_met: "Prior systemic therapy for multiple myeloma, or smoldering multiple myeloma." (Newly diagnosed MM trial; she has had three lines of therapy.)
  Reviewer verdict: [ ]

- v065 NCT06993675 Engaging T-cells to Eliminate MRD in Newly Diagnosed Myeloma Optimizing Response With Talquetmab and Teclistam
  judge-a: **excluded** - I5 not_met: "Newly diagnosed multiple myeloma participants who are transplant eligible and have completed at least four cycles of quadruplet" (Post-ASCT MRD trial for newly diagnosed MM; she has relapsed after three lines.)
  Reviewer verdict: [ ]

- v066 NCT06356571 A Study to Investigate Subcutaneous Isatuximab in Combination With Weekly Carfilzomib and Dexamethasone in Adu
  judge-a: **excluded** - I4 not_met: "Participants with relapsed and/or refractory MM with at least 1 prior line of therapy" (RRMM trial; she is untreated.)
  Reviewer verdict: [ ]

- v066 NCT07284758 A Study to Evaluate the Efficacy of Cemsidomide + Dexamethasone in Participants With Relapsed/Refractory Multi
  judge-a: **excluded** - I4 not_met: "Received at least 3 prior anti-myeloma regimens" (Heavily pretreated RRMM trial; she is untreated.)
  Reviewer verdict: [ ]

- v066 NCT07393282 A Study to Compare Linvoseltamab and Daratumumab Treatment in High-Risk Smoldering Multiple Myeloma (HR-SMM)
  judge-a: **eligible** - I1 met: "Eastern Cooperative Oncology Group performance status score ≤1" / I2 met: "SMM diagnosis per IMWG criteria as defined in the protocol" / I3 met: "Meets HR-SMM criteria by 1 of the risk models as defined in the protocol" / E5 met: "Prior exposure to any approved or investigational treatments directed against a clonal plasma cell disorder" (Untreated high-risk smoldering myeloma (M-protein 2.5 g/dL, high FLC ratio), no myeloma-defining events, ECOG 0-1.)
  Reviewer verdict: [ ]

- v066 NCT07518186 A Study Comparing JNJ-79635322 and Teclistamab in Participants With Relapsed or Refractory Multiple Myeloma
  judge-a: **excluded** - I2 not_met: "Received 1 to 3 prior lines of antimyeloma therapy" (RRMM trial; she has untreated smoldering myeloma.)
  Reviewer verdict: [ ]

- v066 NCT07589634 A Study Evaluating the Prophylactic Use of Tocilizumab to Prevent Cytokine Release Syndrome With Ramantamig Ad
  judge-a: **excluded** - I2 not_met: "Received at least 1 prior lines of antimyeloma therapy" / I3 not_met: "Relapsed or refractory disease as defined" (RRMM bispecific trial; she has untreated smoldering myeloma.)
  Reviewer verdict: [ ]

- v066 NCT07764978 Study of AZD0120 in Newly Diagnosed Multiple Myeloma Ineligible for ASCT
  judge-a: **excluded** - I2 not_met: "Participant must have documented diagnosis of MM according to the IMWG diagnostic criteria." / I4 not_met: "Participant must be deemed ineligible for ASCT" (Active NDMM trial for transplant-ineligible patients; she has smoldering myeloma and is fit.)
  Reviewer verdict: [ ]

- v067 NCT05243797 Phase 3 Study of Teclistamab in Combination With Lenalidomide and Teclistamab Alone Versus Lenalidomide Alone 
  judge-a: **excluded** - I1 not_met: "Must have a new diagnosis of multiple myeloma according to IMWG criteria and have received induction +/- consolidation." (Post-transplant MM maintenance trial; he has untreated MGUS.)
  Reviewer verdict: [ ]

- v067 NCT06107738 Iberdomide and Daratumumab as Maintenance Therapy After an Autologous Stem Cell Transplant for Multiple Myelom
  judge-a: **excluded** - I2 not_met: "Patients who have completed Autologous Stem Cell Transplant (ASCT) 90-150 days prior to registration" (Post-ASCT MM maintenance; he has untreated MGUS.)
  Reviewer verdict: [ ]

- v067 NCT06665100 PUL-042 Treatment in Patients With Parainfluenza Virus (PIV), Human Metapneumovirus (hMPV) or Respiratory Sync
  judge-a: **not_relevant** - I1 not_met: "nasopharyngeal swab is positive for PIV, RSV, or hMPV" (Respiratory-virus treatment study; not a treatment-relevant study for his MGUS.)
  Reviewer verdict: [ ]

- v067 NCT07518186 A Study Comparing JNJ-79635322 and Teclistamab in Participants With Relapsed or Refractory Multiple Myeloma
  judge-a: **excluded** - I2 not_met: "Received 1 to 3 prior lines of antimyeloma therapy" (RRMM trial; he has untreated MGUS.)
  Reviewer verdict: [ ]

- v067 NCT07764978 Study of AZD0120 in Newly Diagnosed Multiple Myeloma Ineligible for ASCT
  judge-a: **excluded** - I2 not_met: "Participant must have documented diagnosis of MM according to the IMWG diagnostic criteria." (Transplant-ineligible NDMM trial; he has MGUS.)
  Reviewer verdict: [ ]

- v068 NCT05145816 Phase 1/2a Study of Belantamab Mafodotin in Relapsed or Refractory AL Amyloidosis
  judge-a: **possibly** - I1 unknown: "Participants medically diagnosed with relapsed or refractory Amyloid Light Chain Amyloidosis (AL amyloidosis)" / I10 unknown: "Patients must have completed other systemic therapy or investigational drug ≥ 28 days or five half-lives prior to registration" / E4 unknown: "Patients eligible for autologous stem cell transplantation (ASCT)." / I13 met: "Eastern Cooperative Oncology Group (ECOG) performance score 0, 1 or 2" (R/R AL trial; on first-line Dara-VCD with suboptimal response; refractory status, washout, transplant eligibility and NT-proBNP cutoff unknown.)
  judge-b: **possibly** - I1 unknown: "Participants medically diagnosed with relapsed or refractory Amyloid Light Chain Amyloidosis (AL amyloidosis) with one or more line of treatment as below:" / I2 met: "Must have received a proteosome inhibitor, alkylator and anti-cluster of differentiation 38 (CD38) antibody" / E6 unknown: "N-terminal-prohormone of brain natriuretic peptide (NT-proBNP) ≥ 8500ng/L within 14 days of registration." / E4 unknown: "Patients eligible for autologous stem cell transplantation (ASCT)." (Has had PI + alkylator + daratumumab with suboptimal response; refractoriness, exact NT-proBNP and transplant eligibility unknown.)
  Reviewer verdict: [ ]

- v068 NCT06974786 Frontline T-cell Engager vs Autologous Stem Cell Transplant (ASCT) and Measurable Residual Disease (MRD)-Guide
  judge-a: **not_relevant** - E1 not_met: "Diagnosis of primary light chain amyloidosis" (NDMM transplant-eligible trial that excludes AL amyloidosis.)
  judge-b: **not_relevant** - I2 not_met: "Newly diagnosed multiple myeloma with indication for initiation of therapy diagnosed within last 12 months." / E1 not_met: "Diagnosis of primary light chain amyloidosis"
  Reviewer verdict: [ ]

- v068 NCT07073547 A Phase I, Open-label, Multicenter Study to Evaluate the Safety, Tolerability, Cellular Kinetics, Immunogenici
  judge-a: **not_relevant** - I4 not_met: "Participant must have documented diagnosis of MM per IMWG diagnostic criteria" (Myeloma CAR-T trial; he has AL amyloidosis.)
  judge-b: **not_relevant** - I4 not_met: "Participant must have documented diagnosis of MM per IMWG diagnostic criteria"
  Reviewer verdict: [ ]

- v069 NCT03017820 A Vaccine (VSV-hIFNβ-NIS) With or Without Cyclophosphamide and Combinations of Ipilimumab, Nivolumab, and Cemi
  judge-a: **possibly** - I3 unknown: "Groups A, B, C or D: Multiple myeloma (MM) previously treated with an immunomodulatory imide drug (IMID), a proteosome inhibitor, and an alkylating agent" / I31 met: "Eastern Cooperative Oncology Group (ECOG) performance status (PS) 0, 1, or 2" (RRMM oncolytic-virus trial; IMiD and PI given, alkylator exposure (likely melphalan with ASCT) not stated.)
  Reviewer verdict: [ ]

- v069 NCT05552222 A Study of Teclistamab in Combination With Daratumumab and Lenalidomide (Tec-DR) and Talquetamab in Combinatio
  judge-a: **excluded** - E1 not_met: "Received any prior therapy for multiple myeloma or smoldering myeloma other than a short course of corticosteroids" (Transplant-ineligible NDMM trial; she has had two lines and ASCT.)
  Reviewer verdict: [ ]

- v069 NCT05737732 The Ambient Light Multiple Myeloma Study
  judge-a: **excluded** - E1 not_met: "Previous Autologous Stem Cell Transplant procedure" / I2 not_met: "Scheduled to undergo their first Autologous Stem Cell Transplant procedure." (Light-therapy study around first ASCT; she already had a transplant.)
  Reviewer verdict: [ ]

- v069 NCT05850234 AZD0120 in Relapsed/Refractory Multiple Myeloma (DURGA-1)
  judge-a: **excluded** - I4 not_met: "Participant must have received at least 3 prior lines of therapy" (Needs 3+ prior lines; she has had 2.)
  Reviewer verdict: [ ]

- v069 NCT06022939 Comparing Dara-VCD Chemotherapy Plus Stem Cell Transplant to Dara-VCD Chemotherapy Alone for People Who Have N
  judge-a: **not_relevant** - I1 not_met: "Participants must have systemic AL amyloidosis which is biopsy proven" (AL amyloidosis trial; she has multiple myeloma.)
  Reviewer verdict: [ ]

- v069 NCT06340737 AutologousCD22 Chimeric Antigen Receptor (CAR)T Cells in w/Recurrent/Refractory B Cell Lymphomas
  judge-a: **not_relevant** - I1 not_met: "Must have histologically confirmed disease as defined by WHO 2016[117] of one of the following:" (CD22 CAR-T for B-cell lymphomas/HCL/WM; she has multiple myeloma.)
  Reviewer verdict: [ ]

- v069 NCT06398457 Darzalex Faspro (Daratumumab and Hyaluronidase-fihj) Before Standard Desensitization and Allogeneic Bone Marro
  judge-a: **excluded** - E6 not_met: "Diagnosis of multiple myeloma or Amyloid light-chain (AL) amyloidosis" / E1 not_met: "Previous exposure to Daratumumab-SC or other anti-CD38 therapy" (Desensitization-before-allo study excludes myeloma and prior anti-CD38.)
  Reviewer verdict: [ ]

- v069 NCT06960993 Mosaic Trial for Stem Cell Transplant Recipients
  judge-a: **possibly** - I2 unknown: "Scheduled for or preparing for scheduling of an allogeneic or autologous stem cell transplant at one of our study sites" (Online education study for transplant candidates; whether another transplant is planned is not stated.)
  Reviewer verdict: [ ]

- v069 NCT07518186 A Study Comparing JNJ-79635322 and Teclistamab in Participants With Relapsed or Refractory Multiple Myeloma
  judge-a: **eligible** - I2 met: "Received 1 to 3 prior lines of antimyeloma therapy, including an anti-cluster of differentiation (CD) 38 antibody and lenalidomide" / I3 met: "Have an eastern cooperative oncology group (ECOG) performance status of 0 to 2" (2 prior lines incl. daratumumab and lenalidomide, measurable, good PS.)
  Reviewer verdict: [ ]

- v070 NCT03486873 Long-term Safety and Efficacy Extension Study for Participants With Advanced Tumors Who Are Currently on Treat
  judge-a: **not_relevant** - I1 not_met: "Treated on the parent pembrolizumab studies established by the Sponsor as MK-3475-587 ready." (Pembrolizumab extension study for parent-trial participants; he was never on a pembrolizumab study.)
  Reviewer verdict: [ ]

- v070 NCT05932680 Limited-duration Teclistamab
  judge-a: **possibly** - I2 unknown: "Participants must have initiated teclistamab (first full dose) 6-9 months prior to enrollment" / I5 unknown: "have ongoing response (i.e., no disease progression) at time of enrollment per IMWG consensus criteria" (For deep responders on teclistamab; his drugs are unknown and rising markers make an ongoing VGPR doubtful.)
  Reviewer verdict: [ ]

- v070 NCT07096778 Inobrodib, Pomalidomide and Dexamethasone in Relapsed or Refractory Multiple Myeloma
  judge-a: **possibly** - I2 unknown: "Prior diagnosis of MM as defined according to IMWG criteria and relapsed or refractory to the last line of therapy" / I3 unknown: "Eastern Co-operative Oncology Group (ECOG) performance status of 0 to 2" (Markers drifting up on current therapy; formal relapse/refractory status and ECOG unknown; IMiD allergy history unknown.)
  Reviewer verdict: [ ]

- v070 NCT07101328 A Study of LY4152199 in Participants With Previously Treated B-cell Malignancies (BAF_FRontier-1 )
  judge-a: **not_relevant** - I1 not_met: "Must have a diagnosis of either follicular lymphoma or diffuse large B-cell lymphoma." (Lymphoma trial; he has myeloma.)
  Reviewer verdict: [ ]

- v071 NCT05850234 AZD0120 in Relapsed/Refractory Multiple Myeloma (DURGA-1)
  judge-a: **eligible** - I4 met: "Participant must have received at least 3 prior lines of therapy, which include a proteasome inhibitor (PI), an immunomodulatory drug (IMiD), and an anti-CD38 antibody." / I5 met: "Have documented evidence of progressive disease per IMWG criteria." / I2 met: "ECOG performance status of 0 or 1." / I6 met: "Participant must have measurable disease at screening." (Phase 1/2 dual-target CAR-T for RRMM; numbered criteria do not bar prior BCMA therapy, allo-HCT or controlled HBV.)
  judge-b: **eligible** - I4 met: "Participant must have received at least 3 prior lines of therapy, which include a proteasome inhibitor (PI), an immunomodulatory drug (IMiD), and an anti-CD38 antibody." / I5 met: "Have documented evidence of progressive disease per IMWG criteria." / I2 met: "ECOG performance status of 0 or 1." (Listed criteria do not exclude prior BCMA CAR-T, allo-HCT or controlled HBV.)
  Reviewer verdict: [ ]

- v071 NCT06152575 MagnetisMM-32: A Study to Learn About the Study Medicine Called Elranatamab in People With Multiple Myeloma (M
  judge-a: **excluded** - I1 not_met: "previously received 1 to 4 prior lines of therapy including prior anti-cluster of differentiation 38 (CD38) antibody and prior lenalidomide" / E9 not_met: "Previous treatment with a B cell maturation antigen (BCMA)-directed therapy or CD3-redirecting therapy." (Five prior lines and prior cilta-cel and teclistamab.)
  judge-b: **excluded** - I1 not_met: "previously received 1 to 4 prior lines of therapy including prior anti-cluster of differentiation 38 (CD38) antibody and prior lenalidomide" / E9 not_met: "Previous treatment with a B cell maturation antigen (BCMA)-directed therapy or CD3-redirecting therapy."
  Reviewer verdict: [ ]

- v071 NCT06615479 A Study to Compare the Efficacy and Safety of BMS-986393 Versus Standard Regimens in Adult Participants With R
  judge-a: **excluded** - I2 not_met: "Participants must have received at least 1 but no greater than 3 prior multiple myeloma (MM) regimens" (Five prior lines.)
  judge-b: **excluded** - I2 not_met: "Participants must have received at least 1 but no greater than 3 prior multiple myeloma (MM) regimens"
  Reviewer verdict: [ ]

- v071 NCT06665100 PUL-042 Treatment in Patients With Parainfluenza Virus (PIV), Human Metapneumovirus (hMPV) or Respiratory Sync
  judge-a: **not_relevant** - I1 not_met: "Subjects will be eligible for entry into the study if a nasopharyngeal swab is positive for PIV, RSV, or hMPV" (Respiratory-virus treatment study; no such infection described.)
  judge-b: **not_relevant** - I1 not_met: "Subjects will be eligible for entry into the study if a nasopharyngeal swab is positive for PIV, RSV, or hMPV" (Treatment of respiratory viral infection, not a myeloma study.)
  Reviewer verdict: [ ]

- v071 NCT06679101 A Study of Belantamab Mafodotin Administered in Combination With Lenalidomide and Dexamethasone (BRd) Versus D
  judge-a: **excluded** - E2 not_met: "Prior systemic therapy for multiple myeloma, or smoldering multiple myeloma." (Transplant-ineligible NDMM trial; he has had five lines.)
  judge-b: **excluded** - I3 not_met: "NDMM with a requirement for treatment as documented per IMWG criteria." / E2 not_met: "Prior systemic therapy for multiple myeloma, or smoldering multiple myeloma."
  Reviewer verdict: [ ]

- v071 NCT07391657 A Study Comparing AZD0120, a Dual-targeted CAR-T Against B-cell Maturation Antigen (BCMA) and CD19, Versus Sta
  judge-a: **excluded** - I6 not_met: "Received 1 to 3 lines of prior therapy including an IMiD and either a PI or a CD38 antibody." / E6 not_met: "Previously received any prior BCMA-targeted treatment" / E9 not_met: "Previously received allogeneic stem cell transplantation at any time during prior therapy" (Five lines, prior BCMA CAR-T and bispecific, prior allo-HCT.)
  judge-b: **excluded** - I6 not_met: "Received 1 to 3 lines of prior therapy including an IMiD and either a PI or a CD38 antibody." / E6 not_met: "Previously received any prior BCMA-targeted treatment"
  Reviewer verdict: [ ]

- v072 NCT04511013 A Study to Compare the Administration of Encorafenib + Binimetinib + Nivolumab Versus Ipilimumab + Nivolumab i
  judge-a: **excluded** - I1 not_met: "Participants must have histologically and pathologically confirmed melanoma that has metastasized to the brain" / E1 not_met: "Participants must not have received prior systemic therapy for metastatic disease." (Melanoma brain-metastasis trial; his brain MRI was clear and he is on first-line therapy.)
  judge-b: **excluded** - I1 not_met: "Participants must have histologically and pathologically confirmed melanoma that has metastasized to the brain" / E1 not_met: "Participants must not have received prior systemic therapy for metastatic disease." (Brain MRI clear; already on first-line ipi-nivo.)
  Reviewer verdict: [ ]

- v072 NCT05533697 Study of mRNA-4359 Administered Alone and in Combination With Immune Checkpoint Blockade in Participants With 
  judge-a: **possibly** - I3 unknown: "Dose Confirmation (Arm 1b): Participant has histologically confirmed locally advanced or metastatic, and CPI refractory melanoma" / I6 not_met: "Arm 2a: Locally advanced or metastatic melanoma who have not yet received any prior systemic therapy for their melanoma in this setting." (Treatment-naive arms do not fit; CPI-refractory arms depend on whether ipi/nivo fails.)
  judge-b: **possibly** - I2 unknown: "Arm 1a participants must have received, and then progressed, relapsed, or been intolerant to, or ineligible for, at least 1 standard treatment regimen in the advanced or metastatic setting." / I6 not_met: "Arm 2a: Locally advanced or metastatic melanoma who have not yet received any prior systemic therapy for their melanoma in this setting." (Treatment-naive arms closed to him; CPI-refractory arms depend on progression on ipi-nivo.)
  Reviewer verdict: [ ]

- v072 NCT05669430 A Study of GV20-0251 Monotherapy and GV20-0251 in Combination With Pembrolizumab in Participants With Solid Tu
  judge-a: **possibly** - I6 unknown: "For participants who have received prior treatment with a checkpoint inhibitor there must be documented disease progression" / I2 unknown: "Previously treated, histologically-confirmed advanced solid malignancy with progressive disease requiring therapy" (Cutaneous melanoma is an included tumor; requires progression on checkpoint therapy, not yet known.)
  judge-b: **possibly** - I3 unknown: "Refractory or intolerant to standard therapy(ies)" / I6 unknown: "For participants who have received prior treatment with a checkpoint inhibitor there must be documented disease progression" / I14 met: "Cutaneous melanoma"
  Reviewer verdict: [ ]

- v072 NCT06246916 A Study With Combinations of Anti-LAG-3 and Anti-PD-1 Antibodies in Adult Participants With Advanced or Metast
  judge-a: **excluded** - I2 not_met: "Participants must not have received prior systemic therapy for unresectable or metastatic melanoma as described in the protocol." / E6 not_met: "Prior immune checkpoint inhibitor therapy other than anti-PD1/PD-L1 as described in the protocol" (First-line trial; he has already started ipilimumab plus nivolumab for metastatic disease.)
  judge-b: **excluded** - I2 not_met: "Participants must not have received prior systemic therapy for unresectable or metastatic melanoma as described in the protocol." / E6 not_met: "Prior immune checkpoint inhibitor therapy other than anti-PD1/PD-L1 as described in the protocol" (First-line trial; he is already on ipilimumab-nivolumab.)
  Reviewer verdict: [ ]

- v072 NCT06326411 A Study to Investigate the Safety and Efficacy of NST-628 Oral Tablets in Subjects With Solid Tumors
  judge-a: **possibly** - I3 unknown: "Subjects who have a histologically or cytologically documented metastatic or locally advanced solid tumor, for which standard of care (SoC) therapy does not exist, no longer provides benefit, or is not tolerated by the subject" / I4 met: "Part A: Subjects with any solid tumor with genetic alteration of or evidence of tumor dependence upon the RAS/MAPK pathway" (BRAF V600E is a RAS/MAPK alteration; he is still on first-line ipi/nivo with benefit not yet known.)
  judge-b: **possibly** - I4 unknown: "Select BRAF alterations" / I3 unknown: "for which standard of care (SoC) therapy does not exist, no longer provides benefit, or is not tolerated by the subject" / E7 met: "Part B: prior treatment with any MEK or BRAF inhibitor" (BRAF melanoma cohort; whether V600E counts as a 'select' alteration and SoC (ipi-nivo, BRAF/MEK) still available.)
  Reviewer verdict: [ ]

- v072 NCT06874335 A Phase 1 Study of BHV-1530 in Advanced Solid Tumors
  judge-a: **possibly** - I6 unknown: "Other advanced or metastatic solid tumors with a documented activating FGFR3 alteration (mutation or fusion)." / I4 unknown: "Participants must have progressed following, are intolerant of, or have no available standard-of-care therapy." (Melanoma qualifies only with an FGFR3 alteration (not reported) and after progression on standard therapy.)
  judge-b: **possibly** - I6 unknown: "Other advanced or metastatic solid tumors with a documented activating FGFR3 alteration (mutation or fusion)." / I4 unknown: "Participants must have progressed following, are intolerant of, or have no available standard-of-care therapy." (Melanoma qualifies only with an FGFR3 alteration (not tested); standard options remain.)
  Reviewer verdict: [ ]

- v073 NCT03567889 Efficacy of Daromun Neoadjuvant Intratumoral Treatment in Clinical Stage IIIB/C/D Melanoma Patients
  judge-a: **excluded** - E2 not_met: "Evidence of distant metastases at screening." / E12 not_met: "Active autoimmune disease." (Neoadjuvant stage III trial; she has distant (lung, brain) metastases and active immune colitis.)
  judge-b: **excluded** - E2 not_met: "Evidence of distant metastases at screening."
  Reviewer verdict: [ ]

- v073 NCT03860883 Melanoma Margins Trial-II: 1cm v 2cm Wide Surgical Excision Margins for AJCC Stage II Primary Cutaneous Melano
  judge-a: **excluded** - E12 not_met: "Physical, clinical, radiographic or pathologic evidence of satellite, in-transit, regional, or distant metastatic melanoma." / I2 not_met: "Patients must have a Stage II primary invasive cutaneous melanoma" (Surgical margins trial for stage II primary melanoma; she has metastatic disease.)
  judge-b: **excluded** - E12 not_met: "Physical, clinical, radiographic or pathologic evidence of satellite, in-transit, regional, or distant metastatic melanoma." (Surgical margins trial for stage II primary melanoma; she has distant metastases.)
  Reviewer verdict: [ ]

- v073 NCT04741997 Adjuvant Therapy Based on Pathologic Response After Neoadjuvant Encorafenib Binimetinib in Melanoma
  judge-a: **excluded** - I3 not_met: "Melanoma must have a BRAFV600 mutation (using a CLIA-validated assay)" (Requires BRAF V600 mutation; her melanoma is BRAF wild-type.)
  judge-b: **excluded** - I3 not_met: "Melanoma must have a BRAFV600 mutation" (BRAF-mutant only; her tumor is BRAF wild-type.)
  Reviewer verdict: [ ]

- v073 NCT04858256 Pacritinib in Relapsed/Refractory T-cell Lymphoproliferative Neoplasms
  judge-a: **not_relevant** - I4 not_met: "A histologically confirmed diagnosis, per the WHO 2016 classification, of any PTCL or CTCL subtype listed in the protocol." (T-cell lymphoma trial; she has melanoma.)
  judge-b: **not_relevant** - I4 not_met: "A histologically confirmed diagnosis, per the WHO 2016 classification, of any PTCL or CTCL subtype listed in the protocol."
  Reviewer verdict: [ ]

- v073 NCT05076760 MEM-288 Oncolytic Virus Alone and in Combination With Standard of Care Therapy in Advanced Solid Tumors
  judge-a: **possibly** - I9 met: "Progressed following therapy with at least one PD-1 or PD-L1 checkpoint inhibitor" / I12 unknown: "Tumor lesion which is deemed feasible for biopsy and injection under CT or ultrasound guidance" / E16 unknown: "Any unresolved grade 2 irAE (except adequately treated endocrine irAE)." / E9 unknown: "Active autoimmune disease requiring disease modifying therapy" (Melanoma monotherapy cohort after PD-1; injectable lesion and colitis grade/treatment status decide it.)
  judge-b: **possibly** - I9 met: "Progressed following therapy with at least one PD-1 or PD-L1 checkpoint inhibitor" / E9 unknown: "Active autoimmune disease requiring disease modifying therapy" / E16 unknown: "Any unresolved grade 2 irAE (except adequately treated endocrine irAE)." (Melanoma post-PD-1 fits Part 1A; ongoing immune colitis on budesonide may exclude; needs an injectable lesion.)
  Reviewer verdict: [ ]

- v073 NCT05382559 A Study of ASP3082 in Adults With Advanced Solid Tumors
  judge-a: **possibly** - I1 unknown: "Participant has locally advanced (unresectable) or metastatic solid tumor malignancy with documented Kirsten rat sarcoma viral oncogene homolog [KRAS] G12D mutation" / E2 met: "Participants with asymptomatic, treated CNS metastases are eligible." (Needs KRAS G12D; only BRAF wild-type is reported.)
  judge-b: **possibly** - I1 unknown: "metastatic solid tumor malignancy with documented Kirsten rat sarcoma viral oncogene homolog [KRAS] G12D mutation" (KRAS status not reported (only BRAF wild-type).)
  Reviewer verdict: [ ]

- v073 NCT05655312 MC1R-targeted Alpha-particle Monotherapy and Combination Therapy Trial With Nivolumab in Adults With Advanced 
  judge-a: **possibly** - I4 met: "Previously progressed (radiological progression) on at least one approved systemic therapy for advanced melanoma" / I5 unknown: "Uptake of [68Ga]VMT02 or [203Pb]VMT01 by PET or SPECT imaging observed in at least one melanoma tumor site" / E11 not_met: "Subjects with an active, known, or suspected autoimmune disease" (Monotherapy arm fits if MC1R imaging is positive; her active immune colitis rules out the nivolumab-combination arm only.)
  judge-b: **possibly** - I4 met: "Previously progressed (radiological progression) on at least one approved systemic therapy for advanced melanoma" / I5 unknown: "Uptake of [68Ga]VMT02 or [203Pb]VMT01 by PET or SPECT imaging observed in at least one melanoma tumor site" / E11 unknown: "Subjects with an active, known, or suspected autoimmune disease" (MC1R uptake to be screened; active colitis would bar the nivolumab combination arm but not monotherapy.)
  Reviewer verdict: [ ]

- v073 NCT06121180 Study of Cemiplimab Plus Ziv-Aflibercept for Subjects With Metastatic Uveal Melanoma
  judge-a: **excluded** - I6 met: "These patients must have previously received anti-PD1 immunotherapy (nivolumab or pembrolizumab) as monotherapy or in combination and later experienced disease progression." / E5 not_met: "Patients must not have autoimmune disorders or conditions of immunosuppression that require current ongoing treatment with systemic corticosteroids (or other systemic immunosuppressants), including oral steroids" (Cutaneous melanoma after PD-1 is allowed, but she is on ongoing oral budesonide for active immune colitis.)
  judge-b: **excluded** - E5 not_met: "Patients must not have autoimmune disorders or conditions of immunosuppression that require current ongoing treatment with systemic corticosteroids (or other systemic immunosuppressants), including oral steroids" / I6 met: "These patients must have previously received anti-PD1 immunotherapy (nivolumab or pembrolizumab) as monotherapy or in combination and later experienced disease progression." (Cutaneous melanoma post-PD-1 fits, but ongoing oral budesonide for active immune colitis is excluded.)
  Reviewer verdict: [ ]

- v073 NCT07196644 A Study to Assess Adverse Events and Change in Disease Activity in Participants 12 Years of Age or Older With 
  judge-a: **possibly** - I1 unknown: "Locally advanced/metastatic solid tumors with documented MET amplification" / I5 met: "If participant has central nervous system (CNS) metastasis, these should be clinically asymptomatic or radiologically stable" (MET amplification not reported.)
  judge-b: **possibly** - I1 unknown: "Locally advanced/metastatic solid tumors with documented MET amplification" (MET amplification status unknown.)
  Reviewer verdict: [ ]

- v073 NCT07436728 A Study of TAK-505 in Adults With Solid Tumors
  judge-a: **not_relevant** - I3 not_met: "Tumor histologies during dose escalation" (Limited to gastric, colorectal, NSCLC and head and neck cancers; melanoma is not included.)
  judge-b: **not_relevant** - I4 not_met: "Gastric adenocarcinoma." / I6 not_met: "Non-small cell lung cancer (NSCLC) (both squamous and non-squamous)." (Gastric, CRC, NSCLC, HNSCC only; melanoma not included.)
  Reviewer verdict: [ ]

- v074 NCT03567889 Efficacy of Daromun Neoadjuvant Intratumoral Treatment in Clinical Stage IIIB/C/D Melanoma Patients
  judge-a: **excluded** - E1 not_met: "Uveal melanoma or mucosal melanoma" / E2 not_met: "Evidence of distant metastases at screening." (Neoadjuvant stage III cutaneous melanoma trial.)
  judge-b: **excluded** - E1 not_met: "Uveal melanoma or mucosal melanoma" / E2 not_met: "Evidence of distant metastases at screening."
  Reviewer verdict: [ ]

- v074 NCT05136196 BiCaZO: A Study Combining Two Immunotherapies (Cabozantinib and Nivolumab) to Treat Patients With Advanced Mel
  judge-a: **excluded** - I2 not_met: "unresectable, recurrent, or metastatic non-uveal melanoma" (Non-uveal melanoma only.)
  judge-b: **excluded** - I2 not_met: "unresectable, recurrent, or metastatic non-uveal melanoma" / I5 not_met: "Participants must have had documented progression during or within 12 weeks after the last dose of PD-1 checkpoint inhibition-based therapy."
  Reviewer verdict: [ ]

- v074 NCT05267626 Study of AU-007, A Monoclonal Antibody That Binds to IL-2 and Inhibits IL-2Rα Binding, in Patients With Unrese
  judge-a: **possibly** - I2 met: "Patients must have measurable disease as per RECIST v1.1 criteria and documented by CT and/or MRI" / I3 unknown: "Part 2 includes but is not limited to:" (Named expansion cohorts are post-PD-1 cutaneous melanoma and NSCLC; dose-escalation eligibility for untreated uveal melanoma is not described.)
  judge-b: **possibly** - I2 met: "Patients must have measurable disease as per RECIST v1.1 criteria and documented by CT and/or MRI" / I4 not_met: "Cutaneous melanoma that is either locally unresectable or metastatic" (Melanoma expansion parts are cutaneous/post-doublet; dose-escalation eligibility for uveal not specified.)
  Reviewer verdict: [ ]

- v074 NCT05655312 MC1R-targeted Alpha-particle Monotherapy and Combination Therapy Trial With Nivolumab in Adults With Advanced 
  judge-a: **excluded** - I4 not_met: "Previously progressed (radiological progression) on at least one approved systemic therapy for advanced melanoma" / I5 unknown: "Uptake of [68Ga]VMT02 or [203Pb]VMT01 by PET or SPECT imaging observed in at least one melanoma tumor site" (Requires progression on a prior systemic therapy; she has had none for metastatic disease.)
  judge-b: **excluded** - I4 not_met: "Previously progressed (radiological progression) on at least one approved systemic therapy for advanced melanoma" (No systemic therapy yet for metastatic disease.)
  Reviewer verdict: [ ]

- v074 NCT05785754 DCSZ11 as a Monotherapy and in Combination in Patients With Advanced or Metastatic Solid Tumors
  judge-a: **possibly** - I10 not_met: "Histologically confirmed, metastatic or advanced, unresectable uveal melanoma that are eligible for treatment with tebentafusp monotherapy." / I4 unknown: "or for whom there is no effective standard therapy based on the Investi" (Uveal tebentafusp-combination cohort needs HLA-A*02:01 positivity; Phase 1a escalation possible only if no effective standard therapy is judged to exist.)
  judge-b: **possibly** - I10 not_met: "unresectable uveal melanoma that are eligible for treatment with tebentafusp monotherapy" / I4 unknown: "or for whom there is no effective standard therapy based on the Investigator's judgment" (HLA-A2 negative so the uveal/tebentafusp cohort does not fit; Phase 1a only if investigator deems no effective standard therapy.)
  Reviewer verdict: [ ]

- v074 NCT06150664 A Phase 1 of CTX-8371 in Patients With Advanced Malignancies
  judge-a: **excluded** - I3 not_met: "Uveal and mucosal melanoma are excluded" (Melanoma cohort excludes uveal melanoma and requires prior PD-1.)
  judge-b: **excluded** - I3 not_met: "Uveal and mucosal melanoma are excluded"
  Reviewer verdict: [ ]

- v074 NCT06172478 A Study of HER3-DXd in Subjects With Locally Advanced or Metastatic Solid Tumors
  judge-a: **excluded** - E4 not_met: "Has mucosal or uveal melanoma." (Melanoma cohort is cutaneous only; uveal melanoma excluded.)
  judge-b: **excluded** - E4 not_met: "Has mucosal or uveal melanoma."
  Reviewer verdict: [ ]

- v074 NCT06330064 A Study to Evaluate the Efficacy and Safety of Ifinatamab Deruxtecan (I-DXd) in Subjects With Recurrent or Met
  judge-a: **excluded** - I61 not_met: "Histologically or cytologically confirmed cutaneous (acral and non-acral) melanoma." / I6 not_met: "Documentation of radiological disease progression on or after the previous standard-of-care regimen." (Melanoma cohort is cutaneous only and needs prior progression; she has untreated uveal melanoma.)
  judge-b: **excluded** - I61 not_met: "Histologically or cytologically confirmed cutaneous (acral and non-acral) melanoma." / I6 not_met: "Documentation of radiological disease progression on or after the previous standard-of-care regimen." (Melanoma cohort is cutaneous only and requires prior ICI progression.)
  Reviewer verdict: [ ]

- v074 NCT06413680 A First-In Human (FIH) Study to Find Out How Well REGN10597 Medicine Given Alone or in Combination With Cemipl
  judge-a: **possibly** - I7 unknown: "Module 2, Cohort 1: 1L Melanoma" / I2 unknown: "with confirmed progression on standard-of-care therapy" (First-line melanoma expansion cohort may fit; whether uveal melanoma qualifies is protocol-defined.)
  judge-b: **possibly** - I7 unknown: "Module 2, Cohort 1: 1L Melanoma" / I2 not_met: "with confirmed progression on standard-of-care therapy" (Untreated, so escalation cohorts do not fit; 1L melanoma expansion may or may not include uveal primary.)
  Reviewer verdict: [ ]

- v074 NCT06489301 Mechanisms for Laser-Induced Rejuvenation
  judge-a: **not_relevant** - I3 not_met: "Planning to undergo abdominoplasty surgery" (Laser skin-rejuvenation mechanism study in abdominoplasty patients; not a cancer treatment study.)
  judge-b: **not_relevant** - I3 not_met: "Planning to undergo abdominoplasty surgery" (Laser skin rejuvenation mechanism study, not cancer treatment.)
  Reviewer verdict: [ ]

- v074 NCT06947928 Placebo-Controlled Trial of IFx-Hu2.0 Followed By Pembrolizumab In Checkpoint Inhibitor Naïve Participants Wit
  judge-a: **not_relevant** - I4 not_met: "have histologically confirmed Merkel cell carcinoma" (Merkel cell carcinoma trial.)
  judge-b: **not_relevant** - I4 not_met: "have histologically confirmed Merkel cell carcinoma"
  Reviewer verdict: [ ]

- v074 NCT07115043 A Study to Investigate Safety of AZD6750 in Adult Participants With Select Advanced or Metastatic Solid Tumors
  judge-a: **excluded** - I11 not_met: "Participants with locally advanced or metastatic select solid tumors (MM, Squamous cell carcinoma of skin, MCC, NSCLC, Head and neck squamous cell carcinoma, Gastric cancer/gastroesophaegeal junction cancer, RCC, HGSOC, Triple negative breast cancer) who have received adequate SoC" (Module 1 requires prior standard-of-care therapy; she has had no systemic treatment for metastatic disease.)
  judge-b: **excluded** - I11 not_met: "who have received adequate SoC" (No systemic therapy yet for metastatic uveal melanoma.)
  Reviewer verdict: [ ]

- v074 NCT07287917 Study of AMXT 1501 and DFMO in Combination With Standard Therapies in Advanced Solid Tumors
  judge-a: **excluded** - I6 not_met: "c.For melanoma patients: patients with unresectable metastatic cutaneous melanoma that progressed on any prior immune checkpoint inhibitor" (Melanoma cohort is cutaneous and post-ICI; she has untreated uveal melanoma.)
  judge-b: **excluded** - I6 not_met: "patients with unresectable metastatic cutaneous melanoma that progressed on any prior immune checkpoint inhibitor"
  Reviewer verdict: [ ]

- v075 NCT05100095 Hypofractionated Radiation Therapy for Merkel Cell Carcinoma
  judge-a: **not_relevant** - I1 not_met: "Patients must have histologically or cytologically confirmed MCC." (Merkel cell carcinoma trial; she has melanoma.)
  judge-b: **not_relevant** - I1 not_met: "Patients must have histologically or cytologically confirmed MCC."
  Reviewer verdict: [ ]

- v075 NCT05498792 Study of CBL0137 in Combination With Ipilimumab and Nivolumab Therapy in Melanoma
  judge-a: **excluded** - E3 not_met: "Prior treatment with CTLA-4 or PD1/PD-L1 pathway targeted systemic treatment" / I4 not_met: "ECOG performance status 0 or 1" (ICI-naive trial; she had pembrolizumab and ECOG 2.)
  judge-b: **excluded** - I4 not_met: "ECOG performance status 0 or 1"
  Reviewer verdict: [ ]

- v075 NCT05549297 Tebentafusp Regimen Versus Investigator's Choice in Previously Treated Advanced Melanoma (TEBE-AM)
  judge-a: **excluded** - E15 not_met: "have not received prior treatment with an approved anti-CTLA-4 mAb" / I5 not_met: "Eastern Cooperative Oncology Group (ECOG) performance status score of 0 or 1" / I1 unknown: "HLA-A*02:01-positive" (Non-ocular melanoma after anti-PD-1 fits, but she has had no anti-CTLA-4 and is ECOG 2.)
  judge-b: **excluded** - I5 not_met: "Eastern Cooperative Oncology Group (ECOG) performance status score of 0 or 1" / E15 not_met: "have not received prior treatment with an approved anti-CTLA-4 mAb" / I1 unknown: "HLA-A*02:01-positive" (ECOG 2 and no prior anti-CTLA-4; HLA type unknown.)
  Reviewer verdict: [ ]

- v075 NCT05588453 Natural Killer Cell Therapy (UD TGFbetai NK Cells) and Temozolomide for the Treatment of Stage IV Melanoma Met
  judge-a: **excluded** - I1 not_met: "Histologically confirmed melanoma with stage IV disease" / I2 not_met: "Radiologically confirmed brain metastasis" (Requires stage IV melanoma with brain metastases; her recurrence is regional neck nodes only.)
  judge-b: **excluded** - I2 not_met: "Radiologically confirmed brain metastasis (n >= 1)"
  Reviewer verdict: [ ]

- v075 NCT06887205 Immediate Lymphatic Reconstruction After Lymphadenectomy in Melanoma Patients: a Parallel Cohort Pilot Study
  judge-a: **not_relevant** - I4 not_met: "Participants with a diagnosis of Melanoma undergoing ALND or ILND." (Surgical lymphatic-reconstruction study for axillary or inguinal dissection; not a treatment study for her neck recurrence.)
  judge-b: **not_relevant** - I4 not_met: "Participants with a diagnosis of Melanoma undergoing ALND or ILND." (Surgical lymphatic reconstruction study; patient is not having axillary/inguinal dissection.)
  Reviewer verdict: [ ]

- v075 NCT06961357 Clinical Trial of CD40L-augmented TIL for Patients With Advanced Melanoma
  judge-a: **excluded** - I5 not_met: "ECOG performance status of 0 or 1." / I1 met: "Mucosal melanoma" (TIL trial includes mucosal melanoma, but ECOG 2 fails ECOG 0-1.)
  judge-b: **excluded** - I5 not_met: "ECOG performance status of 0 or 1." / I1 met: "Mucosal melanoma" (Mucosal melanoma after PD-1 failure fits TIL cohort, but ECOG 2.)
  Reviewer verdict: [ ]

- v075 NCT07040280 Sulforaphane for the Prevention of Melanoma in Patients With Multiple Atypical Nevi and a Prior History of Mel
  judge-a: **not_relevant** - I3 not_met: "Patient must have a prior diagnosis of early-stage melanoma, defined as either melanoma in situ, localized resected stage I-II node negative melanoma, or resected node negative stage III melanoma" (Melanoma prevention in survivors with atypical nevi; she has active recurrent disease.)
  judge-b: **not_relevant** - I3 not_met: "Patient must have a prior diagnosis of early-stage melanoma" (Melanoma prevention in people with atypical nevi.)
  Reviewer verdict: [ ]

- v075 NCT07288073 TIL Therapy in cSCC and MCC
  judge-a: **not_relevant** - I3 not_met: "Patients must have histologically or pathologically confirmed diagnosis of CSCC or MCC." (TIL trial for cutaneous SCC and Merkel cell carcinoma; she has melanoma.)
  judge-b: **not_relevant** - I3 not_met: "Patients must have histologically or pathologically confirmed diagnosis of CSCC or MCC."
  Reviewer verdict: [ ]

- v077 NCT04370587 A Clinical Study of Intratumoral MVR-T3011 (T3011) Given as a Single Agent and in Combination With Intravenous
  judge-a: **excluded** - I3 not_met: "Histologically or pathologically confirmed locally recurrent or metastatic advanced malignancy." / I9 not_met: "Measurable disease per RECIST version 1.1." (Intratumoral oncolytic virus for advanced tumors; he has no measurable or injectable disease.)
  Reviewer verdict: [ ]

- v077 NCT05592626 A Study of a Selective T Cell Receptor (TCR) Targeting, Bifunctional Antibody-fusion Molecule STAR0602 in Part
  judge-a: **excluded** - I1 not_met: "Participants must have histologically confirmed solid tumors that are unresectable, locally advanced, or metastatic" / I3 unknown: "Virally associated tumors" (Advanced solid tumor trial; his Merkel cell carcinoma is resected with no evidence of disease.)
  Reviewer verdict: [ ]

- v077 NCT06112314 IMC-F106C Regimen Versus Nivolumab Regimens in Previously Untreated Advanced Melanoma (PRISM-MEL-301)
  judge-a: **not_relevant** - I2 not_met: "Participants must have histologically confirmed Stage IV or unresectable Stage III melanoma" (Melanoma trial; he has Merkel cell carcinoma.)
  Reviewer verdict: [ ]

- v077 NCT06171750 Phase I Study of Tolododekin Alfa (ANK-101) in Advanced Solid Tumors
  judge-a: **excluded** - I2 not_met: "histologically or cytologically confirmed diagnosis of cutaneous, subcutaneous, soft tissue, or nodal advanced solid tumor malignancy" / I3 not_met: "measurable disease per RECIST v1.1" (Intratumoral IL-12 for advanced cutaneous or nodal tumors; he has no measurable disease.)
  Reviewer verdict: [ ]

- v077 NCT06624644 A Trial of LNS8801 With or Without Pembrolizumab in Patients With Refractory Melanoma
  judge-a: **not_relevant** - I1 not_met: "Confirmed unresectable and/or metastatic cutaneous melanoma." (Melanoma trial; he has Merkel cell carcinoma.)
  Reviewer verdict: [ ]

- v079 NCT02870244 Adoptive T Cell Immunotherapy for Advanced Melanoma Using Engineered Lymphocytes
  judge-a: **excluded** - I4 not_met: "Patients must have a performance status (PS) of 0 or 1 ECOG PS scale." / E3 not_met: "Patients with a history metastatic melanoma involving the brain will be excluded if they have active disease" (ECOG 3-4 and active brain disease.)
  Reviewer verdict: [ ]

- v079 NCT04913285 A Study to Evaluate KIN-2787 in Participants With BRAF and/or NRAS Mutation Positive Solid Tumors
  judge-a: **excluded** - I5 not_met: "ECOG performance status 0-1" (ECOG 3-4.)
  Reviewer verdict: [ ]

- v079 NCT05549297 Tebentafusp Regimen Versus Investigator's Choice in Previously Treated Advanced Melanoma (TEBE-AM)
  judge-a: **excluded** - I5 not_met: "Eastern Cooperative Oncology Group (ECOG) performance status score of 0 or 1" / E5 unknown: "known untreated or symptomatic central nervous system (CNS) metastases" (ECOG 3-4.)
  Reviewer verdict: [ ]

- v079 NCT06413680 A First-In Human (FIH) Study to Find Out How Well REGN10597 Medicine Given Alone or in Combination With Cemipl
  judge-a: **eligible** - I5 met: "Module 1, Cohort 1: anti-PD-(L)1 Progressed Melanoma" / I2 met: "with confirmed progression on standard-of-care therapy" / E2 met: "Prior treatment with anti-PD1/PD-L1, or an approved systemic therapy or any previous systemic non-immunomodulatory biologic therapy within 4 weeks" (Anti-PD-1-progressed melanoma cohort; listed criteria set no ECOG or brain-metastasis limit.)
  Reviewer verdict: [ ]

- v079 NCT06743126 SUPRAME-ACTengine® IMA203 vs. Investigator's Choice of Treatment in Previously Treated, Unresectable or Metast
  judge-a: **excluded** - I4 not_met: "Eastern Cooperative Oncology Group (ECOG) performance status 0-1" (ECOG 3-4.)
  Reviewer verdict: [ ]

- v079 NCT07015190 Neoadjuvant Darovasertib in Primary Uveal Melanoma
  judge-a: **excluded** - I1 not_met: "Primary non-metastatic uveal melanoma" / I3 not_met: "ECOG 0 or 1" (Neoadjuvant uveal melanoma trial; she has metastatic cutaneous melanoma (subtype rule).)
  Reviewer verdict: [ ]

- v079 NCT07042295 Treatment With Amivantamab and Hyaluronidase or Cetuximab for Advanced Skin Cancer in People With a Weakened I
  judge-a: **not_relevant** - I1 not_met: "Participants must have pathologically proven diagnosis of cutaneous squamous cell carcinoma" (Cutaneous SCC trial; she has melanoma.)
  Reviewer verdict: [ ]

- v080 NCT03816345 Testing an Immunotherapy Anti-cancer Drug, Nivolumab, for Advanced Cancers in Patients With Autoimmune Disorde
  judge-a: **not_relevant** - I20 not_met: "Patients with more than one autoimmune disease are eligible." (Study population is cancer patients with autoimmune disorders; he has none.)
  judge-b: **not_relevant** - I20 not_met: "Patients with more than one autoimmune disease are eligible." (Trial for cancer patients with autoimmune disorders; patient has none.)
  Reviewer verdict: [ ]

- v080 NCT06782932 Comparing Neoadjuvant/Adjuvant GVAX vs a mKRASvax Given With Anti-PD-1 and Anti-CD137 for Surgically Resectabl
  judge-a: **excluded** - I2 not_met: "Tumor must be deemed resectable by the study team" / E1 not_met: "Received any anti-pancreatic cancer therapy" (Resectable, treatment-naive PDAC trial; he is metastatic on FOLFIRINOX.)
  judge-b: **excluded** - I2 not_met: "Tumor must be deemed resectable by the study team" / E1 not_met: "Received any anti-pancreatic cancer therapy"
  Reviewer verdict: [ ]

- v080 NCT06937177 Safely Optimizing Body Weight With Mifomelatide (TCMCB07) in Patients With Newly Diagnosed Colorectal Cancer (
  judge-a: **excluded** - I6 not_met: "Determined by the Investigator to be ready to receive their second dose of chemotherapy." / I18 unknown: "Cachexia defined by Fearon Criteria of weight loss" (Weight-loss study at the start of chemotherapy; he is eight cycles in.)
  judge-b: **excluded** - I6 not_met: "Determined by the Investigator to be ready to receive their second dose of chemotherapy." / I18 unknown: "Cachexia defined by Fearon Criteria of weight loss" (For patients just starting chemotherapy; already 8 cycles in.)
  Reviewer verdict: [ ]

- v080 NCT07259317 Relacorilant With Nab-Paclitaxel and Gemcitabine in Patients With Metastatic Pancreatic Adenocarcinoma
  judge-a: **excluded** - I10 not_met: "Received no prior systemic anticancer chemotherapy to treat metastatic PDAC." / I3 not_met: "Initial diagnosis of metastatic disease occurred ≤9 weeks prior to enrollment in the study" (First-line trial; he is on FOLFIRINOX since April.)
  judge-b: **excluded** - I10 not_met: "Received no prior systemic anticancer chemotherapy to treat metastatic PDAC."
  Reviewer verdict: [ ]

- v080 NCT07349537 Study of RMC-5127 in Patients With Advanced KRAS G12V-Mutant Solid Tumors
  judge-a: **excluded** - I3 not_met: "Pathologically documented, locally advanced or metastatic KRAS G12V-mutated solid tumor malignancy." (KRAS G12V trial; his tumor is KRAS G12D.)
  judge-b: **excluded** - I3 not_met: "Pathologically documented, locally advanced or metastatic KRAS G12V-mutated solid tumor malignancy." (Tumor is KRAS G12D.)
  Reviewer verdict: [ ]

- v080 NCT07562152 Atebimetinib + GnP as a First Line Treatment in Patients With Metastatic Pancreatic Adenocarcinoma
  judge-a: **excluded** - I6 not_met: "First-line PDAC participants will have received no previous systemic anti-cancer therapy" (Treatment-naive first-line trial; he is on FOLFIRINOX.)
  judge-b: **excluded** - I6 not_met: "First-line PDAC participants will have received no previous systemic anti-cancer therapy"
  Reviewer verdict: [ ]

- v080 NCT07638371 FORTRAS: A Study of MSK-TCR5 in People With Solid Tumor Cancers
  judge-a: **possibly** - I4 unknown: "Positive for RAS G12D mutation and HLA-A*11:01 allele" / I5 met: "Subjects with stable disease (SD), or that present lack of clinical benefit from previous therapy (including treatment suspension due to toxicity) may be considered eligible for enrollment." / I8 met: "ECOG performance status of 0 or 1" (KRAS G12D fits; HLA-A*11:01 status not reported. Stable disease after 1 line is allowed.)
  judge-b: **possibly** - I4 unknown: "Positive for RAS G12D mutation and HLA-A*11:01 allele" / I5 met: "Subjects with stable disease (SD), or that present lack of clinical benefit from previous therapy (including treatment suspension due to toxicity) may be considered eligible for enrollment." (KRAS G12D present; HLA-A*11:01 status unknown.)
  Reviewer verdict: [ ]

- v081 NCT03855800 Molecular Detection of Advanced Neoplasia in Pancreatic Cysts
  judge-a: **not_relevant** - I2 not_met: "Patients with suspected cystic neoplasm of the pancreas" / E3 not_met: "Imaging showing possible pancreatic cancer" (Pancreatic cyst diagnostic study; she has PDAC.)
  judge-b: **not_relevant** - I2 not_met: "Patients with suspected cystic neoplasm of the pancreas" / E3 not_met: "Imaging showing possible pancreatic cancer"
  Reviewer verdict: [ ]

- v081 NCT06051695 A Study to Evaluate the Safety and Efficacy of Mesothelin-Targeting Logic-gated CAR T, in Participants With So
  judge-a: **excluded** - E1 not_met: "able to receive standard of care therapy that is therapeutic and not palliative" / I3 not_met: "Received previous required therapy for the appropriate solid tumor disease" (Untreated, potentially curable disease with standard neoadjuvant therapy planned.)
  judge-b: **excluded** - I3 not_met: "Received previous required therapy for the appropriate solid tumor disease as described in the protocol" / E1 not_met: "able to receive standard of care therapy that is therapeutic and not palliative"
  Reviewer verdict: [ ]

- v081 NCT06881992 A Phase 3 Study of Ersodetug in Patients With Tumor Hyperinsulinism
  judge-a: **not_relevant** - I3 not_met: "Clinical diagnosis of neuroendocrine tumor (NET) (ICT or NICT) with biochemical evidence of tumor hyperinsulinism" (Tumor hyperinsulinism / NET; she has PDAC.)
  judge-b: **not_relevant** - I3 not_met: "Clinical diagnosis of neuroendocrine tumor (NET) (ICT or NICT) with biochemical evidence of tumor hyperinsulinism"
  Reviewer verdict: [ ]

- v081 NCT06943755 Zanzalintinib Versus Everolimus in Participants With Locally Advanced or Metastatic Neuroendocrine Tumors
  judge-a: **not_relevant** - I1 not_met: "well-differentiated Grade 1, 2, or 3 NETs of pancreatic origin or extra-pancreatic origin" (Neuroendocrine tumor trial; she has PDAC.)
  judge-b: **not_relevant** - I1 not_met: "well-differentiated Grade 1, 2, or 3 NETs of pancreatic origin or extra-pancreatic origin"
  Reviewer verdict: [ ]

- v081 NCT06989437 A Study to Learn About the Medicine Ponsegromab in Adults With Cancer of the Pancreas Which Has Spread and Cau
  judge-a: **excluded** - I2 not_met: "Documented active diagnosis of metastatic pancreatic ductal adenocarcinoma" / I3 unknown: "Cachexia defined by Fearon criteria of weight loss" (Metastatic PDAC cachexia trial; her disease is non-metastatic.)
  judge-b: **excluded** - I2 not_met: "Documented active diagnosis of metastatic pancreatic ductal adenocarcinoma" / I3 unknown: "Cachexia defined by Fearon criteria of weight loss"
  Reviewer verdict: [ ]

- v081 NCT07277413 A Study of IDE892 as Monotherapy and Combination in MTAP-deleted Advanced Solid Tumors
  judge-a: **excluded** - E28 not_met: "Must have progressed following at least 1 prior line of therapy" / I5 unknown: "Have evidence of homozygous loss of MTAP or MTAP deletion" (Mis-sectioned pancreatic requirement of 1 prior line with progression; she is untreated. MTAP unknown.)
  judge-b: **excluded** - E28 not_met: "Must have progressed following at least 1 prior line of therapy"
  Reviewer verdict: [ ]

- v081 NCT07324096 A Screening Program to Improve the Early Detection of Sporadic Pancreatic Cancer in Individuals With a High-Ri
  judge-a: **not_relevant** - E1 not_met: "Prior diagnosis of pancreatic ductal adenocarcinoma (PDA)" (Early-detection screening for people without PDAC.)
  judge-b: **not_relevant** - E1 not_met: "Prior diagnosis of pancreatic ductal adenocarcinoma (PDA)" (Early-detection screening in new-onset diabetes for people without known cancer.)
  Reviewer verdict: [ ]

- v081 NCT07522073 A Study to Evaluate Chemotherapy With or Without INCB161734 in Previously Untreated, KRAS G12D-Mutated Metasta
  judge-a: **excluded** - I1 not_met: "Histologically or cytologically confirmed metastatic PDAC with a KRAS G12D mutation" (Metastatic KRAS G12D trial; her disease is borderline resectable and KRAS untested.)
  judge-b: **excluded** - I1 not_met: "Histologically or cytologically confirmed metastatic PDAC with a KRAS G12D mutation"
  Reviewer verdict: [ ]

- v082 NCT04429542 Study of Safety and Tolerability of BCA101 Monotherapy and in Combination Therapy in Patients With EGFR-driven
  judge-a: **not_relevant** - I6 not_met: "Single agent BCA101 - patients with the following tumor type will be eligible:" (EGFR-driven squamous/CRC cohorts; pNET not among the tumor types.)
  Reviewer verdict: [ ]

- v082 NCT04858334 APOLLO: A Randomized Phase II Double-Blind Study of Olaparib Versus Placebo Following Curative Intent Therapy 
  judge-a: **not_relevant** - I5 not_met: "Patients with neuroendocrine tumors are excluded from enrolling" (Resected exocrine pancreatic cancer trial; neuroendocrine tumors excluded.)
  Reviewer verdict: [ ]

- v082 NCT04924075 Belzutifan/MK-6482 for the Treatment of Advanced Pheochromocytoma/Paraganglioma (PPGL), Pancreatic Neuroendocr
  judge-a: **eligible** - I3 met: "pancreatic neuroendocrine tumors (pNET)" / I12 unknown: "Received prior treatment (except somatostatin analogs) with chemotherapy, targeted therapy, biologics, or other investigational therapy within the past 4 weeks" (Advanced pNET cohort; everolimus washout is standard and does not downgrade.)
  Reviewer verdict: [ ]

- v082 NCT05254171 Study of Nab-Paclitaxel and Gemcitabine With or Without SBP-101 in Pancreatic Cancer
  judge-a: **not_relevant** - E6 not_met: "Presence of islet-cell or pancreatic neuroendocrine tumor" (Metastatic PDAC trial; pNET excluded.)
  Reviewer verdict: [ ]

- v082 NCT05372614 Testing the Safety and Tolerability of the Anti-cancer Drugs Trastuzumab Deruxtecan and Neratinib for Cancers 
  judge-a: **possibly** - I3 unknown: "Patients must have a solid tumor with HER2-positivity as determined by any one or more of the following:" / I5 met: "Patients must have received at least 1 prior line of therapy in the advanced/metastatic setting." / I7 met: "Patients must have Eastern Cooperative Oncology Group (ECOG) performance status =< 1" (Part 1 accepts any HER2-positive solid tumor; HER2 IHC/amplification not reported (no actionable mutations found).)
  Reviewer verdict: [ ]

- v082 NCT06943755 Zanzalintinib Versus Everolimus in Participants With Locally Advanced or Metastatic Neuroendocrine Tumors
  judge-a: **excluded** - E2 not_met: "Prior treatment with a vascular endothelial growth factor receptor (VEGFR) -targeting tyrosine kinase inhibitor or a mammalian target of rapamycin (mTOR) inhibitor." / I1 met: "well-differentiated Grade 1, 2, or 3 NETs of pancreatic origin" (Right disease, but she has had everolimus (mTOR inhibitor), which is excluded.)
  Reviewer verdict: [ ]

- v082 NCT06958328 Testing Higher Dose Radiation Therapy for Locally Advanced Pancreatic Cancer
  judge-a: **not_relevant** - I4 not_met: "Pathologically (histologically or cytologically) proven diagnosis of pancreatic ductal adenocarcinoma" (Locally advanced PDAC radiation trial; she has a metastatic pNET.)
  Reviewer verdict: [ ]

- v082 NCT07087054 Carcinoid Syndrome Efficacy Study Featuring an Oral Daily Paltusotine Regimen
  judge-a: **excluded** - I3 not_met: "Documented carcinoid syndrome requiring medical therapy." / I6 not_met: "No significant disease progression as assessed by the Investigator within the last 6 months before randomization." (Non-functional pNET (no carcinoid syndrome) with recent progression.)
  Reviewer verdict: [ ]

- v082 NCT07619313 AB801 in Combination With Chemotherapy and Immunotherapy for the Treatment of Patients With Borderline Resecta
  judge-a: **not_relevant** - I2 not_met: "of cholangiocarcinoma or pancreatic adenocarcinoma" (Untreated cholangiocarcinoma/PDAC trial; she has a treated pNET.)
  Reviewer verdict: [ ]

- v083 NCT06639724 Perioperative Fostamatinib With Gemcitabine and Nab-paclitaxel in Resectable Pancreatic Cancer
  judge-a: **excluded** - I5 not_met: "Patient must have resectable primary PDAC" (Perioperative trial for an unresected primary; his tumor was already removed.)
  Reviewer verdict: [ ]

- v083 NCT07049055 A Clinical Trial to Evaluate EDV Nanocell Therapy With Gemcitabine and Nab-paclitaxel in Pancreatic Cancer
  judge-a: **excluded** - I1 not_met: "Histological or pathological confirmation of metastatic pancreas adenocarcinoma." / I7 not_met: "Documented disease progression with first line FOLFIRINOX or NALIRIFOX therapy" (Second-line metastatic trial; he is on adjuvant therapy with no disease.)
  Reviewer verdict: [ ]

- v083 NCT07127874 A Study of PHN-012 in Patients With Advanced Solid Tumors
  judge-a: **excluded** - I1 not_met: "Has histologically confirmed, advanced/metastatic:" / I4 not_met: "Has measurable disease." (Advanced measurable disease after progression required; he is resected and NED on adjuvant chemo.)
  Reviewer verdict: [ ]

- v083 NCT07259317 Relacorilant With Nab-Paclitaxel and Gemcitabine in Patients With Metastatic Pancreatic Adenocarcinoma
  judge-a: **excluded** - I5 not_met: "Radiographic confirmation of metastatic disease with at least 1 distant tumor metastasis measurable on radiology imaging per RECIST version 1.1 criteria" (Metastatic measurable disease required; he is NED.)
  Reviewer verdict: [ ]

- v083 NCT07817147 CREO - Microwave Ablation Feasibility Study
  judge-a: **excluded** - I3 not_met: "Histologically confirmed locally advanced, unresectable or metastatic cancer (Stage III or IV)" / I5 not_met: "The tumor(s) must be ≥1 cm in diameter" (Ablation of a visible stage III/IV tumor; he is resected stage IIB with no evidence of disease.)
  Reviewer verdict: [ ]

- v084 NCT03484299 Chemotherapy and Irreversible Electroporation in the Treatment of Advanced Pancreatic Adenocarcinoma
  judge-a: **excluded** - I2 not_met: "diagnosed with stage III pancreatic cancer" (Stage III only; she has stage IV metastatic disease.)
  Reviewer verdict: [ ]

- v084 NCT05720117 A Study of PYX-201 in Advanced Solid Tumors
  judge-a: **excluded** - I4 not_met: "Eastern Cooperative Oncology Group (ECOG) Performance Status (PS) of 0 to 1." (ECOG 2 fails ECOG 0-1.)
  Reviewer verdict: [ ]

- v084 NCT06311214 Personalized Antibody-Drug Conjugate Therapy Based on RNA and Protein Testing for the Treatment of Advanced or
  judge-a: **possibly** - I9 met: "Eastern Cooperative Oncology Group performance status of 0-2" / I28 met: "Patients should have received no more than 3 prior lines of chemotherapy in the advanced/metastatic setting." / I12 unknown: "Total bilirubin ≤ 1.5 institutional upper limit of normal (ULN)." / I34 unknown: "Patient must have high Trop-2 protein expression (IHC 2+ or 3+)" (ADC MATCH: ECOG 2 allowed, 2 chemo lines; ADC target expression and current bilirubin unknown.)
  Reviewer verdict: [ ]

- v084 NCT06898450 A Study to Assess the Safety, Tolerability, and Efficacy of NDI-219216 in Patients With Advanced Solid Tumors.
  judge-a: **excluded** - I1 not_met: "Eastern Cooperative Oncology Group (ECOG) performance status score of 0 or 1" / I2 met: "Have unresectable and/or metastatic solid tumors (with or without MSI-H/dMMR) refractory to or intolerant to previous SoC therapy" (MSI-H fits, but ECOG 2 fails ECOG 0-1.)
  Reviewer verdict: [ ]

- v084 NCT06958328 Testing Higher Dose Radiation Therapy for Locally Advanced Pancreatic Cancer
  judge-a: **excluded** - I5 not_met: "Locally advanced unresectable disease (as defined per the National Comprehensive Cancer Network [NCCN] guidelines and institutional tumor board review)" (RT dose escalation for locally advanced PDAC; she has liver and peritoneal metastases.)
  Reviewer verdict: [ ]

- v084 NCT07129252 A Study to Investigate Safety and Effectiveness of CRN09682 in Participants With SST2-Expressing NENs and Othe
  judge-a: **possibly** - I1 met: "Have a histological diagnosis of metastatic or locally advanced inoperable NET, NEC, or other solid tumors that have confirmed radiological progression." / I3 unknown: "Have a tumor that expresses SSR confirmed by SSR imaging." / I4 met: "Have an ECOG performance status of 0, 1, or 2." (Other solid tumors allowed if SST2-expressing on SSR imaging, which she has not had.)
  Reviewer verdict: [ ]

- v086 NCT03190941 Administering Peripheral Blood Lymphocytes Transduced With a Murine T-Cell Receptor Recognizing the G12V Varia
  judge-a: **possibly** - I2 unknown: "unresectable malignancy expressing G12V mutated KRAS" / I3 unknown: "Patients must be HLA-A*11:01 positive" / I6 unknown: "previously received standard systemic therapy for their advanced cancer and have been either non-responders or have recurred" (KRAS variant and HLA type unknown; stable disease after FOLFIRINOX may or may not count as non-response.)
  judge-b: **possibly** - I2 unknown: "malignancy expressing G12V mutated KRAS" / I3 unknown: "Patients must be HLA-A*11:01 positive as confirmed by the NIH Department of Transfusion Medicine." / I10 met: "Age greater than or equal to 18 years and less than or equal to 72 years." (KRAS variant and HLA type not stated.)
  Reviewer verdict: [ ]

- v086 NCT05379985 Study of RMC-6236 in Patients With Advanced Solid Tumors Harboring Specific Mutations in RAS
  judge-a: **eligible** - I1 met: "RAS mutations (dose optimization/expansion) identified through deoxyribonucleic acid (DNA) sequencing" / I2 met: "Treatment naive or have received prior standard therapy appropriate for tumor type and stage" / I3 met: "Have Eastern Cooperative Oncology Group (ECOG) performance status of 0 or 1" (Advanced KRAS-mutant PDAC after standard therapy, ECOG 0-1; no progression requirement.)
  judge-b: **eligible** - I1 met: "or RAS mutations (dose optimization/expansion) identified through deoxyribonucleic acid (DNA) sequencing" / I2 met: "Treatment naive or have received prior standard therapy appropriate for tumor type and stage" / I3 met: "Have Eastern Cooperative Oncology Group (ECOG) performance status of 0 or 1"
  Reviewer verdict: [ ]

- v086 NCT06479239 Study of EGFRBi Armed Fresh PBMC in Metastatic or Unresectable Pancreatic Cancer
  judge-a: **eligible** - I1 met: "Histologically confirmed locally advanced pancreatic cancer (LAPC)/unresectable pancreatic cancer (UPC) or metastatic pancreatic cancer (MPC) not eligible for curative intent therapy" / I2 met: "Received at least 1 line of chemotherapy and have stable disease (SD) or better for 3 months prior to enrollment." / I3 met: "Measurable disease by immune-related Response Evaluation Criteria in Solid Tumors (irRECIST)" / I4 met: "Eastern Cooperative Oncology Group (ECOG) Performance Status 0-1" (Maintenance-type trial for unresectable PDAC stable after first-line FOLFIRINOX; fits.)
  judge-b: **eligible** - I1 met: "Histologically confirmed locally advanced pancreatic cancer (LAPC)/unresectable pancreatic cancer (UPC)" / I2 met: "Received at least 1 line of chemotherapy and have stable disease (SD) or better for 3 months prior to enrollment." / I4 met: "Eastern Cooperative Oncology Group (ECOG) Performance Status 0-1" (Maintenance-type trial for stable LAPC after FOLFIRINOX and capecitabine chemoradiation.)
  Reviewer verdict: [ ]

- v086 NCT06937177 Safely Optimizing Body Weight With Mifomelatide (TCMCB07) in Patients With Newly Diagnosed Colorectal Cancer (
  judge-a: **excluded** - I7 not_met: "Patients must be initiating treatment with one of the following chemotherapy regimens:" / I6 not_met: "Determined by the Investigator to be ready to receive their second dose of chemotherapy." (For newly diagnosed patients starting chemo; she has completed FOLFIRINOX and chemoradiation.)
  judge-b: **excluded** - I6 not_met: "Determined by the Investigator to be ready to receive their second dose of chemotherapy." (Already completed first-line chemotherapy and chemoradiation.)
  Reviewer verdict: [ ]

- v086 NCT06958328 Testing Higher Dose Radiation Therapy for Locally Advanced Pancreatic Cancer
  judge-a: **excluded** - I1 met: "At time of enrollment, the patient must have received 4-8 months of active chemotherapy with FOLFIRINOX or NALIRIFOX or gemcitabine/nab-paclitaxel." / I5 met: "Locally advanced unresectable disease" / I14 not_met: "Has the patient had prior radiotherapy to the region of the study cancer that would result in overlap of radiation therapy fields" (Fits LAPC after FOLFIRINOX, but she already had chemoradiation to the pancreas (overlapping field).)
  judge-b: **excluded** - I14 not_met: "Has the patient had prior radiotherapy to the region of the study cancer that would result in overlap of radiation therapy fields" (Already received chemoradiation to the pancreatic tumor.)
  Reviewer verdict: [ ]

- v086 NCT06998940 Studying Chemotherapy With or Without Panitumumab for Unresectable, Locally Advanced, or Metastatic Pancreatic
  judge-a: **excluded** - I2 not_met: "Participants must have previously documented KRAS wild type (i.e. absence of any KRAS mutation)" (KRAS wild-type required; her tumor is KRAS-mutant.)
  judge-b: **excluded** - I2 not_met: "Participants must have previously documented KRAS wild type (i.e. absence of any KRAS mutation)"
  Reviewer verdict: [ ]

- v087 NCT04858334 APOLLO: A Randomized Phase II Double-Blind Study of Olaparib Versus Placebo Following Curative Intent Therapy 
  judge-a: **excluded** - I4 not_met: "must have no evidence of recurrent disease as determined by the investigator" / I8 not_met: "Patient must have a known pathogenic or likely pathogenic germline or somatic mutation in BRCA1, BRCA2, or PALB2" / I3 not_met: "Patient must have an Eastern Cooperative Oncology Group (ECOG) performance status of 0-2" (Adjuvant trial for resected NED disease with BRCA/PALB2; his cancer recurred in lungs and liver, BRCA negative, ECOG 3-4.)
  Reviewer verdict: [ ]

- v088 NCT04300556 A Study to Evaluate the Safety, Tolerability, and Efficacy of MORAb-202 (Herein Referred to as Farletuzumab Ec
  judge-a: **excluded** - I4 not_met: "platinum-resistant disease (defined as progression within 6 months after the last dose of at least 4 cycles of the last platinum containing chemotherapy regimen)" / I10 not_met: "Radiological disease progression on or after the most recent therapy by investigator assessment." (Ovarian arm is platinum-resistant only; she is platinum-sensitive and responding.)
  Reviewer verdict: [ ]

- v088 NCT05112601 Testing Nivolumab With or Without Ipilimumab in Deficient Mismatch Repair System (dMMR) Recurrent Endometrial 
  judge-a: **not_relevant** - I1 not_met: "Patients with measurable or non-measurable (detectable) recurrent endometrial cancer" (dMMR endometrial cancer trial; she has ovarian cancer.)
  Reviewer verdict: [ ]

- v088 NCT05417594 Study of AZD9574 as Monotherapy and in Combination With Anti-cancer Agents in Participants With Advanced Solid
  judge-a: **excluded** - I2 not_met: "Progressive cancer at the time of enrollment." / I6 met: "Histologically or cytologically confirmed relapsed advanced ovarian, fallopian tube or primary peritoneal cancer and evidence of a predicted loss of function germline or tumour mutation in one of the following homologous recombination repair genes: BRCA1" (Relapsed gBRCA1 ovarian fits Module 1, but progressive disease is required and she is responding to platinum.)
  Reviewer verdict: [ ]

- v088 NCT05983432 Evaluate BL-B01D1 in Patients With Metastatic or Unresectable Non-Small Cell Lung Cancer (NSCLC) and Other Sol
  judge-a: **possibly** - I31 met: "Has histologic documentation of epithelial ovarian, primary peritoneal, or fallopian tube cancer that has progressed or relapsed on or after a previous platinum-containing chemotherapy with or without a PARP inhibitor." / E29 not_met: "For Ovarian Carcinoma a) Participants received more than 1 prior line of systemic chemotherapy." / E33 unknown: "A participant who does not meet this exclusion criterion may be allowed into the study pending the sponsor's approval" (Two platinum lines exceed the 1-line cap, but sponsor approval can waive it; she is responding now, no current progression.)
  Reviewer verdict: [ ]

- v088 NCT06293898 Open Label Study to Evaluate BL-M07D1 in HER2 Expressing Malignant Solid Tumors
  judge-a: **possibly** - I6 unknown: "HER2-expressing (IHC 1+ to 3+ and/or HER2 gene amplification or activating mutation [see Table 17-5] in tumor specimen by ISH or NGS)" / I6 met: "has received at least 2 lines of standard therapy" / I11 met: "Eastern Cooperative Oncology Group performance status (ECOG PS) of 0 to 1" (Ovarian HER2-expression cohort; HER2 status not tested.)
  Reviewer verdict: [ ]

- v088 NCT06582017 Safety, PK and Efficacy of QXL138AM in Patients With Solid Tumors and Multiple Myeloma
  judge-a: **excluded** - I2 not_met: "Patients must have no available therapeutic options known to confer clinical benefit for their tumor type." (Requires exhausted options; she is responding to platinum with maintenance options under discussion.)
  Reviewer verdict: [ ]

- v088 NCT07218809 AZD5335 vs. Mirvetuximab Soravtansine in FRα-high and AZD5335 vs. Chemotherapy in FRα-low Platinum-resistant O
  judge-a: **excluded** - I4 not_met: "Participants who have received 2 or 3 lines of platinum therapy must have progressed ≤ 6 months after the date of the last dose of platinum." / I5 not_met: "Participants must have radiologically progressed on or after their most recent line of therapy." (Platinum-resistant trial; she is platinum-sensitive with a partial response to her latest platinum.)
  Reviewer verdict: [ ]

- v089 NCT05503797 A Study to Assess the Efficacy and Safety of FORE8394 in Participants With Cancer Harboring BRAF Alterations
  judge-a: **possibly** - I4 unknown: "Documentation of BRAF gene fusion in tumor and/or blood" / I29 unknown: "Histologic diagnosis of a solid tumor harboring a BRAF V600E mutation" (BRAF-altered tumor basket; her BRAF status is not reported.)
  Reviewer verdict: [ ]

- v089 NCT05564377 Targeted Therapy Directed by Genetic Testing in Treating Patients With Locally Advanced or Advanced Solid Tumo
  judge-a: **possibly** - I2 met: "Patient must have an Eastern Cooperative Oncology Group (ECOG) performance status between 0-2" / I6 met: "Patients must have progressed on at least one line of standard systemic therapy OR" / I4 unknown: "All patients must have sequencing results available from a National Cancer Institute (NCI) credentialed Designated Laboratory (DL)" (Registration for biomarker-matched trials; needs NCI-lab sequencing and a matching sub-trial, both unknown.)
  Reviewer verdict: [ ]

- v089 NCT06014502 Study to Evaluate IMGS-001 Treatment in Patients With Relapsed or Refractory Advanced Solid Tumors
  judge-a: **excluded** - I8 not_met: "Eastern Cooperative Oncology Group (ECOG) performance status of 0-1." (ECOG 2 fails ECOG 0-1; ovarian expansion also needs PD-L1 CPS >= 1 and <= 3 relapse lines.)
  Reviewer verdict: [ ]

- v089 NCT06161025 A Study of Raludotatug Deruxtecan (R-DXd) in Subjects With Platinum-resistant, High-grade Ovarian, Primary Per
  judge-a: **excluded** - I10 not_met: "Eastern Cooperative Oncology Group performance status of 0 or 1." / I5 not_met: "For Phase 3 (Part B): Has received at least 1 but no more than 4 prior systemic lines of anticancer therapy" (ECOG 2 and about five prior lines.)
  Reviewer verdict: [ ]

- v089 NCT06297525 Study of STP938 (Dencatistat) in Advanced Solid Tumours
  judge-a: **possibly** - I5 unknown: "Histologically confirmed diagnosis of eligible cancer type." / I8 met: "Eastern Cooperative Oncology Group (ECOG) performance status ≤2." / I4 met: "Advanced disease not curable by available therapies and requires systemic therapy." (Advanced solid tumor phase 1 allowing ECOG 2; eligible tumor types not listed.)
  Reviewer verdict: [ ]

- v089 NCT06586957 A Study With NKT3964 for Adults With Advanced/Metastatic Solid Tumors
  judge-a: **possibly** - I3 met: "Ovarian cancer" / I1 unknown: "with documented disease progression on last standard treatment" (Ovarian cancer eligible for Part 1 escalation without CCNE1; progression on her current trial drug is not yet documented; ECOG rule not shown.)
  Reviewer verdict: [ ]

- v090 NCT05503797 A Study to Assess the Efficacy and Safety of FORE8394 in Participants With Cancer Harboring BRAF Alterations
  judge-a: **possibly** - I29 unknown: "Histologic diagnosis of a solid tumor harboring a BRAF V600E mutation and not eligible for other subprotocols." / I21 not_met: "Histologic diagnosis of a rare BRAF V600E-mutated solid tumor that is unresectable, locally advanced or metastatic." (No genetic testing done; Subprotocol D has no stage or prior-therapy rule, so BRAF status decides it.)
  Reviewer verdict: [ ]

- v090 NCT06771219 SLV-154 Treatment of Advanced Cancers
  judge-a: **excluded** - I4 not_met: "Presence of metastatic or recurrent locally advanced cancer." / I6 not_met: "Prior receipt of one or more commercially available therapies" (Open-ended advanced solid tumor basket; her tumor is newly diagnosed, confined to the ovary and untreated.)
  Reviewer verdict: [ ]

- v090 NCT06771739 A Pilot Unrestricted Payment Program for Early-stage Cancer Patients: the PAYMENT Trial
  judge-a: **possibly** - I4 met: "Within 90 days of a non-metastatic or early-stage solid tumor receiving or rescheduled to receive treatment in the neoadjuvant, adjuvant or definitive setting for curative intent." / I5 unknown: "Current cancer patient at PeaceHealth (Southwest Medical Center or St. Joes)" / I8 unknown: "Screens positive for financial fragility" (Financial support pilot for early-stage cancer near Portland; health system, Medicaid and financial status unknown.)
  Reviewer verdict: [ ]

- v090 NCT07546500 A Study of Azenosertib (ZN-c3) Versus Investigator's Choice Chemotherapy in Subjects With Platinum-Resistant H
  judge-a: **not_relevant** - I2 not_met: "High-grade serous epithelial ovarian, primary peritoneal, or fallopian tube cancer" (High-grade serous ovarian cancer trial; germ cell tumor is a different disease.)
  Reviewer verdict: [ ]

- v091 NCT04516447 A Study of Azenosertib (ZN-c3) in Patients With Ovarian Cancer
  judge-a: **excluded** - I2 not_met: "Histologically or cytologically confirmed FIGO Stage III/IV high-grade serous or endometrioid ovarian, fallopian tube, or peritoneal carcinoma." (High-grade serous/endometrioid only; she has low-grade serous carcinoma (subtype rule).)
  Reviewer verdict: [ ]

- v091 NCT04657068 A Study of ART0380 for the Treatment of Advanced or Metastatic Solid Tumors
  judge-a: **possibly** - I13 met: "Advanced or metastatic cancer which is refractory to standard therapies, or for which no standard therapies exist" / I28 not_met: "Females with histologically-confirmed diagnosis of high grade serous carcinoma of the ovary" / I21 unknown: "Patients with advanced or metastatic solid tumors with alterations to the ATM gene" (Ovarian expansion is high-grade serous only; dose escalation or ATM cohort could fit (ATM status unknown).)
  Reviewer verdict: [ ]

- v091 NCT05684965 XTX301 in Patients With Advanced Solid Tumors
  judge-a: **possibly** - I1 met: "Part 1A - Any histologically or cytologically confirmed solid tumor malignancy that is locally advanced or metastatic and has failed standard therapy" / I7 not_met: "Patients must have previously experienced a response lasting at least 180 days to first-line platinum-based therapy." / E2 unknown: "Known liver metastasis based on imaging" / E5 met: "Active autoimmune disease" (Part 1A any solid tumor fits (ovarian cohort 2D needs a durable platinum response); whether her liver surface nodules count as liver metastasis is unclear.)
  Reviewer verdict: [ ]

- v091 NCT05720117 A Study of PYX-201 in Advanced Solid Tumors
  judge-a: **eligible** - I2 met: "other solid tumor types (≤ 2 lines systemic therapy)" / I5 met: "Participant must have at least 1 measurable lesion per Response Evaluation Criteria in Solid Tumors (RECIST) v1.1." / I4 met: "Eastern Cooperative Oncology Group (ECOG) Performance Status (PS) of 0 to 1." (Advanced solid tumor ADC study; two prior lines (carboplatin/paclitaxel, letrozole) meet the 2-line cap for other tumor types.)
  Reviewer verdict: [ ]

- v091 NCT06014502 Study to Evaluate IMGS-001 Treatment in Patients With Relapsed or Refractory Advanced Solid Tumors
  judge-a: **excluded** - I1 met: "Patients must have histologically confirmed locally advanced, or metastatic solid tumors who have progressed after receiving appropriate lines of standard therapy" / I3 not_met: "Ovarian (high-grade epithelial, fallopian tube, or primary peritoneal)" / E10 not_met: "abdominal carcinomatosis" / E11 met: "celiac disease controlled by diet" (Ovarian expansion is high-grade only; dose escalation bars abdominal carcinomatosis and she has growing peritoneal nodules.)
  Reviewer verdict: [ ]

- v091 NCT06051695 A Study to Evaluate the Safety and Efficacy of Mesothelin-Targeting Logic-gated CAR T, in Participants With So
  judge-a: **possibly** - I1 unknown: "Appropriately enrolled in the BASECAMP-1 A2 Biotherapeutics, Inc. study, with tissue demonstrating LOH of HLA-A*02 by NGS" / I2 met: "Histologically confirmed recurrent unresectable, locally advanced, or metastatic CRC, NSCLC, PANC, OVCA, MESO, or other solid tumors with MSLN expression." (Recurrent ovarian cancer fits; HLA-A*02 LOH, MSLN expression and BASECAMP-1 enrollment unknown.)
  Reviewer verdict: [ ]

- v091 NCT06997029 A Phase 1 Study of BMS-986500 as Monotherapy or Combination Therapy in Advanced Solid Tumors
  judge-a: **eligible** - I2 met: "Participants must have histologically confirmed diagnosis of a locally advanced, unresectable, or metastatic solid tumor malignancy." / I3 met: "Participants must have a measurable disease per Response Evaluation Criteria in Solid Tumors (RECIST) v1.1" / I5 unknown: "For Part 2A only, participants must have CCNE1-amplified ovarian cancer" (Phase 1 advanced solid tumor/ovarian study with no failing numbered criterion; only the Part 2A cohort needs CCNE1 amplification.)
  Reviewer verdict: [ ]

- v091 NCT07214779 Study to Evaluate INCB123667 Versus Investigator's Choice of Chemotherapy in Participants With Platinum-Resist
  judge-a: **excluded** - E1 not_met: "low-grade/borderline ovarian cancer" / I1 not_met: "Histological diagnosis of high-grade serous epithelial ovarian, fallopian tube, or primary peritoneal cancer." (High-grade serous PROC trial; low-grade excluded.)
  Reviewer verdict: [ ]

- v093 NCT05564377 Targeted Therapy Directed by Genetic Testing in Treating Patients With Locally Advanced or Advanced Solid Tumo
  judge-a: **excluded** - I1 not_met: "Patient must have measurable disease" / I6 not_met: "Patients must have progressed on at least one line of standard systemic therapy" (ComboMATCH needs measurable, progressing advanced disease; she has no visible disease on first-line maintenance.)
  judge-b: **excluded** - I1 not_met: "Patient must have measurable disease" / I6 not_met: "Patients must have progressed on at least one line of standard systemic therapy" (No visible disease on first-line maintenance; no progression.)
  Reviewer verdict: [ ]

- v093 NCT05985655 Study to Assess GTAEXS617 in Participants With Advanced Solid Tumors
  judge-a: **excluded** - I3 not_met: "platinum-resistant high-grade epithelial ovarian, primary peritoneal, or fallopian tube cancers (HGSOC)" / E4 not_met: "Concurrent active or previous malignancy." (Ovarian arm is platinum-resistant only; she is NED and also had a prior colon cancer.)
  judge-b: **excluded** - I3 not_met: "platinum-resistant high-grade epithelial ovarian, primary peritoneal, or fallopian tube cancers (HGSOC)" / I4 not_met: "Must have disease that is advanced (ie, surgery or radiotherapy are not considered to be potentially curative), recurrent, or metastatic following SoC treatments."
  Reviewer verdict: [ ]

- v093 NCT06242470 A Study of MGC026 in Participants With Advanced Solid Tumors
  judge-a: **excluded** - I4 not_met: "Unresectable, locally advanced or metastatic solid tumors including" / I5 not_met: "Measurable disease per RECIST v1.1." (Advanced measurable disease required; she is NED.)
  judge-b: **excluded** - I4 not_met: "Unresectable, locally advanced or metastatic solid tumors including" / I5 not_met: "Measurable disease per RECIST v1.1."
  Reviewer verdict: [ ]

- v093 NCT06465069 A Study of LY4052031 in Participants With Advanced or Metastatic Urothelial Cancer or Other Solid Tumors
  judge-a: **excluded** - I4 not_met: "Individual has received all standard therapies for which the participant was deemed to be an appropriate candidate by the treating investigator" / I8 not_met: "Measurable disease is required as defined by Response Evaluation Criteria in Solid Tumors v1.1 (RECIST v1.1) for all Cohorts." (Needs exhausted standard therapy and disease to follow; she is NED mid first-line maintenance.)
  judge-b: **excluded** - I4 not_met: "Individual has received all standard therapies for which the participant was deemed to be an appropriate candidate by the treating investigator" / I8 not_met: "Measurable disease is required as defined by Response Evaluation Criteria in Solid Tumors v1.1 (RECIST v1.1) for all Cohorts." (Still on first-line maintenance with no disease.)
  Reviewer verdict: [ ]

- v093 NCT07109726 A Phase 1/2 Trial of TER-2013 in Patients With Solid Tumors Harboring AKT/PI3K/PTEN Pathway Alterations
  judge-a: **excluded** - I1 not_met: "Metastatic or locally advanced, unresectable disease" / I7 unknown: "Advanced solid tumor malignancy harboring an eligible AKT/PI3K/PTEN pathway alteration detected by a sponsor approved test" (Advanced unresectable disease with evaluable lesions required; she had complete debulking and has no visible disease.)
  judge-b: **excluded** - I1 not_met: "Metastatic or locally advanced, unresectable disease" / I7 unknown: "Advanced solid tumor malignancy harboring an eligible AKT/PI3K/PTEN pathway alteration detected by a sponsor approved test"
  Reviewer verdict: [ ]

- v095 NCT04575935 Minimally Invasive Surgery After Neoadjuvant Chemotherapy for the Treatment of Stage IIIC-IV Ovarian, Primary 
  judge-a: **not_relevant** - I3 not_met: "Patient is considered by treating physician to be a surgical candidate after completion of 3 to 4 cycles of platinum-based chemotherapy" (Interval debulking surgery trial after NACT; she has recurrent disease and no surgery planned.)
  Reviewer verdict: [ ]

- v095 NCT04657068 A Study of ART0380 for the Treatment of Advanced or Metastatic Solid Tumors
  judge-a: **possibly** - I30 not_met: "No more than one prior regimen in the platinum-resistant setting." / I13 unknown: "Advanced or metastatic cancer which is refractory to standard therapies, or for which no standard therapies exist" / I16 met: "Advanced or metastatic cancer for which gemcitabine is an appropriate treatment." / I56 met: "one or more opportunistic HIV/AIDs-related infections within the past 12 months" (Part B2 PROC cohort fails (2 PROC regimens); dose-escalation parts (e.g. with gemcitabine) could fit; cohort availability decides.)
  Reviewer verdict: [ ]

- v095 NCT05579366 Rinatabart Sesutecan (Rina-S, PRO1184, GEN1184) for Advanced Solid Tumors (GCT1184-01/ PRO1184-001)
  judge-a: **possibly** - I8 not_met: "Participants must have received up to 3 prior lines of therapy." / I42 met: "Participants must have primary platinum-refractory, platinum-resistant, or platinum-sensitive ovarian cancer." / I41 met: "must have high grade epithelial ovarian cancer, primary peritoneal cancer, or fallopian tube cancer including serous" / E2 met: "Prior therapy with a topoisomerase 1 inhibitor-based antibody drug conjugate." (4 prior lines fail the Part C/E/H cap; Part K (no line cap) fits. Cohort availability decides.)
  Reviewer verdict: [ ]

- v095 NCT06483048 MUC1-Activated T Cells for the Treatment of Relapsed and Resistant Ovarian Cancer
  judge-a: **excluded** - E10 not_met: "HIV positivity and currently receiving antiretroviral therapy" / I5 met: "Patients with BRCA1/2 mutations must have received prior treatment with a poly (ADP-ribose) polymerase (PARP) inhibitor to be eligible." (PROC fits, but HIV on antiretroviral therapy is excluded.)
  Reviewer verdict: [ ]

- v095 NCT06580314 Testing Olaparib for One or Two Years, With or Without Bevacizumab, to Treat Ovarian Cancer
  judge-a: **excluded** - I1 not_met: "Patients with newly diagnosed, pathologically confirmed, Federation of Gynecology and Obstetrics (FIGO) stage III or IV ovarian cancer" / I11 not_met: "No previous treatment with a PARP inhibitor, including olaparib, niraparib, and rucaparib" (First-line PARPi maintenance trial; she has recurrent disease after niraparib.)
  Reviewer verdict: [ ]

- v095 NCT06646627 Clinical Trial of Autologous B7-H3 CAR T Cells in Reoccurent Platinum-resistant Ovarian Tumors
  judge-a: **excluded** - E1 not_met: "Ongoing HIV, HBV, or HCV infection." / I6 met: "Patients should be considered platinum- refractory (progression while on a prior platinum chemotherapy) or resistant" (PROC fits, but ongoing (controlled) HIV infection is excluded.)
  Reviewer verdict: [ ]

- v095 NCT06677190 Belzutifan in Recurrent Clear Cell Carcinoma of Gynecologic Origin
  judge-a: **excluded** - I1 not_met: "clear cell carcinoma of the ovary (CCOC)" / E21 not_met: "Is known to be positive for Human Immunodeficiency Virus (HIV)." (Clear cell carcinoma trial (subtype rule) and HIV excluded; she has HGSOC.)
  Reviewer verdict: [ ]

- v095 NCT06885697 Anti-Mesothelin TNaive/SCM hYP218 (TNhYP218) CAR T Cells in Participants With Mesothelin-Expressing Solid Tumo
  judge-a: **excluded** - E13 not_met: "Positive serology for HIV, HTLV-1, or HTLV-2." / I6 unknown: "Tumor must have MSLN positivity of 2+ to 3+ in >= 50% cancer cells" (Mesothelin CAR-T includes ovarian, but positive HIV serology is excluded.)
  Reviewer verdict: [ ]

- v095 NCT06910657 IDOV-Immune for Advanced Solid Tumors
  judge-a: **possibly** - I2 met: "advanced solid tumors that have progressed despite standard therapy" / E4 unknown: "History of hepatitis B, hepatitis C, or HIV (unless meeting protocol-specific criteria)." / E7 met: "Active or untreated CNS metastases (unless stable per protocol)." (Oncolytic virus basket incl. ovarian; HIV allowed only under protocol-specific criteria not shown.)
  Reviewer verdict: [ ]

- v096 NCT03922555 ASTX727 in Recurrent/Progressive Non-enhancing IDH Mutant Gliomas
  judge-a: **excluded** - I2 not_met: "Participants must have histologically or cytologically confirmed glioma, with documented IDH1 and/or IDH2 gene-mutation." / E1 not_met: "Participants with enhancing disease on brain MRI." (Non-enhancing IDH-mutant glioma trial; his recurrence is enhancing IDH-wt GBM.)
  Reviewer verdict: [ ]

- v096 NCT06649851 G-CSF After Chemo-radiation in Patients With Glioblastoma
  judge-a: **excluded** - I1 not_met: "Participants must have confirmed newly diagnosed glioblastoma multiforme (GBM)" / I6 not_met: "No prior cranial irradiation." (G-CSF during first-line chemoradiation; he already completed RT/TMZ and has recurred.)
  Reviewer verdict: [ ]

- v096 NCT06667141 Study of ACR-2316 in Specific Advanced Solid Tumors
  judge-a: **possibly** - I2 unknown: "Histologically or cytologically proven metastatic, recurrent or locally advanced selected solid tumors." / I4 met: "Subjects should have received no more than 3 lines of systemic therapy for recurrent disease." / I8 met: "Must have progressed after prior line of treatment." (Basket for unspecified 'selected' solid tumors; whether GBM is included is not shown.)
  Reviewer verdict: [ ]

- v097 NCT03550391 Stereotactic Radiosurgery Compared With Hippocampal-Avoidant Whole Brain Radiotherapy (HA-WBRT) Plus Memantine
  judge-a: **not_relevant** - I1 not_met: "Patients must have 5 or more brain metastases" (Brain metastasis radiotherapy trial; she has primary glioblastoma.)
  Reviewer verdict: [ ]

- v097 NCT04855656 Study of Lunresertib Alone or in Combination With RP-3500 or Debio 0123 in Patients With Advanced Solid Tumors
  judge-a: **excluded** - I3 not_met: "Locally advanced or metastatic resistant or refractory solid tumors." / I7 unknown: "CCNE1 amplification (non-equivocal)" (Biomarker-selected refractory solid tumor basket; her GBM is newly diagnosed and untreated beyond surgery.)
  Reviewer verdict: [ ]

- v097 NCT05281731 Sonobiopsy for Noninvasive and Sensitive Detection of Glioblastoma
  judge-a: **not_relevant** - I7 not_met: "Must be planning to undergo surgical resection of the tumor." / E2 not_met: "Previous cranial surgery." (Pre-operative sonobiopsy diagnostic study; her resection is already done.)
  Reviewer verdict: [ ]

- v097 NCT06459973 A Clinical Study of YL205 in Patients With Advanced Solid Tumors
  judge-a: **excluded** - I1 not_met: "Patients with histologically or cytologically confirmed locally advanced or metastatic ovarian cancer (OC), non-squamous non-small cell lung cancer (NSQ NSCLC), renal cell carcinoma (RCC), endometrial cancer (EC), or other Napi2b-overexpressing tumors" / E1 unknown: "Subjects with brain metastasis or spinal cord compression." (Advanced NaPi2b solid tumor study needing extracranial measurable disease; her GBM is localized and untreated.)
  Reviewer verdict: [ ]

- v097 NCT07215910 Testing Addition of an Anti-cancer Drug, Vorasidenib to Temozolomide, After Radiation for Advanced Brain Cance
  judge-a: **excluded** - I1 not_met: "STEP 0: Histologic diagnosis of astrocytoma, IDH-mutant (central nervous system [CNS] WHO grade 3)" (IDH-mutant grade 3 astrocytoma trial; her GBM is IDH wild-type (glioma subtype rule).)
  Reviewer verdict: [ ]

- v097 NCT07447531 T2 Star Magnetic Resonance Imaging and Biomarker Blood Testing to Predict the Change and Progress of Malignant
  judge-a: **eligible** - I2 met: "New pathologically confirmed diagnosis of WHO grade IV malignant glioma" / I3 met: "KPS > 60" / I4 met: "Ability to give informed consent for standard of care chemotherapy and radiation therapy on the MR Linac" (Imaging/biomarker study during standard chemoradiation for newly diagnosed grade 4 glioma; she starts RT in two weeks.)
  Reviewer verdict: [ ]

- v097 NCT07541781 Sitagliptin in Recurrent/Progressive Grade 4 Glioma
  judge-a: **excluded** - I2 not_met: "WHO grade 4 glioma for which disease recurrence/progression after first line therapy is diagnosed" (Recurrent grade 4 glioma trial; she is newly diagnosed.)
  Reviewer verdict: [ ]

- v098 NCT06047379 Safety and Efficacy of NEO212 in Patients With Astrocytoma IDH-mutant, Glioblastoma IDH-wildtype or Brain Meta
  judge-a: **possibly** - I23 met: "have radiographically confirmed Astrocytoma IDH-mutant, Glioblastoma IDH-wildtype following previous radiation therapy or treatment with temozolomide and radiation" / E13 not_met: "Patients in Phase 2b with Astrocytoma IDH-mutant, or Glioblastoma IDH-wildtype who have had more than one recurrence or progression of his/her primary CNS tumor(s)." (IDH-mutant astrocytoma after RT/TMZ fits; she has had more than one progression, which bars Phase 2b but not Phase 1 escalation.)
  Reviewer verdict: [ ]

- v098 NCT06176066 PH Sensitive MRI Based Resections of Glioblastoma
  judge-a: **excluded** - I4 not_met: "Individuals with suspected, newly diagnosed or recurrent IDH wild type WHO IV glioblastoma" (IDH-wt GBM resection imaging study; her tumor is an IDH-mutant grade 3 astrocytoma.)
  Reviewer verdict: [ ]

- v098 NCT07145112 Laser Interstitial Thermal Therapy (LITT) and Lomustine (CCNU) for Recurrent Glioblastoma
  judge-a: **excluded** - I1 not_met: "Histologically confirmed World Health Organization (WHO) 2021 defined glioblastoma." / E2 not_met: "Prior treatment with nitrosourea agents (e.g. lomustine [CCNU], carmustine [BCNU], nimustine [ACNU])." (Recurrent GBM LITT + lomustine; she is IDH-mutant grade 3 and already had PCV (contains lomustine).)
  Reviewer verdict: [ ]

- v098 NCT07452458 Temporally-Modulated Pulsed Radiation Therapy Versus Standard Radiation Therapy for the Treatment of Newly Dia
  judge-a: **excluded** - I2 not_met: "No known IDH mutation." / I16 not_met: "No previous therapy for GBM except surgery, laser interstitial thermal therapy (LITT) or Gliadel wafer." (Newly diagnosed IDH-wt MGMT-unmethylated GBM; she has a known IDH mutation and prior RT/chemo.)
  Reviewer verdict: [ ]

- v098 NCT07544992 Locoregional Administration of Genetically Engineered Cells (EGFR/IL13Rα2 Pool-CAR T Cells) for the Treatment 
  judge-a: **possibly** - I7 unknown: "has a prior histologically confirmed diagnosis of a grade 2 or 3 astrocytoma and now has radiographic progression consistent with grade 4 IDH-mutant astrocytoma" / I8 met: "Relapsed disease: radiographic evidence of recurrence/progression of measurable disease after standard therapy" / I10 unknown: "IL13Rα2+ expression by IHC > 20, and" (Prior grade 3 astrocytoma with new enhancement may qualify as grade 4 progression; IL13Ra2/EGFR status unknown.)
  Reviewer verdict: [ ]

- v099 NCT03970447 A Trial to Evaluate Multiple Regimens in Newly Diagnosed and Recurrent Glioblastoma
  judge-a: **excluded** - I3 not_met: "Histologically confirmed Grade IV GBM, inclusive of gliosarcoma (WHO criteria; IDH wild-type by immunohistochemistry [IHC] or sequencing for IDH)" (GBM AGILE is IDH-wt grade IV GBM; he has IDH-mutant grade 2 oligodendroglioma (glioma subtype rule).)
  Reviewer verdict: [ ]

- v099 NCT06039709 Sonodynamic Therapy in Patients With Recurrent GBM
  judge-a: **excluded** - I2 not_met: "Suspected recurrent glioblastoma that is clearly measurable" (Recurrent GBM sonodynamic therapy; he has newly diagnosed grade 2 oligodendroglioma.)
  Reviewer verdict: [ ]

- v099 NCT06874335 A Phase 1 Study of BHV-1530 in Advanced Solid Tumors
  judge-a: **not_relevant** - I22 not_met: "Primary central nervous system (CNS) tumors, current or previously treated leptomeningeal disease or known active brain metastases." (Solid tumor trial (urothelial, NSCLC, HNSCC, FGFR3) that bars primary CNS tumors.)
  Reviewer verdict: [ ]

- v099 NCT06989086 FearLess in NeuroOncology
  judge-a: **possibly** - I2 met: "Self-report a diagnosis of a primary malignant brain tumor (grade II-IV)" / I3 met: ">2 weeks post-cranial resection or biopsy" / I4 unknown: "Elevated Fear of Recurrence Distress Rating" (Virtual fear-of-recurrence program for grade II-IV brain tumors; his distress rating is not stated.)
  Reviewer verdict: [ ]

- v099 NCT07326566 Study of Silevertinib With Temozolomide for the Treatment of Newly Diagnosed GBM With Unmethylated MGMT and EG
  judge-a: **excluded** - I1 not_met: "Newly diagnosed histologically confirmed glioblastoma that is isocitrate dehydrogenase wild type (IDH-WT)." (IDH-wt GBM trial; his tumor is an IDH-mutant oligodendroglioma (glioma subtype rule).)
  Reviewer verdict: [ ]

- v099 NCT07612176 A Study of NEOK001, a B7-H3 and ROR1 Targeting Bispecific ADC in Participants With Select Solid Tumors
  judge-a: **excluded** - I1 not_met: "Participants must have locally advanced or metastatic disease in a select tumor type, for which no standard therapy is available." (Advanced solid tumor ADC for tumors without standard therapy; he has a newly resected glioma with standard options.)
  Reviewer verdict: [ ]

- v100 NCT06055790 Feasibility of 18F-Fluciclovine PET/CT to Identify Brain Metastasis
  judge-a: **not_relevant** - I1 not_met: "Patients with clinically suspected or diagnosed brain metastatic lesion(s)" (Brain metastasis PET imaging; she has a primary meningioma.)
  Reviewer verdict: [ ]

- v100 NCT07042100 A Study to Test the Safety and Tolerability of SBO-154 in Patients With Advanced Solid Tumors.
  judge-a: **eligible** - I3 met: "Has locally recurrent or metastatic disease (except sarcomas) which has relapsed or progressed following local standard treatment, or for which no standard treatment is available." (Advanced solid tumor phase 1 with no performance-status cutoff listed; her locally recurrent grade 3 meningioma progressed after surgery and RT.)
  Reviewer verdict: [ ]

- v102 NCT03896568 MSC-DNX-2401 in Treating Patients With Recurrent High-Grade Glioma
  judge-a: **excluded** - I3 met: "Patients with recurrent malignant GBM or gliosarcoma will be eligible." / I9 not_met: "Patients must have a Karnofsky performance score ≥ 70." (Recurrent GBM fits, but ECOG 3-4 fails KPS >= 70.)
  judge-b: **excluded** - I9 not_met: "Patients must have a Karnofsky performance score ≥ 70." / I3 met: "Patients with recurrent malignant GBM or gliosarcoma will be eligible."
  Reviewer verdict: [ ]

- v102 NCT04373720 MRE Scan for the Assessment of Differences in Tissue Stiffness Between Radiation Necrosis and Recurrent Glioma
  judge-a: **possibly** - I2 met: "History of a pathology proven intracranial glioma (including IDH mutant, IDH wildtype or 1p19q co-deleted tumors) treated with chemotherapy and radiation." / I3 unknown: "The lesion of concern (T2 Flair Hyperintense or contrast enhancing lesion) is > 2 cm" (Imaging study of necrosis vs recurrence in treated glioma; no performance-status rule; lesion size not stated.)
  judge-b: **possibly** - I2 met: "History of a pathology proven intracranial glioma (including IDH mutant, IDH wildtype or 1p19q co-deleted tumors) treated with chemotherapy and radiation." / I3 unknown: "The lesion of concern (T2 Flair Hyperintense or contrast enhancing lesion) is > 2 cm" (Observational MRE imaging study; no performance-status requirement; lesion size not stated.)
  Reviewer verdict: [ ]

- v102 NCT05698524 A Study of Temodar With Abexinostat (PCI-24781) for Patients With Recurrent Glioma
  judge-a: **excluded** - I2 met: "Prior radiation therapy and standard temozolomide; additional therapies for previous progressions are eligible (prior bevacizumab and Optune are allowed)" / I6 not_met: "Eastern Cooperative Oncology Group (ECOG) Performance Status of 0-2" (Recurrent HGG fits, but ECOG 3-4 fails ECOG 0-2.)
  judge-b: **excluded** - I6 not_met: "Eastern Cooperative Oncology Group (ECOG) Performance Status of 0-2" / I2 met: "Prior radiation therapy and standard temozolomide; additional therapies for previous progressions are eligible"
  Reviewer verdict: [ ]

- v102 NCT05789394 Allogenic Adipose-Derived Mesenchymal Stem Cells for the Treatment of Recurrent Glioblastoma or Recurrent Astr
  judge-a: **excluded** - I2 not_met: "Karnofsky Performance Scale (KPS) >= 60" / E3 not_met: "Previous treatment with bevacizumab" (Prior bevacizumab and ECOG 3-4.)
  judge-b: **excluded** - I2 not_met: "Karnofsky Performance Scale (KPS) >= 60" / E3 not_met: "Previous treatment with bevacizumab"
  Reviewer verdict: [ ]

- v102 NCT06161519 PLX038 in Primary Central Nervous System Tumors Containing MYC or MYCN Amplifications
  judge-a: **excluded** - I3 met: "Cohort Phase IID: Any recurrent glioblastoma without MYC or MYCN amplifications." / I9 not_met: "Karnofsky >= 70%." (Recurrent GBM cohort fits, but ECOG 3-4 fails KPS >= 70.)
  judge-b: **excluded** - I9 not_met: "Karnofsky >= 70%." / I3 met: "Cohort Phase IID: Any recurrent glioblastoma without MYC or MYCN amplifications." (Dependent for most daily care, so the paraparesis KPS exception does not apply.)
  Reviewer verdict: [ ]

- v102 NCT06504381 DB107-RRV, DB107-FC, and Radiation Therapy With or Without Temozolomide (TMZ) for High Grade Glioma
  judge-a: **excluded** - I5 not_met: "Participant must have newly diagnosed adult-type diffuse gliomas (World Health Organization Classification 2021) that has not been previously treated with surgery, radiation or chemotherapy" / I4 not_met: "Participant must have a Karnofsky Performance Scale (KPS) of >= 70." (Newly diagnosed glioma trial; he is recurrent after many treatments and ECOG 3-4.)
  judge-b: **excluded** - I5 not_met: "Participant must have newly diagnosed adult-type diffuse gliomas (World Health Organization Classification 2021) that has not been previously treated with surgery, radiation or chemotherapy" / E2 not_met: "Prior treatment for High Grade Glioma (HGG)."
  Reviewer verdict: [ ]

- v102 NCT07089641 ERAS-801 for the Treatment of Resectable and Progressive or Recurrent or Elderly Newly Diagnosed IDH Wildtype 
  judge-a: **excluded** - I4 met: "Patient tumor sample must have wild type IDH with evidence of EGFR mutation/amplification" / I5 unknown: "Patients may have had no more than two prior recurrences" / I12 not_met: "Patients must have a Karnofsky performance status ≥ 60% (i.e. the patient must be able to care for himself/herself with occasional help from others)" (EGFR-amplified IDH-wt recurrent GBM fits, but he depends on family for most daily care (ECOG 3-4), failing KPS >= 60.)
  judge-b: **excluded** - I4 met: "Patient tumor sample must have wild type IDH with evidence of EGFR mutation/amplification" / I12 not_met: "Patients must have a Karnofsky performance status ≥ 60%" / I5 unknown: "Patients may have had no more than two prior recurrences"
  Reviewer verdict: [ ]

- v102 NCT07464925 A Phase 1 Safety and Dose Finding Study of GLIX1 in Adults With Recurrent or Progressive High-grade Glioma
  judge-a: **excluded** - I5 not_met: "A maximum of two prior treatment lines" / I10 not_met: "Participants receiving corticosteroids must be on a stable or decreasing dose of ≤6 mg daily dexamethasone" / I12 not_met: "Adequate performance status: Eastern Cooperative Oncology Group (ECOG) 0 or 1." (Over two prior lines (TMZ, bevacizumab, lomustine, trial immunotherapy), 8 mg dexamethasone, ECOG 3-4.)
  judge-b: **excluded** - I5 not_met: "A maximum of two prior treatment lines" / I10 not_met: "Participants receiving corticosteroids must be on a stable or decreasing dose of ≤6 mg daily dexamethasone" / I12 not_met: "Adequate performance status: Eastern Cooperative Oncology Group (ECOG) 0 or 1."
  Reviewer verdict: [ ]

- v103 NCT04374305 Innovative Trial for Understanding the Impact of Targeted Therapies in NF2-Related Schwannomatosis (INTUITT-NF
  judge-a: **not_relevant** - I2 not_met: "Patients must have a pathogenic variant in the NF2 gene" (NF2-related schwannomatosis population; he has a sporadic high-grade glioma.)
  judge-b: **not_relevant** - I2 not_met: "Patients must have a pathogenic variant in the NF2 gene" (NF2-related schwannomatosis tumors; patient has sporadic high-grade glioma.)
  Reviewer verdict: [ ]

- v103 NCT06581432 Beamion PANTUMOR-1: A Study to Test Whether Zongertinib Helps People With Advanced Cancers With HER2 Alteratio
  judge-a: **excluded** - I2 unknown: "Documented Human epidermal growth factor receptor 2 (HER2)-positive status or known activating HER2 mutations (by local testing)" / I4 not_met: "Disease progression following prior treatment in the metastatic setting" / I6 not_met: "Presence of ≥1 measurable lesion outside the central nervous system (CNS)" (HER2 pan-tumor trial needing extracranial measurable disease and progression after treatment; he has a brain-only glioma in first-line chemoradiation.)
  judge-b: **excluded** - I6 not_met: "Presence of ≥1 measurable lesion outside the central nervous system (CNS)" / I4 not_met: "Disease progression following prior treatment in the metastatic setting" / I2 unknown: "Documented Human epidermal growth factor receptor 2 (HER2)-positive status or known activating HER2 mutations" (Primary brain tumor on first-line chemoradiation; no extracranial disease.)
  Reviewer verdict: [ ]

- v104 NCT04752722 LEGEND Study: EG-70 in NMIBC Patients BCG-Unresponsive and High-Risk NMIBC Incompletely Treated With BCG or BC
  judge-a: **excluded** - E12 not_met: "Evidence of metastatic disease." (Intravesical therapy for NMIBC; he has metastatic disease after cystectomy.)
  Reviewer verdict: [ ]

- v104 NCT05086692 A Beta-only IL-2 ImmunoTherapY Study
  judge-a: **eligible** - I4 met: "Histologically or cytologically confirmed locally advanced or metastatic solid tumor (see tumor types listed under conditions)" / I2 met: "Eastern Cooperative Oncology Group (ECOG) Performance Status of 0 to 1." (IL-2 basket listing bladder cancer; metastatic, measurable, ECOG 0-1, no failing criterion.)
  Reviewer verdict: [ ]

- v104 NCT07193511 BEACON-1: Study of AVZO-103 as a Single Agent and in Combination Therapy in Patients With Locally Advanced or 
  judge-a: **eligible** - I1 met: "Eastern Cooperative Oncology Group (ECOG) Performance Status of ≤ 1" / I3 met: "Locally advanced or metastatic urothelial cancer and other solid tumors" / I4 met: "Measurable disease as assessed by Investigator using RECIST v1.1." (ADC trial for metastatic UC; measurable disease, ECOG 0-1, no failing criterion listed.)
  Reviewer verdict: [ ]

- v104 NCT07217171 A Study Evaluating the Safety, Efficacy, and Pharmacokinetics (PK) of EVOLVE104 in Participants With Advanced 
  judge-a: **possibly** - I1 met: "Participants must have locally advanced or metastatic cancer with one of the following tumor types: bladder cancer" / I2 met: "Participant must have documented disease progression during or post treatment with standard of care" / E1 unknown: "The participant is a candidate for treatment with a targeted agent known to provide a benefit." (Metastatic bladder cancer after progression on pembrolizumab; whether he counts as a candidate for a beneficial targeted agent (EV, FGFR status unknown) is unclear.)
  Reviewer verdict: [ ]

- v104 NCT07218380 A Study of Vepugratinib (LY3866288) in Participants With Cancer in the Urinary Tract
  judge-a: **excluded** - I2 unknown: "Have a qualifying fibroblast growth factor receptor 3 (FGFR3) genetic alteration" / E1 not_met: "Have received prior systemic therapy for locally advanced or metastatic urothelial cancer (mUC)." (First-line FGFR3 trial; he already had pembrolizumab for metastatic UC.)
  Reviewer verdict: [ ]

- v104 NCT07232602 KEYMAKER-U04 Substudy 04D: A Clinical Study of New Treatments Given With Enfortumab Vedotin and Pembrolizumab 
  judge-a: **excluded** - I4 not_met: "Must not have received prior systemic therapy for locally advanced or metastatic UC" (First-line EV + pembrolizumab combinations; he already had pembrolizumab for metastatic disease.)
  Reviewer verdict: [ ]

- v105 NCT05684965 XTX301 in Patients With Advanced Solid Tumors
  judge-a: **excluded** - I1 not_met: "Part 1A - Any histologically or cytologically confirmed solid tumor malignancy that is locally advanced or metastatic" (Advanced solid-tumor basket (Part 1A any tumor); NMIBC CIS is localized.)
  Reviewer verdict: [ ]

- v105 NCT05785754 DCSZ11 as a Monotherapy and in Combination in Patients With Advanced or Metastatic Solid Tumors
  judge-a: **excluded** - I4 not_met: "Patients in Phase 1a must have a histologically or cytologically documented, advanced (metastatic and/or unresectable) solid tumor" (Advanced solid-tumor phase 1; NMIBC is localized (advanced-basket rule).)
  Reviewer verdict: [ ]

- v105 NCT07218380 A Study of Vepugratinib (LY3866288) in Participants With Cancer in the Urinary Tract
  judge-a: **excluded** - I1 not_met: "Have histologically confirmed, unresectable locally advanced or metastatic urothelial cancer (mUC)." / I2 unknown: "Have a qualifying fibroblast growth factor receptor 3 (FGFR3) genetic alteration" (First-line FGFR3-altered mUC; he has NMIBC and no molecular testing.)
  Reviewer verdict: [ ]

- v105 NCT07421700 Symbiotic-GU-06: A Study to Learn About PF-08634404 Alone or In Combination With Enfortumab Vedotin in Urothel
  judge-a: **excluded** - I2 not_met: "Histologically confirmed locally advanced or metastatic urothelial carcinoma (LA/mUC)." / I3 unknown: "Measurable disease per RECIST v1.1 criteria." (LA/mUC trial; he has non-muscle-invasive CIS.)
  Reviewer verdict: [ ]

- v106 NCT03945162 Intravesical Photodynamic Therapy ("PDT") in BCG-Unresponsive/Intolerant Non-Muscle Invasive Bladder Cancer ("
  judge-a: **excluded** - E1 not_met: "Past or current muscle invasive (i.e.: T2, T3, T4) or metastatic urothelial carcinoma." / I3 not_met: "Have histologically confirmed NMIBC CIS via biopsy" (BCG-unresponsive NMIBC PDT trial; she had MIBC and a radical cystectomy.)
  Reviewer verdict: [ ]

- v106 NCT07277413 A Study of IDE892 as Monotherapy and Combination in MTAP-deleted Advanced Solid Tumors
  judge-a: **excluded** - E27 not_met: "Must have histologically confirmed diagnosis of advanced or metastatic UC" / I5 unknown: "Have evidence of homozygous loss of MTAP or MTAP deletion" / I6 not_met: "Have at least 1 measurable lesion according to RECIST version 1.1" (MTAP-deleted advanced UC cohort (mis-sectioned criterion); she is resected with no visible disease.)
  Reviewer verdict: [ ]

- v106 NCT07815665 A Study of Ivonescimab in Combination With Enfortumab Vedotin vs Pembrolizumab in Combination With Enfortumab 
  judge-a: **excluded** - I4 not_met: "Histologically documented unresectable LA/mUC (transitional cell carcinoma) of the bladder" / I6 not_met: "At least one measurable non-cerebral lesion according to RECIST v1.1" (First-line mUC trial; she is NED after cystectomy on adjuvant therapy.)
  Reviewer verdict: [ ]

- v107 NCT04879329 A Study of Disitamab Vedotin Alone or With Pembrolizumab in Urothelial Cancer That Expresses HER2
  judge-a: **excluded** - I3 not_met: "Participants must have received only 1 or 2 lines of prior systemic treatment for LA/mUC" / I6 not_met: "Eastern Cooperative Oncology Group (ECOG) performance status score of 0 or 1" / E5 not_met: "Prior MMAE-based ADCs (eg, enfortumab vedotin) or HER2-directed therapy" (Four metastatic lines including EV, ECOG 2; first-line cohorts C/E need no prior LA/mUC therapy.)
  Reviewer verdict: [ ]

- v107 NCT05562830 A Substudy of Investigational Agents in Programmed Cell Death-1/Ligand 1 (PD-1/L1) Refractory Locally Advanced
  judge-a: **eligible** - I2 met: "Histologically or cytologically confirmed diagnosis of locally advanced/unresectable or mUC of the renal pelvis, ureter (upper urinary tract), bladder, or urethra." / I3 met: "Arm A: PD-1/L1 refractory locally advanced or mUC as evidenced by: EITHER disease progression while on treatment or after treatment with an anti-PD-1/L1 monoclonal antibody (mAb) for locally advanced/unresectable or mUC" / E1 met: "Known additional nonurothelial malignancy that is progressing or has required active treatment within 3 years prior to study randomization/allocation." (PD-1-refractory renal pelvis mUC; colon cancer was 12 years ago; no performance-status cutoff listed.)
  Reviewer verdict: [ ]

- v107 NCT06971614 A Study of T3011 in Patients With BCG-Unresponsive NMIBC or BCG-Exposed, Chemotherapy-Unresponsive NMIBC
  judge-a: **excluded** - E3 not_met: "Concurrent or prior history of muscle-invasive (muscularis propria) or metastatic bladder cancer." / I4 not_met: "Participants with a histologically confirmed diagnosis of NMIBC (Ta, T1 and/or Cis)." (NMIBC trial; he has metastatic upper-tract UC.)
  Reviewer verdict: [ ]

- v107 NCT07030257 Study of CP-383 in Patients With Advanced or Metastatic Solid Tumors
  judge-a: **possibly** - I5 met: "Part 1: any solid tumor (with the exception of brain cancer) that has progressed, standard therapy is no longer or has not helped the cancer" / I2 unknown: "Not eligible or able to take existing standard therapies for cancer" / E7 unknown: "Significant cardiac disease" (Part 1 any refractory solid tumor; standard options largely used up after 4 lines; cardiac disease significance unknown.)
  Reviewer verdict: [ ]

- v107 NCT07106762 Phase 2/3 Trial of Izalontamab Brengitecan vs Platinum-based Chemotherapy for Metastatic Urothelial Cancer Wit
  judge-a: **excluded** - I6 not_met: "Participants must have Eastern Cooperative Oncology Group (ECOG) Performance Status 0-1." / E2 not_met: "Participants must not have received >2 prior regimens irrespective of the setting." (Post-ICI mUC trial capped at 2 prior regimens with ECOG 0-1; he has 4 lines and ECOG 2.)
  Reviewer verdict: [ ]

- v108 NCT04510597 Comparing the Outcome of Immunotherapy-Based Drug Combination Therapy With or Without Surgery to Remove the Ki
  judge-a: **not_relevant** - I1 not_met: "Participants must have a histologically proven diagnosis of clear cell or non-clear cell renal cell carcinoma." (Metastatic renal cell carcinoma nephrectomy trial; she has bladder urothelial cancer.)
  judge-b: **not_relevant** - I1 not_met: "Participants must have a histologically proven diagnosis of clear cell or non-clear cell renal cell carcinoma."
  Reviewer verdict: [ ]

- v108 NCT05327686 Testing the Addition of Stereotactic Radiation Therapy With Immune Therapy for the Treatment of Patients With 
  judge-a: **not_relevant** - I1 not_met: "Pathologically (histologically or cytologically) proven diagnosis of renal cell carcinoma prior to registration" (Metastatic renal cell carcinoma trial; she has bladder urothelial cancer.)
  judge-b: **not_relevant** - I1 not_met: "Pathologically (histologically or cytologically) proven diagnosis of renal cell carcinoma prior to registration"
  Reviewer verdict: [ ]

- v109 NCT03866382 Testing the Effectiveness of Two Immunotherapy Drugs (Nivolumab and Ipilimumab) With One Anti-cancer Targeted 
  judge-a: **excluded** - I1 not_met: "Metastatic disease defined as new or progressive lesions on cross-sectional imaging or bone scan." (Metastatic rare GU histology trial; she has conventional urothelial MIBC with pelvic nodes only, no distant spread.)
  judge-b: **excluded** - I1 not_met: "Metastatic disease defined as new or progressive lesions on cross-sectional imaging or bone scan." (Non-metastatic conventional urothelial MIBC.)
  Reviewer verdict: [ ]

- v109 NCT07129252 A Study to Investigate Safety and Effectiveness of CRN09682 in Participants With SST2-Expressing NENs and Othe
  judge-a: **excluded** - I1 not_met: "Have a histological diagnosis of metastatic or locally advanced inoperable NET, NEC, or other solid tumors that have confirmed radiological progression." / I3 unknown: "Have a tumor that expresses SSR confirmed by SSR imaging." (SST2 radioligand/ADC trial for inoperable progressing tumors; her MIBC is untreated and planned for surgery.)
  judge-b: **excluded** - I1 not_met: "Have a histological diagnosis of metastatic or locally advanced inoperable NET, NEC, or other solid tumors that have confirmed radiological progression." / I3 unknown: "Have a tumor that expresses SSR confirmed by SSR imaging."
  Reviewer verdict: [ ]

- v110 NCT04752722 LEGEND Study: EG-70 in NMIBC Patients BCG-Unresponsive and High-Risk NMIBC Incompletely Treated With BCG or BC
  judge-a: **possibly** - I2 unknown: "BCG-unresponsive NMIBC with carcinoma in situ (CIS) with or without coexisting papillary Ta/T1 tumors who are ineligible for or have elected not to undergo cystectomy" / E12 unknown: "Evidence of metastatic disease." / E16 met: "Known human immunodeficiency virus, Hepatitis B, or Hepatitis C infection." (Intravesical gene therapy for high-risk NMIBC; his stage, BCG history and spread are unknown.)
  Reviewer verdict: [ ]

- v110 NCT04939610 A Study of 177Lu-FAP-2286 in Advanced Solid Tumors
  judge-a: **possibly** - I12 unknown: "Tumor must be refractory to or have progressed following prior treatment and have no satisfactory alternative treatment options." / I6 unknown: "Estimated glomerular filtration rate (eGFR) ≥ 60 mL/min using the Cockcroft Gault formula." / I7 unknown: "Have an Eastern Oncology Group (ECOG) performance status of 0 or 1." (FAP radioligand phase 1 for refractory advanced solid tumors; disease status, kidney function with one kidney and ECOG are unknown.)
  Reviewer verdict: [ ]

- v110 NCT05297734 Comparative Effectiveness Trial of Two Supportive Cancer Care Delivery Models for Adults With Cancer
  judge-a: **possibly** - I1 unknown: "Newly diagnosed patients with solid tumor cancer diagnosis or recurrence of the disease." (Supportive care delivery study for newly diagnosed or recurrent solid tumors; when he was diagnosed and whether it recurred is unknown.)
  Reviewer verdict: [ ]

- v111 NCT03740256 Binary Oncolytic Adenovirus in Combination With HER2-Specific Autologous CAR VST, Advanced HER2 Positive Solid
  judge-a: **possibly** - I20 unknown: "Histologically confirmed advanced refractory HER2 positive solid tumors" / I22 met: "Disease must have progressed after standard first line therapy, or without available effective treatment options." / I33 unknown: "CNS metastasis requiring continuous high-dose steroids (more than 10mg/day prednisone or equivalent dose) or other active therapeutic intervention." (HER2 CAR-T plus oncolytic virus basket that includes bladder cancer; he progressed on first-line therapy but HER2 IHC is not reported and his untreated brain lesions may need intervention.)
  Reviewer verdict: [ ]

- v111 NCT05614739 FORAGER-1: A Study of Vepugratinib (LY3866288; LOXO-435) in Participants With Cancer With a Change in a Gene C
  judge-a: **excluded** - E2 not_met: "Untreated or uncontrolled CNS metastases." / I2 unknown: "Urothelial cancer (UC) that is locally advanced or metastatic with a qualifying FGFR3 genetic alteration." (FGFR3 inhibitor trial excludes untreated CNS metastases; FGFR3 status is also untested.)
  Reviewer verdict: [ ]

- v111 NCT06262516 Nephroureterectomy With and Without Lymph Node Dissection for Upper Tract Urothelial Cell Carcinoma
  judge-a: **not_relevant** - I2 not_met: "Diagnosis of UTUC as determined by upper tract biopsy (either low or high grade)" (Surgical lymph node dissection study during nephroureterectomy for upper tract UC; a procedure he is not having.)
  Reviewer verdict: [ ]

- v111 NCT06335667 mpMRI Compared to Diagnostic TURBT in Patients With Suspected Muscle-Invasive Bladder Cancer
  judge-a: **excluded** - I2 not_met: "Suspected muscle-invasive bladder cancer by tumor appearance on initial routine cystoscopy" / E2 not_met: "Prior therapy for bladder cancer within 180 days of study entry." (Diagnostic MRI-versus-TURBT study for newly suspected MIBC; he has known metastatic disease on systemic therapy.)
  Reviewer verdict: [ ]

- v111 NCT06439836 Pembrolizumab Plus CA-4948 for the Treatment of Patients With Progressive Metastatic Urothelial Cancer Despite
  judge-a: **excluded** - I20 met: "Must have received prior treatment with a PD-1 or PD-L1 inhibitor" / I24 met: "Progression within ≤ 12 months of initiating treatment" / I29 not_met: "Patients with previously treated brain metastases may participate provided they are stable" (PD-1-resistant mUC trial he fits on prior EV + pembrolizumab and progression within 8 months, but only previously treated, stable, steroid-free brain metastases are allowed; his are untreated.)
  Reviewer verdict: [ ]

- v111 NCT06524544 A Study Comparing the Combination of Pembrolizumab and Sacituzumab Govitecan-hziy Versus Standard of Care in t
  judge-a: **excluded** - I11 met: "Patient must have received prior enfortumab vedotin or any other Nectin-4 directed therapy or other MMAE-containing therapy in any disease/therapy setting unless contraindicated per physician" / I6 met: "Patient must have had progression on or after the immediate prior anti-cancer therapy" / I32 not_met: "Patients with treated brain metastases are eligible if follow-up brain imaging after central nervous system (CNS)-directed therapy shows no evidence of progression" (Post-EV + pembrolizumab SG + pembrolizumab trial he fits on prior therapy, progression and Bellmunt score, but only treated, non-progressing brain metastases are allowed; his are untreated.)
  Reviewer verdict: [ ]

- v111 NCT06704191 In-home Intravesical Chemotherapy for the Treatment of Bladder Cancer, INVITE Trial
  judge-a: **excluded** - I3 not_met: "PHASE II ONLY: Female or male patients with histologically confirmed non-muscle invasive bladder cancer (stage Ta, Tis or T1) who are receiving maintenance therapy with an eligible regimen" / E2 not_met: "Actively receiving any other treatment for cancer" (In-home intravesical therapy study for NMIBC; he has metastatic UC on systemic therapy.)
  Reviewer verdict: [ ]

- v111 NCT06971614 A Study of T3011 in Patients With BCG-Unresponsive NMIBC or BCG-Exposed, Chemotherapy-Unresponsive NMIBC
  judge-a: **excluded** - E3 not_met: "Concurrent or prior history of muscle-invasive (muscularis propria) or metastatic bladder cancer." / E6 not_met: "A history of brain metastasis or imaging-confirmed brain metastasis" (NMIBC trial; he has metastatic UC with brain metastases.)
  Reviewer verdict: [ ]

- v111 NCT07106762 Phase 2/3 Trial of Izalontamab Brengitecan vs Platinum-based Chemotherapy for Metastatic Urothelial Cancer Wit
  judge-a: **excluded** - I3 met: "Participants must be Anti-PD-(L)1-experienced (in locally advanced or metastatic setting)" / E5 not_met: "Participants must not have active, untreated brain metastases." (Post-immunotherapy mUC trial he otherwise fits, but his three brain metastases are untreated.)
  Reviewer verdict: [ ]

- v111 NCT07129993 Study of Datopotamab Deruxtecan Plus Carboplatin or Cisplatin Versus Gemcitabine Plus Carboplatin or Cisplatin
  judge-a: **eligible** - I14 met: "Must have experienced radiographic progression or relapse during or after 1L of EV (or other agents with a vedotin payload) and pembrolizumab (or other PD-1/PD-L1 inhibitors)." / I5 met: "Must be considered eligible to receive cisplatin- or carboplatin-containing chemotherapy, in the investigator's judgment." / E1 met: "Has had prior systemic therapy other than the combination of EV and pembrolizumab for la/mUC." (Second-line Dato-DXd + platinum after progression on first-line EV + pembrolizumab; he is platinum-naive and fit; no CNS criterion is listed.)
  Reviewer verdict: [ ]

- v111 NCT07664397 Imaging Study of [89Zr]DFO-YS5 for Cancer Detection
  judge-a: **eligible** - I1 met: "Histological or cytological confirmation of malignant peripheral nerve sheath tumor, bladder cancer, or solid tumor neoplasm." / I2 met: "At least one soft tissue lesion measurable at 1 cm or greater in short axis measurement on cross sectional imaging" / I5 met: "Eastern Cooperative Oncology Group (ECOG) performance status of ≤ 2" (PET imaging agent study for bladder cancer with a measurable lesion; he has measurable liver and lung metastases.)
  Reviewer verdict: [ ]

- v112 NCT04939610 A Study of 177Lu-FAP-2286 in Advanced Solid Tumors
  judge-a: **excluded** - I12 not_met: "a. Tumor must be refractory to or have progressed following prior treatment and have no satisfactory alternative treatment options." / I14 not_met: "a. Pancreatic Cancer monotherapy group: i. Pancreatic ductal adenocarcinoma" (Phase 1 needs refractory disease with no alternatives; phase 2 groups are pancreatic, NSCLC and breast only. He is untreated ccRCC.)
  Reviewer verdict: [ ]

- v112 NCT07196644 A Study to Assess Adverse Events and Change in Disease Activity in Participants 12 Years of Age or Older With 
  judge-a: **excluded** - I4 not_met: "Received prior systemic therapy appropriate for their tumor type and stage of disease and who have no satisfactory alternative therapy" / I1 unknown: "Locally advanced/metastatic solid tumors with documented MET amplification" (Requires prior systemic therapy with no satisfactory alternative; he is untreated. MET amplification untested.)
  Reviewer verdict: [ ]

- v112 NCT07226349 A Study of BG-75098 Alone and in Combination With Other Agents in Adults With Advanced Solid Tumors
  judge-a: **excluded** - I4 not_met: "Participants should have received prior treatment with available standard-of-care (SOC) systemic therapies for advanced/metastatic disease, or for whom standard therapy is not available or not tolerated." / I5 not_met: "Patients with histologically or cytologically confirmed advanced, metastatic, or unresectable solid tumors who have received ≥ 1 prior line of systemic therapy in the metastatic setting." (All parts need prior systemic therapy (or CDK4/6/platinum exposure); he is untreated with standard options.)
  Reviewer verdict: [ ]

- v112 NCT07269080 STM-06: POLARIS-POlymetastic Lesion Ablative Radiotherapy With Immunotherapy Study
  judge-a: **excluded** - I10 not_met: "Subjects receiving treatment for >3 months with an FDA-approved immunotherapy agent" (Ablative RT added to ongoing immunotherapy (>3 months); he has not started treatment.)
  Reviewer verdict: [ ]

- v113 NCT03435796 Long-Term Follow-up Protocol for Participants Treated With Gene-Modified T Cells
  judge-a: **not_relevant** - I1 not_met: "Received at least one gene-modified (GM) T-cell infusion" (Long-term follow-up for prior gene-modified T-cell recipients; she never had one.)
  Reviewer verdict: [ ]

- v113 NCT05687110 Studying the Safety and Determining the Optimal Dose of Novobiocin in Patients With Tumors That Have Alteratio
  judge-a: **excluded** - I1 not_met: "for which standard curative or palliative measures do not exist or are no longer effective" / I2 unknown: "Patients must have histologically confirmed solid tumor with a known pathogenic mutation in BRCA1/2, PALB2, RAD51C, RAD51D, ATM" (Further standard palliative RCC options remain (as v104-1); DNA-repair mutation status also unknown.)
  Reviewer verdict: [ ]

- v113 NCT06270706 A Phase 1 Study of PLN-101095 in Adults With Advanced or Metastatic Solid Tumors
  judge-a: **eligible** - I2 met: "Have received ≥12 weeks of continuous anti-PD-1 or anti-PD-L1 treatment administered as monotherapy or in combination with other anticancer therapies" / I4 met: "Must have subsequently developed radiographic disease progression while receiving anti-PD-1 or anti-PD-L1 treatment" / I5 met: "At least 1 measurable lesion, as defined by RECIST v1.1" (Ipilimumab/nivolumab worked about 14 months then progressed; meets acquired-resistance anti-PD-1 entry.)
  Reviewer verdict: [ ]

- v113 NCT06551142 A Study of GSK5764227 in Participants With Advanced Solid Tumors (EMBOLD)
  judge-a: **possibly** - I5 not_met: "For monotherapy dose escalation: participants must have progressed on or become intolerant to all available SOC therapies." / I6 met: "For combination dose escalation: participants must have received 3 or fewer prior lines of systemic anticancer therapy in the advanced/metastatic setting" / E3 met: "Primary brain tumor or evidence of brain metastasis (unless meeting the following criteria at the same time: asymptomatic; medically stable for at least 4 weeks prior to initial dosing" (Monotherapy arm needs all SOC exhausted (other RCC options remain); combination arm allows up to 3 prior lines. Partial fit.)
  Reviewer verdict: [ ]

- v113 NCT06554795 First-in-human Study of DB-1419 for Advanced/Metastatic Solid Tumors
  judge-a: **eligible** - I2 met: "Histologically or cytologically confirmed unresectable advanced/metastatic solid tumor that has relapsed or progressed on or after standard systemic treatments" / I10 met: "Note: there is no minimum B7-H3 expression level mandatory for entry into the study." / E12 met: "Participants with asymptomatic CNS metastases who are radiologically and neurologically stable for at least 4 weeks following CNS-directed therapy" (Progressed on standard therapy; treated stable brain metastasis allowed.)
  Reviewer verdict: [ ]

- v113 NCT07129252 A Study to Investigate Safety and Effectiveness of CRN09682 in Participants With SST2-Expressing NENs and Othe
  judge-a: **possibly** - I1 met: "Have a histological diagnosis of metastatic or locally advanced inoperable NET, NEC, or other solid tumors that have confirmed radiological progression." / I3 unknown: "Have a tumor that expresses SSR confirmed by SSR imaging." (SST2-directed therapy open to other progressing solid tumors; SSR imaging not done.)
  Reviewer verdict: [ ]

- v113 NCT07136779 First-in-Human Trial of VBC101 in Participants With Advanced Solid Tumor Malignancies
  judge-a: **eligible** - I3 met: "Histologically or cytologically confirmed unresectable advanced/metastatic solid tumor that has relapsed or progressed on or after standard systemic treatments" / I6 met: "5. ECOG performance status 0-1" / E2 met: "unless the condition has been treated, asymptomatic, and has been stable" (Progressed on standard therapy; treated stable brain metastasis allowed; no stated fact fails.)
  Reviewer verdict: [ ]

- v114 NCT05176483 Study of Zanzalintinib in Combination With Immuno-Oncology or Other Agents in Participants With Solid Tumors
  judge-a: **excluded** - I14 not_met: "No prior systemic anticancer therapy is allowed except adjuvant or neoadjuvant therapy if disease recurrence occurred at least 6 months after the last dose." / I2 not_met: "for which life-prolonging therapies do not exist or available therapies are intolerable or no longer effective" (Papillary RCC cohort 6 is first-line only (she had cabozantinib); other nccRCC options remain for escalation; other RCC cohorts are clear cell.)
  Reviewer verdict: [ ]

- v114 NCT05433142 Study of XmAb®819 in Subjects With Advanced Clear Cell Renal Cell Carcinoma
  judge-a: **eligible** - I2 met: "Subjects who have relapsed and refractory ccRCC, pRCC, NSCLC, and CRC with evidence of disease progression on standard-of-care therapies" / I3 met: "ECOG performance status of 0 or 1." / E6 met: "residual hypothyroidism due to an autoimmune condition that is treatable with hormone replacement therapy only" (Papillary RCC progressing on cabozantinib is named; Hashimoto's on levothyroxine is an allowed exception.)
  Reviewer verdict: [ ]

- v114 NCT06026410 KO-2806 Monotherapy and Combination Therapies in Advanced Solid Tumors
  judge-a: **possibly** - I3 met: "non-clear cell RCC patients who are either treatment-naïve or have received any prior systemic treatment for locally advanced and metastatic RCC" / I5 met: "Karnofsky Performance Status of 70 or higher" / E6 unknown: "Active or prior documented autoimmune or inflammatory disorders within the past 5 years prior to Cycle 1 Day 1 (with exceptions)." (Non-clear-cell RCC combination arm fits after cabozantinib; whether Hashimoto's on levothyroxine falls under the unlisted exceptions is unknown.)
  Reviewer verdict: [ ]

- v114 NCT06234098 Study to Investigate the Safety, Tolerability, Pharmacokinetics, Pharmocodynamics and Preliminary Antitumor Ac
  judge-a: **eligible** - I1 met: "The patient has a histologically or cytologically confirmed unresectable or metastatic solid tumor that is refractory to standard therapy" / I5 met: "The patient has an ECOG performance status of 0 to 2." / E11 met: "Endocrinopathy, unless on stable hormone replacement therapy." (Progressing on cabozantinib; Hashimoto's on stable levothyroxine allowed; no stated fact fails.)
  Reviewer verdict: [ ]

- v114 NCT06959706 Study Evaluating the Safety, Tolerability, Pharmacokinetics, and Preliminary Efficacy of TGW101 in Participant
  judge-a: **not_relevant** - I3 not_met: "Histologically or cytologically confirmed diagnosis of a solid tumor malignancy listed below" (Tumor list (breast, prostate, cervical, endometrial, esophageal, gastric, non-squamous head and neck, lung adenocarcinoma, ovarian) omits renal cell carcinoma.)
  Reviewer verdict: [ ]

- v114 NCT07011719 Study of Casdatifan and Cabozantinib Versus Placebo and Cabozantinib in Patients With Advanced Clear Cell Rena
  judge-a: **excluded** - I1 not_met: "Unresectable and measurable locally advanced or metastatic renal cell carcinoma with a primary clear cell component." / E1 not_met: "Received prior treatment with a HIF-2α inhibitor or cabozantinib." (Clear cell RCC only, and prior cabozantinib excluded; she has papillary RCC on cabozantinib.)
  Reviewer verdict: [ ]

- v117 NCT03866382 Testing the Effectiveness of Two Immunotherapy Drugs (Nivolumab and Ipilimumab) With One Anti-cancer Targeted 
  judge-a: **excluded** - I6 not_met: "Karnofsky performance status >= 80%" / I15 not_met: "However, prior cabozantinib will not be allowed." / I16 not_met: "No prior treatment with any therapy on the PD-1/PD-L1 axis or anti- CTLA-4/CTLA-4 inhibitors" / I2 met: "Translocation positive renal cell carcinoma patients are eligible." (Translocation RCC is an eligible histology, but ECOG 2 fails KPS >= 80 and prior cabozantinib and nivolumab are barred.)
  Reviewer verdict: [ ]

- v117 NCT05665361 Palbociclib and Sasanlimab for the Treatment of Advanced Clear Cell Renal Cell Carcinoma (ccRCC) or Papillary 
  judge-a: **excluded** - I2 not_met: "Cytologically or histologically confirmed clear cell renal cell carcinoma (presence of a clear cell component) (ccRCC) (Cohort 1) or papillary renal cell carcinoma (pRCC) (presence of a papillary component) (Cohort 2)" / I7 not_met: "ECOG performance status <= 1" (Clear cell or papillary cohorts only, and ECOG 2 fails ECOG <= 1.)
  Reviewer verdict: [ ]

- v117 NCT06138067 Patient Navigation Program to Improve Clinical Trial Enrollment in Cancer Patients
  judge-a: **not_relevant** - I2 met: "prostate cancer and kidney cancer" / I3 unknown: "Being seen at the Sidney Kimmel Comprehensive Cancer Center (SKCCC) at Johns Hopkins University (JHU) or Wellspan Health Center" (Patient navigation program, not a treatment study.)
  Reviewer verdict: [ ]

- v117 NCT06242470 A Study of MGC026 in Participants With Advanced Solid Tumors
  judge-a: **excluded** - E10 not_met: "Known positive testing for human immunodeficiency virus or history of acquired immune deficiency syndrome." / I4 met: "renal cell cancer or hepatocellular cancer." (RCC is in the tumor list, but known HIV (even if controlled) is excluded.)
  Reviewer verdict: [ ]

- v117 NCT06794229 Neoadjuvant Zanzalintinib Plus Nivolumab in Patients With Locally Advanced and/or Inoperable Clear Cell Renal 
  judge-a: **excluded** - E1 not_met: "Non-clear cell histology." / E3 not_met: "Prior systemic therapy, including zanzalintinib, nivolumab" (Neoadjuvant clear cell RCC trial; non-clear-cell histology and prior nivolumab/TKIs.)
  Reviewer verdict: [ ]

- v117 NCT07383441 Adding Biotherapy or Placebo to Standard Treatment for Advanced Kidney Cancer
  judge-a: **excluded** - I1 not_met: "Participants must have histologically confirmed renal cell carcinoma (RCC) with clear cell component" / I7 not_met: "Participants must not have had prior systemic therapy for advanced or metastatic RCC or any treatment with immune based combination therapy" (First-line clear cell RCC trial; he is non-clear-cell with 4 prior lines.)
  Reviewer verdict: [ ]

- v117 NCT07401875 A Phase 1b Study of HC-7366, an Agonist of ISR With Immunotherapy in Kidney Cancer (SHARK)
  judge-a: **excluded** - I4 not_met: "Confirmed diagnosis of clear cell RCC" / I8 not_met: "Eastern Cooperative Oncology Group (ECOG) performance status of 0 or 1" / E3 not_met: "No more than 3 prior lines of systemic therapy allowed" (Clear-cell-only, ECOG 0-1, max 3 lines; he fails all three.)
  Reviewer verdict: [ ]

- v117 NCT07564232 Phase 1 Study Of LNK001 In Advanced Or Metastatic Clear Cell Renal Cell Carcinoma
  judge-a: **excluded** - I1 not_met: "metastatic/advanced RCC with a clear cell component" / I5 not_met: "ECOG performance status ≤ 1." (CAIX CAR-T for clear cell RCC; translocation RCC and ECOG 2 rule him out.)
  Reviewer verdict: [ ]

- v117 NCT07748988 Casdatifan for the Treatment of Refractory Metastatic Clear Cell Renal Cell Carcinoma
  judge-a: **excluded** - I4 not_met: "Histologically confirmed metastatic clear cell renal cell carcinoma (ccRCC)" / I5 met: "Patients must have received at least one immune oncology (IO) agent and at least one VEGF-targeted therapy" (Clear-cell-only trial; translocation RCC fails the histology criterion (subtype rule).)
  Reviewer verdict: [ ]

- v119 NCT04221893 Radiation Therapy for the Treatment of Metastatic Gastrointestinal Cancers
  judge-a: **excluded** - I2 not_met: "Patients must be receiving immunotherapy (checkpoint inhibitor or CTLA4 inhibitor) with overall response of progressive disease by RECIST criteria." / I1 not_met: "metastatic gastrointestinal (GI) malignancy (esophageal, gastroesophageal, gastric, small intestine, hepatocellular" (Palliative RT for metastatic GI cancers progressing on immunotherapy; he is untreated with no distant spread.)
  Reviewer verdict: [ ]

- v119 NCT06431594 A Study to Evaluate the Safety,Tolerability, Pharmacokinetics and Clinical Activity of Mocertatug Rezetecan fo
  judge-a: **excluded** - I2 not_met: "Participants with pathologically confirmed advanced solid tumor (who have failed or are intolerant to standard of care." (Solid-tumor escalation requires failure of standard therapy (expansion is ovarian/endometrial); he is untreated.)
  Reviewer verdict: [ ]

- v119 NCT07213791 A Study of LY4337713 in Participants With FAP-Positive Solid Tumors
  judge-a: **excluded** - I5 not_met: "Participants must have advanced or metastatic solid tumors and have received ≥1 prior line of therapy." / I1 unknown: "Must have clinical or imaging evidence of fibroblast activation protein (FAP) expression" (Phase 1a tumor list omits HCC; Phase 1b takes any advanced solid tumor but needs >= 1 prior line, and he is untreated.)
  Reviewer verdict: [ ]

- v120 NCT03816345 Testing an Immunotherapy Anti-cancer Drug, Nivolumab, for Advanced Cancers in Patients With Autoimmune Disorde
  judge-a: **excluded** - E3 not_met: "Patients with prior therapy with an anti-PD-1 or anti-PD-L1" (She is receiving durvalumab (anti-PD-L1); AIM-NIVO excludes prior PD-1/PD-L1 therapy.)
  Reviewer verdict: [ ]

- v120 NCT03907475 Durvalumab in Combination With Chemotherapy in Treating Patients With Advanced Solid Tumors, DURVA+ Trial
  judge-a: **excluded** - I1 not_met: "solid tumors whose disease has progressed following at least one line of standard therapy and/or no standard of treatment exists that has been shown to prolong survival" (Needs progression after standard therapy; her disease is stable on first-line gem/cis/durvalumab.)
  Reviewer verdict: [ ]

- v120 NCT04585750 The Evaluation of PC14586 in Patients With Advanced Solid Tumors Harboring a TP53 Y220C Mutation (PYNNACLE)
  judge-a: **excluded** - I4 not_met: "Previously treated with one or more lines of anticancer therapy and progressive disease" / I2 unknown: "Locally advanced or metastatic solid malignancy with a TP53 Y220C mutation" (Requires progressive disease after prior therapy; she is stable on first line. TP53 status not reported.)
  Reviewer verdict: [ ]

- v120 NCT05286814 PDS01ADC in Combination With Hepatic Artery Infusion Pump (HAIP) and Systemic Therapy for Subjects With Metast
  judge-a: **excluded** - I22 not_met: "Participants must have histologically or cytologically confirmed diagnosis of intrahepatic cholangiocarcinoma confined to the liver (Cohort 2)." / I26 met: "Participants must have received 1st line systemic chemotherapy." (ICC cohort needs liver-confined disease; she has abdominal nodal and lung spread.)
  Reviewer verdict: [ ]

- v120 NCT05503797 A Study to Assess the Efficacy and Safety of FORE8394 in Participants With Cancer Harboring BRAF Alterations
  judge-a: **possibly** - I29 unknown: "Histologic diagnosis of a solid tumor harboring a BRAF V600E mutation and not eligible for other subprotocols." / I31 unknown: "Evidence of BRAF V600E mutation in tumor and/or blood detected by genomic tests." / I30 met: "Measurable disease on CT, MRI, or physical exam." (Subprotocol D has no prior-therapy rule; BRAF status not reported (only IDH1 R132C named).)
  Reviewer verdict: [ ]

- v120 NCT05849480 A Study of CDX-1140, a CD40 Agonist, in Combination With Capecitabine and Oxaliplatin (CAPOX) and Keytruda in 
  judge-a: **excluded** - I2 not_met: "Participants should have progressed on standard of care first line systemic treatment or refused standard treatment." (Second-line BTC trial; she is stable on first-line therapy and has not refused it.)
  Reviewer verdict: [ ]

- v120 NCT06293898 Open Label Study to Evaluate BL-M07D1 in HER2 Expressing Malignant Solid Tumors
  judge-a: **excluded** - I6 not_met: "has received at least 2 lines of standard therapy, including adjuvant/neoadjuvant treatment, or whose cancer is considered refractory to the standard of care or for which no standard treatment is available" / I7 unknown: "Cohort 5: Participants with HER2 expression in biliary tract cancers" (Biliary cohort needs >= 2 lines or refractory disease; she is on her first line and stable. HER2 status not tested.)
  Reviewer verdict: [ ]

- v120 NCT06726161 Study of the Theranostic Pair RYZ811 (Diagnostic) and RYZ801 (Therapeutic) to Identify and Treat Subjects With
  judge-a: **not_relevant** - I2 not_met: "Histologically/cytologically confirmed diagnosis of HCC." (GPC3 theranostic for HCC; she has cholangiocarcinoma.)
  Reviewer verdict: [ ]

- v120 NCT07087054 Carcinoid Syndrome Efficacy Study Featuring an Oral Daily Paltusotine Regimen
  judge-a: **not_relevant** - I5 not_met: "Evaluable documentation of locally advanced or metastatic histopathologically confirmed well-differentiated neuroendocrine tumor(s) [NETs]." (Carcinoid syndrome / NET study; she has cholangiocarcinoma.)
  Reviewer verdict: [ ]

- v120 NCT07213791 A Study of LY4337713 in Participants With FAP-Positive Solid Tumors
  judge-a: **possibly** - I3 met: "Cholangiocarcinoma" / I5 met: "Participants must have received greater than or equal to (≥)1 prior line of systemic therapy for advanced or metastatic disease; including prior line(s) in combination with immunotherapy" / I1 unknown: "Must have clinical or imaging evidence of fibroblast activation protein (FAP) expression per local assessment" (Cholangiocarcinoma cohort needs >= 1 prior line (no progression clause); she is on first-line gem/cis/durvalumab. FAP expression not tested.)
  Reviewer verdict: [ ]

- v122 NCT05486572 Preventing Liver Cancer Mortality Through Imaging With Ultrasound vs. MRI
  judge-a: **not_relevant** - I1 not_met: "Cirrhosis due to any underlying etiology diagnosed by one or more of the following:" (HCC surveillance study for people with cirrhosis.)
  Reviewer verdict: [ ]

- v122 NCT05824975 A Study to Evaluate the Safety and Therapeutic Activity of GI-102 As a Single Agent and in Combination with Co
  judge-a: **excluded** - I3 not_met: "Measurable disease as per RECIST v1.1." (Advanced solid-tumor trial needing measurable disease; she has no residual cancer.)
  Reviewer verdict: [ ]

- v122 NCT07265674 A Study to Select a Dose Regimen (Part A) and to Investigate Overall Survival (Part B) With Nanvuranlat Compar
  judge-a: **excluded** - I6 not_met: "Cancer must be metastatic, locally advanced and unresectable, or not amenable to treatment with local therapies that could offer a reasonable likelihood of clinical benefit." / I9 not_met: "Has received 1 prior appropriate platinum (cisplatin, carboplatin, or oxaliplatin)-based therapy for advanced disease" (Second-line advanced BTC trial; she is resected, on adjuvant capecitabine, with no platinum for advanced disease.)
  Reviewer verdict: [ ]

- v124 NCT03259867 Combination of TATE and PD-1 Inhibitor in Liver Cancer
  judge-a: **not_relevant** - I1 not_met: "Patients with a confirmed diagnosis of (1) advanced HCC or (2) metastatic gastric cancer." (HCC or gastric cancer only; she has cholangiocarcinoma.)
  Reviewer verdict: [ ]

- v124 NCT05482893 Spevatamig (PT886) as Monotherapy or in Combination With Chemo and/or Targeted Therapy and/or ICI, for the Tre
  judge-a: **excluded** - I5 not_met: "ECOG performance status of 0 or 1." / I3 met: "biliary tract or pancreatic carcinomas previously treated for advanced (metastatic or unresectable) disease" (Part A takes pretreated BTC, but ECOG 2 fails ECOG 0-1.)
  Reviewer verdict: [ ]

- v124 NCT06001658 Perioperative Gemcitabine, Cisplatin, and Pembrolizumab in Potentially Resectable Biliary Tract Cancers
  judge-a: **excluded** - I2 not_met: "Resectable BTC (biliary tract cancer)" / E1 not_met: "Receiving, or previously received, any systemic chemotherapy, or investigational agent for BTC." (Perioperative therapy for newly diagnosed resectable BTC; she is metastatic after three lines.)
  Reviewer verdict: [ ]

- v124 NCT06526104 Study of Tremelimumab and Durvalumab (MEDI4736) (T300+D) in Advanced Hepatocellular Carcinomas With Child-Pugh
  judge-a: **not_relevant** - I1 not_met: "Patients diagnosed with HCC" (HCC with Child-Pugh B cirrhosis; she has cholangiocarcinoma (entity rule).)
  Reviewer verdict: [ ]

- v124 NCT06915753 Safety and Preliminary Anti-Tumor Activity of TYRA-430 in Advanced Hepatocellular Carcinoma and Other Solid Tu
  judge-a: **excluded** - I3 not_met: "Eastern Cooperative Oncology Group (ECOG) performance status of ≤1." / I8 met: "histologically confirmed advanced solid tumor with documented FGF/FGFR pathway alterations" / I11 met: "Any number of prior therapies, including FGFR inhibitors, are permitted." (FGFR2 fusion and prior pemigatinib fit Part A, but ECOG 2 (rests part of the day) fails ECOG <= 1.)
  Reviewer verdict: [ ]

- v124 NCT07087054 Carcinoid Syndrome Efficacy Study Featuring an Oral Daily Paltusotine Regimen
  judge-a: **not_relevant** - I5 not_met: "histopathologically confirmed well-differentiated neuroendocrine tumor(s) [NETs]" (Carcinoid syndrome in neuroendocrine tumors; she has cholangiocarcinoma.)
  Reviewer verdict: [ ]

- v124 NCT07146646 Trifluridine/Tipiracil + Oxaliplatin in Participants With Advanced or Metastatic Biliary Tract Cancer
  judge-a: **excluded** - I2 not_met: "Participants must have received only one line of systemic therapy for advanced or metastatic BTCs." / E5 not_met: "Prior treatment with FTD/TPI or oxaliplatin." / I5 not_met: "ECOG performance status of 0 or 1." (Second-line only, oxaliplatin-naive; she had FOLFOX and three lines, ECOG 2.)
  Reviewer verdict: [ ]

- v124 NCT07174570 Celecoxib, Durvalumab and Tremelimumab for the Treatment of Patients With Advanced or Metastatic Liver Cancer
  judge-a: **not_relevant** - I1 not_met: "Histologically or cytologically confirmed hepatocellular cancer (HCC)" (HCC only.)
  Reviewer verdict: [ ]

- v125 NCT05176483 Study of Zanzalintinib in Combination With Immuno-Oncology or Other Agents in Participants With Solid Tumors
  judge-a: **possibly** - I15 unknown: "HCC that is not amenable to curative treatment or locoregional therapy" / E8 unknown: "Concomitant anticoagulation with oral anticoagulants, except for specified direct factor Xa inhibitors." / I29 met: "Karnofsky Performance Status (KPS) ≥ 70%." (HCC expansion cohort; whether his residual lesion is still amenable to locoregional/curative therapy is not stated, and whether apixaban is an allowed factor Xa inhibitor is unknown.)
  Reviewer verdict: [ ]

- v125 NCT06084234 National Liver Cancer Screening Trial
  judge-a: **not_relevant** - E3 not_met: "History or clinical symptoms of hepatocellular carcinoma or cholangiocarcinoma" (HCC screening in cirrhosis without cancer.)
  Reviewer verdict: [ ]

- v125 NCT07335497 CR-001 in Adult Participants With Locally Advanced or Metastatic Solid Tumors
  judge-a: **excluded** - I7 not_met: "progressing from, intolerant to, or ineligible for (due to unavailability or contraindication) local standard of care therapies" / I8 met: "Hepatocellular carcinoma" / I2 met: "Eastern Cooperative Oncology Group (ECOG) performance status score of 0 - 1" (HCC is a listed tumor, but he has not progressed on systemic SoC (resection and Y-90 only) and first-line systemic therapy remains available.)
  Reviewer verdict: [ ]

- v125 NCT07488676 A Study of ASP546C in Adults With Gastroesophageal Cancer, Pancreatic Cancer or Other Solid Tumors
  judge-a: **not_relevant** - I1 not_met: "Participant has a histologically confirmed diagnosis of gastroesophageal (gastric/GEJ/esophageal) adenocarcinoma, pancreatic adenocarcinoma, or pan-tumor" (Tumor list (gastroesophageal, pancreatic, listed pan-tumor types) omits HCC.)
  Reviewer verdict: [ ]

- v125 NCT07612176 A Study of NEOK001, a B7-H3 and ROR1 Targeting Bispecific ADC in Participants With Select Solid Tumors
  judge-a: **excluded** - I1 not_met: "for which no standard therapy is available" (Requires no available standard therapy; systemic HCC options remain untried.)
  Reviewer verdict: [ ]

- v126 NCT07195734 Testing the Addition of Chemotherapy or Chemo-Immunotherapy to the Usual Surgery for Advanced Head and Neck Ca
  judge-a: **excluded** - I1 not_met: "Pathologically (histologically or cytologically) proven diagnosis of locally recurrent or persistent squamous cell carcinoma of head and neck (SCCHN)" / I19 not_met: "Only patients who received prior radiation therapy in the definitive or post-operative setting (limited to one course) are eligible." (Salvage-surgery trial for recurrence after prior RT; he is newly diagnosed and untreated.)
  Reviewer verdict: [ ]

- v127 NCT03816345 Testing an Immunotherapy Anti-cancer Drug, Nivolumab, for Advanced Cancers in Patients With Autoimmune Disorde
  judge-a: **excluded** - E3 not_met: "Patients with prior therapy with an anti-PD-1 or anti-PD-L1" (AIM-NIVO; she has had pembrolizumab (and has no autoimmune disease).)
  Reviewer verdict: [ ]

- v127 NCT04318717 Pembrolizumab and Hypofractionated Radiation Therapy for the Treatment of Mucosal Melanoma
  judge-a: **not_relevant** - I1 not_met: "Histologically or cytologically confirmed mucosal melanoma that has undergone surgical resection." (Mucosal melanoma trial; she has squamous cell carcinoma.)
  Reviewer verdict: [ ]

- v127 NCT04966481 Palbociclib and Cetuximab Versus Cetuximab Monotherapy for Patients With CDKN2A-altered, HPV-unrelated Head an
  judge-a: **possibly** - I2 unknown: "CDKN2A loss-of-function (LOF) alteration: mutation or homozygous deletion described on genomic sequencing report." / I4 met: "Disease progression on a PD-1/L1 inhibitor-containing regimen" / I1 met: "Histologically or cytologically confirmed RM-HNSCC that is HPV-unrelated disease" (HPV-unrelated R/M HNSCC after PD-1 progression fits; CDKN2A status not reported.)
  Reviewer verdict: [ ]

- v127 NCT06129864 A Global Study of Volrustomig (MEDI5752) for Participants With Unresected Locally Advanced Head and Neck Squam
  judge-a: **excluded** - I1 not_met: "with no evidence of metastatic disease (i.e. M0)" / E3 not_met: "LA-HNSCC that was resected before definitive cCRT" (Post-definitive-chemoradiation consolidation for unresected M0 disease; she had surgery and now has lung metastases.)
  Reviewer verdict: [ ]

- v127 NCT06702033 The Minimalist Trial-2
  judge-a: **excluded** - I1 not_met: "Histologically or cytologically confirmed HPV-related, clinical stages I-II OPSCC" / E2 not_met: "Prior radiation therapy for HNSCC." (De-escalation trial for early HPV-related OPSCC having transoral surgery; she has metastatic HPV-negative oral cavity SCC after RT.)
  Reviewer verdict: [ ]

- v127 NCT06910657 IDOV-Immune for Advanced Solid Tumors
  judge-a: **eligible** - I2 met: "Histologically or cytologically confirmed advanced solid tumors that have progressed despite standard therapy" / I3 met: "ECOG performance status ≤ 1." / I4 met: "Measurable disease per RECIST v1.1." (Oncolytic virus phase 1 incl. head and neck cancers; progressing after first-line PD-1/chemo, ECOG 0-1, measurable.)
  Reviewer verdict: [ ]

- v127 NCT06995898 The Vanguard Study: Testing a New Way to Screen for Cancer
  judge-a: **not_relevant** - E1 not_met: "Solid malignant tumor or blood cancer diagnosis, with or without treatment, within the last 5 years" (Cancer screening study for people without cancer.)
  Reviewer verdict: [ ]

- v128 NCT02734537 Radiation Therapy With or Without Cisplatin in Treating Patients With Stage III-IVA Squamous Cell Carcinoma of
  judge-a: **not_relevant** - I2 not_met: "Pathologically proven diagnosis of squamous cell carcinoma (including variants such as verrucous carcinoma, spindle cell carcinoma, carcinoma not otherwise specified [NOS]) of the head/neck (oral cavity, oropharynx, hypopharynx or larynx)" (Post-operative RT for resected oral cavity/oropharynx/larynx SCC; he has metastatic NPC.)
  Reviewer verdict: [ ]

- v128 NCT04221893 Radiation Therapy for the Treatment of Metastatic Gastrointestinal Cancers
  judge-a: **not_relevant** - I1 not_met: "Patients must have a histologically, cytologically, or radiographically confirmed metastatic gastrointestinal (GI) malignancy" (Palliative RT study for GI cancers; he has nasopharyngeal carcinoma.)
  Reviewer verdict: [ ]

- v128 NCT04429542 Study of Safety and Tolerability of BCA101 Monotherapy and in Combination Therapy in Patients With EGFR-driven
  judge-a: **not_relevant** - I9 not_met: "Participants may not have a primary tumor site of nasopharynx (any histology)." (EGFR-driven tumor study; HNSCC cohorts exclude nasopharynx and NPC is not among the listed tumor types.)
  Reviewer verdict: [ ]

- v128 NCT04671667 Testing What Happens When an Immunotherapy Drug (Pembrolizumab) is Given by Itself Compared to the Usual Treat
  judge-a: **not_relevant** - I2 not_met: "Patient must have locoregionally recurrent or second primary HNSCC (oral cavity, oropharynx, larynx, hypopharynx) in a previously radiated field" (Post-salvage-surgery trial for non-nasopharyngeal HNSCC; he has metastatic NPC.)
  Reviewer verdict: [ ]

- v128 NCT05893888 A Study Evaluating the Safety and Efficacy of PRV111, PRV211, and PRV131 in Subjects With Oral and Lung Cancer
  judge-a: **not_relevant** - I3 not_met: "T1-T3, Nx,M0 of the lip or oral cavity" (Pre-surgical oral cavity cancer study; he has metastatic nasopharyngeal carcinoma.)
  Reviewer verdict: [ ]

- v128 NCT06211335 Losartan, Pembrolizumab and Stereotactic Body Radiation Therapy for the Treatment of Patients With Locally Rec
  judge-a: **not_relevant** - E1 not_met: "Nasopharyngeal carcinoma, salivary gland carcinoma or primary skin squamous cell carcinoma (SCC)" (HNSCC trial that excludes nasopharyngeal carcinoma.)
  Reviewer verdict: [ ]

- v128 NCT06699212 A Study of ASP-1929 Photoimmunotherapy in Combination With Pembrolizumab in First-line Treatment of Locoregion
  judge-a: **not_relevant** - I1 not_met: "Histological or cytological evidence of squamous cell carcinoma of a head and neck primary site (per American Joint Committee on Cancer [AJCC], other than nasopharynx or cuSCC)." (Locoregional recurrent HNSCC trial that excludes nasopharyngeal primaries.)
  Reviewer verdict: [ ]

- v128 NCT07085091 A First in Human Study of ALX2004 With Advanced or Metastatic Selected Solid Tumors
  judge-a: **not_relevant** - I1 not_met: "Participants with locally advanced, recurrent or metastatic histologically confirmed HNSCC, NSCLC, ESCC, CRC" (Selected tumors are HNSCC, NSCLC, ESCC and CRC; nasopharyngeal carcinoma is treated as a different disease.)
  Reviewer verdict: [ ]

- v129 NCT05144698 RAPA-201 Therapy of Solid Tumors
  judge-a: **excluded** - I6 not_met: "Exposure to an anti-PD-(L)1 monoclonal antibody therapeutic in the most recent line of prior therapy." / I3 not_met: "Advanced metastatic, recurrent, and unresectable solid tumor that has relapsed after ≥ one prior line of therapy." / I9 unknown: "1. head and neck cancer (squamous cell carcinoma of oral cavity, larynx, nasopharynx, and other sites);" (Requires PD-1-refractory disease after prior lines; she never had systemic therapy (and the H&N cohort is framed as SCC).)
  Reviewer verdict: [ ]

- v129 NCT05419089 The Sinai Robotic Surgery Trial in HPV-related Oropharyngeal Squamous Cell Carcinoma (SIRS 2.0 Trial)
  judge-a: **not_relevant** - I1 not_met: "Patients must have histologically or cytologically confirmed and identified resectable primary OPSCC with positive p16 immunohistochemistry" (HPV+ OPSCC surgery trial.)
  Reviewer verdict: [ ]

- v129 NCT05544136 A Study of Decreasing Radiation Therapy and Chemotherapy in People With Head and Neck Cancer
  judge-a: **not_relevant** - I1 not_met: "Histologically confirmed diagnosis of SCC of the head and neck (excluding nasopharynx, nasal cavity/paranasal sinus, oral cavity, salivary, thyroid, and cutaneous primary malignancies)." / E1 not_met: "All nasopharyngeal, nasal cavity/paranasal sinus, oral cavity, salivary gland, thyroid, and cutaneous primary malignancies." (HNSCC de-escalation trial that excludes salivary primaries.)
  Reviewer verdict: [ ]

- v129 NCT05553782 Drug Screening Using Novel IMD in Salivary and Head and Neck Cancers
  judge-a: **excluded** - I1 not_met: "Participants must have histologically confirmed head and neck cancer (salivary or ACC type, or squamous cell carcinoma) without evidence of recurrent, metastatic or advanced, incurable disease undergoing definitive surgical management" (Microdevice study includes salivary ACC but only non-recurrent, non-metastatic disease going to surgery; she has metastatic recurrence.)
  Reviewer verdict: [ ]

- v129 NCT05983432 Evaluate BL-B01D1 in Patients With Metastatic or Unresectable Non-Small Cell Lung Cancer (NSCLC) and Other Sol
  judge-a: **possibly** - I5 unknown: "Has histologically documented, incurable, locally advanced or metastatic epithelial origin malignant cancer, priority to include the following tumor types: NSCLC, HER2 - breast cancer, esophageal cancer, SCLC, NPC, and HNSCC." / I10 met: "Has an Eastern Cooperative Oncology Group performance status (ECOG PS) 0 to 1" / E5 met: "Other malignant tumors were diagnosed within 5 years prior to the first administration" (Phase 1 open to metastatic epithelial cancers; salivary ACC is not a priority type and expansion cohorts are disease-specific. DCIS was 2014.)
  Reviewer verdict: [ ]

- v129 NCT06129864 A Global Study of Volrustomig (MEDI5752) for Participants With Unresected Locally Advanced Head and Neck Squam
  judge-a: **not_relevant** - I1 not_met: "Histologically or cytologically documented locally advanced squamous cell carcinoma of the oropharynx, hypopharynx, oral cavity, or larynx" / E1 not_met: "non-squamous histologies (eg, nasopharynx or salivary gland)" (Post-CRT LA-HNSCC trial that excludes salivary gland histologies.)
  Reviewer verdict: [ ]

- v129 NCT06239220 PD-L1 t-haNK, NAI IL-15sa and Cetuximab for Recurrent, Metastatic HNSCC
  judge-a: **not_relevant** - I1 not_met: "Participants must have an existing histologically confirmed diagnosis of head and neck squamous cell carcinoma (HNSCC)" (R/M HNSCC trial; not salivary cancer.)
  Reviewer verdict: [ ]

- v129 NCT06385080 A Study of Amivantamab Alone or in Addition to Other Treatment Agents in Participants With Head and Neck Cance
  judge-a: **not_relevant** - I1 not_met: "The eligible primary tumor locations are the oropharynx, oral cavity, hypopharynx, or larynx" (Amivantamab HNSCC trial; salivary adenoid cystic carcinoma is a different disease.)
  Reviewer verdict: [ ]

- v129 NCT06532279 Testing the Addition of the Drug BMX-001, a Radioprotector, or a Placebo to the Usual Chemoradiation Therapy f
  judge-a: **not_relevant** - I3 not_met: "Pathologically confirmed (histologically or cytologically) squamous cell carcinoma of the oropharynx, larynx, hypopharynx, nasopharynx, or oral cavity." (Radioprotector during definitive cisplatin-RT for mucosal SCC.)
  Reviewer verdict: [ ]

- v129 NCT06589804 Testing the Addition of Anti-Cancer Drug, Cetuximab, to Standard of Care Treatment (Pembrolizumab) for Returni
  judge-a: **not_relevant** - I1 not_met: "Histologically confirmed diagnosis head and neck squamous cell carcinomas (HNSCC)." (R/M HNSCC trial; salivary adenoid cystic carcinoma is a different disease.)
  Reviewer verdict: [ ]

- v129 NCT06902623 Treatment De-Escalation for Favorable Prognosis Human Papilloma Virus (HPV) or p16-Positive Oropharyngeal Canc
  judge-a: **not_relevant** - I2 not_met: "Patients must have a diagnosis of p16+ and/or HPV+ squamous cell carcinoma of the oropharynx" (HPV+ oropharyngeal SCC de-escalation; not salivary cancer.)
  Reviewer verdict: [ ]

- v129 NCT06984861 A Study of Reduced Radiation Therapy With Chemotherapy in People With HPV-Positive Throat Cancer
  judge-a: **not_relevant** - I1 not_met: "Pathologically (histologically or cytologically) proven diagnosis of HPV associated squamous cell carcinoma of the oropharynx" (HPV+ OPSCC reduced-dose RT.)
  Reviewer verdict: [ ]

- v129 NCT07195734 Testing the Addition of Chemotherapy or Chemo-Immunotherapy to the Usual Surgery for Advanced Head and Neck Ca
  judge-a: **not_relevant** - I1 not_met: "Pathologically (histologically or cytologically) proven diagnosis of locally recurrent or persistent squamous cell carcinoma of head and neck (SCCHN)" (Salvage surgery trial for mucosal SCCHN.)
  Reviewer verdict: [ ]

- v129 NCT07277413 A Study of IDE892 as Monotherapy and Combination in MTAP-deleted Advanced Solid Tumors
  judge-a: **not_relevant** - I2 not_met: "Have a histologically confirmed diagnosis of a locally advanced recurrent or metastatic solid tumor type of interest with MTAP deletion" (MTAP basket whose tumor list (mesothelioma, GE, pancreatobiliary, NSCLC, UC) omits salivary cancer.)
  Reviewer verdict: [ ]

- v129 NCT07441681 Comparing Radiation Plus Cetuximab to Radiation Plus Chemotherapy in People With Head and Neck Cancer Who Cann
  judge-a: **not_relevant** - I1 not_met: "Patients must have pathologically confirmed, previously untreated, unresected squamous cell carcinoma of the larynx, hypopharynx, oropharynx, or oral cavity" (Definitive RT for mucosal HNSCC; salivary adenoid cystic carcinoma is a different disease.)
  Reviewer verdict: [ ]

- v129 NCT07644585 A Pilot Study of Ultra-High Dose Rate (ConformalFLASH®), for Reirradiation of Carcinoma of the Head and Neck
  judge-a: **excluded** - I4 met: "Histologically confirmed diagnosis of carcinoma of the head and neck" / E5 not_met: "Presence of distant metastatic disease" (H&N carcinoma reirradiation pilot open to any carcinoma, but distant (lung) metastases are excluded.)
  Reviewer verdict: [ ]

- v131 NCT04846309 Hypoxia Imaging for Esophageal Cancer to Guide Personalized Radiation Therapy
  judge-a: **not_relevant** - I2 not_met: "Esophageal cancer patient eligible to undergo either neoadjuvant or definitive chemoradiation therapy (CRT)." (Esophageal cancer imaging study.)
  Reviewer verdict: [ ]

- v131 NCT05136196 BiCaZO: A Study Combining Two Immunotherapies (Cabozantinib and Nivolumab) to Treat Patients With Advanced Mel
  judge-a: **excluded** - I2 not_met: "Participants must have histologically confirmed squamous cell carcinoma of the head and neck (HNSCC) that is either locally recurrent and non-amendable to curative therapy (e.g., radiation, surgery) or metastatic." / I5 not_met: "Participants must have had documented progression during or within 12 weeks after the last dose of PD-1 checkpoint inhibition-based therapy." (PD-1-refractory R/M HNSCC; she is NED and never had PD-1 therapy.)
  Reviewer verdict: [ ]

- v131 NCT05267626 Study of AU-007, A Monoclonal Antibody That Binds to IL-2 and Inhibits IL-2Rα Binding, in Patients With Unrese
  judge-a: **excluded** - I2 not_met: "Patients must have measurable disease as per RECIST v1.1 criteria and documented by CT and/or MRI" (Advanced/metastatic cancer phase 1/2 (Part 2 not limited to melanoma/NSCLC); she has no remaining cancer after resection (advanced-basket rule).)
  Reviewer verdict: [ ]

- v131 NCT06129864 A Global Study of Volrustomig (MEDI5752) for Participants With Unresected Locally Advanced Head and Neck Squam
  judge-a: **excluded** - I2 not_met: "Confirmed unresected Stage III, Stage IVA or IVB according to the eighth edition of the American Joint Committee on Cancer (AJCC) staging manual" / E3 not_met: "1. LA-HNSCC that was resected before definitive cCRT" (Post-CRT consolidation for unresected LA-HNSCC; her oral cavity tumor was resected before adjuvant CRT.)
  Reviewer verdict: [ ]

- v131 NCT06384807 A Phase 1/2 Study of BHV-1510 (Previously PBI-410) in Advanced Solid Tumors
  judge-a: **excluded** - I2 not_met: "Unresectable, incurable, locally advanced or metastatic epithelial-origin solid tumor that is refractory to standard therapies" / I3 not_met: "Measurable disease (per RECIST 1.1)." (Advanced epithelial-tumor basket; she is resected, NED and on curative adjuvant CRT (advanced-basket rule).)
  Reviewer verdict: [ ]

- v131 NCT07020117 A Study of [225Ac]Ac-AKY-1189 in Patients With Solid Tumors
  judge-a: **excluded** - I1 not_met: "Histologic or cytologic confirmation of locally advance or metastatic disease" / I7 not_met: "Documented disease progression on prior line of therapy for metastatic disease" (Lists head and neck cancer but needs progressing metastatic disease; she is NED.)
  Reviewer verdict: [ ]

- v131 NCT07276399 A Study of Amivantamab in Addition to Standard of Care Agents (SOC) Compared With SOC Alone in Participants Wi
  judge-a: **excluded** - I2 not_met: "Have histologically or cytologically confirmed recurrent/metastatic (R/M) HNSCC that is considered incurable by local therapies" / I5 not_met: "Have measurable disease according to Response Evaluation Criteria in Solid Tumors (RECIST) version (v).1.1" (First-line R/M HNSCC trial; she is NED on curative adjuvant therapy.)
  Reviewer verdict: [ ]

- v132 NCT02734537 Radiation Therapy With or Without Cisplatin in Treating Patients With Stage III-IVA Squamous Cell Carcinoma of
  judge-a: **excluded** - I3 not_met: "Patient has undergone total resection of the primary tumor with curative intent" / I11 not_met: "Patients with recurrent disease or multiple primaries are ineligible" (Post-operative RT for newly resected HNSCC; he has metastatic recurrence after chemoradiation.)
  judge-b: **excluded** - I11 not_met: "Patients with recurrent disease or multiple primaries are ineligible" / I3 not_met: "Patient has undergone total resection of the primary tumor with curative intent"
  Reviewer verdict: [ ]

- v132 NCT05136196 BiCaZO: A Study Combining Two Immunotherapies (Cabozantinib and Nivolumab) to Treat Patients With Advanced Mel
  judge-a: **excluded** - I16 not_met: "Participants must have a Zubrod Performance Status 0 or 1" / I5 unknown: "Participants must have had documented progression during or within 12 weeks after the last dose of PD-1 checkpoint inhibition-based therapy." (Post-PD-1 HNSCC trial; ECOG 2 (half the day resting) fails Zubrod 0-1.)
  judge-b: **excluded** - I16 not_met: "Participants must have a Zubrod Performance Status 0 or 1" / I5 unknown: "Participants must have had documented progression during or within 12 weeks after the last dose of PD-1 checkpoint inhibition-based therapy."
  Reviewer verdict: [ ]

- v132 NCT05144698 RAPA-201 Therapy of Solid Tumors
  judge-a: **excluded** - I6 not_met: "Exposure to an anti-PD-(L)1 monoclonal antibody therapeutic in the most recent line of prior therapy." / E9 not_met: "Cancer metastasis to the central nervous system, unless such metastasis has been adequately treated." / I2 met: "Eastern Cooperative Oncology Group (ECOG) performance status of ≤ 2." (Larynx SCC listed and ECOG 2 allowed, but his most recent line was docetaxel (not PD-1) and the brain metastasis is untreated.)
  judge-b: **excluded** - I6 not_met: "Exposure to an anti-PD-(L)1 monoclonal antibody therapeutic in the most recent line of prior therapy." / E9 not_met: "Cancer metastasis to the central nervous system, unless such metastasis has been adequately treated." / I2 met: "Eastern Cooperative Oncology Group (ECOG) performance status of ≤ 2." (Most recent line was docetaxel, not anti-PD-1; brain metastasis not yet treated.)
  Reviewer verdict: [ ]

- v132 NCT05541016 De-Escalated Adjuvant and Definitive Radiation Therapy Informed by DART 2.0 ctHPV-DNA
  judge-a: **excluded** - I3 not_met: "Histological confirmation of squamous cell carcinoma originating from or suspected to be originating from the oropharynx" / I5 not_met: "Absence of distant metastases on standard diagnostic work-up =< 16 weeks prior to registration." / E4 not_met: "Immunocompromised patients and patients known to be human immunodeficiency virus (HIV)+" (Curative de-escalation for oropharyngeal SCC; metastatic laryngeal SCC, prior RT, known HIV.)
  judge-b: **excluded** - I3 not_met: "Histological confirmation of squamous cell carcinoma originating from or suspected to be originating from the oropharynx" / I5 not_met: "Absence of distant metastases" / E4 not_met: "Immunocompromised patients and patients known to be human immunodeficiency virus (HIV)+"
  Reviewer verdict: [ ]

- v132 NCT06239220 PD-L1 t-haNK, NAI IL-15sa and Cetuximab for Recurrent, Metastatic HNSCC
  judge-a: **excluded** - E1 not_met: "Have been previously treated with 3 or more lines of systemic therapy for R/M HNSCC." / I7 not_met: "Have a performance status of 0 or 1 on the ECOG Performance Scale (see Appendix A)." / E4 not_met: "Participant has known active central nervous system (CNS) metastases and/or carcinomatous meningitis." (1-2 prior R/M lines only; he has three, ECOG 2 and an untreated brain metastasis.)
  judge-b: **excluded** - E1 not_met: "Have been previously treated with 3 or more lines of systemic therapy for R/M HNSCC." / I7 not_met: "Have a performance status of 0 or 1 on the ECOG Performance Scale" / E4 not_met: "Participant has known active central nervous system (CNS) metastases"
  Reviewer verdict: [ ]

- v132 NCT06902623 Treatment De-Escalation for Favorable Prognosis Human Papilloma Virus (HPV) or p16-Positive Oropharyngeal Canc
  judge-a: **excluded** - I2 not_met: "Patients must have a diagnosis of p16+ and/or HPV+ squamous cell carcinoma of the oropharynx" / I3 not_met: "clinical stage stage I-II (T1-2 N1 M0, or T3 N0-1 M0 ) (AJCC 8th ed.) SCCA of the oropharynx" (Favorable HPV+ oropharynx de-escalation; HPV-negative metastatic laryngeal SCC.)
  judge-b: **excluded** - I2 not_met: "Patients must have a diagnosis of p16+ and/or HPV+ squamous cell carcinoma of the oropharynx"
  Reviewer verdict: [ ]

- v132 NCT07465276 Neoadjuvant Ficerafusp Alfa With Pembrolizumab in Resectable SCC
  judge-a: **excluded** - I1 not_met: "Participants must have histologically or cytologically confirmed, untreated and newly diagnosed, locoregionally advanced head and neck squamous cell carcinoma (HNSCC)" / E1 not_met: "Recurrent or metastatic (M1 or IVC disease by AJCC 2017 8th edition staging) HNSCC" (Neoadjuvant trial for untreated resectable HNSCC; he is metastatic and heavily treated.)
  judge-b: **excluded** - I1 not_met: "untreated and newly diagnosed, locoregionally advanced head and neck squamous cell carcinoma" / E12 not_met: "Has a known history of human immunodeficiency virus (HIV)"
  Reviewer verdict: [ ]

- v133 NCT05483491 KK-LC-1 TCR-T Cell Therapy for Gastric, Breast, Cervical, and Lung Cancer
  judge-a: **excluded** - I6 not_met: "Prior treatment with cancer type-specific standard of care systemic cancer therapy is required." / I4 unknown: "HLA-A*01:01 allele by HLA haplotype test." / I3 unknown: "Metastatic solid tumor with ≥ 10% of tumor cells positive for KK-LC-1 by IHC assay." (TCR-T therapy requires prior standard systemic therapy; he is untreated with first-line chemo-immunotherapy planned.)
  Reviewer verdict: [ ]

- v133 NCT06731478 Study of TDXd, Chemotherapy, Pembrolizumab, and Trastuzumab in First-Line Metastatic HER2-Positive Gastric or 
  judge-a: **eligible** - I3 met: "Previously untreated, unresectable, locally advanced or metastatic gastric or GEJ adenocarcinoma histologically confirmed by pathology report." / I5 met: "Centrally determined HER2-positive (IHC 3+ or IHC 2+/ISH-positive) gastric or GEJ cancer" / I8 met: "For the Main Cohort: PD-L1 CPS ≥1" / I10 met: "At least 1 target measurable lesion on CT or MRI, assessed by the investigator based on RECIST v1.1." (First-line HER2+ gastric/GEJ trial with pembrolizumab; untreated HER2 3+, CPS 5, measurable.)
  Reviewer verdict: [ ]

- v133 NCT06901531 A Study of Zolbetuximab Together With Pembrolizumab and Chemotherapy in Adults With Gastric Cancer
  judge-a: **excluded** - I12 not_met: "Participant has a Human Epidermal Growth Factor Receptor 2 (HER2) -negative tumor." / I13 unknown: "Participant's tumor expresses Claudin18.2 (CLDN18.2) in ≥ 75% of tumor cells" (First-line zolbetuximab trial for HER2-negative tumors; his is HER2 3+.)
  Reviewer verdict: [ ]

- v133 NCT07221149 A Study to Evaluate the Safety and Efficacy of Pumitamig in Combination With Chemotherapy Versus Nivolumab in 
  judge-a: **excluded** - I3 not_met: "Participants must have documented human epidermal growth factor receptor 2 (HER2)-negative cancer, as determined according to local guidelines." / I1 met: "Participants must be previously untreated with systemic treatment for advanced/metastatic disease" (First-line trial limited to HER2-negative GEA; his tumor is HER2 3+.)
  Reviewer verdict: [ ]

- v133 NCT07227168 A Study of STRO-004 in Adults With Refractory/Recurrent Metastatic Cancer
  judge-a: **excluded** - I4 not_met: "Received all appropriate systemic therapies that are locally available for which they are eligible." / I1 met: "Esophageal/Gastric Cancer" (Refractory solid-tumor phase 1 including gastric cancer; he has not started standard therapy.)
  Reviewer verdict: [ ]

- v133 NCT07284186 First-in-Human Study of PLX-61639 in Locally Advanced or Metastatic Solid Tumors
  judge-a: **excluded** - I1 not_met: "relapsed/refractory, solid tumors harboring a SMARCA4 loss-of-function mutation that have progressed on, are intolerant of, or not otherwise candidates for available approved therapies" (Relapsed/refractory SMARCA4-mutant tumors; he is newly diagnosed with standard first-line therapy planned (SMARCA4 also untested).)
  Reviewer verdict: [ ]

- v133 NCT07532902 A Study of BMS-986504 With Standard-of-Care Therapy for People With Solid Tumor Cancer
  judge-a: **excluded** - I6 not_met: "HER2 overexpression negative (using clone 4B5, Ventana): HER2 IHC 0-1+, or HER2 2+ with ISH showing HER2:CEP17 ratio <2 and average HER2 copy number <6.0 signals/cell" / I16 unknown: "Confirmation of MTAP deletion by either IHC or NGS:" (First-line MTAP inhibitor + FOLFOX/nivolumab for HER2-negative GEC; his tumor is HER2 3+.)
  Reviewer verdict: [ ]

- v134 NCT05684965 XTX301 in Patients With Advanced Solid Tumors
  judge-a: **excluded** - I1 not_met: "locally advanced or metastatic and has failed standard therapy, standard therapy does not confer survival benefit, or standard therapy is not available." (Refractory solid tumor phase 1; standard curative therapy is under way.)
  Reviewer verdict: [ ]

- v134 NCT06952010 A Study of XB628 Alone and in Combination With Zanzalintinib in Participants With Recurrent Advanced or Metast
  judge-a: **excluded** - I5 not_met: "Not amenable to curative treatment with surgery or radiation." / I6 not_met: "Received at least 1 line of prior systemic anticancer therapy in the recurrent or metastatic setting." (Recurrent/metastatic solid tumor phase 1; her disease is being treated with curative intent.)
  Reviewer verdict: [ ]

- v134 NCT07284186 First-in-Human Study of PLX-61639 in Locally Advanced or Metastatic Solid Tumors
  judge-a: **excluded** - I1 not_met: "locally advanced or metastatic, relapsed/refractory, solid tumors harboring a SMARCA4 loss-of-function mutation that have progressed on, are intolerant of, or not otherwise candidates for available approved therapies" (Relapsed/refractory SMARCA4 basket; she is mid curative neoadjuvant chemoradiation with surgery planned (advanced-basket rule).)
  Reviewer verdict: [ ]

- v135 NCT05941507 A Study to Evaluate TROP2 ADC LCB84 Single Agent and in Combination With an Anti-PD-1 Ab in Advanced Solid Tum
  judge-a: **eligible** - I1 met: "Phase 1 Dose Escalation: histologically or cytologically confirmed advanced solid tumors refractory to standard of care treatment." / I5 met: "Measurable disease as defined by RECIST v1.1 or RANO-BM." / I8 met: "Eastern Cooperative Oncology Group (ECOG) performance status of 0 or 1" (TROP2 ADC phase 1 for advanced solid tumors refractory to SOC; he progressed on first-line chemo-immunotherapy.)
  Reviewer verdict: [ ]

- v135 NCT05954312 A First-in-Human (FIH) Study to Evaluate the Safety and Tolerability of VVD-130037 in Participants With Advanc
  judge-a: **possibly** - I10 met: "Participants with advanced esophageal squamous cell carcinoma (ESCC) must have received prior treatment with platinum-based chemotherapy, an immune checkpoint inhibitor" / I3 unknown: "Have progressed on or after all prior standard-of-care therapies for metastatic disease." (ESCC expansion fits his prior platinum + ICI, but progression on current paclitaxel (mixed results) is not documented.)
  Reviewer verdict: [ ]

- v135 NCT06014502 Study to Evaluate IMGS-001 Treatment in Patients With Relapsed or Refractory Advanced Solid Tumors
  judge-a: **eligible** - I1 met: "Part 1 Dose-escalation: Patients must have histologically confirmed locally advanced, or metastatic solid tumors who have progressed after receiving appropriate lines of standard therapy known to potentially confer clinical benefit." / I8 met: "Eastern Cooperative Oncology Group (ECOG) performance status of 0-1." / I10 met: "At least 1 measurable lesion as defined by RECIST 1.1." (Dose escalation takes any metastatic solid tumor that progressed after standard therapy; he progressed on chemo + nivolumab (expansion cohorts do not include ESCC).)
  Reviewer verdict: [ ]

- v135 NCT06055439 A Phase 1/2 Study to Evaluate CHM-2101, an Autologous Cadherin 17 Chimeric Antigen Receptor (CAR) T Cell Thera
  judge-a: **not_relevant** - I2 not_met: "Confirmed histologic diagnosis of one of the following solid tumors of GI origin:" (CDH17 CAR-T for gastric adenocarcinoma, colorectal adenocarcinoma and midgut/hindgut NET only.)
  Reviewer verdict: [ ]

- v135 NCT06532006 A Phase Ⅲ Clinical Study of HLX22 in Combination With Trastuzumab and Chemotherapy for the Treatment of Gastro
  judge-a: **not_relevant** - I2 not_met: "HER2-positive gastric or gastroesophageal junction adenocarcinoma." (HER2-positive gastric/GEJ adenocarcinoma trial; he has ESCC.)
  Reviewer verdict: [ ]

- v135 NCT06731478 Study of TDXd, Chemotherapy, Pembrolizumab, and Trastuzumab in First-Line Metastatic HER2-Positive Gastric or 
  judge-a: **not_relevant** - I3 not_met: "Previously untreated, unresectable, locally advanced or metastatic gastric or GEJ adenocarcinoma histologically confirmed by pathology report." (First-line HER2-positive gastric/GEJ adenocarcinoma trial; he has ESCC.)
  Reviewer verdict: [ ]

- v135 NCT06901531 A Study of Zolbetuximab Together With Pembrolizumab and Chemotherapy in Adults With Gastric Cancer
  judge-a: **not_relevant** - I1 not_met: "Participant has histologically confirmed gastric or Gastroesophageal Junction (GEJ) adenocarcinoma." (Gastric/GEJ adenocarcinoma trial; he has ESCC.)
  Reviewer verdict: [ ]

- v135 NCT07001748 Testing the Addition of Paclitaxel Administered Into the Abdominal Cavity Combined With Chemotherapy for Patie
  judge-a: **not_relevant** - I4 not_met: "primary gastric or gastroesophageal adenocarcinoma (Siewert 3)" (Intraperitoneal paclitaxel for gastric adenocarcinoma with peritoneal spread; he has ESCC.)
  Reviewer verdict: [ ]

- v136 NCT04660760 Ramucirumab and Trifluridine/Tipiracil or Paclitaxel for the Treatment of Patients With Previously Treated Adv
  judge-a: **excluded** - I3 not_met: "Have locally advanced unresectable or metastatic disease that has progressed =< 180 days since last treatment" (Second-line advanced gastric trial; she is resected, NED and finishing perioperative FLOT.)
  Reviewer verdict: [ ]

- v136 NCT07226349 A Study of BG-75098 Alone and in Combination With Other Agents in Adults With Advanced Solid Tumors
  judge-a: **excluded** - I1 not_met: "Participants must have measurable disease as assessed by RECIST v1.1." / I4 not_met: "Participants with histologically or cytologically confirmed advanced, metastatic, or unresectable solid tumors" (Advanced solid tumor CDK2 phase 1; she is resected with no evidence of disease.)
  Reviewer verdict: [ ]

- v137 NCT04660760 Ramucirumab and Trifluridine/Tipiracil or Paclitaxel for the Treatment of Patients With Previously Treated Adv
  judge-a: **excluded** - E4 not_met: "Previous treatment with TAS-102 or ramucirumab" / I7 not_met: "Eastern Cooperative Oncology Group (ECOG) performance status (PS) 0 or 1" (Second-line ramucirumab trial; he already had ramucirumab and is on TAS-102, ECOG 2.)
  Reviewer verdict: [ ]

- v137 NCT05365581 A Study of ASP2138 Given by Itself or Given With Other Cancer Treatments in Adults With Stomach Cancer, Gastro
  judge-a: **excluded** - I11 not_met: "Participant has at least 1 measurable disease according to Response Evaluation Criteria in Solid Tumors (RECIST) 1.1" / I14 not_met: "Participant has Eastern Cooperative Oncology Group (ECOG) performance status of 0 or 1." / I9 met: "Participant's tumor sample is positive for claudin (CLDN)18.2 expression by central immunohistochemistry (IHC) testing." (CLDN18.2 phase 1 he fits on claudin, but measurable disease and ECOG 0-1 are required.)
  Reviewer verdict: [ ]

- v137 NCT05677490 mFOLFIRINOX Versus mFOLFOX With or Without Nivolumab for the Treatment of Advanced, Unresectable, or Metastati
  judge-a: **excluded** - I5 not_met: "No prior systemic treatment for unresectable or metastatic disease" / I10 not_met: "Eastern Cooperative Oncology Group (ECOG) Performance Status 0 or 1" (First-line mFOLFIRINOX vs mFOLFOX trial; he is pretreated and ECOG 2.)
  Reviewer verdict: [ ]

- v137 NCT05977998 A Phase II Study of Perioperative Paclitaxel in Patients With Gastric Adenocarcinoma and Carcinomatosis or Pos
  judge-a: **possibly** - I2 met: "ECOG performance status ≤ 2 (Karnofsky ≥60%)." / I7 unknown: "Carcinomatosis on diagnostic laparoscopy or laparotomy." / I8 unknown: "Completion of preoperative systemic cytotoxic chemotherapy." (IP paclitaxel with cytoreduction for peritoneal-only gastric cancer; peritoneal-only status, surgery candidacy and chemo completion not stated.)
  Reviewer verdict: [ ]

- v137 NCT06005493 Study of AZD5863 in Adult Participants With Advanced or Metastatic Solid Tumors
  judge-a: **excluded** - I3 not_met: "Must have at least one measurable lesion according to Response Evaluation Criteria in Solid Tumors (RECIST) v1.1" / I5 not_met: "Eastern Cooperative Oncology Group Performance status (ECOG PS): 0-1 at screening" / I4 met: "Must show positive CLDN18.2 expression in tumor cells as determined by central immunohistochemistry (IHC)" (CLDN18.2 T-cell engager after prior lines; he is CLDN18.2+ but has no measurable disease and is ECOG 2.)
  Reviewer verdict: [ ]

- v137 NCT06172478 A Study of HER3-DXd in Subjects With Locally Advanced or Metastatic Solid Tumors
  judge-a: **excluded** - I14 not_met: "Has ≥1 measurable lesion on CT or MRI as per RECIST v1.1 by investigator assessment." / I17 not_met: "Has Eastern Cooperative Oncology Group performance status (ECOG PS) of 0 or 1 at screening." (Gastric cohort needs measurable disease and ECOG 0-1; his disease is non-measurable peritoneal and he is ECOG 2.)
  Reviewer verdict: [ ]

- v137 NCT07070466 Ivonescimab in Comb. With FOLFOX in Advanced HER2 Neg. GEA
  judge-a: **excluded** - I3 not_met: "Patients may not have received prior therapy for Stage IV disease." / E1 not_met: "Prior treatment with a PD-1 or PD-L1 inhibitor is exclusionary" (First-line ivonescimab + FOLFOX; he has had three lines including nivolumab.)
  Reviewer verdict: [ ]

- v137 NCT07673887 A Study of ASP2138 Together With Chemotherapy and Pembrolizumab in Adults With Gastric Cancer
  judge-a: **excluded** - E24 not_met: "Participant has received prior systemic chemotherapy and/or immunotherapy for locally advanced unresectable or metastatic gastric or GEJ adenocarcinoma." / E29 not_met: "Participant has received prior therapy with an anti-PD-1, anti-PD-L1 or anti-PD-L2 agent" / I17 not_met: "Participant has ECOG performance status 0 to 1." (First-line CLDN18.2 trial; he is CLDN18.2+ but on his third line after nivolumab, ECOG 2.)
  Reviewer verdict: [ ]

- v139 NCT05785754 DCSZ11 as a Monotherapy and in Combination in Patients With Advanced or Metastatic Solid Tumors
  judge-a: **excluded** - I4 not_met: "solid tumor that has progressed on or after standard therapy (relapsed/refractory patients; patients must have failed at least one prior line of therapy)" (Phase 1a needs failure of a prior line; 1b cohorts are NSCLC, CRC, sarcoma and uveal melanoma. She is responding to first line.)
  judge-b: **excluded** - I4 not_met: "solid tumor that has progressed on or after standard therapy (relapsed/refractory patients; patients must have failed at least one prior line of therapy)" (Gastric cancer not in phase 1b cohorts; no progression on first line.)
  Reviewer verdict: [ ]

- v139 NCT06695845 A Phase 2 Study of Zanidatamab in Patients With HER2-expressing Tumors
  judge-a: **excluded** - I3 not_met: "HER2 overexpression (IHC 3+) must be determined by a sponsor designated central laboratory." (HER2 IHC 3+ tumors only; hers is HER2 negative.)
  judge-b: **excluded** - I3 not_met: "HER2 overexpression (IHC 3+) must be determined by a sponsor designated central laboratory."
  Reviewer verdict: [ ]

- v139 NCT06901531 A Study of Zolbetuximab Together With Pembrolizumab and Chemotherapy in Adults With Gastric Cancer
  judge-a: **excluded** - I13 not_met: "Participant's tumor expresses Claudin18.2 (CLDN18.2) in ≥ 75% of tumor cells" / E19 not_met: "Participant has received prior systemic chemotherapy and/or immunotherapy for locally advanced unresectable or metastatic gastric or GEJ adenocarcinoma" (First-line zolbetuximab trial; she is claudin negative and already on first-line therapy.)
  judge-b: **excluded** - I13 not_met: "Participant's tumor expresses Claudin18.2 (CLDN18.2) in ≥ 75% of tumor cells" / E19 not_met: "Participant has received prior systemic chemotherapy and/or immunotherapy for locally advanced unresectable or metastatic gastric or GEJ adenocarcinoma"
  Reviewer verdict: [ ]

- v139 NCT07189871 177Lu-BetaBart in Patients With Relapsed/Refractory, Locally Advanced Inoperable, or Metastatic Solid Tumors
  judge-a: **not_relevant** - I2 not_met: "Participants with a documented history of histopathologically confirmed CRPC*, CRC, NSCLC, SCLC, HNSCC, ovarian cancer, cervical cancer, endometrial cancer, TNBC, or ESCC." (Tumor list omits gastric cancer; her ovarian lesions are gastric metastases, not ovarian cancer.)
  judge-b: **not_relevant** - I2 not_met: "Participants with a documented history of histopathologically confirmed CRPC*, CRC, NSCLC, SCLC, HNSCC, ovarian cancer, cervical cancer, endometrial cancer, TNBC, or ESCC." (Gastric cancer (with ovarian metastases) not among the listed primaries.)
  Reviewer verdict: [ ]

- v139 NCT07283939 Studying the PAGODA Algorithm for Chemotherapy Dose Changes to Prevent Unplanned Treatment Delays
  judge-a: **excluded** - I1 not_met: "Cycle 1, day 1 of FOLFOX-based chemotherapy must be completed 1 to 8 days prior to registration" (FOLFOX dose-adjustment study enrolling at cycle 1; she started FOLFOX in July.)
  judge-b: **excluded** - I1 not_met: "Cycle 1, day 1 of FOLFOX-based chemotherapy must be completed 1 to 8 days prior to registration" / I1 not_met: "Prior systemic therapy for GI cancer (other than cycle 1 of FOLFOX-based chemotherapy) is not allowed." (FOLFOX started in July; past the enrollment window.)
  Reviewer verdict: [ ]

- v139 NCT07517198 Dose Determining Study of EXS74539 (REC-4539) in Participants With Select Solid Tumors
  judge-a: **excluded** - I4 not_met: "Participant disease should have progressed, relapsed or the participants should have been intolerant to at least one prior standard systemic therapy" / I3 met: "Gastric cancer" (Gastric cancer is listed, but progression or intolerance on prior therapy is required; she is responding.)
  judge-b: **excluded** - I4 not_met: "Participant disease should have progressed, relapsed or the participants should have been intolerant to at least one prior standard systemic therapy" / I3 met: "Gastric cancer" (Currently responding to first-line FOLFOX-nivolumab.)
  Reviewer verdict: [ ]

- v140 NCT05086692 A Beta-only IL-2 ImmunoTherapY Study
  judge-a: **excluded** - I4 not_met: "Histologically or cytologically confirmed locally advanced or metastatic solid tumor" / I6 not_met: "Measurable disease as per Response Evaluation Criteria in Solid Tumors, (RECIST v1.1) and documented by CT and/or MRI." (Endometrial carcinoma is listed, but she is resected, NED on adjuvant therapy (advanced-basket rule).)
  Reviewer verdict: [ ]

- v140 NCT05642611 Comparing Cooling and/or Compression Approaches of Limbs for Prevention of Chemotherapy-Induced Peripheral Neu
  judge-a: **excluded** - I2 not_met: "Participants must be planning to begin neoadjuvant or adjuvant therapy with one of the protocol-specified chemotherapy regimens below" / E2 not_met: "Participants must not have previously received neurotoxic chemotherapy for any reason (e.g., taxanes, platinum agents, vinca alkaloids, or bortezomib)." (Neuropathy prevention must start with chemo; she has already had three cycles of carboplatin/paclitaxel.)
  Reviewer verdict: [ ]

- v140 NCT05720117 A Study of PYX-201 in Advanced Solid Tumors
  judge-a: **excluded** - I5 not_met: "Participant must have at least 1 measurable lesion per Response Evaluation Criteria in Solid Tumors (RECIST) v1.1." (Advanced solid-tumor basket ('other solid tumor types'); she is resected, NED on adjuvant therapy.)
  Reviewer verdict: [ ]

- v140 NCT06400472 A Study of Sofe-M in Participants With Selected Advanced Solid Tumors
  judge-a: **possibly** - I2 met: "Dose Escalation: Ovarian (epithelial ovarian, primary peritoneal, and fallopian tube) cancer, endometrial cancer" (Only numbered criterion is tumor type; 'advanced' is in the title only (v028-3/v093 title rule). She is resected, NED on adjuvant therapy.)
  Reviewer verdict: [ ]

- v140 NCT06492070 Cryocompression With or Without Cilostazol for the Prevention of Paclitaxel-induced Neuropathy in Patients Wit
  judge-a: **excluded** - E3 not_met: "Previous treatment with paclitaxel" / I6 not_met: "completion of 6-9 cycles of a chemotherapy regimen consisting of paclitaxel and carboplatin or cisplatin" / E24 not_met: "ARM C: Previous treatment with paclitaxel" (Arms A/B need paclitaxel-naive patients; she is on cycle 4. Arm C needs completed chemo (not yet) and also bars prior paclitaxel.)
  Reviewer verdict: [ ]

- v140 NCT07114601 A Study of LY4257496 in Participants With Cancer (OMNIRAY)
  judge-a: **excluded** - I1 not_met: "Must have histologically or cytologically proven diagnosis of locally advanced, unresectable, or metastatic cancer." / I3 not_met: "At least 1 measurable target lesion per Response Evaluation Criteria in Solid Tumors (RECIST) v1.1" (Endometrial carcinoma is a listed type, but all disease was resected (NED).)
  Reviewer verdict: [ ]

- v141 NCT07410117 REGN7508 in Adult Participants for Prevention of Cancer-Associated Thrombosis
  judge-a: **possibly** - I1 met: "Has a histologically confirmed diagnosis of malignant solid tumors which are locally advanced or metastatic as described in the protocol" / I2 unknown: "Has a Khorana thromboembolic risk score ≥2 during screening period" / I3 met: "Has an Eastern Cooperative Oncology Group (ECOG) Performance Status 0 to 2" (Stage IIIC1 cervical cancer starting chemoradiation; Khorana score depends on labs/BMI not stated.)
  Reviewer verdict: [ ]

- v142 NCT04585750 The Evaluation of PC14586 in Patients With Advanced Solid Tumors Harboring a TP53 Y220C Mutation (PYNNACLE)
  judge-a: **excluded** - I2 not_met: "Locally advanced or metastatic solid malignancy with a TP53 Y220C mutation" (Requires TP53 Y220C; her tumor has normal p53 (TP53 negative).)
  Reviewer verdict: [ ]

- v142 NCT04831580 A Trial of Robotic Versus Open Hysterectomy Surgery in Cervix Cancer
  judge-a: **not_relevant** - I1 not_met: "Patient must have histologically confirmed adenocarcinoma (usual/classic/NOS), squamous cell carcinoma, adenosquamous carcinoma (Including glassy cell)" (Early cervical cancer surgery trial; she has recurrent endometrial cancer.)
  Reviewer verdict: [ ]

- v142 NCT06952504 A Study to Compare Sacituzumab Tirumotecan (MK-2870) in Combination With Pembrolizumab (MK-3475) Versus Pembro
  judge-a: **excluded** - E2 not_met: "Has endometrial carcinoma of any histology that is mismatch repair deficient (dMMR)" / E8 not_met: "Received prior therapy in any setting with any of the following: anti-programmed cell death 1 protein" (pMMR first-line trial; she is dMMR and has had pembrolizumab.)
  Reviewer verdict: [ ]

- v142 NCT06974110 Study of Orally Administered MOMA-341 in Participants With Advanced or Metastatic Solid Tumors
  judge-a: **eligible** - I2 met: "Participants have unresectable advanced or metastatic solid tumors with MSI-H or dMMR alterations and histologically confirmed disease. Participants must have previously received and progressed on an anti-PD-(L)1-based regimen" / I3 met: "Have at least 1 lesion at baseline (measurable or non-measurable) suitable for repeat imaging evaluation by RECIST" / I4 met: "ECOG PS ≤ 2" (dMMR/MSI-H endometrial cancer that progressed on pembrolizumab; prior colon cancer 9 years ago is not active.)
  Reviewer verdict: [ ]

- v142 NCT07166094 Study to Assess the Efficacy and Safety of Rina-S Compared to Treatment of Investigator's Choice in Participan
  judge-a: **possibly** - I3 met: "Participants must have received prior platinum-based chemotherapy and a programmed death (ligand)-1 (PD(L)-1) inhibitor, either separately or in combination" / I4 unknown: "Participants must have progressed radiographically on or after their most recent line of therapy" (Pembrolizumab in the recurrent setting waives platinum rechallenge; progression on current lenvatinib not stated.)
  Reviewer verdict: [ ]

- v143 NCT04567771 Comparison of Proton or Intensity Modulated Radiation Therapy After Surgery for Endometrial or Cervical Cancer
  judge-a: **excluded** - I2 not_met: "Must have undergone an open or robotic hysterectomy" / E2 not_met: "Distant metastases" (Post-hysterectomy pelvic RT study; she has metastatic disease and no surgery.)
  Reviewer verdict: [ ]

- v143 NCT05086692 A Beta-only IL-2 ImmunoTherapY Study
  judge-a: **possibly** - I4 met: "Histologically or cytologically confirmed locally advanced or metastatic solid tumor (see tumor types listed under conditions)" / I6 met: "Measurable disease as per Response Evaluation Criteria in Solid Tumors, (RECIST v1.1) and documented by CT and/or MRI." (Cervical cancer is a listed condition and there is no numbered prior-therapy rule, but she is responding to first-line chemo-IO (run 30 rule).)
  Reviewer verdict: [ ]

- v143 NCT05112601 Testing Nivolumab With or Without Ipilimumab in Deficient Mismatch Repair System (dMMR) Recurrent Endometrial 
  judge-a: **not_relevant** - I1 not_met: "Patients with measurable or non-measurable (detectable) recurrent endometrial cancer" (dMMR endometrial cancer trial.)
  Reviewer verdict: [ ]

- v143 NCT05512208 A Phase 2 Study of Avutometinib (VS-6766) Plus Defactinib
  judge-a: **excluded** - I5 not_met: "Progression (radiographic or clinical) or recurrence of gynecological cancer after at least one prior systemic therapy for metastatic disease." / I2 unknown: "with mutated RAS, BRAF (type I, II, and/or III), NF-1 loss of function, and/or RAS activation." (Requires progression after prior systemic therapy; her last scan showed a good response. RAS/BRAF/NF1 status not reported.)
  Reviewer verdict: [ ]

- v143 NCT06157151 PRGN-2009 in Combination With Pembrolizumab in Patients With Recurrent or Metastatic Cervical Cancer
  judge-a: **possibly** - I2 met: "Recurrent or metastatic cervical cancer (histologically or cytologically confirmed)" / I3 met: "Must have been treated with pembrolizumab, either as monotherapy or in combination, for atleast 6 weeks." / I4 met: "Subjects must have histologically or cytologically confirmed HPV positive disease" (Criteria met with no progression clause, but she is still responding to first-line chemo-IO (run 30 rule).)
  Reviewer verdict: [ ]

- v143 NCT06910657 IDOV-Immune for Advanced Solid Tumors
  judge-a: **excluded** - I2 not_met: "Histologically or cytologically confirmed advanced solid tumors that have progressed despite standard therapy, or for which no standard therapy exists." (Cervical cancer is a listed condition, but she is responding to first-line standard therapy.)
  Reviewer verdict: [ ]

- v143 NCT07415681 GCCC 2578 Randomized Photon vs Proton RT for Newly Diagnosed Gynecologic Primaries
  judge-a: **excluded** - E1 not_met: "Metastatic disease beyond para-aortic lymph nodal region" / I1 not_met: "cervical cancer planning to receive definitive chemoradiation with HDR brachytherapy boost" (Definitive pelvic RT study; she has supraclavicular and lung metastases on systemic therapy.)
  Reviewer verdict: [ ]

- v143 NCT07470853 A Study of MUC16-Directed Antibody Drug Conjugate HWK-016 in Participants With Advanced Solid Tumors.
  judge-a: **not_relevant** - I2 not_met: "Monotherapy escalation, backfill and expansion cohorts:" (Cohorts are endometrial and ovarian cancer only.)
  Reviewer verdict: [ ]

- v143 NCT07643012 Adaptive Daily MR-Guided Adjuvant Pelvic Therapy-Endometrial Cancer
  judge-a: **not_relevant** - I1 not_met: "Histologically confirmed endometrial carcinoma" (Endometrial adjuvant RT study.)
  Reviewer verdict: [ ]

- v145 NCT04585750 The Evaluation of PC14586 in Patients With Advanced Solid Tumors Harboring a TP53 Y220C Mutation (PYNNACLE)
  judge-a: **excluded** - I3 not_met: "Eastern Cooperative Oncology Group (ECOG) status of 0 or 1" / I2 unknown: "Locally advanced or metastatic solid malignancy with a TP53 Y220C mutation" (p53 abnormal but the variant is not reported; ECOG 2 fails ECOG 0-1 either way.)
  Reviewer verdict: [ ]

- v145 NCT05686226 E7 TCR-T Cell Immunotherapy for Human Papillomavirus (HPV) Associated Cancers
  judge-a: **not_relevant** - I1 not_met: "Histologically or cytologically confirmed metastatic or refractory/recurrent HPV-16+ cancer." (HPV16-associated cancers; uterine carcinosarcoma is not among them.)
  Reviewer verdict: [ ]

- v145 NCT06293898 Open Label Study to Evaluate BL-M07D1 in HER2 Expressing Malignant Solid Tumors
  judge-a: **excluded** - I11 not_met: "Eastern Cooperative Oncology Group performance status (ECOG PS) of 0 to 1" / I7 met: "Cohort 1: Participants with HER2 expression in endometrial cancers" (HER2 2+ endometrial after 3 lines fits cohort 1, but ECOG 2 fails ECOG 0-1.)
  Reviewer verdict: [ ]

- v145 NCT06330064 A Study to Evaluate the Efficacy and Safety of Ifinatamab Deruxtecan (I-DXd) in Subjects With Recurrent or Met
  judge-a: **excluded** - I7 not_met: "Has an Eastern Cooperative Oncology Group (ECOG) performance status of 0 or 1." / I9 met: "Pathologically or cytologically documented EC of any histological carcinoma subtype or endometrial carcinosarcoma" / I10 met: "Relapse or progression after a platinum-containing systemic treatment and an immune checkpoint inhibitor (ICI)-containing regimen (combined or sequential)." (EC cohort accepts carcinosarcoma and she has had platinum and ICI with 3 lines, but she is ECOG 2.)
  Reviewer verdict: [ ]

- v145 NCT06463028 Sapanisertib and Serabelisib (PIKTOR) With Paclitaxel and a Substudy With an Insulin-Suppressing Diet in Patie
  judge-a: **excluded** - I1 not_met: "Histologically confirmed diagnosis of endometrioid endometrial carcinoma." / I6 not_met: "Eastern Cooperative Oncology Group (ECOG) performance status of ≤ 1 at Screening." (Endometrioid-only (subtype rule) and ECOG 0-1; she has carcinosarcoma and ECOG 2.)
  Reviewer verdict: [ ]

- v145 NCT06481592 A Study of Lifileucel (Tumor-infiltrating Lymphocytes) in Adults With Advanced Endometrial Cancer.
  judge-a: **excluded** - I4 not_met: "Participants who have an Eastern Cooperative Oncology Group (ECOG) performance status of 0 or 1" / I1 met: "All histologies, including carcinosarcoma, will be allowed." (Carcinosarcoma and line counts fit (3 lines, 2 of them chemo), but ECOG 2 fails ECOG 0-1.)
  Reviewer verdict: [ ]

- v145 NCT06543576 External Beam Radiation Therapy and Brachytherapy With Chemotherapy and Immunotherapy for the Treatment of Sta
  judge-a: **not_relevant** - I1 not_met: "histologically confirmed diagnosis of Stage IVB cervical cancer" (Cervical cancer trial (entity rule).)
  Reviewer verdict: [ ]

- v145 NCT06705075 Evaluation of Uterine Fibroids by CEUS and SHAPE Pre and Post UAE
  judge-a: **not_relevant** - I1 not_met: "Be a female diagnosed with endometrial cancer and scheduled for UAE." (Uterine fibroid embolization imaging study; she has had a hysterectomy and no UAE is planned (procedure rule).)
  Reviewer verdict: [ ]

- v145 NCT06952504 A Study to Compare Sacituzumab Tirumotecan (MK-2870) in Combination With Pembrolizumab (MK-3475) Versus Pembro
  judge-a: **excluded** - E1 not_met: "Has carcinosarcoma, neuroendocrine tumors or endometrial sarcoma" / I3 not_met: "Has received no prior systemic therapy for endometrial carcinoma" / E8 not_met: "Received prior therapy in any setting with any of the following: anti-programmed cell death 1 protein" (First-line pMMR trial excluding carcinosarcoma and prior PD-1.)
  Reviewer verdict: [ ]

- v145 NCT07436793 Progestins for the Treatment of Endometrial Cancer or Precancers of the Uterus Before Surgery, The Pro-Window 
  judge-a: **excluded** - E1 not_met: "Patients with any non-endometrioid histology (such as serous, clear cell, or carcinosarcoma or mixed)" / E5 not_met: "Patients who have previously received systemic, radiation or other treatment for uterine cancer" (Pre-surgical endometrioid window trial; carcinosarcoma, already resected and heavily treated.)
  Reviewer verdict: [ ]

- v146 NCT05564377 Targeted Therapy Directed by Genetic Testing in Treating Patients With Locally Advanced or Advanced Solid Tumo
  judge-a: **possibly** - I5 met: "Patients must have locally advanced or advanced histologically documented solid tumors requiring therapy" / I4 unknown: "All patients must have sequencing results available from a National Cancer Institute (NCI) credentialed Designated Laboratory (DL)" / I3 unknown: "Patient must be deemed potentially eligible for a ComboMATCH Treatment Trial as assessed by the enrolling provider" (Recurrence after cisplatin chemoradiation counts as progression after one line; sequencing and a matching treatment arm are unknown, and curative exenteration is still under discussion.)
  Reviewer verdict: [ ]

- v147 NCT05642455 SPEARHEAD-3 Pediatric Study
  judge-a: **possibly** - I1 met: "Osteosarcoma (OS)" / I5 met: "Must have previously received a systemic chemotherapy" / I7 unknown: "HLA-A*02 positive" / I8 unknown: "Tumor shows MAGE-A4 expression confirmed by central laboratory." (Osteosarcoma at age 19 fits; HLA-A*02, MAGE-A4 and measurable disease unknown, and no numbered relapse requirement is shown while he is on curative MAP (title rule).)
  Reviewer verdict: [ ]

- v147 NCT05711615 Testing Low-Dose Common Chemotherapy (Liposomal Doxorubicin) in Combination With an Anti-Cancer Drug, Peposert
  judge-a: **not_relevant** - I2 not_met: "Patients must have histologic diagnosis of leiomyosarcoma (LMS) or selected soft tissue sarcomas" (Selected soft tissue sarcomas only (entity rule).)
  Reviewer verdict: [ ]

- v147 NCT06239272 NRSTS2021, A Risk Adapted Study Evaluating Maintenance Pazopanib, Limited Margin, Dose-Escalated Radiation The
  judge-a: **not_relevant** - I1 not_met: "Patients must be 1-30 years at the time of the biopsy that established the diagnosis of NRSTS." / E7 not_met: "Patients must have had no prior anthracycline or ifosfamide chemotherapy" (Non-rhabdomyosarcoma soft tissue sarcoma; skeletal osteosarcoma is a bone sarcoma (only extraskeletal osteosarcoma is listed).)
  Reviewer verdict: [ ]

- v147 NCT06263231 A Study to Investigate Efficacy & Safety of Intratumoral INT230-6 Compared to US Standard of Care in Adults Wi
  judge-a: **not_relevant** - I3 not_met: "Soft Tissue Sarcoma (STS) only of the following subtypes: liposarcoma (dedifferentiated, myxoid, round cell or pleomorphic), leiomyosarcoma, and undifferentiated pleomorphic sarcoma" (Selected soft tissue sarcomas only (entity rule).)
  Reviewer verdict: [ ]

- v147 NCT06327477 Proton-Spatially Fractionated Radiotherapy and Standard Radiation Therapy for the Treatment of Newly Diagnosed
  judge-a: **not_relevant** - I1 not_met: "Patients must have newly diagnosed, histologically or cytologically confirmed, untreated retroperitoneal soft tissue sarcoma" (Retroperitoneal soft tissue sarcoma RT trial.)
  Reviewer verdict: [ ]

- v147 NCT07725380 Domatinostat With Sirolimus for Relapsed, Refractory Sarcoma and Osteosarcoma
  judge-a: **excluded** - I2 not_met: "Histologically confirmed relapsed or refractory sarcoma (Phase 1) or osteosarcoma (Phase 2)." / I4 not_met: "Not candidates for available therapies known to provide survival benefit." (Relapsed/refractory osteosarcoma; he is newly diagnosed on curative MAP.)
  Reviewer verdict: [ ]

- v148 NCT04370587 A Clinical Study of Intratumoral MVR-T3011 (T3011) Given as a Single Agent and in Combination With Intravenous
  judge-a: **possibly** - I3 met: "Phase 1 - Histologically or pathologically confirmed locally recurrent or metastatic advanced malignancy." / I6 not_met: "Arm C - Sarcoma. Participants must have received no more than three lines of prior anti-cancer therapies." / I10 unknown: "Must have at least 1 tumor lesion that is accessible for IT injection of T3011 in the opinion of the investigator." (Sarcoma arm capped at 3 lines (she is on her 4th); Phase 1 any-tumor part fits if a liver lesion is injectable.)
  Reviewer verdict: [ ]

- v148 NCT06242470 A Study of MGC026 in Participants With Advanced Solid Tumors
  judge-a: **eligible** - I4 met: "Unresectable, locally advanced or metastatic solid tumors including: squamous cell cancer (SCC) of the head and neck, esophageal SCC, squamous and non-squamous non-small cell lung cancer, small cell lung cancer, bladder cancer, sarcoma" / I5 met: "Measurable disease per RECIST v1.1." / E5 met: "Prior treatment with any B7-H3 targeted agent for cancer or any ADC with a topoisomerase payload." (Sarcoma listed; ECOG 0-1, measurable, no failing criterion.)
  Reviewer verdict: [ ]

- v148 NCT07467772 Ph 2 Elacestrant in ER Positive Uterine Sarcomas
  judge-a: **not_relevant** - I1 not_met: "Participant must have histologically confirmed uterine sarcoma of one of the following subtypes" (ER-positive uterine sarcoma trial.)
  Reviewer verdict: [ ]

- v149 NCT03816345 Testing an Immunotherapy Anti-cancer Drug, Nivolumab, for Advanced Cancers in Patients With Autoimmune Disorde
  judge-a: **not_relevant** - I20 not_met: "Patients with more than one autoimmune disease are eligible." (AIM-NIVO is for patients with autoimmune disease; he has none and LMS is not a PD-1 indication.)
  Reviewer verdict: [ ]

- v149 NCT04939610 A Study of 177Lu-FAP-2286 in Advanced Solid Tumors
  judge-a: **excluded** - I12 not_met: "Tumor must be refractory to or have progressed following prior treatment and have no satisfactory alternative treatment options." (Phase 1 needs no satisfactory alternative; standard LMS options remain after two lines. Phase 2 cohorts are pancreas/lung/breast.)
  Reviewer verdict: [ ]

- v149 NCT05684965 XTX301 in Patients With Advanced Solid Tumors
  judge-a: **eligible** - I1 met: "Part 1A - Any histologically or cytologically confirmed solid tumor malignancy that is locally advanced or metastatic and has failed standard therapy" / I10 met: "ECOG performance status of 0-2 for Phase 1" / E8 met: "Active hepatitis B or active hepatitis C infection" (Any-tumor Part 1A; LMS progressing after doxorubicin and gem/docetaxel; no liver metastases; HCV cured.)
  Reviewer verdict: [ ]

- v149 NCT06234098 Study to Investigate the Safety, Tolerability, Pharmacokinetics, Pharmocodynamics and Preliminary Antitumor Ac
  judge-a: **possibly** - I1 unknown: "The patient has a histologically or cytologically confirmed unresectable or metastatic solid tumor that is refractory to standard therapy" / I5 met: "The patient has an ECOG performance status of 0 to 2." (Refractory to two standard lines, but resectability of the regional recurrence is not stated; cured HCV with no detectable RNA passes E12.)
  Reviewer verdict: [ ]

- v149 NCT06655246 A Study of Ziftomenib in Combination With Imatinib in Patients With Advanced Gastrointestinal Stromal Tumors (
  judge-a: **not_relevant** - I1 not_met: "Documented diagnosis of advanced/metastatic KIT-mutant GIST." (GIST trial.)
  Reviewer verdict: [ ]

- v150 NCT05019703 Atezolizumab and Cabozantinib for the Treatment of Adolescents and Young Adults With Recurrent or Metastatic O
  judge-a: **not_relevant** - I4 not_met: "Histologically confirmed diagnosis of osteosarcoma" (Osteosarcoma only.)
  Reviewer verdict: [ ]

- v150 NCT06474676 T Cell Membrane-Anchored Tumor-Targeted IL12 -Modified TIL Cell Therapy (attIL12-TIL) for Advanced/Metastatic 
  judge-a: **possibly** - I2 unknown: "Histologically-confirmed locally advanced or metastatic soft tissue or bone sarcoma scheduled to undergo resection or biopsy as part of standard of care" / I6 met: "Participants must have received at least 1 prior line of systemic therapy for the treatment of sarcoma" (Metastatic bone sarcoma after prior therapy; scheduled resection/biopsy not stated.)
  Reviewer verdict: [ ]

- v150 NCT07193550 A Phase 2 Trial of Zanzalintinib in Advanced/Metastatic Bone Sarcomas (ZAMBONE)
  judge-a: **eligible** - I1 met: "Cohort B - Ewing sarcoma" / I4 met: "Patients may have received no more than 2 prior lines of systemic therapy in the advanced/metastatic setting." / I6 met: "Patients must have a performance status corresponding to ECOG scores of 0, 1 or 2 (Karnofsky ≥60%)." / E5 met: "Patients previously treated with other VEGF-targeted TKIs" (Metastatic Ewing (cohort B) relapsed after frontline VDC/IE and one metastatic line; ECOG 2, measurable, no prior VEGF TKI.)
  Reviewer verdict: [ ]

- v150 NCT07725380 Domatinostat With Sirolimus for Relapsed, Refractory Sarcoma and Osteosarcoma
  judge-a: **possibly** - I2 met: "Histologically confirmed relapsed or refractory sarcoma (Phase 1)" / I4 unknown: "Not candidates for available therapies known to provide survival benefit." / I5 met: "Karnofsky/Lansky performance score ≥60." (Phase 1 relapsed sarcoma, age 24, ECOG 2 meets KPS >= 60; whether any remaining therapy offers survival benefit is an investigator call. Phase 2 is osteosarcoma only.)
  Reviewer verdict: [ ]

- v151 NCT04031677 Surgery With or Without Neoadjuvant Chemotherapy in High Risk RetroPeritoneal Sarcoma
  judge-a: **not_relevant** - I2 not_met: "Histologically proven primary high risk leiomyosarcoma (LMS) or Liposarcoma (LPS) of retroperitoneal space or infra-peritoneal spaces of pelvis." (Retroperitoneal LMS/LPS only; he had a thigh UPS.)
  Reviewer verdict: [ ]

- v151 NCT06279013 Comparing Telephone Symptom Monitoring Interventions for Managing Symptoms and Psychological Distress During O
  judge-a: **not_relevant** - I12 not_met: "PATIENTS: Starting a new course of an oral anti-cancer agent" (Oral-agent symptom monitoring; stated plan is post-operative radiation (as v109).)
  Reviewer verdict: [ ]

- v151 NCT06480552 An Open-label Dose Escalation/Expansion Trial to Evaluate the Safety and Anti-tumor Activity of TEV-56278 Alon
  judge-a: **excluded** - I1 not_met: "must have received and progressed on established standard therapies or have been intolerant to such therapy or have been considered by the Investigator as ineligible for approved standard therapy" (Advanced solid tumor trial; he is disease-free on standard adjuvant RT.)
  Reviewer verdict: [ ]

- v151 NCT06635785 Safety, Pharmacokinetics, and Efficacy of AI-081, a Bispecific Antibody for PD-1 And VEGF in Advanced Solid Tu
  judge-a: **excluded** - I4 not_met: "Patients must have a histological or cytological diagnosis of solid tumors and have metastatic disease or locally advanced disease." / I5 not_met: "Measurable disease as determined by RECIST 1.1" (Advanced-basket rule; resected localized UPS.)
  Reviewer verdict: [ ]

- v151 NCT07218926 A Study of IDRX-42 (GSK6042981) Versus (vs) Sunitinib in Participants With Gastrointestinal Stromal Tumors Aft
  judge-a: **not_relevant** - I1 not_met: "Participants with histologically or cytologically confirmed GIST that is metastatic and/or surgically unresectable." (GIST only; UPS is a different sarcoma entity.)
  Reviewer verdict: [ ]

- v151 NCT07291297 Metformin Hydrochloride in Combination With Standard of Care Systemic Therapy in Previously Untreated Advanced
  judge-a: **excluded** - I1 not_met: "Advanced unresectable or metastatic/intermediate/high grade soft tissue sarcoma" / I3 not_met: "Initiating first line systemic therapy for advanced/metastatic disease" (First-line therapy for advanced STS; his STS is resected and localized with no systemic therapy planned.)
  Reviewer verdict: [ ]

- v151 NCT07441694 Study of INCA036978 in Participants With Myeloproliferative Neoplasms
  judge-a: **not_relevant** - I3 not_met: "Participants with MF, PV and ET as defined in the protocol." (Myeloproliferative neoplasms.)
  Reviewer verdict: [ ]

- v151 NCT07585266 A Study to Investigate Velzatinib Compared With Imatinib in Adult Participants With Previously Untreated Metas
  judge-a: **not_relevant** - I2 not_met: "Has histologically or cytologically confirmed GIST that is metastatic and/or surgically unresectable." (GIST only.)
  Reviewer verdict: [ ]

- v152 NCT01659203 Proton or Photon RT for Retroperitoneal Sarcomas
  judge-a: **not_relevant** - I1 not_met: "Histologically proven primary soft tissue sarcoma of the retroperitoneum" (Retroperitoneal sarcoma RT; her primary was in the forearm and is metastatic.)
  Reviewer verdict: [ ]

- v152 NCT03715933 Phase 1 Study of INBRX-109 in Subjects With Locally Advanced or Metastatic Solid Tumors Including Sarcomas
  judge-a: **not_relevant** - I3 not_met: "Histologically confirmed Ewing sarcoma with a classical fusion" (Part 3 cohorts are Ewing sarcoma and colorectal adenocarcinoma only.)
  Reviewer verdict: [ ]

- v152 NCT06474676 T Cell Membrane-Anchored Tumor-Targeted IL12 -Modified TIL Cell Therapy (attIL12-TIL) for Advanced/Metastatic 
  judge-a: **possibly** - I2 unknown: "Histologically-confirmed locally advanced or metastatic soft tissue or bone sarcoma scheduled to undergo resection or biopsy as part of standard of care" / I6 met: "Participants must have received at least 1 prior line of systemic therapy for the treatment of sarcoma" (Metastatic STS after prior therapy; scheduled resection/biopsy not stated.)
  Reviewer verdict: [ ]

- v152 NCT06797999 First-in-Human Study of ADCE-D01 in Soft Tissue Sarcoma
  judge-a: **excluded** - I3 not_met: "Prior treatment with at least one but no more than two lines of cytotoxic systemic therapy for metastatic/unresectable disease." (Doxorubicin/ifosfamide was given after resection of localized disease; her only metastatic-setting therapy is larotrectinib (not cytotoxic).)
  Reviewer verdict: [ ]

- v152 NCT07049848 SATURN-STS: Phase II Study of Neoadjuvant Atezolizumab With Doxorubicin, Concurrent Atezolizumab With Pre-oper
  judge-a: **excluded** - E4 not_met: "Metastatic disease or regional lymph node involvement." / E2 not_met: "Prior chemotherapy or targeted small molecule therapy for the current sarcoma." (Spindle cell sarcoma NOS is a listed histology, but the trial is for untreated resectable disease; she is metastatic after chemo and larotrectinib.)
  Reviewer verdict: [ ]

- v152 NCT07139990 Personalized Radiotherapy for Individualized Treatment Strategies and Monitoring (PRISM)
  judge-a: **excluded** - I15 not_met: "Histologically confirmed surgically resectable, high grade (FNCLCC grade 2 or 3), localized soft tissue sarcoma of the trunk or extremities" / E5 not_met: "Prior surgical resection or focal radiotherapy of a target brain metastasis" (STS cohort is localized/resectable only (she is metastatic); her only brain metastasis was resected and irradiated in 2023.)
  Reviewer verdict: [ ]

- v152 NCT07283731 Phase 2 Trial of Zanzalintinib and Pembrolizumab in Select Subtypes of Advanced/Metastatic Soft-tissue Sarcoma
  judge-a: **possibly** - I2 unknown: "Participants must have histologically or cytologically confirmed undifferentiated pleomorphic sarcoma (UPS), myxofibrosarcoma (MFS), high grade pleomorphic (HGPS) or undifferentiated sarcoma (HGUS)." / I18 met: "Participants with treated brain metastases are eligible if follow-up brain imaging after central nervous system (CNS)-directed therapy shows no evidence of progression for at least 4 weeks." / E1 met: "Prior treatment with immune checkpoint inhibitors (ICIs)" (Whether her NTRK-fusion spindle cell sarcoma is classed as high-grade undifferentiated sarcoma is not stated.)
  Reviewer verdict: [ ]

- v154 NCT03093116 A Study of Repotrectinib (TPX-0005) in Patients With Advanced Solid Tumors Harboring ALK, ROS1, or NTRK1-3 Rea
  judge-a: **possibly** - I2 unknown: "that harbors an ALK, ROS1, NTRK1, NTRK2, or NTRK3 gene rearrangement by protocol specified tests." / I14 not_met: "that harbors a ROS1, or NTRK1-3 gene fusion." (NTRK negative fails phase 2 NTRK cohorts; ALK/ROS1 fusion status not reported, so phase 1 stays open (as run 33).)
  Reviewer verdict: [ ]

- v154 NCT03816345 Testing an Immunotherapy Anti-cancer Drug, Nivolumab, for Advanced Cancers in Patients With Autoimmune Disorde
  judge-a: **not_relevant** - I20 not_met: "Patients with more than one autoimmune disease are eligible." (Trial for cancer patients with autoimmune disease; she has none and no prior PD-1.)
  Reviewer verdict: [ ]

- v154 NCT05668962 Restor. I-131 Upt. + Selpercatinib in RET F-P RAI-R TC
  judge-a: **excluded** - I1 not_met: "AND harbors a known oncogenic RET gene fusion" (RET fusion required; her tumor tested RET negative.)
  Reviewer verdict: [ ]

- v154 NCT06014658 Safety, PK, and Preliminary Efficacy of MBRC-101 in Advanced Refractory Solid Tumors
  judge-a: **possibly** - I5 unknown: "Have a histologic or cytologic diagnosis of malignant solid tumor for which there are no standard of care treatment options known to confer a clinical benefit or for which the patient is ineligible or declines." / I10 met: "Eastern Cooperative Oncology Group (ECOG) performance status ≤ 2." (Standard options remain after lenvatinib (dabrafenib/trametinib, cabozantinib); entry rests on the declines prong (run 22/34 rule).)
  Reviewer verdict: [ ]

- v154 NCT06130553 A Study of AZD3470, a PRMT5 Inhibitor, Given as Monotherapy and in Combination in Patients With MTAP Deficient
  judge-a: **possibly** - I3 unknown: "Participants have tumors meeting the protocol-defined MTAP-deficiency requirement" / I4 met: "participants must have had ≥ 1 prior line of systemic treatment in the recurrent/metastatic (advanced) setting." / I5 met: "Participants have ECOG performance status 0-1." (Progressing on lenvatinib with measurable lung metastases; MTAP status not reported.)
  Reviewer verdict: [ ]

- v154 NCT06311578 A Study of JNJ-87704916, as Monotherapy and in Combination for Advanced Solid Tumors
  judge-a: **excluded** - I1 not_met: "For Part 1: Individuals with a diagnosis of advanced or metastatic solid tumor exhausting all available standard of care therapy" / I2 unknown: "Have at least 1 injectable tumor" (Standard options remain after lenvatinib (BRAF-directed therapy, cabozantinib); Part 2 is NSCLC only.)
  Reviewer verdict: [ ]

- v154 NCT06771219 SLV-154 Treatment of Advanced Cancers
  judge-a: **eligible** - I4 met: "Presence of metastatic or recurrent locally advanced cancer." / I6 met: "Prior receipt of one or more commercially available therapies that are indicated within product labelling or recommended under current guidelines as appropriate treatment for the subject's cancer" / I2 met: "Eastern Cooperative Oncology Group (ECOG) performance status of 0 or 1." (Open advanced-cancer phase 1; metastatic, measurable, after lenvatinib, ECOG 0-1.)
  Reviewer verdict: [ ]

- v154 NCT06898450 A Study to Assess the Safety, Tolerability, and Efficacy of NDI-219216 in Patients With Advanced Solid Tumors.
  judge-a: **eligible** - I2 met: "Have unresectable and/or metastatic solid tumors (with or without MSI-H/dMMR) refractory to or intolerant to previous SoC therapy or for which no SoC therapy exists" / I1 met: "Eastern Cooperative Oncology Group (ECOG) performance status score of 0 or 1" / I3 met: "Presence of measurable disease according to RECIST version 1.1 except for Part A (Dose Escalation)" (Metastatic, progressing on lenvatinib (plain refractory wording), MSI-H not required.)
  Reviewer verdict: [ ]

- v154 NCT06959511 Zanzalintinib for the Treatment of Advanced Thyroid Cancer Before Surgery
  judge-a: **excluded** - E3 not_met: "Prior treatment with a tyrosine kinase inhibitor." / I2 unknown: "who present with locoregionally advanced disease, as defined by extrathyroidal and/or extra nodal extension, or with advanced recurrent/residual invasive/bulky nodal disease" (Neoadjuvant zanzalintinib for locoregional disease; prior lenvatinib (a TKI) rules her out.)
  Reviewer verdict: [ ]

- v154 NCT07160725 A Phase 1/2a, First-in-human, Study of BMS-986517 in Participants With Advanced Solid Tumors
  judge-a: **possibly** - I3 unknown: "Participants must have documented histologically or cytologically confirmed advanced, unresectable/metastatic solid tumors, including NSCLC, HNSCC, TNBC, and HR+/HER2- breast cancer." / I1 met: "Participants must have an ECOG performance status of 0 to 1." ("Including" list read as non-exclusive (run 22); whether thyroid cancer is accepted is not shown.)
  Reviewer verdict: [ ]

- v155 NCT03093116 A Study of Repotrectinib (TPX-0005) in Patients With Advanced Solid Tumors Harboring ALK, ROS1, or NTRK1-3 Rea
  judge-a: **possibly** - I2 unknown: "that harbors an ALK, ROS1, NTRK1, NTRK2, or NTRK3 gene rearrangement by protocol specified tests." / I14 not_met: "that harbors a ROS1, or NTRK1-3 gene fusion." (NTRK negative fails phase 2 NTRK cohorts; ALK/ROS1 fusion status not reported, so phase 1 stays open (as run 33).)
  Reviewer verdict: [ ]

- v155 NCT03816345 Testing an Immunotherapy Anti-cancer Drug, Nivolumab, for Advanced Cancers in Patients With Autoimmune Disorde
  judge-a: **not_relevant** - I20 not_met: "Patients with more than one autoimmune disease are eligible." (Trial for cancer patients with autoimmune disease; he has none and no prior PD-1.)
  Reviewer verdict: [ ]

- v155 NCT06475989 Study of Targeted Therapy vs. Chemotherapy in Patients With Thyroid Cancer
  judge-a: **excluded** - I3 not_met: "Patient must have differentiated thyroid cancer (DTC) with BRAF V600E mutation as determined by local testing" / I6 not_met: "Patient must have had prior treatment with at least one of the following vascular endothelial growth factor receptors (VEGFR)-targeting tyrosine kinase inhibitor (TKI) agents for DTC: lenvatinib or sorafenib." (BRAF V600E differentiated thyroid cancer after a VEGFR TKI; he has BRAF-negative, untreated medullary cancer.)
  Reviewer verdict: [ ]

- v155 NCT07141706 A Study of DB-1317 in Selected Advanced/Metastatic Solid Tumors
  judge-a: **excluded** - I2 not_met: "Unresectable advanced or metastatic selected solid tumors that have relapsed or progressed on or after standard systemic treatments." (No standard systemic treatment yet.)
  Reviewer verdict: [ ]

- v155 NCT07266428 A Study of OTP-01, a Dual Paratopic PD-1/VEGFR2 Antibody, in Patients With Advanced Solid Tumors
  judge-a: **possibly** - I2 unknown: "If patients decline an available standard therapeutic regimen known to confer benefit to enroll on this study, the discussion must be clearly documented in the medical record." / I2 unknown: "patients must have a tumor type as defined in the protocol." / I3 met: "Measurable disease per RECIST v1.1." (Escalation needs progression on prior therapy (none); backfill allows declining standard therapy; tumor types defined only in protocol.)
  Reviewer verdict: [ ]

- v156 NCT03816345 Testing an Immunotherapy Anti-cancer Drug, Nivolumab, for Advanced Cancers in Patients With Autoimmune Disorde
  judge-a: **not_relevant** - I20 not_met: "Patients with more than one autoimmune disease are eligible." (Trial is for cancer patients with autoimmune disease; she has none (as before).)
  Reviewer verdict: [ ]

- v156 NCT04927416 The Role of 68-Gallium-DOTATATE-PET/CT in the Imaging of Metastatic Thyroid Cancer
  judge-a: **excluded** - I3 not_met: "Patients with HTC, DTC, and MTC will be identified by the investigators." / I4 not_met: "an individual with DTC (including HTC) must meet all of the following criteria" (Imaging study limited to differentiated, Hurthle cell and medullary thyroid cancer; anaplastic is another thyroid subtype (thyroid subtype rule).)
  Reviewer verdict: [ ]

- v156 NCT06918223 Assessing Patient Satisfaction and Confidence After Use of Educational Video to Augment Surgical Consent for T
  judge-a: **possibly** - I3 unknown: "Eligible for Thyroidectomy, lobectomy, isthmusectomy for any indication" / E1 met: "History of prior thyroid surgery" (Surgical-consent education study; thyroidectomy is not in the stated plan (dabrafenib/trametinib first) but is plausible later (procedure rule).)
  Reviewer verdict: [ ]

- v156 NCT07107230 A Study of JNJ-95437446 in Participants With Advanced-Stage Solid Tumors
  judge-a: **not_relevant** - I1 not_met: "non-small cell lung cancer, colorectal carcinoma, or head and neck squamous cell carcinoma" (NSCLC, CRC and HNSCC only.)
  Reviewer verdict: [ ]

- v157 NCT04621435 Imaging of Solid Tumors Using FAP-2286
  judge-a: **eligible** - I3 met: "Agnostic to tumor type." / I2 met: "Histopathologically confirmed solid tumors in one of the following cohorts:" (FAP-2286 imaging study; agnostic and metastatic cohorts fit his metastatic papillary cancer (as v149 FAP-2286 imaging).)
  Reviewer verdict: [ ]

- v157 NCT04855656 Study of Lunresertib Alone or in Combination With RP-3500 or Debio 0123 in Patients With Advanced Solid Tumors
  judge-a: **possibly** - I7 unknown: "CCNE1 amplification (non-equivocal) as determined by either a tumor or plasma NGS test, or FISH" / I3 met: "Locally advanced or metastatic resistant or refractory solid tumors." / I2 met: "ECOG score of 0, 1, (or 2 for module 1)" (Requires CCNE1/FBXW7/PPP2R1A alterations, which were not reported.)
  Reviewer verdict: [ ]

- v157 NCT06389123 Molecularly Targeted Theranostic Approach for the Detection and Treatment of Metastatic Carcinomas
  judge-a: **eligible** - I5 met: "Participant must have documented tumor progression for metastatic disease during or following at least one prior FDA approved systemic regimen" / I7 met: "Eastern Cooperative Oncology Group Performance Status ≤ 2" / E10 met: "Pathologically confirmed NSCLC with metastatic disease" (Metastatic carcinoma progressing on approved TKIs, measurable; no failing criterion (bladder cancer 5 years ago is not active).)
  Reviewer verdict: [ ]

- v157 NCT06961084 Comparison of I-124 PET/CT for the Diagnosis of Thyroid Cancer
  judge-a: **possibly** - I2 met: "Histopathologically confirmed differentiated or poorly differentiated thyroid cancer." / I4 unknown: "Metastatic disease on imaging (CT, MRI, ultrasound or FDG PET), and considering localized therapy such as surgery and radiation therapy." / I6 unknown: "Planned I-123 imaging within 45 days after enrollment." (Metastatic DTC after thyroidectomy; whether localized therapy (e.g. RT to the growing spine lesion) and I-123 imaging are planned is not stated.)
  Reviewer verdict: [ ]

- v157 NCT07594431 Trial Comparing LATTICE Radiotherapy vs Moderately Dose-escalated Palliative Radiation for Patients With Metas
  judge-a: **possibly** - I3 unknown: "One to two metastases in non-brain sites that are amenable to LATTICE radiotherapy: >2.5 cm in short axis" / E1 unknown: "Prior radiation therapy to the tumor to be treated" / I5 met: "ECOG Performance Status 0-2" (Growing spine metastasis; size, lesion count, prior radiation to it and need for palliative RT not stated (run 35 RT rule).)
  Reviewer verdict: [ ]

- v159 NCT07169851 A Study to Evaluate LY3537021 for the Treatment of Nausea and Vomiting Caused by Chemotherapy in Adults With C
  judge-a: **not_relevant** - I1 not_met: "Chemotherapy-naive participants, planned to receive AC or cisplatin-based chemotherapy" / E5 not_met: "Signs, symptoms or history of thyroid tumors" / I2 not_met: "Have an Eastern Cooperative Oncology Group (ECOG) performance status of 0 to 2." (Antiemetic study for AC/high-dose cisplatin, which is not part of her plan; it also bars thyroid tumors and she is bedbound (as v117 antiemetic study).)
  Reviewer verdict: [ ]

- v161 NCT02734537 Radiation Therapy With or Without Cisplatin in Treating Patients With Stage III-IVA Squamous Cell Carcinoma of
  judge-a: **not_relevant** - I2 not_met: "Pathologically proven diagnosis of squamous cell carcinoma" (Resected head and neck SCC trial; she has a small-intestine neuroendocrine tumor.)
  Reviewer verdict: [ ]

- v161 NCT05304962 FIH Study of RGT-419B Alone and With Endocrine Therapy in HR-Positive, HER2-Negative Advanced/Metastatic Breas
  judge-a: **not_relevant** - I3 not_met: "Subjects must have histologically or cytologically confirmed diagnosis of ER+, HER2- ABC" (Breast cancer trial.)
  Reviewer verdict: [ ]

- v161 NCT05327686 Testing the Addition of Stereotactic Radiation Therapy With Immune Therapy for the Treatment of Patients With 
  judge-a: **not_relevant** - I1 not_met: "Pathologically (histologically or cytologically) proven diagnosis of renal cell carcinoma prior to registration" (Renal cell carcinoma trial.)
  Reviewer verdict: [ ]

- v161 NCT05735080 Open-Label Study to Evaluate the Safety, Tolerability, PK, and Efficacy of INX-315 in Patients With Advanced C
  judge-a: **possibly** - I3 unknown: "Advanced or metastatic solid tumor with known amplification of CCNE-1 that has progressed after standard therapy" / I4 met: "At least one measurable lesion as defined by RECIST v1.1 that has not previously been irradiated" / E20 unknown: "history of major surgical resection involving the stomach or small bowel" (Any-tumor arm needs CCNE1 amplification (never reported); her small-bowel primary resection and recurrent diarrhea are investigator calls.)
  Reviewer verdict: [ ]

- v161 NCT06982521 Phase 3 Study of RLY-2608 + Fulvestrant vs Capivasertib + Fulvestrant as Treatment for Locally Advanced or Met
  judge-a: **not_relevant** - I4 not_met: "Histologically or cytologically confirmed diagnosis of HR+/HER2- locally advanced or metastatic breast cancer (ABC)" (Breast cancer trial.)
  Reviewer verdict: [ ]

- v161 NCT07281417 Testing the Addition of Cemiplimab (REGN2810) to Chemotherapy Treatment Given Prior to Surgery in Patients Wit
  judge-a: **not_relevant** - I1 not_met: "Patients must have histologically confirmed squamous cell carcinoma of sinonasal origin" (Sinonasal SCC trial.)
  Reviewer verdict: [ ]

- v162 NCT03471260 Ivosidenib and Venetoclax With or Without Azacitidine in Treating Patients With IDH1 Mutated Hematologic Malig
  judge-a: **not_relevant** - I4 not_met: "Relapsed/refractory AML" (Myeloid malignancy trial.)
  Reviewer verdict: [ ]

- v162 NCT05696626 Evaluation of Lasofoxifene Combined With Abemaciclib Compared With Fulvestrant Combined With Abemaciclib in Lo
  judge-a: **not_relevant** - I3 not_met: "Histological or cytological confirmation of ER+/HER2 - disease" (Breast cancer trial.)
  Reviewer verdict: [ ]

- v162 NCT06307548 Fluorescence Image Guided Surgery Followed by Intraoperative Photodynamic Therapy for Improving Local Tumor Co
  judge-a: **not_relevant** - I2 not_met: "Patients with locally advanced or recurrent colorectal cancer undergoing surgery" (Colorectal surgery trial.)
  Reviewer verdict: [ ]

- v162 NCT06563388 Stereotactic Ablative Radiotherapy (SABR) for the Treatment of Patients With Metastatic Cancer, ID-COMET Trial
  judge-a: **possibly** - I6 met: "Trial 4: Any malignancy with metastasis." / I7 unknown: "Previously diagnosed metastatic patients (1-10 sites or oligoprogression in 5 or fewer sites with no limit on total number for Trial 4." / E7 unknown: "Inability to treat all sites of disease." (SABR for any metastatic cancer (Trial 4); number of lung nodules and whether all sites can be treated are not stated.)
  Reviewer verdict: [ ]

- v162 NCT06792695 A Study of Novel Study Interventions and Combinations in Participants With Colorectal Cancer
  judge-a: **not_relevant** - I2 not_met: "Histopathologically confirmed colorectal adenocarcinoma." (Colorectal cancer trial.)
  Reviewer verdict: [ ]

- v162 NCT06926868 A Study of Izalontamab Brengitecan Versus Chemotherapy in Participants With Previously Untreated, Locally Adva
  judge-a: **not_relevant** - I1 not_met: "metastatic triple-negative breast cancer (TNBC)" (Breast cancer trial.)
  Reviewer verdict: [ ]

- v162 NCT06959641 XL092 for the Treatment of Locally Advanced or Metastatic Radioiodine Refractory Differentiated Thyroid Cancer
  judge-a: **not_relevant** - I2 not_met: "radioactive iodine (RAI) refractory, differentiated thyroid cancer" (Thyroid cancer trial.)
  Reviewer verdict: [ ]

- v162 NCT07106762 Phase 2/3 Trial of Izalontamab Brengitecan vs Platinum-based Chemotherapy for Metastatic Urothelial Cancer Wit
  judge-a: **not_relevant** - I1 not_met: "Participants must have histologically confirmed advanced urothelial carcinoma." (Urothelial cancer trial.)
  Reviewer verdict: [ ]

- v162 NCT07221149 A Study to Evaluate the Safety and Efficacy of Pumitamig in Combination With Chemotherapy Versus Nivolumab in 
  judge-a: **not_relevant** - I1 not_met: "histologically or cytologically confirmed advanced or metastatic gastric cancer (GC)" (Gastroesophageal adenocarcinoma trial.)
  Reviewer verdict: [ ]

- v162 NCT07549412 A Study of Precemtabart Tocentecan With or Without Bevacizumab Compared to Trifluridine/Tipiracil Plus Bevaciz
  judge-a: **not_relevant** - I1 not_met: "Participants with documented histopathological diagnosis of metastatic colorectal cancer" (Colorectal cancer trial.)
  Reviewer verdict: [ ]

- v163 NCT05677490 mFOLFIRINOX Versus mFOLFOX With or Without Nivolumab for the Treatment of Advanced, Unresectable, or Metastati
  judge-a: **not_relevant** - I3 not_met: "Tumor site: esophagus, gastroesophageal junction, or stomach" (Gastroesophageal cancer trial; primary unknown.)
  Reviewer verdict: [ ]

- v163 NCT06312176 A Study of Sacituzumab Tirumotecan (MK-2870) as a Single Agent and in Combination With Pembrolizumab (MK-3475)
  judge-a: **not_relevant** - I1 not_met: "Has unresectable locally advanced or metastatic centrally-confirmed hormone receptor positive (HR+)/human epidermal growth factor receptor 2 negative (HER2-) breast cancer" (Breast cancer trial.)
  Reviewer verdict: [ ]

- v163 NCT06627647 A Global Phase III Study of Rilvegostomig or Pembrolizumab Plus Chemotherapy for First-Line Treatment of Local
  judge-a: **not_relevant** - I1 not_met: "Histologically or cytologically documented non-squamous NSCLC." (Lung cancer trial.)
  Reviewer verdict: [ ]

- v163 NCT06717347 A Study to Evaluate Zilovertamab Vedotin (MK-2140) Combination With Rituximab Plus Cyclophosphamide, Doxorubic
  judge-a: **not_relevant** - I1 not_met: "Has histologically confirmed diagnosis of diffuse large B-cell lymphoma (DLBCL)" (Lymphoma trial.)
  Reviewer verdict: [ ]

- v163 NCT07421700 Symbiotic-GU-06: A Study to Learn About PF-08634404 Alone or In Combination With Enfortumab Vedotin in Urothel
  judge-a: **not_relevant** - I2 not_met: "Histologically confirmed locally advanced or metastatic urothelial carcinoma (LA/mUC)." (Urothelial cancer trial.)
  Reviewer verdict: [ ]

- v164 NCT05086497 WBSI Guided Personalized Delivery of TTFields
  judge-a: **not_relevant** - I2 not_met: "Histologically confirmed diagnosis of GBM or molecular GBM" (Glioblastoma device study.)
  judge-b: **not_relevant** - I2 not_met: "Histologically confirmed diagnosis of GBM or molecular GBM"
  Reviewer verdict: [ ]

- v164 NCT05692635 Reducing the Incidence of Symptomatic Brain Metastases With MRI Surveillance
  judge-a: **not_relevant** - I2 not_met: "Patients with non-squamous locally advanced lung cancer" (Brain MRI surveillance for stage III lung cancer.)
  judge-b: **not_relevant** - I2 not_met: "Patients with non-squamous locally advanced lung cancer"
  Reviewer verdict: [ ]

- v164 NCT06107738 Iberdomide and Daratumumab as Maintenance Therapy After an Autologous Stem Cell Transplant for Multiple Myelom
  judge-a: **not_relevant** - I1 not_met: "Multiple Myeloma patients who have received prior DARA-containing induction therapy" (Myeloma maintenance trial.)
  judge-b: **not_relevant** - I1 not_met: "Multiple Myeloma patients who have received prior DARA-containing induction therapy"
  Reviewer verdict: [ ]

- v164 NCT07064018 Trial of Single Protein Encapsulated Doxorubicin, SPEDOX-6 in Advanced Malignancies
  judge-a: **not_relevant** - I3 not_met: "Tumor types expected to express lower levels of FcRn relative to normal tissue including: STS, TNBC, cervical cancer, NSCLC, ovarian cancer, and KRAS mutated pancreatic ductal adenocarcinoma" (Tumor list omits germ cell tumors.)
  judge-b: **not_relevant** - I3 not_met: "Tumor types expected to express lower levels of FcRn relative to normal tissue including: STS, TNBC, cervical cancer, NSCLC, ovarian cancer, and KRAS mutated pancreatic ductal adenocarcinoma" (Germ cell tumor not among the listed tumor types.)
  Reviewer verdict: [ ]

- v164 NCT07292298 Phase 2 Single-Arm Rectal Cancer Brachytherapy for Patients With Low-Lying Residual Adenocarcinoma After Total
  judge-a: **not_relevant** - I5 not_met: "Patients with MMR-proficient low-mid rectal adenocarcinoma" (Rectal cancer trial.)
  judge-b: **not_relevant** - I5 not_met: "Patients with MMR-proficient low-mid rectal adenocarcinoma"
  Reviewer verdict: [ ]
