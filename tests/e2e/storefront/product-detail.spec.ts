import { test, expect } from "@playwright/test";

/**
 * Helper to get the first product detail link (excludes /products itself).
 * Product detail links look like /products/{slug} where slug contains letters.
 */
function getFirstProductDetailLink(page: import("@playwright/test").Page) {
  return page.locator("a[href]").filter({
    has: page.locator("[href]"),
  }).evaluateAll((els) => {
    for (const el of els) {
      const href = el.getAttribute("href") || "";
      // Match /products/some-slug but not /products or /products?
      if (/^\/products\/[a-z0-9]/.test(href)) return href;
    }
    return null;
  });
}

test.describe("Product Detail Page", () => {
  test("can navigate to a product detail from listing", async ({ page }) => {
    await page.goto("/products");
    await page.waitForLoadState("domcontentloaded");

    // Find first product detail link via JS evaluation
    const href = await getFirstProductDetailLink(page);

    if (href) {
      await page.goto(href);
      await page.waitForLoadState("domcontentloaded");
      await expect(page).toHaveURL(/\/products\/[a-z0-9]/);

      // Product name heading — could be h1 or h2
      const heading = page.getByRole("heading").first();
      await expect(heading).toBeVisible();
    }
  });

  test("displays product price", async ({ page }) => {
    await page.goto("/products");
    await page.waitForLoadState("domcontentloaded");

    const href = await getFirstProductDetailLink(page);
    if (href) {
      await page.goto(href);
      await page.waitForLoadState("domcontentloaded");
      await expect(page.getByText(/₹/).first()).toBeVisible();
    }
  });

  test("shows breadcrumb navigation", async ({ page }) => {
    await page.goto("/products");
    await page.waitForLoadState("domcontentloaded");

    const href = await getFirstProductDetailLink(page);
    if (href) {
      await page.goto(href);
      await page.waitForLoadState("domcontentloaded");

      const breadcrumb = page.locator("nav").filter({ hasText: /home/i });
      await expect(breadcrumb.first()).toBeVisible();
    }
  });

  test("has Add to Cart button or Out of Stock", async ({ page }) => {
    await page.goto("/products");
    await page.waitForLoadState("domcontentloaded");

    const href = await getFirstProductDetailLink(page);
    if (href) {
      await page.goto(href);
      await page.waitForLoadState("domcontentloaded");

      // Wait for either add-to-cart or out-of-stock to appear
      const addToCart = page.getByRole("button", { name: /add to (cart|bag)/i }).first();
      const outOfStock = page.getByText(/out of stock/i).first();

      await expect(addToCart.or(outOfStock)).toBeVisible();
    }
  });

  test("shows trust signals", async ({ page }) => {
    await page.goto("/products");
    await page.waitForLoadState("domcontentloaded");

    const href = await getFirstProductDetailLink(page);
    if (href) {
      await page.goto(href);
      await page.waitForLoadState("domcontentloaded");
      await expect(page.getByText(/authentic/i).first()).toBeVisible();
    }
  });

  test("displays key details grid", async ({ page }) => {
    await page.goto("/products");
    await page.waitForLoadState("domcontentloaded");

    const href = await getFirstProductDetailLink(page);
    if (href) {
      await page.goto(href);
      await page.waitForLoadState("domcontentloaded");
      await expect(page.getByText(/fabric/i).first()).toBeVisible();
    }
  });
});
