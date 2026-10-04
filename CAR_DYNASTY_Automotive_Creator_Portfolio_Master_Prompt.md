# CAR_DYNASTY_Automotive_Creator_Portfolio_Master_Prompt

## Antigravity IDE — Master Build Specification

### Purpose

Build a premium, cinematic automotive creator portfolio and client-acquisition website for an India-wide automotive content creator.

This is **not** a generic developer portfolio.

The website must communicate:

- Automotive cinematography
- Car culture
- Premium visual storytelling
- Events and car meets
- Automotive brands
- Individual car owners
- Luxury/exotic cars
- Photography
- Reels
- Drone
- Editing
- Social-media content and management
- Professional production capability

The website should make a potential client think:

> "I want this person to shoot my car, event, brand or campaign."

---

# 1. CREATOR / BRAND CONTEXT

## Identity

Creator name:

`[CREATOR_NAME]`

Personal brand:

`[PERSONAL_BRAND_NAME]`

Creator / YouTube brand:

`Car Dynasty`

YouTube:

`https://www.youtube.com/@CARDYNASTY`

Instagram:

`[INSTAGRAM_URL]`

Primary market:

`India-wide`

Base location:

`[LOCATION]`

Email:

`[EMAIL]`

WhatsApp:

`[WHATSAPP_NUMBER]`

Website:

`[SITE_URL]`

## Existing creator footprint

The creator has:

- 200+ YouTube videos
- 50+ strong portfolio pieces
- Automotive event/car-meet content
- Automotive content creation experience

Do not fabricate:

- Clients
- Followers
- Views
- Awards
- Testimonials
- Partnerships
- Campaign results
- Revenue
- Metrics

Use placeholders until verified owner data is supplied.

---

# 2. PRIMARY BUSINESS OBJECTIVE

The website is a **client acquisition platform**, not merely a gallery.

Primary conversion actions:

1. Watch showreel
2. View work
3. Start a project
4. WhatsApp
5. Email
6. Request a quote
7. Book a shoot
8. View Instagram
9. View YouTube

The site should serve four major audiences:

1. Automotive brands
2. Events / car meets / event organizers
3. Individual car owners
4. Luxury / exotic car owners

Secondary audiences:

- Dealerships
- Performance/customization shops
- Detailing studios
- Automotive communities
- Automotive businesses

---

# 3. CREATIVE CONCEPT

## "BUILT IN MOTION."

The site should feel like a premium automotive film.

Motion language:

- Speed
- Precision
- Controlled acceleration
- Camera movement
- Depth
- Mechanical precision
- Cinematic pacing
- Editorial composition

The website should feel closer to:

- Automotive commercial
- Luxury car campaign
- Film title sequence
- Editorial magazine
- Premium creative studio

It must not feel like:

- Generic SaaS
- Developer portfolio
- Gaming dashboard
- Cyberpunk UI
- WebGL experiment
- Animation showcase where animation dominates the content

---

# 4. CORE DESIGN PRINCIPLE

## THE CAR CONTENT IS THE HERO.

Visual priority:

1. Automotive footage
2. Creator identity
3. Portfolio
4. Client trust
5. Services
6. Storytelling
7. Motion
8. Decorative elements

Animation exists to enhance the work.

Never allow decorative motion to overpower the cars or films.

---

# 5. VISUAL DIRECTION

Use:

- Deep black / graphite
- Warm off-white secondary sections
- Restrained accent color
- Cinematic photography
- Full-bleed video
- Editorial grid
- Large display typography
- Thin technical borders
- Subtle grain
- Generous whitespace
- 16:9 and 21:9 cinematic compositions

Recommended accent:

- Signal orange

Alternative:

- Electric lime

Make accent colors configurable using CSS variables.

Avoid:

- Excessive gradients
- Excessive neon
- Excessive glassmorphism
- Excessively rounded UI
- Decorative effects without purpose

---

# 6. TYPOGRAPHY

Use three typography roles.

### Display

Large, heavy, cinematic sans / condensed / extended variable font.

### Body

Clean, highly readable modern sans.

### Metadata

Monospace or technical grotesk.

Use fluid sizing with `clamp()`.

Typography can overlap video/media where appropriate.

---

# 7. HERO

The hero is the most important section.

Do not use a 3D character as the primary hero.

Use a:

## FULL-SCREEN AUTOMOTIVE SHOWREEL

Structure:

```text
[FULL-SCREEN AUTOMOTIVE VIDEO]

[CREATOR NAME]

AUTOMOTIVE FILMMAKER
CONTENT CREATOR

Cinematic automotive content
for brands, events, owners
and machines worth remembering.

[WATCH SHOWREEL]
[VIEW WORK]
[START A PROJECT]
```

