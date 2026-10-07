"use client";

import { RotateCcw, Search, ShieldCheck } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { BIOMARKERS, BIOMARKERS_BY_GROUP, type BiomarkerId } from "@/config/biomarkers";
import { PICKABLE_GROUPS, type CancerGroupId } from "@/config/cancer-groups";
import { format, useMessages, type Messages } from "@/components/i18n";
import { Button } from "@/components/ui/button";
import { lookupZip } from "@/lib/data/loader";
import {
  AgeSchema,
  IntakeAnswersSchema,
  LANGUAGES,
  TRAVEL_OPTIONS,
  TREATMENTS,
  ZipSchema,
  type BiomarkerStatus,
  type IntakeAnswers,
  type Treatment,
} from "@/lib/types";
import { LogoMark } from "@/components/site/logo";
import { TypingDots } from "@/components/site/spinner";
import { AssistantBubble, Chips, UserBubble, inputClass } from "./primitives";

type Draft = Partial<IntakeAnswers>;
type StepId = "cancerType" | "zip" | "travel" | "age" | "language" | "spread" | "treatments" | "biomarkers" | "pregnant" | "inAnotherTrial";

const STEP_ORDER: StepId[] = ["cancerType", "zip", "travel", "age", "language", "spread", "treatments", "biomarkers", "pregnant", "inAnotherTrial"];
const BIOMARKER_STATUSES = ["positive", "negative", "dont_know"] as const;

function biomarkersFor(cancerType: CancerGroupId | undefined): BiomarkerId[] {
  return cancerType ? BIOMARKERS_BY_GROUP[cancerType] : [];
}

function isApplicable(step: StepId, draft: Draft): boolean {
  return step !== "biomarkers" || biomarkersFor(draft.cancerType).length > 0;
}

function isAnswered(step: StepId, draft: Draft): boolean {
  switch (step) {
    case "travel":
      return draft.travelMiles !== undefined;
    case "biomarkers":
      return draft.biomarkers !== undefined;
    default:
      return draft[step] !== undefined;
  }
}

function travelLabel(miles: number | null, m: Messages): string {
  return miles === null ? m.chat.travelAnywhere : format(m.chat.travelOption, { miles });
}

/** Translated name when the label is a phrase; gene/protein symbols (HER2, EGFR, ...) stay as-is. */
function biomarkerLabel(id: BiomarkerId, m?: Messages): string {
  const names: Partial<Record<string, string>> | undefined = m?.biomarkerNames;
  return names?.[id] ?? BIOMARKERS.find((b) => b.id === id)?.label ?? id;
}

function questionFor(step: StepId, m: Messages): string {
  const q: Record<StepId, string> = {
    cancerType: m.chat.cancerQ,
    zip: m.chat.zipQ,
    travel: m.chat.travelQ,
    age: m.chat.ageQ,
    language: m.chat.languageQ,
    spread: m.chat.spreadQ,
    treatments: m.chat.treatmentsQ,
    biomarkers: m.chat.biomarkersQ,
    pregnant: m.chat.pregnantQ,
    inAnotherTrial: m.chat.trialQ,
  };
  return q[step];
}

function answerText(step: StepId, d: Draft, m: Messages): string {
  switch (step) {
    case "cancerType":
      return d.cancerType ? m.cancerGroups[d.cancerType] : "";
    case "zip":
      return d.zip ?? "";
    case "travel":
      return d.travelMiles === undefined ? "" : travelLabel(d.travelMiles, m);
    case "age":
      return d.age === undefined ? "" : String(d.age);
    case "language":
      return d.language ? m.options.language[d.language] : "";
    case "spread":
      return d.spread ? m.options.spread[d.spread] : "";
    case "treatments":
      return (d.treatments ?? []).map((t) => m.options.treatment[t]).join(", ");
    case "biomarkers": {
      const entries = Object.entries(d.biomarkers ?? {}) as [BiomarkerId, BiomarkerStatus][];
      return entries.length ? entries.map(([id, s]) => `${biomarkerLabel(id, m)}: ${m.options.biomarker[s]}`).join(" · ") : m.chat.none;
    }
    case "pregnant":
      return d.pregnant ? m.options.pregnant[d.pregnant] : "";
    case "inAnotherTrial":
      return d.inAnotherTrial ? m.options.yesNo[d.inAnotherTrial] : "";
  }
}

