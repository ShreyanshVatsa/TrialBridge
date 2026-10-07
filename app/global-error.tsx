"use client";

import "./globals.css";
import { en } from "@/components/i18n/en";

/** Last-resort boundary when the root layout itself fails. Plain markup, no stack traces. */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body className="flex min-h-dvh items-center justify-center bg-background px-4 text-foreground">
        <main role="alert" className="max-w-md text-center">
          <h1 className="text-2xl font-semibold">{en.errors.title}</h1>
          <p className="mt-2 text-muted-foreground">{en.errors.body}</p>
          <div className="mt-6 flex justify-center gap-3">
            <button type="button" onClick={reset} className="h-11 rounded-lg bg-primary px-4 text-primary-foreground">
              {en.common.retry}
            </button>
            {/* Full reload on purpose: the app shell is broken. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" className="inline-flex h-11 items-center rounded-lg border border-border px-4">
              {en.common.home}
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
