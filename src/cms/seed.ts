import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import type { Db } from "./repo";
import { insertRow } from "./repo";
import { RESOURCES, SECTIONS } from "./schema";

// First-run content: the portfolio exactly as it was hard-coded before the CMS.

const CATEGORIES = [
  { name: "Supercar Showcase", slug: "supercar-showcase", showInFilter: true },
  { name: "Car Meets & Rallies", slug: "car-meets-rallies", showInFilter: true },
  { name: "Commercial", slug: "commercial", showInFilter: true },
  { name: "Social Cut", slug: "social-cut", showInFilter: false },
];

const PROJECTS = [
  {
    slug: "porsche-gt3-alpine-dusk", title: "ALPINE VELOCITY // GT3 DUSK RUN",
    subtitle: "High-speed tracking film capturing mechanical aggression on wet tarmac", category: "Supercar Showcase",
    vehicle: "Porsche 911 GT3 (992)", client: "Private Collector Commission", year: "2026", location: "Highland Pass, India",
    heroImage: "/assets/projects/supercar-rolling.jpg",
    brief: "Capture the pure atmospheric weight, aero balance, and high-RPM naturally aspirated flat-six scream of the 911 GT3 in transition from twilight to dusk.",
    creativeDirection: "Moody, low-key lighting, wet road reflections, and high-speed chase-car tracking rigs paired with uncompressed external microphone audio captures.",
    description: "Commissioned as an authentic archival film for a private enthusiast, this project emphasized visceral momentum over static beauty. Using custom hood suction mounts and gyro-stabilized pursuit cars, we captured dynamic 80mph rolling shots under rain-slicked pavement.",
    services: ["Precision Tracking Vehicle Operation", "Anamorphic Cinematography", "Telemetry & Engine Sound Design", "Cinematic Master Delivery (4K 2.39:1)"],
    techSpecs: { camera: "ARRI Alexa Mini LF / RED V-Raptor", lens: "Atlas Orion Anamorphic 35mm / 65mm", rig: "Tilta Hydra Arm + Ronin 2 Gyro Mount", resolution: "4K UHD (3840×1600)", framerate: "24fps & 60fps High-Speed", colorGrade: "ACES Film Emulation / Cool Cyan & Obsidian" },
    gallery: [
      { url: "/assets/projects/supercar-rolling.jpg", caption: "High-speed wet road tracking sequence", aspectRatio: "16/9" },
      { url: "/assets/hero/hero-poster.jpg", caption: "Studio twilight silhouette and rim light study", aspectRatio: "21/9" },
    ],
  },
  {
    slug: "midnight-syndicate-car-meet", title: "MIDNIGHT SYNDICATE // CAR CULTURE FILM",
    subtitle: "Underground car culture, JDM icons, and aftermovie documentary", category: "Car Meets & Rallies",
    vehicle: "Tuned GT-Rs, Supras, European Performance Fleet", client: "National Automotive Collective", year: "2026", location: "Industrial District, Central India",
    heroImage: "/assets/projects/car-meet.jpg",
    brief: "Document the biggest gathering of tuner cars, track builds, and automotive community members with festival-grade visual energy and same-day social teasers.",
    creativeDirection: "High-contrast neon reflections, handheld roving gimbals, smoke flares, and low-angle wide-angle focal lengths reflecting authentic street culture.",
    description: "A comprehensive 12-hour production chronicling afternoon roll-ins through late-night rev battles and rolling convoys. Generated over 200K+ collective impressions across reels and YouTube within 48 hours of release.",
    services: ["Multi-Camera Event Coverage", "Low-Altitude FPV Drone Chase", "Same-Night Viral Reel Dispatches", "Official 4K Festival Aftermovie"],
    techSpecs: { camera: "Sony FX6 / FX3 Cinema Line", lens: "Sony G-Master 24-70mm f/2.8 & 16-35mm", rig: "DJI RS3 Pro Gimbal + Custom FPV Quad", resolution: "4K UHD (3840×2160)", framerate: "24fps / 120fps", colorGrade: "Neon Industrial Night Palette" },
    gallery: [{ url: "/assets/projects/car-meet.jpg", caption: "Industrial warehouse roll-in lineup", aspectRatio: "16/9" }],
  },
  {
    slug: "apex-carbon-commercial", title: "APEX MONOCHROME // BRAND FILM",
    subtitle: "Commercial launch film for composite aerodynamic kit and bespoke forged wheels", category: "Commercial",
    vehicle: "McLaren 720S Apex Edition", client: "Aerodynamic Aftermarket Brand", year: "2025", location: "Bhopal Studio Facility, India",
    heroImage: "/assets/hero/hero-poster.jpg",
    brief: "Highlight the precision weave of pre-preg carbon fiber aero components and bespoke center-lock wheel architecture for global commercial rollout.",
    creativeDirection: "Volumetric fog, motorized linear slider tracking, rim-lighting revealing carbon textures, and architectural minimalism.",
    description: "Engineered specifically for digital marketing conversion and brand authority, this film delivered 15-second paid ad variations, a 60-second flagship commercial, and high-resolution commercial print stills.",
    services: ["Studio Commercial Direction", "Macro Carbon Fiber Cinematography", "Commercial Sound Scoring", "Omnichannel Multi-Aspect Export (16:9, 9:16, 1:1)"],
    techSpecs: { camera: "RED V-Raptor 8K VV", lens: "Laowa Probe 24mm + Cooke Mini S4/i", rig: "Motion Control Motorized Track", resolution: "8K Raw Master / 4K Delivery", framerate: "24fps / 72fps", colorGrade: "Obsidian Deep Contrast Monochrome" },
    gallery: [
      { url: "/assets/hero/hero-poster.jpg", caption: "Volumetric fog commercial reveal", aspectRatio: "21/9" },
      { url: "/assets/bts/camera-rig.jpg", caption: "Rig setup and follow-focus configuration", aspectRatio: "16/9" },
    ],
  },
];

