import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
  });

  test("header is visible", async ({ page }) => {
    await expect(page.locator("header").first()).toBeVisible();
  });

  test("logo links to homepage", async ({ page }) => {
    const logo = page.getByRole("link", { name: /krishnapriya textiles/i }).first();
    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute("href", "/");
  });

  test("desktop nav has primary links", async ({ page, isMobile }) => {
    test.skip(!!isMobile, "Desktop nav not visible on mobile");

    const nav = page.locator("header");
    await expect(nav.getByRole("link", { name: /^home$/i }).first()).toBeVisible();
    await expect(nav.getByRole("link", { name: /all sarees/i }).first()).toBeVisible();
    await expect(nav.getByRole("link", { name: /about/i }).first()).toBeVisible();
    await expect(nav.getByRole("link", { name: /contact/i }).first()).toBeVisible();
  });

  test("clicking All Sarees navigates to products page", async ({ page, isMobile }) => {
    test.skip(!!isMobile, "Desktop nav test");

    await page.locator("header").getByRole("link", { name: /all sarees/i }).first().click();
    await expect(page).toHaveURL(/\/products/);
  });

  test("clicking About navigates to about page", async ({ page, isMobile }) => {
    test.skip(!!isMobile, "Desktop nav test");

    await page.locator("header").getByRole("link", { name: /about/i }).first().click();
    await expect(page).toHaveURL(/\/about/);
  });

  test("clicking Contact navigates to contact page", async ({ page, isMobile }) => {
    test.skip(!!isMobile, "Desktop nav test");

    await page.locator("header").getByRole("link", { name: /contact/i }).first().click();
    await expect(page).toHaveURL(/\/contact/);
  });

  test("mobile menu opens and shows nav items", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Mobile-only test");

    // Open mobile menu
    const menuButton = page.getByLabel(/menu/i).first();
    await menuButton.click();

    // Check nav items are visible
    await expect(page.getByRole("link", { name: /all sarees/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /about/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /contact/i })).toBeVisible();
  });

  test("footer has quick links section", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer.getByText(/quick links/i)).toBeVisible();
  });

  test("footer has customer service links", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer.getByRole("link", { name: /privacy policy/i })).toBeVisible();
    await expect(footer.getByRole("link", { name: /terms/i }).first()).toBeVisible();
  });

  test("footer has social media links", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer.getByLabel(/instagram/i)).toBeVisible();
  });
});
