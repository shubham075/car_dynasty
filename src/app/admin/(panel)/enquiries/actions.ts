"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser } from "@/cms/auth";
import { addEvent, deleteEnquiry, getEnquiry, updateEnquiry } from "@/cms/enquiries";
import { STATUS_VALUES } from "@/cms/enquiry-constants";

export type FormState = { ok: boolean; message: string } | undefined;

const manageSchema = z.object({
  status: z.enum(STATUS_VALUES),
  followUp: z.union([z.literal(""), z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a valid date")]),
  quote: z
    .string()
    .regex(/^\d*$/, "Quote must be a number")
    .refine((v) => v === "" || Number(v) <= 100_000_000, "Quote is too large")
    .transform((v) => (v === "" ? "" : Number(v))),
});

async function existing(id: number) {
  const user = await requireUser();
  if (!Number.isInteger(id) || !getEnquiry(id)) throw new Error("Enquiry not found");
  return user;
}

export async function updateEnquiryAction(id: number, _prev: FormState, form: FormData): Promise<FormState> {
  const user = await existing(id);
  const parsed = manageSchema.safeParse({
    status: form.get("status"),
    followUp: String(form.get("followUp") ?? ""),
    quote: String(form.get("quote") ?? "").replace(/[,\s₹]/g, ""),
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Check the fields." };
  const { status, followUp, quote } = parsed.data;
  updateEnquiry(
    id,
    {
      status,
      // Follow-ups are due at 9am IST on the chosen day.
      followUpAt: followUp ? new Date(`${followUp}T09:00:00+05:30`).toISOString() : null,
      quoteAmount: quote === "" ? null : quote,
    },
    user.id,
  );
  refresh();
  return { ok: true, message: "Saved." };
}

export async function toggleStarAction(id: number) {
  const user = await existing(id);
  updateEnquiry(id, { starred: !getEnquiry(id)!.starred }, user.id);
  refresh();
}

export async function addNoteAction(id: number, _prev: FormState, form: FormData): Promise<FormState> {
  const user = await existing(id);
  const note = String(form.get("note") ?? "").trim();
  if (!note) return { ok: false, message: "Write a note first." };
  if (note.length > 4000) return { ok: false, message: "Notes are limited to 4,000 characters." };
  addEvent(id, "note", note, user.id);
  refresh();
  return { ok: true, message: "Note added." };
}

export async function deleteEnquiryAction(id: number) {
  await existing(id);
  deleteEnquiry(id);
  redirect("/admin/enquiries?deleted=1");
}
