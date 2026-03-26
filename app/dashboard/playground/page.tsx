"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

type RobotState = "idle" | "moving" | "reached";

interface SimObject {
  id: number;
  x: number;
  y: number;
  radius: number;
  label: string;
  color: string;
  confidence: number;
  detected: boolean;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const ROBOT_RADIUS  = 18;
const ROBOT_SPEED   = 110; // px/s
const OBJECT_LABELS = ["Box", "Bottle", "Ball", "Cube", "Cylinder", "Sphere"];
const OBJECT_COLORS = ["#22d3ee", "#f87171", "#fbbf24", "#a78bfa", "#4ade80", "#fb923c"];

// ── Canvas helpers ────────────────────────────────────────────────────────────

function hexToRgb(hex: string) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!r) return "255,255,255";
  return `${parseInt(r[1], 16)},${parseInt(r[2], 16)},${parseInt(r[3], 16)}`;
}

function drawGrid(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save();
  ctx.strokeStyle = "rgba(34,211,238,0.04)";
  ctx.lineWidth = 1;
  const step = 44;
  for (let x = 0; x <= w; x += step) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y <= h; y += step) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }
  ctx.restore();
}

function drawPath(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, tick: number) {
  ctx.save();
  ctx.strokeStyle = "rgba(34,211,238,0.35)";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([8, 6]);
  ctx.lineDashOffset = -(tick * 0.5) % 14;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

function drawRobot(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  angle: number,
  state: RobotState,
  tick: number
) {
  const moving = state === "moving";
  ctx.save();

  // Outer glow
  const grd = ctx.createRadialGradient(x, y, 0, x, y, ROBOT_RADIUS + (moving ? 34 : 20));
  grd.addColorStop(0, moving ? "rgba(34,211,238,0.22)" : "rgba(34,211,238,0.10)");
  grd.addColorStop(1, "transparent");
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.arc(x, y, ROBOT_RADIUS + (moving ? 34 : 20), 0, Math.PI * 2);
  ctx.fill();

  // Ping ring when moving
  if (moving) {
    const p = (tick % 55) / 55;
    ctx.strokeStyle = `rgba(34,211,238,${0.55 * (1 - p)})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x, y, ROBOT_RADIUS + 10 + p * 30, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Body
  ctx.fillStyle = "#0d0d0d";
  ctx.strokeStyle = moving ? "#22d3ee" : "rgba(34,211,238,0.55)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, ROBOT_RADIUS, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Direction line
  const ex = x + Math.cos(angle) * (ROBOT_RADIUS - 3);
  const ey = y + Math.sin(angle) * (ROBOT_RADIUS - 3);
  ctx.strokeStyle = "#22d3ee";
  ctx.lineWidth = 2.5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(ex, ey);
  ctx.stroke();

  // Center dot
  ctx.fillStyle = "#22d3ee";
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, Math.PI * 2);
  ctx.fill();

  // Label
  ctx.fillStyle = "rgba(34,211,238,0.5)";
  ctx.font = "10px monospace";
  ctx.textAlign = "center";
  ctx.fillText("ROBOT", x, y + ROBOT_RADIUS + 15);

  ctx.restore();
}

function drawObject(
  ctx: CanvasRenderingContext2D,
  obj: SimObject,
  isTarget: boolean,
  tick: number
) {
  const { x, y, radius, label, color, confidence, detected } = obj;
  const rgb = hexToRgb(color);
  ctx.save();

  // Glow
  if (detected) {
    const pulse = isTarget ? 0.38 + 0.28 * Math.sin(tick * 0.12) : 0.22;
    const grd = ctx.createRadialGradient(x, y, 0, x, y, radius + 38);
    grd.addColorStop(0, `rgba(${rgb},${pulse})`);
    grd.addColorStop(1, "transparent");
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(x, y, radius + 38, 0, Math.PI * 2);
    ctx.fill();
  }

  // Body
  ctx.fillStyle = detected ? `rgba(${rgb},0.12)` : "rgba(255,255,255,0.04)";
  ctx.strokeStyle = detected ? (isTarget ? color : `rgba(${rgb},0.7)`) : "rgba(255,255,255,0.12)";
  ctx.lineWidth = isTarget ? 2.5 : detected ? 1.8 : 1;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  if (detected) {
    // Corner bracket bounding box
    const pad = 14;
    const bx = x - radius - pad, by = y - radius - pad;
    const bw = (radius + pad) * 2,  bh = (radius + pad) * 2;
    const cs = 10;
    ctx.strokeStyle = isTarget ? color : `rgba(${rgb},0.55)`;
    ctx.lineWidth = isTarget ? 2 : 1.5;
    ctx.lineCap = "round";
    // TL
    ctx.beginPath(); ctx.moveTo(bx, by + cs); ctx.lineTo(bx, by); ctx.lineTo(bx + cs, by); ctx.stroke();
    // TR
    ctx.beginPath(); ctx.moveTo(bx + bw - cs, by); ctx.lineTo(bx + bw, by); ctx.lineTo(bx + bw, by + cs); ctx.stroke();
    // BL
    ctx.beginPath(); ctx.moveTo(bx, by + bh - cs); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + cs, by + bh); ctx.stroke();
    // BR
    ctx.beginPath(); ctx.moveTo(bx + bw - cs, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by + bh - cs); ctx.stroke();

    // Label tag background
    const tagText = `${label}  ${confidence}%${isTarget ? "  ●" : ""}`;
    ctx.font = "bold 10px monospace";
    const tw = ctx.measureText(tagText).width;
    ctx.fillStyle = `rgba(${rgb},0.12)`;
    ctx.strokeStyle = `rgba(${rgb},0.4)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.rect(bx, by - 22, tw + 12, 17);
    ctx.fill();
    ctx.stroke();

    // Label text
    ctx.fillStyle = color;
    ctx.textAlign = "left";
    ctx.fillText(tagText, bx + 6, by - 9);
  } else {
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.font = "10px monospace";
    ctx.textAlign = "center";
    ctx.fillText(label, x, y + radius + 14);
  }

  ctx.restore();
}

// ── Main component ────────────────────────────────────────────────────────────

export default function PlaygroundPage() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const animRef    = useRef<number | null>(null);

  // All mutable sim state lives here — never stale in RAF
  const sim = useRef({
    robotX: 0, robotY: 0,
    robotAngle: 0,
    robotState: "idle" as RobotState,
    objects: [] as SimObject[],
    targetId: null as number | null,
    tick: 0,
    lastTime: 0,
    initialized: false,
  });

  // React state drives UI only
  const [robotState, setRobotState] = useState<RobotState>("idle");
  const [objCount,   setObjCount]   = useState(0);
  const [log,        setLog]        = useState<string[]>([]);

  const addLog = useCallback((msg: string) => {
    const t = new Date().toLocaleTimeString("en-US", { hour12: false });
    setLog(p => [`${t}  ${msg}`, ...p].slice(0, 12));
  }, []);

  // Resize canvas + center robot on first init
  useEffect(() => {
    const canvas  = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    function resize() {
      const { width, height } = wrapper!.getBoundingClientRect();
      canvas!.width  = Math.floor(width);
      canvas!.height = Math.floor(height);
      if (!sim.current.initialized) {
        sim.current.robotX = width / 2;
        sim.current.robotY = height / 2;
        sim.current.initialized = true;
      }
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrapper);
    return () => ro.disconnect();
  }, []);

  // RAF draw + physics loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function loop(time: number) {
      const ctx = canvas!.getContext("2d");
      if (!ctx) { animRef.current = requestAnimationFrame(loop); return; }

      const dt = Math.min((time - sim.current.lastTime) / 1000, 0.05);
      sim.current.lastTime = time;
      sim.current.tick++;
      const s   = sim.current;
      const { width: w, height: h } = canvas!;

      // ── Physics ────────────────────────────────────────────────────────────
      if (s.robotState === "moving" && s.targetId !== null) {
        const target = s.objects.find(o => o.id === s.targetId);
        if (target) {
          const dx   = target.x - s.robotX;
          const dy   = target.y - s.robotY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          s.robotAngle = Math.atan2(dy, dx);

          if (dist > ROBOT_RADIUS + target.radius + 8) {
            s.robotX += (dx / dist) * ROBOT_SPEED * dt;
            s.robotY += (dy / dist) * ROBOT_SPEED * dt;
          } else {
            // Reached
            s.robotState = "reached";
            s.targetId   = null;
            setRobotState("reached");
            addLog(`✓ Reached: ${target.label}`);
            setTimeout(() => {
              sim.current.robotState = "idle";
              setRobotState("idle");
            }, 2000);
          }
        }
      }

      // ── Draw ───────────────────────────────────────────────────────────────
      ctx.clearRect(0, 0, w, h);

      // Background
      ctx.fillStyle = "#080808";
      ctx.fillRect(0, 0, w, h);
      drawGrid(ctx, w, h);

      // Path line robot → target
      if (s.robotState === "moving" && s.targetId !== null) {
        const target = s.objects.find(o => o.id === s.targetId);
        if (target) drawPath(ctx, s.robotX, s.robotY, target.x, target.y, s.tick);
      }

      // Objects
      s.objects.forEach(obj => drawObject(ctx, obj, obj.id === s.targetId, s.tick));

      // Robot (on top)
      drawRobot(ctx, s.robotX, s.robotY, s.robotAngle, s.robotState, s.tick);

      // HUD
      ctx.save();
      ctx.fillStyle = "rgba(34,211,238,0.28)";
      ctx.font = "10px monospace";
      ctx.textAlign = "left";
      ctx.fillText("ARTEMIS · ROS 2", 14, 20);
      ctx.fillStyle = "rgba(255,255,255,0.1)";
      ctx.fillText(`OBJECTS: ${s.objects.length}`, 14, 34);
      ctx.restore();

      animRef.current = requestAnimationFrame(loop);
    }

    animRef.current = requestAnimationFrame(loop);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [addLog]);

  // ── Actions ───────────────────────────────────────────────────────────────

  function addObject() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const margin = 90;
    const x      = margin + Math.random() * (canvas.width  - margin * 2);
    const y      = margin + Math.random() * (canvas.height - margin * 2);
    const idx    = sim.current.objects.length % OBJECT_LABELS.length;
    const label  = OBJECT_LABELS[idx];
    const color  = OBJECT_COLORS[idx];
    const conf   = Math.round(82 + Math.random() * 14);
    const id     = Date.now();
    const obj: SimObject = { id, x, y, radius: 14 + Math.random() * 9, label, color, confidence: conf, detected: false };

    sim.current.objects = [...sim.current.objects, obj];
    setObjCount(c => c + 1);
    addLog(`Added: ${label} at (${Math.round(x)}, ${Math.round(y)})`);

    // Auto-detect after short delay
    setTimeout(() => {
      sim.current.objects = sim.current.objects.map(o => o.id === id ? { ...o, detected: true } : o);
      addLog(`Detected: ${label} — ${conf}% confidence`);
    }, 550);
  }

  function followObject() {
    const { objects, robotX, robotY } = sim.current;
    if (objects.length === 0) { addLog("No objects — add one first"); return; }

    // Find nearest
    let nearest = objects[0];
    let minDist = Infinity;
    objects.forEach(o => {
      const d = Math.hypot(o.x - robotX, o.y - robotY);
      if (d < minDist) { minDist = d; nearest = o; }
    });

    sim.current.targetId   = nearest.id;
    sim.current.robotState = "moving";
    setRobotState("moving");
    addLog(`Following: ${nearest.label}`);
  }

  function stop() {
    sim.current.robotState = "idle";
    sim.current.targetId   = null;
    setRobotState("idle");
    addLog("Robot stopped");
  }

  function clearAll() {
    sim.current.objects    = [];
    sim.current.robotState = "idle";
    sim.current.targetId   = null;
    sim.current.robotAngle = 0;
    sim.current.robotX     = canvasRef.current ? canvasRef.current.width  / 2 : 400;
    sim.current.robotY     = canvasRef.current ? canvasRef.current.height / 2 : 300;
    setRobotState("idle");
    setObjCount(0);
    setLog([]);
    addLog("Canvas cleared");
  }

  const STATUS = {
    idle:    { label: "Idle",           color: "text-zinc-400",  dot: "bg-zinc-600" },
    moving:  { label: "Moving",         color: "text-cyan-400",  dot: "bg-cyan-400 animate-pulse" },
    reached: { label: "Target Reached", color: "text-green-400", dot: "bg-green-400" },
  } satisfies Record<RobotState, { label: string; color: string; dot: string }>;

  const status = STATUS[robotState];

  return (
    <div className="flex h-screen overflow-hidden bg-[#080808]">

      {/* ── Left Panel ───────────────────────────────────────────────────── */}
      <aside className="w-64 shrink-0 border-r border-[#1a1a1a] flex flex-col overflow-y-auto">

        {/* Header */}
        <div className="px-4 py-4 border-b border-[#1a1a1a] shrink-0">
          <div className="flex items-center gap-2 mb-0.5">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-cyan-400">
              <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
              <circle cx="7" cy="7" r="2" fill="currentColor"/>
              <path d="M7 1.5v1M7 11.5v1M1.5 7h1M11.5 7h1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <p className="text-sm font-medium text-white">Playground</p>
          </div>
          <p className="text-[10px] text-zinc-600">2D robot simulation</p>
        </div>

        {/* Status card */}
        <div className="border-b border-[#1a1a1a] px-4 py-4">
          <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-3">Status</p>
          <div className="flex items-center gap-3 bg-[#0d0d0d] rounded-lg border border-[#1e1e1e] px-3 py-3">
            <div className={`h-2 w-2 rounded-full shrink-0 ${status.dot}`} />
            <div>
              <p className={`text-sm font-semibold ${status.color}`}>{status.label}</p>
              <p className="text-[10px] text-zinc-700 mt-0.5 font-mono">Objects: {objCount}</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="border-b border-[#1a1a1a] px-4 py-4">
          <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-3">Controls</p>
          <div className="space-y-2">

            <button onClick={addObject}
              className="w-full flex items-center gap-2.5 rounded-lg bg-white/5 border border-white/8 hover:bg-white/8 hover:border-white/15 px-3 py-2.5 text-sm text-white transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-cyan-400 shrink-0">
                <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M7 4v6M4 7h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              Add Object
            </button>

            <button onClick={followObject} disabled={robotState === "moving"}
              className="w-full flex items-center gap-2.5 rounded-lg bg-cyan-400/10 border border-cyan-400/20 hover:bg-cyan-400/16 hover:border-cyan-400/35 px-3 py-2.5 text-sm text-cyan-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                <path d="M2 7h10M9 4l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Follow Object
            </button>

            <button onClick={stop} disabled={robotState === "idle"}
              className="w-full flex items-center gap-2.5 rounded-lg bg-white/4 border border-white/8 hover:bg-white/8 hover:border-white/15 px-3 py-2.5 text-sm text-zinc-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-zinc-500 shrink-0">
                <rect x="3.5" y="3.5" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.3"/>
              </svg>
              Stop
            </button>

            <button onClick={clearAll}
              className="w-full flex items-center gap-2.5 rounded-lg border border-[#1e1e1e] hover:bg-white/4 hover:border-white/10 px-3 py-2.5 text-sm text-zinc-600 hover:text-zinc-400 transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                <path d="M2 4h10M5.5 4V2.5h3V4M10.5 4l-.6 7A1 1 0 019 12H5a1 1 0 01-1-.9L3.5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Clear All
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="border-b border-[#1a1a1a] px-4 py-4">
          <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-3">Legend</p>
          <div className="space-y-2.5">
            {[
              { color: "#22d3ee", label: "Robot" },
              { color: "rgba(255,255,255,0.2)", label: "Undetected object" },
              { color: "#22d3ee", label: "Detected (bounding box)" },
              { color: "#22d3ee", label: "Target (nearest)" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-[11px] text-zinc-500">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System log */}
        <div className="flex-1 flex flex-col min-h-0">
          <p className="px-4 pt-4 pb-2 text-[9px] font-mono text-zinc-600 uppercase tracking-widest shrink-0">
            System Log
          </p>
          <div className="px-3 pb-3 flex-1 overflow-y-auto space-y-1">
            {log.length === 0 ? (
              <p className="text-[10px] text-zinc-800 font-mono px-1">Awaiting input...</p>
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
            <span className="text-xs font-medium text-zinc-400">2D Simulation</span>
            <span className="text-zinc-800">·</span>
            <span className="text-xs text-zinc-600">Object Detection Mode</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-zinc-700">60 fps</span>
            <div className="flex items-center gap-1.5">
              <div className={`h-1.5 w-1.5 rounded-full ${robotState === "moving" ? "bg-cyan-400 animate-pulse" : "bg-zinc-700"}`} />
              <span className={`text-[10px] font-mono ${robotState === "moving" ? "text-cyan-400" : "text-zinc-700"}`}>
                {robotState === "moving" ? "ACTIVE" : "STANDBY"}
              </span>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div ref={wrapperRef} className="flex-1 relative overflow-hidden">
          <canvas ref={canvasRef} className="absolute inset-0" />
        </div>

        {/* Controls bar */}
        <div className="shrink-0 border-t border-[#1a1a1a] px-5 py-3 flex items-center gap-2.5">
          <button onClick={addObject}
            className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/8 hover:border-white/20 px-4 py-2 text-xs font-medium text-white transition-colors"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M5 2.5v5M2.5 5h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            Add Object
          </button>

          <button onClick={followObject} disabled={robotState === "moving"}
            className="flex items-center gap-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2 text-xs font-semibold text-black transition-colors"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 5h8M6 2l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Follow Object
          </button>

          <button onClick={stop} disabled={robotState === "idle"}
            className="flex items-center gap-2 rounded-lg border border-[#2a2a2a] text-zinc-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed px-4 py-2 text-xs font-medium transition-colors"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <rect x="2.5" y="2.5" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.3"/>
            </svg>
            Stop
          </button>

          <button onClick={clearAll}
            className="flex items-center gap-2 rounded-lg border border-[#1e1e1e] text-zinc-600 hover:text-zinc-400 hover:border-white/10 px-4 py-2 text-xs font-medium transition-colors"
          >
            Clear All
          </button>

          <div className="ml-auto flex items-center gap-2">
            <div className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
            <span className={`text-xs font-mono ${status.color}`}>{status.label}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
