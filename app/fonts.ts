import localFont from "next/font/local";

/**
 * Self-hosted fonts via next/font: preloaded, with size-adjusted fallbacks so text doesn't shift or
 * re-render late when the web font arrives. Latin subset covers English, Spanish, Portuguese, Haitian Creole.
 */
export const inter = localFont({
  src: "../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});

export const fraunces = localFont({
  src: "../node_modules/@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2",
  variable: "--font-fraunces",
  weight: "100 900",
  display: "swap",
  fallback: ["ui-serif", "Georgia", "Times New Roman", "serif"],
});
