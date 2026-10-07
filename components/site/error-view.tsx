"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";
import { useMessages } from "@/components/i18n";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Friendly error panel used by route error boundaries and failed loads. Never shows stack traces. */
export function ErrorView({
  title,
  body,
  onRetry,
  showHome = true,
  className,
}: {
  title?: string;
  body?: string;
  onRetry?: () => void;
  showHome?: boolean;
  className?: string;
}) {
  const m = useMessages();
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => ref.current?.focus(), []);
  return (
    <div role="alert" className={cn("mx-auto max-w-xl rounded-2xl border border-border bg-card p-6 text-center sm:p-8", className)}>
      <AlertTriangle className="mx-auto mb-3 size-8 text-warn-foreground" aria-hidden />
      <h2 ref={ref} tabIndex={-1} className="text-2xl font-semibold outline-none">
        {title ?? m.errors.title}
      </h2>
      <p className="mt-2 text-muted-foreground">{body ?? m.errors.body}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {onRetry && <Button onClick={onRetry}>{m.common.retry}</Button>}
        {showHome && (
          <Link href="/" className={buttonVariants({ variant: "outline" })}>
            {m.common.home}
          </Link>
        )}
      </div>
    </div>
  );
}

/** Shared body for every route error.tsx boundary. */
export function RouteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="main" className="flex flex-1 items-center px-4 py-16">
      <ErrorView onRetry={reset} />
    </main>
  );
}
