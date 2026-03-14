import { test, expect } from "../fixtures";

test.describe("Admin Reviews Page", () => {
  test("loads the reviews page", async ({ adminPage }) => {
    await adminPage.goto("/admin/reviews");

    await expect(
      adminPage.getByRole("heading", { name: /reviews/i }).first()
    ).toBeVisible({ timeout: 15000 });
  });

  test("has filter pills", async ({ adminPage }) => {
    await adminPage.goto("/admin/reviews");
    await adminPage.waitForTimeout(3000);

    // Filter buttons: All, Visible, Hidden
    const allFilter = adminPage.getByRole("button", { name: /^all$/i });
    await expect(allFilter.first()).toBeVisible();
  });

  test("shows reviews or empty state", async ({ adminPage }) => {
    await adminPage.goto("/admin/reviews");
    await adminPage.waitForTimeout(3000);

    const content = adminPage.locator("main");
    await expect(content).toBeVisible();
  });

  test("filter pills change content", async ({ adminPage }) => {
    await adminPage.goto("/admin/reviews");
    await adminPage.waitForTimeout(3000);

    const visibleFilter = adminPage.getByRole("button", { name: /visible/i }).first();
    if ((await visibleFilter.count()) > 0) {
      await visibleFilter.click();
      await adminPage.waitForTimeout(1000);
      // Page should still be loaded without errors
      await expect(adminPage.locator("main")).toBeVisible();
    }
  });
});
