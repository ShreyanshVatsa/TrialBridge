import type { CrisisLexicon } from "../types";

/** Machine-made lexicon, NOT reviewed by a native speaker: used only as an extra, conservative signal. */
export const lexicon: CrisisLexicon = {
  tag: "gu",
  reviewed: false,
  patterns: [
    /આત્મહત્યા/,
    /મરી\s+જવ|મરવા\s+માંગ|મરવું\s+છે/,
    /જીવવા\s+માંગ[^ ]*\s+નથી|જીવવાનું\s+મન\s+નથી/,
    /જીવન\s+(?:પૂરું|ટૂંકાવ)/,
    /પોતાને\s+(?:મારી|નુકસાન)/,
    /ઓવરડોઝ|દવાનો\s+વધુ\s+ડોઝ/,
    /જીવનનો\s+કોઈ\s+અર્થ\s+નથી/,
  ],
};
