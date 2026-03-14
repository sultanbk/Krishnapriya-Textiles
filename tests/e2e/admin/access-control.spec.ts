import { test, expect } from "@playwright/test";
import { loginAsUser, loginAsAdmin } from "../helpers/auth";

test.describe("Admin Access Control", () => {
  test("unauthenticated user is redirected to login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

  test("unauthenticated user is redirected from admin sub-pages", async ({ page }) => {
    const adminPages = [
      "/admin/products",
      "/admin/orders",
      "/admin/categories",
      "/admin/customers",
      "/admin/settings",
    ];

    for (const adminPage of adminPages) {
      await page.goto(adminPage);
      await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    }
  });

  test("regular user is redirected to home from admin", async ({ page, context }) => {
    await loginAsUser(context);

    await page.goto("/admin");
    await expect(page).toHaveURL("/", { timeout: 10000 });
  });

  test("regular user is redirected from admin sub-pages", async ({ page, context }) => {
    await loginAsUser(context);

    await page.goto("/admin/products");
    await expect(page).toHaveURL("/", { timeout: 10000 });
  });

  test("admin user can access dashboard", async ({ page, context }) => {
    await loginAsAdmin(context);

    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin/);
    await expect(page).not.toHaveURL(/\/login/);
  });

  test("admin user can access all admin pages", async ({ page, context }) => {
    await loginAsAdmin(context);

    const pages = [
      "/admin/products",
      "/admin/orders",
      "/admin/categories",
      "/admin/customers",
    ];

    for (const adminUrl of pages) {
      await page.goto(adminUrl);
      await expect(page).toHaveURL(new RegExp(adminUrl.replace("/", "\\/")));
      await expect(page).not.toHaveURL(/\/login/);
    }
  });
});
