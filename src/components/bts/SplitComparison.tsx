"use client";

import React, { useState, useRef, MouseEvent, TouchEvent } from "react";
import Image from "next/image";

interface SplitComparisonProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export function SplitComparison({
  beforeImage,
  afterImage,
  beforeLabel = "RAW (ARRI LOG-C)",
  afterLabel = "FINAL GRADE",
}: SplitComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current || !isDragging) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    
    setSliderPosition(percent);
  };

  const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
  const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);

  const stopDragging = () => setIsDragging(false);

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-[16/9] overflow-hidden select-none"
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
      onMouseUp={stopDragging}
      onMouseLeave={stopDragging}
      onTouchEnd={stopDragging}
      data-cursor="view"
    >
      {/* After Image (Background) */}
      <Image
        src={afterImage}
        alt={afterLabel}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
      <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm border border-white/15 px-2.5 py-1 font-mono-tech text-[10px] text-[#ff4d00] uppercase tracking-wider z-10">
        {afterLabel}
      </div>

      {/* Before Image (Foreground, clipped) */}
      <div 
        className="absolute inset-0 z-20 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <div className="relative w-full h-full" style={{ width: `${100 / (sliderPosition / 100)}%` }}>
           <Image
            src={beforeImage}
            alt={beforeLabel}
            fill
            className="object-cover"
            style={{ filter: "grayscale(20%) contrast(80%) brightness(120%) opacity(0.8)" }} // Simulating RAW LOG for placeholder
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm border border-white/15 px-2.5 py-1 font-mono-tech text-[10px] text-zinc-400 uppercase tracking-wider">
          {beforeLabel}
        </div>
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute inset-y-0 z-30 w-1 bg-[#ff4d00] cursor-col-resize flex items-center justify-center -ml-0.5"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
      >
        <div className="w-6 h-12 bg-[#ff4d00] border border-white/20 rounded shadow-lg flex items-center justify-center">
          <div className="flex gap-0.5">
            <div className="w-0.5 h-4 bg-white/50" />
            <div className="w-0.5 h-4 bg-white/50" />
          </div>
        </div>
      </div>
    </div>
  );
}
