---
name: cinematic-motion
description: GSAP, ScrollTrigger, Lenis, hero motion, scroll choreography, parallax, sticky stacks, page transitions for Car Dynasty.
trigger: model_decision
---
# Cinematic Motion Skill
## Reference: /docs/MOTION_SPEC.md
## Tools: GSAP+ScrollTrigger primary. Lenis only where justified. Never mix systems on one element.
## Principles
- Cinematic pacing, not constant motion.
- Hierarchy: hero > portfolio > transitions > supporting UI.
- Use transform/opacity only.
- Every animation must serve: speed, weight, direction, depth, or focus.
## Reusable Components
SplitReveal, ScrollReveal, ScrollWords, Magnetic, Parallax, Marquee, VideoReveal, PinStack, CircleReveal, Counter, DrawPath, Cursor, PageTransition, VideoScrub, BeforeAfter.
## Reduced Motion: Disable Lenis, cursor, large parallax, marquees, scroll scrubbing. Simple fades only.
## Quality Gate: Story-supporting, automotive identity consistent, mobile-graceful, reduced-motion safe, browser-verified.
