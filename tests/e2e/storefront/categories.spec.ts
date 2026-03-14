import { test, expect } from "@playwright/test";

test.describe("Categories Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/categories", { waitUntil: "domcontentloaded" });
  });

  test("renders the page heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /our collections/i })
    ).toBeVisible();
  });

  test("shows description text", async ({ page }) => {
    await expect(
      page.getByText(/explore|handpicked|saree collections/i).first()
    ).toBeVisible();
  });

  test("displays category cards or empty state", async ({ page }) => {
    const hasCategories = await page
      .getByRole("link", { name: /view collection/i })
      .first()
      .isVisible()
      .catch(() => false);

    const isEmpty = await page
      .getByText(/no collections available/i)
      .isVisible()
      .catch(() => false);

    expect(hasCategories || isEmpty).toBeTruthy();
  });

  test("category card links to category page", async ({ page }) => {
    const categoryLink = page.locator("a[href*='/categories/']").first();
    if ((await categoryLink.count()) > 0) {
      const href = await categoryLink.getAttribute("href");
      expect(href).toMatch(/\/categories\/.+/);
    }
  });

  test("clicking a category navigates correctly", async ({ page }) => {
    const categoryLink = page.locator("a[href*='/categories/']").first();
    if ((await categoryLink.count()) > 0) {
      await categoryLink.click();
      await expect(page).toHaveURL(/\/categories\/.+/);
    }
  });
});
