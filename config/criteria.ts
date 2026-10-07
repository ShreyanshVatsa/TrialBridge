/**
 * Rule-layer eligibility patterns (always runs on every trial). Applied by lib/ingest/facts.ts.
 * Patterns are deliberately conservative: when direction is unclear the fact is "mentioned",
 * which never penalizes a patient.
 */
import type { CancerGroupId } from "./cancer-groups";
import type { DrugClassId, HistologyId } from "./questionnaire/ids";

export const CRITERIA_RULES_VERSION = "3";

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
export const POSITIVE_WORDS = /\b(positive|positivity|mutat(ion|ed|ions)|mutant|amplif(ied|ication)|overexpress(ion|ing)?|fusion|rearrange(d|ment)|high|deficient|altered|alteration|variant|expressing|methylated)\b|\+/i;
export const NEGATIVE_WORDS = /\b(negative|wild[- ]?type|absence|non-?(mutated|amplified)|not (mutated|amplified)|low|proficient|unmethylated)\b|-negative|\bwt\b/i;

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

// ---------------------------------------------------------------------------------------------
// v2 fact families (QUESTIONNAIRE_SPEC §1.4). Applied by lib/ingest/eligibility-facts.ts.
// Same philosophy: a directional fact only when the reading is clear; otherwise "mentioned".
// ---------------------------------------------------------------------------------------------

/** Number words used in eligibility text. */
export const NUMBER_WORDS: Readonly<Record<string, number>> = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, first: 1, second: 2, third: 3, fourth: 4, single: 1 };
/** A number token: digits, a number word, or "1st/2nd/3rd". */
export const NUM = String.raw`(\d{1,3}|zero|one|two|three|four|five|six|seven|eight|nine|ten|single)`;

/** Criterion applies only to one cohort/part/arm ("Part 2:", "Cohort B -", "Dose expansion:"). */
export const COHORT_PREFIX = /^\s*(\(?[a-z0-9ivx]{1,3}[.)]\s*)?[*•-]?\s*(\(?\b(part|cohort|arm|group|phase|stage|step|escalation|expansion|dose[- ](escalation|expansion)|module|substudy|sub-study|segment|stratum|consolidation|induction|maintenance)\b[^:]{0,60}[:)]|for (part|cohort|arm|phase)\b|in (part|cohort|arm)\b)/i;

/** Performance status mentions. */
export const ECOG_MENTION = /\b(ECOG|Eastern Cooperative (Oncology )?Group|Zubrod|WHO performance status|WHO PS)\b/i;
export const KPS_MENTION = /\b(Karnofsky|KPS|Lansky)\b/i;
export const PERFORMANCE_MENTION = /\b(ECOG|Eastern Cooperative|Zubrod|Karnofsky|KPS|Lansky|performance status|performance score|\bPS\b)/i;

/** Brain / CNS metastases. Leptomeningeal-only text is a different condition and is not used. */
export const BRAIN_METS = /\b(brain|cns|central nervous system|intracranial|cerebral|parenchymal (brain|cns))\s+(metasta\w*|mets|lesions? from|disease from|involvement by (solid|the) tumou?r)|\bmetasta\w*\s+(to|in|of|involving)\s+(the\s+)?(brain|cns|central nervous system)\b|\bbrain mets\b|\bBM\b(?=s?\b)/i;
/** Qualifiers that limit a brain-mets exclusion to active disease, or carve out treated/stable disease. */
export const BRAIN_ACTIVE = /\b(active|untreated|symptomatic|progressive|progressing|unstable|uncontrolled|not (been )?(adequately )?(treated|controlled)|requiring (immediate |ongoing |urgent )?(steroids|corticosteroids|treatment|therapy|intervention)|require (steroids|corticosteroids|treatment)|new or (progressive|enlarging)|growing)\b/i;
export const BRAIN_CARVEOUT = /\b(unless|except|provided|if they|if the|eligible|allowed|permitted|may (participate|enroll|be (included|enrolled|eligible))|can (participate|enroll)|are acceptable|stable|previously treated|treated and)\b/i;
/** Inclusion wording that makes brain metastases the trial's subject (radiosurgery, CNS-penetrant drugs). */
export const BRAIN_REQUIRED = /\b(must have|presence of|diagnosis of|diagnosed with|at least (one|1)|confirmed|evidence of|newly diagnosed|new or recurrent|radiographic(ally)?|lesions?\b|\d+\s*(-|to)\s*\d+\s*brain)/i;

