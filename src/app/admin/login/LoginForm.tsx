"use client";

import { useActionState } from "react";
import { loginAction } from "../actions";

const input =
  "mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2.5 text-sm text-white outline-none focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00]";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(loginAction, undefined);

  return (
    <form action={action} className="mt-6 space-y-4" noValidate>
      <input type="hidden" name="next" value={next} />
      <label className="block text-sm text-zinc-300">
        Email
        <input name="email" type="email" autoComplete="username" required defaultValue={state?.email} className={input} />
      </label>
      <label className="block text-sm text-zinc-300">
        Password
        <input name="password" type="password" autoComplete="current-password" required className={input} />
      </label>
      {state?.message && (
        <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-[#ff4d00] py-2.5 text-sm font-semibold text-white transition hover:bg-[#ff6a26] disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
