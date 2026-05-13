"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Html, RoundedBox, Instances, Instance } from "@react-three/drei";
import * as THREE from "three";

// ───────────────────────────────────────────────────────────────────
// Camera ops (programmatic moves triggered from HTML buttons outside Canvas)
// ───────────────────────────────────────────────────────────────────

type CameraOp =
  | { kind: "zoom"; factor: number; id: number }
  | { kind: "topdown"; id: number }
  | { kind: "reset"; id: number };

const DEFAULT_CAM_POS = new THREE.Vector3(3.2, 3.6, 6.4);
const CAM_TARGET = new THREE.Vector3(0, 0.5, 0);

function CameraOps({ op }: { op: CameraOp | null }) {
  const { camera, controls } = useThree() as unknown as { camera: THREE.PerspectiveCamera; controls: { target: THREE.Vector3; update: () => void } | null };
  const lastId = useRef(0);
  useEffect(() => {
    if (!op || op.id === lastId.current) return;
    lastId.current = op.id;
    const target = controls?.target ?? CAM_TARGET;
    if (op.kind === "zoom") {
      const dir = new THREE.Vector3().subVectors(camera.position, target);
      const dist = dir.length();
      const newDist = Math.max(1.5, Math.min(18, dist * op.factor));
      dir.setLength(newDist);
      camera.position.copy(target).add(dir);
    } else if (op.kind === "topdown") {
      camera.position.set(target.x + 0.05, target.y + 8, target.z + 0.05);
      camera.lookAt(target);
    } else if (op.kind === "reset") {
      camera.position.copy(DEFAULT_CAM_POS);
      camera.lookAt(CAM_TARGET);
      if (controls) controls.target.copy(CAM_TARGET);
    }
    controls?.update();
  }, [op, camera, controls]);
  return null;
}

function CamBtn({ label, icon, onClick }: { label: string; icon: "plus" | "minus" | "topdown" | "reset"; onClick: () => void }) {
  const svg = {
    plus: <path d="M12 5v14M5 12h14" />,
    minus: <path d="M5 12h14" />,
    topdown: <path d="M12 4v16M4 12l4-4M4 12l4 4M20 12l-4-4M20 12l-4 4" />,
    reset: <path d="M3 12a9 9 0 1 0 3-6.7L3 8m0-5v5h5" />,
  }[icon];
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="w-11 h-11 rounded-full bg-white/90 border border-coral/30 text-coral shadow-md hover:bg-white flex items-center justify-center backdrop-blur transition active:scale-95"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        {svg}
      </svg>
    </button>
  );
}

// ───────────────────────────────────────────────────────────────────
// WebGL feature detect
// ───────────────────────────────────────────────────────────────────

function detectWebGL(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const c = document.createElement("canvas");
    const gl =
      (c.getContext("webgl2") as WebGL2RenderingContext | null) ||
      (c.getContext("webgl") as WebGLRenderingContext | null) ||
      (c.getContext("experimental-webgl") as WebGLRenderingContext | null);
    return !!gl;
  } catch {
    return false;
  }
}

// ───────────────────────────────────────────────────────────────────
// Math modes — all happen inside the 3D room
// ───────────────────────────────────────────────────────────────────

type Mode = "piles" | "value" | "parse" | "speech";
type Op = "add" | "subtract";
type Phase = "idle" | "combining" | "combined";

const PILE_COLORS = {
  a: "#5B9BD5",
  b: "#E76F51",
  hundreds: "#2A9D8F",
  tens: "#F4A261",
  units: "#9D4EDD",
};
const CUBE_SIZE = 0.3;
const CUBE_GAP = 0.04;

// ───────────────────────────────────────────────────────────────────
// Expression parser — same grammar as the iOS app
// ───────────────────────────────────────────────────────────────────

type Parsed =
  | { kind: "single"; value: number }
  | { kind: "binop"; op: Op; a: number; b: number }
  | { kind: "error"; reason: string };

