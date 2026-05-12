"use client";

import { useState } from "react";

type Phase = "idle" | "leaving" | "done";

const CUBE_BASE =
  "w-8 h-8 rounded-md shadow-[2px_3px_0_rgba(0,0,0,0.12)] motion-safe:transition-all motion-safe:duration-1000";

export default function SubtractionDemo() {
  const [a, setA] = useState(7);
  const [b, setB] = useState(4);
  const [phase, setPhase] = useState<Phase>("idle");

  const safeA = Math.max(0, Math.min(20, a));
  const safeB = Math.max(0, Math.min(safeA, b));
  const staying = safeA - safeB;

  function go() {
    if (phase !== "idle") return;
    setPhase("leaving");
    window.setTimeout(() => setPhase("done"), 1100);
  }

  function reset() {
    setPhase("idle");
  }

  function setAGuard(v: number) {
    setA(v);
    setPhase("idle");
  }
  function setBGuard(v: number) {
    setB(v);
    setPhase("idle");
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[var(--radius-lg)] bg-cream-light border border-sand-200 p-6">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <label className="flex items-center gap-2">
            <span className="text-ink-800 font-semibold">First</span>
            <input
              type="number"
              min={0}
              max={20}
              value={a}
              onChange={(e) =>
                setAGuard(Math.max(0, Math.min(20, Number(e.target.value) || 0)))
              }
              className="w-16 rounded-[var(--radius-sm)] border border-sand-200 px-2 py-1"
            />
          </label>
          <span className="text-ink-800 font-bold text-lg">−</span>
          <label className="flex items-center gap-2">
            <span className="text-ink-800 font-semibold">Subtract</span>
            <input
              type="number"
              min={0}
              max={safeA}
              value={b}
              onChange={(e) =>
                setBGuard(
                  Math.max(0, Math.min(safeA, Number(e.target.value) || 0)),
                )
              }
              className="w-16 rounded-[var(--radius-sm)] border border-sand-200 px-2 py-1"
            />
          </label>
          <button
            type="button"
            onClick={phase === "idle" ? go : reset}
            className="ml-auto rounded-[var(--radius-pill)] bg-coral px-4 py-1.5 text-sm font-semibold text-white hover:brightness-105"
          >
            {phase === "idle" ? "Take away" : "Reset"}
          </button>
        </div>
      </div>

      <div className="rounded-[var(--radius-lg)] bg-cream-light border border-sand-200 p-8 min-h-[180px]">
        <div className="flex flex-wrap justify-center gap-2">
          {Array.from({ length: staying }).map((_, i) => (
            <div key={`stay-${i}`} className={`${CUBE_BASE} bg-sky`} />
          ))}
          {Array.from({ length: safeB }).map((_, i) => (
            <div
              key={`leave-${i}`}
              className={`${CUBE_BASE} bg-coral ${phase !== "idle" ? "opacity-0 -translate-y-12" : "opacity-100"}`}
            />
          ))}
          {safeA === 0 && (
            <span className="text-sm text-sand-400">Zero cubes.</span>
          )}
        </div>

        <div className="mt-6 text-center text-base">
          {phase === "idle" && (
            <p className="text-stone-600">
              {safeB === 0
                ? `Nothing leaves — ${safeA} − 0 = ${safeA}.`
                : `${safeB} red ones will leave.`}
            </p>
          )}
          {phase === "leaving" && (
            <p className="text-stone-600">Red ones leave…</p>
          )}
          {phase === "done" && (
            <p className="text-xl font-bold text-ink-800">
              {safeA} − {safeB} = {staying}
            </p>
          )}
        </div>
      </div>

      <p className="text-sm text-stone-600">
        Blue cubes stay. Red cubes leave. In the iOS app the red ones float
        out of the scene; here they fade and slide up. Watching the action
        beats reading the operator.
      </p>
    </div>
  );
}
