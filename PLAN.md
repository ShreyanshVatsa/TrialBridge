# TrialBridge v1: Build Specification

You are a senior full-stack engineer building v1 of TrialBridge to production quality.

## The product
TrialBridge is a venture-scale health-tech startup: an AI clinical trial matching platform that helps patients find cancer clinical trials in minutes. Patients use it free. The long-term business serves research sites and trial sponsors, who struggle to enroll patients, especially from underserved communities. It combines:
1. AI Trial Matching: a guided chat intake, hybrid retrieval over ClinicalTrials.gov, and AI criterion-by-criterion analysis that explains each possible match in plain language, quoting real eligibility text.
2. Trial Q&A: users ask questions about a specific trial and get answers grounded only in that trial's official text.
3. Access Intelligence: national data showing which trials have access barriers (English required, age limits, disability exclusions), by state, cancer type, and site. For patients this is transparency; for future partners it is the analytics product.
4. Multilingual access: English, Spanish, Portuguese, and Haitian Creole, opening a market most matching tools ignore.

v1 scope: ALL recruiting interventional cancer trials with at least one U.S. site.

Brand voice: a sharp, credible early-stage startup (the polish and clarity of top Y Combinator-style companies), confident and modern, never salesy. Trust is the core of the brand: free for patients, private by design, and results that no one can pay to influence.

Branding rules:
- Never claim or imply affiliation with Y Combinator or any investor, accelerator, hospital, or partner.
- No fake testimonials, logos, user counts, or press mentions. Only real, data-backed numbers (e.g., trials indexed, states covered, data freshness).
- Do not describe TrialBridge as a nonprofit.

## How we work together (mandatory)

### Start: ask everything up front
Before writing any code, use your question tool (AskUserQuestion) to ask me everything you need in as few rounds as possible. At minimum:
- Confirm the build plan and architecture summary you propose.
- Check my computer's hardware yourself (OS, chip, memory, free disk space). Tell me whether local AI extraction with Ollama is practical, and ask whether I want it.
- Ask which free AI provider keys I have ready (Groq, Cerebras, OpenRouter) and whether I've verified each one's data terms.
- Ask whether I have Cloudflare and GitHub accounts ready.
- Ask which hosting plan I've bought (if any). Default to Cloudflare. If I've bought Cloudflare's paid Workers plan, use its higher limits and note them in DECISIONS.md. If I've bought hosting elsewhere, adapt the backend, caching, rate limiting, and headers to that platform, keeping all security and privacy requirements, and document the changes.
- Ask whether I own a domain name, and include setup steps for it in the deployment checkpoint.
- Any design or product choices you consider important.

Credentials rules (never break these):
- NEVER ask me for passwords. For logins, run the official CLI login commands (e.g., `wrangler login`, `gh auth login`) so I authenticate in my own browser.
- NEVER ask me to paste API keys into the chat. Create `.dev.vars` (and `.env.local` if needed) with clearly named empty entries and comments, confirm they are in `.gitignore`, and tell me to paste keys into that file myself. Then verify keys are present by checking only that the variables are set, never by printing them.
- Production secrets go into Cloudflare via `wrangler secret put`, which I run or approve myself.
- If keys aren't ready, proceed with the mock AI provider. Never block on keys.

