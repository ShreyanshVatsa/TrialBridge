# TrialBridge

TrialBridge helps people find recruiting **cancer clinical trials** in the United States. Patients use it free. It is an early-stage startup project, not a medical service, and it gives no medical advice.

> **Status:** `PROGRESS.md` has the latest status and numbers. The code is changing, so this README describes stable design rather than exact counts. Design rationale lives in `DECISIONS.md`, and the UI/library contract in `API.md`.

TrialBridge is not affiliated with any investor, accelerator, hospital, or trial sponsor. It uses public data from ClinicalTrials.gov.

## The four features

| Feature | What it does |
|---|---|
| AI Trial Matching | Guided chat intake, hybrid retrieval (keyword + embeddings), then AI criterion-by-criterion analysis that quotes the real eligibility text. |
| Trial Q&A | Ask a question about one trial. Answers come only from that trial's official text, with verified citations, or the app says it is not in the text. |
| Access Intelligence | National view of access barriers (English required, upper age limit, disability exclusion) by state, cancer type, and site. |
| Multilingual access | English, Spanish, Portuguese, and Haitian Creole. |

Scope: recruiting, interventional cancer trials with at least one U.S. site.

## Privacy and safety principles

- **No medical advice.** The app never says a person is "eligible" or "qualifies". It says "possible match to discuss with your care team".
- **Hard filters are deterministic.** Cancer type, age, and travel distance are applied in code, never by an AI model.
- **Data minimization.** Matching runs in the browser. ZIP code, exact age, travel distance, and free text stay on the device.
- **What can reach AI providers** (only via `lib/privacy/minimize.ts`, strict zod schema): cancer type group, age *bracket* (decade), spread, prior treatment categories, biomarkers, pregnancy flag, concurrent-trial flag, and language. Never ZIP, exact age, name, or typed intake text.
- **Trial Q&A** scrubs personal info client-side before sending and warns users not to include personal details.
- **Safety rules do not depend on the model.** Crisis, diagnosis, treatment-advice, and eligibility questions are handled by deterministic rules (crisis shows 988 / 911).
- **AI output is verified.** Quotes must appear verbatim in the trial text or they are rejected.
- **Graceful degradation.** If AI is unavailable, results still show with retrieval and rule-based checks.
- No fake testimonials, logos, or user counts. Numbers shown come from real data.

## Architecture

```
                    BROWSER (static export, Next.js)
  +-----------------------------------------------------------+
  | Intake chat -> minimize profile                            |
  | Shards (/data/*) -> hard filters -> BM25 + embeddings      |
  |   (Web Worker, MiniLM) -> RRF -> rule pre-check -> ranked  |
  +----------------------+------------------------------------+
                         | minimized profile / question only
                         v
          Worker API (functions/): /api/analyze, /api/ask
  +-----------------------------------------------------------+
  | same-origin + size limit + Turnstile + rate limit (D1)     |
  | cache (D1) -> provider failover -> quote verification      |
  +----------------------+------------------------------------+
                         v
        OpenAI-compatible providers (or built-in mock)

  OFFLINE: ClinicalTrials.gov -> ingest -> facts, barriers,
           embeddings, shards, access.json, D1 SQL copy
```

Stack: Next.js 16 (static export), React 19, TypeScript, Tailwind 4, shadcn (base-ui), MiniSearch, Transformers.js (in-browser embeddings), Recharts, zod, Vitest, Playwright. Backend target: Cloudflare Workers with static assets and D1 (`wrangler.jsonc`).

## Project structure

| Path | Contents |
|---|---|
| `app/` | Next.js routes: landing, `find`, `trial`, `access`, `for-sites`, `methodology`, `about`, `privacy`, `privacy-policy`, `terms`, `offline` |
| `components/` | UI: `chat`, `find`, `results`, `trial`, `access`, `landing`, `site`, `session`, `i18n` (en/es/pt/ht), `ui` |
| `lib/match/` | Filters, BM25 config, embedder + worker, cosine, RRF, pre-check, scoring, search |
| `lib/ingest/` | CT.gov parsing, cancer groups (MeSH), barriers, rule facts, LLM facts, safety gates |
| `lib/privacy/` | `minimize.ts` (what leaves the browser), `scrub.ts` (personal-info scrub) |
| `lib/access/`, `lib/data/`, `lib/api/`, `lib/geo/`, `lib/types/` | Access aggregates, data loader, API clients, distance, shared zod types |
| `functions/` | Worker entry (`index.ts`), `lib/` (analyze, ask, ai providers, cache, ratelimit, budget, turnstile, quotes, safety), `migrations/` (D1) |
| `config/` | `ai-providers.ts`, `cancer-groups.ts`, `barriers.ts`, `biomarkers.ts`, `criteria.ts`, `embedding.ts` |
| `prompts/` | Versioned prompts: `analyze-v1.ts`, `ask-v1.ts` |
| `scripts/` | `ingest/` (national + seed + LLM), `eval/`, model/seed/ZIP fetchers, `postbuild.ts`, `ensure-data.ts` |
| `data/` | `seed/` (committed seed trials), `geo/` (ZIP centroids), `build/` and `cache/` (generated) |
| `eval/` | `RESULTS.md`, `results.json`, hand labels |
| `tests/` | `unit/` (Vitest), `e2e/` (Playwright) |
| `public/` | `_headers` (CSP etc.), service worker, generated data and models |

