"use client";

import type { ReactNode } from "react";
import { FileWarning } from "lucide-react";
import { useMessages } from "@/components/i18n";

export interface ProseSection {
  readonly title: string;
  readonly body: readonly string[];
  readonly items: readonly string[];
}

/** Long-form content page (methodology, about, policies) rendered from structured messages. */
export function ProsePage({
  title,
  intro,
  sections,
  draft = false,
  children,
  before,
}: {
  title: string;
  intro: string;
  sections: readonly ProseSection[];
  draft?: boolean;
  children?: ReactNode;
  before?: ReactNode;
}) {
  const m = useMessages();
  return (
    <main id="main" className="mx-auto w-full max-w-3xl flex-1 space-y-8 px-4 py-12 sm:px-6 sm:py-16">
      {draft && (
        <p role="note" className="flex items-start gap-2 rounded-xl border border-warn-border bg-warn px-4 py-3 font-medium text-warn-foreground">
          <FileWarning className="mt-1 size-4 shrink-0" aria-hidden />
          {m.pages.draftBanner}
        </p>
      )}
      <header>
        <h1 className="text-4xl font-semibold sm:text-5xl">{title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{intro}</p>
      </header>
      {before}
      {sections.map((s) => (
        <section key={s.title} className="border-t border-border pt-8">
          <h2 className="text-2xl font-semibold">{s.title}</h2>
          <div className="mt-3 max-w-[70ch] space-y-3">
            {s.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
            {s.items.length > 0 && (
              <ul className="list-disc space-y-2 ps-5 marker:text-primary">
                {s.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            )}
          </div>
        </section>
      ))}
      {children}
    </main>
  );
}
