/**
 * Ingestion pipeline: `npm run ingest` (national, resumable) or `npm run ingest:seed` (committed seed).
 *
 * fetch/load -> zod-validate -> build cards (groups, barriers, rule facts) -> embeddings (int8)
 * -> shards (cards, sites, MiniSearch index, embeddings per cancer group) -> ZIP tables
 * -> validate -> atomically replace public/data, and write the backend's criteria copy (data/build).
 *
 * Safety: aborts (keeping the last good dataset) if >5% of records fail validation or the trial
 * count drops >40% versus the previous dataset of the same source.
 */
import { mkdir, readFile, writeFile, rm, rename, stat, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { gzipSync } from "node:zlib";
import path from "node:path";
import MiniSearch from "minisearch";
import { RawStudySchema } from "../../lib/ingest/raw";
import { buildRecord, embeddingText } from "../../lib/ingest/record";
import { MINISEARCH_OPTIONS, toSearchDoc, type SearchDoc } from "../../lib/match/minisearch-config";
import { ManifestSchema, MetaSchema, type Manifest, type Meta, type ShardInfo, type Site, type TrialCard } from "../../lib/types/trial";
import { CANCER_GROUP_IDS, type CancerGroupId } from "../../config/cancer-groups";
import { EMBEDDING_DIMS, EMBEDDING_MODEL, INT8_SCALE, PIPELINE_VERSION, PROMPT_VERSION } from "../../config/embedding";
import { embedTexts } from "./embed";
import { fetchAllResumable, NATIONAL_CONDITION_QUERY, SCOPE_PARAMS } from "./ctgov";

const OUT = "public/data";
const TMP = "public/.data-tmp";
const BUILD = "data/build";
/** Split a group into parts above this many trials to keep each shard a few MB. */
const MAX_PER_SHARD = 700;
const MAX_INVALID_FRACTION = 0.05;
const MAX_DROP_FRACTION = 0.4;
const ALL_SHARD = "_all";

const args = new Map(process.argv.slice(2).map((a) => a.replace(/^--/, "").split("=") as [string, string]));
const source = (args.get("source") ?? "national") as "seed" | "national";

function fail(msg: string): never {
  console.error(`\nINGEST ABORTED: ${msg}\nThe previous dataset in ${OUT} was kept.`);
  process.exit(1);
}

async function loadZipTable(): Promise<Map<string, { lat: number; lon: number }>> {
  const text = await readFile("data/geo/zcta.csv", "utf8");
  const map = new Map<string, { lat: number; lon: number }>();
  for (const line of text.split("\n")) {
    if (!line || line.startsWith("#")) continue;
    const [zip, lat, lon] = line.split(",");
    if (zip && lat && lon) map.set(zip, { lat: Number(lat), lon: Number(lon) });
  }
  return map;
}

async function loadRaw(): Promise<unknown[]> {
  if (source === "seed") {
    const seed = JSON.parse(await readFile("data/seed/studies.json", "utf8")) as { studies: unknown[] };
    return seed.studies;
  }
  console.log("Fetching national dataset from ClinicalTrials.gov (resumable)...");
  return fetchAllResumable({ ...SCOPE_PARAMS, "query.cond": NATIONAL_CONDITION_QUERY }, "data/cache/national");
}

async function previousMeta(): Promise<Meta | null> {
  try {
    return MetaSchema.parse(JSON.parse(await readFile(path.join(OUT, "meta.json"), "utf8")));
  } catch {
    return null;
  }
}

function quantize(vec: Float32Array): Int8Array {
  const q = new Int8Array(vec.length);
  for (let i = 0; i < vec.length; i++) q[i] = Math.max(-127, Math.min(127, Math.round((vec[i] ?? 0) * INT8_SCALE)));
  return q;
}

async function writeJson(file: string, data: unknown): Promise<number> {
  const body = JSON.stringify(data);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, body);
  return Buffer.byteLength(body);
}

