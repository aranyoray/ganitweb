"use client";

import { useState } from "react";

function HundredsFlat() {
  return (
    <div className="grid grid-cols-10 gap-px p-1 rounded-sm bg-coral/40">
      {Array.from({ length: 100 }).map((_, i) => (
        <div key={i} className="w-1.5 h-1.5 bg-coral rounded-[1px]" />
      ))}
    </div>
  );
}

function TensRod() {
  return (
    <div className="grid grid-rows-10 gap-px p-1 rounded-sm bg-sky/40">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="w-3 h-1.5 bg-sky rounded-[1px]" />
      ))}
    </div>
  );
}

function UnitCube() {
  return <div className="w-3 h-3 bg-leaf rounded-[2px] shadow-[1px_1px_0_rgba(0,0,0,0.15)]" />;
}

function Column({
  label,
  count,
  Renderer,
}: {
  label: string;
  count: number;
  Renderer: () => React.ReactElement;
}) {
  return (
    <div className="flex flex-col items-center gap-2 min-w-0">
      <span className="text-xs font-semibold text-stone-600 uppercase tracking-wide">
        {label} × {count}
      </span>
      <div className="flex flex-wrap items-end justify-center gap-2 min-h-[120px]">
        {count === 0 ? (
          <span className="text-sm text-sand-400">—</span>
        ) : (
          Array.from({ length: count }).map((_, i) => (
            <Renderer key={i} />
          ))
        )}
      </div>
    </div>
  );
}

export default function PlaceValueDemo() {
  const [n, setN] = useState(142);
  const safeN = Math.max(0, Math.min(999, n));
  const hundreds = Math.floor(safeN / 100);
  const tens = Math.floor((safeN % 100) / 10);
  const units = safeN % 10;

  return (
    <div className="space-y-8">
      <div className="rounded-[var(--radius-lg)] bg-cream-light border border-sand-200 p-6">
        <label className="flex flex-wrap items-center gap-4 text-sm">
          <span className="text-ink-800 font-semibold">Number (0–999)</span>
          <input
            type="number"
            min={0}
            max={999}
            value={n}
            onChange={(e) => setN(Number(e.target.value) || 0)}
            className="w-24 rounded-[var(--radius-sm)] border border-sand-200 px-3 py-2 text-lg font-bold text-ink-800"
          />
          <span className="text-sm text-stone-600">
            = {hundreds} hundred + {tens} ten + {units} one
          </span>
        </label>
      </div>

      <div className="rounded-[var(--radius-lg)] bg-cream-light border border-sand-200 p-8 min-h-[200px]">
        {safeN === 0 ? (
          <div className="text-center text-stone-600">
            Zero — nothing in any column.
            <div className="mt-4 mx-auto w-fit">
              <div className="w-4 h-4 bg-sand-200 rounded-[2px]" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            <Column label="Hundreds" count={hundreds} Renderer={HundredsFlat} />
            <Column label="Tens" count={tens} Renderer={TensRod} />
            <Column label="Units" count={units} Renderer={UnitCube} />
          </div>
        )}
      </div>

      <p className="text-sm text-stone-600">
        The iOS app renders these as physical Dienes base-10 blocks anchored on
        your desk — flats for hundreds, rods for tens, single cubes for units.
        When any operand is over 20 the AR view auto-promotes to this
        place-value display so the math stays visible.
      </p>
    </div>
  );
}
