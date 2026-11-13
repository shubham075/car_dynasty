"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, Send, CheckCircle2, ChevronDown } from "lucide-react";
import { Button } from "@/components/common/Button";
import { waUrl } from "@/lib/whatsapp";
import type { EnquiryConfig } from "@/cms/content";
import type { EnquirySource } from "@/cms/enquiry-constants";

interface EnquiryModalProps {
  config: EnquiryConfig;
  brandName: string;
  ownerName: string;
  whatsapp: string;
  source: EnquirySource;
  onClose: () => void;
}

const inputClass =
  "w-full bg-[#14161a] border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#ff4d00] focus-visible:ring-1 focus-visible:ring-[#ff4d00]";
const labelClass = "block font-mono-tech text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5";

export function EnquiryModal({ config, brandName, ownerName, whatsapp, source, onClose }: EnquiryModalProps) {
  const [done, setDone] = useState<{ reference: string; waLink: string | null } | null>(null);
  const [sending, setSending] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const startedAt = useRef(0); // set when the modal mounts; bots that submit instantly are ignored
  const firstField = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    shootType: config.shootTypes[0] ?? "",
    vehicleOrBrand: "",
    location: config.defaultLocation,
    details: "",
    email: "",
    shootDate: "",
    budget: "",
    deliverables: [] as string[],
    website: "", // honeypot — real visitors never see or fill this
  });

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    firstField.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const set = <K extends keyof typeof formData>(key: K, value: (typeof formData)[K]) =>
    setFormData((f) => ({ ...f, [key]: value }));

  const toggleDeliverable = (item: string) =>
    set("deliverables", formData.deliverables.includes(item) ? formData.deliverables.filter((d) => d !== item) : [...formData.deliverables, item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setErrors({});
    setFormError("");

    // Opened synchronously inside the click so popup blockers allow it; pointed at WhatsApp once saved.
    const popup = config.whatsappEnabled ? window.open("", "_blank") : null;

    try {
      const params = new URLSearchParams(window.location.search);
      const utm = Object.fromEntries([...params.entries()].filter(([k]) => k.startsWith("utm_")));
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          startedAt: startedAt.current,
          source: { cta: source.cta ?? "", ref: source.ref ?? "", page: window.location.pathname },
          referrer: document.referrer,
          utm,
        }),
      });
      const data = (await res.json().catch(() => null)) as { ok: boolean; reference?: string; errors?: Record<string, string>; message?: string } | null;

      if (!res.ok || !data?.ok || !data.reference) {
        popup?.close();
        if (data?.errors) {
          setErrors(data.errors);
          if (Object.keys(data.errors).some((k) => ["email", "shootDate", "budget", "deliverables"].includes(k))) setShowMore(true);
        }
        setFormError(data?.message ?? "We couldn't send your enquiry. Please try again or message us on WhatsApp.");
        return;
      }

      let waLink: string | null = null;
      if (config.whatsappEnabled) {
        const lines = [
          `*Shoot Enquiry — ${brandName}*`,
          `*Ref:* ${data.reference}`,
          `*Name:* ${formData.name}`,
          `*Contact:* ${formData.contact}`,
          `*Type:* ${formData.shootType}`,
          formData.vehicleOrBrand && `*Vehicle/Brand:* ${formData.vehicleOrBrand}`,
          `*Location:* ${formData.location}`,
          formData.shootDate && `*Date:* ${formData.shootDate}`,
          formData.budget && `*Budget:* ${formData.budget}`,
          formData.deliverables.length > 0 && `*Deliverables:* ${formData.deliverables.join(", ")}`,
          formData.details && `*Details:* ${formData.details}`,
        ].filter(Boolean);
        waLink = waUrl(whatsapp, lines.join("\n"));
        if (popup) {
          popup.opener = null;
          popup.location.href = waLink;
        }
      }
      setDone({ reference: data.reference, waLink: popup ? null : waLink });
    } catch {
      popup?.close();
      setFormError("Network problem — please check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative w-full max-w-xl bg-[#0d0f12] border border-white/15 p-6 md:p-8 shadow-2xl my-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-zinc-400 hover:text-white border border-white/10 cursor-pointer"
          aria-label="Close Enquiry Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {done ? (
          <div className="py-12 flex flex-col items-center text-center gap-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
            <h3 className="font-display text-3xl text-white">{config.successTitle}</h3>
            <p className="text-sm text-zinc-400 max-w-md">{config.successText}</p>
            <p className="font-mono-tech text-xs text-zinc-300 tracking-wider">
              REFERENCE <span className="text-[#ff4d00]">{done.reference}</span>
            </p>
            {done.waLink && (
              <a
                href={done.waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 font-mono-tech text-xs uppercase tracking-wider hover:border-emerald-500"
              >
                Continue on WhatsApp
              </a>
            )}
            <Button variant="outline" size="md" onClick={onClose}>
              Close Window
            </Button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="font-mono-tech text-xs uppercase tracking-widest text-[#ff4d00]">{config.eyebrow}</span>
              <h3 id="modal-title" className="font-display text-3xl text-white tracking-wide mt-1">
                {config.title}
              </h3>
              <p className="text-xs text-zinc-400 mt-1">{config.subtitle}</p>
              {source.ref && (
                <p className="font-mono-tech text-[11px] text-zinc-500 mt-2 uppercase tracking-wider">Enquiring about: {source.ref}</p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="enquiry-name" className={labelClass}>Your Name / Company</label>
                  <input
                    id="enquiry-name"
                    ref={firstField}
                    type="text"
                    required
                    maxLength={120}
                    placeholder="e.g. Rahul Sharma / Speedcraft"
                    value={formData.name}
                    onChange={(e) => set("name", e.target.value)}
                    className={inputClass}
                  />
                  {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="enquiry-contact" className={labelClass}>WhatsApp / Phone</label>
                  <input
                    id="enquiry-contact"
                    type="tel"
                    required
                    maxLength={30}
                    placeholder="+91 98765 43210"
                    value={formData.contact}
                    onChange={(e) => set("contact", e.target.value)}
                    className={inputClass}
                  />
                  {errors.contact && <p className="text-xs text-red-400 mt-1">{errors.contact}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="enquiry-type" className={labelClass}>Shoot Category</label>
                  <select
                    id="enquiry-type"
                    value={formData.shootType}
                    onChange={(e) => set("shootType", e.target.value)}
                    className={inputClass}
                  >
                    {config.shootTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="enquiry-location" className={labelClass}>Shoot Location</label>
                  <input
                    id="enquiry-location"
                    type="text"
                    required
                    maxLength={120}
                    placeholder="e.g. Bhopal, Indore, Mumbai..."
                    value={formData.location}
                    onChange={(e) => set("location", e.target.value)}
                    className={inputClass}
                  />
                  {errors.location && <p className="text-xs text-red-400 mt-1">{errors.location}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="enquiry-vehicle" className={labelClass}>Vehicle(s) / Brand Focus</label>
                <input
                  id="enquiry-vehicle"
                  type="text"
                  maxLength={200}
                  placeholder="e.g. Porsche 911 GT3 / BMW M3 / Tuner Fleet"
                  value={formData.vehicleOrBrand}
                  onChange={(e) => set("vehicleOrBrand", e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="enquiry-details" className={labelClass}>Vision / Project Notes</label>
                <textarea
                  id="enquiry-details"
                  rows={3}
                  maxLength={3000}
                  placeholder="Tell us about the deliverable, desired timeline, or aesthetic..."
                  value={formData.details}
                  onChange={(e) => set("details", e.target.value)}
                  className={inputClass}
                />
              </div>

              <button
                type="button"
                onClick={() => setShowMore((v) => !v)}
                aria-expanded={showMore}
                className="self-start inline-flex items-center gap-1.5 font-mono-tech text-[11px] uppercase tracking-wider text-zinc-400 hover:text-[#ff4d00] cursor-pointer"
              >
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showMore ? "rotate-180" : ""}`} />
                {showMore ? "Hide extra details" : "Add more details (email, date, budget)"}
              </button>

              {showMore && (
                <div className="flex flex-col gap-4 border-l border-white/10 pl-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="enquiry-email" className={labelClass}>Email</label>
                      <input
                        id="enquiry-email"
                        type="email"
                        maxLength={200}
                        placeholder="you@brand.com"
                        value={formData.email}
                        onChange={(e) => set("email", e.target.value)}
                        className={inputClass}
                      />
                      {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label htmlFor="enquiry-date" className={labelClass}>Preferred Shoot Date</label>
                      <input
                        id="enquiry-date"
                        type="date"
                        value={formData.shootDate}
                        onChange={(e) => set("shootDate", e.target.value)}
                        className={`${inputClass} [color-scheme:dark]`}
                      />
                      {errors.shootDate && <p className="text-xs text-red-400 mt-1">{errors.shootDate}</p>}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="enquiry-budget" className={labelClass}>Budget Range</label>
                    <select
                      id="enquiry-budget"
                      value={formData.budget}
                      onChange={(e) => set("budget", e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Prefer not to say</option>
                      {config.budgetOptions.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  {config.deliverableOptions.length > 0 && (
                    <fieldset>
                      <legend className={labelClass}>Deliverables</legend>
                      <div className="flex flex-wrap gap-2">
                        {config.deliverableOptions.map((d) => {
                          const on = formData.deliverables.includes(d);
                          return (
                            <button
                              key={d}
                              type="button"
                              aria-pressed={on}
                              onClick={() => toggleDeliverable(d)}
                              className={`px-3 py-1.5 text-[11px] font-mono-tech uppercase tracking-wider border cursor-pointer transition-colors ${
                                on ? "bg-[#ff4d00] border-[#ff4d00] text-white" : "bg-white/5 border-white/10 text-zinc-400 hover:text-white"
                              }`}
                            >
                              {d}
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>
                  )}
                </div>
              )}

              {/* Honeypot: hidden from people and assistive tech, tempting to bots. */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label htmlFor="enquiry-website">Website</label>
                <input
                  id="enquiry-website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.website}
                  onChange={(e) => set("website", e.target.value)}
                />
              </div>

              {formError && (
                <p role="alert" className="text-sm text-red-400 border border-red-500/30 bg-red-950/30 px-3.5 py-2.5">
                  {formError}
                </p>
              )}

              <div className="pt-2">
                <Button variant="primary" size="md" type="submit" disabled={sending} className="w-full" icon={<Send className="w-4 h-4" />}>
                  {sending ? "Sending…" : config.submitLabel}
                </Button>
                <p className="text-[11px] text-zinc-500 mt-3 leading-relaxed">
                  {config.consentText}
                  {config.privacyUrl && (
                    <>
                      {" "}
                      <a href={config.privacyUrl} className="underline hover:text-zinc-300">Privacy policy</a>.
                    </>
                  )}
                </p>
                <p className="sr-only">Enquiry for {ownerName}</p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
