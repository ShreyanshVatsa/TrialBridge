# PROGRESS

Current checkpoint: P2 complete under the competition-first override (hosting/deploy/CI/Dependabot/domain deferred). Backend track = data/matching/backend/tests; UI track = app/ + components/.

## Done (P0, Backend track)
- Scaffold: Next 16 static export, TS 5.9 strict, Tailwind 4, shadcn (base-ui), Vitest, Playwright deps, wrangler.jsonc (Workers + static assets + D1), .dev.vars (empty), .gitignore.
- Shared zod types (lib/types), API contract (API.md), data minimization (lib/privacy/minimize.ts).
- Seed: 302 real recruiting interventional U.S. cancer trials (data/seed/studies.json), 20 groups populated, 51 states.
- Ingestion (`npm run ingest:seed`, national `npm run ingest` resumable): zod validation, groups via MeSH, barriers, rule facts, int8 embeddings (cached), shards, ZIP tables, safety aborts (>5% invalid, >40% drop), atomic swap, D1 SQL copy.
- Matching (lib/match): hand-written cosine.ts / rrf.ts / score.ts, filters, pre-check, rank, browser search with Web Worker embeddings (verified in headless Chromium: model + wasm self-hosted, no CSP errors, ~9 s first search incl. model download).
- Backend (functions/): POST /api/analyze with mock + OpenAI-compatible failover, circuit breaker, daily budgets, D1 cache (30 d) + rate limit (10/h), Turnstile, same-origin, 16 KB limit, quote verification + one repair retry, graceful degradation. Verified with `wrangler dev` + local D1.
- Security: public/_headers (strict CSP, HSTS, frame-ancestors none, nosniff, Referrer/Permissions policies, caching); postbuild inline-script externalization + build-output secret scan.
- Tests: 83 unit tests passing (lib/match, minimization, ingestion rules, backend); coverage 72% lines (90% target is P2).

