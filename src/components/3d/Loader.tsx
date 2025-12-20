'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';

export function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Loading 3D scene...</p>
      </div>
    </Html>
  );
}

export function ProgressLoader({ progress }: { progress: number }) {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="w-48 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-400">{Math.round(progress)}%</p>
      </div>
    </Html>
  );
}
