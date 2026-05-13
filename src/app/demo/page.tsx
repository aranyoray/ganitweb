import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Try GanitAR in the browser",
  description:
    "Web demos of the GanitAR iOS app — tap-to-combine piles, place-value blocks, subtraction in color, the expression parser, voice input, and the practice worksheet PDF generator.",
};

const demos = [
  {
    href: "/demo/room",
    title: "3D Room mode ✦ new",
    blurb:
      "A tiny virtual classroom — drag to orbit, pinch to zoom, tap a pile to combine. No AR device needed.",
    color: "bg-coral/15 border-coral/40",
  },
  {
    href: "/demo/piles",
    title: "Tap-to-combine piles",
    blurb:
      "Tap one pile to fly it into the other. Same gesture the iOS app uses for addition.",
    color: "bg-sky/10 border-sky/30",
  },
  {
    href: "/demo/place-value",
    title: "Place-value blocks",
    blurb:
      "Type any number 0–999 and watch hundreds flats, tens rods, and unit cubes assemble.",
    color: "bg-sun/10 border-sun/30",
  },
  {
    href: "/demo/subtraction",
    title: "Subtraction in color",
    blurb:
      "Blue cubes stay. Red cubes leave. The taking-away made visible.",
    color: "bg-coral/10 border-coral/30",
  },
  {
    href: "/demo/parser",
    title: "Expression parser",
    blurb:
      "The exact grammar the iOS app uses for scanned text: X+Y, X−Y (0–99), or a single 0–999.",
    color: "bg-leaf/10 border-leaf/30",
  },
  {
    href: "/demo/speech",
    title: "Voice input",
    blurb:
      "Say \"twenty plus seven\" and watch the number-word parser turn it into 20+7.",
    color: "bg-sky/10 border-sky/30",
  },
  {
    href: "/demo/worksheet",
    title: "Practice worksheet PDF",
    blurb:
      "Generate the same 3×4 grid of practice problems the iOS app prints. Download as PDF.",
    color: "bg-sun/10 border-sun/30",
  },
];

export default function DemoIndex() {
  return (
    <div className="page-bg">
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold font-[family-name:var(--font-display)] text-ink-800">
          Try GanitAR in the browser
        </h1>
        <p className="mt-4 text-base text-stone-600 max-w-2xl mx-auto">
          The iOS app runs on Apple&apos;s ARKit and on-device DataScanner, neither of
          which exists in a browser. These demos port the parts that can run
          anywhere — pure logic, simple 2D rendering, the Web Speech API — so
          you can try the math feel before installing the app.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {demos.map((demo) => (
            <Link
              key={demo.href}
              href={demo.href}
              className={`rounded-[var(--radius-lg)] border p-6 transition-all hover:brightness-105 ${demo.color}`}
            >
              <h2 className="text-lg font-bold font-[family-name:var(--font-display)] text-ink-800">
                {demo.title}
              </h2>
              <p className="mt-2 text-sm text-stone-600 leading-relaxed">
                {demo.blurb}
              </p>
              <span className="mt-4 inline-block text-sm font-semibold text-coral">
                Try it →
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-stone-600">
          Want the full experience with AR shapes anchored to your desk?{" "}
          <a
            href="https://apps.apple.com/in/app/ganitar/id676397412"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-coral hover:underline"
          >
            Download GanitAR on the App Store
          </a>
          .
        </p>
      </section>
    </div>
  );
}
