/**
 * `npm run i18n:translate -- <tag> [--provider=local|groq|cerebras|openrouter] [--all-missing] [--force] [--limit=N]`
 * QUESTIONNAIRE_SPEC.md section 6.8. Translates the English keys missing from (or stale in)
 * public/i18n/<tag>.json with a local llama-server (default; ~/models/Qwen3-14B-Q4_K_M.gguf, started
 * and stopped here if not already running) or a configured provider whose data terms are verified.
 * UI strings contain no user data. Never overwrites keys listed in i18n/reviewed/<tag>.keys.json.
 */
import { spawn, type ChildProcess } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import { en } from "../../components/i18n/en";
import { getLocale, LOCALES } from "../../config/locales";
import { AI_PROVIDERS } from "../../config/ai-providers";
import { flatten, hashText, type FlatMessages } from "../../lib/i18n/keys";
import { manifestEntry, type Manifest } from "../../lib/i18n/manifest";
import { missingPluralForms, targetKeys, translateKeys, type Glossary, type LlmConfig } from "../../lib/i18n/translate-core";

const SLOTS = Number(process.env.I18N_SLOTS ?? 4);
const ROOT = path.resolve(import.meta.dirname, "../..");
const read = <T>(p: string, fallback: T): T => {
  try {
    return JSON.parse(readFileSync(path.join(ROOT, p), "utf8")) as T;
  } catch {
    return fallback;
  }
};
const write = (p: string, v: unknown) => {
  mkdirSync(path.dirname(path.join(ROOT, p)), { recursive: true });
  writeFileSync(path.join(ROOT, p), JSON.stringify(v, null, 1) + "\n");
};

interface State {
  /** hash of the English source text each key was translated from */
  hashes: Record<string, string>;
}

export function writeManifest(): Manifest {
  const enFlat = flatten(en);
  const old = read<Manifest>("public/i18n/manifest.json", { version: 1, source: "en", locales: {} });
  const locales: Manifest["locales"] = {};
  for (const def of LOCALES) {
    const file = `public/i18n/${def.tag}.json`;
    const flat = def.tag === "en" ? enFlat : existsSync(path.join(ROOT, file)) ? read<FlatMessages>(file, {}) : null;
    if (!flat) continue;
    const reviewedKeys = read<string[]>(`i18n/reviewed/${def.tag}.keys.json`, []);
    const prev = old.locales[def.tag];
    const entry = manifestEntry(enFlat, flat, { tag: def.tag, baseStatus: def.baseStatus, reviewedKeys, updated: prev?.updated ?? new Date().toISOString().slice(0, 10) });
    // Keep the previous "updated" date unless something changed.
    locales[def.tag] = prev && prev.sourceHash === entry.sourceHash && prev.coverage === entry.coverage && prev.status === entry.status ? prev : { ...entry, updated: new Date().toISOString().slice(0, 10) };
  }
  const manifest: Manifest = { version: 1, source: "en", locales };
  write("public/i18n/manifest.json", manifest);
  return manifest;
}

async function freePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const s = net.createServer();
    s.listen(0, "127.0.0.1", () => {
      const p = (s.address() as net.AddressInfo).port;
      s.close(() => resolve(p));
    });
    s.on("error", reject);
  });
}

async function healthy(base: string): Promise<boolean> {
  try {
    return (await fetch(`${base}/health`, { signal: AbortSignal.timeout(2000) })).ok;
  } catch {
    return false;
  }
}

async function ensureLocalServer(): Promise<{ cfg: LlmConfig; stop: () => void }> {
  const env = process.env.LLM_BASE_URL;
  if (env && (await healthy(env.replace(/\/v1$/, "")))) return { cfg: { baseUrl: `${env.replace(/\/v1$/, "")}/v1`, model: "local" }, stop: () => {} };
  const model = process.env.LLM_MODEL_PATH ?? path.join(os.homedir(), "models/Qwen3-14B-Q4_K_M.gguf");
  const port = await freePort();
  const base = `http://127.0.0.1:${port}`;
  console.log(`Starting llama-server on :${port} with ${model} ...`);
  const child: ChildProcess = spawn("llama-server", ["-m", model, "--port", String(port), "--host", "127.0.0.1", "-c", String(8192 * SLOTS), "-ngl", "99", "--jinja", "-np", String(SLOTS)], { stdio: "ignore" });
  for (let i = 0; i < 240; i++) {
    if (await healthy(base)) return { cfg: { baseUrl: `${base}/v1`, model: "local", concurrency: SLOTS }, stop: () => child.kill() };
    await new Promise((r) => setTimeout(r, 1000));
  }
  child.kill();
  throw new Error("llama-server did not become healthy within 240 s");
}

