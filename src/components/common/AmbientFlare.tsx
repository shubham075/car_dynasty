import React from "react";
import { cn } from "@/lib/utils";

interface AmbientFlareProps {
  className?: string;
  color?: "orange" | "red" | "emerald";
  position?: "left" | "right" | "center";
}

export function AmbientFlare({
  className,
  color = "orange",
  position = "center",
}: AmbientFlareProps) {
  const colors = {
    orange: "bg-[#ff4d00]",
    red: "bg-red-600",
    emerald: "bg-emerald-600",
  };

  const positions = {
    left: "-left-[20%] top-1/2 -translate-y-1/2",
    right: "-right-[20%] top-1/2 -translate-y-1/2",
    center: "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
  };

  return (
    <div
      className={cn(
        "pointer-events-none absolute h-[60vh] w-[60vh] rounded-full opacity-10 blur-[120px] mix-blend-screen",
        colors[color],
        positions[position],
        className
      )}
    />
  );
}
