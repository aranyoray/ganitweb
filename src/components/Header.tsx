"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full border-b border-sand-200 bg-cream-light/80 backdrop-blur-sm sticky top-0 z-50">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold font-[family-name:var(--font-display)] text-ink-800">
            GanitAR
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/privacy"
            className="text-sm font-medium text-stone-600 hover:text-ink-800 transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="/support"
            className="text-sm font-medium text-stone-600 hover:text-ink-800 transition-colors"
          >
            Support
          </Link>
          <a
            href="#download"
            className="rounded-[var(--radius-pill)] bg-coral px-5 py-2.5 text-sm font-semibold text-white hover:brightness-105 transition-all"
          >
            Download
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-ink-800"
          aria-label="Toggle menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {menuOpen ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-sand-200 bg-cream-light px-6 py-4 space-y-3">
          <Link
            href="/privacy"
            className="block text-sm font-medium text-stone-600 hover:text-ink-800"
            onClick={() => setMenuOpen(false)}
          >
            Privacy
          </Link>
          <Link
            href="/support"
            className="block text-sm font-medium text-stone-600 hover:text-ink-800"
            onClick={() => setMenuOpen(false)}
          >
            Support
          </Link>
          <a
            href="#download"
            className="inline-block rounded-[var(--radius-pill)] bg-coral px-5 py-2.5 text-sm font-semibold text-white"
            onClick={() => setMenuOpen(false)}
          >
            Download
          </a>
        </div>
      )}
    </header>
  );
}
