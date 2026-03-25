"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// ── Icons ─────────────────────────────────────────────────────────────────────

function RocketIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.5-2 4-2 4s2.5-.5 4-2l8-8-2-2-8 8z"/>
      <path d="M19 3s-4 1-7 4l5 5c3-3 4-7 4-7s-1-1-2-2z"/>
    </svg>
  );
}

function CrownIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20h20M4 20l2-10 5 5 3-8 3 8 5-5 2 10"/>
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/>
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
      <path d="M2 12h20"/>
    </svg>
  );
}

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5">
      <path d="M2.5 8l4 4 7-7" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CheckCell() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M3 9l4.5 4.5 7.5-7.5" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function XCell() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 4l8 8M12 4l-8 8" stroke="#52525b" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// ── Plans ─────────────────────────────────────────────────────────────────────

const plans = [
  {
    icon: <RocketIcon />,
    name: "Starter",
    description: "For individuals and hobbyists getting started with robotics AI.",
    monthly: 0,
    yearly: 0,
    priceLabel: "Forever",
    cta: "Get Started",
    ctaStyle: "bg-white/10 text-white hover:bg-white/15",
    features: [
      "1 robot",
      "3 AI models",
      "1 GB data storage",
      "ROS 2 deployment",
      "Basic simulation",
      "Community support",
    ],
  },
  {
    icon: <CrownIcon />,
    name: "Builder",
    description: "For growing teams running real robotics workflows.",
    monthly: 20,
    yearly: 17,
    priceLabel: "/month",
    badge: "Most popular",
    cta: "Start Builder Trial",
    ctaStyle: "bg-cyan-400 text-black hover:opacity-90",
    features: [
      "Includes everything in Starter",
      "7 robots",
      "Unlimited AI models",
      "50 GB data storage",
      "Advanced simulation",
      "Model versioning",
      "3 team seats",
      "Priority support",
    ],
  },
  {
    icon: <BriefcaseIcon />,
    name: "Pro",
    description: "For teams operating at scale across multiple robot fleets.",
    monthly: 49,
    yearly: 41,
    priceLabel: "/month",
    cta: "Start Pro Trial",
    ctaStyle: "bg-white/10 text-white hover:bg-white/15",
    features: [
      "Includes everything in Builder",
      "Unlimited robots",
      "500 GB data storage",
      "Custom integrations",
      "Unlimited seats",
      "SSO & audit logs",
      "Dedicated support",
      "SLA guarantee",
    ],
  },
];

// ── Comparison table data ──────────────────────────────────────────────────────

type CellValue = boolean | string;

interface ComparisonRow {
  feature: string;
  starter: CellValue;
  pro: CellValue;
  business: CellValue;
}

interface ComparisonCategory {
  category: string;
  rows: ComparisonRow[];
}

const comparisonData: ComparisonCategory[] = [
  {
    category: "Core Capabilities",
    rows: [
      { feature: "Robots connected",      starter: "1",         pro: "10",        business: "Unlimited" },
      { feature: "AI models",             starter: "3",         pro: "Unlimited", business: "Unlimited" },
      { feature: "Data storage",          starter: "1 GB",      pro: "50 GB",     business: "500 GB"    },
      { feature: "ROS 2 deployment",      starter: true,        pro: true,        business: true        },
      { feature: "OTA model updates",     starter: true,        pro: true,        business: true        },
      { feature: "Multi-robot fleet",     starter: false,       pro: true,        business: true        },
    ],
  },
  {
    category: "Training & Simulation",
    rows: [
      { feature: "Basic simulation",      starter: true,        pro: true,        business: true        },
      { feature: "Advanced simulation",   starter: false,       pro: true,        business: true        },
      { feature: "Model versioning",      starter: false,       pro: true,        business: true        },
      { feature: "Custom architectures",  starter: false,       pro: false,       business: true        },
      { feature: "Auto hyperparameter tuning", starter: false,  pro: true,        business: true        },
      { feature: "Hardware-in-the-loop",  starter: false,       pro: false,       business: true        },
    ],
  },
  {
    category: "Monitoring & Analytics",
    rows: [
      { feature: "Real-time robot logs",  starter: true,        pro: true,        business: true        },
      { feature: "Performance dashboards",starter: false,       pro: true,        business: true        },
      { feature: "Anomaly detection",     starter: false,       pro: true,        business: true        },
      { feature: "Custom alerting",       starter: false,       pro: false,       business: true        },
      { feature: "Audit logs",            starter: false,       pro: false,       business: true        },
    ],
  },
  {
    category: "Team & Security",
    rows: [
      { feature: "Team seats",            starter: "1",         pro: "3",         business: "Unlimited" },
      { feature: "Role-based access",     starter: false,       pro: true,        business: true        },
      { feature: "SSO (SAML/OIDC)",       starter: false,       pro: false,       business: true        },
      { feature: "Custom integrations",   starter: false,       pro: false,       business: true        },
      { feature: "SLA guarantee",         starter: false,       pro: false,       business: true        },
    ],
  },
  {
    category: "Support",
    rows: [
      { feature: "Community forum",       starter: true,        pro: true,        business: true        },
      { feature: "Priority email support",starter: false,       pro: true,        business: true        },
      { feature: "Dedicated success manager", starter: false,   pro: false,       business: true        },
      { feature: "Onboarding assistance", starter: false,       pro: false,       business: true        },
    ],
  },
];

