import { test, expect } from "@playwright/test";

test.describe("Static Pages", () => {
  test("About page loads with heading", async ({ page }) => {
    await page.goto("/about");
    await expect(
      page.getByRole("heading", { name: /our story/i })
    ).toBeVisible();
    await expect(
      page.getByText(/krishnapriya textiles/i).first()
    ).toBeVisible();
  });

  test("About page has values section", async ({ page }) => {
    await page.goto("/about");
    await expect(
      page.getByRole("heading", { name: /our values/i })
    ).toBeVisible();
  });

  test("About page has CTA buttons", async ({ page }) => {
    await page.goto("/about");
    await expect(
      page.getByRole("link", { name: /browse sarees/i })
    ).toBeVisible();
  });

  test("Contact page loads with heading", async ({ page }) => {
    await page.goto("/contact");
    await expect(
      page.getByRole("heading", { name: /contact us/i })
    ).toBeVisible();
  });

  test("Contact page has contact form", async ({ page }) => {
    await page.goto("/contact");
    await expect(
      page.getByRole("heading", { name: /send us a message/i })
    ).toBeVisible();
    // Form fields
    await expect(page.getByPlaceholder(/name/i).first()).toBeVisible();
  });

  test("Contact page shows business hours", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByText(/business hours/i)).toBeVisible();
  });

  test("Saree Guide page loads", async ({ page }) => {
    await page.goto("/saree-guide");
    await expect(
      page.getByRole("heading", { name: /saree guide/i })
    ).toBeVisible();
  });

  test("Privacy Policy page loads", async ({ page }) => {
    await page.goto("/privacy-policy");
    await expect(
      page.getByRole("heading", { level: 1 }).first()
    ).toBeVisible();
  });

  test("Terms page loads", async ({ page }) => {
    await page.goto("/terms");
    await expect(
      page.getByRole("heading", { level: 1 }).first()
    ).toBeVisible();
  });

  test("Shipping Policy page loads", async ({ page }) => {
    await page.goto("/shipping-policy");
    await expect(
      page.getByRole("heading", { level: 1 }).first()
    ).toBeVisible();
  });

  test("Refund Policy page loads", async ({ page }) => {
    await page.goto("/refund-policy");
    await expect(
      page.getByRole("heading", { level: 1 }).first()
    ).toBeVisible();
  });
});