function parseExpression(raw: string): Parsed {
  const s = raw.trim().replace(/\s+/g, "").replace(/[−–—]/g, "-");
  if (!s) return { kind: "error", reason: "Empty" };
  const single = /^(\d{1,3})$/.exec(s);
  if (single) {
    const n = Number(single[1]);
    if (n > 999) return { kind: "error", reason: "Max 999" };
    return { kind: "single", value: n };
  }
  const bin = /^(\d{1,2})([+\-])(\d{1,2})$/.exec(s);
  if (bin) {
    const a = Number(bin[1]);
    const b = Number(bin[3]);
    if (a > 99 || b > 99) return { kind: "error", reason: "Max 99 per side" };
    return { kind: "binop", op: bin[2] === "+" ? "add" : "subtract", a, b };
  }
  return { kind: "error", reason: "Use X, X+Y, or X−Y" };
}

// ───────────────────────────────────────────────────────────────────
// Number-word parser (subset, like iOS)
// ───────────────────────────────────────────────────────────────────

const WORD_DIGITS: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15,
  sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19,
};
const WORD_TENS: Record<string, number> = {
  twenty: 20, thirty: 30, forty: 40, fifty: 50,
  sixty: 60, seventy: 70, eighty: 80, ninety: 90,
};

function wordsToExpression(text: string): string {
  let t = text.toLowerCase().trim().replace(/[,.?!]/g, "");
  t = t.replace(/\bplus\b/g, "+").replace(/\band\b/g, "+");
  t = t.replace(/\bminus\b/g, "-").replace(/\btake away\b/g, "-").replace(/\bless\b/g, "-");
  const tokens = t.split(/\s+/);
  const out: string[] = [];
  let acc = 0;
  let inNumber = false;
  for (const tok of tokens) {
    if (tok === "+" || tok === "-") {
      if (inNumber) { out.push(String(acc)); acc = 0; inNumber = false; }
      out.push(tok);
    } else if (WORD_TENS[tok] !== undefined) {
      acc += WORD_TENS[tok]; inNumber = true;
    } else if (WORD_DIGITS[tok] !== undefined) {
      acc += WORD_DIGITS[tok]; inNumber = true;
    } else if (/^\d+$/.test(tok)) {
      acc += Number(tok); inNumber = true;
    } else if (tok === "hundred") {
      acc *= 100; inNumber = true;
    }
  }
  if (inNumber) out.push(String(acc));
  return out.join("");
}

// ───────────────────────────────────────────────────────────────────
// 3D primitives
// ───────────────────────────────────────────────────────────────────

function gridLayout(count: number, cols = 3): Array<[number, number, number]> {
  const span = CUBE_SIZE + CUBE_GAP;
  const out: Array<[number, number, number]> = [];
  for (let i = 0; i < count; i++) {
    const c = i % cols;
    const r = Math.floor(i / cols);
    out.push([
      (c - (cols - 1) / 2) * span,
      CUBE_SIZE / 2 + r * span,
      0,
    ]);
  }
  return out;
}

function Cube({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <RoundedBox
      args={[CUBE_SIZE, CUBE_SIZE, CUBE_SIZE]}
      radius={0.04}
      smoothness={4}
      position={position}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial color={color} roughness={0.45} metalness={0.1} />
    </RoundedBox>
  );
}

function Pile({
  count, origin, color, offsetX = 0, onClick,
}: {
  count: number;
  origin: [number, number, number];
  color: string;
  offsetX?: number;
  onClick?: () => void;
}) {
  const g = useRef<THREE.Group>(null);
  const positions = useMemo(() => gridLayout(count), [count]);
  useFrame((_, dt) => {
    if (!g.current) return;
    const tx = origin[0] + offsetX;
    g.current.position.x = THREE.MathUtils.lerp(g.current.position.x, tx, Math.min(1, dt * 6));
  });
  return (
    <group
      ref={g}
      position={origin}
      onClick={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); onClick?.(); }}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        if (onClick) document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        document.body.style.cursor = "auto";
      }}
    >
      {positions.map((p, i) => <Cube key={i} position={p} color={color} />)}
    </group>
  );
}

