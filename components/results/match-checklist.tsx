"use client";

import { AlertTriangle, ChevronDown, CircleCheck, CircleHelp, CircleX } from "lucide-react";
import type { ReactNode } from "react";
import { format, useMessages, useT } from "@/components/i18n";
import type { CriterionLabel, CriterionLabelValue, SplitCriterionRecord as SplitCriterion, TrialMatchScore } from "@/lib/types";
import { cn } from "@/lib/utils";

/** What the results UI needs per trial from step 5 (score + per-criterion labels). */
export interface TrialMatchView {
  score: TrialMatchScore;
  labels: CriterionLabel[];
}

type Mark = "pass" | "fail" | "unknown" | "na";

export function markOf(label: CriterionLabelValue): Mark {
  switch (label) {
    case "met":
    case "not_excluded":
      return "pass";
    case "not_met":
    case "excluded":
      return "fail";
    case "unknown":
      return "unknown";
    default:
      return "na";
  }
}

/** Our stored criterion text by id; the model's text is never shown. */
function byId(criteria: readonly SplitCriterion[] | undefined): Map<string, SplitCriterion> {
  return new Map((criteria ?? []).map((c) => [c.id, c]));
}

function criterionNumber(id: string): string {
  return id.replace(/^[IE]/, "");
}

const markIcon: Record<Exclude<Mark, "na">, ReactNode> = {
  pass: <CircleCheck className="size-5 text-success-foreground" aria-hidden />,
  fail: <CircleX className="size-5 text-warn-foreground" aria-hidden />,
  unknown: <CircleHelp className="size-5 text-muted-foreground" aria-hidden />,
};

function CriterionRow({ label, criterion }: { label: CriterionLabel; criterion: SplitCriterion }) {
  const m = useMessages();
  const mark = markOf(label.label) as Exclude<Mark, "na">;
  return (
    <li data-mark={mark} data-id={label.id} className="grid grid-cols-[1.5rem_1fr] gap-3 py-3">
      <span className="pt-0.5">{markIcon[mark]}</span>
      <div className="min-w-0 space-y-1">
        <p className={cn("text-sm font-semibold", mark === "fail" ? "text-warn-foreground" : mark === "pass" ? "text-success-foreground" : "text-foreground")}>
          {m.match.status[label.label]}
          <span className="font-normal text-muted-foreground">
            {" · "}
            {format(m.card.criterionRef[criterion.section], { n: criterionNumber(criterion.id) })}
            {label.source !== "default" && ` · ${m.match.source[label.source]}`}
          </span>
        </p>
        {criterion.scope && (
          <p lang="en" className="text-sm text-muted-foreground">
            {criterion.scope}
          </p>
        )}
        <blockquote lang="en" className="border-s-2 border-primary/40 ps-3 whitespace-pre-line text-foreground/90">
          {criterion.text}
        </blockquote>
        {label.reason && <p className="text-sm text-muted-foreground">{label.reason}</p>}
      </div>
    </li>
  );
}

/**
 * Per-trial expandable checklist: ✓ looks met / ✗ may not fit / ? unknown, each with OUR stored criterion text
 * (looked up by id), the plain-English reason and who settled it. Not-applicable items are counted, not listed.
 */
