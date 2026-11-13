import Link from "next/link";
import { requireUser } from "@/cms/auth";
import { logoutAction } from "../actions";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <>
      <header className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-8">
        <Link href="/admin" className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">
          Car Dynasty <span className="text-[#ff4d00]">Admin</span>
        </Link>
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
