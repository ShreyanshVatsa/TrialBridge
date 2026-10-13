# BUGS (audit, 2026-10-07)

Scope: audit only; nothing was fixed. Evidence is from running checks, scripts against the national dataset in `public/data` (5,779 trials), and reading code. Confidence: **Confirmed** = reproduced by running code or data; **Likely** = follows directly from the code but was not run end to end.

Note: running `npm run eval` regenerated `eval/RESULTS.md` and `eval/results.json`, and `npm run build` regenerated `out/` and `.wrangler/`. No source file was edited.

## Check results (all green)
| Check | Result |
|---|---|
| `npm run lint` / `npm run typecheck` | 0 errors |
| `npm test` (vitest, dot) | 124/124 pass; coverage 98.9% lines, 88.1% branches (thresholds met) |
| `npm run eval` | 0 hard-filter violations; nDCG@10 full pipeline 0.819; fact precision 66.0%; mock AI JSON 100%, quotes 99.8%, label agreement 62.2% |
| `npm run build` | exit 0, secret scan clean |
| `npm run test:e2e` (37 tests, desktop + mobile, with axe) | 37 passed |
| `npm audit --audit-level=high` | 0 vulnerabilities |

No Blocker found: the app builds, runs with no keys, and all tests pass. The defects below are correctness, safety and data-quality gaps that the green checks do not cover.

## Summary
| Severity | Count |
|---|---|
| Blocker | 0 |
| High | 3 |
| Medium | 9 |
| Low | 13 |

| ID | Sev | Title |
|---|---|---|
| H1 | High | Crisis detector misses most real-world phrasings (all 4 languages) |
| H2 | High | Rule facts misread common criteria, producing wrong conflict penalties |
| H3 | High | `solid-tumors` basket trials are invisible to patients who pick a specific cancer type |
| M1 | Medium | No crisis resources when the Q&A API is unreachable or degraded |
| M2 | Medium | `english_required` flags multi-language requirements (false positives) |
| M3 | Medium | Pediatric trials counted as "upper age limit" barriers |
| M4 | Medium | Site table splits one institution into many rows |
| M5 | Medium | Misgrouped trials: HNSCC, non-cancer trials in "other" |
| M6 | Medium | Distance filter silently dropped when ZIP lookup fails; fake centroid for non-existent ZIPs |
| M7 | Medium | Provider daily budget undercounts (1 unit per up to 4 calls) |
| M8 | Medium | PII scrubber misses names, addresses, spaced SSN, alphanumeric IDs, stated age |
| M9 | Medium | `disability_exclusion` flags non-disability criteria |
| L1-L13 | Low | See below |

---

## High

### H1. Crisis detector misses most real-world phrasings
- Severity: High. Area: Q&A safety. Confidence: Confirmed.
- File: `functions/lib/safety.ts:8-20` (`CRISIS`), used at `functions/lib/ask.ts:54`.
- What happens: the crisis check is a short regex list. Tested with `detectCrisis`; all of these return `false`, so the question goes to the normal AI or refusal path with no 988 reply:
  - "I am thinking about ending my life", "I want to take my own life", "I wish I were dead", "I don't want to be here anymore", "what's the point of living", "I might overdose".
  - pt: "Estou pensando em suicídio" (the pattern `\bsuicid` misses the accented `í`), "quero acabar com a minha vida".
  - es: "quiero acabar con mi vida". ht: "mwen ap panse swisid".
  - Only "kill myself", "end my life" (not "ending"), "suicidal" and similar forms match.
- Repro: `detectCrisis("I am thinking about ending my life")` returns false.
- Fix: widen patterns (ending/take/own life, wish dead, overdose, accent-insensitive `suicid`, "swisid", acabar com/con) and add tests per language. Consider a conservative classifier call as a second layer.

### H2. Rule facts misread common criteria, producing wrong conflict penalties
- Severity: High. Area: matching data quality (pre-check). Confidence: Confirmed (sampled from the national shards; matches the 66% precision in `eval/RESULTS.md`).
- File: `lib/ingest/facts.ts:27-63`, `config/criteria.ts:18-31`; consumed by `lib/match/precheck.ts:29-65`.
- What happens (examples from `public/data`):
  - `metastatic:required` is set on 2,156 of 5,779 trials, including "Unresectable Stage III or Stage IV..." (NCT05029999), "Metastatic disease or unresectable locally-advanced disease" (NCT04878029), "primary or metastatic malignancy" (NCT06105801). A patient answering "No, not spread" gets a 0.15 conflict penalty on these.
  - Negation is inverted. NCT06816992 "Spinal cord compression not definitively treated with surgery or radiation" becomes `prior_surgery: excluded` and `prior_radiation: excluded`. NCT06572618 (malabsorption list) becomes `prior_surgery: excluded`. NCT07140900 "No documented PSA progression following ... ADT" becomes `previously_treated: required`.
  - A list that merely mentions TNBC among tumor types (NCT07064018, NCT05932862) sets `biomarker:HER2: excluded` and `biomarker:HR: excluded`.
  - "previously untreated ... recurrent" (NCT03263572) yields `previously_treated: required` although the trial wants untreated patients.
