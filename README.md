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
A role toggle (**Parent ⇄ Provider**) switches the experience. The two sides are
**wired together** by a live, client-side activity layer (persisted in your browser), so a
parent's action shows up on the provider side in real time:

- **Athlete dashboard** (`/app`) — once a family has a profile, the app home becomes a
  **personalized dashboard**: next booked session, Prospect IQ progress, upcoming events,
  active conversations, recruiting snapshot, and recommended programs — all live. Before a
  profile exists, the same route shows the "where to start" hub.
- **Find a match** (`/app/match`) — an athlete-profile wizard that returns ranked, **Fit-scored**
  matches with the reasons behind each one. Badged *Intelligence Layer — coming next*.
- **Discover** (`/app/discover`) — searchable, filterable directory with **CSD Score** badges, a
  **List / Map** toggle (stylized SoCal map with program pins), a **side-by-side Compare** tray
  (pick up to 3 programs), and **saved searches with alerts**.
- **Listing profile** (`/app/listing/[id]`) — CSD Score breakdown, alumni outcomes, category-specific
  reviews, and a claim banner. **Book a session** opens a real scheduler (pick a session type → an
  open time slot from the provider's live availability → confirm & pay), **Request info** starts a
  conversation, and **Write a review** posts live and recomputes the rating.
- **Session booking & scheduling** — providers publish a menu of session types and open availability;
  families book a **real time slot**, which lands on the parent's **My Sessions** (`/app/sessions` —
  reschedule / cancel / message) and the provider's **schedule** panel (mark complete / cancel), and
  flows into the inbox, orders, and analytics. Booked slots disappear from availability.
- **Prospect IQ progress** (`/app/prospect-iq`) — re-evaluations are kept as a **history**, so the
  Combine charts a composite/percentile trend over time with per-pillar movement (▲/▼ deltas).
- **Rankings** (`/app/rankings`) — a **Prospect IQ regional leaderboard** with a podium and ranked
  table, filterable by sport, age band, and county. Your own evaluation is **slotted in live** so you
  can see exactly where you stand.
- **Inbox** (`/app/inbox`) — two-way **messaging** between families and programs, role-aware, with a
  simulated provider reply so threads feel alive. Bookings carry their requested date/time.
- **Events** (`/app/events`) — a board of tryouts, camps, showcases, and clinics with **one-tap RSVP**;
  providers can **create** and **boost** events that appear here instantly.
- **Recruiting Hub** (`/app/recruiting`) — a college-pathway roadmap: a grade-by-grade checklist
  (with your current phase highlighted), a **target-school tracker** (research → contacted → visited →
  offer), and matched recruiting **advisers**. Progress persists in your browser.
- **Saved** (`/app/saved`) — a parent's shortlist (persists in your browser).
- **Orders & receipts** (`/app/orders`) — every booked session and event registration as a receipt
  history with totals.
- **Settings** (`/app/settings`) — account, notification preferences (with delivery channels), a
  privacy/data panel with a reset control, and links to help & billing.
- **Help & support** (`/app/help`) — a searchable, categorized **FAQ** plus a contact form that
  confirms via a simulated support notification.
- **Notifications** — a live bell in the app shell with per-role unread counts, plus a full
  **notifications page** (`/app/notifications`) with all/unread filtering and mark-all-read.
- **Provider dashboard** (`/app/provider`) — toggle the three claim states (**Unclaimed →
  Claimed-Free → Claimed-Paid**). The paid view shows **live leads** (from real inquiries), full
  **event management** (create, edit, cancel, **boost**, a **registrant roster** with quick-message,
  and per-event views→RSVP analytics), an **editable profile** (name/philosophy/pricing that updates
  the public listing), **review responses**, a **session schedule** of inbound bookings (mark
  complete / cancel), and a **simulated subscription checkout** on upgrade.
- **Billing & subscription** (`/app/provider/billing`) — plan tiers (**Free / Pro / Elite**) with
  upgrade/downgrade, a current-plan summary, **usage meters** (event boosts, leads, booked sessions),
  a saved **payment method**, cancel/reactivate, and a downloadable-style **invoice history**.
- **Roster & teams** (`/app/provider/roster`) — an Elite-tier tool to manage **teams** and a
  **roster**: create/delete teams, assign athletes between teams and a **prospect pool**, add players
  manually, and **import prospects** straight from real bookings and event registrants.
- **Promotions Studio** (`/app/promote`) — a paid event-advertising platform: build a campaign
  (objective → target event → placements → audience → **flight dates / scheduling**), see a live
  reach estimate and ad preview, and pay through a **simulated multi-method checkout**
  (Card/PayPal/Apple Pay/ACH). Ads serve as **native, on-brand placements** labeled
  **"Promoted · Vetted provider"** — a Discover spotlight card, an events banner, and an in-app
  pop-up — and the studio reports **impressions, clicks, CTR, RSVPs, spend, and budget pacing** per
  campaign (live/scheduled/ended). Providers can **promote any event in one click** from the events
  panel, and **recommended campaign playbooks** help those who aren't sure where to start.
- **Operator console** (`/app/operator`) — a third **Operator** role (toggle in the app header) for
  platform trust & safety: a console home with platform KPIs and action queues, **provider vetting**
  (`/app/operator/providers` — verify / suspend / reinstate, filterable by status), **content
  moderation** (`/app/operator/moderation` — resolve reports on reviews, listings, and events), and
  the **ad-revenue dashboard** (`/app/operator/promotions` — recognized revenue, committed budget,
  projected run-rate, revenue by placement, top advertisers, and every campaign across providers).
  Operator actions are **consequential on the public side**: suspending a provider removes it from
  Discover and the match flow (and shows a notice on its profile), and removing a flagged review
  drops it from the listing page — the trust-&-safety loop closes live.
- **Analytics** (`/app/provider/analytics`) — premium views, lead funnel, and lead fit quality that
  **update live** with the leads, bookings, and RSVPs generated in the session.

A **"Reset demo"** control in the demo banner clears all session state for a clean walkthrough.

### Demo logic (looks real, no ML/backend)
- **CSD Score™** — a transparent, deterministic 0–100 credibility score over the documented inputs
  (certifications, experience, alumni outcomes, notable athletes, review quality). See `lib/scoring.ts`.
- **Match Fit %** — deterministic scoring of an athlete profile vs. each listing, weighting
  development-level match most heavily (a hard filter), then distance, goals, CSD Score, and sport.
- **Live activity store** (`lib/store.ts`) — a tiny reactive store (localStorage-backed, with seed
  data) that powers messaging, session bookings, events, reviews, provider billing/subscription, and
  notifications across all roles. No backend, but it behaves like one; reset it any time from
  **Settings** or by clearing site data.
- **Scheduling** (`lib/scheduling.ts`) — deterministic per-provider session menus and open-slot
  generation; a booked slot is removed from availability. **Billing** (`lib/billing.ts`) — plan
  definitions and invoice history.

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
