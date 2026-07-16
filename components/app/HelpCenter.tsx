"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LifeBuoy,
  ChevronDown,
  Search,
  Compass,
  ScanLine,
  CreditCard,
  ShieldCheck,
  CalendarCheck,
  Send,
  Check,
  Mail,
  MessageSquare,
} from "lucide-react";
import { addNotification } from "@/lib/store";
import { useRole } from "@/lib/useRole";
import { Eyebrow } from "@/components/ui/Eyebrow";

interface Faq {
  q: string;
  a: string;
}
interface FaqGroup {
  title: string;
  icon: typeof Compass;
  items: Faq[];
}

const GROUPS: FaqGroup[] = [
  {
    title: "Getting started",
    icon: Compass,
    items: [
      {
        q: "How does matching work?",
        a: "Create an athlete profile with your sport, level, location, budget, and goals. The engine ranks every vetted program by fit — weighting development-level match most heavily, then distance, goals, CSD Score, and sport — and shows the reasons behind each score.",
      },
      {
        q: "Is Club Sports Direct free for families?",
        a: "Yes. Discovering programs, matching, messaging, and booking are free for parents and athletes. Prospect IQ is a premium evaluation add-on. Providers pay for listing and growth tools.",
      },
      {
        q: "What areas do you cover?",
        a: "This demo focuses on Southern California across soccer, baseball/softball, basketball, football, and volleyball. The model extends to any region and sport.",
      },
    ],
  },
  {
    title: "Bookings & payments",
    icon: CalendarCheck,
    items: [
      {
        q: "How do I book a session?",
        a: "Open any program's profile and tap Book a session. Choose a session type, pick an open time slot from the provider's live availability, and confirm. It lands on your My Sessions page and in your inbox.",
      },
      {
        q: "Can I reschedule or cancel?",
        a: "Yes — from My Sessions you can reschedule to any other open slot or cancel an upcoming session. Providers are notified automatically.",
      },
      {
        q: "Are payments real in this demo?",
        a: "No. All checkout is simulated — no card is charged and no data leaves your browser. Receipts and totals reflect your simulated activity for the session.",
      },
    ],
  },
  {
    title: "Prospect IQ & CSD Score",
    icon: ScanLine,
    items: [
      {
        q: "What is the CSD Score™?",
        a: "A transparent 0–100 credibility score for a provider, computed from documented inputs: certifications, experience, alumni outcomes, notable athletes, and review quality. It's deterministic — the breakdown is shown on every profile.",
      },
      {
        q: "What is Prospect IQ™?",
        a: "A premium athlete evaluation. Capture a short set of guided drills and the engine returns a five-pillar breakdown, a national-cohort tier and percentile, and a development pathway. Re-evaluate to track progress over time.",
      },
      {
        q: "How do rankings work?",
        a: "Rankings place evaluated athletes on a regional leaderboard by sport, age band, and region, ordered by Prospect IQ composite. Your own result is slotted in live so you can see where you stand.",
      },
    ],
  },
  {
    title: "For providers",
    icon: CreditCard,
    items: [
      {
        q: "How do I claim my program?",
        a: "Many profiles are auto-built from public data. Open the Provider dashboard and claim yours to control your narrative, respond to reviews, and reach the right athletes.",
      },
      {
        q: "What do the plans include?",
        a: "Free covers a claimed profile and review responses. Pro adds the lead inbox, session booking, analytics, events with boosts, and featured placement. Elite adds multi-team roster management and priority support. Manage it all under Billing.",
      },
      {
        q: "How do leads and bookings reach me?",
        a: "Inquiries and bookings from families land in your Leads inbox and Schedule in real time, with a fit score attached so you can prioritize the best-fit athletes.",
      },
    ],
  },
  {
    title: "Trust & safety",
    icon: ShieldCheck,
    items: [
      {
        q: "How are providers vetted?",
        a: "Every listing carries a vetting status (verified / pending / suspended). Our operator team reviews credentials and reports; suspended providers are removed from discovery and matching.",
      },
      {
        q: "How do I report a review or listing?",
        a: "Use the report control on any review or profile. Reports enter the moderation queue; removed content disappears from the public site immediately.",
      },
    ],
  },
];