## How matching works

1. **Intake** in the browser: cancer type, age, ZIP, travel distance, spread, treatments, biomarkers, pregnancy, other trials, language.
2. **Hard filters** (deterministic): cancer group, age range, travel distance from the ZIP centroid.
3. **Hybrid retrieval**: BM25 keyword search (MiniSearch) plus embedding similarity (MiniLM, int8 vectors, computed in a Web Worker) combined with **Reciprocal Rank Fusion** (k = 60). If embeddings fail, the app falls back to keyword-only and says so.
4. **Rule pre-check**: eligibility facts extracted at ingestion (age, biomarkers, prior treatment, and so on) add conflict/support signals. Uncertain facts are stored as "mentioned" and never penalize.
5. **AI analysis** (optional, via the backend): criterion-by-criterion assessment (`likely_met`, `likely_not_met`, `needs_doctor`) with quoted criteria and an overall fit (strong, possible, unclear, unlikely).
6. **Scoring** (`lib/match/score.ts`): normalized retrieval score, small penalties per rule conflict, small bonuses per support, and an adjustment from AI fit. Weights are listed in `DECISIONS.md`. The top results are shown, with "show more".

## The AI layer

- **Provider registry** (`config/ai-providers.ts`): OpenAI-compatible providers (Groq, Cerebras, OpenRouter are listed).
- **`dataTermsVerified`**: a provider is used only if its API key is set **and** `dataTermsVerified: true`. All ship as `false`; the owner must read each provider's current data-use terms before flipping it.
- **Mock provider**: used when no provider is enabled, so everything runs with zero keys. It is deterministic and for development and tests, not real analysis.
- **Failover**: providers are tried in order with a circuit breaker and daily budgets. If real providers are enabled but all fail, the API degrades to retrieval + rules rather than falling back to mock output.
- **Quote verification**: every quoted criterion must match the trial text. Failures get one repair retry, then the item is dropped or flagged.
- **Validation and caching**: output is schema-validated; results are cached in D1 keyed by profile, data version, prompt version, and a hash of the trial text.
- Prompts are versioned modules in `prompts/`.

## Trial Q&A safety

- Deterministic multilingual rules run **before** any AI call: crisis (shows 988 / 911), diagnosis, treatment advice, eligibility, and off-topic questions get fixed refusals.
- Answers must include verified verbatim citations from the trial text, otherwise the response is "not in the text".
- 300-character question limit, 10 questions per trial per session (client), and a server-side per-IP-hash daily backstop.
- Personal info is scrubbed client-side; Turnstile and rate limiting protect the endpoint.

## Data ingestion and sharding

| | Seed | National |
|---|---|---|
| Command | `npm run ingest:seed` | `npm run ingest` |
| Source | Committed `data/seed/studies.json` (real ClinicalTrials.gov records) | Live ClinicalTrials.gov API v2 |
| Use | Offline builds, default `setup`, tests | Full U.S. recruiting cancer trials |

Pipeline: fetch and cache pages (resumable, reruns reuse cached pages and embeddings), zod validation, scope filter (cancer terms / MeSH), cancer grouping, barrier detection, rule facts, int8 embeddings, then **shards**.

- Shards are per cancer group, split into balanced parts, under a content-hash version path so browsers cache them immutably.
- A lite cross-group index serves "not sure" searches; per-trial bucket files serve trial pages.
- ZIP centroid tables (U.S. Census gazetteer) are sharded by 3-digit prefix. Access Intelligence is precomputed into `access.json`. A SQL copy is produced for D1.
- **Safety aborts**: the run aborts if more than 5% of records are invalid or more than 40% are dropped. The output is swapped in atomically so a bad run cannot replace good data.
- Generated data (`public/data`, `public/models`, `data/build`) is gitignored and regenerated; only the seed is committed.

## Local LLM fact layer (optional)

