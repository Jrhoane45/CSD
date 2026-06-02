# Club Sports Direct — Functional Demo Specification

**Version:** 1.0 (for sign-off) · **Date:** 2026-06-02 · **Owner:** Justin Rhoane

---

## 1. Purpose & Goals

A clickable, realistic, **deployable demo** of the Club Sports Direct (CSD) platform — both the
**marketing website** and the **in-app product experience** — built to:

1. **Show how the features look and work** (tangible, navigable, not slideware).
2. **Stimulate investor interest** — make the three-layer model and monetization obvious and credible.
3. **Stimulate customers/partners pre-launch** — let parents *feel* the match flow and let clubs *see* their claim/upgrade path.

**Not in scope (demo simplifications):** real authentication, real payments, a real database, a real
AI model, live web-scraping for auto-profiles, or production legal pages. Everything runs on curated
**mock data** and **demo logic** that *looks and behaves* real.

---

## 2. Tech Stack & Architecture

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | Fast, modern, deploys to a public Vercel link in minutes |
| Styling | **Tailwind CSS** + a small design-token layer | Brand consistency, rapid iteration, responsive by default |
| Data | **Static TypeScript/JSON mock data** | No DB needed; realistic SoCal listings, reviews, outcomes |
| State | React state + URL params; `localStorage` for "saved" items & demo session | Persists across page loads without a backend |
| Icons/UI | lucide-react, headless UI patterns | Lightweight, clean |
| Charts | lightweight chart lib (e.g. Recharts) for the club analytics dashboard | Investor-facing visuals |
| Deploy | **Vercel** from the GitHub repo (`jrhoane45/csd`) | Public shareable URL; auto-redeploys on push |

**Responsive:** every screen works on desktop *and* mobile. The in-app screens are designed
mobile-first so the demo doubles as "the app" on a phone.

**Demo banner:** a subtle, dismissible "Demo — sample data" ribbon so viewers never mistake mock
content for live data.

---

## 3. Brand System (derived from logo, infographic & Brand Identity doc)

**Colors**
- Navy (primary): `#14264F`
- Red (accent/action): `#C8102E`
- Gold (highlight): `#F5A800`
- Cream (warm background): `#EFE9DB`
- Ink/near-black: `#0E1626` · White: `#FFFFFF` · Neutral grays for UI

