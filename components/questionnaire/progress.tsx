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
    : "";
  const [shown, setShown] = useState(text);
  useEffect(() => {
    if (text === shown) return;
    const id = setTimeout(() => setShown(text), 500);
    return () => clearTimeout(id);
  }, [text, shown]);
  return (
    <p className={cn("text-base font-medium", className)}>
      <span className="sr-only">{t("questionnaire.ui.counterLabel")}: </span>
      <span aria-live="polite" aria-atomic="true" data-testid="live-counter">
        {shown}
      </span>
    </p>
  );
}

/** Tier steps ("Essentials · Helpful · Extra detail") with an honest estimate instead of a percentage. */
export function TierProgress({ tier, remaining, count }: { tier: Tier | "summary"; remaining: number | null; count: LiveCount | null }) {
  const t = useKeyT();
  const currentIdx = tier === "summary" ? TIERS.length : TIERS.indexOf(tier);
  return (
    <div className="rounded-2xl border border-border bg-card px-4 py-3">
      <nav aria-label={t("questionnaire.ui.progressLabel")}>
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-base">
          {TIERS.map((x, i) => {
            const done = i < currentIdx;
            const current = i === currentIdx;
            return (
              <li key={x} aria-current={current ? "step" : undefined} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden className="text-muted-foreground">·</span>}
                <span
                  aria-hidden
                  className={cn(
                    "flex size-5 items-center justify-center rounded-full border-2",
                    done ? "border-primary bg-primary text-primary-foreground" : current ? "border-primary" : "border-muted-foreground/60",
                  )}
                >
                  {done && <Check className="size-3" />}
                </span>
                <span className={cn(current ? "font-semibold text-foreground" : "text-muted-foreground")}>{t(`questionnaire.ui.tiers.${x}`)}</span>
              </li>
            );
          })}
        </ol>
      </nav>
      <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <LiveCounter count={count} />
        {remaining !== null && tier !== "summary" && (
          <p className="text-base text-muted-foreground">
            {remaining > 0 ? t("questionnaire.ui.remaining", { count: remaining }) : t("questionnaire.ui.remainingNone")}
          </p>
        )}
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
