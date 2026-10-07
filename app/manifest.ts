import type { MetadataRoute } from "next";

export const dynamic = "force-static";

/** Web app manifest (installable PWA). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "TrialBridge",
    short_name: "TrialBridge",
    description: "Find cancer clinical trials that fit you, in minutes. Free and private.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fbf8f2",
    theme_color: "#155e63",
    categories: ["health", "medical"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/logo.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
    shortcuts: [{ name: "Find a trial", url: "/find/", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] }],
  };
}
