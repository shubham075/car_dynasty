"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { usePathname } from "next/navigation";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Check if device supports hover
    const canHover = window.matchMedia("(hover: hover)").matches;

    if (prefersReducedMotion || !canHover || !cursorRef.current || !cursorDotRef.current) {
      if (cursorRef.current) cursorRef.current.style.display = "none";
      if (cursorDotRef.current) cursorDotRef.current.style.display = "none";
      return;
    }

    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;

    // Move cursor function
    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.7,
        ease: "power2.out",
      });
      gsap.to(cursorDot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "none",
      });
    };

    window.addEventListener("mousemove", onMouseMove);

    // Magnetic and expansion effects
    const interactiveElements = document.querySelectorAll("a, button, input, textarea, [data-cursor]");
    
    const onMouseEnter = (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      const type = el.getAttribute("data-cursor") || "default";

      if (type === "view") {
        gsap.to(cursor, { width: 80, height: 80, backgroundColor: "rgba(255, 77, 0, 0.9)", mixBlendMode: "normal", duration: 0.3 });
        gsap.to(cursorDot, { opacity: 0, duration: 0.2 });
        cursor.innerHTML = "<span style='color: white; font-size: 10px; font-weight: bold; font-family: monospace; letter-spacing: 1px; pointer-events: none;'>VIEW</span>";
      } else {
        gsap.to(cursor, { width: 40, height: 40, backgroundColor: "transparent", border: "1px solid rgba(255, 77, 0, 0.5)", mixBlendMode: "difference", duration: 0.3 });
      }
    };

    const onMouseLeave = () => {
      gsap.to(cursor, { width: 24, height: 24, backgroundColor: "rgba(255, 77, 0, 0.1)", border: "1px solid rgba(255, 77, 0, 0.2)", mixBlendMode: "normal", duration: 0.3 });
      gsap.to(cursorDot, { opacity: 1, duration: 0.2 });
      cursor.innerHTML = "";
    };

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", onMouseEnter);
      el.addEventListener("mouseleave", onMouseLeave);
    });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", onMouseEnter);
        el.removeEventListener("mouseleave", onMouseLeave);
      });
    };
  }, [pathname]);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-6 h-6 rounded-full bg-[#ff4d00]/10 border border-[#ff4d00]/20 pointer-events-none z-[100] transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-opacity duration-300 backdrop-blur-[2px]"
      />
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-[#ff4d00] pointer-events-none z-[100] transform -translate-x-1/2 -translate-y-1/2"
      />
    </>
  );
}
