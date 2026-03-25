import Link from "next/link";

const deployments = [
  { id: "dep_abc789", model: "arm-model-v2",   version: "v2", robot: "my-arm-01",        type: "manipulator",     status: "active",   latency: 11,  uptime: "3d 4h",  deployed: "3 days ago" },
  { id: "dep_bcd890", model: "arm-model-v2",   version: "v2", robot: "gripper-unit-02",  type: "manipulator",     status: "active",   latency: 13,  uptime: "3d 4h",  deployed: "3 days ago" },
  { id: "dep_cde901", model: "sort-alpha-v1",  version: "v1", robot: "sortbot-03",       type: "object_detection",status: "active",   latency: 24,  uptime: "10d 1h", deployed: "10 days ago" },
  { id: "dep_def012", model: "patrol-nav-v2",  version: "v2", robot: "patrol-bot-05",    type: "navigation",      status: "active",   latency: 15,  uptime: "8d 12h", deployed: "8 days ago" },
  { id: "dep_efg123", model: "gripper-v1",     version: "v1", robot: "gripper-unit-01",  type: "manipulator",     status: "active",   latency: 31,  uptime: "2d 6h",  deployed: "2 days ago" },
  { id: "dep_fgh234", model: "nav-model-v3",   version: "v3", robot: "warehouse-bot-02", type: "navigation",      status: "inactive", latency: 0,   uptime: "—",      deployed: "2 weeks ago" },
];

const statusStyle: Record<string, string> = {
  active:   "text-green-400 bg-green-400/5 border-green-400/20",
  inactive: "text-zinc-500 bg-zinc-500/5 border-zinc-500/20",
  error:    "text-red-400 bg-red-400/5 border-red-400/20",
};

export default function DeploymentsPage() {
  const active = deployments.filter(d => d.status === "active").length;

  return (
    <div className="px-6 py-8 sm:px-10 sm:py-10 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-medium text-white">Deployments</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{active} active · {deployments.length} total</p>
        </div>
        <Link
          href="/dashboard/models/create"
          className="flex items-center gap-2 rounded-lg bg-white text-black px-4 py-2 text-sm font-medium hover:bg-zinc-200 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          New Deployment
        </Link>
      </div>

      {/* Fleet health */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: "Active",   value: active,                                       color: "text-green-400" },
          { label: "Inactive", value: deployments.filter(d=>d.status==="inactive").length, color: "text-zinc-500" },
          { label: "Avg Latency", value: `${Math.round(deployments.filter(d=>d.latency>0).reduce((s,d)=>s+d.latency,0)/active)} ms`, color: "text-white" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-[#222] bg-[#111] p-4">
            <p className={`text-2xl font-semibold tracking-tight ${s.color}`}>{s.value}</p>
            <p className="text-xs text-zinc-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#222] bg-[#111] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1e1e1e]">
              <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-500">Robot</th>
              <th className="text-left px-4 py-3.5 text-xs font-medium text-zinc-500 hidden sm:table-cell">Model</th>
              <th className="text-left px-4 py-3.5 text-xs font-medium text-zinc-500">Status</th>
              <th className="text-left px-4 py-3.5 text-xs font-medium text-zinc-500 hidden lg:table-cell">Latency</th>
              <th className="text-left px-4 py-3.5 text-xs font-medium text-zinc-500 hidden md:table-cell">Uptime</th>
              <th className="text-left px-4 py-3.5 text-xs font-medium text-zinc-500 hidden md:table-cell">Deployed</th>
              <th className="px-4 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1a1a]">
            {deployments.map((dep) => (
              <tr key={dep.id} className="hover:bg-white/2 transition-colors group">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full shrink-0 ${dep.status === "active" ? "bg-green-400" : "bg-zinc-700"}`} />
                    <div>
                      <p className="text-sm font-medium text-white">{dep.robot}</p>
                      <p className="text-[10px] text-zinc-600 font-mono mt-0.5">{dep.type}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 hidden sm:table-cell">
                  <p className="text-xs text-zinc-300 font-medium">{dep.model}</p>
                  <p className="text-[10px] text-zinc-600 font-mono mt-0.5">{dep.version}</p>
                </td>
                <td className="px-4 py-4">
                  <span className={`text-[10px] font-mono rounded-full border px-2 py-0.5 ${statusStyle[dep.status]}`}>
                    {dep.status}
                  </span>
                </td>
                <td className="px-4 py-4 hidden lg:table-cell">
                  <p className="text-sm font-mono text-white">{dep.latency > 0 ? `${dep.latency} ms` : "—"}</p>
                </td>
                <td className="px-4 py-4 hidden md:table-cell">
                  <p className="text-xs font-mono text-zinc-400">{dep.uptime}</p>
                </td>
                <td className="px-4 py-4 hidden md:table-cell">
                  <p className="text-xs text-zinc-600">{dep.deployed}</p>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="rounded-md border border-[#2a2a2a] bg-[#161616] px-2.5 py-1 text-[10px] text-zinc-400 hover:text-white hover:border-white/20 transition-colors">
                      Rollback
                    </button>
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
