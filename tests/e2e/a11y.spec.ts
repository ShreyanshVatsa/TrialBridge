import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { completeIntake, RESULTS_HEADING, sampleTrialId } from "./helpers";

const id = sampleTrialId();

async function expectNoSeriousViolations(page: Page, label: string) {
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).exclude("iframe").analyze();
  const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  expect(serious.map((v) => `${label}: ${v.id} (${v.impact}) ${v.nodes.slice(0, 2).map((n) => n.target.join(" ")).join(" | ")}`)).toEqual([]);
}

const pages: [string, string, RegExp | string][] = [
  ["landing", "/", /Find cancer clinical trials/],
  ["find", "/find/", /cancer/i],
  ["trial", `/trial/?id=${id}`, id],
  ["access", "/access/", "Trials analyzed"],
  ["privacy", "/privacy/", /privacy/i],
  ["methodology", "/methodology/", /how/i],
  ["about", "/about/", /TrialBridge/],
  ["for-sites", "/for-sites/", /sites/i],
  ["404", "/no-such-page/", /not found/i],
];

for (const [label, url, ready] of pages) {
  for (const theme of ["light", "dark"] as const) {
    test(`axe: ${label} (${theme}) has no serious/critical violations`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
      await page.addInitScript((t) => localStorage.setItem("tb-theme", t), theme);
      await page.goto(url);
      await expect(page.getByText(ready).first()).toBeVisible();
      await expectNoSeriousViolations(page, `${label}/${theme}`);
    });
  }
}

test("axe: results view and Spanish UI", async ({ page }) => {
  await completeIntake(page, { cancer: "Breast cancer" });
  await expect(page.getByText(RESULTS_HEADING)).toBeVisible({ timeout: 90_000 });
  await expectNoSeriousViolations(page, "results");
  await page.goto("/");
  await page.getByLabel("Language").first().selectOption("es");
  await expect(page.locator("h1")).toHaveText(/Encuentre/);
  await expectNoSeriousViolations(page, "landing-es");
});
