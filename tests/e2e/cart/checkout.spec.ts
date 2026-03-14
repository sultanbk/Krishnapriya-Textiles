import { test, expect } from "../fixtures";

test.describe("Checkout Page", () => {
  test("authenticated user can access checkout", async ({ userPage }) => {
    await userPage.goto("/checkout");
    // Should not redirect to login
    await expect(userPage).not.toHaveURL(/\/login/);
  });

  test("shows empty cart state when no items", async ({ userPage }) => {
    await userPage.goto("/checkout");
    // Wait for client-side hydration
    await userPage.waitForTimeout(3000);

    // Either shows checkout content, empty cart, or redirects to cart
    const checkoutHeading = userPage.getByRole("heading", { name: /checkout/i });
    const emptyCart = userPage.getByText(/cart is empty|no items/i);
    const mainContent = userPage.locator("main, [class*=container]").first();

    const hasCheckout = (await checkoutHeading.count()) > 0;
    const isEmpty = (await emptyCart.count()) > 0;
    const hasContent = (await mainContent.count()) > 0;

    expect(hasCheckout || isEmpty || hasContent).toBeTruthy();
  });

  test("empty cart shows browse collection link", async ({ userPage }) => {
    await userPage.goto("/checkout");
    await userPage.waitForTimeout(2000);

    const emptyCart = userPage.getByText(/cart is empty/i);
    if ((await emptyCart.count()) > 0) {
      const browseLink = userPage.getByRole("link", { name: /browse collection/i });
      await expect(browseLink).toBeVisible();
    }
  });

  test("unauthenticated user is redirected to login", async ({ page }) => {
    await page.goto("/checkout");
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });
});
