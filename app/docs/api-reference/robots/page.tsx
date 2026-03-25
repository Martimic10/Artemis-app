import { Breadcrumb, Callout, CodeBlock, EndpointBlock, PropTable, TOC, PageFooter } from "@/components/DocsUI";

export const metadata = { title: "Robots API — Artemis Docs" };

export default function RobotsApiPage() {
  return (
    <div className="flex">
      <article className="flex-1 min-w-0 px-6 py-10 sm:px-10 sm:py-14 max-w-3xl">
        <Breadcrumb crumbs={[{ label: "docs", href: "/docs" }, { label: "api reference", href: "/docs/api-reference" }, { label: "robots" }]} />

        <h1 className="text-4xl sm:text-5xl font-normal text-white tracking-tight leading-[1.1] mb-4">
          Robots API
        </h1>
        <p className="text-lg text-zinc-400 leading-relaxed mb-8">
          Register, manage, and query status for robots in your Artemis fleet.
        </p>
        <hr className="border-white/10 mb-8" />

        <EndpointBlock endpoints={[
          { method: "GET",    path: "/robots",             desc: "List all robots in your workspace." },
          { method: "POST",   path: "/robots",             desc: "Register a new robot." },
          { method: "GET",    path: "/robots/{id}",        desc: "Get a single robot by ID." },
          { method: "PUT",    path: "/robots/{id}",        desc: "Update robot name, type, or metadata." },
          { method: "DELETE", path: "/robots/{id}",        desc: "Remove a robot from the fleet." },
          { method: "GET",    path: "/robots/{id}/status", desc: "Get real-time status and resource metrics." },
          { method: "GET",    path: "/robots/{id}/logs",   desc: "Retrieve agent logs for a time window." },
        ]} />

        {/* List robots */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="list">List Robots</h2>
        <div className="flex items-center gap-3 my-3">
          <span className="text-xs font-mono font-semibold bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 rounded px-1.5 py-0.5">GET</span>
          <code className="text-sm font-mono text-zinc-300">/robots</code>
        </div>
        <CodeBlock lang="bash">{`curl https://api.kairo.dev/v1/robots \\
  -H "Authorization: Bearer kai_live_xxxxxxxxxxxx"`}</CodeBlock>
        <CodeBlock lang="json">{`// 200 OK
{
  "data": [
    {
      "id": "rob_a1b2c3d4",
      "name": "my-arm-01",
      "type": "manipulator",
      "status": "online",
      "ros_distro": "humble",
      "fleet_id": "flt_xyz123",
      "active_model": "mdl_abc123",
      "created_at": "2026-01-15T10:30:00Z",
      "last_seen": "2026-03-23T11:59:42Z"
    }
  ],
  "total": 1,
  "page": 1,
  "per_page": 20
}`}</CodeBlock>

        {/* Register robot */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="register">Register a Robot</h2>
        <div className="flex items-center gap-3 my-3">
          <span className="text-xs font-mono font-semibold bg-green-400/10 text-green-400 border border-green-400/30 rounded px-1.5 py-0.5">POST</span>
          <code className="text-sm font-mono text-zinc-300">/robots</code>
        </div>
        <PropTable rows={[
          { field: "name",      type: "string",  required: true,  desc: "Human-readable name for the robot." },
          { field: "type",      type: "string",  required: true,  desc: "Robot type: manipulator, mobile, aerial, humanoid, or custom." },
          { field: "ros_distro",type: "string",  required: false, desc: "ROS 2 distribution (e.g. humble). Auto-detected if omitted." },
          { field: "fleet_id",  type: "string",  required: false, desc: "Fleet to assign the robot to on registration." },
          { field: "metadata",  type: "object",  required: false, desc: "Arbitrary key-value metadata (e.g. location, serial number)." },
        ]} />
        <CodeBlock lang="bash">{`curl -X POST https://api.kairo.dev/v1/robots \\
  -H "Authorization: Bearer kai_live_xxxxxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "warehouse-arm-01",
    "type": "manipulator",
    "ros_distro": "humble",
    "metadata": { "location": "bay-3", "serial": "ARM-2024-001" }
  }'`}</CodeBlock>
        <CodeBlock lang="json">{`// 201 Created
{
  "id": "rob_newid123",
  "name": "warehouse-arm-01",
  "type": "manipulator",
  "status": "offline",
  "created_at": "2026-03-23T12:00:00Z"
}`}</CodeBlock>

        {/* Get status */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="status">Get Robot Status</h2>
        <div className="flex items-center gap-3 my-3">
          <span className="text-xs font-mono font-semibold bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 rounded px-1.5 py-0.5">GET</span>
          <code className="text-sm font-mono text-zinc-300">/robots/{"{id}"}/status</code>
        </div>
        <CodeBlock lang="bash">{`curl https://api.kairo.dev/v1/robots/rob_a1b2c3d4/status \\
  -H "Authorization: Bearer kai_live_xxxxxxxxxxxx"`}</CodeBlock>
        <CodeBlock lang="json">{`// 200 OK
{
  "id": "rob_a1b2c3d4",
  "status": "online",
  "active_model": "mdl_abc123",
  "model_version": "v2",
  "uptime_s": 86400,
  "metrics": {
    "inference_latency_p50_ms": 11,
    "inference_latency_p99_ms": 24,
    "error_rate": 0.002,
    "throughput_rps": 18.4,
    "cpu_percent": 34,
    "memory_percent": 41
  },
  "last_heartbeat": "2026-03-23T11:59:42Z"
}`}</CodeBlock>

        <Callout type="info">
          Status metrics are updated with each heartbeat (every 30 s by default). For higher-frequency monitoring, use the <code className="font-mono text-xs">kairo monitor</code> CLI command which streams data over WebSocket.
        </Callout>

        <PageFooter
          prev={{ label: "API Reference", href: "/docs/api-reference" }}
          next={{ label: "Models API", href: "/docs/api-reference/models" }}
        />
      </article>

      <TOC items={[
        { label: "All Endpoints",       href: "#" },
        { label: "List Robots",         href: "#list" },
        { label: "Register a Robot",    href: "#register" },
        { label: "Get Robot Status",    href: "#status" },
      ]} />
    </div>
  );
}
