"use client";

import React from "react";
import { CREATOR_DATA } from "@/data/creator";
import { MessageSquare } from "lucide-react";

export function WhatsAppCTA({ className }: { className?: string }) {
  return (
    <a
      href={CREATOR_DATA.contacts.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2.5 px-5 py-3 font-mono-tech text-xs uppercase tracking-wider text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 hover:border-emerald-400 hover:bg-emerald-900/60 shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all ${className}`}
    >
      <MessageSquare className="w-4 h-4 text-emerald-400" />
      <span>Quick WhatsApp Chat</span>
    </a>
  );
}
