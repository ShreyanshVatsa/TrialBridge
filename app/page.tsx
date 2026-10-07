import Link from "next/link";
import { ArrowRight, Building2, HandHeart, Lock, Scale } from "lucide-react";
import { en } from "@/components/i18n/en";
import { LandingDemo } from "@/components/landing/demo";
import { LandingStat } from "@/components/landing/stat";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const promiseIcons = [HandHeart, Lock, Scale];

export default function Home() {
  const m = en.landing;
  return (
    <main id="main" className="flex-1">
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-12 pb-16 sm:px-6 sm:pt-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pb-24">
        <div>
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">{m.eyebrow}</p>
          <h1 className="mt-4 text-[2.6rem] leading-[1.05] font-semibold text-balance sm:text-6xl lg:text-[4.25rem]">{m.headline}</h1>
          <p className="mt-6 max-w-[60ch] text-lg text-muted-foreground sm:text-xl">{m.sub}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/find/" className={cn(buttonVariants({ size: "lg" }), "h-14 px-7 text-lg")}>
              {m.cta}
              <ArrowRight aria-hidden />
            </Link>
            <Link href="/privacy/" className={cn(buttonVariants({ size: "lg", variant: "ghost" }), "h-14 text-lg")}>
              {m.ctaSecondary}
            </Link>
          </div>
        </div>
        <LandingDemo />
      </section>

      {/* Real national statistic */}
      <section aria-label={m.statTrials} className="border-y border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <LandingStat />
        </div>
      </section>

      {/* How it works */}
      <section aria-labelledby="how-title" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <h2 id="how-title" className="text-3xl font-semibold sm:text-4xl">
          {m.howTitle}
        </h2>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {m.how.map((step, i) => (
            <li key={step.title} className="rounded-2xl border border-border bg-card p-6">
              <span className="flex size-10 items-center justify-center rounded-full bg-secondary font-heading text-lg font-semibold text-secondary-foreground" aria-hidden>
                {i + 1}
              </span>
              <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Promises */}
      <section aria-labelledby="promises-title" className="bg-secondary/50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <h2 id="promises-title" className="text-3xl font-semibold sm:text-4xl">
            {m.promisesTitle}
          </h2>
          <ul className="mt-10 grid gap-8 md:grid-cols-3">
            {m.promises.map((p, i) => {
              const Icon = promiseIcons[i] ?? Lock;
              return (
                <li key={p.title}>
                  <Icon className="size-7 text-primary" aria-hidden />
                  <h3 className="mt-3 text-xl font-semibold">{p.title}</h3>
                  <p className="mt-2 text-muted-foreground">{p.body}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* For research sites teaser */}
      <section aria-labelledby="sites-title" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid gap-6 rounded-3xl border border-border bg-card p-8 sm:p-10 md:grid-cols-[auto_1fr] md:items-start">
          <Building2 className="size-9 text-primary" aria-hidden />
          <div>
            <h2 id="sites-title" className="text-2xl font-semibold sm:text-3xl">
              {m.sitesTitle}
            </h2>
            <p className="mt-3 max-w-[65ch] text-muted-foreground">{m.sitesBody}</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20 text-center sm:px-6">
        <h2 className="text-3xl font-semibold sm:text-4xl">{m.finalTitle}</h2>
        <p className="mx-auto mt-3 max-w-prose text-muted-foreground">{m.finalBody}</p>
        <Link href="/find/" className={cn(buttonVariants({ size: "lg" }), "mt-8 h-14 px-7 text-lg")}>
          {m.cta}
          <ArrowRight aria-hidden />
        </Link>
      </section>
    </main>
  );
}
