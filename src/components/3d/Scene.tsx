'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, ReactNode } from 'react';
import { Loader } from './Loader';
import { useAppStore } from '@/store/appStore';
import { Preload } from '@react-three/drei';

interface SceneProps {
  children: ReactNode;
  className?: string;
  camera?: {
    position?: [number, number, number];
    fov?: number;
  };
  enableShadows?: boolean;
}

export function Scene({ 
  children, 
  className = '',
  camera = { position: [0, 0, 5], fov: 75 },
  enableShadows = false,
}: SceneProps) {
  const performanceTier = useAppStore((state) => state.performanceTier);
  
  const shouldEnableShadows = enableShadows && performanceTier.enableShadows;

  return (
    <div className={className}>
      <Canvas
        camera={camera}
        shadows={shouldEnableShadows}
        dpr={performanceTier.pixelRatio}
        gl={{
          antialias: performanceTier.tier !== 'low',
          alpha: true,
          powerPreference: 'high-performance',
        }}
        performance={{
          min: 0.5,
        }}
      >
        <Suspense fallback={<Loader />}>
          {children}
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
