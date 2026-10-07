"use client";

import { HeartHandshake, MessageCircleQuestion, ShieldAlert, Sparkles } from "lucide-react";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { format, useLanguage, useMessages } from "@/components/i18n";
import { TypingDots } from "@/components/site/spinner";
import { Button } from "@/components/ui/button";
import { askQuestion, MAX_QUESTION_CHARS, MAX_QUESTIONS_PER_TRIAL, questionsRemaining } from "@/lib/api/ask";
import { getTurnstileToken } from "@/lib/api/turnstile";
import type { AskResponse, Citation } from "@/lib/types/ask";
import { cn } from "@/lib/utils";

interface Turn {
  id: number;
  question: string;
  response: AskResponse | null;
}

const TURNSTILE_TIMEOUT_MS = 30_000;

function busyResponse(): AskResponse {
  return {
    status: "degraded",
    kind: null,
    answer: "",
    citations: [],
    crisis: false,
    piiRemoved: false,
    experimental: false,
    cached: false,
    provider: null,
    degradedReason: "ai_unavailable",
  };
}

function CrisisBox() {
  const m = useMessages();
  return (
    <div role="alert" className="rounded-xl border-2 border-primary bg-secondary p-4 text-secondary-foreground">
      <p className="flex items-center gap-2 text-lg font-semibold">
        <HeartHandshake className="size-5" aria-hidden />
        {m.ask.crisisTitle}
      </p>
      <p className="mt-1">{m.ask.crisisBody}</p>
      <ul className="mt-2 space-y-1 font-medium">
        <li>
          <a href="tel:988" className="underline underline-offset-4">
            {m.ask.crisis988}
          </a>
        </li>
        <li>
          <a href="tel:911" className="underline underline-offset-4">
            {m.ask.crisis911}
          </a>
        </li>
      </ul>
      <p className="mt-2">{m.ask.crisisCare}</p>
    </div>
  );
}

function CitationView({ c }: { c: Citation }) {
  const m = useMessages();
  const label =
    c.section === "inclusion" || c.section === "exclusion"
      ? format(m.ask.citation[c.section], { n: c.number ?? "" })
      : m.ask.citation[c.section];
  return (
    <figure>
      <blockquote lang="en" className="border-l-2 border-primary/50 pl-3 text-sm text-foreground/90 italic">
        “{c.quote}”
      </blockquote>
      <figcaption className="mt-0.5 pl-3 text-sm text-muted-foreground">{label}</figcaption>
    </figure>
  );
}

function ResponseView({ r }: { r: AskResponse }) {
  const m = useMessages();
  if (r.status === "degraded") {
    return (
      <div className="space-y-2">
        {r.crisis && <CrisisBox />}
        <p className="rounded-xl border border-warn-border bg-warn px-3 py-2 text-warn-foreground">
          {r.degradedReason === "question_limit" ? m.ask.limit : m.ask.busy}
        </p>
        {r.piiRemoved && <p className="text-sm text-muted-foreground">{m.ask.piiRemoved}</p>}
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {(r.crisis || r.kind === "crisis") && <CrisisBox />}
      {r.kind === "refusal" && (
        <p className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <ShieldAlert className="size-4" aria-hidden />
          {m.ask.refusal}
        </p>
      )}
      {r.answer && <p className="whitespace-pre-line">{r.answer}</p>}
      {r.kind === "not_in_text" && !r.answer && <p>{m.ask.notInText}</p>}
      {r.citations.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold">{m.ask.sources}</p>
          {r.citations.map((c, i) => (
            <CitationView key={`${c.section}-${c.number ?? i}-${i}`} c={c} />
          ))}
        </div>
      )}
      {r.piiRemoved && <p className="text-sm text-muted-foreground">{m.ask.piiRemoved}</p>}
      {r.experimental && <p className="text-sm font-medium">{m.ask.experimental}</p>}
      {r.kind === "answer" && (
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Sparkles className="size-3.5" aria-hidden />
          {m.ask.aiNote}
        </p>
      )}
    </div>
  );
}

