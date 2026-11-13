import Link from "next/link";
import { requireUser } from "@/cms/auth";
import { newEnquiryCount } from "@/cms/enquiries";
import { logoutAction } from "../actions";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const newCount = newEnquiryCount();
  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-8">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link href="/admin" className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">
            Car Dynasty <span className="text-[#ff4d00]">Admin</span>
          </Link>
          <nav aria-label="Admin" className="flex items-center gap-4 text-sm">
            <Link href="/admin" className="text-zinc-300 hover:text-white">Dashboard</Link>
            <Link href="/admin/enquiries" className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-white">
              Enquiries
              {newCount > 0 && (
                <span className="rounded-full bg-[#ff4d00] px-1.5 text-xs font-semibold text-white" aria-label={`${newCount} new`}>
                  {newCount}
                </span>
              )}
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="hidden text-zinc-400 sm:inline" data-testid="admin-user">{user.email}</span>
          <form action={logoutAction}>
            <button type="submit" className="rounded-lg border border-white/15 px-3 py-1.5 text-zinc-200 hover:border-[#ff4d00] hover:text-white">
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="px-4 py-8 sm:px-8">{children}</main>
    </>
  );
}
