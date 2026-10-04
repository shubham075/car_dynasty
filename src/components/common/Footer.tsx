import React from "react";
import Link from "next/link";
import { CREATOR_DATA } from "@/data/creator";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";

function YoutubeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#050607] border-t border-white/10 pt-16 pb-12 text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-14 border-b border-white/8">
          {/* Brand & Manifesto */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 bg-[#121417] border border-white/15 flex items-center justify-center text-[#ff4d00] font-display text-xl">
                CD
              </span>
              <span className="font-display text-3xl tracking-wider text-white">
                CAR DYNASTY
              </span>
            </div>
            <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
              Automotive cinematography, commercial storytelling, and car culture documentation. Directed by {CREATOR_DATA.name}. Based in Bhopal, deploying across India.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono-tech text-zinc-400">
              <MapPin className="w-3.5 h-3.5 text-[#ff4d00]" />
              <span>Bhopal, Madhya Pradesh • Pan-India Shoots</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <h4 className="font-mono-tech text-xs uppercase tracking-widest text-zinc-200">
              Navigation
            </h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <Link href="#work" className="hover:text-[#ff4d00] transition-colors">
                  Commercial & Feature Films
                </Link>
              </li>
              <li>
                <Link href="#capabilities" className="hover:text-[#ff4d00] transition-colors">
                  Production Packages
                </Link>
              </li>
              <li>
                <Link href="#bts" className="hover:text-[#ff4d00] transition-colors">
                  Behind The Frame / Grade
                </Link>
              </li>
              <li>
                <Link href="#about" className="hover:text-[#ff4d00] transition-colors">
                  Apoorva Shrivastava
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Contact & Social */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <h4 className="font-mono-tech text-xs uppercase tracking-widest text-zinc-200">
              Direct Contact
            </h4>
            <div className="flex flex-col gap-2.5 text-sm">
              <a
                href={`mailto:${CREATOR_DATA.contacts.email}`}
                className="flex items-center gap-2 hover:text-[#ff4d00] transition-colors font-mono-tech text-xs"
              >
                <Mail className="w-4 h-4 text-[#ff4d00]" />
                <span>{CREATOR_DATA.contacts.email}</span>
              </a>
              <a
                href={`tel:${CREATOR_DATA.contacts.phone}`}
                className="flex items-center gap-2 hover:text-[#ff4d00] transition-colors font-mono-tech text-xs"
              >
                <Phone className="w-4 h-4 text-[#ff4d00]" />
                <span>{CREATOR_DATA.contacts.phone}</span>
              </a>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <a
                href={CREATOR_DATA.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white/5 border border-white/10 hover:border-red-500 hover:text-red-500 transition-colors"
                title="YouTube Channel (16K+ Subs)"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
              <a
                href={CREATOR_DATA.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white/5 border border-white/10 hover:border-pink-500 hover:text-pink-500 transition-colors"
                title="Instagram Profile"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={CREATOR_DATA.contacts.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 font-mono-tech text-xs hover:border-emerald-500"
              >
                <span>WhatsApp Chat</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Legal & Meta */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-tech text-zinc-400">
          <div>
            © {new Date().getFullYear()} CAR DYNASTY. All rights reserved. Directed by Apoorva Shrivastava.
          </div>
          <div className="flex items-center gap-4 text-zinc-400">
            <span>4K CINEMA</span>
            <span>•</span>
            <span>ANAMORPHIC RIGS</span>
            <span>•</span>
            <span>FPV DRONE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
