/**
 * Client-side crisis detector for Trial Q&A (PLAN Part 4: serious distress => supportive reply with
 * crisis resources: U.S. call or text 988, emergencies 911, and "tell your care team").
 *
 * Runs in the browser from static patterns, with no network call, so crisis resources still appear
 * when the API is offline, rate limited, or failing. It checks all four languages regardless of the
 * UI language, on accent-stripped lowercase text ("suicídio" and "suicidio" both match). It is
 * deliberately conservative: a false positive only shows a supportive box with phone numbers.
 */
import type { AskResponse } from "@/lib/types/ask";

const PATTERNS: readonly RegExp[] = [
  // English
  /suicid/,
  /\bkill(?:ing)?\s+(?:my\s*self|myself)\b/,
  /\b(?:end|ending|ended|take|taking)\s+(?:my|his|her)\s+(?:own\s+)?life\b/,
  /\b(?:end|ending)\s+it\s+all\b/,
  /\b(?:want|wanna|wish|going|plan|planning)\s+(?:to\s+)?(?:die|be\s+dead)\b/,
  /\bwish\s+(?:i|that\s+i)\s+(?:were|was|could\s+be)\s+dead\b/,
  /\b(?:better|best)\s+off\s+(?:dead|without\s+me)\b/,
  /\b(?:do\s*n'?t|do\s+not|no\s+longer)\s+want\s+to\s+(?:live|be\s+alive|be\s+here|exist|go\s+on)\b/,
  /\b(?:no|any)\s+reason\s+to\s+(?:live|go\s+on|be\s+alive)\b/,
  /\bpoint\s+(?:of|in)\s+(?:living|going\s+on|life|being\s+alive)\b/,
  /\bover\s*dos(?:e|ing)\b/,
  /\b(?:hurt|hurting|harm|harming|cut|cutting)\s+(?:my\s*self|myself)\b/,
  /\bself[\s-]*harm/,
  // Spanish
  /\bmatarme\b/,
  /\bquitarme\s+la\s+vida\b/,
  /\b(?:acabar|terminar|acabo|termino)\s+con\s+(?:mi\s+vida|todo)\b/,
  /\bquiero\s+(?:morir|morirme|desaparecer)\b/,
  /\bno\s+quiero\s+(?:vivir|seguir\s+viviendo|estar\s+aqui)\b/,
  /\bmejor\s+(?:muert[oa]|estar\s+muert[oa])\b/,
  /\bojala\s+(?:estuviera|estuviese)\s+muert[oa]\b/,
  /\b(?:hacerme\s+dano|lastimarme|hacerme\s+mal)\b/,
  /\bno\s+vale\s+la\s+pena\s+vivir\b/,
  /\bsobredosis\b/,
  // Portuguese
  /\bme\s+matar\b/,
  /\b(?:tirar|acabar\s+com)\s+(?:a\s+)?minha\s+vida\b/,
  /\bacabar\s+com\s+tudo\b/,
  /\bquero\s+morrer\b/,
  /\bnao\s+quero\s+(?:mais\s+)?(?:viver|estar\s+aqui)\b/,
  /\bmelhor\s+(?:morto|morta|estar\s+morto|estar\s+morta)\b/,
  /\b(?:me\s+machucar|me\s+ferir|automutilacao|auto\s*mutilacao)\b/,
  // Haitian Creole
  /\bsw?u?i[sc]id/,
  /\btouye\s+(?:tet\s+)?(?:mwen|m)\b/,
  /\bmwen\s+(?:vle|ta\s+renmen)\s+mouri\b/,
  /\bmwen\s+pa\s+(?:vle|anvi)\s+viv\b/,
  /\b(?:fini|mete\s+fen)\s+(?:ak|nan)\s+lavi\s+(?:mwen|m)\b/,
  /\bfe\s+(?:tet\s+)?(?:mwen|m)\s+mal\b/,
  /\boverdoz\b/,
];

export function normalizeForCrisis(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[‘’ʼ`]/g, "'")
    .replace(/\s+/g, " ");
}

export function detectCrisisLocal(text: string): boolean {
  const t = normalizeForCrisis(text);
  return PATTERNS.some((re) => re.test(t));
}

/** Response shown for a locally detected crisis message (no request is made). */
export function localCrisisResponse(): AskResponse {
  return { status: "ok", kind: "crisis", answer: "", citations: [], crisis: true, piiRemoved: false, experimental: false, cached: false, provider: null };
}
