import type { Metadata, Viewport } from "next";
import "./globals.css";
import { fraunces, inter } from "./fonts";
import { en } from "@/components/i18n/en";
import { SessionProvider } from "@/components/session/session-provider";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { ServiceWorkerRegister } from "@/components/site/sw-register";
import { SkipLink } from "@/components/site/skip-link";
import { LanguageReady } from "@/components/i18n";

export const metadata: Metadata = {
  title: { default: en.meta.title, template: "%s · TrialBridge" },
  description: en.meta.description,
  applicationName: "TrialBridge",
  appleWebApp: { capable: true, title: "TrialBridge", statusBarStyle: "default" },
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
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${fraunces.variable}`}>
      <head>
        {/* Blocking on purpose: sets theme + language before first paint (tiny, same-origin, CSP-safe). */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/theme-init.js" />
      </head>
      <body className="flex min-h-dvh flex-col">
        <LanguageReady />
        <SkipLink />
        <SessionProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
          <ServiceWorkerRegister />
        </SessionProvider>
      </body>
    </html>
  );
}
