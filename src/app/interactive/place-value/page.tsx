'use client';

import { useState, useCallback, useRef } from 'react';
import * as THREE from 'three';
import ARScene, { SceneContext, createBox, createTextSprite } from '@/components/ARScene';
import NavHeader from '@/components/NavHeader';

function randomTwoDigit(): number {
  return Math.floor(Math.random() * 89) + 11;
}

function speak(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 0.4;
  window.speechSynthesis.speak(utter);
}

export default function PlaceValuePage() {
  const ctxRef = useRef<SceneContext | null>(null);
  const rodsRef = useRef<THREE.Mesh[]>([]);
  const cubesRef = useRef<THREE.Mesh[]>([]);
  const tensRef = useRef(0);
  const onesRef = useRef(0);
  const animatingRef = useRef(false);
  const labelRef = useRef<THREE.Sprite | null>(null);

  const [tens, setTens] = useState(0);
  const [ones, setOnes] = useState(0);

  const totalValue = tens * 10 + ones;

  const removeLabel = useCallback(() => {
    if (labelRef.current && ctxRef.current) {
      ctxRef.current.removeObject(labelRef.current);
      labelRef.current = null;
    }
  }, []);

  const updateLabel = useCallback((t: number, o: number) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    removeLabel();
    const total = t * 10 + o;
    const label = createTextSprite(`${total} = ${t}×10 + ${o}×1`, '#FFFFFF', 'rgba(0,0,0,0.6)');
    label.position.set(0, 1.2, -0.5);
    ctx.addObject(label);
    labelRef.current = label;
  }, [removeLabel]);

  const layoutRods = useCallback((ctx: SceneContext, count: number) => {
    // Remove old rods
    rodsRef.current.forEach(r => ctx.removeObject(r));
    rodsRef.current = [];

    for (let i = 0; i < count; i++) {
      const rod = createBox([0.08, 0.6, 0.08], '#22C55E');
      rod.position.set(-0.8 + i * 0.2, 0.3, 0);
      rod.name = `rod_${i}`;
      rod.userData = { type: 'rod', index: i };
      ctx.addObject(rod);
      rodsRef.current.push(rod);
    }
  }, []);

  const layoutCubes = useCallback((ctx: SceneContext, count: number, animate = false) => {
    // Remove old cubes
    cubesRef.current.forEach(c => ctx.removeObject(c));
    cubesRef.current = [];

    const cols = 5;
    for (let i = 0; i < count; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const cube = createBox(0.12, '#3B82F6');
      cube.position.set(0.8 + col * 0.18 - 0.36, 0.06, row * 0.18 - 0.2);
      cube.name = `cube_${i}`;
      cube.userData = { type: 'cube', index: i };

      if (animate) {
        cube.scale.set(0, 0, 0);
        // Staggered scale animation
        const delay = i * 40;
        setTimeout(() => {
          const startTime = performance.now();
          const duration = 300;
          function animateScale() {
            const elapsed = performance.now() - startTime;
            const t = Math.min(elapsed / duration, 1);
            // Ease out
            const s = 1 - Math.pow(1 - t, 3);
            cube.scale.set(s, s, s);
            if (t < 1) requestAnimationFrame(animateScale);
          }
          animateScale();
        }, delay);
      }

      ctx.addObject(cube);
      cubesRef.current.push(cube);
    }
  }, []);

  const buildScene = useCallback((ctx: SceneContext, n: number) => {
    ctx.clearObjects();
    rodsRef.current = [];
    cubesRef.current = [];
    labelRef.current = null;
    animatingRef.current = false;

    const t = Math.floor(n / 10);
    const o = n % 10;
    tensRef.current = t;
    onesRef.current = o;
    setTens(t);
    setOnes(o);

    layoutRods(ctx, t);
    layoutCubes(ctx, o);
    updateLabel(t, o);

    speak(`How many tens are in ${n}?`);
  }, [layoutRods, layoutCubes, updateLabel]);

  const handleSceneReady = useCallback((ctx: SceneContext) => {
    ctxRef.current = ctx;
    const n = randomTwoDigit();
    buildScene(ctx, n);
  }, [buildScene]);

  const handleTap = useCallback((object: THREE.Object3D | null) => {
    const ctx = ctxRef.current;
    if (!ctx || !object || animatingRef.current) return;

    // Walk up to find rod or cube
    let target = object;
    while (target && !target.userData?.type) {
      if (target.parent) target = target.parent;
      else break;
    }
    if (!target.userData?.type) return;

    if (target.userData.type === 'rod') {
      // Decompose rod into 10 cubes
      animatingRef.current = true;
      speak('Breaking apart a ten!');

      const t = tensRef.current - 1;
      const o = onesRef.current + 10;
      tensRef.current = t;
      onesRef.current = o;
      setTens(t);
      setOnes(o);

      layoutRods(ctx, t);
      layoutCubes(ctx, o, true);
      updateLabel(t, o);

      setTimeout(() => { animatingRef.current = false; }, 500);
    } else if (target.userData.type === 'cube' && onesRef.current >= 10) {
      // Compose 10 cubes into a rod
      animatingRef.current = true;
      speak('Grouping 10 ones into a ten!');

      const t = tensRef.current + 1;
      const o = onesRef.current - 10;
      tensRef.current = t;
      onesRef.current = o;
      setTens(t);
      setOnes(o);

      layoutRods(ctx, t);
      layoutCubes(ctx, o);
      updateLabel(t, o);

      // Animate the new rod scaling up
      const newRod = rodsRef.current[rodsRef.current.length - 1];
      if (newRod) {
        newRod.scale.set(0, 0, 0);
        const startTime = performance.now();
        const duration = 400;
        function animateRod() {
          const elapsed = performance.now() - startTime;
          const prog = Math.min(elapsed / duration, 1);
          const s = 1 - Math.pow(1 - prog, 3);
          newRod.scale.set(s, s, s);
          if (prog < 1) requestAnimationFrame(animateRod);
        }
        animateRod();
      }

      setTimeout(() => { animatingRef.current = false; }, 500);
    }
  }, [layoutRods, layoutCubes, updateLabel]);

  const handleNewNumber = useCallback(() => {
    if (ctxRef.current) {
      buildScene(ctxRef.current, randomTwoDigit());
    }
  }, [buildScene]);

  return (
    <ARScene
      className="h-screen"
      onSceneReady={handleSceneReady}
      onTap={handleTap}
    >
      <div className="relative flex flex-col h-full select-none">
      <NavHeader title="Place Value" />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom panel */}
      <div className="mx-4 mb-4 p-4 bg-white/10 backdrop-blur-xl rounded-2xl">
        <h2 className="text-lg font-bold text-white text-center">Place Value</h2>

        <p className="text-2xl font-bold text-blue-400 text-center mt-2">
          Total: {totalValue} = {tens} ten{tens !== 1 ? 's' : ''} + {ones} one{ones !== 1 ? 's' : ''}
        </p>

        {/* Legend */}
        <div className="flex justify-center gap-4 mt-2">
          <span className="flex items-center gap-1.5 text-xs text-white/50">
            <span className="inline-block w-2.5 h-5 rounded-sm bg-green-500" /> Tens (rods)
          </span>
          <span className="flex items-center gap-1.5 text-xs text-white/50">
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-blue-500" /> Ones (cubes)
          </span>
        </div>

        <p className="text-xs text-white/40 text-center mt-2">
          Tap a rod to break into 10 cubes. Tap a cube when 10+ to make a rod.
        </p>

        <button
          onClick={handleNewNumber}
          className="mt-3 w-full py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-bold text-base shadow-lg transition-all"
        >
          Next Number
        </button>
      </div>
      </div>
    </ARScene>
  );
}
