import type { CrisisLexicon } from "../types";

/** Machine-made lexicon, NOT reviewed by a native speaker: used only as an extra, conservative signal. */
export const lexicon: CrisisLexicon = {
  tag: "pl",
  reviewed: false,
  patterns: [
    /samobojstw|samobojcz/,
    /\bchce\s+(?:umrzec|zginac|zniknac|sie\s+zabic)\b/,
    /\b(?:zabic|zabije|zabijam)\s+sie\b/,
    /\bnie\s+chce\s+(?:juz\s+)?(?:zyc|dalej\s+zyc)\b/,
    /\bodebrac\s+sobie\s+zycie\b/,
    /\bnie\s+ma\s+sensu\s+zyc\b|\bnie\s+warto\s+zyc\b/,
    /\bskrzywdzic\s+sie\b|\bzrobic\s+sobie\s+krzywde\b|\bsamookaleczen/,
    /\bprzedawkowa/,
    /\blepiej\s+(?:bym\s+)?(?:umarl|umarla)\b/,
  ],
};