The hero should include:

- Cinematic video
- Poster frame
- Typography reveal
- Subtle video grain
- Scroll indicator
- Minimal navigation
- Strong visual hierarchy

Do not block first paint while loading the video.

Use:

- Poster image
- Low-resolution preview if useful
- Responsive video
- Mobile-specific video where appropriate
- Lazy loading where appropriate

---

# 8. HERO MOTION

Desktop:

- Mouse-reactive subtle movement
- Typography displacement
- Video scale
- Light sweep
- Magnetic CTA
- Subtle parallax

Mobile:

- No hover dependency
- Video-led motion
- Scroll transitions
- Subtle parallax
- Touch-safe interactions

Respect `prefers-reduced-motion`.

---

# 9. NAVIGATION

Desktop:

```text
[MONOGRAM / NAME]

WORK
SERVICES
ABOUT
PROCESS
CONTACT

[START A PROJECT]
```

Behavior:

- Transparent over hero
- Context-aware background
- Hide on scroll down
- Show on scroll up
- Smooth transitions
- Minimal

Mobile:

Full-screen menu with:

- Work
- Services
- About
- Process
- YouTube
- Instagram
- Contact

Primary CTA:

`START A PROJECT`

---

# 10. SHOWREEL

Create a dedicated cinematic showreel section.

Metadata:

```text
AUTOMOTIVE FILM
2026
SELECTED WORK
```

Controls:

- Play
- Pause
- Sound
- Fullscreen

Never autoplay audio.

---

# 11. SELECTED WORK

This is the core portfolio.

Categories:

- All
- Automotive
- Events
- Car Meets
- Brands
- Owners
- Luxury / Exotic
- Reels
- Photography

Support filtering without unnecessary page reloads.

Use cinematic media rather than generic cards.

---

# 12. PORTFOLIO CARD

Each project can contain:

- Video preview
- Poster image
- Title
- Client
- Vehicle
- Category
- Year
- Location
- Services
- Project slug

Example:

```text
PORSCHE 911 GT3

Cinematic Automotive Film

Delhi
2026

Cinematography · Editing · Color Grade

[VIEW FILM]
```

Do not fabricate project information.

---

# 13. PORTFOLIO INTERACTION

Desktop:

- Video hover preview
- Subtle scale
- Image movement
- Cursor changes to `VIEW`
- Magnetic interaction
- Parallax
- Subtle tilt

Mobile:

- Poster image
- Play button
- Scroll reveal

Interaction must never be required to understand the project.

---

# 14. FEATURED PROJECT STACK

Implement a premium sticky project stack.

Scroll sequence:

```text
PROJECT 01
     ↓
PROJECT 02
     ↓
PROJECT 03
     ↓
PROJECT 04
```

Use:

- Scale
- Opacity
- Depth
- Subtle rotation
- Controlled overlap

Avoid excessive movement.

---

# 15. PROJECT DETAIL PAGE

Route:

`/work/[slug]`

Structure:

1. Hero video
2. Project title
3. Client
4. Vehicle
5. Location
6. Year/date
7. Services
8. Brief
9. Creative direction
10. Production
11. Cinematography
12. Editing
13. Color grading
14. Final film
15. Photography gallery
16. BTS
17. Deliverables
18. Verified results, if available
19. Related projects
20. Start a project CTA

---

# 16. BEHIND THE FRAME / BTS

Create:

## BEHIND THE FRAME

Visual story:

```text
RAW
 ↓
CAMERA
 ↓
MOVEMENT
 ↓
LIGHT
 ↓
GRADE
 ↓
FINAL
```

Possible interactions:

- Before/after slider
- Split-screen comparison
- Draggable comparison
- Hover reveal
- A/B video

Purpose:

Demonstrate professional production skill.

---

# 17. SERVICES

Title:

# WHAT I CREATE

Services:

### 01 — AUTOMOTIVE FILMS

Cinematic vehicle films and commercial-style automotive content.

### 02 — REELS & SHORT-FORM

High-impact content for Instagram Reels, YouTube Shorts and other social platforms.

### 03 — AUTOMOTIVE PHOTOGRAPHY

Campaign, editorial, social and enthusiast photography.

### 04 — DRONE CINEMATOGRAPHY

Aerial automotive, location and event footage.

### 05 — EVENT & CAR-MEET COVERAGE

Event films, aftermovies, highlights, reels and photography.

### 06 — BRAND CAMPAIGNS

Automotive campaign and launch content.

### 07 — SOCIAL MEDIA CONTENT

Recurring content production for brands and automotive businesses.

### 08 — CONTENT MANAGEMENT

