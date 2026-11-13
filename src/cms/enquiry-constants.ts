// Client-safe constants shared by the public form and the admin screens.

export const ENQUIRY_STATUSES = [
  { value: "new", label: "New", tone: "orange" },
  { value: "contacted", label: "Contacted", tone: "blue" },
  { value: "quoted", label: "Quoted", tone: "violet" },
  { value: "negotiating", label: "Negotiating", tone: "amber" },
  { value: "booked", label: "Booked", tone: "green" },
  { value: "completed", label: "Completed", tone: "teal" },
  { value: "lost", label: "Lost", tone: "zinc" },
  { value: "spam", label: "Spam", tone: "red" },
] as const;

export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number]["value"];
export const STATUS_VALUES = ENQUIRY_STATUSES.map((s) => s.value) as unknown as [EnquiryStatus, ...EnquiryStatus[]];

export const STATUS_LABEL: Record<string, string> = Object.fromEntries(ENQUIRY_STATUSES.map((s) => [s.value, s.label]));

/** Names of the CTAs that open the form — stored with each enquiry as its source. */
export type EnquirySource = { cta?: string; ref?: string };
