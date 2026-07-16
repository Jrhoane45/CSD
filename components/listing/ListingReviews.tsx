"use client";

import { useMemo, useState } from "react";
import {
  Star,
  PenLine,
  Check,
  CornerDownRight,
  MessageSquareReply,
  BadgeCheck,
  ThumbsUp,
  ImagePlus,
  X,
} from "lucide-react";
import type { Category, Review, ReviewDimension } from "@/lib/types";
import {
  useStore,
  addReview,
  addReviewReply,
  replyKey,
  removedReviewIds,
  helpfulBase,
  toggleHelpful,
} from "@/lib/store";
import { useRole } from "@/lib/useRole";
import { useProfile } from "@/lib/useProfile";
import { StarRating } from "@/components/ui/StarRating";
import { Modal } from "@/components/ui/Modal";

const DIMENSIONS: Record<Category, string[]> = {
  club: ["Communication", "Professionalism", "Value", "Depth of Playing Schedule", "Program Time Allocation"],
  trainer: ["Communication", "Professionalism", "Training Tools & Equipment", "Facility Quality", "Price vs. Value"],
  consultant: ["Communication", "Professionalism", "Value", "Quality of Alumni"],
};

type SortKey = "recent" | "helpful" | "high" | "low";
const SORTS: { key: SortKey; label: string }[] = [
  { key: "recent", label: "Most recent" },
  { key: "helpful", label: "Most helpful" },
  { key: "high", label: "Highest rated" },
  { key: "low", label: "Lowest rated" },
];

