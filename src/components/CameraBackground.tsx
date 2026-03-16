'use client';
import { useEffect, useRef, useState } from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function CameraBackground({ children, className = '' }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(false);

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
      } catch {
        // Camera not available (desktop, denied permission, etc.) — fall back to dark bg
        setCameraError(true);
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Camera feed (real-world background) */}
      {!cameraError && (
        <video
          ref={videoRef}
          playsInline
          muted
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            cameraActive ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* Dark overlay to make objects readable on camera */}
      <div
        className={`absolute inset-0 ${
          cameraActive ? 'bg-black/30' : 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-950'
        }`}
      />

      {/* Subtle AR grid (visible on both camera and fallback) */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="ar-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="cyan" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ar-grid)" />
        </svg>
      </div>

      {/* AR status indicator */}
      {cameraActive && (
        <div className="absolute top-3 right-3 z-50 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1 backdrop-blur-sm">
          <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] font-medium text-white/80">AR</span>
        </div>
      )}

      {/* Content overlay */}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
