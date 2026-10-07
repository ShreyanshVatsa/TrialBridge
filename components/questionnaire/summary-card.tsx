"use client";

import { Clock, Search, ShieldCheck } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import { format, useMessages } from "@/components/i18n";
import { inputClass } from "@/components/chat/primitives";
import { Button } from "@/components/ui/button";
import { LANGUAGES, type Language } from "@/lib/types/intake";
import { answerText } from "./answer-text";
import { ESSENTIAL_IDS, isEssential, type FindOutEntry, type QuestionDef, type QuestionId, type QuestionnaireState } from "./contract";
import { FindOutList } from "./find-out-list";
import { travelLabel } from "./inputs";
import { useKeyT } from "./t";

/** Summary card before the search: edit any answer, see the Find-out list and waiting questions, then search. */
export function SummaryCard({
  state,
  catalog,
  findOut,
  deepLeft,
  language,
  onLanguage,
  onEdit,
  onFill,
  onMore,
  onSearch,
}: {
  state: QuestionnaireState;
  catalog: readonly QuestionDef[];
  findOut: readonly FindOutEntry[];
  deepLeft: number;
  language: Language;
  onLanguage: (l: Language) => void;
  onEdit: (id: QuestionId) => void;
  onFill: (ids: QuestionId[]) => void;
  onMore: () => void;
  onSearch: () => void;
}) {
  const m = useMessages();
  const t = useKeyT();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const langId = useId();
  useEffect(() => headingRef.current?.focus(), []);

  const byId = new Map<string, QuestionDef>(catalog.map((q) => [q.id, q]));
  const a = state.answers;
  const rows: { id: QuestionId; label: string; value: string }[] = [];
  const cancer = byId.get("cancer_type");
  if (cancer) rows.push({ id: "cancer_type", label: m.chat.labels.cancerType, value: answerText(cancer, state, t, m) });
  rows.push({ id: "age", label: m.chat.labels.age, value: String(a.age ?? "") });
  rows.push({
    id: "zip",
    label: m.chat.labels.location,
    value: format(m.chat.locationValue, { zip: String(a.zip ?? ""), travel: travelLabel(typeof a.travel === "number" ? a.travel : null, m) }),
  });
  for (const id of state.history) {
    const q = byId.get(id);
    if (!q || isEssential(id) || a[id] === undefined) continue;
    rows.push({ id, label: t(q.labelKey), value: answerText(q, state, t, m) });
  }
  const waiting = state.deferred.filter((id) => byId.has(id));
  const anyUnknown = rows.some((r) => !(ESSENTIAL_IDS as readonly string[]).includes(r.id) && findOut.some((f) => f.question === r.id));

  return (
    <section aria-labelledby="summary-title" className="animate-fade-up space-y-5 rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div>
        <h2 id="summary-title" ref={headingRef} tabIndex={-1} className="text-2xl font-semibold outline-none">
          {t("questionnaire.ui.summaryTitle")}
        </h2>
        <p className="mt-1 text-muted-foreground">{t("questionnaire.ui.summaryIntro")}</p>
      </div>

      <ul className="divide-y divide-border">
        {rows.map((r) => (
          <li key={r.id} className="flex items-start justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="text-base text-muted-foreground">{r.label}</p>
              <p className="font-medium break-words">{r.value}</p>
            </div>
            <Button variant="ghost" onClick={() => onEdit(r.id)} aria-label={`${m.common.edit}: ${r.label}`} className="min-h-11 shrink-0">
              {m.common.edit}
            </Button>
          </li>
        ))}
      </ul>

      {anyUnknown && <p className="rounded-xl bg-secondary/60 px-4 py-3">{t("questionnaire.ui.summaryUnknownNote")}</p>}

      {waiting.length > 0 && (
        <section aria-labelledby="waiting-title" className="rounded-xl border border-border p-4">
          <h3 id="waiting-title" className="flex items-center gap-2 text-lg font-semibold">
            <Clock aria-hidden className="size-4 text-primary" />
            {t("questionnaire.ui.waitingTitle")}
          </h3>
          <p className="mt-1 text-muted-foreground">{t("questionnaire.ui.waitingIntro")}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {waiting.map((id) => {
              const label = t(byId.get(id)!.labelKey);
              return (
                <li key={id}>
                  <Button variant="outline" onClick={() => onFill([id])} className="min-h-11 h-auto whitespace-normal text-start">
                    {t("questionnaire.ui.fillIn", { question: label })}
                  </Button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <FindOutList entries={findOut} headingLevel={3} className="border-dashed" />

      {deepLeft > 0 && (
        <div className="flex flex-col gap-2 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground">{t("questionnaire.ui.moreOptionalNote")}</p>
          <Button variant="outline" onClick={onMore} className="h-auto min-h-11 whitespace-normal">
            {t("questionnaire.ui.moreOptional", { count: deepLeft })}
          </Button>
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor={langId} className="block font-medium">
          {t("questionnaire.ui.studyLanguage")}
        </label>
        <select id={langId} value={language} onChange={(e) => onLanguage(e.target.value as Language)} className={`${inputClass} max-w-sm`}>
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>
              {m.options.language[l]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button size="lg" onClick={onSearch}>
          <Search aria-hidden />
          {t("questionnaire.ui.search")}
        </Button>
        <p className="flex items-start gap-2 text-base text-muted-foreground">
          <ShieldCheck className="mt-1 size-4 shrink-0 text-primary" aria-hidden />
          {t("questionnaire.ui.privacyNote")}
        </p>
      </div>
    </section>
  );
}