async function main(): Promise<void> {
  const t0 = Date.now();
  const raw = await loadRaw();
  console.log(`Loaded ${raw.length} raw studies (${source})`);

  // 1. Validate + build cards.
  const zips = await loadZipTable();
  const cards: TrialCard[] = [];
  const sitesById = new Map<string, Site[]>();
  const failures: string[] = [];
  const seen = new Set<string>();
  for (const r of raw) {
    const parsed = RawStudySchema.safeParse(r);
    if (!parsed.success) {
      failures.push(`invalid record: ${parsed.error.issues[0]?.path.join(".")} ${parsed.error.issues[0]?.message}`);
      continue;
    }
    const built = buildRecord(parsed.data, (z) => zips.get(z));
    if (!built.ok) {
      failures.push(`${built.id}: ${built.reason}`);
      continue;
    }
    if (seen.has(built.card.id)) continue;
    seen.add(built.card.id);
    cards.push(built.card);
    sitesById.set(built.card.id, built.sites);
  }
  const invalidFraction = failures.length / Math.max(1, raw.length);
  console.log(`Built ${cards.length} trials; skipped ${failures.length} (${(invalidFraction * 100).toFixed(1)}%)`);
  for (const f of failures.slice(0, 10)) console.log(`  skipped ${f}`);
  if (invalidFraction > MAX_INVALID_FRACTION) fail(`${(invalidFraction * 100).toFixed(1)}% of records failed validation (limit 5%)`);
  const prev = await previousMeta();
  if (prev && prev.source === source && cards.length < prev.totalTrials * (1 - MAX_DROP_FRACTION)) {
    fail(`trial count dropped from ${prev.totalTrials} to ${cards.length} (more than 40%)`);
  }
  cards.sort((a, b) => a.id.localeCompare(b.id));

  // 2. Embeddings (cached by NCT ID + last-updated + model so unchanged trials are not re-embedded).
  const vectors = await embedTexts(
    cards.map((c) => ({ key: `${c.id}|${c.lastUpdated}|${EMBEDDING_MODEL}`, text: embeddingText(c) })),
  );
  const quantized = new Map(cards.map((c, i) => [c.id, quantize(vectors[i] as Float32Array)]));

  // 3. Data version = content hash, so caches refresh exactly when data changes.
  const hash = createHash("sha256").update(JSON.stringify(cards)).digest("hex").slice(0, 10);
  const dataDate = new Date().toISOString().slice(0, 10);
  const dataVersion = `${source}-${dataDate.replaceAll("-", "")}-${hash}`;

  // 4. Shards.
  await rm(TMP, { recursive: true, force: true });
  const shards: ShardInfo[] = [];
  const groups: Manifest["groups"] = {};
  const lookup: Record<string, string> = {};

  const writeShard = async (id: string, group: CancerGroupId, list: TrialCard[]) => {
    const dir = path.join(TMP, "shards", dataVersion, id);
    const index = new MiniSearch<SearchDoc>(MINISEARCH_OPTIONS);
    index.addAll(list.map(toSearchDoc));
    const emb = new Int8Array(list.length * EMBEDDING_DIMS);
    list.forEach((c, i) => emb.set(quantized.get(c.id) as Int8Array, i * EMBEDDING_DIMS));
    const sites: Record<string, Site[]> = {};
    for (const c of list) sites[c.id] = sitesById.get(c.id) ?? [];
    let bytes = 0;
    bytes += await writeJson(path.join(dir, "cards.json"), list);
    bytes += await writeJson(path.join(dir, "sites.json"), sites);
    bytes += await writeJson(path.join(dir, "index.json"), index.toJSON());
    await writeFile(path.join(dir, "emb.bin"), emb);
    bytes += emb.byteLength;
    shards.push({ id, group, count: list.length, files: { cards: "cards.json", sites: "sites.json", index: "index.json", embeddings: "emb.bin" }, bytes });
  };

  for (const g of CANCER_GROUP_IDS) {
    const list = cards.filter((c) => c.groups.includes(g));
    if (list.length === 0) continue;
    const parts = Math.ceil(list.length / MAX_PER_SHARD);
    const ids: string[] = [];
    for (let p = 0; p < parts; p++) {
      const id = parts === 1 ? g : `${g}-${p + 1}`;
      const part = list.slice(p * MAX_PER_SHARD, (p + 1) * MAX_PER_SHARD);
      await writeShard(id, g, part);
      ids.push(id);
      for (const c of part) if (c.groups[0] === g) lookup[c.id] ??= id;
    }
    groups[g] = ids;
  }
  // Cross-group index for "Other / not sure".
  await writeShard(ALL_SHARD, "other", cards);
  for (const c of cards) lookup[c.id] ??= ALL_SHARD;

  // 5. ZIP tables by 3-digit prefix (loaded on demand by the browser).
  const byPrefix = new Map<string, Record<string, [number, number]>>();
  for (const [zip, c] of zips) {
    const p = zip.slice(0, 3);
    const rec = byPrefix.get(p) ?? {};
    rec[zip] = [c.lat, c.lon];
    byPrefix.set(p, rec);
  }
  for (const [p, rec] of byPrefix) await writeJson(path.join(TMP, "zip", `${p}.json`), rec);

  // 6. Manifest, meta, lookup.
  const manifest: Manifest = {
    dataVersion,
    shardBase: `/data/shards/${dataVersion}`,
    embedding: { model: EMBEDDING_MODEL, dims: EMBEDDING_DIMS, quantization: "int8", scale: INT8_SCALE },
    groups,
    shards,
    allShard: ALL_SHARD,
  };
  const countsByGroup: Meta["countsByGroup"] = {};
  for (const g of CANCER_GROUP_IDS) {
    const n = cards.filter((c) => c.groups.includes(g)).length;
    if (n) countsByGroup[g] = n;
  }
  const meta: Meta = {
    dataDate,
    dataVersion,
    source,
    totalTrials: cards.length,
    countsByGroup,
    statesCovered: new Set(cards.flatMap((c) => c.states)).size,
    embeddingModel: EMBEDDING_MODEL,
    llmModel: null,
    pipelineVersion: PIPELINE_VERSION,
    promptVersion: PROMPT_VERSION,
  };
  await writeJson(path.join(TMP, "manifest.json"), ManifestSchema.parse(manifest));
  await writeJson(path.join(TMP, "meta.json"), MetaSchema.parse(meta));
  await writeJson(path.join(TMP, "lookup.json"), lookup);

  // 7. Validate output, then atomically swap directories.
  for (const s of shards) {
    for (const f of Object.values(s.files)) {
      const st = await stat(path.join(TMP, "shards", dataVersion, s.id, f)).catch(() => null);
      if (!st || st.size === 0) fail(`missing shard file ${s.id}/${f}`);
    }
  }
  const old = `${OUT}.old`;
  await rm(old, { recursive: true, force: true });
  await rename(OUT, old).catch(() => undefined);
  await rename(TMP, OUT);
  await rm(old, { recursive: true, force: true });

  // 8. Backend copy of trial criteria (the API never trusts trial text from the browser).
  await mkdir(BUILD, { recursive: true });
  const serverTrials = Object.fromEntries(
    cards.map((c) => [c.id, { id: c.id, title: c.title, summary: c.summary, inclusion: c.inclusion, exclusion: c.exclusion, minAge: c.minAge, maxAge: c.maxAge, groups: c.groups, facts: c.facts, barriers: c.barriers }]),
  );
  await writeJson(path.join(BUILD, "criteria.json"), { dataVersion, trials: serverTrials });
  const esc = (s: string) => s.replaceAll("'", "''");
  const sql = [
    "DELETE FROM trials;",
    ...Object.values(serverTrials).map((t) => `INSERT INTO trials (nct_id, data_version, payload) VALUES ('${t.id}', '${esc(dataVersion)}', '${esc(JSON.stringify(t))}');`),
  ].join("\n");
  await writeFile(path.join(BUILD, "criteria.sql"), sql);

  // 9. Report.
  console.log(`\nData version ${dataVersion}: ${cards.length} trials, ${meta.statesCovered} states, ${shards.length} shards`);
  for (const s of shards) {
    const dir = path.join(OUT, "shards", dataVersion, s.id);
    let gz = 0;
    for (const f of await readdir(dir)) gz += gzipSync(await readFile(path.join(dir, f))).byteLength;
    console.log(`  ${s.id.padEnd(18)} ${String(s.count).padStart(5)} trials  ${(s.bytes / 1024).toFixed(0).padStart(6)} KB raw  ${(gz / 1024).toFixed(0).padStart(5)} KB gzip`);
  }
  console.log(`Done in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
}

main().catch((err: unknown) => fail(err instanceof Error ? err.message : String(err)));
