import type { CrisisLexicon } from "../types";

/** Machine-made lexicon, NOT reviewed by a native speaker: used only as an extra, conservative signal. */
export const lexicon: CrisisLexicon = {
  tag: "fa",
  reviewed: false,
  patterns: [
    /خودكشي|خودکشی/,
    /(?:ميخوام|ميخواهم|مي\s*خواهم|دلم\s+مي\s*خواد|دلم\s+مي\s*خواهد)\s+بميرم/,
    /(?:نميخوام|نميخواهم|نمي\s*خواهم|نمي\s*خوام)\s+(?:زنده\s+باشم|ادامه\s+بدم|ادامه\s+دهم|زندگي\s+كنم)/,
    /به\s+زندگي\s*(?:ام|م)?\s+پايان/,
    /خودم\s*(?:را|رو|و)\s+بكشم|خودمو\s+بكشم/,
    /(?:به\s+)?خودم\s+آسيب|به\s+خودم\s+اسيب/,
    /اوردوز|مصرف\s+بيش\s+از\s+حد\s+دارو/,
    /زندگي\s+ارزش\s+ندارد|زندگي\s+معني\s+ندارد/,
  ],
};
