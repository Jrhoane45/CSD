"use client";

import { useMemo, useState } from "react";
import { Star, PenLine, Check } from "lucide-react";
import type { Category, Review, ReviewDimension } from "@/lib/types";
import { useStore, addReview } from "@/lib/store";
import { useProfile } from "@/lib/useProfile";
import { StarRating } from "@/components/ui/StarRating";
import { ReviewList } from "@/components/listing/ReviewList";
import { Modal } from "@/components/ui/Modal";

const DIMENSIONS: Record<Category, string[]> = {
  club: ["Communication", "Professionalism", "Value", "Depth of Playing Schedule", "Program Time Allocation"],
  trainer: ["Communication", "Professionalism", "Training Tools & Equipment", "Facility Quality", "Price vs. Value"],
  consultant: ["Communication", "Professionalism", "Value", "Quality of Alumni"],
};

export function ListingReviews({
  listingId,
  listingName,
  category,
  seedReviews,
}: {
  listingId: string;
  listingName: string;
  category: Category;
  seedReviews: Review[];
}) {
  const { reviews } = useStore();
  const mine = useMemo(
    () => reviews.filter((r) => r.listingId === listingId),
    [reviews, listingId],
  );
  const all = useMemo<Review[]>(() => [...mine, ...seedReviews], [mine, seedReviews]);

  const rating = all.length ? all.reduce((s, r) => s + r.rating, 0) / all.length : 0;

  const dimAverages = useMemo(() => {
    const m = new Map<string, { sum: number; n: number }>();
    for (const r of all)
      for (const d of r.dimensions) {
        const cur = m.get(d.label) ?? { sum: 0, n: 0 };
        m.set(d.label, { sum: cur.sum + d.value, n: cur.n + 1 });
      }
    return [...m.entries()].map(([label, v]) => ({ label, value: v.sum / v.n }));
  }, [all]);

  const [open, setOpen] = useState(false);

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="display text-2xl text-navy">REVIEWS</h2>
        <div className="flex items-center gap-3">
          <StarRating value={rating} count={all.length} />
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-navy/30 px-3.5 py-2 text-sm font-semibold text-navy transition-colors hover:bg-navy hover:text-white"
          >
            <PenLine size={15} /> Write a review
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-2 rounded-2xl border border-ink/10 bg-cream-200 p-5 sm:grid-cols-2">
        {dimAverages.map((d) => (
          <div key={d.label} className="flex items-center justify-between gap-3">
            <span className="text-sm text-ink/65">{d.label}</span>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-20 rounded-full bg-white">
                <div className="h-1.5 rounded-full bg-gold" style={{ width: `${(d.value / 5) * 100}%` }} />
              </div>
              <span className="w-7 text-right text-sm font-semibold text-navy">{d.value.toFixed(1)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <ReviewList reviews={all} />
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`Review ${listingName}`}
        subtitle="Share an honest, specific account to help other families."
      >
        <ReviewForm
          listingId={listingId}
          listingName={listingName}
          category={category}
          onDone={() => setOpen(false)}
        />
      </Modal>
    </section>
  );
}

function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i)}
          aria-label={`${i} star${i > 1 ? "s" : ""}`}
        >
          <Star
            size={28}
            className={(hover || value) >= i ? "text-gold" : "text-ink/20"}
            fill="currentColor"
          />
        </button>
      ))}
    </div>
  );
}

function ReviewForm({
  listingId,
  listingName,
  category,
  onDone,
}: {
  listingId: string;
  listingName: string;
  category: Category;
  onDone: () => void;
}) {
  const { profile } = useProfile();
  const author =
    profile?.parentName ||
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
    "Verified Parent";
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [dims, setDims] = useState<Record<string, number>>(
    Object.fromEntries(DIMENSIONS[category].map((d) => [d, 5])),
  );
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="py-4 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy text-white">
          <Check size={28} />
        </div>
        <p className="mt-4 font-semibold text-navy">Review posted</p>
        <p className="mt-1 text-sm text-ink/60">
          Thanks — your review is now live on {listingName}&apos;s profile.
        </p>
        <button
          onClick={onDone}
          className="mt-5 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const dimensions: ReviewDimension[] = DIMENSIONS[category].map((label) => ({
          label,
          value: dims[label],
        }));
        addReview({
          listingId,
          author,
          rating,
          title: title.trim() || "Great experience",
          body: body.trim() || "A positive experience overall.",
          date: new Date().toISOString().slice(0, 10),
          dimensions,
        });
        setSent(true);
      }}
      className="space-y-4"
    >
      <div>
        <span className="eyebrow text-ink/50">Overall rating</span>
        <div className="mt-1.5">
          <StarInput value={rating} onChange={setRating} />
        </div>
      </div>

      <label className="block">
        <span className="eyebrow text-ink/50">Title</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Sum it up in a few words"
          className="mt-1.5 w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-navy"
        />
      </label>

      <label className="block">
        <span className="eyebrow text-ink/50">Your review</span>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          placeholder="What stood out — development, communication, value?"
          className="mt-1.5 w-full resize-none rounded-lg border border-ink/15 px-3 py-2.5 text-sm outline-none focus:border-navy"
        />
      </label>

      <div>
        <span className="eyebrow text-ink/50">Rate the details</span>
        <div className="mt-2 space-y-2.5">
          {DIMENSIONS[category].map((label) => (
            <div key={label} className="flex items-center justify-between gap-3">
              <span className="text-sm text-ink/70">{label}</span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={dims[label]}
                  onChange={(e) => setDims((d) => ({ ...d, [label]: Number(e.target.value) }))}
                  className="w-32 accent-navy"
                />
                <span className="w-6 text-right text-sm font-semibold text-navy">{dims[label]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-ink/45">Posting as {author}.</p>

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-5 py-3 text-sm font-semibold text-white hover:bg-navy-deep"
      >
        Post review
      </button>
    </form>
  );
}
