'use client';

import { Scene } from '@/components/3d/Scene';
import { FloatingObject } from '@/components/3d/FloatingObject';
import { CameraRig } from '@/components/3d/CameraRig';
import { Environment, Stars } from '@react-three/drei';

export default function HeroScene() {
  return (
    <Scene className="w-full h-full">
      <CameraRig enableScroll />
      
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      {/* Main floating object */}
      <FloatingObject position={[0, 0, 0]} color="#0ea5e9" intensity={1} />
      
      {/* Secondary objects */}
      <FloatingObject position={[-3, 1, -2]} color="#38bdf8" intensity={0.5} />
      <FloatingObject position={[3, -1, -2]} color="#0284c7" intensity={0.5} />
      
      {/* Environment */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      
      {/* HDR Environment for reflections - lazy loaded */}
      <Environment preset="night" />
    </Scene>
  );
}
