import Link from "next/link";
import { notFound } from "next/navigation";
import { Mail, MessageCircle, Phone, Star } from "lucide-react";
import { requireUser } from "@/cms/auth";
import { getEnquiry, getEvents } from "@/cms/enquiries";
import { waUrl } from "@/lib/whatsapp";
import { StatusBadge, cardClass, fmtDateTime, ghostButtonClass, isoToDateInput } from "../../ui";
import { addNoteAction, deleteEnquiryAction, toggleStarAction, updateEnquiryAction } from "../actions";
import { DeleteForm, ManageForm, NoteForm } from "./forms";

const EVENT_LABEL: Record<string, string> = {
  created: "Received", status: "Status", followup: "Follow-up", quote: "Quote", note: "Note", email: "Email",
};

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === "" || value == null) return null;
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-zinc-500">{label}</dt>
      <dd className="mt-0.5 whitespace-pre-line break-words text-sm text-zinc-200">{value}</dd>
    </div>
  );
}

export default async function EnquiryPage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser();
  const id = Number((await params).id);
  const e = Number.isInteger(id) ? getEnquiry(id) : null;
  if (!e) notFound();
  const events = getEvents(id);

  const phoneDigits = e.contact.replace(/\D/g, "");
  const isPhone = phoneDigits.length >= 10;
  const waNumber = phoneDigits.length === 10 ? `91${phoneDigits}` : phoneDigits; // bare Indian mobiles
  const utm = Object.entries(e.utm).map(([k, v]) => `${k}: ${v}`).join("\n");

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Link href="/admin/enquiries" className="text-sm text-zinc-400 hover:text-white">← All enquiries</Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-white">{e.name}</h1>
            <StatusBadge status={e.status} />
          </div>
          <p className="mt-1 font-[family-name:var(--font-mono)] text-xs text-zinc-500">
            {e.reference} · received {fmtDateTime(e.createdAt)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <form action={toggleStarAction.bind(null, id)}>
            <button type="submit" className={`${ghostButtonClass} inline-flex items-center gap-1.5`} aria-pressed={e.starred}>
              <Star className={`h-4 w-4 ${e.starred ? "fill-amber-400 text-amber-400" : ""}`} />
              {e.starred ? "Starred" : "Star"}
            </button>
          </form>
          {isPhone && (
            <>
              <a href={waUrl(waNumber, `Hi ${e.name}, thanks for your enquiry (${e.reference}) with Car Dynasty.`)} target="_blank" rel="noopener noreferrer" className={`${ghostButtonClass} inline-flex items-center gap-1.5`}>
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
              <a href={`tel:+${waNumber}`} className={`${ghostButtonClass} inline-flex items-center gap-1.5`}>
                <Phone className="h-4 w-4" /> Call
              </a>
            </>
          )}
          {e.email && (
            <a href={`mailto:${e.email}?subject=${encodeURIComponent(`Your enquiry ${e.reference}`)}`} className={`${ghostButtonClass} inline-flex items-center gap-1.5`}>
              <Mail className="h-4 w-4" /> Email
            </a>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className={`${cardClass} p-5`}>
            <h2 className="mb-4 text-sm uppercase tracking-wider text-zinc-400">Request</h2>
            <dl className="grid gap-4 sm:grid-cols-2">
              <Field label="Contact" value={e.contact} />
              <Field label="Email" value={e.email} />
              <Field label="Shoot type" value={e.shootType} />
              <Field label="Vehicle / brand" value={e.vehicleOrBrand} />
              <Field label="Location" value={e.location} />
              <Field label="Preferred date" value={e.shootDate} />
              <Field label="Budget" value={e.budget} />
              <Field label="Deliverables" value={e.deliverables.join(", ")} />
              <div className="sm:col-span-2"><Field label="Details" value={e.details} /></div>
            </dl>
          </section>

          <section className={`${cardClass} p-5`}>
            <h2 className="mb-4 text-sm uppercase tracking-wider text-zinc-400">Activity</h2>
            <NoteForm action={addNoteAction.bind(null, id)} />
            <ol className="mt-6 space-y-4 border-l border-white/10 pl-4" data-testid="timeline">
              {events.map((ev) => (
                <li key={ev.id} className="relative">
                  <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-[#ff4d00]" />
                  <p className="text-xs text-zinc-500">
                    {EVENT_LABEL[ev.type] ?? ev.type} · {fmtDateTime(ev.createdAt)}
                  </p>
                  <p className="whitespace-pre-line break-words text-sm text-zinc-200">{ev.body}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className="space-y-6">
          <section className={`${cardClass} p-5`}>
            <h2 className="mb-4 text-sm uppercase tracking-wider text-zinc-400">Manage</h2>
            <ManageForm
              action={updateEnquiryAction.bind(null, id)}
              status={e.status}
              followUp={isoToDateInput(e.followUpAt)}
              quote={e.quoteAmount}
            />
          </section>

          <section className={`${cardClass} p-5`}>
            <h2 className="mb-4 text-sm uppercase tracking-wider text-zinc-400">Source</h2>
            <dl className="space-y-3">
              <Field label="Button" value={[e.sourceCta, e.sourceRef].filter(Boolean).join(" · ")} />
              <Field label="Page" value={e.sourcePage} />
              <Field label="Referrer" value={e.referrer} />
              <Field label="Campaign" value={utm} />
              <Field label="Owner alert" value={e.emailAlert} />
              <Field label="Auto-reply" value={e.autoReply} />
            </dl>
          </section>

          <DeleteForm action={deleteEnquiryAction.bind(null, id)} reference={e.reference} />
        </div>
      </div>
    </div>
  );
}
