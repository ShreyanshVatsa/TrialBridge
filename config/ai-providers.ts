/**
 * AI provider registry (OpenAI-compatible chat completions). Free tiers only.
 *
 * A provider is used ONLY if its API key env var is set AND `dataTermsVerified` is true.
 * IMPORTANT: before setting `dataTermsVerified: true`, read the provider's current data-use and
 * privacy terms yourself and confirm free-tier inputs are not used for training or human review.
 * Google Gemini's free tier is intentionally excluded (inputs may be used for product improvement).
 *
 * Order = failover priority. Free model lists change often; update `model` as needed.
 */
export interface AiProviderConfig {
  name: string;
  baseUrl: string;
  model: string;
  /** Env var (Worker secret) holding the API key. */
  keyEnv: "GROQ_API_KEY" | "CEREBRAS_API_KEY" | "OPENROUTER_API_KEY";
  /** Env var holding this provider's global daily request budget (kept below its free limit). */
  budgetEnv: "DAILY_BUDGET_GROQ" | "DAILY_BUDGET_CEREBRAS" | "DAILY_BUDGET_OPENROUTER";
  /** Set to true manually after reading the provider's data terms. */
  dataTermsVerified: boolean;
  /** Approximate max input characters per request (batches are split above this). */
  maxInputChars: number;
}

export const AI_PROVIDERS: readonly AiProviderConfig[] = [
  { name: "groq", baseUrl: "https://api.groq.com/openai/v1", model: "openai/gpt-oss-120b", keyEnv: "GROQ_API_KEY", budgetEnv: "DAILY_BUDGET_GROQ", dataTermsVerified: false, maxInputChars: 60_000 },
  { name: "cerebras", baseUrl: "https://api.cerebras.ai/v1", model: "gpt-oss-120b", keyEnv: "CEREBRAS_API_KEY", budgetEnv: "DAILY_BUDGET_CEREBRAS", dataTermsVerified: false, maxInputChars: 60_000 },
  { name: "openrouter", baseUrl: "https://openrouter.ai/api/v1", model: "openrouter/free", keyEnv: "OPENROUTER_API_KEY", budgetEnv: "DAILY_BUDGET_OPENROUTER", dataTermsVerified: false, maxInputChars: 40_000 },
];
