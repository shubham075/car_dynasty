# CAR DYNASTY — Antigravity IDE Skills & MCP Installation Guide

## Purpose

Recommended global and project/workspace setup for the Car Dynasty cinematic automotive creator portfolio.

This guide separates:
- Antigravity Skills
- MCP servers
- Subagents
- Project dependencies
- Optional infrastructure

Antigravity IDE currently supports global Skills at `~/.gemini/config/skills/` and workspace Skills at `<workspace>/.agents/skills/`. Global MCP configuration is at `~/.gemini/config/mcp_config.json`; workspace MCP configuration is at `<workspace>/.agents/mcp_config.json`.

---

# 1. GLOBAL SKILLS

Use global Skills only for reusable, project-agnostic workflows.

| Skill | Priority | Purpose |
|---|---|---|
| `frontend-engineering` | P0 | React/Next.js/TypeScript architecture, reusable components, maintainability |
| `code-review` | P0 | Correctness, architecture, security, performance and regression review |
| `visual-qa` | P0 | Browser-based visual and interaction verification |
| `accessibility` | P0 | Semantic HTML, keyboard, focus, contrast, ARIA and accessibility |
| `web-performance` | P0 | Core Web Vitals, bundle size, loading and performance budgets |
| `git-workflow` | P0 | Safe commits, branches, changes and repository hygiene |
| `web-security` | P1 | Secrets, validation, authentication and API security |
| `web-seo` | P1 | Metadata, structured data, sitemap, canonical and social SEO |

**Global location:**

```text
~/.gemini/config/skills/
```

---

# 2. CAR DYNASTY PROJECT SKILLS

These should live inside the repository because they encode this project's specific creative and engineering rules.

**Workspace location:**

```text
.agents/skills/
```

## P01 — `automotive-art-direction`

**Priority:** P0

Controls:
- premium automotive aesthetic
- cinematic composition
- typography
- color
- editorial layouts
- luxury/exotic positioning
- visual hierarchy
- brand consistency

Rule: never let the site become a generic developer portfolio.

## P02 — `cinematic-motion`

**Priority:** P0

Controls:
- GSAP
- ScrollTrigger
- SplitText where appropriate
- Lenis where justified
- hero animation
- scroll choreography
- parallax
- sticky project stacks
- video reveals
- magnetic interactions
- custom cursor
- text/image reveals
- marquees
- SVG path animation
- page transitions
- before/after interactions
- reduced-motion alternatives

This is a core project Skill.

## P03 — `cinematic-video`

**Priority:** P0

Controls:
- hero showreel
- poster frames
- responsive/mobile video
- lazy loading
- preload strategy
- offscreen pause
- autoplay restrictions
- sound controls
- fallback images
- video scrubbing
- video performance

## P04 — `automotive-media`

**Priority:** P0

Controls:
- automotive photography
- vehicle imagery
- event photography
- drone footage
- galleries
- crops
- responsive media
- metadata

## P05 — `responsive-cinematic-ui`

**Priority:** P0

Ensures desktop, tablet and mobile receive intentional compositions rather than simply scaling desktop down.

## P06 — `performance-media`

**Priority:** P0

Controls:
- image optimization
- video optimization
- CDN strategy
- loading priority
- lazy loading
- Core Web Vitals
- media budgets

## P07 — `accessibility-motion`

**Priority:** P0

Defines accessible alternatives for:
- parallax
- smooth scrolling
- custom cursor
- animated text
- video effects
- scroll effects
- automatic motion

Must implement `prefers-reduced-motion`.

## P08 — `automotive-seo`

**Priority:** P1

Optimizes for relevant automotive creator/filmmaker searches in India without keyword stuffing.

## P09 — `car-dynasty-visual-qa`

**Priority:** P0

Tests:
- desktop
- tablet
- mobile
- video
- animation
- navigation
- project pages
- contact
- WhatsApp
- YouTube
- Instagram
- reduced motion
- console errors
- hydration errors
- layout shifts

