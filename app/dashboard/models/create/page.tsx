"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

// ── Detection preview (Step 3) ─────────────────────────────────────────────────
function DetectionPreview() {
  const detections = [
    { x: 72,  y: 105, w: 140, h: 95,  label: "Robotic Gripper", conf: 98.2 },
    { x: 295, y: 82,  w: 115, h: 130, label: "Target Object",   conf: 94.7 },
    { x: 450, y: 148, w: 105, h: 88,  label: "Obstacle",        conf: 89.1 },
    { x: 175, y: 222, w: 78,  h: 68,  label: "Ref Marker",      conf: 96.3 },
  ];

  function CornerBox({ x, y, w, h, label, conf, dim }: { x:number;y:number;w:number;h:number;label:string;conf:number;dim:number }) {
    const c = 14;
    const alpha = conf > 95 ? "255" : conf > 90 ? "200" : "150";
    const col = `rgba(255,255,255,${parseInt(alpha)/255})`;
    const labelW = label.length * 6.5 + 52;
    return (
      <g>
        {/* Corners */}
        <line x1={x} y1={y+c} x2={x} y2={y} stroke={col} strokeWidth="2"/>
        <line x1={x} y1={y} x2={x+c} y2={y} stroke={col} strokeWidth="2"/>
        <line x1={x+w-c} y1={y} x2={x+w} y2={y} stroke={col} strokeWidth="2"/>
        <line x1={x+w} y1={y} x2={x+w} y2={y+c} stroke={col} strokeWidth="2"/>
        <line x1={x+w} y1={y+h-c} x2={x+w} y2={y+h} stroke={col} strokeWidth="2"/>
        <line x1={x+w} y1={y+h} x2={x+w-c} y2={y+h} stroke={col} strokeWidth="2"/>
        <line x1={x+c} y1={y+h} x2={x} y2={y+h} stroke={col} strokeWidth="2"/>
        <line x1={x} y1={y+h} x2={x} y2={y+h-c} stroke={col} strokeWidth="2"/>
        {/* Subtle fill */}
        <rect x={x} y={y} width={w} height={h} fill={col} fillOpacity="0.03"/>
        {/* Label */}
        <rect x={x} y={y-20} width={labelW} height={18} fill="white" rx="2"/>
        <text x={x+5} y={y-7} fontSize="10" fill="black" fontWeight="600" fontFamily="monospace">
          {label}  {conf}%
        </text>
      </g>
    );
  }

  return (
    <div className="rounded-xl border border-[#222] overflow-hidden bg-[#080808]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#1e1e1e] bg-[#0e0e0e]">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] font-mono text-zinc-500">LIVE INFERENCE — /kairo/inference</span>
        </div>
        <span className="text-[10px] font-mono text-zinc-700">12 ms avg</span>
      </div>
      <svg viewBox="0 0 640 340" className="w-full">
        {/* Background — simulated workspace */}
        <rect width="640" height="340" fill="#080808"/>
        {/* Ambient floor grid */}
        {[0,1,2,3,4,5].map(i => (
          <line key={`h${i}`} x1="0" y1={200+i*28} x2="640" y2={200+i*28} stroke="#111" strokeWidth="1"/>
        ))}
        {[0,1,2,3,4,5,6,7,8].map(i => (
          <line key={`v${i}`} x1={i*80} y1="200" x2={i*80} y2="340" stroke="#111" strokeWidth="1"/>
        ))}
        {/* Conveyor surface */}
        <rect x="0" y="198" width="640" height="142" fill="#0d0d0d"/>
        {/* Objects silhouettes */}
        <ellipse cx="142" cy="175" rx="58" ry="28" fill="#161616"/>
        <rect x="295" y="92" width="115" height="120" rx="8" fill="#141414"/>
        <rect x="453" y="156" width="100" height="76" rx="6" fill="#131313"/>
        <ellipse cx="214" cy="256" rx="36" ry="28" fill="#151515"/>
        {/* Scanlines */}
        {[0,1,2,3,4,5].map(i => (
          <rect key={i} x="0" y={i*60} width="640" height="1" fill="white" fillOpacity="0.012"/>
        ))}
        {/* Detections */}
        {detections.map((d, i) => <CornerBox key={i} {...d} dim={0} />)}
        {/* HUD elements */}
        <text x="12" y="20" fontSize="9" fill="#333" fontFamily="monospace">RES 640×340 · FPS 30 · CONF 0.6</text>
        <text x="12" y="330" fontSize="9" fill="#333" fontFamily="monospace">mdl_new001 v1 · arm-model · ROS2/humble</text>
        <text x="555" y="330" fontSize="9" fill="#333" fontFamily="monospace">4 OBJECTS</text>
      </svg>
    </div>
  );
}