**Typography**
- Headlines: bold condensed athletic sans (e.g. *Archivo / Anton*-style) — matches the logo energy
- Body: clean, readable sans (e.g. *Inter*)
- Labels/eyebrows: uppercase tracked mono-ish accent (matches the infographic's "SECTION 04" style)

**Voice (enforced in all copy)**
- Confident, practical, **anti-hype** (no gratuitous exclamation marks, no influencer tone)
- "Club Sports Direct" always (never "Sports Club Direct")
- Say **athletes / players**, **parents**, **clubs / programs**, **trainers / coaches**,
  **consultants / advisers**, **listing / member** — avoid "kids," "families," "clients," "vendors"
- Position as a **platform, not a vendor**; **athlete-developmental, not transactional**; **independent**; **direct**

---

## 4. Information Architecture (Sitemap)

```
/                         Marketing homepage
/how-it-works/parents     For parents & athletes
/how-it-works/providers   For clubs / trainers / consultants
/csd-score                CSD Score™ explainer
/pricing                  Listing tiers & subscriptions
/about                    Mission + founder story
─────────────────────────────────────────────
/app                      App home / entry (role switch: Parent ⇄ Provider)
/app/match                MATCH FLOW — athlete profile wizard → ranked results   ★ hero #1
/app/discover             Discovery directory (search + filters)
/app/listing/[id]         Listing profile detail (CSD Score, reviews, alumni, claim)
/app/saved                Parent dashboard — saved & matched programs
/app/provider             Provider dashboard — claim → upgrade → paid          ★ hero #2
/app/provider/analytics   Leads & analytics (paid-tier view)
```

A persistent top nav on marketing pages; a persistent app shell (with role toggle) on `/app/*`.

---

## 5. Marketing Website — Page Specs

### 5.1 Homepage `/`
- **Hero:** logo, headline ("Help every athlete find the right place to grow" / "Team sports, simplified"),
  sub-headline, dual CTA → **"Find your match" (parents)** and **"List your program" (providers)**.
- **The problem** band: "A $26B market run on hearsay" — 60M+ underserved, fragmented info.
- **How it works** (3 steps): Search → Match → Commit.
- **The three-layer model:** Discovery · Marketplace · Data moat (visual).
- **CSD Score™ teaser** with a sample score badge.
- **Categories** strip: Clubs · Trainers · Consultants (+ Phase 2 marketplace).
- **Social proof / outcomes** (sample stats), **"No direct competitor"** positioning band.
- **Footer:** nav, contact (info@clubsportsdirect.com), confidential/demo note.

### 5.2 How It Works — Parents `/how-it-works/parents`
Development-tier explainer (Rec → Intermediate → Competitive/Travel → Elite), the "mutual fit problem,"
how matching surfaces substance (credentials, alumni outcomes, fit), always-free framing, CTA into `/app/match`.

### 5.3 How It Works — Providers `/how-it-works/providers`
Auto-profile → claim → subscribe story; higher-fit leads / lower churn value prop; the three claim states;
category-specific review dimensions; CTA into `/app/provider`.

### 5.4 CSD Score™ `/csd-score`
What it is (credibility, not popularity; not an athlete ranking). The inputs (certifications, experience,
alumni outcomes, notable athletes, years operating, aggregated reviews). A worked sample breakdown.

### 5.5 Pricing `/pricing`
Three listing tiers (illustrative): **Claimed-Free**, **Standard**, **Premium** — feature matrix
(events/promos, analytics, lead tools, featured placement). Frames the supply-side subscription revenue.

### 5.6 About `/about`
Mission, the independence/anti-apparel-company positioning, founder story (three years conceptualized,
one year building), SoCal launch focus.

---

## 6. In-App Product — Screen Specs

> The app uses a **role toggle** (Parent ⇄ Provider) so a single demo session can show both sides.

### 6.1 ★ Match Flow `/app/match` (Hero #1 — parent side)
A short, polished wizard:
1. **Sport** (Soccer, Baseball/Softball, Basketball, Football) + **athlete age**
2. **Development level** (Rec / Intermediate / Competitive-Travel / Elite) — *hard filter, explained*
3. **Location** (SoCal county/zip) + max travel distance
4. **Goals & preferences** (e.g. "college recruiting," "skill development," schedule constraints, specialty needs)
5. **Category** sought (Club / Trainer / Consultant)

→ **Results:** a ranked list of matches, each with a **Fit %** and a short "why this matched" rationale
(level match, distance, goal alignment, CSD Score). Cards link to the full listing profile. Top match is
highlighted. Demonstrates the AI Matching Engine concept convincingly without a real model.

### 6.2 Discovery Directory `/app/discover`
Search bar + filters (sport, category, level, county, min CSD Score, sort). Result grid of listing cards
(name, category, sport, level served, location, CSD Score badge, rating, claimed/verified indicators).

### 6.3 Listing Profile `/app/listing/[id]`
- Header: name, category, sport(s), levels served, location, **CSD Score badge** (with expandable breakdown),
  verified/claimed status, "Save" and "Contact / Book" (demo) actions.
- **Overview:** philosophy, schedule / program time allocation, pricing band.
- **Alumni outcomes:** pro / D1 / D2 / D3 placements, notable athletes.
- **Reviews:** overall + **category-specific dimensions** (Clubs: Depth of Playing Schedule, Program Time
  Allocation · Trainers: Tools & Equipment, Facility Quality, Price vs. Value · Consultants: Quality of Alumni).
- **Claim banner** for unclaimed profiles → routes to provider claim flow (ties the two sides together).

### 6.4 Parent Dashboard `/app/saved`
Saved listings, your match results, an "athlete profile" summary card. Demonstrates return-visit value.

### 6.5 ★ Provider Dashboard `/app/provider` (Hero #2 — supply side)
The monetization story, shown as a guided state progression:
- **Unclaimed:** "We built this profile for you" (auto-profile) — shows views/interest already accruing,
  prompt to **Claim** (demo: instant).
- **Claimed-Free:** basic editing, limited visibility, sees locked premium features + upgrade CTA.
- **Claimed-Paid:** unlocks events/promos, lead management, analytics, featured placement.
- A visible **tier switcher** lets the viewer toggle states to *see* the upgrade value — built for investors.

### 6.6 Provider Analytics `/app/provider/analytics` (paid view)
Profile views over time, search impressions, lead inquiries, conversion funnel, "fit quality" of leads —
illustrative charts that make the "higher-fit leads, lower churn" claim tangible.

---

## 7. Mock Data Plan

- **~24–40 listings** across SoCal counties (LA, Orange, Riverside, Ventura, San Diego, San Bernardino),
  spanning the 4 launch sports and all 3 launch categories, at varied development levels.
- Each listing: realistic name, location, levels served, philosophy, pricing band, alumni outcomes,
  4–8 reviews with category-specific sub-ratings, a computed **CSD Score**, claimed/unclaimed state.
- A couple of **named example athletes** for the match flow demo.

## 8. Demo Logic (looks real, no backend/AI)

- **CSD Score (0–100):** transparent weighted formula over the documented inputs (certifications,
  experience, alumni outcomes, notable athletes, years operating, aggregated reviews). Shown as a
  breakdown so it reads as "calculated," not arbitrary.
- **Match Fit %:** deterministic scoring of athlete inputs vs. listing attributes — development-level
  match weighted heaviest (hard filter), then distance, goal/category alignment, and CSD Score. Each
  result shows its contributing factors as the "why."

---

## 9. Build Sequencing (after sign-off)

1. **Foundation:** scaffold Next.js+TS+Tailwind, brand tokens, fonts, app shell, demo banner, mock data + scoring logic. *(push)*
2. **Marketing site:** homepage → How It Works (x2) → CSD Score → Pricing → About. *(push)*
3. **App core:** discovery directory + listing profile. *(push)*
4. **Hero #1:** match flow + parent dashboard. *(push)*
5. **Hero #2:** provider dashboard (claim states) + analytics. *(push)*
6. **Polish + deploy:** responsive QA, copy pass, README + Vercel deploy instructions. *(push)*

Each phase is committed and pushed to `claude/bold-johnson-pi6xu` so you can review running progress.

## 10. Deployment

Repo is the source of truth. Recommended: connect `jrhoane45/csd` to **Vercel** (free) → every push to the
branch produces a live preview URL to share. I'll include exact steps in the README. (Alternative hosts:
Netlify, Cloudflare Pages — all work.)

## 11. Open Items / Assumptions

- Logo: I'll use the provided CSD badge; if you have an SVG/transparent-PNG it'll render sharper.
- Pricing numbers and alumni outcomes are **illustrative** for the demo unless you give me real figures.
- Phase 2 B2B marketplace is referenced in marketing but **not** built as an app surface (matches roadmap).
