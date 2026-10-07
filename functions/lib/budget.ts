import type { KvStore } from "./store";
import { utcDay } from "./crypto";

/**
 * Global daily request budget per provider, kept below each free tier's limit.
 * `tryConsume` reserves one request; when the budget is exhausted the provider is skipped.
 */
export async function tryConsumeBudget(store: KvStore, provider: string, dailyLimit: number, now: Date = new Date()): Promise<boolean> {
  if (!Number.isFinite(dailyLimit) || dailyLimit <= 0) return false;
  const used = await store.incr(`budget:${provider}:${utcDay(now)}`, 2 * 86_400);
  return used <= dailyLimit;
}
