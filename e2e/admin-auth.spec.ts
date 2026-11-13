import { expect, test } from "@playwright/test";
import { ADMIN, freshIp, openTestDb, signIn } from "./helpers";

test.beforeEach(async ({ page }) => freshIp(page));

test("public site still renders", async ({ page }) => {
  const res = await page.goto("/");
  expect(res?.status()).toBe(200);
});

test("unauthenticated /admin redirects to login", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login$/);
  await expect(page.getByRole("heading", { name: "Admin sign in" })).toBeVisible();
});

test("deep admin link keeps the destination in ?next", async ({ page }) => {
  await page.goto("/admin/enquiries?status=new");
  const url = new URL(page.url());
  expect(url.pathname).toBe("/admin/login");
  expect(url.searchParams.get("next")).toBe("/admin/enquiries?status=new");
});

test("wrong password shows a generic error and sets no session", async ({ page, context }) => {
  await signIn(page, ADMIN.email, "definitely-wrong-pw");
  await expect(page.locator("form").getByRole("alert")).toHaveText("Incorrect email or password.");
  await expect(page).toHaveURL(/\/admin\/login/);
  expect((await context.cookies()).find((c) => c.name === "cd_session")).toBeUndefined();
});

test("unknown email gets the same error as a wrong password", async ({ page }) => {
  await signIn(page, "nobody@example.test", "whatever-password");
  await expect(page.locator("form").getByRole("alert")).toHaveText("Incorrect email or password.");
});

test("empty submit is rejected", async ({ page }) => {
  await page.goto("/admin/login");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.locator("form").getByRole("alert")).toHaveText("Enter your email and password.");
});

test("login → dashboard → persists on reload → logout", async ({ page, context }) => {
  await signIn(page);
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByTestId("admin-user")).toHaveText(ADMIN.email);
  await expect(page.getByRole("heading", { name: `Welcome, ${ADMIN.name}` })).toBeVisible();

  const cookie = (await context.cookies()).find((c) => c.name === "cd_session");
  expect(cookie).toBeDefined();
  expect(cookie!.httpOnly).toBe(true);
  expect(cookie!.sameSite).toBe("Lax");

  await page.reload();
  await expect(page.getByTestId("admin-user")).toHaveText(ADMIN.email);

  // Visiting login while signed in goes straight to the dashboard.
  await page.goto("/admin/login");
  await expect(page).toHaveURL(/\/admin$/);

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/admin\/login$/);
  expect((await context.cookies()).find((c) => c.name === "cd_session")).toBeUndefined();

  // The old token is dead server-side, even if replayed.
  await context.addCookies([{ ...cookie! }]);
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login$/);
});

test("forged session cookie is rejected", async ({ page, context, baseURL }) => {
  await context.addCookies([{ name: "cd_session", value: "forged-token-value", url: baseURL! }]);
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login$/);
  await expect(page.getByRole("heading", { name: "Admin sign in" })).toBeVisible();
});

test("expired session is rejected", async ({ page }) => {
  await signIn(page);
  await expect(page).toHaveURL(/\/admin$/);
  const db = openTestDb();
  db.prepare("UPDATE sessions SET expires_at = '2000-01-01T00:00:00.000Z'").run();
  db.close();
  await page.reload();
  await expect(page).toHaveURL(/\/admin\/login$/);
});

test("?next sends you back after login, but never off-site", async ({ page }) => {
  await page.goto("/admin/login?next=/admin?tab=x");
  await page.getByLabel("Email").fill(ADMIN.email);
  await page.getByLabel("Password").fill(ADMIN.password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/admin\?tab=x$/);

  await page.getByRole("button", { name: "Sign out" }).click();
  for (const evil of ["https://evil.example", "//evil.example", "/admin//evil.example", "/\\evil.example"]) {
    await page.goto(`/admin/login?next=${encodeURIComponent(evil)}`);
    await page.getByLabel("Email").fill(ADMIN.email);
    await page.getByLabel("Password").fill(ADMIN.password);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/localhost:\d+\/admin$/);
    await page.getByRole("button", { name: "Sign out" }).click();
    await freshIp(page);
  }
});

test("brute force on one account is rate limited", async ({ page }) => {
  const target = "ratelimit@example.test";
  for (let i = 0; i < 5; i++) {
    await signIn(page, target, `wrong-password-${i}`);
    await expect(page.locator("form").getByRole("alert")).toHaveText("Incorrect email or password.");
  }
  await signIn(page, target, "wrong-password-final");
  await expect(page.locator("form").getByRole("alert")).toContainText("Too many attempts");
});
