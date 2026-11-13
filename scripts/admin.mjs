#!/usr/bin/env node
// Admin user management.
//   npm run admin -- create <email> [name]     (prompts for password, or uses ADMIN_PASSWORD)
//   npm run admin -- passwd <email>            (reset password; signs out all sessions)
//   npm run admin -- list
//   npm run admin -- delete <email>
import readline from "node:readline";
import { openDatabase } from "../src/cms/core/db.mjs";
import { checkPasswordStrength, hashPassword } from "../src/cms/core/password.mjs";

const [cmd, emailArg, ...rest] = process.argv.slice(2);
const email = emailArg?.trim().toLowerCase();

function askHidden(question) {
  if (process.env.ADMIN_PASSWORD) return Promise.resolve(process.env.ADMIN_PASSWORD);
  if (!process.stdin.isTTY) {
    console.error("No TTY: set ADMIN_PASSWORD to pass the password.");
    process.exit(1);
  }
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = (s) => rl.output.write(s.includes(question) ? s : "");
    rl.question(question, (answer) => {
      rl.close();
      process.stdout.write("\n");
      resolve(answer);
    });
  });
}

async function newPassword() {
  const pw = await askHidden("Password: ");
  const problem = checkPasswordStrength(pw, email);
  if (problem) {
    console.error(problem);
    process.exit(1);
  }
  if (!process.env.ADMIN_PASSWORD && (await askHidden("Repeat password: ")) !== pw) {
    console.error("Passwords do not match.");
    process.exit(1);
  }
  return hashPassword(pw);
}

const usage = () => {
  console.log("Usage: npm run admin -- <create|passwd|delete> <email> [name]  |  npm run admin -- list");
  process.exit(1);
};

const db = openDatabase();
const now = new Date().toISOString();

switch (cmd) {
  case "create": {
    if (!email?.includes("@")) usage();
    if (db.prepare("SELECT 1 FROM users WHERE email = ?").get(email)) {
      console.error(`User ${email} already exists. Use "passwd" to reset the password.`);
      process.exit(1);
    }
    const hash = await newPassword();
    db.prepare("INSERT INTO users (email, name, password_hash, created_at) VALUES (?, ?, ?, ?)").run(email, rest.join(" "), hash, now);
    console.log(`Created admin ${email}.`);
    break;
  }
  case "passwd": {
    if (!email) usage();
    const user = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
    if (!user) {
      console.error(`No user ${email}.`);
      process.exit(1);
    }
    const hash = await newPassword();
    db.transaction(() => {
      db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(hash, user.id);
      db.prepare("DELETE FROM sessions WHERE user_id = ?").run(user.id);
    })();
    console.log(`Password updated for ${email}; existing sessions signed out.`);
    break;
  }
  case "delete": {
    if (!email) usage();
    const r = db.prepare("DELETE FROM users WHERE email = ?").run(email);
    console.log(r.changes ? `Deleted ${email}.` : `No user ${email}.`);
    break;
  }
  case "list": {
    const rows = db.prepare("SELECT email, name, created_at, last_login_at FROM users ORDER BY id").all();
    if (!rows.length) console.log("No admin users.");
    for (const r of rows) console.log(`${r.email}\t${r.name || "-"}\tcreated ${r.created_at}\tlast login ${r.last_login_at ?? "never"}`);
    break;
  }
  default:
    usage();
}
db.close();
