import { execFileSync } from "node:child_process";
import path from "node:path";
import { ADMIN, openTestDb } from "./helpers";

// Creates the e2e admin in the isolated DB. The server opens the same file, and
// the CLI runs migrations itself, so ordering against server start doesn't matter.
export default function globalSetup() {
  const env = { ...process.env, DATA_DIR: "data-e2e", ADMIN_PASSWORD: ADMIN.password };
  const script = path.join("scripts", "admin.mjs");
  execFileSync(process.execPath, [script, "delete", ADMIN.email], { env, stdio: "ignore" });
  execFileSync(process.execPath, [script, "create", ADMIN.email, ADMIN.name], { env, stdio: "inherit" });
  // Rate-limit counters and sessions survive between runs; start every run clean.
  const db = openTestDb();
  db.exec("DELETE FROM rate_limits; DELETE FROM sessions;");
  db.close();
}
