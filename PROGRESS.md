# PROGRESS

Current checkpoint: 3 (end of P1). Agent A (data/matching/backend) P1 done; Agent B owns app/ + components/.

## Done (P0, Agent A)
- Scaffold: Next 16 static export, TS 5.9 strict, Tailwind 4, shadcn (base-ui), Vitest, Playwright deps, wrangler.jsonc (Workers + static assets + D1), .dev.vars (empty), .gitignore.
- Shared zod types (lib/types), API contract (API.md), data minimization (lib/privacy/minimize.ts).
- Seed: 302 real recruiting interventional U.S. cancer trials (data/seed/studies.json), 20 groups populated, 51 states.
- Ingestion (`npm run ingest:seed`, national `npm run ingest` resumable): zod validation, groups via MeSH, barriers, rule facts, int8 embeddings (cached), shards, ZIP tables, safety aborts (>5% invalid, >40% drop), atomic swap, D1 SQL copy.
- Matching (lib/match): hand-written cosine.ts / rrf.ts / score.ts, filters, pre-check, rank, browser search with Web Worker embeddings (verified in headless Chromium: model + wasm self-hosted, no CSP errors, ~9 s first search incl. model download).
- Backend (functions/): POST /api/analyze with mock + OpenAI-compatible failover, circuit breaker, daily budgets, D1 cache (30 d) + rate limit (10/h), Turnstile, same-origin, 16 KB limit, quote verification + one repair retry, graceful degradation. Verified with `wrangler dev` + local D1.
- Security: public/_headers (strict CSP, HSTS, frame-ancestors none, nosniff, Referrer/Permissions policies, caching); postbuild inline-script externalization + build-output secret scan.
- Tests: 83 unit tests passing (lib/match, minimization, ingestion rules, backend); coverage 72% lines (90% target is P2).

