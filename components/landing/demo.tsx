"use client";

import { AlertTriangle, CircleCheck, MapPin } from "lucide-react";
import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { useMessages } from "@/components/i18n";
import { LogoMark } from "@/components/site/logo";
import { TypingDots } from "@/components/site/spinner";
import { cn } from "@/lib/utils";

const STEPS = 7; // q1, a1, q2, a2, searching, card, hold
const STEP_MS = 1300;

function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function Reveal({ show, children, className }: { show: boolean; children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "origin-bottom transition-transform duration-500 ease-out motion-reduce:transition-none",
        show ? "visible translate-y-0 scale-100" : "invisible translate-y-2 scale-95",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Animated product preview built in code. Illustrative content only; not a real trial. */
export function LandingDemo() {
  const m = useMessages();
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setTick((t) => (t + 1) % (STEPS + 1)), STEP_MS);
    return () => clearInterval(id);
  }, [reduced]);

  const step = reduced ? STEPS : tick;
  const searching = step === 4;

  return (
    <div role="img" aria-label={m.landing.demoLabel} className="relative">
      <div aria-hidden className="relative rounded-3xl border border-border bg-card p-4 shadow-[0_1px_0_0_var(--border),0_24px_48px_-24px_oklch(0.3_0.05_220/0.25)] sm:p-5">
        <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <LogoMark className="size-6" />
            TrialBridge
          </div>
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">{m.landing.demoTag}</span>
        </div>
        <div className="flex min-h-[25rem] flex-col gap-3 text-[0.95rem]">
          <Reveal show={step >= 0} className="max-w-[85%] rounded-2xl rounded-bl-md bg-bubble px-3.5 py-2.5">
            {m.landing.demoQ1}
          </Reveal>
          <Reveal show={step >= 1} className="ml-auto rounded-2xl rounded-br-md bg-primary px-3.5 py-2.5 text-primary-foreground">
            {m.landing.demoA1}
          </Reveal>
          <Reveal show={step >= 2} className="max-w-[85%] rounded-2xl rounded-bl-md bg-bubble px-3.5 py-2.5">
            {m.landing.demoQ2}
          </Reveal>
          <Reveal show={step >= 3} className="ml-auto rounded-2xl rounded-br-md bg-primary px-3.5 py-2.5 text-primary-foreground">
            {m.landing.demoA2}
          </Reveal>
          <Reveal show={searching} className="flex h-5 items-center gap-2 text-sm text-muted-foreground">
            <TypingDots label="" className="text-primary" />
            {m.landing.demoSearching}
          </Reveal>
          <Reveal show={step >= 5} className="rounded-2xl border border-border bg-background p-4">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-secondary px-2 py-0.5 font-medium text-secondary-foreground">
                <CircleCheck className="size-3.5" />
                {m.landing.demoFit}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-warn-border bg-warn px-2 py-0.5 font-medium text-warn-foreground">
                <AlertTriangle className="size-3.5" />
                {m.landing.demoBarrier}
              </span>
            </div>
            <p className="mt-2 font-heading text-lg leading-snug font-semibold">{m.landing.demoCardTitle}</p>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="size-3.5" />
              {m.landing.demoCardMeta}
            </p>
            <p className="mt-3 text-sm font-semibold text-success-foreground">{m.landing.demoWhy}</p>
            <p className="mt-1 border-l-2 border-primary/50 pl-2.5 text-sm italic">{m.landing.demoQuote}</p>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
