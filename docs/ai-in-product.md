# AI in the Product

How TrialBridge uses AI providers, what data is sent to them, and the caveats on the evaluation figures. Items marked [TO COMPLETE] are intentionally blank until verified. Do not publish with unverified statements.

## 1. How AI is used in the product

- Providers: configured in `config/ai-providers.ts` as Groq, Cerebras, and OpenRouter (OpenAI-compatible APIs, free tiers, failover in that order). Each is used only if its key is set and `dataTermsVerified` is true. At the time of writing all are false, so only the mock provider runs. Current status: [TO COMPLETE]
- Mock provider: used when no provider is enabled; produces deterministic placeholder output so the app works with no keys. Its output is not real AI analysis.
- What AI does: explains possible fit and barriers for a trial given a minimized profile (`/api/analyze`), and answers questions grounded in a trial's text (`/api/ask`).
- Quote verification: AI-cited quotes must appear verbatim in the trial text; failures get one repair retry, and unverifiable answers become "not in text".
- Deterministic safety rules (crisis, eligibility, diagnosis, and treatment-advice questions) run before any AI call.
- Limits: rate limits per IP hash, per-provider daily budgets, a circuit breaker, 10 questions per trial per session in the client, and a server cap per trial per IP per day. If providers fail, the app degrades to retrieval plus rules.
- Offline/local: an optional local llama.cpp (Qwen3-14B) layer extracts eligibility facts at ingestion; only a 4-trial sample has been run. Retrieval embeddings use Xenova/all-MiniLM-L6-v2 in the browser.
- AI does not decide eligibility; results are informational. Wording for users: [TO COMPLETE]

## 2. Data sent to AI providers

- Intended payload (by design, `lib/privacy/minimize.ts`): cancer type, age bracket (decade), spread, treatments, biomarkers, pregnancy status, concurrent-trial status, language, plus public trial text. Exact age, ZIP code, and travel distance are not sent.
- Trial questions: typed by users, personal details scrubbed, sent with trial text. Users are told not to include personal information.
- Not logged by TrialBridge: profiles, questions, answers. Responses may be cached (30 days for analysis) keyed by profile/trial hashes; cache contents: [TO COMPLETE]
- Provider data terms (training use, retention, human review) verified for each provider: [TO COMPLETE]. Google Gemini's free tier was deliberately excluded.
- Legal/regulatory position on health-related inputs (for example HIPAA/GDPR applicability): [TO COMPLETE]

## 3. Evaluation caveats

- Eval labels are synthetic and rule-generated from trial titles and conditions; they are not clinician-reviewed (DECISIONS.md).
- 30 synthetic profiles; reported figures (0% hard-filter violations, nDCG@10 0.819, mock AI JSON 100%) measure the pipeline against those labels, not real patient outcomes.
- Rule-fact precision is 66% on a small sample hand-judged internally (not an independent reviewer).
- The mock AI metrics do not reflect real provider quality; no real provider has been evaluated. Real-provider results: [TO COMPLETE]
- Translation and Haitian Creole AI output quality have not been validated (Haitian Creole AI output is marked experimental).
