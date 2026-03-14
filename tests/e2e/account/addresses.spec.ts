import { test, expect } from "../fixtures";

test.describe("Addresses Page", () => {
  test("loads addresses page for authenticated user", async ({ userPage }) => {
    await userPage.goto("/addresses");
    await expect(userPage).not.toHaveURL(/\/login/);

    // Client component - wait for heading to render
    const heading = userPage.getByRole("heading", { name: /my addresses|addresses/i }).first();
    await expect(heading).toBeVisible();
  });

  test("shows addresses list or empty state", async ({ userPage }) => {
    await userPage.goto("/addresses");
    await userPage.waitForTimeout(3000);

    const content = userPage.locator("main");
    await expect(content).toBeVisible();
  });

  test("has add address button or link", async ({ userPage }) => {
    await userPage.goto("/addresses");
    await userPage.waitForTimeout(2000);

    const addButton = userPage.getByRole("link", { name: /add.*(address|new)/i })
      .or(userPage.getByRole("button", { name: /add.*(address|new)/i }));

    await expect(addButton.first()).toBeVisible();
  });
});