## Done (P0 + P1, Agent B: UI)
- P0 UI: landing with animated demo, guided chat intake (9 questions, edit, summary), results cards, trial page (/trial/?id=), privacy page, error boundaries, dark mode.
- P1 Trial Q&A UI: Ask buttons on cards and trial page, 300-char limit, personal-info notice, 10/session counter, refusal/crisis (988/911)/not-in-text/busy states, citations.
- P1 Access Intelligence (/access/): filters, stat cards, U.S. tile-grid map, barrier-type chart (Recharts), cancer-type list, ranked 5+-trial site table with counts beside percentages, data date.
- P1 pages: For Research Sites (mailto Partner button), Methodology (with live eval summary from eval/results.json), About, privacy page update, privacy policy + terms drafts marked "Draft, needs legal review"; landing teaser links to /for-sites/.
- P1 nav/footer: full nav with mobile menu, language switcher, footer columns.
- P1 translations: es, pt, ht complete (components/i18n), localized cancer types/dates; "not yet reviewed by native speakers" note; Haitian Creole AI output marked experimental.
- Verified: "1 card after returning from trial page" was a test artifact (counted the trial page's own article); results persist (10/10).
- Checks: lint + typecheck clean for app/ and components/; axe no serious/critical on all pages in en/es/pt/ht, light/dark, 390px; no horizontal overflow.

## Done (P2, Agent B: UI)
- PWA: manifest (any + maskable icons 192/512, apple-touch), app-shell-only service worker (never /api, /data, /models, /ort), /offline/ page, update prompt; Chromium reports no installability errors.
- No English flash: /theme-init.js (blocking, CSP-safe) sets theme + lang and hides the page until the saved language renders; non-English messages are lazy-loaded chunks.
- Speed: matching engine, AI client, Turnstile and Recharts code-split; prefetchSearch warm-up after cancer type; zod kept off landing/access critical path; manifest preload on trial page; next/font with metric-matched fallbacks; skeletons with reserved height (CLS 0).
- Lighthouse (mobile, simulated, local preview): landing 88-94, find 93, access 93, trial 87-89 performance; accessibility, best practices, SEO 100 on all. Trial LCP waits on client-loaded trial data (by design).
- Polish: chat typing indicator before each question, Enter picks top cancer match, wrapping buttons (no overflow at 320px), demo animation without opacity (contrast-safe), print view margins/URLs, dark mode checked on results.
- Axe sweep: 0 serious/critical on all 13 routes x 4 languages x light/dark (320/390/1280px) plus summary, results (4 languages) and trial + Q&A views; keyboard intake verified.

## Done (P1, Agent A)
- Lite cross-group "not sure" index + per-trial buckets; Access Intelligence aggregates (/data/access.json) + helpers (lib/access).
- POST /api/ask (crisis 988, refusals, PII scrub, grounded citations, cache, 30/h, Turnstile, mock) + client lib/api/ask.ts; API.md updated.
- llama.cpp LLM fact layer (`npm run ingest:llm -- --limit=N`): tested on 4 seed trials (~13-35 s/trial); full run deferred.
- `npm run eval`: 30 synthetic profiles; 0% hard-filter violations; full-pipeline nDCG@10 0.819; fact precision 66%; mock AI JSON 100%, quotes 99.8%.
- E2E (Playwright, 11 tests): main flow x3 + mobile, AI fallback, data-minimization network test, Q&A safety UI + API. Pass on seed and national data.
- National ingest: 5,888 fetched, 5,779 trials, 51 states, 107 out of scope, 2 invalid; resumable rerun uses cached pages + embeddings (8.6 s).

## Next (P2)
- Coverage to 90% (now 77% lines), axe suite, PWA, CI + monthly refresh workflow, Dependabot, SECURITY.md, README; npm audit (dev-tool advisories).
- Full LLM fact extraction run (`npm run ingest:llm`, ~20+ h nationally at ~15-30 s/trial).

## Previously planned for P1 (done)
- National ingestion run (background); then make the `_all` "not sure" shard a lite cross-group index (full-card `_all` is ~4 MB raw for 302 trials, too big nationally).
- Q&A endpoint, Access Intelligence, eval, e2e tests, remaining pages/translations (see PLAN.md P1).
- llama.cpp (Qwen3-14B) LLM fact layer: code path + small-sample test (deferred full run).

## How to run locally
- `npm install && npm run setup` (model + seed data), `npm run build`, then `npm run preview` (migrates/seeds local D1, runs wrangler dev with the static export + API).

## Known issues
- UI: set NEXT_PUBLIC_PARTNER_EMAIL at build time; without it the "Partner with us" mailto has no recipient.
- UI: About page has no founder story yet (needs the founder's real text; none was invented).
- Coverage below 90% target (loader/search/embedder untested; P2). Rule-fact precision 66% on hand-labeled sample (eval/RESULTS.md).
- `npm audit --audit-level=high` fails on dev tooling only (braces 3.0.3 advisory with no patched release, via shadcn/eslint-config-next; sharp via miniflare). P2: overrides/upgrades.
- Rule-layer facts are heuristic; some criteria still misread (LLM layer + eval in P1).

## Accounts to create (user does these; none block the build, mock provider is used until ready)
1. GitHub (free): https://github.com/signup, then run `gh auth login` in the terminal.
2. Cloudflare (free): https://dash.cloudflare.com/sign-up, then run `npx wrangler login`. Needed at the deployment checkpoint only.
3. Groq (free key): https://console.groq.com/keys. Read data terms first, then set `dataTermsVerified: true` in `config/ai-providers.ts`.
4. Cerebras (free key): https://cloud.cerebras.ai. Same data-terms step.
5. OpenRouter (optional, free key): https://openrouter.ai/keys. Same data-terms step.
6. Domain (later): buy through Cloudflare Registrar (at-cost pricing, auto-connects to Pages). Setup steps go in the deployment checkpoint.
- Paste keys into `.dev.vars` yourself; never into chat.