Planning, production, editing and ongoing social content support.

Use large editorial rows rather than excessive cards.

---

# 18. CLIENT-SPECIFIC ENTRY POINTS

Create optional audience paths.

## FOR AUTOMOTIVE BRANDS

- Campaign films
- Product launches
- Social content
- Reels
- Photography
- Drone
- Recurring content

## FOR EVENTS

- Event films
- Aftermovies
- Reels
- Highlight edits
- Photography
- Drone

## FOR CAR OWNERS

- Cinematic car films
- Rolling shots
- Photography
- Reels
- Personal automotive stories

## FOR LUXURY / EXOTIC OWNERS

- Premium cinematic films
- Editorial photography
- Rolling footage
- Private shoot experiences
- Social-ready content

---

# 19. ABOUT

Do not use a generic biography.

Create a visual introduction.

Example structure:

```text
[CREATOR PORTRAIT]

ABOUT THE CREATOR

"I turn cars, movement and atmosphere
into stories people want to watch."
```

Include:

- Creator image
- Automotive journey
- Creative philosophy
- Production approach
- Location
- Availability

Use real content when supplied.

---

# 20. PERSONAL ASSET PLACEHOLDERS

Create:

```text
/public/assets/creator/
```

Suggested files:

```text
creator-portrait.webp
creator-portrait-2.webp
creator-working.webp
creator-camera.webp
creator-event.webp
```

Until real assets are supplied:

Use tasteful visual placeholders.

Never generate fake personal photographs.

When real photos are supplied, they must be replaceable without redesigning the website.

---

# 21. STATS

Possible stats:

```text
200+
YouTube Videos

50+
Featured Projects

[XX]
Events Covered

[XX]
Cars Filmed

[XX]
Cities
```

Only show verified values.

The known verified content volume is:

- 200+ YouTube videos
- 50+ portfolio pieces

Everything else remains a placeholder until supplied.

---

# 22. CLIENT / TRUST SECTION

If real clients exist:

```text
WORKED WITH

[CLIENT]
[CLIENT]
[CLIENT]
```

If not enough verified clients exist:

Use:

`SELECTED COLLABORATIONS`

Never fabricate logos or client names.

---

# 23. TESTIMONIALS

Testimonials must come from real clients.

Structure:

```text
"CLIENT QUOTE"

CLIENT NAME
ROLE / COMPANY
```

Never fabricate testimonials.

---

# 24. YOUTUBE

The creator has 200+ YouTube videos.

Do not embed 200 videos.

Curate approximately 8–15 flagship videos.

Show:

- Thumbnail
- Title
- Category
- Date
- Optional view count only if verified

CTA:

`WATCH THE FULL JOURNEY →`

Channel:

`https://www.youtube.com/@CARDYNASTY`

Optional YouTube Data API integration may be implemented later.

If API integration is not used, store manually curated videos in the content system.

Do not aggressively scrape YouTube.

---

# 25. INSTAGRAM

Treat Instagram primarily as a social destination.

CTA:

`FOLLOW ON INSTAGRAM →`

Do not depend on scraping Instagram.

Use:

- Manually curated media
- Official API where legitimately available
- External profile link

Never fabricate follower counts or posts.

---

# 26. PROCESS

Title:

# FROM IDEA TO FINAL FRAME

### 01 — DISCOVER

Understand the vehicle, brand, event and objective.

### 02 — CONCEPT

Define the visual direction.

### 03 — SHOOT

Cinematography, movement, drone and photography.

### 04 — EDIT

Editing, pacing and sound design.

### 05 — GRADE

Color grading and finishing.

### 06 — DELIVER

Final films, reels, photographs and social assets.

Animate the process line with SVG.

---

# 27. PACKAGES

Do not hard-code prices unless the owner supplies them.

Possible packages:

- Single Shoot
- Event Package
- Reel Package
- Brand Campaign
- Monthly Content
- Custom Project

CTA:

`REQUEST QUOTE`

---

# 28. CONTACT / PROJECT ENQUIRY

Title:

# LET'S CREATE SOMETHING MOVING.

Fields:

- Name
- Brand / Company
- Email
- WhatsApp
- Project Type
- Vehicle / Model
- Number of Vehicles
- Shoot Location
- Preferred Date
- Budget Range
- Required Deliverables
- Message

Project types:

- Automotive Brand
- Event / Car Meet
- Individual Owner
- Luxury / Exotic
- Dealership
- Social Media
- Campaign
- Photography
- Other

Deliverables:

- Cinematic Film
- Reels
- Photography
- Drone
- Editing
- Social Media Management
- Full Package

CTA:

`SEND PROJECT ENQUIRY`

After submission:

Show a premium success animation.

