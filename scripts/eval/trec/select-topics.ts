/**
 * Write eval/trec/topics-cancer.json from the downloaded TREC CT 2021/2022 topic files.
 *
 * The cancer-topic list below was made by reading every one of the 125 topics (see eval/trec/README.md for the
 * borderline cases that were excluded). `npx tsx scripts/eval/trec/select-topics.ts`
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { TREC_CACHE_DIR, TREC_EVAL_DIR } from "./paths";

/** Hand-curated: topics whose patient description names (or describes unambiguously) a malignancy. */
export const CANCER_TOPIC_IDS: Record<2021 | 2022, number[]> = {
  2021: [1, 4, 8, 11, 13, 15, 17, 25, 31, 61],
  2022: [6, 11],
};

export interface TrecTopicText {
  year: 2021 | 2022;
  topicId: number;
  text: string;
}

const decode = (s: string): string =>
  s.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&apos;/g, "'").replace(/&amp;/g, "&");

/** Parse a TREC CT topics file (`<topics><topic number="N">text</topic>...`) into (id, text) pairs. */
export function parseTopicsXml(xml: string): Map<number, string> {
  const out = new Map<number, string>();
  const re = /<topic number="(\d+)">([\s\S]*?)<\/topic>/g;
  for (let m = re.exec(xml); m; m = re.exec(xml)) {
    const id = Number(m[1]);
    const text = decode((m[2] ?? "").replace(/\r\n?/g, "\n"))
      .split("\n")
      .map((l) => l.trimEnd())
      .join("\n")
      .trim();
    out.set(id, text);
  }
  return out;
}

export function selectCancerTopics(cacheDir = TREC_CACHE_DIR): TrecTopicText[] {
  const out: TrecTopicText[] = [];
  for (const year of [2021, 2022] as const) {
    const topics = parseTopicsXml(readFileSync(path.join(cacheDir, `topics${year}.xml`), "utf8"));
    for (const topicId of CANCER_TOPIC_IDS[year]) {
      const text = topics.get(topicId);
      if (!text) throw new Error(`topic ${year}-${topicId} not found in topics${year}.xml`);
      out.push({ year, topicId, text });
    }
  }
  return out;
}

if (process.argv[1] && /select-topics\.ts$/.test(process.argv[1])) {
  const topics = selectCancerTopics();
  const file = path.join(TREC_EVAL_DIR, "topics-cancer.json");
  writeFileSync(file, `${JSON.stringify(topics, null, 2)}\n`);
  console.log(`wrote ${topics.length} cancer topics to ${file}`);
}
