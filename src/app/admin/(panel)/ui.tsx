import { ENQUIRY_STATUSES, STATUS_LABEL } from "@/cms/enquiry-constants";

const TONE: Record<string, string> = {
  orange: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  blue: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  violet: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  amber: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  green: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  teal: "bg-teal-500/15 text-teal-300 border-teal-500/30",
  zinc: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
  red: "bg-red-500/15 text-red-300 border-red-500/30",
};

export function StatusBadge({ status }: { status: string }) {
  const tone = ENQUIRY_STATUSES.find((s) => s.value === status)?.tone ?? "zinc";
  return (
    <span className={`inline-block whitespace-nowrap rounded-full border px-2 py-0.5 text-xs ${TONE[tone]}`} data-testid="status-badge">
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

const IST = "Asia/Kolkata";
export const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { timeZone: IST, day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
export const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { timeZone: IST, day: "numeric", month: "short", year: "numeric" });
/** ISO timestamp → YYYY-MM-DD in IST, for <input type="date">. */
export const isoToDateInput = (iso: string | null) => (iso ? new Date(new Date(iso).getTime() + 330 * 60_000).toISOString().slice(0, 10) : "");

export const inputClass =
  "w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00]";
export const buttonClass = "rounded-lg bg-[#ff4d00] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#ff6a26] disabled:opacity-60";
export const ghostButtonClass = "rounded-lg border border-white/15 px-3 py-2 text-sm text-zinc-200 hover:border-[#ff4d00] hover:text-white";
export const cardClass = "rounded-xl border border-white/10 bg-zinc-950/70";
