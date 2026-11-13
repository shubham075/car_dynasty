/** Builds a wa.me link. The text is always URL-encoded (the old inline version broke on "&" and "#"). */
export function waUrl(number: string, text?: string): string {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}
