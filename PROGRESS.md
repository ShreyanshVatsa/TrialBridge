# PROGRESS

Current checkpoint: 1 (start-up) complete; starting P0.

## Done
- Hardware check: M4 Pro, 48 GB RAM, 258 GB free. Node fixed (v26.10.0).
- Local LLM: llama.cpp installed (llama-server); Qwen3-14B-Q4_K_M.gguf downloading to ~/models. Old HF cache (image models, Qwen3.5-4B) deleted.

## In progress
- P0 project setup.

## Next
- P0 per PLAN.md Execution Rules.

## Known issues
- None.

## Accounts to create (user does these; none block the build, mock provider is used until ready)
1. GitHub (free): https://github.com/signup, then run `gh auth login` in the terminal.
2. Cloudflare (free): https://dash.cloudflare.com/sign-up, then run `npx wrangler login`. Needed at the deployment checkpoint only.
3. Groq (free key): https://console.groq.com/keys. Read data terms first, then set `dataTermsVerified: true` in `config/ai-providers.ts`.
4. Cerebras (free key): https://cloud.cerebras.ai. Same data-terms step.
5. OpenRouter (optional, free key): https://openrouter.ai/keys. Same data-terms step.
6. Domain (later): buy through Cloudflare Registrar (at-cost pricing, auto-connects to Pages). Setup steps go in the deployment checkpoint.
- Paste keys into `.dev.vars` yourself; never into chat.
