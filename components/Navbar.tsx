"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { label: "Features",    href: "#features" },
  { label: "How It Works",href: "#how-it-works" },
  { label: "Resources",   href: "#resources", dropdown: true },
  { label: "Pricing",     href: "/pricing" },
];

const resourceItems = [
  { label: "Docs / Guides",  href: "/docs" },
  { label: "Integrations",   href: "#" },
  { label: "Blogs",          href: "#" },
  { label: "Waitlist",       href: "/waitlist" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-white/20 bg-black/90 backdrop-blur-md">
      <div className="relative flex h-16 sm:h-24 items-center justify-between px-5 sm:px-10">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="h-7 w-7 rounded-sm bg-cyan-400 transition-transform duration-300 group-hover:rotate-90" />
          <span className="text-xl font-semibold tracking-tight text-white">
            Artemis
          </span>
        </Link>

        {/* Desktop Nav — absolutely centered */}
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
          {navLinks.map((link) =>
            link.dropdown ? (
              <div key={link.href} className="relative group">
                {/* Trigger */}
                <button className="flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-white">
                  {link.label}
                  <svg
                    width="12" height="12" viewBox="0 0 12 12" fill="none"
                    className="transition-transform duration-200 group-hover:rotate-180"
                  >
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {/* Dropdown panel */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-150">
                  <div className="border border-white/20 bg-zinc-950 rounded-md overflow-hidden shadow-2xl w-44">
                    {resourceItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors border-b border-white/8 last:border-b-0"
                      >
                        <div className="h-4 w-4 rounded-sm bg-cyan-400/80 shrink-0" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-zinc-400 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center">
          <Link
            href="/waitlist"
            className="rounded-full bg-cyan-400 px-4 py-1.5 text-sm font-medium text-black transition-opacity hover:opacity-90"
          >
            Join Waitlist
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex md:hidden flex-col gap-1.5 p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block h-0.5 w-5 bg-white transition-transform ${mobileOpen ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block h-0.5 w-5 bg-white transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-5 bg-white transition-transform ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 z-50 border-t border-white/20 bg-black/95 backdrop-blur-md px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) =>
            link.dropdown ? (
              <div key={link.href}>
                <button
                  onClick={() => setResourcesOpen(!resourcesOpen)}
                  className="flex items-center justify-between w-full text-sm text-zinc-400 hover:text-white"
                >
                  {link.label}
                  <svg
                    width="12" height="12" viewBox="0 0 12 12" fill="none"
                    className={`transition-transform duration-200 ${resourcesOpen ? "rotate-180" : ""}`}
                  >
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {resourcesOpen && (
                  <div className="mt-2 pl-3 flex flex-col gap-3 border-l border-white/10">
                    {resourceItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300"
                        onClick={() => setMobileOpen(false)}
                      >
                        <div className="h-3 w-3 rounded-sm bg-cyan-400/60 shrink-0" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-zinc-400 hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            )
          )}
          <Link
            href="/waitlist"
            className="mt-2 rounded-full bg-cyan-400 px-4 py-2 text-center text-sm font-medium text-black"
            onClick={() => setMobileOpen(false)}
          >
            Join Waitlist
          </Link>
        </div>
      )}
    </header>
  );
}
