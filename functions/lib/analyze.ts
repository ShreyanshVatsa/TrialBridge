import { AnalyzeRequestSchema, type AnalyzeResponse, type MinimizedProfile, type TrialAnalysis } from "@/lib/types/analysis";
import { PROMPT_VERSION } from "@/config/embedding";
import { ANALYZE_SYSTEM_PROMPT, buildAnalyzeUserPrompt, buildRepairPrompt } from "@/prompts/analyze-v1";
import type { Env } from "./env";
import { apiError, devCorsHeaders, isSameOrigin, json, readJsonBody } from "./http";
import type { KvStore } from "./store";
import type { ServerTrial, TrialStore } from "./trials";
import { ANALYSIS_TTL_SECONDS, analysisCacheKey } from "./cache";
import { checkRateLimit, hashIp } from "./ratelimit";
import { sha256Hex, stableStringify } from "./crypto";
import { tryConsumeBudget } from "./budget";
import { verifyQuotes } from "./quotes";
import { parseModelOutput } from "./ai/output";
import { runWithFailover, type FailoverDeps } from "./ai/failover";
import { ProviderError, type AiProvider, type ChatMessage } from "./ai/types";
import { dailyBudget } from "./ai/providers";

/** If more than this share of quotes fail verification, retry once with a repair prompt. */
export const MAX_QUOTE_FAILURE_RATE = 0.5;

export interface AnalyzeDeps {
  env: Env;
  store: KvStore;
  trials: TrialStore;
  providers: AiProvider[];
  breakerFor: FailoverDeps["breakerFor"];
  verifyTurnstile: (token: string, ip: string | null) => Promise<boolean>;
  /** Salt for IP hashing (secret in production). */
  salt: string;
  requestId: string;
  log: (event: Record<string, string | number>) => void;
}

/** Split trials into at most 2 batches so each prompt fits the provider's context budget. */
export function splitBatches(trials: readonly ServerTrial[], maxChars: number, size: (t: ServerTrial) => number): ServerTrial[][] {
  const total = trials.reduce((s, t) => s + size(t), 0);
  if (total <= maxChars || trials.length < 2) return [trials.slice()];
  const mid = Math.ceil(trials.length / 2);
  return [trials.slice(0, mid), trials.slice(mid)];
}

const trialChars = (t: ServerTrial) => t.title.length + [...t.inclusion, ...t.exclusion].reduce((s, c) => s + c.text.length + 6, 0);

/** One provider attempt over all batches, with quote verification and a single repair retry per batch. */
async function analyzeWith(provider: AiProvider, profile: MinimizedProfile, trials: readonly ServerTrial[]): Promise<TrialAnalysis[]> {
  const results: TrialAnalysis[] = [];
  for (const batch of splitBatches(trials, provider.maxInputChars, trialChars)) {
    const messages: ChatMessage[] = [
      { role: "system", content: ANALYZE_SYSTEM_PROMPT },
      { role: "user", content: buildAnalyzeUserPrompt(profile, profile.language, batch) },
    ];
    const raw = await provider.complete({ messages, profile, trials: batch });
    let check = verifyQuotes(parseModelOutput(raw), batch);
    if (check.total > 0 && check.failed / check.total > MAX_QUOTE_FAILURE_RATE) {
      const repaired = await provider.complete({
        messages: [...messages, { role: "assistant", content: raw }, { role: "user", content: buildRepairPrompt(`${check.failed} of ${check.total} quotes were not verbatim.`) }],
        profile,
        trials: batch,
      });
      check = verifyQuotes(parseModelOutput(repaired), batch);
      if (check.total > 0 && check.failed / check.total > MAX_QUOTE_FAILURE_RATE) throw new ProviderError("invalid_output", "quote verification failed after repair");
    }
    results.push(...check.analyses);
  }
  return results;
}

/** POST /api/analyze */
export async function handleAnalyze(request: Request, deps: AnalyzeDeps): Promise<Response> {
  const { env, requestId } = deps;
  const cors = devCorsHeaders(request, env);
  if (request.method !== "POST") return apiError("method_not_allowed", requestId, cors);
  if (!isSameOrigin(request, env)) return apiError("forbidden_origin", requestId);

  const body = await readJsonBody(request);
  if (body === null) return apiError("payload_too_large", requestId, cors);
  const parsed = AnalyzeRequestSchema.safeParse(body);
  if (!parsed.success) return apiError("bad_request", requestId, cors);
  const { profile, nctIds, turnstileToken } = parsed.data;

  const ip = request.headers.get("CF-Connecting-IP");
  if (!(await deps.verifyTurnstile(turnstileToken, ip))) return apiError("turnstile_failed", requestId, cors);

  const rl = await checkRateLimit(deps.store, "analyze", await hashIp(ip ?? "unknown", deps.salt));
  if (!rl.allowed) return apiError("rate_limited", requestId, { ...cors, "Retry-After": String(rl.retryAfter) });

  const ids = [...new Set(nctIds)];
  const trials = await deps.trials.getTrials(ids);
  const experimental = profile.language === "ht";
  const dataVersion = env.DATA_VERSION ?? "unknown";
  if (trials.length === 0) {
    const empty: AnalyzeResponse = { status: "degraded", provider: null, results: [], experimental, cached: false, degradedReason: "ai_unavailable" };
    return json(empty, 200, requestId, cors);
  }

  // Include a hash of the trials' own text so cached analyses refresh whenever trial data changes.
  const contentHash = (await sha256Hex(stableStringify(trials))).slice(0, 16);
  const cacheKey = await analysisCacheKey(profile, ids, `${dataVersion}:${contentHash}`, PROMPT_VERSION);
  const hit = await deps.store.get(cacheKey);
  if (hit) {
    const cached = JSON.parse(hit) as { provider: string; results: TrialAnalysis[] };
    const res: AnalyzeResponse = { status: "ok", provider: cached.provider, results: cached.results, experimental, cached: true };
    deps.log({ requestId, route: "analyze", status: "cache_hit" });
    return json(res, 200, requestId, cors);
  }

  const outcome = await runWithFailover(deps.providers, (p) => analyzeWith(p, profile, trials), {
    breakerFor: deps.breakerFor,
    consumeBudget: (p) => tryConsumeBudget(deps.store, p.name, dailyBudget(env, p.name)),
    log: (e) => deps.log({ requestId, route: "analyze", ...e }),
  });

  if (!outcome.ok) {
    const res: AnalyzeResponse = { status: "degraded", provider: null, results: [], experimental, cached: false, degradedReason: outcome.reason };
    return json(res, 200, requestId, cors);
  }
  await deps.store.put(cacheKey, JSON.stringify({ provider: outcome.provider, results: outcome.value }), ANALYSIS_TTL_SECONDS);
  const res: AnalyzeResponse = { status: "ok", provider: outcome.provider, results: outcome.value, experimental, cached: false };
  return json(res, 200, requestId, cors);
}
