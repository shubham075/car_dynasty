import "server-only";
import crypto from "node:crypto";
import { getDb } from "./db";
import type { EnquirySubmission } from "./enquiry-schema";
import { STATUS_VALUES, type EnquiryStatus } from "./enquiry-constants";

export interface Enquiry {
  id: number;
  reference: string;
  status: EnquiryStatus;
  starred: boolean;
  name: string;
  contact: string;
  email: string;
  shootType: string;
  vehicleOrBrand: string;
  location: string;
  details: string;
  shootDate: string;
  budget: string;
  deliverables: string[];
  sourceCta: string;
  sourceRef: string;
  sourcePage: string;
  referrer: string;
  utm: Record<string, string>;
  userAgent: string;
  followUpAt: string | null;
  quoteAmount: number | null;
  emailAlert: string;
  autoReply: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnquiryEvent {
  id: number;
  type: string;
  body: string;
  createdAt: string;
}

type Raw = Record<string, unknown>;

function parseJson<T>(raw: unknown, fallback: T): T {
  try {
    return JSON.parse(String(raw)) as T;
  } catch {
    return fallback;
  }
}

function mapEnquiry(r: Raw): Enquiry {
  return {
    id: r.id as number,
    reference: r.reference as string,
    status: r.status as EnquiryStatus,
    starred: Boolean(r.starred),
    name: r.name as string,
    contact: r.contact as string,
    email: r.email as string,
    shootType: r.shoot_type as string,
    vehicleOrBrand: r.vehicle_or_brand as string,
    location: r.location as string,
    details: r.details as string,
    shootDate: r.shoot_date as string,
    budget: r.budget as string,
    deliverables: parseJson<string[]>(r.deliverables, []),
    sourceCta: r.source_cta as string,
    sourceRef: r.source_ref as string,
    sourcePage: r.source_page as string,
    referrer: r.referrer as string,
    utm: parseJson<Record<string, string>>(r.utm, {}),
    userAgent: r.user_agent as string,
    followUpAt: (r.follow_up_at as string | null) ?? null,
    quoteAmount: (r.quote_amount as number | null) ?? null,
    emailAlert: r.email_alert as string,
    autoReply: r.auto_reply as string,
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  };
}

// 4 unambiguous characters → 1M+ combinations per month.
const REF_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
function makeReference(): string {
  const d = new Date();
  const yymm = `${String(d.getUTCFullYear()).slice(2)}${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
  const bytes = crypto.randomBytes(4);
  const tail = Array.from(bytes, (b) => REF_ALPHABET[b % REF_ALPHABET.length]).join("");
  return `CD-${yymm}-${tail}`;
}

export function createEnquiry(input: EnquirySubmission, meta: { ipHash: string; userAgent: string }): { id: number; reference: string } {
  const db = getDb();
  const now = new Date().toISOString();
  for (let attempt = 0; attempt < 5; attempt++) {
    const reference = makeReference();
    try {
      return db.transaction(() => {
        const res = db
          .prepare(
            `INSERT INTO enquiries (reference, name, contact, email, shoot_type, vehicle_or_brand, location, details, shoot_date, budget, deliverables,
               source_cta, source_ref, source_page, referrer, utm, ip_hash, user_agent, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          )
          .run(
            reference, input.name, input.contact, input.email, input.shootType, input.vehicleOrBrand, input.location, input.details,
            input.shootDate, input.budget, JSON.stringify(input.deliverables), input.source.cta, input.source.ref, input.source.page,
            input.referrer, JSON.stringify(input.utm), meta.ipHash, meta.userAgent.slice(0, 300), now, now,
          );
        const id = Number(res.lastInsertRowid);
        db.prepare("INSERT INTO enquiry_events (enquiry_id, type, body, created_at) VALUES (?, 'created', 'Enquiry received from the website form', ?)").run(id, now);
        return { id, reference };
      })();
    } catch (e) {
      if ((e as { code?: string }).code !== "SQLITE_CONSTRAINT_UNIQUE") throw e;
    }
  }
  throw new Error("Could not allocate an enquiry reference");
}

/** A visitor double-clicking "send" should not create two records. */
export function findRecentDuplicate(contact: string, name: string, withinMinutes = 10): { reference: string } | null {
  const since = new Date(Date.now() - withinMinutes * 60_000).toISOString();
  const row = getDb()
    .prepare("SELECT reference FROM enquiries WHERE contact = ? AND name = ? AND created_at > ? ORDER BY id DESC LIMIT 1")
    .get(contact, name, since) as { reference: string } | undefined;
  return row ?? null;
}

export function getEnquiry(id: number): Enquiry | null {
  const r = getDb().prepare("SELECT * FROM enquiries WHERE id = ?").get(id) as Raw | undefined;
  return r ? mapEnquiry(r) : null;
}

