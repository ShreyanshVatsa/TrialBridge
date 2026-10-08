"use client";

import Link from "next/link";
import { useMessages } from "@/components/i18n";
import { HowItWorks } from "@/components/landing/how-it-works";
import { LensHero } from "@/components/landing/lens-hero";
import { Magnetic } from "@/components/landing/magnetic";
import { LandingStat } from "@/components/landing/stat";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LandingPage() {
  const m = useMessages().landing;
  return (
    <main id="main" className="flex-1">
      <LensHero />

      {/* Real national numbers, from the ingested dataset */}
      <section aria-label={m.statTrials} className="bg-ink text-paper dark:bg-card dark:text-foreground">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <LandingStat />
        </div>
      </section>

      <HowItWorks />

      {/* Promises: the title widens on its variable width axis when you point at a row */}
      <section aria-labelledby="promises-title" className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 sm:pb-32">
        <h2 id="promises-title" className="font-sans text-lg font-semibold text-muted-foreground [font-stretch:100%]">
          {m.promisesTitle}
        </h2>
        <ul className="mt-6 border-b border-foreground/15">
          {m.promises.map((p) => (
            <li key={p.title} className="group grid gap-3 border-t border-foreground/15 py-8 md:grid-cols-[1.3fr_1fr] md:items-end md:gap-12 md:py-10">
              <h3 className="text-[clamp(2.5rem,6.2vw,5.25rem)] leading-[0.9] font-extrabold tracking-[-0.02em] [font-stretch:60%] transition-[font-stretch,color] duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:text-primary group-hover:[font-stretch:80%] md:whitespace-nowrap motion-reduce:transition-none">
                {p.title}
              </h3>
              <p className="max-w-[40ch] text-lg text-muted-foreground">{p.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* For research sites teaser */}
      <section aria-labelledby="sites-title" className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-8 rounded-[2.5rem] bg-lavender p-8 text-ink sm:p-14 md:grid-cols-[1fr_1fr] md:items-end md:gap-16">
          <h2 id="sites-title" className="text-[clamp(2.25rem,5vw,4rem)] font-extrabold tracking-[-0.02em] [font-stretch:64%]">
            {m.sitesTitle}
          </h2>
          <div>
            <p className="max-w-[52ch] text-lg">{m.sitesBody}</p>
            <Link
              href="/for-sites/"
              className="mt-6 inline-flex min-h-12 items-center rounded-full bg-ink px-6 font-medium text-paper transition-transform hover:-translate-y-0.5 focus-visible:outline-ink"
            >
              {m.sitesLink}
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-4 py-28 text-center sm:px-6 sm:py-40">
        <h2 className="text-[clamp(3.25rem,10vw,9rem)] leading-[0.88] font-extrabold tracking-[-0.03em] [font-stretch:58%]">{m.finalTitle}</h2>
        <p className="mx-auto mt-6 max-w-[48ch] text-lg text-muted-foreground">{m.finalBody}</p>
        <Magnetic className="mt-10">
          <Link href="/find/" className={cn(buttonVariants({ size: "lg" }), "min-h-16 px-10 text-xl")}>
            {m.cta}
          </Link>
        </Magnetic>
      </section>
    </main>
  );
}
