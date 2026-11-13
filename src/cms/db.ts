import "server-only";
import type { Db } from "./repo";
import { openDatabase } from "./core/db.mjs";
import { seedIfEmpty } from "./seed";

// One connection per process. Cached on globalThis so dev hot-reloads don't leak handles.
const g = globalThis as unknown as { __cmsDb?: Db };

export function getDb(): Db {
  if (!g.__cmsDb) {
    const db = openDatabase() as Db;
    seedIfEmpty(db);
    g.__cmsDb = db;
  }
  return g.__cmsDb;
}

export const nowIso = () => new Date().toISOString();
