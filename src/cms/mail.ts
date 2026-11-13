import "server-only";
import nodemailer from "nodemailer";

export type MailResult = { status: "sent" | "failed" | "skipped"; detail: string };

interface Mail {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}

/**
 * Sends plain-text email through Resend (RESEND_API_KEY) or SMTP (SMTP_HOST/PORT/USER/PASS).
 * With neither configured it returns "skipped" — enquiries are still saved.
 */
export async function sendMail(mail: Mail): Promise<MailResult> {
  const from = process.env.MAIL_FROM || process.env.SMTP_USER || "";
  try {
    if (process.env.RESEND_API_KEY) {
      if (!from) return { status: "skipped", detail: "MAIL_FROM is not set" };
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from, to: [mail.to], subject: mail.subject, text: mail.text, reply_to: mail.replyTo }),
        signal: AbortSignal.timeout(15000),
      });
      return res.ok ? { status: "sent", detail: "via Resend" } : { status: "failed", detail: `Resend ${res.status}` };
    }

    if (process.env.SMTP_HOST) {
      if (!from) return { status: "skipped", detail: "MAIL_FROM or SMTP_USER is not set" };
      const port = Number(process.env.SMTP_PORT || 587);
      const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure: port === 465,
        auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS ?? "" } : undefined,
        connectionTimeout: 15000,
        socketTimeout: 20000,
      });
      await transport.sendMail({ from, to: mail.to, subject: mail.subject, text: mail.text, replyTo: mail.replyTo });
      return { status: "sent", detail: "via SMTP" };
    }
  } catch (e) {
    return { status: "failed", detail: e instanceof Error ? e.message.slice(0, 200) : "unknown error" };
  }
  return { status: "skipped", detail: "No email provider configured" };
}
