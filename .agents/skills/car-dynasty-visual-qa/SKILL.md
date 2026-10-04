---
name: car-dynasty-visual-qa
description: Full browser-based visual QA for Car Dynasty. Rendered browser inspection required, not just source.
trigger: model_decision
---
# Car Dynasty Visual QA Skill
## Rule: Inspect rendered browser. npm run build is NOT proof of completion.
## Flow: Code->Build->Run->Browser->Inspect->Interact->Resize->Motion->Reduced-motion->Fix->Re-test
## Checklist
- Layout: 360, 390, 430, 768, 1024, 1280, 1440, 1920px
- Video: poster frames, muted autoplay only, pause off-screen
- Animation: hero, nav, typography reveals, scroll, portfolio hover, sticky stack, BTS, cursor, magnetic, page transitions
- Navigation: hide/show scroll behavior, mobile menu, all CTAs
- Contact form, WhatsApp, YouTube, Instagram links functional
- Reduced motion: verify disabled/simplified
- Console errors: zero. Hydration errors: zero. Layout shifts: zero.
