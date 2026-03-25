import Link from "next/link";

function Callout({ type, children }: { type: "info" | "tip" | "warning"; children: React.ReactNode }) {
  const styles = {
    info:    { border: "border-cyan-400/30",   bg: "bg-cyan-400/5",   icon: "ℹ", color: "text-cyan-400" },
    tip:     { border: "border-green-400/30",  bg: "bg-green-400/5",  icon: "✦", color: "text-green-400" },
    warning: { border: "border-yellow-400/30", bg: "bg-yellow-400/5", icon: "⚠", color: "text-yellow-400" },
  }[type];

  return (
    <div className={`flex gap-3 rounded-lg border ${styles.border} ${styles.bg} px-4 py-3.5 my-5`}>
      <span className={`${styles.color} text-base shrink-0 mt-0.5`}>{styles.icon}</span>
      <div className="text-sm text-zinc-300 leading-relaxed">{children}</div>
    </div>
  );
}

function CodeBlock({ lang, children }: { lang: string; children: string }) {
  return (
    <div className="my-5 rounded-lg border border-white/10 overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/4 px-4 py-2">
        <span className="text-xs font-mono text-zinc-500">{lang}</span>
      </div>
      <pre className="overflow-x-auto bg-zinc-950 px-4 py-4">
        <code className="text-sm font-mono text-zinc-300 leading-relaxed whitespace-pre">{children}</code>
      </pre>
    </div>
  );
}