Must inspect the rendered browser, not only source code.

## P10 — `automotive-portfolio-content`

**Priority:** P1

Manages:
- projects
- vehicles
- clients
- services
- categories
- project metadata
- YouTube videos
- social links
- testimonials
- stats

Strictly never fabricate content.

## P11 — `client-conversion-ux`

**Priority:** P1

Optimizes:
- CTA hierarchy
- WhatsApp conversion
- enquiry flow
- quote requests
- booking intent
- audience-specific paths

---

# 3. PROJECT SUBAGENTS

Recommended location:

```text
.agents/agents/
```

Create:

```text
creative-director.md
motion-engineer.md
frontend-engineer.md
media-performance-engineer.md
seo-accessibility-engineer.md
browser-qa-engineer.md
```

### Creative Director
Owns visual direction, composition, typography, premium automotive feel and brand consistency.

### Motion Engineer
Owns GSAP, ScrollTrigger, timelines, scroll choreography, transitions, cursor, magnetic interactions and motion performance.

### Frontend Engineer
Owns Next.js, React, TypeScript, routing, components and application architecture.

### Media Performance Engineer
Owns image/video delivery, CDN, compression, responsive media and Core Web Vitals.

### SEO / Accessibility Engineer
Owns metadata, structured data, accessibility and reduced-motion behavior.

### Browser QA Engineer
Owns actual browser testing, responsive testing, animation verification, forms, media and regression testing.

---

# 4. GLOBAL MCP SERVERS

Install globally only when they are useful across projects.

## M01 — Figma MCP

**Priority:** P0  
**Scope:** Global

Use for:
- Figma design context
- variables
- components
- layout
- design-to-code
- optional write-back to Figma

For this project, Figma is strongly recommended.

Use the official Figma MCP and verify current Antigravity compatibility before connecting.

## M02 — GitHub MCP

**Priority:** P0  
**Scope:** Global if you use GitHub

Use for:
- repository context
- issues
- pull requests
- project discussions
- change tracking

## M03 — Browser / Testing MCP

**Priority:** P0  
**Scope:** Global if needed

Use only if it provides capabilities beyond Antigravity's built-in browser/agent tooling.

Do not install duplicate browser tooling unnecessarily.

---

# 5. PROJECT/CONDITIONAL MCP SERVERS

## M04 — Database MCP

**Priority:** P2  
**Scope:** Project

Use only if the website actually uses a database/CMS.

Potential targets:
- PostgreSQL
- Supabase
- Neon
- AlloyDB

Useful for schema inspection, content queries and migration debugging.

Do not install for a static V1.

## M05 — Media/Cloudinary MCP

**Priority:** P2  
**Scope:** Project

Optional.

Use only if a useful, maintained MCP is available. The actual Cloudinary integration should normally be implemented through the application SDK/API rather than forcing everything through MCP.

## M06 — S3-compatible storage MCP

**Priority:** P2  
**Scope:** Project

Only if project assets are stored in S3-compatible object storage.

## M07 — Analytics MCP

**Priority:** P3  
**Scope:** Project

Optional. Only connect production analytics when there is a clear reason and appropriate access controls.

## M08 — Email MCP

**Priority:** P3  
**Scope:** Project

Optional. Not required for the website itself.

---

# 6. DO NOT TURN THESE INTO MCPs

These are project dependencies, not MCP servers:

```text
Next.js
React
TypeScript
GSAP
ScrollTrigger
Lenis
Tailwind CSS
Motion / Framer Motion
React Hook Form
Zod
Cloudinary SDK
PostgreSQL driver
```

Install/use them through normal project dependency management.

---

# 7. RECOMMENDED PROJECT DEPENDENCIES

## Core

- Next.js
- React
- TypeScript

## Styling

- Tailwind CSS
- CSS variables

## Motion

- GSAP
- GSAP ScrollTrigger
- GSAP SplitText where appropriate
- Lenis only if justified
- Motion/Framer Motion only where appropriate