/** Moves keyboard focus into a newly shown question widget (skipped on first page render). */
function FocusOnMount({ children, enabled }: { children: ReactNode; enabled: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!enabled) return;
    const el = ref.current?.querySelector<HTMLElement>("input, button:not([disabled]), select");
    el?.focus({ preventScroll: false });
    ref.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [enabled]);
  return (
    <div ref={ref} className="animate-fade-up pl-9.5">
      {children}
    </div>
  );
}

/** Shows a brief "typing" bubble before a new question's text appears; the answer controls render at once (skipped for reduced motion / first load). */
function TypingReveal({ enabled, children }: { enabled: boolean; children: ReactNode }) {
  const m = useMessages();
  const [shown, setShown] = useState(
    () => !enabled || (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches),
  );
  useEffect(() => {
    if (shown) return;
    const t = setTimeout(() => setShown(true), 350);
    return () => clearTimeout(t);
  }, [shown]);
  if (shown) return <>{children}</>;
  return (
    <div className="flex items-end gap-2.5">
      <LogoMark className="mb-0.5 size-7" />
      <div className="rounded-2xl rounded-bl-md bg-bubble px-4 py-3.5 text-muted-foreground">
        <TypingDots label={m.chat.typing} />
      </div>
    </div>
  );
}

/* ---------- Individual question widgets ---------- */

function CancerTypeInput({ onAnswer }: { onAnswer: (v: CancerGroupId) => void }) {
  const m = useMessages();
  const [query, setQuery] = useState("");
  const inputId = useId();
  const hintId = useId();
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PICKABLE_GROUPS;
    return PICKABLE_GROUPS.filter(
      (g) =>
        g.label.toLowerCase().includes(q) ||
        m.cancerGroups[g.id].toLowerCase().includes(q) ||
        g.synonyms.some((s) => s.toLowerCase().includes(q)),
    );
  }, [query, m]);
  return (
    <div className="space-y-3">
      <label htmlFor={inputId} className="sr-only">
        {m.chat.cancerSearch}
      </label>
      <input
        id={inputId}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          // Enter picks the top match, so keyboard users can type and confirm.
          const first = filtered[0];
          if (e.key === "Enter" && query.trim() && first) {
            e.preventDefault();
            onAnswer(first.id);
          }
        }}
        placeholder={m.chat.cancerSearch}
        aria-describedby={hintId}
        autoComplete="off"
        className={inputClass}
      />
      <p id={hintId} className="text-sm text-muted-foreground">
        {m.chat.cancerSearchHint}
      </p>
      {filtered.length === 0 && <p className="text-muted-foreground">{m.chat.cancerNoMatch}</p>}
      <Chips
        label={m.chat.labels.cancerType}
        options={[...filtered.map((g) => ({ value: g.id, label: m.cancerGroups[g.id] })), { value: "other" as const, label: m.chat.cancerOther }]}
        onSelect={onAnswer}
      />
    </div>
  );
}

function ZipInput({ initial, onAnswer }: { initial?: string; onAnswer: (zip: string) => void }) {
  const m = useMessages();
  const [value, setValue] = useState(initial ?? "");
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const inputId = useId();
  const errId = useId();

  async function submit(e: FormEvent) {
    e.preventDefault();
    const parsed = ZipSchema.safeParse(value.trim());
    if (!parsed.success) return setError(m.chat.zipInvalid);
    setChecking(true);
    setError(null);
    try {
      // Lookup happens on-device from static data; the ZIP is never sent to our backend.
      const found = await lookupZip(parsed.data);
      if (!found) {
        setError(m.chat.zipUnknown);
        return;
      }
    } catch {
      // ZIP table unavailable (offline?): accept the format-valid ZIP; search will retry the lookup.
    } finally {
      setChecking(false);
    }
    onAnswer(parsed.data);
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-2">
      <label htmlFor={inputId} className="block text-sm font-medium">
        {m.chat.zipLabel}
      </label>
      <div className="flex gap-2">
        <input
          id={inputId}
          value={value}
          onChange={(e) => setValue(e.target.value.replace(/\D/g, "").slice(0, 5))}
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={5}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errId : undefined}
          className={`${inputClass} max-w-40 tracking-widest`}
        />
        <Button type="submit" disabled={checking} className="h-12 px-5">
          {m.common.continue}
        </Button>
      </div>
      <p id={errId} aria-live="polite" className="min-h-6 text-sm text-destructive">
        {checking ? <span className="text-muted-foreground">{m.chat.zipChecking}</span> : error}
      </p>
    </form>
  );
}

