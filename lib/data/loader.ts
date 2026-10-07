/**
 * Browser data loading: fetch shards, meta, lookup, and ZIP tables from /data with timeout,
 * retry, progress, and in-memory caching. All responses are zod-validated.
 */
import { z } from "zod";
import {
  LiteCardSchema,
  LiteSitesSchema,
  ManifestSchema,
  TrialBucketSchema,
  trialBucketKey,
  type LiteCard,
  type TrialBucket,
  MetaSchema,
  ShardSitesSchema,
  TrialCardSchema,
  type Manifest,
  type Meta,
  type ShardInfo,
  type ShardSites,
  type Site,
  type TrialCard,
} from "@/lib/types/trial";
import type { LatLon } from "@/lib/geo/distance";
import { sortSitesByDistance } from "@/lib/match/filters";

export { sortSitesByDistance };

export type DataLoadErrorCode = "network" | "not_found" | "invalid" | "timeout";

export class DataLoadError extends Error {
  constructor(
    public readonly code: DataLoadErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "DataLoadError";
  }
}

const DATA_BASE = "/data";
const TIMEOUT_MS = 30_000;
const RETRIES = 2;

export interface FetchOptions {
  signal?: AbortSignal;
  /** Called with 0..1 as bytes arrive (when Content-Length is known). */
  onProgress?: (fraction: number) => void;
}

/** Overridable fetch for tests. */
let fetchImpl: typeof fetch = (...a) => fetch(...a);
export function setFetchForTests(f: typeof fetch): void {
  fetchImpl = f;
  cache.clear();
}

async function fetchBytes(url: string, opts: FetchOptions = {}): Promise<Uint8Array> {
  let lastErr: DataLoadError = new DataLoadError("network", "Download failed");
  for (let attempt = 0; attempt <= RETRIES; attempt++) {
    if (opts.signal?.aborted) throw opts.signal.reason;
    const timeout = AbortSignal.timeout(TIMEOUT_MS);
    const signal = opts.signal ? AbortSignal.any([opts.signal, timeout]) : timeout;
    try {
      const res = await fetchImpl(url, { signal });
      if (res.status === 404) throw new DataLoadError("not_found", `Not found: ${url}`);
      if (!res.ok) throw new DataLoadError("network", `HTTP ${res.status}`);
      const total = Number(res.headers.get("content-length") ?? 0);
      if (!res.body || !opts.onProgress || !total) return new Uint8Array(await res.arrayBuffer());
      const reader = res.body.getReader();
      const chunks: Uint8Array[] = [];
      let received = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.byteLength;
        opts.onProgress(Math.min(1, received / total));
      }
      const out = new Uint8Array(received);
      let off = 0;
      for (const c of chunks) {
        out.set(c, off);
        off += c.byteLength;
      }
      return out;
    } catch (err) {
      if (err instanceof DataLoadError && err.code === "not_found") throw err;
      if (opts.signal?.aborted) throw opts.signal.reason;
      lastErr = timeout.aborted ? new DataLoadError("timeout", "Download timed out") : err instanceof DataLoadError ? err : new DataLoadError("network", "Network error");
      if (attempt < RETRIES) await new Promise((r) => setTimeout(r, 500 * 2 ** attempt));
    }
  }
  throw lastErr;
}

async function fetchJson<T>(url: string, schema: z.ZodType<T>, opts?: FetchOptions): Promise<T> {
  const bytes = await fetchBytes(url, opts);
  let data: unknown;
  try {
    data = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    throw new DataLoadError("invalid", `Invalid JSON: ${url}`);
  }
  const parsed = schema.safeParse(data);
  if (!parsed.success) throw new DataLoadError("invalid", `Unexpected data format: ${url}`);
  return parsed.data;
}

/** Memoize promises; failed loads are evicted so they can be retried. */
const cache = new Map<string, Promise<unknown>>();
function memo<T>(key: string, load: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit) return hit as Promise<T>;
  const p = load();
  cache.set(key, p);
  p.catch(() => cache.delete(key));
  return p;
}

export function loadMeta(): Promise<Meta> {
  return memo("meta", () => fetchJson(`${DATA_BASE}/meta.json`, MetaSchema));
}

export function loadManifest(): Promise<Manifest> {
  return memo("manifest", () => fetchJson(`${DATA_BASE}/manifest.json`, ManifestSchema));
}

/** A loaded shard: cards, sites, serialized MiniSearch index, int8 embeddings (row-major, cards order). */
export interface LoadedShard {
  info: ShardInfo;
  cards: TrialCard[];
  sites: ShardSites;
  indexJson: string;
  embeddings: Int8Array;
}

