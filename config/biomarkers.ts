import type { CancerGroupId } from "./cancer-groups";

/** Biomarkers recognized by the rule layer and offered in intake. */
export const BIOMARKER_IDS = ["HER2", "HR", "BRCA", "EGFR", "ALK", "ROS1", "KRAS", "BRAF", "PD-L1", "MSI-H", "NTRK", "FLT3", "IDH"] as const;
export type BiomarkerId = (typeof BIOMARKER_IDS)[number];

export interface Biomarker {
  id: BiomarkerId;
  label: string;
  /** Regex matched against criterion text to detect a mention (word-boundary aware). */
  pattern: RegExp;
}

export const BIOMARKERS: readonly Biomarker[] = [
  { id: "HER2", label: "HER2", pattern: /\b(HER-?2|ERBB2)\b/i },
  { id: "HR", label: "Hormone receptor (ER/PR)", pattern: /\b(hormone receptor|HR[+-]|estrogen receptor|progesterone receptor|ER[+-]|ER\/PR)/i },
  { id: "BRCA", label: "BRCA1/2", pattern: /\bBRCA ?[12]?\b/i },
  { id: "EGFR", label: "EGFR", pattern: /\bEGFR\b/i },
  { id: "ALK", label: "ALK", pattern: /\bALK\b/ },
  { id: "ROS1", label: "ROS1", pattern: /\bROS-?1\b/i },
  { id: "KRAS", label: "KRAS", pattern: /\bKRAS\b/i },
  { id: "BRAF", label: "BRAF", pattern: /\bBRAF\b/i },
  { id: "PD-L1", label: "PD-L1", pattern: /\bPD-?L1\b/i },
  { id: "MSI-H", label: "MSI-high / dMMR", pattern: /\b(MSI-?H(igh)?|microsatellite instability|dMMR|mismatch repair)\b/i },
  { id: "NTRK", label: "NTRK fusion", pattern: /\bNTRK\b/i },
  { id: "FLT3", label: "FLT3", pattern: /\bFLT-?3\b/i },
  { id: "IDH", label: "IDH1/2", pattern: /\bIDH-?[12]?\b/i },
];

/** Which biomarkers intake asks about for each cancer group (empty = question is skipped). */
export const BIOMARKERS_BY_GROUP: Record<CancerGroupId, BiomarkerId[]> = {
  breast: ["HER2", "HR", "BRCA", "PD-L1"],
  lung: ["EGFR", "ALK", "ROS1", "KRAS", "BRAF", "PD-L1"],
  colorectal: ["KRAS", "BRAF", "MSI-H", "HER2"],
  prostate: ["BRCA", "MSI-H"],
  leukemia: ["FLT3", "IDH"],
  lymphoma: [],
  myeloma: [],
  melanoma: ["BRAF", "PD-L1"],
  pancreatic: ["BRCA", "KRAS", "MSI-H"],
  ovarian: ["BRCA", "MSI-H"],
  brain: ["IDH"],
  bladder: ["PD-L1", "MSI-H"],
  kidney: [],
  liver: ["IDH"],
  "head-neck": ["PD-L1"],
  gastroesophageal: ["HER2", "PD-L1", "MSI-H"],
  "uterine-cervical": ["MSI-H", "PD-L1", "HER2"],
  sarcoma: ["NTRK"],
  thyroid: ["BRAF", "NTRK"],
  "solid-tumors": ["HER2", "BRCA", "KRAS", "BRAF", "MSI-H", "NTRK", "PD-L1"],
  other: [],
};
