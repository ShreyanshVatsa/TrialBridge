/**
 * Merge verified judge files into the vignette gold set: `npx tsx scripts/eval/vignettes/build-gold.ts [--second=opus-2]`.
 * Writes eval/gold/vignettes-gold-v1.json (primary-judge label per pooled pair, the second judge's label where it judged
 * the pair, `contested` where they differ), the inter-judge agreement (raw + Cohen's kappa, stratified by split), and
 * eval/gold/vignettes-review-packet-v1.md (all disagreements + a seeded random 15% of the pairs, for the owner).
 * Only vignettes the primary judge covered completely are included. Labels are LLM-judged, not clinician-reviewed.
 */
import { existsSync, writeFileSync } from "node:fs";
import { loadNational } from "../national";
import { JUDGMENTS_DIR } from "./files";
import { checkJudge, MODELS_BY_JUDGE } from "./judge-check";
import { readChunkIndex } from "./judge-packets";
import { LABELS, type Judgment, type Label } from "./judge-prompt";
import { cohensKappa, rng } from "./metrics";
import { splitOf } from "./schema";

export const GOLD_FILE = "eval/gold/vignettes-gold-v1.json";
export const REVIEW_FILE = "eval/gold/vignettes-review-packet-v1.md";
export const PRIMARY = "opus";
/** Second judge's directory: v7 uses a fresh-context Opus judge ("opus-2") on a seeded 20% vignette sample (second-sample.ts). */
export const SECOND = process.argv.find((a) => a.startsWith("--second="))?.slice(9) ?? "opus-2";

export interface GoldPair {
  /** Primary judge's label. */
  l: Label;
  /** Second judge's label, when it judged this pair. */
  s?: Label;
  /** True when the two judges differ. */
  contested?: true;
}
export interface Agreement {
  pairs: number;
  raw: number;
  kappa: number;
  /** Agreement on the coarser "relevant to patient (eligible/possibly)" vs "not" split. */
  rawRelevant: number;
  confusion: Record<string, number>;
}
export interface GoldFile {
  schema: 1;
  note: string;
  primary: string;
  second: string;
  vignettes: Record<string, Record<string, GoldPair>>;
  agreement: { all: Agreement; dev: Agreement; test: Agreement };
}

function agreement(pairs: [Label, Label][]): Agreement {
  const confusion: Record<string, number> = {};
  for (const [a, b] of pairs) confusion[`${a}>${b}`] = (confusion[`${a}>${b}`] ?? 0) + 1;
  const rel = (l: Label) => l === "eligible" || l === "possibly";
  const n = pairs.length;
  return {
    pairs: n,
    raw: n ? pairs.filter(([a, b]) => a === b).length / n : Number.NaN,
    kappa: cohensKappa(pairs.map((p) => p[0]), pairs.map((p) => p[1])),
    rawRelevant: n ? pairs.filter(([a, b]) => rel(a) === rel(b)).length / n : Number.NaN,
    confusion,
  };
}

/** Per-vignette verified labels of a judge, only for vignettes whose every chunk is valid. */
function byVignette(judge: string): Map<string, Map<string, Judgment>> {
  const { checks, labels } = checkJudge(judge);
  const chunks = readChunkIndex();
  const out = new Map<string, Map<string, Judgment>>();
  const vignettes = new Set(chunks.map((c) => c.vignette));
  for (const v of vignettes) {
    const mine = chunks.filter((c) => c.vignette === v);
    if (!mine.every((c) => checks.find((x) => x.chunk === c.id)?.status === "ok")) continue;
    const m = new Map<string, Judgment>();
    for (const c of mine) for (const j of labels.get(c.id) ?? []) m.set(j.nctId, j);
    out.set(v, m);
  }
  return out;
}

