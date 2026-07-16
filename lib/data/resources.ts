/*
  Editorial content for the marketing Resources hub. Illustrative articles that
  reflect CSD's domain — parents, providers, recruiting, and the platform's
  data model. Static, no CMS.
*/

export interface ArticleSection {
  heading?: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface Article {
  slug: string;
  title: string;
  category: "For Parents" | "Recruiting" | "The Platform" | "For Providers";
  excerpt: string;
  author: string;
  date: string; // display
  readMins: number;
  featured?: boolean;
  sections: ArticleSection[];
}

export const ARTICLES: Article[] = [
  {
    slug: "choosing-the-right-development-level",
    title: "Choosing the right club for your athlete's development level",
    category: "For Parents",
    excerpt:
      "The single biggest predictor of whether your athlete thrives or burns out isn't the logo on the jersey — it's whether the program matches their stage.",
    author: "Club Sports Direct",
    date: "June 2026",
    readMins: 6,
    featured: true,
    sections: [
      {
        paragraphs: [
          "Every year, families pour time and money into club sports only to watch their athlete stall — not because the program was bad, but because it was the wrong fit. A recreational player thrown onto an elite travel roster rides the bench and loses confidence. An advanced athlete stuck in a beginner environment plateaus and disengages.",
          "Development level is the variable that quietly decides most outcomes, and it's the one word-of-mouth is worst at capturing.",
        ],
      },
      {
        heading: "The four tiers, briefly",
        paragraphs: ["Most youth programs sit in one of four developmental tiers. Knowing your athlete's honestly is step one."],
        bullets: [
          "Recreational — first exposure; skill-building, fun, and social development.",
          "Intermediate — committed recreational or entry-level competitive; building fundamentals.",
          "Competitive — year-round travel and league play; higher commitment and demands.",
          "Elite — showcase, national, and pre-collegiate; recruiting-focused.",
        ],
      },
      {
        heading: "Match the stage, not the status",
        paragraphs: [
          "It's tempting to chase the most prestigious program you can get into. But a mismatched level — in either direction — is the number-one driver of churn. The right move is to find a program whose typical athlete looks like yours today, with a clear runway to the next tier.",
          "That's exactly what CSD's matching engine weights most heavily: development-level fit is a hard filter, then distance, goals, credibility, and sport. You see the reasons behind every match, not just a ranking.",
        ],
      },
      {
        heading: "A quick checklist before you commit",
        paragraphs: ["Before signing, get honest answers to these:"],
        bullets: [
          "What tier are most of this program's athletes at right now?",
          "How is individual progress tracked and communicated?",
          "What does a realistic playing-time and development path look like this season?",
          "Where have athletes at my child's stage gone next?",
        ],
      },
    ],
  },
  {
    slug: "understanding-the-csd-score",
    title: "Understanding the CSD Score: what credibility actually means",
    category: "The Platform",
    excerpt:
      "A transparent, 0–100 credibility signal applied uniformly to every listing — built from documented inputs, not popularity.",
    author: "Club Sports Direct",
    date: "June 2026",
    readMins: 5,
    sections: [
      {
        paragraphs: [
          "Star ratings tell you how loud a program's happiest customers are. They don't tell you whether the coaching staff is certified, whether alumni actually advanced, or whether the reviews are credible. The CSD Score is designed to answer the question star ratings can't: how much should I trust this listing?",
        ],
      },
      {
        heading: "What goes into it",
        paragraphs: ["The score is deterministic — the same inputs always produce the same number — and every listing is scored the same way:"],
        bullets: [
          "Verified certifications and coaching credentials",
          "Years of experience and operational tenure",
          "Alumni outcomes (pro, D1/D2/D3 placements)",
          "Notable athletes and track record",
          "The quality — not just quantity — of reviews",
        ],
      },
      {
        heading: "What it is not",
        paragraphs: [
          "It is not a popularity contest, and it can't be bought. A brand-new program with real credentials can outscore an established one coasting on reputation. The breakdown is shown on every profile, so families can see exactly why a program earned its number.",
        ],
      },
    ],
  },
  {
    slug: "recruiting-timeline-playbook",
    title: "The recruiting timeline: a grade-by-grade playbook",
    category: "Recruiting",
    excerpt:
      "College recruiting rewards families who start early and stay organized. Here's what to focus on, year by year.",
    author: "Club Sports Direct",
    date: "May 2026",
    readMins: 7,
    featured: true,
    sections: [
      {
        paragraphs: [
          "The families who navigate recruiting well aren't the ones with the most talent — they're the ones who start early, target realistically, and keep a system. Here's a simplified grade-by-grade view of what matters when.",
        ],
      },
      {
        heading: "9th–10th grade: foundation",
        paragraphs: ["Focus on development and academics. Recruiting is a background process, not the main event."],
        bullets: [
          "Build the athletic and academic base — grades open more doors than any highlight reel.",
          "Start a simple list of programs and divisions that interest you.",
          "Get an honest read on your athlete's level (a Prospect IQ evaluation helps here).",
        ],
      },
      {
        heading: "11th grade: outreach",
        paragraphs: ["This is the year to be proactive. Coaches can engage more, and your target list should sharpen."],
        bullets: [
          "Build a highlight reel and a clean recruiting profile.",
          "Email coaches, attend ID camps and showcases, and track every contact.",
          "Move schools through a pipeline: researching → contacted → visited → offer.",
        ],
      },
      {
        heading: "12th grade: decisions",
        paragraphs: [
          "Convert interest into offers and choose the right fit — academically, athletically, and financially. CSD's Recruiting Hub keeps the checklist and target-school tracker in one place so nothing slips.",
        ],
      },
    ],
  },
  {
    slug: "claimed-profile-to-full-roster",
    title: "For providers: turning a claimed profile into a full roster",
    category: "For Providers",
    excerpt:
      "Claiming your profile is step one. Here's how the best programs turn discovery into enrollments.",
    author: "Club Sports Direct",
    date: "May 2026",
    readMins: 5,
    sections: [
      {
        paragraphs: [
          "A great program that no one can find loses to an average one that's easy to evaluate. On CSD, the providers who fill rosters treat their profile like a storefront and their leads like appointments.",
        ],
      },
      {
        heading: "Control the narrative",
        paragraphs: ["Claim your profile, then make it undeniable:"],
        bullets: [
          "Add your philosophy, pricing, photos, and video.",
          "Respond to every review — especially critical ones — with context.",
          "Keep alumni outcomes and credentials current; they drive your CSD Score.",
        ],
      },
      {
        heading: "Turn interest into enrollments",
        paragraphs: ["Discovery is only half the job. The other half is conversion:"],
        bullets: [
          "Answer leads fast — higher-fit families convert when you're responsive.",
          "Publish session availability so families can book a real slot, not just ask.",
          "Post tryouts and camps as events, and boost the ones you need to fill.",
          "Use analytics to see which of your leads are the best fit, and prioritize them.",
        ],
      },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
