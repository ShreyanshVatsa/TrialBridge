/**
 * Rule-layer eligibility patterns (always runs on every trial). Applied by lib/ingest/facts.ts.
 * Patterns are deliberately conservative: when direction is unclear the fact is "mentioned",
 * which never penalizes a patient.
 */
export const CRITERIA_RULES_VERSION = "2";

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
export const ALLOWED = /\b(allowed|permitted|acceptable|(may|could|can) have (previously )?(had|received)|(may|can) (still )?(receive|have)|is not required|are eligible|not (be )?eligible|ineligible|not (a )?candidates?|intolerant|recovered from|toxicit(y|ies)|adverse events?|side effects?)\b/i;
/** Washout windows ("within 4 weeks") are timing rules, not "never treated" rules -> mentioned. */
export const WASHOUT = /\bwithin\s+(\d+|one|two|three|four|six)\b|\bwash-?out\b|\b\d+\s*(days?|weeks?|months?|half-lives)\s+(prior|before|of)\b|\blast dose\b|\bwash(ed)?[- ]?out\b/i;

export const METASTATIC = /\b(metasta(tic|sis|ses|sized)|stage\s*(iv|4)\b|distant (disease|spread))/i;
export const LOCAL_METASTASES_ONLY = /\b(brain|cns|central nervous system|leptomeningeal|spinal cord|bone)\s+metasta|\bmetasta\w*\s+(to|in|of)\s+(the\s+)?(brain|cns|central nervous system|bones?|spine|spinal cord|leptomeninges)/i;
export const NON_METASTATIC = /\bnon-?metastatic\b|\bno (evidence of )?(distant )?metasta|\bwithout (distant )?metasta|\bm0\b/i;

export const NEWLY_DIAGNOSED = /\b(newly diagnosed|treatment[- ]na[iï]ve|previously untreated|untreated|no prior (systemic )?(therapy|treatment|anti-?cancer))\b/i;
export const PREVIOUSLY_TREATED = /\b(relapsed|refractory|recurrent|progress(ed|ion) (on|after|following|during)|previously treated|at least (one|1|two|2|three|3) (prior )?(line|regimen|therap))/i;

export const PREGNANCY = /\b(pregnan(t|cy)|breast[- ]?feeding|lactating|nursing)\b/i;

export const CONCURRENT_TRIAL =
  /\b(another|other|concurrent|simultaneous|concomitant)\b[^.;]{0,50}\b(investigational|clinical (trial|study)|interventional (trial|study)|therapeutic (trial|study))|\bparticipat(e|es|ing|ion) in (another|other|any other)\b[^.;]{0,40}\b(study|trial)/i;

/** Biomarker direction words. */
export const POSITIVE_WORDS = /\b(positive|positivity|mutat(ion|ed|ions)|mutant|amplif(ied|ication)|overexpress(ion|ing)?|fusion|rearrange(d|ment)|high|deficient|altered|alteration|variant|expressing)\b|\+/i;
export const NEGATIVE_WORDS = /\b(negative|wild[- ]?type|absence|non-?(mutated|amplified)|not (mutated|amplified)|low|proficient)\b|-negative|\bwt\b/i;

/** Triple-negative breast cancer (ER-, PR-, HER2-). */
export const TRIPLE_NEGATIVE = /\btriple[- ]negative\b|\bTNBC\b/i;

/** Words that offer an alternative next to a fact ("A or B", "A/B", "A to B"): the fact is then one option, not a requirement. */
export const ALTERNATIVE_NEAR = /\b(or|and\/or)\b|\//i;
/** Same, without the slash ("HR+/HER2-" lists two markers, it does not offer a choice). */
export const OR_NEAR = /\b(or|and\/or)\b/i;
/** Other stages mentioned with metastatic/stage IV ("Stage III or IV", "stages I-IV") => metastatic is not required. */
export const OTHER_STAGES = /\bstages?\s*(i{1,3}|[123])[a-c]?\b/i;
/** A criterion about a different (other/second/prior) malignancy, not the study disease. */
export const OTHER_MALIGNANCY = /\b(other|another|second|additional|prior|previous|history of|concurrent)\b[^.;]{0,40}\b(malignan|cancer|neoplasm|carcinoma|tumou?r)/i;
/** Examples/parentheticals ("e.g., prior surgery") name a cause, not the criterion's own requirement. */
export const EXAMPLE_CONTEXT = /\b(e\.g|i\.e|such as|for example|for instance|including|due to|secondary to|resulting from)\b/i;
/** "unless adequately treated", "other than", "except" turn a rule into a conditional. */
export const UNLESS = /\b(unless|other than|except|excluding)\b/i;
/** The criterion lists several tumor types ("one of the following cancers", "tumor types"). */
export const LIST_CONTEXT = /\bone of the following\b|\bfollowing (cancers?|tumou?rs?|tumou?r types?|diseases?|histolog\w*|types?)\b|\btumou?r types?\b|\bcancer types\b/i;
