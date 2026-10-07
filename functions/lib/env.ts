/** Worker bindings and configuration (wrangler.jsonc vars + secrets). */
export interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  ENVIRONMENT?: string;
  DATA_VERSION?: string;
  GROQ_API_KEY?: string;
  CEREBRAS_API_KEY?: string;
  OPENROUTER_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  RATE_LIMIT_SALT?: string;
  DAILY_BUDGET_GROQ?: string;
  DAILY_BUDGET_CEREBRAS?: string;
  DAILY_BUDGET_OPENROUTER?: string;
  /** Comma-separated extra allowed origins for local development (e.g. http://localhost:3000). */
  DEV_ALLOWED_ORIGINS?: string;
}

export const isProduction = (env: Pick<Env, "ENVIRONMENT">): boolean => env.ENVIRONMENT === "production";
