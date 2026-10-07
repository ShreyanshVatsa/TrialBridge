import { expect, test } from "@playwright/test";
import { completeIntake, RESULTS_HEADING } from "./helpers";

/**
 * First-search latency (cold cache) and repeat-search latency, with transferred bytes by kind.
 * Budgets are generous (local machine); the numbers are logged for PROGRESS.md.
 */
test("first-search and repeat-search latency", async ({ page }) => {
  const bytes: Record<string, number> = {};
  page.on("response", async (r) => {
    const u = new URL(r.url()).pathname;
    const kind = u.startsWith("/models/") ? "model" : u.startsWith("/ort/") ? "wasm" : u.startsWith("/data/") ? "data" : u.startsWith("/_next/") ? "app" : "other";
    const len = (await r.request().sizes().catch(() => ({ responseBodySize: 0 }))).responseBodySize;
    bytes[kind] = (bytes[kind] ?? 0) + len;
  });
  const tStart = Date.now();
  await completeIntake(page, { cancer: "Breast cancer" });
  const intakeMs = Date.now() - tStart;
  const t0 = Date.now();
  await expect(page.getByText(RESULTS_HEADING)).toBeVisible({ timeout: 90_000 });
  const first = Date.now() - t0;
  await expect(page.getByText(/Smart search couldn't load/i)).toHaveCount(0);

  await completeIntake(page, { cancer: "Breast cancer", zip: "10032" });
  const t1 = Date.now();
  await expect(page.getByText(RESULTS_HEADING)).toBeVisible({ timeout: 90_000 });
  const repeat = Date.now() - t1;
  const kb = Object.fromEntries(Object.entries(bytes).map(([k, v]) => [k, Math.round(v / 1024)]));
  console.log(`PERF intake-automation ${intakeMs} ms (shards + model prefetched meanwhile), first-search ${first} ms, repeat-search ${repeat} ms, KB transferred ${JSON.stringify(kb)}`);
  expect(first).toBeLessThan(30_000);
  expect(repeat).toBeLessThan(10_000);
});
