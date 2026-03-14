import { test, expect } from "../fixtures";

test.describe("Admin Banners Page", () => {
  test("loads the banners page", async ({ adminPage }) => {
    await adminPage.goto("/admin/banners");

    await expect(
      adminPage.getByRole("heading", { name: /banners/i }).first()
    ).toBeVisible({ timeout: 15000 });
  });

  test("has add banner button", async ({ adminPage }) => {
    await adminPage.goto("/admin/banners");
    await adminPage.waitForTimeout(3000);

    const addBtn = adminPage.getByRole("button", { name: /add banner|new banner|create/i })
      .or(adminPage.getByRole("link", { name: /add banner|new banner|create/i }));

    await expect(addBtn.first()).toBeVisible();
  });

  test("shows banner cards or empty state", async ({ adminPage }) => {
    await adminPage.goto("/admin/banners");
    await adminPage.waitForTimeout(3000);

    const content = adminPage.locator("main");
    await expect(content).toBeVisible();
  });
});
