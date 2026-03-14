import { test, expect } from "@playwright/test";

test.describe("Products Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/products", { waitUntil: "domcontentloaded" });
  });

  test("renders the page heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /all sarees/i }).first()
    ).toBeVisible();
  });

  test("shows product count text", async ({ page }) => {
    // Either shows products or empty state
    const hasProducts = await page.getByText(/showing \d+/i).isVisible().catch(() => false);
    const isEmpty = await page.getByText(/no (sarees|products) found/i).isVisible().catch(() => false);
    expect(hasProducts || isEmpty).toBeTruthy();
  });

  test("displays product cards when products exist", async ({ page }) => {
    const productGrid = page.locator("[class*=grid]").filter({ hasText: /₹/ });
    const hasProducts = await productGrid.count() > 0;

    if (hasProducts) {
      // Product cards should have prices
      await expect(page.getByText(/₹/).first()).toBeVisible();
    }
  });

  test("has a search component", async ({ page }) => {
    const search = page.getByPlaceholder(/search/i).or(page.getByRole("searchbox"));
    const searchExists = (await search.count()) > 0;
    expect(searchExists).toBeTruthy();
  });

  test("product card links to product detail", async ({ page }) => {
    const productLinks = page.locator("a[href*='/products/']");
    const count = await productLinks.count();

    if (count > 0) {
      const href = await productLinks.first().getAttribute("href");
      expect(href).toMatch(/\/products\/.+/);
    }
  });

  test("page has description text", async ({ page }) => {
    await expect(
      page.getByText(/discover|handpicked|collection|premium/i).first()
    ).toBeVisible();
  });
});

test.describe("Products Page - Filtering", () => {
  test("can filter by search query", async ({ page }) => {
    await page.goto("/products?q=silk");
    // Should show either search results or empty state
    const heading = page.getByRole("heading").first();
    await expect(heading).toBeVisible();
  });
});
