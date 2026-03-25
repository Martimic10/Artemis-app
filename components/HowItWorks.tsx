// No interactivity needed — server component

const pixelBg: React.CSSProperties = {
  backgroundColor: "#111111",
};

function StepBadge({ label }: { label: string }) {
  return (
    <div className="relative inline-flex items-center px-3 py-1.5">
      <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-white/30" />
      <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-white/30" />
      <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-white/30" />
      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-white/30" />
      <span className="text-xs font-mono text-zinc-500">{label}</span>
    </div>
  );
}

// ── Step graphics ────────────────────────────────────────────────────────────

function UploadGraphic() {
  return (
    <div className="w-full max-w-70 mx-auto flex flex-col gap-2 rounded-lg border border-white/10 bg-zinc-950/90 p-4 shadow-2xl">
      <p className="text-xs font-mono text-zinc-500 mb-1">Upload dataset</p>

      {/* Drop zone */}
      <div className="rounded-md border border-dashed border-cyan-400/30 bg-cyan-400/5 px-4 py-5 flex flex-col items-center gap-2">
        <div className="h-9 w-9 rounded-full border border-cyan-400/40 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 12V4M8 4L5 7M8 4L11 7" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="text-xs text-zinc-500 text-center">Drop files or click to browse</span>
        <div className="flex gap-1.5 mt-0.5">
          {["CSV", "BAG", "IMG", "JSON"].map((t) => (
            <span key={t} className="text-[10px] font-mono text-cyan-400/60 border border-cyan-400/20 px-1.5 py-0.5 rounded">{t}</span>
          ))}
        </div>
      </div>

      {/* File list */}
      {[
        { name: "gripper_data.csv", size: "2.4 MB", done: true },
        { name: "scan_2024.bag",    size: "18 MB",  done: true },
        { name: "cam_feed.zip",     size: "54 MB",  pct: 62   },
      ].map((f) => (
        <div key={f.name} className="flex items-center gap-2 rounded border border-white/8 bg-zinc-900 px-3 py-2">
          <div className="h-4 w-4 rounded border border-cyan-400/20 bg-cyan-400/5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-zinc-300 truncate">{f.name}</p>
            {"pct" in f && (
              <div className="mt-1 h-0.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400" style={{ width: `${f.pct}%` }} />
              </div>
            )}
          </div>
          <span className="text-xs text-zinc-600 shrink-0 font-mono">
            {"done" in f ? "✓" : `${f.pct}%`}
          </span>
        </div>
      ))}
    </div>
  );
}