// Dienes blocks: each ten = 10 visible sub-cubes (column), each hundred = 100 sub-cubes (10×10 grid)
function PlaceValueStack({ value }: { value: number }) {
  const n = Math.max(0, Math.min(999, Math.floor(value)));
  const hundreds = Math.floor(n / 100);
  const tens = Math.floor((n % 100) / 10);
  const units = n % 10;

  const SUB = 0.05;            // sub-cube edge length
  const GAP = 0.004;           // gap between sub-cubes
  const SPAN = SUB + GAP;      // 0.054
  const SIDE = 10 * SPAN;      // ~0.54 — full rod height / flat side

  // Each hundred = upright 10×10 grid facing camera (back lane)
  const hundredsCubes: Array<[number, number, number]> = [];
  for (let h = 0; h < hundreds; h++) {
    const flatX = -1.55 + h * (SIDE + 0.06);
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        hundredsCubes.push([
          flatX + (c - 4.5) * SPAN,
          SUB / 2 + r * SPAN,
          -0.9
        ]);
      }
    }
  }

  // Each ten = vertical column of 10 sub-cubes (middle lane)
  const tensCubes: Array<[number, number, number]> = [];
  for (let t = 0; t < tens; t++) {
    const rodX = -1.05 + t * (SUB + 0.07);
    for (let i = 0; i < 10; i++) {
      tensCubes.push([rodX, SUB / 2 + i * SPAN, 0]);
    }
  }

  // Each unit = single sub-cube (front lane), 5-column grid
  const unitsCubes: Array<[number, number, number]> = [];
  for (let u = 0; u < units; u++) {
    const col = u % 5;
    const row = Math.floor(u / 5);
    unitsCubes.push([
      -0.5 + col * (SUB + 0.04),
      SUB / 2 + row * (SUB + 0.04),
      0.9
    ]);
  }

  return (
    <group position={[0, 0, 0.2]}>
      {/* Hundreds: up to 9 × 100 = 900 sub-cubes */}
      {hundredsCubes.length > 0 && (
        <Instances limit={1000} castShadow receiveShadow>
          <boxGeometry args={[SUB, SUB, SUB]} />
          <meshStandardMaterial color={PILE_COLORS.hundreds} roughness={0.5} />
          {hundredsCubes.map((p, i) => (
            <Instance key={i} position={p} />
          ))}
        </Instances>
      )}
      {/* Tens: up to 9 × 10 = 90 sub-cubes */}
      {tensCubes.length > 0 && (
        <Instances limit={100} castShadow receiveShadow>
          <boxGeometry args={[SUB, SUB, SUB]} />
          <meshStandardMaterial color={PILE_COLORS.tens} roughness={0.5} />
          {tensCubes.map((p, i) => (
            <Instance key={i} position={p} />
          ))}
        </Instances>
      )}
      {/* Units: up to 9 sub-cubes */}
      {unitsCubes.length > 0 && (
        <Instances limit={20} castShadow receiveShadow>
          <boxGeometry args={[SUB, SUB, SUB]} />
          <meshStandardMaterial color={PILE_COLORS.units} roughness={0.5} />
          {unitsCubes.map((p, i) => (
            <Instance key={i} position={p} />
          ))}
        </Instances>
      )}
      {/* Labels: one per group, hovering above */}
      {Array.from({ length: hundreds }).map((_, h) => (
        <Html
          key={`hL${h}`}
          position={[-1.55 + h * (SIDE + 0.06), SIDE + 0.12, -0.9]}
          center distanceFactor={6} transform
        >
          <div className="px-1.5 py-0.5 rounded bg-white/85 text-[10px] font-extrabold text-[#1f4f48] select-none shadow-sm">100</div>
        </Html>
      ))}
      {Array.from({ length: tens }).map((_, t) => (
        <Html
          key={`tL${t}`}
          position={[-1.05 + t * (SUB + 0.07), SIDE + 0.08, 0]}
          center distanceFactor={6} transform
        >
          <div className="px-1.5 py-0.5 rounded bg-white/85 text-[10px] font-extrabold text-[#a05a1a] select-none shadow-sm">10</div>
        </Html>
      ))}
    </group>
  );
}

