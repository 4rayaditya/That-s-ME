'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CollectibleProps {
    position: [number, number, number];
    type: 'star' | 'coin' | 'gem';
    onCollect?: () => void;
}

export function Collectible({ position, type, onCollect }: CollectibleProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [collected, setCollected] = useState(false);

    useFrame((state) => {
        if (!meshRef.current || collected) return;

        const time = state.clock.getElapsedTime();

        // Rotation
        meshRef.current.rotation.y = time * 2;

        // Float animation
        meshRef.current.position.y = position[1] + Math.sin(time * 3) * 0.2;
    });

    const handleCollect = () => {
        if (collected) return;
        setCollected(true);
        onCollect?.();
    };

    if (collected) return null;

    const getGeometry = () => {
        switch (type) {
            case 'star':
                return <octahedronGeometry args={[0.3, 0]} />;
            case 'coin':
                return <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} />;
            case 'gem':
                return <dodecahedronGeometry args={[0.3, 0]} />;
        }
    };

    const getColor = () => {
        switch (type) {
            case 'star':
                return '#fbbf24';
            case 'coin':
                return '#f59e0b';
            case 'gem':
                return '#8b5cf6';
        }
    };

    return (
        <mesh
            ref={meshRef}
            position={position}
            onClick={handleCollect}
            onPointerEnter={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'pointer';
            }}
            onPointerLeave={() => {
                document.body.style.cursor = 'auto';
            }}
        >
            {getGeometry()}
            <meshStandardMaterial
                color={getColor()}
                metalness={0.8}
                roughness={0.2}
                emissive={getColor()}
                emissiveIntensity={0.5}
            />

            {/* Glow effect */}
            <pointLight position={[0, 0, 0]} intensity={0.5} distance={2} color={getColor()} />
        </mesh>
    );
}