function main(): void {
  const primary = byVignette(PRIMARY);
  const second = existsSync(`${JUDGMENTS_DIR}/${SECOND}`) ? byVignette(SECOND) : new Map<string, Map<string, Judgment>>();
  const vignettes: GoldFile["vignettes"] = {};
  const pairsAll: [Label, Label][] = [];
  const pairsBy: Record<"dev" | "test", [Label, Label][]> = { dev: [], test: [] };
  const rows: { v: string; id: string; a: Judgment; b?: Judgment }[] = [];
  for (const [v, m] of [...primary].sort((x, y) => x[0].localeCompare(y[0]))) {
    const sec = second.get(v);
    vignettes[v] = {};
    for (const [id, a] of [...m].sort((x, y) => x[0].localeCompare(y[0]))) {
      const b = sec?.get(id);
      const pair: GoldPair = { l: a.label };
      if (b) {
        pair.s = b.label;
        pairsAll.push([a.label, b.label]);
        pairsBy[splitOf(v)].push([a.label, b.label]);
        if (a.label !== b.label) pair.contested = true;
      }
      vignettes[v][id] = pair;
      rows.push({ v, id, a, b });
    }
  }
  const gold: GoldFile = {
    schema: 1,
    note: `LLM-judged gold labels, NOT clinician-reviewed. l = primary judge (Claude Opus subagent), s = independent second judge (${SECOND}: ${MODELS_BY_JUDGE[SECOND] ?? SECOND}) on a stratified sample of vignettes, contested = they differ. See eval/gold/README.md.`,
    primary: PRIMARY,
    second: SECOND,
    vignettes,
    agreement: { all: agreement(pairsAll), dev: agreement(pairsBy.dev), test: agreement(pairsBy.test) },
  };
  writeFileSync(GOLD_FILE, `${JSON.stringify(gold)}\n`);

  // Review packet for the owner: all disagreements + a seeded random 15% of the remaining pairs.
  const national = loadNational();
  const rand = rng(20261012);
  const titles = (id: string) => national?.trial(id)?.card.title ?? "";
  const contested = rows.filter((r) => r.b && r.a.label !== r.b.label);
  const sample = rows.filter((r) => !(r.b && r.a.label !== r.b.label) && rand() < 0.15);
  const ev = (j: Judgment) => j.evidence.map((e) => `${e.section[0]!.toUpperCase()}${e.n} ${e.verdict}: "${e.quote}"`).join(" / ");
  const block = (r: (typeof rows)[number]) => `- ${r.v} ${r.id} ${titles(r.id).slice(0, 110)}\n  ${PRIMARY}: **${r.a.label}** - ${ev(r.a)}${r.a.note ? ` (${r.a.note})` : ""}\n${r.b ? `  ${SECOND}: **${r.b.label}** - ${ev(r.b)}${r.b.note ? ` (${r.b.note})` : ""}\n` : ""}  Owner verdict: [ ]\n`;
  const md = `# Vignette gold: owner review packet\n\nLLM-judged labels (not clinicians). Please overwrite "Owner verdict" with eligible | possibly | excluded | not_relevant where you disagree with the primary label.\nPatients are in eval/gold/vignettes-v1.json; criteria text is in the trial records (NCT id). Section 1 lists every pair where the two judges disagree (${contested.length}); section 2 is a seeded random ${Math.round(15)}% sample of the other judged pairs (${sample.length} of ${rows.length - contested.length}).\n\n## 1. Judge disagreements (${contested.length})\n\n${contested.map(block).join("\n")}\n## 2. Random 15% sample (${sample.length})\n\n${sample.map(block).join("\n")}`;
  writeFileSync(REVIEW_FILE, md);
  const cnt = Object.fromEntries(LABELS.map((l) => [l, rows.filter((r) => r.a.label === l).length]));
  console.log(`gold: ${Object.keys(vignettes).length} vignettes, ${rows.length} pairs`, cnt);
  const fmt = (a: Agreement) => `${a.pairs} pairs, raw ${a.raw.toFixed(3)}, kappa ${a.kappa.toFixed(3)}, relevant-vs-not ${a.rawRelevant.toFixed(3)}`;
  console.log("agreement all:", fmt(gold.agreement.all), "| dev:", fmt(gold.agreement.dev), "| test:", fmt(gold.agreement.test));
  console.log(`review packet: ${contested.length} contested + ${sample.length} sampled`);
}

if (process.argv[1]?.endsWith("build-gold.ts")) main();