## Forms

- React Hook Form
- Zod

## Media

- Cloudinary SDK or S3-compatible storage
- optimized image/video pipeline

## Optional

- PostgreSQL
- Prisma/Drizzle
- Supabase
- Analytics

Do not install optional infrastructure until the architecture requires it.

---

# 8. RECOMMENDED DIRECTORY STRUCTURE

```text
car-dynasty/
├── .agents/
│   ├── skills/
│   │   ├── automotive-art-direction/SKILL.md
│   │   ├── cinematic-motion/SKILL.md
│   │   ├── cinematic-video/SKILL.md
│   │   ├── automotive-media/SKILL.md
│   │   ├── responsive-cinematic-ui/SKILL.md
│   │   ├── performance-media/SKILL.md
│   │   ├── accessibility-motion/SKILL.md
│   │   ├── automotive-seo/SKILL.md
│   │   ├── car-dynasty-visual-qa/SKILL.md
│   │   ├── automotive-portfolio-content/SKILL.md
│   │   └── client-conversion-ux/SKILL.md
│   ├── agents/
│   │   ├── creative-director.md
│   │   ├── motion-engineer.md
│   │   ├── frontend-engineer.md
│   │   ├── media-performance-engineer.md
│   │   ├── seo-accessibility-engineer.md
│   │   └── browser-qa-engineer.md
│   └── mcp_config.json
├── docs/
├── public/assets/
├── src/
└── package.json
```

---

# 9. GLOBAL VS PROJECT MATRIX

| Capability | Global | Project | Priority |
|---|---:|---:|---:|
| frontend-engineering | YES | Optional override | P0 |
| code-review | YES | Optional | P0 |
| visual-qa | YES | YES, automotive version | P0 |
| accessibility | YES | YES, motion version | P0 |
| web-performance | YES | YES, media version | P0 |
| web-seo | YES | YES, automotive version | P1 |
| git-workflow | YES | Optional | P0 |
| web-security | YES | Optional | P1 |
| automotive-art-direction | NO | YES | P0 |
| cinematic-motion | NO | YES | P0 |
| cinematic-video | NO | YES | P0 |
| automotive-media | NO | YES | P0 |
| responsive-cinematic-ui | NO | YES | P0 |
| performance-media | NO | YES | P0 |
| accessibility-motion | NO | YES | P0 |
| automotive-seo | NO | YES | P1 |
| automotive-portfolio-content | NO | YES | P1 |
| client-conversion-ux | NO | YES | P1 |
| Figma MCP | YES | Optional workspace config | P0 |
| GitHub MCP | YES | Optional | P0 |
| Browser MCP | YES if needed | Optional | P0 |
| Database MCP | NO initially | YES if needed | P2 |
| Media MCP | NO initially | YES if needed | P2 |

---

# 10. INSTALLATION ORDER

## Phase A — Global

Install/configure:

1. `frontend-engineering`
2. `code-review`
3. `visual-qa`
4. `accessibility`
5. `web-performance`
6. `git-workflow`
7. `web-security`

Then:

8. Figma MCP
9. GitHub MCP
10. Browser/testing MCP only if built-in browser capabilities are insufficient

## Phase B — Car Dynasty project

Create:

```text
.agents/skills/
.agents/agents/
.agents/mcp_config.json
```

Add all P0 project Skills first:

1. automotive-art-direction
2. cinematic-motion
3. cinematic-video
4. automotive-media
5. responsive-cinematic-ui
6. performance-media
7. accessibility-motion
8. car-dynasty-visual-qa

Then P1:

9. automotive-seo
10. automotive-portfolio-content
11. client-conversion-ux

## Phase C — Project agents

Add:

1. creative-director
2. motion-engineer
3. frontend-engineer
4. media-performance-engineer
5. seo-accessibility-engineer
6. browser-qa-engineer

## Phase D — Optional infrastructure

Only after architecture confirms the need:

