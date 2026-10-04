# ARCHITECTURE — Car Dynasty Automotive Creator Portfolio

## 1. System Overview
Next.js App Router static/hybrid architecture designed for cinematic presentation, blistering performance, and high-conversion client acquisition.

`
+-----------------------------------------------------------+
|                    Next.js App Router                     |
|                                                           |
|  [App Root / Layout] (Fonts, CSS Vars, Lenis, Nav/Footer) |
|         |                                                 |
|         +--> Home (Hero, Showreel, Work, BTS, About, CTA) |
|         +--> Projects ([slug] Case Studies)               |
|         +--> Contact / Enquiry (Direct + WhatsApp Flow)   |
|         +--> API Routes (/api/enquiry - optional fallback)|
+-----------------------------------------------------------+
         |
         +--> UI Layer: Tailwind CSS + CSS Variables
         +--> Motion Layer: GSAP + ScrollTrigger + Lenis
         +--> Media Layer: Next/Image + HTML5 Video + Cloudinary/Local
`

## 2. Technical Stack
- **Framework:** Next.js (App Router, React 19 / 18, TypeScript)
- **Styling:** Tailwind CSS + custom CSS variables for automotive color tokens
- **Typography:** Display (Bebas Neue / Syne), Body (Inter), Metadata (JetBrains Mono / Monospace)
- **Animation:** GSAP, ScrollTrigger, Lenis (smooth scroll with reduced-motion fallback)
- **Icons:** Lucide React
- **Forms & Validation:** React Hook Form + Zod (client validation for booking/quote requests)

## 3. Directory Layout
`	ext
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── projects/
│       └── [slug]/
│           └── page.tsx
├── components/
│   ├── common/         (Navbar, Footer, Button, CustomCursor, Container)
│   ├── hero/           (HeroShowreel, HeroHeading, HeroBadge)
│   ├── portfolio/      (ProjectCard, ProjectStack, WorkGrid)
│   ├── bts/            (BTSSection, SplitComparison)
│   ├── services/       (ServiceGrid, AudienceCards)
│   ├── social/         (YouTubeFeed, InstagramStrip)
│   └── contact/        (EnquiryForm, WhatsAppButton, DirectCall)
├── data/
│   ├── creator.ts      (Verified creator info: Apoorva Shrivastava)
│   ├── projects.ts     (Automotive cinematography projects)
│   ├── services.ts     (Automotive brand, meet, owner packages)
│   └── social.ts       (YouTube & Instagram links)
└── lib/
    ├── gsap.ts         (ScrollTrigger registration, smooth scroll helper)
    └── utils.ts        (cn helper, formatters)
`

## 4. Routing & State
- All public pages statically pre-rendered (output: 'export' compatible).
- Client state isolated to interactive modules: active navigation, audio/video toggle, contact modals, and GSAP timelines.
