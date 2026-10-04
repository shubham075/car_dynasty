export interface ServicePackage {
  id: string;
  name: string;
  tagline: string;
  targetAudience: string;
  description: string;
  deliverables: string[];
  specs: string[];
  turnaroundTime: string;
  recommendedFor: string;
}

export const SERVICES: ServicePackage[] = [
  {
    id: "brand-commercial",
    name: "Commercial Brand Film",
    tagline: "High-impact visual authority for automotive brands, dealerships, and tuners",
    targetAudience: "Automotive OEMs, Aftermarket Manufacturers, Tuners, Detailing Studios",
    description: "Full-scale commercial production crafted to elevate brand perception and drive commercial conversion. Includes creative treatment, location permit scouting, cinema camera package, dynamic lighting, and targeted ad cuts.",
    deliverables: [
      "60-90s 4K Flagship Brand Commercial",
      "3x 9:16 High-Retention Social Reels / Ads",
      "15x High-Resolution Color-Graded Stills",
      "Licensed Commercial Soundtrack & SFX Mix",
    ],
    specs: [
      "Cinema Camera Rigs (ARRI / RED / FX6)",
      "Anamorphic Glass & Pro Mist Filtering",
      "High-Speed Chase Car Tracking",
      "Dedicated Drone Aerials",
    ],
    turnaroundTime: "5 - 7 Business Days",
    recommendedFor: "Product launches, brand campaigns, dealership promotional reels.",
  },
  {
    id: "event-rally",
    name: "Car Meet & Rally Coverage",
    tagline: "Festival-energy documentation, rolling convoys, and rapid social dispatches",
    targetAudience: "Car Clubs, Rally Organizers, Track Day Promoters, Supercar Runs",
    description: "Comprehensive multi-perspective event documentation designed to capture the raw atmosphere, rev battles, and participant community. Engineered for maximum organic reach with same-day teaser delivery.",
    deliverables: [
      "Official 4K Cinematic Event Aftermovie (2-4 min)",
      "Same-Day Rapid Hype Reel for Instagram/YouTube",
      "Roving Handheld & Gimbal Rolling Shots",
      "Full Raw 4K Archive Download Link",
    ],
    specs: [
      "Dual Camera Crew Deployment",
      "FPV Drone Tracking Over Convoys",
      "Engine & Exhaust External Audio Capture",
      "Custom Graphic Title Cards",
    ],
    turnaroundTime: "24-48 Hours for Teasers / 4 Days for Master",
    recommendedFor: "Supercar rallies, track days, tuning expos, national car meets.",
  },
  {
    id: "collector-supercar",
    name: "Private Collector Showcase",
    tagline: "A bespoke legacy cinema piece dedicated to your exotic machine",
    targetAudience: "Supercar Owners, Classic Car Collectors, Bespoke Tuner Builds",
    description: "An intimate, museum-grade cinematography session dedicated to a single vehicle or private collection. Captures every body line, aero channel, interior stitch, and mechanical exhaust note at speed.",
    deliverables: [
      "3-Minute 4K Anamorphic Feature Film",
      "60s Hyper-Vertical Instagram Reel",
      "Framed 4K Master Video File for Personal Display",
      "Complete Editorial Stills Gallery",
    ],
    specs: [
      "Private Scenic Location or Controlled Runway",
      "Rigged Suction Cameras for Dynamic Angles",
      "Exhaust Tone Mastering & Sound Design",
      "Obsidian Color Grade Tailored to Car Paint",
    ],
    turnaroundTime: "3 - 5 Business Days",
    recommendedFor: "Porsche GT models, Ferraris, Lamborghinis, bespoke tuner builds.",
  },
];