- Impact: real trials get pushed down for a patient who actually fits, which is the opposite of "uncertain facts never penalize". The quote shown ("What might rule you out") can contradict the reading.
- Fix: treat "or"/list/"Stage III or IV" sentences as `mentioned`; apply negation to the sentence clause, not a 40-char window; require a TNBC rule to be the criterion's main subject; re-measure on a larger labeled sample (national, not seed).

### H3. `solid-tumors` basket trials are invisible to patients who pick a specific cancer type
- Severity: High. Area: retrieval recall. Confidence: Confirmed.
- File: `lib/ingest/groups.ts:18-26`, `lib/match/rank.ts:45` (`passesGroup`), `lib/match/search.ts:40`.
- What happens: 425 trials belong only to `solid-tumors`; 78 of them mention lung, 66 breast, 45 colorectal in title, conditions or inclusion text. A lung patient searches only the `lung` shard and never sees e.g. "Advanced or Metastatic Solid Tumor" studies that explicitly allow NSCLC. Only "Other / not sure" reaches them.
- Fix: for any specific group, also search the `solid-tumors` shards (or add a group tag when inclusion text names the tumor type) and let ranking sort them.

---

## Medium

### M1. No crisis resources when Q&A is unreachable or degraded
- Area: Q&A safety / offline. Confidence: Confirmed (code).
- File: `components/trial/ask-panel.tsx:84-95` (`ResponseView` shows `CrisisBox` only when the server sets `crisis`), `lib/api/ask.ts:30-55`.
- What happens: crisis detection exists only on the server. If Turnstile fails, the user is offline, rate limited, or the Worker errors, `askQuestion` returns a degraded reply ("busy") and the person who typed a crisis message sees no 988/911 information.
- Fix: run the (improved, see H1) crisis regexes in the browser before the request and show `CrisisBox` regardless of API status.

### M2. `english_required` flags multi-language requirements
- Area: barrier detection (false positive). Confidence: Confirmed.
- File: `config/barriers.ts:27` (`ENGLISH_ALTERNATIVE`), applied at `lib/ingest/barriers.ts:41-44`.
- What happens: the alternative-language check only knows "or Spanish", "Spanish or", interpreter, translated. Lists are flagged: NCT05297734 "Participants must speak English, Spanish, Chinese, or Vietnamese."; NCT04269902 "unable to read and write in English, Spanish, French, German, Russian or Mandarin may be registered ..."; NCT07226934 "Does not have ... English literacy limitations ...". Of 498 flagged trials this inflates the headline "requires English" statistic and shows a false language-warning badge to es/pt/ht users.
- Fix: treat a sentence that lists two or more languages as not English-only; handle "may be registered without" exceptions; sample-audit 50 flags.

### M3. Pediatric trials counted as "upper age limit" barriers
- Area: Access Intelligence data quality. Confidence: Confirmed.
- File: `lib/ingest/barriers.ts:46`, `config/barriers.ts:8`.
- What happens: any `maxAge < 75` is a barrier. 200 of the 526 flagged trials have `maxAge <= 25` (pediatric/AYA studies by design, e.g. "Maximum age: 17 Years"). They inflate "% with at least one barrier" (1,603 of 5,779) and state/site rates, and are never shown to adults anyway (age filter).
- Fix: only flag when `minAge >= 18` (adult-intended trials) or exclude pediatric trials from barrier stats.

### M4. Site table splits one institution into many rows
- Area: Access Intelligence. Confidence: Confirmed.
- File: `lib/access/aggregate.ts:21` (`siteKey`).
- What happens: key is normalized facility name + city + state, so variants are separate sites. Houston: "MD Anderson Cancer Center" (290), "M D Anderson Cancer Center" (185), "The University of Texas MD Anderson Cancer Center" (142) and 3 more variants. Same for MSK (3-4 rows, including "(All protocol activities)"), Mayo Rochester, City of Hope, Emory. Generic names like "Research Site" also appear. The "sites with 5+ trials" ranking and rates are therefore wrong for the largest sites.
- Fix: merge by ZIP + coordinates or an alias table for major cancer centers; drop generic facility names.

