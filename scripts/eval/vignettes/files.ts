/** File locations and readers for the vignette benchmark. */
import { readFileSync } from "node:fs";
import { VignetteFileSchema, splitOf, type Vignette } from "./schema";

export const VIGNETTES_FILE = "eval/gold/vignettes-v1.json";
export const JUDGMENTS_DIR = "eval/gold/judgments";
export const PACKETS_DIR = "data/cache/judge-packets";

export function readVignettes(file: string = VIGNETTES_FILE, split?: "dev" | "test"): Vignette[] {
  const all = VignetteFileSchema.parse(JSON.parse(readFileSync(file, "utf8"))).vignettes;
  return split ? all.filter((v) => splitOf(v.id) === split) : all;
}
