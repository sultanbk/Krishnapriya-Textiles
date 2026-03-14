import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
  });

  test("renders the page with correct title", async ({ page }) => {
    await expect(page).toHaveTitle(/Krishnapriya Textiles/);
  });

  test("displays the hero section", async ({ page }) => {
    // Either the banner carousel or the static hero should be visible
    const hero = page
      .getByRole("heading", { name: /timeless elegance|shop collection/i })
      .or(page.locator("[class*=banner], [class*=hero], [class*=carousel]").first());
    await expect(hero).toBeVisible({ timeout: 10000 });
  });

  test("shows feature highlights bar", async ({ page }) => {
    await expect(page.getByText(/free shipping/i).first()).toBeVisible();
    await expect(page.getByText(/100% authentic/i).first()).toBeVisible();
  });

  test("displays featured products section", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /featured collection/i })
    ).toBeVisible();
  });

  test("displays categories section", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /shop by category/i })
    ).toBeVisible();
  });

  test("displays new arrivals section", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /new arrivals/i })
    ).toBeVisible();
  });

  test("displays budget friendly section", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /budget friendly/i })
    ).toBeVisible();
  });

  test("displays testimonials section", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /what our customers say/i })
    ).toBeVisible();
  });

  test("has working CTA buttons", async ({ page }) => {
    const shopLink = page.getByRole("link", { name: /shop collection/i }).first();
    if (await shopLink.isVisible()) {
      await expect(shopLink).toHaveAttribute("href", /\/products/);
    }
  });

  test("footer is visible with brand name", async ({ page }) => {
    await expect(page.locator("footer")).toBeVisible();
    await expect(
      page.locator("footer").getByText(/krishnapriya textiles/i).first()
    ).toBeVisible();
  });
});
