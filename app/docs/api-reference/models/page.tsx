import { Breadcrumb, Callout, CodeBlock, EndpointBlock, PropTable, TOC, PageFooter } from "@/components/DocsUI";

export const metadata = { title: "Models API — Artemis Docs" };

export default function ModelsApiPage() {
  return (
    <div className="flex">
      <article className="flex-1 min-w-0 px-6 py-10 sm:px-10 sm:py-14 max-w-3xl">
        <Breadcrumb crumbs={[{ label: "docs", href: "/docs" }, { label: "api reference", href: "/docs/api-reference" }, { label: "models" }]} />

        <h1 className="text-4xl sm:text-5xl font-normal text-white tracking-tight leading-[1.1] mb-4">
          Models API
        </h1>
        <p className="text-lg text-zinc-400 leading-relaxed mb-8">
          Trigger training runs, manage model versions, and export trained models.
        </p>
        <hr className="border-white/10 mb-8" />

        <EndpointBlock endpoints={[
          { method: "GET",    path: "/models",                  desc: "List all models in your workspace." },
          { method: "GET",    path: "/models/{id}",             desc: "Get a model and its latest metrics." },
          { method: "POST",   path: "/models/train",            desc: "Start a new training run." },
          { method: "GET",    path: "/models/{id}/runs",        desc: "List all training runs for a model." },
          { method: "GET",    path: "/models/{id}/runs/{runId}",desc: "Get details and logs for a training run." },
          { method: "POST",   path: "/models/{id}/promote",     desc: "Promote a version to active." },
          { method: "POST",   path: "/models/{id}/export",      desc: "Export a model as a ROS 2 package or ONNX file." },
          { method: "DELETE", path: "/models/{id}",             desc: "Delete a model and all its versions." },
        ]} />

        {/* List models */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="list">List Models</h2>
        <div className="flex items-center gap-3 my-3">
          <span className="text-xs font-mono font-semibold bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 rounded px-1.5 py-0.5">GET</span>
          <code className="text-sm font-mono text-zinc-300">/models</code>
        </div>
        <CodeBlock lang="bash">{`curl https://api.kairo.dev/v1/models \\
  -H "Authorization: Bearer kai_live_xxxxxxxxxxxx"`}</CodeBlock>
        <CodeBlock lang="json">{`// 200 OK
{
  "data": [
    {
      "id": "mdl_abc123",
      "name": "arm-model-v1",
      "task": "manipulation",
      "status": "active",
      "active_version": "v2",
      "accuracy": 0.943,
      "robot_id": "rob_a1b2c3d4",
      "created_at": "2026-02-01T09:00:00Z"
    }
  ],
  "total": 1
}`}</CodeBlock>

        {/* Start training */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="train">Start a Training Run</h2>
        <div className="flex items-center gap-3 my-3">
          <span className="text-xs font-mono font-semibold bg-green-400/10 text-green-400 border border-green-400/30 rounded px-1.5 py-0.5">POST</span>
          <code className="text-sm font-mono text-zinc-300">/models/train</code>
        </div>
        <PropTable rows={[
          { field: "dataset_id",   type: "string",  required: true,  desc: "ID of the preprocessed dataset to train on." },
          { field: "robot_id",     type: "string",  required: true,  desc: "Robot this model will be deployed to." },
          { field: "task",         type: "string",  required: true,  desc: "Task type: manipulation, navigation, object_detection, etc." },
          { field: "name",         type: "string",  required: false, desc: "Human-readable name for the model." },
          { field: "architecture", type: "string",  required: false, desc: "Model architecture. Defaults to auto." },
          { field: "config",       type: "object",  required: false, desc: "Training hyperparameters (epochs, learning_rate, batch_size)." },
        ]} />
        <CodeBlock lang="bash">{`curl -X POST https://api.kairo.dev/v1/models/train \\
  -H "Authorization: Bearer kai_live_xxxxxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "dataset_id": "ds_xyz123",
    "robot_id": "rob_a1b2c3d4",
    "task": "manipulation",
    "name": "arm-model-v2",
    "config": {
      "epochs": 30,
      "learning_rate": 0.001,
      "batch_size": 64
    }
  }'`}</CodeBlock>
        <CodeBlock lang="json">{`// 202 Accepted
{
  "model_id": "mdl_abc123",
  "run_id": "run_newrun456",
  "status": "queued",
  "position_in_queue": 1,
  "estimated_duration_s": 360
}`}</CodeBlock>

        {/* Get run */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="run">Get Training Run</h2>
        <div className="flex items-center gap-3 my-3">
          <span className="text-xs font-mono font-semibold bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 rounded px-1.5 py-0.5">GET</span>
          <code className="text-sm font-mono text-zinc-300">/models/{"{id}"}/runs/{"{runId}"}</code>
        </div>
        <CodeBlock lang="json">{`// 200 OK
{
  "run_id": "run_789abc",
  "model_id": "mdl_abc123",
  "status": "complete",
  "started_at": "2026-03-20T08:00:00Z",
  "completed_at": "2026-03-20T08:04:02Z",
  "duration_s": 242,
  "metrics": {
    "final_loss": 0.072,
    "val_loss": 0.091,
    "accuracy": 0.943,
    "val_accuracy": 0.931,
    "epochs_run": 20,
    "inference_latency_p99_ms": 28
  },
  "model_version": "v2",
  "artifact_size_mb": 48
}`}</CodeBlock>

        {/* Export */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="export">Export a Model</h2>
        <div className="flex items-center gap-3 my-3">
          <span className="text-xs font-mono font-semibold bg-green-400/10 text-green-400 border border-green-400/30 rounded px-1.5 py-0.5">POST</span>
          <code className="text-sm font-mono text-zinc-300">/models/{"{id}"}/export</code>
        </div>
        <CodeBlock lang="bash">{`curl -X POST https://api.kairo.dev/v1/models/mdl_abc123/export \\
  -H "Authorization: Bearer kai_live_xxxxxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{ "format": "ros2-pkg", "version": "v2" }'`}</CodeBlock>
        <CodeBlock lang="json">{`// 200 OK
{
  "download_url": "https://exports.kairo.dev/mdl_abc123_v2.tar.gz",
  "expires_at": "2026-03-24T12:00:00Z",
  "format": "ros2-pkg",
  "size_mb": 52
}`}</CodeBlock>

        <Callout type="info">
          Export download links expire after 24 hours. Re-request the export endpoint to generate a new link.
        </Callout>

        <PageFooter
          prev={{ label: "Robots API", href: "/docs/api-reference/robots" }}
          next={{ label: "Deployments API", href: "/docs/api-reference/deployments" }}
        />
      </article>

      <TOC items={[
        { label: "All Endpoints",         href: "#" },
        { label: "List Models",           href: "#list" },
        { label: "Start Training Run",    href: "#train" },
        { label: "Get Training Run",      href: "#run" },
        { label: "Export a Model",        href: "#export" },
      ]} />
    </div>
  );
}