export function HelpCenter() {
  const role = useRole();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>("Getting started:0");

  const q = query.trim().toLowerCase();
  const groups = GROUPS.map((g) => ({
    ...g,
    items: q ? g.items.filter((it) => (it.q + it.a).toLowerCase().includes(q)) : g.items,
  })).filter((g) => g.items.length > 0);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="rounded-3xl border border-ink/10 bg-navy p-8 text-white">
        <div className="flex items-center gap-2">
          <LifeBuoy size={20} className="text-gold" />
          <Eyebrow tone="light">Help &amp; support</Eyebrow>
        </div>
        <h1 className="display mt-3 text-4xl text-white">HOW CAN WE HELP?</h1>
        <p className="mt-2 max-w-xl text-sm text-cream/70">
          Search common questions, or send us a message and the team will get back to you.
        </p>
        <div className="mt-5 flex items-center gap-2 rounded-xl bg-white px-4 py-3">
          <Search size={18} className="text-ink/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search help articles…"
            className="w-full text-sm text-ink outline-none"
          />
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-8 space-y-6">
        {groups.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-ink/20 p-8 text-center text-ink/55">
            No articles match “{query}”. Try the contact form below.
          </p>
        ) : (
          groups.map((g) => (
            <section key={g.title}>
              <div className="flex items-center gap-2">
                <g.icon size={17} className="text-navy" />
                <h2 className="font-bold text-navy">{g.title}</h2>
              </div>
              <div className="mt-3 space-y-2">
                {g.items.map((it, i) => {
                  const key = `${g.title}:${i}`;
                  const isOpen = open === key;
                  return (
                    <div key={key} className="overflow-hidden rounded-xl border border-ink/10 bg-white">
                      <button
                        onClick={() => setOpen(isOpen ? null : key)}
                        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
                      >
                        <span className="text-sm font-semibold text-navy">{it.q}</span>
                        <ChevronDown
                          size={17}
                          className={`shrink-0 text-ink/40 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      {isOpen && <p className="px-4 pb-4 text-sm text-ink/65">{it.a}</p>}
                    </div>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </div>

      <ContactCard role={role} />
    </div>
  );
}

function ContactCard({ role }: { role: string }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const submit = () => {
    if (!message.trim()) return;
    addNotification({
      role: (role === "operator" ? "provider" : role) as "parent" | "provider",
      icon: "message",
      text: "Support ticket received — we'll reply within one business day.",
      href: "/app/help",
    });
    setSent(true);
    setSubject("");
    setMessage("");
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section className="mt-8 rounded-2xl border border-ink/10 bg-white p-6">
      <div className="flex items-center gap-2">
        <MessageSquare size={18} className="text-navy" />
        <h2 className="font-semibold text-navy">Still need help?</h2>
      </div>
      <p className="mt-1 text-sm text-ink/60">
        Send us a note — this is a demo, so we&apos;ll simulate a support confirmation in your
        notifications.
      </p>

      {sent ? (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-green-600/10 p-4 text-sm font-semibold text-green-700">
          <Check size={16} /> Message sent — check your notifications for confirmation.
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-navy"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="How can we help?"
            className="w-full resize-none rounded-lg border border-ink/15 px-3 py-2.5 text-sm outline-none focus:border-navy"
          />
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={submit}
              disabled={!message.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep disabled:opacity-40"
            >
              <Send size={15} /> Send message
            </button>
            <a
              href="mailto:support@clubsportsdirect.com"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink/60 hover:text-navy"
            >
              <Mail size={15} /> support@clubsportsdirect.com
            </a>
          </div>
        </div>
      )}
      <p className="mt-4 text-xs text-ink/45">
        Prefer to self-serve? Head back to your{" "}
        <Link href="/app" className="font-semibold text-red hover:underline">
          dashboard
        </Link>
        .
      </p>
    </section>
  );
}
