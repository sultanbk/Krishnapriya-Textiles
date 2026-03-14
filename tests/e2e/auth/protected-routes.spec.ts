import { test, expect } from "@playwright/test";
import { loginAsUser, loginAsAdmin } from "../helpers/auth";

const protectedRoutes = [
  { path: "/account", name: "Account" },
  { path: "/orders", name: "Orders" },
  { path: "/checkout", name: "Checkout" },
  { path: "/addresses", name: "Addresses" },
  { path: "/notifications", name: "Notifications" },
];

test.describe("Protected Routes - Unauthenticated", () => {
  for (const route of protectedRoutes) {
    test(`${route.name} page redirects to login`, async ({ page }) => {
      await page.goto(route.path);
      await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    });
  }

  test("login redirect includes callbackUrl", async ({ page }) => {
    await page.goto("/orders");
    await expect(page).toHaveURL(/\/login\?callbackUrl/);
  });
});

test.describe("Protected Routes - Authenticated", () => {
  test("authenticated user can access account page", async ({ page, context }) => {
    await loginAsUser(context);

    await page.goto("/account");
    // Should NOT redirect to login
    await expect(page).not.toHaveURL(/\/login/, { timeout: 5000 });
  });

  test("authenticated user can access orders page", async ({ page, context }) => {
    await loginAsUser(context);

    await page.goto("/orders");
    await expect(page).not.toHaveURL(/\/login/, { timeout: 5000 });
  });
});

test.describe("Admin Routes - Access Control", () => {
  test("unauthenticated user is redirected from admin", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

  test("regular user is redirected from admin", async ({ page, context }) => {
    await loginAsUser(context);

    await page.goto("/admin");
    // Should redirect to home (not login) since user is logged in but not admin
    await expect(page).toHaveURL("/", { timeout: 10000 });
  });

  test("admin user can access admin dashboard", async ({ page, context }) => {
    await loginAsAdmin(context);

    await page.goto("/admin");
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page).toHaveURL(/\/admin/);
  });
});