export function CriteriaChecklist({
  labels,
  criteria,
  defaultOpen = false,
  className,
}: {
  labels: readonly CriterionLabel[];
  criteria: readonly SplitCriterion[] | undefined;
  defaultOpen?: boolean;
  className?: string;
}) {
  const m = useMessages();
  const { t } = useT();
  const lookup = byId(criteria);
  const shown = labels.filter((l) => markOf(l.label) !== "na" && lookup.has(l.id));
  const naCount = labels.filter((l) => markOf(l.label) === "na" && lookup.has(l.id)).length;
  if (shown.length === 0 && naCount === 0) return null;

  const tally = { pass: 0, fail: 0, unknown: 0 };
  for (const l of shown) tally[markOf(l.label) as keyof typeof tally]++;
  const sections = (["inclusion", "exclusion"] as const)
    .map((section) => ({ section, rows: shown.filter((l) => lookup.get(l.id)!.section === section) }))
    .filter((s) => s.rows.length > 0);

  return (
    <details open={defaultOpen} className={cn("group rounded-2xl border border-border bg-card/60", className)}>
      <summary className="flex min-h-11 cursor-pointer list-none flex-wrap items-center gap-x-4 gap-y-1 rounded-2xl px-4 py-3 [&::-webkit-details-marker]:hidden">
        <span className="font-sans text-base font-semibold">{m.match.checklistShow}</span>
        <span className="flex flex-wrap gap-x-3 text-sm text-muted-foreground">
          <span>✓ {format(m.match.counts.met, { n: tally.pass })}</span>
          <span>✗ {format(m.match.counts.fail, { n: tally.fail })}</span>
          <span>? {format(m.match.counts.unknown, { n: tally.unknown })}</span>
        </span>
        <ChevronDown className="ms-auto size-5 shrink-0 transition-transform group-open:rotate-180" aria-hidden />
      </summary>
      <div className="border-t border-border px-4 pb-4">
        <p className="pt-3 text-sm text-muted-foreground">{m.match.checklistIntro}</p>
        {sections.map(({ section, rows }) => (
          <section key={section} className="mt-3">
            <h5 className="font-sans text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              {section === "inclusion" ? m.match.inclusionHeading : m.match.exclusionHeading}
            </h5>
            <ul className="divide-y divide-border/70">
              {rows.map((l) => (
                <CriterionRow key={l.id} label={l} criterion={lookup.get(l.id)!} />
              ))}
            </ul>
          </section>
        ))}
        {naCount > 0 && <p className="mt-3 text-sm text-muted-foreground">{t("match.notApplicable", { count: naCount })}</p>}
      </div>
    </details>
  );
}

/** One-line "why ranked here": tier, how many checkable requirements look met, and what is still unknown. */
export function WhyRankedLine({ score, position, className }: { score: TrialMatchScore; position: number; className?: string }) {
  const m = useMessages();
  const { t } = useT();
  const { counts } = score;
  const checked = counts.met + counts.notMet + counts.unknown;
  let text: string;
  if (score.tier === "B") {
    text = t("match.whyTierB", { count: Math.max(1, score.hardFailures.length), pos: position });
  } else {
    text = counts.met > 0 ? format(m.match.whyTierA, { pos: position, met: counts.met, checked }) : format(m.match.whyTierANone, { pos: position });
    if (counts.unknown > 0) text += ` ${t("match.whyUnknown", { count: counts.unknown })}`;
  }
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>
      <span className="font-semibold text-foreground">{m.match.whyRanked}: </span>
      {text}
    </p>
  );
}

/** Tier B card note: the failing requirement(s) as our stored text plus the reason. */
export function HardFailureNote({ failures, criteria, className }: { failures: readonly CriterionLabel[]; criteria: readonly SplitCriterion[] | undefined; className?: string }) {
  const m = useMessages();
  const lookup = byId(criteria);
  const rows = failures.filter((f) => lookup.has(f.id));
  if (rows.length === 0) return null;
  return (
    <div className={cn("rounded-2xl border border-warn-border bg-warn/60 p-4 text-warn-foreground", className)}>
      <p className="flex items-center gap-2 font-semibold">
        <AlertTriangle className="size-4 shrink-0" aria-hidden />
        {m.match.hardFailureTitle}
      </p>
      <ul className="mt-2 space-y-3">
        {rows.map((f) => {
          const c = lookup.get(f.id)!;
          return (
            <li key={f.id} className="text-foreground">
              <blockquote lang="en" className="border-s-2 border-warn-border ps-3 whitespace-pre-line">
                {c.text}
              </blockquote>
              <p className="mt-1 ps-3 text-sm text-muted-foreground">
                {format(m.card.criterionRef[c.section], { n: criterionNumber(c.id) })}
                {f.reason && ` · ${f.reason}`}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Heading above the tier B list. */
export function TierBHeader({ id = "tier-b", className }: { id?: string; className?: string }) {
  const m = useMessages();
  return (
    <div className={cn("border-t border-foreground/12 pt-6", className)}>
      <h2 id={id} className="text-[clamp(1.5rem,3vw,2rem)] leading-[1.05] font-bold [font-stretch:70%]">
        {m.match.tierBTitle}
      </h2>
      <p className="mt-2 max-w-prose text-muted-foreground">{m.match.tierBIntro}</p>
    </div>
  );
}

/** Shown when no real LLM answered and labels are resolver-only. */
export function DegradedMatchBanner({ className }: { className?: string }) {
  const m = useMessages();
  return (
    <div role="note" className={cn("flex items-start gap-3 rounded-2xl border border-warn-border bg-warn px-4 py-3 text-warn-foreground", className)}>
      <AlertTriangle className="mt-1 size-4 shrink-0" aria-hidden />
      <p>{m.match.degraded}</p>
    </div>
  );
}