### M5. Misgrouped trials: HNSCC, non-cancer trials in "other"
- Area: grouping / data scope. Confidence: Confirmed.
- File: `lib/ingest/groups.ts:18-26`, `config/cancer-groups.ts:60` (head-neck `text` regex has no "HNSCC"/"squamous cell carcinoma of the head").
- What happens: `mapGroups` uses conditions only (title is used only for solid tumors). NCT02128906 (conditions "Squamous Cell Carcinoma", title "...in HNSCC") lands in `other`, so head-and-neck patients do not see it. The `other` group (519 trials) also contains non-cancer studies: Hyperandrogenism, Hemangioma, Bone Cyst, Lymphangioleiomyomatosis, Puberty (NCT00929006, NCT01873131, NCT02193841, NCT01799538), which appear for "not sure" searches although v1 scope is cancer trials.
- Fix: also test title/official title; add HNSCC and similar abbreviations; drop trials with no neoplasm MeSH term from the dataset.

### M6. Distance filter silently dropped when ZIP lookup fails; non-existent ZIPs get a fake centroid
- Area: filters / edge cases (bad ZIP, offline). Confidence: Confirmed (code).
- Files: `lib/match/search.ts:71` (`lookupZip(...).catch(() => null)`), `lib/match/rank.ts:39` (`maxMiles = origin ? travelMiles : null`), `lib/data/loader.ts:241-245`, `components/chat/intake-chat.tsx:208-217`.
- What happens:
  - If the ZIP table cannot load at search time (offline, 404, timeout) `origin` is null, the travel limit is skipped without a notice, and cards show no distance. The user believes results are within e.g. 25 miles.
  - `lookupZip` returns the prefix average when the exact ZIP is absent, so a non-existent ZIP in a known prefix (anything not a ZCTA) passes intake with a made-up location; "ZIP not recognized" fires only when the whole 3-digit prefix file is missing.
- Fix: show a notice (all four languages) when `origin` is null while `travelMiles` is set; reject a ZIP not present in its table, or label the location approximate.

### M7. Provider daily budget undercounts
- Area: rate limit / budget. Confidence: Confirmed (code).
- File: `functions/lib/ai/failover.ts:25` (one `consumeBudget` per provider attempt) vs `functions/lib/analyze.ts:47-62`.
- What happens: one budget unit is reserved per attempt, but `analyzeWith` makes up to 2 batched calls, each with one repair retry (up to 4 provider requests). With the shipped limits (800/day Groq/Cerebras, 40/day OpenRouter) the real request count can be 4x the budget, defeating "budget below the free-tier limit".
- Fix: consume budget per `provider.complete` call (pass a `consume` callback into `analyzeWith`).

### M8. PII scrubber misses several identifiers
- Area: privacy (Q&A free text). Confidence: Confirmed (ran `scrubPersonalInfo`).
- File: `lib/privacy/scrub.ts:6-16`.
- What happens: not removed: names and street addresses ("My name is John Smith, I live at 123 Main Street, Springfield"), SSN with spaces ("123 45 6789"), alphanumeric MRNs ("AB123456"), "my birthday is the 5th of May", stated age ("I am a 67 year old woman in Boston") - the plan says exact age must never be sent. 5-digit numbers (patient ID, ZIP) are removed. The same scrubber runs in the browser and server, so the gap is end to end; text goes to the provider.
- Fix: add age phrases ("N years old", "N yo"), spaced SSN, alphanumeric IDs (>=6 chars with digits), "my name is ..." and street-number patterns; keep the UI notice.

### M9. `disability_exclusion` flags non-disability criteria
- Area: barrier detection (false positive). Confidence: Confirmed.
- File: `config/barriers.ts:30-47`, `lib/ingest/barriers.ts:50`.
- What happens: sampled flags include NCT05753306 (chemotherapy hypersensitivity "...resulted in persistent or significant disability"), NCT06569693 (chronotype/shift work), and many generic "psychiatric illness/social situations that would limit compliance" lines, which are counted as disability barriers (832 flagged = 14%). `MEDICAL_REASON` also whitelists words like "uncontrolled" and "risk of", so true unjustified exclusions can be missed.
- Fix: require disability terms to refer to the participant's own impairment as an exclusion subject; separate "psychiatric compliance" into its own category or drop it; sample-audit 50 flags.

---

## Low

