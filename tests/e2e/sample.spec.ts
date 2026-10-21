import { expect, test } from "@playwright/test";
import { freshFind, RESULTS_HEADING, SUMMARY_HEADING } from "./helpers";

/** The sample patient is a labelled, made-up example: one click to the summary, one more to results. */
test.describe("sample patient", () => {
  test("button loads the sample, labels it, and searches", async ({ page }) => {
    await freshFind(page);
    await page.getByRole("button", { name: "Try a sample patient" }).click();
    await expect(page.getByRole("heading", { name: SUMMARY_HEADING })).toBeVisible();
    await expect(page.getByText(/made-up sample patient/)).toBeVisible();
    await expect(page.locator("section[aria-labelledby=summary-title]").getByText("Breast cancer")).toBeVisible();
    await page.getByRole("button", { name: "Search trials" }).click();
    await expect(page.getByText(RESULTS_HEADING)).toBeVisible({ timeout: 90_000 });
    await expect(page.getByText(/Sample patient: these results are for a made-up example/)).toBeVisible();
    // A new search drops the label and the answers.
    await page.getByRole("button", { name: "New search" }).click();
    await expect(page.getByRole("button", { name: "Try a sample patient" })).toBeVisible();
    await expect(page.getByText(/made-up sample patient/)).toHaveCount(0);
  });

  test("?demo=1 goes straight to labelled results", async ({ page }) => {
    await page.goto("/find/?demo=1");
    await expect(page.getByText(RESULTS_HEADING)).toBeVisible({ timeout: 90_000 });
    await expect(page.getByText(/Sample patient: these results are for a made-up example/)).toBeVisible();
    await expect(page).toHaveURL(/\/find\/$/);
  });
});
