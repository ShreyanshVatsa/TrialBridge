/**
 * postbuild (after `next build` writes ./out):
 * 1. Externalize inline <script> blocks into /_inline/<sha256>.js so the CSP needs no
 *    'unsafe-inline' or per-page hashes. Order and parser-blocking semantics are preserved.
 * 2. Fail if any inline event handler attributes exist (blocked by CSP anyway).
 * 3. Secret scan: fail if anything that looks like an API key or secret is in the build output.
 * 4. Remove ONNX Runtime .wasm copies the bundler emits into _next/static/media: the worker loads
 *    the runtime from /ort/ (explicit wasmPaths), and the bundler's asyncify copy exceeds
 *    Cloudflare's 25 MiB per-asset limit.
 */
import { readdir, readFile, writeFile, mkdir, stat, rm } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";

const OUT = "out";
const INLINE_DIR = path.join(OUT, "_inline");
const SECRET_PATTERNS: [string, RegExp][] = [
  ["Groq key", /gsk_[A-Za-z0-9]{20,}/],
  ["Cerebras key", /csk-[A-Za-z0-9]{20,}/],
  ["OpenRouter key", /sk-or-v1-[A-Za-z0-9]{20,}/],
  ["OpenAI-style key", /\bsk-[A-Za-z0-9]{32,}/],
  ["Private key", /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ["Turnstile secret (non-test)", /0x4AAAAAAA[A-Za-z0-9_-]{20,}/],
  ["Cloudflare API token var", /CLOUDFLARE_API_TOKEN\s*[:=]\s*["'][^"']+/],
];
const TEXT_EXT = new Set([".html", ".js", ".mjs", ".css", ".json", ".txt", ".map", ".webmanifest", ".xml"]);

async function* walk(dir: string): AsyncGenerator<string> {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

async function main(): Promise<void> {
  await mkdir(INLINE_DIR, { recursive: true });
  const mediaDir = path.join(OUT, "_next/static/media");
  for (const f of await readdir(mediaDir).catch(() => [] as string[])) {
    // Raw worker source copies (*.ts) are emitted alongside the compiled worker chunk; not needed.
    if (/^ort-wasm.*\.wasm$/.test(f) || /\.tsx?$/.test(f)) {
      await rm(path.join(mediaDir, f));
      console.log(`postbuild: removed bundler copy ${f} (runtime served from /ort/)`);
    }
  }
  let externalized = 0;
  const problems: string[] = [];
  for await (const file of walk(OUT)) {
    const ext = path.extname(file);
    if (ext === ".html") {
      let html = await readFile(file, "utf8");
      html = await replaceAsync(html, /<script(\s[^>]*)?>([\s\S]*?)<\/script>/gi, async (whole, attrs = "", body) => {
        if (/\ssrc=/i.test(attrs) || !body.trim()) return whole;
        const type = /\stype=["']?([^"'\s>]+)/i.exec(attrs)?.[1];
        if (type && !/^(text\/javascript|module|application\/javascript)$/i.test(type)) return whole; // data blocks (JSON) are not executed
        const hash = createHash("sha256").update(body).digest("hex").slice(0, 20);
        await writeFile(path.join(INLINE_DIR, `${hash}.js`), body);
        externalized++;
        return `<script${attrs} src="/_inline/${hash}.js"></script>`;
      });
      if (/\son[a-z]+=["']/i.test(html.replace(/<script[\s\S]*?<\/script>/gi, ""))) problems.push(`inline event handler in ${file}`);
      await writeFile(file, html);
    }
    if (TEXT_EXT.has(ext) && (await stat(file)).size < 20_000_000 && !file.startsWith(path.join(OUT, "data"))) {
      const text = await readFile(file, "utf8");
      for (const [name, re] of SECRET_PATTERNS) if (re.test(text)) problems.push(`possible ${name} in ${file}`);
    }
  }
  if (problems.length) {
    console.error(`postbuild FAILED:\n  ${problems.join("\n  ")}`);
    process.exit(1);
  }
  console.log(`postbuild: externalized ${externalized} inline scripts; secret scan clean`);
}

async function replaceAsync(s: string, re: RegExp, fn: (...m: string[]) => Promise<string>): Promise<string> {
  const parts: Promise<string>[] = [];
  let last = 0;
  for (const m of s.matchAll(re)) {
    parts.push(Promise.resolve(s.slice(last, m.index)));
    parts.push(fn(...(m as unknown as string[])));
    last = (m.index ?? 0) + m[0].length;
  }
  parts.push(Promise.resolve(s.slice(last)));
  return (await Promise.all(parts)).join("");
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
