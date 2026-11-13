"use client";

import React, { useState } from "react";
import { ProjectStack } from "@/components/portfolio/ProjectStack";
import { Reveal } from "@/components/common/Reveal";
import type { Project } from "@/cms/content";

interface HomeProjectsProps {
  projects: Project[];
  /** Filter buttons, in order (without "All"). */
  categories: string[];
  eyebrow: string;
  title: string;
  allLabel: string;
}

/** Section heading, category filter and stacked project cards — the interactive part of the work section. */
export function HomeProjects({ projects, categories, eyebrow, title, allLabel }: HomeProjectsProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const tabs = ["All", ...categories];

  const filtered = activeCategory === "All" ? projects : projects.filter((p) => p.category === activeCategory);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <Reveal>
          <span className="font-mono-tech text-xs uppercase tracking-widest text-[#ff4d00]">{eyebrow}</span>
          <h2 className="font-display text-4xl sm:text-6xl text-white tracking-wide mt-2">{title}</h2>
        </Reveal>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs font-mono-tech uppercase tracking-wider border transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-[#ff4d00] border-[#ff4d00] text-white"
                  : "bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:border-white/20"
              }`}
            >
              {cat === "All" ? allLabel : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="mt-12">
        <ProjectStack projects={filtered} />
      </div>
    </>
  );
}
