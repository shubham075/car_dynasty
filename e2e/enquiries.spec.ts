import crypto from "node:crypto";
import { expect, test, type APIRequestContext, type Page } from "@playwright/test";
import { freshIp, signInAsAdmin } from "./helpers";

const runTag = `zz${crypto.randomBytes(3).toString("hex")}`;

/** Submits through the real public endpoint, like a visitor would. */
async function submitEnquiry(request: APIRequestContext, overrides: Record<string, unknown> = {}) {
  const res = await request.post("/api/enquiry", {
    headers: { "x-forwarded-for": `10.77.${crypto.randomInt(255)}.${crypto.randomInt(1, 255)}` },
    data: {
      name: `Test Visitor ${runTag}`,
      contact: "9876543210",
      location: "Bhopal",
      shootType: "Car review",
      vehicleOrBrand: "Tata Nexon",
      details: "Please review my car",
      email: "visitor@example.test",
      source: { cta: "hero", ref: "", page: "/" },
      ...overrides,
    },
  });
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.ok).toBe(true);
  return body.reference as string;
}

async function openEnquiry(page: Page, name: string) {
  await page.goto(`/admin/enquiries?q=${encodeURIComponent(name)}`);
  await page.getByRole("link", { name }).click();
  await expect(page.getByRole("heading", { name })).toBeVisible();
}

test.beforeEach(async ({ page }) => freshIp(page));

test("enquiries list requires sign-in", async ({ page }) => {
  await page.goto("/admin/enquiries");
  await expect(page).toHaveURL(/\/admin\/login\?next=%2Fadmin%2Fenquiries$/);
});

test("a website enquiry shows up in the list as New", async ({ page, request }) => {
  const name = `List Check ${runTag}`;
  const reference = await submitEnquiry(request, { name });
  await signInAsAdmin(page);
  await page.goto(`/admin/enquiries?q=${encodeURIComponent(name)}`);
  const row = page.getByTestId("enquiry-row");
  await expect(row).toHaveCount(1);
  await expect(row).toContainText(reference);
  await expect(row.getByTestId("status-badge")).toHaveText("New");
  await expect(page.getByRole("navigation", { name: "Admin" })).toContainText("Enquiries");
});

test("status, follow-up and quote are saved and logged in the timeline", async ({ page, request }) => {
  const name = `Manage Check ${runTag}`;
  await submitEnquiry(request, { name });
  await signInAsAdmin(page);
  await openEnquiry(page, name);

  await page.getByLabel("Status").selectOption("quoted");
  await page.getByLabel("Follow-up date").fill("2030-01-15");
  await page.getByLabel("Quote (₹)").fill("25,000");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("status")).toHaveText("Saved.");

  await page.reload();
  await expect(page.getByLabel("Status")).toHaveValue("quoted");
  await expect(page.getByLabel("Follow-up date")).toHaveValue("2030-01-15");
  await expect(page.getByLabel("Quote (₹)")).toHaveValue("25000");
  const timeline = page.getByTestId("timeline");
  await expect(timeline).toContainText("Status changed: new → quoted");
  await expect(timeline).toContainText("Follow-up set for 2030-01-15");
  await expect(timeline).toContainText("Quote set to ₹25,000");

  await page.goto(`/admin/enquiries?status=quoted&q=${encodeURIComponent(name)}`);
  await expect(page.getByTestId("enquiry-row")).toHaveCount(1);
  await page.goto(`/admin/enquiries?status=new&q=${encodeURIComponent(name)}`);
  await expect(page.getByText("No enquiries match these filters.")).toBeVisible();
});

test("an invalid quote is rejected without saving", async ({ page, request }) => {
  const name = `Invalid Quote ${runTag}`;
  await submitEnquiry(request, { name });
  await signInAsAdmin(page);
  await openEnquiry(page, name);
  await page.getByLabel("Quote (₹)").fill("lots");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.locator("form").getByRole("alert")).toHaveText("Quote must be a number");
  await page.reload();
  await expect(page.getByTestId("timeline")).not.toContainText("Quote set");
});

test("notes are added to the timeline and starring works", async ({ page, request }) => {
  const name = `Notes Check ${runTag}`;
  await submitEnquiry(request, { name });
  await signInAsAdmin(page);
  await openEnquiry(page, name);

  const note = page.getByLabel("Add a note");
  await note.fill("Called back, sending the rate card.");
  await page.getByRole("button", { name: "Add note" }).click();
  await expect(page.getByTestId("timeline")).toContainText("Called back, sending the rate card.");
  await expect(note).toHaveValue("");

  await page.getByRole("button", { name: "Star", exact: true }).click();
  await expect(page.getByRole("button", { name: "Starred" })).toHaveAttribute("aria-pressed", "true");
  await page.goto(`/admin/enquiries?starred=1&q=${encodeURIComponent(name)}`);
  await expect(page.getByTestId("enquiry-row")).toHaveCount(1);
});

test("CSV export follows the filter, neutralises formulas, and needs a session", async ({ page, request, playwright, baseURL }) => {
  const name = `Csv Check ${runTag}`;
  await submitEnquiry(request, { name, details: '=HYPERLINK("http://evil.example","click")' });
  await signInAsAdmin(page);

  const res = await page.request.get(`/admin/enquiries/export?q=${encodeURIComponent(name)}`);
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("text/csv");
  const lines = (await res.text()).replace(/^﻿/, "").trim().split("\r\n");
  expect(lines).toHaveLength(2);
  expect(lines[0]).toMatch(/^Reference,/);
  expect(lines[1]).toContain(name);
  expect(lines[1]).toContain(`"'=HYPERLINK(""http://evil.example"",""click"")"`);

  // No cookie: the proxy bounces to the login page before the route runs.
  const anon = await playwright.request.newContext({ baseURL });
  const bounced = await anon.get("/admin/enquiries/export", { maxRedirects: 0 });
  expect(bounced.status()).toBe(307);
  expect(bounced.headers()["location"]).toContain("/admin/login");
  await anon.dispose();

  // Forged cookie gets past the proxy; the route's own session check must refuse it.
  const forged = await playwright.request.newContext({
    baseURL,
    extraHTTPHeaders: { cookie: "cd_session=forged-token-value" },
  });
  const refused = await forged.get("/admin/enquiries/export", { maxRedirects: 0 });
  expect(refused.status()).toBe(401);
  expect(await refused.text()).not.toContain(name);
  await forged.dispose();
});

test("delete asks for confirmation, then removes the enquiry", async ({ page, request }) => {
  const name = `Delete Check ${runTag}`;
  await submitEnquiry(request, { name });
  await signInAsAdmin(page);
  await openEnquiry(page, name);
  const detailUrl = page.url();

  page.once("dialog", (d) => d.dismiss());
  await page.getByRole("button", { name: "Delete enquiry" }).click();
  await expect(page).toHaveURL(detailUrl);

  page.once("dialog", (d) => d.accept());
  await page.getByRole("button", { name: "Delete enquiry" }).click();
  await expect(page).toHaveURL(/\/admin\/enquiries\?deleted=1$/);
  await expect(page.getByRole("status")).toHaveText("Enquiry deleted.");

  const res = await page.goto(detailUrl);
  expect(res?.status()).toBe(404);
});
