import { getCurrentUser } from "@/cms/auth";
import { allEnquiries, type Enquiry } from "@/cms/enquiries";
import { STATUS_LABEL } from "@/cms/enquiry-constants";

export const dynamic = "force-dynamic";

const COLUMNS: [string, (e: Enquiry) => unknown][] = [
  ["Reference", (e) => e.reference],
  ["Received (UTC)", (e) => e.createdAt],
  ["Status", (e) => STATUS_LABEL[e.status] ?? e.status],
  ["Starred", (e) => (e.starred ? "yes" : "")],
  ["Name", (e) => e.name],
  ["Contact", (e) => e.contact],
  ["Email", (e) => e.email],
  ["Shoot type", (e) => e.shootType],
  ["Vehicle / brand", (e) => e.vehicleOrBrand],
  ["Location", (e) => e.location],
  ["Preferred date", (e) => e.shootDate],
  ["Budget", (e) => e.budget],
  ["Deliverables", (e) => e.deliverables.join("; ")],
  ["Details", (e) => e.details],
  ["Quote (INR)", (e) => e.quoteAmount ?? ""],
  ["Follow-up (UTC)", (e) => e.followUpAt ?? ""],
  ["Source", (e) => [e.sourceCta, e.sourceRef].filter(Boolean).join(" / ")],
  ["Page", (e) => e.sourcePage],
  ["Referrer", (e) => e.referrer],
];

/** RFC 4180 quoting, plus a leading ' on values a spreadsheet would run as a formula. */
function cell(v: unknown): string {
  let s = String(v ?? "");
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(req: Request) {
  if (!(await getCurrentUser())) return new Response("Unauthorized", { status: 401 });
  const sp = new URL(req.url).searchParams;
  const rows = allEnquiries({
    status: sp.get("status") ?? "",
    q: (sp.get("q") ?? "").slice(0, 100),
    type: sp.get("type") ?? "",
    from: sp.get("from") ?? "",
    to: sp.get("to") ?? "",
    starred: sp.get("starred") === "1",
    followUp: sp.get("followUp") === "1",
  });
  const lines = [COLUMNS.map(([h]) => h), ...rows.map((e) => COLUMNS.map(([, get]) => get(e)))].map((r) => r.map(cell).join(","));
  const date = new Date().toISOString().slice(0, 10);
  // BOM so Excel opens UTF-8 (Hindi names, ₹) correctly.
  return new Response("﻿" + lines.join("\r\n") + "\r\n", {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="enquiries-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