`npm run ingest:llm -- --limit=N` extracts eligibility facts with a local **llama.cpp** `llama-server` (Qwen3-14B Q4_K_M per `DECISIONS.md`). Facts are validated per item and must quote the source text; results are cached by trial, update date, and prompt version. Where the LLM disagrees with the rule layer, both facts are stored as "needs review" and the pre-check ignores them. It was tested on a small sample only. **The full run is deferred** (many hours for the national set).

## Access Intelligence

`/access/` shows, for the whole data set and filtered by state or cancer type: share of trials with each barrier (English required, upper age limit, disability exclusion), a U.S. tile-grid map, a barrier chart, and a ranked table of sites with 5 or more trials. Counts are shown beside percentages and the data date is shown. Each barrier stores the exact triggering sentence. "Disability exclusion" includes psychiatric or cognitive exclusions with no stated medical reason (see the note in `API.md`). Rules are heuristic, so treat results as indicators, not findings about any site.

## Languages

English, Spanish, Portuguese, and Haitian Creole (`components/i18n/`). Translations are **not yet reviewed by native speakers**, and Haitian Creole AI output is marked experimental. Official trial text stays in English. Server-rendered HTML is English and a saved language applies after hydration.

## Evaluation

```
npm run eval          # runs the evaluation, writes eval/RESULTS.md and eval/results.json
npm run eval:labels   # regenerates the synthetic labels
npm run eval:vignettes  # graded vignette benchmark (eval/gold/)
```

`eval/RESULTS.md` is the full report. Headline numbers (national data, 5,726 trials, 40 synthetic profiles, nDCG@10 against **title/condition regex labels**, 95% bootstrap CI over profiles):

| System | nDCG@10 |
|---|---|
| Random order over the same hard-filtered candidates | 0.377 [0.321, 0.432] |
| BM25 keyword only | 0.700 [0.600, 0.790] |
| Full pipeline | 0.784 [0.684, 0.870] |

The pipeline beats random by +0.41 and BM25 by +0.08 (paired CIs exclude 0). On the 301-trial seed the same labels are a smoke test only: random scores 0.744, the pipeline 0.809, and the pipeline-minus-BM25 interval includes 0.

**Hard filters** are checked against an independent oracle (`scripts/eval/oracle.ts`) that re-derives cancer group, age and distance from the raw ClinicalTrials.gov fields instead of calling the app's own filter functions. Age, sex and distance: 0 violations among results on the seed and in the top 15 on national data. Cancer group: no violations in the top 15 on national data, but 3.7% of all candidates the filters let through and 1.9% of seed results are flagged (mixed MeSH-hierarchy tags such as thyroid under head and neck, CLL under lymphoma, plus a few genuine mis-tags); the report lists them. The older "0% violations" line was true by construction and is no longer used as evidence.

Rule-fact precision on a 50-item hand-labeled sample is 66%. Mock AI JSON validity / quote verification is 100% / 99.9%.

**Limitations (honest):** profiles are synthetic, not real people. The regex labels are not clinician-reviewed and BM25 reads the same text, so they flatter keyword matching; they are not accuracy evidence. Graded, quote-backed evidence comes from the vignette benchmark (`eval/gold/`) and the TREC Clinical Trials cancer subset (`eval/trec/`). Labels ignore detailed eligibility (labs, performance status, prior lines). The pipeline's excluded-label share is not better than random. Live AI providers were not evaluated. Treat this as a regression baseline, not a clinical accuracy claim. Re-running `npm run eval` without the national data (a fresh clone has only the seed) rewrites `eval/RESULTS.md` with the headline section marked as skipped.

## Security measures

- Strict CSP with no inline scripts (build externalizes Next inline scripts), HSTS, `frame-ancestors none`, nosniff, Referrer and Permissions policies (`public/_headers`).
- Same-origin check, 16 KB request limit, Cloudflare Turnstile (fails closed in production), D1 rate limits keyed by a daily-rotating salted IP hash.
- Daily per-provider budgets, circuit breaker, strict zod validation of inputs and model output.
- Build-output secret scan; model and ONNX runtime are self-hosted.
- Secrets live only in `.dev.vars` (gitignored) locally and Cloudflare secrets in production.
- Privacy policy and terms pages are **drafts and need legal review**.

## Testing