// ── FAQ data ──────────────────────────────────────────────────────────────────

const faqs = [
  {
    q: "Can I upgrade or downgrade my plan at any time?",
    a: "Yes. You can switch plans at any time from your account settings. Upgrades take effect immediately, and downgrades apply at the start of your next billing cycle. We'll prorate any unused time.",
  },
  {
    q: "What counts as a \"robot\" in Artemis?",
    a: "A robot is any ROS 2-compatible device or system registered to your Artemis account — physical hardware, simulation environments, or virtual nodes all count. You can rename, reassign, or archive robots from your fleet dashboard.",
  },
  {
    q: "Do I need ML experience to use Artemis?",
    a: "No. Artemis's automated pipeline handles model selection, training, and packaging. You upload your data and click deploy — we handle everything in between. Advanced users can still customize architectures and hyperparameters.",
  },
  {
    q: "What data formats does Artemis support?",
    a: "Artemis ingests CSV, ROS bag files (.bag), image archives (ZIP/TAR), JSON telemetry, and LIDAR point clouds. If you have a custom format, our Business plan includes custom ingestion pipelines.",
  },
  {
    q: "Is my data secure and private?",
    a: "All data is encrypted at rest (AES-256) and in transit (TLS 1.3). Your datasets and trained models are isolated per account and never used to train shared models. Business plans include dedicated storage regions.",
  },
  {
    q: "How does the 14-day Pro trial work?",
    a: "When you start a Pro trial, you get full access to all Pro features for 14 days — no credit card required. At the end of the trial you can choose to subscribe or you'll automatically revert to the Starter plan.",
  },
  {
    q: "What happens if I exceed my storage limit?",
    a: "We'll notify you at 80% and 100% of your storage quota. You won't lose existing data, but new uploads will be paused until you free up space or upgrade. You can always manually delete old datasets from the dashboard.",
  },
  {
    q: "Can I deploy to cloud robots or only physical hardware?",
    a: "Both. Artemis deploys to any ROS 2 environment — physical robots, cloud-simulated fleets, edge devices, or hybrid setups. As long as your target runs ROS 2, Artemis can reach it.",
  },
];

// ── Comparison cell renderer ──────────────────────────────────────────────────

