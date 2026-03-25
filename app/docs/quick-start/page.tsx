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
      <div className="flex items-center border-b border-white/10 bg-white/4 px-4 py-2">
        <span className="text-xs font-mono text-zinc-500">{lang}</span>
      </div>
      <pre className="overflow-x-auto bg-zinc-950 px-4 py-4">
        <code className="text-sm font-mono text-zinc-300 leading-relaxed whitespace-pre">{children}</code>
      </pre>
    </div>
  );
}

function StepBadge({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-xs font-mono text-cyan-400 shrink-0 mt-0.5">
      {n}
    </span>
  );
}

export const metadata = { title: "Quick Start — Artemis Docs" };

export default function QuickStartPage() {
  return (
    <div className="flex">
      <article className="flex-1 min-w-0 px-6 py-10 sm:px-10 sm:py-14 max-w-3xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-zinc-600 mb-6 font-mono">
          <Link href="/docs" className="hover:text-zinc-400 transition-colors">docs</Link>
          <span>/</span>
          <span className="text-zinc-400">quick-start</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-normal text-white tracking-tight leading-[1.1] mb-4">
          Quick Start
        </h1>
        <p className="text-lg text-zinc-400 leading-relaxed mb-8">
          Get your first AI model trained and deployed to a ROS 2 robot in under 10 minutes.
        </p>

        <hr className="border-white/10 mb-8" />

        <Callout type="info">
          This guide assumes you have a Artemis account and a ROS 2 environment available.
          If not, see the <Link href="/docs" className="text-cyan-400 hover:underline">Introduction</Link> for setup steps.
        </Callout>

        {/* Step 1 */}
        <h2 className="flex items-center gap-3 text-2xl font-normal text-white mt-10 mb-3" id="step-1">
          <StepBadge n={1} /> Install the Artemis Agent
        </h2>
        <p className="text-zinc-400 leading-relaxed mb-2">
          Run the following on your robot&apos;s host machine (Ubuntu 22.04 recommended):
        </p>
        <CodeBlock lang="bash">pip install kairo-agent</CodeBlock>
        <p className="text-zinc-400 leading-relaxed mb-2">
          Verify the install:
        </p>
        <CodeBlock lang="bash">{`kairo --version
# kairo-agent 1.4.2`}</CodeBlock>

        {/* Step 2 */}
        <h2 className="flex items-center gap-3 text-2xl font-normal text-white mt-10 mb-3" id="step-2">
          <StepBadge n={2} /> Authenticate
        </h2>
        <p className="text-zinc-400 leading-relaxed mb-2">
          Generate an API key from <strong className="text-white">Dashboard → Settings → API Keys</strong>, then authenticate:
        </p>
        <CodeBlock lang="bash">kairo auth login --key kai_live_xxxxxxxxxxxx</CodeBlock>
        <p className="text-zinc-400 leading-relaxed mt-2">
          Your credentials are stored at <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded font-mono">~/.kairo/credentials</code>.
        </p>

        {/* Step 3 */}
        <h2 className="flex items-center gap-3 text-2xl font-normal text-white mt-10 mb-3" id="step-3">
          <StepBadge n={3} /> Register Your Robot
        </h2>
        <p className="text-zinc-400 leading-relaxed mb-2">
          Register the current machine as a robot in your Artemis fleet:
        </p>
        <CodeBlock lang="bash">{`kairo robot register \\
  --name "my-arm-01" \\
  --type manipulator \\
  --ros-distro humble`}</CodeBlock>
        <p className="text-zinc-400 leading-relaxed mt-2 mb-2">
          You&apos;ll receive a <strong className="text-white">Robot ID</strong> — note it for later steps.
        </p>
        <CodeBlock lang="bash">{`# Output:
✔ Robot registered: rob_a1b2c3d4
  Name:     my-arm-01
  Type:     manipulator
  Status:   online`}</CodeBlock>

        {/* Step 4 */}
        <h2 className="flex items-center gap-3 text-2xl font-normal text-white mt-10 mb-3" id="step-4">
          <StepBadge n={4} /> Upload Training Data
        </h2>
        <p className="text-zinc-400 leading-relaxed mb-2">
          Upload a ROS bag file or CSV dataset. Artemis accepts most common robotics data formats:
        </p>
        <CodeBlock lang="bash">{`kairo data upload ./my_dataset.bag \\
  --robot rob_a1b2c3d4 \\
  --label "pick-and-place v1"`}</CodeBlock>
        <Callout type="tip">
          Larger datasets (&gt;500 MB) are chunked and uploaded in parallel automatically.
          You can monitor upload progress in the dashboard under <strong>Data → Uploads</strong>.
        </Callout>

        {/* Step 5 */}
        <h2 className="flex items-center gap-3 text-2xl font-normal text-white mt-10 mb-3" id="step-5">
          <StepBadge n={5} /> Train a Model
        </h2>
        <p className="text-zinc-400 leading-relaxed mb-2">
          Trigger a training run from the CLI or the dashboard. Artemis auto-selects the best architecture for your data type:
        </p>
        <CodeBlock lang="bash">{`kairo train start \\
  --dataset ds_xyz123 \\
  --robot rob_a1b2c3d4 \\
  --task manipulation`}</CodeBlock>
        <p className="text-zinc-400 leading-relaxed mt-2 mb-2">
          Track training progress in real time:
        </p>
        <CodeBlock lang="bash">{`kairo train logs --run run_789abc --follow

# [00:01] Preprocessing dataset...
# [00:45] Training epoch 1/20 — loss: 0.412
# [01:30] Training epoch 5/20 — loss: 0.189
# [03:22] Training complete. Accuracy: 94.3%
# [03:25] Model packaged as kairo-model-v1.ros2`}</CodeBlock>

        {/* Step 6 */}
        <h2 className="flex items-center gap-3 text-2xl font-normal text-white mt-10 mb-3" id="step-6">
          <StepBadge n={6} /> Deploy to Your Robot
        </h2>
        <p className="text-zinc-400 leading-relaxed mb-2">
          Push the trained model to your robot as a ROS 2 node:
        </p>
        <CodeBlock lang="bash">{`kairo deploy push \\
  --model mdl_abc123 \\
  --robot rob_a1b2c3d4 \\
  --topic /kairo/inference`}</CodeBlock>
        <p className="text-zinc-400 leading-relaxed mt-2 mb-2">
          Verify the deployment is running:
        </p>
        <CodeBlock lang="bash">{`kairo deploy status --robot rob_a1b2c3d4

# Robot:    my-arm-01
# Model:    kairo-model-v1
# Status:   ✔ running
# Uptime:   2m 14s
# Topic:    /kairo/inference`}</CodeBlock>

        <Callout type="tip">
          Your model is now publishing inference results on the <code className="font-mono text-xs">/kairo/inference</code> topic.
          Subscribe to it from any ROS 2 node with <code className="font-mono text-xs">ros2 topic echo /kairo/inference</code>.
        </Callout>

        {/* What's next */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-4" id="whats-next">What&apos;s Next?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { href: "/docs/ros2-guide",    label: "ROS 2 Guide →",         desc: "Configure topics, QoS, and lifecycle management." },
            { href: "/docs/api-reference", label: "API Reference →",       desc: "Automate training and deployment with the REST API." },
            { href: "/docs",               label: "Core Concepts →",       desc: "Understand how Artemis models and fleets work." },
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
            { label: "1. Install Agent",    href: "#step-1" },
            { label: "2. Authenticate",     href: "#step-2" },
            { label: "3. Register Robot",   href: "#step-3" },
            { label: "4. Upload Data",      href: "#step-4" },
            { label: "5. Train a Model",    href: "#step-5" },
            { label: "6. Deploy",           href: "#step-6" },
            { label: "What's Next?",        href: "#whats-next" },
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
