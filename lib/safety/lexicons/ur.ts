import type { CrisisLexicon } from "../types";

/** Machine-made lexicon, NOT reviewed by a native speaker: used only as an extra, conservative signal. */
export const lexicon: CrisisLexicon = {
  tag: "ur",
  reviewed: false,
  patterns: [
    /خودكشي/,
    /مرنا\s+چاه/,
    /(?:جينا|زنده\s+رهنا)\s+نهين\s+چاه|زنده\s+نهين\s+رهنا\s+چاه/,
    /اپني\s+(?:جان\s+ل|زندگي\s+ختم)/,
    /خود\s+كو\s+(?:مار|ختم|نقصان|تكليف)/,
    /اوور\s*ڈوز|زياده\s+مقدار\s+مين\s+دوا/,
    /زندگي\s+بي\s*معني|جينے\s+كا\s+كوئي\s+مطلب\s+نهين/,
  ],
};
