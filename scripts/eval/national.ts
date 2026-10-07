/**
 * Node-side loader for the national shards in public/data (the same files the browser downloads), so the
 * eval scripts can run the real ranking and engine code over thousands of trials instead of the 301-trial
 * seed. `NATIONAL_DIR` (a folder holding manifest.json + shards/<version>/) overrides public/data, so a
 * snapshot taken before a re-ingest keeps before/after comparisons exact.
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import MiniSearch from "minisearch";
import { z } from "zod";
import { ManifestSchema, ShardSitesSchema, TrialCardSchema, type Manifest, type Site, type TrialCard } from "../../lib/types/trial";
import type { RankEntry } from "../../lib/match/rank";
import { MINISEARCH_OPTIONS, type SearchDoc } from "../../lib/match/minisearch-config";
import type { CancerGroupId } from "../../config/cancer-groups";

export interface NationalShard {
  id: string;
  cards: TrialCard[];
  sites: Record<string, Site[]>;
  emb: Int8Array;
  indexJson: string;
}

export interface National {
  manifest: Manifest;
  dims: number;
  /** Loaded lazily per shard id. */
  shard(id: string): NationalShard;
  /** Entries (card, sites, int8 vector) of every full shard of a group, deduplicated by NCT id. */
  entries(group: CancerGroupId): RankEntry[];
  /** Shard ids of a group (manifest order). */
  shardIds(group: CancerGroupId): string[];
  /** One MiniSearch index per shard of the group, in manifest order (as the browser builds them). */
  indexes(group: CancerGroupId): MiniSearch<SearchDoc>[];
}

/** The folder with manifest.json (`NATIONAL_DIR` or public/data); null when no national data is present. */
export function nationalRoot(): string | null {
  const root = path.resolve(process.env.NATIONAL_DIR ?? "public/data");
  return existsSync(path.join(root, "manifest.json")) ? root : null;
}

export function loadNational(): National | null {
  const root = nationalRoot();
  if (!root) return null;
  const manifest = ManifestSchema.parse(JSON.parse(readFileSync(path.join(root, "manifest.json"), "utf8")));
  if (manifest.shardBase.includes("seed") || !existsSync(path.join(root, "shards", path.basename(manifest.shardBase)))) return null;
  const base = path.join(root, "shards", path.basename(manifest.shardBase));
  const dims = manifest.embedding.dims;
  const loaded = new Map<string, NationalShard>();
  const indexCache = new Map<string, MiniSearch<SearchDoc>>();
  const shard = (id: string): NationalShard => {
    let s = loaded.get(id);
    if (!s) {
      const info = manifest.shards.find((x) => x.id === id);
      if (!info) throw new Error(`unknown shard ${id}`);
      const dir = path.join(base, id);
      const read = (f: string) => readFileSync(path.join(dir, f));
      const text = (f: string) => new TextDecoder().decode(read(f));
      const emb = read(info.files.embeddings);
      s = {
        id,
        cards: z.array(TrialCardSchema).parse(JSON.parse(text(info.files.cards))),
        sites: ShardSitesSchema.parse(JSON.parse(text(info.files.sites))),
        emb: new Int8Array(emb.buffer, emb.byteOffset, emb.byteLength),
        indexJson: text(info.files.index),
      };
      loaded.set(id, s);
    }
    return s;
  };
  const shardIds = (group: CancerGroupId) => (group === "other" ? [manifest.allShard] : (manifest.groups[group] ?? []));
  return {
    manifest,
    dims,
    shard,
    shardIds,
    entries(group) {
      const seen = new Set<string>();
      const out: RankEntry[] = [];
      for (const id of shardIds(group)) {
        const s = shard(id);
        s.cards.forEach((card, j) => {
          if (seen.has(card.id)) return;
          seen.add(card.id);
          out.push({ card, sites: s.sites[card.id] ?? [], vector: s.emb.subarray(j * dims, (j + 1) * dims) });
        });
      }
      return out;
    },
    indexes(group) {
      return shardIds(group).map((id) => {
        let idx = indexCache.get(id);
        if (!idx) {
          idx = MiniSearch.loadJSON<SearchDoc>(shard(id).indexJson, MINISEARCH_OPTIONS);
          indexCache.set(id, idx);
        }
        return idx;
      });
    },
  };
}
