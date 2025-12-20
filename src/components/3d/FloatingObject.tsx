'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

interface FloatingObjectProps {
    position?: [number, number, number];
    color?: string;
    intensity?: number;
}

export function FloatingObject({
    position = [0, 0, 0],
    color = '#0ea5e9',
    intensity = 0.5,
}: FloatingObjectProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const lightRef = useRef<THREE.PointLight>(null);

    useFrame((state) => {
        if (!meshRef.current || !lightRef.current) return;

        const time = state.clock.getElapsedTime();

        // Float animation
        meshRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.3;

        // Rotation
        meshRef.current.rotation.x = time * 0.2;
        meshRef.current.rotation.y = time * 0.3;

        // Light pulsing
        lightRef.current.intensity = intensity + Math.sin(time * 2) * 0.2;
    });

    return (
        <group position={position}>
            <mesh ref={meshRef} castShadow>
                <icosahedronGeometry args={[1, 1]} />
                <meshStandardMaterial
                    color={color}
                    metalness={0.8}
                    roughness={0.2}
                    emissive={color}
                    emissiveIntensity={0.2}
                />
            </mesh>

            <pointLight
                ref={lightRef}
                color={color}
                intensity={intensity}
                distance={5}
                decay={2}
            />
        </group>
    );
}
