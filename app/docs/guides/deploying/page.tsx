import { Breadcrumb, Callout, CodeBlock, StepBadge, TOC, PageFooter } from "@/components/DocsUI";

export const metadata = { title: "Deploying to Production — Artemis Docs" };

export default function DeployingGuidePage() {
  return (
    <div className="flex">
      <article className="flex-1 min-w-0 px-6 py-10 sm:px-10 sm:py-14 max-w-3xl">
        <Breadcrumb crumbs={[{ label: "docs", href: "/docs" }, { label: "guides", href: "/docs/guides/deploying" }, { label: "deploying to production" }]} />

        <h1 className="text-4xl sm:text-5xl font-normal text-white tracking-tight leading-[1.1] mb-4">
          Deploying to Production
        </h1>
        <p className="text-lg text-zinc-400 leading-relaxed mb-8">
          Best practices for safely rolling out AI models to live robots — including simulation testing,
          staged rollouts, and rollback strategies.
        </p>
        <hr className="border-white/10 mb-8" />

        {/* Checklist */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="checklist">Pre-Deployment Checklist</h2>
        <p className="text-zinc-400 leading-relaxed mb-3">Before pushing any model to live hardware, verify:</p>
        <ul className="flex flex-col gap-2.5 my-4">
          {[
            "Model accuracy ≥ your defined acceptance threshold",
            "Validation loss has converged (no large gap vs. training loss)",
            "Inference latency p99 is within your real-time budget",
            "Model has passed simulation testing (see Step 1)",
            "A rollback target is identified (previous active version)",
            "Monitoring alerts are configured for this robot",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-zinc-400">
              <span className="mt-1 h-2 w-2 rounded-full border border-white/20 shrink-0" />
              {item}
            </li>
          ))}
        </ul>

        {/* Step 1 */}
        <h2 className="flex items-center gap-3 text-2xl font-normal text-white mt-10 mb-3" id="simulate">
          <StepBadge n={1} /> Run Simulation Tests
        </h2>
        <p className="text-zinc-400 leading-relaxed mb-2">
          Artemis integrates with Gazebo and Webots for hardware-in-the-loop testing. Run your model against a physics simulation before touching live hardware:
        </p>
        <CodeBlock lang="bash">{`kairo simulate \\
  --model mdl_abc123 \\
  --env gazebo \\
  --scenario pick-place-standard \\
  --runs 100

# Running 100 simulation episodes...
# Success rate:      96/100 (96%)
# Avg cycle time:    4.2 s
# Collision events:  2
# Simulation report: sim_rpt_xyz.pdf`}</CodeBlock>

        <Callout type="warning">
          A simulation success rate below 90% is a strong signal the model needs more training data before production deployment.
        </Callout>

        {/* Step 2 */}
        <h2 className="flex items-center gap-3 text-2xl font-normal text-white mt-10 mb-3" id="staged">
          <StepBadge n={2} /> Staged Rollout
        </h2>
        <p className="text-zinc-400 leading-relaxed mb-2">
          For fleets with multiple robots, always use a staged rollout. Deploy to a small percentage first, monitor for 30 minutes, then complete the rollout:
        </p>
        <CodeBlock lang="bash">{`# Deploy to 20% of the fleet first
kairo deploy push \\
  --model mdl_abc123 \\
  --fleet flt_xyz123 \\
  --rollout-percent 20

# Check status after 30 minutes
kairo deploy status --fleet flt_xyz123

# If healthy, complete the rollout
kairo deploy complete --fleet flt_xyz123`}</CodeBlock>
        <p className="text-zinc-400 leading-relaxed mt-2">Or deploy to a specific robot for initial validation:</p>
        <CodeBlock lang="bash">{`kairo deploy push \\
  --model mdl_abc123 \\
  --robot rob_a1b2c3d4   # canary robot`}</CodeBlock>

        {/* Step 3 */}
        <h2 className="flex items-center gap-3 text-2xl font-normal text-white mt-10 mb-3" id="push">
          <StepBadge n={3} /> Full Production Push
        </h2>
        <p className="text-zinc-400 leading-relaxed mb-2">Once validation passes, deploy to all robots:</p>
        <CodeBlock lang="bash">{`kairo deploy push \\
  --model mdl_abc123 \\
  --fleet flt_xyz123

# Deploying to 24 robots...
# [████████████████████] 24/24 complete
# All robots running mdl_abc123 v2`}</CodeBlock>

        <Callout type="info">
          Deployments are zero-downtime. Artemis loads the new model weights alongside the running model, switches inference traffic once the new node is healthy, then unloads the old model.
        </Callout>

        {/* Step 4 */}
        <h2 className="flex items-center gap-3 text-2xl font-normal text-white mt-10 mb-3" id="rollback">
          <StepBadge n={4} /> Rolling Back
        </h2>
        <p className="text-zinc-400 leading-relaxed mb-2">
          If a deployment causes issues, rollback to the previous version instantly:
        </p>
        <CodeBlock lang="bash">{`# Rollback a single robot
kairo deploy rollback --robot rob_a1b2c3d4

# Rollback the entire fleet
kairo deploy rollback --fleet flt_xyz123

# Rollback to a specific version
kairo deploy rollback \\
  --robot rob_a1b2c3d4 \\
  --version v1`}</CodeBlock>
        <p className="text-zinc-400 leading-relaxed mt-2">
          Artemis caches the two most recent deployed versions on each robot, so rollbacks complete in under 5 seconds without re-downloading model weights.
        </p>

        {/* Auto-rollback */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="auto-rollback">Automatic Rollback</h2>
        <p className="text-zinc-400 leading-relaxed mb-2">
          Configure automatic rollback triggers in your deployment config. If a metric breaches a threshold after a new deployment, Artemis rolls back automatically:
        </p>
        <CodeBlock lang="yaml">{`# kairo-deploy.yaml
auto_rollback:
  enabled: true
  window: 10m          # evaluate metrics for 10 min after deploy
  triggers:
    - metric: error_rate
      threshold: 0.05  # rollback if error rate exceeds 5%
    - metric: inference_latency_p99
      threshold: 100ms # rollback if p99 latency exceeds 100 ms`}</CodeBlock>

        <PageFooter
          prev={{ label: "Training Your First Model", href: "/docs/guides/training" }}
          next={{ label: "Fleet Monitoring", href: "/docs/guides/monitoring" }}
        />
      </article>

      <TOC items={[
        { label: "Pre-Deployment Checklist", href: "#checklist" },
        { label: "1. Simulation Tests",      href: "#simulate" },
        { label: "2. Staged Rollout",        href: "#staged" },
        { label: "3. Full Production Push",  href: "#push" },
        { label: "4. Rolling Back",          href: "#rollback" },
        { label: "Automatic Rollback",       href: "#auto-rollback" },
      ]} />
    </div>
  );
}
