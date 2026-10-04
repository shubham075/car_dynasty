"use client";

import React, { useEffect, useRef } from "react";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/common/Button";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import { ArrowRight, MessageSquare, Play } from "lucide-react";
import { CREATOR_DATA } from "@/data/creator";
import { gsap } from "gsap";

interface HeroSectionProps {
  onOpenBooking: () => void;
}

export function HeroSection({ onOpenBooking }: HeroSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Initial states
    gsap.set(headlineRef.current, { opacity: 0, y: 50 });
    gsap.set(subheadRef.current, { opacity: 0, y: 30 });
    gsap.set(ctaRef.current, { opacity: 0, y: 20 });
    gsap.set(videoRef.current, { scale: 0.92, opacity: 0 });

    tl.to(headlineRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      delay: 0.2,
    })
      .to(subheadRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
      }, "-=0.8")
      .to(ctaRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
      }, "-=0.6")
      .to(videoRef.current, {
        scale: 1,
        opacity: 1,
        duration: 1.5,
        ease: "power2.out",
      }, "-=0.8");

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section ref={containerRef} className="relative pt-12 pb-16 md:pt-16 md:pb-24 overflow-hidden">
      {/* Viewfinder Coordinates & Subtle Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <Container size="wide" className="relative z-10">
        {/* Viewfinder Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#121417] border border-white/10 text-[#ff4d00] font-mono-tech text-xs tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-[#ff4d00] animate-ping" />
            <span>DIRECTED BY {CREATOR_DATA.name.toUpperCase()}</span>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-300">BHOPAL • PAN-INDIA</span>
          </div>

          <div className="hidden sm:flex items-center gap-4 font-mono-tech text-[11px] text-zinc-400">
            <span>SHUTTER: 180°</span>
            <span>•</span>
            <span>ASPECT: 2.39:1</span>
            <span>•</span>
            <span>COLOR: ARRI LOG-C</span>
          </div>
        </div>

        {/* Cinematic Headline */}
        <div className="max-w-5xl mb-8">
          <h1 ref={headlineRef} className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white tracking-tight leading-[0.9]">
            CINEMATIC <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4d00] via-orange-400 to-amber-200">AUTOMOTIVE</span> STORYTELLING
          </h1>
          <p ref={subheadRef} className="mt-6 text-base sm:text-lg md:text-xl text-zinc-400 max-w-3xl leading-relaxed">
            High-end commercial films, raw car culture documentaries, and hypercar showcases. Delivering editorial visual power across India for brands, car meets, and discerning collectors.
          </p>
        </div>

        {/* CTAs */}
        <div ref={ctaRef} className="flex flex-wrap items-center gap-4 mb-12">
          <Button
            variant="primary"
            size="lg"
            onClick={onOpenBooking}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Discuss A Project
          </Button>

          <a
            href={CREATOR_DATA.contacts.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-950/40 border border-emerald-500/30 hover:border-emerald-500 hover:bg-emerald-900/50 text-emerald-400 font-mono-tech text-xs uppercase tracking-wider transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp Directly</span>
          </a>

          <a
            href="#work"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/5 border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white font-mono-tech text-xs uppercase tracking-wider transition-all"
          >
            <Play className="w-3.5 h-3.5 text-[#ff4d00]" />
            <span>Selected Works</span>
          </a>
        </div>

        {/* HERO VIDEO / POSTER SHOWCASE */}
        <div ref={videoRef} className="relative rounded-none border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.9)] transform-origin-top" data-cursor="view">
          <VideoPlayer
            posterSrc="/assets/hero/hero-poster.jpg"
            title="CAR DYNASTY // MASTER CINEMATIC REEL 2026"
            aspectRatio="21/9"
          />
        </div>
      </Container>
    </section>
  );
}
