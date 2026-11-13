import { z } from "zod";

const str = (max: number) => z.string().trim().max(max).default("");

export const enquirySubmission = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  contact: z
    .string()
    .trim()
    .max(30)
    .refine((v) => /^[0-9+()\-.\s]+$/.test(v) && v.replace(/\D/g, "").length >= 7, "Enter a valid phone / WhatsApp number"),
  location: z.string().trim().min(2, "Please enter the shoot location").max(120),
  shootType: str(120),
  vehicleOrBrand: str(200),
  details: str(3000),
  email: str(200).refine((v) => v === "" || z.email().safeParse(v).success, "Enter a valid email address"),
  shootDate: str(10).refine((v) => v === "" || (/^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v))), "Enter a valid date"),
  budget: str(80),
  deliverables: z.array(z.string().trim().min(1).max(80)).max(12).default([]),
  // Bot traps
  website: z.string().default(""),
  startedAt: z.number().optional(),
  // Attribution
  source: z.object({ cta: str(60), ref: str(160), page: str(160) }).default({ cta: "", ref: "", page: "" }),
  referrer: str(300),
  utm: z.record(z.string().max(40), z.string().max(120)).default({}),
});

export type EnquirySubmission = z.infer<typeof enquirySubmission>;
