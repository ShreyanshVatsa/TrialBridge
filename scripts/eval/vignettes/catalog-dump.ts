/**
 * Print the question catalog per cancer group as compact JSON (question id, type, option ids, biomarker ids),
 * for authoring and validating eval vignettes. `npx tsx scripts/eval/vignettes/catalog-dump.ts [group]`.
 */
import { getCatalog } from "../../../config/questionnaire";
import { CANCER_GROUP_IDS, type CancerGroupId } from "../../../config/cancer-groups";

const only = process.argv[2] as CancerGroupId | undefined;
const out: Record<string, unknown> = {};
for (const g of CANCER_GROUP_IDS) {
  if (only && g !== only) continue;
  out[g] = getCatalog("cancer", g)
    .filter((q) => q.tier !== "essential")
    .map((q) => ({
      id: q.id,
      type: q.type,
      enabled: q.enabled,
      ...(q.options ? { options: q.options.map((o) => o.id) } : {}),
      ...(q.biomarkers ? { biomarkers: q.biomarkers } : {}),
      ...(q.prerequisites ? { prerequisites: q.prerequisites } : {}),
      ...(q.maxAge !== undefined ? { maxAge: q.maxAge } : {}),
    }));
}
console.log(JSON.stringify(out, null, 1));
