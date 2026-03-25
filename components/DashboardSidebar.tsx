"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

const nav = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
        <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
        <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
        <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      </svg>
    ),
  },
  {
    label: "Models",
    href: "/dashboard/models",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 1l6 3.5v7L8 15 2 11.5v-7L8 1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
        <path d="M8 1v14M2 4.5l6 3.5 6-3.5" stroke="currentColor" strokeWidth="1.3"/>
      </svg>
    ),
  },
  {
    label: "Training",
    href: "/dashboard/training",
    badge: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <polyline points="1,11 4,7 7,9 10,4 14,6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M1 14h14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "Deployments",
    href: "/dashboard/deployments",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 2C5 2 3 5 3 5s1 1.5 2.5 2c.5-1 1.5-2 2.5-2s2 1 2.5 2C11.5 6.5 13 5 13 5S11 2 8 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
        <path d="M8 7v7M5.5 11.5l2.5 2 2.5-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="8" cy="7" r="1.5" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: "Playground",
    href: "/dashboard/playground",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/>
        <circle cx="8" cy="8" r="2" fill="currentColor" fillOpacity="0.7"/>
        <path d="M8 2v1M8 13v1M2 8h1M13 8h1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.42 1.42M11.53 11.53l1.42 1.42M3.05 12.95l1.42-1.42M11.53 4.47l1.42-1.42" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
];

const menuItems = [
  {
    label: "Upgrade to Pro",
    href: "/dashboard/settings?tab=Plans",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 1l1.5 3.5L12 5l-2.5 2.5.5 3.5L7 9.5 4 11l.5-3.5L2 5l3.5-.5L7 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
      </svg>
    ),
    className: "text-cyan-400",
  },
  {
    label: "Account",
    href: "/dashboard/settings?tab=Profile",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M1.5 12.5c0-2.5 2.5-4 5.5-4s5.5 1.5 5.5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "Billing",
    href: "/dashboard/settings?tab=Billing",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="1" y="3" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M1 6h12" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M4 9h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "Notifications",
    href: "/dashboard/settings?tab=Notifications",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 1.5C4.8 1.5 3 3.3 3 5.5v3l-1 1.5h10l-1-1.5v-3c0-2.2-1.8-4-4-4z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
        <path d="M5.5 10.5c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5" stroke="currentColor" strokeWidth="1.2"/>
      </svg>
    ),
  },
];

function ToggleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="2" width="13" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M5.5 2v12" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  );
}

function UserAvatar({ size = "sm" }: { size?: "sm" | "md" }) {
  const sz = size === "md" ? "h-8 w-8 text-sm" : "h-7 w-7 text-xs";
  return (
    <div className={`${sz} rounded-full bg-linear-to-br from-cyan-400 to-blue-500 flex items-center justify-center shrink-0`}>
      <span className="font-semibold text-black">M</span>
    </div>
  );
}

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <aside
      className={`shrink-0 border-r border-[#1a1a1a] bg-[#0a0a0a] flex flex-col h-screen sticky top-0 transition-all duration-200 ${
        collapsed ? "w-14" : "w-56"
      }`}
    >
      {/* Logo row */}
      <div className={`flex items-center h-14 border-b border-[#1a1a1a] shrink-0 ${collapsed ? "justify-center px-0" : "px-4 gap-2.5"}`}>
        {/* Cyan square = toggle button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="group relative flex items-center justify-center shrink-0"
        >
          <div className="h-6 w-6 rounded-sm bg-cyan-400 transition-transform duration-300 group-hover:rotate-90" />
          {collapsed && (
            <span className="absolute inset-0 flex items-center justify-center text-black opacity-70">
              <ToggleIcon />
            </span>
          )}
        </button>

        {!collapsed && (
          <>
            <Link href="/" className="text-sm font-semibold text-white hover:text-zinc-300 transition-colors">
              Artemis
            </Link>
            <button
              onClick={() => setCollapsed(true)}
              title="Collapse sidebar"
              className="ml-auto text-zinc-600 hover:text-white transition-colors"
            >
              <ToggleIcon />
            </button>
          </>
        )}
      </div>

      {/* Nav */}
      <nav className={`flex-1 py-4 flex flex-col gap-0.5 overflow-y-auto ${collapsed ? "px-2 items-center" : "px-3"}`}>
        {nav.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`relative flex items-center rounded-lg transition-all ${
                collapsed
                  ? "w-9 h-9 justify-center"
                  : "gap-3 px-3 py-2 w-full"
              } text-sm ${
                active
                  ? "bg-white/8 text-white"
                  : "text-zinc-500 hover:text-white hover:bg-white/4"
              }`}
            >
              <span className={`shrink-0 ${active ? "text-white" : "text-zinc-600"}`}>{item.icon}</span>
              {!collapsed && item.label}
              {"badge" in item && item.badge && (
                collapsed
                  ? <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  : <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className={`border-t border-[#1a1a1a] p-2 space-y-0.5 shrink-0 ${collapsed ? "flex flex-col items-center" : ""}`}>
        <Link
          href="/docs"
          title={collapsed ? "Documentation" : undefined}
          className={`flex items-center rounded-lg text-zinc-600 hover:text-white hover:bg-white/4 transition-all ${
            collapsed ? "w-9 h-9 justify-center" : "gap-3 px-3 py-2 w-full text-sm"
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="1" width="10" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M5 5h5M5 8h5M5 11h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          {!collapsed && "Documentation"}
        </Link>

        {/* User menu */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            title={collapsed ? "Account" : undefined}
            className={`w-full flex items-center rounded-lg hover:bg-white/4 transition-colors ${
              collapsed ? "w-9 h-9 justify-center" : "gap-3 px-3 py-2"
            }`}
          >
            <UserAvatar />
            {!collapsed && (
              <>
                <div className="min-w-0 flex-1 text-left">
                  <p className="text-xs font-medium text-white truncate">Michael Martinez</p>
                  <p className="text-[10px] text-zinc-500 truncate">michael@artemis.dev</p>
                </div>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-zinc-500 shrink-0">
                  <path d="M4 5l3-3 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 9l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            )}
          </button>

          {/* Popup menu */}
          {menuOpen && (
            <div className="absolute bottom-full left-0 mb-2 w-64 rounded-xl border border-[#2a2a2a] bg-[#111] shadow-2xl overflow-hidden z-50">
              {/* Profile header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1e1e1e]">
                <UserAvatar size="md" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">Michael Martinez</p>
                  <p className="text-xs text-zinc-500 truncate">michael@artemis.dev</p>
                </div>
              </div>

              {/* Menu items */}
              <div className="p-1">
                {menuItems.map((item) => {
                  const inner = (
                    <>
                      <span className={item.className ?? "text-zinc-400"}>{item.icon}</span>
                      <span className={`text-sm ${item.className ?? "text-zinc-300"}`}>{item.label}</span>
                    </>
                  );
                  return item.href ? (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors w-full"
                    >
                      {inner}
                    </Link>
                  ) : (
                    <button
                      key={item.label}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors w-full"
                    >
                      {inner}
                    </button>
                  );
                })}
              </div>

              {/* Log out */}
              <div className="border-t border-[#1e1e1e] p-1">
                <button
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors w-full"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-zinc-400">
                    <path d="M5 2H2.5A1.5 1.5 0 001 3.5v7A1.5 1.5 0 002.5 12H5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    <path d="M9 10l3-3-3-3M12 7H5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-sm text-zinc-300">Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
