"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

// ── Image mockup graphics ────────────────────────────────────────────────────

function MockupImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_60px_-10px_rgba(34,211,238,0.15)]">
      <Image
        src={src}
        alt={alt}
        width={900}
        height={600}
        className="w-full h-auto object-cover"
        priority
      />
      {/* Subtle bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-black/40 to-transparent pointer-events-none" />
    </div>
  );
}

function UploadDataGraphic() {
  return <MockupImage src="/upload-data-mockup.png" alt="Upload data interface" />;
}

function TrainModelGraphic() {
  return <MockupImage src="/train-model-mockup.png" alt="Model training interface" />;
}

function SimulateTestGraphic() {
  return <MockupImage src="/simulate-mockup.png" alt="Simulation and testing interface" />;
}

function DeployRobotsGraphic() {
  return <MockupImage src="/deploy-mockup.png" alt="Robot deployment interface" />;
}

function MonitorGraphic() {
  return <MockupImage src="/monitor-mockup.png" alt="Monitoring and analytics interface" />;
}

// ── Feature data ─────────────────────────────────────────────────────────────

const features = [
  {
    title: "Upload Data",
    description:
      "Upload sensor readings, camera feeds, LIDAR bags, or telemetry logs. Artemis accepts any format — no preprocessing or labeling pipelines required.",
    graphic: UploadDataGraphic,
  },
  {
    title: "Train Your Model",
    description:
      "Our automated ML pipeline selects the right architecture and trains a custom AI model on your data. No hyperparameter tuning or GPU setup needed.",
    graphic: TrainModelGraphic,
  },
  {
    title: "Simulate & Test",
    description:
      "Validate your model in a simulated environment before it touches real hardware. Catch failures early and iterate fast without risking your robots.",
    graphic: SimulateTestGraphic,
  },
  {
    title: "Deploy to Robots",
    description:
      "Push your trained model to any ROS 2 compatible robot with one click. Artemis handles packaging, versioning, and over-the-air delivery automatically.",
    graphic: DeployRobotsGraphic,
  },
  {
    title: "Monitor & Improve",
    description:
      "Track accuracy, latency, and robot behaviour in real time. Trigger retraining from live data to keep your models sharp as conditions change.",
    graphic: MonitorGraphic,
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function Features() {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % features.length);
    }, 5000);
  }, []);

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTimer]);

  const handleSelect = (i: number) => {
    setActive(i);
    startTimer();
  };

  const ActiveGraphic = features[active].graphic;

  return (
    <section className="border-t-2 border-white/20">
      {/* Section header */}
      <div className="px-5 py-10 sm:px-10 sm:py-14 border-b-2 border-white/20">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-0.5 h-4 bg-cyan-400" />
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Features</span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-normal text-white tracking-tight">
          Core platform features
        </h2>
        <p className="mt-3 text-base text-zinc-500">
          Everything you need to train, test, and run AI on real robots — in one place.
        </p>
      </div>

      {/* Two-column body */}
      <div className="flex flex-col md:flex-row">
        {/* Feature list */}
        <div className="w-full md:w-[42%] border-b-2 md:border-b-0 md:border-r-2 border-white/20">
          {features.map((f, i) => (
            <button
              key={f.title}
              onClick={() => handleSelect(i)}
              className={`w-full text-left px-5 py-6 sm:px-10 sm:py-8 border-b-2 border-white/20 last:border-b-0 transition-colors ${
                active === i ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"
              }`}
            >
              <span
                className={`text-2xl font-normal transition-colors ${
                  active === i ? "text-white" : "text-zinc-500"
                }`}
              >
                {f.title}
              </span>

              {active === i && (
                <div className="mt-4">
                  <p className="text-base text-zinc-400 leading-relaxed">
                    {f.description}
                  </p>
                  <div className="mt-5 h-px w-full bg-zinc-800 overflow-hidden">
                    <div key={active} className="timing-bar h-full bg-cyan-400" />
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Graphic pane */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 min-h-64">
          <ActiveGraphic />
        </div>
      </div>
    </section>
  );
}
