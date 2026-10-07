# PROGRESS

Current checkpoint: 2 (end of P0). Agent A (data/matching/backend) done; Agent B owns app/ + components/.

## Done (P0, Agent A)
- Scaffold: Next 16 static export, TS 5.9 strict, Tailwind 4, shadcn (base-ui), Vitest, Playwright deps, wrangler.jsonc (Workers + static assets + D1), .dev.vars (empty), .gitignore.
- Shared zod types (lib/types), API contract (API.md), data minimization (lib/privacy/minimize.ts).
- Seed: 302 real recruiting interventional U.S. cancer trials (data/seed/studies.json), 20 groups populated, 51 states.
- Ingestion (`npm run ingest:seed`, national `npm run ingest` resumable): zod validation, groups via MeSH, barriers, rule facts, int8 embeddings (cached), shards, ZIP tables, safety aborts (>5% invalid, >40% drop), atomic swap, D1 SQL copy.
- Matching (lib/match): hand-written cosine.ts / rrf.ts / score.ts, filters, pre-check, rank, browser search with Web Worker embeddings (verified in headless Chromium: model + wasm self-hosted, no CSP errors, ~9 s first search incl. model download).
- Backend (functions/): POST /api/analyze with mock + OpenAI-compatible failover, circuit breaker, daily budgets, D1 cache (30 d) + rate limit (10/h), Turnstile, same-origin, 16 KB limit, quote verification + one repair retry, graceful degradation. Verified with `wrangler dev` + local D1.
- Security: public/_headers (strict CSP, HSTS, frame-ancestors none, nosniff, Referrer/Permissions policies, caching); postbuild inline-script externalization + build-output secret scan.
- Tests: 83 unit tests passing (lib/match, minimization, ingestion rules, backend); coverage 72% lines (90% target is P2).

## Next (P1)
- National ingestion run (background); then make the `_all` "not sure" shard a lite cross-group index (full-card `_all` is ~4 MB raw for 302 trials, too big nationally).
- Q&A endpoint, Access Intelligence, eval, e2e tests, remaining pages/translations (see PLAN.md P1).
- llama.cpp (Qwen3-14B) LLM fact layer: code path + small-sample test (deferred full run).

## How to run locally
- `npm install && npm run setup` (model + seed data), `npm run build`, then `npm run preview` (migrates/seeds local D1, runs wrangler dev with the static export + API).

## Known issues
- `_all` shard scales poorly nationally (see Next). Coverage below 90% target (loader/search/embedder/api clients untested; P2).
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
