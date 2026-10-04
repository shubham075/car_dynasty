"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface AnimatedNumberProps {
  value: string;
}

export function AnimatedNumber({ value }: AnimatedNumberProps) {
  const nodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !nodeRef.current) return;

    // Parse numeric part and suffix
    const numericPartMatch = value.match(/\d+/);
    if (!numericPartMatch) return;
    
    const targetNumber = parseInt(numericPartMatch[0], 10);
    const suffix = value.substring(numericPartMatch[0].length);

    // Initial state
    nodeRef.current.innerText = `0${suffix}`;

    const obj = { val: 0 };

    gsap.to(obj, {
      val: targetNumber,
      duration: 2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: nodeRef.current,
        start: "top 90%",
      },
      onUpdate: () => {
        if (nodeRef.current) {
          nodeRef.current.innerText = `${Math.floor(obj.val)}${suffix}`;
        }
      },
    });
  }, [value]);

  return <span ref={nodeRef}>{value}</span>;
}
