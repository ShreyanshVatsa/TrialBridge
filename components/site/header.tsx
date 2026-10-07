"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useEffect, useRef } from "react";
import { useMessages } from "@/components/i18n";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./language-switcher";
import { LogoMark } from "./logo";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  const m = useMessages();
  const pathname = usePathname();
  const menuRef = useRef<HTMLDetailsElement>(null);
  const links = [
    { href: "/access/", label: m.nav.accessIntel },
    { href: "/for-sites/", label: m.nav.forSites },
    { href: "/methodology/", label: m.nav.methodology },
    { href: "/about/", label: m.nav.about },
    { href: "/privacy/", label: m.nav.privacy },
  ];

  // Close the mobile menu after navigation.
  useEffect(() => {
    if (menuRef.current) menuRef.current.open = false;
  }, [pathname]);

  const isActive = (href: string) => (pathname ?? "").replace(/\/?$/, "/") === href;
  const linkClass = (href: string) =>
    cn(
      "rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground",
      isActive(href) && "font-medium text-foreground",
    );

  return (
    <header className="no-print sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 rounded-lg font-heading text-xl font-semibold tracking-tight">
          <LogoMark />
          <span className="sr-only min-[400px]:not-sr-only">{m.common.brand}</span>
        </Link>
        <nav aria-label={m.nav.label} className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={linkClass(l.href)} aria-current={isActive(l.href) ? "page" : undefined}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
          <Link href="/find/" className={cn(buttonVariants({ size: "sm" }), "hidden h-10 px-4 text-base sm:inline-flex")}>
            {m.nav.find}
          </Link>
          <details ref={menuRef} className="relative lg:hidden">
            <summary
              className="inline-flex size-11 cursor-pointer list-none items-center justify-center rounded-lg text-muted-foreground hover:bg-muted [&::-webkit-details-marker]:hidden"
              aria-label={m.nav.menu}
            >
              <Menu className="size-5" aria-hidden />
            </summary>
            <nav
              aria-label={m.nav.menu}
              className="absolute right-0 mt-2 flex w-60 flex-col rounded-2xl border border-border bg-popover p-2 shadow-lg"
            >
              <Link href="/find/" className="rounded-lg px-3 py-2.5 font-medium text-primary">
                {m.nav.find}
              </Link>
              {links.map((l) => (
                <Link key={l.href} href={l.href} className={cn(linkClass(l.href), "py-2.5")} aria-current={isActive(l.href) ? "page" : undefined}>
                  {l.label}
                </Link>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
