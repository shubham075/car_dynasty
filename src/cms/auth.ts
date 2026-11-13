import "server-only";
import crypto from "node:crypto";
import { cache } from "react";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getDb, nowIso } from "./db";
import { ipHash, rateLimit, clearRateLimit } from "./rate-limit";
import { hashPassword, verifyPassword } from "./core/password.mjs";

export const SESSION_COOKIE = "cd_session";
const SESSION_DAYS = 14;
const TOUCH_EVERY_MS = 10 * 60 * 1000;

export interface AdminUser {
  id: number;
  email: string;
  name: string;
}

// The cookie holds a random token; the DB stores only its SHA-256, so a leaked
// database can't be replayed as live sessions.
const tokenId = (token: string) => crypto.createHash("sha256").update(token).digest("hex");

// Verifying against a fixed dummy hash when the email is unknown keeps response
// time the same, so login can't be used to probe which emails exist.
let dummyHash: Promise<string> | null = null;
const getDummyHash = () => (dummyHash ??= hashPassword(crypto.randomBytes(16).toString("hex")));

export type LoginResult = { ok: true } | { ok: false; message: string };

export async function login(emailRaw: string, password: string): Promise<LoginResult> {
  const email = emailRaw.trim().toLowerCase();
  const h = await headers();
  const ip = ipHash(h);

  const ipLimit = rateLimit(`login:ip:${ip}`, 10, 15 * 60);
  const emailLimit = rateLimit(`login:email:${email}`, 5, 15 * 60);
  if (!ipLimit.ok || !emailLimit.ok) {
    const mins = Math.ceil(Math.max(ipLimit.retryAfter, emailLimit.retryAfter) / 60);
    return { ok: false, message: `Too many attempts. Try again in ${mins} minute${mins === 1 ? "" : "s"}.` };
  }

  const db = getDb();
  const user = db.prepare("SELECT id, password_hash FROM users WHERE email = ?").get(email) as
    | { id: number; password_hash: string }
    | undefined;
  const valid = await verifyPassword(password, user?.password_hash ?? (await getDummyHash()));
  if (!user || !valid) return { ok: false, message: "Incorrect email or password." };

  clearRateLimit(`login:email:${email}`);

  const token = crypto.randomBytes(32).toString("base64url");
  const now = new Date();
  const expires = new Date(now.getTime() + SESSION_DAYS * 86_400_000);
  db.transaction(() => {
    db.prepare(
      "INSERT INTO sessions (id, user_id, created_at, expires_at, last_seen_at, ip_hash, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?)",
    ).run(tokenId(token), user.id, now.toISOString(), expires.toISOString(), now.toISOString(), ip, (h.get("user-agent") ?? "").slice(0, 300));
    db.prepare("UPDATE users SET last_login_at = ? WHERE id = ?").run(now.toISOString(), user.id);
    db.prepare("DELETE FROM sessions WHERE expires_at < ?").run(now.toISOString());
  })();

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  });
  return { ok: true };
}

/** The signed-in admin for this request, or null. Deduplicated per render. */
export const getCurrentUser = cache(async (): Promise<AdminUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const db = getDb();
  const row = db
    .prepare(
      `SELECT s.id AS sid, s.expires_at, s.last_seen_at, u.id, u.email, u.name
         FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.id = ?`,
    )
    .get(tokenId(token)) as
    | { sid: string; expires_at: string; last_seen_at: string; id: number; email: string; name: string }
    | undefined;
  if (!row) return null;
  if (row.expires_at <= nowIso()) {
    db.prepare("DELETE FROM sessions WHERE id = ?").run(row.sid);
    return null;
  }
  if (Date.now() - Date.parse(row.last_seen_at) > TOUCH_EVERY_MS) {
    db.prepare("UPDATE sessions SET last_seen_at = ? WHERE id = ?").run(nowIso(), row.sid);
  }
  return { id: row.id, email: row.email, name: row.name };
});

/** Use in admin pages, layouts and every admin Server Action / Route Handler. */
export async function requireUser(): Promise<AdminUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return user;
}

export async function logout(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) getDb().prepare("DELETE FROM sessions WHERE id = ?").run(tokenId(token));
  store.delete(SESSION_COOKIE);
}

/** Only same-site admin paths are allowed as post-login destinations. */
export function safeNext(next: unknown): string {
  if (typeof next !== "string" || !next.startsWith("/admin") || next.startsWith("/admin/login")) return "/admin";
  if (next.includes("//") || next.includes("\\")) return "/admin";
  return next;
}
