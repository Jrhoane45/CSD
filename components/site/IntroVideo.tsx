"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { CsdBadge } from "@/components/brand/CsdBadge";
import { Eyebrow } from "@/components/ui/Eyebrow";

// Drop the intro clip at /public/intro.mp4 (and optionally /public/intro-poster.jpg).
const SRC = "/intro.mp4";

export function IntroVideo() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="text-center">
        <Eyebrow className="justify-center">Watch</Eyebrow>
        <h2 className="display mt-4 text-4xl text-navy sm:text-5xl">SEE CLUB SPORTS DIRECT IN ACTION</h2>
        <p className="mx-auto mt-3 max-w-2xl text-ink/65">
          A quick look at how CSD connects athletes to the right clubs, trainers, and advisers.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-3xl border border-ink/10 shadow-[var(--shadow-lift)]">
        {playing ? (
          <video
            src={SRC}
            poster="/intro-poster.jpg"
            controls
            autoPlay
            playsInline
            className="aspect-video w-full bg-black"
          >
            Your browser doesn&apos;t support embedded video.
          </video>
        ) : (
          <button
            onClick={() => setPlaying(true)}
            className="group relative flex aspect-video w-full items-center justify-center overflow-hidden bg-navy"
            aria-label="Play intro video"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.18]"
              style={{
                backgroundImage: "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
                backgroundSize: "22px 22px",
              }}
            />
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-red/20 blur-3xl" />
            <div className="absolute -bottom-20 left-1/4 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
            <div className="relative flex flex-col items-center gap-5 text-white">
              <CsdBadge className="h-16 w-16" />
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gold text-ink shadow-lg transition-transform group-hover:scale-105">
                <Play size={34} className="ml-1" fill="currentColor" />
              </span>
              <span className="eyebrow text-gold-300">Watch the intro</span>
            </div>
          </button>
        )}
      </div>
    </section>
  );
}
