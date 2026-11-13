// Opens the SQLite database and brings the schema up to date.
// Shared by the Next.js app (src/cms/db.ts) and scripts/admin.mjs.
import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { MIGRATIONS } from "./migrations.mjs";

export function resolveDataDir() {
  return path.resolve(/*turbopackIgnore: true*/ process.env.DATA_DIR || path.join(process.cwd(), "data"));
}

export function migrate(db) {
  for (const m of MIGRATIONS) {
    // IMMEDIATE takes the write lock up front, so parallel build workers
    // queue here instead of racing to apply the same migration.
    db.transaction(() => {
      if (db.pragma("user_version", { simple: true }) >= m.version) return;
      db.exec(m.sql);
      db.pragma(`user_version = ${m.version}`);
    }).immediate();
  }
}

export function openDatabase(dataDir = resolveDataDir()) {
  fs.mkdirSync(dataDir, { recursive: true });
  const db = new Database(path.join(dataDir, "cms.db"));
  db.pragma("busy_timeout = 10000");
  db.pragma("journal_mode = WAL");
  db.pragma("synchronous = NORMAL");
  db.pragma("foreign_keys = ON");
  migrate(db);
  return db;
}
