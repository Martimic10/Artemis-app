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

function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET:    "bg-cyan-400/10 text-cyan-400 border-cyan-400/30",
    POST:   "bg-green-400/10 text-green-400 border-green-400/30",
    PUT:    "bg-yellow-400/10 text-yellow-400 border-yellow-400/30",
    DELETE: "bg-red-400/10 text-red-400 border-red-400/30",
  };
  return (
    <span className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-mono font-semibold ${colors[method] ?? ""}`}>
      {method}
    </span>
  );
}

interface Endpoint {
  method: string;
  path: string;
  desc: string;
}

function EndpointRow({ method, path, desc }: Endpoint) {
  return (
    <div className="flex items-start gap-3 border-b border-white/6 py-3 last:border-b-0">
      <MethodBadge method={method} />
      <div>
        <code className="text-xs font-mono text-zinc-300">{path}</code>
        <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

export const metadata = { title: "API Reference — Artemis Docs" };

export default function ApiReferencePage() {
  return (
    <div className="flex">
      <article className="flex-1 min-w-0 px-6 py-10 sm:px-10 sm:py-14 max-w-3xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-zinc-600 mb-6 font-mono">
          <Link href="/docs" className="hover:text-zinc-400 transition-colors">docs</Link>
          <span>/</span>
          <span className="text-zinc-400">api-reference</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-normal text-white tracking-tight leading-[1.1] mb-4">
          API Reference
        </h1>
        <p className="text-lg text-zinc-400 leading-relaxed mb-8">
          The Artemis REST API lets you programmatically manage robots, trigger training runs,
          push deployments, and retrieve telemetry data.
        </p>

        <hr className="border-white/10 mb-8" />

        {/* Base URL */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="base-url">Base URL</h2>
        <CodeBlock lang="text">https://api.kairo.dev/v1</CodeBlock>
        <p className="text-zinc-400 leading-relaxed">
          All API requests must be made over HTTPS. HTTP requests will be rejected.
        </p>

        {/* Auth */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="authentication">Authentication</h2>
        <p className="text-zinc-400 leading-relaxed mb-3">
          Authenticate by passing your API key in the <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded font-mono">Authorization</code> header
          as a Bearer token:
        </p>
        <CodeBlock lang="bash">{`curl https://api.kairo.dev/v1/robots \\
  -H "Authorization: Bearer kai_live_xxxxxxxxxxxx"`}</CodeBlock>

        <Callout type="warning">
          Never expose your API key in client-side code. Generate separate keys for CI/CD pipelines and local development.
          Keys can be rotated at any time from <strong>Dashboard → Settings → API Keys</strong>.
        </Callout>

        <p className="text-zinc-400 leading-relaxed mb-3">API keys carry three permission scopes:</p>
        <div className="flex flex-col gap-2 my-4">
          {[
            { scope: "read",       desc: "Read robots, models, deployments, and telemetry." },
            { scope: "write",      desc: "Create and update robots, trigger training, push deployments." },
            { scope: "admin",      desc: "Manage team members, billing, and delete resources." },
          ].map((s) => (
            <div key={s.scope} className="flex gap-3 items-start rounded-lg border border-white/8 bg-white/2 px-4 py-3">
              <code className="text-xs font-mono text-cyan-400 shrink-0 w-14">{s.scope}</code>
              <p className="text-xs text-zinc-400">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Rate limits */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="rate-limits">Rate Limits</h2>
        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border border-white/10 rounded-lg overflow-hidden">
            <thead>
              <tr className="border-b border-white/10 bg-white/4">
                <th className="text-left px-4 py-3 text-zinc-400 font-medium">Plan</th>
                <th className="text-left px-4 py-3 text-zinc-400 font-medium">Requests / min</th>
                <th className="text-left px-4 py-3 text-zinc-400 font-medium">Requests / day</th>
              </tr>
            </thead>
            <tbody>
              {[
                { plan: "Starter",  rpm: "60",         rpd: "1,000" },
                { plan: "Builder",  rpm: "300",        rpd: "10,000" },
                { plan: "Pro",      rpm: "Unlimited",  rpd: "Unlimited" },
              ].map((row, i) => (
                <tr key={row.plan} className={`border-b border-white/6 ${i % 2 === 0 ? "" : "bg-white/2"}`}>
                  <td className="px-4 py-3 text-xs text-zinc-300">{row.plan}</td>
                  <td className="px-4 py-3 text-xs font-mono text-zinc-400">{row.rpm}</td>
                  <td className="px-4 py-3 text-xs font-mono text-zinc-400">{row.rpd}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-zinc-400 text-sm leading-relaxed">
          When rate limited, the API returns <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded font-mono">429 Too Many Requests</code>.
          The <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded font-mono">Retry-After</code> header indicates when to retry.
        </p>

        {/* Robots */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="robots">Robots</h2>
        <p className="text-zinc-400 leading-relaxed mb-3">Manage your robot fleet.</p>
        <div className="rounded-lg border border-white/10 overflow-hidden mb-5">
          <div className="px-4 py-3 bg-white/4 border-b border-white/10">
            <span className="text-xs font-mono text-zinc-500">Endpoints</span>
          </div>
          <div className="px-4 py-2">
            {([
              { method: "GET",    path: "/robots",            desc: "List all robots in your fleet." },
              { method: "POST",   path: "/robots",            desc: "Register a new robot." },
              { method: "GET",    path: "/robots/{id}",       desc: "Get a single robot by ID." },
              { method: "PUT",    path: "/robots/{id}",       desc: "Update robot name or metadata." },
              { method: "DELETE", path: "/robots/{id}",       desc: "Remove a robot from the fleet." },
              { method: "GET",    path: "/robots/{id}/status",desc: "Get real-time status and telemetry." },
            ] as Endpoint[]).map((e) => (
              <EndpointRow key={e.path + e.method} {...e} />
            ))}
          </div>
        </div>

        <p className="text-zinc-400 leading-relaxed mb-2">Example — list all robots:</p>
        <CodeBlock lang="bash">{`curl https://api.kairo.dev/v1/robots \\
  -H "Authorization: Bearer kai_live_xxxxxxxxxxxx"

# 200 OK
{
  "data": [
    {
      "id": "rob_a1b2c3d4",
      "name": "my-arm-01",
      "type": "manipulator",
      "status": "online",
      "ros_distro": "humble",
      "created_at": "2026-01-15T10:30:00Z"
    }
  ],
  "total": 1
}`}</CodeBlock>

        {/* Models */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="models">Models</h2>
        <p className="text-zinc-400 leading-relaxed mb-3">Manage AI model training and versioning.</p>
        <div className="rounded-lg border border-white/10 overflow-hidden mb-5">
          <div className="px-4 py-3 bg-white/4 border-b border-white/10">
            <span className="text-xs font-mono text-zinc-500">Endpoints</span>
          </div>
          <div className="px-4 py-2">
            {([
              { method: "GET",  path: "/models",                desc: "List all trained models." },
              { method: "POST", path: "/models/train",          desc: "Start a new training run." },
              { method: "GET",  path: "/models/{id}",           desc: "Get model details and metrics." },
              { method: "GET",  path: "/models/{id}/runs",      desc: "List training run history for a model." },
              { method: "POST", path: "/models/{id}/export",    desc: "Export model as a ROS 2 package." },
              { method: "DELETE",path: "/models/{id}",          desc: "Delete a model and its artifacts." },
            ] as Endpoint[]).map((e) => (
              <EndpointRow key={e.path + e.method} {...e} />
            ))}
          </div>
        </div>

        <p className="text-zinc-400 leading-relaxed mb-2">Example — start a training run:</p>
        <CodeBlock lang="bash">{`curl -X POST https://api.kairo.dev/v1/models/train \\
  -H "Authorization: Bearer kai_live_xxxxxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "dataset_id": "ds_xyz123",
    "robot_id": "rob_a1b2c3d4",
    "task": "manipulation",
    "config": {
      "epochs": 20,
      "learning_rate": "auto"
    }
  }'

