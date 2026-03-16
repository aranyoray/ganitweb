'use client';

import { useState, useCallback, useRef } from 'react';
import * as THREE from 'three';
import ARScene, { SceneContext, createCylinder, createBox, createTextSprite } from '@/components/ARScene';
import NavHeader from '@/components/NavHeader';

type Denom = 2 | 3 | 4;

function speak(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 0.4;
  window.speechSynthesis.speak(utter);
}

function denominatorWord(d: number): string {
  switch (d) {
    case 2: return 'halves';
    case 3: return 'thirds';
    case 4: return 'quarters';
    default: return `${d}ths`;
  }
}

export default function FractionsPage() {
  const ctxRef = useRef<SceneContext | null>(null);
  const discRef = useRef<THREE.Mesh | null>(null);
  const piecesRef = useRef<THREE.Mesh[]>([]);
  const selectedRef = useRef<Set<number>>(new Set());
  const labelRef = useRef<THREE.Sprite | null>(null);
  const isSlicedRef = useRef(false);
  const denomRef = useRef<Denom>(4);

  const [denom, setDenom] = useState<Denom>(4);
  const [isSliced, setIsSliced] = useState(false);
  const [sliceInfo, setSliceInfo] = useState<string | null>(null);

  const removeLabel = useCallback(() => {
    if (labelRef.current && ctxRef.current) {
      ctxRef.current.removeObject(labelRef.current);
      labelRef.current = null;
    }
  }, []);

  const showLabel = useCallback((text: string, color: string) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    removeLabel();
    const label = createTextSprite(text, color, 'rgba(0,0,0,0.7)');
    label.position.set(0, 1.0, 0);
    ctx.addObject(label);
    labelRef.current = label;
  }, [removeLabel]);

  const buildDisc = useCallback((ctx: SceneContext) => {
    ctx.clearObjects();
    isSlicedRef.current = false;
    selectedRef.current = new Set();
    piecesRef.current = [];
    labelRef.current = null;
    setIsSliced(false);
    setSliceInfo(null);

    // Orange pizza disc lying flat
    const disc = createCylinder(0.8, 0.1, '#FF9500');
    disc.position.set(0, 0.05, 0);
    disc.name = 'pizzaDisc';
    ctx.addObject(disc);
    discRef.current = disc;
  }, []);

  const sliceDisc = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx || isSlicedRef.current) return;
    isSlicedRef.current = true;
    setIsSliced(true);

    const d = denomRef.current;

    // Remove whole disc
    if (discRef.current) {
      ctx.removeObject(discRef.current);
      discRef.current = null;
    }

    // Create wedge pieces as thin boxes arranged in a pie
    const pieces: THREE.Mesh[] = [];
    const PIECE_COLORS = ['#FF3B30', '#FF9500', '#FFCC00', '#30D158'];
    for (let i = 0; i < d; i++) {
      const angle = (i / d) * Math.PI * 2;
      const midAngle = angle + Math.PI / d;
      // Each piece is a thin box positioned radially
      const pieceW = d === 2 ? 0.75 : d === 3 ? 0.6 : 0.5;
      const pieceD = d === 2 ? 0.08 : 0.08;
      const piece = createBox([pieceW, 0.1, 0.35], PIECE_COLORS[i % PIECE_COLORS.length]);
      // Position outward from center
      const dist = 0.3;
      piece.position.set(
        dist * Math.cos(midAngle),
        0.05,
        dist * Math.sin(midAngle)
      );
      piece.rotation.y = -midAngle;
      piece.name = `piece_${i}`;
      piece.userData = { pieceIndex: i, selected: false };
      ctx.addObject(piece);
      pieces.push(piece);
    }
    piecesRef.current = pieces;

    setSliceInfo(`1/${d} each slice`);
    speak(`You sliced it into ${d} pieces! Each piece is one ${denominatorWord(d).slice(0, -1)}.`);
  }, []);

  const handleSceneReady = useCallback((ctx: SceneContext) => {
    ctxRef.current = ctx;
    buildDisc(ctx);
  }, [buildDisc]);

  const handleTap = useCallback((object: THREE.Object3D | null) => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    // Tap on whole disc to slice
    if (!isSlicedRef.current) {
      if (object && (object.name === 'pizzaDisc' || object.parent?.name === 'pizzaDisc')) {
        sliceDisc();
      }
      return;
    }

    // Tap on piece to select/deselect
    if (!object) return;
    let target = object;
    // Walk up to find piece
    while (target && !target.name.startsWith('piece_')) {
      if (target.parent) target = target.parent;
      else break;
    }
    if (!target.name.startsWith('piece_')) return;

    const idx = target.userData.pieceIndex as number;
    const sel = selectedRef.current;
    const d = denomRef.current;

    if (sel.has(idx)) {
      // Deselect
      sel.delete(idx);
      target.position.y = 0.05;
      (target as THREE.Mesh).material = new THREE.MeshStandardMaterial({
        color: ['#FF3B30', '#FF9500', '#FFCC00', '#30D158'][idx % 4],
        roughness: 0.3,
        metalness: 0.15,
      });
      target.userData.selected = false;
    } else {
      // Select
      sel.add(idx);
      target.position.y = 0.2;
      (target as THREE.Mesh).material = new THREE.MeshStandardMaterial({
        color: '#FFD60A',
        roughness: 0.3,
        metalness: 0.15,
      });
      target.userData.selected = true;
    }

    const count = sel.size;
    if (count === d) {
      setSliceInfo(`${d}/${d} = 1 whole`);
      showLabel('1 Whole!', '#00FF00');
      speak('The pieces come back together to make one whole!');
    } else if (count > 0) {
      setSliceInfo(`${count}/${d}`);
      removeLabel();
      speak(`${count} out of ${d}`);
    } else {
      setSliceInfo(`1/${d} each slice`);
      removeLabel();
    }
  }, [sliceDisc, showLabel, removeLabel]);

  const handleDenom = useCallback((d: Denom) => {
    denomRef.current = d;
    setDenom(d);
    if (ctxRef.current) {
      buildDisc(ctxRef.current);
    }
    speak(`Slice the pizza into ${d} equal pieces!`);
  }, [buildDisc]);

  const handleNextExample = useCallback(() => {
    const options: Denom[] = [2, 3, 4];
    const d = options[Math.floor(Math.random() * options.length)];
    denomRef.current = d;
    setDenom(d);
    if (ctxRef.current) {
      buildDisc(ctxRef.current);
    }
  }, [buildDisc]);

  return (
    <ARScene
      className="h-screen"
      onSceneReady={handleSceneReady}
      onTap={handleTap}
    >
      <div className="relative flex flex-col h-full select-none">
      <NavHeader title="Fractions" />

      {/* Hint text */}
      {!isSliced && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-white/30 text-sm animate-pulse">Tap the pizza to slice it!</p>
        </div>
      )}

      {/* Spacer */}
      {isSliced && <div className="flex-1" />}

      {/* Bottom panel */}
      <div className="mx-4 mb-4 p-4 bg-white/10 backdrop-blur-xl rounded-2xl">
        <h2 className="text-lg font-bold text-white text-center">Fractions</h2>
        <p className="text-xs text-white/50 text-center mt-1">
          Tap the pizza to slice, then tap pieces to select!
        </p>

        {sliceInfo && (
          <p className="text-xl font-bold text-orange-400 text-center mt-3">
            {sliceInfo}
          </p>
        )}

        {/* Denominator selector buttons */}
        <div className="flex justify-center gap-3 mt-3">
          {([2, 3, 4] as Denom[]).map((d) => (
            <button
              key={d}
              onClick={() => handleDenom(d)}
              className={`px-4 py-1.5 rounded-lg font-bold text-sm transition-all active:scale-95 ${
                denom === d
                  ? 'bg-orange-500 text-white'
                  : 'bg-white/10 text-white/40'
              }`}
            >
              1/{d}
            </button>
          ))}
        </div>

        {sliceInfo && (
          <button
            onClick={handleNextExample}
            className="mt-3 w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-base shadow-lg transition-all"
          >
            Next Example
          </button>
        )}
      </div>
      </div>
    </ARScene>
  );
}
