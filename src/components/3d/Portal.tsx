'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';

interface PortalProps {
    position: [number, number, number];
    label: string;
    color?: string;
    onClick?: () => void;
}

export function Portal({
    position,
    label,
    color = '#0ea5e9',
    onClick
}: PortalProps) {
    const portalRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (!portalRef.current) return;

        const time = state.clock.getElapsedTime();

        // Rotation
        portalRef.current.rotation.y = time * 0.5;

        // Pulsing scale
        const scale = 1 + Math.sin(time * 2) * 0.05;
        portalRef.current.scale.setScalar(scale);
    });

    return (
        <group position={position}>
            {/* Portal frame */}
            <mesh rotation={[0, 0, 0]}>
                <torusGeometry args={[1.5, 0.1, 16, 100]} />
                <meshStandardMaterial
                    color={color}
                    metalness={0.8}
                    roughness={0.2}
                    emissive={color}
                    emissiveIntensity={hovered ? 1 : 0.5}
                />
            </mesh>

            {/* Portal center - clickable */}
            <group
                ref={portalRef}
                onPointerEnter={() => setHovered(true)}
                onPointerLeave={() => setHovered(false)}
                onClick={onClick}
            >
                <mesh>
                    <circleGeometry args={[1.4, 64]} />
                    <meshStandardMaterial
                        color={color}
                        transparent
                        opacity={hovered ? 0.4 : 0.2}
                        side={THREE.DoubleSide}
                        emissive={color}
                        emissiveIntensity={0.3}
                    />
                </mesh>

                {/* Inner rings */}
                <mesh>
                    <ringGeometry args={[0.8, 1, 32]} />
                    <meshBasicMaterial
                        color={color}
                        transparent
                        opacity={0.3}
                        side={THREE.DoubleSide}
                    />
                </mesh>
                <mesh>
                    <ringGeometry args={[0.4, 0.6, 32]} />
                    <meshBasicMaterial
                        color={color}
                        transparent
                        opacity={0.4}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            </group>

            {/* Label */}
            <Text
                position={[0, -2, 0]}
                fontSize={0.3}
                color={hovered ? '#ffffff' : color}
                anchorX="center"
                anchorY="middle"
            >
                {label}
            </Text>

            {/* Glow */}
            <pointLight position={[0, 0, 0]} intensity={hovered ? 2 : 1} distance={5} color={color} />
        </group>
    );
}
