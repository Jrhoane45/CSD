# Club Sports Direct — Functional Demo

> **Team Sports, Simplified.** An interactive demo of the Club Sports Direct (CSD) platform —
> a youth-sports discovery, vetting, and matching marketplace. Built to show how the product looks
> and works, and to stimulate investor, partner, and customer interest pre-launch.

This is a **demo**: realistic, clickable, and responsive, running entirely on curated **sample data**.
There is no real backend, authentication, or payment processing — actions are simulated so the
experience feels real without anything going live.

---

## What's inside

### Marketing website
- **Home** (`/`) — brand promise, the market problem, the three-layer model, CSD Score teaser, categories, featured listings, competitive positioning, dual CTAs.
- **For Parents** (`/how-it-works/parents`) — development tiers and the "mutual fit" story.
- **For Providers** (`/how-it-works/providers`) — the auto-profile → claim → paid funnel.
- **CSD Score™** (`/csd-score`) — what the score is, its inputs, a worked example, what it is *not*.
- **Pricing** (`/pricing`) — listing tiers, à-la-carte event boosts, the four revenue pillars.
- **About** (`/about`) — mission, founder, positioning, market opportunity, the ask.

### The product (`/app`)
A role toggle (**Parent ⇄ Provider**) switches the experience:
- **Find a match** (`/app/match`) — an athlete-profile wizard that returns ranked, **Fit-scored**
  matches with the reasons behind each one. Badged *Intelligence Layer — coming next*.
- **Discover** (`/app/discover`) — searchable, filterable directory with **CSD Score** badges.
- **Listing profile** (`/app/listing/[id]`) — CSD Score breakdown, alumni outcomes, category-specific
  reviews, and a claim banner for unclaimed (auto-built) profiles.
- **Saved** (`/app/saved`) — a parent's shortlist (persists in your browser).
- **Provider dashboard** (`/app/provider`) — toggle the three claim states (**Unclaimed →
  Claimed-Free → Claimed-Paid**) to see leads, events with paid boosts, and the upgrade path.
- **Analytics** (`/app/provider/analytics`) — premium-tier views, lead funnel, and lead fit quality.

### Demo logic (looks real, no ML/backend)
- **CSD Score™** — a transparent, deterministic 0–100 credibility score over the documented inputs
  (certifications, experience, alumni outcomes, notable athletes, review quality). See `lib/scoring.ts`.
- **Match Fit %** — deterministic scoring of an athlete profile vs. each listing, weighting
  development-level match most heavily (a hard filter), then distance, goals, CSD Score, and sport.

---

## Tech stack
- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4** with a CSD brand token layer (`app/globals.css`)
- **lucide-react** icons, **Recharts** for analytics
- Sample data in `lib/data/listings.ts`; no database

## Run locally
```bash
npm install
npm run dev      # http://localhost:3000
```
Build a production bundle:
```bash
npm run build && npm run start
```

## Deploy a shareable link (Vercel — recommended)
1. Push this repo to GitHub (already on branch `claude/bold-johnson-pi6xu`).
2. Go to **vercel.com → New Project → Import** this repository.
3. Framework preset auto-detects **Next.js** — no configuration needed. Click **Deploy**.
4. Vercel gives you a public URL (e.g. `club-sports-direct-demo.vercel.app`) to share with investors
   and partners. Every push redeploys automatically.

Netlify and Cloudflare Pages work too (both auto-detect Next.js).

## Project structure
```
app/
  (marketing)/        Public website (nav + footer shell)
  (product)/app/      The product experience (app shell + role toggle)
components/
  brand/  site/  ui/  listing/  app/
lib/
  types.ts            Domain types
  scoring.ts          CSD Score + matching logic
  data/listings.ts    Sample Southern California listings
docs/
  DEMO_SPEC.md        The signed-off build specification
```

## Notes & next steps
- Brand visuals are derived from the CSD logo/one-pager. The badge is an SVG recreation — drop the
  official logo into `public/` to swap it in.
- Pricing, alumni figures, and analytics are **illustrative** for the demo.
- The AI Matching Engine is shown as a near-term flagship (*Intelligence Layer*), consistent with the
  locked beta scope where it ships after the Foundation Layer.

_Confidential — investor & partner demo. © 2026 Club Sports Direct._
