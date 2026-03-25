"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const TABS = ["Profile", "API Keys", "Billing", "Plans", "Notifications", "Team"] as const;
type Tab = (typeof TABS)[number];

const scopeStyle: Record<string, string> = {
  write: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  read:  "text-green-400 bg-green-400/10 border-green-400/20",
  admin: "text-amber-400 bg-amber-400/10 border-amber-400/20",
};

const apiKeys = [
  { name: "Production",  key: "kai_live_pk_••••••••••••xxxx", scope: "write", created: "Jan 15, 2026", last: "2 min ago",   active: true },
  { name: "CI/CD",       key: "kai_live_pk_••••••••••••yyyy", scope: "read",  created: "Feb 01, 2026", last: "1 hr ago",    active: true },
  { name: "Local Dev",   key: "kai_live_pk_••••••••••••zzzz", scope: "admin", created: "Mar 10, 2026", last: "3 days ago",  active: true },
];

const teamMembers = [
  { name: "Michael Martinez", email: "michael@artemis.dev",   role: "Owner",  avatar: "M", joined: "Jan 1, 2026" },
  { name: "Ava Chen",         email: "ava@artemis.dev",        role: "Admin",  avatar: "A", joined: "Feb 3, 2026" },
  { name: "James Park",       email: "james@artemis.dev",      role: "Member", avatar: "J", joined: "Mar 12, 2026" },
];

