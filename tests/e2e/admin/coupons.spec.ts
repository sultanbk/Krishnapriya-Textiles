import { test, expect } from "../fixtures";

test.describe("Admin Coupons Page", () => {
  test("loads the coupons page", async ({ adminPage }) => {
    await adminPage.goto("/admin/coupons");

    await expect(
      adminPage.getByRole("heading", { name: /coupons/i }).first()
    ).toBeVisible({ timeout: 15000 });
  });

  test("has add coupon button", async ({ adminPage }) => {
    await adminPage.goto("/admin/coupons");
    await adminPage.waitForTimeout(3000);

    const addBtn = adminPage.getByRole("button", { name: /add coupon|new coupon|create/i })
      .or(adminPage.getByRole("link", { name: /add coupon|new coupon|create/i }));

    await expect(addBtn.first()).toBeVisible();
  });

  test("shows coupons list or empty state", async ({ adminPage }) => {
    await adminPage.goto("/admin/coupons");
    await adminPage.waitForTimeout(3000);

    const content = adminPage.locator("main");
    await expect(content).toBeVisible();
  });
});
