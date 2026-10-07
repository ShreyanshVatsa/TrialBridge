import { expect, test } from "@playwright/test";
import { chooseLanguage } from "./i18n-helpers";
import { completeIntake, RESULTS_HEADING, sampleTrialId } from "./helpers";

const id = sampleTrialId();

test("language switching translates the UI and persists across reloads", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveText(/Find cancer clinical trials/);
  await chooseLanguage(page, "es");
  await expect(page.locator("h1")).toHaveText(/Encuentre estudios clínicos/);
  await page.reload();
  await expect(page.locator("h1")).toHaveText(/Encuentre estudios clínicos/);
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await chooseLanguage(page, "en");
  await expect(page.locator("h1")).toHaveText(/Find cancer clinical trials/);
});

test("tab title and meta description follow the language on non-trial pages", async ({ page }) => {
  await page.goto("/privacy/");
  await expect(page).toHaveTitle(/^Privacy/);
  await chooseLanguage(page, "es");
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page).toHaveTitle(/^Privacidad · TrialBridge/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /Búsqueda gratuita y privada/);
  await chooseLanguage(page, "ht");
  await expect(page).toHaveTitle(/TrialBridge/);
  await expect(page).not.toHaveTitle(/^Privacy ·/);
  await page.goto("/offline/");
  await expect(page).toHaveTitle(/San koneksyon/);
});

test("trial detail page shows official text, criteria, and link @mobile", async ({ page }) => {
  await page.goto(`/trial/?id=${id}`);
  await expect(page.getByText(id).first()).toBeVisible();
  await expect(page.locator("h1")).not.toBeEmpty();
  await expect(page.getByText(/Inclusion criteri/i).first()).toBeVisible();
  await expect(page.locator(`a[href*="clinicaltrials.gov/study/${id}"]`).first()).toBeVisible();
  await page.goto("/trial/?id=NCT00000000");
  await expect(page.getByText("Trial not found")).toBeVisible();
});

test("Access Intelligence filters update stats and the map", async ({ page }) => {
  await page.goto("/access/");
  const trialsStat = page.getByText("Trials analyzed").locator("..");
  await expect(trialsStat).toBeVisible();
  const before = await trialsStat.innerText();
  await page.getByLabel("Cancer type", { exact: true }).selectOption("breast");
  await expect.poll(() => trialsStat.innerText()).not.toBe(before);
  await page.getByLabel("State", { exact: true }).selectOption("TX");
  await expect(page.getByLabel("State", { exact: true })).toHaveValue("TX");
  await page.getByLabel("Map shows").selectOption("english_required");
  const tiles = page.getByRole("button", { name: /trials\)|no trials/i });
  expect(await tiles.count()).toBeGreaterThan(40);
  await page.getByRole("button", { name: /^California:/ }).click();
  await expect(page.getByLabel("State", { exact: true })).toHaveValue("CA");
  await expect(page.getByRole("table").first()).toBeVisible();
});

test("print view: 'Bring this to your appointment'", async ({ page }) => {
  await page.addInitScript(() => {
    window.print = () => undefined;
  });
  await completeIntake(page, { cancer: "Breast cancer" });
  await expect(page.getByText(RESULTS_HEADING)).toBeVisible({ timeout: 90_000 });
  await page.getByRole("button", { name: /Print or save/i }).click();
  await page.emulateMedia({ media: "print" });
  await expect(page.getByText("Bring this to your appointment")).toBeVisible();
  await expect(page.getByRole("banner")).toBeHidden();
});

test("PWA: valid manifest, service worker, no installability errors", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium");
  await page.goto("/");
  const manifestHref = await page.locator('link[rel="manifest"]').getAttribute("href");
  expect(manifestHref).toBeTruthy();
  const manifest = (await (await page.request.get(manifestHref as string)).json()) as { display: string; start_url: string; icons: { sizes: string }[] };
  expect(manifest.display).toBe("standalone");
  expect(manifest.icons.map((i) => i.sizes)).toEqual(expect.arrayContaining(["192x192", "512x512"]));
  await expect.poll(() => page.evaluate(async () => Boolean(await navigator.serviceWorker.getRegistration())), { timeout: 30_000 }).toBe(true);
  const cdp = await page.context().newCDPSession(page);
  const { installabilityErrors } = (await cdp.send("Page.getInstallabilityErrors")) as { installabilityErrors: { errorId: string }[] };
  expect(installabilityErrors.map((e) => e.errorId)).toEqual([]);
  const sw = await (await page.request.get("/sw.js")).text();
  expect(sw).toContain('"/api/"');
});
