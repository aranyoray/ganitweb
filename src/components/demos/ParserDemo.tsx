"use client";

import { useState } from "react";
import { parseExpression, type ParsedExpression } from "@/lib/expressionParser";

function Outcome({ value }: { value: ParsedExpression }) {
  if (value.kind === "addition") {
    return (
      <p className="text-2xl font-bold text-ink-800">
        Addition: {value.a} + {value.b} = {value.a + value.b}
      </p>
    );
  }
  if (value.kind === "subtraction") {
    return (
      <p className="text-2xl font-bold text-ink-800">
        Subtraction: {value.a} − {value.b} = {value.a - value.b}
      </p>
    );
  }
  return (
    <p className="text-2xl font-bold text-ink-800">
      Place-value: {value.n} (
      {Math.floor(value.n / 100)}h + {Math.floor((value.n % 100) / 10)}t +{" "}
      {value.n % 10}u)
    </p>
  );
}

const SAMPLES = ["3+4", "12-7", "50+30", "142", "0", "99+99", "5+", "2+3+4", "5-9", "100-50", "abc"];

export default function ParserDemo() {
  const [input, setInput] = useState("12 + 7");
  const result = parseExpression(input);

  return (
    <div className="space-y-8">
      <div className="rounded-[var(--radius-lg)] bg-cream-light border border-sand-200 p-6">
        <label className="block">
          <span className="text-sm font-semibold text-ink-800">
            Type or paste an expression
          </span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. 12 + 7"
            className="mt-2 w-full rounded-[var(--radius-sm)] border border-sand-200 bg-white px-4 py-3 text-lg font-mono text-ink-800 focus:outline-none focus:ring-2 focus:ring-coral"
          />
        </label>
        <div className="mt-4 flex flex-wrap gap-2">
          {SAMPLES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setInput(s)}
              className="rounded-[var(--radius-pill)] border border-sand-200 bg-white px-3 py-1 text-xs font-mono text-stone-600 hover:bg-cream"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`rounded-[var(--radius-lg)] border p-8 ${result.ok ? "bg-leaf/10 border-leaf/30" : "bg-coral/10 border-coral/30"}`}
      >
        {result.ok ? (
          <Outcome value={result.value} />
        ) : (
          <div>
            <p className="text-base font-semibold text-coral uppercase tracking-wide">
              {result.error}
            </p>
            <p className="mt-2 text-lg text-ink-800">{result.message}</p>
          </div>
        )}
      </div>

      <div className="rounded-[var(--radius-md)] bg-cream-light border border-sand-200 p-6">
        <h2 className="text-base font-bold text-ink-800">Grammar</h2>
        <ul className="mt-3 space-y-1 text-sm text-stone-600 font-mono">
          <li>X + Y where X, Y ∈ [0, 99]</li>
          <li>X − Y where X, Y ∈ [0, 99] and X ≥ Y</li>
          <li>N where N ∈ [0, 999] (renders as place-value)</li>
        </ul>
        <p className="mt-4 text-sm text-stone-600">
          Anything else — multi-term, negative result, out-of-range — fails
          with a named error and a friendly hint. After three misreads the
          iOS app suggests printing a worksheet.
        </p>
      </div>
    </div>
  );
}
