import React from "react";
import { cn } from "@/lib/utils";

interface WindTunnelGridProps {
  className?: string;
  speed?: "slow" | "normal" | "fast";
  showStreamlines?: boolean;
}

export function WindTunnelGrid({
  className,
  speed = "normal",
  showStreamlines = true,
}: WindTunnelGridProps) {
  const speedMap = {
    slow: "12s",
    normal: "6s",
    fast: "3s",
  };

  const streamDurationMap = {
    slow: "4.5s",
    normal: "2.8s",
    fast: "1.5s",
  };

  const animDuration = speedMap[speed];
  const streamDuration = streamDurationMap[speed];

  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute inset-0 pointer-events-none z-0 overflow-hidden select-none",
        className
      )}
    >
      {/* 3D Perspective Chamber */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          perspective: "650px",
          perspectiveOrigin: "50% 18%",
        }}
      >
        {/* Wind Tunnel Upper Perspective (Ceiling Grid) */}
        <div
          className="absolute w-[200%] h-[550px] -left-[50%] -top-[350px] pointer-events-none"
          style={{
            transformOrigin: "50% 100%",
            transform: "rotateX(-78deg)",
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
              linear-gradient(to top, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: "70px 70px",
            animation: `windCeilingScroll ${animDuration} linear infinite`,
            maskImage: "linear-gradient(to top, black 0%, transparent 80%)",
            WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 80%)",
          }}
        />

        {/* Horizon Vanishing Line / Velocity Datum */}
        <div
          className="absolute left-0 right-0 h-[1px] pointer-events-none"
          style={{
            top: "18%",
            background:
              "linear-gradient(to right, transparent 5%, rgba(255, 77, 0, 0.15) 25%, rgba(255, 77, 0, 0.6) 50%, rgba(255, 77, 0, 0.15) 75%, transparent 95%)",
            boxShadow: "0 0 16px rgba(255, 77, 0, 0.4)",
          }}
        />

        {/* Horizon Intake Glow Orb */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 w-[340px] h-[90px] rounded-full pointer-events-none"
          style={{
            top: "18%",
            left: "50%",
            background:
              "radial-gradient(ellipse at center, rgba(255, 77, 0, 0.14), transparent 70%)",
            filter: "blur(20px)",
          }}
        />

        {/* Wind Tunnel Floor Grid (Rolling Road Plane) */}
        <div
          className="absolute w-[200%] h-[1500px] -left-[50%] pointer-events-none"
          style={{
            top: "18%",
            transformOrigin: "50% 0%",
            transform: "rotateX(75deg)",
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: "70px 70px",
            animation: `windFloorScroll ${animDuration} linear infinite`,
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 12%, black 75%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 12%, black 75%, transparent 100%)",
          }}
        >
          {/* High-Velocity Centerline */}
          <div
            className="absolute top-0 bottom-0 w-[2px] pointer-events-none"
            style={{
              left: "calc(50% - 1px)",
              background:
                "linear-gradient(to bottom, rgba(255, 77, 0, 0.7), rgba(255, 77, 0, 0.25), transparent)",
              boxShadow: "0 0 8px rgba(255, 77, 0, 0.4)",
            }}
          />

          {/* Aerodynamic Wind Streamlines */}
          {showStreamlines && (
            <>
              <div
                className="wind-streamline s-lane-1"
                style={{
                  left: "36%",
                  animationDuration: streamDuration,
                  animationDelay: "0s",
                }}
              />
              <div
                className="wind-streamline s-lane-2"
                style={{
                  left: "43%",
                  animationDuration: streamDuration,
                  animationDelay: "1.4s",
                }}
              />
              <div
                className="wind-streamline s-lane-3"
                style={{
                  left: "57%",
                  animationDuration: streamDuration,
                  animationDelay: "0.7s",
                }}
              />
              <div
                className="wind-streamline s-lane-4"
                style={{
                  left: "64%",
                  animationDuration: streamDuration,
                  animationDelay: "2.1s",
                }}
              />
            </>
          )}
        </div>
      </div>

      {/* Perimeter Vignette to blend into obsidian section background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 75% 75% at center, transparent 35%, #070809 100%)",
        }}
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes windFloorScroll {
              0% { background-position: 0 0; }
              100% { background-position: 0 70px; }
            }
            @keyframes windCeilingScroll {
              0% { background-position: 0 0; }
              100% { background-position: 0 -70px; }
            }
            .wind-streamline {
              position: absolute;
              width: 2px;
              height: 140px;
              background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.85), rgba(255, 77, 0, 0.75), transparent);
              box-shadow: 0 0 10px rgba(255, 77, 0, 0.5);
              animation-name: streamFlow;
              animation-iteration-count: infinite;
              animation-timing-function: linear;
            }
            @keyframes streamFlow {
              0% {
                top: 0%;
                opacity: 0;
                transform: scaleY(0.2);
              }
              25% {
                opacity: 1;
              }
              80% {
                opacity: 0.75;
              }
              100% {
                top: 100%;
                opacity: 0;
                transform: scaleY(2.2);
              }
            }
            @media (prefers-reduced-motion: reduce) {
              .wind-streamline {
                display: none !important;
              }
              div[style*="windFloorScroll"],
              div[style*="windCeilingScroll"] {
                animation: none !important;
              }
            }
          `,
        }}
      />
    </div>
  );
}
