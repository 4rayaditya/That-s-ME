'use client';

import { Scene } from '@/components/3d/Scene';
import { ProjectCard3D } from '@/components/3d/ProjectCard3D';
import { Portal } from '@/components/3d/Portal';
import { Collectible } from '@/components/3d/Collectible';
import { InteractiveControls } from '@/components/3d/InteractiveControls';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useJourneyStore } from '@/store/journeyStore';
import type { Project } from '@/types';

interface ProjectsSceneProps {
    projects: Project[];
}

export default function ProjectsScene({ projects }: ProjectsSceneProps) {
    const { interactiveMode, collectItem } = useJourneyStore();

    // Arrange projects in a circular layout
    const radius = 5;
    const positions: [number, number, number][] = projects.map((_, index) => {
        const angle = (index / projects.length) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return [x, 0, z];
    });

    const handleContactPortal = () => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <Scene className="w-full h-full">
            <PerspectiveCamera makeDefault position={[0, 3, 10]} fov={60} />

            {/* Controls */}
            {interactiveMode ? (
                <InteractiveControls enabled />
            ) : (
                <OrbitControls
                    enablePan={false}
                    enableZoom={true}
                    minDistance={5}
                    maxDistance={15}
                    maxPolarAngle={Math.PI / 2}
                />
            )}

            {/* Lighting */}
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
            <pointLight position={[0, 5, 0]} intensity={0.5} color="#0ea5e9" />

            {/* Projects arranged in circle */}
            {projects.map((project, index) => (
                <ProjectCard3D
                    key={project.id}
                    project={project}
                    position={positions[index]}
                    index={index}
                />
            ))}

            {/* Portal to Contact Section */}
            <Portal
                position={[0, 1, 0]}
                label="Contact Me"
                color="#8b5cf6"
                onClick={handleContactPortal}
            />

            {/* Collectibles scattered around projects */}
            <Collectible position={[3, 1, 3]} type="star" onCollect={collectItem} />
            <Collectible position={[-3, 1.5, -3]} type="gem" onCollect={collectItem} />
            <Collectible position={[0, 2, -5]} type="coin" onCollect={collectItem} />
            <Collectible position={[5, 1, 0]} type="star" onCollect={collectItem} />

            {/* Ground plane for shadows */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
                <planeGeometry args={[50, 50]} />
                <meshStandardMaterial
                    color="#0a0a0a"
                    metalness={0.8}
                    roughness={0.4}
                />
            </mesh>

            {/* Grid helper for depth perception */}
            <gridHelper args={[20, 20, '#1e293b', '#0f172a']} position={[0, -1.99, 0]} />
        </Scene>
    );
}