export function getEvents(enquiryId: number): EnquiryEvent[] {
  return (getDb().prepare("SELECT id, type, body, created_at FROM enquiry_events WHERE enquiry_id = ? ORDER BY created_at DESC, id DESC").all(enquiryId) as Raw[]).map((r) => ({
    id: r.id as number,
    type: r.type as string,
    body: r.body as string,
    createdAt: r.created_at as string,
  }));
}

export function addEvent(enquiryId: number, type: string, body: string, userId: number | null = null) {
  getDb().prepare("INSERT INTO enquiry_events (enquiry_id, type, body, user_id, created_at) VALUES (?, ?, ?, ?, ?)").run(enquiryId, type, body, userId, new Date().toISOString());
}

export interface EnquiryFilter {
  status?: string;
  q?: string;
  type?: string;
  from?: string;
  to?: string;
  starred?: boolean;
  followUp?: boolean;
}

const escapeLike = (s: string) => s.replace(/[\\%_]/g, (m) => "\\" + m);

function where(f: EnquiryFilter): { sql: string; params: unknown[] } {
  const clauses: string[] = [];
  const params: unknown[] = [];
  if (f.status && (STATUS_VALUES as readonly string[]).includes(f.status)) {
    clauses.push("status = ?");
    params.push(f.status);
  }
  if (f.type) {
    clauses.push("shoot_type = ?");
    params.push(f.type);
  }
  if (f.starred) clauses.push("starred = 1");
  if (f.followUp) clauses.push("follow_up_at IS NOT NULL AND follow_up_at <= ? AND status NOT IN ('booked','completed','lost','spam')"), params.push(new Date(Date.now() + 86_400_000).toISOString());
  if (f.from && /^\d{4}-\d{2}-\d{2}$/.test(f.from)) {
    clauses.push("created_at >= ?");
    params.push(new Date(`${f.from}T00:00:00+05:30`).toISOString());
  }
  if (f.to && /^\d{4}-\d{2}-\d{2}$/.test(f.to)) {
    clauses.push("created_at < ?");
    params.push(new Date(new Date(`${f.to}T00:00:00+05:30`).getTime() + 86_400_000).toISOString());
  }
  if (f.q?.trim()) {
    const like = `%${escapeLike(f.q.trim())}%`;
    clauses.push(
      "(" + ["name", "contact", "email", "reference", "vehicle_or_brand", "location", "details"].map((c) => `${c} LIKE ? ESCAPE '\\'`).join(" OR ") + ")",
    );
    params.push(...Array(7).fill(like));
  }
  return { sql: clauses.length ? `WHERE ${clauses.join(" AND ")}` : "", params };
}

export function listEnquiries(f: EnquiryFilter, page = 1, pageSize = 25): { rows: Enquiry[]; total: number; pages: number } {
  const db = getDb();
  const w = where(f);
  const total = (db.prepare(`SELECT COUNT(*) AS n FROM enquiries ${w.sql}`).get(...w.params) as { n: number }).n;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const p = Math.min(Math.max(1, page), pages);
  const rows = (db.prepare(`SELECT * FROM enquiries ${w.sql} ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`).all(...w.params, pageSize, (p - 1) * pageSize) as Raw[]).map(mapEnquiry);
  return { rows, total, pages };
}

/** Every matching row, for CSV export. */
export function allEnquiries(f: EnquiryFilter): Enquiry[] {
  const w = where(f);
  return (getDb().prepare(`SELECT * FROM enquiries ${w.sql} ORDER BY created_at DESC, id DESC`).all(...w.params) as Raw[]).map(mapEnquiry);
}

export function statusCounts(): Record<string, number> {
  const out: Record<string, number> = {};
  for (const r of getDb().prepare("SELECT status, COUNT(*) AS n FROM enquiries GROUP BY status").all() as { status: string; n: number }[]) out[r.status] = r.n;
  return out;
}

export function newEnquiryCount(): number {
  return (getDb().prepare("SELECT COUNT(*) AS n FROM enquiries WHERE status = 'new'").get() as { n: number }).n;
}

export function distinctTypes(): string[] {
  return (getDb().prepare("SELECT DISTINCT shoot_type FROM enquiries WHERE shoot_type <> '' ORDER BY shoot_type").all() as { shoot_type: string }[]).map((r) => r.shoot_type);
}

export interface EnquiryPatch {
  status?: EnquiryStatus;
  followUpAt?: string | null;
  quoteAmount?: number | null;
  starred?: boolean;
}

