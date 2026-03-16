'use client';

import { useState, useRef, useCallback } from 'react';
import * as THREE from 'three';
import ARScene, { SceneContext, createBox, createSphere } from '@/components/ARScene';
import NavHeader from '@/components/NavHeader';

function randomCount() {
  return Math.floor(Math.random() * 4) + 2; // 2-5
}

function speak(text: string, rate = 0.4, pitch = 1.0) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = rate;
  utter.pitch = pitch;
  window.speechSynthesis.speak(utter);
}

function animateScale(obj: THREE.Object3D, from: number, to: number, duration: number, onDone?: () => void) {
  const start = performance.now();
  function tick(now: number) {
    const t = Math.min((now - start) / duration, 1);
    const ease = t * t;
    const s = from + (to - from) * ease;
    obj.scale.set(s, s, s);
    if (t < 1) {
      requestAnimationFrame(tick);
    } else if (onDone) {
      onDone();
    }
  }
  requestAnimationFrame(tick);
}

export default function GroupingPage() {
  const [total, setTotal] = useState(randomCount);
  const [collected, setCollected] = useState(0);
  const [allDone, setAllDone] = useState(false);

  const ctxRef = useRef<SceneContext | null>(null);
  const originalPositions = useRef<Map<THREE.Object3D, THREE.Vector3>>(new Map());
  const basketRef = useRef<THREE.Mesh | null>(null);
  const spheresRef = useRef<THREE.Mesh[]>([]);
  const collectedCount = useRef(0);
  const totalRef = useRef(total);

  const setupScene = useCallback((ctx: SceneContext, targetCount: number) => {
    ctx.clearObjects();
    originalPositions.current.clear();
    spheresRef.current = [];
    collectedCount.current = 0;
    totalRef.current = targetCount;

    // Blue basket box
    const basket = createBox([0.6, 0.3, 0.6], '#007AFF');
    basket.position.set(-1.5, 0.15, 0);
    basket.userData.isBasket = true;
    ctx.addObject(basket);
    basketRef.current = basket;

    // Red spheres scattered on the right side
    const sphereCount = targetCount + 2; // extra distractors
    for (let i = 0; i < sphereCount; i++) {
      const sphere = createSphere(0.12, '#FF3B30');
      const x = 0.5 + Math.random() * 1.5;
      const z = -1.0 + Math.random() * 2.0;
      sphere.position.set(x, 0.12, z);
      sphere.userData.isSphere = true;
      ctx.addObject(sphere);
      spheresRef.current.push(sphere);
      originalPositions.current.set(sphere, new THREE.Vector3(x, 0.12, z));
    }

    speak(`Put ${targetCount} apples in the blue basket!`, 0.4, 1.0);
  }, []);

  const handleSceneReady = useCallback((ctx: SceneContext) => {
    ctxRef.current = ctx;
    setupScene(ctx, total);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDragMove = useCallback((object: THREE.Object3D, _point: THREE.Vector2, delta: THREE.Vector2) => {
    if (!object.userData.isSphere) return;
    object.position.x += delta.x * 3.0;
    object.position.z -= delta.y * 3.0;
  }, []);

  const handleDragEnd = useCallback((object: THREE.Object3D) => {
    if (!object.userData.isSphere || !ctxRef.current || !basketRef.current) return;

    const basket = basketRef.current;
    const dist = Math.hypot(
      object.position.x - basket.position.x,
      object.position.z - basket.position.z
    );

    if (dist < 0.8 && collectedCount.current < totalRef.current) {
      // Collect: animate shrink then remove
      const ctx = ctxRef.current;
      animateScale(object, 1, 0, 250, () => {
        ctx.removeObject(object);
      });
      collectedCount.current += 1;
      const newCount = collectedCount.current;
      setCollected(newCount);
      speak(String(newCount), 0.4, 1.0);

      if (newCount >= totalRef.current) {
        setTimeout(() => {
          setAllDone(true);
          speak('You did it!', 0.4, 1.0);
        }, 300);
      }
    } else {
      // Snap back to original position
      const orig = originalPositions.current.get(object);
      if (orig) {
        object.position.copy(orig);
      }
    }
  }, []);

  const playAgain = useCallback(() => {
    const n = randomCount();
    setTotal(n);
    setCollected(0);
    setAllDone(false);
    if (ctxRef.current) {
      setupScene(ctxRef.current, n);
    }
  }, [setupScene]);

  return (
    <ARScene
      className="h-screen"
      onSceneReady={handleSceneReady}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
    >
      <div className="relative flex flex-col h-full select-none">
        <NavHeader title="Grouping" />

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom panel */}
        <div className="mx-4 mb-4 p-4 bg-white/10 backdrop-blur-xl rounded-2xl">
          <p className="text-4xl font-bold text-white text-center font-[system-ui]">
            {collected}/{total}
          </p>
          <p className="text-sm text-white/50 text-center mt-1">
            Drag the red apples into the blue basket!
          </p>
        </div>

        {/* Full-screen celebration overlay */}
        {allDone && (
          <div
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
            style={{ backgroundColor: 'rgba(0, 128, 128, 0.7)' }}
          >
            <span className="text-[72px] leading-none mb-4" style={{ color: '#FFD700' }}>&#9733;</span>
            <p className="text-4xl font-bold text-white mb-6">You did it!</p>
            <button
              onClick={playAgain}
              className="px-8 py-3 rounded-2xl bg-white text-teal-600 text-xl font-semibold active:scale-95 transition-transform"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </ARScene>
  );
}