/** Measurable disease (RECIST, RANO, Lugano, IMWG, PCWG). */
export const MEASURABLE = /\bmeasurable\b/i;
export const MEASURABLE_OPTIONAL = /\b(evaluable|non-?measurable|not (be )?required|or assessable|and\/or|may have|either|unmeasurable|or bone[- ]only|bone[- ]only|(does|do|need) not (have to |need to )?be|need not|not necessary|regardless)\b/i;
/** Definitions of what counts as measurable (target-lesion rules), not a requirement. */
export const MEASURABLE_DEFINITION = /\b((are|is|be|may be|will be) (considered|deemed|regarded as) measurable|measurable (lesions?|disease) (that|which|located|situated|in a previously)|(lesions?|tumou?rs?) (situated|located)|previously irradiated|considered as (TLs?|target))/i;
export const NON_MEASURABLE = /\b(non-?measurable|no measurable|without measurable|not have measurable)\b/i;

/** Relapsed / refractory / recurrent disease. */
export const RECURRENT = /\b(relapsed|relapse|refractory|recurrent|recurrence|recurred|progressed|progressive disease|disease progression|r\/r|rr[a-z]{2,4})\b/i;
/** Recurrence words that are not about the cancer itself. */
export const RECURRENT_NOT_DISEASE = /\b(recurrent|refractory)\s+(infections?|pneumonia|pleural|ascites|effusions?|thrombo|seizures?|nausea|hypercalcemia|hypokalemia|vomiting|uti|urinary tract|bleeding|syncope|angina|pericardial|pancreatitis|bowel obstruction|cytopenia|anemia|hypotension|pain)|\b(refractory|resistant)\s+to\s+(platinum|endocrine|hormone|castration|radioactive iodine|RAI|anti-?PD|immunotherapy|checkpoint|chemotherapy|BCG|treatment with)|\brelapse[- ]free\b|\b(risk|risks)\s+(of|for)\s+(recurrence|relapse)|\bwith a recurrence score\b|\brecurrence score\b|\b(oncotype|mammaprint)\b|\bpost[- ]?(op|operative)\b[^.;]{0,30}\brecurrence\b|\bno (evidence of )?(disease )?(recurrence|relapse|progression)/i;
export const NEW_OR_RECURRENT_ALT = /\b(newly diagnosed|untreated|treatment[- ]na[iï]ve|previously untreated|first[- ]line|frontline|front[- ]line|de novo|primary)\b[^.;]{0,40}\b(or|and\/or)\b|\b(or|and\/or)\b[^.;]{0,25}\b(newly diagnosed|untreated|treatment[- ]na[iï]ve|previously untreated|de novo)\b/i;

/** Prior lines of therapy. Only generic counts ("lines of systemic therapy"), not class-specific ones ("lines of endocrine therapy"). */
export const LINES_UNIT = String.raw`(prior |previous |earlier )?(standard |systemic |anti-?cancer |anti-?neoplastic |treatment |therapeutic |systemic anti-?cancer |anti-?myeloma |anti-?lymphoma |(standard[- ]of[- ]care |SOC )?)?(lines?|regimens?|LOTs?|treatments? lines?)\b(\s+of\s+(prior |previous )?(systemic |anti-?cancer |anti-?neoplastic |standard[- ]of[- ]care |standard |myeloma[- ]directed |anti-?myeloma |anti-?lymphoma |anti-?leukemia |)?(therapy|therapies|treatments?|regimens?))?`;
/** Class words that make a line count class-specific (and so not a total-line rule). */
export const LINES_CLASS_SPECIFIC = /\b(lines?|regimens?)\s+of\s+(prior |previous )?(endocrine|hormon|anti-?HER2|HER2|platinum|cytotoxic|chemotherapy|immunotherapy|anti-?PD|checkpoint|taxane|targeted|ADT|androgen|ARPI|BRAF|EGFR|TKI|CDK|PARP|bispecific|CAR|BTK|anti-?CD|ICI|fluoropyrimidine|gemcitabine|BCG|intravesical)/i;
export const LINES_NO_LIMIT = /\bno (limit|maximum|restriction)\b|\bunlimited\b|\bany number of\b|\bregardless of (the )?number\b/i;

