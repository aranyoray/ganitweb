import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-sand-200 bg-cream-light">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <span className="text-lg font-bold font-[family-name:var(--font-display)] text-ink-800">
              GanitAR
            </span>
            <p className="mt-1 text-sm text-stone-600">
              Math you can walk around.
            </p>
          </div>

          <div className="flex items-center gap-8">
            <Link
              href="/privacy"
              className="text-sm text-stone-600 hover:text-ink-800 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/support"
              className="text-sm text-stone-600 hover:text-ink-800 transition-colors"
            >
              Support
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-sand-200 text-center">
          <p className="text-xs text-sand-400">
            &copy; {new Date().getFullYear()} GanitAR. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