---

# 29. WHATSAPP

WhatsApp must be a first-class conversion channel.

Use:

`WHATSAPP ME →`

Do not require users to search for the number.

Store number in configuration/environment.

---

# 30. FOOTER

Large cinematic closing statement:

```text
READY TO
MAKE SOMETHING
MOVE?

[START A PROJECT]
```

Then:

```text
[PERSONAL BRAND]

CAR DYNASTY

INSTAGRAM
YOUTUBE
EMAIL
WHATSAPP

INDIA · WORLDWIDE
```

---

# 31. MOTION SYSTEM

Preferred:

- GSAP
- ScrollTrigger
- Lenis where justified
- Motion/Framer Motion only where appropriate

Never use multiple animation systems on the same element.

Reusable components:

```text
<SplitReveal />
<ScrollReveal />
<ScrollWords />
<Magnetic />
<Parallax />
<Marquee />
<VideoReveal />
<PinStack />
<CircleReveal />
<Counter />
<DrawPath />
<Cursor />
<PageTransition />
<VideoScrub />
<BeforeAfter />
```

---

# 32. MOTION PRINCIPLES

Every animation must communicate at least one of:

- Speed
- Weight
- Direction
- Depth
- Focus

Ask:

> "Why does this movement improve the story?"

If there is no strong answer, remove the animation.

---

# 33. AUTOMOTIVE-SPECIFIC MOTION

Possible techniques:

- Speed-ramp feeling
- Horizontal camera movement
- Controlled acceleration
- Image tracking
- Cinematic wipes
- Lens-inspired transitions
- Frame transitions
- Subtle motion blur where technically appropriate
- Scroll-controlled video sequences where performance allows

Do not create gimmicky "car-themed" UI.

---

# 34. CUSTOM CURSOR

Desktop only.

States:

- Default
- View
- Play
- Drag
- Open
- Video

Examples:

Project:

`VIEW`

Showreel:

`PLAY`

Disable on:

- Touch
- Mobile
- Reduced motion

---

# 35. VIDEO ENGINEERING

Video is a first-class engineering concern.

Implement:

- Poster images
- Responsive sources
- Mobile-specific videos where appropriate
- Lazy loading
- Intersection Observer
- Pause off-screen videos
- Optimized previews
- Fallback images
- No layout shift

Never load every video simultaneously.

---

# 36. PERFORMANCE

Targets:

- Lighthouse Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+
- LCP < 2.5s
- CLS < 0.05
- INP < 200ms

Lazy-load:

- Heavy animation systems
- WebGL
- Project videos
- Admin
- Analytics where possible

---

# 37. 3D

3D is optional.

Do not make WebGL mandatory.

If used:

- One small automotive-inspired object
- Lazy-loaded
- Desktop only
- Static fallback
- Never block first paint

Actual automotive footage always has priority.

---

# 38. SOUND

Optional sound design.

Never autoplay audio.

If implemented:

- Muted by default
- Explicit sound toggle
- Remember preference where appropriate
- Respect browser policies

---

# 39. RESPONSIVE DESIGN

Test:

```text
360px
390px
430px
768px
1024px
1280px
1440px
1920px
```

Mobile must not simply be a scaled-down desktop.

Create a dedicated mobile composition.

---

# 40. ACCESSIBILITY

Support:

- Keyboard navigation
- Visible focus
- Semantic HTML
- Correct heading hierarchy
- Alt text
- Captions/transcripts where applicable
- Reduced motion
- Sufficient contrast
- No hover-only critical functionality

When `prefers-reduced-motion: reduce`:

- Disable Lenis
- Disable custom cursor
- Disable large parallax
- Simplify transitions
- Stop automatic marquees
- Use simple fades

---

# 41. CONTENT ARCHITECTURE

Use a content/data layer.

Suggested entities:

```text
site_settings
creator_profile
social_links
projects
project_media
project_categories
services
service_deliverables
process_steps
testimonials
stats
youtube_videos
clients
contact_messages
users
```

Do not hard-code project arrays inside components.

---

# 42. PROJECT DATA MODEL

Project:

```text
id
slug
title
subtitle
client
vehicle
category
year
location
description
brief
creative_direction
production_notes
services
results
featured
published
order
```

Media:

```text
id
project_id
type
url
poster_url
alt
width
height
duration
order
```

---

# 43. MEDIA STORAGE

Use:

- Cloudinary
- OR S3-compatible storage

Store URLs and metadata in the database.

Do not store large videos directly in PostgreSQL.

---

# 44. ADMIN

If an admin/content system is justified, allow:

- Projects
- Media
- Services
- Testimonials
- Stats
- Clients
- YouTube videos
- Social links
- Site settings
- Contact enquiries

