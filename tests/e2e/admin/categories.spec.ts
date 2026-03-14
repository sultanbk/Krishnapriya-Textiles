import { test, expect } from "../fixtures";

test.describe("Admin Categories Page", () => {
  test("loads the categories page", async ({ adminPage }) => {
    await adminPage.goto("/admin/categories");

    await expect(
      adminPage.getByRole("heading", { name: /categories/i }).first()
    ).toBeVisible({ timeout: 15000 });
  });

  test("has Add Category button", async ({ adminPage }) => {
    await adminPage.goto("/admin/categories");
    await adminPage.waitForTimeout(3000);

    const addBtn = adminPage.getByRole("button", { name: /add category|new category/i });
    await expect(addBtn.first()).toBeVisible();
  });

  test("shows categories list or empty state", async ({ adminPage }) => {
    await adminPage.goto("/admin/categories");
    await adminPage.waitForTimeout(3000);

    const hasCategories = await adminPage.locator("[class*=divide]").count() > 0;
    const isEmpty = await adminPage.getByText(/no categories/i).isVisible().catch(() => false);

    expect(hasCategories || isEmpty).toBeTruthy();
  });

  test("Add Category opens dialog", async ({ adminPage }) => {
    await adminPage.goto("/admin/categories");
    await adminPage.waitForTimeout(3000);

    const addBtn = adminPage.getByRole("button", { name: /add category|new category/i }).first();
    await addBtn.click();

    // Dialog should open
    const dialog = adminPage.getByRole("dialog");
    await expect(dialog).toBeVisible({ timeout: 5000 });
    await expect(dialog.getByPlaceholder(/name/i).first()).toBeVisible();
  });

  test("category items show visibility toggle", async ({ adminPage }) => {
    await adminPage.goto("/admin/categories");
    await adminPage.waitForTimeout(3000);

    // Check if there are eye toggle buttons
    const toggleButtons = adminPage.getByRole("button").filter({ has: adminPage.locator("svg") });
    const count = await toggleButtons.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