const roleStyle: Record<string, string> = {
  Owner:  "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  Admin:  "text-purple-400 bg-purple-400/10 border-purple-400/20",
  Member: "text-zinc-400 bg-zinc-400/10 border-zinc-400/20",
};

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative h-7 w-12 rounded-full transition-colors duration-200 shrink-0 ${on ? "bg-cyan-400" : "bg-[#2a2a2a]"}`}
    >
      <span
        className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${on ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  );
}

function Avatar({ initials, size = "md" }: { initials: string; size?: "sm" | "md" | "lg" }) {
  const sz = size === "lg" ? "h-20 w-20 text-2xl" : size === "md" ? "h-12 w-12 text-base" : "h-10 w-10 text-sm";
  return (
    <div className={`${sz} rounded-full bg-linear-to-br from-cyan-400 to-blue-500 flex items-center justify-center shrink-0 font-semibold text-black`}>
      {initials}
    </div>
  );
}

function SectionCard({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[#222] bg-[#111] overflow-hidden">
      <div className="flex items-center justify-between px-7 py-5 border-b border-[#1e1e1e]">
        <p className="text-base font-medium text-white">{title}</p>
        {action}
      </div>
      {children}
    </div>
  );
}

function Input({ label, defaultValue, type = "text", disabled }: { label: string; defaultValue: string; type?: string; disabled?: boolean }) {
  return (
    <div>
      <label className="text-sm text-zinc-400 mb-2 block font-medium">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        disabled={disabled}
        className="w-full rounded-lg border border-[#2a2a2a] bg-[#161616] px-4 py-3 text-base text-white outline-none focus:border-white/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      />
    </div>
  );
}

function SettingsContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as Tab | null;
  const [tab, setTab] = useState<Tab>(TABS.includes(tabParam as Tab) ? (tabParam as Tab) : "Profile");
  const [notifs, setNotifs] = useState({
    training:    true,
    deployments: true,
    offline:     true,
    storage:     false,
    digest:      false,
  });
  const [copied, setCopied] = useState<string | null>(null);

  function copyKey(name: string) {
    setCopied(name);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="px-8 py-10 sm:px-12 sm:py-12 max-w-4xl w-full">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="text-base text-zinc-500 mt-1">Manage your account, API keys, and workspace</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-10 border-b border-[#1e1e1e]">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-3 text-base transition-colors relative ${
              tab === t ? "text-white" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {t}
            {tab === t && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
            )}
          </button>
        ))}
      </div>

      {/* Profile */}
      {tab === "Profile" && (
        <div className="space-y-6">
          <SectionCard title="Personal Information">
            <div className="p-8 space-y-7">
              <div className="flex items-center gap-6">
                <Avatar initials="M" size="lg" />
                <div>
                  <p className="text-base font-semibold text-white">Michael Martinez</p>
                  <p className="text-sm text-zinc-500 mt-0.5">michael@artemis.dev</p>
                  <button className="mt-2 text-sm text-zinc-500 hover:text-white transition-colors underline underline-offset-2">
                    Change avatar
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <Input label="First Name" defaultValue="Michael" />
                <Input label="Last Name"  defaultValue="Martinez" />
              </div>
              <Input label="Email Address" defaultValue="michael@artemis.dev" type="email" />
              <Input label="Company / Workspace" defaultValue="Artemis Robotics" />
              <div className="flex justify-end pt-2">
                <button className="rounded-lg bg-white text-black px-5 py-2.5 text-sm font-medium hover:bg-zinc-200 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Password">
            <div className="p-8 space-y-5">
              <Input label="Current Password" defaultValue="" type="password" />
              <div className="grid grid-cols-2 gap-5">
                <Input label="New Password"     defaultValue="" type="password" />
                <Input label="Confirm Password" defaultValue="" type="password" />
              </div>
              <div className="flex justify-end pt-2">
                <button className="rounded-lg bg-white text-black px-5 py-2.5 text-sm font-medium hover:bg-zinc-200 transition-colors">
                  Update Password
                </button>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Danger Zone">
            <div className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-medium text-white">Delete Account</p>
                  <p className="text-sm text-zinc-500 mt-1">Permanently delete your account and all associated data</p>
                </div>
                <button className="rounded-lg border border-red-500/30 bg-red-500/5 px-5 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:border-red-500/50 transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          </SectionCard>
        </div>
      )}

      {/* API Keys */}
      {tab === "API Keys" && (
        <div className="space-y-6">
          <SectionCard
            title="API Keys"
            action={
              <button className="flex items-center gap-2 rounded-lg bg-white text-black px-4 py-2 text-sm font-medium hover:bg-zinc-200 transition-colors">
                <svg width="11" height="11" viewBox="0 0 10 10" fill="none">
                  <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
                New Key
              </button>
            }
          >
            <div className="divide-y divide-[#1a1a1a]">
              {apiKeys.map((k) => (
                <div key={k.name} className="flex items-center gap-5 px-7 py-5 group hover:bg-white/2 transition-colors">
                  <div className="h-10 w-10 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center shrink-0">
                    <svg width="16" height="16" viewBox="0 0 14 14" fill="none" className="text-zinc-500">
                      <circle cx="5" cy="5" r="3" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M7.5 7.5l4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                      <path d="M11 9l1 1-1.5 1.5L9 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1">
                      <p className="text-base font-medium text-white">{k.name}</p>
                      <span className={`text-xs font-mono border rounded px-2 py-0.5 ${scopeStyle[k.scope]}`}>
                        {k.scope}
                      </span>
                    </div>
                    <p className="text-sm font-mono text-zinc-600">{k.key}</p>
                  </div>
                  <div className="text-right hidden sm:block shrink-0 mr-3">
                    <p className="text-xs text-zinc-600">Last used {k.last}</p>
                    <p className="text-xs text-zinc-700 mt-0.5">Created {k.created}</p>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => copyKey(k.name)}
                      className="rounded-md border border-[#2a2a2a] bg-[#161616] px-3 py-1.5 text-xs text-zinc-400 hover:text-white hover:border-white/20 transition-colors"
                    >
                      {copied === k.name ? "Copied!" : "Copy"}
                    </button>
                    <button className="rounded-md border border-red-400/20 bg-red-400/5 px-3 py-1.5 text-xs text-red-400 hover:bg-red-400/10 transition-colors">
                      Revoke
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <div className="rounded-xl border border-[#222] bg-[#111] p-6">
            <div className="flex items-start gap-4">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className="text-zinc-600 mt-0.5 shrink-0">
                <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M8 7v4M8 5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              <div>
                <p className="text-sm font-medium text-zinc-400">Keep your keys secure</p>
                <p className="text-sm text-zinc-600 mt-1.5 leading-relaxed">
                  Never share API keys in public repositories or client-side code. Use environment variables and rotate keys regularly. Admin keys have full access — use scoped keys where possible.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Billing */}
      {tab === "Billing" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-7">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <p className="text-lg font-semibold text-white">Pro Plan</p>
                  <span className="text-xs font-mono text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 rounded-full px-2.5 py-0.5">Active</span>
                </div>
                <p className="text-base text-zinc-400">$49 / month · renews Apr 23, 2026</p>
                <p className="text-sm text-zinc-600 mt-3">Next invoice: <span className="text-zinc-400">$49.00 on Apr 23, 2026</span></p>
              </div>
              <div className="flex flex-col gap-2">
                <button className="rounded-lg bg-white text-black px-5 py-2.5 text-sm font-medium hover:bg-zinc-200 transition-colors">
                  Upgrade
                </button>
                <button className="rounded-lg border border-[#2a2a2a] px-5 py-2.5 text-sm text-zinc-400 hover:text-white hover:border-white/20 transition-colors">
                  Manage
                </button>
              </div>
            </div>
          </div>

          <SectionCard title="Usage This Month">
            <div className="p-8 space-y-6">
              {[
                { label: "Robots",        used: 3,   limit: 10, unit: "",    pct: 30 },
                { label: "Storage",       used: 4.3, limit: 50, unit: " GB", pct: 8.6 },
                { label: "Team Seats",    used: 2,   limit: 3,  unit: "",    pct: 66 },
                { label: "Training Runs", used: 18,  limit: 50, unit: "",    pct: 36 },
              ].map((r) => {
                const color = r.pct >= 90 ? "bg-red-400" : r.pct >= 70 ? "bg-amber-400" : "bg-cyan-400";
                return (
                  <div key={r.label}>
                    <div className="flex items-center justify-between mb-2.5">
                      <p className="text-base text-zinc-300">{r.label}</p>
                      <p className="text-sm font-mono text-zinc-500">{r.used}{r.unit} <span className="text-zinc-700">/ {r.limit}{r.unit}</span></p>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#222] overflow-hidden">
                      <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${r.pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard title="Invoice History">
            <div className="divide-y divide-[#1a1a1a]">
              {[
                { date: "Mar 23, 2026", amount: "$49.00", status: "Paid" },
                { date: "Feb 23, 2026", amount: "$49.00", status: "Paid" },
                { date: "Jan 23, 2026", amount: "$49.00", status: "Paid" },
                { date: "Dec 23, 2025", amount: "$20.00", status: "Paid" },
              ].map((inv) => (
                <div key={inv.date} className="flex items-center justify-between px-7 py-5 hover:bg-white/2 transition-colors group">
                  <div className="flex items-center gap-3.5">
                    <svg width="16" height="16" viewBox="0 0 14 14" fill="none" className="text-zinc-600">
                      <rect x="2" y="1" width="9" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M4.5 4.5h5M4.5 7h5M4.5 9.5h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                    <p className="text-base text-zinc-300">{inv.date}</p>
                  </div>
                  <div className="flex items-center gap-5">
                    <span className="text-xs text-green-400 bg-green-400/10 border border-green-400/20 rounded-full px-2.5 py-0.5 font-mono">{inv.status}</span>
                    <p className="text-base font-mono text-white">{inv.amount}</p>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-zinc-500 hover:text-white underline underline-offset-2">
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      )}

      {/* Notifications */}
      {tab === "Notifications" && (
        <div className="space-y-6">
          {([
            { title: "Robot & Fleet Alerts", items: [
              { key: "offline" as const,     label: "Robot offline",     sub: "When a robot misses 3 consecutive heartbeats" },
              { key: "deployments" as const, label: "Deployment alerts", sub: "When a deployment fails or triggers a rollback" },
            ]},
            { title: "Training & Models", items: [
              { key: "training" as const, label: "Training complete", sub: "When a training run finishes successfully or errors" },
              { key: "storage" as const,  label: "Storage warning",   sub: "When usage reaches 80% of your quota" },
            ]},
            { title: "Digest & Reports", items: [
              { key: "digest" as const, label: "Weekly digest", sub: "Summary of fleet activity delivered every Monday morning" },
            ]},
          ]).map((group) => (
            <SectionCard key={group.title} title={group.title}>
              <div className="divide-y divide-[#1a1a1a]">
                {group.items.map((n) => (
                  <div key={n.key} className="flex items-center justify-between px-7 py-5">
                    <div>
                      <p className="text-base font-medium text-white">{n.label}</p>
                      <p className="text-sm text-zinc-600 mt-1">{n.sub}</p>
                    </div>
                    <Toggle on={notifs[n.key]} onChange={() => setNotifs(p => ({ ...p, [n.key]: !p[n.key] }))} />
                  </div>
                ))}
              </div>
            </SectionCard>
          ))}
        </div>
      )}

      {/* Team */}
      {tab === "Team" && (
        <div className="space-y-6">
          <SectionCard
            title="Members"
            action={
              <button className="flex items-center gap-2 rounded-lg bg-white text-black px-4 py-2 text-sm font-medium hover:bg-zinc-200 transition-colors">
                <svg width="11" height="11" viewBox="0 0 10 10" fill="none">
                  <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
                Invite
              </button>
            }
          >
            <div className="divide-y divide-[#1a1a1a]">
              {teamMembers.map((m) => (
                <div key={m.email} className="flex items-center gap-5 px-7 py-5 group hover:bg-white/2 transition-colors">
                  <Avatar initials={m.avatar} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1">
                      <p className="text-base font-medium text-white">{m.name}</p>
                      <span className={`text-xs font-mono border rounded px-2 py-0.5 ${roleStyle[m.role]}`}>
                        {m.role}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-600">{m.email}</p>
                  </div>
                  <p className="text-sm text-zinc-700 hidden sm:block shrink-0">Joined {m.joined}</p>
                  {m.role !== "Owner" && (
                    <button className="opacity-0 group-hover:opacity-100 rounded-md border border-[#2a2a2a] px-3 py-2 text-sm text-zinc-500 hover:text-white hover:border-white/20 transition-all">
                      Manage
                    </button>
                  )}
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Pending Invites">
            <div className="px-7 py-12 text-center">
              <svg width="40" height="40" viewBox="0 0 32 32" fill="none" className="mx-auto text-zinc-700 mb-4">
                <circle cx="16" cy="10" r="5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M6 26c0-5 4.5-8 10-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M22 20v6M19 23h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <p className="text-base text-zinc-500">No pending invites</p>
              <p className="text-sm text-zinc-700 mt-1.5">Invited members will appear here until they accept</p>
            </div>
          </SectionCard>

          <div className="rounded-xl border border-[#222] bg-[#111] p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-medium text-white">Seat Usage</p>
                <p className="text-sm text-zinc-500 mt-1">2 of 3 seats used on your Pro plan</p>
              </div>
              <button className="rounded-lg border border-[#2a2a2a] px-4 py-2.5 text-sm text-zinc-400 hover:text-white hover:border-white/20 transition-colors">
                Add Seats
              </button>
            </div>
            <div className="mt-5 h-2 w-full rounded-full bg-[#222] overflow-hidden">
              <div className="h-full rounded-full bg-amber-400" style={{ width: "66%" }} />
            </div>
          </div>
        </div>
      )}

      {/* Plans */}
      {tab === "Plans" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                name: "Builder",
                price: "$20",
                desc: "For individuals getting started with robotics AI.",
                current: false,
                features: [
                  "Up to 3 robots",
                  "10 GB storage",
                  "5 training runs / mo",
                  "ROS 2 deployments",
                  "Community support",
                  "—",
                ],
              },
              {
                name: "Pro",
                price: "$49",
                desc: "For teams managing a growing robot fleet.",
                current: true,
                features: [
                  "Up to 10 robots",
                  "50 GB storage",
                  "50 training runs / mo",
                  "ROS 2 deployments",
                  "Priority support",
                  "3 team seats",
                ],
              },
              {
                name: "Enterprise",
                price: "Custom",
                desc: "For large-scale fleets with custom needs.",
                current: false,
                features: [
                  "Unlimited robots",
                  "Custom storage",
                  "Unlimited training",
                  "ROS 2 + custom protocols",
                  "Dedicated support",
                  "SSO & audit logs",
                ],
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-xl border p-7 flex flex-col gap-6 ${
                  plan.current
                    ? "border-cyan-400/30 bg-cyan-400/5"
                    : "border-[#222] bg-[#111]"
                }`}
              >
                {plan.current && (
                  <span className="absolute top-5 right-5 text-xs font-mono text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 rounded-full px-2.5 py-1">
                    Current
                  </span>
                )}
                <div>
                  <p className="text-base font-semibold text-white">{plan.name}</p>
                  <div className="flex items-baseline gap-1.5 mt-2">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    {plan.price !== "Custom" && <span className="text-sm text-zinc-500">/mo</span>}
                  </div>
                  <p className="text-sm text-zinc-500 mt-2 leading-relaxed">{plan.desc}</p>
                </div>
                <ul className="space-y-3 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2.5">
                      {f === "—" ? (
                        <span className="shrink-0 text-zinc-700 text-sm">—</span>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 12 12" fill="none" className="shrink-0 text-cyan-400">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                      <span className={`text-sm ${f === "—" ? "text-zinc-700" : "text-zinc-400"}`}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full rounded-lg py-3 text-sm font-medium transition-colors ${
                    plan.current
                      ? "bg-white/10 text-white cursor-default"
                      : plan.price === "Custom"
                      ? "border border-[#2a2a2a] text-zinc-400 hover:text-white hover:border-white/20"
                      : "bg-white text-black hover:bg-zinc-200"
                  }`}
                >
                  {plan.current ? "Current Plan" : plan.price === "Custom" ? "Contact Sales" : "Upgrade"}
                </button>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-[#222] bg-[#111] p-7">
            <p className="text-base font-medium text-white mb-5">All plans include</p>
            <div className="grid grid-cols-2 gap-x-10 gap-y-4">
              {[
                "ROS 2 Humble & Iron support",
                "Model versioning & rollback",
                "REST API access",
                "Real-time telemetry",
                "99.9% uptime SLA",
                "SOC 2 Type II compliant",
              ].map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <svg width="14" height="14" viewBox="0 0 12 12" fill="none" className="shrink-0 text-zinc-500">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-sm text-zinc-500">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense>
      <SettingsContent />
    </Suspense>
  );
}
