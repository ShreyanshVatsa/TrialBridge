"use client";

import Link from "next/link";
import { Check, X } from "lucide-react";
import type { ReactNode } from "react";
import { useMessages } from "@/components/i18n";

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-border pt-8">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

export function PrivacyPage() {
  const all = useMessages();
  const m = all.privacy;
  return (
    <main id="main" className="mx-auto w-full max-w-3xl flex-1 space-y-8 px-4 py-12 sm:px-6 sm:py-16">
      <header>
        <h1 className="text-4xl font-semibold sm:text-5xl">{m.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{m.intro}</p>
      </header>
      <Block title={m.browserTitle}>
        <p>{m.browserBody}</p>
        <ul className="space-y-2">
          {m.browserItems.map((i) => (
            <li key={i} className="flex items-start gap-2">
              <Check className="mt-1 size-4 shrink-0 text-primary" aria-hidden />
              {i}
            </li>
          ))}
        </ul>
      </Block>
      <Block title={m.aiTitle}>
        <p>{m.aiBody}</p>
        <ul className="space-y-2">
          {m.aiItems.map((i) => (
            <li key={i} className="flex items-start gap-2">
              <Check className="mt-1 size-4 shrink-0 text-primary" aria-hidden />
              {i}
            </li>
          ))}
        </ul>
        <p className="flex items-start gap-2 rounded-xl border border-border bg-muted/60 px-4 py-3 font-medium">
          <X className="mt-1 size-4 shrink-0 text-destructive" aria-hidden />
          {m.aiNever}
        </p>
      </Block>
      <Block title={m.qaTitle}>
        <p>{m.qaBody}</p>
      </Block>
      <Block title={m.providersTitle}>
        <p>{m.providersBody}</p>
      </Block>
      <Block title={m.noTrackingTitle}>
        <p>{m.noTrackingBody}</p>
      </Block>
      <Block title={m.storedTitle}>
        <p>{m.storedBody}</p>
      </Block>
      <Block title={m.deviceTitle}>
        <p>{m.deviceBody}</p>
      </Block>
      <p className="border-t border-border pt-8">
        <Link href="/privacy-policy/" className="font-medium text-primary underline underline-offset-4">
          {m.policyLink}
        </Link>
      </p>
      <p className="text-muted-foreground">{all.disclaimer.text}</p>
    </main>
  );
}
