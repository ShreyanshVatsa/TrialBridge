import { CANCER_GROUPS, type CancerGroupId } from "@/config/cancer-groups";

const SPECIFIC = CANCER_GROUPS.filter((g) => g.id !== "solid-tumors" && g.id !== "other");
const SOLID = CANCER_GROUPS.find((g) => g.id === "solid-tumors");
/** A trial matching this many specific groups is treated as a basket trial. */
const BASKET_THRESHOLD = 4;

/**
 * Map a trial to cancer-type groups from MeSH terms (conditions + ancestors), falling back
 * to free-text conditions. Basket / multi-cancer trials also get "solid-tumors".
 * Trials matching nothing go to "other" so they are still searchable via "not sure".
 */
export function mapGroups(meshTerms: string[], conditions: string[], title = ""): CancerGroupId[] {
  const groups = new Set<CancerGroupId>();
  for (const g of SPECIFIC) {
    if (g.mesh.some((re) => meshTerms.some((t) => re.test(t)))) groups.add(g.id);
  }
  if (groups.size === 0) {
    for (const g of SPECIFIC) {
      if (g.text.some((re) => conditions.some((c) => re.test(c)))) groups.add(g.id);
    }
  }
  const solidText = SOLID?.text.some((re) => conditions.some((c) => re.test(c)) || re.test(title)) ?? false;
  if (groups.size >= BASKET_THRESHOLD || solidText) groups.add("solid-tumors");
  if (groups.size === 0) groups.add("other");
  return [...groups];
}
