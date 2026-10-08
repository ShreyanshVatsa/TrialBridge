/**
 * `npm run local`: run the whole app locally with one command.
 *   --check      print what would be done, do nothing
 *   --rebuild    force `npm run build`
 *   --open       open the browser (macOS `open`) when the server is ready
 *   --port=N     wrangler port (default 8787)
 *   --mode=national|seed  (set by `npm run local:national` / `npm run local:seed`)
 */
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { spawn, spawnSync, type ChildProcess } from "node:child_process";
import net from "node:net";
import path from "node:path";
import { AI_PROVIDERS } from "../config/ai-providers";
import { printSelfCheck, runSelfCheck } from "./local-check";
import { aiMode, nodeOk, parseEnvFile, planLocal, type LocalMode, type LocalState } from "./local-plan";

const argv = process.argv.slice(2);
const flag = (n: string) => argv.includes(`--${n}`);
const opt = (n: string) => argv.find((a) => a.startsWith(`--${n}=`))?.split("=")[1];
const check = flag("check");
const mode = (opt("mode") ?? "default") as LocalMode;
const port = Number(opt("port") ?? 8787);

const say = (m = "") => console.log(m);
function die(msg: string, hint?: string, code = 1): never {
  console.error(`\nlocal: ${msg}${hint ? `\n  -> ${hint}` : ""}`);
  process.exit(code);
}

const MODEL_FILES = ["public/models/Xenova/all-MiniLM-L6-v2/onnx/model_quantized.onnx", "public/ort/ort-wasm-simd-threaded.wasm"];
const DEV_VARS_TEMPLATE = `# Local secrets for \`wrangler dev\`. Gitignored. Paste values yourself; never share them in chat.
# Leave empty to use the mock AI provider.
GROQ_API_KEY=
CEREBRAS_API_KEY=
OPENROUTER_API_KEY=
TURNSTILE_SECRET_KEY=
RATE_LIMIT_SALT=
`;

const mtime = (p: string): number | null => {
  try { return statSync(p).mtimeMs; } catch { return null; }
};

/** Newest mtime under the given paths, skipping bulky generated dirs (data shards are covered by meta.json). */
function newestMtime(paths: string[]): number | null {
  const skip = new Set(["node_modules", ".next", "data", "models", "ort", "fonts", "shards"]);
  let newest: number | null = null;
  const walk = (p: string, top: boolean) => {
    let st;
    try { st = statSync(p); } catch { return; }
    if (st.isDirectory()) {
      if (!top && skip.has(path.basename(p))) return;
      for (const e of readdirSync(p)) walk(path.join(p, e), false);
    } else if (newest === null || st.mtimeMs > newest) newest = st.mtimeMs;
  };
  for (const p of paths) walk(p, true);
  return newest;
}

function readDataVersion(): string | null {
  try {
    const v = (JSON.parse(readFileSync("public/data/meta.json", "utf8")) as { dataVersion?: unknown }).dataVersion;
    return typeof v === "string" ? v : null;
  } catch { return null; }
}

function gather(): LocalState {
  const srcs = ["app", "components", "lib", "config", "content", "public", "next.config.ts", "package.json", "postcss.config.mjs", "scripts/postbuild.ts", "scripts/sw-build.ts"];
  const times = [newestMtime(srcs), mtime("public/data/meta.json"), mtime("data/build/criteria.sql")].filter((t): t is number => t !== null);
  return {
    mode, rebuild: flag("rebuild"),
    modelFilesPresent: MODEL_FILES.every(existsSync),
    dataVersion: readDataVersion(),
    criteriaSqlPresent: existsSync("data/build/criteria.sql"),
    devVarsPresent: existsSync(".dev.vars"),
    buildMtimeMs: mtime("out/index.html"),
    newestSourceMtimeMs: times.length ? Math.max(...times) : null,
  };
}

function runStep(label: string, cmd: string, args: string[]) {
  say(`\n> ${label}`);
  const r = spawnSync(cmd, args, { stdio: "inherit" });
  if (r.status !== 0) die(`step failed: ${label}`, `run "${cmd} ${args.join(" ")}" on its own to see the details`, r.status ?? 1);
}

const portBusy = (p: number) =>
  new Promise<boolean>((resolve) => {
    const s = net.connect({ port: p, host: "127.0.0.1" });
    s.once("connect", () => { s.destroy(); resolve(true); });
    s.once("error", () => resolve(false));
  });

