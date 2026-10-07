/**
 * Rule-layer eligibility patterns (always runs on every trial). Applied by lib/ingest/facts.ts.
 * Patterns are deliberately conservative: when direction is unclear the fact is "mentioned",
 * which never penalizes a patient.
 */
export const CRITERIA_RULES_VERSION = "1";

/** Prior-treatment facts: a pattern that identifies the therapy type in a criterion. */
export const THERAPY_PATTERNS = {
  prior_chemotherapy: /\bchemo(therap(y|ies)|immunotherapy)?\b|\bcytotoxic\b/i,
  prior_radiation: /\b(radiation|radiotherapy|radiosurgery|SBRT|SRS|irradiation)\b/i,
  prior_surgery: /\b(surgery|surgical|resection|resected|mastectomy|lumpectomy|prostatectomy)\b/i,
  prior_immunotherapy: /\b(immunotherap(y|ies)|immune checkpoint|checkpoint inhibitor|anti-?PD-?L?1|anti-?CTLA-?4|CAR[- ]?T)\b/i,
  prior_targeted_therapy: /\b(targeted therap(y|ies)|tyrosine kinase inhibitor|TKIs?|PARP inhibitor|CDK ?4\/6 inhibitor|kinase inhibitor)\b/i,
} as const;

/** The criterion is about treatment history (not, e.g., a planned study procedure). */
export const PRIOR_CONTEXT = /\b(prior|previous(ly)?|preceding|received|receiving|treated with|history of|exposure to|naive|na[iï]ve|any line|lines? of|refractory|progress(ed|ion)|after|following)\b/i;
/** Negations inside an inclusion criterion ("no prior chemotherapy") flip it to excluded. */
export const NEGATION = /\b(no|not|never|without|must not|cannot|none)\b/i;
/** "Prior X is allowed" does not make X required or excluded -> mentioned. */
export const ALLOWED = /\b(allowed|permitted|acceptable|may have (had|received)|is not required|are eligible)\b/i;
/** Washout windows ("within 4 weeks") are timing rules, not "never treated" rules -> mentioned. */
export const WASHOUT = /\bwithin\s+(\d+|one|two|three|four|six)\b|\bwash-?out\b|\b\d+\s*(days?|weeks?|months?|half-lives)\s+(prior|before|of)\b|\blast dose\b/i;

export const METASTATIC = /\b(metasta(tic|sis|ses|sized)|stage\s*(iv|4)\b|distant (disease|spread))/i;
export const LOCAL_METASTASES_ONLY = /\b(brain|cns|central nervous system|leptomeningeal|spinal cord|bone)\s+metasta/i;
export const NON_METASTATIC = /\bnon-?metastatic\b|\bno (evidence of )?(distant )?metasta|\bwithout (distant )?metasta|\bm0\b/i;

export const NEWLY_DIAGNOSED = /\b(newly diagnosed|treatment[- ]na[iï]ve|previously untreated|untreated|no prior (systemic )?(therapy|treatment|anti-?cancer))\b/i;
export const PREVIOUSLY_TREATED = /\b(relapsed|refractory|recurrent|progress(ed|ion) (on|after|following|during)|previously treated|at least (one|1|two|2|three|3) (prior )?(line|regimen|therap))/i;

export const PREGNANCY = /\b(pregnan(t|cy)|breast[- ]?feeding|lactating|nursing)\b/i;

export const CONCURRENT_TRIAL =
  /\b(another|other|concurrent|simultaneous|concomitant)\b[^.;]{0,50}\b(investigational|clinical (trial|study)|interventional (trial|study)|therapeutic (trial|study))|\bparticipat(e|es|ing|ion) in (another|other|any other)\b[^.;]{0,40}\b(study|trial)/i;

/** Biomarker direction words. */
export const POSITIVE_WORDS = /\b(positive|positivity|mutat(ion|ed|ions)|mutant|amplif(ied|ication)|overexpress(ion|ing)?|fusion|rearrange(d|ment)|high|deficient|altered|alteration|variant|expressing)\b|\+/i;
export const NEGATIVE_WORDS = /\b(negative|wild[- ]?type|absence|non-?(mutated|amplified)|not (mutated|amplified)|low|proficient)\b|-negative|\bwt\b/i;
