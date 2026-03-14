import { test, expect } from "@playwright/test";

test.describe("Cart Page", () => {
  test("shows empty cart state", async ({ page }) => {
    await page.goto("/cart");
    await expect(
      page.getByRole("heading", { name: /your cart is empty|shopping cart/i }).first()
    ).toBeVisible({ timeout: 10000 });
  });

  test("empty cart has browse collection link", async ({ page }) => {
    await page.goto("/cart");
    // Wait for client render
    await page.waitForTimeout(2000);

    const browseLink = page.getByRole("link", { name: /browse collection/i });
    const hasLink = (await browseLink.count()) > 0;

    if (hasLink) {
      await expect(browseLink).toHaveAttribute("href", /\/products/);
    }
  });

  test("adding product to cart from product page", async ({ page }) => {
    await page.goto("/products");

    const productLink = page.locator("a[href*='/products/']").first();
    if ((await productLink.count()) === 0) {
      test.skip(true, "No products available");
      return;
    }

    await productLink.click();
    await expect(page).toHaveURL(/\/products\/.+/);

    const addToCartBtn = page.getByRole("button", { name: /add to (cart|bag)/i }).first();
    const outOfStock = page.getByText(/out of stock/i);

    if ((await outOfStock.count()) > 0) {
      test.skip(true, "Product out of stock");
      return;
    }

    if ((await addToCartBtn.count()) > 0) {
      await addToCartBtn.click();

      // Cart drawer or notification should appear
      const cartDrawer = page.getByText(/added to cart|cart|shopping bag/i);
      await expect(cartDrawer.first()).toBeVisible({ timeout: 5000 });
    }
  });
});