function providerConfig(name: string): LlmConfig {
  const p = AI_PROVIDERS.find((x) => x.name === name);
  if (!p) throw new Error(`Unknown provider ${name}`);
  if (!p.dataTermsVerified) throw new Error(`Provider ${name}: dataTermsVerified is false in config/ai-providers.ts`);
  const key = process.env[p.keyEnv];
  if (!key) throw new Error(`Provider ${name}: ${p.keyEnv} is not set`);
  return { baseUrl: p.baseUrl, model: p.model, apiKey: key };
}

async function main() {
  const argv = process.argv.slice(2);
  const flags = new Map(argv.filter((a) => a.startsWith("--")).map((a) => a.replace(/^--/, "").split("=") as [string, string | undefined]));
  const tags = argv.filter((a) => !a.startsWith("--"));
  if (flags.has("manifest")) {
    writeManifest();
    return;
  }
  const targets = flags.has("all-missing") && tags.length === 0 ? LOCALES.filter((l) => l.tag !== "en" && !["es", "pt", "ht"].includes(l.tag) && existsSync(path.join(ROOT, `public/i18n/${l.tag}.json`))).map((l) => l.tag) : tags;
  if (targets.length === 0) throw new Error("Usage: npm run i18n:translate -- <tag> [--provider=local|groq|cerebras|openrouter] [--all-missing] [--force] [--limit=N]");
  const provider = flags.get("provider") ?? "local";
  const server = provider === "local" ? await ensureLocalServer() : { cfg: providerConfig(provider), stop: () => {} };
  const enFlat = flatten(en);
  try {
    for (const tag of targets) {
      const def = getLocale(tag);
      if (!def || tag === "en") throw new Error(`Unknown or source locale: ${tag}`);
      const file = `public/i18n/${tag}.json`;
      const current = read<FlatMessages>(file, {});
      const state = read<State>(`i18n/state/${tag}.json`, { hashes: {} });
      const reviewed = new Set(read<string[]>(`i18n/reviewed/${tag}.keys.json`, []));
      const glossary = read<Glossary>(`i18n/glossary/${tag}.json`, {});
      const want = targetKeys(tag, enFlat);
      // Keys never seen by this workflow (e.g. migrated es/pt/ht) are taken as in sync with the current English.
      for (const k of Object.keys(current)) if (!(k in state.hashes) && k in want) state.hashes[k] = hashText(want[k]!);
      const todo: FlatMessages = {};
      for (const [k, v] of Object.entries(want)) {
        if (reviewed.has(k)) continue;
        const stale = flags.has("force") || (k in current && state.hashes[k] !== hashText(v));
        if (!(k in current) || !current[k] || stale) todo[k] = v;
      }
      const limit = flags.has("limit") ? Number(flags.get("limit")) : Infinity;
      const keys = Object.keys(todo).slice(0, limit);
      const subset = Object.fromEntries(keys.map((k) => [k, todo[k]!]));
      console.log(`[${tag}] ${keys.length} keys to translate (${Object.keys(current).length} existing)`);
      const t0 = Date.now();
      const { accepted, rejected } = keys.length
        ? await translateKeys(subset, server.cfg, { tag, languageName: def.englishName, glossary }, (d, t) => process.stdout.write(`\r[${tag}] ${d}/${t}`))
        : { accepted: {}, rejected: {} };
      if (keys.length) console.log(`\n[${tag}] accepted ${Object.keys(accepted).length}, rejected ${Object.keys(rejected).length} in ${Math.round((Date.now() - t0) / 1000)} s`);
      const merged: FlatMessages = {};
      for (const k of Object.keys(want)) {
        const v = accepted[k] ?? (k in todo ? undefined : current[k]);
        if (v) merged[k] = v;
        if (accepted[k]) state.hashes[k] = hashText(want[k]!);
      }
      for (const k of Object.keys(state.hashes)) if (!(k in want)) delete state.hashes[k];
      const plural = missingPluralForms(tag, merged, enFlat);
      if (plural.length) console.warn(`[${tag}] missing plural forms: ${plural.join(", ")}`);
      if (Object.keys(rejected).length) console.warn(`[${tag}] rejected:`, rejected);
      write(file, merged);
      write(`i18n/state/${tag}.json`, state);
      writeManifest();
    }
  } finally {
    server.stop();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

