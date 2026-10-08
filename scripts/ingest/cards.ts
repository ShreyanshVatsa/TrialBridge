/**
 * Load rule-layer trial cards straight from the cached ClinicalTrials.gov pages (national) or the committed
 * seed, without writing anything. Shared by fact-precision.ts, llm.ts and llm-eval.ts.
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { RawStudySchema } from "../../lib/ingest/raw";
import { buildRecord } from "../../lib/ingest/record";
import type { TrialCard } from "../../lib/types/trial";

export const NATIONAL_CACHE = "data/cache/national";

export function loadCards(source: "national" | "seed" = "national"): TrialCard[] {
  const raws: unknown[] =
    source === "seed"
      ? (JSON.parse(readFileSync("data/seed/studies.json", "utf8")) as { studies: unknown[] }).studies
      : readdirSync(NATIONAL_CACHE).filter((f) => f.startsWith("page-")).sort().flatMap((f) => JSON.parse(readFileSync(path.join(NATIONAL_CACHE, f), "utf8")) as unknown[]);
  const seen = new Set<string>();
  const cards: TrialCard[] = [];
  for (const s of raws) {
    const raw = RawStudySchema.safeParse(s);
    if (!raw.success) continue;
    const r = buildRecord(raw.data);
    if (!r.ok || seen.has(r.card.id)) continue;
    seen.add(r.card.id);
    cards.push(r.card);
  }
  return cards.sort((a, b) => a.id.localeCompare(b.id));
}
