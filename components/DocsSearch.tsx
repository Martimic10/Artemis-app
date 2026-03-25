"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface SearchEntry {
  title: string;
  section: string;
  excerpt: string;
  href: string;
}

const INDEX: SearchEntry[] = [
  // Introduction
  { title: "Introduction",        section: "Getting Started", excerpt: "Artemis is a no-code AI platform for ROS 2 robots. Train, simulate, and deploy machine learning models.", href: "/docs" },
  { title: "What is Artemis?",      section: "Introduction",    excerpt: "Artemis sits between your robot hardware and your team. Upload sensor data, train a model, push OTA to ROS 2 nodes.", href: "/docs#what-is-kairo" },
  { title: "Key Features",        section: "Introduction",    excerpt: "No-code training, ROS 2 native deployment, hardware-in-the-loop simulation, OTA updates, real-time monitoring.", href: "/docs#key-features" },
  { title: "How It Works",        section: "Introduction",    excerpt: "Four stages: Upload Data, Train Model, Simulate & Test, Deploy & Monitor.", href: "/docs#how-it-works" },
  { title: "Prerequisites",       section: "Introduction",    excerpt: "Artemis account, ROS 2 Humble or newer, Python 3.10+, network access to api.kairo.dev.", href: "/docs#prerequisites" },
  { title: "Install the Artemis Agent", section: "Introduction", excerpt: "pip install kairo-agent — install on your robot's host machine.", href: "/docs#install" },

  // Quick Start
  { title: "Quick Start",         section: "Getting Started", excerpt: "Get your first AI model trained and deployed to a ROS 2 robot in under 10 minutes.", href: "/docs/quick-start" },
  { title: "Install Agent",       section: "Quick Start",     excerpt: "pip install kairo-agent — run on your robot's host machine (Ubuntu 22.04 recommended).", href: "/docs/quick-start#step-1" },
  { title: "Authenticate",        section: "Quick Start",     excerpt: "kairo auth login --key YOUR_API_KEY — generate an API key from Dashboard → Settings.", href: "/docs/quick-start#step-2" },
  { title: "Register Your Robot", section: "Quick Start",     excerpt: "kairo robot register --name my-arm-01 --type manipulator --ros-distro humble", href: "/docs/quick-start#step-3" },
  { title: "Upload Training Data",section: "Quick Start",     excerpt: "kairo data upload ./my_dataset.bag --robot rob_xxx — supports ROS bags, CSV, images, LIDAR.", href: "/docs/quick-start#step-4" },
  { title: "Train a Model",       section: "Quick Start",     excerpt: "kairo train start --dataset ds_xyz --robot rob_xxx --task manipulation — Artemis auto-selects architecture.", href: "/docs/quick-start#step-5" },
  { title: "Deploy to Robot",     section: "Quick Start",     excerpt: "kairo deploy push --model mdl_xxx --robot rob_xxx --topic /kairo/inference", href: "/docs/quick-start#step-6" },

  // ROS 2 Guide
  { title: "ROS 2 Guide",                section: "Guides",       excerpt: "Topics, QoS profiles, node lifecycle, multi-robot configuration, custom message types.", href: "/docs/ros2-guide" },
  { title: "Supported ROS 2 Distributions", section: "ROS 2 Guide", excerpt: "Jazzy Jalisco, Humble Hawksbill (LTS), Iron Irwini fully supported. Galactic partial. Foxy unsupported.", href: "/docs/ros2-guide#supported-distros" },
  { title: "ROS 2 Topics",              section: "ROS 2 Guide",  excerpt: "/kairo/input (subscribes), /kairo/inference (publishes), /kairo/status, /kairo/cmd/reload", href: "/docs/ros2-guide#topics" },
  { title: "QoS Profiles",              section: "ROS 2 Guide",  excerpt: "Reliable + Transient Local by default. Switch to best_effort for high-frequency sensor topics.", href: "/docs/ros2-guide#qos" },
  { title: "Node Lifecycle",            section: "ROS 2 Guide",  excerpt: "Artemis implements ROS 2 Managed Node lifecycle: Unconfigured, Inactive, Active, Finalized.", href: "/docs/ros2-guide#lifecycle" },
  { title: "Multi-Robot Configuration", section: "ROS 2 Guide",  excerpt: "Use --namespace /robot_01 at deploy time to avoid topic collisions across a fleet.", href: "/docs/ros2-guide#multi-robot" },
  { title: "Custom Message Types",      section: "ROS 2 Guide",  excerpt: "kairo config set-messages --input-type my_pkg/msg/SensorArray --output-type my_pkg/msg/ControlCommand", href: "/docs/ros2-guide#custom-messages" },

  // API Reference
  { title: "API Reference",       section: "API Reference",   excerpt: "REST API for managing robots, triggering training, pushing deployments, and retrieving telemetry.", href: "/docs/api-reference" },
  { title: "Base URL",            section: "API Reference",   excerpt: "https://api.kairo.dev/v1 — all requests over HTTPS.", href: "/docs/api-reference#base-url" },
  { title: "Authentication",      section: "API Reference",   excerpt: "Bearer token in Authorization header. Three scopes: read, write, admin.", href: "/docs/api-reference#authentication" },
  { title: "Rate Limits",         section: "API Reference",   excerpt: "Starter: 60 req/min. Builder: 300 req/min. Pro: Unlimited. Returns 429 when exceeded.", href: "/docs/api-reference#rate-limits" },
  { title: "Robots API",          section: "API Reference",   excerpt: "GET/POST /robots, GET/PUT/DELETE /robots/{id}, GET /robots/{id}/status", href: "/docs/api-reference#robots" },
  { title: "Models API",          section: "API Reference",   excerpt: "GET/POST /models, POST /models/train, GET /models/{id}/runs, POST /models/{id}/export", href: "/docs/api-reference#models" },
  { title: "Deployments API",     section: "API Reference",   excerpt: "GET/POST /deployments, GET /deployments/{id}, POST /deployments/{id}/rollback, DELETE", href: "/docs/api-reference#deployments" },
  { title: "Error Codes",         section: "API Reference",   excerpt: "400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Rate Limited, 500 Server Error.", href: "/docs/api-reference#errors" },
];

