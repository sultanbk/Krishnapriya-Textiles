import { test, expect } from "../fixtures";

test.describe("Admin Dashboard", () => {
  test("loads the dashboard page", async ({ adminPage }) => {
    await adminPage.goto("/admin");
    await expect(adminPage).toHaveURL(/\/admin/);

    // Dashboard should show stat cards or greeting
    const heading = adminPage.getByRole("heading", { level: 1 }).first();
    await expect(heading).toBeVisible({ timeout: 15000 });
  });

  test("displays stat cards", async ({ adminPage }) => {
    await adminPage.goto("/admin");
    await adminPage.waitForTimeout(3000);

    // Dashboard should show key metrics
    const statsArea = adminPage.locator("main");
    await expect(statsArea).toBeVisible();

    // Should contain revenue/orders/customers type content
    const hasStats = await adminPage.getByText(/₹|orders|revenue|customers|products/i).first().isVisible().catch(() => false);
    expect(hasStats).toBeTruthy();
  });

  test("shows recent orders section", async ({ adminPage }) => {
    await adminPage.goto("/admin");
    await adminPage.waitForTimeout(3000);

    const recentOrders = adminPage.getByText(/recent orders/i);
    await expect(recentOrders.first()).toBeVisible();
  });

  test("shows quick actions", async ({ adminPage }) => {
    await adminPage.goto("/admin");
    await adminPage.waitForTimeout(3000);

    const quickActions = adminPage.getByText(/quick actions/i);
    await expect(quickActions.first()).toBeVisible();
  });

  test("has working navigation to other admin pages", async ({ adminPage }) => {
    await adminPage.goto("/admin");

    const productsLink = adminPage.getByRole("link", { name: /products/i }).first();
    await expect(productsLink).toBeVisible();
  });
});
