import { Breadcrumb, Callout, CodeBlock, TOC, PageFooter } from "@/components/DocsUI";

export const metadata = { title: "AI Models — Artemis Docs" };

export default function ModelsConceptPage() {
  return (
    <div className="flex">
      <article className="flex-1 min-w-0 px-6 py-10 sm:px-10 sm:py-14 max-w-3xl">
        <Breadcrumb crumbs={[{ label: "docs", href: "/docs" }, { label: "concepts", href: "/docs/concepts/models" }, { label: "ai models" }]} />

        <h1 className="text-4xl sm:text-5xl font-normal text-white tracking-tight leading-[1.1] mb-4">
          AI Models
        </h1>
        <p className="text-lg text-zinc-400 leading-relaxed mb-8">
          Understand how Artemis trains, versions, and manages AI models — from raw data to a deployed ROS 2 node.
        </p>
        <hr className="border-white/10 mb-8" />

        {/* Overview */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="overview">Overview</h2>
        <p className="text-zinc-400 leading-relaxed mb-4">
          A Artemis <strong className="text-white">model</strong> is a trained neural network packaged as a ROS 2-compatible inference node.
          Artemis handles architecture selection, training, packaging, and deployment — you only need to supply labelled data and describe the task.
        </p>
        <p className="text-zinc-400 leading-relaxed mb-4">
          Every model belongs to a specific robot type and task. Models are immutable once training completes — to improve a model, you create a new training run and promote the result as the active version.
        </p>

        {/* Task types */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="task-types">Supported Task Types</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-5">
          {[
            { task: "manipulation",     desc: "Pick-and-place, grasping, joint control from visual or proprioceptive input." },
            { task: "navigation",       desc: "Obstacle avoidance, path following, and localisation for mobile robots." },
            { task: "object_detection", desc: "Detect and classify objects in camera feeds in real time." },
            { task: "anomaly_detection",desc: "Flag unexpected robot behaviour or environmental changes." },
            { task: "classification",   desc: "Classify sensor readings into discrete categories." },
            { task: "regression",       desc: "Predict continuous control signals from sensor state." },
          ].map((t) => (
            <div key={t.task} className="rounded-lg border border-white/10 bg-white/2 px-4 py-3">
              <code className="text-xs font-mono text-cyan-400">{t.task}</code>
              <p className="mt-1 text-xs text-zinc-500 leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>

        {/* Architecture selection */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="architecture">Architecture Selection</h2>
        <p className="text-zinc-400 leading-relaxed mb-4">
          Artemis automatically selects the best neural network architecture for your task and dataset size using an internal benchmarking pipeline.
          For most use cases, the default <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded font-mono">auto</code> setting produces optimal results.
        </p>
        <p className="text-zinc-400 leading-relaxed mb-2">
          Pro and Business plans can manually specify an architecture:
        </p>
        <CodeBlock lang="bash">{`kairo train start \\
  --dataset ds_xyz123 \\
  --robot rob_a1b2c3d4 \\
  --task manipulation \\
  --architecture transformer_v2   # or: cnn_light, lstm_ctrl, auto`}</CodeBlock>

        <Callout type="info">
          Custom architectures (Business plan) let you supply a PyTorch model definition. Artemis wraps it in the standard deployment package and handles the ROS 2 node boilerplate.
        </Callout>

        {/* Versioning */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="versioning">Model Versioning</h2>
        <p className="text-zinc-400 leading-relaxed mb-4">
          Every training run produces a new model version. Versions are numbered sequentially (v1, v2, …) and are permanently stored.
          Only one version is <strong className="text-white">active</strong> on a given robot at a time — the active version is what receives live inference requests.
        </p>
        <p className="text-zinc-400 leading-relaxed mb-2">List versions and promote one to active:</p>
        <CodeBlock lang="bash">{`kairo model versions --model mdl_abc123

# v1  trained 2026-01-10  accuracy: 87.2%  status: archived
# v2  trained 2026-02-01  accuracy: 91.5%  status: active
# v3  trained 2026-03-20  accuracy: 94.3%  status: staging

# Promote v3 to active
kairo model promote --model mdl_abc123 --version v3`}</CodeBlock>

        {/* Lifecycle */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="lifecycle">Model Lifecycle</h2>
        <div className="flex flex-col gap-2 my-5">
          {[
            { state: "training",   desc: "The model is actively being trained on GPU infrastructure." },
            { state: "staging",    desc: "Training is complete. The model is ready for simulation testing before promotion." },
            { state: "active",     desc: "The model is deployed and serving live inference requests on at least one robot." },
            { state: "archived",   desc: "A previous version that was superseded. Still available for rollback." },
            { state: "failed",     desc: "Training failed. View the run log for the error details." },
          ].map((s) => (
            <div key={s.state} className="flex gap-3 items-start rounded-lg border border-white/8 bg-white/2 px-4 py-3">
              <code className="text-xs font-mono text-cyan-400 shrink-0 w-20 mt-0.5">{s.state}</code>
              <p className="text-xs text-zinc-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Export */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="export">Exporting Models</h2>
        <p className="text-zinc-400 leading-relaxed mb-2">
          Export a trained model as a standalone ROS 2 package for air-gapped or self-managed deployments:
        </p>
        <CodeBlock lang="bash">{`kairo model export --model mdl_abc123 --version v2 --format ros2-pkg

# Output: kairo_model_v2.tar.gz
# Contains:
#   - ROS 2 package (Python node + launch file)
#   - model weights (.onnx)
#   - package.xml + CMakeLists.txt`}</CodeBlock>

        <Callout type="tip">
          ONNX format is also available for integration with non-ROS systems: <code className="font-mono text-xs">--format onnx</code>
        </Callout>

        <PageFooter
          prev={{ label: "Robots & Fleets", href: "/docs/concepts/robots" }}
          next={{ label: "Data Pipeline", href: "/docs/concepts/data-pipeline" }}
        />
      </article>

      <TOC items={[
        { label: "Overview",             href: "#overview" },
        { label: "Task Types",           href: "#task-types" },
        { label: "Architecture Selection", href: "#architecture" },
        { label: "Model Versioning",     href: "#versioning" },
        { label: "Model Lifecycle",      href: "#lifecycle" },
        { label: "Exporting Models",     href: "#export" },
      ]} />
    </div>
  );
}
