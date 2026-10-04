"use client";

import React, { useState, useEffect } from "react";
import { Settings2, Grid, Sparkles, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

type TextureType = "none" | "carbon" | "asphalt" | "metal";

const TEXTURES: { key: TextureType; label: string; icon: React.ReactNode }[] = [
  { key: "none",    label: "Solid Black (None)",  icon: <Minus className="w-4 h-4" /> },
  { key: "carbon",  label: "Matte Carbon Fiber",  icon: <Grid className="w-4 h-4" /> },
  { key: "asphalt", label: "Midnight Asphalt",    icon: <Sparkles className="w-4 h-4" /> },
  { key: "metal",   label: "Brushed Gunmetal",    icon: <Settings2 className="w-4 h-4" /> },
];

const ALL_TEXTURE_CLASSES = ["texture-carbon", "texture-asphalt", "texture-metal"];

export function TextureDevToolbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTexture, setActiveTexture] = useState<TextureType>("asphalt");

  useEffect(() => {
    const body = document.body;
    // Remove all existing texture classes
    body.classList.remove(...ALL_TEXTURE_CLASSES);
    // Add new one if not "none"
    if (activeTexture !== "none") {
      body.classList.add(`texture-${activeTexture}`);
    }
  }, [activeTexture]);

  return (
    <div className="fixed bottom-6 left-6 z-[9999] flex flex-col items-start gap-3">
      {isOpen && (
        <div className="bg-[#0c0e11]/95 border border-white/15 p-4 rounded-lg shadow-2xl backdrop-blur-md flex flex-col gap-2 min-w-[240px]">
          <p className="font-mono-tech text-[10px] text-[#ff4d00] uppercase tracking-widest border-b border-white/10 pb-2 mb-1">
            Background Textures
          </p>
          {TEXTURES.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveTexture(key)}
              className={cn(
                "flex items-center gap-3 text-xs font-mono-tech uppercase tracking-wider px-3 py-2 transition-all border rounded text-left",
                activeTexture === key
                  ? "border-[#ff4d00] text-[#ff4d00] bg-[#ff4d00]/10"
                  : "border-transparent text-zinc-400 hover:text-white hover:border-white/10"
              )}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "p-3 rounded-full transition-all shadow-lg border",
          isOpen
            ? "bg-[#ff4d00] border-[#ff4d00] text-white shadow-[0_0_20px_rgba(255,77,0,0.5)]"
            : "bg-zinc-900 border-white/10 text-zinc-300 hover:border-white/30 hover:text-white"
        )}
        aria-label="Toggle Texture Toolbar"
        title="Background Textures"
      >
        <Grid className="w-5 h-5" />
      </button>
    </div>
  );
}
