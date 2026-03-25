import { Breadcrumb, Callout, CodeBlock, StepBadge, TOC, PageFooter } from "@/components/DocsUI";

export const metadata = { title: "Training Your First Model — Artemis Docs" };

export default function TrainingGuidePage() {
  return (
    <div className="flex">
      <article className="flex-1 min-w-0 px-6 py-10 sm:px-10 sm:py-14 max-w-3xl">
        <Breadcrumb crumbs={[{ label: "docs", href: "/docs" }, { label: "guides", href: "/docs/guides/training" }, { label: "training your first model" }]} />

        <h1 className="text-4xl sm:text-5xl font-normal text-white tracking-tight leading-[1.1] mb-4">
          Training Your First Model
        </h1>
        <p className="text-lg text-zinc-400 leading-relaxed mb-8">
          A step-by-step walkthrough of preparing data, launching a training run, interpreting results,
          and promoting a model to staging.
        </p>
        <hr className="border-white/10 mb-8" />

        <Callout type="info">
          This guide uses a manipulator arm example throughout. The same steps apply to all robot types and tasks.
        </Callout>

        {/* Step 1 */}
        <h2 className="flex items-center gap-3 text-2xl font-normal text-white mt-10 mb-3" id="prepare">
          <StepBadge n={1} /> Prepare Your Dataset
        </h2>
        <p className="text-zinc-400 leading-relaxed mb-3">
          Good training data is the most important factor in model quality. Before uploading, review your recordings:
        </p>
        <ul className="flex flex-col gap-2 text-sm text-zinc-400 mb-4">
          <li className="flex gap-2"><span className="text-cyan-400">→</span> Aim for at least <strong className="text-white">500 complete task demonstrations</strong> for manipulation tasks</li>
          <li className="flex gap-2"><span className="text-cyan-400">→</span> Recordings should cover edge cases — avoid a dataset of only perfect runs</li>
          <li className="flex gap-2"><span className="text-cyan-400">→</span> Keep input topics consistent: same sensor, same QoS, same frequency</li>
          <li className="flex gap-2"><span className="text-cyan-400">→</span> Remove recordings where the robot failed catastrophically (E-stop triggered, etc.)</li>
        </ul>
        <p className="text-zinc-400 leading-relaxed mb-2">Upload your prepared dataset:</p>
        <CodeBlock lang="bash">{`kairo data upload ./arm_demos.bag \\
  --robot rob_a1b2c3d4 \\
  --label "arm-pick-place-v1"

# Uploading: 100% ████████████████████ 2.1 GB
# Dataset ID: ds_xyz123
# Status: preprocessing`}</CodeBlock>
        <p className="text-zinc-400 leading-relaxed mt-2">Wait for preprocessing to complete (usually 2–5 minutes):</p>
        <CodeBlock lang="bash">{`kairo data status --dataset ds_xyz123
# Status: ready  |  Samples: 12,480  |  Size: 2.1 GB`}</CodeBlock>

        {/* Step 2 */}
        <h2 className="flex items-center gap-3 text-2xl font-normal text-white mt-10 mb-3" id="launch">
          <StepBadge n={2} /> Launch a Training Run
        </h2>
        <p className="text-zinc-400 leading-relaxed mb-2">Start training with the dataset you just uploaded:</p>
        <CodeBlock lang="bash">{`kairo train start \\
  --dataset ds_xyz123 \\
  --robot rob_a1b2c3d4 \\
  --task manipulation \\
  --name "arm-model-v1"

# Training run started: run_789abc
# Estimated duration: ~4 minutes
# View logs: kairo train logs --run run_789abc --follow`}</CodeBlock>

        <Callout type="tip">
          Give your runs descriptive names. They show up in the dashboard history and make it easy to compare results across experiments.
        </Callout>

        {/* Step 3 */}
        <h2 className="flex items-center gap-3 text-2xl font-normal text-white mt-10 mb-3" id="monitor">
          <StepBadge n={3} /> Monitor Training Progress
        </h2>
        <p className="text-zinc-400 leading-relaxed mb-2">Stream live logs from the training run:</p>
        <CodeBlock lang="bash">{`kairo train logs --run run_789abc --follow

[00:00] Initialising training environment...
[00:12] Preprocessing complete — 12,480 samples loaded
[00:45] Epoch  1/20 — loss: 0.512  val_loss: 0.498
[01:30] Epoch  5/20 — loss: 0.241  val_loss: 0.259
[02:15] Epoch 10/20 — loss: 0.148  val_loss: 0.162
[03:00] Epoch 15/20 — loss: 0.098  val_loss: 0.119
[03:45] Epoch 20/20 — loss: 0.072  val_loss: 0.091
[03:52] Training complete.
        Accuracy: 94.3%  |  Val accuracy: 93.1%
        Model size: 48 MB (quantised: 12 MB)
[03:55] Packaging as ROS 2 node...
[03:58] Model ready: mdl_abc123 (v1)`}</CodeBlock>
        <p className="text-zinc-400 leading-relaxed mt-3 mb-2">
          You can also view training metrics in real time from the dashboard under <strong className="text-white">Models → Runs</strong>.
          The dashboard shows loss curves, accuracy over epochs, and a comparison against previous runs.
        </p>

        {/* Step 4 */}
        <h2 className="flex items-center gap-3 text-2xl font-normal text-white mt-10 mb-3" id="evaluate">
          <StepBadge n={4} /> Evaluate Results
        </h2>
        <p className="text-zinc-400 leading-relaxed mb-2">Once training completes, inspect the model&apos;s metrics:</p>
        <CodeBlock lang="bash">{`kairo model info --model mdl_abc123

# Name:           arm-model-v1
# Task:           manipulation
# Architecture:   transformer_v2 (auto-selected)
# Training time:  3m 58s
# Accuracy:       94.3%
# Val accuracy:   93.1%
# Inference latency (p50): 12 ms
# Inference latency (p99): 28 ms
# Model size:     48 MB  |  Quantised: 12 MB
# Status:         staging`}</CodeBlock>

        <Callout type="warning">
          A high training accuracy with significantly lower validation accuracy (gap &gt; 5%) indicates overfitting.
          Try collecting more diverse data or use the <code className="font-mono text-xs">--augment</code> flag to enable data augmentation.
        </Callout>

        {/* Step 5 */}
        <h2 className="flex items-center gap-3 text-2xl font-normal text-white mt-10 mb-3" id="promote">
          <StepBadge n={5} /> Promote to Active
        </h2>
        <p className="text-zinc-400 leading-relaxed mb-2">
          If you&apos;re satisfied with the results, run the model in simulation first, then promote it:
        </p>
        <CodeBlock lang="bash">{`# Optional: test in simulation before promoting
kairo simulate --model mdl_abc123 --env gazebo

# Promote v1 to active
kairo model promote --model mdl_abc123 --version v1

# Deploy to your robot
kairo deploy push --model mdl_abc123 --robot rob_a1b2c3d4`}</CodeBlock>

        <PageFooter
          prev={{ label: "ROS 2 Guide", href: "/docs/ros2-guide" }}
          next={{ label: "Deploying to Production", href: "/docs/guides/deploying" }}
        />
      </article>

      <TOC items={[
        { label: "1. Prepare Dataset",    href: "#prepare" },
        { label: "2. Launch Training",    href: "#launch" },
        { label: "3. Monitor Progress",   href: "#monitor" },
        { label: "4. Evaluate Results",   href: "#evaluate" },
        { label: "5. Promote to Active",  href: "#promote" },
      ]} />
    </div>
  );
}
