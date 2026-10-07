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

## Done (P0 + P1, Agent B: UI)
- P0 UI: landing with animated demo, guided chat intake (9 questions, edit, summary), results cards, trial page (/trial/?id=), privacy page, error boundaries, dark mode.
- P1 Trial Q&A UI: Ask buttons on cards and trial page, 300-char limit, personal-info notice, 10/session counter, refusal/crisis (988/911)/not-in-text/busy states, citations.
- P1 Access Intelligence (/access/): filters, stat cards, U.S. tile-grid map, barrier-type chart (Recharts), cancer-type list, ranked 5+-trial site table with counts beside percentages, data date.
- P1 pages: For Research Sites (mailto Partner button), Methodology (with live eval summary from eval/results.json), About, privacy page update, privacy policy + terms drafts marked "Draft, needs legal review"; landing teaser links to /for-sites/.
- P1 nav/footer: full nav with mobile menu, language switcher, footer columns.
- P1 translations: es, pt, ht complete (components/i18n), localized cancer types/dates; "not yet reviewed by native speakers" note; Haitian Creole AI output marked experimental.
- Verified: "1 card after returning from trial page" was a test artifact (counted the trial page's own article); results persist (10/10).
- Checks: lint + typecheck clean for app/ and components/; axe no serious/critical on all pages in en/es/pt/ht, light/dark, 390px; no horizontal overflow.

## Next (P1)
- National ingestion run (background); then make the `_all` "not sure" shard a lite cross-group index (full-card `_all` is ~4 MB raw for 302 trials, too big nationally).
- Q&A endpoint, Access Intelligence, eval, e2e tests, remaining pages/translations (see PLAN.md P1).
- llama.cpp (Qwen3-14B) LLM fact layer: code path + small-sample test (deferred full run).

## How to run locally
- `npm install && npm run setup` (model + seed data), `npm run build`, then `npm run preview` (migrates/seeds local D1, runs wrangler dev with the static export + API).

## Known issues
- UI: set NEXT_PUBLIC_PARTNER_EMAIL at build time; without it the "Partner with us" mailto has no recipient.
- UI: About page has no founder story yet (needs the founder's real text; none was invented).
- UI: server-rendered HTML is English; a saved non-English language applies right after hydration (brief English flash).
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
