/**
 * Local numbers for the Congressional App Challenge deck: `npm run cac:local -- --state=MA [--zip=01852 --group=breast]`.
 * Reads the generated data in public/data (national if it was ingested, else the seed) and writes resources-for-cac/local-data.json (or the path given with --out=):
 * the state's trial and barrier counts, the busiest cities, the trials with a site in the district's cities, and, for the
 * sample patient, how many trials of their cancer group sit within 25 / 50 / 100 / 250 miles of their ZIP. If the slide deck
 * (slides/index.html next to the output file) exists, its embedded copy of the JSON is refreshed too. Every figure is counted from the data files; nothing is estimated.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { canonicalSite } from "../../lib/access/aggregate";
import { haversineMiles, type LatLon } from "../../lib/geo/distance";
import { STATE_CODES } from "../../lib/ingest/parse";
import { pct } from "../../lib/access/access";
import type { AccessData } from "../../lib/types/access";
import type { Manifest, Meta, ShardSites, Site, TrialCard } from "../../lib/types/trial";

const argv = process.argv.slice(2);
const opt = (name: string, fallback: string) => argv.find((a) => a.startsWith(`--${name}=`))?.split("=")[1] ?? fallback;

const STATE = opt("state", "MA").toUpperCase();
const ZIP = opt("zip", "01852");
const GROUP = opt("group", "breast");
const DISTRICT = opt("district", "Massachusetts' 3rd District");
/** Cities of the district, for the "trials with a site in the district" count. Edit for another district. */
const DISTRICT_CITIES = opt("cities", "Lowell,Lawrence,Haverhill,Fitchburg,Leominster,Marlborough,Concord,Andover").split(",").map((c) => c.trim().toLowerCase());
const OUT = opt("out", "resources-for-cac/local-data.json");
const SLIDES = path.join(path.dirname(OUT), "slides", "index.html");

const read = <T>(p: string): T => JSON.parse(readFileSync(p, "utf8")) as T;
const stateName = Object.entries(STATE_CODES).find(([, code]) => code === STATE)?.[0] ?? STATE;
const codeOf = (s: string) => STATE_CODES[s] ?? s;

