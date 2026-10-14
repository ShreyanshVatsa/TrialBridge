# TrialBridge 2-minute demo (v6 criterion matching)

All three patients below are **synthetic** (invented for the demo, not real people). Nothing in the demo is medical advice, and TrialBridge never says a person is eligible: it shows possible matches to discuss with a care team.

## Setup (before the demo)
- `npm run build`, then serve it. For the reproducible run below, start the Worker with no AI keys so the deterministic path is shown: `npx wrangler dev --port 8790 --assets out --env-file <file with .dev.vars minus the *_API_KEY lines>`. With a Groq key and quota, the AI judge also runs: fewer items stay unknown, and the order can differ from what is written here.
- Choose **Thorough** on the first question. Answer only what is listed; for every other question press the first "Other ways to answer" chip ("I don't know").
- Verified on 2026-10-13 against data version national-20261007-9b70994dd3, no AI keys (resolver-only, degraded banner on). A data refresh can change which trials appear.

## Script (about 2 minutes)

**0:00-0:15: Opening.** "Trial criteria are long lists. TrialBridge splits each trial's criteria into numbered requirements and checks them one by one against your answers. Anything your answers don't settle stays unknown, and unknown never pushes a trial down."

**0:15-0:50: Patient B, the main example (synthetic).** Lung cancer, age 67, ZIP 10032, up to 250 miles. Spread: "Yes, to other organs or bones". Daily activity: "I take care of myself but rest during the day" (ECOG 2). Brain: "Yes, and not treated yet or growing". Test results: EGFR Positive, ALK Negative.
- Point at the banner: AI reading is off, so only simple rules were used and more requirements show as unknown.
- Scroll to the heading **"Possible matches with a requirement that may not fit"** (Tier B). In the verified run it held results 9 and 10:
  - **NCT07462377**, "A Phase 1 Study of EPI-326 in EGFR-mutant NSCLC and HNSCC": "The requirement that may not fit" quotes exclusion criterion 2, "Participant has symptomatic brain metastases.", with "Your answer about cancer in the brain does not fit this rule." The patient said the brain spots are untreated or growing, so the trial is listed lower, not hidden.
  - **NCT07315113**, "Study of NXP900 With Osimertinib in ... EGFR-Mutated Non-Small Cell Lung Cancer": inclusion criterion 3, "Eastern Cooperative Oncology Group (ECOG) performance status of 0-1.", with "Your daily activity level is outside what this rule allows."
- Say: "Both are dropped to the lower group with the exact requirement, in the trial's own words. The care team decides if it really rules the person out."

**0:50-1:20: Patient A, the checklist (synthetic).** Breast cancer, age 58, ZIP 02115, up to 250 miles. Spread: "Yes, to other organs or bones". Sex (if asked): Female. Daily activity: "My usual activities, with little or no limits". Brain (if asked): No. Test results: HER2 Positive, Hormone receptor (ER/PR) Negative.
- On result 1 (verified run: NCT06072612, "Study of the Bria-IMT Regimen and CPI vs Physicians' Choice in Advanced Metastatic Breast Cancer"), read the "Why it is listed here" line ("looks to meet 2 of 34 requirements we could check, and nothing we found rules you out. 32 requirements are still unknown.").
- Open "See how your answers compare with each requirement": show the ✓ looks met, ✗ may not fit and ? unknown rows, each with the trial's own text and the reason. All ten results were in Tier A in the verified run.

**1:20-1:45: Patient C, unknowns become questions (synthetic).** Colorectal cancer, age 45, ZIP 77030, up to 250 miles. Spread: "Yes, to other organs or bones". Daily activity: "My usual activities, with little or no limits". Measurable disease (if asked): Yes. Test results: MSI-high / dMMR Positive.
- Show that the many unknown requirements feed the "Find out" / ask-your-doctor list, ordered by how many requirements each answer would settle. Do not present result 1 as a fit: in the verified run it was a microsatellite-stable (MSS) trial that the rules could not settle (BUGS.md).

**1:45-2:00: Close.** "The words are always the trial's own; a model never writes the quote. With AI turned on, a model reads the requirements the rules couldn't settle. On the TREC benchmark that raised nDCG@10 by 0.063 [0.011, 0.119] on the development topics. It is not a clinical-accuracy claim, and the test-split AI run is still pending (eval/RESULTS.md)."

## How this was checked
A throwaway Playwright probe (not committed) drove the real UI for the three patients above with the helpers in `tests/e2e/helpers.ts`, against `wrangler dev` with the mock provider, and recorded the result order, the Tier B heading and each Tier B card's failing requirement. The Tier B entries and quotes above are copied from that run. An earlier run of the same probe also showed two wrong exclusions on NCT07315113 for an EGFR-positive answer ("other than EGFR", "resistance to osimertinib"). Those are now fixed (BUGS.md, step 9), and the run above came after the fix.