- Database MCP
- media/storage integration
- analytics
- email
- issue-management integrations

---

# 11. SECURITY RULES

Prefer read-only access for production systems.

Never place secrets inside:

- Skills
- agent files
- Markdown prompts
- Git repositories

Use environment variables and Antigravity MCP configuration/secret mechanisms.

Do not give an agent production write access unless it is genuinely required.

---

# 12. SKILL DESIGN RULES

Every custom Skill should:

1. Have YAML frontmatter.
2. Have a precise description.
3. Define when it triggers.
4. Define what it does.
5. Define what it does not do.
6. Contain a workflow.
7. Contain decision rules.
8. Contain verification steps.
9. Stay focused on one responsibility.
10. Avoid duplicating another Skill.

Do not create one giant `build-entire-website` Skill.

---

# 13. MOTION SKILL REQUIREMENT

`cinematic-motion` must reference:

```text
/docs/MOTION_SPEC.md
```

The animation inventory must include:

- Hero reveal
- Hero video motion
- Typography reveals
- Scroll choreography
- Parallax
- Sticky project stack
- Portfolio hover
- Video previews
- Magnetic CTA
- Custom cursor
- Page transitions
- Image reveals
- Video reveals
- Marquee
- SVG path animation
- Process timeline
- Stats animation
- BTS before/after
- Contact success animation
- Footer transition
- Mobile alternatives
- Reduced-motion alternatives

If an animation is intentionally rejected for UX/performance reasons, document why.

---

# 14. VISUAL QA RULE

A successful build is not merely:

```text
npm run build
```

Required flow:

```text
Code
 ↓
Build
 ↓
Run
 ↓
Open browser
 ↓
Inspect
 ↓
Interact
 ↓
Resize
 ↓
Test motion
 ↓
Test reduced motion
 ↓
Fix
 ↓
Re-test
```

---

# 15. FINAL RECOMMENDED SETUP

## Global

```text
Skills:
├── frontend-engineering
├── code-review
├── visual-qa
├── accessibility
├── web-performance
├── web-seo
├── git-workflow
└── web-security

MCP:
├── Figma
├── GitHub
└── Browser/testing only if needed
```

## Car Dynasty project

```text
Skills:
├── automotive-art-direction
├── cinematic-motion
├── cinematic-video
├── automotive-media
├── responsive-cinematic-ui
├── performance-media
├── accessibility-motion
├── automotive-seo
├── car-dynasty-visual-qa
├── automotive-portfolio-content
└── client-conversion-ux

Agents:
├── creative-director
├── motion-engineer
├── frontend-engineer
├── media-performance-engineer
├── seo-accessibility-engineer
└── browser-qa-engineer

MCP:
├── Figma
├── GitHub
└── Database/media MCP only when required
```

---

# 16. CURRENT ANTIGRAVITY PATHS

According to current Antigravity documentation:

Global Skills:

```text
~/.gemini/config/skills/
```

Workspace Skills:

```text
<workspace-root>/.agents/skills/
```

Global MCP:

```text
~/.gemini/config/mcp_config.json
```

Workspace MCP:

```text
<workspace-root>/.agents/mcp_config.json
```

Antigravity IDE also provides an MCP Store for supported servers.

Before installing any third-party MCP, verify current availability and compatibility in the current Antigravity MCP Store and the provider's official documentation.

---

# 17. FINAL PRINCIPLE

Do not optimize for the number of MCP servers.

Optimize for:

```text
FEWER
+
HIGH QUALITY
+
CORRECT SCOPE
+
STRONG PROJECT SKILLS
+
SPECIALIZED AGENTS
+
BROWSER VERIFICATION
```

For this project, the highest-value capabilities are:

1. Figma integration
2. Browser/visual QA
3. Cinematic motion
4. Automotive art direction
5. Video/media engineering
6. Performance engineering
7. Accessibility/reduced motion
8. SEO
9. GitHub workflow
10. Optional CMS/database tooling