/** Other (prior or concurrent) malignancy. */
export const OTHER_CANCER = /\b(other|another|second|secondary|additional|prior|previous|history of|concurrent|concomitant|coexisting|co-existing|synchronous|separate|different|known)\b[^.;]{0,40}\b(?<!anti-)(?<!anti)(malignanc(y|ies)|cancers?|neoplasms?|primary tumou?rs?|invasive (cancer|carcinoma)|primary (cancer|malignancy))\b(?!\s*(-?directed |-?related )?(therap|treatment|agents?|drugs?|risk|genetic|predisposition|screening|syndrome|medications?|regimens?|immunotherapy))|\bsecond primary\b/i;
export const OTHER_CANCER_ACTIVE = /\b(active|currently (being )?treated|under(going)? (active )?treatment|requir(ed|es|ing) (active |systemic |ongoing )?(treatment|therapy)|progressing|progressive|that is progressing|evidence of (active )?disease|ongoing treatment|receiving (active )?treatment)\b/i;
export const OTHER_CANCER_JUDGMENT = /\b(potential to interfere|could (interfere|confound)|may interfere|would interfere|interfere with (the )?(safety|efficacy|assessment|interpretation|evaluation|study)|natural history)\b/i;
/** "within 3 years", "in the past five years", "disease-free for ≥ 2 years", "less than 3 years". */
export const YEARS_WINDOW = new RegExp(String.raw`(?:within|in|during|for|past|last|previous|preceding|less than|<|≤|<=|at least|≥|>=|more than|>|over|of)\s+(?:the\s+)?(?:past|last|previous|preceding)?\s*\(?${NUM}\)?\s*(?:\(\s*\d+\s*\)\s*)?(?:full\s+)?years?`, "i");

/** HIV. */
export const HIV = /\b(HIV|human immunodeficiency virus|AIDS)\b/i;
export const HIV_CONTROLLED_CARVEOUT = /\b(uncontrolled|not (well[- ])?controlled|poorly controlled|detectable viral load|unless|except|eligible|allowed|permitted|provided|if (they|the|on|their)|may (participate|enroll|be eligible)|undetectable|viral load|CD4|antiretroviral|anti-retroviral|\bART\b|HAART|well[- ]controlled|active (HIV )?infection|AIDS[- ]defining|opportunistic)\b/i;
/** Inclusion criteria for HIV-associated cancers (the trial is for people with HIV). */
export const HIV_REQUIRED = /\b(HIV[- ](associated|related|positive|infected|seropositive)|people (living )?with HIV|PLWH|persons with HIV|documented HIV|HIV infection (must|is required)|must (have|be) (HIV|documented HIV))/i;

export const HEP_B = /\b(hepatitis B|HBV|HBsAg|hepatitis B surface antigen|Hep B)\b/i;
export const HEP_C = /\b(hepatitis C|HCV|Hep C|hepatitis B (or|and|\/|and\/or) C)\b/i;
export const HEP_ACTIVE_CARVEOUT = /\b(active|chronic active|uncontrolled|replicating|detectable|viral load|DNA|RNA|unless|except|eligible|allowed|permitted|provided|if (they|the|on|their|HBV|HCV)|cured|resolved|treated|undetectable|antiviral|suppress|requir(ing|es) treatment|untreated|acute)\b/i;

export const ORGAN_TRANSPLANT = /\b(solid[- ]organ|organ|kidney|renal|liver|hepatic|heart|cardiac|lung|pancreas)\s+(allo)?(transplant|transplantation|allograft|graft)\b|\ballogeneic tissue\/solid organ|\btissue\/solid organ\b|\borgan (allo)?graft\b/i;
export const ALLO_SCT = /\b(allogeneic|allo-?)[- ]?(hematopoietic |haematopoietic |peripheral blood |bone marrow |stem[- ]cell |HSC |HCT |SCT |HSCT |BMT )*(stem[- ]cell|cell|HSCT|SCT|HCT|BMT|bone marrow|transplant(ation)?|graft)\b|\ballo-?(HSCT|SCT|HCT|BMT|transplant)\b/i;
/** Transplant described as a planned/future event or a donor procedure (not a history). */
export const TRANSPLANT_FUTURE = /\b(candidates?|eligible (for|to)|planned|plan(ned|ning|s)? to|scheduled|undergo(ing)?|will (receive|undergo|be)|referred|suitable|intend(ed|ing)?|proceed(ing)? to|donor|recipients? of (a )?first|consolidat\w*|bridge to|being considered|considered for|prepar\w*|conditioning|myeloablative|reduced[- ]intensity|graft[- ]versus|GVHD|GvHD|engraftment|post[- ]transplant (cyclophosphamide|maintenance))\b/i;
export const TRANSPLANT_PRIOR = /\b(prior|previous(ly)?|history of|received|underwent|undergone|had|after|following|post[- ]?(allogeneic|allo|transplant)|relapsed? (after|post|following)|status post|s\/p)\b/i;