// ───────────────────────────────────────────────────────────────────
// Floor only — math objects sit on infinite plane, nothing else
// ───────────────────────────────────────────────────────────────────

function Floor() {
  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#F6EFE6" roughness={0.92} />
    </mesh>
  );
}

// ───────────────────────────────────────────────────────────────────
// Floating result number
// ───────────────────────────────────────────────────────────────────

function FloatingNumber({ value, color }: { value: number; color: string }) {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!g.current) return;
    g.current.position.y = 2.6 + Math.sin(clock.elapsedTime * 1.6) * 0.06;
    g.current.rotation.y = Math.sin(clock.elapsedTime * 0.5) * 0.18;
  });
  return (
    <group ref={g} position={[0.2, 2.6, 0.4]}>
      <Html center distanceFactor={3.5} transform>
        <div
          className="select-none font-black text-6xl"
          style={{
            color,
            textShadow: "0 8px 18px rgba(0,0,0,0.22)",
            WebkitTextStroke: "1px rgba(255,255,255,0.7)",
          }}
        >
          {value}
        </div>
      </Html>
    </group>
  );
}

// ───────────────────────────────────────────────────────────────────
// Scene contents per mode
// ───────────────────────────────────────────────────────────────────

type RenderKind = "piles" | "place-value" | "empty";

interface SceneContentProps {
  renderKind: RenderKind;
  pileA: number;
  pileB: number;
  phase: Phase;
  pileResult: number;
  resultColor: string;
  onCombine: () => void;
  placeValue: number;
}

function SceneContent({
  renderKind, pileA, pileB, phase, pileResult, resultColor, onCombine, placeValue,
}: SceneContentProps) {
  if (renderKind === "piles") {
    const showA = phase === "combined" ? pileResult : pileA;
    const showB = phase === "combined" ? 0 : pileB;
    const offsetB = phase === "combining" || phase === "combined" ? -2.2 : 0;
    return (
      <>
        <Pile count={showA} origin={[-1.1, 0, 0.4]} color={PILE_COLORS.a} onClick={onCombine} />
        <Pile count={showB} origin={[1.4, 0, 0.4]} color={PILE_COLORS.b} offsetX={offsetB} onClick={onCombine} />
        {phase === "combined" && <FloatingNumber value={pileResult} color={resultColor} />}
      </>
    );
  }
  if (renderKind === "place-value") {
    return (
      <>
        <PlaceValueStack value={placeValue} />
        <FloatingNumber value={placeValue} color="#2A9D8F" />
      </>
    );
  }
  return null;
}

// ───────────────────────────────────────────────────────────────────
// Main component
// ───────────────────────────────────────────────────────────────────

