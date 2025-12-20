'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import UniverseScene from '@/components/scenes/UniverseScene';
import { ProjectsGalaxy } from '@/components/3d/ProjectsGalaxy';
import { AboutGalaxy } from '@/components/3d/AboutGalaxy';
import { ContactGalaxy } from '@/components/3d/ContactGalaxy';
import { CameraTransitionController } from '@/components/3d/CameraTransitionController';
import { SpaceHUD } from '@/components/ui/SpaceHUD';
import { useUniverseStore } from '@/store/universeStore';
import type { Project } from '@/types';

interface SpaceSceneWrapperProps {
    projects: Project[];
}

export function SpaceSceneWrapper({ projects }: SpaceSceneWrapperProps) {
    const currentSection = useUniverseStore((state) => state.currentSection);

    return (
        <>
            <Canvas
                className="w-full h-full"
                camera={{ position: [0, 5, 20], fov: 75 }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance',
                }}
            >
                <Suspense fallback={null}>
                    {/* Camera Transition Controller */}
                    <CameraTransitionController />

                    {/* Render current section */}
                    {currentSection === 'universe' && <UniverseScene />}
                    {currentSection === 'projects' && <ProjectsGalaxy projects={projects} />}
                    {currentSection === 'about' && <AboutGalaxy />}
                    {currentSection === 'contact' && <ContactGalaxy />}
                    {currentSection === 'home' && <HomeGalaxy />}
                    {currentSection === 'skills' && <SkillsGalaxy />}
                </Suspense>
            </Canvas>

            {/* HUD Overlay */}
            <SpaceHUD />
        </>
    );
}

// Home Galaxy (landing station)
function HomeGalaxy() {
    return (
        <group>
            <mesh>
                <sphereGeometry args={[3, 32, 32]} />
                <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={0.5} />
            </mesh>
            <pointLight color="#0ea5e9" intensity={10} distance={50} />
            <ambientLight intensity={0.5} />
        </group>
    );
}

// Skills Galaxy (placeholder)
function SkillsGalaxy() {
    return (
        <group>
            <mesh>
                <sphereGeometry args={[2.5, 32, 32]} />
                <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.5} />
            </mesh>
            <pointLight color="#f59e0b" intensity={10} distance={50} />
            <ambientLight intensity={0.5} />
        </group>
    );
}