export const AUTOIMMUNE = /\bauto-?immune (disease|disorder|condition|illness|diseases|disorders|conditions|hepatitis|colitis)|\bautoimmunity\b/i;
export const AUTOIMMUNE_ACTIVE = /\b(active|requir(ed|es|ing) (systemic )?(treatment|therapy|immunosuppress)|in the (past|last|previous) \w+ (years?|months?)|within (the )?(past|last)? ?\w+ (years?|months?)|uncontrolled|unless|except|exceptions?|allowed|permitted|eligible|ongoing|currently)\b/i;

export const HEART_DISEASE = /\b(congestive heart failure|heart failure|\bCHF\b|myocardial infarction|heart attack|unstable angina|cardiomyopathy|NYHA|New York Heart Association|(clinically )?significant (cardiac|cardiovascular|heart) (disease|condition|disorder|dysfunction)|cardiac (disease|disorder)s?|cardiovascular disease)\b/i;
export const KIDNEY_DISEASE = /\b(dialysis|hemodialysis|haemodialysis|end[- ]stage (renal|kidney)|ESRD|ESKD|renal failure|kidney failure|chronic kidney disease)\b/i;
export const LIVER_DISEASE = /\b(cirrhosis|cirrhotic|Child[- ]Pugh (class |score )?(B|C)|hepatic (failure|decompensation|encephalopathy)|decompensated liver|liver failure|chronic liver disease|portal hypertension)\b/i;
/** Organ-disease words used as lab/measurement thresholds, which patients cannot self-report. */
export const ORGAN_LAB = /\b(LVEF|ejection fraction|QTc|creatinine|clearance|eGFR|GFR|bilirubin|AST|ALT|transaminase|albumin|ULN|mL\/min)\b/i;

/** Group-specific disease status. */
export const CRPC = /\b(castrat(e|ion)[- ](resistant|refractory)|m?CRPC|nmCRPC|hormone[- ](refractory|resistant)|androgen[- ]independent)\b/i;
export const CSPC = /\b(castrat(e|ion)[- ](sensitive|naive|naïve)|m?CSPC|m?HSPC|hormone[- ](sensitive|naive|naïve)|androgen[- ]sensitive)\b/i;
export const PLATINUM_RESISTANT = /\bplatinum[- ]resistant\b|\bPROC\b/i;
export const PLATINUM_SENSITIVE = /\bplatinum[- ]sensitive\b|\bPSOC\b/i;
export const MIBC = /\b(?<!non-?\s?)(?<!non )muscle[- ]invasive\b|\bMIBC\b/i;
export const NMIBC = /\bnon[- ]?muscle[- ]invasive\b|\bNMIBC\b/i;
export const UNRESECTABLE = /\b(unresectable|non-?resectable|not (surgically )?resectable|inoperable|not amenable to (curative |surgical )?(resection|surgery)|not a candidate for (curative )?(resection|surgery))\b/i;
export const RESECTABLE = /\b(?<!un)(?<!non-)(?<!non)(?<!borderline )(?<!borderline-)resectable\b|\bamenable to (curative )?(surgical )?resection\b/i;
export const BORDERLINE = /\bborderline[- ]resectable\b/i;
export const RAI_REFRACTORY = /\b(radioactive iodine|radio-?iodine|RAI|I-?131)[- ](refractory|resistant)\b|\bRAI-?R\b|\brefractory to (radioactive iodine|radio-?iodine|RAI)\b/i;
export const LOCALLY_ADVANCED = /\blocally[- ]advanced\b|\blocoregionally advanced\b/i;
export const ADJUVANT_SETTING = /\b(completely resected|complete(ly)? (surgical )?resect(ed|ion)|R0 resection|(has|have|had) (undergone|had) (a )?(complete |curative[- ]intent |curative |definitive |radical )?(surgical )?(resection|surgery)|(following|after|post) (a )?(complete |curative[- ]intent |curative |definitive )?(surgical )?resection|no (radiographic |clinical )?evidence of (residual |measurable )?disease(?! (progression|recurrence|relapse))|NED(?=\b)|in the adjuvant setting|adjuvant (therapy|treatment) (setting|indicated|is planned))/i;
/** Resection or adjuvant wording about the future or a hypothetical (neoadjuvant/surgical candidates). */
export const ADJUVANT_FUTURE = /\b(achievable|feasible|possible|planned|plan(ning)? to|candidates? for|eligible for|allowing|amenable|scheduled|will (undergo|have)|potentially|expected|intend|resectable)\b/i;

