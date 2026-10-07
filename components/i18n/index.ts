"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { Language } from "@/lib/types/intake";
import { en, type Messages } from "./en";

export type { Messages };

/** UI languages (kept here, not imported from lib/types, so the i18n layer doesn't pull zod into every page). */
export const UI_LANGUAGES = ["en", "es", "pt", "ht"] as const satisfies readonly Language[];
const STORAGE_KEY = "tb-lang";

/** Non-English messages are code-split and loaded only when that language is chosen. */
const loaders: Record<Exclude<Language, "en">, () => Promise<Messages>> = {
  es: () => import("./es").then((x) => x.es),
  pt: () => import("./pt").then((x) => x.pt),
  ht: () => import("./ht").then((x) => x.ht),
};

interface State {
  /** Language whose messages are loaded and displayed. */
  lang: Language;
  messages: Messages;
}

const EN_STATE: State = { lang: "en", messages: en };
let state: State | null = null;
const listeners = new Set<() => void>();

function emit(next: State) {
  state = next;
  document.documentElement.lang = next.lang;
  listeners.forEach((l) => l());
}

function load(lang: Language) {
  if (lang === "en") {
    emit(EN_STATE);
    return;
  }
  loaders[lang]()
    .then((messages) => emit({ lang, messages }))
    .catch(() => {
      // Chunk failed to load (offline?): stay in the current language and reveal the page.
      document.documentElement.removeAttribute("data-lang-pending");
    });
}

function read(): State {
  if (state) return state;
  state = EN_STATE;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved !== "en" && (UI_LANGUAGES as readonly string[]).includes(saved)) load(saved as Language);
  } catch {
    // Storage blocked: English.
  }
  return state;
}

/** Choose the UI language. A display preference only: saved in localStorage, never sent anywhere. */
export function setLanguage(lang: Language): void {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Not persisted; still applies to this page view.
  }
  load(lang);
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function useI18nState(): State {
  return useSyncExternalStore(subscribe, read, () => EN_STATE);
}

export function useLanguage(): Language {
  return useI18nState().lang;
}

/** Active UI messages for the selected language. */
export function useMessages(): Messages {
  return useI18nState().messages;
}

/** Replace {name} placeholders with values. Unknown placeholders are left as-is. */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

/** BCP 47 locale for Intl formatting. */
export function localeFor(lang: Language): string {
  return { en: "en-US", es: "es-US", pt: "pt-BR", ht: "ht" }[lang];
}

/** Reveals the page once the saved language has rendered (theme-init.js hides it to avoid an English flash). */
export function LanguageReady(): null {
  const lang = useLanguage();
  useEffect(() => {
    const root = document.documentElement;
    const pending = root.getAttribute("data-lang-pending");
    if (!pending || pending === lang) root.removeAttribute("data-lang-pending");
  }, [lang]);
  return null;
}
