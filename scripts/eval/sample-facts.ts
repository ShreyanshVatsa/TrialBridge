/** Draw a deterministic sample of 50 rule-layer facts (non-"mentioned") for hand labeling. */
import { loadSeedCards, loadZip } from "./common";

const { cards } = loadSeedCards(loadZip());
const all = cards.flatMap((c) => c.facts.filter((f) => f.value !== "mentioned" && f.source === "rule").map((f) => ({ id: c.id, key: f.key, value: f.value, ref: `${f.ref.section[0]?.toUpperCase()}${f.ref.n}`, quote: f.quote })));
let seed = 20261006;
const rand = () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
const picked = new Set<number>();
while (picked.size < 50) picked.add(Math.floor(rand() * all.length));
const sample = [...picked].sort((a, b) => a - b).map((i) => all[i]);
if (process.argv.includes("--json")) console.log(JSON.stringify(sample));
else sample.forEach((f, i) => console.log(`${i + 1}. ${f?.key}=${f?.value} [${f?.ref}] ${f?.quote.replace(/\s+/g, " ").slice(0, 230)}`));