### L1. Q&A refusal text uses "qualify" (wording rule)
- Area: wording. Confidence: Confirmed.
- File: `functions/lib/safety.ts:76,86,96,106` (en "whether you qualify", es "califica", pt "se qualifica", ht "kalifye").
- PLAN rule: never say "eligible"/"qualify". UI strings in all 4 languages are clean (only the noun "eligibility criteria" and ht "kalifikasyon" appear). Fix: reword to "whether this trial is a match for you".

### L2. Model-written answers are not checked for banned wording or advice
- Area: Q&A / analysis safety. Confidence: Likely.
- File: `functions/lib/ask.ts:86-103`, `functions/lib/analyze.ts:52-53`.
- Only prompts forbid "eligible"/"qualify" and treatment advice; output validation checks structure and quotes only, and the text is cached 30 days. Not testable with the mock provider. Fix: add a deterministic post-filter for banned words and refusal-pattern phrases; replace with the safe reply.

### L3. Question counter is consumed even when the request fails
- Area: Q&A UX. Confidence: Confirmed (code).
- File: `lib/api/ask.ts:33` increments `asked` before `fetch`. A failed or degraded request still uses one of the 10 questions.

### L4. Page titles and meta are English only on non-trial pages
- Area: i18n / accessibility. Confidence: Confirmed (code).
- File: `app/layout.tsx:12-16`; `document.title` is set only in `components/trial/trial-detail.tsx:74`. In es/pt/ht the tab title, meta description and `app/offline/page.tsx` title stay English (static export).
- Fix: set `document.title` from the active messages on language change.

### L5. Sex restriction is stored but never used in matching or on result cards
- Area: filters. Confidence: Confirmed (grep: `sex` is read only at `components/trial/trial-detail.tsx:134`).
- 518 female-only and 383 male-only trials; for "not sure" searches they appear for anyone, and cards do not show the restriction. Specific groups are barely affected (0-1 mismatched trials in prostate/lung). Fix: show the badge on cards; optionally ask sex or de-rank.

### L6. Service worker cache never evicts old assets
- Area: PWA. Confidence: Likely.
- File: `public/sw.js:6` (`VERSION = "tb-shell-v1"` constant). Hashed `/_next/static/*` entries accumulate; the update prompt only fires if `sw.js` bytes change. Fix: bake the build id into `VERSION`.

### L7. Unused, unpinned dependency `cn`
- Area: supply chain. Confidence: Confirmed.
- File: `package.json:40` (`"cn": "^0.4.0"`; no import anywhere). Violates "pinned, minimal dependencies" and looks like an accidental install (a different package from the local `cn` helper). Fix: remove it.

### L8. CSP allows `style-src 'unsafe-inline'`
- Area: security. Confidence: Confirmed.
- File: `public/_headers:6`. Header comments justify only `wasm-unsafe-eval`. Cause is inline `style=` attributes (progress bar, charts). Low risk (script-src is strict) but undocumented. Fix: document it, or use nonces/classes.

### L9. `DATA_VERSION` is "seed" while serving national data
- Area: cache config. Confidence: Confirmed.
- File: `wrangler.jsonc:26`; `/api/health` reports `seed`. Cache keys also hash trial content (`analyze.ts:97`), so results stay correct, but the labeled version is misleading. `database_id` is the zero placeholder (deployment is deferred).

### L10. Search progress bar does not advance when it joins a prefetch
- Area: UX. Confidence: Confirmed (code).
- File: `lib/data/loader.ts:111-119` (`memo` returns the first caller's promise, so the second caller's `onProgress` is never invoked); `lib/match/search.ts:107-121` starts the prefetch with no callback. If the user clicks Search while the shard is still downloading, the progress UI shows 0% until done.

### L11. Request body is read fully before the size check when no Content-Length
- Area: backend hardening. Confidence: Likely.
- File: `functions/lib/http.ts:66-70`. A chunked body is buffered by `request.text()` before the 16 KB check. Fix: read via a limited stream reader.

### L12. Circuit breaker half-open lets every concurrent request through
- Area: reliability. Confidence: Confirmed (code).
- File: `functions/lib/ai/circuit.ts:16-19`. After the cooldown `canRequest()` is true for all callers, not one probe. Fix: track an in-flight probe flag.

### L13. Evaluation is weak evidence for the national product
- Area: eval / tests. Confidence: Confirmed.
- `eval/RESULTS.md`: runs on the 301-trial seed, not the 5,779 national set; labels are rule-generated; hybrid nDCG@10 (0.786) is not better than keyword only (0.787), so the retrieval gain comes from the pre-check; "excluded-label share" in the top 10 is 26%; fact precision (66%) is from 50 seed items; mock AI agreement with labels is 62%. Rate-limit counters persist in D1 between direct `playwright test` runs (10 analyses/hour) so e2e is only stable via `npm run test:e2e`, which resets them.

