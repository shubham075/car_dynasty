#!/usr/bin/env node
// Consistent copy of the live SQLite database using SQLite's online backup API
// (safe while the site is running — unlike copying cms.db with cp).
//   node scripts/backup-db.mjs [output-file]
// Default output: <DATA_DIR>/backups/cms-<UTC timestamp>.db
import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { resolveDataDir } from "../src/cms/core/db.mjs";

const dataDir = resolveDataDir();
const source = path.join(dataDir, "cms.db");
if (!fs.existsSync(source)) {
  console.error(`No database at ${source}`);
  process.exit(1);
}

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const out = path.resolve(process.argv[2] ?? path.join(dataDir, "backups", `cms-${stamp}.db`));
fs.mkdirSync(path.dirname(out), { recursive: true });

const db = new Database(source, { readonly: true, fileMustExist: true });
db.pragma("busy_timeout = 10000");
await db.backup(out);
db.close();

// Prove the copy is usable before anyone relies on it.
const check = new Database(out, { readonly: true });
const ok = check.pragma("integrity_check", { simple: true });
const enquiries = check.prepare("SELECT COUNT(*) AS n FROM enquiries").get().n;
check.close();
if (ok !== "ok") {
  console.error(`Backup failed integrity check: ${ok}`);
  process.exit(1);
}
console.log(`${out}\t${fs.statSync(out).size} bytes\t${enquiries} enquiries`);
