# DECISIONS

- Hosting: Cloudflare free tier (no paid plan, no other host). Reason: user has no paid hosting.
- Local LLM runtime: llama.cpp (`llama-server`, OpenAI-compatible) instead of Ollama. Reason: already installed; Ollama is not.
- Local LLM model: Qwen3-14B Q4_K_M (~9 GB). Reason: strongest practical fit for 48 GB RAM; compare vs Llama 3.1 8B later if desired.
- AI providers: none enabled at start (no keys, terms unverified); mock provider only. Reason: user has no keys yet.
- Domain: none yet; use free Cloudflare subdomain until purchased. Reason: user has no domain.
- Deploy target: Cloudflare Workers with static assets (`wrangler.jsonc`, assets=./out, run_worker_first=/api/*). Reason: Cloudflare's current recommendation for new projects over Pages; supports `_headers`.
- TypeScript pinned to 5.9.3 (not 7.x). Reason: TS 7 (Go port) lacks the JS API that Next/typescript-eslint rely on.
- shadcn/ui initialized with its default base-ui style; radix-ui removed. Reason: current shadcn default; minimal deps.
- npm 11 install-script allowlist: esbuild, workerd, onnxruntime-node, protobufjs, unrs-resolver approved; fsevents denied. Reason: required native binaries only.
- Storage: D1 for backend trial-criteria copy, analysis cache, rate limits, and provider budgets. Reason: KV free tier allows only 1k writes/day; D1 free allows 100k row writes/day, 5M reads/day, 5 GB.
- Generated data (public/data, public/models, data/build) is gitignored; `npm run setup` / prebuild regenerates from committed data/seed. Reason: keep repo small; seed is committed for offline builds.
- Team split: Agent A (data, lib/match, functions, security) / Agent B (app/, components/ UI). Contract documented in API.md.