export function updateEnquiry(id: number, patch: EnquiryPatch, userId: number | null) {
  const db = getDb();
  db.transaction(() => {
    const cur = db.prepare("SELECT status, follow_up_at, quote_amount FROM enquiries WHERE id = ?").get(id) as { status: string; follow_up_at: string | null; quote_amount: number | null } | undefined;
    if (!cur) return;
    const sets: string[] = [];
    const params: unknown[] = [];
    if (patch.status !== undefined && patch.status !== cur.status) {
      sets.push("status = ?");
      params.push(patch.status);
      addEvent(id, "status", `Status changed: ${cur.status} → ${patch.status}`, userId);
    }
    if (patch.followUpAt !== undefined && patch.followUpAt !== cur.follow_up_at) {
      sets.push("follow_up_at = ?");
      params.push(patch.followUpAt);
      addEvent(id, "followup", patch.followUpAt ? `Follow-up set for ${patch.followUpAt.slice(0, 10)}` : "Follow-up cleared", userId);
    }
    if (patch.quoteAmount !== undefined && patch.quoteAmount !== cur.quote_amount) {
      sets.push("quote_amount = ?");
      params.push(patch.quoteAmount);
      addEvent(id, "quote", patch.quoteAmount == null ? "Quote cleared" : `Quote set to ₹${patch.quoteAmount.toLocaleString("en-IN")}`, userId);
    }
    if (patch.starred !== undefined) {
      sets.push("starred = ?");
      params.push(patch.starred ? 1 : 0);
    }
    if (!sets.length) return;
    sets.push("updated_at = ?");
    params.push(new Date().toISOString(), id);
    db.prepare(`UPDATE enquiries SET ${sets.join(", ")} WHERE id = ?`).run(...params);
  })();
}

export function setDelivery(id: number, field: "email_alert" | "auto_reply", status: string, detail: string) {
  getDb().prepare(`UPDATE enquiries SET ${field} = ? WHERE id = ?`).run(status, id);
  addEvent(id, "email", `${field === "email_alert" ? "Owner alert" : "Auto-reply"}: ${status} (${detail})`);
}

export function deleteEnquiry(id: number) {
  getDb().prepare("DELETE FROM enquiries WHERE id = ?").run(id);
}

// ── Dashboard ───────────────────────────────────────────────────────────────
export interface DashboardStats {
  total: number;
  newCount: number;
  last7: number;
  last30: number;
  booked: number;
  conversion: number;
  daily: { day: string; count: number }[];
  byType: { label: string; count: number }[];
  bySource: { label: string; count: number }[];
  followUpsDue: Enquiry[];
  recent: Enquiry[];
}

export function dashboardStats(): DashboardStats {
  const db = getDb();
  const one = (sql: string, ...p: unknown[]) => (db.prepare(sql).get(...p) as { n: number }).n;
  const day = (offset: number) => new Date(Date.now() - offset * 86_400_000).toISOString();

  const total = one("SELECT COUNT(*) AS n FROM enquiries WHERE status <> 'spam'");
  const booked = one("SELECT COUNT(*) AS n FROM enquiries WHERE status IN ('booked','completed')");

  // Bucket by Indian calendar day (UTC+5:30), filling zero-count days.
  const istDay = (d: Date) => new Date(d.getTime() + 330 * 60_000).toISOString().slice(0, 10);
  const counts = new Map<string, number>();
  for (const r of db.prepare("SELECT date(created_at, '+330 minutes') AS d, COUNT(*) AS n FROM enquiries WHERE created_at >= ? AND status <> 'spam' GROUP BY d").all(day(31)) as { d: string; n: number }[]) counts.set(r.d, r.n);
  const daily = Array.from({ length: 30 }, (_, i) => {
    const key = istDay(new Date(Date.now() - (29 - i) * 86_400_000));
    return { day: key, count: counts.get(key) ?? 0 };
  });

  const group = (col: string) =>
    (db.prepare(`SELECT ${col} AS label, COUNT(*) AS count FROM enquiries WHERE status <> 'spam' AND ${col} <> '' GROUP BY ${col} ORDER BY count DESC LIMIT 6`).all() as { label: string; count: number }[]);

  return {
    total,
    newCount: newEnquiryCount(),
    last7: one("SELECT COUNT(*) AS n FROM enquiries WHERE created_at >= ? AND status <> 'spam'", day(7)),
    last30: one("SELECT COUNT(*) AS n FROM enquiries WHERE created_at >= ? AND status <> 'spam'", day(30)),
    booked,
    conversion: total ? Math.round((booked / total) * 100) : 0,
    daily,
    byType: group("shoot_type"),
    bySource: group("source_cta"),
    followUpsDue: listEnquiries({ followUp: true }, 1, 6).rows,
    recent: listEnquiries({}, 1, 6).rows,
  };
}
