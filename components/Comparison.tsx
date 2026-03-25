function CheckIcon() {
  return (
    <div className="mx-auto h-7 w-7 rounded-full border border-white/15 bg-white/5 flex items-center justify-center">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2 6L4.5 8.5L10 3" stroke="#a1a1aa" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

function XIcon() {
  return (
    <div className="mx-auto h-7 w-7 rounded-full border border-red-500/20 bg-red-500/10 flex items-center justify-center">
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M2 2L8 8M8 2L2 8" stroke="#f87171" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

type Cell =
  | { type: "check" }
  | { type: "x" }
  | { type: "text"; value: string; muted?: boolean };

const rows: { feature: string; other: Cell; kairo: Cell }[] = [
  {
    feature: "Setup time",
    other: { type: "text", value: "Days / weeks",  muted: true },
    kairo:  { type: "text", value: "Minutes" },
  },
  {
    feature: "ML expertise required",
    other: { type: "text", value: "Required",      muted: true },
    kairo:  { type: "text", value: "Not needed" },
  },
  {
    feature: "ROS 2 integration",
    other: { type: "x" },
    kairo:  { type: "check" },
  },
  {
    feature: "Model training",
    other: { type: "text", value: "Custom scripts", muted: true },
    kairo:  { type: "text", value: "Automated" },
  },
  {
    feature: "Simulation & testing",
    other: { type: "x" },
    kairo:  { type: "check" },
  },
  {
    feature: "Over-the-air deployment",
    other: { type: "x" },
    kairo:  { type: "check" },
  },
  {
    feature: "Data preprocessing",
    other: { type: "text", value: "Manual",        muted: true },
    kairo:  { type: "text", value: "Automatic" },
  },
  {
    feature: "Multi-robot support",
    other: { type: "text", value: "Limited",       muted: true },
    kairo:  { type: "text", value: "Unlimited" },
  },
  {
    feature: "Model monitoring",
    other: { type: "x" },
    kairo:  { type: "check" },
  },
  {
    feature: "No-code interface",
    other: { type: "x" },
    kairo:  { type: "check" },
  },
];

function Cell({ cell }: { cell: Cell }) {
  if (cell.type === "check") return <CheckIcon />;
  if (cell.type === "x")     return <XIcon />;
  return (
    <span className={`text-sm ${cell.muted ? "text-zinc-600" : "text-white"}`}>
      {cell.value}
    </span>
  );
}

export default function Comparison() {
  return (
    <section className="border-t-2 border-white/20">
      {/* Header */}
      <div className="px-5 py-10 sm:px-10 sm:py-14 border-b-2 border-white/20 text-center">
        <div className="flex items-center justify-center gap-2.5 mb-5">
          <div className="w-0.5 h-4 bg-cyan-400" />
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
            Comparison
          </span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-normal text-white tracking-tight leading-[1.1]">
          Why robotics teams
          <br />choose Artemis
        </h2>
      </div>

      {/* Table */}
      <div className="px-4 py-10 sm:px-10 sm:py-14">
        <div className="max-w-2xl mx-auto border-2 border-white/20 rounded-sm overflow-x-auto">
          {/* Column headers */}
          <div className="grid grid-cols-[1fr_1fr_1fr] border-b-2 border-white/20">
            <div className="px-7 py-5" />
            <div className="px-7 py-5 border-l-2 border-white/20 text-center">
              <span className="text-base text-zinc-500">Other tools</span>
            </div>
            <div className="px-7 py-5 border-l-2 border-white/20 bg-white/3 text-center flex items-center justify-center gap-2.5">
              <div className="h-4 w-4 rounded-sm bg-cyan-400 shrink-0" />
              <span className="text-base text-white">Artemis</span>
            </div>
          </div>

          {/* Rows */}
          {rows.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-[1fr_1fr_1fr] ${i < rows.length - 1 ? "border-b border-white/10" : ""}`}
            >
              <div className="px-7 py-5 flex items-center">
                <span className="text-sm text-zinc-300">{row.feature}</span>
              </div>
              <div className="px-7 py-5 border-l-2 border-white/20 flex items-center justify-center">
                <Cell cell={row.other} />
              </div>
              <div className="px-7 py-5 border-l-2 border-white/20 bg-white/3 flex items-center justify-center">
                <Cell cell={row.kairo} />
              </div>
            </div>
          ))}

          {/* CTA row */}
          <div className="border-t-2 border-white/20 px-5 py-5 sm:px-7 sm:py-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-0 justify-between">
            <div>
              <p className="text-base text-white font-normal">Ready to simplify your robotics workflow?</p>
              <p className="text-sm text-zinc-500 mt-1">Get started in minutes — no ML or robotics experience needed.</p>
            </div>
            <a
              href="#"
              className="shrink-0 rounded-full bg-cyan-400 px-6 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-90"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
