import Link from "next/link";
import { requireUser } from "@/cms/auth";
import { dashboardStats } from "@/cms/enquiries";
import { STATUS_LABEL } from "@/cms/enquiry-constants";

export default async function AdminDashboard() {
  const user = await requireUser();
  const s = dashboardStats();
  const tiles = [
    { label: "New", value: s.newCount },
    { label: "Last 7 days", value: s.last7 },
    { label: "Last 30 days", value: s.last30 },
    { label: "Booked", value: s.booked },
    { label: "Conversion", value: `${s.conversion}%` },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <h1 className="text-2xl font-semibold text-white">Welcome{user.name ? `, ${user.name}` : ""}</h1>
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-xl border border-white/10 bg-zinc-950/70 p-4">
            <p className="text-xs uppercase tracking-wider text-zinc-500">{t.label}</p>
            <p className="mt-1 text-2xl font-semibold text-white">{t.value}</p>
          </div>
        ))}
      </section>
      <section>
        <h2 className="mb-3 text-sm uppercase tracking-wider text-zinc-400">Recent enquiries</h2>
        {s.recent.length === 0 ? (
          <p className="text-sm text-zinc-500">No enquiries yet.</p>
        ) : (
          <ul className="divide-y divide-white/5 rounded-xl border border-white/10 bg-zinc-950/70">
            {s.recent.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                <Link href={`/admin/enquiries/${e.id}`} className="text-white hover:text-[#ff4d00]">{e.name}</Link>
                <span className="text-zinc-400">{e.shootType || "—"}</span>
                <span className="font-[family-name:var(--font-mono)] text-xs text-zinc-500">{e.reference}</span>
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-zinc-300">{STATUS_LABEL[e.status] ?? e.status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
