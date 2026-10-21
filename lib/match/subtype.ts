/**
 * Structured subtype match: the patient's chosen subtype (lung: SCLC vs NSCLC; leukemia: AML vs CLL; ...) against the
 * histologies the TRIAL ITSELF registers in its structured conditions and title. This is a different signal from
 * the criteria-text histology facts (precision 67%, support-only): a registered condition list is the sponsor's own
 * statement of the disease, so a match is high precision.
 *
 *   match    +1  the trial registers a histology the patient has (e.g. patient AML, conditions "Acute Myeloid Leukemia")
 *   conflict -1  the trial registers histologies and ALL of them are ones the patient does NOT have
 *    0           the patient gave no subtype (or a non-response), or the trial names no histology of the group
 *
 * "Unknown" / skip / deferred subtype answers compile to no rules, so they return 0 here: unknown never lowers rank.
 */
import { HISTOLOGY_PATTERNS } from "@/config/criteria";
import type { CancerGroupId } from "@/config/cancer-groups";
import type { CompiledAnswer } from "@/lib/questionnaire/rules";
import type { TrialCard } from "@/lib/types/trial";

export interface SubtypeProfile {
  /** Histologies the patient's cancer is (e.g. "nsclc"). */
  is: ReadonlySet<string>;
  /** Histologies it is not. */
  isNot: ReadonlySet<string>;
}

/** The patient's subtype as histology sets, read from the compiled `subtype` answer; null when not answered. */
export function subtypeProfile(compiled: readonly CompiledAnswer[]): SubtypeProfile | null {
  const c = compiled.find((x) => x.question === "subtype");
  if (!c || c.rules.size === 0) return null;
  const is = new Set<string>();
  const isNot = new Set<string>();
  for (const [key, rules] of c.rules) {
    if (!key.startsWith("histology:")) continue;
    const id = key.slice("histology:".length);
    for (const { rule } of rules) {
      if (rule.whenRequired === "support") is.add(id);
      else if (rule.whenRequired === "conflict") isNot.add(id);
    }
  }
  return is.size + isNot.size > 0 ? { is, isNot } : null;
}

const tagCache = new Map<string, ReadonlySet<string>>();

/** Histology ids a trial's registered conditions and titles name, for a cancer group. Cached per trial text. */
function trialHistologies(card: Partial<Pick<TrialCard, "conditions" | "title" | "officialTitle">>, group: CancerGroupId): ReadonlySet<string> {
  const text = [...(card.conditions ?? []), card.title ?? "", card.officialTitle ?? ""].join(" ; ");
  const cacheKey = `${group}|${text}`;
  const hit = tagCache.get(cacheKey);
  if (hit) return hit;
  const ids = new Set<string>();
  for (const h of HISTOLOGY_PATTERNS) if (h.groups.includes(group) && h.re.test(text) && !h.negated?.test(text)) ids.add(h.id);
  // "Squamous NSCLC" names one disease: the parent/child pair is not a list of competing diseases.
  if (ids.has("nsclc") && ids.has("lung_squamous")) ids.delete("lung_squamous");
  if (tagCache.size > 20000) tagCache.clear();
  tagCache.set(cacheKey, ids);
  return ids;
}

/** +1 match, -1 conflict, 0 neutral. */
export function subtypeMatch(profile: SubtypeProfile | null, card: Partial<Pick<TrialCard, "conditions" | "title" | "officialTitle">>, group: CancerGroupId): -1 | 0 | 1 {
  if (!profile) return 0;
  const tags = trialHistologies(card, group);
  if (tags.size === 0) return 0;
  for (const t of tags) if (profile.is.has(t)) return 1;
  for (const t of tags) if (!profile.isNot.has(t)) return 0;
  return -1;
}