export function loadShard(info: ShardInfo, shardBase: string, opts: FetchOptions = {}): Promise<LoadedShard> {
  return memo(`shard:${shardBase}/${info.id}`, async () => {
    const base = `${shardBase}/${info.id}/`;
    // Progress is weighted by the shard's recorded size; cards dominate.
    const fractions = [0, 0, 0, 0];
    const report = (i: number) => (f: number) => {
      fractions[i] = f;
      opts.onProgress?.(fractions.reduce((a, b) => a + b, 0) / fractions.length);
    };
    const [cards, sites, indexBytes, embBytes] = await Promise.all([
      fetchJson(base + info.files.cards, z.array(TrialCardSchema), { ...opts, onProgress: report(0) }),
      fetchJson(base + info.files.sites, ShardSitesSchema, { ...opts, onProgress: report(1) }),
      fetchBytes(base + info.files.index, { ...opts, onProgress: report(2) }),
      fetchBytes(base + info.files.embeddings, { ...opts, onProgress: report(3) }),
    ]);
    const embeddings = new Int8Array(embBytes.buffer, embBytes.byteOffset, embBytes.byteLength);
    if (embeddings.length % cards.length !== 0 && cards.length > 0) throw new DataLoadError("invalid", `Embedding size mismatch in shard ${info.id}`);
    return { info, cards, sites, indexJson: new TextDecoder().decode(indexBytes), embeddings };
  });
}

/** The cross-group lite index used for "Other / not sure". */
export interface LoadedLiteShard {
  info: ShardInfo;
  cards: LiteCard[];
  /** NCT ID -> [lat, lon][] */
  sites: Record<string, [number, number][]>;
  indexJson: string;
  embeddings: Int8Array;
}

export function loadLiteShard(info: ShardInfo, shardBase: string, opts: FetchOptions = {}): Promise<LoadedLiteShard> {
  return memo(`lite:${shardBase}/${info.id}`, async () => {
    const base = `${shardBase}/${info.id}/`;
    const fractions = [0, 0, 0, 0];
    const report = (i: number) => (f: number) => {
      fractions[i] = f;
      opts.onProgress?.(fractions.reduce((a, b) => a + b, 0) / fractions.length);
    };
    const [cards, sites, indexBytes, embBytes] = await Promise.all([
      fetchJson(base + info.files.cards, z.array(LiteCardSchema), { ...opts, onProgress: report(0) }),
      fetchJson(base + info.files.sites, LiteSitesSchema, { ...opts, onProgress: report(1) }),
      fetchBytes(base + info.files.index, { ...opts, onProgress: report(2) }),
      fetchBytes(base + info.files.embeddings, { ...opts, onProgress: report(3) }),
    ]);
    const embeddings = new Int8Array(embBytes.buffer, embBytes.byteOffset, embBytes.byteLength);
    if (cards.length > 0 && embeddings.length % cards.length !== 0) throw new DataLoadError("invalid", `Embedding size mismatch in shard ${info.id}`);
    return { info, cards, sites, indexJson: new TextDecoder().decode(indexBytes), embeddings };
  });
}

function loadBucket(trialBase: string, key: string, opts: FetchOptions = {}) {
  return memo(`bucket:${trialBase}/${key}`, () => fetchJson(`${trialBase}/${key}.json`, TrialBucketSchema, opts));
}

/** Load several trials (card + sites) by NCT ID from per-trial buckets. Unknown IDs are omitted. */
export async function loadTrials(nctIds: readonly string[], opts: FetchOptions = {}): Promise<Map<string, { card: TrialCard; sites: Site[] }>> {
  const manifest = await loadManifest();
  const keys = [...new Set(nctIds.map(trialBucketKey))];
  const buckets = await Promise.all(
    keys.map((k) =>
      loadBucket(manifest.trialBase, k, opts).catch((err: unknown) => {
        if (err instanceof DataLoadError && err.code === "not_found") return {} as TrialBucket;
        throw err;
      }),
    ),
  );
  const out = new Map<string, { card: TrialCard; sites: Site[] }>();
  for (const id of nctIds) {
    for (const b of buckets) {
      const hit = b[id];
      if (hit) {
        out.set(id, hit);
        break;
      }
    }
  }
  return out;
}

/** Load one trial (card + U.S. sites) by NCT ID for the trial detail page. null = unknown ID. */
export async function loadTrial(nctId: string, opts: FetchOptions = {}): Promise<{ card: TrialCard; sites: Site[] } | null> {
  const id = nctId.trim().toUpperCase();
  if (!/^NCT\d{8}$/.test(id)) return null;
  return (await loadTrials([id], opts)).get(id) ?? null;
}

const ZipTableSchema = z.record(z.string(), z.tuple([z.number(), z.number()]));

/**
 * ZIP -> approximate centroid (Census ZCTA internal point). Loads only the 3-digit-prefix file.
 * Falls back to the prefix's average when the exact ZIP isn't a ZCTA (e.g. PO-box-only ZIPs).
 */
export async function lookupZip(zip: string, opts: FetchOptions = {}): Promise<LatLon | null> {
  if (!/^\d{5}$/.test(zip)) return null;
  const prefix = zip.slice(0, 3);
  let table: Record<string, [number, number]>;
  try {
    table = await memo(`zip:${prefix}`, () => fetchJson(`${DATA_BASE}/zip/${prefix}.json`, ZipTableSchema, opts));
  } catch (err) {
    if (err instanceof DataLoadError && err.code === "not_found") return null;
    throw err;
  }
  const exact = table[zip];
  if (exact) return { lat: exact[0], lon: exact[1] };
  const all = Object.values(table);
  if (all.length === 0) return null;
  return { lat: all.reduce((s, v) => s + v[0], 0) / all.length, lon: all.reduce((s, v) => s + v[1], 0) / all.length };
}
