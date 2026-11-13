import crypto from "node:crypto";
import { expect, test } from "@playwright/test";
import { freshIp, signIn } from "./helpers";

test.beforeEach(async ({ page }) => freshIp(page));

test("security headers are sent on public and admin pages", async ({ request }) => {
  const home = await request.get("/");
  const h = home.headers();
  expect(h["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(h["content-security-policy"]).toContain("object-src 'none'");
  expect(h["x-frame-options"]).toBe("DENY");
  expect(h["x-content-type-options"]).toBe("nosniff");
  expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(h["strict-transport-security"]).toContain("max-age=");
  expect(h["x-powered-by"]).toBeUndefined();

  const admin = await request.get("/admin/login");
  expect(admin.headers()["cache-control"]).toContain("no-store");
});

test("CSP doesn't block anything on the home page or a project page", async ({ page }) => {
  const violations: string[] = [];
  page.on("console", (m) => {
    if (/Content Security Policy|Refused to/i.test(m.text())) violations.push(m.text());
  });

  await page.goto("/");
  const projectHref = await page.locator('a[href^="/projects/"]').first().getAttribute("href");
  expect(projectHref).toBeTruthy();
  await page.goto(projectHref!);
  await page.waitForLoadState("networkidle");
  expect(violations).toEqual([]);
});

test("forged left-hand X-Forwarded-For entries don't dodge the per-IP login limit", async ({ page }) => {
  // The proxy-appended (right-most) address stays fixed; the attacker rotates the rest.
  const realIp = `10.250.${crypto.randomInt(255)}.${crypto.randomInt(1, 255)}`;
  for (let i = 0; i < 10; i++) {
    await page.setExtraHTTPHeaders({ "x-forwarded-for": `203.0.113.${i}, ${realIp}` });
    await signIn(page, `spray-${i}@example.test`, "wrong-password-xx");
    await expect(page.locator("form").getByRole("alert")).toHaveText("Incorrect email or password.");
  }
  await page.setExtraHTTPHeaders({ "x-forwarded-for": `198.51.100.77, ${realIp}` });
  await signIn(page, "spray-final@example.test", "wrong-password-xx");
  await expect(page.locator("form").getByRole("alert")).toContainText("Too many attempts");
});
