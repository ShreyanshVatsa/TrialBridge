import { readFileSync } from "node:fs";
import { expect, type Page } from "@playwright/test";

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
  const answered = page.getByRole("button", { name: /^Edit answer:/ });
  // Answer the current step and wait until the chat records it (one more "Edit answer" button).
  const advance = async (act: () => Promise<void>) => {
    const n = await answered.count();
    await act();
    await expect(answered).toHaveCount(n + 1);
  };
  const reply = (name: string) => advance(() => page.getByRole("button", { name, exact: true }).last().click());
  const type = (value: string) =>
    advance(async () => {
      const input = page.locator("main input:visible").first();
      await input.fill(value);
      await input.press("Enter");
    });

  await page.goto("/find/");
  await reply(o.cancer);
  await type(o.zip ?? "02115");
  await reply(o.travel ?? "Up to 250 miles");
  await type(o.age ?? "52");
  await reply(o.language ?? "English");
  await reply(o.spread ?? "Not sure");
  for (const t of o.treatments ?? ["Not sure"]) await page.getByRole("button", { name: t, exact: true }).last().click();
  await reply("Continue"); // treatments is multi-select
  // Biomarkers step appears only for some cancer types; otherwise the pregnancy question is next.
  const positive = page.getByRole("button", { name: "Positive", exact: true });
  await positive.first().or(page.getByRole("button", { name: "Prefer not to say", exact: true })).first().waitFor();
  if (await positive.first().isVisible()) {
    if (o.biomarkerPositiveFirst) await positive.first().click();
    await reply("Continue");
  }
  await reply("No"); // pregnant
  await reply("No"); // another trial
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
