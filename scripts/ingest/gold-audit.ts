/**
 * Independent re-audit of the LLM-written gold-v1/v2 labels (v5 plan, Phase 1 "re-audit the fact gold set").
 *
 *   npx tsx scripts/ingest/gold-audit.ts --sample [--n=150]   draw rows, write blind audit packets (.work/gold-audit/)
 *   npx tsx scripts/ingest/gold-audit.ts --score               compare the re-labels with the original rows
 *
 * Sampling: directional rows (not ambiguous / not_stated) of gold-v1 + gold-v2, at most one per (trial, family), shuffled
 * with a fixed-seed LCG. The auditor sees only the trial's criteria text, the family name and the original schema
 * definitions, never the original row. Agreement = same value; strict agreement also needs the same scope.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { loadCards } from "./cards";
import type { GoldLabel, GoldTrial } from "../../lib/ingest/gold";

const OUT = ".work/gold-audit";
const RESULT = "eval/gold/gold-audit-v5.json";
const args = new Map(process.argv.slice(2).map((a) => a.replace(/^--/, "").split("=") as [string, string | undefined]));

interface AuditItem { item: number; trial_id: string; family: string; original: GoldLabel }

function rows(): AuditItem[] {
  const all: AuditItem[] = [];
  const seen = new Set<string>();
  for (const f of ["eval/gold/gold-v1.json", "eval/gold/gold-v2.json"]) {
    for (const t of (JSON.parse(readFileSync(f, "utf8")) as { trials: GoldTrial[] }).trials) {
      for (const l of t.labels) {
        if (l.value === "ambiguous" || l.value === "not_stated") continue;
        const k = `${t.trial_id}|${l.family}`;
        if (seen.has(k)) continue;
        seen.add(k);
        all.push({ item: 0, trial_id: t.trial_id, family: l.family, original: l });
      }
    }
  }
  return all.sort((a, b) => `${a.trial_id}|${a.family}`.localeCompare(`${b.trial_id}|${b.family}`));
}

function sample(): void {
  const n = Number(args.get("n") ?? 150);
  const pool = rows();
  let s = 20261012;
  const r = () => (s = (Math.imul(s, 1103515245) + 12345) >>> 0) / 2 ** 32;
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [pool[i], pool[j]] = [pool[j] as AuditItem, pool[i] as AuditItem];
  }
  const picked = pool.slice(0, n).sort((a, b) => a.trial_id.localeCompare(b.trial_id) || a.family.localeCompare(b.family)).map((x, i) => ({ ...x, item: i + 1 }));
  const cards = new Map(loadCards().map((c) => [c.id, c]));
  mkdirSync(OUT, { recursive: true });
  writeFileSync(`${OUT}/items.json`, `${JSON.stringify(picked, null, 1)}\n`);
  const half = Math.ceil(picked.length / 2);
  for (const [k, part] of [picked.slice(0, half), picked.slice(half)].entries()) {
    const byTrial = new Map<string, AuditItem[]>();
    for (const it of part) byTrial.set(it.trial_id, [...(byTrial.get(it.trial_id) ?? []), it]);
    const blocks: string[] = [];
    for (const [id, items] of byTrial) {
      const c = cards.get(id);
      if (!c) continue;
      blocks.push([`## ${id}`, `Title: ${c.title}`, `Conditions: ${c.conditions.join("; ")}`, `ITEMS TO LABEL: ${items.map((i) => `#${i.item} family=${i.family}`).join(", ")}`, "Inclusion criteria:", ...c.inclusion.map((x) => `I${x.n}: ${x.text}`), "Exclusion criteria:", ...c.exclusion.map((x) => `E${x.n}: ${x.text}`)].join("\n"));
    }
    writeFileSync(`${OUT}/audit-${k + 1}.md`, `# Audit packet ${k + 1} (${part.length} items)\n\n${blocks.join("\n\n")}\n`);
  }
  console.log(`sampled ${picked.length} of ${pool.length} directional rows`);
}

function score(): void {
  const items = JSON.parse(readFileSync(`${OUT}/items.json`, "utf8")) as AuditItem[];
  const re = new Map<number, { value: string; scope?: string | null; param?: unknown; quote?: string }>();
  for (const k of [1, 2]) {
    const f = `${OUT}/audit-${k}.json`;
    if (!existsSync(f)) continue;
    for (const x of (JSON.parse(readFileSync(f, "utf8")) as { items: ({ item: number } & { value: string; scope?: string | null })[] }).items) re.set(x.item, x);
  }
  const fam = new Map<string, { n: number; agree: number; strict: number }>();
  const disagreements: unknown[] = [];
  let n = 0;
  let agree = 0;
  let strict = 0;
  for (const it of items) {
    const r = re.get(it.item);
    if (!r) continue;
    n++;
    const a = r.value === it.original.value;
    const st = a && String(r.scope ?? "") === String(it.original.scope ?? "");
    if (a) agree++;
    if (st) strict++;
    const e = fam.get(it.family) ?? { n: 0, agree: 0, strict: 0 };
    e.n++;
    if (a) e.agree++;
    if (st) e.strict++;
    fam.set(it.family, e);
    if (!a) disagreements.push({ item: it.item, trial_id: it.trial_id, family: it.family, original: { value: it.original.value, scope: it.original.scope, param: it.original.param, quote: it.original.quote }, audit: r });
  }
  const out = {
    note: "Blind re-audit of gold-v1/v2 rows by an independent AI labeler (claude-opus subagent; same model family as the original labeler, different run, blind to the original rows). Not clinicians.",
    sampled: items.length,
    judged: n,
    value_agreement: Number((agree / n).toFixed(3)),
    value_and_scope_agreement: Number((strict / n).toFixed(3)),
    per_family: Object.fromEntries([...fam].map(([k, v]) => [k, { n: v.n, value_agreement: Number((v.agree / v.n).toFixed(3)) }])),
    disagreements,
  };
  writeFileSync(RESULT, `${JSON.stringify(out, null, 1)}\n`);
  console.log(`judged ${n}/${items.length}: value agreement ${(100 * agree / n).toFixed(1)}%, value+scope ${(100 * strict / n).toFixed(1)}%`);
  for (const [k, v] of fam) console.log(`  ${k.padEnd(22)} ${v.agree}/${v.n}`);
}

if (args.has("sample")) sample();
else if (args.has("score")) score();
else console.log("Use --sample or --score");