export default function RoomDemo() {
  const [mode, setMode] = useState<Mode>("piles");
  const [webglOk, setWebglOk] = useState<boolean | null>(null);
  const [cameraOp, setCameraOp] = useState<CameraOp | null>(null);
  useEffect(() => { setWebglOk(detectWebGL()); }, []);

  // piles state
  const [pileA, setPileA] = useState(3);
  const [pileB, setPileB] = useState(4);
  const [pileOp, setPileOp] = useState<Op>("add");
  const [phase, setPhase] = useState<Phase>("idle");

  // place-value state
  const [pvNumber, setPvNumber] = useState(247);

  // parse state
  const [expression, setExpression] = useState("12+7");
  const parsed = useMemo(() => parseExpression(expression), [expression]);

  // speech state
  const [speechSupported, setSpeechSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<{ start: () => void; stop: () => void; abort?: () => void } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    type WindowSR = typeof window & {
      SpeechRecognition?: new () => unknown;
      webkitSpeechRecognition?: new () => unknown;
    };
    const w = window as WindowSR;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    setSpeechSupported(!!SR);
  }, []);

  // pileOp/pileA/pileB → derived for parse + speech
  useEffect(() => {
    if (mode !== "parse" && mode !== "speech") return;
    const expr = mode === "speech" ? wordsToExpression(transcript) : expression;
    const p = parseExpression(expr);
    if (p.kind === "binop" && p.a <= 9 && p.b <= 9) {
      setPileA(p.a);
      setPileB(p.b);
      setPileOp(p.op);
      setPhase("idle");
    } else if (p.kind === "single") {
      setPvNumber(p.value);
    }
  }, [mode, expression, transcript]);

  const pileResult = useMemo(() => {
    return pileOp === "add" ? pileA + pileB : Math.max(0, pileA - pileB);
  }, [pileA, pileB, pileOp]);

  const result = useMemo<number | null>(() => {
    if (mode === "piles") return phase === "combined" ? pileResult : null;
    if (mode === "value") return pvNumber;
    if (mode === "parse" || mode === "speech") {
      const expr = mode === "speech" ? wordsToExpression(transcript) : expression;
      const p = parseExpression(expr);
      if (p.kind === "binop") return phase === "combined" ? (p.op === "add" ? p.a + p.b : Math.max(0, p.a - p.b)) : null;
      if (p.kind === "single") return p.value;
    }
    return null;
  }, [mode, phase, pileResult, pvNumber, expression, transcript]);

  const renderKind = useMemo<RenderKind>(() => {
    if (mode === "piles") return "piles";
    if (mode === "value") return "place-value";
    const expr = mode === "speech" ? wordsToExpression(transcript) : expression;
    const p = parseExpression(expr);
    if (p.kind === "binop") {
      // Piles cap at 9 each — for larger inputs fall back to place-value of result.
      if (p.a > 9 || p.b > 9) return "place-value";
      return "piles";
    }
    if (p.kind === "single") return "place-value";
    return "empty";
  }, [mode, expression, transcript]);

  const resultColor = pileOp === "add" ? "#2A9D8F" : "#E76F51";

  function combine() {
    if (mode === "value") return;
    if (phase !== "idle") return;
    setPhase("combining");
    window.setTimeout(() => setPhase("combined"), 800);
  }
  function reset() { setPhase("idle"); }

  function switchMode(next: Mode) {
    if (listening) stopListening();
    if (typeof document !== "undefined") document.body.style.cursor = "auto";
    setMode(next);
    reset();
  }
  function setPile(which: "a" | "b", v: number) {
    const x = Math.max(0, Math.min(9, v));
    if (which === "a") setPileA(x); else setPileB(x);
    reset();
  }

  function startListening() {
    if (typeof window === "undefined") return;
    type WindowSR = typeof window & {
      SpeechRecognition?: new () => unknown;
      webkitSpeechRecognition?: new () => unknown;
    };
    const w = window as WindowSR;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) return;
    type SRInstance = {
      lang: string;
      interimResults: boolean;
      maxAlternatives: number;
      onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
      onerror: () => void;
      onend: () => void;
      start: () => void;
      stop: () => void;
    };
    const inst = new (SR as new () => SRInstance)();
    inst.lang = "en-US";
    inst.interimResults = true;
    inst.maxAlternatives = 1;
    inst.onresult = (ev) => {
      let s = "";
      for (let i = 0; i < ev.results.length; i++) s += ev.results[i][0].transcript;
      setTranscript(s);
    };
    inst.onerror = () => setListening(false);
    inst.onend = () => setListening(false);
    inst.start();
    recognitionRef.current = inst;
    setListening(true);
    setTranscript("");
  }
  function stopListening() {
    recognitionRef.current?.stop();
    setListening(false);
  }

  const placeValueForScene = useMemo(() => {
    if (mode === "value") return pvNumber;
    if (mode === "parse" || mode === "speech") {
      const expr = mode === "speech" ? wordsToExpression(transcript) : expression;
      const p = parseExpression(expr);
      if (p.kind === "single") return p.value;
      if (p.kind === "binop") {
        return p.op === "add" ? p.a + p.b : Math.max(0, p.a - p.b);
      }
    }
    return 0;
  }, [mode, pvNumber, expression, transcript]);

  return (
    <div className="space-y-5">
      {/* Mode tabs */}
      <div className="rounded-[var(--radius-lg)] bg-cream-light border border-sand-200 p-3" role="tablist" aria-label="Math interaction modes">
        <div className="flex flex-wrap gap-2">
          {([
            ["piles", "Piles · add / sub"],
            ["value", "Place-value 0–999"],
            ["parse", "Type a problem"],
            ["speech", "Say a problem"],
          ] as Array<[Mode, string]>).map(([m, label]) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => switchMode(m)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-coral ${mode === m ? "bg-coral text-white shadow" : "bg-white border border-sand-200 text-ink-800 hover:bg-sand-100"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Mode-specific controls */}
      <div className="rounded-[var(--radius-lg)] bg-cream-light border border-sand-200 p-5">
        {mode === "piles" && (
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <div className="inline-flex rounded-full bg-white/80 border border-sand-200 p-1">
              {(["add", "subtract"] as Op[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => { setPileOp(m); reset(); }}
                  className={`rounded-full px-3 py-1 text-sm font-semibold transition ${pileOp === m ? "bg-coral text-white shadow" : "text-ink-800 hover:bg-sand-100"}`}
                >
                  {m === "add" ? "Add" : "Subtract"}
                </button>
              ))}
            </div>
            <label className="ml-auto flex items-center gap-2">
              <span className="text-ink-800 font-semibold">A</span>
              <input
                type="number" min={0} max={9} value={pileA}
                aria-label="Pile A count (0 to 9)"
                onChange={(e) => setPile("a", Number(e.target.value) || 0)}
                className="w-14 rounded-[var(--radius-sm)] border border-sand-200 px-2 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral" />
            </label>
            <span className="text-ink-800 font-bold text-lg" aria-hidden>{pileOp === "add" ? "+" : "−"}</span>
            <label className="flex items-center gap-2">
              <span className="text-ink-800 font-semibold">B</span>
              <input
                type="number" min={0} max={9} value={pileB}
                aria-label="Pile B count (0 to 9)"
                onChange={(e) => setPile("b", Number(e.target.value) || 0)}
                className="w-14 rounded-[var(--radius-sm)] border border-sand-200 px-2 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral" />
            </label>
            <button type="button" onClick={reset} className="text-sm text-coral hover:underline">Reset</button>
          </div>
        )}

        {mode === "value" && (
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <label className="text-ink-800 font-semibold" htmlFor="pv-number">Number (0–999)</label>
            <input
              id="pv-number"
              type="number" min={0} max={999} value={pvNumber}
              onChange={(e) => setPvNumber(Math.max(0, Math.min(999, Number(e.target.value) || 0)))}
              className="w-24 rounded-[var(--radius-sm)] border border-sand-200 px-2 py-1 text-lg font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-coral" />
            <input
              type="range" min={0} max={999} value={pvNumber}
              aria-label="Number slider, 0 to 999"
              onChange={(e) => setPvNumber(Number(e.target.value))}
              className="flex-1 min-w-[160px] accent-coral" />
            <div className="ml-auto text-sm text-ink-600 tabular-nums">
              <span className="font-bold text-[#2A9D8F]">{Math.floor(pvNumber / 100)}</span> hundreds ·{" "}
              <span className="font-bold text-[#F4A261]">{Math.floor((pvNumber % 100) / 10)}</span> tens ·{" "}
              <span className="font-bold text-[#9D4EDD]">{pvNumber % 10}</span> units
            </div>
          </div>
        )}

        {mode === "parse" && (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <label className="text-ink-800 font-semibold">Type a problem</label>
              <input
                type="text"
                value={expression}
                onChange={(e) => { setExpression(e.target.value); reset(); }}
                placeholder="e.g. 12+7  or  5-2  or  247"
                aria-label="Math expression input"
                className="flex-1 min-w-[200px] rounded-[var(--radius-sm)] border border-sand-200 px-3 py-2 font-mono focus:outline-none focus-visible:ring-2 focus-visible:ring-coral"
              />
              <button type="button" onClick={reset} className="text-sm text-coral hover:underline">Reset</button>
            </div>
            <div className="text-xs text-ink-600">
              Grammar: <code>X</code> (0–999), <code>X+Y</code> or <code>X−Y</code> (0–99 each).
              {parsed.kind === "error" && <span className="ml-2 text-[#BC4749] font-semibold">{parsed.reason}</span>}
              {parsed.kind === "single" && <span className="ml-2 text-[#2A9D8F] font-semibold">→ place-value of {parsed.value}</span>}
              {parsed.kind === "binop" && (parsed.a <= 9 && parsed.b <= 9) && <span className="ml-2 text-[#2A9D8F] font-semibold">→ {parsed.a} {parsed.op === "add" ? "+" : "−"} {parsed.b}, tap a pile to combine</span>}
              {parsed.kind === "binop" && (parsed.a > 9 || parsed.b > 9) && <span className="ml-2 text-[#2A9D8F] font-semibold">→ piles cap at 9 each, showing place-value of {parsed.op === "add" ? parsed.a + parsed.b : Math.max(0, parsed.a - parsed.b)}</span>}
            </div>
          </div>
        )}

        {mode === "speech" && (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              {speechSupported ? (
                <button
                  type="button"
                  onClick={listening ? stopListening : startListening}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${listening ? "bg-[#BC4749] text-white" : "bg-coral text-white"}`}
                >
                  <span className={`inline-block w-2 h-2 rounded-full ${listening ? "bg-white animate-pulse" : "bg-white/70"}`} />
                  {listening ? "Stop listening" : "Say a problem"}
                </button>
              ) : (
                <span className="text-[#BC4749] font-semibold">Voice input not supported in this browser. Try Chrome.</span>
              )}
              <input
                type="text"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder='e.g. "twenty plus seven" or "two hundred forty seven"'
                aria-label="Spoken or typed math problem"
                className="flex-1 min-w-[220px] rounded-[var(--radius-sm)] border border-sand-200 px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral"
              />
            </div>
            <div className="text-xs text-ink-600">
              Parsed expression: <code className="font-mono">{wordsToExpression(transcript) || "—"}</code>
            </div>
          </div>
        )}
      </div>

      {/* 3D Room canvas (WebGL required) */}
      <div className="rounded-[var(--radius-lg)] overflow-hidden bg-cream-light border border-sand-200">
        {webglOk === false ? (
          <div className="aspect-[4/3] w-full flex flex-col items-center justify-center gap-3 p-8 text-center">
            <div className="text-5xl">🪟</div>
            <h3 className="font-bold text-ink-800">3D room needs WebGL</h3>
            <p className="text-sm text-ink-600 max-w-md">
              Your browser can&apos;t open a 3D context. Try Chrome or Edge with hardware acceleration on, or switch to{" "}
              <a href="/demo/piles" className="text-coral font-semibold hover:underline">2D piles</a> · {" "}
              <a href="/demo/place-value" className="text-coral font-semibold hover:underline">place-value</a> · {" "}
              <a href="/demo/parser" className="text-coral font-semibold hover:underline">parser</a>.
            </p>
          </div>
        ) : webglOk === null ? (
          <div className="aspect-[4/3] w-full flex items-center justify-center text-ink-600 text-sm">
            Initializing 3D room…
          </div>
        ) : (
        <div className="aspect-[4/3] w-full relative">
          <Canvas
            shadows={{ type: THREE.PCFShadowMap }}
            camera={{ position: [3.2, 3.6, 6.4], fov: 38 }}
            dpr={[1, 2]}
          >
            <color attach="background" args={["#F8EFE2"]} />
            {/* Subtle fog matching background — far floor dissolves into sky for infinite-plane feel */}
            {/* Fog starts past max-zoom-out distance so math objects stay sharp at any zoom */}
            <fog attach="fog" args={["#F8EFE2", 25, 55]} />
            <ambientLight intensity={0.62} />
            <directionalLight
              position={[4, 7, 5]}
              intensity={1.5}
              castShadow
              shadow-mapSize={[1024, 1024]}
              shadow-camera-left={-6}
              shadow-camera-right={6}
              shadow-camera-top={6}
              shadow-camera-bottom={-6}
            />
            <Suspense fallback={null}>
              <hemisphereLight args={["#FFF1DC", "#D9C3A6", 0.55]} />
              <Floor />
              <SceneContent
                renderKind={renderKind}
                pileA={pileA}
                pileB={pileB}
                phase={phase}
                pileResult={pileResult}
                resultColor={resultColor}
                onCombine={combine}
                placeValue={placeValueForScene}
              />
            </Suspense>
            <OrbitControls
              makeDefault
              enablePan={false}
              minDistance={1.5}
              maxDistance={18}
              minPolarAngle={0.05}
              maxPolarAngle={Math.PI / 2 - 0.02}
              target={[0, 0.5, 0]}
            />
            <CameraOps op={cameraOp} />
          </Canvas>
          {/* Camera control buttons overlay */}
          <div className="absolute right-3 bottom-3 flex flex-col gap-2">
            <CamBtn label="Zoom in" icon="plus" onClick={() => setCameraOp({ kind: "zoom", factor: 0.78, id: Date.now() })} />
            <CamBtn label="Zoom out" icon="minus" onClick={() => setCameraOp({ kind: "zoom", factor: 1.28, id: Date.now() })} />
            <CamBtn label="Top-down" icon="topdown" onClick={() => setCameraOp({ kind: "topdown", id: Date.now() })} />
            <CamBtn label="Reset" icon="reset" onClick={() => setCameraOp({ kind: "reset", id: Date.now() })} />
          </div>
        </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-sand-200 bg-white/70 px-5 py-3">
          <div className="text-sm text-ink-800">
            {mode === "value" && (
              <><span className="font-bold">{pvNumber}</span> in blocks</>
            )}
            {mode === "piles" && (
              <>
                <span className="font-bold">{pileA}</span>
                <span className="mx-1">{pileOp === "add" ? "+" : "−"}</span>
                <span className="font-bold">{pileB}</span>
                <span className="mx-1">=</span>
                <span className="font-bold text-coral">{phase === "combined" ? pileResult : "?"}</span>
              </>
            )}
            {(mode === "parse" || mode === "speech") && (() => {
              const expr = mode === "speech" ? wordsToExpression(transcript) : expression;
              const p = parseExpression(expr);
              if (p.kind === "single") return <><span className="font-bold">{p.value}</span> in blocks</>;
              if (p.kind === "binop") {
                const r = p.op === "add" ? p.a + p.b : Math.max(0, p.a - p.b);
                const showResult = phase === "combined" || p.a > 9 || p.b > 9;
                return (
                  <>
                    <span className="font-bold">{p.a}</span>
                    <span className="mx-1">{p.op === "add" ? "+" : "−"}</span>
                    <span className="font-bold">{p.b}</span>
                    <span className="mx-1">=</span>
                    <span className="font-bold text-coral">{showResult ? r : "?"}</span>
                  </>
                );
              }
              return <span className="text-ink-600">awaiting valid input…</span>;
            })()}
          </div>
          <div className="flex gap-2">
            {(mode === "piles" || mode === "parse" || mode === "speech") && (() => {
              let canCombine = phase === "idle";
              if (mode === "parse" || mode === "speech") {
                const expr = mode === "speech" ? wordsToExpression(transcript) : expression;
                const p = parseExpression(expr);
                if (p.kind !== "binop" || p.a > 9 || p.b > 9) canCombine = false;
              }
              return (
                <button
                  type="button"
                  onClick={combine}
                  disabled={!canCombine}
                  className="rounded-full bg-coral px-4 py-1.5 text-sm font-semibold text-white shadow disabled:opacity-50"
                >
                  Combine piles
                </button>
              );
            })()}
            <button
              type="button"
              onClick={reset}
              className="rounded-full bg-white border border-sand-200 px-4 py-1.5 text-sm font-semibold text-ink-800"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <p className="text-sm text-ink-600">
        Drag to orbit (top-down works too) · pinch to zoom · tap a pile to combine.
        All four math modes live inside the same 3D room — piles, place-value blocks, typed expressions, and voice input.
      </p>
    </div>
  );
}
