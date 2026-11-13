import { after } from "next/server";
import { createEnquiry, findRecentDuplicate } from "@/cms/enquiries";
import { enquirySubmission } from "@/cms/enquiry-schema";
import { notifyEnquiry } from "@/cms/enquiry-notify";
import { flattenIssues } from "@/cms/fields";
import { ipHash, pruneRateLimits, rateLimit } from "@/cms/rate-limit";

export const dynamic = "force-dynamic";

const MAX_BODY = 20_000;

const json = (body: unknown, status = 200, headers?: Record<string, string>) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

/** Same-origin check: the form is only ever posted from our own pages. */
function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // non-browser clients; still rate-limited and validated
  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }
  const allowed = new Set([req.headers.get("host"), req.headers.get("x-forwarded-host")?.split(",")[0]?.trim()]);
  if (process.env.SITE_URL) {
    try {
      allowed.add(new URL(process.env.SITE_URL).host);
    } catch {
      /* ignore malformed SITE_URL */
    }
  }
  return allowed.has(originHost);
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ ok: false, message: "Request not allowed." }, 403);
  if (!req.headers.get("content-type")?.includes("application/json")) return json({ ok: false, message: "Unsupported request." }, 415);

  const raw = await req.text();
  if (raw.length > MAX_BODY) return json({ ok: false, message: "Your message is too long." }, 413);

  const ip = ipHash(req.headers);
  const burst = rateLimit(`enq:burst:${ip}`, 5, 10 * 60);
  const daily = rateLimit(`enq:day:${ip}`, 25, 24 * 60 * 60);
  if (!burst.ok || !daily.ok) {
    const retryAfter = Math.max(burst.retryAfter, daily.retryAfter);
    return json({ ok: false, message: "Too many enquiries from this connection. Please try again later or message us on WhatsApp." }, 429, { "Retry-After": String(retryAfter) });
  }
  if (Math.random() < 0.02) pruneRateLimits();

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, message: "Invalid request." }, 400);
  }

  const parsed = enquirySubmission.safeParse(body);
  if (!parsed.success) return json({ ok: false, errors: flattenIssues(parsed.error), message: "Please check the highlighted fields." }, 422);
  const input = parsed.data;

  // Bots fill the hidden field or submit instantly. Pretend it worked, store nothing.
  const tooFast = typeof input.startedAt === "number" && Date.now() - input.startedAt < 1500;
  if (input.website || tooFast) return json({ ok: true, reference: "CD-0000-XXXX" });

  const dup = findRecentDuplicate(input.contact, input.name);
  if (dup) return json({ ok: true, reference: dup.reference });

  const { id, reference } = createEnquiry(input, { ipHash: ip, userAgent: req.headers.get("user-agent") ?? "" });
  after(() => notifyEnquiry(id, reference, input).catch((e) => console.error("[enquiry] notification failed", e)));

  return json({ ok: true, reference });
}
