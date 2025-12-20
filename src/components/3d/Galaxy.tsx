'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { useRouter } from 'next/navigation';

interface GalaxyProps {
    position: [number, number, number];
    label: string;
    color: string;
    onClick?: () => void;
    scale?: number;
    sectionId: string;
}

export function Galaxy({
    position,
    label,
    color,
    onClick,
    scale = 1,
    sectionId
}: GalaxyProps) {
    const galaxyRef = useRef<THREE.Group>(null);
    const coreRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);

    useFrame(({ clock }) => {
        const time = clock.getElapsedTime();

        if (galaxyRef.current) {
            // Rotate the entire galaxy
            galaxyRef.current.rotation.y = time * 0.1;
            galaxyRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
        }

        if (coreRef.current) {
            // Pulsing effect
            const pulse = 1 + Math.sin(time * 2) * 0.1;
            coreRef.current.scale.setScalar(pulse);
        }
    });

    const handleClick = (e: any) => {
        e.stopPropagation();
        if (onClick) {
            onClick();
        }
    };

    return (
        <group
            ref={galaxyRef}
            position={position}
            scale={hovered ? scale * 1.2 : scale}
            onClick={handleClick}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            {/* Galaxy Core - Bright center */}
            <mesh ref={coreRef}>
                <sphereGeometry args={[1.5, 32, 32]} />
                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={0.9}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Outer glow layer 1 */}
            <mesh>
                <sphereGeometry args={[2, 32, 32]} />
                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={0.4}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Outer glow layer 2 */}
            <mesh>
                <sphereGeometry args={[2.5, 32, 32]} />
                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={0.2}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Point light for illumination */}
            <pointLight color={color} intensity={5} distance={20} />

            {/* Orbiting particles */}
            {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i / 12) * Math.PI * 2;
                const radius = 3 + Math.random() * 1;
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;
                const y = (Math.random() - 0.5) * 0.5;

                return (
                    <mesh key={i} position={[x, y, z]}>
                        <sphereGeometry args={[0.1, 8, 8]} />
                        <meshBasicMaterial color={color} />
                    </mesh>
                );
            })}

            {/* Galaxy label */}
            <Text
                position={[0, 4, 0]}
                fontSize={0.8}
                color="white"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.05}
                outlineColor="#000000"
            >
                {label}
            </Text>

            {/* Info text on hover */}
            {hovered && (
                <Text
                    position={[0, -4, 0]}
                    fontSize={0.4}
                    color="#60a5fa"
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.02}
                    outlineColor="#000000"
                >
                    Click to Enter
                </Text>
            )}

            {/* Ring effect */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[3, 3.2, 64]} />
                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={hovered ? 0.6 : 0.3}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </group>
    );
}
