"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/common/Button";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import { EnquiryModal } from "@/components/contact/EnquiryModal";
import { CREATOR_DATA } from "@/data/creator";
import { PROJECTS } from "@/data/projects";
import { SERVICES } from "@/data/services";
import { PROCESS_STEPS } from "@/data/process";
import { ProjectStack } from "@/components/portfolio/ProjectStack";
import { HeroSection } from "@/components/hero/HeroSection";
import { AnimatedNumber } from "@/components/common/AnimatedNumber";
import { SplitComparison } from "@/components/bts/SplitComparison";
import { AmbientFlare } from "@/components/common/AmbientFlare";
import { Reveal } from "@/components/common/Reveal";
import { ScrollytellingLogo } from "@/components/common/ScrollytellingLogo";
import { WindTunnelGrid } from "@/components/common/WindTunnelGrid";
import { YOUTUBE_SHOWCASE } from "@/data/youtube";
import {
  Play,
  MessageSquare,
  ArrowRight,
  Camera,
  Film,
  Compass,
  CheckCircle2,
  Sparkles,
  MapPin,
  ExternalLink,
  Sliders,
  Radio,
} from "lucide-react";

export default function Home() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "Supercar Showcase", "Car Meets & Rallies", "Commercial"];

  const filteredProjects =
    activeCategory === "All"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#070809] flex flex-col text-zinc-100">
      <Navbar onOpenBooking={() => setIsBookingOpen(true)} />

      <main className="flex-1 pt-20">
        {/* HERO SECTION */}
        <HeroSection onOpenBooking={() => setIsBookingOpen(true)} />

        {/* VERIFIED FOOTPRINT / METRICS STRIP */}
        <section className="border-y border-white/10 bg-[#0a0c0e] py-10">
          <Container size="wide">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {CREATOR_DATA.metrics.map((item, index) => (
                <div key={index} className="flex flex-col border-l border-white/10 pl-6">
                  <span className="font-display text-4xl sm:text-5xl lg:text-6xl text-white tracking-wider">
                    <AnimatedNumber value={item.value} />
                  </span>
                  <span className="font-mono-tech text-xs uppercase tracking-wider text-[#ff4d00] mt-1">
                    {item.label}
                  </span>
                  <span className="text-xs text-zinc-400 mt-0.5">
                    {item.detail}
                  </span>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* SELECTED WORK / CASE STUDIES SECTION */}
        <section id="work" className="py-24 border-b border-white/10 bg-[#08090b]">
          <Container size="wide">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <Reveal>
                <span className="font-mono-tech text-xs uppercase tracking-widest text-[#ff4d00]">
                  PORTFOLIO ARCHIVE
                </span>
                <h2 className="font-display text-4xl sm:text-6xl text-white tracking-wide mt-2">
                  SELECTED FILMS & SHOWCASES
                </h2>
              </Reveal>

              {/* Category Filter Tabs */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 text-xs font-mono-tech uppercase tracking-wider border transition-all cursor-pointer ${
                      activeCategory === cat
                        ? "bg-[#ff4d00] border-[#ff4d00] text-white"
                        : "bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:border-white/20"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Projects Grid */}
            <div className="mt-12">
              <ProjectStack projects={filteredProjects} />
            </div>
          </Container>
        </section>

        {/* BEHIND THE FRAME (BTS) SECTION */}
        <section id="bts" className="py-24 border-b border-white/10 bg-[#060708]">
          <Container size="default">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 relative w-full border border-white/15 overflow-hidden shadow-2xl group">
                <SplitComparison
                  beforeImage="/assets/bts/camera-rig.jpg"
                  afterImage="/assets/bts/camera-rig.jpg"
                />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-mono-tech text-xs text-zinc-300 pointer-events-none z-40">
                  <span className="flex items-center gap-1.5 drop-shadow-md">
                    <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                    SUCTION HOOD RIGGING SYSTEM
                  </span>
                  <span className="drop-shadow-md">4K ARRI / RED</span>
                </div>
              </div>

              <div className="lg:col-span-6 flex flex-col gap-4">
                <Reveal>
                  <span className="font-mono-tech text-xs uppercase tracking-widest text-[#ff4d00]">
                    BEHIND THE FRAME
                  </span>
                  <h2 className="font-display text-4xl sm:text-5xl text-white tracking-wide">
                    ENGINEERED FOR HIGH VELOCITY
                  </h2>
                </Reveal>
                <Reveal delay={0.1}>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Real speed cannot be faked in post. We mount cinema-grade cameras on high-speed pursuit vehicles and rigid carbon suction mounts to capture cars behaving authentically at the limit.
                  </p>
                </Reveal>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 font-mono-tech text-xs">
                  <div className="p-4 bg-[#0e1013] border border-white/10">
                    <span className="text-[#ff4d00] block text-base font-display mb-1">
                      CHASE PURSUIT VEHICLES
                    </span>
                    <span className="text-zinc-400 text-[11px]">
                      Hydra-arm and gyro-stabilized platforms tracking up to 100+ mph.
                    </span>
                  </div>

                  <div className="p-4 bg-[#0e1013] border border-white/10">
                    <span className="text-[#ff4d00] block text-base font-display mb-1">
                      ACOUSTIC EXHAUST CAPTURE
                    </span>
                    <span className="text-zinc-400 text-[11px]">
                      High-heat lavalier mics capturing unadulterated intake and exhaust tone.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* PRODUCTION PACKAGES / SERVICES */}
        <section id="capabilities" className="py-24 border-b border-white/10 bg-[#090b0d] relative overflow-hidden">
          <ScrollytellingLogo text="CINEMATICS // COMMISSIONS" type="horizontal-scroll" speed={0.8} />
          <AmbientFlare color="orange" position="left" />
          <Container size="default" className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-16">
              <Reveal>
                <span className="font-mono-tech text-xs uppercase tracking-widest text-[#ff4d00]">
                  SERVICES & PACKAGES
                </span>
                <h2 className="font-display text-4xl sm:text-6xl text-white tracking-wide mt-2">
                  COMMISSION CAPABILITIES
                </h2>
              </Reveal>
              <Reveal delay={0.2} direction="left">
                <p className="text-sm text-zinc-400 max-w-md">
                  Transparent production structures tailored for automotive brands, aftermarket builders, and private collectors.
                </p>
              </Reveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SERVICES.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-[#0e1013] border border-white/10 p-8 flex flex-col justify-between hover:border-[#ff4d00]/50 transition-all"
                >
                  <div>
                    <span className="font-mono-tech text-[10px] text-[#ff4d00] tracking-widest uppercase block mb-1">
                      {pkg.targetAudience.split(",")[0]}
                    </span>
                    <h3 className="font-display text-3xl text-white tracking-wide">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                      {pkg.description}
                    </p>

                    <div className="mt-6 pt-6 border-t border-white/5">
                      <span className="font-mono-tech text-[11px] uppercase tracking-wider text-zinc-300 block mb-3">
                        Included Deliverables:
                      </span>
                      <ul className="flex flex-col gap-2">
                        {pkg.deliverables.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#ff4d00] shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10">
                    <div className="flex items-center justify-between font-mono-tech text-[11px] text-zinc-400 mb-4">
                      <span>Turnaround:</span>
                      <span className="text-zinc-200">{pkg.turnaroundTime}</span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setIsBookingOpen(true)}
                    >
                      Enquire for This Package
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* PROCESS SECTION: FROM IDEA TO FINAL FRAME */}
        <section className="py-24 border-b border-white/10 bg-[#070809] relative overflow-hidden isolate">
          <WindTunnelGrid speed="normal" />
          <ScrollytellingLogo text="VELOCITY" type="scale" speed={0.5} />
          <Container size="default" className="relative z-10">
            <Reveal>
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="font-mono-tech text-xs uppercase tracking-widest text-[#ff4d00]">
                  FROM IDEA TO FINAL FRAME
                </span>
                <h2 className="font-display text-4xl sm:text-6xl text-white tracking-wide mt-2">
                  HOW WE EXECUTE
                </h2>
                <p className="text-sm text-zinc-400 mt-4 leading-relaxed">
                  A rigorous four-step automotive filmmaking pipeline ensuring zero downtime on shoot days and flawless color accuracy.
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PROCESS_STEPS.map((step, idx) => (
                <Reveal key={step.step} delay={idx * 0.1}>
                  <div
                    className="p-6 bg-[#0c0e11]/90 backdrop-blur-sm border border-white/10 flex flex-col justify-between h-full relative group overflow-hidden transition-colors hover:border-[#ff4d00]/30 hover:bg-[#101216]"
                  >
                    <div className="relative z-10">
                      <span className="font-display text-5xl text-[#ff4d00] block mb-3 group-hover:scale-110 transition-transform origin-left">
                        {step.step}
                      </span>
                      <h4 className="font-display text-xl text-white tracking-wide">
                        {step.title}
                      </h4>
                      <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                  <div className="mt-6 pt-4 border-t border-white/5 relative z-10">
                    <ul className="flex flex-col gap-1.5 font-mono-tech text-[11px] text-zinc-400">
                      {step.tasks.map((task, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="w-1 h-1 bg-[#ff4d00] group-hover:animate-ping" />
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Hover Micro-interaction Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#ff4d00]/0 via-[#ff4d00]/5 to-[#ff4d00]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
              </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {/* YOUTUBE CURATED CHANNEL SHOWCASE */}
        <section className="py-24 border-b border-white/10 bg-[#090b0d]">
          <Container size="wide">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <Reveal>
                <span className="font-mono-tech text-xs uppercase tracking-widest text-[#ff4d00]">
                  COMMUNITY FOOTPRINT
                </span>
                <h2 className="font-display text-4xl sm:text-6xl text-white tracking-wide mt-2">
                  YOUTUBE CHANNEL SHOWCASE
                </h2>
                <p className="text-sm text-zinc-400 mt-2">
                  Featuring 200+ videos and over 16,000+ car culture enthusiasts across India.
                </p>
              </Reveal>

              <a
                href={CREATOR_DATA.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-mono-tech text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(220,38,38,0.25)] shrink-0"
              >
                <Film className="w-4 h-4" />
                <span>Subscribe on YouTube</span>
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {YOUTUBE_SHOWCASE.map((yt) => (
                <a
                  key={yt.id}
                  href={yt.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 bg-[#0e1013] border border-white/10 flex flex-col justify-between hover:border-red-500/50 transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between font-mono-tech text-[10px] text-zinc-400 mb-3">
                      <span className="text-red-400 uppercase">{yt.category}</span>
                      <span>{yt.duration}</span>
                    </div>

                    <h4 className="font-display text-xl text-white group-hover:text-red-400 transition-colors line-clamp-2">
                      {yt.title}
                    </h4>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono-tech text-zinc-400">
                    <span>{yt.badge}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-red-400" />
                  </div>
                </a>
              ))}
            </div>
          </Container>
        </section>

        {/* DIRECTOR & ABOUT SECTION */}
        <section id="about" className="py-24 border-b border-white/10 bg-[#070809] relative overflow-hidden">
          <ScrollytellingLogo text="DIRECTOR" type="rotate" speed={0.2} className="opacity-[0.015]" />
          <Container size="default" className="relative z-10">
            <Reveal>
              <div className="p-8 md:p-14 bg-[#0c0e11] border border-white/15">
                <div className="max-w-3xl">
                  <span className="font-mono-tech text-xs uppercase tracking-widest text-[#ff4d00]">
                    THE DIRECTOR
                  </span>
                  <h2 className="font-display text-4xl sm:text-6xl text-white tracking-wide mt-2">
                    APOORVA SHRIVASTAVA
                  </h2>
                  <h3 className="font-mono-tech text-sm text-zinc-300 mt-1 uppercase">
                    FOUNDER & DIRECTOR OF CINEMATOGRAPHY // CAR DYNASTY
                  </h3>

                  <p className="text-sm sm:text-base text-zinc-300 mt-6 leading-relaxed">
                    "Cars are dynamic kinetic sculptures. They aren't meant to sit motionless under fluorescent lamps—they are designed to carve asphalt, displace air, and scream at redline. Car Dynasty was forged out of a singular obsession: documenting automotive culture in India with true cinematic discipline."
                  </p>

                  <p className="text-sm text-zinc-400 mt-4 leading-relaxed">
                    Operating out of Bhopal, Madhya Pradesh, we deploy custom camera rigs, pursuit vehicles, and cinema packages nationwide for commercial campaigns, supercar rallies, and private enthusiast features.
                  </p>

                  <div className="mt-8 pt-8 border-t border-white/10 flex flex-wrap items-center gap-6 font-mono-tech text-xs text-zinc-400">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#ff4d00]" />
                      <span>Based in Bhopal • Deploying Pan-India</span>
                    </div>
                    <div>•</div>
                    <div>16K+ YouTube Community</div>
                    <div>•</div>
                    <div>200+ Automotive Master Films</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </Container>
        </section>

        {/* COMMISSION CTA SECTION */}
        <section id="contact" className="py-24 bg-[#050607] relative overflow-hidden">
          <AmbientFlare color="red" position="center" className="opacity-15 blur-[150px]" />
          <Container size="default" className="text-center relative z-10">
            <Reveal delay={0.2} direction="up">
              <div className="max-w-2xl mx-auto">
                <span className="font-mono-tech text-xs uppercase tracking-widest text-[#ff4d00]">
                  COMMISSION A SHOOT
                </span>
                <h2 className="font-display text-5xl sm:text-7xl text-white tracking-tight mt-2">
                  LET'S CREATE SOMETHING MOVING.
                </h2>
                <p className="text-sm sm:text-base text-zinc-400 mt-4 leading-relaxed">
                  Whether you represent an automotive brand, organized car rally, or want a high-end cinematic feature of your vehicle, we deploy nationwide.
                </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setIsBookingOpen(true)}
                  icon={<Sparkles className="w-4 h-4" />}
                >
                  Book A Shoot Session
                </Button>

                <a
                  href={CREATOR_DATA.contacts.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 font-mono-tech text-xs uppercase tracking-wider hover:border-emerald-500 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Apoorva</span>
                </a>
              </div>
            </div>
            </Reveal>
          </Container>
        </section>
      </main>

      <Footer />

      <EnquiryModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
}
