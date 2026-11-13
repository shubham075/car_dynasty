import { redirect } from "next/navigation";
import { getCurrentUser, safeNext } from "@/cms/auth";
import { LoginForm } from "./LoginForm";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  if (await getCurrentUser()) redirect(safeNext(next));

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-950/80 p-8 shadow-2xl">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.3em] text-[#ff4d00]">Car Dynasty</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl tracking-wide text-white">Admin sign in</h1>
        <LoginForm next={safeNext(next)} />
      </div>
    </main>
  );
}