### Checkpoints
At each checkpoint (defined in the Execution Rules at the end of this file), stop, give me a short summary (what's built, test results, key numbers, decisions made, anything I should look at), and ask any questions with your question tool. After I answer, continue without further interruptions until the next checkpoint.

### Between checkpoints
- Build continuously. Don't ask for confirmation on routine decisions; record each decision in DECISIONS.md with a one-line reason.
- Maintain PROGRESS.md: done, in progress, next, known issues, current checkpoint. If a session restarts, read PLAN.md, PROGRESS.md, and DECISIONS.md, then continue.
- Commit to git after each working milestone with descriptive messages.
- No placeholders or TODO stubs for required features, no fake trial data. Items marked "later" or "deferred" are the only exceptions.
- When unsure of a current free-tier limit or API detail, check official documentation rather than guessing, and record what you found.
- v1 is NOT done until every Definition of Done item passes. Run all checks, fix every failure, rerun until green.

## Non-negotiable constraints
- $0 to run: no paid AI models or paid services. Only free tiers.
- The app must build, run, and pass all tests with NO API keys present, using a mock AI provider.
- Only real ClinicalTrials.gov data. Never fabricate trials, statistics, or medical facts.
- Never present output as medical advice. Never say "eligible" or "qualify." Use "possible match to discuss with your care team."
- Data minimization: only a minimized, non-identifying profile is ever sent to an AI provider (see Part 4).

## Architecture
- Frontend: Next.js (App Router, `output: 'export'`) + TypeScript (strict) + Tailwind CSS + shadcn/ui + Lucide icons. Installable Progressive Web App (manifest, icons, service worker for the app shell only; never cache AI responses or user answers).
- Hosting: Cloudflare (see Hosting in the Execution Rules). Backend functions for AI calls only.
- Storage for caching, rate limiting, and the backend's trial-criteria copy: Cloudflare free primitives (D1, KV, and/or R2). Check current free-tier limits and choose accordingly.
- Bot protection: Cloudflare Turnstile on AI endpoints; documented test keys in development and tests.
- Retrieval in the browser: MiniSearch (BM25-style) + Transformers.js embeddings in a Web Worker, over sharded data (see Part 1).
- Validation: zod everywhere. Charts: Recharts. U.S. map: react-simple-maps or similar. Translations: compatible with static export.
- Tests: Vitest, Playwright, @axe-core/playwright. Cloudflare local tooling (wrangler/miniflare) for functions.
- Optional at ingestion only: Ollama with a small open-weight instruct model (default `llama3.1:8b`; choose a smaller model if my hardware requires it).

## Part 1: National data ingestion (`npm run ingest`)
Fetching:
- ClinicalTrials.gov API v2 (`https://clinicaltrials.gov/api/v2/studies`). Read its docs for correct parameters. Query all recruiting interventional cancer studies with at least one U.S. location. Paginate fully (page size up to 1000).
- Throttle to stay under ~50 requests/minute, retry 429/5xx with exponential backoff and jitter, request timeouts, fail clearly after max retries. Descriptive User-Agent. Resumable: save progress so an interrupted run continues where it stopped.

Processing:
- Validate every record with zod; skip and log invalid records without crashing.
- Store per trial: NCT ID, title, brief summary, phase, conditions, MeSH condition terms and ancestors (derivedSection.conditionBrowseModule), sponsor, all U.S. sites (facility, city, state, zip, coordinates if present), min/max age, eligibility text split into numbered inclusion and exclusion criteria, contact info, last-updated date.
- Map each trial to one or more cancer-type groups using MeSH (e.g., breast, lung, colorectal, prostate, leukemia, lymphoma, melanoma, pancreatic, ovarian, brain, and others), plus a "solid tumors / multiple cancers" group for basket trials.
- Barrier detection (rules in `config/barriers.ts`): English required, upper age limit below 75, disability exclusion without stated medical reason. Store the exact triggering sentence for every flag.
- Eligibility facts, two layers:
  1. Rule layer (always runs on every trial, `config/criteria.ts`): prior chemotherapy, radiation, surgery, immunotherapy, targeted therapy; metastatic/advanced disease (required/excluded); newly diagnosed vs. previously treated; pregnancy exclusion; concurrent-trial exclusion; common biomarker mentions (e.g., HER2, EGFR, BRCA, PD-L1) recorded as required/excluded/mentioned.
  2. Local LLM layer (only if Ollama is available and I approved it): extract the same facts as strict JSON validated by zod, each with value, quoted source sentence, and confidence. Discard any fact whose quote doesn't appear verbatim in the trial text. Run incrementally and resumably, prioritizing the largest cancer groups first; cache results by NCT ID + last-updated date so unchanged trials are never reprocessed. If layers disagree, store both and mark "needs review." Report progress and estimated time remaining.
- Embeddings: title + conditions + brief summary + inclusion criteria, normalized. Store quantized (int8 or float16, whichever keeps accuracy in evaluation) to reduce download size.

Sharding (so phones only download what they need):
- Split search data by cancer-type group: per-shard trial cards, MiniSearch index, and embeddings. Trials in multiple groups appear in each relevant shard.
- Site data in a separate per-shard file. U.S. ZIP-to-coordinates table split by 3-digit ZIP prefix and loaded on demand.
- Target each shard under a few MB compressed; split large groups further if needed. Report shard sizes at the relevant checkpoint.

Output and safety:
- Write to a temp directory, validate, then atomically replace `public/data/`. Produce a server-side copy of trial criteria for the backend (D1, KV, or R2) so the backend never trusts trial text sent from the browser.
- Abort without replacing data if trial count drops more than 40% or more than 5% of records fail validation. Keep the last good dataset.
- Commit a small seed dataset in `data/seed/` (a few hundred trials across several cancer types) so the app builds and tests run offline. Full data is produced by ingestion and deployed, not necessarily committed (document the choice).
- `public/data/meta.json`: data date, trial counts per group, model names, pipeline and prompt versions.

## Part 2: Guided chat intake (client-side, no AI)
- Chat-style interface: friendly assistant messages, quick-reply buttons, validated inputs. Feels like a navigator, but deterministic, instant, private, and uses no AI quota.
- Questions:
  1. Cancer type (searchable, mapped to cancer groups/MeSH; "Other / not sure")
  2. ZIP code (validated) and maximum travel distance (including "willing to travel anywhere")
  3. Age (18–110; under 18 shows a respectful message pointing to pediatric trial resources and ClinicalTrials.gov)
  4. Preferred language
  5. Has the cancer spread? (yes / no / not sure)
  6. Treatments received (chemotherapy, radiation, surgery, immunotherapy, targeted therapy, none, not sure; multi-select)
  7. Known biomarkers, shown only for cancer types where they matter (e.g., HER2, EGFR, BRCA; "don't know" always available)
  8. Currently pregnant? (yes / no / not sure / prefer not to say)
  9. Currently in another clinical trial? (yes / no)
- Users can edit any answer. A summary card confirms answers before searching.
- Answers live only in browser memory. Nothing is stored server-side.

## Part 3: Retrieval (entirely in the browser)
1. Load only the shard(s) for the selected cancer type ("not sure" loads a lightweight cross-group index first).
2. Hard filters: cancer group/MeSH match, age range, at least one site within travel distance (haversine to nearest site).
3. Hybrid ranking: MiniSearch BM25 plus cosine similarity of an embedded standardized profile (Web Worker, brute force over the shard; no vector database), merged with Reciprocal Rank Fusion (k = 60).
4. Rule-based eligibility pre-check against stored facts and biomarkers: likely conflicts lower the score; "not sure" and "don't know" never penalize.
5. Keep the top 15 for AI analysis; show the top 10, with "show more."

Code I must be able to explain to judges:
- `lib/match/cosine.ts`: hand-written cosineSimilarity with line-by-line comments.
- `lib/match/rrf.ts`: hand-written Reciprocal Rank Fusion with comments.
- `lib/match/score.ts`: scoring formula with named, commented weights.
- All matching modules are pure functions with unit tests.

## Part 4: AI analysis and Trial Q&A (backend, free models only)

Provider layer (`functions/lib/ai/`):
- One OpenAI-compatible client with a provider registry in `config/ai-providers.ts`: name, base URL, model, env var for key, and a `dataTermsVerified` boolean I set manually.
- Default entries: Groq (`openai/gpt-oss-120b`), Cerebras (`gpt-oss-120b`), OpenRouter (`openrouter/free`). Models configurable; free model lists change often.
- A provider is used only if its key is present AND `dataTermsVerified` is true. Ship with `false` and a comment telling me to read each provider's data terms first.
- Do NOT include Google Gemini's free tier (its free tier may use inputs for product improvement with human review).
- Automatic failover in priority order on 429, 5xx, timeout, or invalid output. Per-provider circuit breaker.
- Mock provider: deterministic, realistic structured responses built from real trial text. Used when no providers are enabled, and always in tests.

Data minimization (enforced by a zod schema at the API boundary):
- Only these fields may be sent to an AI provider: cancer type, age bracket (decade), spread status, treatments received, biomarker answers, pregnancy answer, concurrent-trial answer, response language.
- NEVER send ZIP code, exact age, location, names, or free text from the intake.
- The backend loads trial criteria from its own copy by NCT ID and never accepts trial text from the browser.

Analysis endpoint (`POST /api/analyze`):
- Input: minimized profile + up to 15 NCT IDs + Turnstile token.
- One batched AI call (split into at most 2 if needed for context limits).
- Per trial, strict JSON validated with zod: fit level (strong / possible / unlikely / unclear); for each relevant criterion {criterion number, quoted text, assessment (likely met / likely not met / needs doctor), plain-language explanation}; questions to ask the doctor; one-sentence summary.
- Verify every quote appears verbatim in that trial's text; drop failures. If over half fail, retry once with a repair prompt, then fall back.
- Output in the user's language; quoted criteria stay in English. Mark Haitian Creole AI output "experimental."
- Final ranking combines retrieval score, rule pre-check, and AI fit level (weights in `lib/match/score.ts`).

Trial Q&A endpoint (`POST /api/ask`):
- Input: NCT ID + question (max 300 characters) + language + Turnstile token.
- Scrub likely personal info (emails, phones, ZIPs, dates of birth, long digit strings) before sending; UI notice: "Don't include personal details."
- Answer ONLY from that trial's official text, citing criterion numbers or sections. If not in the text, say so and suggest asking the trial contact.
- Politely refuse off-topic requests, diagnosis, treatment recommendations, and eligibility determinations, redirecting to the care team.
- If the question expresses serious distress or crisis, respond supportively and show crisis resources (in the U.S., call or text 988) and encourage contacting their care team.
- Up to 10 questions per trial per session.

Prompt safety: system prompts in versioned files under `prompts/`; trial text wrapped in delimiters and declared to be data, never instructions; output validation as the final guard.

Efficiency and quota protection:
- Cache analysis by hash of (minimized profile + sorted NCT IDs + data version + prompt version), 30-day expiry; cache Q&A by hash of (NCT ID + normalized question + language + versions). Store only hash keys and outputs.
- Rate limits per salted, daily-rotating IP hash (never store raw IPs): analysis 10/hour, Q&A 30/hour.
- Global daily budget per provider set below its free limit; when exhausted, degrade gracefully.
- Turnstile verification on every AI request.

Graceful degradation: if AI is unavailable, rate-limited, or out of budget, show retrieval + rule-based results with a friendly notice ("AI explanations are busy right now. Here are your matches based on trial criteria."). Everything else keeps working.

## Part 5: Results and trial pages
- Result cards: plain title, nearest site and distance, phase, fit level badge, barrier badges, "Why this might fit," "What might rule you out" (quoted criteria), "Questions to ask your doctor," contact info, official link, "Ask about this trial" button.
- Language barrier: if the user prefers a non-English language and the trial requires English, keep the trial with a clear warning badge.
- Print/save view: "Bring this to your appointment."
- Persistent notice: "TrialBridge doesn't give medical advice. Only the trial team and your doctor can decide if a trial is right for you."
- Trial detail page: a single dynamic page that loads any trial by ID from the shards: what's being tested, who might qualify, numbered criteria, barriers with quoted sentences, sites (nearest first when location is known in the session), contact, official link, Q&A. Official text only.

## Part 6: Access Intelligence and company pages
- Access Intelligence (national, public): stat cards (trials analyzed, % with at least one barrier, % requiring English), U.S. map by state barrier rate, barrier-type chart, cancer-type and state filters, ranked table of sites with 5+ trials (counts next to percentages), data date.
- Landing page (startup-quality): bold one-line value proposition (e.g., "Find cancer clinical trials that fit you, in minutes"), prominent "Find a trial" button, a short product demo visual (an animated preview of the chat and a result card, built in code, no stock imagery), one striking real national statistic, how it works in 3 steps, privacy and "free for patients" promises, a "For research sites" teaser, footer.
- For Research Sites page: the enrollment problem, what TrialBridge offers sites and sponsors (better-informed patient inquiries, access-barrier insights, multilingual reach), and a "Partner with us" contact button (mailto link for v1; no form that stores data).
- How it works / Methodology: data source, pipeline, barrier rules, hybrid retrieval explained simply, how AI is used and checked, evaluation results, limitations.
- Privacy page: what stays in the browser, exactly which minimized fields go to AI providers, which providers, no accounts, no tracking.
- About / Company: founder story, mission, the independence promise (no one can pay to change results), AI disclosure link.
- Privacy policy and terms drafts marked "Draft, needs legal review." Custom 404 and error pages.

## Part 7: Languages
- Full UI in English, Spanish, Portuguese, and Haitian Creole with a language switcher. Write translation files yourself.
- Official trial text stays in English; AI explanations and answers follow the chosen language.
- Small visible note: "Translations not yet reviewed by native speakers."

## Part 8: Evaluation (`npm run eval`)
- 30 realistic synthetic patient profiles across at least 8 cancer types and several states, with hand-labeled relevant and excluded trials (`eval/labels.json`, marked "synthetic, provisional").
- Retrieval: hard-filter violation rate (must be 0%), recall@10 and nDCG@10 for keyword-only, embeddings-only, and hybrid. Compare `Xenova/all-MiniLM-L6-v2` and `Xenova/bge-small-en-v1.5`, plus quantization levels; choose and record in DECISIONS.md.
- Eligibility facts: precision on a 50-item hand-labeled sample.
- AI analysis (mock by default; `npm run eval:live` uses enabled providers): JSON validity, quote-verification pass rate, agreement with labels.
- Plain-language results in `eval/RESULTS.md`.

## Part 9: Security (mandatory)
- `public/_headers`: strict Content-Security-Policy (self plus Turnstile's required origins; `wasm-unsafe-eval` only if Transformers.js needs it, documented), `frame-ancestors 'none'`, HSTS, nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy disabling unused features. Long cache for hashed assets, shards, and models; short for meta.json.
- Self-host fonts and embedding model files. No third-party scripts, analytics, or trackers.
- Never use `dangerouslySetInnerHTML`. Render external and AI text as plain text or safe React elements.
- Validate all inputs on client AND server with zod; request size limits; reject unexpected fields.
- Secrets only in `.dev.vars` (local, gitignored) and Cloudflare secrets (production). Never in the repo, client bundle, logs, or chat output. Add a test that scans build output for key patterns.
- AI endpoints accept only same-origin requests.
- No logging of profiles, questions, or answers. Logs contain only request IDs, provider name, status, latency.
- Pinned dependencies, lockfile, minimal dependencies, `npm audit --audit-level=high` passes, Dependabot enabled. SECURITY.md with a reporting contact.

## Part 10: Error handling and quality (mandatory)
- Error boundaries on every route with friendly recovery. Never show stack traces.
- Every async operation has loading, empty, error, and timeout states in all four languages, including shard downloads with progress.
- Typed, consistent backend errors with safe messages; frontend maps each to a friendly message.
- Embedding model fails or is too slow: fall back to keyword-only ranking with a notice. Shard download fails: retry, then show a clear message.
- Handle offline and slow connections gracefully.
- TypeScript strict; no `any` without a comment.
- Tests:
  - Unit: cosine, RRF, scoring, distance, filters, sharding/loading, eligibility comparison, biomarker logic, barrier detection, criteria parsing, input validation, data minimization schema, PII scrubber, quote verification, failover, circuit breaker, caching, rate limiting, budget guard. 90%+ coverage for `lib/` and `functions/lib/`.
  - End-to-end: chat intake to AI results (mock) for several cancer types, AI-unavailable fallback, Q&A including off-topic refusal and crisis response, language switching, trial page, tracker filters and map, print view, mobile viewport, PWA installability.
  - Network test: ZIP code, exact age, and intake answers never appear in any request to the backend.
  - Accessibility: no serious or critical axe violations.
- Performance: aim for 90+ Lighthouse scores on landing and trial pages; shard loads fast on mobile. Code-split matching engine, model, and chat.

## Part 11: CI/CD and automation
- `.github/workflows/ci.yml` on every push and pull request: install, lint, typecheck, unit tests, eval (mock, seed data), build, end-to-end, npm audit, build-output secret scan. Fail on any error.
- `.github/workflows/refresh-data.yml`: monthly plus manual trigger. National ingestion (rule layer; reuses cached LLM facts for unchanged trials), all checks, publishes data only if everything passes, bumps data version so caches refresh.
- README instructions for Cloudflare, secrets, D1/KV/R2 bindings, Turnstile, and custom domain.

## Design (premium, not a template)
Visual direction: a polished, modern health-tech startup, in the class of the best-designed seed-stage companies: crisp, confident, and trustworthy. Clean product-led landing page, sharp typography, purposeful motion. Not a hospital portal, not a generic AI template, not a charity site.
- Typography: refined serif for headlines (Fraunces or Source Serif) with Inter for UI and body, self-hosted. Generous line height; large, confident landing headlines.
- Color: warm off-white background, deep ink text, one calm primary (deep teal or navy), soft coral/amber accent used sparingly for barrier flags. Full dark mode. No neon, no purple gradients.
- Chat: clean message bubbles, clear assistant/user distinction, smooth quick-reply chips, typing indicator during AI calls, readable on small phones.
- Layout: generous whitespace, clear grid, max reading width ~70 characters, cards with subtle borders rather than heavy shadows.
- Charts and map: clean, labeled, colorblind-safe, counts with percentages.
- Motion: subtle only; respect reduced-motion. Mobile-first; flawless on phones.
- Accessibility: WCAG AA contrast, full keyboard navigation, screen-reader labels (live regions for chat), 16px minimum body text, plain language.
- A simple, memorable SVG logo mark, favicon, and PWA icons.

## Built for later (interfaces only)
- Additional diseases beyond cancer (condition-group config, question sets per group).
- Partner dashboard for research sites and sponsors (aggregate public-data insights, barrier analysis of their own trials, enrollment-readiness suggestions). Partners can never influence patient-facing results.
- Paid provider support behind the same provider interface.

## Documentation deliverables
- README.md: setup, logging in with CLIs, where to put keys, verifying provider data terms, Ollama (optional), ingestion, sharding, matching pipeline, AI layer, evaluation, testing, security, deployment.
- DECISIONS.md, PROGRESS.md (with final report), SECURITY.md, eval/RESULTS.md.
- AI_DISCLOSURE.md template listing which parts were AI-generated, for me to complete honestly.

## Definition of Done
- [ ] `npm run ingest` completes nationally (rule layer) and is resumable; the Ollama path works on a small sample
- [ ] `npm run lint` and `npm run typecheck` pass with zero errors
- [ ] `npm run test` passes with 90%+ coverage on `lib/` and `functions/lib/`
- [ ] `npm run eval` writes eval/RESULTS.md with 0% hard-filter violations
- [ ] `npm run build` produces a working static export plus functions
- [ ] `npm run test:e2e` passes, including AI fallback, Q&A safety, mobile, and the data-minimization network test
- [ ] No serious or critical accessibility violations
- [ ] `npm audit --audit-level=high` passes; build-output secret scan passes
- [ ] Full app works locally with zero API keys (mock provider)
- [ ] All documentation exists and is complete
- [ ] PROGRESS.md contains a final report: what works, known limitations, recommended next steps

---

# Execution Rules: Token Efficiency and Priority (these override conflicting parts of PLAN.md)

I have a limited usage window. Your goal is to deliver a complete, working, deployable product as efficiently as possible. Build in strict priority order so that if usage runs out at any point, what exists is a working app.

## CURRENT PRIORITY OVERRIDE (set 2026-10-06; overrides everything below until the user removes it)
The user is preparing a competition submission and will add new features. Until the user says the override is lifted:
- Focus: the app working, functional with all features, fast, efficient, and good (UX, matching quality, speed, reliability). P0 and P1 are complete.
- DEFER hosting and deployment: no Cloudflare deploy, no domain, no wrangler login/secrets, no deployment checkpoint, no CI/CD workflows, no monthly refresh workflow, no Dependabot. Local `npm run preview` is the target environment.
- Keep as-is (do not rework): the Workers/D1 backend design and security/privacy rules. Only fix what breaks the working app.
- P2 items that DO still apply: speed/performance work, bug fixes, test coverage toward 90%, accessibility, PWA/dark-mode/motion polish, README for running locally.
- Do not start P2 or new work without the user's go-ahead; the user will bring new features.

## Priority tiers (build P0 fully end-to-end before starting P1, P1 before P2)

P0: Core product (must work end-to-end first)
- Project setup, all dependencies installed in one command
- Ingestion against the SEED dataset (~300 trials across 8+ cancer types) with barrier detection, rule-layer eligibility facts, embeddings, and sharding
- Guided chat intake
- Retrieval: filters, BM25, cosine (hand-written), RRF (hand-written), scoring
- Results cards with barrier badges and quoted criteria
- AI analysis endpoint with mock provider + real provider failover, data minimization, quote verification, graceful fallback
- Single dynamic trial detail page (loads trial by ID from shards; do NOT statically generate a page per trial)
- Landing page, privacy page, disclaimer, basic security headers, Turnstile, rate limiting, caching
- Unit tests for lib/match and the data-minimization schema
- Successful `npm run build`

P1: Full product
- Full national ingestion (run ONCE, near the end of P1, in the background while you work on other things)
- Trial Q&A endpoint with safety behaviors
- Access Intelligence page with map and charts
- For Research Sites, Methodology, About pages, policy drafts
- Translations (write English strings first; generate all other languages in one pass at the end of P1)
- Evaluation script and eval/RESULTS.md
- End-to-end tests for the main flow, fallback, and data-minimization network check

P2: Polish and hardening
- Remaining unit tests toward coverage targets
- Full end-to-end and accessibility suites
- PWA, dark mode refinement, motion polish, landing demo animation
- CI workflows and monthly data refresh workflow
- Dependabot, SECURITY.md, full README

Explicitly deferred to a later session (do not run now):
- Local Ollama LLM eligibility extraction over the national dataset. Build the code path and test it on a small sample only. Document how I run the full extraction later.
- `npm run eval:live`

## Checkpoints
Use the question tool only at: (1) start-up questions, (2) end of P0, (3) end of P1, (4) before deployment. Keep each checkpoint summary to 10 lines or fewer.

## Efficiency rules
- Be terse. No narration, no restating the plan, no explaining code unless asked. Save explanations for checkpoint summaries.
- Read files with targeted reads (specific line ranges, grep/search) rather than whole files. Don't reread files you just wrote.
- Never print data files, large JSON, lockfiles, or long logs. Use `wc`, `head`, or a short script to summarize them.
- Make small, targeted edits instead of rewriting whole files.
- Write each new file completely in one pass, correctly the first time.
- Run only the relevant tests while developing; run the full suite at the end of each tier. Use quiet reporters (e.g., Vitest dot reporter, Playwright line reporter) and pipe output through `tail` or a failure filter.
- Generate large fixtures, labels, and translation files with scripts or in single passes, not piece by piece.
- Use well-established libraries rather than writing custom code, except for the files I must explain (cosine.ts, rrf.ts, score.ts).
- Avoid spawning subagents unless a task is genuinely parallel and large; they use extra usage.
- Keep PROGRESS.md and DECISIONS.md entries to one line each.
- If a fix fails twice, stop retrying the same approach; choose a simpler one and note it in DECISIONS.md.
- If you notice usage running low, finish the current task, make sure the build passes, commit, and write precise next steps in PROGRESS.md so the next session resumes instantly.

## Hosting
Use Cloudflare's free tier unless I tell you at start-up that I've bought a different plan. Follow Cloudflare's current official recommendation for deploying a static Next.js export with backend functions (Pages with Functions, or Workers with static assets); check the docs and record the choice in DECISIONS.md.
