import Link from "next/link";

const activeJobs = [
  {
    id: "run_789abc",
    model: "nav-model-v4",
    dataset: "lidar-scan-v2.bag",
    robot: "warehouse-bot-01",
    epoch: 14,
    totalEpochs: 20,
    accuracy: 91.8,
    loss: 0.121,
    progress: 68,
    started: "38 min ago",
    eta: "~6 min",
  },
];

const history = [
  { id: "run_123aaa", model: "arm-model-v2",   accuracy: 94.3, loss: 0.071, epochs: 20, duration: "3m 58s", status: "complete", date: "2 hrs ago" },
  { id: "run_234bbb", model: "arm-model-v1",   accuracy: 88.1, loss: 0.143, epochs: 20, duration: "3m 42s", status: "complete", date: "2 days ago" },
  { id: "run_345ccc", model: "sort-alpha-v1",  accuracy: 88.5, loss: 0.198, epochs: 15, duration: "2m 51s", status: "complete", date: "3 days ago" },
  { id: "run_456ddd", model: "gripper-v1",     accuracy: 79.2, loss: 0.312, epochs: 10, duration: "1m 58s", status: "complete", date: "4 days ago" },
  { id: "run_567eee", model: "patrol-nav-v2",  accuracy: 93.1, loss: 0.088, epochs: 20, duration: "4m 11s", status: "complete", date: "5 days ago" },
  { id: "run_678fff", model: "detect-v0",      accuracy: 0,    loss: 0,     epochs: 0,  duration: "—",      status: "failed",   date: "1 week ago" },
];

export default function TrainingPage() {
  return (
    <div className="px-6 py-8 sm:px-10 sm:py-10 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-medium text-white">Training</h1>
          <p className="text-sm text-zinc-500 mt-0.5">1 active job · {history.length} completed runs</p>
        </div>
        <Link
          href="/dashboard/models/create"
          className="flex items-center gap-2 rounded-lg bg-white text-black px-4 py-2 text-sm font-medium hover:bg-zinc-200 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          New Run
        </Link>
      </div>

      {/* Active jobs */}
      <div className="mb-6">
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-3">Active</p>
        {activeJobs.map((job) => (
          <div key={job.id} className="rounded-xl border border-[#222] bg-[#111] p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">{job.model}</p>
                  <p className="text-xs text-zinc-600 font-mono mt-0.5">{job.id} · {job.dataset}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-zinc-500">Robot: <span className="text-zinc-300">{job.robot}</span></p>
                <p className="text-xs text-zinc-700 mt-0.5">Started {job.started}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-2">
              <div className="flex-1 h-1.5 rounded-full bg-[#222] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${job.progress}%`, background: "linear-gradient(90deg, #22d3ee, #06b6d4)" }}
                />
              </div>
              <span className="text-[10px] font-mono text-zinc-500 shrink-0">{job.progress}%</span>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-[#1e1e1e]">
              {[
                { label: "Epoch",    value: `${job.epoch}/${job.totalEpochs}` },
                { label: "Accuracy", value: `${job.accuracy}%` },
                { label: "Loss",     value: job.loss },
                { label: "ETA",      value: job.eta },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-wide font-mono">{s.label}</p>
                  <p className="text-sm font-mono text-white mt-0.5">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* History */}
      <div>
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-3">Run History</p>
        <div className="rounded-xl border border-[#222] bg-[#111] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e1e1e]">
                <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-500">Model</th>
                <th className="text-left px-4 py-3.5 text-xs font-medium text-zinc-500 hidden sm:table-cell">Accuracy</th>
                <th className="text-left px-4 py-3.5 text-xs font-medium text-zinc-500 hidden md:table-cell">Loss</th>
                <th className="text-left px-4 py-3.5 text-xs font-medium text-zinc-500 hidden lg:table-cell">Epochs</th>
                <th className="text-left px-4 py-3.5 text-xs font-medium text-zinc-500 hidden lg:table-cell">Duration</th>
                <th className="text-left px-4 py-3.5 text-xs font-medium text-zinc-500">Status</th>
                <th className="text-left px-4 py-3.5 text-xs font-medium text-zinc-500 hidden md:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {history.map((run) => (
                <tr key={run.id} className="hover:bg-white/2 transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-white">{run.model}</p>
                    <p className="text-[10px] text-zinc-700 font-mono mt-0.5">{run.id}</p>
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <p className="text-sm font-mono text-white">{run.accuracy > 0 ? `${run.accuracy}%` : "—"}</p>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <p className="text-xs font-mono text-zinc-400">{run.loss > 0 ? run.loss : "—"}</p>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <p className="text-xs text-zinc-400">{run.epochs > 0 ? run.epochs : "—"}</p>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <p className="text-xs font-mono text-zinc-400">{run.duration}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-[10px] font-mono rounded-full border px-2 py-0.5 ${
                      run.status === "complete"
                        ? "text-green-400 bg-green-400/5 border-green-400/20"
                        : "text-red-400 bg-red-400/5 border-red-400/20"
                    }`}>
                      {run.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <p className="text-xs text-zinc-600">{run.date}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