function AgeInput({ initial, onAnswer }: { initial?: number; onAnswer: (age: number) => void }) {
  const m = useMessages();
  const [value, setValue] = useState(initial === undefined ? "" : String(initial));
  const [error, setError] = useState<string | null>(null);
  const [minor, setMinor] = useState(false);
  const inputId = useId();
  const errId = useId();

  function submit(e: FormEvent) {
    e.preventDefault();
    const n = Number(value);
    if (value.trim() !== "" && Number.isInteger(n) && n >= 0 && n < 18) {
      setMinor(true);
      return;
    }
    const parsed = AgeSchema.safeParse(n);
    if (value.trim() === "" || !parsed.success) return setError(m.chat.ageInvalid);
    onAnswer(parsed.data);
  }

  if (minor) {
    return (
      <div role="alert" className="space-y-3 rounded-2xl border border-border bg-card p-5">
        <h3 className="text-lg font-semibold">{m.chat.under18Title}</h3>
        <p>{m.chat.under18Body}</p>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://clinicaltrials.gov/search?cond=Cancer&aggFilters=ages:child,status:rec"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline underline-offset-4"
          >
            {m.chat.under18Link} <span className="sr-only">{m.common.opensNewTab}</span>
          </a>
          <Button
            variant="outline"
            onClick={() => {
              setMinor(false);
              setValue("");
            }}
          >
            {m.chat.under18Change}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-2">
      <label htmlFor={inputId} className="block text-sm font-medium">
        {m.chat.ageLabel}
      </label>
      <div className="flex gap-2">
        <input
          id={inputId}
          value={value}
          onChange={(e) => {
            setValue(e.target.value.replace(/\D/g, "").slice(0, 3));
            setError(null);
          }}
          inputMode="numeric"
          maxLength={3}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errId : undefined}
          className={`${inputClass} max-w-28`}
        />
        <Button type="submit" className="h-12 px-5">
          {m.common.continue}
        </Button>
      </div>
      <p id={errId} aria-live="polite" className="min-h-6 text-sm text-destructive">
        {error}
      </p>
    </form>
  );
}

function TreatmentsInput({ initial, onAnswer }: { initial?: Treatment[]; onAnswer: (t: Treatment[]) => void }) {
  const m = useMessages();
  const [selected, setSelected] = useState<Treatment[]>(initial ?? []);
  const exclusive: Treatment[] = ["none", "not_sure"];
  function toggle(t: Treatment) {
    setSelected((prev) => {
      if (prev.includes(t)) return prev.filter((x) => x !== t);
      if (exclusive.includes(t)) return [t];
      return [...prev.filter((x) => !exclusive.includes(x)), t];
    });
  }
  return (
    <div className="space-y-3">
      <Chips
        multi
        label={m.chat.labels.treatments}
        options={TREATMENTS.map((t) => ({ value: t, label: m.options.treatment[t] }))}
        selected={selected}
        onSelect={toggle}
      />
      <div className="flex items-center gap-3">
        <Button onClick={() => onAnswer(selected)} disabled={selected.length === 0}>
          {m.common.continue}
        </Button>
        {selected.length === 0 && <span className="text-sm text-muted-foreground">{m.chat.treatmentsHint}</span>}
      </div>
    </div>
  );
}

