import "server-only";
import { getSection } from "./settings";
import { getSiteUrl } from "./content";
import { sendMail } from "./mail";
import { setDelivery } from "./enquiries";
import type { EnquirySubmission } from "./enquiry-schema";

function summary(input: EnquirySubmission): string {
  return [
    `Name: ${input.name}`,
    `Contact: ${input.contact}`,
    input.email && `Email: ${input.email}`,
    input.shootType && `Type: ${input.shootType}`,
    input.vehicleOrBrand && `Vehicle/Brand: ${input.vehicleOrBrand}`,
    `Location: ${input.location}`,
    input.shootDate && `Preferred date: ${input.shootDate}`,
    input.budget && `Budget: ${input.budget}`,
    input.deliverables.length > 0 && `Deliverables: ${input.deliverables.join(", ")}`,
    input.details && `Details: ${input.details}`,
  ]
    .filter(Boolean)
    .join("\n");
}

const fill = (tpl: string, vars: Record<string, string>) => tpl.replace(/\{(\w+)\}/g, (m, k: string) => vars[k] ?? m);

/** Runs after the response has been sent, so the visitor never waits on email. */
export async function notifyEnquiry(id: number, reference: string, input: EnquirySubmission) {
  const cfg = getSection("enquiry");
  const site = getSection("site");

  if (cfg.emailAlertEnabled) {
    const to = cfg.notifyEmail || process.env.NOTIFY_EMAIL || site.email;
    const r = await sendMail({
      to,
      subject: `New enquiry ${reference} — ${input.name}`,
      text: `${summary(input)}\n\nOpen in the CMS: ${getSiteUrl()}/admin/enquiries/${id}`,
      replyTo: input.email || undefined,
    });
    setDelivery(id, "email_alert", r.status, r.detail);
  } else {
    setDelivery(id, "email_alert", "skipped", "alerts are turned off");
  }

  if (cfg.autoReplyEnabled && input.email) {
    const vars = { name: input.name, reference, summary: summary(input) };
    const r = await sendMail({ to: input.email, subject: fill(cfg.autoReplySubject, vars), text: fill(cfg.autoReplyBody, vars) });
    setDelivery(id, "auto_reply", r.status, r.detail);
  } else {
    setDelivery(id, "auto_reply", "skipped", input.email ? "auto-reply is turned off" : "no email given");
  }
}