Keep the admin lightweight.

Do not over-engineer V1.

---

# 45. TECHNOLOGY

Preferred:

Frontend:

- Next.js
- React
- TypeScript

Styling:

- Tailwind CSS
- CSS variables

Animation:

- GSAP
- ScrollTrigger
- Motion where appropriate
- Lenis where appropriate

Forms:

- React Hook Form
- Zod

Backend:

Use the lightest architecture justified by the existing repository.

If an existing FastAPI backend exists, preserve and extend it.

Do not create unnecessary backend complexity.

Database:

PostgreSQL only if the CMS/content/admin requirements justify it.

---

# 46. SEO

Implement:

- Title
- Description
- Canonical
- Open Graph
- Social cards
- JSON-LD
- Person schema
- CreativeWork schema
- VideoObject where appropriate
- Sitemap
- Robots
- Project-specific metadata

---

# 47. SOCIAL SEO

Project pages should generate high-quality social previews.

Generate:

- Project title
- Vehicle
- Creator brand
- Strong project image

---

# 48. SECURITY

Never expose:

- API secrets
- Database credentials
- JWT secrets
- YouTube API keys
- Cloudinary secrets
- Email API keys

Validate server-side.

Rate-limit contact forms.

Use honeypot protection.

---

# 49. ANALYTICS

Prepare support for:

- Google Analytics
- Google Search Console
- Plausible or equivalent

Do not hard-code analytics IDs.

Use environment/config values.

---

# 50. ASSET SYSTEM

Create:

```text
/public/assets/

creator/
brand/
hero/
projects/
events/
cars/
bts/
icons/
social/
og/
```

Use explicit placeholders:

```text
[HERO_SHOWREEL]
[CREATOR_PORTRAIT]
[CREATOR_WORKING]
[PROJECT_01]
[PROJECT_02]
[PROJECT_03]
[BTS_01]
```

Never generate fake personal assets.

---

# 51. REFERENCE MATERIAL

Reference inspiration:

YouTube:

`https://www.youtube.com/@CARDYNASTY`

Instagram:

`[INSTAGRAM_URL]`

Use references only for:

- Cinematic energy
- Motion inspiration
- Automotive content presentation
- Content direction

Do not clone:

- Layout
- Copy
- Identity
- Logo
- Exact animation
- Character
- Colors
- Structure

The final website must have its own identity.

---

# 52. PHASED WORKFLOW

## PHASE 0 — AUDIT

Inspect:

- Repository
- Frontend
- Backend
- Database
- Dependencies
- Routes
- Assets
- Components
- Existing animations
- Deployment

Create:

```text
/docs/AUDIT.md
/docs/ARCHITECTURE.md
/docs/CONTENT_REQUIREMENTS.md
```

Do not implement the full website yet.

---

## PHASE 1 — CREATIVE SYSTEM

Create:

```text
/docs/UX_SPEC.md
/docs/VISUAL_SYSTEM.md
/docs/MOTION_SPEC.md
```

Define:

- Information architecture
- Page hierarchy
- Typography
- Colors
- Spacing
- Motion
- Responsive behavior
- Video strategy
- Asset requirements

---

## PHASE 2 — FOUNDATION

Implement:

- Next.js
- TypeScript
- Design tokens
- Fonts
- Global CSS
- Routing
- Responsive grid
- Navigation
- Media components
- Video components
- CTA components
- Accessibility primitives

Do not implement advanced animation yet.

---

## PHASE 3 — CONTENT SYSTEM

Implement:

- Projects
- Project media
- Categories
- Services
- Process
- Testimonials
- Stats
- Clients
- YouTube videos
- Social links
- Creator profile
- Contact enquiries

Do not fabricate content.

---

## PHASE 4 — STATIC EXPERIENCE

Build all sections without advanced motion first.

Verify:

- Layout
- Typography
- Spacing
- Content hierarchy
- Video presentation
- Mobile layout

---

## PHASE 5 — CINEMATIC MOTION

Implement:

1. Hero
2. Navigation
3. Showreel
4. Selected work
5. Project stack
6. Project details
7. Services
8. About
9. BTS
10. Process
11. Testimonials
12. Contact
13. Footer

---

## PHASE 6 — MOBILE

Create dedicated mobile compositions.

Test:

- 360
- 390
- 430
- 768

Remove desktop-only interactions.

---

## PHASE 7 — PERFORMANCE

Run:

- Lighthouse
- Bundle analysis
- Media analysis
- Video analysis
- Core Web Vitals

Remove unnecessary JavaScript and animation.

---

## PHASE 8 — ACCESSIBILITY

Test:

