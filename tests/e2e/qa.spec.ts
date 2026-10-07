import { expect, test } from "@playwright/test";
import { sampleTrialId } from "./helpers";

const id = sampleTrialId();

test.describe("Trial page and Q&A safety (mock)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/trial/?id=${id}`);
    await expect(page.getByText(id).first()).toBeVisible({ timeout: 60_000 });
  });

  const ask = async (page: import("@playwright/test").Page, q: string) => {
    await page.getByLabel("Your question").fill(q);
    await page.getByRole("button", { name: "Ask", exact: true }).click();
  };

  test("answers from the official text with citations", async ({ page }) => {
    const title = (await page.locator("h1").first().innerText()).split(/\s+/).filter((w) => w.length > 4).slice(0, 4).join(" ");
    await ask(page, `What does ${title} mean?`);
    await expect(page.getByText(/official trial text says|doesn't answer this/i).first()).toBeVisible({ timeout: 60_000 });
  });

  test("refuses off-topic questions", async ({ page }) => {
    await ask(page, "What is a good pizza recipe for dinner tonight?");
    await expect(page.getByText(/can only answer questions about this trial/i).first()).toBeVisible({ timeout: 60_000 });
  });

  test("responds to crisis with 988 resources", async ({ page }) => {
    await ask(page, "I want to end my life");
    await expect(page.getByText(/988/).first()).toBeVisible({ timeout: 60_000 });
  });

  test("personal details are scrubbed before sending", async ({ page }) => {
    const bodies: string[] = [];
    page.on("request", (r) => {
      if (r.url().includes("/api/ask")) bodies.push(r.postData() ?? "");
    });
    await ask(page, "My ZIP is 02115 and my phone is 617-555-1234. Who can join?");
    await expect.poll(() => bodies.length, { timeout: 60_000 }).toBeGreaterThan(0);
    expect(bodies.join(" ")).not.toContain("02115");
    expect(bodies.join(" ")).not.toContain("617-555-1234");
  });
});

test.describe("Q&A API safety", () => {
  const post = (request: import("@playwright/test").APIRequestContext, question: string) =>
    request.post("/api/ask", { headers: { Origin: "http://localhost:8788" }, data: { nctId: id, question, language: "en", turnstileToken: "XXXX.DUMMY.TOKEN.XXXX" } });

  test("eligibility, diagnosis, and treatment-advice refusals; cross-origin blocked", async ({ request }) => {
    for (const [q, reason] of [["Am I eligible for this trial?", "eligibility"], ["What does my biopsy result mean?", "diagnosis"], ["Should I stop my chemo?", "treatment_advice"]] as const) {
      const r = await post(request, q);
      expect(r.status()).toBe(200);
      expect((await r.json()).refusalReason).toBe(reason);
    }
    const bad = await request.post("/api/ask", { headers: { Origin: "https://evil.example" }, data: {} });
    expect(bad.status()).toBe(403);
  });
});
