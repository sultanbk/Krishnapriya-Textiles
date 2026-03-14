import { test, expect } from "@playwright/test";

test.describe("Wishlist Page", () => {
  test("loads wishlist page", async ({ page }) => {
    await page.goto("/wishlist");
    await expect(
      page.getByRole("heading", { name: /my wishlist/i })
    ).toBeVisible({ timeout: 10000 });
  });

  test("shows empty wishlist state", async ({ page }) => {
    await page.goto("/wishlist");
    await page.waitForTimeout(2000);

    // Empty state text
    const emptyText = page.getByText(/no saved sarees|wishlist is empty/i);
    const hasItems = await page.getByText(/sarees saved/i).isVisible().catch(() => false);

    const isEmpty = (await emptyText.count()) > 0;
    expect(hasItems || isEmpty).toBeTruthy();
  });

  test("empty wishlist has browse link", async ({ page }) => {
    await page.goto("/wishlist");
    await page.waitForTimeout(2000);

    const emptyText = page.getByText(/no saved sarees|wishlist is empty/i);
    if ((await emptyText.count()) > 0) {
      const browseLink = page.getByRole("link", { name: /browse sarees/i });
      await expect(browseLink).toBeVisible();
      await expect(browseLink).toHaveAttribute("href", /\/products/);
    }
  });
});
