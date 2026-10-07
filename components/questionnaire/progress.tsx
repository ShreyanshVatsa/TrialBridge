"use client";

import { Check } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { cn } from "@/lib/utils";
import type { LiveCount, Tier } from "./contract";
import { useKeyT } from "./t";

const TIERS: Tier[] = ["essential", "helpful", "deep"];

/** "N possible trials near you · M with no likely conflicts", debounced 500 ms, announced politely only on change. */
export function LiveCounter({ count, className }: { count: LiveCount | null; className?: string }) {
  const t = useKeyT();
  const text = count
    ? `${t("questionnaire.ui.counter", { count: count.total })}${count.noConflict !== count.total ? ` · ${t("questionnaire.ui.counterNoConflict", { count: count.noConflict })}` : ""}`
    : t("questionnaire.ui.counterWaiting");
  const [shown, setShown] = useState(text);
  useEffect(() => {
    if (text === shown) return;
    const id = setTimeout(() => setShown(text), 500);
    return () => clearTimeout(id);
  }, [text, shown]);
  return (
    <p className={cn("text-base font-medium", !count && "font-normal text-muted-foreground", className)}>
      <span className="sr-only">{t("questionnaire.ui.counterLabel")}: </span>
      <span aria-live="polite" aria-atomic="true" data-testid="live-counter">
        {shown}
      </span>
    </p>
  );
}

/** Three-segment step bar ("Essentials, Helpful, Extra detail") with an honest range instead of a percentage. */
export function TierProgress({ tier, remaining, count }: { tier: Tier | "summary"; remaining: number | null; count: LiveCount | null }) {
  const t = useKeyT();
  const currentIdx = tier === "summary" ? TIERS.length : TIERS.indexOf(tier);
  // The engine decides when to stop, so show a range (never a fake exact number).
  const remainingText =
    remaining === null || tier === "summary"
      ? null
      : remaining <= 0
        ? t("questionnaire.ui.remainingNone")
        : remaining <= 2
          ? t("questionnaire.ui.remainingFew")
          : t("questionnaire.ui.remainingRange", { low: Math.max(2, remaining - 1), high: remaining + 2 });
  return (
    <div className="rounded-2xl border border-border bg-card px-4 py-3">
      <nav aria-label={t("questionnaire.ui.progressLabel")}>
        <ol className="grid grid-cols-3 gap-2">
          {TIERS.map((x, i) => {
            const done = i < currentIdx;
            const current = i === currentIdx;
            return (
              <li key={x} aria-current={current ? "step" : undefined} className="min-w-0 space-y-1">
                <span aria-hidden className={cn("block h-1.5 rounded-full motion-safe:transition-colors", done ? "bg-primary" : current ? "bg-primary/60" : "bg-muted")} />
                <span className={cn("flex items-center gap-1 text-base leading-tight", current ? "font-semibold text-foreground" : "text-muted-foreground")}>
                  {done && <Check aria-hidden className="size-4 shrink-0 text-primary" />}
                  <span className="min-w-0 break-words">{t(`questionnaire.ui.tiers.${x}`)}</span>
                  {done && <span className="sr-only">{t("questionnaire.ui.stepDone")}</span>}
                </span>
              </li>
            );
          })}
        </ol>
      </nav>
      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <LiveCounter count={count} />
        {remainingText && <p className="text-base text-muted-foreground">{remainingText}</p>}
      </div>
    </div>
  );
}

/** Quick / Thorough segmented control (a radio group, changeable at any time). */
export function ModeToggle({ mode, onChange }: { mode: "quick" | "thorough"; onChange: (m: "quick" | "thorough") => void }) {
  const t = useKeyT();
  const name = useId();
  const labelId = useId();
  const opts = [
    { id: "quick" as const, label: t("questionnaire.ui.modeQuick"), help: t("questionnaire.ui.modeQuickHelp") },
    { id: "thorough" as const, label: t("questionnaire.ui.modeThorough"), help: t("questionnaire.ui.modeThoroughHelp") },
  ];
  return (
    <div className="space-y-2">
      <p id={labelId} className="font-medium">
        {t("questionnaire.ui.modeLabel")} <span className="font-normal text-muted-foreground">{t("questionnaire.ui.modeNote")}</span>
      </p>
      <div role="radiogroup" aria-labelledby={labelId} className="inline-grid w-full grid-cols-2 gap-1 rounded-xl border border-border bg-muted/60 p-1 sm:w-auto">
        {opts.map((o) => {
          const on = mode === o.id;
          return (
            <label
              key={o.id}
              className={cn(
                "flex min-h-11 cursor-pointer flex-col justify-center rounded-lg px-4 py-2 text-start has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ring",
                on ? "bg-card font-semibold shadow-sm ring-1 ring-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <input type="radio" name={name} value={o.id} checked={on} onChange={() => onChange(o.id)} className="sr-only" />
              <span className={cn(on ? "text-foreground" : "")}>{o.label}</span>
              <span className="text-base font-normal text-muted-foreground">{o.help}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
