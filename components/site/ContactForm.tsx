"use client";

import { useState } from "react";
import { Check, Send } from "lucide-react";

const TOPICS = ["I'm a parent / athlete", "I'm a club / trainer / adviser", "Partnership or investment", "Press", "Something else"];

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState(TOPICS[0]);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="rounded-2xl border border-ink/10 bg-white p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy text-white">
          <Check size={28} />
        </div>
        <p className="mt-4 font-semibold text-navy">Thanks, {name.split(" ")[0] || "there"} — message received.</p>
        <p className="mt-1 text-sm text-ink/60">
          This is a demo, so nothing was actually sent. In the live product we&apos;d reply within one
          business day.
        </p>
        <button
          onClick={() => {
            setSent(false);
            setName("");
            setEmail("");
            setMessage("");
          }}
          className="mt-5 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim() || !email.trim() || !message.trim()) return;
        setSent(true);
      }}
      className="space-y-4 rounded-2xl border border-ink/10 bg-white p-7"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="eyebrow text-ink/50">Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1.5 w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-navy"
          />
        </label>
        <label className="block">
          <span className="eyebrow text-ink/50">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1.5 w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-navy"
          />
        </label>
      </div>

      <label className="block">
        <span className="eyebrow text-ink/50">I&apos;m reaching out as</span>
        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-ink/15 px-3 py-2 text-sm outline-none focus:border-navy"
        >
          {TOPICS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="eyebrow text-ink/50">Message</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          required
          placeholder="How can we help?"
          className="mt-1.5 w-full resize-none rounded-lg border border-ink/15 px-3 py-2.5 text-sm outline-none focus:border-navy"
        />
      </label>

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-5 py-3 text-sm font-semibold text-white hover:bg-navy-deep"
      >
        <Send size={16} /> Send message
      </button>
      <p className="text-center text-xs text-ink/45">Demo form — no message is actually delivered.</p>
    </form>
  );
}
