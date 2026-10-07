"use client";

import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { format, useLanguage, useMessages, localeFor } from "@/components/i18n";
import { formatDate } from "@/components/format";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EvalSummary } from "./eval-summary";
import { ProsePage } from "./prose";

/** Partner contact address; set NEXT_PUBLIC_PARTNER_EMAIL at build time. */
const PARTNER_EMAIL = process.env.NEXT_PUBLIC_PARTNER_EMAIL ?? "";
/** Date the policy drafts were last edited. */
const POLICY_DATE = "2026-10-07";

export function ForSitesPage() {
  const m = useMessages().pages.forSites;
  const href = `mailto:${PARTNER_EMAIL}?subject=${encodeURIComponent(m.mailSubject)}`;
  return (
    <ProsePage title={m.title} intro={m.intro} sections={m.sections}>
      <section className="rounded-3xl border border-border bg-card p-8 text-center">
        <a href={href} className={cn(buttonVariants({ size: "lg" }), "h-14 px-7 text-lg")}>
          <Mail aria-hidden />
          {m.cta}
        </a>
        <p className="mt-3 text-sm text-muted-foreground">{m.ctaNote}</p>
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
  return (
    <ProsePage title={m.title} intro={m.intro} sections={m.sections}>
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
