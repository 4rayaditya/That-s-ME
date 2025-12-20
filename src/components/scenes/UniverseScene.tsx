'use client';

import { SpaceshipCockpit } from '@/components/3d/SpaceshipCockpit';
import { Galaxy } from '@/components/3d/Galaxy';
import { FPPControls } from '@/components/3d/FPPControls';
import { ParticleField } from '@/components/3d/ParticleField';
import { Environment, Stars } from '@react-three/drei';
import { useUniverseStore } from '@/store/universeStore';
import * as THREE from 'three';

export default function UniverseScene() {
    const { navigateToGalaxy, currentSection, showCockpit, fppEnabled } = useUniverseStore();

    const galaxies = [
        {
            id: 'home',
            label: 'Home Station',
            position: [0, 0, -30] as [number, number, number],
            color: '#0ea5e9',
            scale: 1.2,
        },
        {
            id: 'projects',
            label: 'Projects Nebula',
            position: [40, 5, -20] as [number, number, number],
            color: '#8b5cf6',
            scale: 1.5,
        },
        {
            id: 'about',
            label: 'About Constellation',
            position: [-35, -5, -25] as [number, number, number],
            color: '#10b981',
            scale: 1,
        },
        {
            id: 'skills',
            label: 'Skills Cluster',
            position: [25, -10, -40] as [number, number, number],
            color: '#f59e0b',
            scale: 1.3,
        },
        {
            id: 'contact',
            label: 'Contact Gateway',
            position: [-25, 10, -35] as [number, number, number],
            color: '#ef4444',
            scale: 1,
        },
    ];

    const handleGalaxyClick = (galaxyId: string, position: [number, number, number]) => {
        // Calculate camera position (closer to galaxy)
        const galaxyPos = new THREE.Vector3(...position);
        const direction = new THREE.Vector3().subVectors(new THREE.Vector3(0, 5, 20), galaxyPos).normalize();
        const cameraPos = new THREE.Vector3().addVectors(galaxyPos, direction.multiplyScalar(8));

        navigateToGalaxy(galaxyId as any, cameraPos, galaxyPos);
    };

    if (currentSection !== 'universe') {
        return null;
    }

    return (
        <>
            {/* FPP Controls */}
            {fppEnabled && <FPPControls enabled movementSpeed={0.2} boundaryRadius={80} />}

            {/* Spaceship Cockpit */}
            <SpaceshipCockpit visible={showCockpit} />

            {/* Lighting */}
            <ambientLight intensity={0.2} />
            <pointLight position={[0, 0, 0]} intensity={1} color="#ffffff" distance={100} />

            {/* Galaxies */}
            {galaxies.map((galaxy) => (
                <Galaxy
                    key={galaxy.id}
                    sectionId={galaxy.id}
                    label={galaxy.label}
                    position={galaxy.position}
                    color={galaxy.color}
                    scale={galaxy.scale}
                    onClick={() => handleGalaxyClick(galaxy.id, galaxy.position)}
                />
            ))}

            {/* Distant stars */}
            <Stars
                radius={100}
                depth={80}
                count={8000}
                factor={6}
                saturation={0.5}
                fade
                speed={0.5}
            />

            {/* Additional star fields for depth */}
            <Stars
                radius={150}
                depth={100}
                count={3000}
                factor={4}
                saturation={0.3}
                fade
                speed={0.3}
            />

            {/* Particle fields */}
            <ParticleField count={2000} radius={60} color="#60a5fa" speed={0.002} />
            <ParticleField count={1500} radius={80} color="#a855f7" speed={0.0015} />
            <ParticleField count={1000} radius={100} color="#10b981" speed={0.001} />

            {/* Nebula clouds (using semi-transparent spheres) */}
            <group>
                {/* Purple nebula */}
                <mesh position={[60, 20, -80]}>
                    <sphereGeometry args={[25, 32, 32]} />
                    <meshBasicMaterial
                        color="#8b5cf6"
                        transparent
                        opacity={0.1}
                        side={THREE.DoubleSide}
                    />
                </mesh>

                {/* Blue nebula */}
                <mesh position={[-50, -15, -70]}>
                    <sphereGeometry args={[30, 32, 32]} />
                    <meshBasicMaterial
                        color="#0ea5e9"
                        transparent
                        opacity={0.08}
                        side={THREE.DoubleSide}
                    />
                </mesh>

                {/* Green nebula */}
                <mesh position={[30, -25, -90]}>
                    <sphereGeometry args={[20, 32, 32]} />
                    <meshBasicMaterial
                        color="#10b981"
                        transparent
                        opacity={0.09}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            </group>

            {/* Distant planet silhouettes */}
            <group>
                <mesh position={[-70, 10, -100]}>
                    <sphereGeometry args={[8, 32, 32]} />
                    <meshStandardMaterial color="#1e293b" roughness={0.8} />
                </mesh>
                <mesh position={[65, -20, -110]}>
                    <sphereGeometry args={[6, 32, 32]} />
                    <meshStandardMaterial color="#0f172a" roughness={0.9} />
                </mesh>
            </group>

            {/* Environment for reflections */}
            <Environment preset="night" />
        </>
    );
}
