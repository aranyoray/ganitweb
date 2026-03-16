'use client';

import { useState, useCallback, useRef } from 'react';
import * as THREE from 'three';
import ARScene, { SceneContext, createSphere, createBox, createTextSprite } from '@/components/ARScene';
import NavHeader from '@/components/NavHeader';

const WARM_COLORS = ['#FF3B30', '#FF9500', '#FFCC00'];
const COOL_COLORS = ['#007AFF', '#5AC8FA', '#30B0C7'];

function randomCount(): number {
  return Math.floor(Math.random() * 5) + 1;
}

function speak(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 0.4;
  window.speechSynthesis.speak(utter);
}

export default function AdditionPage() {
  const ctxRef = useRef<SceneContext | null>(null);
  const leftGroupRef = useRef<THREE.Group | null>(null);
  const rightGroupRef = useRef<THREE.Group | null>(null);
  const labelRef = useRef<THREE.Sprite | null>(null);
  const mergedRef = useRef(false);
  const wasMergedRef = useRef(false);
  const leftCountRef = useRef(randomCount());
  const rightCountRef = useRef(randomCount());

  const [resultText, setResultText] = useState('');
  const [leftCount, setLeftCount] = useState(leftCountRef.current);
  const [rightCount, setRightCount] = useState(rightCountRef.current);

  const buildScene = useCallback((ctx: SceneContext, lc: number, rc: number) => {
    ctx.clearObjects();
    mergedRef.current = false;
    wasMergedRef.current = false;
    setResultText('');

    // Left group: spheres at x=-1.2
    const leftGroup = new THREE.Group();
    leftGroup.position.set(-1.2, 0, 0);
    leftGroup.name = 'leftGroup';
    for (let i = 0; i < lc; i++) {
      const angle = (i / lc) * Math.PI * 2;
      const r = lc > 1 ? 0.3 : 0;
      const sphere = createSphere(0.15, WARM_COLORS[i % WARM_COLORS.length]);
      sphere.position.set(r * Math.cos(angle), 0.15, r * Math.sin(angle));
      leftGroup.add(sphere);
    }
    ctx.addObject(leftGroup);
    leftGroupRef.current = leftGroup;

    // Right group: cubes at x=1.2
    const rightGroup = new THREE.Group();
    rightGroup.position.set(1.2, 0, 0);
    rightGroup.name = 'rightGroup';
    for (let i = 0; i < rc; i++) {
      const angle = (i / rc) * Math.PI * 2;
      const r = rc > 1 ? 0.3 : 0;
      const box = createBox(0.25, COOL_COLORS[i % COOL_COLORS.length]);
      box.position.set(r * Math.cos(angle), 0.125, r * Math.sin(angle));
      rightGroup.add(box);
    }
    ctx.addObject(rightGroup);
    rightGroupRef.current = rightGroup;

    if (labelRef.current) {
      ctx.removeObject(labelRef.current);
      labelRef.current = null;
    }

    speak(`Let's add ${lc} and ${rc} together!`);
  }, []);

  const handleSceneReady = useCallback((ctx: SceneContext) => {
    ctxRef.current = ctx;
    buildScene(ctx, leftCountRef.current, rightCountRef.current);
  }, [buildScene]);

  const handleDragMove = useCallback((_obj: THREE.Object3D, _point: THREE.Vector2, delta: THREE.Vector2) => {
    const ctx = ctxRef.current;
    const left = leftGroupRef.current;
    const right = rightGroupRef.current;
    if (!ctx || !left || !right) return;

    // Find which top-level group was dragged
    let target = _obj;
    while (target.parent && target !== left && target !== right) {
      target = target.parent;
    }
    if (target !== left && target !== right) return;

    // Move along x/z
    target.position.x += delta.x * 3.0;
    target.position.z -= delta.y * 3.0;

    // Check distance between groups
    const dist = left.position.distanceTo(right.position);
    const lc = leftCountRef.current;
    const rc = rightCountRef.current;

    if (!mergedRef.current && dist < 0.8) {
      // Merge
      mergedRef.current = true;
      wasMergedRef.current = true;
      const sum = lc + rc;
      const text = `${lc} + ${rc} = ${sum}`;
      setResultText(text);
      speak(`${lc} plus ${rc} equals ${sum}!`);

      // Animate scale pulse
      left.scale.set(1.5, 1.5, 1.5);
      right.scale.set(1.5, 1.5, 1.5);
      setTimeout(() => {
        left.scale.set(1, 1, 1);
        right.scale.set(1, 1, 1);
      }, 300);

      // Show text sprite above
      if (labelRef.current) ctx.removeObject(labelRef.current);
      const label = createTextSprite(text, '#00FF00', 'rgba(0,0,0,0.7)');
      label.position.set((left.position.x + right.position.x) / 2, 1.0, (left.position.z + right.position.z) / 2);
      ctx.addObject(label);
      labelRef.current = label;
    } else if (mergedRef.current && wasMergedRef.current && dist > 2.5) {
      // Split
      mergedRef.current = false;
      wasMergedRef.current = false;
      const diff = Math.abs(lc - rc);
      const text = `${lc} - ${rc} = ${diff}`;
      setResultText(text);
      speak(`${lc} minus ${rc} equals ${diff}!`);

      // Move groups back
      left.position.set(-1.2, 0, 0);
      right.position.set(1.2, 0, 0);

      // Update label
      if (labelRef.current) ctx.removeObject(labelRef.current);
      const label = createTextSprite(text, '#FF6B6B', 'rgba(0,0,0,0.7)');
      label.position.set(0, 1.0, 0);
      ctx.addObject(label);
      labelRef.current = label;
    }
  }, []);

  const handleNewExample = useCallback(() => {
    const lc = randomCount();
    const rc = randomCount();
    leftCountRef.current = lc;
    rightCountRef.current = rc;
    setLeftCount(lc);
    setRightCount(rc);
    if (ctxRef.current) {
      buildScene(ctxRef.current, lc, rc);
    }
  }, [buildScene]);

  return (
    <ARScene
      className="h-screen"
      onSceneReady={handleSceneReady}
      onDragMove={handleDragMove}
    >
      <div className="relative flex flex-col h-full select-none">
      <NavHeader title="AR Addition" />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom panel */}
      <div className="mx-4 mb-4 p-4 bg-white/10 backdrop-blur-xl rounded-2xl">
        <h2 className="text-lg font-bold text-white text-center">Addition &amp; Subtraction</h2>
        <p className="text-xs text-white/50 text-center mt-1">
          Drag the groups together to add, or apart to subtract!
        </p>

        {resultText && (
          <p className="text-2xl font-bold text-green-400 text-center mt-3 transition-transform">
            {resultText}
          </p>
        )}

        {resultText && (
          <button
            onClick={handleNewExample}
            className="mt-3 w-full py-2.5 rounded-xl bg-green-500 hover:bg-green-600 active:scale-95 text-white font-bold text-base shadow-lg transition-all"
          >
            Next Example
          </button>
        )}
      </div>
      </div>
    </ARScene>
  );
}
