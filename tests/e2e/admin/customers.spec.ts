import { test, expect } from "../fixtures";

test.describe("Admin Customers Page", () => {
  test("loads the customers page", async ({ adminPage }) => {
    await adminPage.goto("/admin/customers");

    await expect(
      adminPage.getByRole("heading", { name: /customers/i }).first()
    ).toBeVisible({ timeout: 15000 });
  });

  test("shows customer list or empty state", async ({ adminPage }) => {
    await adminPage.goto("/admin/customers");
    await adminPage.waitForTimeout(3000);

    const content = adminPage.locator("main");
    await expect(content).toBeVisible();

    const hasCustomers = await adminPage.getByText(/\+91|\d{10}/i).first().isVisible().catch(() => false);
    const isEmpty = await adminPage.getByText(/no customers/i).isVisible().catch(() => false);

    expect(hasCustomers || isEmpty).toBeTruthy();
  });

  test("customer rows link to detail page", async ({ adminPage }) => {
    await adminPage.goto("/admin/customers");
    await adminPage.waitForTimeout(3000);

    const customerLink = adminPage.locator("a[href*='/admin/customers/']").first();
    if ((await customerLink.count()) > 0) {
      await customerLink.click();
      await expect(adminPage).toHaveURL(/\/admin\/customers\/.+/);
    }
  });
});
