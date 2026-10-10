"use client";

import { Clock, HeartHandshake, Lock, SkipForward, Sparkles } from "lucide-react";
import { useId } from "react";
import { useKeyT } from "./t";

/**
 * First thing a patient sees: what this is, how long it takes, what stays on the device, and that every
 * optional question can be skipped. The caregiver switch only changes wording; no identity is stored.
 */
export function IntroPanel({ caregiver, onCaregiver }: { caregiver: boolean; onCaregiver: (v: boolean) => void }) {
  const t = useKeyT();
  const id = useId();
  const items = [
    { Icon: Clock, text: t("questionnaire.ui.introTime") },
    { Icon: SkipForward, text: t("questionnaire.ui.introSkip") },
    { Icon: Lock, text: t("questionnaire.ui.introPrivate") },
    { Icon: Sparkles, text: t("questionnaire.ui.introFree") },
  ];
  return (
    <section aria-labelledby={`${id}-t`} className="tb-surface animate-enter relative overflow-hidden rounded-3xl p-5 sm:p-7">
      <div aria-hidden className="tb-ambient pointer-events-none absolute inset-x-0 top-0 h-40 opacity-70" />
      <div className="relative">
        <h2 id={`${id}-t`} className="text-[1.75rem] leading-[1.02] font-bold [font-stretch:72%] sm:text-[2rem]">
          {t("questionnaire.ui.introTitle")}
        </h2>
        <p className="mt-2 text-muted-foreground">{t("questionnaire.ui.introLead")}</p>
      </div>
      <ul className="relative mt-5 grid gap-3 sm:grid-cols-2">
        {items.map(({ Icon, text }) => (
          <li key={text} className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background/50 p-3.5">
            <span aria-hidden className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground shadow-[inset_0_1px_0_oklch(1_0_0/0.5),0_4px_10px_-6px_var(--iris)]">
              <Icon className="size-4" />
            </span>
            <span className="pt-1 leading-snug">{text}</span>
          </li>
        ))}
      </ul>
      {/* A real checkbox, drawn as a switch: it only changes wording, nothing is stored about anyone. */}
      <label className="relative mt-4 flex min-h-11 cursor-pointer items-center gap-4 rounded-2xl border border-border bg-card px-4 py-3.5 transition-colors hover:border-primary/40 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring">
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2 font-medium">
            <HeartHandshake aria-hidden className="size-4 shrink-0 text-primary" />
            {t("questionnaire.ui.caregiverToggle")}
          </span>
          <span className="block text-base text-muted-foreground">{t("questionnaire.ui.caregiverHelp")}</span>
        </span>
        {/* The real checkbox lies, invisible, exactly over the drawn switch, so pointer, keyboard and tests all hit it. */}
        <span className="relative inline-flex shrink-0">
          <input
            type="checkbox"
            checked={caregiver}
            onChange={(e) => onCaregiver(e.target.checked)}
            className="peer absolute inset-0 z-10 m-0 size-full cursor-pointer opacity-0"
          />
          <span
            aria-hidden
            className="inline-flex h-7 w-12 items-center rounded-full border border-input bg-muted p-0.5 shadow-[inset_0_1px_3px_oklch(0.2_0.06_295/0.2)] transition-colors duration-300 peer-checked:border-primary peer-checked:bg-primary peer-checked:[&>span]:translate-x-5 rtl:peer-checked:[&>span]:-translate-x-5"
          >
            <span className="size-[1.375rem] rounded-full bg-card shadow-[inset_0_1px_0_oklch(1_0_0),0_1px_3px_oklch(0.2_0.06_295/0.4)] transition-transform duration-300 ease-[cubic-bezier(0.2,1.4,0.4,1)]" />
          </span>
        </span>
      </label>
    </section>
  );
}
