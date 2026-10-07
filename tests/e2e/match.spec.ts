import { expect, test, type Request } from "@playwright/test";
import { completeIntake, RESULTS_HEADING } from "./helpers";

test.describe("guided intake to AI results (mock)", () => {
  test("breast cancer, HER2-positive @mobile", async ({ page }) => {
    await completeIntake(page, { cancer: "Breast cancer", spread: "Yes", treatments: ["Chemotherapy"], biomarkerPositiveFirst: true });
    await expect(page.getByText(RESULTS_HEADING)).toBeVisible({ timeout: 90_000 });
    await expect(page.getByText(/possible match/i).first()).toBeVisible();
    await expect(page.getByText(/doesn't give medical advice/i).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Full trial details/i }).first()).toBeVisible();
  });

  test("lung cancer", async ({ page }) => {
    await completeIntake(page, { cancer: "Lung cancer", zip: "10032", travel: "Up to 500 miles", age: "64" });
    await expect(page.getByText(RESULTS_HEADING)).toBeVisible({ timeout: 90_000 });
    await expect(page.getByRole("link", { name: /Full trial details/i }).first()).toBeVisible();
  });

  test("other / not sure uses the cross-group index", async ({ page }) => {
    await completeIntake(page, { cancer: "Other / not sure", zip: "77030", travel: "Anywhere in the U.S.", age: "60" });
    await expect(page.getByText(RESULTS_HEADING)).toBeVisible({ timeout: 90_000 });
    await expect(page.getByRole("link", { name: /Full trial details/i }).first()).toBeVisible();
  });

  test("AI unavailable falls back to retrieval + rule results", async ({ page }) => {
    await page.route("**/api/analyze", (route) => route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ error: { code: "internal", message: "x", requestId: "r" } }) }));
    await completeIntake(page, { cancer: "Breast cancer" });
    await expect(page.getByText(/AI explanations are busy right now/i)).toBeVisible({ timeout: 90_000 });
    await expect(page.getByRole("link", { name: /Full trial details/i }).first()).toBeVisible();
  });

  test("distance filter dropped because the ZIP table failed shows a notice", async ({ page }) => {
    await page.route("**/data/zip/**", (route) => route.abort("internetdisconnected"));
    await completeIntake(page, { cancer: "Breast cancer", travel: "Up to 25 miles" });
    await expect(page.getByText(RESULTS_HEADING)).toBeVisible({ timeout: 120_000 });
    await expect(page.getByText(/travel distance was not applied/i)).toBeVisible();
  });

  test("data minimization: ZIP, exact age, and intake answers never reach the backend", async ({ page }) => {
    const sent: Request[] = [];
    page.on("request", (r) => {
      if (new URL(r.url()).pathname.startsWith("/api/")) sent.push(r);
    });
    await completeIntake(page, { cancer: "Breast cancer", zip: "02115", age: "57", spread: "Yes", treatments: ["Chemotherapy"] });
    await expect(page.getByText(RESULTS_HEADING)).toBeVisible({ timeout: 90_000 });
    await expect.poll(() => sent.length, { timeout: 30_000 }).toBeGreaterThan(0);
    for (const r of sent) {
      const everything = `${r.url()} ${r.postData() ?? ""} ${JSON.stringify(r.headers())}`;
      expect(everything).not.toContain("02115");
      expect(everything).not.toMatch(/\b57\b/);
      const body = JSON.parse(r.postData() ?? "{}") as { profile?: Record<string, unknown> };
      if (body.profile) {
        expect(Object.keys(body.profile).sort()).toEqual(["ageBracket", "biomarkers", "cancerType", "concurrentTrial", "language", "pregnant", "spread", "treatments"]);
        expect(body.profile.ageBracket).toBe("50-59");
      }
      expect(Object.keys(body)).not.toContain("zip");
      expect(Object.keys(body)).not.toContain("age");
    }
  });
});
