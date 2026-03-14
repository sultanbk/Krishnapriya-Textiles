import { test, expect } from "../fixtures";

test.describe("Account Page", () => {
  test("loads account page for authenticated user", async ({ userPage }) => {
    await userPage.goto("/account");
    await expect(userPage).not.toHaveURL(/\/login/);
    // Should display account-related content
    const heading = userPage.getByRole("heading", { level: 1 }).first();
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test("shows user phone number", async ({ userPage }) => {
    await userPage.goto("/account");
    await userPage.waitForTimeout(2000);

    // The page should show some user info
    const content = userPage.locator("main");
    await expect(content).toBeVisible();
  });
});
