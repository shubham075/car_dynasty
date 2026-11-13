import "server-only";
import { getDb } from "./db";
import { withDefaults } from "./fields";
import { SECTIONS, type SectionKey, type SectionValue } from "./schema";

/** Stored values merged over defaults, so a new field never comes back undefined. */
export function getSection<K extends SectionKey>(key: K): SectionValue<K> {
  const row = getDb().prepare("SELECT value FROM settings WHERE key = ?").get(key) as { value: string } | undefined;
  let stored: unknown = null;
  try {
    stored = row ? JSON.parse(row.value) : null;
  } catch {
    stored = null;
  }
  return withDefaults(SECTIONS[key].defaults, stored) as SectionValue<K>;
}

export function saveSection(key: SectionKey, value: unknown) {
  getDb()
    .prepare("INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at")
    .run(key, JSON.stringify(value), new Date().toISOString());
}