function Cell({ value }: { value: CellValue }) {
  if (typeof value === "boolean") {
    return (
      <div className="flex justify-center">
        {value ? <CheckCell /> : <XCell />}
      </div>
    );
  }
  return <span className="text-sm text-zinc-300 font-mono">{value}</span>;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function PricingContent() {
  const [yearly, setYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* Header with background image */}
      <section className="relative overflow-hidden border-b-2 border-white/20">
        <Image
          src="/pixel-art-hero-background.png.jpg"
          alt=""
          fill
          className="object-cover object-center opacity-25"
          aria-hidden="true"
        />
        {/* Overlays */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-b from-transparent to-black" />
          <div className="absolute inset-y-0 left-0 w-20 bg-linear-to-r from-black to-transparent" />
          <div className="absolute inset-y-0 right-0 w-20 bg-linear-to-l from-black to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-5 pt-16 pb-20 sm:px-10 sm:pt-24 sm:pb-28">
          <h1 className="text-5xl sm:text-6xl font-normal text-white tracking-tight leading-[1.1] max-w-2xl">
            Simple pricing that
            <br />scales with you
          </h1>
          <p className="mt-5 text-base text-zinc-400 max-w-md leading-relaxed">
            Start small, grow confidently, and upgrade only when your robot fleet needs it.
          </p>
        </div>
      </section>

      {/* Pricing section */}
      <section className="border-t-2 border-white/20">
        {/* Billing toggle */}
        <div className="flex justify-center py-10 sm:py-14">
          <div className="flex items-center gap-1 border border-white/20 rounded-full p-1">
            <button
              onClick={() => setYearly(false)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                !yearly ? "bg-white/10 text-white" : "text-zinc-500 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                yearly ? "bg-white/10 text-white" : "text-zinc-500 hover:text-white"
              }`}
            >
              Yearly
              <span className="text-xs text-cyan-400 font-semibold">SAVE 17%</span>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="flex flex-col sm:flex-row border-t-2 border-white/20">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`flex-1 flex flex-col px-8 py-10 sm:px-10 sm:py-12 ${
                i < plans.length - 1 ? "border-b-2 sm:border-b-0 sm:border-r-2 border-white/20" : ""
              }`}
            >
              {/* Icon */}
              <div className="mb-5">{plan.icon}</div>

              {/* Name + description */}
              <h3 className="text-2xl font-normal text-white">{plan.name}</h3>
              <p className="mt-2 text-sm text-zinc-500 leading-relaxed">{plan.description}</p>

              {/* Price */}
              <div className="mt-8">
                <div className="flex items-end gap-1">
                  <span className="text-6xl font-normal text-white tracking-tight">
                    {plan.monthly === 0 ? "Free" : `$${yearly ? plan.yearly : plan.monthly}`}
                  </span>
                </div>
                <p className="mt-1 text-sm text-zinc-500">
                  {plan.monthly === 0 ? "Forever" : yearly ? "/month, billed annually" : "/month"}
                </p>
              </div>

              {/* Divider */}
              <div className="mt-8 h-px w-full bg-white/10" />

              {/* Features — flex-1 pushes CTA to bottom */}
              <ul className="mt-6 flex flex-col gap-3 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-zinc-400">
                    <Check />
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA — pinned to bottom */}
              <Link
                href="#"
                className={`mt-10 w-full rounded-full px-6 py-3.5 text-sm font-medium text-center transition-all ${plan.ctaStyle}`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Spacer */}
      <div className="border-y-2 border-white/20 h-16 sm:h-28" />

      {/* Comparison table */}
      <section className="border-t-2 border-white/20">
        {/* Header */}
        <div className="px-5 py-10 sm:px-10 sm:py-14 border-b border-white/10">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-0.5 h-4 bg-cyan-400" />
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Compare plans</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-normal text-white tracking-tight leading-[1.1]">
            Everything you need,<br />nothing you don&apos;t.
          </h2>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-150">
            {/* Sticky plan header row */}
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-5 sm:px-10 py-6 w-[40%]">
                  <span className="text-sm text-zinc-500 font-normal">Features</span>
                </th>
                {plans.map((plan) => (
                  <th key={plan.name} className="px-4 py-6 text-center w-[20%]">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="scale-75 origin-center">{plan.icon}</div>
                        <span className="text-sm font-medium text-white">{plan.name}</span>
                      </div>
                      <Link
                        href="#"
                        className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                          plan.name === "Pro"
                            ? "bg-cyan-400 text-black hover:opacity-90"
                            : "bg-white/10 text-white hover:bg-white/15"
                        }`}
                      >
                        {plan.cta}
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {comparisonData.map((section) => (
                <>
                  {/* Category header */}
                  <tr key={section.category} className="border-b border-white/10 bg-white/2">
                    <td colSpan={4} className="px-5 sm:px-10 py-4">
                      <span className="text-sm font-medium text-white">{section.category}</span>
                    </td>
                  </tr>

                  {/* Feature rows */}
                  {section.rows.map((row, ri) => (
                    <tr
                      key={row.feature}
                      className={`border-b ${ri === section.rows.length - 1 ? "border-white/10" : "border-white/6"} hover:bg-white/2 transition-colors`}
                    >
                      <td className="px-5 sm:px-10 py-4 text-sm text-zinc-400">{row.feature}</td>
                      <td className="px-4 py-4 text-center"><Cell value={row.starter} /></td>
                      <td className="px-4 py-4 text-center"><Cell value={row.pro} /></td>
                      <td className="px-4 py-4 text-center"><Cell value={row.business} /></td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Spacer */}
      <div className="border-y-2 border-white/20 h-16 sm:h-28" />

      {/* FAQ section */}
      <section className="border-t-2 border-white/20">
        <div className="flex flex-col md:flex-row">
          {/* Left panel */}
          <div className="md:w-80 shrink-0 px-5 py-10 sm:px-10 sm:py-14 md:border-r-2 border-b-2 md:border-b-0 border-white/20">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-0.5 h-4 bg-cyan-400" />
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">FAQ</span>
            </div>
            <h2 className="text-4xl font-normal text-white tracking-tight leading-[1.1]">
              Common<br />questions
            </h2>
            <p className="mt-4 text-sm text-zinc-500 leading-relaxed">
              Still have questions? We&apos;re happy to help.
            </p>
            <Link
              href="#"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm text-zinc-400 hover:text-white hover:border-white/40 transition-colors"
            >
              Contact support
            </Link>
          </div>

          {/* Right accordion */}
          <div className="flex-1">
            {faqs.map((faq, i) => (
              <div key={i} className={`border-b border-white/10 ${i === 0 ? "" : ""}`}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-start justify-between gap-4 px-5 sm:px-10 py-6 text-left hover:bg-white/2 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-xs font-mono text-zinc-600 mt-1 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-base text-white font-normal leading-snug">{faq.q}</span>
                  </div>
                  <span
                    className={`shrink-0 mt-0.5 text-zinc-500 text-xl leading-none transition-transform duration-200 ${
                      openFaq === i ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 sm:px-10 pb-6 pl-13 sm:pl-18">
                    <p className="text-sm text-zinc-500 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
