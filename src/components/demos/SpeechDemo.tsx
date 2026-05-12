"use client";

import { useEffect, useRef, useState } from "react";
import { convertWordsToDigits } from "@/lib/numberWordParser";
import { parseExpression } from "@/lib/expressionParser";

type SpeechRecognitionResult = { isFinal: boolean; transcript: string };
type SpeechRecognitionEventLike = {
  results: ArrayLike<ArrayLike<SpeechRecognitionResult>>;
};
type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type WindowWithSpeech = typeof window & {
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  SpeechRecognition?: new () => SpeechRecognitionLike;
};

function getSpeechCtor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as WindowWithSpeech;
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

type Phase = "idle" | "listening" | "done" | "unsupported";

export default function SpeechDemo() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    if (getSpeechCtor() === null) setPhase("unsupported");
  }, []);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  function start() {
    const Ctor = getSpeechCtor();
    if (!Ctor) {
      setPhase("unsupported");
      return;
    }
    const rec = new Ctor();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = "en-US";
    rec.onresult = (event) => {
      let combined = "";
      for (let i = 0; i < event.results.length; i++) {
        combined += event.results[i][0].transcript;
      }
      setTranscript(combined);
    };
    rec.onerror = (event) => {
      setError(event.error);
      setPhase("idle");
    };
    rec.onend = () => {
      setPhase("done");
    };
    recognitionRef.current = rec;
    setError(null);
    setTranscript("");
    setPhase("listening");
    try {
      rec.start();
    } catch {
      setError("Could not start the recognizer. Try again.");
      setPhase("idle");
    }
  }

  function stop() {
    recognitionRef.current?.stop();
  }

  const digits = transcript ? convertWordsToDigits(transcript) : "";
  const parsed = digits ? parseExpression(digits) : null;

  return (
    <div className="space-y-8">
      <div className="rounded-[var(--radius-lg)] bg-cream-light border border-sand-200 p-8 text-center min-h-[180px] flex flex-col items-center justify-center gap-4">
        {phase === "unsupported" ? (
          <p className="text-stone-600">
            Your browser doesn&apos;t support the Web Speech API. Try Chrome,
            Edge, or Safari, or just type into the expression parser demo
            instead.
          </p>
        ) : (
          <>
            <button
              type="button"
              onClick={phase === "listening" ? stop : start}
              className={`rounded-[var(--radius-pill)] px-6 py-3 text-base font-semibold text-white hover:brightness-105 ${phase === "listening" ? "bg-coral animate-pulse" : "bg-ink-800"}`}
            >
              {phase === "listening" ? "Stop listening" : "Speak a problem"}
            </button>
            <p className="text-sm text-stone-600">
              {phase === "idle" && "Try \"twenty plus seven\" or \"fifteen minus four\""}
              {phase === "listening" && "Listening… speak now"}
              {phase === "done" && "Tap again to re-listen"}
            </p>
            {error && (
              <p className="text-sm text-coral">Recognizer error: {error}</p>
            )}
          </>
        )}
      </div>

      {transcript && (
        <div className="rounded-[var(--radius-lg)] bg-cream-light border border-sand-200 p-6 space-y-3">
          <div>
            <span className="text-xs font-semibold text-stone-600 uppercase tracking-wide">
              You said
            </span>
            <p className="mt-1 text-lg text-ink-800">&ldquo;{transcript}&rdquo;</p>
          </div>
          <div>
            <span className="text-xs font-semibold text-stone-600 uppercase tracking-wide">
              Parsed digits
            </span>
            <p className="mt-1 text-lg font-mono text-ink-800">
              {digits || <span className="text-sand-400">(nothing matched)</span>}
            </p>
          </div>
          {parsed && (
            <div
              className={`rounded-[var(--radius-md)] p-4 ${parsed.ok ? "bg-leaf/10 border border-leaf/30" : "bg-coral/10 border border-coral/30"}`}
            >
              {parsed.ok ? (
                <p className="text-lg font-bold text-ink-800">
                  {parsed.value.kind === "addition" &&
                    `${parsed.value.a} + ${parsed.value.b} = ${parsed.value.a + parsed.value.b}`}
                  {parsed.value.kind === "subtraction" &&
                    `${parsed.value.a} − ${parsed.value.b} = ${parsed.value.a - parsed.value.b}`}
                  {parsed.value.kind === "placeValue" &&
                    `${parsed.value.n} (place-value)`}
                </p>
              ) : (
                <p className="text-sm text-ink-800">{parsed.message}</p>
              )}
            </div>
          )}
        </div>
      )}

      <p className="text-sm text-stone-600">
        The iOS app uses Apple&apos;s on-device Speech framework — your browser
        uses the Web Speech API, which may route audio to a remote service
        depending on the vendor. The number-word parser is identical: same
        synonyms (plus / add / minus / take / less), same homophones (ate →
        8), same filler-word stripping.
      </p>
    </div>
  );
}
