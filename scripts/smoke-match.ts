/**
 * Live smoke test of the criterion judge against Groq (one request, synthetic patient and synthetic criteria).
 * Reads GROQ_API_KEY from .dev.vars or the environment; never prints it. Usage: npx tsx scripts/smoke-match.ts
 */
import { readFileSync } from "node:fs";
import { AI_PROVIDERS } from "@/config/ai-providers";
import { createOpenAiCompatibleProvider } from "@/functions/lib/ai/openai-client";
import { CircuitBreaker } from "@/functions/lib/ai/circuit";
import { MemoryKvStore } from "@/functions/lib/store";
import { judgeCriteria } from "@/functions/lib/match";
import { MinimizedProfileSchema } from "@/lib/types/analysis";
import { numberAnswers } from "@/prompts/analyze-v3";

function devVar(name: string): string | undefined {
  if (process.env[name]) return process.env[name];
  try {
    const line = readFileSync(".dev.vars", "utf8").split("\n").find((l) => l.startsWith(`${name}=`));
    const v = line?.slice(name.length + 1).trim().replace(/^["']|["']$/g, "");
    return v || undefined;
  } catch {
    return undefined;
  }
}

const key = devVar("GROQ_API_KEY");
if (!key) {
  console.log("SKIPPED: no GROQ_API_KEY");
  process.exit(0);
}
const cfg = AI_PROVIDERS.find((p) => p.name === "groq")!;
const groq = createOpenAiCompatibleProvider(cfg, key);

// Synthetic patient (not a real person).
const profile = MinimizedProfileSchema.parse({
  cancerType: "breast",
  ageBracket: "50-59",
  spread: "yes",
  treatments: ["chemotherapy"],
  biomarkers: { HER2: "positive" },
  pregnant: "no",
  concurrentTrial: "no",
  language: "en",
  v: 2,
  activityBand: "0-1",
});
// Synthetic criteria (not from a real trial).
const items = [
  { id: "I1", section: "inclusion", text: "Age 18 years or older" },
  { id: "I2", section: "inclusion", text: "HER2-positive metastatic breast cancer" },
  { id: "I3", section: "inclusion", text: "Adequate bone marrow function (ANC >= 1500/uL)" },
  { id: "E1", section: "exclusion", text: "Pregnant or breastfeeding" },
  { id: "E2", section: "exclusion", text: "Active hepatitis B infection" },
] as const;

const t0 = Date.now();
const out = await judgeCriteria(profile, [{ trialId: "NCT99999999", criteriaVersion: 1, title: "Synthetic HER2 trial", items: [...items] }], {
  store: new MemoryKvStore(),
  providers: [groq],
  breakerFor: () => new CircuitBreaker(),
  consumeBudget: async () => true,
  log: (e) => console.log("log", JSON.stringify(e)),
});
console.log("answers", numberAnswers(profile).map((a) => `${a.id}=${a.text}`).join(" | "));
console.log("ok", out.ok, "provider", out.ok ? out.provider : null, "ms", Date.now() - t0);
for (const r of out.results) {
  console.log("coverage", r.coverage);
  for (const l of r.labels) console.log(l.id, l.label, l.source, JSON.stringify(l.answerIds), l.reason ?? "");
}
