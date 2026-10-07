import { z } from "zod";
import type { CancerGroupId } from "@/config/cancer-groups";
import type { BiomarkerId } from "@/config/biomarkers";
import type { FactKey } from "./trial";

/**
 * Adaptive questionnaire contracts (QUESTIONNAIRE_SPEC §1.2 C1, §2.5, C3).
 *
 * The catalog itself is data owned by config/questionnaire (WP1). These structural types are what the
 * engine (lib/questionnaire) reads. `MessageKey` is a plain string here; config/questionnaire may use the
 * narrower typed key from components/i18n, which is assignable to these types.
 */

export type QuestionId = string;
export type MessageKey = string;
export type Tier = "essential" | "helpful" | "deep";
export type AnswerType = "group_picker" | "age" | "zip" | "travel" | "single" | "multi" | "biomarker_grid";

/** Reserved option ids. Every non-essential question MUST include UNKNOWN; sensitive ones also PREFER_NOT. */
export const UNKNOWN = "unknown";
export const PREFER_NOT = "prefer_not";
export const SKIP = "__skip";
/** "My doctor can fill this in later" (cost-3 questions). Stored as a null answer plus an entry in `deferred`. */
export const DEFER = "__defer";
/** Biomarker grid cell values. "not_tested" and "unknown" are non-responses (no matching effect). */
export const BIOMARKER_ANSWERS = ["positive", "negative", "not_tested", UNKNOWN] as const;
export type BiomarkerAnswer = (typeof BIOMARKER_ANSWERS)[number];
/** Option ids that never carry facts, query terms or hard filters (identical matching semantics). */
export const NON_RESPONSE_IDS: readonly string[] = [UNKNOWN, PREFER_NOT, SKIP, DEFER, "not_tested"];

export interface OptionDef {
  id: string;
  labelKey: MessageKey;
  helpKey?: MessageKey;
  exclusiveWith?: string[];
}

/**
 * Prerequisite on an earlier question. All prerequisites of a question must hold.
 * - anyOf: the earlier answer (or any element of a multi answer) is one of these ids. Non-responses
 *   (unknown, skip, prefer_not, deferred) match the id "unknown". "*" matches any answer at all.
 * - noneOf: holds when the earlier question is unanswered or its answer contains none of these ids
 *   (e.g. pregnancy: sex noneOf ["male"] still holds when sex was never asked).
 * - lt / gte: numeric answers (age); unanswered fails.
 */
export interface Prereq {
  question: QuestionId;
  anyOf?: string[];
  noneOf?: string[];
  lt?: number;
  gte?: number;
}

export type FactRelation = "conflict" | "support" | "neutral";

/**
 * How one option relates to one trial fact (fact.key === rule.fact).
 * Relation = whenRequired / whenExcluded by the fact's value (default neutral; "mentioned" is always neutral).
 * paramCompare (numeric fact.param only): if `value op param` holds the when* relation applies, otherwise `else`.
 *   ECOG band 2: { fact: "ecog_max", whenRequired: "support", paramCompare: { op: "lte", value: 2, else: "conflict" } }
 *   1 prior line: { fact: "min_prior_lines", paramCompare: { op: "gte", value: 1, else: "conflict" } }
 * paramIs (string or number fact.param): when fact.param equals `value`, `then` overrides everything above.
 *   Treated brain mets: { fact: "brain_mets", whenExcluded: "conflict", paramIs: { value: "active_only", then: "neutral" } }
 */
export interface FactRule {
  fact: FactKey;
  whenRequired?: FactRelation;
  whenExcluded?: FactRelation;
  paramCompare?: { op: "lte" | "gte"; value: number; else: FactRelation };
  paramIs?: { value: string | number; then: FactRelation };
}

/** Hard-filter patch from a definite answer. Only a definite sex is a new hard filter (spec §3.1). */
export interface HardFilterPatch {
  sex?: "FEMALE" | "MALE";
}

export interface OptionEffect {
  option: string;
  facts: FactRule[];
  /** Multi-select only: rules applied when the answer is definite and this option was NOT chosen
   *  (e.g. "chemotherapy" not chosen + trial requires prior chemotherapy => conflict). */
  ifNotSelected?: FactRule[];
  /** English phrases for BM25 + embedding profile text. */
  queryTerms?: string[];
  hardFilter?: HardFilterPatch;
}

/** Coarse fields that may go to AI (spec §4.2). */
export type AiFieldId =
  | "spread"
  | "treatments"
  | "biomarkers"
  | "pregnant"
  | "concurrentTrial"
  | "subtype"
  | "stageCategory"
  | "diseaseStatus"
  | "priorLines"
  | "activityBand"
  | "brainMets"
  | "groupStatus"
  | "priorDrugClasses";

export interface QuestionDef {
  id: QuestionId;
  area: "cancer";
  tier: Tier;
  type: AnswerType;
  labelKey: MessageKey;
  helpKey: MessageKey;
  whyKey: MessageKey;
  findOutKey?: MessageKey;
  options?: OptionDef[];
  biomarkers?: BiomarkerId[];
  appliesTo: readonly CancerGroupId[] | "all";
  excludeGroups?: readonly CancerGroupId[];
  prerequisites?: Prereq[];
  cost: 1 | 2 | 3;
  sensitive?: boolean;
  effects: OptionEffect[];
  aiField?: AiFieldId;
  /** P(option) per group, including "unknown". Biomarker grids use "<ID>:positive" / "<ID>:negative" / "unknown". */
  priors?: Partial<Record<CancerGroupId, Record<string, number>>>;
  /** Questions of one family are down-weighted together after repeated "don't know" answers (default: type). */
  family?: string;
  enabled: boolean;
  evidence: string;
}

/** "Find out at your next appointment" item definition (config/questionnaire/find-out.ts). */
export interface FindOutDef {
  whatKey: MessageKey;
  whereKey: MessageKey;
  whyKey: MessageKey;
}

export interface FindOutEntry extends FindOutDef {
  question: QuestionId;
  deferred: boolean;
}

/** Per fact-key policy (config/questionnaire/fact-policy.ts): penalize=false => conflicts ignored. */
export interface FactPolicyEntry {
  penalize: boolean;
  weight: number;
  supportOnly?: boolean;
}
export type FactPolicy = Readonly<Record<string, FactPolicyEntry>>;

/** string | string[] | number | Record<string,string> | null (null = deferred / no answer). */
export const AnswerValueSchema = z.union([
  z.string().max(64),
  z.array(z.string().max(64)).max(32),
  z.number().finite(),
  z.record(z.string().max(32), z.string().max(32)),
  z.null(),
]);
export type AnswerValue = z.infer<typeof AnswerValueSchema>;

const QuestionIdSchema = z.string().regex(/^[a-z][a-z0-9_]{0,47}$/);

export const QuestionnaireStateSchema = z.strictObject({
  v: z.literal(2),
  area: z.literal("cancer"),
  mode: z.enum(["quick", "thorough"]),
  answers: z.record(QuestionIdSchema, AnswerValueSchema),
  history: z.array(QuestionIdSchema).max(64),
  deferred: z.array(QuestionIdSchema).max(64),
  updatedAt: z.number().int().nonnegative(),
});
export type QuestionnaireState = z.infer<typeof QuestionnaireStateSchema>;
