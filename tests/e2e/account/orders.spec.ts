import { test, expect } from "../fixtures";

test.describe("Orders Page", () => {
  test("loads orders page for authenticated user", async ({ userPage }) => {
    await userPage.goto("/orders");
    await expect(userPage).not.toHaveURL(/\/login/);

    // Orders page uses h2 headings ("My Orders" or "No orders yet")
    const heading = userPage.getByRole("heading", { level: 2 }).first();
    await expect(heading).toBeVisible();
  });

  test("shows orders list or empty state", async ({ userPage }) => {
    await userPage.goto("/orders");
    await userPage.waitForTimeout(3000);

    // Either has orders listed or shows empty state
    const content = userPage.locator("main, [class*=container]").first();
    await expect(content).toBeVisible();

    const hasOrders = await userPage.locator("a[href*='/orders/']").count() > 0;
    const isEmpty = await userPage.getByText(/no orders|haven't placed/i).isVisible().catch(() => false);

    expect(hasOrders || isEmpty).toBeTruthy();
  });
});
