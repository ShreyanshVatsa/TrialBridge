import type { CrisisLexicon } from "../types";

/** Machine-made lexicon, NOT reviewed by a native speaker: used only as an extra, conservative signal. */
export const lexicon: CrisisLexicon = {
  tag: "bn",
  reviewed: false,
  patterns: [
    /আত্মহত্যা|আত্মঘাতী/,
    /মরতে\s+চাই|মরে\s+যেতে\s+চাই/,
    /বাঁ?চতে\s+(?:চাই\s+না|ইচ্ছা\s+করে\s+না)/,
    /(?:জীবন|নিজেকে)\s+শেষ\s+(?:করে|করতে|করব)/,
    /নিজেকে\s+(?:মেরে|আঘাত)|নিজের\s+ক্ষতি/,
    /ওভারডোজ|অতিরিক্ত\s+ওষুধ/,
    /বেঁ?চে\s+থেকে\s+লাভ\s+নেই|জীবনের\s+কোনো\s+মানে\s+নেই/,
  ],
};
