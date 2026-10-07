"use client";

import { Globe } from "lucide-react";
import { useId } from "react";
import { setLanguage, UI_LANGUAGES, useLanguage, useMessages } from "@/components/i18n";
import type { Language } from "@/lib/types/intake";

/** Short native names; full names live in messages.options.language. */
const NATIVE: Record<Language, string> = { en: "English", es: "Español", pt: "Português", ht: "Kreyòl" };

export function LanguageSwitcher() {
  const m = useMessages();
  const lang = useLanguage();
  const id = useId();
  return (
    <div className="relative flex items-center">
      <label htmlFor={id} className="sr-only">
        {m.nav.language}
      </label>
      <Globe className="pointer-events-none absolute left-2.5 size-4 text-muted-foreground" aria-hidden />
      <select
        id={id}
        value={lang}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="h-11 appearance-none rounded-lg bg-transparent pr-2 pl-8 text-sm text-foreground hover:bg-muted sm:text-base"
      >
        {UI_LANGUAGES.map((l) => (
          <option key={l} value={l} lang={l}>
            {NATIVE[l]}
          </option>
        ))}
      </select>
    </div>
  );
}
