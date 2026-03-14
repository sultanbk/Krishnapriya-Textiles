import { test, expect } from "../fixtures";

test.describe("Admin Orders Page", () => {
  test("loads the orders page", async ({ adminPage }) => {
    await adminPage.goto("/admin/orders");

    await expect(
      adminPage.getByRole("heading", { name: /orders/i }).first()
    ).toBeVisible({ timeout: 15000 });
  });

  test("shows orders list or empty state", async ({ adminPage }) => {
    await adminPage.goto("/admin/orders");
    await adminPage.waitForTimeout(3000);

    const hasOrders = await adminPage.getByText(/₹/).first().isVisible().catch(() => false);
    const isEmpty = await adminPage.getByText(/no orders/i).isVisible().catch(() => false);

    expect(hasOrders || isEmpty).toBeTruthy();
  });

  test("displays order status badges", async ({ adminPage }) => {
    await adminPage.goto("/admin/orders");
    await adminPage.waitForTimeout(3000);

    const hasOrders = await adminPage.getByText(/₹/).first().isVisible().catch(() => false);
    if (hasOrders) {
      // Status badges should be present
      const statusBadge = adminPage.getByText(
        /pending|confirmed|shipped|delivered|cancelled|processing/i
      );
      await expect(statusBadge.first()).toBeVisible();
    }
  });

  test("order rows are clickable", async ({ adminPage }) => {
    await adminPage.goto("/admin/orders");
    await adminPage.waitForTimeout(3000);

    const orderLink = adminPage.locator("a[href*='/admin/orders/']").first();
    if ((await orderLink.count()) > 0) {
      await orderLink.click();
      await expect(adminPage).toHaveURL(/\/admin\/orders\/.+/);
    }
  });

  test("shows export button", async ({ adminPage }) => {
    await adminPage.goto("/admin/orders");
    await adminPage.waitForTimeout(3000);

    const exportBtn = adminPage.getByRole("button", { name: /export/i });
    const hasExport = (await exportBtn.count()) > 0;
    expect(hasExport).toBeTruthy();
  });
});