function highlight(text: string, query: string) {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-cyan-400/20 text-cyan-300 rounded-sm px-0.5">
        {part}
      </mark>
    ) : part
  );
}

export default function DocsSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = query.trim().length > 0
    ? INDEX.filter((entry) => {
        const q = query.toLowerCase();
        return (
          entry.title.toLowerCase().includes(q) ||
          entry.section.toLowerCase().includes(q) ||
          entry.excerpt.toLowerCase().includes(q)
        );
      }).slice(0, 8)
    : [];

  // Open on Cmd+K / Ctrl+K
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [open]);

  function navigate(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2 rounded-md border border-white/10 bg-white/4 px-3 py-1.5 text-sm text-zinc-500 hover:border-white/20 hover:text-zinc-400 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0">
          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4"/>
          <path d="M10.5 10.5l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
        <span className="flex-1 text-left">Search docs...</span>
        <span className="text-xs border border-white/10 rounded px-1 py-0.5 font-mono">⌘K</span>
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4"
          onClick={() => setOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Panel */}
          <div
            className="relative w-full max-w-xl rounded-xl border border-white/15 bg-zinc-950 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-zinc-500">
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M10.5 10.5l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search documentation..."
                className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-600 outline-none"
              />
              <button
                onClick={() => setOpen(false)}
                className="text-xs border border-white/10 rounded px-1.5 py-0.5 font-mono text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                ESC
              </button>
            </div>

            {/* Results */}
            {query.trim().length > 0 ? (
              results.length > 0 ? (
                <ul className="max-h-80 overflow-y-auto py-2">
                  {results.map((entry) => (
                    <li key={entry.href}>
                      <button
                        onClick={() => navigate(entry.href)}
                        className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors group"
                      >
                        {/* Doc icon */}
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5 text-zinc-600 group-hover:text-zinc-400">
                          <rect x="2" y="1" width="10" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                          <path d="M5 5h5M5 8h5M5 11h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                        </svg>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm text-white font-medium">
                              {highlight(entry.title, query)}
                            </span>
                            <span className="text-[10px] font-mono text-zinc-600 bg-white/5 border border-white/8 rounded px-1.5 py-0.5">
                              {entry.section}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-500 leading-relaxed mt-0.5 line-clamp-1">
                            {highlight(entry.excerpt, query)}
                          </p>
                        </div>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0 mt-1 text-zinc-700 group-hover:text-zinc-400 transition-colors">
                          <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-sm text-zinc-600">No results for <span className="text-zinc-400">&ldquo;{query}&rdquo;</span></p>
                </div>
              )
            ) : (
              /* Default state — show categories */
              <div className="py-3">
                <p className="px-4 py-1.5 text-[10px] font-mono uppercase tracking-widest text-zinc-600">Quick links</p>
                <ul>
                  {[
                    { label: "Introduction",  section: "Getting Started", href: "/docs" },
                    { label: "Quick Start",   section: "Getting Started", href: "/docs/quick-start" },
                    { label: "ROS 2 Guide",   section: "Guides",          href: "/docs/ros2-guide" },
                    { label: "API Reference", section: "API Reference",   href: "/docs/api-reference" },
                  ].map((item) => (
                    <li key={item.href}>
                      <button
                        onClick={() => navigate(item.href)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-white/5 transition-colors group"
                      >
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0 text-zinc-600">
                          <rect x="2" y="1" width="10" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                          <path d="M5 5h5M5 8h5M5 11h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                        </svg>
                        <span className="text-sm text-zinc-400 group-hover:text-white transition-colors flex-1">{item.label}</span>
                        <span className="text-[10px] font-mono text-zinc-600">{item.section}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Footer hint */}
            <div className="border-t border-white/8 px-4 py-2 flex items-center gap-3 text-[10px] text-zinc-700 font-mono">
              <span>↵ to navigate</span>
              <span>·</span>
              <span>ESC to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
