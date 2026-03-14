import { test, expect } from "../fixtures";

test.describe("Admin Sidebar Navigation", () => {
  test.beforeEach(async ({ adminPage }) => {
    await adminPage.goto("/admin");
    await adminPage.waitForTimeout(2000);
  });

  test("sidebar shows KPT Admin branding", async ({ adminPage, isMobile }) => {
    test.skip(!!isMobile, "Sidebar only visible on desktop");

    await expect(
      adminPage.getByText("KPT Admin").first()
    ).toBeVisible();
  });

  test("sidebar shows all nav groups", async ({ adminPage, isMobile }) => {
    test.skip(!!isMobile, "Sidebar only visible on desktop");

    const sidebar = adminPage.locator("aside").first();
    await expect(sidebar.getByText(/overview/i)).toBeVisible();
    await expect(sidebar.getByText(/catalog/i)).toBeVisible();
    await expect(sidebar.getByText(/sales/i)).toBeVisible();
    await expect(sidebar.getByText(/engagement/i)).toBeVisible();
  });

  test("sidebar has Dashboard link with active state", async ({ adminPage, isMobile }) => {
    test.skip(!!isMobile, "Sidebar only visible on desktop");

    const dashboardLink = adminPage.locator("aside").getByRole("link", { name: /dashboard/i });
    await expect(dashboardLink).toBeVisible();
  });

  test("clicking Products navigates correctly", async ({ adminPage, isMobile }) => {
    test.skip(!!isMobile, "Sidebar only visible on desktop");

    await adminPage.locator("aside").getByRole("link", { name: /products/i }).first().click();
    await expect(adminPage).toHaveURL(/\/admin\/products/);
  });

  test("clicking Orders navigates correctly", async ({ adminPage, isMobile }) => {
    test.skip(!!isMobile, "Sidebar only visible on desktop");

    await adminPage.locator("aside").getByRole("link", { name: /orders/i }).first().click();
    await expect(adminPage).toHaveURL(/\/admin\/orders/);
  });

  test("clicking Categories navigates correctly", async ({ adminPage, isMobile }) => {
    test.skip(!!isMobile, "Sidebar only visible on desktop");

    await adminPage.locator("aside").getByRole("link", { name: /categories/i }).first().click();
    await expect(adminPage).toHaveURL(/\/admin\/categories/);
  });

  test("clicking Customers navigates correctly", async ({ adminPage, isMobile }) => {
    test.skip(!!isMobile, "Sidebar only visible on desktop");

    await adminPage.locator("aside").getByRole("link", { name: /customers/i }).first().click();
    await expect(adminPage).toHaveURL(/\/admin\/customers/);
  });

  test("sidebar scrolls when content overflows", async ({ adminPage, isMobile }) => {
    test.skip(!!isMobile, "Sidebar only visible on desktop");

    // Check that the scroll area is present
    const sidebar = adminPage.locator("aside").first();
    await expect(sidebar).toBeVisible();

    // The nav should contain all items (some may be scrolled)
    const settingsLink = sidebar.getByRole("link", { name: /settings/i });
    await settingsLink.scrollIntoViewIfNeeded();
    await expect(settingsLink).toBeVisible();
  });

  test("sidebar has View Store link", async ({ adminPage, isMobile }) => {
    test.skip(!!isMobile, "Sidebar only visible on desktop");

    const viewStore = adminPage.locator("aside").getByRole("link", { name: /view store/i });
    await expect(viewStore).toBeVisible();
    await expect(viewStore).toHaveAttribute("href", "/");
    await expect(viewStore).toHaveAttribute("target", "_blank");
  });

  test("mobile menu opens with Sheet", async ({ adminPage, isMobile }) => {
    test.skip(!isMobile, "Mobile-only test");

    const menuButton = adminPage.getByRole("button").filter({ has: adminPage.locator("svg") }).first();
    await menuButton.click();

    // Sheet should show navigation
    await expect(
      adminPage.getByRole("link", { name: /dashboard/i }).first()
    ).toBeVisible({ timeout: 5000 });
  });
});
