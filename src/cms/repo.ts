import type Database from "better-sqlite3";
import type { Field } from "./fields";
import type { ResourceDef } from "./schema";

// Generic CRUD for the collection tables. Table and column names only ever come
// from the static definitions in schema.ts (never from user input).

export type Db = Database.Database;
export type Row = Record<string, unknown> & { id: number; sort: number; createdAt: string; updatedAt: string };

const snake = (s: string) => s.replace(/[A-Z]/g, (m) => "_" + m.toLowerCase());
const camel = (s: string) => s.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
const isJson = (f: Field) => f.kind === "list" || f.kind === "items" || f.kind === "group";

function toDb(f: Field, v: unknown): unknown {
  if (f.kind === "boolean") return v ? 1 : 0;
  if (isJson(f)) return JSON.stringify(v ?? (f.kind === "group" ? {} : []));
  if (f.kind === "category") return v ?? null;
  return v ?? "";
}

function fromDb(f: Field, raw: unknown): unknown {
  if (f.kind === "boolean") return Boolean(raw);
  if (isJson(f)) {
    try {
      return JSON.parse(String(raw));
    } catch {
      return f.kind === "group" ? {} : [];
    }
  }
  return raw;
}

function mapRow(def: ResourceDef, r: Record<string, unknown>): Row {
  const out: Record<string, unknown> = {
    id: r.id,
    sort: r.sort,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
  for (const f of def.fields) out[f.name] = fromDb(f, r[snake(f.name)]);
  return out as Row;
}

export function listRows(db: Db, def: ResourceDef, opts: { onlyPublished?: boolean } = {}): Row[] {
  const where = opts.onlyPublished ? "WHERE published = 1" : "";
  const rows = db.prepare(`SELECT * FROM ${def.table} ${where} ORDER BY sort, id`).all() as Record<string, unknown>[];
  return rows.map((r) => mapRow(def, r));
}

export function getRow(db: Db, def: ResourceDef, id: number): Row | null {
  const r = db.prepare(`SELECT * FROM ${def.table} WHERE id = ?`).get(id) as Record<string, unknown> | undefined;
  return r ? mapRow(def, r) : null;
}

export function insertRow(db: Db, def: ResourceDef, values: Record<string, unknown>): number {
  const now = new Date().toISOString();
  const cols = def.fields.map((f) => snake(f.name));
  const sort = (db.prepare(`SELECT COALESCE(MAX(sort), 0) + 1 AS n FROM ${def.table}`).get() as { n: number }).n;
  const sql = `INSERT INTO ${def.table} (${[...cols, "sort", "created_at", "updated_at"].join(", ")}) VALUES (${[...cols, "sort", "created_at", "updated_at"].map(() => "?").join(", ")})`;
  const res = db.prepare(sql).run(...def.fields.map((f) => toDb(f, values[f.name])), sort, now, now);
  return Number(res.lastInsertRowid);
}

export function updateRow(db: Db, def: ResourceDef, id: number, values: Record<string, unknown>): boolean {
  const sets = [...def.fields.map((f) => `${snake(f.name)} = ?`), "updated_at = ?"].join(", ");
  const res = db.prepare(`UPDATE ${def.table} SET ${sets} WHERE id = ?`).run(...def.fields.map((f) => toDb(f, values[f.name])), new Date().toISOString(), id);
  return res.changes > 0;
}

export function deleteRow(db: Db, def: ResourceDef, id: number): boolean {
  return db.prepare(`DELETE FROM ${def.table} WHERE id = ?`).run(id).changes > 0;
}

export function setPublished(db: Db, def: ResourceDef, id: number, value: boolean) {
  db.prepare(`UPDATE ${def.table} SET published = ?, updated_at = ? WHERE id = ?`).run(value ? 1 : 0, new Date().toISOString(), id);
}

/** Move a row one place up or down, then renumber so `sort` stays gap-free. */
export function moveRow(db: Db, def: ResourceDef, id: number, dir: "up" | "down") {
  db.transaction(() => {
    const ids = (db.prepare(`SELECT id FROM ${def.table} ORDER BY sort, id`).all() as { id: number }[]).map((r) => r.id);
    const i = ids.indexOf(id);
    const j = dir === "up" ? i - 1 : i + 1;
    if (i < 0 || j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    const upd = db.prepare(`UPDATE ${def.table} SET sort = ? WHERE id = ?`);
    ids.forEach((rid, idx) => upd.run(idx + 1, rid));
  })();
}

export function isUniqueViolation(e: unknown): boolean {
  return typeof e === "object" && e !== null && (e as { code?: string }).code === "SQLITE_CONSTRAINT_UNIQUE";
}

export { camel };
