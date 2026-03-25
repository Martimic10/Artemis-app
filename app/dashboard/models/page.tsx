import Link from "next/link";

const models = [
  { id: "mdl_abc123", name: "arm-model-v2",    task: "manipulation",     robot: "my-arm-01",        accuracy: 94.3, latency: 11,  version: "v2", status: "active",   updated: "2 min ago",   runs: 3 },
  { id: "mdl_def456", name: "nav-model-v4",    task: "navigation",       robot: "warehouse-bot-01", accuracy: 91.8, latency: 18,  version: "v4", status: "training", updated: "6 hrs ago",   runs: 4 },
  { id: "mdl_ghi789", name: "sort-alpha-v1",   task: "object_detection", robot: "sortbot-03",       accuracy: 88.5, latency: 24,  version: "v1", status: "active",   updated: "1 day ago",   runs: 1 },
  { id: "mdl_jkl012", name: "gripper-v1",      task: "manipulation",     robot: "gripper-unit-02",  accuracy: 79.2, latency: 31,  version: "v1", status: "staging",  updated: "2 days ago",  runs: 1 },
  { id: "mdl_mno345", name: "patrol-nav-v2",   task: "navigation",       robot: "patrol-bot-05",    accuracy: 93.1, latency: 15,  version: "v2", status: "active",   updated: "3 days ago",  runs: 2 },
  { id: "mdl_pqr678", name: "anomaly-det-v1",  task: "anomaly_detection",robot: "line-sensor-01",   accuracy: 97.4, latency: 8,   version: "v1", status: "archived", updated: "1 week ago",  runs: 1 },
];

const taskColors: Record<string, string> = {
  manipulation:     "text-cyan-400 bg-cyan-400/5 border-cyan-400/20",
  navigation:       "text-violet-400 bg-violet-400/5 border-violet-400/20",
  object_detection: "text-orange-400 bg-orange-400/5 border-orange-400/20",
  anomaly_detection:"text-yellow-400 bg-yellow-400/5 border-yellow-400/20",
};

const statusBadge: Record<string, string> = {
  active:   "text-green-400 bg-green-400/5 border-green-400/20",
  training: "text-cyan-400 bg-cyan-400/5 border-cyan-400/20",
  staging:  "text-yellow-400 bg-yellow-400/5 border-yellow-400/20",
  archived: "text-zinc-500 bg-zinc-500/5 border-zinc-500/20",
};

export default function ModelsPage() {
  return (
    <div className="px-6 py-8 sm:px-10 sm:py-10 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-medium text-white">Models</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{models.length} models across your fleet</p>
        </div>
        <Link
          href="/dashboard/models/create"
          className="flex items-center gap-2 rounded-lg bg-white text-black px-4 py-2 text-sm font-medium hover:bg-zinc-200 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          New Model
        </Link>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-5">
        {["All", "Active", "Training", "Staging", "Archived"].map((f) => (
          <button
            key={f}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              f === "All"
                ? "bg-white/8 text-white"
                : "text-zinc-500 hover:text-white hover:bg-white/4"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#222] bg-[#111] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1e1e1e]">
              <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-500">Model</th>
              <th className="text-left px-4 py-3.5 text-xs font-medium text-zinc-500 hidden sm:table-cell">Task</th>
              <th className="text-left px-4 py-3.5 text-xs font-medium text-zinc-500 hidden md:table-cell">Robot</th>
              <th className="text-left px-4 py-3.5 text-xs font-medium text-zinc-500">Status</th>
              <th className="text-left px-4 py-3.5 text-xs font-medium text-zinc-500 hidden lg:table-cell">Accuracy</th>
              <th className="text-left px-4 py-3.5 text-xs font-medium text-zinc-500 hidden lg:table-cell">Latency</th>
              <th className="text-left px-4 py-3.5 text-xs font-medium text-zinc-500 hidden md:table-cell">Updated</th>
              <th className="px-4 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1a1a]">
            {models.map((model) => (
              <tr key={model.id} className="hover:bg-white/2 transition-colors group">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-md border border-[#2a2a2a] bg-[#161616] flex items-center justify-center shrink-0">
                      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" className="text-zinc-600">
                        <path d="M8 1l6 3.5v7L8 15 2 11.5v-7L8 1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{model.name}</p>
                      <p className="text-[10px] text-zinc-600 font-mono">{model.version} · {model.runs} run{model.runs !== 1 ? "s" : ""}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 hidden sm:table-cell">
                  <span className={`text-[10px] font-mono rounded-full border px-2 py-0.5 ${taskColors[model.task] ?? ""}`}>
                    {model.task}
                  </span>
                </td>
                <td className="px-4 py-4 hidden md:table-cell">
                  <p className="text-xs text-zinc-400 font-mono">{model.robot}</p>
                </td>
                <td className="px-4 py-4">
                  <span className={`text-[10px] font-mono rounded-full border px-2 py-0.5 flex items-center gap-1.5 w-fit ${statusBadge[model.status]}`}>
                    {model.status === "training" && <span className="h-1 w-1 rounded-full bg-cyan-400 animate-pulse" />}
                    {model.status === "active" && <span className="h-1 w-1 rounded-full bg-green-400" />}
                    {model.status}
                  </span>
                </td>
                <td className="px-4 py-4 hidden lg:table-cell">
                  <p className="text-sm font-mono text-white">{model.accuracy}%</p>
                </td>
                <td className="px-4 py-4 hidden lg:table-cell">
                  <p className="text-xs font-mono text-zinc-400">{model.latency} ms</p>
                </td>
                <td className="px-4 py-4 hidden md:table-cell">
                  <p className="text-xs text-zinc-600">{model.updated}</p>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      href="/dashboard/deployments"
                      className="rounded-md border border-[#2a2a2a] bg-[#161616] px-2.5 py-1 text-[10px] text-zinc-400 hover:text-white hover:border-white/20 transition-colors"
                    >
                      Deploy
                    </Link>
                    <button className="rounded-md border border-[#2a2a2a] bg-[#161616] p-1 text-zinc-600 hover:text-white hover:border-white/20 transition-colors">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <circle cx="6" cy="2" r="1" fill="currentColor"/>
                        <circle cx="6" cy="6" r="1" fill="currentColor"/>
                        <circle cx="6" cy="10" r="1" fill="currentColor"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
