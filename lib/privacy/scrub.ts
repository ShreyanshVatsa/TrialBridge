/**
 * Remove likely personal information from free text before it leaves the browser and again on
 * the server: emails, phone numbers, SSNs, dates (e.g. dates of birth), ZIP codes, long digit
 * strings. Conservative by design: it may remove harmless numbers too.
 */
const PATTERNS: RegExp[] = [
  /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, // email
  /\b\d{3}-\d{2}-\d{4}\b/g, // SSN
  /(?:\+?1[\s.-]?)?\(?\b\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g, // U.S. phone
  /\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/g, // 01/02/1960
  /\b\d{4}-\d{2}-\d{2}\b/g, // 1960-01-02
  /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+\d{1,2},?\s+\d{4}\b/gi, // March 3, 1960
  /\b(?:born|dob|date of birth|nac[ií]|nasci|fèt)\b[^.,;!?]{0,30}/gi, // "born on March 3 1960"
  /\b\d{5}(?:-\d{4})?\b/g, // ZIP / ZIP+4
  /\b\d{6,}\b/g, // long digit strings (MRNs, IDs)
];

export function scrubPersonalInfo(text: string): { text: string; removed: number } {
  let removed = 0;
  let out = text;
  for (const re of PATTERNS) {
    out = out.replace(re, () => {
      removed++;
      return "[removed]";
    });
  }
  return { text: out.replace(/\s+/g, " ").trim(), removed };
}
