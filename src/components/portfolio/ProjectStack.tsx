"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Camera, ArrowRight } from "lucide-react";
import { Project } from "@/data/projects";

gsap.registerPlugin(ScrollTrigger);

interface ProjectStackProps {
  projects: Project[];
}

export function ProjectStack({ projects }: ProjectStackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !containerRef.current || projects.length === 0) return;

    const cards = cardsRef.current.filter(Boolean);
    if (cards.length === 0) return;

    // Set up the sticky stack animation using ScrollTrigger
    cards.forEach((card, i) => {
      if (i === cards.length - 1) return; // Last card doesn't need to scale down
      
      const nextCard = cards[i + 1];
      if (!nextCard) return;

      gsap.to(card, {
        scale: 0.95,
        opacity: 0.5,
        transformOrigin: "top center",
        ease: "none",
        scrollTrigger: {
          trigger: nextCard,
          start: "top bottom", // Start when next card enters viewport
          end: "top 120px",    // End when next card reaches sticky position
          scrub: true,
          invalidateOnRefresh: true,
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [projects]);

  return (
    <div ref={containerRef} className="relative w-full flex flex-col pb-24">
      {projects.map((project, i) => (
        <div
          key={project.id}
          ref={(el) => {
            cardsRef.current[i] = el;
          }}
          className="sticky top-[120px] mb-12 lg:mb-24 bg-[#0e1013] border border-white/10 overflow-hidden group hover:border-[#ff4d00]/50 transition-all duration-300 w-full max-w-5xl mx-auto shadow-2xl origin-top"
        >
          <div className="grid grid-cols-1 md:grid-cols-12">
            {/* Media Container */}
            <div className="relative aspect-[16/9] md:aspect-auto md:h-full md:col-span-8 overflow-hidden bg-black" data-cursor="view">
              <Image
                src={project.heroImage}
                alt={project.title}
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-transparent to-black/30 pointer-events-none" />

              <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/70 backdrop-blur-sm border border-white/15 font-mono-tech text-[10px] text-[#ff4d00] uppercase tracking-wider">
                {project.category}
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-mono-tech text-xs text-zinc-300">
                <span>{project.vehicle}</span>
                <span>{project.year}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 md:p-10 flex flex-col justify-between md:col-span-4 bg-[#0e1013]">
              <div>
                <span className="font-mono-tech text-[10px] uppercase text-zinc-500 block mb-2">{String(i + 1).padStart(2, '0')} — PROJECT</span>
                <h3 className="font-display text-3xl md:text-4xl text-white group-hover:text-[#ff4d00] transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-zinc-400 mt-4 leading-relaxed">
                  {project.subtitle}
                </p>

                <div className="mt-6 pt-6 border-t border-white/5 flex flex-col gap-3 text-xs font-mono-tech text-zinc-400">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-[#ff4d00]" />
                    <span>{project.techSpecs.camera}</span>
                  </div>
                  <div>• {project.techSpecs.framerate}</div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <Link
                  href={`/projects/${project.slug}`}
                  className="inline-flex items-center justify-between w-full py-3 px-5 bg-white/5 hover:bg-[#ff4d00] border border-white/10 hover:border-[#ff4d00] text-zinc-200 hover:text-white font-mono-tech text-xs uppercase tracking-wider transition-all group/btn"
                >
                  <span>Explore Case Study</span>
                  <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
