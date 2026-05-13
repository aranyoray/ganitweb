"use client";

import { useState } from "react";

type PileState = "idle" | "combining" | "combined";

const CUBE = "w-8 h-8 rounded-md bg-sky shadow-[2px_3px_0_rgba(0,0,0,0.12)]";

function Pile({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <div className="grid grid-cols-3 gap-1.5 p-3 rounded-[var(--radius-md)] bg-white/40">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={CUBE} />
      ))}
    </div>
  );
}

export default function PilesDemo() {
  const [a, setA] = useState(3);
  const [b, setB] = useState(4);
  const [state, setState] = useState<PileState>("idle");

  function combine() {
    if (state !== "idle") return;
    setState("combining");
    window.setTimeout(() => setState("combined"), 700);
  }

  function reset(nextA: number, nextB: number) {
    setA(nextA);
    setB(nextB);
    setState("idle");
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[var(--radius-lg)] bg-cream-light border border-sand-200 p-6">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <label className="flex items-center gap-2">
            <span className="text-ink-800 font-semibold">Pile A</span>
            <input
              type="number"
              min={0}
              max={10}
              value={a}
              onChange={(e) =>
                reset(
                  Math.max(0, Math.min(10, Number(e.target.value) || 0)),
                  b,
                )
              }
              className="w-16 rounded-[var(--radius-sm)] border border-sand-200 px-2 py-1"
            />
          </label>
          <span className="text-ink-800 font-bold text-lg">+</span>
          <label className="flex items-center gap-2">
            <span className="text-ink-800 font-semibold">Pile B</span>
            <input
              type="number"
              min={0}
              max={10}
              value={b}
              onChange={(e) =>
                reset(
                  a,
                  Math.max(0, Math.min(10, Number(e.target.value) || 0)),
                )
              }
              className="w-16 rounded-[var(--radius-sm)] border border-sand-200 px-2 py-1"
            />
          </label>
          <button
            type="button"
            onClick={() => reset(a, b)}
            className="ml-auto text-sm text-coral hover:underline"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="rounded-[var(--radius-lg)] bg-cream-light border border-sand-200 p-8 min-h-[260px]">
        <div className="flex items-center justify-around gap-6">
          <button
            type="button"
            onClick={combine}
            disabled={state !== "idle" || a === 0 || b === 0}
            aria-label="Tap pile A to combine"
            className="focus:outline-none focus:ring-2 focus:ring-coral rounded-[var(--radius-md)] disabled:opacity-60"
          >
            <Pile count={state === "combined" ? a + b : a} />
          </button>
          <div
            className={`motion-safe:transition-all motion-safe:duration-700 ${state === "combining" || state === "combined" ? "-translate-x-12 opacity-0" : "opacity-100"}`}
            aria-hidden={state === "combined"}
          >
            <button
              type="button"
              onClick={combine}
              disabled={state !== "idle" || a === 0 || b === 0}
              aria-label="Tap pile B to combine"
              className="focus:outline-none focus:ring-2 focus:ring-coral rounded-[var(--radius-md)] disabled:opacity-60"
            >
              <Pile count={b} />
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-base">
          {state === "idle" && (a === 0 || b === 0) && (
            <p className="text-ink-800">
              {a + b === 0
                ? "Pick at least one cube to see the combine."
                : `${a} + ${b} = ${a + b}`}
            </p>
          )}
          {state === "idle" && a > 0 && b > 0 && (
            <p className="text-stone-600">Tap a pile to combine them!</p>
          )}
          {state === "combining" && (
            <p className="text-stone-600">Combining…</p>
          )}
          {state === "combined" && (
            <p className="text-xl font-bold text-ink-800">
              {a} + {b} = {a + b}
            </p>
          )}
        </div>
      </div>

      <p className="text-sm text-stone-600">
        In the iOS app this is a 3D scene anchored to your desk — pile B slides
        through real space into pile A. Here we trade ARKit for a 2D animation
        but the gesture and the math are the same.
      </p>
    </div>
  );
}
