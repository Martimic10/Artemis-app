import { Breadcrumb, Callout, CodeBlock, TOC, PageFooter } from "@/components/DocsUI";

export const metadata = { title: "Robots & Fleets — Artemis Docs" };

export default function RobotsConceptPage() {
  return (
    <div className="flex">
      <article className="flex-1 min-w-0 px-6 py-10 sm:px-10 sm:py-14 max-w-3xl">
        <Breadcrumb crumbs={[{ label: "docs", href: "/docs" }, { label: "concepts", href: "/docs/concepts/robots" }, { label: "robots & fleets" }]} />

        <h1 className="text-4xl sm:text-5xl font-normal text-white tracking-tight leading-[1.1] mb-4">
          Robots & Fleets
        </h1>
        <p className="text-lg text-zinc-400 leading-relaxed mb-8">
          Learn how Artemis models robots, organises them into fleets, and tracks their health in real time.
        </p>
        <hr className="border-white/10 mb-8" />

        {/* What is a robot */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="what-is-a-robot">What is a Robot?</h2>
        <p className="text-zinc-400 leading-relaxed mb-4">
          In Artemis, a <strong className="text-white">robot</strong> is any ROS 2-compatible device or system registered to your account.
          This includes physical hardware, cloud simulation instances, and virtual ROS 2 nodes running on bare-metal servers.
        </p>
        <p className="text-zinc-400 leading-relaxed mb-4">
          Each robot has a unique ID (e.g. <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded font-mono">rob_a1b2c3d4</code>) that persists across reboots and firmware updates.
          You can rename, reassign, or archive robots at any time from the dashboard or the CLI.
        </p>

        {/* Robot types */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="robot-types">Robot Types</h2>
        <p className="text-zinc-400 leading-relaxed mb-3">
          Artemis supports any ROS 2 system but recognises several built-in types that pre-configure sensible defaults for topics, QoS, and model architecture selection:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-5">
          {[
            { type: "manipulator",   desc: "Robotic arms and pick-and-place systems. Defaults to joint-state input topics." },
            { type: "mobile",        desc: "Ground vehicles and AMRs. Defaults to /cmd_vel and /odom topics." },
            { type: "aerial",        desc: "Drones and UAVs. Uses IMU + camera input by default." },
            { type: "humanoid",      desc: "Full-body humanoid platforms. Multi-modal sensor fusion." },
            { type: "custom",        desc: "Any other ROS 2 system. All topics configured manually." },
          ].map((r) => (
            <div key={r.type} className="rounded-lg border border-white/10 bg-white/2 px-4 py-3">
              <code className="text-xs font-mono text-cyan-400">{r.type}</code>
              <p className="mt-1 text-xs text-zinc-500 leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>

        {/* Robot status */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="robot-status">Robot Status</h2>
        <p className="text-zinc-400 leading-relaxed mb-3">
          Each robot reports a live status that is visible in the dashboard and queryable via the API:
        </p>
        <div className="flex flex-col gap-2 my-5">
          {[
            { status: "online",       color: "text-green-400",  desc: "Agent is connected and the heartbeat is current (within 60 s)." },
            { status: "offline",      color: "text-zinc-500",   desc: "No heartbeat received. The robot may be powered down or unreachable." },
            { status: "deploying",    color: "text-cyan-400",   desc: "A model update is currently being pushed to the robot." },
            { status: "error",        color: "text-red-400",    desc: "The agent reported an unrecoverable error. Check logs." },
            { status: "maintenance",  color: "text-yellow-400", desc: "Manually set — robot is taken out of fleet rotation." },
          ].map((s) => (
            <div key={s.status} className="flex gap-3 items-start rounded-lg border border-white/8 bg-white/2 px-4 py-3">
              <code className={`text-xs font-mono ${s.color} shrink-0 w-24 mt-0.5`}>{s.status}</code>
              <p className="text-xs text-zinc-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Fleets */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="fleets">Fleets</h2>
        <p className="text-zinc-400 leading-relaxed mb-4">
          A <strong className="text-white">fleet</strong> is a logical grouping of robots within a workspace. Fleets let you deploy models
          to multiple robots at once, set shared configuration, and view aggregated telemetry.
        </p>
        <p className="text-zinc-400 leading-relaxed mb-2">Create a fleet and add robots to it:</p>
        <CodeBlock lang="bash">{`# Create a fleet
kairo fleet create --name "warehouse-arm-cluster"

# Add robots to a fleet
kairo fleet add --fleet flt_xyz123 --robot rob_a1b2c3d4
kairo fleet add --fleet flt_xyz123 --robot rob_b5c6d7e8`}</CodeBlock>
        <p className="text-zinc-400 leading-relaxed mb-2">Deploy a model to the entire fleet in one command:</p>
        <CodeBlock lang="bash">{`kairo deploy push \\
  --model mdl_abc123 \\
  --fleet flt_xyz123`}</CodeBlock>

        <Callout type="tip">
          Fleets support <strong>staged rollouts</strong>. Use <code className="font-mono text-xs">--rollout-percent 20</code> to deploy to 20% of the fleet first, then monitor before completing the rollout.
        </Callout>

        {/* Heartbeat */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="heartbeat">Heartbeat & Connectivity</h2>
        <p className="text-zinc-400 leading-relaxed mb-3">
          The Artemis agent sends a heartbeat to <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded font-mono">api.kairo.dev</code> every 30 seconds by default.
          This heartbeat carries the robot&apos;s current status, active model version, and basic resource metrics.
        </p>
        <p className="text-zinc-400 leading-relaxed mb-2">Adjust the interval in your config:</p>
        <CodeBlock lang="yaml">{`# ~/.kairo/config.yaml
agent:
  heartbeat_interval: 15   # seconds (min: 5, max: 300)`}</CodeBlock>

        <Callout type="info">
          Artemis never opens inbound connections to your robot. All communication is initiated by the agent (outbound HTTPS), so you do not need to open firewall ports.
        </Callout>

        <PageFooter
          prev={{ label: "Installation", href: "/docs/installation" }}
          next={{ label: "AI Models", href: "/docs/concepts/models" }}
        />
      </article>

      <TOC items={[
        { label: "What is a Robot?",       href: "#what-is-a-robot" },
        { label: "Robot Types",            href: "#robot-types" },
        { label: "Robot Status",           href: "#robot-status" },
        { label: "Fleets",                 href: "#fleets" },
        { label: "Heartbeat & Connectivity", href: "#heartbeat" },
      ]} />
    </div>
  );
}
