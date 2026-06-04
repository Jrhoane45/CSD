"use client";

import { useRef, useState } from "react";
import { ImagePlus, Film, X, Plus, Play } from "lucide-react";
import type { ProfileVideo } from "@/lib/types";

export function MediaUploader({
  photos,
  videos,
  onPhotos,
  onVideos,
  maxPhotos = 6,
  maxVideos = 2,
  editable = true,
}: {
  photos: string[];
  videos: ProfileVideo[];
  onPhotos?: (next: string[]) => void;
  onVideos?: (next: ProfileVideo[]) => void;
  maxPhotos?: number;
  maxVideos?: number;
  editable?: boolean;
}) {
  const photoRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const [link, setLink] = useState("");

  const addPhotos = (files: FileList | null) => {
    if (!files || !onPhotos) return;
    const room = maxPhotos - photos.length;
    const list = Array.from(files).slice(0, room);
    if (list.length === 0) return;
    const added: string[] = [];
    let pending = list.length;
    list.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new window.Image();
        img.onload = () => {
          const MAX = 900;
          const scale = Math.min(1, MAX / Math.max(img.width, img.height));
          const w = Math.round(img.width * scale);
          const h = Math.round(img.height * scale);
          const c = document.createElement("canvas");
          c.width = w;
          c.height = h;
          c.getContext("2d")?.drawImage(img, 0, 0, w, h);
          added.push(c.toDataURL("image/jpeg", 0.82));
          if (--pending === 0) onPhotos([...photos, ...added]);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const addVideoFile = (files: FileList | null) => {
    if (!files?.[0] || !onVideos || videos.length >= maxVideos) return;
    const f = files[0];
    onVideos([...videos, { src: URL.createObjectURL(f), name: f.name, kind: "file" }]);
  };

  const addVideoLink = () => {
    if (!onVideos || videos.length >= maxVideos) return;
    const url = link.trim();
    if (!/^https?:\/\//i.test(url)) return;
    onVideos([...videos, { src: url, name: "Highlight link", kind: "link" }]);
    setLink("");
  };

  return (
    <div className="space-y-6">
      {/* Photos */}
      <div>
        <div className="flex items-center justify-between">
          <p className="eyebrow text-ink/50">Photos ({photos.length}/{maxPhotos})</p>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2.5 sm:grid-cols-6">
          {photos.map((src, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden rounded-xl border border-ink/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
              {editable && (
                <button
                  onClick={() => onPhotos?.(photos.filter((_, j) => j !== i))}
                  className="absolute right-1 top-1 rounded-full bg-ink/70 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Remove photo"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          ))}
          {editable && photos.length < maxPhotos && (
            <button
              onClick={() => photoRef.current?.click()}
              className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-ink/25 text-ink/45 hover:border-navy hover:text-navy"
            >
              <ImagePlus size={20} />
              <span className="text-[0.6rem] font-medium">Add</span>
            </button>
          )}
        </div>
        {editable && (
          <input ref={photoRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => addPhotos(e.target.files)} />
        )}
      </div>

      {/* Videos */}
      <div>
        <p className="eyebrow text-ink/50">Videos ({videos.length}/{maxVideos})</p>
        <div className="mt-2 grid gap-2.5 sm:grid-cols-2">
          {videos.map((v, i) => (
            <div key={i} className="group relative overflow-hidden rounded-xl border border-ink/10 bg-ink/[0.03]">
              {v.kind === "file" ? (
                <video src={v.src} controls className="aspect-video w-full bg-black object-contain" />
              ) : (
                <a
                  href={v.src}
                  target="_blank"
                  rel="noreferrer"
                  className="flex aspect-video w-full flex-col items-center justify-center gap-2 bg-navy text-white"
                >
                  <Play size={26} className="text-gold" />
                  <span className="px-3 text-center text-xs">Watch highlight ↗</span>
                </a>
              )}
              <div className="flex items-center justify-between px-3 py-1.5">
                <span className="truncate text-xs text-ink/60">{v.name}</span>
                {editable && (
                  <button onClick={() => onVideos?.(videos.filter((_, j) => j !== i))} className="text-ink/45 hover:text-red" aria-label="Remove video">
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>
          ))}
          {editable && videos.length < maxVideos && (
            <button
              onClick={() => videoRef.current?.click()}
              className="flex aspect-video flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-ink/25 text-ink/45 hover:border-navy hover:text-navy"
            >
              <Film size={22} />
              <span className="text-xs font-medium">Upload video</span>
            </button>
          )}
        </div>
        {editable && (
          <>
            <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={(e) => addVideoFile(e.target.files)} />
            {videos.length < maxVideos && (
              <div className="mt-2.5 flex gap-2">
                <input
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="…or paste a highlight link (YouTube, Hudl)"
                  className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-navy"
                />
                <button onClick={addVideoLink} className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-navy/30 px-3 py-2 text-sm font-semibold text-navy hover:bg-navy hover:text-white">
                  <Plus size={14} /> Add
                </button>
              </div>
            )}
          </>
        )}
        {editable && (
          <p className="mt-2 text-xs text-ink/40">Demo: photos are saved to your profile; uploaded video files preview in this session.</p>
        )}
      </div>
    </div>
  );
}
