/* eslint-disable react-hooks/rules-of-hooks */
import { test as base, type Page } from "@playwright/test";
import { loginAsUser, loginAsAdmin } from "./helpers/auth";

/**
 * Extended test fixtures that provide pre-authenticated pages.
 *
 * Usage:
 *   import { test, expect } from "../fixtures";
 *   test("my test", async ({ userPage }) => { ... });
 *   test("admin test", async ({ adminPage }) => { ... });
 */
type AuthFixtures = {
  /** A page with an authenticated regular user session */
  userPage: Page;
  /** A page with an authenticated admin session */
  adminPage: Page;
};

export const test = base.extend<AuthFixtures>({
  userPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    await loginAsUser(context);
    const page = await context.newPage();
    await use(page);
    await context.close();
  },

  adminPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    await loginAsAdmin(context);
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

export { expect } from "@playwright/test";
