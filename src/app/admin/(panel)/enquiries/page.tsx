import Link from "next/link";
import { Star } from "lucide-react";
import { requireUser } from "@/cms/auth";
import { distinctTypes, listEnquiries, statusCounts, type EnquiryFilter } from "@/cms/enquiries";
import { ENQUIRY_STATUSES } from "@/cms/enquiry-constants";
import { StatusBadge, buttonClass, cardClass, fmtDate, fmtDateTime, ghostButtonClass, inputClass } from "../ui";

type Search = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

function readFilter(sp: Search): EnquiryFilter & { page: number } {
  return {
    status: one(sp.status),
    q: one(sp.q).slice(0, 100),
    type: one(sp.type),
    from: one(sp.from),
    to: one(sp.to),
    starred: one(sp.starred) === "1",
    followUp: one(sp.followUp) === "1",
    page: Math.max(1, Number(one(sp.page)) || 1),
  };
}

/** Query string for the current filter with some keys overridden; empty values dropped. */
function qs(f: ReturnType<typeof readFilter>, over: Record<string, string | number | undefined>) {
  const base: Record<string, string | number | undefined> = {
    status: f.status, q: f.q, type: f.type, from: f.from, to: f.to,
    starred: f.starred ? "1" : "", followUp: f.followUp ? "1" : "", page: f.page > 1 ? f.page : "",
    ...over,
  };
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(base)) if (v !== undefined && v !== "" && v !== 0) p.set(k, String(v));
  const s = p.toString();
  return s ? `?${s}` : "";
}

export default async function EnquiriesPage({ searchParams }: { searchParams: Promise<Search> }) {
  await requireUser();
  const sp = await searchParams;
  const f = readFilter(sp);
  const { rows, total, pages } = listEnquiries(f, f.page, 25);
  const counts = statusCounts();
  const all = Object.values(counts).reduce((a, b) => a + b, 0);
  const types = distinctTypes();
  const page = Math.min(f.page, pages);

  const tab = (value: string, label: string, n: number) => {
    const active = (f.status || "") === value;
    return (
      <Link
        key={value || "all"}
        href={`/admin/enquiries${qs(f, { status: value, page: "" })}`}
        className={`whitespace-nowrap rounded-full border px-3 py-1 text-sm transition ${active ? "border-[#ff4d00] bg-[#ff4d00]/15 text-white" : "border-white/10 text-zinc-400 hover:text-white"}`}
        aria-current={active ? "page" : undefined}
      >
        {label} <span className="text-zinc-500">{n}</span>
      </Link>
    );
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white">Enquiries</h1>
          <p className="text-sm text-zinc-500">{total} matching</p>
        </div>
        <a href={`/admin/enquiries/export${qs(f, { page: "" })}`} className={ghostButtonClass} download>
          Export CSV
        </a>
      </div>

      {one(sp.deleted) === "1" && (
        <p role="status" className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
          Enquiry deleted.
        </p>
      )}

      <nav aria-label="Status" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {tab("", "All", all)}
        {ENQUIRY_STATUSES.map((s) => tab(s.value, s.label, counts[s.value] ?? 0))}
      </nav>

      <form method="get" className={`${cardClass} grid grid-cols-2 gap-3 p-4 sm:grid-cols-6`} role="search">
        {f.status && <input type="hidden" name="status" value={f.status} />}
        <label className="col-span-2 text-xs text-zinc-400">
          Search
          <input name="q" defaultValue={f.q} placeholder="Name, phone, email, reference…" className={inputClass} />
        </label>
        <label className="text-xs text-zinc-400">
          Shoot type
          <select name="type" defaultValue={f.type} className={inputClass}>
            <option value="">Any</option>
            {types.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="text-xs text-zinc-400">
          From
          <input type="date" name="from" defaultValue={f.from} className={inputClass} />
        </label>
        <label className="text-xs text-zinc-400">
          To
          <input type="date" name="to" defaultValue={f.to} className={inputClass} />
        </label>
        <div className="col-span-2 flex flex-wrap items-center gap-3 sm:col-span-1 sm:flex-col sm:items-start sm:justify-end sm:gap-1">
          <label className="flex items-center gap-2 text-xs text-zinc-300">
            <input type="checkbox" name="starred" value="1" defaultChecked={f.starred} className="accent-[#ff4d00]" /> Starred
          </label>
          <label className="flex items-center gap-2 text-xs text-zinc-300">
            <input type="checkbox" name="followUp" value="1" defaultChecked={f.followUp} className="accent-[#ff4d00]" /> Follow-up due
          </label>
        </div>
        <div className="col-span-2 flex gap-2 sm:col-span-6">
          <button type="submit" className={buttonClass}>Apply filters</button>
          <Link href="/admin/enquiries" className={ghostButtonClass}>Clear</Link>
        </div>
      </form>

      {rows.length === 0 ? (
        <p className={`${cardClass} p-8 text-center text-sm text-zinc-500`}>No enquiries match these filters.</p>
      ) : (
        <div className={`${cardClass} overflow-x-auto`}>
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="w-8 px-3 py-3"><span className="sr-only">Starred</span></th>
                <th className="px-3 py-3">Name</th>
                <th className="px-3 py-3">Shoot</th>
                <th className="px-3 py-3">Received</th>
                <th className="px-3 py-3">Follow-up</th>
                <th className="px-3 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.map((e) => (
                <tr key={e.id} className="hover:bg-white/[0.03]" data-testid="enquiry-row">
                  <td className="px-3 py-3">{e.starred && <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-label="Starred" />}</td>
                  <td className="px-3 py-3">
                    <Link href={`/admin/enquiries/${e.id}`} className="font-medium text-white hover:text-[#ff4d00]">
                      {e.name}
                    </Link>
                    <div className="font-[family-name:var(--font-mono)] text-xs text-zinc-500">{e.reference} · {e.contact}</div>
                  </td>
                  <td className="px-3 py-3 text-zinc-300">
                    {e.shootType || "—"}
                    {e.vehicleOrBrand && <div className="text-xs text-zinc-500">{e.vehicleOrBrand}</div>}
                  </td>
                  <td className="px-3 py-3 text-zinc-400">{fmtDateTime(e.createdAt)}</td>
                  <td className="px-3 py-3 text-zinc-400">{e.followUpAt ? fmtDate(e.followUpAt) : "—"}</td>
                  <td className="px-3 py-3"><StatusBadge status={e.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 && (
        <nav aria-label="Pagination" className="flex items-center justify-between text-sm text-zinc-400">
          {page > 1 ? <Link href={`/admin/enquiries${qs(f, { page: page - 1 })}`} className={ghostButtonClass}>← Newer</Link> : <span />}
          <span>Page {page} of {pages}</span>
          {page < pages ? <Link href={`/admin/enquiries${qs(f, { page: page + 1 })}`} className={ghostButtonClass}>Older →</Link> : <span />}
        </nav>
      )}
    </div>
  );
}
