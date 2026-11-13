// Password hashing with Node's built-in scrypt (no native add-on needed).
// Stored format: scrypt$N$r$p$salt$hash  — parameters travel with the hash,
// so they can be raised later without invalidating existing passwords.
import crypto from "node:crypto";

const N = 2 ** 16;
const R = 8;
const P = 1;
const KEY_LEN = 64;

function scrypt(password, salt, n, r, p) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(
      password.normalize("NFKC"),
      salt,
      KEY_LEN,
      { N: n, r, p, maxmem: 256 * n * r },
      (err, key) => (err ? reject(err) : resolve(key)),
    );
  });
}

export async function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const key = await scrypt(password, salt, N, R, P);
  return ["scrypt", N, R, P, salt.toString("base64"), key.toString("base64")].join("$");
}

export async function verifyPassword(password, stored) {
  const parts = String(stored).split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const [, n, r, p, saltB64, hashB64] = parts;
  const expected = Buffer.from(hashB64, "base64");
  const actual = await scrypt(password, Buffer.from(saltB64, "base64"), Number(n), Number(r), Number(p));
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

/** Returns an error message, or null when the password is acceptable. */
export function checkPasswordStrength(password, email = "") {
  if (typeof password !== "string" || password.length < 10) return "Use at least 10 characters.";
  if (password.length > 200) return "Password is too long.";
  if (/^(.)\1+$/.test(password)) return "Password is too repetitive.";
  if (email && password.toLowerCase() === email.toLowerCase()) return "Password must differ from the email.";
  return null;
}
