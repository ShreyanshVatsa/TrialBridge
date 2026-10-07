/**
 * Self-host the embedding model and ONNX Runtime WASM files (no third-party CDN at runtime).
 * - Downloads the quantized MiniLM model from Hugging Face into public/models/<model>/ (used by
 *   both ingestion in Node and the browser Web Worker).
 * - Copies the ONNX Runtime WASM build from node_modules into public/ort/.
 * Idempotent: existing files are skipped. Run: `npm run models:fetch`.
 */
import { mkdir, writeFile, copyFile, stat } from "node:fs/promises";
import path from "node:path";
import { EMBEDDING_MODEL } from "../config/embedding";

const FILES = ["config.json", "tokenizer.json", "tokenizer_config.json", "special_tokens_map.json", "onnx/model_quantized.onnx"];
const ORT_FILES = ["ort-wasm-simd-threaded.mjs", "ort-wasm-simd-threaded.wasm"];

async function exists(p: string): Promise<boolean> {
  try {
    return (await stat(p)).size > 0;
  } catch {
    return false;
  }
}

async function main(): Promise<void> {
  const dir = path.join("public/models", EMBEDDING_MODEL);
  for (const f of FILES) {
    const dest = path.join(dir, f);
    if (await exists(dest)) continue;
    const url = `https://huggingface.co/${EMBEDDING_MODEL}/resolve/main/${f}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(300_000) });
    if (!res.ok) throw new Error(`Model download failed (${res.status}): ${url}`);
    await mkdir(path.dirname(dest), { recursive: true });
    await writeFile(dest, new Uint8Array(await res.arrayBuffer()));
    console.log(`Downloaded ${f}`);
  }
  await mkdir("public/ort", { recursive: true });
  for (const f of ORT_FILES) await copyFile(path.join("node_modules/onnxruntime-web/dist", f), path.join("public/ort", f));
  console.log(`Model ready in ${dir}; ONNX Runtime WASM in public/ort`);
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