async function main() {
  say("TrialBridge: local setup");
  // (1) environment
  if (!nodeOk(process.versions.node)) die(`Node ${process.versions.node} is too old (need >= 22).`, "install Node 22 or newer (https://nodejs.org) and retry");
  if (!existsSync("node_modules/.bin/wrangler") || !existsSync("node_modules/next")) die("dependencies are not installed.", "run: npm install   (then npm run local)");
  if (!existsSync("package.json") || !existsSync("scripts/ingest/index.ts")) die("run this from the TrialBridge project root.");

  const state = gather();
  const plan = planLocal(state);
  const env = existsSync(".dev.vars") ? parseEnvFile(readFileSync(".dev.vars", "utf8")) : {};
  const ai = aiMode(AI_PROVIDERS, env);

  say(`Node ${process.versions.node} ok, dependencies installed`);
  say(`Data: ${state.dataVersion ?? "none"}${plan.ingest ? ` -> will run ${plan.ingest} ingest` : " (kept as is)"}`);
  say(`AI: ${ai.mode === "mock" ? "mock provider (no usable API keys; works fully offline)" : `real provider(s): ${ai.providers.join(", ")}`}`);
  say(`Plan: ${[plan.fetchModels && "fetch models", plan.ingest && `${plan.ingest} ingest`, plan.createDevVars && "create .dev.vars", plan.build ? "build" : "skip build", "preview"].filter(Boolean).join(", ")}`);
  if (plan.reasons.length) say(`Why: ${plan.reasons.join("; ")}`);
  if (check) {
    say(`\n--check: nothing was run. URL would be http://localhost:${port}`);
    return;
  }
  if (await portBusy(port)) die(`port ${port} is already in use.`, `stop the other process or use: npm run local -- --port=${port + 1}`);

  // (2) models, (3) data, (4) .dev.vars
  if (plan.fetchModels) runStep("Fetching embedding model + ONNX runtime (one-time)", "npm", ["run", "models:fetch"]);
  if (plan.ingest === "seed") runStep("Building the seed dataset", "npm", ["run", "ingest:seed"]);
  let usedSeed = plan.ingest === "seed";
  if (plan.ingest === "national") {
    say("\n> National ingest (all US cancer trials; resumable, the first run downloads from ClinicalTrials.gov and takes a few minutes)");
    const r = spawnSync("npm", ["run", "ingest"], { stdio: "inherit" });
    if (r.status !== 0) {
      if (state.dataVersion === null) {
        say("\nThe national download failed (offline?). Falling back to the small seed dataset so the app still works.");
        runStep("Building the seed dataset", "npm", ["run", "ingest:seed"]);
        usedSeed = true;
      } else {
        say("\nThe national download failed; keeping the data already on this computer. Run `npm run local` again when online.");
      }
    }
  }
  if (plan.createDevVars) {
    writeFileSync(".dev.vars", DEV_VARS_TEMPLATE, { flag: "wx" });
    say("\nCreated .dev.vars with empty entries (mock AI provider). Paste API keys there yourself if you want real AI.");
  }
  if (usedSeed) {
    say("\nNote: this is the small seed dataset. Run `npm run ingest` (resumable, ~12 s when cached, longer the first time) for all ~5,700 national cancer trials, then `npm run local` again.");
  }

  // (5) build under no lock here: callers coordinating shared machines hold their own lock around this script.
  if (plan.build) runStep("Building (npm run build)", "npm", ["run", "build"]);

  // (6) preview
  say(`\n> Starting preview on port ${port} (Ctrl+C to stop)`);
  const child: ChildProcess = spawn("npm", ["run", "preview", "--", "--port", String(port)], { stdio: ["ignore", "pipe", "pipe"], detached: true });
  let announced = false;
  let stopping = false;
  const announce = () => {
    if (announced) return;
    announced = true;
    const url = `http://localhost:${port}`;
    say(`\n=== TrialBridge is running at ${url} ===`);
    say("Available offline: guided questionnaire, private in-browser matching on the dataset above, trial pages,");
    say("Access Intelligence, saved print views, PWA install, 18-language UI (machine-translated), mock AI analysis / Trial Q&A.");
    say("Needs internet or keys only for: real AI providers, live ClinicalTrials.gov refresh (npm run ingest).\n");
    void runSelfCheck(url).then((c) => {
      printSelfCheck(c);
      if (!c.ok) {
        console.error("The server is running but a check failed, so the browser was NOT opened. See the FAIL lines above.");
        return;
      }
      if (flag("open") && !flag("no-open")) spawn("open", [url], { stdio: "ignore", detached: true }).unref();
    });
  };
  const onData = (buf: Buffer) => {
    const text = buf.toString();
    process.stdout.write(text);
    if (/Ready on|Listening on|\[wrangler:info\] Ready/i.test(text)) announce();
  };
  child.stdout?.on("data", onData);
  child.stderr?.on("data", onData);
  const stop = (code: number) => {
    if (stopping) return;
    stopping = true;
    say("\nStopping...");
    try { process.kill(-child.pid!, "SIGTERM"); } catch { /* already gone */ }
    setTimeout(() => { try { process.kill(-child.pid!, "SIGKILL"); } catch { /* gone */ } process.exit(code); }, 4000).unref();
  };
  process.on("SIGINT", () => stop(130));
  process.on("SIGTERM", () => stop(143));
  child.on("exit", (code, sig) => {
    if (stopping) process.exit(process.exitCode ?? 130);
    die(`preview exited (${sig ?? code}).`, "check the output above; common causes: port in use, or a missing build (try --rebuild)", code ?? 1);
  });
}

main().catch((e) => die(e instanceof Error ? e.message : String(e)));