- Keyboard
- Focus
- Contrast
- Reduced motion
- Touch
- Semantic structure

---

## PHASE 9 — BROWSER QA

Test:

- Chrome
- Safari
- Firefox
- Desktop
- Mobile

Verify:

- Console
- Hydration
- Media
- Forms
- Links
- Animations
- Responsive layout

---


# 52A. COMPLETE ANIMATION & MOTION INVENTORY

This section is an implementation checklist. Antigravity must not omit any applicable motion listed below. Every item must be marked in the implementation notes as `IMPLEMENTED`, `ADAPTED`, `OPTIONAL/NOT USED`, or `BLOCKED` with a reason. Motion must make the site more engaging and memorable, but it must never obscure the automotive content or harm usability/performance.

## A. Global Motion Principles

- Cinematic pacing rather than constant motion.
- Motion hierarchy: hero > portfolio > transitions > supporting UI.
- Use transform/opacity where possible.
- Avoid layout-triggering animations.
- Use consistent easing and timing tokens.
- Use intentional acceleration/deceleration inspired by camera and vehicle movement.
- Avoid animation on every element.
- Avoid excessive bounce, elastic effects, or gimmicky effects.
- Respect `prefers-reduced-motion` globally.

## B. Page Load / Intro

- Initial cinematic fade/reveal.
- Logo/monogram reveal.
- Hero media reveal.
- Display typography entrance.
- Staggered supporting metadata/CTA entrance.
- Optional loading/progress indicator for genuinely heavy media.
- Smooth transition from loading state into the hero.

## C. Hero / Showreel Motion

- Full-screen video reveal.
- Slow cinematic video scale/parallax.
- Typography split/word reveal.
- Character/line stagger where appropriate.
- Subtle mouse-based depth movement on desktop.
- CTA magnetic movement.
- CTA hover expansion/reveal.
- Play-button/circle interaction.
- Scroll indicator animation.
- Hero-to-next-section transition.
- Optional scroll-driven video progress/scrubbing where technically justified.
- Subtle grain/overlay movement.
- Optional light sweep/lens-inspired transition.

## D. Navigation Motion

- Transparent-to-solid navigation transition.
- Navigation hide-on-scroll-down.
- Navigation reveal-on-scroll-up.
- Menu item hover underline/reveal.
- Active-section indicator transition.
- CTA magnetic interaction.
- Mobile menu full-screen reveal.
- Mobile menu staggered item entrance.
- Mobile menu close transition.
- Page navigation transition.

## E. Typography Motion

- Split-text reveal.
- Word-by-word reveal.
- Line-by-line reveal.
- Character stagger where appropriate.
- Masked text reveal.
- Clip-path text reveal where performant.
- Text displacement/parallax.
- Heading scale/opacity transitions.
- Kinetic typography only for selected hero/section moments.

## F. Scroll Choreography

- Scroll-triggered reveal.
- Fade + translate reveal.
- Horizontal movement sections where useful.
- Parallax media.
- Sticky/pinned storytelling.
- Section-to-section visual continuity.
- Scroll progress indicators where useful.
- Controlled image scale on scroll.
- Controlled media position shifts.
- Cinematic section transitions.

## G. Portfolio / Work Grid

- Image/video hover preview.
- Hover scale.
- Image crop/position movement.
- Cursor changes to `VIEW`.
- Cursor follows pointer smoothly.
- Magnetic card/CTA interaction where appropriate.
- Subtle card tilt on desktop only where it improves depth.
- Metadata reveal.
- Category filter transition.
- Grid rearrangement/layout transition.
- Project entrance stagger.
- Featured project emphasis.
- Video preview pause when leaving viewport.

## H. Sticky Project Stack

- Sticky/pinned cards.
- Card scale based on depth.
- Card opacity progression.
- Controlled overlap.
- Subtle rotation/depth.
- Previous card compression.
- Next card emergence.
- Scroll-linked progress.
- Smooth stack exit into the next section.

## I. Project Detail Pages

- Hero media entrance.
- Project metadata stagger.
- Full-screen media transitions.
- Image gallery reveal.
- Scroll-based image scale.
- Horizontal gallery where justified.
- Video play interaction.
- Related-project hover previews.
- Next/previous project transitions.
- Project-to-contact CTA transition.

## J. Behind-the-Frame / BTS

- Before/after draggable slider.
- Split-screen reveal.
- Hover reveal where appropriate.
- Drag handle animation.
- Raw-to-final transition.
- Camera-to-final storytelling sequence.
- Color-grade comparison.
- Optional scroll-linked production sequence.

## K. Services

