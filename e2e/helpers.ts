import crypto from "node:crypto";
import path from "node:path";
import Database from "better-sqlite3";
import type { Page } from "@playwright/test";

// Throwaway credentials for the isolated e2e database only.
export const ADMIN = { email: "e2e-admin@example.test", name: "E2E Admin", password: "e2e-Correct-Horse-42" };

export const openTestDb = () => new Database(path.join("data-e2e", "cms.db"));

/** Each test gets its own client IP so per-IP login limits don't leak between tests. */
export async function freshIp(page: Page) {
  const ip = `10.${crypto.randomInt(255)}.${crypto.randomInt(255)}.${crypto.randomInt(1, 255)}`;
  await page.setExtraHTTPHeaders({ "x-forwarded-for": ip });
}

/** Signs in as the e2e admin and waits until the session cookie is set (dashboard loaded). */
export async function signInAsAdmin(page: Page) {
  await signIn(page);
  await page.waitForURL(/\/admin$/);
}

export async function signIn(page: Page, email = ADMIN.email, password = ADMIN.password) {
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
}
