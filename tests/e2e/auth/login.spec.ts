import { test, expect } from "@playwright/test";

test.describe("Login Page", () => {
  test("renders login form with phone input", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    // Phone number input
    const phoneInput = page.getByPlaceholder(/phone|mobile|number/i).or(
      page.locator("input[type='tel']")
    );
    await expect(phoneInput.first()).toBeVisible();
  });

  test("shows validation for empty phone number", async ({ page }) => {
    await page.goto("/login");
    const submitBtn = page.getByRole("button", { name: /send|get|continue|otp|login|sign in/i }).first();
    await submitBtn.click();

    // Should show validation error
    const error = page.getByText(/required|valid|enter|phone/i);
    await expect(error.first()).toBeVisible({ timeout: 5000 });
  });

  test("already logged-in user gets redirected from login", async ({ page, context }) => {
    // Use the auth helper to inject a session
    const { loginAsUser } = await import("../helpers/auth");
    await loginAsUser(context);

    await page.goto("/login");
    // Middleware should redirect to home
    await expect(page).toHaveURL("/", { timeout: 10000 });
  });
});
