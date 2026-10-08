"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useMessages } from "@/components/i18n";
import { cn } from "@/lib/utils";
import { useWide } from "./motion";

// The animated demo is decorative: load it after first paint, in a same-size frame (no layout shift).
const LandingDemo = dynamic(() => import("./demo").then((x) => x.LandingDemo), {
  ssr: false,
  loading: () => <div aria-hidden className="mx-auto h-[36.5rem] max-w-[23.5rem] rounded-[3.25rem] bg-card" />,
});

/**
 * Three steps beside a pinned product demo. On wide screens the step in the middle of the viewport drives
 * the demo, so reading down the page plays the conversation. Narrow screens get the demo on its own loop.
 */
export function HowItWorks() {
  const m = useMessages().landing;
  const wide = useWide();
  const [active, setActive] = useState(0);
  const items = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    items.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section aria-labelledby="how-title" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
      <h2 id="how-title" className="text-[clamp(2.75rem,7vw,6rem)] font-extrabold tracking-[-0.02em] [font-stretch:62%]">
        {m.howTitle}
      </h2>
      <div className="mt-12 grid gap-12 lg:mt-4 lg:grid-cols-[1fr_minmax(0,28rem)] lg:gap-20">
        <ol className="order-2 lg:order-1">
          {m.how.map((step, i) => (
            <li
              key={step.title}
              ref={(el) => {
                items.current[i] = el;
              }}
              data-i={i}
              className="grid grid-cols-[auto_1fr] gap-x-6 border-t border-foreground/15 py-8 lg:min-h-[52svh] lg:items-center lg:border-0 lg:py-0"
            >
              <span
                aria-hidden
                className={cn(
                  "font-heading text-[clamp(4rem,9vw,8rem)] leading-[0.8] font-extrabold [font-stretch:56%] transition-colors duration-500",
                  wide && active !== i ? "text-foreground/12" : "text-primary",
                )}
              >
                {i + 1}
              </span>
              <div className={cn("transition-opacity duration-500", wide && active !== i && "opacity-90")}>
                <h3 className="text-3xl font-bold [font-stretch:72%] sm:text-4xl">{step.title}</h3>
                <p className="mt-3 max-w-[44ch] text-lg text-muted-foreground">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="order-1 lg:order-2">
          <div className="lg:sticky lg:top-[calc(50svh-17.5rem)]">
            <LandingDemo stage={wide ? (active as 0 | 1 | 2) : undefined} />
          </div>
        </div>
      </div>
    </section>
  );
}
