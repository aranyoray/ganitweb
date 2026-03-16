'use client';

import { useState, useRef, useCallback } from 'react';
import * as THREE from 'three';
import ARScene, { SceneContext, createBox, createTextSprite } from '@/components/ARScene';
import NavHeader from '@/components/NavHeader';

const BLOCK_COLORS = [
  '#007AFF', '#34C759', '#FF9500', '#AF52DE',
  '#FF2D55', '#5AC8FA', '#FFCC00', '#FF3B30', '#00C7BE',
];

function randomTarget() {
  return Math.floor(Math.random() * 7) + 3; // 3-9
}

function speak(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 0.9;
  utter.pitch = 1.2;
  window.speechSynthesis.speak(utter);
}

function animateScale(obj: THREE.Object3D, from: number, to: number, duration: number) {
  const start = performance.now();
  function tick(now: number) {
    const t = Math.min((now - start) / duration, 1);
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const s = from + (to - from) * ease;
    obj.scale.set(s, s, s);
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

export default function PlaygroundPage() {
  const [target, setTarget] = useState(randomTarget);
  const [count, setCount] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const ctxRef = useRef<SceneContext | null>(null);
  const blocksRef = useRef<THREE.Mesh[]>([]);
  const successSpriteRef = useRef<THREE.Sprite | null>(null);

  const handleSceneReady = useCallback((ctx: SceneContext) => {
    ctxRef.current = ctx;
  }, []);

  const addBlock = useCallback(() => {
    if (done || !ctxRef.current) return;
    const ctx = ctxRef.current;
    const idx = blocksRef.current.length;
    const color = BLOCK_COLORS[idx % BLOCK_COLORS.length];

    // Grid position: rows of 5 near origin
    const col = idx % 5;
    const row = Math.floor(idx / 5);
    const x = (col - 2) * 0.3;
    const z = row * 0.3;
    const y = 0.1;

    const block = createBox(0.2, color);
    block.position.set(x, y, z);
    block.scale.set(0, 0, 0);
    ctx.addObject(block);
    blocksRef.current.push(block);

    animateScale(block, 0, 1, 300);

    const newCount = idx + 1;
    setCount(newCount);
    speak(String(newCount));

    if (newCount === target) {
      setDone(true);
      setScore((s) => s + target);
      setTimeout(() => {
        speak(`You built ${target}!`);
        // Show green text sprite above blocks
        const sprite = createTextSprite(`You built ${target}!`, '#00FF00', 'rgba(0,0,0,0.7)', 42);
        sprite.position.set(0, 0.8, 0);
        ctx.addObject(sprite);
        successSpriteRef.current = sprite;
      }, 400);
    }
  }, [done, target]);

  const reset = useCallback(() => {
    if (!ctxRef.current) return;
    ctxRef.current.clearObjects();
    blocksRef.current = [];
    successSpriteRef.current = null;
    setCount(0);
    setDone(false);
  }, []);

  const nextChallenge = useCallback(() => {
    reset();
    setTarget(randomTarget());
  }, [reset]);

  const progressDots = Array.from({ length: target }, (_, i) => i < count);

  return (
    <ARScene className="h-screen" onSceneReady={handleSceneReady}>
      <div className="relative flex flex-col h-full select-none">
        <NavHeader title="Number Playground" />

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom panel */}
        <div className="mx-4 mb-4 p-4 bg-white/10 backdrop-blur-xl rounded-2xl">
          {done ? (
            <>
              <p className="text-2xl font-bold text-green-400 text-center">
                You built {target}!
              </p>
              <p className="text-lg font-bold text-orange-400 text-center mt-1">
                Score: {score}
              </p>
              <button
                onClick={nextChallenge}
                className="mt-3 w-full py-2.5 rounded-xl bg-green-500 hover:bg-green-600 active:scale-95 text-white font-bold text-base shadow-lg transition-all"
              >
                Next Challenge
              </button>
            </>
          ) : (
            <>
              <p className="text-lg font-semibold text-white text-center">Build the number:</p>
              <p className="text-5xl font-extrabold text-blue-400 text-center mt-1">{target}</p>

              {/* Progress dots */}
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                {progressDots.map((filled, i) => (
                  <div
                    key={i}
                    className={`w-5 h-5 rounded-full transition-all duration-300 ${
                      filled ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-white/[0.08] border border-white/10'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between mt-3">
                <p className="text-base font-bold text-white">
                  {count} blocks
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={reset}
                    className="px-4 py-1.5 rounded-lg bg-red-500/80 active:scale-95 text-white text-sm font-bold transition-all"
                  >
                    Reset
                  </button>
                  <button
                    onClick={addBlock}
                    className="px-4 py-1.5 rounded-lg bg-blue-500 active:scale-95 text-white text-sm font-bold transition-all"
                  >
                    Add Block
                  </button>
                </div>
              </div>

              {count > target && (
                <p className="text-xs text-red-400 text-center mt-1">
                  Too many! Tap Reset to try again.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </ARScene>
  );
}
