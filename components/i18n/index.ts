"use client";

import { useSyncExternalStore } from "react";
import { LANGUAGES, type Language } from "@/lib/types/intake";
import { en, type Messages } from "./en";
import { es } from "./es";
import { pt } from "./pt";
import { ht } from "./ht";

export type { Messages };

const MESSAGES: Record<Language, Messages> = { en, es, pt, ht };
const STORAGE_KEY = "tb-lang";

/**
 * UI language store. The chosen language is a display preference only (saved in localStorage,
 * never sent anywhere). Server-rendered HTML is English; the saved language applies after hydration.
 */
let current: Language | null = null;
const listeners = new Set<() => void>();

function read(): Language {
  if (current) return current;
  let lang: Language = "en";
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && (LANGUAGES as readonly string[]).includes(saved)) lang = saved as Language;
  } catch {
    // Storage blocked: default to English.
  }
  current = lang;
  document.documentElement.lang = lang;
  return lang;
}

export function setLanguage(lang: Language): void {
  current = lang;
  document.documentElement.lang = lang;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Not persisted; still applies to this page view.
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useLanguage(): Language {
  return useSyncExternalStore(subscribe, read, () => "en");
}

/** Active UI messages for the selected language. */
export function useMessages(): Messages {
  return MESSAGES[useLanguage()];
}

/** Replace {name} placeholders with values. Unknown placeholders are left as-is. */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

/** BCP 47 locale for Intl formatting. Haitian Creole falls back to French number/date formats if unsupported. */
export function localeFor(lang: Language): string {
  return { en: "en-US", es: "es-US", pt: "pt-BR", ht: "ht" }[lang];
}
