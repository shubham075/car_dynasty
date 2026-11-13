import React from "react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { Container } from "@/components/common/Container";
import { BookButton } from "@/components/contact/BookButton";
import { ProjectStackSection } from "./project-stack-section";
import { HeroSection } from "@/components/hero/HeroSection";
import { AnimatedNumber } from "@/components/common/AnimatedNumber";
import { SplitComparison } from "@/components/bts/SplitComparison";
import { AmbientFlare } from "@/components/common/AmbientFlare";
import { Reveal } from "@/components/common/Reveal";
import { ScrollytellingLogo } from "@/components/common/ScrollytellingLogo";
import { WindTunnelGrid } from "@/components/common/WindTunnelGrid";
import { getSection } from "@/cms/settings";
import { getSite, getStats, getServices, getProcessSteps, getYouTubeVideos } from "@/cms/content";
import {
  MessageSquare,
  CheckCircle2,
  Sparkles,
  MapPin,
  ExternalLink,
  Film,
  Radio,
} from "lucide-react";

// Rendered once and cached as static HTML. Saving in the CMS revalidates it,
// so visitors never wait on the database.
export default function Home() {
  const site = getSite();
  const nav = getSection("nav");
  const hero = getSection("hero");
  const bts = getSection("bts");
  const servicesSection = getSection("servicesSection");
  const processSection = getSection("processSection");
  const youtubeSection = getSection("youtubeSection");
  const about = getSection("about");
  const cta = getSection("cta");
  const footer = getSection("footer");
  const stats = getStats();
  const services = getServices();
  const processSteps = getProcessSteps();
  const videos = getYouTubeVideos();

  return (
    <div className="min-h-screen bg-[#070809] flex flex-col text-zinc-100">
      <Navbar site={site} nav={nav} />

      <main className="flex-1 pt-20">
        {/* HERO SECTION */}
        <HeroSection hero={hero} site={site} />

        {/* VERIFIED FOOTPRINT / METRICS STRIP */}
        {stats.length > 0 && (
          <section className="border-y border-white/10 bg-[#0a0c0e] py-10">
            <Container size="wide">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((item) => (
                  <div key={item.id} className="flex flex-col border-l border-white/10 pl-6">
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
        )}

        {/* SELECTED WORK / CASE STUDIES SECTION */}
        <ProjectStackSection />

        {/* BEHIND THE FRAME (BTS) SECTION */}
        <section id="bts" className="py-24 border-b border-white/10 bg-[#060708]">
          <Container size="default">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 relative w-full border border-white/15 overflow-hidden shadow-2xl group">
                <SplitComparison beforeImage={bts.image} afterImage={bts.imageAfter} />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-mono-tech text-xs text-zinc-300 pointer-events-none z-40">
                  <span className="flex items-center gap-1.5 drop-shadow-md">
                    <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                    {bts.caption}
                  </span>
                  <span className="drop-shadow-md">{bts.specLabel}</span>
                </div>
              </div>

              <div className="lg:col-span-6 flex flex-col gap-4">
                <Reveal>
                  <span className="font-mono-tech text-xs uppercase tracking-widest text-[#ff4d00]">
                    {bts.eyebrow}
                  </span>
                  <h2 className="font-display text-4xl sm:text-5xl text-white tracking-wide">
                    {bts.title}
                  </h2>
                </Reveal>
                <Reveal delay={0.1}>
                  <p className="text-sm text-zinc-300 leading-relaxed">{bts.text}</p>
                </Reveal>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 font-mono-tech text-xs">
                  {bts.cards.map((card) => (
                    <div key={card.title} className="p-4 bg-[#0e1013] border border-white/10">
                      <span className="text-[#ff4d00] block text-base font-display mb-1">
                        {card.title}
                      </span>
                      <span className="text-zinc-400 text-[11px]">{card.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* PRODUCTION PACKAGES / SERVICES */}
        {services.length > 0 && (
          <section id="capabilities" className="py-24 border-b border-white/10 bg-[#090b0d] relative overflow-hidden">
            <ScrollytellingLogo text={servicesSection.marquee} type="horizontal-scroll" speed={0.8} />
            <AmbientFlare color="orange" position="left" />
            <Container size="default" className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-16">
                <Reveal>
                  <span className="font-mono-tech text-xs uppercase tracking-widest text-[#ff4d00]">
                    {servicesSection.eyebrow}
                  </span>
                  <h2 className="font-display text-4xl sm:text-6xl text-white tracking-wide mt-2">
                    {servicesSection.title}
                  </h2>
                </Reveal>
                <Reveal delay={0.2} direction="left">
                  <p className="text-sm text-zinc-400 max-w-md">{servicesSection.intro}</p>
                </Reveal>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {services.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="bg-[#0e1013] border border-white/10 p-8 flex flex-col justify-between hover:border-[#ff4d00]/50 transition-all"
                  >
                    <div>
                      <span className="font-mono-tech text-[10px] text-[#ff4d00] tracking-widest uppercase block mb-1">
                        {pkg.targetAudience.split(",")[0]}
                      </span>
                      <h3 className="font-display text-3xl text-white tracking-wide">{pkg.name}</h3>
                      <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{pkg.description}</p>

                      <div className="mt-6 pt-6 border-t border-white/5">
                        <span className="font-mono-tech text-[11px] uppercase tracking-wider text-zinc-300 block mb-3">
                          {servicesSection.deliverablesLabel}
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
                        <span>{servicesSection.turnaroundLabel}</span>
                        <span className="text-zinc-200">{pkg.turnaroundTime}</span>
                      </div>

                      <BookButton variant="outline" size="sm" className="w-full" cta="package" refName={pkg.name}>
                        {servicesSection.buttonLabel}
                      </BookButton>
                    </div>
                  </div>
                ))}
              </div>
            </Container>
          </section>
        )}

        {/* PROCESS SECTION: FROM IDEA TO FINAL FRAME */}
        {processSteps.length > 0 && (
          <section className="py-24 border-b border-white/10 bg-[#070809] relative overflow-hidden isolate">
            <WindTunnelGrid speed="normal" />
            <ScrollytellingLogo text={processSection.marquee} type="scale" speed={0.5} />
            <Container size="default" className="relative z-10">
              <Reveal>
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <span className="font-mono-tech text-xs uppercase tracking-widest text-[#ff4d00]">
                    {processSection.eyebrow}
                  </span>
                  <h2 className="font-display text-4xl sm:text-6xl text-white tracking-wide mt-2">
                    {processSection.title}
                  </h2>
                  <p className="text-sm text-zinc-400 mt-4 leading-relaxed">{processSection.intro}</p>
                </div>
              </Reveal>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {processSteps.map((step, idx) => (
                  <Reveal key={step.id} delay={idx * 0.1}>
                    <div className="p-6 bg-[#0c0e11]/90 backdrop-blur-sm border border-white/10 flex flex-col justify-between h-full relative group overflow-hidden transition-colors hover:border-[#ff4d00]/30 hover:bg-[#101216]">
                      <div className="relative z-10">
                        <span className="font-display text-5xl text-[#ff4d00] block mb-3 group-hover:scale-110 transition-transform origin-left">
                          {step.step}
                        </span>
                        <h4 className="font-display text-xl text-white tracking-wide">{step.title}</h4>
                        <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{step.description}</p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-white/5 relative z-10">
                        <ul className="flex flex-col gap-1.5 font-mono-tech text-[11px] text-zinc-400">
                          {step.tasks.map((task, taskIdx) => (
                            <li key={taskIdx} className="flex items-center gap-1.5">
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
        )}

        {/* YOUTUBE CURATED CHANNEL SHOWCASE */}
        {videos.length > 0 && (
          <section className="py-24 border-b border-white/10 bg-[#090b0d]">
            <Container size="wide">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <Reveal>
                  <span className="font-mono-tech text-xs uppercase tracking-widest text-[#ff4d00]">
                    {youtubeSection.eyebrow}
                  </span>
                  <h2 className="font-display text-4xl sm:text-6xl text-white tracking-wide mt-2">
                    {youtubeSection.title}
                  </h2>
                  <p className="text-sm text-zinc-400 mt-2">{youtubeSection.intro}</p>
                </Reveal>

                <a
                  href={site.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-mono-tech text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(220,38,38,0.25)] shrink-0"
                >
                  <Film className="w-4 h-4" />
                  <span>{youtubeSection.buttonLabel}</span>
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {videos.map((yt) => (
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
        )}

        {/* DIRECTOR & ABOUT SECTION */}
        <section id="about" className="py-24 border-b border-white/10 bg-[#070809] relative overflow-hidden">
          <ScrollytellingLogo text={about.marquee} type="rotate" speed={0.2} className="opacity-[0.015]" />
          <Container size="default" className="relative z-10">
            <Reveal>
              <div className="p-8 md:p-14 bg-[#0c0e11] border border-white/15">
                <div className="max-w-3xl">
                  <span className="font-mono-tech text-xs uppercase tracking-widest text-[#ff4d00]">
                    {about.eyebrow}
                  </span>
                  <h2 className="font-display text-4xl sm:text-6xl text-white tracking-wide mt-2">
                    {about.name}
                  </h2>
                  <h3 className="font-mono-tech text-sm text-zinc-300 mt-1 uppercase">{about.role}</h3>

                  <p className="text-sm sm:text-base text-zinc-300 mt-6 leading-relaxed">{about.quote}</p>
                  <p className="text-sm text-zinc-400 mt-4 leading-relaxed">{about.body}</p>

                  <div className="mt-8 pt-8 border-t border-white/10 flex flex-wrap items-center gap-6 font-mono-tech text-xs text-zinc-400">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#ff4d00]" />
                      <span>{about.locationLine}</span>
                    </div>
                    {about.facts.map((fact) => (
                      <React.Fragment key={fact}>
                        <div>•</div>
                        <div>{fact}</div>
                      </React.Fragment>
                    ))}
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
                  {cta.eyebrow}
                </span>
                <h2 className="font-display text-5xl sm:text-7xl text-white tracking-tight mt-2">
                  {cta.title}
                </h2>
                <p className="text-sm sm:text-base text-zinc-400 mt-4 leading-relaxed">{cta.text}</p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                  <BookButton variant="primary" size="lg" cta="contact-section" icon={<Sparkles className="w-4 h-4" />}>
                    {cta.primaryLabel}
                  </BookButton>

                  <a
                    href={site.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 font-mono-tech text-xs uppercase tracking-wider hover:border-emerald-500 transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{cta.whatsappLabel}</span>
                  </a>
                </div>
              </div>
            </Reveal>
          </Container>
        </section>
      </main>

      <Footer site={site} footer={footer} />
    </div>
  );
}