/** Histology / subtype patterns; `groups` = only for trials in these cancer groups. */
export interface HistologyPattern {
  id: HistologyId;
  groups: readonly CancerGroupId[];
  re: RegExp;
  /** "Not this histology" wording that makes it excluded inside an inclusion criterion. */
  negated?: RegExp;
}
export const HISTOLOGY_PATTERNS: readonly HistologyPattern[] = [
  { id: "nsclc", groups: ["lung"], re: /\b(NSCLC|non[- ]?small[- ]cell lung|non[- ]small[- ]cell (carcinoma|cancer)|non-?small cell lung)/i },
  { id: "sclc", groups: ["lung"], re: /(?<!non[- ]?)(?<!non)\b(SCLC|small[- ]cell lung (cancer|carcinoma)|small[- ]cell carcinoma of the lung|small[- ]cell (cancer|carcinoma)|extensive[- ]stage (small|SCLC|disease)|ES-SCLC|LS-SCLC)\b/i },
  { id: "lung_squamous", groups: ["lung"], re: /(?<!non[- ]?)(?<!non)\bsquamous\b/i, negated: /\bnon[- ]?squamous\b/i },
  { id: "mesothelioma", groups: ["lung"], re: /\bmesothelioma\b/i },
  { id: "aml", groups: ["leukemia"], re: /\b(AML|acute myeloid leuk\w*|acute myelogenous leuk\w*|acute non-?lymphocytic)\b/i },
  { id: "all", groups: ["leukemia"], re: /\b(B-ALL|T-ALL|acute lymphoblastic leuk\w*|acute lymphocytic leuk\w*|(Ph\+?|B-cell|T-cell) ALL)\b|\bALL\b(?!\s+(PATIENTS|SUBJECTS|PARTICIPANTS|COHORTS|ARMS|PARTS|GROUPS|OF|OTHER))/ },
  { id: "cll", groups: ["leukemia", "lymphoma"], re: /\b(CLL|chronic lymphocytic leuk\w*|SLL|small lymphocytic lymphoma)\b/i },
  { id: "cml", groups: ["leukemia"], re: /\b(CML|chronic myeloid leuk\w*|chronic myelogenous leuk\w*)\b/i },
  { id: "mds", groups: ["leukemia"], re: /\b(MDS|myelodysplastic syndromes?|myelodysplasia)\b/i },
  { id: "dlbcl", groups: ["lymphoma"], re: /\b(DLBCL|diffuse large B[- ]cell)\b/i },
  { id: "follicular", groups: ["lymphoma"], re: /\b(follicular lymphoma|follicular NHL|\bFL\b(?=\s*(grade|\(|,|or|and|\)|patients)))/ },
  { id: "mantle_cell", groups: ["lymphoma"], re: /\b(mantle[- ]cell|MCL)\b/i },
  { id: "marginal_zone", groups: ["lymphoma"], re: /\b(marginal[- ]zone|MZL|MALT lymphoma)\b/i },
  { id: "hodgkin", groups: ["lymphoma"], re: /(?<!non[- ]?)(?<!non)\b(hodgkin('?s)? (lymphoma|disease)|classical hodgkin|cHL)\b/i },
  { id: "t_cell_lymphoma", groups: ["lymphoma"], re: /\b(T[- ]cell lymphoma|PTCL|CTCL|mycosis fungoides|S[ée]zary|anaplastic large[- ]cell|ALCL|T[- ]cell non-?hodgkin)\b/i },
  { id: "cns_lymphoma", groups: ["lymphoma"], re: /\b(primary (CNS|central nervous system) lymphoma|PCNSL|primary vitreoretinal lymphoma)\b/i },
  { id: "smoldering_myeloma", groups: ["myeloma"], re: /\b(smou?ldering (multiple )?myeloma|SMM)\b/i },
  { id: "amyloidosis", groups: ["myeloma"], re: /\b(AL amyloidosis|amyloidosis)\b/i },
  { id: "endometrial", groups: ["uterine-cervical"], re: /\b(endometrial (cancer|carcinoma|adenocarcinoma|serous)|carcinoma of the endometrium|uterine (cancer|carcinoma|serous|carcinosarcoma|corpus)|endometrial)\b(?!\s*(thickness|biopsy|sampling|stripe|hyperplasia))/i },
  { id: "cervical", groups: ["uterine-cervical"], re: /\b(cervical (cancer|carcinoma|squamous|adenocarcinoma)|carcinoma of the (uterine )?cervix|cancer of the (uterine )?cervix)\b/i },
  { id: "hcc", groups: ["liver"], re: /\b(HCC|hepatocellular)\b/i },
  { id: "biliary", groups: ["liver"], re: /\b(cholangiocarcinoma|biliary tract (cancer|carcinoma)|BTC|gallbladder (cancer|carcinoma)|bile duct (cancer|carcinoma)|ampullary (cancer|carcinoma))\b/i },
  { id: "esophageal_squamous", groups: ["gastroesophageal"], re: /\b(ESCC|(o)?esophageal squamous|squamous cell carcinoma of the (o)?esophagus|squamous (cell )?(carcinoma|histology)[^.;]{0,20}(o)?esophag)\w*/i },
  { id: "gastroesophageal_adeno", groups: ["gastroesophageal"], re: /\b(gastric|gastro-?(o)?esophageal junction|GEJ|GEJC|(o)?esophageal|stomach)\b[^.;]{0,25}\badenocarcinoma|\badenocarcinoma of the (stomach|(o)?esophagus|gastro)/i },
  { id: "pdac", groups: ["pancreatic"], re: /\b(PDAC|pancreatic (ductal )?adenocarcinoma|adenocarcinoma of the pancreas|ductal adenocarcinoma)\b/i },
  { id: "pnet", groups: ["pancreatic"], re: /\b(pNETs?|PNETs?|pancreatic neuroendocrine|neuroendocrine (tumou?rs?|neoplasms?|carcinomas?) of the pancreas|islet cell|(pancreatic )?neuroendocrine (tumou?r|neoplasm|carcinoma|histology|features))\b/i },
  { id: "glioblastoma", groups: ["brain"], re: /\b(glioblastoma|GBM|grade (4|IV) (astrocytoma|glioma))\b/i },
  { id: "lower_grade_glioma", groups: ["brain"], re: /\b(low(er)?[- ]grade gliomas?|LGG|grade (2|3|II|III) (gliomas?|astrocytomas?|oligodendrogliomas?)|oligodendrogliomas?)\b/i },
  { id: "meningioma", groups: ["brain"], re: /\bmeningiomas?\b/i },
  { id: "uveal_melanoma", groups: ["melanoma"], re: /\b(uveal|ocular|choroidal) melanoma\b|\buveal\b/i },
  { id: "mucosal_melanoma", groups: ["melanoma"], re: /\bmucosal\b/i },
  { id: "cutaneous_scc", groups: ["melanoma"], re: /\b(cutaneous squamous[- ]cell|cSCC|CSCC|squamous[- ]cell (carcinoma|cancer) of the skin)\b/i },
  { id: "merkel_cell", groups: ["melanoma"], re: /\bmerkel\b/i },
  { id: "clear_cell_rcc", groups: ["kidney"], re: /(?<!non[- ]?)(?<!non)\b(clear[- ]cell|ccRCC)\b/i, negated: /\bnon[- ]?clear[- ]cell\b|\bnccRCC\b/i },
  { id: "gist", groups: ["sarcoma"], re: /\b(GIST|gastrointestinal stromal)\b/i },
  { id: "osteosarcoma", groups: ["sarcoma"], re: /\bosteosarcoma\b/i },
  { id: "ewing", groups: ["sarcoma"], re: /\bewing/i },
  { id: "differentiated_thyroid", groups: ["thyroid"], re: /\b(differentiated thyroid|DTC|papillary thyroid|follicular thyroid|PTC)\b/i },
  { id: "medullary_thyroid", groups: ["thyroid"], re: /\b(medullary thyroid|MTC)\b/i },
  { id: "anaplastic_thyroid", groups: ["thyroid"], re: /\b(anaplastic thyroid|ATC)\b/i },
  { id: "hnscc", groups: ["head-neck"], re: /\b(HNSCC|SCCHN|squamous[- ]cell (carcinoma|cancer) of the (head|oral|oropharynx|larynx|hypopharynx)|head and neck squamous|(oral|oral cavity|oropharyngeal|laryngeal|hypopharyngeal) (squamous|SCC|cancer|carcinoma))\b/i },
  { id: "nasopharyngeal", groups: ["head-neck"], re: /\b(nasopharyn(geal|x)|NPC)\b/i },
  { id: "salivary", groups: ["head-neck"], re: /\bsalivary\b/i },
  { id: "rectal", groups: ["colorectal"], re: /\b(rect(al|um)) (cancer|adenocarcinoma|carcinoma|tumou?r)|\brectal\b(?!\s*(exam|bleeding|temperature))/i },
  { id: "anal", groups: ["colorectal"], re: /\b(anal (cancer|canal|carcinoma|squamous|SCC)|squamous[- ]cell carcinoma of the anus|anus)\b/i },
  { id: "hgsoc", groups: ["ovarian"], re: /\b(high[- ]grade serous|HGSOC|HGSC)\b/i },
  { id: "ovarian_clear_cell", groups: ["ovarian"], re: /\b(clear[- ]cell (ovarian|carcinoma|histology)|ovarian clear[- ]cell|OCCC)\b/i },
  { id: "low_grade_serous_ovarian", groups: ["ovarian"], re: /\b(low[- ]grade serous|LGSOC|LGSC)\b/i },
  { id: "prostate_neuroendocrine", groups: ["prostate"], re: /\b(neuroendocrine (prostate|carcinoma|features|differentiation|histology|component|tumou?r)|small[- ]cell (prostate|carcinoma|histology|component|features)|t?-?NEPC|treatment[- ]emergent neuroendocrine)\b/i },
  { id: "upper_tract_urothelial", groups: ["bladder"], re: /\b(upper[- ](tract|urinary tract)|UTUC|UTUC|renal pelvis|ureter(al)?)\b/i },
];

/** Prior drug classes (`prior_drug:<id>`). Brand/generic names commonly used in criteria. */
export const DRUG_CLASS_PATTERNS: Readonly<Record<DrugClassId, RegExp>> = {
  checkpoint: /\b(anti-?PD-?1|anti-?PD-?L-?1|anti-?CTLA-?4|PD-?1\/PD-?L1|PD-?(L)?1 (\/ ?PD-?L1 )?(inhibitors?|blockade|antibod\w+|targeted|directed|axis)|CTLA-?4 (inhibitors?|blockade|antibod\w+)|immune checkpoint (inhibitors?|blockade|therapy)|checkpoint inhibitors?|\bICIs?\b|pembrolizumab|nivolumab|atezolizumab|durvalumab|ipilimumab|cemiplimab|dostarlimab|avelumab|tislelizumab|toripalimab|tremelimumab|retifanlimab|sintilimab|camrelizumab|relatlimab|programmed (cell )?death)\b/i,
  platinum: /\b(platinum|cisplatin|carboplatin|oxaliplatin)\b/i,
  taxane: /\b(taxanes?|paclitaxel|docetaxel|cabazitaxel|nab-?paclitaxel)\b/i,
  endocrine: /\b(endocrine (therapy|therapies|treatment|agents?)|aromatase inhibitors?|\bAIs?\b(?= \(|,| or| and)|tamoxifen|fulvestrant|letrozole|anastrozole|exemestane|SERDs?|elacestrant|camizestrant|imlunestrant)\b/i,
  cdk46: /\b(CDK ?4\/6|CDK4\/6i|CDK 4\/6|palbociclib|ribociclib|abemaciclib)\b/i,
  anti_her2: /\b(anti-?HER-?2|HER-?2[- ](directed|targeted) (therapy|therapies|treatment|agents?)|trastuzumab(?! (deruxtecan|emtansine))|pertuzumab|lapatinib|tucatinib|neratinib|margetuximab|zanidatamab)\b/i,
  adc: /\b(antibody[- ]drug conjugates?|ADCs?|trastuzumab deruxtecan|T-?DXd|DS-?8201|sacituzumab|enfortumab|trastuzumab emtansine|T-?DM1|ado-?trastuzumab|datopotamab|Dato-?DXd|mirvetuximab|tisotumab|loncastuximab|brentuximab|polatuzumab|belantamab|telisotuzumab|patritumab)\b/i,
  egfr_tki: /\b(EGFR[- ](TKIs?|tyrosine kinase inhibitors?|inhibitors?|directed|targeted)|osimertinib|erlotinib|gefitinib|afatinib|dacomitinib|lazertinib|amivantamab)\b/i,
  alk_tki: /\b(ALK[- ](TKIs?|tyrosine kinase inhibitors?|inhibitors?|targeted|directed)|alectinib|crizotinib|lorlatinib|brigatinib|ceritinib|ensartinib)\b/i,
  parp: /\b(PARP ?(inhibitors?|i)|PARPi|olaparib|niraparib|rucaparib|talazoparib|veliparib|saruparib)\b/i,
  arpi: /\b(androgen receptor (pathway |signaling |signalling |axis[- ]targeted |targeted )?(inhibitors?|antagonists?|agents?|targeted (therapy|agents?))|ARPIs?|ARSIs?|ARTAs?|novel hormonal (agents?|therap\w+)|NHAs?|second[- ]generation (anti-?androgens?|AR)|abiraterone|enzalutamide|apalutamide|darolutamide)\b/i,
  lu_psma: /\b(177 ?Lu-?PSMA|Lu-?PSMA|lutetium[^.;]{0,30}PSMA|\[177Lu\][^.;]{0,15}PSMA|Pluvicto|PSMA[- ](targeted )?radioligand|PSMA-?(targeted )?RLT)\b/i,
  braf_mek: /\b(BRAF (and\/or |or |\/)?(MEK )?inhibitors?|MEK inhibitors?|BRAF\/MEK|dabrafenib|trametinib|vemurafenib|encorafenib|binimetinib|cobimetinib)\b/i,
  anti_vegf: /\b(bevacizumab|ramucirumab|aflibercept|anti-?VEGF(-?A)? (antibod\w+|therapy|agents?|monoclonal)|anti-?angiogenic (antibod\w+|therapy|agents?))\b/i,
  vegf_tki: /\b(VEGFR?[- ](TKIs?|tyrosine kinase inhibitors?|targeted (TKI|tyrosine))|sunitinib|pazopanib|cabozantinib|axitinib|lenvatinib|sorafenib|regorafenib|tivozanib|fruquintinib)\b/i,
  fluoropyrimidine: /\b(fluoropyrimidines?|5-?FU|5-?fluorouracil|fluorouracil|capecitabine|FOLFOX|FOLFIRI|FOLFIRINOX|FOLFOXIRI|CAPOX|XELOX|S-1|trifluridine)\b/i,
  hma: /\b(hypomethylating agents?|HMAs?|azacitidine|azacytidine|decitabine|guadecitabine)\b/i,
  venetoclax: /\b(venetoclax|BCL-?2 inhibitors?)\b/i,
  car_t: /\b(CAR[- ]?T|CAR T[- ]cells?|chimeric antigen receptor|axicabtagene|tisagenlecleucel|lisocabtagene|idecabtagene|ciltacabtagene|brexucabtagene|obecabtagene|axi-?cel|tisa-?cel|liso-?cel|ide-?cel|cilta-?cel)\b/i,
  anti_cd20: /\b(anti-?CD20|CD20[- ](directed|targeted) (monoclonal |antibod)|rituximab|obinutuzumab|ofatumumab)\b/i,
  btk: /\b(BTK ?(inhibitors?|i)|BTKi|Bruton'?s? tyrosine kinase|ibrutinib|acalabrutinib|zanubrutinib|pirtobrutinib)\b/i,
  bispecific: /\b(bispecific (antibod\w+|T[- ]cell engagers?|agents?|therap\w+)|T[- ]cell engag(er|ing)s?|BiTEs?|TCEs?|blinatumomab|glofitamab|epcoritamab|mosunetuzumab|odronextamab|teclistamab|elranatamab|talquetamab|linvoseltamab|tarlatamab)\b/i,
  anti_cd38: /\b(anti-?CD38|CD38[- ](directed|targeted|monoclonal)|daratumumab|isatuximab)\b/i,
  imid: /\b(IMiDs?|immunomodulatory (drugs?|agents?|imide)|lenalidomide|pomalidomide|thalidomide|iberdomide|mezigdomide)\b/i,
  proteasome_inhibitor: /\b(proteasome inhibitors?|bortezomib|carfilzomib|ixazomib)\b/i,
  bcma: /\b(BCMA[- ]?(directed|targeted|targeting|CAR|bispecific|TCE|therapy|therapies|agents?)|anti-?BCMA|belantamab|idecabtagene|ciltacabtagene|teclistamab|elranatamab|linvoseltamab)\b/i,
  temozolomide: /\b(temozolomide|TMZ)\b/i,
  bcg: /\b(BCG|Bacill(us|e) Calmette)\b/,
  auto_sct: /\b(autologous (hematopoietic |haematopoietic |peripheral blood )?(stem[- ]cell|HSCT|SCT|HCT|transplant\w*|bone marrow)|auto-?(HSCT|SCT|HCT|transplant)|ASCT)\b/i,
};

/** "with or without X" names an option, never a requirement or exclusion. */
export const WITH_OR_WITHOUT = /\bwith or without\b|\bwith\/without\b|\+\/-|±/i;
