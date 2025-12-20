'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SpaceshipCockpitProps {
    position?: [number, number, number];
    visible?: boolean;
}

export function SpaceshipCockpit({ position = [0, 0, 0], visible = true }: SpaceshipCockpitProps) {
    const leftWingRef = useRef<THREE.Group>(null);
    const rightWingRef = useRef<THREE.Group>(null);
    const cockpitRef = useRef<THREE.Group>(null);

    // Subtle idle animation
    useFrame(({ clock }) => {
        const time = clock.getElapsedTime();
        if (leftWingRef.current && rightWingRef.current) {
            leftWingRef.current.rotation.z = Math.sin(time * 0.5) * 0.02;
            rightWingRef.current.rotation.z = -Math.sin(time * 0.5) * 0.02;
        }
    });

    if (!visible) return null;

    return (
        <group position={position} ref={cockpitRef}>
            {/* Left Wing */}
            <group ref={leftWingRef} position={[-1.5, -0.3, 0.5]}>
                <mesh>
                    <boxGeometry args={[2, 0.1, 0.4]} />
                    <meshStandardMaterial
                        color="#1e3a8a"
                        metalness={0.9}
                        roughness={0.2}
                        emissive="#1e40af"
                        emissiveIntensity={0.3}
                    />
                </mesh>
                {/* Wing tip light */}
                <pointLight position={[-1, 0, 0]} color="#3b82f6" intensity={2} distance={5} />
                <mesh position={[-1, 0, 0]}>
                    <sphereGeometry args={[0.05, 16, 16]} />
                    <meshBasicMaterial color="#3b82f6" />
                </mesh>
                {/* Wing edge glow */}
                <mesh position={[0, 0, -0.2]}>
                    <boxGeometry args={[2, 0.05, 0.05]} />
                    <meshBasicMaterial color="#60a5fa" transparent opacity={0.6} />
                </mesh>
            </group>

            {/* Right Wing */}
            <group ref={rightWingRef} position={[1.5, -0.3, 0.5]}>
                <mesh>
                    <boxGeometry args={[2, 0.1, 0.4]} />
                    <meshStandardMaterial
                        color="#1e3a8a"
                        metalness={0.9}
                        roughness={0.2}
                        emissive="#1e40af"
                        emissiveIntensity={0.3}
                    />
                </mesh>
                {/* Wing tip light */}
                <pointLight position={[1, 0, 0]} color="#3b82f6" intensity={2} distance={5} />
                <mesh position={[1, 0, 0]}>
                    <sphereGeometry args={[0.05, 16, 16]} />
                    <meshBasicMaterial color="#3b82f6" />
                </mesh>
                {/* Wing edge glow */}
                <mesh position={[0, 0, -0.2]}>
                    <boxGeometry args={[2, 0.05, 0.05]} />
                    <meshBasicMaterial color="#60a5fa" transparent opacity={0.6} />
                </mesh>
            </group>

            {/* Cockpit Frame (glass edges) */}
            <group position={[0, 0.5, 1]}>
                {/* Top frame */}
                <mesh position={[0, 0.3, 0]}>
                    <boxGeometry args={[1.2, 0.05, 0.05]} />
                    <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
                </mesh>
                {/* Bottom frame */}
                <mesh position={[0, -0.8, 0]}>
                    <boxGeometry args={[1.2, 0.05, 0.05]} />
                    <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
                </mesh>
                {/* Left frame */}
                <mesh position={[-0.6, -0.25, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <boxGeometry args={[1.1, 0.05, 0.05]} />
                    <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
                </mesh>
                {/* Right frame */}
                <mesh position={[0.6, -0.25, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <boxGeometry args={[1.1, 0.05, 0.05]} />
                    <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
                </mesh>
            </group>

            {/* Dashboard */}
            <group position={[0, -0.5, 1.2]}>
                {/* Main dashboard panel */}
                <mesh rotation={[-Math.PI / 6, 0, 0]}>
                    <boxGeometry args={[1.5, 0.3, 0.05]} />
                    <meshStandardMaterial
                        color="#0f172a"
                        metalness={0.5}
                        roughness={0.5}
                        emissive="#1e293b"
                        emissiveIntensity={0.2}
                    />
                </mesh>

                {/* Dashboard lights */}
                {[-0.5, -0.2, 0.1, 0.4].map((x, i) => (
                    <mesh key={i} position={[x, 0, 0.03]} rotation={[-Math.PI / 6, 0, 0]}>
                        <circleGeometry args={[0.03, 16]} />
                        <meshBasicMaterial
                            color={i % 2 === 0 ? '#10b981' : '#3b82f6'}
                            transparent
                            opacity={0.8}
                        />
                    </mesh>
                ))}

                {/* Holographic display */}
                <mesh position={[0, 0.15, 0.03]} rotation={[-Math.PI / 6, 0, 0]}>
                    <planeGeometry args={[0.8, 0.15]} />
                    <meshBasicMaterial
                        color="#0ea5e9"
                        transparent
                        opacity={0.3}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            </group>

            {/* Engine glow (behind) */}
            <pointLight position={[0, 0, -2]} color="#3b82f6" intensity={3} distance={8} />
            <mesh position={[0, 0, -2]}>
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshBasicMaterial color="#60a5fa" transparent opacity={0.4} />
            </mesh>
        </group>
    );
}
