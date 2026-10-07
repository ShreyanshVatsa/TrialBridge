import { readFileSync } from "node:fs";
import type { Page } from "@playwright/test";

export interface IntakeOptions {
  cancer: string;
  zip?: string;
  travel?: string;
  age?: string;
  language?: string;
  spread?: "Yes" | "No" | "Not sure";
  treatments?: string[];
  biomarkerPositiveFirst?: boolean;
}

/** Walk the guided chat intake with quick replies and inputs (English UI labels). */
export async function completeIntake(page: Page, o: IntakeOptions): Promise<void> {
  const click = async (name: string) => {
    await page.getByRole("button", { name, exact: true }).last().click();
  };
  await page.goto("/find/");
  await click(o.cancer);
  const zip = page.locator("main input:visible").first();
  await zip.fill(o.zip ?? "02115");
  await zip.press("Enter");
  await click(o.travel ?? "Up to 250 miles");
  const age = page.locator("main input:visible").first();
  await age.fill(o.age ?? "52");
  await age.press("Enter");
  await click(o.language ?? "English");
  await click(o.spread ?? "Not sure");
  for (const t of o.treatments ?? ["Not sure"]) await click(t);
  await click("Continue"); // treatments is multi-select
  // Biomarkers step appears only for some cancer types.
  const positive = page.getByRole("button", { name: "Positive", exact: true });
  if (await positive.first().isVisible().catch(() => false)) {
    if (o.biomarkerPositiveFirst) await positive.first().click();
    await click("Continue");
  }
  await click("No"); // pregnant
  await click("No"); // another trial
  await page.getByRole("button", { name: "Search trials" }).click();
}

/** A real trial ID from the currently built dataset (first breast-shard card). */
export function sampleTrialId(): string {
  const manifest = JSON.parse(readFileSync("public/data/manifest.json", "utf8")) as { shardBase: string; groups: Record<string, string[]> };
  const shard = manifest.groups.breast?.[0] ?? "";
  const cards = JSON.parse(readFileSync(`public${manifest.shardBase}/${shard}/cards.json`, "utf8")) as { id: string }[];
  const id = cards[0]?.id;
  if (!id) throw new Error("no trial in dataset");
  return id;
}

export const RESULTS_HEADING = /Possible matches to discuss with your care team/i;
