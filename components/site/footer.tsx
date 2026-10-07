import Link from "next/link";
import { useMessages, format } from "@/components/i18n";
import { LogoMark } from "./logo";

export function SiteFooter() {
  const m = useMessages();
  return (
    <footer className="no-print mt-auto border-t border-border bg-muted/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr]">
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-heading text-lg font-semibold">
            <LogoMark className="size-7" />
            {m.common.brand}
          </div>
          <p className="max-w-prose text-muted-foreground">{m.footer.tagline}</p>
          <p className="max-w-prose text-sm text-muted-foreground">{m.disclaimer.text}</p>
        </div>
        <div className="space-y-3 text-sm">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-base">
            <li>
              <Link href="/find/" className="underline-offset-4 hover:underline">
                {m.footer.find}
              </Link>
            </li>
            <li>
              <Link href="/privacy/" className="underline-offset-4 hover:underline">
                {m.footer.privacy}
              </Link>
            </li>
          </ul>
          <p className="text-muted-foreground">{m.footer.dataSource}</p>
          <p className="text-muted-foreground">{format(m.footer.copyright, { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </footer>
  );
}
