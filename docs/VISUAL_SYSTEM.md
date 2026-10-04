# VISUAL SYSTEM — Car Dynasty

## 1. Aesthetic Direction
- **Identity:** High-end automotive production studio & luxury cinema.
- **Atmosphere:** Deep obsidian shadows, technical precision, warm metallic highlights, anamorphic lighting cues.
- **Rule:** The car and cinematography are always the hero. Never look like a generic SaaS or developer portfolio.

## 2. Color Palette & Design Tokens
`css
:root {
  /* Backgrounds */
  --bg-primary: #08090a;       /* Deep Obsidian Black */
  --bg-surface: #101214;       /* Dark Graphite Card Surface */
  --bg-elevated: #181b1f;      /* Elevated Popover / Modal Surface */
  
  /* Text */
  --text-primary: #f4f4f5;     /* Pure Crisp White */
  --text-secondary: #9da3ae;   /* Muted Slate Gray */
  --text-muted: #5e6573;       /* Technical Subtext */
  
  /* Automotive Accent */
  --accent: #ff4d00;           /* Tachometer Red-Orange / Caliper Orange */
  --accent-glow: rgba(255, 77, 0, 0.25);
  --accent-cyan: #00e5ff;      /* Laser Headlight Xenon Blue (Subtle) */

  /* Borders & Rules */
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-active: rgba(255, 255, 255, 0.2);
}
`

## 3. Typography
- **Display / Headers:** Bebas Neue / Monument Extended (Heavy condensed cinematic sans, all-caps, tracking wide/snug).
- **Body / Narrative:** Inter (Legible, neutral, premium weights: 300, 400, 500).
- **Technical Metadata / Specs:** JetBrains Mono / Monospace (Shutter speed, focal length, car specs, date, location).

## 4. Layout Grids & Spacing
- Fluid sizing with clamp().
- Aspect ratios: 16:9 (Hero / Video), 21:9 (Cinemascope feature banners), 4:5 (Instagram / Mobile portrait).
- Technical grid lines and coordinate markings giving a director's viewfinder aesthetic.
