"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ExternalLink, Mail, MapPin, MessageCircleQuestion, Phone } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { format, localeFor, useLanguage, useMessages } from "@/components/i18n";
import { formatDate, formatMiles, formatPhases, loadErrorCode, officialUrl } from "@/components/format";
import { BarrierBadge, Badge } from "@/components/results/badges";
import { useSession } from "@/components/session/session-provider";
import { Disclaimer } from "@/components/site/disclaimer";
import { ErrorView } from "@/components/site/error-view";
import { Skeleton } from "@/components/site/skeleton";
import { AskPanel } from "./ask-panel";
import { buttonVariants } from "@/components/ui/button";
import { sortSitesByDistance } from "@/lib/match/filters";
import type { Criterion, Site, TrialCard } from "@/lib/types";

const NCT_ID = /^NCT\d{8}$/;

type State =
  | { kind: "loading" }
  | { kind: "invalid" }
  | { kind: "not_found" }
  | { kind: "error"; code: ReturnType<typeof loadErrorCode> }
  | { kind: "ok"; card: TrialCard; sites: Site[] };

const INITIAL_SITES = 10;

function Section({ title, children, id }: { title: string; children: ReactNode; id?: string }) {
  return (
    <section aria-labelledby={id} className="border-t border-border pt-8">
      <h2 id={id} className="text-2xl font-semibold">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function CriteriaList({ items, empty }: { items: Criterion[]; empty: string }) {
  if (items.length === 0) return <p className="text-muted-foreground">{empty}</p>;
  return (
    <ol className="space-y-3" lang="en">
      {items.map((c) => (
        <li key={c.n} className="grid grid-cols-[2.25rem_1fr] gap-2">
          <span className="font-semibold text-muted-foreground tabular-nums">{c.n}.</span>
          <span className="whitespace-pre-line">{c.text}</span>
        </li>
      ))}
    </ol>
  );
}

function ageText(card: TrialCard, m: ReturnType<typeof useMessages>): string {
  if (card.minAge !== null && card.maxAge !== null) return format(m.trial.ageRange, { range: `${card.minAge}–${card.maxAge}` });
  if (card.minAge !== null) return format(m.trial.ageMin, { min: card.minAge });
  if (card.maxAge !== null) return format(m.trial.ageMax, { max: card.maxAge });
  return m.trial.ageAny;
}

function TrialBody({ card, sites }: { card: TrialCard; sites: Site[] }) {
  const m = useMessages();
  const locale = localeFor(useLanguage());
  const { session } = useSession();
  const origin = session?.origin ?? null;
  const [showAll, setShowAll] = useState(false);
  const sorted = useMemo(() => sortSitesByDistance(sites, origin), [sites, origin]);
  const visibleSites = showAll ? sorted : sorted.slice(0, INITIAL_SITES);
  const phase = formatPhases(card.phases);

  useEffect(() => {
    document.title = `${card.title} · TrialBridge`;
  }, [card.title]);

  return (
    <article className="space-y-8">
      <header className="space-y-4">
        {session && (
          <Link href="/find/" className="no-print inline-flex items-center gap-1.5 text-primary underline-offset-4 hover:underline">
            <ArrowLeft className="size-4" aria-hidden />
            {m.trial.backToResults}
          </Link>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{phase ? format(m.card.phase, { phase }) : m.card.phaseNone}</Badge>
          <span className="text-sm text-muted-foreground">{card.id}</span>
        </div>
        <h1 className="text-3xl font-semibold sm:text-4xl">{card.title}</h1>
        {card.officialTitle && card.officialTitle !== card.title && <p className="text-muted-foreground">{card.officialTitle}</p>}
        <dl className="grid gap-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-muted-foreground">{m.trial.sponsor}</dt>
            <dd className="font-medium">{card.sponsor}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{m.trial.conditions}</dt>
            <dd className="font-medium">{card.conditions.join(", ")}</dd>
          </div>
          <div>
            <dt className="sr-only">{m.trial.lastUpdated}</dt>
            <dd className="text-muted-foreground">{format(m.trial.lastUpdated, { date: formatDate(card.lastUpdated, locale) })}</dd>
          </div>
        </dl>
        <div className="no-print flex flex-wrap gap-3">
          <a href="#ask" className={buttonVariants({ variant: "default" })}>
            <MessageCircleQuestion aria-hidden />
            {m.ask.button}
          </a>
          <a href={officialUrl(card.id)} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "outline" })}>
            {m.trial.official}
            <ExternalLink aria-hidden />
            <span className="sr-only">{m.common.opensNewTab}</span>
          </a>
        </div>
      </header>

      <Disclaimer />
      <p className="text-sm text-muted-foreground">{m.trial.officialOnly}</p>

      <Section title={m.trial.tested} id="tested">
        <p className="max-w-prose whitespace-pre-line" lang="en">
          {card.summary}
        </p>
      </Section>

      <Section title={m.trial.whoMight} id="who">
        <ul className="mb-6 flex flex-wrap gap-2">
          <li>
            <Badge>{ageText(card, m)}</Badge>
          </li>
          <li>
            <Badge>{m.trial.sex[card.sex]}</Badge>
          </li>
        </ul>
        <h3 className="font-sans text-lg font-semibold">{m.trial.inclusion}</h3>
        <div className="mt-3 max-w-prose">
          <CriteriaList items={card.inclusion} empty={m.trial.inclusionNone} />
        </div>
        <h3 className="mt-8 font-sans text-lg font-semibold">{m.trial.exclusion}</h3>
        <div className="mt-3 max-w-prose">
          <CriteriaList items={card.exclusion} empty={m.trial.exclusionNone} />
        </div>
      </Section>

      <Section title={m.trial.barriers} id="barriers">
        {card.barriers.length === 0 ? (
          <p className="text-muted-foreground">{m.trial.barriersNone}</p>
        ) : (
          <ul className="space-y-3">
            {card.barriers.map((b, i) => (
              <li key={`${b.type}-${i}`}>
                <BarrierBadge barrier={b} />
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title={m.trial.sites} id="sites">
        {origin && <p className="mb-3 text-sm text-muted-foreground">{m.trial.sitesNearest}</p>}
        <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
          {visibleSites.map(({ site, miles }, i) => (
            <li key={`${site.facility}-${site.zip}-${i}`} className="flex items-start justify-between gap-3 px-4 py-3">
              <div className="flex items-start gap-2">
                <MapPin className="mt-1 size-4 shrink-0 text-muted-foreground" aria-hidden />
                <div>
                  <p className="font-medium">{site.facility}</p>
                  <p className="text-sm text-muted-foreground">
                    {site.city}, {site.state} {site.zip}
                  </p>
                </div>
              </div>
              {miles !== null && (
                <span className="shrink-0 text-sm font-medium">{format(m.card.distance, { miles: formatMiles(miles) })}</span>
              )}
            </li>
          ))}
        </ul>
        {!showAll && sorted.length > INITIAL_SITES && (
          <button type="button" onClick={() => setShowAll(true)} className="mt-3 min-h-11 font-medium text-primary underline-offset-4 hover:underline">
            {format(m.trial.sitesAll, { count: sorted.length })}
          </button>
        )}
      </Section>

      <Section title={m.trial.contact} id="contact">
        {card.contacts.length === 0 ? (
          <p className="text-muted-foreground">{m.card.contactNone}</p>
        ) : (
          <ul className="space-y-3">
            {card.contacts.map((c, i) => (
              <li key={i} className="flex flex-wrap items-center gap-x-4 gap-y-1">
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
              </li>
            ))}
          </ul>
        )}
      </Section>

      <AskPanel nctId={card.id} />
    </article>
  );
}

/** Single dynamic trial page: reads ?id=NCT… and loads the trial from the static shards on the client. */
export function TrialDetail() {
  const m = useMessages();
  const params = useSearchParams();
  const rawId = (params.get("id") ?? "").trim().toUpperCase();
  const validId = NCT_ID.test(rawId);
  const [state, setState] = useState<State>({ kind: "loading" });
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => {
    setState({ kind: "loading" });
    setAttempt((a) => a + 1);
  }, []);

  useEffect(() => {
    if (!validId) return;
    let cancelled = false;
    import("@/lib/data/loader")
      .then(({ loadTrial }) => loadTrial(rawId))
      .then((res) => {
        if (cancelled) return;
        setState(res ? { kind: "ok", card: res.card, sites: res.sites } : { kind: "not_found" });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const code = loadErrorCode(err);
        setState(code === "not_found" ? { kind: "not_found" } : { kind: "error", code });
      });
    return () => {
      cancelled = true;
    };
  }, [rawId, validId, attempt]);

  const current: State = validId ? state : { kind: "invalid" };

  return (
    // min-h keeps the footer below the fold while loading, so content arriving doesn't shift it.
    <main id="main" className="mx-auto min-h-dvh w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
      {current.kind === "loading" && <TrialSkeleton label={m.trial.loading} />}
      {current.kind === "invalid" && <ErrorView title={m.trial.notFoundTitle} body={m.trial.invalidId} />}
      {current.kind === "not_found" && <ErrorView title={m.trial.notFoundTitle} body={m.trial.notFoundBody} />}
      {current.kind === "error" && (
        <ErrorView body={typeof navigator !== "undefined" && !navigator.onLine ? m.common.offline : m.trial.errorBody} onRetry={retry} />
      )}
      {current.kind === "ok" && <TrialBody card={current.card} sites={current.sites} />}
    </main>
  );
}

function TrialSkeleton({ label }: { label: string }) {
  return (
    <div role="status" className="space-y-6">
      <span className="sr-only">{label}</span>
      <Skeleton className="h-7 w-40 rounded-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-5 w-2/3" />
      <div className="grid gap-3 sm:grid-cols-3">
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
      </div>
      <Skeleton className="h-16 w-full rounded-xl" />
      <Skeleton className="h-40 w-full rounded-xl" />
    </div>
  );
}

export function TrialLoading() {
  const m = useMessages();
  return (
    <main id="main" className="mx-auto min-h-dvh w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
      <TrialSkeleton label={m.trial.loading} />
    </main>
  );
}
