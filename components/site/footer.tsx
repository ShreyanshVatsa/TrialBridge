"use client";

import Link from "next/link";
import { format, useLanguage, useMessages } from "@/components/i18n";
import { LogoMark } from "./logo";

export function SiteFooter() {
  const m = useMessages();
  const lang = useLanguage();
  const columns = [
    {
      title: m.footer.product,
      links: [
        { href: "/find/", label: m.nav.find },
        { href: "/access/", label: m.nav.accessIntel },
        { href: "/methodology/", label: m.nav.methodology },
      ],
    },
    {
      title: m.footer.company,
      links: [
        { href: "/about/", label: m.nav.about },
        { href: "/for-sites/", label: m.nav.forSites },
      ],
    },
    {
      title: m.footer.legal,
      links: [
        { href: "/privacy/", label: m.footer.privacy },
        { href: "/privacy-policy/", label: m.footer.privacyPolicy },
        { href: "/terms/", label: m.footer.terms },
      ],
    },
  ];
  return (
    <footer className="no-print mt-auto border-t border-border bg-muted/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.3fr_2fr]">
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-heading text-lg font-semibold">
            <LogoMark className="size-7" />
            {m.common.brand}
          </div>
          <p className="max-w-prose text-muted-foreground">{m.footer.tagline}</p>
          <p className="max-w-prose text-sm text-muted-foreground">{m.disclaimer.text}</p>
          {lang !== "en" && <p className="text-sm font-medium">{m.footer.translationNote}</p>}
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {columns.map((c) => (
            <div key={c.title}>
              <h2 className="font-sans text-sm font-semibold tracking-wide text-muted-foreground uppercase">{c.title}</h2>
              <ul className="mt-3 space-y-2">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="underline-offset-4 hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto max-w-6xl space-y-1 border-t border-border px-4 py-6 text-sm text-muted-foreground sm:px-6">
        <p>{m.footer.dataSource}</p>
        <p>{format(m.footer.copyright, { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
}