/** Trial Q&A. Questions and answers live only in this component's memory. */
export function AskPanel({ nctId }: { nctId: string }) {
  const m = useMessages();
  const lang = useLanguage();
  const [question, setQuestion] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState(() => questionsRemaining(nctId));
  const turnstileRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const nextId = useRef(1);
  const inputId = useId();
  const hintId = useId();
  const errId = useId();

  useEffect(() => () => abortRef.current?.abort(), []);

  // Arriving from a result card's "Ask about this trial" link (#ask): focus the question box.
  useEffect(() => {
    if (window.location.hash === "#ask") {
      textareaRef.current?.scrollIntoView({ block: "center" });
      textareaRef.current?.focus({ preventScroll: true });
    }
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const q = question.trim();
    if (q.length < 2) {
      setError(m.ask.tooShort);
      return;
    }
    setError(null);
    const id = nextId.current++;
    setTurns((t) => [...t, { id, question: q, response: null }]);
    setQuestion("");
    setPending(true);
    const ac = new AbortController();
    abortRef.current = ac;
    let response: AskResponse;
    try {
      const container = turnstileRef.current;
      if (!container) throw new Error("no turnstile container");
      const token = await new Promise<string>((resolve, reject) => {
        const t = setTimeout(() => reject(new Error("timeout")), TURNSTILE_TIMEOUT_MS);
        getTurnstileToken(container).then(
          (v) => {
            clearTimeout(t);
            resolve(v);
          },
          (err: unknown) => {
            clearTimeout(t);
            reject(err instanceof Error ? err : new Error("turnstile"));
          },
        );
      });
      response = await askQuestion(nctId, q, lang, token, { signal: ac.signal });
    } catch {
      if (ac.signal.aborted) return;
      response = busyResponse();
    }
    setTurns((t) => t.map((x) => (x.id === id ? { ...x, response } : x)));
    setRemaining(questionsRemaining(nctId));
    setPending(false);
  }

  const limitReached = remaining <= 0;

  return (
    <section id="ask" aria-labelledby="ask-title" className="no-print scroll-mt-24 border-t border-border pt-8">
      <h2 id="ask-title" className="flex items-center gap-2 text-2xl font-semibold">
        <MessageCircleQuestion className="size-6 text-primary" aria-hidden />
        {m.ask.title}
      </h2>
      <p className="mt-2 max-w-prose text-muted-foreground">{m.ask.intro}</p>

      {turns.length > 0 && (
        <ol className="mt-6 space-y-5" aria-live="polite">
          {turns.map((t) => (
            <li key={t.id} className="space-y-3">
              <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-3 text-primary-foreground">
                <span className="sr-only">{m.ask.you}: </span>
                {t.question}
              </div>
              <div className="max-w-[95%] rounded-2xl rounded-bl-md border border-border bg-card px-4 py-3">
                <span className="sr-only">{m.ask.answerLabel}: </span>
                {t.response ? <ResponseView r={t.response} /> : <TypingDots label={m.ask.thinking} className="text-primary" />}
              </div>
            </li>
          ))}
        </ol>
      )}

      <form onSubmit={submit} noValidate className="mt-6 space-y-3 rounded-2xl border border-border bg-card p-4 sm:p-5">
        <label htmlFor={inputId} className="block font-medium">
          {m.ask.label}
        </label>
        <p id={hintId} className="flex items-start gap-2 rounded-lg bg-warn px-3 py-2 text-sm text-warn-foreground">
          <ShieldAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          {m.ask.piiNotice}
        </p>
        <textarea
          ref={textareaRef}
          id={inputId}
          value={question}
          onChange={(e) => {
            setQuestion(e.target.value.slice(0, MAX_QUESTION_CHARS));
            setError(null);
          }}
          maxLength={MAX_QUESTION_CHARS}
          rows={3}
          disabled={limitReached}
          placeholder={m.ask.placeholder}
          aria-describedby={`${hintId} ${errId}`}
          aria-invalid={error ? true : undefined}
          className="w-full resize-y rounded-xl border border-input bg-background px-4 py-3 text-base placeholder:text-muted-foreground disabled:opacity-60"
        />
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          <span className="tabular-nums">{format(m.ask.chars, { count: question.length, max: MAX_QUESTION_CHARS })}</span>
          <span className={cn("tabular-nums", limitReached && "font-medium text-warn-foreground")}>
            {limitReached ? m.ask.limit : format(m.ask.remaining, { count: remaining, max: MAX_QUESTIONS_PER_TRIAL })}
          </span>
        </div>
        <p id={errId} aria-live="polite" className="min-h-5 text-sm text-destructive">
          {error}
        </p>
        <Button type="submit" disabled={pending || limitReached}>
          {m.ask.submit}
        </Button>
        <div ref={turnstileRef} role="region" aria-label={m.ask.verification} />
      </form>
    </section>
  );
}