---

## Not bugs / by design
- All Q&A and analysis run on the mock provider with no keys; `dataTermsVerified` is false for every real provider, so real providers are never called.
- Uncertain facts are `mentioned` and never penalize (but see H2 for misread directions).
- Pregnancy question asked of everyone (PLAN Part 2); only "yes" can conflict.
- No ZIP/age/travel in any request: `lib/privacy/minimize.ts` plus strict zod schemas and the e2e network test confirm this.
- Trial LCP waits on client-loaded data (Lighthouse trial ~87-90 simulated); first cold search downloads ~37 MB (model 23 MB, wasm 14 MB) plus a 5-10 MB shard, hidden by prefetch (skipped on Save-Data).
- Official trial text and quotes stay in English; "not yet reviewed by native speakers" note present. Translation keys: es/pt/ht have zero missing keys and no placeholder mismatches (enforced by `Messages` typing).
- Checks that passed with no defect found: no `dangerouslySetInnerHTML`, no `console.log` of user data (only request id, route, status, latency), same-origin and 16 KB limits, strict zod on all endpoints, per-IP salted daily hash, quote verification and repair retry paths, 404 for bad trial id, under-18 message, age 18-110.
- Local `ENVIRONMENT: development` and test Turnstile keys are the intended local defaults.

## Deferred by user (not reported as bugs)
Hosting and deployment (Cloudflare, D1 import, domain, secrets, production Turnstile keys), CI workflows, monthly refresh workflow, Dependabot, full Ollama/llama.cpp LLM fact extraction (only 4 trials tested), `npm run eval:live`, partner email (`NEXT_PUBLIC_PARTNER_EMAIL`), founder story text, clinician-reviewed labels, native-speaker translation review.

---

## Fix status (2026-10-07)

Fixed (commits 4643ebc backend/data, 8046053 UI): H1, H2, H3, M1, M2, M3, M4, M5, M6, M7, M8, L1, L2, L3, L4, L5, L7, L8, L9, L10, L11, L12.

Partial: M9 (psychiatric-compliance exclusions stay flagged by design, see DECISIONS.md).

Fixed later: L6 (commit 3106673: `scripts/postbuild.ts` stamps a build id into `public/sw.js`, whose activate handler deletes every other `tb-shell-*` cache; v5 adds an e2e check that a stale `tb-shell-*` cache is evicted on activation, re-fetches the manifest once when a shard or bucket returns 404, and removes the stale `/data/lookup.json` header rule).

Still open, partly addressed: L13 (eval is weak evidence for the national product). Done in v5 (2026-10-12), see `eval/RESULTS.md`: a random-order baseline and a BM25 baseline on the same hard-filtered candidates, paired-bootstrap 95% CIs, a national-scale headline (5,726 trials), the title/condition regex labels demoted to a smoke test, and an independent hard-filter oracle computed from raw CT.gov fields (the earlier "0% violations" was true by construction and is withdrawn as evidence). Random scores 0.377 [0.321, 0.432] on the national headline against 0.784 [0.684, 0.870] for the pipeline (0.744 vs 0.809 on the seed smoke test). Not yet done: the graded vignette benchmark (`eval/gold/`) and the TREC cancer subset (`eval/trec/`) exist as data and tooling but their results are not in RESULTS.md, so retrieval quality still rests on regex labels that BM25 also reads; the pipeline's excluded-label share is not better than random; the oracle flags 3.7% of national candidates and 1.9% of seed results on cancer group (mixed tags and some real mis-tags, e.g. non-cancer studies tagged lymphoma), unaudited. Fact precision (66%) is unchanged.

Effects on national data after the rule fixes (5,726 trials; 53 non-cancer studies dropped): `metastatic:required` 2,156 to 817; `upper_age_limit` 526 to 185; any barrier 1,603 to 1,270. Seed nDCG@10 moved 0.819 to 0.800 because fewer rule penalties now reorder results; labels are synthetic.

Verified after fixes: lint, typecheck, 219 unit tests, `npm audit` (0), build, eval (0% hard-filter violations). Agents report 40/40 e2e passing; not re-run by the coordinator.
- tests/unit/backend.test.ts "ships with every provider disabled until data terms are verified" fails: stale vs Groq dataTermsVerified=true (pre-existing at b0914f5). Not edited; needs test update.
- npm run eval:vignettes fails after merge: eval/gold/vignettes-gold-v1.json missing (not on any merged branch). No vignette metrics baseline.