## Done (P0 + P1, UI track: UI)
- P0 UI: landing with animated demo, guided chat intake (9 questions, edit, summary), results cards, trial page (/trial/?id=), privacy page, error boundaries, dark mode.
- P1 Trial Q&A UI: Ask buttons on cards and trial page, 300-char limit, personal-info notice, 10/session counter, refusal/crisis (988/911)/not-in-text/busy states, citations.
- P1 Access Intelligence (/access/): filters, stat cards, U.S. tile-grid map, barrier-type chart (Recharts), cancer-type list, ranked 5+-trial site table with counts beside percentages, data date.
- P1 pages: For Research Sites (mailto Partner button), Methodology (with live eval summary from eval/results.json), About, privacy page update, privacy policy + terms drafts marked "Draft, needs legal review"; landing teaser links to /for-sites/.
- P1 nav/footer: full nav with mobile menu, language switcher, footer columns.
- P1 translations: es, pt, ht complete (components/i18n), localized cancer types/dates; "not yet reviewed by native speakers" note; Haitian Creole AI output marked experimental.
- Verified: "1 card after returning from trial page" was a test artifact (counted the trial page's own article); results persist (10/10).
- Checks: lint + typecheck clean for app/ and components/; axe no serious/critical on all pages in en/es/pt/ht, light/dark, 390px; no horizontal overflow.

## Done (P2, UI track: UI)
- PWA: manifest (any + maskable icons 192/512, apple-touch), app-shell-only service worker (never /api, /data, /models, /ort), /offline/ page, update prompt; Chromium reports no installability errors.
- No English flash: /theme-init.js (blocking, CSP-safe) sets theme + lang and hides the page until the saved language renders; non-English messages are lazy-loaded chunks.
- Speed: matching engine, AI client, Turnstile and Recharts code-split; prefetchSearch warm-up after cancer type; zod kept off landing/access critical path; manifest preload on trial page; next/font with metric-matched fallbacks; skeletons with reserved height (CLS 0).
- Lighthouse (mobile, simulated, local preview): landing 88-94, find 93, access 93, trial 87-89 performance; accessibility, best practices, SEO 100 on all. Trial LCP waits on client-loaded trial data (by design).
- Polish: chat typing indicator before each question, Enter picks top cancer match, wrapping buttons (no overflow at 320px), demo animation without opacity (contrast-safe), print view margins/URLs, dark mode checked on results.
- Axe sweep: 0 serious/critical on all 13 routes x 4 languages x light/dark (320/390/1280px) plus summary, results (4 languages) and trial + Q&A views; keyboard intake verified.

## Done (P1, Backend track)
- Lite cross-group "not sure" index + per-trial buckets; Access Intelligence aggregates (/data/access.json) + helpers (lib/access).
- POST /api/ask (crisis 988, refusals, PII scrub, grounded citations, cache, 30/h, Turnstile, mock) + client lib/api/ask.ts; API.md updated.
- llama.cpp LLM fact layer (`npm run ingest:llm -- --limit=N`): tested on 4 seed trials (~13-35 s/trial); full run deferred.
- `npm run eval`: 30 synthetic profiles; 0% hard-filter violations; full-pipeline nDCG@10 0.819; fact precision 66%; mock AI JSON 100%, quotes 99.8%.
- E2E (Playwright, 11 tests): main flow x3 + mobile, AI fallback, data-minimization network test, Q&A safety UI + API. Pass on seed and national data.
- National ingest: 5,888 fetched, 5,779 trials, 51 states, 107 out of scope, 2 invalid; resumable rerun uses cached pages + embeddings (8.6 s).

## Done (P2, Backend track)
- Unit tests: 124 passing; coverage lib/ + functions/lib/ 98.9% lines, 97.3% statements, 95.5% functions, 88.1% branches; thresholds enforced in vitest.config.ts. D1 code tested against real SQL (node:sqlite).
- E2E + a11y (Playwright, 37 tests): intake to results (breast/lung/not sure, mobile), AI fallback, data-minimization network test, Q&A safety (UI + API), language switching + persistence, trial page + not-found, Access filters/map/table, print view, PWA installability (manifest, SW, CDP installability), axe 0 serious/critical on 9 pages x light/dark + results + Spanish, latency check.
- Performance: prefetchSearch (shards + model during intake) => first search ~120 ms after "Search trials" locally; inline scripts merged into one deferred file under /_next/ (fixed a Next currentScript invariant error and render blocking); zod jitless (removed CSP eval violation). Lighthouse (mobile, simulated, local): landing 94, trial 90; accessibility/best-practices/SEO 100.
- npm audit: 0 vulnerabilities (sharp override, tinyglobby shim for fast-glob, vendored shadcn tailwind.css).
- Fixed: service worker reloaded the page on first install (wiped intake mid-way); now reloads only on updates (components/site/sw-register.tsx, committed by UI track).

## Next (after the override is lifted / user features)
- Full LLM fact extraction run (`npm run ingest:llm`, ~20+ h nationally at ~15-30 s/trial), then `npm run ingest` to merge.
- Deployment checkpoint (Cloudflare, D1 import, secrets, Turnstile production keys), CI + monthly refresh workflow, Dependabot (all deferred by the override).

## Previously planned for P1 (done)
- National ingestion run (background); then make the `_all` "not sure" shard a lite cross-group index (full-card `_all` is ~4 MB raw for 302 trials, too big nationally).
- Q&A endpoint, Access Intelligence, eval, e2e tests, remaining pages/translations.
- llama.cpp (Qwen3-14B) LLM fact layer: code path + small-sample test (deferred full run).

## How to run locally
- `npm install && npm run setup` (model + seed data), `npm run build`, then `npm run preview` (migrates/seeds local D1, runs wrangler dev with the static export + API).

## Known issues
- UI: set NEXT_PUBLIC_PARTNER_EMAIL at build time; without it the "Partner with us" mailto has no recipient.
- UI: About page has no founder story yet (needs the founder's real text; none was invented).
- Rule-fact precision 66% on the hand-labeled sample (eval/RESULTS.md); uncertain facts never penalize, but some criteria are misread.
- Eval labels are synthetic and rule-generated (not clinician-reviewed); retrieval variants differ by <0.01 nDCG@10.
- Lighthouse trial-page LCP waits on client-loaded trial data (~90 simulated); local devtools-throttled runs score 99-100.
- Transformers.js requests some model files twice (an aborted probe + the real fetch); bytes are cached after first load.
- README commands affected by Backend track changes: `npm run test:e2e` now snapshots ./out to .wrangler/e2e-out and resets local rate-limit counters; PW_PORT/PW_ASSETS/PW_OUTPUT_DIR env vars isolate parallel runs; `npm run eval`, `npm run ingest:llm -- --limit=N`; always use `npm run build` (bare `next build` output is not deployable).

## Final report
**What works (locally, zero API keys, mock AI):** national dataset of 5,779 real recruiting interventional cancer trials (51 states) from ClinicalTrials.gov with barriers, rule facts, int8 embeddings, and sharding; guided chat intake in 4 languages; private in-browser hybrid retrieval (BM25 + embeddings + RRF + rule pre-check) with hard filters (0% violations in eval); AI analysis and Trial Q&A endpoints with data minimization, quote/citation verification, safety refusals and crisis response, failover, caching, rate limiting, Turnstile; Access Intelligence; trial pages; PWA; strict CSP. Checks green: lint, typecheck, 124 unit tests (98.9% lines), eval, build (+ secret scan), 37 e2e/a11y tests, npm audit 0.
**Known limitations:** heuristic rule facts (66% precision sample); LLM fact layer only run on 4 trials; synthetic eval labels; real AI providers untested live (keys/terms not set; `eval:live` deferred); translations not reviewed by native speakers; no founder story text; not deployed (override).
**Recommended next steps:** run the full LLM extraction and re-evaluate fact precision with clinician-reviewed labels; enable one provider after reading its data terms and run `eval:live`; native-speaker review of es/pt/ht; then lift the override for the deployment checkpoint (D1 import, secrets, Turnstile keys, CI, refresh workflow).

## Accounts to create (user does these; none block the build, mock provider is used until ready)
1. GitHub (free): https://github.com/signup, then run `gh auth login` in the terminal.
2. Cloudflare (free): https://dash.cloudflare.com/sign-up, then run `npx wrangler login`. Needed at the deployment checkpoint only.
3. Groq (free key): https://console.groq.com/keys. Read data terms first, then set `dataTermsVerified: true` in `config/ai-providers.ts`.
4. Cerebras (free key): https://cloud.cerebras.ai. Same data-terms step.
5. OpenRouter (optional, free key): https://openrouter.ai/keys. Same data-terms step.
6. Domain (later): buy through Cloudflare Registrar (at-cost pricing, auto-connects to Pages). Setup steps go in the deployment checkpoint.
- Paste keys into `.dev.vars` yourself; never into chat.

## v2 WP1 (data, config, extraction)
- WP1 note for WP2/WP3/WP5: `config/questionnaire/ids.ts` (HISTOLOGY_IDS, DRUG_CLASS_IDS, SUBTYPE_IDS, GROUP_STATUS_IDS, QUESTION_IDS, AI_FIELD_IDS) and `config/questionnaire/types.ts` (C1 types) are in place. Catalog `MessageKey` is a template type (`questionnaire.*` | `findOut.*`); English defaults for every key will be in `config/questionnaire/en-defaults.ts` for WP3 to copy into en.ts. Facts use WP2's `param` (ecog_max/min_prior_lines/max_prior_lines/other_malignancy years: number; brain_mets/hiv/hepatitis_*/autoimmune "active_only"/"uncontrolled_only": string). Lite cards get `s` (sex) and `[key,value,param]` from ingest.
- WP1 catalog: `getCatalog("cancer", group)` for all 21 groups (Essentials/Helpful/Deep-dive, unknown/__skip on every non-essential, prefer_not on sensitive, deferred on report questions), per-group subtype/group-status/prior-drug/biomarker questions, find-out items, `en-defaults.ts`, zod `validateCatalog`, `FACT_POLICY`/`factPolicy()`; questions whose primary v2 family is < 85% ship `enabled: false` with `disabledReason` (gate in `config/questionnaire/index.ts`, numbers in `precision.generated.ts`).
- WP1 extraction: `lib/ingest/eligibility-facts.ts` (16 families, clause quotes, negation/cohort/alternative guards, lenient param merge); 12 new biomarker ids; 1,100 provisional labels in `eval/facts-labels-v2.json` (round 1 dev + round 2 held-out for re-ruled families); `npx tsx scripts/ingest/fact-precision.ts --measure`. Pass: performance 100%, organ_disease 100%, brain_mets 96%, transplant 94%, measurable 92%, hiv 88%, group_status 88%.
- WP1 precision pass 2 (rules v4, dev/held-out split): rules were tuned by reading only the "dev" half of the 5,726 trials (FNV hash of the NCT id, `partitionOf` in scripts/ingest/fact-precision.ts); round 3 = fresh held-out sample of 50 hand-labeled directional facts per family from the "held" half, excluding trials in earlier rounds (LCG seed 20261007 + 3*7919 + family char sum; stage has only 10 and biomarker_v2 36 such facts in the held pool, all labeled). Labels are provisional (reviewer, from the criterion text, not clinician-reviewed). Held-out before -> after: histology 66% -> 92% PASS, autoimmune 72% -> 94% PASS, hepatitis 68% -> 76%, other_malignancy 69% -> 78%, lines 72% -> 72%, prior_drug 56% -> 64%, recurrent 67% -> 60%, stage 60% -> 40% (n=10), biomarker_v2 54% -> 67% (n=36): these stay support-only (questions off). Main remaining error classes seen on held-out: cohort/arm context in a neighboring line, alternatives joined by or/OR, active-vs-any-history parameter, and "current/concurrent" read as any history. Questions now on: per-group subtype (histology) and autoimmune. Directional fact counts fell (histology trials 1,511 -> ~930, lines 469 -> 348, prior_drug 1,164 -> 861) because ambiguous wording is now `mentioned`. Rerun: ingest 5,726 trials, 2 skipped, lite index (_all) gzip 2,727,569 -> 2,718,097 B (-0.3%), total shard gzip -0.1%. Eval: nDCG@10 0.807, 0 hard-filter violations. Engine note: histology now penalizes (weight 1.2) and autoimmune penalizes; no engine change needed.
- WP1 data: seed + national re-ingested (national-20261007-9c9d06a9e8, 5,726 trials, 2 invalid); shards raw +14% (123->141 MB), gzip +4.9% (29.3->30.7 MB), lite `_all` 2.64->2.73 MB gzip (+3.5%), largest shard lung 2.25 MB gzip; `npm run build` green.

## v2 WP3 (questionnaire UI)
- Adaptive conversational flow in `components/questionnaire/` (intake-chat retired): essentials, engine-chosen questions with "Why we're asking", tier labels, "could narrow N to M", quick/thorough, debounced polite live counter, back/edit, equal Not sure/Skip/Prefer not/doctor-later chips, tab resume (sessionStorage) + Clear, summary, Find-out list on summary/results/print; English catalog strings copied from WP1 en-defaults into en.ts; privacy copy updated (English). Note for WP4: en.ts gained `questionnaire.*`, `findOut.*`, `results.findOut*` and privacy keys (manifest coverage test needs regenerating).
- WP3 verified on a fresh `npm run build`: questionnaire e2e (8 cancer-type flows, all-unknown counter invariant + Find-out print + fill-in, back/edit, cancer-type change drops stale answers, resume/clear/new tab, under-18, quick/thorough, keyboard, network minimization) + match/site/qa/perf all pass; axe 0 serious/critical on questionnaire views at 320/390/1280 light/dark; Lighthouse mobile /find/ performance 94, accessibility 100.

## v2 WP2 (engine, matching, privacy)
- WP2 engine: `lib/questionnaire` (pure IG selection, quick/thorough stop rules, live counter, impact preview, back/edit with dependent drops, find-out list, sessionStorage resume, candidate pool, v1 adapter, simulator); catalog-driven `evaluateAnswers` + `passesSex` + named v2 score weights in `lib/match`; minimized profile v2 (coarse fields only) + `prompts/analyze-v2.ts` + leak-check helpers; API.md section for WP3. Note: commit 2d3f2fe also swept in WP4's staged deletion of components/i18n/{es,pt,ht}.ts (their intended change).
- WP2 results: simulation over 5,726 national trials (408 patients, 12 groups): adaptive nDCG@10 vs oracle beats the fixed order at every k <= 7 (k=1 0.784 vs 0.717, k=3 0.845 vs 0.838, k=7 0.919 vs 0.916), reaches 96% of the full fixed flow (0.931, 12.1 questions) at 5 questions; quick mode median 5 questions, 0.895. Eval (seed, v1 labels): full pipeline nDCG@10 0.806 (>= 0.800), excluded share 0.271, hard-filter violations 0. Unit coverage lib/ + functions/lib/ 98.2% lines, 92.7% branches.

## v2 WP4 (i18n platform, locales, crisis lexicons)
- Platform: typed `en.ts` + `MessageKey`, flat JSON locales fetched on demand with per-key English fallback (`components/i18n/index.ts`, `useT`, `useMessages` kept), manifest (`npm run i18n:manifest`), dir/lang on switch, searchable picker, dismissible machine/partial note, suggest-only browser-language banner, self-hosted Noto packs (14 MB in `public/fonts/noto`, loaded only for chosen script), logical-CSS lint rule.
- Safety: crisis lexicons for all 18 locales in `lib/safety/lexicons` (all run on every input, accent/script folding), `CrisisLine` always visible in Q&A; AI language is an allowlist of tags (`AiLanguageSchema`), prompts get a server-side language name.
- Translations: es/pt/ht kept; zh-Hans, zh-Hant, ar, vi (and more as `npm run i18n:translate -- <tag>` finishes) machine-translated with Qwen3-14B, labelled "machine-translated, not reviewed". Re-run `npm run i18n:translate -- <tags>` then `npm run i18n:manifest` after English string changes.

## v2 questionnaire UX pass (guided intake polish)
- Changes (components/questionnaire, en.ts questionnaire.ui.*): intro panel (2-4 min, skip anything, stays on device, free) with caregiver switch (wording only, a yes/no flag in this tab, no identity); three-segment progress bar with honest ranges ("About N to M more", "Just a couple more") shown from the start with a waiting counter; "Question N of 4" on essentials; "What is this? Why we're asking" with where-to-find text (pathology report etc.); number keys 1-9 choose an option; biomarker grid is now a labelled list (name above choices, answered count, search for long lists, one-click "I don't know any of these"); older transcript collapses on every screen size so the active question stays near the top; summary groups answers (About you / About your cancer and health / To find out later with "On your list" tags); search button shows a busy state; Find-out list no longer reads "Ask: Ask:".
- Keys changed (8, translations show English until retranslated): questionnaire.ui.counterNoConflict, nonResponseHint, reassure.*, reassureNoCount, afterEssentials, modeQuickHelp, modeThoroughHelp, summaryIntro.
- Keys added (49): questionnaire.ui.{counterWaiting, remainingFew, remainingRange, stepDone, essentialStep, shortcutHint, whyAskAbout, aboutTitle, introTitle, introLead, introTime, introSkip, introPrivate, introFree, caregiverToggle, caregiverHelp, biomarkerCount, biomarkerSearch, biomarkerNone, onYourList, searching, summaryGroup.{you,answered,later,laterNote}, about.{spread,disease_status,daily_activity,biomarkers,deep_biomarkers,lines,subtype,brain_mets,measurable,prior_drugs}}; questionnaire.<id>.labelFor for cancer_type, age, zip, travel, spread, disease_status, treatments, daily_activity, biomarkers, brain_mets, lines, sex, measurable, other_cancer. `npm run i18n:manifest` / translate pass needed (tests/unit/i18n-locales manifest coverage check fails until the manifest is regenerated).

## i18n via Groq (partial: free-tier daily token cap)
- `scripts/i18n/translate.ts` now defaults to Groq (gpt-oss-120b) when GROQ_API_KEY is in .dev.vars; `--provider=local` keeps llama-server; `--wait` sleeps through the rolling daily quota. `npm run i18n:review-packet` writes eval/review/translations-<tag>.md.
- Done: fr (984 keys), hi (979). pl half done (520/991). bn, gu, ur, fa still empty; stale/new UX keys not yet refreshed in ar, zh-Hans, zh-Hant, vi, ko, ru, tl, and es/pt/ht gaps not yet filled. Cause: Groq free tier TPD = 200000 tokens (about 2400 strings per rolling 24 h), exhausted. Finish with: `npm run i18n:translate -- pl bn gu ur fa ar zh-Hans vi es pt ht ko ru tl zh-Hant -- --wait` (or after the quota resets / on Dev tier), then `npm run i18n:manifest` and `npm run i18n:review-packet`.
- WP1 verified-LLM fact layer (2026-10-08): `npm run ingest:llm -- --families a,b --limit N` (lib/ingest/llm-families.ts, prompts/ingest-facts-v2.ts; public CT.gov text only) + hard verification (verbatim single-criterion quote, cited ref, cohort/alternatives/unclear => mentioned, param written in quote, washout/single-drug/exception guards, rule disagreement => needsReview), thresholds tuned on dev labels only (eval/llm-dev-labels.json, dev 95% on 154 committed), then measured ONCE on gold-v1+v2 (240 trials, AI-reader labels, not clinicians; eval/llm-gold-results.json): other_malignancy 97% (28/29) ON; lines 81% (21), recurrent 83% (42), hepatitis 80% (51), prior_drug 66% (41), stage 3 and biomarker_v2 2 facts (too few) stay off; histology rules 67% on 39 gold facts, so the subtype question is now OFF by the gold gate (verified layer 73% on 26, not adopted). Throughput 5.9 s/call, 20.8 s/trial wall (-np 4); overnight command (~4.7 h): `nohup npm run ingest:llm -- --families other_malignancy > data/cache/llm-run.log 2>&1 && npm run ingest`; all seven LLM families ~24 h (`npm run ingest:llm -- --families lines,prior_drug,stage,recurrent,other_malignancy,hepatitis,biomarker_v2`). Ingest rerun: 486 trials with LLM results, lite `_all` gzip -0.3%, total gzip +0.02%; eval nDCG@10 0.807, 0 hard-filter violations.

- step1: baseline in eval/baseline; merged v5-criteria/ranking/eval-verify/vignette-gold (design already in); unit 1074/1075 (1 stale test, BUGS.md); vignette eval blocked on missing gold
