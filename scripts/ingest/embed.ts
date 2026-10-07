/**
 * Node-side embeddings with Transformers.js, using the self-hosted model in public/models
 * (identical weights to the browser). Results are cached on disk by key
 * (NCT ID | last-updated | model) so unchanged trials are never re-embedded.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { pipeline, env } from "@huggingface/transformers";
import { EMBEDDING_DIMS, EMBEDDING_DTYPE, EMBEDDING_MODEL } from "../../config/embedding";

const CACHE_FILE = "data/cache/embeddings.json";
const BATCH = 32;

export async function embedTexts(items: { key: string; text: string }[]): Promise<Float32Array[]> {
  let cache: Record<string, number[]> = {};
  try {
    cache = JSON.parse(await readFile(CACHE_FILE, "utf8")) as Record<string, number[]>;
  } catch {
    /* empty cache */
  }
  // Longest texts last: batches of similar length waste far less compute on padding.
  const todo = items.filter((i) => !cache[i.key]).sort((a, b) => a.text.length - b.text.length);
  if (todo.length) {
    env.localModelPath = path.resolve("public/models") + "/";
    env.allowRemoteModels = false;
    const extractor = await pipeline("feature-extraction", EMBEDDING_MODEL, { dtype: EMBEDDING_DTYPE });
    const t0 = Date.now();
    for (let i = 0; i < todo.length; i += BATCH) {
      const batch = todo.slice(i, i + BATCH);
      const out = await extractor(batch.map((b) => b.text), { pooling: "mean", normalize: true });
      const data = out.data as Float32Array;
      batch.forEach((b, j) => {
        // Round to 5 decimals to keep the cache compact; int8 quantization happens later anyway.
        cache[b.key] = Array.from(data.subarray(j * EMBEDDING_DIMS, (j + 1) * EMBEDDING_DIMS), (v) => Math.round(v * 1e5) / 1e5);
      });
      const done = Math.min(i + BATCH, todo.length);
      const rate = done / ((Date.now() - t0) / 1000);
      process.stdout.write(`\r  embedded ${done}/${todo.length} (${rate.toFixed(1)}/s, ~${Math.round((todo.length - done) / rate)}s left)   `);
    }
    process.stdout.write("\n");
    await mkdir(path.dirname(CACHE_FILE), { recursive: true });
    await writeFile(CACHE_FILE, JSON.stringify(cache));
  } else {
    console.log("  embeddings: all cached");
  }
  return items.map((i) => Float32Array.from(cache[i.key] as number[]));
}
