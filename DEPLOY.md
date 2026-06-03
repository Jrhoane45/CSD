# Deploying the Club Sports Direct demo

The demo is a standard **Next.js** app with **zero deploy configuration required**. The fastest way to
get a public, shareable link is **Vercel** (free). Every push to the branch will auto-redeploy.

## Option A — Vercel (recommended, ~3 clicks)

1. Go to **https://vercel.com/new** and sign in with **GitHub** (authorize Vercel for the
   `jrhoane45/csd` repository if prompted).
2. **Import** the `jrhoane45/csd` repository.
3. Vercel auto-detects **Next.js** — leave every setting at its default and click **Deploy**.
   - Production branch: pick **`claude/bold-johnson-pi6xu`** (or merge it into `main` first and deploy `main`).
   - No environment variables are needed — the demo runs entirely on bundled sample data.
4. In ~1 minute you'll get a public URL like `club-sports-direct-demo.vercel.app` to share with
   investors, partners, and prospects.

### Use your real domain (optional)
In the Vercel project: **Settings → Domains → Add** `clubsportsdirect.com` and follow the DNS
instructions. (You can also use a subdomain like `demo.clubsportsdirect.com`.)

## Option B — Netlify or Cloudflare Pages
Both auto-detect Next.js as well.
- **Netlify:** https://app.netlify.com/start → pick the repo → Deploy.
- **Cloudflare Pages:** Dashboard → Workers & Pages → Create → connect the repo → framework preset **Next.js**.

## Build settings (auto-detected — for reference only)
| Setting | Value |
|---|---|
| Framework | Next.js |
| Install command | `npm install` |
| Build command | `npm run build` |
| Output | `.next` (handled automatically) |
| Node version | 18+ (20 recommended) |

## Notes
- The demo banner ("Interactive demo — sample data") makes clear nothing is a live transaction.
- To point the basketball example at the real club, the Hoop Prodigy logo and details are already wired in.
- Want a custom OG/social preview image for nicer link sharing? That can be added on request.