function TrainGraphic() {
  return (
    <div className="w-full max-w-70 mx-auto flex flex-col gap-2.5 rounded-lg border border-white/10 bg-zinc-950/90 p-4 shadow-2xl">
      <div className="flex items-center justify-between">
        <p className="text-xs font-mono text-zinc-400">PickBot v3</p>
        <span className="text-xs font-mono text-cyan-400">Epoch 24 / 50</span>
      </div>

      <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
        <div className="h-full bg-cyan-400 rounded-full" style={{ width: "48%" }} />
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        {[
          { label: "Accuracy", value: "87.4%", trend: "↑", tc: "text-green-400" },
          { label: "Loss",     value: "0.12",  trend: "↓", tc: "text-cyan-400"  },
          { label: "ETA",      value: "4m 22s" },
          { label: "LR",       value: "0.0012" },
        ].map((m) => (
          <div key={m.label} className="rounded border border-white/8 bg-zinc-900 px-3 py-2">
            <p className="text-[10px] text-zinc-600">{m.label}</p>
            <p className="text-sm font-mono text-white mt-0.5 flex items-center gap-1">
              {m.value}
              {"trend" in m && <span className={`text-xs ${m.tc}`}>{m.trend}</span>}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded border border-white/8 bg-zinc-900 px-3 py-2.5">
        <p className="text-[10px] text-zinc-600 mb-2">Accuracy</p>
        <svg viewBox="0 0 220 36" fill="none" className="w-full">
          <path d="M0 34 C30 30 55 24 80 18 S130 10 155 8 S195 5 220 3"
            stroke="#22d3ee" strokeWidth="1.5" strokeOpacity="0.8" fill="none"/>
          <path d="M0 34 C30 30 55 24 80 18 S130 10 155 8 S195 5 220 3 L220 36 L0 36 Z"
            fill="#22d3ee" fillOpacity="0.06"/>
        </svg>
      </div>
    </div>
  );
}

function DeployGraphic() {
  const items = [
    { label: "Model packaged for ROS 2",  ok: true  },
    { label: "Nodes configured",          ok: true  },
    { label: "Robot fleet online (3/3)",  ok: true  },
    { label: "Running health checks",     ok: false },
    { label: "Deployed successfully",     ok: true  },
  ];

  return (
    <div className="w-full max-w-70 mx-auto flex flex-col gap-2 rounded-lg border border-white/10 bg-zinc-950/90 p-4 shadow-2xl">
      <div className="flex items-center gap-2 mb-1">
        <div className="h-2 w-2 rounded-full bg-zinc-700" />
        <div className="h-2 w-2 rounded-full bg-zinc-700" />
        <div className="h-2 w-2 rounded-full bg-zinc-700" />
        <span className="ml-1 text-[10px] font-mono text-zinc-600">kairo deploy --target fleet</span>
      </div>

      {items.map((s) => (
        <div key={s.label} className="flex items-center gap-2.5 rounded border border-white/8 bg-zinc-900 px-3 py-2">
          {s.ok ? (
            <div className="h-4 w-4 rounded-full border border-green-500/40 bg-green-500/10 flex items-center justify-center shrink-0">
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M1.5 4L3 5.5L6.5 2" stroke="#4ade80" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          ) : (
            <div className="h-4 w-4 rounded-full border border-yellow-500/40 bg-yellow-500/10 flex items-center justify-center shrink-0">
              <span className="text-yellow-400 text-[10px] leading-none font-bold">!</span>
            </div>
          )}
          <span className="text-xs text-zinc-400">{s.label}</span>
        </div>
      ))}

      <div className="mt-0.5 rounded border border-cyan-400/20 bg-cyan-400/5 px-3 py-2 flex items-center justify-between">
        <span className="text-xs text-cyan-400 font-mono">Live on 3 robots</span>
        <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
      </div>
    </div>
  );
}

// ── Steps data ────────────────────────────────────────────────────────────────

const steps = [
  {
    number: "Step 1",
    title: "Upload your data",
    description:
      "Drag in sensor logs, camera feeds, LIDAR bags, or any telemetry format. Artemis ingests it all — no preprocessing or labeling pipelines needed.",
    graphic: <UploadGraphic />,
  },
  {
    number: "Step 2",
    title: "Train your model",
    description:
      "Our automated ML pipeline picks the right architecture and trains a custom AI model on your data. No GPU setup, no hyperparameter tuning.",
    graphic: <TrainGraphic />,
  },
  {
    number: "Step 3",
    title: "Deploy to your robots",
    description:
      "Push to any ROS 2 compatible robot with one click. Artemis packages the model, configures nodes, and delivers it over the air automatically.",
    graphic: <DeployGraphic />,
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function HowItWorks() {
  return (
    <section className="border-t-2 border-white/20">
      {/* Section header */}
      <div className="px-5 py-10 sm:px-10 sm:py-14 border-b-2 border-white/20">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-0.5 h-4 bg-cyan-400" />
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">How it works</span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-normal text-white tracking-tight leading-[1.1]">
          From raw data to deployed robot
          <br />— in three steps.
        </h2>
      </div>

      <div className="flex flex-col sm:flex-row">
        {steps.map((step, i) => (
          <div
            key={step.number}
            className={`flex-1 flex flex-col ${i < steps.length - 1 ? "border-b-2 sm:border-b-0 sm:border-r-2 border-white/20" : ""}`}
          >
            {/* Graphic area */}
            <div
              className="relative h-72 sm:h-96 overflow-hidden border-b-2 border-white/20 flex items-center justify-center"
              style={pixelBg}
            >
              {/* Graphic card */}
              <div className="relative z-10 w-full px-6">
                {step.graphic}
              </div>
            </div>

            {/* Info */}
            <div className="px-5 pt-6 pb-8 sm:px-8 sm:pt-7 sm:pb-10 flex flex-col gap-3">
              <StepBadge label={step.number} />
              <h3 className="text-2xl font-normal text-white leading-snug mt-1">
                {step.title}
              </h3>
              <p className="text-base text-zinc-500 leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