// ── Step indicators ─────────────────────────────────────────────────────────────
const STEPS = ["Upload Data", "Train", "Results", "Deploy"];

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all ${
            i === current ? "text-white" : i < current ? "text-zinc-400" : "text-zinc-700"
          }`}>
            <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-mono font-semibold shrink-0 transition-all ${
              i < current
                ? "bg-white text-black"
                : i === current
                ? "bg-white text-black"
                : "bg-[#1a1a1a] text-zinc-600 border border-[#2a2a2a]"
            }`}>
              {i < current ? (
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M1.5 4l2 2 3-3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : i + 1}
            </div>
            <span className="text-xs font-medium hidden sm:block">{label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`h-px w-6 sm:w-10 mx-1 transition-all ${i < current ? "bg-white/30" : "bg-[#1e1e1e]"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Training logs ───────────────────────────────────────────────────────────────
const LOG_LINES = [
  "[00:00] Initialising training environment...",
  "[00:02] Loading dataset: ds_new001 (12,480 samples)",
  "[00:14] Preprocessing: normalising sensor values...",
  "[00:27] Splitting: 80% train · 20% validation",
  "[00:31] Architecture: transformer_v2 (auto-selected)",
  "[00:32] Starting training — 20 epochs · batch_size=64",
  "[00:48] Epoch  1/20 | loss: 0.512 | val_loss: 0.498 | acc: 61.2%",
  "[01:05] Epoch  3/20 | loss: 0.341 | val_loss: 0.361 | acc: 73.4%",
  "[01:23] Epoch  5/20 | loss: 0.241 | val_loss: 0.259 | acc: 82.1%",
  "[01:42] Epoch  7/20 | loss: 0.189 | val_loss: 0.201 | acc: 87.3%",
  "[02:00] Epoch  9/20 | loss: 0.148 | val_loss: 0.162 | acc: 90.1%",
  "[02:18] Epoch 11/20 | loss: 0.121 | val_loss: 0.134 | acc: 91.8%",
  "[02:36] Epoch 13/20 | loss: 0.098 | val_loss: 0.112 | acc: 93.0%",
  "[02:54] Epoch 15/20 | loss: 0.084 | val_loss: 0.097 | acc: 93.7%",
  "[03:12] Epoch 17/20 | loss: 0.075 | val_loss: 0.089 | acc: 94.1%",
  "[03:30] Epoch 19/20 | loss: 0.072 | val_loss: 0.085 | acc: 94.2%",
  "[03:48] Epoch 20/20 | loss: 0.071 | val_loss: 0.083 | acc: 94.3%",
  "[03:50] Training complete! Best accuracy: 94.3%",
  "[03:55] Packaging model as ROS 2 node...",
  "[04:02] Model ready: mdl_new001 (v1) — 48 MB",
];

const DEPLOY_STEPS = [
  { label: "Connecting to robot agent",      delay: 600  },
  { label: "Verifying ROS 2 environment",    delay: 1200 },
  { label: "Uploading model weights (48 MB)", delay: 2200 },
  { label: "Starting inference node",        delay: 3100 },
  { label: "Deployment successful",          delay: 3900 },
];

// ── Main wizard ─────────────────────────────────────────────────────────────────
export default function CreateModelPage() {
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<{ name: string; size: string }[]>([]);
  const [dragging, setDragging] = useState(false);
  const [modelName, setModelName] = useState("arm-model-new");
  const [taskType, setTaskType] = useState("manipulation");
  const [trainingStarted, setTrainingStarted] = useState(false);
  const [logLines, setLogLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [deployStatus, setDeployStatus] = useState<number>(-1);
  const [deployed, setDeployed] = useState(false);
  const logsRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Simulate file drop
  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    setFiles([
      { name: "arm_demos_v3.bag",    size: "2.1 GB" },
      { name: "gripper_labels.csv",  size: "4.2 MB" },
    ]);
  }

  function addDemoFiles() {
    setFiles([
      { name: "arm_demos_v3.bag",    size: "2.1 GB" },
      { name: "gripper_labels.csv",  size: "4.2 MB" },
    ]);
  }

  // Training simulation
  const startTraining = useCallback(() => {
    if (timerRef.current) return; // prevent double-start (StrictMode)
    setTrainingStarted(true);
    let i = 0;
    let prog = 0;
    timerRef.current = setInterval(() => {
      const line = LOG_LINES[i];
      if (line !== undefined) {
        setLogLines((prev) => [...prev, line]);
        prog = Math.min(100, Math.round((i / (LOG_LINES.length - 1)) * 100));
        setProgress(prog);
        i++;
        if (logsRef.current) {
          logsRef.current.scrollTop = logsRef.current.scrollHeight;
        }
      } else {
        clearInterval(timerRef.current!);
        timerRef.current = null;
        setTimeout(() => setStep(2), 800);
      }
    }, 260);
  }, []);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  // Deploy simulation
  function startDeploy() {
    DEPLOY_STEPS.forEach((s, i) => {
      setTimeout(() => {
        setDeployStatus(i);
        if (i === DEPLOY_STEPS.length - 1) setDeployed(true);
      }, s.delay);
    });
  }

  return (
    <div className="px-6 py-8 sm:px-10 sm:py-10 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/dashboard/models" className="text-zinc-600 hover:text-white transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-medium text-white">Create Model</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Train and deploy an AI model to your robot fleet</p>
        </div>
      </div>

      <StepBar current={step} />

      {/* ── Step 1: Upload Data ────────────────────────────────────────────────── */}
      {step === 0 && (
        <div className="space-y-6">
          {/* Model config */}
          <div className="rounded-xl border border-[#222] bg-[#111] p-6">
            <h2 className="text-sm font-medium text-white mb-4">Model Configuration</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-zinc-500 mb-1.5 block">Model Name</label>
                <input
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#161616] px-3 py-2.5 text-sm text-white placeholder:text-zinc-700 outline-none focus:border-white/30 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500 mb-1.5 block">Task Type</label>
                <select
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value)}
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#161616] px-3 py-2.5 text-sm text-white outline-none focus:border-white/30 transition-colors"
                >
                  <option value="manipulation">manipulation</option>
                  <option value="navigation">navigation</option>
                  <option value="object_detection">object_detection</option>
                  <option value="anomaly_detection">anomaly_detection</option>
                  <option value="classification">classification</option>
                </select>
              </div>
            </div>
          </div>

          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            className={`rounded-xl border-2 border-dashed transition-all p-10 flex flex-col items-center justify-center gap-3 cursor-pointer ${
              dragging
                ? "border-white/40 bg-white/4"
                : "border-[#2a2a2a] hover:border-white/20 hover:bg-white/2"
            }`}
            onClick={addDemoFiles}
          >
            <div className="h-12 w-12 rounded-xl border border-[#2a2a2a] bg-[#161616] flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="text-zinc-500">
                <path d="M11 2v12M7 6l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 15v3a2 2 0 002 2h12a2 2 0 002-2v-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-white">Drop files here or click to select</p>
              <p className="text-xs text-zinc-600 mt-1">.bag · .csv · .zip · .pcd · .h5 — up to 100 GB</p>
            </div>
          </div>

          {/* File list */}
          {files.length > 0 && (
            <div className="rounded-xl border border-[#222] bg-[#111] overflow-hidden">
              <div className="px-5 py-3 border-b border-[#1e1e1e]">
                <p className="text-xs font-medium text-zinc-400">{files.length} file{files.length !== 1 ? "s" : ""} selected</p>
              </div>
              {files.map((f) => (
                <div key={f.name} className="flex items-center gap-3 px-5 py-3.5 border-b border-[#1a1a1a] last:border-b-0">
                  <div className="h-8 w-8 rounded-lg border border-[#2a2a2a] bg-[#161616] flex items-center justify-center shrink-0">
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="text-zinc-600">
                      <rect x="1" y="1" width="10" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M3 5h6M3 8h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">{f.name}</p>
                    <p className="text-[10px] text-zinc-600 mt-0.5">{f.size}</p>
                  </div>
                  <button onClick={() => setFiles(files.filter(x => x.name !== f.name))} className="text-zinc-700 hover:text-white transition-colors">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={() => setStep(1)}
              disabled={files.length === 0}
              className="rounded-lg bg-white text-black px-5 py-2.5 text-sm font-medium hover:bg-zinc-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Continue to Training →
            </button>
          </div>
        </div>
      )}

      {/* ── Step 2: Training ───────────────────────────────────────────────────── */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="rounded-xl border border-[#222] bg-[#111] p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-sm font-medium text-white">
                  {trainingStarted ? "Training in progress" : "Ready to train"}
                </h2>
                <p className="text-xs text-zinc-500 mt-1">
                  {trainingStarted
                    ? `${progress}% complete · ${modelName} · ${taskType}`
                    : `${modelName} · ${taskType} · auto architecture`}
                </p>
              </div>
              {!trainingStarted && (
                <button
                  onClick={startTraining}
                  className="rounded-lg bg-white text-black px-4 py-2 text-sm font-medium hover:bg-zinc-200 transition-colors"
                >
                  Start Training
                </button>
              )}
            </div>

            {/* Progress bar */}
            <div className="h-1.5 w-full rounded-full bg-[#222] overflow-hidden mb-2">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%`, background: progress === 100 ? "#22c55e" : "linear-gradient(90deg, #22d3ee, #06b6d4)" }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-zinc-600">
                {trainingStarted ? (progress === 100 ? "Training complete" : "Training…") : "Waiting to start"}
              </span>
              <span className="text-[10px] font-mono text-zinc-600">{progress}%</span>
            </div>
          </div>

          {/* Logs */}
          <div className="rounded-xl border border-[#222] bg-[#0a0a0a] overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#1e1e1e] bg-[#0e0e0e]">
              <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${trainingStarted && progress < 100 ? "bg-cyan-400 animate-pulse" : progress === 100 ? "bg-green-400" : "bg-zinc-700"}`} />
              <span className="text-[10px] font-mono text-zinc-500">TRAINING LOG</span>
            </div>
            <div ref={logsRef} className="h-64 overflow-y-auto px-4 py-3 font-mono text-[11px] leading-relaxed space-y-0.5">
              {logLines.length === 0 ? (
                <p className="text-zinc-700">Waiting for training to start…</p>
              ) : (
                logLines.filter(Boolean).map((line, i) => (
                  <p key={i} className={
                    line.includes("complete") || line.includes("ready")
                      ? "text-green-400"
                      : line.includes("Epoch")
                      ? "text-zinc-300"
                      : "text-zinc-600"
                  }>
                    {line}
                  </p>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Step 3: Results ────────────────────────────────────────────────────── */}
      {step === 2 && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Accuracy",   value: "94.3%",  sub: "val: 93.1%" },
              { label: "Final Loss", value: "0.071",  sub: "val: 0.083" },
              { label: "Epochs",     value: "20",     sub: "no early stop" },
              { label: "Latency p99",value: "28 ms",  sub: "on-device est." },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-[#222] bg-[#111] p-4">
                <p className="text-xl font-semibold text-white">{s.value}</p>
                <p className="text-xs text-zinc-500 mt-1">{s.label}</p>
                <p className="text-[10px] text-zinc-700 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Detection preview */}
          <DetectionPreview />

          {/* Object list */}
          <div className="rounded-xl border border-[#222] bg-[#111] overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#1e1e1e]">
              <p className="text-xs font-medium text-white">Detected Objects — Live Frame</p>
            </div>
            <div className="divide-y divide-[#1a1a1a]">
              {[
                { label: "Robotic Gripper", conf: 98.2 },
                { label: "Ref Marker",      conf: 96.3 },
                { label: "Target Object",   conf: 94.7 },
                { label: "Obstacle",        conf: 89.1 },
              ].map((obj) => (
                <div key={obj.label} className="flex items-center gap-4 px-5 py-3">
                  <p className="text-sm text-white w-36 shrink-0">{obj.label}</p>
                  <div className="flex-1 h-1.5 rounded-full bg-[#222] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-white"
                      style={{ width: `${obj.conf}%`, opacity: obj.conf / 100 }}
                    />
                  </div>
                  <p className="text-sm font-mono text-white w-14 text-right shrink-0">{obj.conf}%</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setStep(3)}
              className="rounded-lg bg-white text-black px-5 py-2.5 text-sm font-medium hover:bg-zinc-200 transition-colors"
            >
              Proceed to Deploy →
            </button>
          </div>
        </div>
      )}

      {/* ── Step 4: Deploy ─────────────────────────────────────────────────────── */}
      {step === 3 && (
        <div className="space-y-6">
          {/* Target selection */}
          <div className="rounded-xl border border-[#222] bg-[#111] p-6">
            <h2 className="text-sm font-medium text-white mb-4">Deployment Target</h2>
            <div className="space-y-2">
              {[
                { id: "rob_a1b2c3d4", name: "my-arm-01",       type: "manipulator", status: "online" },
                { id: "rob_b2c3d4e5", name: "gripper-unit-02", type: "manipulator", status: "online" },
                { id: "rob_c3d4e5f6", name: "my-arm-backup",   type: "manipulator", status: "offline" },
              ].map((robot, i) => (
                <label key={robot.id} className={`flex items-center gap-4 rounded-lg border px-4 py-3.5 cursor-pointer transition-all ${
                  i === 0
                    ? "border-white/30 bg-white/4"
                    : robot.status === "offline"
                    ? "border-[#1e1e1e] opacity-40 cursor-not-allowed"
                    : "border-[#222] hover:border-white/20"
                }`}>
                  <input type="radio" name="robot" defaultChecked={i === 0} disabled={robot.status === "offline"} className="accent-white" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{robot.name}</p>
                    <p className="text-xs text-zinc-600 font-mono mt-0.5">{robot.id} · {robot.type}</p>
                  </div>
                  <span className={`text-[10px] font-mono flex items-center gap-1.5 ${robot.status === "online" ? "text-green-400" : "text-zinc-600"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${robot.status === "online" ? "bg-green-400" : "bg-zinc-700"}`} />
                    {robot.status}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Deploy button & status */}
          {deployStatus === -1 ? (
            <button
              onClick={startDeploy}
              className="w-full rounded-xl border border-white/20 bg-white text-black py-3.5 text-sm font-semibold hover:bg-zinc-200 transition-colors"
            >
              Deploy to Robot
            </button>
          ) : (
            <div className="rounded-xl border border-[#222] bg-[#111] p-6 space-y-4">
              <h2 className="text-sm font-medium text-white mb-2">
                {deployed ? "Deployment Complete" : "Deploying…"}
              </h2>
              {DEPLOY_STEPS.map((s, i) => (
                <div key={s.label} className={`flex items-center gap-3 transition-all ${i > deployStatus ? "opacity-25" : ""}`}>
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
                    i < deployStatus
                      ? "bg-green-400"
                      : i === deployStatus && !deployed
                      ? "border border-white/20 bg-transparent"
                      : i === deployStatus && deployed
                      ? "bg-green-400"
                      : "border border-[#2a2a2a] bg-transparent"
                  }`}>
                    {(i < deployStatus || (i === deployStatus && deployed)) ? (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2.5 2.5L8 2.5" stroke="black" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : i === deployStatus ? (
                      <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                    ) : null}
                  </div>
                  <p className={`text-sm transition-colors ${i <= deployStatus ? "text-white" : "text-zinc-700"}`}>
                    {s.label}
                  </p>
                </div>
              ))}

              {deployed && (
                <div className="mt-4 pt-4 border-t border-[#1e1e1e] space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-[#222] bg-[#0a0a0a] px-4 py-3">
                      <p className="text-[10px] text-zinc-600 font-mono mb-1">ROS 2 STATUS</p>
                      <p className="text-xs text-green-400 font-mono flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-400" />Connected to humble
                      </p>
                    </div>
                    <div className="rounded-lg border border-[#222] bg-[#0a0a0a] px-4 py-3">
                      <p className="text-[10px] text-zinc-600 font-mono mb-1">INFERENCE TOPIC</p>
                      <p className="text-xs text-zinc-300 font-mono">/kairo/inference</p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    className="flex items-center justify-center gap-2 w-full rounded-lg border border-white/20 bg-white text-black py-2.5 text-sm font-medium hover:bg-zinc-200 transition-colors"
                  >
                    Go to Dashboard →
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