- Service row reveal.
- Number/title stagger.
- Hover image/video preview.
- Arrow/icon movement.
- Active service expansion.
- Subtle horizontal movement.
- Scroll-triggered entrance.
- CTA reveal.

## L. Audience / Client Pathways

For Brands, Events, Owners and Luxury/Exotic Owners:

- Audience card/row hover state.
- Media preview reveal.
- Text/image transition.
- Active-state indicator.
- CTA movement.
- Smooth transition into relevant services or enquiry flow.

## M. Process Section

- Sequential 01 → 06 reveal.
- SVG path drawing.
- Progress line animation.
- Step activation based on scroll position.
- Icon/number reveal.
- Final-step completion transition.

## N. Stats / Credibility

- Count-up animation for verified numerical metrics.
- Number reveal.
- Label stagger.
- Subtle section entrance.

Do not animate fabricated metrics because fabricated metrics are prohibited.

## O. Testimonials / Client Proof

- Quote reveal.
- Client name/role stagger.
- Optional horizontal carousel.
- Progress indicator.
- Smooth testimonial transition.
- Client logo reveal only when real logos are available.

## P. YouTube / Social

- Video thumbnail hover motion.
- Play-button interaction.
- Featured-video reveal.
- Horizontal carousel motion where appropriate.
- Social CTA hover/magnetic interaction.
- Channel transition to external platform.

Do not autoplay multiple videos.

## Q. Contact / Conversion

- CTA magnetic interaction.
- Button hover fill/reveal.
- Form field focus transitions.
- Input label movement.
- Validation feedback animation.
- Submit button progress state.
- Success animation.
- Error animation that is subtle and accessible.
- WhatsApp CTA interaction.
- Final CTA reveal.

## R. Footer

- Large typography reveal.
- Final CTA entrance.
- Social link hover motion.
- Arrow/icon movement.
- Subtle closing transition.

## S. Custom Cursor

Desktop only:

- Default cursor state.
- `VIEW` state.
- `PLAY` state.
- `DRAG` state.
- `OPEN` state.
- `VIDEO` state.
- Smooth interpolation.
- Cursor scale on interactive elements.
- Cursor disappearance when appropriate.

Never use custom cursor on touch devices.

## T. Magnetic Interactions

Use selectively for:

- Primary CTA.
- Showreel button.
- Project links.
- Social links.
- Contact actions.

Magnetic movement must remain subtle and must not interfere with clicking.

## U. Video Motion

- Autoplay only when muted and appropriate.
- Poster-to-video transition.
- Play/pause transition.
- Sound-toggle transition.
- Fullscreen interaction.
- Viewport-aware play/pause.
- Mobile-specific video behavior.
- Video loading fallback.
- Optional scroll-linked video scrubbing.
- Optional cinematic video mask/reveal.

## V. Image Motion

- Lazy-load reveal.
- Blur/low-resolution-to-sharp transition where useful.
- Scale-on-scroll.
- Parallax.
- Crop movement.
- Mask reveal.
- Hover position shift.
- Fullscreen/gallery transition.

## W. Page Transitions

Implement a consistent transition system for:

- Home → Work.
- Work → Project.
- Project → Project.
- Project → Contact.
- External/social navigation where appropriate.

Transitions must be short enough not to frustrate users.

## X. Mobile Motion Adaptation

Mobile must use dedicated motion rules:

- Remove custom cursor.
- Remove hover-only effects.
- Reduce parallax amplitude.
- Reduce simultaneous animations.
- Avoid heavy scroll scrubbing on low-powered devices.
- Use touch-friendly interactions.
- Preserve reveal hierarchy.
- Keep CTA interactions obvious.
- Prioritize video and content over decoration.

## Y. Reduced Motion / Accessibility

When `prefers-reduced-motion: reduce` is enabled:

- Disable Lenis.
- Disable custom cursor.
- Disable large parallax.
- Disable aggressive scale/rotation.
- Disable automatic marquees.
- Disable non-essential scroll scrubbing.
- Replace complex transitions with simple fades.
- Preserve functional state changes.

## Z. Performance Safeguards

- Do not animate width/height/top/left when transform can be used.
- Avoid excessive simultaneous ScrollTrigger instances.
- Kill/unregister animation contexts on route changes where required.
- Pause off-screen videos.
- Lazy-load heavy animation code.
- Avoid WebGL unless justified.
- Do not allow animation to delay LCP.
- Test animation on low-powered mobile emulation.
- Monitor dropped frames where practical.
- Avoid scroll-jacking if it harms usability.

## AA. Motion QA Checklist

Before declaring the site complete, verify every applicable inventory item in the browser.

For each item record:

```text
Feature:
Status: IMPLEMENTED / ADAPTED / OPTIONAL-NOT USED / BLOCKED
Desktop:
Mobile:
Reduced Motion:
Performance Notes:
```

