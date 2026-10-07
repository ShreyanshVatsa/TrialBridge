/**
 * Local LLM eligibility-fact extraction (optional layer), via llama.cpp's OpenAI-compatible
 * `llama-server`. Run AFTER ingestion: `npm run ingest:llm -- --limit=5` (small sample) or with no
 * limit for the full (long) run. Resumable: results are cached per trial in data/cache/llm-facts.json
 * keyed by NCT ID + last-updated date + prompt version, so unchanged trials are never reprocessed.
 * Largest cancer groups first. The next `npm run ingest` merges cached LLM facts with the rule layer.
 *
 * Env/flags: --limit=N, --model=PATH (default ~/models/Qwen3-14B-Q4_K_M.gguf), LLM_BASE_URL
 * (default http://127.0.0.1:8080). Starts llama-server itself if none is running.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { spawn, type ChildProcess } from "node:child_process";
import os from "node:os";
import path from "node:path";
import type { CancerGroupId } from "../../config/cancer-groups";
import type { Criterion } from "../../lib/types/trial";
import { buildLlmUserPrompt, LLM_SYSTEM_PROMPT, llmCacheKey, parseLlmOutput, verifyLlmFacts } from "../../lib/ingest/llm-facts";

export const LLM_CACHE_FILE = "data/cache/llm-facts.json";
const args = new Map(process.argv.slice(2).map((a) => a.replace(/^--/, "").split("=") as [string, string]));
const LIMIT = args.has("limit") ? Number(args.get("limit")) : Infinity;
const MODEL = args.get("model") ?? path.join(os.homedir(), "models/Qwen3-14B-Q4_K_M.gguf");
const BASE = process.env.LLM_BASE_URL ?? "http://127.0.0.1:8080";

interface ServerTrialLite {
  id: string;
  groups: CancerGroupId[];
  inclusion: Criterion[];
  exclusion: Criterion[];
  lastUpdated: string;
}
export interface LlmCacheEntry {
  model: string;
  facts: ReturnType<typeof verifyLlmFacts>["facts"];
  discarded: number;
  seconds: number;
}

async function healthy(): Promise<boolean> {
  try {
    return (await fetch(`${BASE}/health`, { signal: AbortSignal.timeout(2000) })).ok;
  } catch {
    return false;
  }
}

async function ensureServer(): Promise<ChildProcess | null> {
  if (await healthy()) return null;
  const port = new URL(BASE).port || "8080";
  console.log(`Starting llama-server with ${MODEL} ...`);
  const child = spawn("llama-server", ["-m", MODEL, "--port", port, "-c", "16384", "-ngl", "99", "--jinja"], { stdio: "ignore" });
  for (let i = 0; i < 180; i++) {
    if (await healthy()) return child;
    await new Promise((r) => setTimeout(r, 1000));
  }
  child.kill();
  throw new Error("llama-server did not become healthy within 180 s");
}

async function extract(t: ServerTrialLite): Promise<LlmCacheEntry> {
  const t0 = Date.now();
  const res = await fetch(`${BASE}/v1/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [
        { role: "system", content: LLM_SYSTEM_PROMPT },
        { role: "user", content: buildLlmUserPrompt(t.inclusion, t.exclusion) },
      ],
      temperature: 0,
      max_tokens: 2500,
      response_format: { type: "json_object" },
      chat_template_kwargs: { enable_thinking: false },
    }),
    signal: AbortSignal.timeout(600_000),
  });
  if (!res.ok) throw new Error(`llama-server HTTP ${res.status}`);
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const out = parseLlmOutput(data.choices?.[0]?.message?.content ?? "");
  const v = verifyLlmFacts(out, t.inclusion, t.exclusion);
  return { model: path.basename(MODEL), facts: v.facts, discarded: v.discarded, seconds: (Date.now() - t0) / 1000 };
}

async function main(): Promise<void> {
  const criteria = JSON.parse(await readFile("data/build/criteria.json", "utf8")) as { trials: Record<string, ServerTrialLite> };
  const trials = Object.values(criteria.trials);
  let cache: Record<string, LlmCacheEntry> = {};
  try {
    cache = JSON.parse(await readFile(LLM_CACHE_FILE, "utf8")) as Record<string, LlmCacheEntry>;
  } catch {
    /* fresh */
  }
  // Largest cancer groups first.
  const size = new Map<string, number>();
  for (const t of trials) for (const g of t.groups) size.set(g, (size.get(g) ?? 0) + 1);
  const rank = (t: ServerTrialLite) => Math.max(...t.groups.map((g) => size.get(g) ?? 0));
  const todo = trials.filter((t) => !cache[llmCacheKey(t.id, t.lastUpdated)]).sort((a, b) => rank(b) - rank(a) || a.id.localeCompare(b.id));
  const batch = todo.slice(0, LIMIT);
  console.log(`LLM facts: ${trials.length - todo.length} cached, ${todo.length} to do, running ${batch.length}`);
  if (batch.length === 0) return;

  const server = await ensureServer();
  let done = 0;
  let failed = 0;
  const t0 = Date.now();
  try {
    for (const t of batch) {
      try {
        cache[llmCacheKey(t.id, t.lastUpdated)] = await extract(t);
        await mkdir(path.dirname(LLM_CACHE_FILE), { recursive: true });
        await writeFile(LLM_CACHE_FILE, JSON.stringify(cache)); // save after every trial (resumable)
      } catch (err) {
        failed++;
        console.warn(`  ${t.id}: ${err instanceof Error ? err.message : err}`);
      }
      done++;
      const per = (Date.now() - t0) / 1000 / done;
      console.log(`  ${done}/${batch.length} ${t.id} (${per.toFixed(1)} s/trial, ~${Math.round((per * (todo.length - done)) / 60)} min left for all ${todo.length})`);
    }
  } finally {
    server?.kill();
  }
  console.log(`Done: ${done - failed} extracted, ${failed} failed. Run \`npm run ingest\` (or ingest:seed) to merge.`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err: unknown) => {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  });
}
