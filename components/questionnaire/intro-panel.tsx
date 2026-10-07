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
    <section aria-labelledby={`${id}-t`} className="space-y-4 rounded-2xl border border-border bg-secondary/40 p-5 sm:p-6">
      <div>
        <h2 id={`${id}-t`} className="text-xl font-semibold sm:text-2xl">
          {t("questionnaire.ui.introTitle")}
        </h2>
        <p className="mt-1 text-muted-foreground">{t("questionnaire.ui.introLead")}</p>
      </div>
      <ul className="space-y-2">
        {items.map(({ Icon, text }) => (
          <li key={text} className="flex items-start gap-3">
            <Icon aria-hidden className="mt-1 size-4 shrink-0 text-primary" />
            <span>{text}</span>
          </li>
        ))}
      </ul>
      <label className="flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border border-border bg-card px-4 py-3 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring">
        <input type="checkbox" checked={caregiver} onChange={(e) => onCaregiver(e.target.checked)} className="mt-1 size-5 shrink-0 accent-[var(--primary)]" />
        <span>
          <span className="flex items-center gap-2 font-medium">
            <HeartHandshake aria-hidden className="size-4 text-primary" />
            {t("questionnaire.ui.caregiverToggle")}
          </span>
          <span className="block text-base text-muted-foreground">{t("questionnaire.ui.caregiverHelp")}</span>
        </span>
      </label>
    </section>
  );
}
