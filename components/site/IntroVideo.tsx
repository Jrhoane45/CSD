"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";

// Intro clip lives at /public/intro.mp4 with a poster at /public/intro-poster.jpg.
const SRC = "/intro.mp4";

export function IntroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  // Ensure muted autoplay starts (React can miss the `muted` attr on hydration).
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  const toggleSound = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    if (!v.muted) v.play().catch(() => {});
    setMuted(v.muted);
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="text-center">
        <Eyebrow className="justify-center">Watch</Eyebrow>
        <h2 className="display mt-4 text-4xl text-navy sm:text-5xl">SEE CLUB SPORTS DIRECT IN ACTION</h2>
        <p className="mx-auto mt-3 max-w-2xl text-ink/65">
          A quick look at how CSD connects athletes to the right clubs, trainers, and advisers.
        </p>
      </div>

      <div className="group relative mx-auto mt-10 max-w-4xl overflow-hidden rounded-3xl border border-ink/10 shadow-[var(--shadow-lift)]">
        <video
          ref={ref}
          src={SRC}
          poster="/intro-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          controls
          className="aspect-video w-full bg-black"
        >
          Your browser doesn&apos;t support embedded video.
        </video>

        <button
          onClick={toggleSound}
          className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-ink/70 px-3.5 py-2 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-ink"
          aria-label={muted ? "Unmute video" : "Mute video"}
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          {muted ? "Tap for sound" : "Sound on"}
        </button>
      </div>
    </section>
  );
}