const SERVICES = [
  {
    slug: "brand-commercial", name: "Commercial Brand Film",
    tagline: "High-impact visual authority for automotive brands, dealerships, and tuners",
    targetAudience: "Automotive OEMs, Aftermarket Manufacturers, Tuners, Detailing Studios",
    description: "Full-scale commercial production crafted to elevate brand perception and drive commercial conversion. Includes creative treatment, location permit scouting, cinema camera package, dynamic lighting, and targeted ad cuts.",
    deliverables: ["60-90s 4K Flagship Brand Commercial", "3x 9:16 High-Retention Social Reels / Ads", "15x High-Resolution Color-Graded Stills", "Licensed Commercial Soundtrack & SFX Mix"],
    specs: ["Cinema Camera Rigs (ARRI / RED / FX6)", "Anamorphic Glass & Pro Mist Filtering", "High-Speed Chase Car Tracking", "Dedicated Drone Aerials"],
    turnaroundTime: "5 - 7 Business Days", recommendedFor: "Product launches, brand campaigns, dealership promotional reels.",
  },
  {
    slug: "event-rally", name: "Car Meet & Rally Coverage",
    tagline: "Festival-energy documentation, rolling convoys, and rapid social dispatches",
    targetAudience: "Car Clubs, Rally Organizers, Track Day Promoters, Supercar Runs",
    description: "Comprehensive multi-perspective event documentation designed to capture the raw atmosphere, rev battles, and participant community. Engineered for maximum organic reach with same-day teaser delivery.",
    deliverables: ["Official 4K Cinematic Event Aftermovie (2-4 min)", "Same-Day Rapid Hype Reel for Instagram/YouTube", "Roving Handheld & Gimbal Rolling Shots", "Full Raw 4K Archive Download Link"],
    specs: ["Dual Camera Crew Deployment", "FPV Drone Tracking Over Convoys", "Engine & Exhaust External Audio Capture", "Custom Graphic Title Cards"],
    turnaroundTime: "24-48 Hours for Teasers / 4 Days for Master", recommendedFor: "Supercar rallies, track days, tuning expos, national car meets.",
  },
  {
    slug: "collector-supercar", name: "Private Collector Showcase",
    tagline: "A bespoke legacy cinema piece dedicated to your exotic machine",
    targetAudience: "Supercar Owners, Classic Car Collectors, Bespoke Tuner Builds",
    description: "An intimate, museum-grade cinematography session dedicated to a single vehicle or private collection. Captures every body line, aero channel, interior stitch, and mechanical exhaust note at speed.",
    deliverables: ["3-Minute 4K Anamorphic Feature Film", "60s Hyper-Vertical Instagram Reel", "Framed 4K Master Video File for Personal Display", "Complete Editorial Stills Gallery"],
    specs: ["Private Scenic Location or Controlled Runway", "Rigged Suction Cameras for Dynamic Angles", "Exhaust Tone Mastering & Sound Design", "Obsidian Color Grade Tailored to Car Paint"],
    turnaroundTime: "3 - 5 Business Days", recommendedFor: "Porsche GT models, Ferraris, Lamborghinis, bespoke tuner builds.",
  },
];

const PROCESS = [
  { step: "01", title: "TREATMENT & SCOUTING", subtitle: "Aligning vision, routes, and lighting conditions", description: "Every shoot begins with understanding the machine's character or the campaign's core goal. We scout asphalt roads, industrial zones, or studio spaces to match the car's presence.", tasks: ["Storyboard & Shot List Definition", "Route & Sunrise/Golden-Hour Scheduling", "Permits & Controlled Location Access"] },
  { step: "02", title: "PRECISION PRODUCTION", subtitle: "High-speed tracking, anamorphic glass, and drone chase", description: "On set, we operate specialized camera pursuit vehicles, suction rig mounts, and dual-operator cinema setups designed specifically for high-speed automotive movement.", tasks: ["Hydra Arm / Suction Hood Rigging", "Rolling Highway & Mountain Passes", "Dedicated External Sound Mics for Exhaust"] },
  { step: "03", title: "POST-PRODUCTION & GRADE", subtitle: "Obsidian shadows, film emulation, and mechanical sound mix", description: "In the edit suite, raw Log-C footage undergoes editorial trimming, custom LUT color grading, and acoustic mixing balancing engine notes, induction noise, and music.", tasks: ["4K ACES Color Grading & Film Grain", "Exhaust Tone & Telemetry Sound Design", "Visual Effects & Motion Graphics"] },
  { step: "04", title: "OMNICHANNEL DELIVERY", subtitle: "Cinematic 4K masters and viral social cuts", description: "Final deliverables are optimized and formatted for both massive theater/client screens (2.39:1 / 16:9) and high-retention mobile consumption (9:16 reels).", tasks: ["ProRes 422HQ & 4K UHD Web Exports", "Platform-Specific 9:16 Reels Cuts", "High-Res Still Photography Package"] },
];

