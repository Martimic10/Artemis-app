import { Breadcrumb, Callout, CodeBlock, EndpointBlock, PropTable, TOC, PageFooter } from "@/components/DocsUI";

export const metadata = { title: "Deployments API — Artemis Docs" };

export default function DeploymentsApiPage() {
  return (
    <div className="flex">
      <article className="flex-1 min-w-0 px-6 py-10 sm:px-10 sm:py-14 max-w-3xl">
        <Breadcrumb crumbs={[{ label: "docs", href: "/docs" }, { label: "api reference", href: "/docs/api-reference" }, { label: "deployments" }]} />

        <h1 className="text-4xl sm:text-5xl font-normal text-white tracking-tight leading-[1.1] mb-4">
          Deployments API
        </h1>
        <p className="text-lg text-zinc-400 leading-relaxed mb-8">
          Push model updates to robots, manage rollouts, and trigger rollbacks.
        </p>
        <hr className="border-white/10 mb-8" />

        <EndpointBlock endpoints={[
          { method: "GET",    path: "/deployments",               desc: "List all active deployments in your workspace." },
          { method: "POST",   path: "/deployments",               desc: "Create a new deployment (push model to robot or fleet)." },
          { method: "GET",    path: "/deployments/{id}",          desc: "Get deployment status and progress." },
          { method: "POST",   path: "/deployments/{id}/complete", desc: "Complete a staged rollout (promote from partial to full)." },
          { method: "POST",   path: "/deployments/{id}/rollback", desc: "Roll back to the previous model version." },
          { method: "DELETE", path: "/deployments/{id}",          desc: "Stop and remove a deployment." },
        ]} />

        {/* List deployments */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="list">List Deployments</h2>
        <div className="flex items-center gap-3 my-3">
          <span className="text-xs font-mono font-semibold bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 rounded px-1.5 py-0.5">GET</span>
          <code className="text-sm font-mono text-zinc-300">/deployments</code>
        </div>
        <CodeBlock lang="bash">{`curl https://api.kairo.dev/v1/deployments \\
  -H "Authorization: Bearer kai_live_xxxxxxxxxxxx"`}</CodeBlock>
        <CodeBlock lang="json">{`// 200 OK
{
  "data": [
    {
      "id": "dep_abc789",
      "model_id": "mdl_abc123",
      "model_version": "v2",
      "target_type": "robot",
      "target_id": "rob_a1b2c3d4",
      "status": "active",
      "rollout_percent": 100,
      "deployed_at": "2026-03-20T09:00:00Z"
    }
  ],
  "total": 1
}`}</CodeBlock>

        {/* Create deployment */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="create">Create a Deployment</h2>
        <div className="flex items-center gap-3 my-3">
          <span className="text-xs font-mono font-semibold bg-green-400/10 text-green-400 border border-green-400/30 rounded px-1.5 py-0.5">POST</span>
          <code className="text-sm font-mono text-zinc-300">/deployments</code>
        </div>
        <PropTable rows={[
          { field: "model_id",        type: "string",  required: true,  desc: "ID of the model to deploy." },
          { field: "model_version",   type: "string",  required: false, desc: "Version to deploy (e.g. v2). Defaults to active version." },
          { field: "robot_id",        type: "string",  required: false, desc: "Target robot ID. Provide robot_id OR fleet_id." },
          { field: "fleet_id",        type: "string",  required: false, desc: "Target fleet ID. Provide robot_id OR fleet_id." },
          { field: "rollout_percent", type: "integer", required: false, desc: "Percentage of fleet to deploy to initially (1–100). Default: 100." },
          { field: "input_topic",     type: "string",  required: false, desc: "Override the ROS 2 input topic. Default: robot type default." },
          { field: "output_topic",    type: "string",  required: false, desc: "Override the ROS 2 output topic. Default: /kairo/inference." },
          { field: "namespace",       type: "string",  required: false, desc: "ROS 2 namespace prefix for this deployment." },
        ]} />
        <CodeBlock lang="bash">{`# Deploy to a single robot
curl -X POST https://api.kairo.dev/v1/deployments \\
  -H "Authorization: Bearer kai_live_xxxxxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model_id": "mdl_abc123",
    "model_version": "v2",
    "robot_id": "rob_a1b2c3d4",
    "output_topic": "/kairo/inference"
  }'`}</CodeBlock>
        <CodeBlock lang="bash">{`# Staged fleet rollout — 20% first
curl -X POST https://api.kairo.dev/v1/deployments \\
  -H "Authorization: Bearer kai_live_xxxxxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model_id": "mdl_abc123",
    "fleet_id": "flt_xyz123",
    "rollout_percent": 20
  }'`}</CodeBlock>
        <CodeBlock lang="json">{`// 202 Accepted
{
  "id": "dep_newdep001",
  "status": "deploying",
  "target_type": "fleet",
  "target_id": "flt_xyz123",
  "total_robots": 24,
  "deployed_robots": 0,
  "rollout_percent": 20,
  "estimated_completion_s": 45
}`}</CodeBlock>

        {/* Get status */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="status">Get Deployment Status</h2>
        <div className="flex items-center gap-3 my-3">
          <span className="text-xs font-mono font-semibold bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 rounded px-1.5 py-0.5">GET</span>
          <code className="text-sm font-mono text-zinc-300">/deployments/{"{id}"}</code>
        </div>
        <CodeBlock lang="json">{`// 200 OK — staged rollout in progress
{
  "id": "dep_newdep001",
  "status": "partial",
  "model_id": "mdl_abc123",
  "model_version": "v2",
  "target_type": "fleet",
  "target_id": "flt_xyz123",
  "total_robots": 24,
  "deployed_robots": 5,
  "rollout_percent": 20,
  "deployed_at": "2026-03-23T12:00:00Z",
  "metrics_summary": {
    "avg_latency_p99_ms": 22,
    "error_rate": 0.001
  }
}`}</CodeBlock>

        {/* Rollback */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="rollback">Rollback a Deployment</h2>
        <div className="flex items-center gap-3 my-3">
          <span className="text-xs font-mono font-semibold bg-green-400/10 text-green-400 border border-green-400/30 rounded px-1.5 py-0.5">POST</span>
          <code className="text-sm font-mono text-zinc-300">/deployments/{"{id}"}/rollback</code>
        </div>
        <CodeBlock lang="bash">{`curl -X POST https://api.kairo.dev/v1/deployments/dep_abc789/rollback \\
  -H "Authorization: Bearer kai_live_xxxxxxxxxxxx"`}</CodeBlock>
        <CodeBlock lang="json">{`// 200 OK
{
  "deployment_id": "dep_abc789",
  "rolled_back_to_version": "v1",
  "status": "rolling_back",
  "estimated_completion_s": 5
}`}</CodeBlock>

        <Callout type="info">
          Rollbacks use the model version cached on each robot and complete in under 5 seconds — no re-download required.
          Rollback history is retained for 30 days.
        </Callout>

        <PageFooter
          prev={{ label: "Models API", href: "/docs/api-reference/models" }}
        />
      </article>

      <TOC items={[
        { label: "All Endpoints",         href: "#" },
        { label: "List Deployments",      href: "#list" },
        { label: "Create a Deployment",   href: "#create" },
        { label: "Get Status",            href: "#status" },
        { label: "Rollback",              href: "#rollback" },
      ]} />
    </div>
  );
}
