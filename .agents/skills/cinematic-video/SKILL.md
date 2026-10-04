---
name: cinematic-video
description: Hero showreel, poster frames, responsive video, lazy loading, offscreen pause, autoplay rules for Car Dynasty.
trigger: model_decision
---
# Cinematic Video Skill
## Rules
- Always provide poster image. Never show blank before video loads.
- Never autoplay audio. Autoplay muted only.
- Lazy load off-screen videos via Intersection Observer.
- Pause videos leaving viewport. Never load all videos simultaneously.
- Provide fallback image when video cannot play.
- Reserve layout space to prevent CLS.
## Hero Showreel
Full-screen, poster-first, no first-paint block. Controls: play, pause, sound, fullscreen.