const CHANNEL = "https://www.youtube.com/@CARDYNASTY";
const YOUTUBE = [
  { title: "UNDERGROUND MEETS // THE RAW SPIRIT OF CENTRAL INDIA CAR CULTURE", category: "Car Culture", url: CHANNEL, duration: "14:22", badge: "Official Film" },
  { title: "PORSCHE 911 GT3 // HIGH SPEED CHASE & PURE EXHAUST SYMPHONY", category: "Supercar Film", url: CHANNEL, duration: "08:45", badge: "Cinema Cut" },
  { title: "MIDNIGHT CONVOY // 50+ SUPERCAR RALLY HIGHLIGHTS & ROLLING SHOTS", category: "Track & Meet", url: CHANNEL, duration: "12:10", badge: "Aftermovie" },
  { title: "BEHIND THE LENS // HOW WE RIG CINEMA CAMERAS TO SUPERCAR HOODS", category: "Build Breakdown", url: CHANNEL, duration: "18:04", badge: "BTS Documentary" },
];

const STATS = [
  { label: "Community", value: "16K+", detail: "YouTube Subscribers" },
  { label: "Automotive Films", value: "200+", detail: "Produced & Directed" },
  { label: "Reach", value: "Pan-India", detail: "Shoot Deployments" },
  { label: "Production", value: "4K UHD", detail: "Anamorphic & Drone" },
];

const MEDIA_DIRS = ["hero", "projects", "bts", "creator", "brand", "cars", "events", "og"];
const MIME: Record<string, string> = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".avif": "image/avif" };

function registerPublicAssets(db: Db) {
  const root = path.join(/*turbopackIgnore: true*/ process.cwd(), "public", "assets");
  const ins = db.prepare("INSERT OR IGNORE INTO media (id, url, filename, kind, mime, size, alt, source, created_at) VALUES (?, ?, ?, 'image', ?, ?, '', 'public', ?)");
  const now = new Date().toISOString();
  for (const dir of MEDIA_DIRS) {
    let files: string[] = [];
    try {
      files = fs.readdirSync(path.join(root, dir));
    } catch {
      continue;
    }
    for (const file of files) {
      const mime = MIME[path.extname(file).toLowerCase()];
      if (!mime) continue;
      const size = fs.statSync(path.join(root, dir, file)).size;
      ins.run(crypto.randomBytes(6).toString("hex"), `/assets/${dir}/${file}`, file, mime, size, now);
    }
  }
}

export function seedIfEmpty(db: Db) {
  if (db.prepare("SELECT 1 FROM meta WHERE key = 'seeded'").get()) return;

  db.transaction(() => {
    // Re-check inside the write lock: parallel build workers may have just seeded.
    if (db.prepare("SELECT 1 FROM meta WHERE key = 'seeded'").get()) return;
    const now = new Date().toISOString();

    const catIds = new Map<string, number>();
    for (const c of CATEGORIES) catIds.set(c.name, insertRow(db, RESOURCES.categories, { ...c, published: true }));
    for (const { category, ...p } of PROJECTS) {
      insertRow(db, RESOURCES.projects, { ...p, categoryId: catIds.get(category) ?? null, videoUrl: "", seoTitle: "", seoDescription: "", featured: true, published: true });
    }
    for (const s of SERVICES) insertRow(db, RESOURCES.services, { ...s, published: true });
    for (const s of PROCESS) insertRow(db, RESOURCES.process, { ...s, published: true });
    for (const v of YOUTUBE) insertRow(db, RESOURCES.youtube, { ...v, published: true });
    for (const s of STATS) insertRow(db, RESOURCES.stats, { ...s, published: true });

    const putSetting = db.prepare("INSERT OR IGNORE INTO settings (key, value, updated_at) VALUES (?, ?, ?)");
    for (const def of Object.values(SECTIONS)) putSetting.run(def.key, JSON.stringify(def.defaults), now);

    registerPublicAssets(db);
    // Random salt used to hash visitor IPs (we never store raw IP addresses).
    db.prepare("INSERT OR IGNORE INTO meta (key, value) VALUES ('ip_salt', ?)").run(crypto.randomBytes(24).toString("hex"));
    db.prepare("INSERT INTO meta (key, value) VALUES ('seeded', ?)").run(now);
  }).immediate();
}
