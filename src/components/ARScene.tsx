'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';

interface ARSceneProps {
  children?: React.ReactNode;
  onSceneReady?: (ctx: SceneContext) => void;
  onTap?: (object: THREE.Object3D | null, point: THREE.Vector2) => void;
  onDragStart?: (object: THREE.Object3D, point: THREE.Vector2) => void;
  onDragMove?: (object: THREE.Object3D, point: THREE.Vector2, delta: THREE.Vector2) => void;
  onDragEnd?: (object: THREE.Object3D) => void;
  className?: string;
}

export interface SceneContext {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  groundPlane: THREE.Mesh;
  addObject: (obj: THREE.Object3D) => void;
  removeObject: (obj: THREE.Object3D) => void;
  clearObjects: () => void;
}

// Helper to create common 3D shapes matching iOS RealityKit
export function createSphere(radius: number, color: string | number): THREE.Mesh {
  const geo = new THREE.SphereGeometry(radius, 32, 32);
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.1 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  return mesh;
}

export function createBox(size: number | [number, number, number], color: string | number, cornerRadius = 0): THREE.Mesh {
  const s = Array.isArray(size) ? size : [size, size, size];
  let geo: THREE.BufferGeometry;
  if (cornerRadius > 0) {
    geo = new THREE.BoxGeometry(s[0], s[1], s[2], 4, 4, 4);
  } else {
    geo = new THREE.BoxGeometry(s[0], s[1], s[2]);
  }
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.15 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  return mesh;
}

export function createCylinder(radius: number, height: number, color: string | number): THREE.Mesh {
  const geo = new THREE.CylinderGeometry(radius, radius, height, 32);
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.1 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  return mesh;
}

export function createTextSprite(text: string, color = '#ffffff', bgColor = 'rgba(0,0,0,0.6)', fontSize = 48): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = bgColor;
  ctx.roundRect(0, 0, 512, 128, 20);
  ctx.fill();
  ctx.fillStyle = color;
  ctx.font = `bold ${fontSize}px -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 256, 64);
  const tex = new THREE.CanvasTexture(canvas);
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(2, 0.5, 1);
  return sprite;
}

export default function ARScene({
  children,
  onSceneReady,
  onTap,
  onDragStart,
  onDragMove,
  onDragEnd,
  className = '',
}: ARSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const objectsRef = useRef<THREE.Object3D[]>([]);
  const raycaster = useRef(new THREE.Raycaster());
  const draggedRef = useRef<THREE.Object3D | null>(null);
  const lastPointer = useRef(new THREE.Vector2());
  const [cameraActive, setCameraActive] = useState(false);

  const getPointerNDC = useCallback((e: PointerEvent): THREE.Vector2 => {
    const rect = containerRef.current!.getBoundingClientRect();
    return new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const w = container.clientWidth;
    const h = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera — looking down at table angle (like iOS AR)
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    camera.position.set(0, 3, 3.5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer — transparent so camera video shows through
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.inset = '0';
    renderer.domElement.style.zIndex = '5';
    renderer.domElement.style.pointerEvents = 'auto';
    rendererRef.current = renderer;

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const directional = new THREE.DirectionalLight(0xffffff, 1.0);
    directional.position.set(3, 5, 3);
    directional.castShadow = true;
    directional.shadow.mapSize.set(1024, 1024);
    scene.add(directional);

    // Ground plane (invisible, for raycasting & shadows)
    const groundGeo = new THREE.PlaneGeometry(20, 20);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.15 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    ground.name = '__ground__';
    scene.add(ground);

    // Animation loop
    let animId: number;
    function animate() {
      animId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();

    // Provide scene context
    const ctx: SceneContext = {
      scene,
      camera,
      renderer,
      groundPlane: ground,
      addObject: (obj) => { scene.add(obj); objectsRef.current.push(obj); },
      removeObject: (obj) => { scene.remove(obj); objectsRef.current = objectsRef.current.filter(o => o !== obj); },
      clearObjects: () => { objectsRef.current.forEach(o => scene.remove(o)); objectsRef.current = []; },
    };
    onSceneReady?.(ctx);

    // Pointer events
    const handleDown = (e: PointerEvent) => {
      const ndc = getPointerNDC(e);
      raycaster.current.setFromCamera(ndc, camera);
      const hits = raycaster.current.intersectObjects(objectsRef.current, true);
      if (hits.length > 0) {
        let target = hits[0].object;
        while (target.parent && !objectsRef.current.includes(target)) target = target.parent;
        draggedRef.current = target;
        lastPointer.current.copy(ndc);
        onDragStart?.(target, ndc);
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      }
    };

    const handleMove = (e: PointerEvent) => {
      if (!draggedRef.current) return;
      const ndc = getPointerNDC(e);
      const delta = new THREE.Vector2(ndc.x - lastPointer.current.x, ndc.y - lastPointer.current.y);
      lastPointer.current.copy(ndc);
      onDragMove?.(draggedRef.current, ndc, delta);
    };

    const handleUp = (e: PointerEvent) => {
      if (draggedRef.current) {
        onDragEnd?.(draggedRef.current);
        draggedRef.current = null;
      } else {
        // Tap (no drag)
        const ndc = getPointerNDC(e);
        raycaster.current.setFromCamera(ndc, camera);
        const hits = raycaster.current.intersectObjects(objectsRef.current, true);
        let target: THREE.Object3D | null = null;
        if (hits.length > 0) {
          target = hits[0].object;
          while (target.parent && !objectsRef.current.includes(target)) target = target.parent;
        }
        onTap?.(target, ndc);
      }
    };

    renderer.domElement.addEventListener('pointerdown', handleDown);
    renderer.domElement.addEventListener('pointermove', handleMove);
    renderer.domElement.addEventListener('pointerup', handleUp);
    renderer.domElement.style.touchAction = 'none';

    // Resize
    const onResize = () => {
      const w2 = container.clientWidth;
      const h2 = container.clientHeight;
      camera.aspect = w2 / h2;
      camera.updateProjectionMatrix();
      renderer.setSize(w2, h2);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
      renderer.domElement.remove();
      window.removeEventListener('resize', onResize);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Camera feed
  useEffect(() => {
    let stream: MediaStream | null = null;
    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setCameraActive(true);
        }
      } catch { /* no camera — transparent renderer shows dark bg */ }
    }
    startCamera();
    return () => { stream?.getTracks().forEach(t => t.stop()); };
  }, []);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`} style={{ touchAction: 'none' }}>
      {/* Camera feed behind Three.js canvas */}
      <video
        ref={videoRef}
        playsInline
        muted
        className={`absolute inset-0 h-full w-full object-cover ${cameraActive ? 'opacity-100' : 'opacity-0'}`}
        style={{ zIndex: 1 }}
      />
      {/* Fallback dark bg when no camera */}
      {!cameraActive && (
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-950" style={{ zIndex: 1 }} />
      )}
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/20" style={{ zIndex: 2 }} />
      {/* AR indicator */}
      {cameraActive && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1 backdrop-blur-sm" style={{ zIndex: 20 }}>
          <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] font-medium text-white/80">AR</span>
        </div>
      )}
      {/* Three.js canvas is injected here by useEffect */}
      {/* UI overlay on top */}
      <div className="absolute inset-0" style={{ zIndex: 10, pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto' }}>{children}</div>
      </div>
    </div>
  );
}
