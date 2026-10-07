"use client";

import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { format, useLanguage, useMessages, localeFor } from "@/components/i18n";
import { formatDate } from "@/components/format";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EvalSummary } from "./eval-summary";
import { ProsePage } from "./prose";
import { FOUNDER_STORY } from "@/content/founder-story";

/** Partner contact address; set NEXT_PUBLIC_PARTNER_EMAIL at build time. */
const PARTNER_EMAIL = (process.env.NEXT_PUBLIC_PARTNER_EMAIL ?? "").trim();
const PARTNER_EMAIL_VALID = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(PARTNER_EMAIL);
/** Date the policy drafts were last edited. */
const POLICY_DATE = "2026-10-07";

export function ForSitesPage() {
  const m = useMessages().pages.forSites;
  return (
    <ProsePage title={m.title} intro={m.intro} sections={m.sections}>
      <section className="rounded-3xl border border-border bg-card p-8 text-center">
        {PARTNER_EMAIL_VALID ? (
          <>
            <a
              href={`mailto:${PARTNER_EMAIL}?subject=${encodeURIComponent(m.mailSubject)}`}
              className={cn(buttonVariants({ size: "lg" }), "h-14 px-7 text-lg")}
            >
              <Mail aria-hidden />
              {m.cta}
            </a>
            <p className="mt-3 text-sm text-muted-foreground">{m.ctaNote}</p>
          </>
        ) : (
          <span
            aria-disabled="true"
            className={cn(buttonVariants({ size: "lg", variant: "outline" }), "h-14 cursor-not-allowed px-7 text-lg opacity-60")}
          >
            <Mail aria-hidden />
            {m.ctaSoon}
          </span>
        )}
      </section>
    </ProsePage>
  );
}

export function MethodologyPage() {
  const m = useMessages().pages.methodology;
  return (
    <ProsePage title={m.title} intro={m.intro} sections={m.sections}>
      <section className="border-t border-border pt-8">
        <h2 className="text-2xl font-semibold">{m.evalTitle}</h2>
        <p className="mt-3 max-w-[70ch]">{m.evalBody}</p>
        <EvalSummary />
      </section>
    </ProsePage>
  );
}

export function AboutPage() {
  const m = useMessages().pages.about;
  const story = FOUNDER_STORY.filter((p) => p.trim() !== "");
  return (
    <ProsePage title={m.title} intro={m.intro} sections={m.sections}>
      {story.length > 0 && (
        <section className="border-t border-border pt-8">
          <h2 className="text-2xl font-semibold">{m.founderTitle}</h2>
          <div className="mt-3 max-w-[70ch] space-y-4">
            {story.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
      )}
      <Link href="/methodology/" className={buttonVariants({ variant: "outline" })}>
        {m.methodologyLink}
        <ArrowRight aria-hidden />
      </Link>
    </ProsePage>
  );
}

export function PolicyPage({ kind }: { kind: "privacyPolicy" | "terms" }) {
  const m = useMessages().pages[kind];
  const lang = useLanguage();
  return <ProsePage draft title={m.title} intro={format(m.intro, { date: formatDate(POLICY_DATE, localeFor(lang)) })} sections={m.sections} />;
}
