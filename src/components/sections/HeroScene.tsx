'use client';

import { Canvas } from '@react-three/fiber';
import { FloatingObject } from '@/components/3d/FloatingObject';
import { Character } from '@/components/3d/Character';
import { Portal } from '@/components/3d/Portal';
import { Collectible } from '@/components/3d/Collectible';
import { InteractiveControls } from '@/components/3d/InteractiveControls';
import { Environment, Stars, OrbitControls } from '@react-three/drei';
import { useJourneyStore } from '@/store/journeyStore';

export default function HeroScene() {
    const { interactiveMode, collectItem } = useJourneyStore();

    const handlePortalClick = () => {
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <Canvas className="w-full h-full" camera={{ position: [0, 0, 10], fov: 75 }} shadows dpr={1.5}>
            {/* Camera Controls */}
            {interactiveMode ? (
                <InteractiveControls enabled />
            ) : (
                <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2} minDistance={5} maxDistance={20} />
            )}

            {/* Lighting */}
            <ambientLight intensity={0.3} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <pointLight position={[0, 5, 0]} intensity={0.5} color="#0ea5e9" />

            {/* Character */}
            <Character position={[0, 0, 3]} color="#0ea5e9" />

            {/* Main floating objects */}
            <FloatingObject position={[0, 2, -5]} color="#0ea5e9" intensity={1} />
            <FloatingObject position={[-4, 1, -3]} color="#38bdf8" intensity={0.5} />
            <FloatingObject position={[4, 1.5, -4]} color="#0284c7" intensity={0.5} />

            {/* Portal to Projects */}
            <Portal
                position={[0, 1, -8]}
                label="Enter Projects"
                color="#0ea5e9"
                onClick={handlePortalClick}
            />

            {/* Collectibles */}
            <Collectible position={[-3, 1, 0]} type="star" onCollect={collectItem} />
            <Collectible position={[3, 1.5, -2]} type="gem" onCollect={collectItem} />
            <Collectible position={[0, 2, -3]} type="coin" onCollect={collectItem} />

            {/* Ground plane */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
                <planeGeometry args={[50, 50]} />
                <meshStandardMaterial
                    color="#0a0a0a"
                    metalness={0.3}
                    roughness={0.8}
                />
            </mesh>

            {/* Grid for depth perception */}
            <gridHelper args={[50, 50, '#1e293b', '#0f172a']} position={[0, -0.49, 0]} />

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

            {/* HDR Environment for reflections */}
        </Canvas>
    );
}
