import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PROJECTS } from "@/data/projects";
import { CREATOR_DATA } from "@/data/creator";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/common/Button";
import {
  ArrowLeft,
  Camera,
  MapPin,
  Calendar,
  Layers,
  CheckCircle2,
  MessageSquare,
  Sparkles,
} from "lucide-react";

export function generateStaticParams() {
  return PROJECTS.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#070809] flex flex-col text-zinc-100">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <Container size="default">
          {/* Back Navigation */}
          <div className="mb-8">
            <Link
              href="/#work"
              className="inline-flex items-center gap-2 font-mono-tech text-xs uppercase tracking-wider text-zinc-400 hover:text-[#ff4d00] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Film Showcase</span>
            </Link>
          </div>

          {/* Project Title Header */}
          <div className="mb-10">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-[#ff4d00]/10 border border-[#ff4d00]/30 text-[#ff4d00] font-mono-tech text-xs uppercase tracking-wider">
                {project.category}
              </span>
              <span className="font-mono-tech text-xs text-zinc-400 uppercase">
                {project.vehicle}
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl text-white tracking-tight leading-tight">
              {project.title}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-zinc-400 max-w-3xl leading-relaxed">
              {project.subtitle}
            </p>
          </div>

          {/* Hero Media Display */}
          <div className="relative aspect-[21/9] w-full overflow-hidden border border-white/15 bg-black shadow-2xl mb-12">
            <Image
              src={project.heroImage}
              alt={project.title}
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Viewfinder HUD */}
            <div className="absolute top-4 left-4 flex items-center gap-2 font-mono-tech text-[11px] text-zinc-300">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
              <span>MASTER FILE // 4K 2.39:1</span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-mono-tech text-xs text-zinc-300">
              <span>{project.location}</span>
              <span className="hidden sm:block">DIRECTED BY {CREATOR_DATA.name.toUpperCase()}</span>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-[#0e1013] border border-white/10 mb-16 font-mono-tech text-xs">
            <div>
              <span className="text-zinc-500 uppercase block mb-1">Vehicle</span>
              <span className="text-zinc-200">{project.vehicle}</span>
            </div>
            <div>
              <span className="text-zinc-500 uppercase block mb-1">Client / Type</span>
              <span className="text-zinc-200">{project.client}</span>
            </div>
            <div>
              <span className="text-zinc-500 uppercase block mb-1">Location</span>
              <span className="text-zinc-200">{project.location}</span>
            </div>
            <div>
              <span className="text-zinc-500 uppercase block mb-1">Year</span>
              <span className="text-zinc-200">{project.year}</span>
            </div>
          </div>

          {/* Narrative & Direction */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
            <div className="md:col-span-7 flex flex-col gap-6">
              <div>
                <span className="font-mono-tech text-xs uppercase tracking-widest text-[#ff4d00]">
                  THE ASSIGNMENT
                </span>
                <h3 className="font-display text-2xl text-white mt-1">THE BRIEF</h3>
                <p className="text-sm text-zinc-300 mt-2 leading-relaxed">
                  {project.brief}
                </p>
              </div>

              <div>
                <span className="font-mono-tech text-xs uppercase tracking-widest text-[#ff4d00]">
                  APPROACH
                </span>
                <h3 className="font-display text-2xl text-white mt-1">CREATIVE DIRECTION</h3>
                <p className="text-sm text-zinc-300 mt-2 leading-relaxed">
                  {project.creativeDirection}
                </p>
              </div>

              <div>
                <span className="font-mono-tech text-xs uppercase tracking-widest text-[#ff4d00]">
                  EXECUTION
                </span>
                <h3 className="font-display text-2xl text-white mt-1">PRODUCTION NOTES</h3>
                <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                  {project.description}
                </p>
              </div>
            </div>

            {/* Technical Camera & Rig Specs Box */}
            <div className="md:col-span-5 bg-[#0b0d10] border border-white/10 p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4 text-[#ff4d00]">
                  <Camera className="w-5 h-5" />
                  <span className="font-mono-tech text-xs uppercase tracking-widest text-zinc-200">
                    CAMERA & TECH SPECS
                  </span>
                </div>

                <div className="flex flex-col gap-3 font-mono-tech text-xs divide-y divide-white/5">
                  <div className="pt-2">
                    <span className="text-zinc-500 block text-[11px]">Primary Camera</span>
                    <span className="text-zinc-200">{project.techSpecs.camera}</span>
                  </div>
                  <div className="pt-2">
                    <span className="text-zinc-500 block text-[11px]">Optics / Lenses</span>
                    <span className="text-zinc-200">{project.techSpecs.lens}</span>
                  </div>
                  <div className="pt-2">
                    <span className="text-zinc-500 block text-[11px]">Rigging System</span>
                    <span className="text-zinc-200">{project.techSpecs.rig}</span>
                  </div>
                  <div className="pt-2">
                    <span className="text-zinc-500 block text-[11px]">Capture Resolution</span>
                    <span className="text-zinc-200">{project.techSpecs.resolution}</span>
                  </div>
                  <div className="pt-2">
                    <span className="text-zinc-500 block text-[11px]">Framerate</span>
                    <span className="text-zinc-200">{project.techSpecs.framerate}</span>
                  </div>
                  <div className="pt-2">
                    <span className="text-zinc-500 block text-[11px]">Color Pipeline</span>
                    <span className="text-zinc-200">{project.techSpecs.colorGrade}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <span className="font-mono-tech text-[11px] uppercase tracking-wider text-zinc-400 block mb-2">
                  Delivered Assets:
                </span>
                <ul className="flex flex-col gap-1.5">
                  {project.services.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-zinc-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#ff4d00] shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Stills Gallery */}
          {project.gallery.length > 0 && (
            <div className="mb-20">
              <span className="font-mono-tech text-xs uppercase tracking-widest text-[#ff4d00]">
                PRODUCTION STILLS
              </span>
              <h3 className="font-display text-3xl text-white mt-1 mb-6">
                FRAME CAPTURES
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.gallery.map((media, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-[16/9] w-full overflow-hidden border border-white/10 bg-black group"
                  >
                    <Image
                      src={media.url}
                      alt={media.caption || `Frame ${idx + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {media.caption && (
                      <div className="absolute bottom-0 inset-x-0 bg-black/70 backdrop-blur-sm p-3 font-mono-tech text-[11px] text-zinc-300">
                        {media.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Commission Similar Shoot CTA */}
          <div className="p-8 md:p-12 bg-[#0e1013] border border-white/15 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <span className="font-mono-tech text-xs text-[#ff4d00] uppercase tracking-wider">
                COMMISSION THE TEAM
              </span>
              <h3 className="font-display text-3xl sm:text-4xl text-white mt-1">
                COMMISSION A SIMILAR AUTOMOTIVE PRODUCTION
              </h3>
              <p className="text-sm text-zinc-400 max-w-xl mt-2">
                Deploying across Bhopal and Pan-India. Let's create an unforgettable visual campaign for your machine or brand.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <a
                href={CREATOR_DATA.contacts.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-emerald-950/40 border border-emerald-500/30 hover:border-emerald-500 text-emerald-400 font-mono-tech text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Directly</span>
              </a>
              <Link href="/#contact">
                <Button variant="primary" size="md" icon={<Sparkles className="w-4 h-4" />}>
                  Book Shoot
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
