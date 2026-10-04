"use client";

import React, { useState } from "react";
import { X, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/common/Button";
import { CREATOR_DATA } from "@/data/creator";

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EnquiryModal({ isOpen, onClose }: EnquiryModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    shootType: "Commercial Campaign",
    vehicleOrBrand: "",
    location: "Bhopal",
    details: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `*Shoot Enquiry — Car Dynasty*%0A*Name:* ${formData.name}%0A*Contact:* ${formData.contact}%0A*Type:* ${formData.shootType}%0A*Vehicle/Brand:* ${formData.vehicleOrBrand}%0A*Location:* ${formData.location}%0A*Details:* ${formData.details}`;
    
    window.open(`https://wa.me/${CREATOR_DATA.contacts.whatsapp}?text=${message}`, "_blank");
    setSubmitted(true);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative w-full max-w-xl bg-[#0d0f12] border border-white/15 p-6 md:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-zinc-400 hover:text-white border border-white/10 cursor-pointer"
          aria-label="Close Enquiry Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-12 flex flex-col items-center text-center gap-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
            <h3 className="font-display text-3xl text-white">ENQUIRY DISPATCHED</h3>
            <p className="text-sm text-zinc-400 max-w-md">
              Your shoot brief has been transferred to Apoorva Shrivastava on WhatsApp. We typically respond within 2-4 hours.
            </p>
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
            >
              Close Window
            </Button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="font-mono-tech text-xs uppercase tracking-widest text-[#ff4d00]">
                PROJECT DISPATCH // DIRECT TO DIRECTOR
              </span>
              <h3 id="modal-title" className="font-display text-3xl text-white tracking-wide mt-1">
                BOOK AN AUTOMOTIVE SHOOT
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Commercial campaigns, car meets, exotic private films across India.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="enquiry-name" className="block font-mono-tech text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5">
                    Your Name / Company
                  </label>
                  <input
                    id="enquiry-name"
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma / Speedcraft"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#14161a] border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#ff4d00] focus-visible:ring-1 focus-visible:ring-[#ff4d00]"
                  />
                </div>

                <div>
                  <label htmlFor="enquiry-contact" className="block font-mono-tech text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5">
                    WhatsApp / Phone
                  </label>
                  <input
                    id="enquiry-contact"
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full bg-[#14161a] border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#ff4d00] focus-visible:ring-1 focus-visible:ring-[#ff4d00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="enquiry-type" className="block font-mono-tech text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5">
                    Shoot Category
                  </label>
                  <select
                    id="enquiry-type"
                    value={formData.shootType}
                    onChange={(e) => setFormData({ ...formData, shootType: e.target.value })}
                    className="w-full bg-[#14161a] border border-white/10 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff4d00] focus-visible:ring-1 focus-visible:ring-[#ff4d00]"
                  >
                    <option value="Commercial Campaign">Commercial Campaign</option>
                    <option value="Car Meet & Rally">Car Meet & Rally</option>
                    <option value="Supercar Private Film">Supercar Private Film</option>
                    <option value="Social / Reels Production">Social / Reels Production</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="enquiry-location" className="block font-mono-tech text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5">
                    Shoot Location
                  </label>
                  <input
                    id="enquiry-location"
                    type="text"
                    required
                    placeholder="e.g. Bhopal, Indore, Mumbai..."
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-[#14161a] border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#ff4d00] focus-visible:ring-1 focus-visible:ring-[#ff4d00]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="enquiry-vehicle" className="block font-mono-tech text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5">
                  Vehicle(s) / Brand Focus
                </label>
                <input
                  id="enquiry-vehicle"
                  type="text"
                  placeholder="e.g. Porsche 911 GT3 / BMW M3 / Tuner Fleet"
                  value={formData.vehicleOrBrand}
                  onChange={(e) => setFormData({ ...formData, vehicleOrBrand: e.target.value })}
                  className="w-full bg-[#14161a] border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#ff4d00] focus-visible:ring-1 focus-visible:ring-[#ff4d00]"
                />
              </div>

              <div>
                <label htmlFor="enquiry-details" className="block font-mono-tech text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5">
                  Vision / Project Notes
                </label>
                <textarea
                  id="enquiry-details"
                  rows={3}
                  placeholder="Tell us about the deliverable, desired timeline, or aesthetic..."
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="w-full bg-[#14161a] border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#ff4d00] focus-visible:ring-1 focus-visible:ring-[#ff4d00]"
                />
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  size="md"
                  type="submit"
                  className="w-full"
                  icon={<Send className="w-4 h-4" />}
                >
                  Send Brief via WhatsApp
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
