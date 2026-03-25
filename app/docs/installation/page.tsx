import { Breadcrumb, Callout, CodeBlock, TOC, PageFooter } from "@/components/DocsUI";

export const metadata = { title: "Installation — Artemis Docs" };

export default function InstallationPage() {
  return (
    <div className="flex">
      <article className="flex-1 min-w-0 px-6 py-10 sm:px-10 sm:py-14 max-w-3xl">
        <Breadcrumb crumbs={[{ label: "docs", href: "/docs" }, { label: "installation" }]} />

        <h1 className="text-4xl sm:text-5xl font-normal text-white tracking-tight leading-[1.1] mb-4">
          Installation
        </h1>
        <p className="text-lg text-zinc-400 leading-relaxed mb-8">
          Install the Artemis agent on your robot host and configure it to connect to your fleet.
        </p>
        <hr className="border-white/10 mb-8" />

        {/* Requirements */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="requirements">System Requirements</h2>
        <div className="overflow-x-auto my-5">
          <table className="w-full text-sm border border-white/10 rounded-lg overflow-hidden">
            <thead>
              <tr className="border-b border-white/10 bg-white/4">
                <th className="text-left px-4 py-3 text-zinc-400 font-medium text-xs">Component</th>
                <th className="text-left px-4 py-3 text-zinc-400 font-medium text-xs">Minimum</th>
                <th className="text-left px-4 py-3 text-zinc-400 font-medium text-xs">Recommended</th>
              </tr>
            </thead>
            <tbody>
              {[
                { comp: "OS",      min: "Ubuntu 20.04",   rec: "Ubuntu 22.04 LTS" },
                { comp: "Python",  min: "3.9",            rec: "3.11+" },
                { comp: "RAM",     min: "512 MB",         rec: "2 GB+" },
                { comp: "Disk",    min: "500 MB",         rec: "2 GB+" },
                { comp: "ROS 2",   min: "Galactic",       rec: "Humble or Jazzy" },
                { comp: "Network", min: "1 Mbps",         rec: "10 Mbps+" },
              ].map((row, i) => (
                <tr key={row.comp} className={`border-b border-white/6 ${i % 2 === 0 ? "" : "bg-white/2"}`}>
                  <td className="px-4 py-3 text-xs text-zinc-300">{row.comp}</td>
                  <td className="px-4 py-3 text-xs font-mono text-zinc-500">{row.min}</td>
                  <td className="px-4 py-3 text-xs font-mono text-cyan-400/80">{row.rec}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* pip install */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="pip">Install via pip</h2>
        <p className="text-zinc-400 leading-relaxed mb-2">
          The Artemis agent is distributed as a Python package. Install it with pip:
        </p>
        <CodeBlock lang="bash">pip install kairo-agent</CodeBlock>
        <p className="text-zinc-400 leading-relaxed mb-2">
          To install a specific version:
        </p>
        <CodeBlock lang="bash">pip install kairo-agent==1.4.2</CodeBlock>
        <p className="text-zinc-400 leading-relaxed mb-2">Verify the install:</p>
        <CodeBlock lang="bash">{`kairo --version
# kairo-agent 1.4.2`}</CodeBlock>

        <Callout type="tip">
          We recommend installing inside a virtual environment or a ROS 2 workspace to avoid dependency conflicts with system Python packages.
        </Callout>

        {/* Docker */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="docker">Install via Docker</h2>
        <p className="text-zinc-400 leading-relaxed mb-2">
          A pre-built Docker image is available for containerized deployments:
        </p>
        <CodeBlock lang="bash">{`docker pull ghcr.io/kairo-dev/kairo-agent:latest

# Run with host networking for ROS 2 DDS discovery
docker run --network host \\
  -e KAIRO_API_KEY=kai_live_xxxxxxxxxxxx \\
  ghcr.io/kairo-dev/kairo-agent:latest`}</CodeBlock>

        {/* ROS 2 workspace */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="ros2-workspace">ROS 2 Workspace Setup</h2>
        <p className="text-zinc-400 leading-relaxed mb-2">
          If you want the Artemis agent to launch as a standard ROS 2 node inside your workspace, install the ROS 2 package wrapper:
        </p>
        <CodeBlock lang="bash">{`# Source your ROS 2 environment first
source /opt/ros/humble/setup.bash

# Install the ROS 2 meta-package
sudo apt install ros-humble-kairo-agent

# Or build from source
cd ~/ros2_ws/src
git clone https://github.com/kairo-dev/kairo-ros2
cd ~/ros2_ws && colcon build --packages-select kairo_agent`}</CodeBlock>

        {/* Config */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="config">Configuration File</h2>
        <p className="text-zinc-400 leading-relaxed mb-2">
          The Artemis agent reads from <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded font-mono">~/.kairo/config.yaml</code> on startup. Run <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded font-mono">kairo config init</code> to generate a default config:
        </p>
        <CodeBlock lang="yaml">{`# ~/.kairo/config.yaml
api_key: kai_live_xxxxxxxxxxxx
api_endpoint: https://api.kairo.dev/v1

agent:
  log_level: info         # debug | info | warn | error
  heartbeat_interval: 30  # seconds
  auto_restart: true

ros2:
  domain_id: 0
  namespace: ""
  qos:
    reliability: reliable
    durability: transient_local`}</CodeBlock>

        <Callout type="warning">
          Never commit <code className="font-mono text-xs">~/.kairo/config.yaml</code> to version control — it contains your API key.
          Use environment variables in CI/CD: <code className="font-mono text-xs">KAIRO_API_KEY</code>.
        </Callout>

        {/* Env vars */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="env-vars">Environment Variables</h2>
        <p className="text-zinc-400 leading-relaxed mb-3">All config values can be overridden with environment variables:</p>
        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border border-white/10 rounded-lg overflow-hidden">
            <thead>
              <tr className="border-b border-white/10 bg-white/4">
                <th className="text-left px-4 py-3 text-zinc-400 font-medium text-xs">Variable</th>
                <th className="text-left px-4 py-3 text-zinc-400 font-medium text-xs">Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                { var: "KAIRO_API_KEY",     desc: "Your API key. Overrides the config file value." },
                { var: "KAIRO_ENDPOINT",    desc: "API base URL. Useful for self-hosted deployments." },
                { var: "KAIRO_LOG_LEVEL",   desc: "Log verbosity: debug, info, warn, or error." },
                { var: "KAIRO_ROS_DOMAIN",  desc: "ROS 2 domain ID (0–232)." },
                { var: "KAIRO_NAMESPACE",   desc: "ROS 2 namespace prefix for all Artemis topics." },
              ].map((row, i) => (
                <tr key={row.var} className={`border-b border-white/6 ${i % 2 === 0 ? "" : "bg-white/2"}`}>
                  <td className="px-4 py-3 font-mono text-xs text-cyan-400/80">{row.var}</td>
                  <td className="px-4 py-3 text-xs text-zinc-400">{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <PageFooter
          prev={{ label: "Quick Start", href: "/docs/quick-start" }}
          next={{ label: "Robots & Fleets", href: "/docs/concepts/robots" }}
        />
      </article>

      <TOC items={[
        { label: "System Requirements", href: "#requirements" },
        { label: "Install via pip",     href: "#pip" },
        { label: "Install via Docker",  href: "#docker" },
        { label: "ROS 2 Workspace",     href: "#ros2-workspace" },
        { label: "Configuration File",  href: "#config" },
        { label: "Environment Variables",href: "#env-vars" },
      ]} />
    </div>
  );
}