# 202 Accepted
{
  "run_id": "run_789abc",
  "status": "queued",
  "estimated_duration_s": 240
}`}</CodeBlock>

        {/* Deployments */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="deployments">Deployments</h2>
        <p className="text-zinc-400 leading-relaxed mb-3">Push models to robots and manage rollouts.</p>
        <div className="rounded-lg border border-white/10 overflow-hidden mb-5">
          <div className="px-4 py-3 bg-white/4 border-b border-white/10">
            <span className="text-xs font-mono text-zinc-500">Endpoints</span>
          </div>
          <div className="px-4 py-2">
            {([
              { method: "GET",  path: "/deployments",              desc: "List all active deployments." },
              { method: "POST", path: "/deployments",              desc: "Deploy a model to a robot." },
              { method: "GET",  path: "/deployments/{id}",         desc: "Get deployment status." },
              { method: "POST", path: "/deployments/{id}/rollback",desc: "Roll back to the previous model version." },
              { method: "DELETE",path: "/deployments/{id}",        desc: "Stop and remove a deployment." },
            ] as Endpoint[]).map((e) => (
              <EndpointRow key={e.path + e.method} {...e} />
            ))}
          </div>
        </div>

        <Callout type="info">
          Rollbacks are instant — Artemis keeps the previous model version cached on the robot for zero-downtime switching.
          Rollback history is retained for 30 days.
        </Callout>

        {/* Errors */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="errors">Error Codes</h2>
        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border border-white/10 rounded-lg overflow-hidden">
            <thead>
              <tr className="border-b border-white/10 bg-white/4">
                <th className="text-left px-4 py-3 text-zinc-400 font-medium">Code</th>
                <th className="text-left px-4 py-3 text-zinc-400 font-medium">Meaning</th>
              </tr>
            </thead>
            <tbody>
              {[
                { code: "400", meaning: "Bad Request — missing or invalid parameters." },
                { code: "401", meaning: "Unauthorized — invalid or missing API key." },
                { code: "403", meaning: "Forbidden — your key lacks the required scope." },
                { code: "404", meaning: "Not Found — resource does not exist." },
                { code: "409", meaning: "Conflict — e.g. a training run is already in progress." },
                { code: "429", meaning: "Too Many Requests — rate limit exceeded." },
                { code: "500", meaning: "Server Error — something went wrong on our end." },
              ].map((row, i) => (
                <tr key={row.code} className={`border-b border-white/6 ${i % 2 === 0 ? "" : "bg-white/2"}`}>
                  <td className="px-4 py-3 font-mono text-xs text-zinc-300">{row.code}</td>
                  <td className="px-4 py-3 text-xs text-zinc-400">{row.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
            { label: "Base URL",        href: "#base-url" },
            { label: "Authentication",  href: "#authentication" },
            { label: "Rate Limits",     href: "#rate-limits" },
            { label: "Robots",          href: "#robots" },
            { label: "Models",          href: "#models" },
            { label: "Deployments",     href: "#deployments" },
            { label: "Error Codes",     href: "#errors" },
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