| Type | Command | Notes |
|---|---|---|
| Unit | `npm run test:unit` | Vitest: matching, minimization, ingestion rules, backend, D1 code against real SQL |
| Unit + coverage | `npm test` | Coverage thresholds enforced in `vitest.config.ts` |
| End-to-end | `npm run test:e2e` | Playwright against a snapshot of `./out` served by `wrangler dev` with a local D1 (the script copies `out/`, migrates and seeds D1, then runs Playwright). Main flow, mobile, AI fallback, data-minimization network check, Q&A safety. Run `npm run build` first; the first run needs `npx playwright install chromium` |
| Accessibility | included in `npm run test:e2e` | Automated axe checks (`@axe-core/playwright`) across pages, languages, themes, and 390 px width |
| Static | `npm run lint`, `npm run typecheck` | |
| Budgets and data | `npm run budgets`, `npm run data:verify` | Route JS, shard, asset and file-count budgets (after a build); data lock and model revision checks |
| Everything | `npm run ci` | lint, typecheck, unit tests with coverage, build, budgets, data:verify (add `npm run test:e2e` for the browser tests) |

## Run locally with one command

Prerequisites: Node 22 or newer and `npm install` (the script never installs for you).

```
npm install
npm run local            # add -- --open to open the browser, -- --port=8800 to change the port
```

What it does: checks Node and dependencies, fetches the embedding model and ONNX runtime if missing, keeps the data you already have (national data is never replaced by seed), builds the data from the committed seed if there is none, creates an empty `.dev.vars` if missing, runs `npm run build` only when `./out` is missing or older than sources/data (`-- --rebuild` forces it), then runs `npm run preview` and prints the URL (default http://localhost:8787). Ctrl+C stops it. Once the server answers it runs a PASS/FAIL self-check (pages, data, model, mock AI, service worker) and only then opens the browser (`--open`); `npm run local:check` re-runs it against a running server, and `npm run local -- --check` prints the plan without doing anything.

- **National data (~5,700 cancer trials):** `npm run local:national` runs the resumable national ingest first (about 12 s when cached, longer the first time because it downloads from ClinicalTrials.gov). `npm run local:seed` explicitly switches back to the small seed dataset.
- **API keys:** optional. Paste them into `.dev.vars` yourself (never in chat or the repo); with no usable keys the mock AI provider is used and the script says so. A provider also needs `dataTermsVerified: true` in `config/ai-providers.ts`.
- **Offline:** after the first run (model files and data downloaded) everything works without internet except real AI providers and data refreshes.
- **Troubleshooting:** "dependencies are not installed" means run `npm install`; "port in use" means pass `-- --port=N`; a stale or odd page means `npm run local -- --rebuild`; a failed ingest keeps the previous data, just rerun it (it resumes).

## Quick start (no API keys needed)

New to this? See [START_HERE.md](START_HERE.md): on a Mac, double-click `Start TrialBridge.command`.

```
npm install
npm run setup      # fetches the embedding model, ingests the seed data
npm run build      # Next static export + postbuild + wrangler dry-run
npm run preview    # migrates/seeds local D1, runs wrangler dev (site + /api)
```

Then open http://localhost:8787.

Notes:
- Prerequisite: Node 22 or newer. Run these commands from the repository root.
- `npm run build` produces a **static export in `out/`**. There is no `npm start`: `npm run preview` serves `out/` plus the `/api` Worker with `wrangler dev` (local D1, mock AI).
- Always build with `npm run build`; a bare `next build` output is not deployable. `npm run dev` runs the UI only (no API; AI analysis shows as degraded). Without any keys, the mock AI provider is used.
- `npm run setup` needs internet once, to fetch the embedding model and ONNX runtime files (`public/models`, `public/ort`, both gitignored).
- To run against all ~5,700 national trials instead of the 301-trial seed, use `npm run local:national` (see above).

**API keys:** paste them into `.dev.vars` yourself (`GROQ_API_KEY`, `CEREBRAS_API_KEY`, `OPENROUTER_API_KEY`; optional `TURNSTILE_SECRET_KEY`, `RATE_LIMIT_SALT`). Never put keys in chat, issues, or the repo; `.dev.vars` is gitignored. Then read the provider's data terms and set `dataTermsVerified: true` in `config/ai-providers.ts`. Set `NEXT_PUBLIC_PARTNER_EMAIL` at build time for the "Partner with us" link.

## Deployment (deferred)

The planned target is **Cloudflare Workers with static assets and D1**. Hosting, domain, CI, and monthly data refresh are deferred and not set up yet.

## Known limitations

- Rule-layer eligibility facts are heuristic; some criteria are misread (see precision above). The LLM fact layer has not been run at scale.
- Eval is synthetic and provisional (see above).
- Translations are not native-reviewed; the About page has no founder story yet.
- Matching assists discussion with a care team. It does not confirm eligibility.
- Not deployed; see `PROGRESS.md` for open issues.

## License

License: TBD (placeholder). Trial data is from ClinicalTrials.gov; check its terms of use.
