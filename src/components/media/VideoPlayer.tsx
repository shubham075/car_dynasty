"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface VideoPlayerProps {
  posterSrc?: string;
  videoSrc?: string;
  title?: string;
  aspectRatio?: "16/9" | "21/9";
  autoPlay?: boolean;
}

export function VideoPlayer({
  posterSrc = "/assets/hero/hero-poster.jpg",
  videoSrc,
  title = "Car Dynasty Showreel",
  aspectRatio = "16/9",
  autoPlay = true,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  return (
    <div
      className={`relative w-full overflow-hidden bg-black border border-white/10 group ${
        aspectRatio === "21/9" ? "aspect-[21/9]" : "aspect-[16/9]"
      }`}
    >
      {/* Background Video or Poster */}
      {videoSrc ? (
        <video
          ref={videoRef}
          src={videoSrc}
          poster={posterSrc}
          autoPlay={autoPlay}
          muted={isMuted}
          loop
          playsInline
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="relative w-full h-full">
          <Image
            src={posterSrc}
            alt={title}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      )}

      {/* Cinematic Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

      {/* Viewfinder HUD Overlays */}
      <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none">
        <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
        <span className="font-mono-tech text-[11px] tracking-widest text-zinc-300 uppercase">
          REC • 4K UHD 24FPS
        </span>
      </div>

      <div className="absolute top-4 right-4 font-mono-tech text-[11px] text-zinc-400 pointer-events-none">
        ANAMORPHIC // 2.39:1
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          {videoSrc && (
            <button
              onClick={togglePlay}
              className="p-2.5 bg-black/60 backdrop-blur-md border border-white/20 text-white hover:border-[#ff4d00] hover:text-[#ff4d00] transition-colors cursor-pointer"
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          )}

          {videoSrc && (
            <button
              onClick={toggleMute}
              className="p-2.5 bg-black/60 backdrop-blur-md border border-white/20 text-white hover:border-[#ff4d00] hover:text-[#ff4d00] transition-colors cursor-pointer"
              aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          )}

          <div className="font-mono-tech text-xs text-white/90 drop-shadow">
            {title}
          </div>
        </div>

        <div className="font-mono-tech text-[10px] text-zinc-400 hidden sm:block">
          DIRECTED BY APOORVA SHRIVASTAVA
        </div>
      </div>
    </div>
  );
}
