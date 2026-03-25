"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

type SimState = "idle" | "running" | "paused";

interface SceneObject {
  id: number; label: string; confidence: number;
  x: number; y: number; w: number; h: number;
  cls: string;
}

interface Rule { id: number; condition: string; action: string; }

// ── Constants ─────────────────────────────────────────────────────────────────

const CLS_COLOR: Record<string, string> = {
  object:    "#22d3ee",
  person:    "#f87171",
  vehicle:   "#fbbf24",
  furniture: "#a78bfa",
  nature:    "#4ade80",
};

const MODELS = [
  { id: "od-v2",   name: "Object Detection v2", type: "Detection",    accuracy: "94.2%" },
  { id: "nav-v1",  name: "Navigation v1",        type: "Navigation",   accuracy: "89.7%" },
  { id: "grip-v1", name: "Grip Controller",       type: "Manipulation", accuracy: "91.5%" },
];

const SCENES: Record<string, SceneObject[]> = {
  Warehouse: [
    { id: 1, label: "Box",      confidence: 94, x: 12, y: 28, w: 16, h: 22, cls: "object"  },
    { id: 2, label: "Pallet",   confidence: 87, x: 54, y: 52, w: 24, h: 16, cls: "object"  },
    { id: 3, label: "Forklift", confidence: 76, x: 70, y: 15, w: 22, h: 40, cls: "vehicle" },
    { id: 4, label: "Person",   confidence: 91, x: 36, y: 10, w: 10, h: 32, cls: "person"  },
    { id: 5, label: "Bottle",   confidence: 82, x: 26, y: 60, w:  6, h: 16, cls: "object"  },
  ],
  Kitchen: [
    { id: 1, label: "Bottle", confidence: 92, x: 18, y: 38, w:  8, h: 22, cls: "object" },
    { id: 2, label: "Cup",    confidence: 88, x: 55, y: 42, w: 10, h: 16, cls: "object" },
    { id: 3, label: "Person", confidence: 95, x: 66, y:  8, w: 14, h: 40, cls: "person" },
    { id: 4, label: "Plate",  confidence: 79, x: 38, y: 60, w: 18, h: 10, cls: "object" },
  ],
  Office: [
    { id: 1, label: "Laptop", confidence: 96, x: 28, y: 44, w: 22, h: 15, cls: "object"    },
    { id: 2, label: "Chair",  confidence: 83, x: 62, y: 28, w: 18, h: 38, cls: "furniture" },
    { id: 3, label: "Person", confidence: 89, x: 14, y:  6, w: 12, h: 34, cls: "person"    },
    { id: 4, label: "Phone",  confidence: 91, x: 48, y: 56, w:  8, h: 12, cls: "object"    },
  ],
  Outdoor: [
    { id: 1, label: "Car",    confidence: 93, x: 44, y: 32, w: 28, h: 22, cls: "vehicle" },
    { id: 2, label: "Person", confidence: 88, x: 18, y: 18, w: 10, h: 32, cls: "person"  },
    { id: 3, label: "Cone",   confidence: 85, x: 66, y: 52, w:  8, h: 16, cls: "object"  },
    { id: 4, label: "Tree",   confidence: 77, x:  6, y:  4, w: 16, h: 48, cls: "nature"  },
  ],
};

const SCENE_BG: Record<string, string> = {
  Warehouse: "radial-gradient(ellipse at 50% 30%, #161610 0%, #0e0e0a 55%, #080808 100%)",
  Kitchen:   "radial-gradient(ellipse at 50% 30%, #14141a 0%, #0e0e12 55%, #080808 100%)",
  Office:    "radial-gradient(ellipse at 50% 30%, #111118 0%, #0c0c14 55%, #080808 100%)",
  Outdoor:   "radial-gradient(ellipse at 40% 25%, #0e1318 0%, #0a0e12 55%, #080808 100%)",
};

