'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleFieldProps {
    count?: number;
    radius?: number;
    color?: string;
    speed?: number;
}

export function ParticleField({
    count = 1000,
    radius = 50,
    color = '#ffffff',
    speed = 0.001
}: ParticleFieldProps) {
    const pointsRef = useRef<THREE.Points>(null);

    const [positions, velocities] = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // Random position within sphere
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = radius * Math.cbrt(Math.random());

            positions[i3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = r * Math.cos(phi);

            // Random velocity
            velocities[i3] = (Math.random() - 0.5) * speed;
            velocities[i3 + 1] = (Math.random() - 0.5) * speed;
            velocities[i3 + 2] = (Math.random() - 0.5) * speed;
        }

        return [positions, velocities];
    }, [count, radius, speed]);

    useFrame(() => {
        if (!pointsRef.current) return;

        const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // Update positions
            positions[i3] += velocities[i3];
            positions[i3 + 1] += velocities[i3 + 1];
            positions[i3 + 2] += velocities[i3 + 2];

            // Wrap around sphere
            const distance = Math.sqrt(
                positions[i3] ** 2 +
                positions[i3 + 1] ** 2 +
                positions[i3 + 2] ** 2
            );

            if (distance > radius) {
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                const r = radius * 0.1;

                positions[i3] = r * Math.sin(phi) * Math.cos(theta);
                positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
                positions[i3 + 2] = r * Math.cos(phi);
            }
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.1}
                color={color}
                transparent
                opacity={0.8}
                sizeAttenuation
                depthWrite={false}
            />
        </points>
    );
}
