import "server-only";
import crypto from "node:crypto";
import { getDb } from "./db";

/** Fixed-window counter stored in SQLite, so limits survive restarts. */
export function rateLimit(key: string, limit: number, windowSec: number): { ok: boolean; retryAfter: number } {
  const db = getDb();
  const now = Date.now();
  return db.transaction(() => {
    const row = db.prepare("SELECT count, reset_at FROM rate_limits WHERE key = ?").get(key) as { count: number; reset_at: number } | undefined;
    if (!row || row.reset_at <= now) {
      db.prepare("INSERT OR REPLACE INTO rate_limits (key, count, reset_at) VALUES (?, 1, ?)").run(key, now + windowSec * 1000);
      return { ok: true, retryAfter: 0 };
    }
    if (row.count >= limit) return { ok: false, retryAfter: Math.ceil((row.reset_at - now) / 1000) };
    db.prepare("UPDATE rate_limits SET count = count + 1 WHERE key = ?").run(key);
    return { ok: true, retryAfter: 0 };
  }).immediate();
}

export function clearRateLimit(key: string) {
  getDb().prepare("DELETE FROM rate_limits WHERE key = ?").run(key);
}

export function pruneRateLimits() {
  getDb().prepare("DELETE FROM rate_limits WHERE reset_at < ?").run(Date.now());
}

/** Visitors' IPs are never stored — only a salted hash, enough for abuse limits. */
export function ipHash(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = fwd || headers.get("x-real-ip") || "unknown";
  const salt = (getDb().prepare("SELECT value FROM meta WHERE key = 'ip_salt'").get() as { value: string } | undefined)?.value ?? "";
  return crypto.createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}
