import { ProviderError, type AiProvider, type ProviderErrorKind } from "./types";
import type { CircuitBreaker } from "./circuit";

export type FailoverResult<T> =
  | { ok: true; provider: string; value: T }
  | { ok: false; reason: "budget_exhausted" | "ai_unavailable" | "invalid_output"; lastError: ProviderErrorKind | null };

export interface FailoverDeps {
  breakerFor(name: string): CircuitBreaker;
  /** Reserve one request from the provider's daily budget; false = exhausted (skip). */
  consumeBudget(provider: AiProvider): Promise<boolean>;
  log?: (event: { provider: string; status: string; latencyMs: number }) => void;
}

/**
 * Try providers in priority order. On 429, 5xx, timeout, network, or invalid output, move to the
 * next provider. Open circuits and exhausted budgets are skipped.
 */
export async function runWithFailover<T>(providers: readonly AiProvider[], attempt: (p: AiProvider) => Promise<T>, deps: FailoverDeps): Promise<FailoverResult<T>> {
  let lastError: ProviderErrorKind | null = null;
  let budgetSkips = 0;
  for (const p of providers) {
    const breaker = deps.breakerFor(p.name);
    if (!breaker.canRequest()) continue;
    if (!p.isMock && !(await deps.consumeBudget(p))) {
      budgetSkips++;
      continue;
    }
    const t0 = Date.now();
    try {
      const value = await attempt(p);
      breaker.recordSuccess();
      deps.log?.({ provider: p.name, status: "ok", latencyMs: Date.now() - t0 });
      return { ok: true, provider: p.name, value };
    } catch (err) {
      lastError = err instanceof ProviderError ? err.kind : "server";
      breaker.recordFailure();
      deps.log?.({ provider: p.name, status: lastError, latencyMs: Date.now() - t0 });
    }
  }
  if (lastError === null && budgetSkips > 0) return { ok: false, reason: "budget_exhausted", lastError };
  return { ok: false, reason: lastError === "invalid_output" ? "invalid_output" : "ai_unavailable", lastError };
}