export default function DocsIntroPage() {
  return (
    <div className="flex">
      {/* Main content */}
      <article className="flex-1 min-w-0 px-6 py-10 sm:px-10 sm:py-14 max-w-3xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-zinc-600 mb-6 font-mono">
          <Link href="/docs" className="hover:text-zinc-400 transition-colors">docs</Link>
          <span>/</span>
          <span className="text-zinc-400">introduction</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-normal text-white tracking-tight leading-[1.1] mb-4">
          Introduction
        </h1>
        <p className="text-lg text-zinc-400 leading-relaxed mb-8">
          Artemis is a no-code AI platform for ROS 2 robots. Train, simulate, and deploy machine learning
          models to your robot fleet — without writing a single line of ML code.
        </p>

        <hr className="border-white/10 mb-8" />

        {/* What is Artemis */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="what-is-kairo">What is Artemis?</h2>
        <p className="text-zinc-400 leading-relaxed mb-4">
          Artemis sits between your robot hardware and your team. You upload sensor data, Artemis trains a
          model, and the result gets pushed over-the-air to your ROS 2 nodes — all from a browser dashboard.
          No MLOps background required.
        </p>
        <p className="text-zinc-400 leading-relaxed mb-4">
          Whether you&apos;re prototyping a single robot arm or managing a fleet of 50 autonomous vehicles,
          Artemis scales to fit your workflow.
        </p>

        <Callout type="tip">
          New here? Jump straight to the{" "}
          <Link href="/docs/quick-start" className="text-cyan-400 hover:underline">Quick Start guide</Link>{" "}
          to have your first model deployed in under 10 minutes.
        </Callout>

        {/* Key features */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="key-features">Key Features</h2>
        <ul className="flex flex-col gap-4 mb-6">
          {[
            { title: "No-code training", desc: "Upload your dataset and Artemis automatically selects the right model architecture, trains it, and packages it for ROS 2 deployment." },
            { title: "ROS 2 native", desc: "Artemis integrates directly with ROS 2 topics and services. Deploy models as standard ROS 2 nodes — no custom bridges needed." },
            { title: "Hardware-in-the-loop simulation", desc: "Test your trained model in a physics-accurate simulation before pushing to live hardware, preventing costly crashes." },
            { title: "OTA model updates", desc: "Push new model versions to your fleet over-the-air with zero downtime. Artemis handles rollbacks automatically if performance drops." },
            { title: "Real-time monitoring", desc: "Track inference latency, resource utilization, and behavioral anomalies across your entire fleet from one dashboard." },
          ].map((f) => (
            <li key={f.title} className="flex gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-cyan-400 shrink-0" />
              <div>
                <span className="text-white font-medium">{f.title}</span>
                <span className="text-zinc-500"> — {f.desc}</span>
              </div>
            </li>
          ))}
        </ul>

        {/* How it works */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="how-it-works">How It Works</h2>
        <p className="text-zinc-400 leading-relaxed mb-4">
          Artemis follows a four-stage pipeline that maps directly to the way robotics teams work:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-6">
          {[
            { step: "01", title: "Upload Data",       desc: "ROS bags, CSV telemetry, image archives, or LIDAR point clouds." },
            { step: "02", title: "Train Model",       desc: "Artemis selects the architecture and trains on managed GPU infrastructure." },
            { step: "03", title: "Simulate & Test",   desc: "Run the model inside a physics sim before touching real hardware." },
            { step: "04", title: "Deploy & Monitor",  desc: "Push OTA to any ROS 2 node and watch live telemetry in the dashboard." },
          ].map((s) => (
            <div key={s.step} className="rounded-lg border border-white/10 bg-white/2 px-4 py-4">
              <span className="text-xs font-mono text-zinc-600">{s.step}</span>
              <p className="mt-1 text-sm font-medium text-white">{s.title}</p>
              <p className="mt-1 text-xs text-zinc-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Prerequisites */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="prerequisites">Prerequisites</h2>
        <p className="text-zinc-400 leading-relaxed mb-4">
          Artemis is designed to work with any ROS 2-compatible system. Before you start, make sure you have:
        </p>
        <ul className="flex flex-col gap-2 mb-4 text-sm text-zinc-400">
          <li className="flex items-start gap-2"><span className="text-cyan-400 mt-0.5">→</span> A Artemis account (<Link href="#" className="text-cyan-400 hover:underline">sign up free</Link>)</li>
          <li className="flex items-start gap-2"><span className="text-cyan-400 mt-0.5">→</span> A robot or simulation running <strong className="text-white">ROS 2 Humble</strong> or newer</li>
          <li className="flex items-start gap-2"><span className="text-cyan-400 mt-0.5">→</span> Python 3.10+ on your robot&apos;s host machine</li>
          <li className="flex items-start gap-2"><span className="text-cyan-400 mt-0.5">→</span> Network access from your robot to <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded font-mono">api.kairo.dev</code></li>
        </ul>

        <Callout type="info">
          Don&apos;t have a physical robot yet? Artemis works fully with Gazebo, Webots, or any ROS 2 simulation environment.
        </Callout>

        {/* Install */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="install">Install the Artemis Agent</h2>
        <p className="text-zinc-400 leading-relaxed mb-2">
          Install the Artemis agent on your robot host with pip:
        </p>
        <CodeBlock lang="bash">pip install kairo-agent</CodeBlock>
        <p className="text-zinc-400 leading-relaxed mb-2">Then authenticate using your API key from the dashboard:</p>
        <CodeBlock lang="bash">kairo auth login --key YOUR_API_KEY</CodeBlock>

        {/* Next steps */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-4" id="next-steps">Next Steps</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { href: "/docs/quick-start",   label: "Quick Start →",   desc: "Deploy your first model end-to-end." },
            { href: "/docs/ros2-guide",    label: "ROS 2 Guide →",   desc: "Deep dive into the ROS 2 integration." },
            { href: "/docs/api-reference", label: "API Reference →", desc: "Automate everything with the REST API." },
          ].map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-lg border border-white/10 bg-white/2 px-4 py-4 hover:border-cyan-400/40 hover:bg-cyan-400/5 transition-all"
            >
              <p className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors">{card.label}</p>
              <p className="mt-1 text-xs text-zinc-500">{card.desc}</p>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-14 border-t border-white/10 pt-6 flex items-center justify-between">
          <span className="text-xs text-zinc-600">Was this page helpful?</span>
          <div className="flex items-center gap-2">
            <button className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-zinc-500 hover:text-white hover:border-white/20 transition-colors">Yes</button>
            <button className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-zinc-500 hover:text-white hover:border-white/20 transition-colors">No</button>
          </div>
        </div>
      </article>

      {/* Right TOC */}
      <aside className="w-52 shrink-0 py-14 pr-6 hidden xl:block">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-600 mb-3">On this page</p>
        <nav className="flex flex-col gap-1">
          {[
            { label: "What is Artemis?",     href: "#what-is-kairo" },
            { label: "Key Features",       href: "#key-features" },
            { label: "How It Works",       href: "#how-it-works" },
            { label: "Prerequisites",      href: "#prerequisites" },
            { label: "Install the Agent",  href: "#install" },
            { label: "Next Steps",         href: "#next-steps" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-xs text-zinc-600 hover:text-zinc-300 py-1 transition-colors pl-2 border-l border-white/8 hover:border-white/20"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </aside>
    </div>
  );
}
