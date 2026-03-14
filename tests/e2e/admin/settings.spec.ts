import { test, expect } from "../fixtures";

test.describe("Admin Settings Page", () => {
  test("loads the settings page", async ({ adminPage }) => {
    await adminPage.goto("/admin/settings");

    await expect(
      adminPage.getByRole("heading", { name: /settings/i }).first()
    ).toBeVisible({ timeout: 15000 });
  });

  test("settings page has content", async ({ adminPage }) => {
    await adminPage.goto("/admin/settings");
    await adminPage.waitForTimeout(3000);

    const content = adminPage.locator("main");
    await expect(content).toBeVisible();
  });
});
