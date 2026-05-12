"use client";

import { useEffect, useMemo, useState } from "react";
import { generateWorksheet } from "@/lib/worksheet";

export default function WorksheetDemo() {
  const [seed, setSeed] = useState(0);

  const url = useMemo(() => {
    void seed;
    if (typeof window === "undefined") return null;
    const blob = generateWorksheet();
    return URL.createObjectURL(blob);
  }, [seed]);

  useEffect(() => {
    if (!url) return;
    return () => URL.revokeObjectURL(url);
  }, [url]);

  return (
    <div className="space-y-8">
      <div className="rounded-[var(--radius-lg)] bg-cream-light border border-sand-200 p-6 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => setSeed((s) => s + 1)}
          className="rounded-[var(--radius-pill)] bg-ink-800 px-5 py-2 text-sm font-semibold text-white hover:brightness-110"
        >
          Generate new problems
        </button>
        {url && (
          <a
            href={url}
            download="ganitar-worksheet.pdf"
            className="rounded-[var(--radius-pill)] bg-coral px-5 py-2 text-sm font-semibold text-white hover:brightness-105"
          >
            Download PDF
          </a>
        )}
        <span className="text-xs text-stone-600">
          Twelve problems, US Letter, 3×4 grid.
        </span>
      </div>

      <div className="rounded-[var(--radius-lg)] bg-cream-light border border-sand-200 overflow-hidden">
        {url ? (
          <iframe
            src={url}
            title="Practice worksheet preview"
            className="w-full h-[720px] bg-white"
          />
        ) : (
          <div className="p-12 text-center text-stone-600">
            Generating PDF…
          </div>
        )}
      </div>

      <p className="text-sm text-stone-600">
        The iOS app generates the same layout via UIGraphicsPDFRenderer and
        hands it to the system share sheet for AirPrint, AirDrop, or Files.
        Here we render in the browser with jsPDF and let the browser save or
        print. Same grid, same sizes, designed for clean OCR pickup when you
        later scan it back in.
      </p>
    </div>
  );
}
