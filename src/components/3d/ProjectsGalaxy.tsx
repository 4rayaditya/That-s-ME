'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import { ProjectCard3D } from '@/components/3d/ProjectCard3D';
import type { Project } from '@/types';
import * as THREE from 'three';

interface ProjectsGalaxyProps {
    projects: Project[];
}

export function ProjectsGalaxy({ projects }: ProjectsGalaxyProps) {
    const groupRef = useRef<THREE.Group>(null);

    useFrame(({ clock }) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = clock.getElapsedTime() * 0.05;
        }
    });

    const radius = 12;
    const projectsToShow = projects.slice(0, 6);

    return (
        <group>
            {/* Central Star */}
            <mesh>
                <sphereGeometry args={[2, 32, 32]} />
                <meshBasicMaterial color="#8b5cf6" />
            </mesh>
            <pointLight color="#8b5cf6" intensity={10} distance={50} />

            {/* Outer glow */}
            <mesh>
                <sphereGeometry args={[2.5, 32, 32]} />
                <meshBasicMaterial color="#8b5cf6" transparent opacity={0.3} />
            </mesh>

            {/* Title */}
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                <Text
                    position={[0, 8, 0]}
                    fontSize={1.5}
                    color="#ffffff"
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.1}
                    outlineColor="#8b5cf6"
                >
                    Projects Nebula
                </Text>
            </Float>

            {/* Orbiting Projects */}
            <group ref={groupRef}>
                {projectsToShow.map((project, index) => {
                    const angle = (index / projectsToShow.length) * Math.PI * 2;
                    const x = Math.cos(angle) * radius;
                    const z = Math.sin(angle) * radius;
                    const y = Math.sin(angle * 2) * 2;

                    return (
                        <group key={project.id} position={[x, y, z]} rotation={[0, -angle + Math.PI / 2, 0]}>
                            <ProjectCard3D
                                project={project}
                                index={index}
                                position={[0, 0, 0]}
                            />
                            {/* Orbital path indicator */}
                            <mesh position={[0, -1, 0]}>
                                <sphereGeometry args={[0.2, 16, 16]} />
                                <meshBasicMaterial color="#a855f7" />
                            </mesh>
                        </group>
                    );
                })}
            </group>

            {/* Orbital rings */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[radius, 0.05, 16, 100]} />
                <meshBasicMaterial color="#8b5cf6" transparent opacity={0.3} />
            </mesh>

            <mesh rotation={[Math.PI / 2.5, 0, 0]}>
                <torusGeometry args={[radius * 0.8, 0.03, 16, 100]} />
                <meshBasicMaterial color="#a855f7" transparent opacity={0.2} />
            </mesh>

            {/* Floating particles */}
            {Array.from({ length: 50 }).map((_, i) => {
                const angle = Math.random() * Math.PI * 2;
                const distance = 8 + Math.random() * 10;
                const x = Math.cos(angle) * distance;
                const z = Math.sin(angle) * distance;
                const y = (Math.random() - 0.5) * 10;

                return (
                    <mesh key={i} position={[x, y, z]}>
                        <sphereGeometry args={[0.05, 8, 8]} />
                        <meshBasicMaterial color="#c084fc" />
                    </mesh>
                );
            })}

            {/* Ambient lighting */}
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 10]} intensity={1} />
        </group>
    );
}