type KeyedReview = { review: Review; key: string; helpful: number };

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
  const { reviews, replies, moderation, reviewHelpful } = useStore();
  const role = useRole();

  const mine = useMemo(() => {
    const removed = removedReviewIds(moderation);
    return reviews.filter((r) => r.listingId === listingId && !removed.has(r.id));
  }, [reviews, listingId, moderation]);

  const keyed = useMemo<KeyedReview[]>(() => {
    const base = [
      ...mine.map((r) => ({ review: r as Review, key: `u:${r.id}` })),
      ...seedReviews.map((r, i) => ({ review: r, key: `s:${i}:${r.date}` })),
    ];
    return base.map((k) => {
      const fk = replyKey(listingId, k.key);
      return { ...k, helpful: helpfulBase(fk) + (reviewHelpful[fk] ? 1 : 0) };
    });
  }, [mine, seedReviews, listingId, reviewHelpful]);

  const all = keyed.map((k) => k.review);
  const rating = all.length ? all.reduce((s, r) => s + r.rating, 0) / all.length : 0;
  const verifiedCount = all.filter((r) => r.verified).length;

  const distribution = useMemo(() => {
    const counts = [0, 0, 0, 0, 0]; // index 0 = 1 star … 4 = 5 star
    for (const r of all) counts[Math.min(4, Math.max(0, Math.round(r.rating) - 1))] += 1;
    return counts;
  }, [all]);

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
  const [sort, setSort] = useState<SortKey>("recent");
  const [starFilter, setStarFilter] = useState(0); // 0 = all

  const visible = useMemo(() => {
    let list = keyed;
    if (starFilter) list = list.filter((k) => Math.round(k.review.rating) === starFilter);
    const sorted = [...list];
    sorted.sort((a, b) => {
      if (sort === "helpful") return b.helpful - a.helpful;
      if (sort === "high") return b.review.rating - a.review.rating;
      if (sort === "low") return a.review.rating - b.review.rating;
      return b.review.date.localeCompare(a.review.date); // recent
    });
    return sorted;
  }, [keyed, sort, starFilter]);

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="display text-2xl text-navy">REVIEWS</h2>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-navy/30 px-3.5 py-2 text-sm font-semibold text-navy transition-colors hover:bg-navy hover:text-white"
        >
          <PenLine size={15} /> Write a review
        </button>
      </div>

      {/* summary: average + distribution + dimension averages */}
      <div className="mt-4 grid gap-5 rounded-2xl border border-ink/10 bg-cream-200 p-5 lg:grid-cols-[auto_1fr]">
        <div className="flex items-center gap-5">
          <div className="text-center">
            <p className="display text-5xl text-navy">{rating.toFixed(1)}</p>
            <StarRating value={rating} className="mt-1 justify-center" />
            <p className="mt-1 text-xs text-ink/55">{all.length} reviews</p>
          </div>
          <div className="w-40 space-y-1">
            {[5, 4, 3, 2, 1].map((star) => {
              const c = distribution[star - 1];
              const pct = all.length ? (c / all.length) * 100 : 0;
              return (
                <button
                  key={star}
                  onClick={() => setStarFilter(starFilter === star ? 0 : star)}
                  className="flex w-full items-center gap-2 text-xs"
                >
                  <span className={`w-3 text-right ${starFilter === star ? "font-bold text-navy" : "text-ink/55"}`}>
                    {star}
                  </span>
                  <Star size={11} className="text-gold" fill="currentColor" />
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white">
                    <span className="block h-full rounded-full bg-gold" style={{ width: `${pct}%` }} />
                  </span>
                  <span className="w-4 text-right text-ink/45">{c}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t border-ink/10 pt-4 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-navy">
            <BadgeCheck size={14} className="text-navy/60" /> {verifiedCount} verified customer
            {verifiedCount === 1 ? "" : "s"}
          </div>
          <div className="grid gap-x-4 gap-y-1.5 sm:grid-cols-2">
            {dimAverages.map((d) => (
              <div key={d.label} className="flex items-center justify-between gap-3">
                <span className="text-sm text-ink/65">{d.label}</span>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-16 rounded-full bg-white">
                    <div className="h-1.5 rounded-full bg-gold" style={{ width: `${(d.value / 5) * 100}%` }} />
                  </div>
                  <span className="w-7 text-right text-sm font-semibold text-navy">{d.value.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* controls */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {SORTS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSort(s.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                sort === s.key ? "bg-navy text-white" : "bg-cream text-ink/55 hover:text-navy"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        {starFilter > 0 && (
          <button
            onClick={() => setStarFilter(0)}
            className="inline-flex items-center gap-1 rounded-full bg-navy/[0.07] px-3 py-1 text-xs font-semibold text-navy"
          >
            {starFilter}★ only <X size={12} />
          </button>
        )}
      </div>

      <div className="mt-4 space-y-5">
        {visible.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-ink/20 p-8 text-center text-sm text-ink/55">
            No {starFilter}★ reviews yet.
          </p>
        ) : (
          visible.map(({ review, key, helpful }) => (
            <ReviewItem
              key={key}
              review={review}
              fullKey={replyKey(listingId, key)}
              helpful={helpful}
              iVoted={!!reviewHelpful[replyKey(listingId, key)]}
              reply={replies[replyKey(listingId, key)]}
              canRespond={role === "provider"}
              listingName={listingName}
              onRespond={(body) => addReviewReply(listingId, listingName, key, body)}
            />
          ))
        )}
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

function ReviewItem({
  review: r,
  fullKey,
  helpful,
  iVoted,
  reply,
  canRespond,
  listingName,
  onRespond,
}: {
  review: Review;
  fullKey: string;
  helpful: number;
  iVoted: boolean;
  reply?: { body: string; at: string };
  canRespond: boolean;
  listingName: string;
  onRespond: (body: string) => void;
}) {
  const [composing, setComposing] = useState(false);
  const [draft, setDraft] = useState("");
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy/[0.08] text-sm font-bold text-navy">
            {r.author.charAt(0)}
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-sm font-semibold text-navy">
              {r.author}
              {r.verified && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-navy/[0.07] px-1.5 py-0.5 text-[0.6rem] font-bold text-navy">
                  <BadgeCheck size={11} /> Verified
                </span>
              )}
            </p>
            <p className="text-xs text-ink/45">{r.date}</p>
          </div>
        </div>
        <StarRating value={r.rating} />
      </div>

      <h4 className="mt-4 font-semibold text-navy">{r.title}</h4>
      <p className="mt-1 text-sm text-ink/70">{r.body}</p>

      {/* photos */}
      {r.photos && r.photos.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {r.photos.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt={`Review photo ${i + 1}`}
              onClick={() => setLightbox(src)}
              className="h-20 w-20 cursor-pointer rounded-lg border border-ink/10 object-cover transition-opacity hover:opacity-90"
            />
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {r.dimensions.map((d) => (
          <span
            key={d.label}
            className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1 text-xs"
          >
            <span className="text-ink/60">{d.label}</span>
            <span className="font-semibold text-navy">{d.value.toFixed(1)}</span>
          </span>
        ))}
      </div>

      {/* helpful */}
      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={() => toggleHelpful(fullKey)}
          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
            iVoted ? "border-navy bg-navy text-white" : "border-ink/15 text-ink/60 hover:border-navy/40 hover:text-navy"
          }`}
        >
          <ThumbsUp size={13} /> Helpful
        </button>
        <span className="text-xs text-ink/50">
          {helpful} {helpful === 1 ? "person" : "people"} found this helpful
        </span>
      </div>

      {/* provider response */}
      {reply ? (
        <div className="mt-4 rounded-xl border-l-2 border-navy/40 bg-cream/50 p-4">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-navy">
            <CornerDownRight size={13} /> Response from {listingName}
          </p>
          <p className="mt-1 text-sm text-ink/70">{reply.body}</p>
        </div>
      ) : (
        canRespond &&
        (composing ? (
          <div className="mt-4 rounded-xl bg-cream/50 p-3">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={2}
              autoFocus
              placeholder="Thank them, address the feedback, or add context…"
              className="w-full resize-none rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-navy"
            />
            <div className="mt-2 flex justify-end gap-2">
              <button
                onClick={() => {
                  setComposing(false);
                  setDraft("");
                }}
                className="rounded-lg px-3 py-1.5 text-sm font-semibold text-ink/55 hover:text-navy"
              >
                Cancel
              </button>
              <button
                onClick={() => draft.trim() && onRespond(draft.trim())}
                disabled={!draft.trim()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-navy-deep disabled:opacity-40"
              >
                <Check size={14} /> Post response
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setComposing(true)}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-red hover:underline"
          >
            <MessageSquareReply size={14} /> Respond as {listingName}
          </button>
        ))
      )}

      {lightbox && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/70 p-6"
          onClick={() => setLightbox(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox} alt="Review photo" className="max-h-[85vh] max-w-full rounded-xl" />
        </div>
      )}
    </div>
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
  const { threads, bookings } = useStore();
  const author =
    profile?.parentName ||
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
    "Verified Parent";

  // A reviewer is "verified" if they've actually engaged this program.
  const isVerified = useMemo(
    () =>
      bookings.some((b) => b.listingId === listingId && b.parentName === "You") ||
      threads.some((t) => t.listingId === listingId && !t.seeded),
    [bookings, threads, listingId],
  );

  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [dims, setDims] = useState<Record<string, number>>(
    Object.fromEntries(DIMENSIONS[category].map((d) => [d, 5])),
  );
  const [sent, setSent] = useState(false);

  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 3 - photos.length);
    files.forEach((f) => {
      const reader = new FileReader();
      reader.onload = () => setPhotos((p) => (p.length >= 3 ? p : [...p, String(reader.result)]));
      reader.readAsDataURL(f);
    });
    e.target.value = "";
  };

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
          verified: isVerified,
          photos: photos.length ? photos : undefined,
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

      {/* photos */}
      <div>
        <span className="eyebrow text-ink/50">Add photos (optional)</span>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {photos.map((src, i) => (
            <div key={i} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`Photo ${i + 1}`} className="h-16 w-16 rounded-lg border border-ink/10 object-cover" />
              <button
                type="button"
                onClick={() => setPhotos((p) => p.filter((_, j) => j !== i))}
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-white"
                aria-label="Remove photo"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          {photos.length < 3 && (
            <label className="flex h-16 w-16 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-ink/25 text-ink/45 hover:border-navy/40 hover:text-navy">
              <ImagePlus size={16} />
              <span className="text-[0.6rem] font-semibold">Add</span>
              <input type="file" accept="image/*" multiple onChange={onFiles} className="hidden" />
            </label>
          )}
        </div>
      </div>

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

      <p className="flex items-center gap-1.5 text-xs text-ink/45">
        Posting as {author}.
        {isVerified && (
          <span className="inline-flex items-center gap-0.5 font-semibold text-navy">
            <BadgeCheck size={12} /> Verified customer
          </span>
        )}
      </p>

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-5 py-3 text-sm font-semibold text-white hover:bg-navy-deep"
      >
        Post review
      </button>
    </form>
  );
}
