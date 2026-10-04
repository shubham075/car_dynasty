import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  className,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-mono-tech tracking-wider uppercase transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff4d00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#070809]";

  const variants = {
    primary:
      "bg-[#ff4d00] hover:bg-[#ff6422] text-white shadow-[0_0_20px_rgba(255,77,0,0.3)] hover:shadow-[0_0_25px_rgba(255,77,0,0.5)] border border-[#ff4d00]",
    secondary:
      "bg-[#16181b] hover:bg-[#20242a] text-zinc-100 border border-white/10 hover:border-white/20",
    outline:
      "bg-transparent hover:bg-white/5 text-zinc-200 border border-white/20 hover:border-[#ff4d00] hover:text-[#ff4d00]",
    ghost:
      "bg-transparent hover:bg-white/5 text-zinc-400 hover:text-zinc-100",
  };

  const sizes = {
    sm: "text-xs px-3.5 py-1.5 gap-1.5",
    md: "text-xs md:text-sm px-5 py-2.5 gap-2",
    lg: "text-sm md:text-base px-7 py-3.5 gap-3",
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