function BiomarkersInput({
  ids,
  initial,
  onAnswer,
}: {
  ids: BiomarkerId[];
  initial?: Partial<Record<BiomarkerId, BiomarkerStatus>>;
  onAnswer: (b: Partial<Record<BiomarkerId, BiomarkerStatus>>) => void;
}) {
  const m = useMessages();
  const [values, setValues] = useState<Partial<Record<BiomarkerId, BiomarkerStatus>>>(() =>
    Object.fromEntries(ids.map((id) => [id, initial?.[id] ?? "dont_know"])),
  );
  return (
    <div className="space-y-4">
      {ids.map((id) => (
        <fieldset key={id} className="space-y-2">
          <legend className="font-medium">{biomarkerLabel(id, m)}</legend>
          <Chips
            multi
            label={format(m.chat.biomarkerGroup, { name: biomarkerLabel(id, m) })}
            options={BIOMARKER_STATUSES.map((s) => ({ value: s, label: m.options.biomarker[s] }))}
            selected={values[id] ? [values[id]] : []}
            onSelect={(s) => setValues((prev) => ({ ...prev, [id]: s }))}
          />
        </fieldset>
      ))}
      <Button onClick={() => onAnswer(values)}>{m.common.continue}</Button>
    </div>
  );
}

/* ---------- Summary ---------- */

function Summary({
  draft,
  steps,
  onEdit,
  onSearch,
}: {
  draft: Draft;
  steps: StepId[];
  onEdit: (s: StepId) => void;
  onSearch: (answers: IntakeAnswers) => void;
}) {
  const m = useMessages();
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => headingRef.current?.focus(), []);
  const rows: { step: StepId; label: string; value: string }[] = steps
    .filter((s) => s !== "travel")
    .map((s) => ({
      step: s,
      label: s === "zip" ? m.chat.labels.location : m.chat.labels[s],
      value:
        s === "zip"
          ? format(m.chat.locationValue, { zip: draft.zip ?? "", travel: travelLabel(draft.travelMiles ?? null, m) })
          : answerText(s, draft, m),
    }));
  const parsed = IntakeAnswersSchema.safeParse({ biomarkers: {}, ...draft });

  return (
    <section aria-labelledby="summary-title" className="animate-fade-up rounded-2xl border border-border bg-card p-5 sm:p-6">
      <h2 id="summary-title" ref={headingRef} tabIndex={-1} className="text-2xl font-semibold outline-none">
        {m.chat.summaryTitle}
      </h2>
      <p className="mt-1 text-muted-foreground">{m.chat.summaryIntro}</p>
      <ul className="mt-4 divide-y divide-border">
        {rows.map((r) => (
          <li key={r.step} className="flex items-start justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">{r.label}</p>
              <p className="font-medium break-words">{r.value}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onEdit(r.step)} aria-label={`${m.common.edit}: ${r.label}`}>
              {m.common.edit}
            </Button>
          </li>
        ))}
      </ul>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button size="lg" disabled={!parsed.success} onClick={() => parsed.success && onSearch(parsed.data)}>
          <Search aria-hidden />
          {m.chat.search}
        </Button>
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="size-4 text-primary" aria-hidden />
          {m.chat.privacyNote}
        </p>
      </div>
    </section>
  );
}

/* ---------- Chat ---------- */

