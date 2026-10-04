"use client";

import React, { useEffect, useState } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    if (prefersReducedMotion) {
      return;
    }

    const _lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    setLenis(_lenis);

    // Synchronize Lenis scrolling with GSAP ScrollTrigger
    _lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      _lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      _lenis.destroy();
      gsap.ticker.remove((time) => {
        _lenis.raf(time * 1000);
      });
    };
  }, []);

  return <>{children}</>;
}
