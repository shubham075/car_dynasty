export interface ProjectMedia {
  type: "image" | "video";
  url: string;
  caption?: string;
  aspectRatio?: "16/9" | "21/9" | "4/5";
}

export interface TechnicalSpecs {
  camera: string;
  lens: string;
  rig: string;
  resolution: string;
  framerate: string;
  colorGrade: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: "Commercial" | "Car Meets & Rallies" | "Supercar Showcase" | "Social Cut";
  vehicle: string;
  client: string;
  year: string;
  location: string;
  heroImage: string;
  videoUrl?: string;
  brief: string;
  creativeDirection: string;
  description: string;
  services: string[];
  techSpecs: TechnicalSpecs;
  gallery: ProjectMedia[];
  featured: boolean;
  order: number;
}

export const PROJECTS: Project[] = [
  {
    id: "proj-01",
    slug: "porsche-gt3-alpine-dusk",
    title: "ALPINE VELOCITY // GT3 DUSK RUN",
    subtitle: "High-speed tracking film capturing mechanical aggression on wet tarmac",
    category: "Supercar Showcase",
    vehicle: "Porsche 911 GT3 (992)",
    client: "Private Collector Commission",
    year: "2026",
    location: "Highland Pass, India",
    heroImage: "/assets/projects/supercar-rolling.jpg",
    brief: "Capture the pure atmospheric weight, aero balance, and high-RPM naturally aspirated flat-six scream of the 911 GT3 in transition from twilight to dusk.",
    creativeDirection: "Moody, low-key lighting, wet road reflections, and high-speed chase-car tracking rigs paired with uncompressed external microphone audio captures.",
    description: "Commissioned as an authentic archival film for a private enthusiast, this project emphasized visceral momentum over static beauty. Using custom hood suction mounts and gyro-stabilized pursuit cars, we captured dynamic 80mph rolling shots under rain-slicked pavement.",
    services: [
      "Precision Tracking Vehicle Operation",
      "Anamorphic Cinematography",
      "Telemetry & Engine Sound Design",
      "Cinematic Master Delivery (4K 2.39:1)",
    ],
    techSpecs: {
      camera: "ARRI Alexa Mini LF / RED V-Raptor",
      lens: "Atlas Orion Anamorphic 35mm / 65mm",
      rig: "Tilta Hydra Arm + Ronin 2 Gyro Mount",
      resolution: "4K UHD (3840×1600)",
      framerate: "24fps & 60fps High-Speed",
      colorGrade: "ACES Film Emulation / Cool Cyan & Obsidian",
    },
    gallery: [
      {
        type: "image",
        url: "/assets/projects/supercar-rolling.jpg",
        caption: "High-speed wet road tracking sequence",
        aspectRatio: "16/9",
      },
      {
        type: "image",
        url: "/assets/hero/hero-poster.jpg",
        caption: "Studio twilight silhouette and rim light study",
        aspectRatio: "21/9",
      },
    ],
    featured: true,
    order: 1,
  },
  {
    id: "proj-02",
    slug: "midnight-syndicate-car-meet",
    title: "MIDNIGHT SYNDICATE // CAR CULTURE FILM",
    subtitle: "Underground car culture, JDM icons, and aftermovie documentary",
    category: "Car Meets & Rallies",
    vehicle: "Tuned GT-Rs, Supras, European Performance Fleet",
    client: "National Automotive Collective",
    year: "2026",
    location: "Industrial District, Central India",
    heroImage: "/assets/projects/car-meet.jpg",
    brief: "Document the biggest gathering of tuner cars, track builds, and automotive community members with festival-grade visual energy and same-day social teasers.",
    creativeDirection: "High-contrast neon reflections, handheld roving gimbals, smoke flares, and low-angle wide-angle focal lengths reflecting authentic street culture.",
    description: "A comprehensive 12-hour production chronicling afternoon roll-ins through late-night rev battles and rolling convoys. Generated over 200K+ collective impressions across reels and YouTube within 48 hours of release.",
    services: [
      "Multi-Camera Event Coverage",
      "Low-Altitude FPV Drone Chase",
      "Same-Night Viral Reel Dispatches",
      "Official 4K Festival Aftermovie",
    ],
    techSpecs: {
      camera: "Sony FX6 / FX3 Cinema Line",
      lens: "Sony G-Master 24-70mm f/2.8 & 16-35mm",
      rig: "DJI RS3 Pro Gimbal + Custom FPV Quad",
      resolution: "4K UHD (3840×2160)",
      framerate: "24fps / 120fps",
      colorGrade: "Neon Industrial Night Palette",
    },
    gallery: [
      {
        type: "image",
        url: "/assets/projects/car-meet.jpg",
        caption: "Industrial warehouse roll-in lineup",
        aspectRatio: "16/9",
      },
    ],
    featured: true,
    order: 2,
  },
  {
    id: "proj-03",
    slug: "apex-carbon-commercial",
    title: "APEX MONOCHROME // BRAND FILM",
    subtitle: "Commercial launch film for composite aerodynamic kit and bespoke forged wheels",
    category: "Commercial",
    vehicle: "McLaren 720S Apex Edition",
    client: "Aerodynamic Aftermarket Brand",
    year: "2025",
    location: "Bhopal Studio Facility, India",
    heroImage: "/assets/hero/hero-poster.jpg",
    brief: "Highlight the precision weave of pre-preg carbon fiber aero components and bespoke center-lock wheel architecture for global commercial rollout.",
    creativeDirection: "Volumetric fog, motorized linear slider tracking, rim-lighting revealing carbon textures, and architectural minimalism.",
    description: "Engineered specifically for digital marketing conversion and brand authority, this film delivered 15-second paid ad variations, a 60-second flagship commercial, and high-resolution commercial print stills.",
    services: [
      "Studio Commercial Direction",
      "Macro Carbon Fiber Cinematography",
      "Commercial Sound Scoring",
      "Omnichannel Multi-Aspect Export (16:9, 9:16, 1:1)",
    ],
    techSpecs: {
      camera: "RED V-Raptor 8K VV",
      lens: "Laowa Probe 24mm + Cooke Mini S4/i",
      rig: "Motion Control Motorized Track",
      resolution: "8K Raw Master / 4K Delivery",
      framerate: "24fps / 72fps",
      colorGrade: "Obsidian Deep Contrast Monochrome",
    },
    gallery: [
      {
        type: "image",
        url: "/assets/hero/hero-poster.jpg",
        caption: "Volumetric fog commercial reveal",
        aspectRatio: "21/9",
      },
      {
        type: "image",
        url: "/assets/bts/camera-rig.jpg",
        caption: "Rig setup and follow-focus configuration",
        aspectRatio: "16/9",
      },
    ],
    featured: true,
    order: 3,
  },
];
