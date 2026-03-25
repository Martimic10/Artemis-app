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

export const metadata = { title: "ROS 2 Guide — Artemis Docs" };

export default function Ros2GuidePage() {
  return (
    <div className="flex">
      <article className="flex-1 min-w-0 px-6 py-10 sm:px-10 sm:py-14 max-w-3xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-zinc-600 mb-6 font-mono">
          <Link href="/docs" className="hover:text-zinc-400 transition-colors">docs</Link>
          <span>/</span>
          <span className="text-zinc-400">ros2-guide</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-normal text-white tracking-tight leading-[1.1] mb-4">
          ROS 2 Guide
        </h1>
        <p className="text-lg text-zinc-400 leading-relaxed mb-8">
          A deep dive into how Artemis integrates with ROS 2 — topics, services, QoS profiles,
          node lifecycle, and multi-robot configuration.
        </p>

        <hr className="border-white/10 mb-8" />

        {/* Supported distros */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="supported-distros">Supported ROS 2 Distributions</h2>
        <div className="overflow-x-auto my-5">
          <table className="w-full text-sm border border-white/10 rounded-lg overflow-hidden">
            <thead>
              <tr className="border-b border-white/10 bg-white/4">
                <th className="text-left px-4 py-3 text-zinc-400 font-medium">Distribution</th>
                <th className="text-left px-4 py-3 text-zinc-400 font-medium">Support</th>
                <th className="text-left px-4 py-3 text-zinc-400 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {[
                { distro: "Jazzy Jalisco",  support: "✔ Full",    note: "Recommended" },
                { distro: "Humble Hawksbill", support: "✔ Full",  note: "LTS — broadly supported" },
                { distro: "Iron Irwini",    support: "✔ Full",    note: "" },
                { distro: "Galactic",       support: "⚠ Partial", note: "EOL — upgrade recommended" },
                { distro: "Foxy",           support: "✗ Unsupported", note: "EOL" },
              ].map((row, i) => (
                <tr key={row.distro} className={`border-b border-white/6 ${i % 2 === 0 ? "" : "bg-white/2"}`}>
                  <td className="px-4 py-3 font-mono text-zinc-300 text-xs">{row.distro}</td>
                  <td className={`px-4 py-3 text-xs ${row.support.startsWith("✔") ? "text-green-400" : row.support.startsWith("⚠") ? "text-yellow-400" : "text-zinc-600"}`}>{row.support}</td>
                  <td className="px-4 py-3 text-xs text-zinc-500">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Topics */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="topics">Topics</h2>
        <p className="text-zinc-400 leading-relaxed mb-3">
          When you deploy a model to a robot, the Artemis agent starts a managed ROS 2 node that
          subscribes to your input topic and publishes inference results on the output topic.
        </p>

        <div className="overflow-x-auto my-5">
          <table className="w-full text-sm border border-white/10 rounded-lg overflow-hidden">
            <thead>
              <tr className="border-b border-white/10 bg-white/4">
                <th className="text-left px-4 py-3 text-zinc-400 font-medium">Topic</th>
                <th className="text-left px-4 py-3 text-zinc-400 font-medium">Direction</th>
                <th className="text-left px-4 py-3 text-zinc-400 font-medium">Message Type</th>
              </tr>
            </thead>
            <tbody>
              {[
                { topic: "/kairo/input",       dir: "Subscribes", type: "sensor_msgs/msg/Image (configurable)" },
                { topic: "/kairo/inference",   dir: "Publishes",  type: "kairo_msgs/msg/Inference" },
                { topic: "/kairo/status",      dir: "Publishes",  type: "kairo_msgs/msg/AgentStatus" },
                { topic: "/kairo/cmd/reload",  dir: "Subscribes", type: "std_msgs/msg/String" },
              ].map((row, i) => (
                <tr key={row.topic} className={`border-b border-white/6 ${i % 2 === 0 ? "" : "bg-white/2"}`}>
                  <td className="px-4 py-3 font-mono text-cyan-400/80 text-xs">{row.topic}</td>
                  <td className="px-4 py-3 text-xs text-zinc-400">{row.dir}</td>
                  <td className="px-4 py-3 font-mono text-xs text-zinc-500">{row.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-zinc-400 leading-relaxed mb-2">Override the default input topic at deploy time:</p>
        <CodeBlock lang="bash">{`kairo deploy push \\
  --model mdl_abc123 \\
  --robot rob_a1b2c3d4 \\
  --input-topic /camera/rgb/image_raw \\
  --output-topic /kairo/inference`}</CodeBlock>

        {/* QoS */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="qos">QoS Profiles</h2>
        <p className="text-zinc-400 leading-relaxed mb-3">
          Artemis uses <strong className="text-white">Reliable</strong> delivery with <strong className="text-white">Transient Local</strong> durability by default.
          For high-frequency sensor topics, switch to a best-effort profile to reduce latency:
        </p>
        <CodeBlock lang="yaml">{`# kairo.yaml
qos:
  input:
    reliability: best_effort
    durability: volatile
    history: keep_last
    depth: 10
  output:
    reliability: reliable
    durability: transient_local`}</CodeBlock>

        <Callout type="warning">
          Using <code className="font-mono text-xs">best_effort</code> on the output topic means subscribers may miss inference messages
          if they are not running when a message is published. Use <code className="font-mono text-xs">reliable</code> for safety-critical outputs.
        </Callout>

        {/* Node lifecycle */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="lifecycle">Node Lifecycle</h2>
        <p className="text-zinc-400 leading-relaxed mb-3">
          The Artemis agent implements the ROS 2 <strong className="text-white">Managed Node</strong> lifecycle.
          This gives you fine-grained control over when the model is active:
        </p>

        <div className="flex flex-col gap-2 my-5">
          {[
            { state: "Unconfigured", desc: "Agent is running, model is not loaded. Waiting for configuration." },
            { state: "Inactive",     desc: "Model is loaded into memory but not processing inputs." },
            { state: "Active",       desc: "Model is running and publishing inference results." },
            { state: "Finalized",    desc: "Node has been cleanly shut down. Resources are released." },
          ].map((s) => (
            <div key={s.state} className="flex gap-3 rounded-lg border border-white/8 bg-white/2 px-4 py-3">
              <code className="text-xs font-mono text-cyan-400 shrink-0 w-28 mt-0.5">{s.state}</code>
              <p className="text-xs text-zinc-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <p className="text-zinc-400 leading-relaxed mb-2">Transition between states using the standard ROS 2 lifecycle CLI:</p>
        <CodeBlock lang="bash">{`# Activate the Artemis node
ros2 lifecycle set /kairo_agent activate

# Deactivate (pause inference without unloading model)
ros2 lifecycle set /kairo_agent deactivate`}</CodeBlock>

        {/* Multi-robot */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="multi-robot">Multi-Robot Configuration</h2>
        <p className="text-zinc-400 leading-relaxed mb-3">
          For fleets with multiple robots sharing the same ROS 2 domain, use namespacing to avoid topic collisions:
        </p>
        <CodeBlock lang="bash">{`kairo deploy push \\
  --model mdl_abc123 \\
  --robot rob_a1b2c3d4 \\
  --namespace /robot_01

# Robot 01 publishes on: /robot_01/kairo/inference
# Robot 02 publishes on: /robot_02/kairo/inference`}</CodeBlock>

        <Callout type="tip">
          For isolated fleets (different physical networks), use separate ROS 2 Domain IDs and separate
          Artemis workspaces. Each workspace has its own fleet dashboard view.
        </Callout>

        {/* Custom messages */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="custom-messages">Custom Message Types</h2>
        <p className="text-zinc-400 leading-relaxed mb-3">
          Artemis supports custom ROS 2 message types for inference input and output. Register your custom
          message package with the Artemis agent:
        </p>
        <CodeBlock lang="bash">{`kairo config set-messages \\
  --robot rob_a1b2c3d4 \\
  --input-type my_pkg/msg/SensorArray \\
  --output-type my_pkg/msg/ControlCommand`}</CodeBlock>
        <p className="text-zinc-400 leading-relaxed mt-2">
          Your message package must be installed and sourced on the robot host before the agent starts.
        </p>

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
            { label: "Supported Distros",    href: "#supported-distros" },
            { label: "Topics",               href: "#topics" },
            { label: "QoS Profiles",         href: "#qos" },
            { label: "Node Lifecycle",       href: "#lifecycle" },
            { label: "Multi-Robot Config",   href: "#multi-robot" },
            { label: "Custom Messages",      href: "#custom-messages" },
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
