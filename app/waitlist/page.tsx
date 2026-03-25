"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ROLES = [
  "Robotics Engineer",
  "ML / AI Engineer",
  "Research Scientist",
  "Product / Founder",
  "Student",
  "Other",
];

const ROBOT_TYPES = [
  "Mobile robot",
  "Robotic arm / manipulator",
  "Drone / aerial",
  "Humanoid",
  "Industrial automation",
  "Other / not sure yet",
];

const USE_CASES = [
  "Object detection & manipulation",
  "Autonomous navigation",
  "Quality inspection",
  "Research & experimentation",
  "Fleet management",
  "Other",
];

export default function WaitlistPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    role: "",
    robotType: "",
    useCase: "",
    fleetSize: "",
    message: "",
    updates: true,
  });

  function set(field: string, value: string | boolean) {
    setForm(p => ({ ...p, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Something went wrong. Please try again.");
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black px-4 sm:px-8">
      <div className="mx-auto max-w-6xl border-x-2 border-white/20 min-h-screen">
        <Navbar />

        <div className="border-t-2 border-white/20 flex flex-col">
          {submitted ? (
            /* ── Success state ──────────────────────────────────────────── */
            <div className="flex-1 flex flex-col items-center justify-center py-32 px-5 text-center min-h-[60vh]">
              <div className="relative mb-8">
                <div className="h-16 w-16 rounded-full bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M5 14l6 6L23 8" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="absolute inset-0 rounded-full border border-cyan-400/15 animate-ping" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-normal text-white tracking-tight mb-3">
                You&apos;re on the list.
              </h2>
              <p className="text-base text-zinc-500 max-w-md leading-relaxed mb-8">
                Thanks for joining the Artemis waitlist. We&apos;ll reach out at{" "}
                <span className="text-white">{form.email}</span> when your spot is ready.
              </p>
              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className="rounded-full border border-white/20 px-6 py-2.5 text-sm text-zinc-400 hover:text-white hover:border-white/40 transition-colors"
                >
                  Back to home
                </Link>
                <Link
                  href="/docs"
                  className="rounded-full bg-white/8 border border-white/10 px-6 py-2.5 text-sm text-white hover:bg-white/12 transition-colors"
                >
                  Read the docs
                </Link>
              </div>
            </div>
          ) : (
            /* ── Form ───────────────────────────────────────────────────── */
            <div className="flex flex-col lg:flex-row">

              {/* Left — copy */}
              <div className="lg:w-[42%] border-b-2 lg:border-b-0 lg:border-r-2 border-white/20 px-6 py-14 sm:px-12 sm:py-20 flex flex-col justify-center">
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="w-0.5 h-4 bg-cyan-400" />
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Early Access</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-normal text-white tracking-tight leading-[1.1] mb-5">
                  Get early access
                  <br />
                  to Artemis.
                </h1>
                <p className="text-base text-zinc-500 leading-relaxed mb-10 max-w-sm">
                  We&apos;re onboarding teams in waves. Fill out the form and we&apos;ll let you know when your spot opens up.
                </p>

                {/* Proof points */}
                <div className="space-y-4">
                  {[
                    { icon: "M5 13l4 4L19 7", label: "No ML experience required" },
                    { icon: "M5 13l4 4L19 7", label: "ROS 2 compatible out of the box" },
                    { icon: "M5 13l4 4L19 7", label: "Deploy to any robot in one click" },
                    { icon: "M5 13l4 4L19 7", label: "Free during early access" },
                  ].map((p) => (
                    <div key={p.label} className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center shrink-0">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                          <path d={p.icon} stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="text-sm text-zinc-400">{p.label}</span>
                    </div>
                  ))}
                </div>

                {/* Social proof */}
                <div className="mt-12 pt-10 border-t border-white/10">
                  <p className="text-xs text-zinc-600 mb-4 font-mono uppercase tracking-widest">Joining from teams like</p>
                  <div className="flex flex-wrap gap-3">
                    {["Boston Dynamics", "Agility Robotics", "Skydio", "Figure AI"].map((c) => (
                      <span key={c} className="text-xs text-zinc-600 border border-white/8 rounded-full px-3 py-1">{c}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right — form */}
              <div className="flex-1 px-6 py-14 sm:px-12 sm:py-20">
                <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">

                  {/* Name row */}
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="First name" required>
                      <input
                        required
                        value={form.firstName}
                        onChange={e => set("firstName", e.target.value)}
                        placeholder="Michael"
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Last name" required>
                      <input
                        required
                        value={form.lastName}
                        onChange={e => set("lastName", e.target.value)}
                        placeholder="Martinez"
                        className={inputCls}
                      />
                    </Field>
                  </div>

                  {/* Email */}
                  <Field label="Work email" required>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={e => set("email", e.target.value)}
                      placeholder="you@company.com"
                      className={inputCls}
                    />
                  </Field>

                  {/* Company */}
                  <Field label="Company / Organization">
                    <input
                      value={form.company}
                      onChange={e => set("company", e.target.value)}
                      placeholder="Acme Robotics"
                      className={inputCls}
                    />
                  </Field>

                  {/* Role */}
                  <Field label="Your role" required>
                    <div className="flex flex-wrap gap-2">
                      {ROLES.map(r => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => set("role", r)}
                          className={chipCls(form.role === r)}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </Field>

                  {/* Robot type */}
                  <Field label="What type of robot are you working with?" required>
                    <div className="flex flex-wrap gap-2">
                      {ROBOT_TYPES.map(r => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => set("robotType", r)}
                          className={chipCls(form.robotType === r)}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </Field>

                  {/* Use case */}
                  <Field label="Primary use case" required>
                    <div className="flex flex-wrap gap-2">
                      {USE_CASES.map(u => (
                        <button
                          key={u}
                          type="button"
                          onClick={() => set("useCase", u)}
                          className={chipCls(form.useCase === u)}
                        >
                          {u}
                        </button>
                      ))}
                    </div>
                  </Field>

                  {/* Fleet size */}
                  <Field label="How many robots are you deploying to?">
                    <select
                      value={form.fleetSize}
                      onChange={e => set("fleetSize", e.target.value)}
                      className={inputCls + " cursor-pointer"}
                    >
                      <option value="">Select range</option>
                      {["1–5", "6–20", "21–100", "100+", "Not sure yet"].map(s => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </Field>

                  {/* Message */}
                  <Field label="Anything else you'd like us to know?">
                    <textarea
                      value={form.message}
                      onChange={e => set("message", e.target.value)}
                      placeholder="Tell us about your project, timeline, or questions..."
                      rows={4}
                      className={inputCls + " resize-none"}
                    />
                  </Field>

                  {/* Updates opt-in */}
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div
                      onClick={() => set("updates", !form.updates)}
                      className={`mt-0.5 h-4 w-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        form.updates
                          ? "bg-cyan-400 border-cyan-400"
                          : "border-white/20 bg-transparent hover:border-white/40"
                      }`}
                    >
                      {form.updates && (
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1 4l2 2 4-4" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <span className="text-xs text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors">
                      Send me product updates, early access announcements, and robotics AI resources. No spam — unsubscribe anytime.
                    </span>
                  </label>

                  {/* Submit */}
                  <div className="pt-2 space-y-3">
                    {error && (
                      <p className="text-sm text-red-400 text-center">{error}</p>
                    )}
                    <button
                      type="submit"
                      disabled={loading || !form.firstName || !form.email || !form.role || !form.robotType || !form.useCase}
                      className="w-full rounded-full bg-cyan-400 px-8 py-3.5 text-sm font-medium text-black transition-all hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                          </svg>
                          Submitting...
                        </>
                      ) : "Request Early Access"}
                    </button>
                    <p className="text-center text-xs text-zinc-700">
                      We review applications weekly. You&apos;ll hear from us within 3–5 days.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const inputCls =
  "w-full rounded-lg border border-white/10 bg-white/4 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-white/25 focus:bg-white/6 transition-colors";

function chipCls(active: boolean) {
  return `rounded-full border px-3 py-1.5 text-xs transition-all ${
    active
      ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-400"
      : "border-white/10 text-zinc-500 hover:text-white hover:border-white/25"
  }`;
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs text-zinc-400 flex items-center gap-1">
        {label}
        {required && <span className="text-cyan-400">*</span>}
      </label>
      {children}
    </div>
  );
}
