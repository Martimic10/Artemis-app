"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const nav: NavSection[] = [
  {
    title: "Getting Started",
    items: [
      { label: "Introduction",  href: "/docs" },
      { label: "Quick Start",   href: "/docs/quick-start" },
      { label: "Installation",  href: "/docs/installation" },
    ],
  },
  {
    title: "Core Concepts",
    items: [
      { label: "Robots & Fleets",   href: "/docs/concepts/robots" },
      { label: "AI Models",         href: "/docs/concepts/models" },
      { label: "Data Pipeline",     href: "/docs/concepts/data-pipeline" },
    ],
  },
  {
    title: "Guides",
    items: [
      { label: "ROS 2 Guide",            href: "/docs/ros2-guide" },
      { label: "Training Your First Model", href: "/docs/guides/training" },
      { label: "Deploying to Production",   href: "/docs/guides/deploying" },
      { label: "Fleet Monitoring",          href: "/docs/guides/monitoring" },
    ],
  },
  {
    title: "API Reference",
    items: [
      { label: "Overview",    href: "/docs/api-reference" },
      { label: "Robots",      href: "/docs/api-reference/robots" },
      { label: "Models",      href: "/docs/api-reference/models" },
      { label: "Deployments", href: "/docs/api-reference/deployments" },
    ],
  },
];

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12" height="12" viewBox="0 0 12 12" fill="none"
      className={`shrink-0 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
    >
      <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function DocsSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  function toggle(title: string) {
    setCollapsed((prev) => ({ ...prev, [title]: !prev[title] }));
  }

  return (
    <aside className="w-60 shrink-0 border-r border-white/10 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto hidden md:block">
      <nav className="px-3 py-5">
        {nav.map((section) => {
          const isOpen = !collapsed[section.title];
          return (
            <div key={section.title} className="mb-5">
              <button
                onClick={() => toggle(section.title)}
                className="flex w-full items-center justify-between px-2 py-1 text-xs font-semibold uppercase tracking-widest text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {section.title}
                <ChevronIcon open={isOpen} />
              </button>

              {isOpen && (
                <ul className="mt-1 flex flex-col gap-0.5">
                  {section.items.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${
                            active
                              ? "bg-cyan-400/10 text-cyan-400 font-medium"
                              : "text-zinc-400 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          {active && (
                            <span className="h-1 w-1 rounded-full bg-cyan-400 shrink-0" />
                          )}
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
