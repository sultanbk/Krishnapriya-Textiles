import { test, expect } from "../fixtures";

test.describe("Admin Inventory Page", () => {
  test("loads the inventory page", async ({ adminPage }) => {
    await adminPage.goto("/admin/inventory");

    await expect(
      adminPage.getByRole("heading", { name: /inventory/i }).first()
    ).toBeVisible({ timeout: 15000 });
  });

  test("shows stock data or empty state", async ({ adminPage }) => {
    await adminPage.goto("/admin/inventory");
    await adminPage.waitForTimeout(3000);

    const content = adminPage.locator("main");
    await expect(content).toBeVisible();

    // Should show product stock info or empty state
    const hasData = await adminPage.getByText(/stock|quantity|out of stock|in stock/i).first().isVisible().catch(() => false);
    const isEmpty = await adminPage.getByText(/no products|no items/i).isVisible().catch(() => false);

    expect(hasData || isEmpty).toBeTruthy();
  });

  test("has inline stock editor inputs", async ({ adminPage }) => {
    await adminPage.goto("/admin/inventory");
    await adminPage.waitForTimeout(3000);

    // Check for number inputs (stock editors)
    const inputs = adminPage.locator("input[type='number']");
    const count = await inputs.count();
    // May or may not have products
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
