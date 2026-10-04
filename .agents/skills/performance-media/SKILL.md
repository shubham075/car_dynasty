---
name: performance-media
description: Image/video optimization, CDN, loading priority, Core Web Vitals and media budgets for Car Dynasty.
trigger: model_decision
---
# Performance Media Skill
## Targets: Lighthouse 90+, LCP < 2.5s, CLS < 0.05, INP < 200ms
## Rules
- Lazy-load all off-screen images and videos.
- next/image with correct sizes prop.
- Optimized video codec/bitrate per device.
- Pause off-screen videos. Lazy-load GSAP ScrollTrigger and WebGL.
- Use transform/opacity only. Kill GSAP contexts on route changes.
- Test on low-powered mobile emulation.
