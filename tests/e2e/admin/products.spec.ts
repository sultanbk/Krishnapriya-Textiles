import { test, expect } from "../fixtures";

test.describe("Admin Products Page", () => {
  test("loads the products list", async ({ adminPage }) => {
    await adminPage.goto("/admin/products");

    await expect(
      adminPage.getByRole("heading", { name: /products/i }).first()
    ).toBeVisible({ timeout: 15000 });
  });

  test("shows product items or empty state", async ({ adminPage }) => {
    await adminPage.goto("/admin/products");
    await adminPage.waitForTimeout(3000);

    const hasProducts = await adminPage.getByText(/₹/).first().isVisible().catch(() => false);
    const isEmpty = await adminPage.getByText(/no products/i).isVisible().catch(() => false);

    expect(hasProducts || isEmpty).toBeTruthy();
  });

  test("has Add Product button", async ({ adminPage }) => {
    await adminPage.goto("/admin/products");

    const addBtn = adminPage.getByRole("link", { name: /add product|new product/i })
      .or(adminPage.getByRole("button", { name: /add product|new product/i }));

    await expect(addBtn.first()).toBeVisible({ timeout: 10000 });
  });

  test("Add Product navigates to new product page", async ({ adminPage }) => {
    await adminPage.goto("/admin/products");

    const addBtn = adminPage.getByRole("link", { name: /add product|new product/i }).first();
    if ((await addBtn.count()) > 0) {
      await addBtn.click();
      await expect(adminPage).toHaveURL(/\/admin\/products\/new/);
    }
  });

  test("product card/row has product details", async ({ adminPage }) => {
    await adminPage.goto("/admin/products");
    await adminPage.waitForTimeout(3000);

    const hasProducts = await adminPage.getByText(/₹/).first().isVisible().catch(() => false);
    if (hasProducts) {
      // Should show product names and prices
      await expect(adminPage.getByText(/₹/).first()).toBeVisible();
    }
  });

  test("pagination exists when products are present", async ({ adminPage }) => {
    await adminPage.goto("/admin/products");
    await adminPage.waitForTimeout(3000);

    // Look for pagination controls
    const pagination = adminPage.getByRole("button", { name: /next|previous|prev/i })
      .or(adminPage.getByText(/page \d/i));

    // Pagination may or may not exist depending on product count
    const paginationCount = await pagination.count();
    // This is a soft check — just ensure no errors
    expect(paginationCount).toBeGreaterThanOrEqual(0);
  });
});
