---
name: automotive-media
description: Automotive photography, vehicle imagery, event/drone footage, galleries, responsive media for Car Dynasty.
trigger: model_decision
---
# Automotive Media Skill
## Rules
- Use next/image for all images. Meaningful alt text.
- Correct aspect ratios: 16:9 hero, 4:3 gallery. Width/height to prevent CLS.
- WebP/AVIF format. Lazy load below-fold images.
- Never fabricate vehicle images. Explicit placeholders until real assets supplied.
## Asset Structure: /public/assets/creator|brand|hero|projects|events|cars|bts|icons|social|og
