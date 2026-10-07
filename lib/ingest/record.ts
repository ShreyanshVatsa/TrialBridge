import { TrialCardSchema, type Site, type TrialCard } from "@/lib/types/trial";
import type { RawStudy } from "./raw";
import { contacts, parseAge, parseEligibility, STATE_CODES, unescapeMarkdown, usSites } from "./parse";
import { mapGroups } from "./groups";
import { detectBarriers } from "./barriers";
import { extractRuleFacts } from "./facts";

export type BuildResult = { ok: true; card: TrialCard; sites: Site[] } | { ok: false; id: string; reason: string };

const SUMMARY_MAX = 1200;
export const OUT_OF_SCOPE = "no recruiting U.S. sites";

/**
 * Convert one validated ClinicalTrials.gov study into a TrialCard + U.S. sites, running
 * cancer-group mapping, barrier detection, and the rule fact layer. Never throws.
 * `zipLookup` fills coordinates for sites missing a geoPoint.
 */
export function buildRecord(study: RawStudy, zipLookup?: (zip: string) => { lat: number; lon: number } | undefined): BuildResult {
  const ps = study.protocolSection;
  const id = ps.identificationModule.nctId;
  try {
    const elig = ps.eligibilityModule;
    const { inclusion, exclusion } = parseEligibility(elig.eligibilityCriteria);
    if (inclusion.length === 0 && exclusion.length === 0) return { ok: false, id, reason: "no parseable eligibility criteria" };

    const sites = usSites(study).map((s) => {
      if (s.lat !== undefined || !zipLookup) return s;
      const c = zipLookup(s.zip);
      return c ? { ...s, lat: c.lat, lon: c.lon } : s;
    });
    if (sites.length === 0) return { ok: false, id, reason: OUT_OF_SCOPE };

    const meshTerms = [
      ...(study.derivedSection?.conditionBrowseModule?.meshes ?? []).map((m) => m.term),
      ...(study.derivedSection?.conditionBrowseModule?.ancestors ?? []).map((m) => m.term),
    ];
    const conditions = ps.conditionsModule?.conditions ?? [];
    const minAge = parseAge(elig.minimumAge);
    const maxAge = parseAge(elig.maximumAge);
    let summary = unescapeMarkdown(ps.descriptionModule?.briefSummary ?? "").trim();
    if (summary.length > SUMMARY_MAX) summary = `${summary.slice(0, SUMMARY_MAX).replace(/\s+\S*$/, "")}…`;
    const sex = elig.sex === "FEMALE" || elig.sex === "MALE" ? elig.sex : "ALL";

    const card: TrialCard = {
      id,
      title: ps.identificationModule.briefTitle.trim(),
      ...(ps.identificationModule.officialTitle ? { officialTitle: ps.identificationModule.officialTitle.trim() } : {}),
      summary,
      phases: (ps.designModule?.phases ?? []).filter((p) => p !== "NA"),
      conditions,
      meshTerms: [...new Set(meshTerms)],
      groups: mapGroups(meshTerms, conditions, ps.identificationModule.briefTitle),
      sponsor: ps.sponsorCollaboratorsModule?.leadSponsor?.name ?? "Not listed",
      minAge,
      maxAge,
      sex,
      inclusion,
      exclusion,
      contacts: contacts(study),
      barriers: detectBarriers({ inclusion, exclusion, maxAge, ...(elig.maximumAge ? { maxAgeRaw: elig.maximumAge } : {}) }),
      facts: extractRuleFacts(inclusion, exclusion),
      siteCount: sites.length,
      states: [...new Set(sites.map((s) => STATE_CODES[s.state] ?? s.state))].sort(),
      lastUpdated: ps.statusModule.lastUpdatePostDateStruct?.date ?? "",
    };
    const parsed = TrialCardSchema.safeParse(card);
    if (!parsed.success) return { ok: false, id, reason: parsed.error.issues[0]?.message ?? "invalid card" };
    return { ok: true, card: parsed.data, sites };
  } catch (err) {
    return { ok: false, id, reason: err instanceof Error ? err.message : "unknown error" };
  }
}

/** Text that is embedded and keyword-indexed for a trial. */
export function embeddingText(card: TrialCard): string {
  return [card.title, card.conditions.join(", "), card.summary, card.inclusion.map((c) => c.text).join(" ")].join("\n");
}
