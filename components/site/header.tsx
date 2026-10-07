import Link from "next/link";
import { useMessages } from "@/components/i18n";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogoMark } from "./logo";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  const m = useMessages();
  return (
    <header className="no-print sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 rounded-lg font-heading text-xl font-semibold tracking-tight">
          <LogoMark />
          <span>{m.common.brand}</span>
        </Link>
        <nav aria-label={m.nav.label} className="flex items-center gap-1 sm:gap-2">
          <Link href="/privacy/" className="hidden rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground sm:inline-block">
            {m.nav.privacy}
          </Link>
          <ThemeToggle />
          <Link href="/find/" className={cn(buttonVariants({ size: "sm" }), "h-10 px-4 text-base")}>
            {m.nav.find}
          </Link>
        </nav>
      </div>
    </header>
  );
}