const CONDITIONS = [
  "Bottle detected", "Cup detected", "Person detected",
  "Box detected", "Car detected", "Any object detected",
];
const ACTIONS = ["Move toward", "Pick up", "Avoid", "Track", "Stop", "Report position"];

const STATUS_STEPS = [
  "Initializing sensors...",
  "Scanning environment...",
  "Analyzing frame...",
  "Object detected",
  "Target acquired",
  "Calculating path...",
  "Moving toward object",
  "Approach confirmed",
  "Awaiting next command...",
];

const ROBOT_POS: [number, number] = [50, 83];

// ── Helpers ───────────────────────────────────────────────────────────────────

function findTarget(objects: SceneObject[], rules: Rule[]): SceneObject | null {
  for (const rule of rules) {
    const label = rule.condition.split(" ")[0];
    if (label === "Any") return objects[0];
    const match = objects.find(o => o.label.toLowerCase() === label.toLowerCase());
    if (match) return match;
  }
  return objects[0] ?? null;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PlaygroundPage() {
  const [simState, setSimState]   = useState<SimState>("idle");
  const [scene, setScene]         = useState("Warehouse");
  const [modelId, setModelId]     = useState("od-v2");
  const [rules, setRules]         = useState<Rule[]>([
    { id: 1, condition: "Bottle detected", action: "Move toward" },
  ]);
  const [statusIdx, setStatusIdx] = useState(0);
  const [scanY, setScanY]         = useState(0);
  const [tick, setTick]           = useState(0);
  const [log, setLog]             = useState<string[]>([]);

  const statusRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tickRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const scanRef   = useRef<ReturnType<typeof setInterval> | null>(null);

  const objects   = SCENES[scene];
  const model     = MODELS.find(m => m.id === modelId)!;
  const isRunning = simState === "running";
  const isActive  = simState !== "idle";
  const target    = isActive ? findTarget(objects, rules) : null;

  const clearAll = useCallback(() => {
    [statusRef, tickRef, scanRef].forEach(r => {
      if (r.current) { clearInterval(r.current); r.current = null; }
    });
  }, []);

  const startSim = useCallback(() => {
    if (statusRef.current) return;
    setSimState("running");
    setStatusIdx(0);
    setScanY(0);
    setLog([]);

    statusRef.current = setInterval(() =>
      setStatusIdx(p => (p + 1) % STATUS_STEPS.length), 1800);
    tickRef.current = setInterval(() => setTick(t => t + 1), 100);
    scanRef.current = setInterval(() =>
      setScanY(y => (y >= 100 ? 0 : y + 1.5)), 40);
  }, []);

  const pauseSim = useCallback(() => {
    setSimState("paused");
    clearAll();
  }, [clearAll]);

  const resetSim = useCallback(() => {
    clearAll();
    setSimState("idle");
    setStatusIdx(0);
    setScanY(0);
    setTick(0);
    setLog([]);
  }, [clearAll]);

  useEffect(() => () => clearAll(), [clearAll]);

  useEffect(() => {
    if (isRunning && tick % 15 === 0 && tick > 0) {
      const obj = objects[Math.floor(Math.random() * objects.length)];
      const t = new Date().toLocaleTimeString("en-US", { hour12: false });
      setLog(prev => [`${t}  ${obj.label}  ${obj.confidence}%`, ...prev].slice(0, 7));
    }
  }, [tick, isRunning, objects]);

  function addRule() {
    setRules(p => [...p, { id: Date.now(), condition: CONDITIONS[0], action: ACTIONS[0] }]);
  }
  function updateRule(id: number, field: "condition" | "action", value: string) {
    setRules(p => p.map(r => r.id === id ? { ...r, [field]: value } : r));
  }
  function removeRule(id: number) {
    setRules(p => p.filter(r => r.id !== id));
  }

  const targetCx = target ? target.x + target.w / 2 : null;
  const targetCy = target ? target.y + target.h / 2 : null;

  return (
    <div className="flex h-screen overflow-hidden bg-[#080808]">
      <style>{`
        @keyframes pg-fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes pg-pulse-target {
          0%,100% { box-shadow: 0 0 8px rgba(34,211,238,.45),  inset 0 0 8px rgba(34,211,238,.06); }
          50%      { box-shadow: 0 0 22px rgba(34,211,238,.85), inset 0 0 14px rgba(34,211,238,.10); }
        }
        @keyframes pg-ping-slow {
          0%   { transform: scale(1);   opacity: .6; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        .pg-fade-in       { animation: pg-fade-in .25s ease-out forwards; }
        .pg-pulse-target  { animation: pg-pulse-target 1.3s ease-in-out infinite; }
        .pg-ping-slow     { animation: pg-ping-slow 1.6s ease-out infinite; }
        .pg-ping-slow-2   { animation: pg-ping-slow 1.6s ease-out infinite .5s; }
      `}</style>

      {/* ── Left Panel ───────────────────────────────────────────────────── */}
      <aside className="w-64 shrink-0 border-r border-[#1a1a1a] flex flex-col overflow-y-auto">

        {/* Header */}
        <div className="px-4 py-4 border-b border-[#1a1a1a] shrink-0">
          <div className="flex items-center gap-2 mb-0.5">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-cyan-400">
              <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
              <circle cx="7" cy="7" r="2"   fill="currentColor"/>
              <path d="M7 1.5v1M7 11.5v1M1.5 7h1M11.5 7h1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <p className="text-sm font-medium text-white">Playground</p>
          </div>
          <p className="text-[10px] text-zinc-600">Robot vision simulator</p>
        </div>

        {/* Models */}
        <div className="border-b border-[#1a1a1a]">
          <p className="px-4 pt-3 pb-2 text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Models</p>
          <div className="px-2 pb-2 space-y-0.5">
            {MODELS.map(m => (
              <button key={m.id} onClick={() => setModelId(m.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-all ${
                  modelId === m.id ? "bg-white/8 text-white" : "text-zinc-500 hover:text-white hover:bg-white/4"
                }`}
              >
                <div className="text-left">
                  <p className={`text-xs font-medium ${modelId === m.id ? "text-white" : "text-zinc-400"}`}>{m.name}</p>
                  <p className="text-[10px] text-zinc-700 mt-0.5">{m.type}</p>
                </div>
                <span className={`text-[10px] font-mono ${modelId === m.id ? "text-cyan-400" : "text-zinc-700"}`}>{m.accuracy}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Scenes */}
        <div className="border-b border-[#1a1a1a]">
          <p className="px-4 pt-3 pb-2 text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Scenes</p>
          <div className="px-2 pb-3 grid grid-cols-2 gap-1.5">
            {Object.keys(SCENES).map(s => (
              <button key={s} onClick={() => { setScene(s); resetSim(); }}
                className={`rounded-lg py-2.5 text-xs font-medium transition-all ${
                  scene === s
                    ? "bg-cyan-400/10 border border-cyan-400/30 text-cyan-400"
                    : "border border-[#222] text-zinc-500 hover:text-white hover:border-white/20"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Logic Builder */}
        <div className="border-b border-[#1a1a1a]">
          <div className="flex items-center justify-between px-4 pt-3 pb-2">
            <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Logic Builder</p>
            <button onClick={addRule}
              className="text-[10px] text-cyan-400 hover:text-white transition-colors flex items-center gap-1"
            >
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M4 1v6M1 4h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              Add
            </button>
          </div>
          <div className="px-2 pb-3 space-y-2">
            {rules.map(rule => (
              <div key={rule.id} className="rounded-lg border border-[#1e1e1e] bg-[#0c0c0c] p-2.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-zinc-700 uppercase tracking-wider">Rule</span>
                  {rules.length > 1 && (
                    <button onClick={() => removeRule(rule.id)}
                      className="text-zinc-700 hover:text-red-400 transition-colors leading-none text-sm"
                    >×</button>
                  )}
                </div>
                <div className="space-y-1.5">
                  <div>
                    <p className="text-[9px] text-zinc-700 mb-1 font-mono">IF</p>
                    <select value={rule.condition}
                      onChange={e => updateRule(rule.id, "condition", e.target.value)}
                      className="w-full rounded-md bg-[#141414] border border-[#252525] text-[11px] text-zinc-300 px-2 py-1.5 outline-none focus:border-white/20"
                    >
                      {CONDITIONS.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <p className="text-[9px] text-zinc-700 mb-1 font-mono">THEN</p>
                    <select value={rule.action}
                      onChange={e => updateRule(rule.id, "action", e.target.value)}
                      className="w-full rounded-md bg-[#141414] border border-[#252525] text-[11px] text-zinc-300 px-2 py-1.5 outline-none focus:border-white/20"
                    >
                      {ACTIONS.map(a => <option key={a}>{a}</option>)}
                    </select>
                  </div>
                </div>
                {/* Rule summary pill */}
                <div className="flex items-center gap-1 pt-0.5">
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-400/8 border border-cyan-400/15 text-cyan-400/70">
                    {rule.condition.split(" ")[0]}
                  </span>
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="text-zinc-700">
                    <path d="M1 4h6M5 2l2 2-2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/4 border border-white/8 text-zinc-500">
                    {rule.action}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detection Log */}
        <div className="flex-1 flex flex-col min-h-0">
          <p className="px-4 pt-3 pb-2 text-[9px] font-mono text-zinc-600 uppercase tracking-widest shrink-0">Detection Log</p>
          <div className="px-3 pb-3 flex-1 overflow-y-auto space-y-1">
            {log.length === 0 ? (
              <p className="text-[10px] text-zinc-800 font-mono">No detections yet...</p>
            ) : log.map((entry, i) => (
              <p key={i} className={`text-[10px] font-mono leading-relaxed ${i === 0 ? "text-zinc-400" : "text-zinc-700"}`}>
                {entry}
              </p>
            ))}
          </div>
        </div>
      </aside>

      {/* ── Main Area ────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <div className="shrink-0 h-11 border-b border-[#1a1a1a] flex items-center justify-between px-5">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-medium text-zinc-400">{scene}</span>
            <span className="text-zinc-800 text-xs">·</span>
            <span className="text-xs text-zinc-600">{model.name}</span>
            <span className="text-zinc-800 text-xs">·</span>
            <span className="text-[10px] font-mono text-zinc-700">{objects.length} objects</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-zinc-700">CONF: 0.75</span>
            <span className="text-[10px] font-mono text-zinc-700">30 fps</span>
            <div className="flex items-center gap-1.5">
              <div className={`h-1.5 w-1.5 rounded-full transition-colors ${
                isRunning ? "bg-red-500 animate-pulse" : simState === "paused" ? "bg-amber-500" : "bg-zinc-700"
              }`} />
              <span className={`text-[10px] font-mono ${
                isRunning ? "text-red-400" : simState === "paused" ? "text-amber-400" : "text-zinc-700"
              }`}>
                {isRunning ? "LIVE" : simState === "paused" ? "PAUSED" : "IDLE"}
              </span>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden" style={{ background: SCENE_BG[scene] }}>

          {/* Grid */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: `linear-gradient(rgba(34,211,238,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,.03) 1px,transparent 1px)`,
            backgroundSize: "48px 48px",
          }} />

          {/* Perspective floor lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="0" y1="75" x2="100" y2="75" stroke="#22d3ee" strokeWidth="0.08" strokeOpacity="0.18"/>
            {[-20,-10,0,10,20,30,40,50,60,70,80,90,100,110,120].map((x, i) => (
              <line key={i} x1={x} y1="100" x2="50" y2="75"
                stroke="#22d3ee" strokeWidth="0.05" strokeOpacity="0.08"/>
            ))}
          </svg>

          {/* Scan line */}
          {isRunning && (
            <div className="absolute left-0 right-0 pointer-events-none z-10" style={{
              top: `${scanY}%`,
              height: "1px",
              background: "linear-gradient(90deg, transparent 0%, rgba(34,211,238,.5) 20%, rgba(34,211,238,.8) 50%, rgba(34,211,238,.5) 80%, transparent 100%)",
              boxShadow: "0 0 10px rgba(34,211,238,.35), 0 0 2px rgba(34,211,238,.6)",
            }} />
          )}

          {/* Bounding boxes */}
          {isActive && objects.map(obj => {
            const color = CLS_COLOR[obj.cls] ?? "#22d3ee";
            const isTarget = target?.id === obj.id;
            return (
              <div key={obj.id} className={`absolute pg-fade-in ${isTarget ? "pg-pulse-target" : ""}`}
                style={{
                  left: `${obj.x}%`, top: `${obj.y}%`,
                  width: `${obj.w}%`, height: `${obj.h}%`,
                  border: `1px solid ${color}`,
                  backgroundColor: `${color}07`,
                  boxShadow: isTarget
                    ? `0 0 8px ${color}50, inset 0 0 8px ${color}08`
                    : `0 0 4px ${color}30`,
                }}
              >
                {/* Corner brackets */}
                <div style={{ position:"absolute",top:-1,left:-1,width:8,height:8,borderTop:`2px solid ${color}`,borderLeft:`2px solid ${color}` }}/>
                <div style={{ position:"absolute",top:-1,right:-1,width:8,height:8,borderTop:`2px solid ${color}`,borderRight:`2px solid ${color}` }}/>
                <div style={{ position:"absolute",bottom:-1,left:-1,width:8,height:8,borderBottom:`2px solid ${color}`,borderLeft:`2px solid ${color}` }}/>
                <div style={{ position:"absolute",bottom:-1,right:-1,width:8,height:8,borderBottom:`2px solid ${color}`,borderRight:`2px solid ${color}` }}/>

                {/* Label */}
                <div className="absolute left-0 flex items-center gap-1 px-1.5 py-0.5 whitespace-nowrap"
                  style={{
                    top: "-1.4rem",
                    backgroundColor: `${color}18`,
                    border: `1px solid ${color}50`,
                    borderBottom: "none",
                  }}
                >
                  {isTarget && <div className="h-1 w-1 rounded-full animate-pulse" style={{ backgroundColor: color }} />}
                  <span className="text-[9px] font-mono" style={{ color }}>
                    {obj.label} {obj.confidence}%
                  </span>
                </div>
              </div>
            );
          })}

          {/* Arrow SVG — robot to target */}
          {isRunning && targetCx !== null && targetCy !== null && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-20"
              viewBox="0 0 100 100" preserveAspectRatio="none"
            >
              <defs>
                <marker id="ah" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
                  <path d="M0,0 L0,5 L5,2.5 z" fill="#22d3ee" fillOpacity="0.8"/>
                </marker>
              </defs>
              <line x1={ROBOT_POS[0]} y1={ROBOT_POS[1]} x2={targetCx} y2={targetCy}
                stroke="#22d3ee" strokeWidth="0.25" strokeOpacity="0.2" strokeDasharray="1.5 1.5"/>
              <line x1={ROBOT_POS[0]} y1={ROBOT_POS[1]} x2={targetCx} y2={targetCy}
                stroke="#22d3ee" strokeWidth="0.4" strokeOpacity="0.75" markerEnd="url(#ah)"/>
            </svg>
          )}

          {/* Robot indicator */}
          <div className="absolute z-30 pointer-events-none"
            style={{ left: `${ROBOT_POS[0]}%`, top: `${ROBOT_POS[1]}%`, transform: "translate(-50%,-50%)" }}
          >
            {isRunning && (
              <>
                <div className="pg-ping-slow absolute inset-0 rounded-full border border-cyan-400/30" style={{ margin: "-8px" }} />
                <div className="pg-ping-slow-2 absolute inset-0 rounded-full border border-cyan-400/20" style={{ margin: "-14px" }} />
              </>
            )}
            <div className={`relative h-5 w-5 rounded-full border flex items-center justify-center ${
              isRunning ? "border-cyan-400/80 bg-cyan-400/15" : "border-zinc-600/50 bg-zinc-800/30"
            }`}>
              <div className={`h-2 w-2 rounded-full ${isRunning ? "bg-cyan-400" : "bg-zinc-600"}`} />
            </div>
            <p className="text-[7px] font-mono text-cyan-400/50 text-center mt-1 tracking-widest">BOT</p>
          </div>

          {/* HUD — top-left */}
          <div className="absolute top-4 left-4 pointer-events-none space-y-1">
            <p className="text-[9px] font-mono text-cyan-400/40 tracking-widest">{model.name.toUpperCase()}</p>
            <p className="text-[9px] font-mono text-zinc-800">ARTEMIS · ROS 2</p>
          </div>

          {/* HUD — top-right bracket decoration */}
          <div className="absolute top-4 right-4 pointer-events-none">
            <div className="relative w-14 h-10">
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-cyan-400/20"/>
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-cyan-400/20"/>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-cyan-400/20"/>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-cyan-400/20"/>
            </div>
          </div>

          {/* Status bar — bottom of canvas */}
          <div className="absolute bottom-0 inset-x-0 px-5 py-3 flex items-center justify-between pointer-events-none"
            style={{ background: "linear-gradient(to top, rgba(8,8,8,.95) 0%, transparent 100%)" }}
          >
            <div className="flex items-center gap-2">
              {isRunning && <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />}
              {simState === "paused" && <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />}
              <span className="text-xs font-mono text-zinc-400">
                {simState === "idle"
                  ? "Ready — press Start to begin simulation"
                  : simState === "paused"
                  ? "Simulation paused"
                  : STATUS_STEPS[statusIdx]}
              </span>
            </div>
            {isActive && target && (
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-zinc-700">TARGET</span>
                <span className="text-[9px] font-mono text-cyan-400">{target.label}</span>
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="text-zinc-700">
                  <path d="M1 4h6M5 2l2 2-2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-[9px] font-mono text-zinc-500">{rules[0]?.action}</span>
              </div>
            )}
          </div>
        </div>

        {/* Controls bar */}
        <div className="shrink-0 border-t border-[#1a1a1a] px-5 py-3 flex items-center gap-2.5">
          {simState !== "running" ? (
            <button onClick={startSim}
              className="flex items-center gap-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black px-4 py-2 text-xs font-semibold transition-colors"
            >
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <path d="M2 1l6 3.5L2 8V1z" fill="currentColor"/>
              </svg>
              Start Simulation
            </button>
          ) : (
            <button onClick={pauseSim}
              className="flex items-center gap-2 rounded-lg border border-amber-400/30 bg-amber-400/8 hover:bg-amber-400/15 text-amber-400 px-4 py-2 text-xs font-semibold transition-colors"
            >
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <rect x="1" y="1" width="2.5" height="7" rx="0.5" fill="currentColor"/>
                <rect x="5.5" y="1" width="2.5" height="7" rx="0.5" fill="currentColor"/>
              </svg>
              Pause
            </button>
          )}

          <button onClick={resetSim}
            className="flex items-center gap-2 rounded-lg border border-[#2a2a2a] text-zinc-500 hover:text-white hover:border-white/20 px-4 py-2 text-xs font-medium transition-colors"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M9 5A4 4 0 1 1 5.5 1.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              <path d="M5.5 1.1L7 3l-2 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Reset
          </button>

          {/* Object legend */}
          {isActive && (
            <div className="ml-auto flex items-center gap-3 flex-wrap">
              {objects.map(obj => (
                <div key={obj.id} className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-sm" style={{ backgroundColor: CLS_COLOR[obj.cls] }}/>
                  <span className="text-[10px] font-mono text-zinc-600">{obj.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
