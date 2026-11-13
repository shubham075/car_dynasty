"use client";

import { useActionState, useEffect, useRef } from "react";
import type { FormState } from "../actions";
import { ENQUIRY_STATUSES } from "@/cms/enquiry-constants";
import { buttonClass, inputClass } from "../../ui";

type Action = (prev: FormState, form: FormData) => Promise<FormState>;

function Feedback({ state }: { state: FormState }) {
  if (!state) return null;
  return (
    <p role={state.ok ? "status" : "alert"} className={`text-sm ${state.ok ? "text-emerald-300" : "text-red-300"}`}>
      {state.message}
    </p>
  );
}

export function ManageForm({
  action,
  status,
  followUp,
  quote,
}: {
  action: Action;
  status: string;
  followUp: string;
  quote: number | null;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  return (
    <form action={formAction} className="space-y-3">
      <label className="block text-xs text-zinc-400">
        Status
        <select name="status" defaultValue={status} className={inputClass}>
          {ENQUIRY_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </label>
      <label className="block text-xs text-zinc-400">
        Follow-up date
        <input type="date" name="followUp" defaultValue={followUp} className={inputClass} />
      </label>
      <label className="block text-xs text-zinc-400">
        Quote (₹)
        <input name="quote" inputMode="numeric" defaultValue={quote ?? ""} placeholder="e.g. 25000" className={inputClass} />
      </label>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className={buttonClass}>{pending ? "Saving…" : "Save changes"}</button>
        <Feedback state={state} />
      </div>
    </form>
  );
}

export function NoteForm({ action }: { action: Action }) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);
  return (
    <form ref={ref} action={formAction} className="space-y-2">
      <label className="block text-xs text-zinc-400">
        Add a note
        <textarea name="note" rows={3} maxLength={4000} placeholder="Called back, sent rate card…" className={inputClass} />
      </label>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className={buttonClass}>{pending ? "Adding…" : "Add note"}</button>
        <Feedback state={state} />
      </div>
    </form>
  );
}

export function DeleteForm({ action, reference }: { action: () => Promise<void>; reference: string }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(`Delete enquiry ${reference} and its history? This cannot be undone.`)) e.preventDefault();
      }}
    >
      <button type="submit" className="rounded-lg border border-red-500/40 px-3 py-2 text-sm text-red-300 hover:bg-red-500/10">
        Delete enquiry
      </button>
    </form>
  );
}
