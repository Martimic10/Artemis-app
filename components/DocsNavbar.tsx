import Link from "next/link";
import DocsSearch from "@/components/DocsSearch";

export default function DocsNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-md">
      <div className="flex h-14 items-center gap-4 px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5 shrink-0">
          <div className="h-5 w-5 rounded-sm bg-cyan-400 transition-transform duration-300 group-hover:rotate-90" />
          <span className="text-base font-semibold text-white">Artemis</span>
          <span className="ml-1 rounded border border-white/15 px-1.5 py-0.5 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            Docs
          </span>
        </Link>

        {/* Divider */}
        <div className="h-5 w-px bg-white/10 hidden sm:block" />

        {/* Search */}
        <div className="flex-1 max-w-sm hidden sm:block">
          <DocsSearch />
        </div>

        {/* Right links */}
        <div className="ml-auto flex items-center gap-3 sm:gap-5">
          <Link
            href="/docs/api-reference"
            className="hidden sm:block text-sm text-zinc-500 hover:text-white transition-colors"
          >
            API Reference
          </Link>

          {/* GitHub */}
          <Link
            href="#"
            aria-label="GitHub"
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
          </Link>

          <Link
            href="/"
            className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-zinc-400 hover:text-white hover:border-white/30 transition-colors"
          >
            ← Back to site
          </Link>
        </div>
      </div>
    </header>
  );
}
