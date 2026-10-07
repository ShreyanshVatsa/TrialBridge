# TrialBridge internal API (lib/ for the UI)

All types live in `lib/types` (`import type { ... } from "@/lib/types"`). Config: `config/cancer-groups.ts` (`CANCER_GROUPS`, `PICKABLE_GROUPS`, `getCancerGroup`), `config/biomarkers.ts` (`BIOMARKERS`, `BIOMARKERS_BY_GROUP`).
All functions are browser-safe and client-only (call from `"use client"` components). Nothing here sends ZIP, exact age, or intake text anywhere.

## Intake
- `IntakeAnswersSchema` (zod, `lib/types/intake.ts`): validate the full answer set before searching. Field schemas `ZipSchema`, `AgeSchema`, `TravelMilesSchema` validate single inputs. `TRAVEL_OPTIONS` = `[25, 50, 100, 250, 500, null]` (null = anywhere).
- Cancer type `"other"` means "Other / not sure" (searches all trials). Biomarker question: ask only `BIOMARKERS_BY_GROUP[cancerType]`; skip when empty.

## Data loading (`lib/data/loader.ts`)
- `loadMeta(): Promise<Meta>`: data date, counts per group, versions (for landing stats).
- `loadTrial(nctId: string): Promise<{ card: TrialCard; sites: Site[] } | null>`: trial detail page (`/trial/?id=NCT01234567`). null = unknown ID.
- `lookupZip(zip: string): Promise<{ lat: number; lon: number } | null>`: ZIP centroid (loads one 3-digit-prefix file on demand).
- `sortSitesByDistance(sites: Site[], origin: { lat: number; lon: number } | null): Array<{ site: Site; miles: number | null }>`: nearest first.
- Internal: `loadManifest()`, `loadShard(info, shardBase, opts)` (used by search; UI should not need them).
- All loaders throw `DataLoadError` (`code: "network" | "not_found" | "invalid" | "timeout"`) after retries.

## Matching (`lib/match/search.ts`)
- `searchTrials(answers: IntakeAnswers, opts?: { onProgress?: (p: SearchProgress) => void; signal?: AbortSignal }): Promise<SearchOutcome>`
  - Loads the shard(s), applies hard filters (group, age, distance), hybrid ranks (BM25 + embeddings via Web Worker, RRF k=60), rule pre-check. Returns top 15 `RankedTrial`s (show 10, "show more" for the rest).
  - `outcome.keywordOnly === true` => embeddings failed/timed out; show the "keyword-only ranking" notice.
- `applyAnalysis(results: RankedTrial[], response: AnalyzeResponse): RankedTrial[]`: attaches AI analysis per trial and re-ranks with `lib/match/score.ts`.

## AI analysis (`lib/api/analyze.ts`)
- `requestAnalysis(answers: IntakeAnswers, nctIds: string[], turnstileToken: string, opts?: { signal?: AbortSignal }): Promise<AnalyzeResponse>`
  - Minimizes the profile internally (`minimizeProfile`, `lib/privacy/minimize.ts`). Never throws for AI/network failure: returns `{ status: "degraded", degradedReason }`; show "AI explanations are busy right now. Here are your matches based on trial criteria." `experimental === true` => label Haitian Creole AI output "experimental".
- `getTurnstileToken(container: HTMLElement): Promise<string>` (`lib/api/turnstile.ts`): loads Turnstile and renders an interaction-only widget in `container`; resolves with a token.

## Fit/badges
- `FitLevel`: strong | possible | unlikely | unclear. `Assessment`: likely_met | likely_not_met | needs_doctor. Never say "eligible"/"qualify"; say "possible match to discuss with your care team".
- `Barrier.type`: english_required | upper_age_limit | disability_exclusion; `Barrier.quote` is the exact triggering sentence. `RankedTrial.languageWarning` => show the language warning badge.
- Criteria quotes: `card.inclusion` / `card.exclusion` are numbered `{ n, text }`; AI quotes reference `{ section, number }`.

## Local full-stack run
`npm run build && npm run preview` serves the static export and `/api/*` together via `wrangler dev` (local D1 seeded from data/build/criteria.sql). `next dev` alone has no API: `requestAnalysis` then returns a degraded response.