The QA agent must specifically inspect:

- Hero animation
- Navigation animation
- Typography reveals
- Scroll choreography
- Portfolio hover interactions
- Sticky stack
- Project transitions
- BTS interactions
- Service interactions
- Process animation
- Stats animation
- Testimonials
- Social/YouTube interactions
- Contact form states
- Custom cursor
- Magnetic buttons
- Page transitions
- Mobile motion
- Reduced-motion behavior
- Video performance

## AB. Motion Quality Gate

A motion feature may ship only when it satisfies all of these:

1. It supports the content/story.
2. It feels consistent with the automotive cinematic identity.
3. It does not distract from the work.
4. It does not make navigation confusing.
5. It works or degrades gracefully on mobile.
6. It respects reduced-motion preferences.
7. It does not create unacceptable performance problems.
8. It has been visually verified in the browser.

The goal is **high engagement through cinematic storytelling**, not maximum animation density.

# 53. ANTIGRAVITY AGENT BEHAVIOR

Before implementation:

1. Read this master specification completely.
2. Inspect the repository.
3. Build an implementation plan.
4. Break large tasks into independently verifiable phases.
5. Use specialized subagents when useful.

Suggested specialized agents:

- Creative Director
- UX / Interaction Designer
- Frontend Engineer
- Motion Engineer
- Media / Performance Engineer
- Backend / CMS Engineer
- SEO / Accessibility Engineer
- QA / Browser Tester

Subagents must not independently redesign the product.

The primary agent owns integration.

---

# 54. VERIFICATION RULE

After every major phase:

1. Run the application.
2. Open it in the browser.
3. Inspect the actual rendered experience.
4. Check console errors.
5. Check responsive behavior.
6. Compare against this specification.
7. Fix issues.
8. Only then proceed.

Code compilation is not proof of completion.

Browser verification is required.

---

# 55. DOCUMENTATION

Maintain:

```text
/docs/AUDIT.md
/docs/ARCHITECTURE.md
/docs/UX_SPEC.md
/docs/VISUAL_SYSTEM.md
/docs/MOTION_SPEC.md
/docs/CONTENT_MODEL.md
/docs/QA_REPORT.md
/docs/DEPLOYMENT.md
```

Keep documentation synchronized with implementation.

---

# 56. OWNER ASSETS

The owner will later provide:

- Creator portrait
- Creator photos
- Working/BTS photos
- Logo/monogram
- Hero showreel
- Selected videos
- Project images
- Project videos
- BTS footage
- Client logos
- Testimonials
- Verified metrics
- Social URLs
- Email
- WhatsApp
- Domain
- Analytics IDs

Do not block development waiting for these assets.

Use placeholders.

---

# 57. FINAL OWNER CONTENT CHECKLIST

At completion report:

```text
[ ] Creator name
[ ] Personal brand name
[ ] Creator portrait
[ ] Logo/monogram
[ ] Hero showreel
[ ] 10–20 featured projects
[ ] Project metadata
[ ] Project videos/images
[ ] BTS assets
[ ] Client names
[ ] Testimonials
[ ] Verified metrics
[ ] Email
[ ] WhatsApp
[ ] Instagram
[ ] YouTube
[ ] Location
[ ] Domain
[ ] Analytics ID
[ ] Business enquiry preferences
```

---

# 58. V1 SIMPLICITY RULE

Do NOT add complexity merely because it is technically impressive.

Avoid unnecessary V1 features such as:

- Command palette
- Accent theme switcher
- Large WebGL experience
- Developer tools grid
- Excessive 3D objects
- Enterprise-level admin complexity
- Over-engineered backend

Prioritize:

```text
VIDEO
↓
PORTFOLIO
↓
BTS
↓
TRUST
↓
SERVICES
↓
ENQUIRY
```

---

# 59. SUCCESS CRITERION

The final result must feel like:

> A premium automotive production studio / creator website.

Not:

> A developer portfolio with car pictures.

Within the first few seconds the visitor should understand:

```text
AUTOMOTIVE
CINEMATOGRAPHY
CONTENT
STORYTELLING
```

The site succeeds when a potential client thinks:

> "I want this person to shoot my car / event / brand / campaign."

---

# 60. FINAL IMPLEMENTATION REPORT

At completion report:

1. What was built
2. Architecture
3. Motion system
4. Content system
5. Pages
6. Database
7. Admin
8. Performance results
9. Accessibility results
10. Browser QA
11. Deployment instructions
12. Remaining owner assets
13. Known limitations
14. Recommended next improvements

Only report verified results.

Never fabricate completion metrics.
