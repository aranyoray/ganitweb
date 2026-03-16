'use client';

import { useState, useRef, useCallback } from 'react';
import * as THREE from 'three';
import ARScene, { SceneContext, createBox, createTextSprite } from '@/components/ARScene';
import NavHeader from '@/components/NavHeader';

const NUMBER_COLORS: Record<number, string> = {
  1: '#007AFF',
  2: '#5AC8FA',
  3: '#34C759',
  4: '#FFCC00',
  5: '#FF9500',
  6: '#FF2D55',
  7: '#AF52DE',
  8: '#5856D6',
  9: '#00C7BE',
};

const FUN_FACTS: Record<number, string> = {
  1: 'One is the loneliest number, but also the first counting number!',
  2: 'Two is the only even prime number.',
  3: 'Three sides make a triangle, the strongest shape.',
  4: 'Four is the number of seasons in a year.',
  5: 'Five fingers on each hand help us count!',
  6: 'Six is a perfect number: 1 plus 2 plus 3 equals 6.',
  7: 'Seven days make a week.',
  8: 'An octopus has eight arms!',
  9: 'Nine planets used to be in our solar system.',
};

function speak(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 0.4;
  utter.pitch = 1.0;
  window.speechSynthesis.speak(utter);
}

function animateBounce(obj: THREE.Object3D, duration: number) {
  const start = performance.now();
  function tick(now: number) {
    const t = Math.min((now - start) / duration, 1);
    // scale up to 1.3 then back to 1.0
    let s: number;
    if (t < 0.3) {
      s = 1.0 + 0.3 * (t / 0.3);
    } else {
      s = 1.3 - 0.3 * ((t - 0.3) / 0.7);
    }
    obj.scale.set(s, s, s);
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

export default function WalkAroundPage() {
  const [active, setActive] = useState<number | null>(null);
  const [factText, setFactText] = useState<string | null>(null);

  const ctxRef = useRef<SceneContext | null>(null);
  const cubeMapRef = useRef<Map<number, THREE.Mesh>>(new Map());
  const lastTap = useRef<{ num: number; time: number }>({ num: 0, time: 0 });
  const factTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSceneReady = useCallback((ctx: SceneContext) => {
    ctxRef.current = ctx;

    // Create 3x3 grid of cubes
    for (let num = 1; num <= 9; num++) {
      const row = Math.floor((num - 1) / 3);
      const col = (num - 1) % 3;
      const x = (col - 1) * 0.8;
      const z = (row - 1) * 0.8;

      const color = NUMBER_COLORS[num];
      const cube = createBox(0.3, color, 0.02);
      cube.position.set(x, 0.15, z);
      cube.userData.number = num;
      ctx.addObject(cube);
      cubeMapRef.current.set(num, cube);

      // Text sprite floating above
      const label = createTextSprite(String(num), '#ffffff', 'rgba(0,0,0,0)', 64);
      label.position.set(x, 0.5, z);
      label.scale.set(0.5, 0.15, 1);
      ctx.addObject(label);
    }
  }, []);

  const handleTap = useCallback((object: THREE.Object3D | null, _point: THREE.Vector2) => {
    if (!object || object.userData.number === undefined) return;
    const num = object.userData.number as number;
    const now = Date.now();
    const prev = lastTap.current;

    // Double-tap detection (same number within 400ms)
    if (prev.num === num && now - prev.time < 400) {
      const fact = FUN_FACTS[num] ?? `Number ${num} is great!`;
      setFactText(fact);
      speak(fact);
      if (factTimer.current) clearTimeout(factTimer.current);
      factTimer.current = setTimeout(() => setFactText(null), 5000);
      lastTap.current = { num: 0, time: 0 };
      return;
    }

    lastTap.current = { num, time: now };

    // Single tap: bounce + speak
    setActive(num);
    setFactText(null);
    speak(String(num));

    const cube = cubeMapRef.current.get(num);
    if (cube) {
      animateBounce(cube, 300);
    }
  }, []);

  return (
    <ARScene className="h-screen" onSceneReady={handleSceneReady} onTap={handleTap}>
      <div className="relative flex flex-col h-full select-none">
        <NavHeader title="Walk Around" />

        {/* Active number display at top */}
        <div className="flex justify-center mt-20 mb-2">
          {active !== null ? (
            <span className="text-[40px] font-bold text-white font-[system-ui]">
              {active}
            </span>
          ) : (
            <span className="text-[40px] font-bold text-white/15 font-[system-ui]">
              &mdash;
            </span>
          )}
        </div>

        {/* Fun fact tooltip */}
        {factText && (
          <div className="mx-6 mb-3 px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 animate-[fadeIn_0.2s_ease]">
            <p className="text-sm text-yellow-300 font-medium text-center">{factText}</p>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom glass panel */}
        <div className="mx-4 mb-4 p-4 bg-white/10 backdrop-blur-xl rounded-2xl">
          <h2 className="text-lg font-bold text-white text-center">
            Walk around the numbers and tap to explore!
          </h2>
          <p className="text-xs text-white/50 text-center mt-1">
            Tap to explore! Double-tap for a fun fact.
          </p>
        </div>

        <style>{`
          @keyframes fadeIn {
            0%   { opacity: 0; transform: translateY(4px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </ARScene>
  );
}
