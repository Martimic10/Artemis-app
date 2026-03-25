import { Breadcrumb, Callout, CodeBlock, TOC, PageFooter } from "@/components/DocsUI";

export const metadata = { title: "Fleet Monitoring — Artemis Docs" };

export default function MonitoringGuidePage() {
  return (
    <div className="flex">
      <article className="flex-1 min-w-0 px-6 py-10 sm:px-10 sm:py-14 max-w-3xl">
        <Breadcrumb crumbs={[{ label: "docs", href: "/docs" }, { label: "guides", href: "/docs/guides/monitoring" }, { label: "fleet monitoring" }]} />

        <h1 className="text-4xl sm:text-5xl font-normal text-white tracking-tight leading-[1.1] mb-4">
          Fleet Monitoring
        </h1>
        <p className="text-lg text-zinc-400 leading-relaxed mb-8">
          Track robot health, model performance, and anomalies across your entire fleet in real time.
        </p>
        <hr className="border-white/10 mb-8" />

        {/* Dashboard */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="dashboard">Dashboard Overview</h2>
        <p className="text-zinc-400 leading-relaxed mb-4">
          The Artemis dashboard provides a live view of your fleet. The main monitoring panels are:
        </p>
        <div className="flex flex-col gap-3 my-5">
          {[
            { panel: "Fleet Map",       desc: "Visual overview of all robots, their online/offline status, and active model versions." },
            { panel: "Live Telemetry",  desc: "Real-time inference latency, throughput, and error rates per robot." },
            { panel: "Model Health",    desc: "Accuracy drift detection — compares current inference confidence vs. baseline." },
            { panel: "Resource Usage",  desc: "CPU, GPU, RAM, and disk utilisation across the fleet." },
            { panel: "Alert Feed",      desc: "Chronological log of all triggered alerts with severity and resolution status." },
          ].map((p) => (
            <div key={p.panel} className="flex gap-3 rounded-lg border border-white/8 bg-white/2 px-4 py-3">
              <span className="text-sm font-medium text-white shrink-0 w-36">{p.panel}</span>
              <p className="text-sm text-zinc-400 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Key metrics */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="metrics">Key Metrics</h2>
        <p className="text-zinc-400 leading-relaxed mb-3">Artemis tracks the following metrics for each deployed model:</p>
        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border border-white/10 rounded-lg overflow-hidden">
            <thead>
              <tr className="border-b border-white/10 bg-white/4">
                <th className="text-left px-4 py-3 text-zinc-400 font-medium text-xs">Metric</th>
                <th className="text-left px-4 py-3 text-zinc-400 font-medium text-xs">Description</th>
                <th className="text-left px-4 py-3 text-zinc-400 font-medium text-xs">Alert threshold</th>
              </tr>
            </thead>
            <tbody>
              {[
                { metric: "inference_latency_p50", desc: "Median inference time per request", thresh: "> 50 ms" },
                { metric: "inference_latency_p99", desc: "99th percentile inference time", thresh: "> 100 ms" },
                { metric: "error_rate",            desc: "Fraction of failed inference calls", thresh: "> 1%" },
                { metric: "confidence_score",      desc: "Average model output confidence", thresh: "< 0.6" },
                { metric: "throughput",            desc: "Inference requests per second", thresh: "< 5 req/s" },
                { metric: "cpu_usage",             desc: "Agent CPU utilisation", thresh: "> 90%" },
                { metric: "memory_usage",          desc: "Agent memory utilisation", thresh: "> 85%" },
              ].map((row, i) => (
                <tr key={row.metric} className={`border-b border-white/6 ${i % 2 === 0 ? "" : "bg-white/2"}`}>
                  <td className="px-4 py-3 font-mono text-xs text-cyan-400/80">{row.metric}</td>
                  <td className="px-4 py-3 text-xs text-zinc-400">{row.desc}</td>
                  <td className="px-4 py-3 font-mono text-xs text-zinc-500">{row.thresh}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CLI monitoring */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="cli">Monitoring via CLI</h2>
        <p className="text-zinc-400 leading-relaxed mb-2">Stream live metrics for a robot directly in your terminal:</p>
        <CodeBlock lang="bash">{`kairo monitor --robot rob_a1b2c3d4 --follow

# Robot: my-arm-01  |  Model: arm-model-v1
# ─────────────────────────────────────────
# Latency p50:   11 ms    Latency p99:  24 ms
# Error rate:    0.2%     Throughput:   18 req/s
# Confidence:    0.94     CPU:          34%
# ─────────────────────────────────────────
# [12:01:03] inference ok  14ms  conf=0.96
# [12:01:04] inference ok  11ms  conf=0.94
# [12:01:05] inference ok  13ms  conf=0.91`}</CodeBlock>

        {/* Alerts */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="alerts">Configuring Alerts</h2>
        <p className="text-zinc-400 leading-relaxed mb-2">
          Define custom alert rules in your workspace settings or via the CLI. Alerts can notify via email, Slack, webhook, or PagerDuty:
        </p>
        <CodeBlock lang="bash">{`kairo alerts create \\
  --robot rob_a1b2c3d4 \\
  --metric inference_latency_p99 \\
  --condition "gt 80ms" \\
  --channel slack \\
  --webhook https://hooks.slack.com/services/xxx`}</CodeBlock>
        <p className="text-zinc-400 leading-relaxed mt-2 mb-2">List and manage existing alerts:</p>
        <CodeBlock lang="bash">{`kairo alerts list --robot rob_a1b2c3d4
kairo alerts delete --alert alt_abc123`}</CodeBlock>

        {/* Anomaly detection */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="anomalies">Anomaly Detection</h2>
        <p className="text-zinc-400 leading-relaxed mb-4">
          Artemis continuously compares live inference behaviour against a baseline captured at deployment time.
          When the distribution of model outputs shifts significantly — indicating sensor drift, hardware changes, or an out-of-distribution environment — an anomaly alert fires.
        </p>
        <p className="text-zinc-400 leading-relaxed mb-2">Enable anomaly detection for a deployment:</p>
        <CodeBlock lang="bash">{`kairo deploy push \\
  --model mdl_abc123 \\
  --robot rob_a1b2c3d4 \\
  --anomaly-detection enabled \\
  --anomaly-sensitivity medium   # low | medium | high`}</CodeBlock>

        <Callout type="tip">
          When an anomaly alert fires, consider whether you need to retrain with more recent data (if the environment has genuinely changed) or investigate the hardware (if the robot behaves unexpectedly).
        </Callout>

        {/* Logs */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="logs">Viewing Logs</h2>
        <CodeBlock lang="bash">{`# Stream agent logs
kairo logs --robot rob_a1b2c3d4 --follow

# Download logs for a time window
kairo logs --robot rob_a1b2c3d4 \\
  --from "2026-03-20T10:00:00Z" \\
  --to   "2026-03-20T11:00:00Z" \\
  --output ./robot-logs.txt`}</CodeBlock>

        <PageFooter
          prev={{ label: "Deploying to Production", href: "/docs/guides/deploying" }}
          next={{ label: "API Reference", href: "/docs/api-reference" }}
        />
      </article>

      <TOC items={[
        { label: "Dashboard Overview",  href: "#dashboard" },
        { label: "Key Metrics",         href: "#metrics" },
        { label: "Monitoring via CLI",  href: "#cli" },
        { label: "Configuring Alerts",  href: "#alerts" },
        { label: "Anomaly Detection",   href: "#anomalies" },
        { label: "Viewing Logs",        href: "#logs" },
      ]} />
    </div>
  );
}
