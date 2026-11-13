import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import type { Db } from "./repo";
import { insertRow } from "./repo";
import { RESOURCES, SECTIONS } from "./schema";
import { applyContent, buildContent } from "./core/youtube-content.mjs";
import snapshot from "./youtube-snapshot.json";

// First-run content. Work, shorts and stats come from src/cms/youtube-snapshot.json
// (refresh with `npm run youtube:sync`); the rest is starter copy to edit in the admin.

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

    // Projects, categories, YouTube shorts and stats come from the real channel snapshot.
    applyContent(db, buildContent(snapshot));
    for (const s of SERVICES) insertRow(db, RESOURCES.services, { ...s, published: true });
    for (const s of PROCESS) insertRow(db, RESOURCES.process, { ...s, published: true });

    const putSetting = db.prepare("INSERT OR IGNORE INTO settings (key, value, updated_at) VALUES (?, ?, ?)");
    for (const def of Object.values(SECTIONS)) putSetting.run(def.key, JSON.stringify(def.defaults), now);

    registerPublicAssets(db);
    // Random salt used to hash visitor IPs (we never store raw IP addresses).
    db.prepare("INSERT OR IGNORE INTO meta (key, value) VALUES ('ip_salt', ?)").run(crypto.randomBytes(24).toString("hex"));
    db.prepare("INSERT INTO meta (key, value) VALUES ('seeded', ?)").run(now);
  }).immediate();
}