export function IntakeChat({
  draft,
  setDraft,
  onSearch,
}: {
  draft: Draft;
  setDraft: (d: Draft) => void;
  onSearch: (answers: IntakeAnswers) => void;
}) {
  const m = useMessages();
  const [editing, setEditing] = useState<StepId | null>(null);
  // Focus moves into new questions only after the user has interacted (not on first page load).
  const [interacted, setInteracted] = useState(Object.keys(draft).length > 0);

  const steps = STEP_ORDER.filter((s) => isApplicable(s, draft));
  const active = editing ?? steps.find((s) => !isAnswered(s, draft)) ?? null;

  function answer(patch: Draft) {
    let next: Draft = { ...draft, ...patch };
    if (patch.cancerType && patch.cancerType !== draft.cancerType) {
      // Different cancer type: keep only biomarker answers that still apply, and re-ask if the set changed.
      const ids = biomarkersFor(patch.cancerType);
      const prevIds = Object.keys(draft.biomarkers ?? {});
      const same = ids.length === prevIds.length && ids.every((id) => prevIds.includes(id));
      next = { ...next, biomarkers: ids.length === 0 ? {} : same ? draft.biomarkers : undefined };
    }
    setDraft(next);
    setEditing(null);
    setInteracted(true);
  }

  function renderInput(step: StepId): ReactNode {
    switch (step) {
      case "cancerType":
        return <CancerTypeInput onAnswer={(v) => answer({ cancerType: v })} />;
      case "zip":
        return <ZipInput initial={draft.zip} onAnswer={(zip) => answer({ zip })} />;
      case "travel":
        return (
          <Chips
            label={m.chat.travelQ}
            options={TRAVEL_OPTIONS.map((t) => ({ value: String(t), label: travelLabel(t, m) }))}
            onSelect={(v) => answer({ travelMiles: v === "null" ? null : Number(v) })}
          />
        );
      case "age":
        return <AgeInput initial={draft.age} onAnswer={(age) => answer({ age })} />;
      case "language":
        return (
          <Chips
            label={m.chat.languageQ}
            options={LANGUAGES.map((l) => ({ value: l, label: m.options.language[l] }))}
            onSelect={(language) => answer({ language })}
          />
        );
      case "spread":
        return (
          <Chips
            label={m.chat.spreadQ}
            options={(["yes", "no", "not_sure"] as const).map((v) => ({ value: v, label: m.options.spread[v] }))}
            onSelect={(spread) => answer({ spread })}
          />
        );
      case "treatments":
        return <TreatmentsInput initial={draft.treatments} onAnswer={(treatments) => answer({ treatments })} />;
      case "biomarkers":
        return (
          <BiomarkersInput
            ids={biomarkersFor(draft.cancerType)}
            initial={draft.biomarkers}
            onAnswer={(biomarkers) => answer({ biomarkers })}
          />
        );
      case "pregnant":
        return (
          <Chips
            label={m.chat.pregnantQ}
            options={(["yes", "no", "not_sure", "prefer_not"] as const).map((v) => ({ value: v, label: m.options.pregnant[v] }))}
            onSelect={(pregnant) => answer({ pregnant })}
          />
        );
      case "inAnotherTrial":
        return (
          <Chips
            label={m.chat.trialQ}
            options={(["yes", "no"] as const).map((v) => ({ value: v, label: m.options.yesNo[v] }))}
            onSelect={(inAnotherTrial) => answer({ inAnotherTrial })}
          />
        );
    }
  }

  const transcript: ReactNode[] = [];
  for (const step of steps) {
    const q = questionFor(step, m);
    if (step === active) {
      transcript.push(
        <div key={step} className="space-y-3">
          <TypingReveal enabled={interacted}>
            <AssistantBubble label={m.chat.assistant}>{q}</AssistantBubble>
          </TypingReveal>
          <FocusOnMount enabled={interacted}>{renderInput(step)}</FocusOnMount>
        </div>,
      );
      if (!isAnswered(step, draft)) break;
      continue;
    }
    if (!isAnswered(step, draft)) break;
    transcript.push(
      <div key={step} className="space-y-3">
        <AssistantBubble label={m.chat.assistant}>{q}</AssistantBubble>
        <UserBubble
          label={m.chat.you}
          onEdit={() => {
            setEditing(step);
            setInteracted(true);
          }}
          editLabel={format(m.chat.editAnswer, { question: q })}
        >
          {answerText(step, draft, m)}
        </UserBubble>
      </div>,
    );
  }

  return (
    <div className="space-y-6">
      <div role="log" aria-label={m.chat.logLabel} aria-live="polite" aria-relevant="additions" className="space-y-5">
        <AssistantBubble label={m.chat.assistant}>{m.chat.intro}</AssistantBubble>
        {transcript}
      </div>
      {active === null && (
        <Summary
          draft={draft}
          steps={steps}
          onEdit={(s) => {
            setEditing(s);
            setInteracted(true);
          }}
          onSearch={onSearch}
        />
      )}
      {Object.keys(draft).length > 0 && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setDraft({});
              setEditing(null);
            }}
          >
            <RotateCcw aria-hidden />
            {m.chat.restart}
          </Button>
        </div>
      )}
    </div>
  );
}
