import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "@fontsource-variable/inter";
import "@fontsource-variable/fraunces";
import "./globals.css";
import { en } from "@/components/i18n/en";
import { SessionProvider } from "@/components/session/session-provider";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";

export const metadata: Metadata = {
  title: { default: en.meta.title, template: "%s · TrialBridge" },
  description: en.meta.description,
  applicationName: "TrialBridge",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf8f2" },
    { media: "(prefers-color-scheme: dark)", color: "#13181f" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: /theme-init.js may add the "dark" class before React hydrates.
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col">
        <Script src="/theme-init.js" strategy="beforeInteractive" />
        <a
          href="#main"
          className="sr-only z-50 rounded-lg bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          {en.common.skipToContent}
        </a>
        <SessionProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </SessionProvider>
      </body>
    </html>
  );
}
