# MOTION SPECIFICATION — Car Dynasty

## 1. Motion Principles
- **Cinematic Pacing:** Motion is motivated, authoritative, and weighted like a luxury vehicle on asphalt—never frantic or bouncing.
- **Hierarchy:** Hero Reveal > Selected Work Interactions > Section Choreography > Supporting Micro-interactions.
- **Hardware Acceleration:** Only animate 	ransform and opacity.

## 2. Animation Inventory
1. **Hero Entry Timeline:**
   - Shutter aperture reveal effect.
   - Letters rise from bottom with subtle stagger (power3.out).
   - Hero poster / showreel expands from 92% to 100% viewport width.
2. **Smooth Scroll (Lenis):**
   - Inertia-based fluid scrolling on desktop.
   - Disabled on touch devices or under prefers-reduced-motion.
3. **Scroll Choreography (ScrollTrigger):**
   - Pin-stacked feature film cards sliding over each other.
   - Rolling odometer count-up for verified metrics (16K+, 200+).
   - Horizontal reel scrubber for behind-the-scenes clips.
4. **Interactive Custom Cursor:**
   - Magnetic snap to buttons and video play controls.
   - Expands to VIEW FILM or DRAG when hovering media cards.

## 3. Accessibility & Reduced Motion
- When prefers-reduced-motion: reduce is detected:
  - Disable smooth scroll inertia (Lenis).
  - Convert all multi-stage scrubbed animations to clean static opacity transitions (0.2s fade).
  - Disable custom cursor and magnetic pull effects.
