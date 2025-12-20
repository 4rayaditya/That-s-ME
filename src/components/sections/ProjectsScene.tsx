'use client';

import { Scene } from '@/components/3d/Scene';
import { ProjectCard3D } from '@/components/3d/ProjectCard3D';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import type { Project } from '@/types';

interface ProjectsSceneProps {
    projects: Project[];
}

export default function ProjectsScene({ projects }: ProjectsSceneProps) {
    // Arrange projects in a circular layout
    const radius = 5;
    const positions: [number, number, number][] = projects.map((_, index) => {
        const angle = (index / projects.length) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return [x, 0, z];
    });

    return (
        <Scene className="w-full h-full">
            <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={60} />

            {/* Controls - allow user to rotate view */}
            <OrbitControls
                enablePan={false}
                enableZoom={true}
                minDistance={5}
                maxDistance={15}
                maxPolarAngle={Math.PI / 2}
            />

            {/* Lighting */}
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
            <pointLight position={[0, 5, 0]} intensity={0.5} color="#0ea5e9" />

            {/* Projects */}
            {projects.map((project, index) => (
                <ProjectCard3D
                    key={project.id}
                    project={project}
                    position={positions[index]}
                    index={index}
                />
            ))}

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
