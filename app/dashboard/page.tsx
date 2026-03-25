import Link from "next/link";

const stats = [
  {
    label: "Active Models",
    value: "3",
    sub: "+1 this week",
    status: null,
    icon: (
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
        <path d="M8 1l6 3.5v7L8 15 2 11.5v-7L8 1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
        <path d="M8 1v14M2 4.5l6 3.5 6-3.5" stroke="currentColor" strokeWidth="1.3"/>
      </svg>
    ),
  },
  {
    label: "Training Jobs",
    value: "1",
    sub: "Running now",
    status: "running",
    icon: (
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
        <polyline points="1,11 4,7 7,9 10,4 14,6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M1 14h14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "Deployments",
    value: "5",
    sub: "All active",
    status: "healthy",
    icon: (
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
        <path d="M8 2C5 2 3 5 3 5s1 1.5 2.5 2c.5-1 1.5-2 2.5-2s2 1 2.5 2C11.5 6.5 13 5 13 5S11 2 8 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
        <path d="M8 7v7M5.5 11.5l2.5 2 2.5-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="8" cy="7" r="1.5" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: "System Status",
    value: "99.9%",
    sub: "Uptime — all systems go",
    status: "online",
    icon: (
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M5 8l2.5 2.5L11 5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

const activity = [
  { icon: "deploy", label: "arm-model-v2 deployed to my-arm-01", time: "2 min ago",  color: "text-cyan-400" },
  { icon: "train",  label: "Training run completed — 94.3% accuracy", time: "1 hr ago",  color: "text-green-400" },
  { icon: "upload", label: "Dataset uploaded: arm-demos-v3.bag (2.1 GB)", time: "3 hrs ago", color: "text-zinc-400" },
  { icon: "alert",  label: "Latency spike on warehouse-bot-02 — resolved", time: "5 hrs ago", color: "text-yellow-400" },
  { icon: "train",  label: "Training started: nav-model-v4", time: "6 hrs ago", color: "text-cyan-400" },
];

const models = [
  {
    name: "arm-model-v2",
    task: "manipulation",
    robot: "my-arm-01",
    accuracy: 94.3,
    latency: "11ms",
    status: "active",
    updated: "2 min ago",
  },
  {
    name: "nav-model-v4",
    task: "navigation",
    robot: "warehouse-bot-01",
    accuracy: 91.8,
    latency: "18ms",
    status: "training",
    updated: "6 hrs ago",
  },
  {
    name: "sort-alpha-v1",
    task: "object_detection",
    robot: "sortbot-03",
    accuracy: 88.5,
    latency: "24ms",
    status: "active",
    updated: "1 day ago",
  },
];

export default function DashboardPage() {
  return (
    <div className="px-6 py-8 sm:px-10 sm:py-10 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-medium text-white">Good morning, Michael</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Monday, March 23, 2026</p>
        </div>
        <Link
          href="/dashboard/models/create"
          className="flex items-center gap-2 rounded-lg bg-white text-black px-4 py-2 text-sm font-medium hover:bg-zinc-200 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          Create Model
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-[#222] bg-[#111] p-5">
            <div className="flex items-start justify-between mb-3">
              <span className="text-zinc-600">{stat.icon}</span>
              {stat.status === "running" && (
                <span className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  LIVE
                </span>
              )}
              {stat.status === "healthy" && (
                <span className="flex items-center gap-1.5 text-[10px] font-mono text-green-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                  OK
                </span>
              )}
              {stat.status === "online" && (
                <span className="flex items-center gap-1.5 text-[10px] font-mono text-green-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                  UP
                </span>
              )}
            </div>
            <p className="text-2xl font-semibold text-white tracking-tight">{stat.value}</p>
            <p className="text-xs text-zinc-500 mt-1">{stat.label}</p>
            <p className="text-[10px] text-zinc-700 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Training progress banner */}
      <div className="rounded-xl border border-[#222] bg-[#111] p-4 mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
            <div>
              <p className="text-sm font-medium text-white">Training in progress — nav-model-v4</p>
              <p className="text-xs text-zinc-500">Epoch 14/20 · Est. 6 min remaining</p>
            </div>
          </div>
          <Link href="/dashboard/training" className="text-xs text-zinc-500 hover:text-white transition-colors">
            View details →
          </Link>
        </div>
        <div className="h-1.5 w-full rounded-full bg-[#222] overflow-hidden">
          <div className="h-full w-[68%] rounded-full bg-cyan-400 transition-all" style={{ background: "linear-gradient(90deg, #22d3ee, #06b6d4)" }} />
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[10px] font-mono text-zinc-600">Loss: 0.121 · Accuracy: 91.8%</span>
          <span className="text-[10px] font-mono text-zinc-600">68%</span>
        </div>
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Active models */}
        <div className="rounded-xl border border-[#222] bg-[#111] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e1e1e]">
            <h2 className="text-sm font-medium text-white">Active Models</h2>
            <Link href="/dashboard/models" className="text-xs text-zinc-500 hover:text-white transition-colors">View all</Link>
          </div>
          <div className="divide-y divide-[#1a1a1a]">
            {models.map((model) => (
              <div key={model.name} className="flex items-center gap-4 px-5 py-4 hover:bg-white/2 transition-colors group">
                <div className="h-8 w-8 rounded-lg border border-[#2a2a2a] bg-[#161616] flex items-center justify-center shrink-0">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-zinc-500">
                    <path d="M8 1l6 3.5v7L8 15 2 11.5v-7L8 1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white truncate">{model.name}</p>
                    <span className={`shrink-0 text-[10px] font-mono rounded-full px-2 py-0.5 border ${
                      model.status === "active"
                        ? "text-green-400 bg-green-400/5 border-green-400/20"
                        : "text-cyan-400 bg-cyan-400/5 border-cyan-400/20 animate-pulse"
                    }`}>
                      {model.status === "active" ? "● active" : "● training"}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 mt-0.5">{model.task} · {model.robot}</p>
                </div>
                <div className="text-right shrink-0 hidden sm:block">
                  <p className="text-sm font-mono text-white">{model.accuracy}%</p>
                  <p className="text-[10px] text-zinc-600">{model.latency} p50</p>
                </div>
                <p className="text-[10px] text-zinc-700 shrink-0 hidden md:block">{model.updated}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Activity feed */}
        <div className="rounded-xl border border-[#222] bg-[#111] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e1e1e]">
            <h2 className="text-sm font-medium text-white">Recent Activity</h2>
          </div>
          <div className="divide-y divide-[#1a1a1a]">
            {activity.map((item, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-3.5">
                <span className={`mt-0.5 h-1.5 w-1.5 rounded-full shrink-0 ${item.color === "text-cyan-400" ? "bg-cyan-400" : item.color === "text-green-400" ? "bg-green-400" : item.color === "text-yellow-400" ? "bg-yellow-400" : "bg-zinc-600"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-zinc-300 leading-relaxed">{item.label}</p>
                  <p className="text-[10px] text-zinc-700 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
