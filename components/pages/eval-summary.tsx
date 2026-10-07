"use client";

import { z } from "zod";
import evalResults from "@/eval/results.json";
import { format, localeFor, useLanguage, useMessages } from "@/components/i18n";
import { formatDate } from "@/components/format";

/** Shape of eval/results.json (written by `npm run eval`); validated so a format change can't break the page. */
const EvalSchema = z.object({
  date: z.string(),
  profiles: z.number(),
  cancerTypes: z.number(),
  hardFilterViolationRate: z.number(),
  variants: z.array(z.object({ name: z.string(), sysRecall: z.number(), sysNdcg: z.number() })).min(1),
  facts: z.object({ sample: z.number(), correct: z.number(), precision: z.number() }),
  mockAi: z.object({ quotes: z.number(), quotePassRate: z.number() }),
});

const parsed = EvalSchema.safeParse(evalResults);

/** Headline evaluation numbers. Uses the production variant (first row, marked "production"). */
export function EvalSummary() {
  const m = useMessages().pages.methodology;
  const locale = localeFor(useLanguage());
  if (!parsed.success) return null;
  const e = parsed.data;
  const prod = e.variants.find((v) => v.name.includes("production")) ?? e.variants[0];
  if (!prod) return null;
  const pctFmt = (x: number) => `${(x * 100).toFixed(1)}%`;
  const rows = [
    { label: m.evalViolations, value: pctFmt(e.hardFilterViolationRate) },
    { label: m.evalRecall, value: prod.sysRecall.toFixed(2) },
    { label: m.evalNdcg, value: prod.sysNdcg.toFixed(2) },
    { label: format(m.evalFacts, { correct: e.facts.correct, sample: e.facts.sample }), value: pctFmt(e.facts.precision) },
    { label: format(m.evalQuotes, { quotes: e.mockAi.quotes }), value: pctFmt(e.mockAi.quotePassRate) },
  ];
  return (
    <div className="mt-4 space-y-3">
      <p className="rounded-xl border border-warn-border bg-warn px-4 py-3 text-sm text-warn-foreground">
        {format(m.evalProvisional, { profiles: e.profiles, types: e.cancerTypes, date: formatDate(e.date, locale) })}
      </p>
      <dl className="divide-y divide-border rounded-2xl border border-border bg-card">
        {rows.map((r) => (
          <div key={r.label} className="flex items-baseline justify-between gap-4 px-4 py-3">
            <dt>{r.label}</dt>
            <dd className="font-heading text-xl font-semibold text-primary tabular-nums">{r.value}</dd>
          </div>
        ))}
      </dl>
      <p className="text-sm text-muted-foreground">{m.evalReport}</p>
    </div>
  );
}