function main() {
  if (!existsSync("public/data/manifest.json")) throw new Error("no generated data: run `npm run setup` (seed) or `npm run ingest` (national) first");
  const manifest = read<Manifest>("public/data/manifest.json");
  const meta = read<Meta>("public/data/meta.json");
  const access = read<AccessData>("public/data/access.json");
  const zipTable = read<Record<string, [number, number]>>(`public/data/zip/${ZIP.slice(0, 3)}.json`);
  const origin = zipTable[ZIP];
  if (!origin) throw new Error(`ZIP ${ZIP} is not in the centroid table`);
  const from: LatLon = { lat: origin[0], lon: origin[1] };

  // Every trial once, with its sites (full shards only; the lite index repeats them).
  const trials = new Map<string, { card: TrialCard; sites: Site[] }>();
  for (const shard of manifest.shards) {
    if (shard.kind !== "full") continue;
    const base = `public${manifest.shardBase}/${shard.id}/`;
    const cards = read<TrialCard[]>(base + shard.files.cards);
    const sites = read<ShardSites>(base + shard.files.sites);
    for (const card of cards) if (!trials.has(card.id)) trials.set(card.id, { card, sites: sites[card.id] ?? [] });
  }

  const inState = (s: Site) => codeOf(s.state) === STATE;
  const stateTrials = [...trials.values()].filter((t) => t.sites.some(inState));
  const facilities = new Set<string>();
  const byCity = new Map<string, { trials: Set<string>; sites: Set<string> }>();
  for (const t of stateTrials) {
    for (const s of t.sites.filter(inState)) {
      const c = canonicalSite(s);
      if (!c) continue;
      facilities.add(c.key);
      const city = s.city.trim();
      const row = byCity.get(city) ?? { trials: new Set<string>(), sites: new Set<string>() };
      row.trials.add(t.card.id);
      row.sites.add(c.key);
      byCity.set(city, row);
    }
  }
  const topCities = [...byCity.entries()]
    .map(([city, r]) => ({ city, trials: r.trials.size, sites: r.sites.size }))
    .sort((a, b) => b.trials - a.trials)
    .slice(0, 8);
  const districtTrials = stateTrials.filter((t) => t.sites.some((s) => inState(s) && DISTRICT_CITIES.includes(s.city.trim().toLowerCase())));
  const districtSites = new Set(districtTrials.flatMap((t) => t.sites.filter((s) => inState(s) && DISTRICT_CITIES.includes(s.city.trim().toLowerCase())).map((s) => canonicalSite(s)?.key ?? "")));
  districtSites.delete("");

  // The sample patient's cancer group: distance from their ZIP to each trial's nearest site with coordinates.
  const groupIds = new Set<string>();
  for (const id of manifest.groups[GROUP as keyof typeof manifest.groups] ?? []) {
    const shard = manifest.shards.find((s) => s.id === id);
    if (!shard || shard.kind !== "full") continue;
    for (const c of read<TrialCard[]>(`public${manifest.shardBase}/${id}/${shard.files.cards}`)) groupIds.add(c.id);
  }
  const nearest = [...groupIds].map((id) => {
    const t = trials.get(id);
    const located = (t?.sites ?? []).filter((s) => typeof s.lat === "number" && typeof s.lon === "number");
    const best = located.map((s) => ({ s, miles: haversineMiles(from, { lat: s.lat!, lon: s.lon! }) })).sort((a, b) => a.miles - b.miles)[0];
    return best ? { id, miles: best.miles, city: best.s.city, state: codeOf(best.s.state) } : null;
  }).filter((x): x is NonNullable<typeof x> => x !== null);
  const within = (miles: number) => nearest.filter((n) => n.miles <= miles).length;
  const nearestCities = new Map<string, number>();
  for (const n of nearest.filter((n) => n.miles <= 50)) nearestCities.set(`${n.city}, ${n.state}`, (nearestCities.get(`${n.city}, ${n.state}`) ?? 0) + 1);

  const counts = (t: readonly number[] | undefined) => {
    const [trialsN = 0, any = 0, english = 0, age = 0, disability = 0] = t ?? [];
    return { trials: trialsN, anyBarrier: any, englishRequired: english, upperAgeLimit: age, disabilityExclusion: disability, anyBarrierPct: pct(any, trialsN), englishRequiredPct: pct(english, trialsN), upperAgeLimitPct: pct(age, trialsN), disabilityExclusionPct: pct(disability, trialsN) };
  };

  const out = {
    state: STATE,
    stateName,
    district: { label: DISTRICT, cities: DISTRICT_CITIES, trials: districtTrials.length, facilities: districtSites.size },
    computedAt: new Date().toISOString().slice(0, 10),
    data: { version: meta.dataVersion, date: meta.dataDate, source: meta.source, totalTrials: meta.totalTrials },
    national: counts(access.totals),
    stateTotals: counts(access.byState[STATE]),
    stateGroupTotals: counts(access.byStateGroup[STATE]?.[GROUP as keyof (typeof access.byStateGroup)[string]]),
    stateFacilities: facilities.size,
    topCities,
    sample: {
      group: GROUP,
      zip: ZIP,
      city: opt("city", "Lowell"),
      groupTrials: groupIds.size,
      locatedTrials: nearest.length,
      within: { 15: within(15), 25: within(25), 50: within(50), 100: within(100), 250: within(250) },
      nearestCitiesWithin50: [...nearestCities.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([city, n]) => ({ city, trials: n })),
    },
  };
  mkdirSync(path.dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");
  console.log(`${OUT}: ${stateName} (${STATE}), ${out.data.source} data ${out.data.version}: ${out.stateTotals.trials} trials with a site in the state, ${facilities.size} facilities; ${out.district.trials} trials with a site in a district city; ${GROUP} within 15/25/50/100/250 mi of ${ZIP}: ${within(15)}/${within(25)}/${within(50)}/${within(100)}/${within(250)}`);

  if (existsSync(SLIDES)) {
    const html = readFileSync(SLIDES, "utf8");
    const re = /(<script id="local-data" type="application\/json">)[\s\S]*?(<\/script>)/;
    if (re.test(html)) {
      writeFileSync(SLIDES, html.replace(re, `$1${JSON.stringify(out)}$2`));
      console.log(`${SLIDES}: embedded local data refreshed`);
    }
  }
}

main();
