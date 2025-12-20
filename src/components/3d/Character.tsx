'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CharacterProps {
    position?: [number, number, number];
    color?: string;
}

export function Character({
    position = [0, 0, 0],
    color = '#0ea5e9'
}: CharacterProps) {
    const groupRef = useRef<THREE.Group>(null);
    const time = useRef(0);

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        time.current += delta;

        // Idle bobbing animation
        groupRef.current.position.y = position[1] + Math.sin(time.current * 2) * 0.05;

        // Subtle rotation
        groupRef.current.rotation.y = Math.sin(time.current * 0.5) * 0.1;
    });

    return (
        <group ref={groupRef} position={position}>
            {/* Body */}
            <mesh position={[0, 0.5, 0]} castShadow>
                <capsuleGeometry args={[0.3, 0.6, 8, 16]} />
                <meshStandardMaterial
                    color={color}
                    metalness={0.3}
                    roughness={0.7}
                    emissive={color}
                    emissiveIntensity={0.2}
                />
            </mesh>

            {/* Head */}
            <mesh position={[0, 1.2, 0]} castShadow>
                <sphereGeometry args={[0.25, 16, 16]} />
                <meshStandardMaterial
                    color={color}
                    metalness={0.5}
                    roughness={0.5}
                    emissive={color}
                    emissiveIntensity={0.3}
                />
            </mesh>

            {/* Eyes */}
            <mesh position={[0.1, 1.25, 0.2]}>
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
            </mesh>
            <mesh position={[-0.1, 1.25, 0.2]}>
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
            </mesh>

            {/* Glow effect */}
            <pointLight position={[0, 0.8, 0]} intensity={0.5} distance={3} color={color} />
        </group>
    );
}
