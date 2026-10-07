"use client";

import Link from "next/link";
import { ExternalLink, Mail, MapPin, MessageCircleQuestion, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { format, useMessages } from "@/components/i18n";
import { formatMiles, formatPhases, officialUrl, trialHref } from "@/components/format";
import { buttonVariants } from "@/components/ui/button";
import type { CriterionAssessment, RankedTrial } from "@/lib/types";
import { cn } from "@/lib/utils";
import { BarrierBadge, Badge, FitBadge, LanguageWarning, Quote } from "./badges";

interface Point {
  key: string;
  quote: string;
  ref: { section: "inclusion" | "exclusion"; n: number };
  explanation?: string;
}

const MAX_POINTS = 3;

function fromAnalysis(items: CriterionAssessment[]): Point[] {
  return items.map((c) => ({
    key: `${c.section}-${c.number}`,
    quote: c.quote,
    ref: { section: c.section, n: c.number },
    explanation: c.explanation,
  }));
}

function PointList({ title, points, tone }: { title: string; points: Point[]; tone: "fit" | "risk" | "ask" }) {
  if (points.length === 0) return null;
  return (
    <section>
      <h4
        className={cn(
          "font-sans text-base font-semibold",
          tone === "risk" ? "text-warn-foreground" : tone === "fit" ? "text-success-foreground" : "text-foreground",
        )}
      >
        {title}
      </h4>
      <ul className="mt-1 space-y-3">
        {points.slice(0, MAX_POINTS).map((p) => (
          <li key={p.key}>
            {p.explanation && <p>{p.explanation}</p>}
            <Quote text={p.quote} criterionRef={p.ref} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function ContactLine({ trial }: { trial: RankedTrial }) {
  const m = useMessages();
  const c = trial.card.contacts.find((x) => x.phone || x.email) ?? trial.card.contacts[0];
  if (!c) return <p className="text-muted-foreground">{m.card.contactNone}</p>;
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
      {c.name && <span className="font-medium">{c.name}</span>}
      {c.phone && (
        <a href={`tel:${c.phone.replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-1.5 text-primary underline-offset-4 hover:underline">
          <Phone className="size-4" aria-hidden />
          {c.phone}
        </a>
      )}
      {c.email && (
        <a href={`mailto:${c.email}`} className="inline-flex items-center gap-1.5 break-all text-primary underline-offset-4 hover:underline">
          <Mail className="size-4" aria-hidden />
          {c.email}
        </a>
      )}
    </div>
  );
}

export function ResultCard({ trial, index }: { trial: RankedTrial; index: number }) {
  const m = useMessages();
  const { card, analysis, nearest, precheck } = trial;
  const phase = formatPhases(card.phases);
  const titleId = `trial-${card.id}-title`;

  const why: Point[] = analysis
    ? fromAnalysis(analysis.criteria.filter((c) => c.assessment === "likely_met"))
    : precheck.filter((p) => p.kind === "support").map((p) => ({ key: `${p.ref.section}-${p.ref.n}-${p.key}`, quote: p.quote, ref: p.ref }));
  const ruleOut: Point[] = analysis
    ? fromAnalysis(analysis.criteria.filter((c) => c.assessment === "likely_not_met"))
    : precheck.filter((p) => p.kind === "conflict").map((p) => ({ key: `${p.ref.section}-${p.ref.n}-${p.key}`, quote: p.quote, ref: p.ref }));
  const needsDoctor: Point[] = analysis ? fromAnalysis(analysis.criteria.filter((c) => c.assessment === "needs_doctor")) : [];
  const questions: readonly string[] = analysis && analysis.doctorQuestions.length > 0 ? analysis.doctorQuestions : m.card.defaultQuestions;

  let section: ReactNode = null;
  if (why.length + ruleOut.length + needsDoctor.length === 0) {
    section = <p className="text-muted-foreground">{m.card.noAnalysis}</p>;
  }

  return (
    <article aria-labelledby={titleId} className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        {trial.scores.fit && <FitBadge level={trial.scores.fit} />}
        <Badge>{phase ? format(m.card.phase, { phase }) : m.card.phaseNone}</Badge>
        {card.sex !== "ALL" && <Badge>{m.trial.sex[card.sex]}</Badge>}
        <span className="text-sm text-muted-foreground">{card.id}</span>
      </div>

      <h3 id={titleId} className="mt-3 text-xl font-semibold sm:text-2xl">
        <span className="sr-only">{index + 1}. </span>
        <Link href={trialHref(card.id)} className="underline-offset-4 hover:underline">
          {card.title}
        </Link>
      </h3>

      {nearest && (
        <p className="mt-2 flex items-start gap-2 text-muted-foreground">
          <MapPin className="mt-1 size-4 shrink-0" aria-hidden />
          <span>
            {format(m.card.nearest, { facility: nearest.site.facility, city: nearest.site.city, state: nearest.site.state })}
            {" · "}
            <strong className="font-semibold text-foreground">
              {nearest.miles === null ? m.card.distanceUnknown : format(m.card.distance, { miles: formatMiles(nearest.miles) })}
            </strong>
          </span>
        </p>
      )}

      {(card.barriers.length > 0 || trial.languageWarning) && (
        <div className="mt-3 space-y-2">
          {card.barriers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {card.barriers.map((b, i) => (
                <BarrierBadge key={`${b.type}-${i}`} barrier={b} />
              ))}
            </div>
          )}
          {trial.languageWarning && <LanguageWarning />}
        </div>
      )}

      {analysis?.summary && <p className="mt-4 text-lg leading-relaxed">{analysis.summary}</p>}

      <div className="mt-4 space-y-5">
        <PointList title={m.card.whyFit} points={why} tone="fit" />
        <PointList title={m.card.ruleOut} points={ruleOut} tone="risk" />
        <PointList title={m.card.needsDoctor} points={needsDoctor} tone="ask" />
        {section}
        <section>
          <h4 className="font-sans text-base font-semibold">{m.card.askDoctor}</h4>
          <ul className="mt-1 list-disc space-y-1 ps-5">
            {questions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </section>
        <section>
          <h4 className="font-sans text-base font-semibold">{m.card.contact}</h4>
          <ContactLine trial={trial} />
        </section>
      </div>

      <div className="no-print mt-5 flex flex-wrap gap-3 border-t border-border pt-4">
        <Link href={`${trialHref(card.id)}#ask`} className={buttonVariants({ variant: "default" })}>
          <MessageCircleQuestion aria-hidden />
          {m.ask.button}
        </Link>
        <Link href={trialHref(card.id)} className={buttonVariants({ variant: "outline" })}>
          {m.card.details}
        </Link>
        <a href={officialUrl(card.id)} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "outline" })}>
          {m.card.official}
          <ExternalLink aria-hidden />
          <span className="sr-only">{m.common.opensNewTab}</span>
        </a>
      </div>
    </article>
  );
}
