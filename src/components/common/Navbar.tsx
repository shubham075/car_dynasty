"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "./Button";
import { useBooking } from "@/components/contact/BookingProvider";
import type { Site } from "@/cms/content";
import type { SectionValue } from "@/cms/schema";
import { MessageSquare, Menu, X, Video } from "lucide-react";

interface NavbarProps {
  site: Pick<Site, "brandName" | "monogram" | "youtube" | "whatsappUrl">;
  nav: SectionValue<"nav">;
}

export function Navbar({ site, nav }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { open } = useBooking();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#070809]/85 backdrop-blur-md border-b border-white/8 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="w-10 h-10 bg-[#121417] border border-white/15 flex items-center justify-center text-[#ff4d00] font-display text-2xl group-hover:border-[#ff4d00] transition-colors">
            {site.monogram}
          </div>
          <div className="flex flex-col">
            <span className="font-display text-2xl tracking-wider text-white group-hover:text-[#ff4d00] transition-colors leading-none">
              {site.brandName.toUpperCase()}
            </span>
            <span className="font-mono-tech text-[10px] text-zinc-400 tracking-widest mt-0.5">
              {nav.brandSub}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {nav.links.map((link) => (
            <Link
              key={link.href + link.label}
              href={link.href.startsWith("#") ? `/${link.href}` : link.href}
              className="font-mono-tech text-xs uppercase tracking-widest text-zinc-300 hover:text-[#ff4d00] transition-colors focus-visible:outline-none focus-visible:text-[#ff4d00]"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={site.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono-tech text-xs uppercase tracking-widest text-zinc-400 hover:text-red-500 transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:text-red-500"
          >
            <Video className="w-3.5 h-3.5 text-red-500" />
            <span>{nav.channelLabel}</span>
          </a>
        </nav>

        {/* Action CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href={site.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono-tech uppercase tracking-wider text-emerald-400 bg-emerald-950/30 border border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-900/40 transition-all"
            title="Chat on WhatsApp"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{nav.whatsappLabel}</span>
          </a>

          <Button variant="primary" size="sm" onClick={() => open({ cta: "navbar" })}>
            {nav.bookLabel}
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-zinc-300 hover:text-white border border-white/10 focus-visible:outline-none focus-visible:border-white focus-visible:text-white"
          aria-label="Toggle Navigation"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0c0e] border-b border-white/10 px-6 py-6 flex flex-col gap-4">
          {nav.links.map((link) => (
            <Link
              key={link.href + link.label}
              href={link.href.startsWith("#") ? `/${link.href}` : link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="font-mono-tech text-sm tracking-wider uppercase text-zinc-200 py-2 border-b border-white/5"
            >
              {link.mobileLabel || link.label}
            </Link>
          ))}
          <div className="pt-2 flex flex-col gap-3">
            <a
              href={site.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 font-mono-tech text-xs uppercase tracking-wider"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{nav.mobileWhatsappLabel}</span>
            </a>
            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={() => {
                setMobileMenuOpen(false);
                open({ cta: "navbar-mobile" });
              }}
            >
              {nav.mobileBookLabel}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
