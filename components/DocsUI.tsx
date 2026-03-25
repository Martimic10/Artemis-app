import Link from "next/link";

// ── Callout ────────────────────────────────────────────────────────────────────
export function Callout({ type, children }: { type: "info" | "tip" | "warning"; children: React.ReactNode }) {
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

// ── CodeBlock ──────────────────────────────────────────────────────────────────
export function CodeBlock({ lang, children }: { lang: string; children: string }) {
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

// ── StepBadge ─────────────────────────────────────────────────────────────────
export function StepBadge({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-xs font-mono text-cyan-400 shrink-0 mt-0.5">
      {n}
    </span>
  );
}

// ── MethodBadge ───────────────────────────────────────────────────────────────
export function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET:    "bg-cyan-400/10 text-cyan-400 border-cyan-400/30",
    POST:   "bg-green-400/10 text-green-400 border-green-400/30",
    PUT:    "bg-yellow-400/10 text-yellow-400 border-yellow-400/30",
    DELETE: "bg-red-400/10 text-red-400 border-red-400/30",
    PATCH:  "bg-purple-400/10 text-purple-400 border-purple-400/30",
  };
  return (
    <span className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-mono font-semibold shrink-0 ${colors[method] ?? ""}`}>
      {method}
    </span>
  );
}

// ── EndpointRow ───────────────────────────────────────────────────────────────
export function EndpointRow({ method, path, desc }: { method: string; path: string; desc: string }) {
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

// ── EndpointBlock ─────────────────────────────────────────────────────────────
export function EndpointBlock({ endpoints }: { endpoints: { method: string; path: string; desc: string }[] }) {
  return (
    <div className="rounded-lg border border-white/10 overflow-hidden my-5">
      <div className="px-4 py-3 bg-white/4 border-b border-white/10">
        <span className="text-xs font-mono text-zinc-500">Endpoints</span>
      </div>
      <div className="px-4 py-2">
        {endpoints.map((e) => <EndpointRow key={e.method + e.path} {...e} />)}
      </div>
    </div>
  );
}

// ── PropTable ─────────────────────────────────────────────────────────────────
export function PropTable({ rows }: { rows: { field: string; type: string; required?: boolean; desc: string }[] }) {
  return (
    <div className="overflow-x-auto my-5">
      <table className="w-full text-sm border border-white/10 rounded-lg overflow-hidden">
        <thead>
          <tr className="border-b border-white/10 bg-white/4">
            <th className="text-left px-4 py-3 text-zinc-400 font-medium text-xs">Field</th>
            <th className="text-left px-4 py-3 text-zinc-400 font-medium text-xs">Type</th>
            <th className="text-left px-4 py-3 text-zinc-400 font-medium text-xs">Required</th>
            <th className="text-left px-4 py-3 text-zinc-400 font-medium text-xs">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.field} className={`border-b border-white/6 ${i % 2 === 0 ? "" : "bg-white/2"}`}>
              <td className="px-4 py-3 font-mono text-xs text-cyan-400/80">{row.field}</td>
              <td className="px-4 py-3 font-mono text-xs text-zinc-400">{row.type}</td>
              <td className="px-4 py-3 text-xs">{row.required ? <span className="text-red-400">Yes</span> : <span className="text-zinc-600">No</span>}</td>
              <td className="px-4 py-3 text-xs text-zinc-400 leading-relaxed">{row.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Breadcrumb ────────────────────────────────────────────────────────────────
export function Breadcrumb({ crumbs }: { crumbs: { label: string; href?: string }[] }) {
  return (
    <div className="flex items-center gap-2 text-xs text-zinc-600 mb-6 font-mono flex-wrap">
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span>/</span>}
          {crumb.href ? (
            <Link href={crumb.href} className="hover:text-zinc-400 transition-colors">{crumb.label}</Link>
          ) : (
            <span className="text-zinc-400">{crumb.label}</span>
          )}
        </span>
      ))}
    </div>
  );
}

// ── TOC ───────────────────────────────────────────────────────────────────────
export function TOC({ items }: { items: { label: string; href: string }[] }) {
  return (
    <aside className="w-52 shrink-0 py-14 pr-6 hidden xl:block">
      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-600 mb-3">On this page</p>
      <nav className="flex flex-col gap-1">
        {items.map((item) => (
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
  );
}

// ── PageFooter ────────────────────────────────────────────────────────────────
export function PageFooter({ prev, next }: { prev?: { label: string; href: string }; next?: { label: string; href: string } }) {
  return (
    <div className="mt-14 border-t border-white/10 pt-6 space-y-4">
      <div className="flex items-center justify-between gap-4">
        {prev ? (
          <Link href={prev.href} className="group flex items-center gap-2 rounded-lg border border-white/10 px-4 py-3 hover:border-white/20 transition-colors">
            <span className="text-zinc-600 group-hover:text-zinc-300">←</span>
            <div>
              <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-mono">Previous</p>
              <p className="text-sm text-zinc-400 group-hover:text-white transition-colors">{prev.label}</p>
            </div>
          </Link>
        ) : <div />}
        {next ? (
          <Link href={next.href} className="group flex items-center gap-2 rounded-lg border border-white/10 px-4 py-3 hover:border-white/20 transition-colors text-right ml-auto">
            <div>
              <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-mono">Next</p>
              <p className="text-sm text-zinc-400 group-hover:text-white transition-colors">{next.label}</p>
            </div>
            <span className="text-zinc-600 group-hover:text-zinc-300">→</span>
          </Link>
        ) : null}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-600">Was this page helpful?</span>
        <div className="flex items-center gap-2">
          <button className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-zinc-500 hover:text-white hover:border-white/20 transition-colors">Yes</button>
          <button className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-zinc-500 hover:text-white hover:border-white/20 transition-colors">No</button>
        </div>
      </div>
    </div>
  );
}
