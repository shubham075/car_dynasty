export interface ProcessStep {
  step: string;
  title: string;
  subtitle: string;
  description: string;
  tasks: string[];
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: "01",
    title: "TREATMENT & SCOUTING",
    subtitle: "Aligning vision, routes, and lighting conditions",
    description: "Every shoot begins with understanding the machine's character or the campaign's core goal. We scout asphalt roads, industrial zones, or studio spaces to match the car's presence.",
    tasks: [
      "Storyboard & Shot List Definition",
      "Route & Sunrise/Golden-Hour Scheduling",
      "Permits & Controlled Location Access",
    ],
  },
  {
    step: "02",
    title: "PRECISION PRODUCTION",
    subtitle: "High-speed tracking, anamorphic glass, and drone chase",
    description: "On set, we operate specialized camera pursuit vehicles, suction rig mounts, and dual-operator cinema setups designed specifically for high-speed automotive movement.",
    tasks: [
      "Hydra Arm / Suction Hood Rigging",
      "Rolling Highway & Mountain Passes",
      "Dedicated External Sound Mics for Exhaust",
    ],
  },
  {
    step: "03",
    title: "POST-PRODUCTION & GRADE",
    subtitle: "Obsidian shadows, film emulation, and mechanical sound mix",
    description: "In the edit suite, raw Log-C footage undergoes editorial trimming, custom LUT color grading, and acoustic mixing balancing engine notes, induction noise, and music.",
    tasks: [
      "4K ACES Color Grading & Film Grain",
      "Exhaust Tone & Telemetry Sound Design",
      "Visual Effects & Motion Graphics",
    ],
  },
  {
    step: "04",
    title: "OMNICHANNEL DELIVERY",
    subtitle: "Cinematic 4K masters and viral social cuts",
    description: "Final deliverables are optimized and formatted for both massive theater/client screens (2.39:1 / 16:9) and high-retention mobile consumption (9:16 reels).",
    tasks: [
      "ProRes 422HQ & 4K UHD Web Exports",
      "Platform-Specific 9:16 Reels Cuts",
      "High-Res Still Photography Package",
    ],
  },
];
