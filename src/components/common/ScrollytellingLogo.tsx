"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface ScrollytellingLogoProps {
  text?: string;
  type?: "horizontal-scroll" | "vertical-scroll" | "rotate" | "scale";
  className?: string;
  speed?: number; // scroll multiplier
}

export function ScrollytellingLogo({
  text = "CAR DYNASTY",
  type = "horizontal-scroll",
  className,
  speed = 1,
}: ScrollytellingLogoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !containerRef.current || !textRef.current) return;

    const container = containerRef.current;
    const textEl = textRef.current;

    let animationVars: gsap.TweenVars = {
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top bottom",
        end: "bottom top",
        scrub: 1, // 1 second smoothing
      },
    };

    if (type === "horizontal-scroll") {
      animationVars.xPercent = -50 * speed;
    } else if (type === "vertical-scroll") {
      animationVars.yPercent = -50 * speed;
    } else if (type === "rotate") {
      animationVars.rotation = 180 * speed;
    } else if (type === "scale") {
      animationVars.scale = 1 + (0.5 * speed);
    }

    const tween = gsap.to(textEl, animationVars);

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach(t => {
        if (t.vars.trigger === container) t.kill();
      });
    };
  }, [type, speed]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none z-0 flex items-center justify-center opacity-[0.02] select-none",
        className
      )}
    >
      <div
        ref={textRef}
        className="font-display text-[20vw] leading-none whitespace-nowrap text-transparent"
        style={{
          WebkitTextStroke: "2px white",
          willChange: "transform",
        }}
      >
        {text}
      </div>
    </div>
  );
}
