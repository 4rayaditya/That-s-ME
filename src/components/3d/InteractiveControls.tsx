'use client';

import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface InteractiveControlsProps {
    enabled?: boolean;
    onSectionChange?: (section: string) => void;
}

export function InteractiveControls({
    enabled = true,
    onSectionChange
}: InteractiveControlsProps) {
    const { camera } = useThree();
    const keysPressed = useRef<Set<string>>(new Set());
    const velocity = useRef(new THREE.Vector3());
    const direction = useRef(new THREE.Vector3());

    useEffect(() => {
        if (!enabled) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            keysPressed.current.add(e.key.toLowerCase());
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            keysPressed.current.delete(e.key.toLowerCase());
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [enabled]);

    useFrame((state, delta) => {
        if (!enabled) return;

        const speed = 5;
        const dampening = 0.9;

        direction.current.set(0, 0, 0);

        // WASD / Arrow keys
        if (keysPressed.current.has('w') || keysPressed.current.has('arrowup')) {
            direction.current.z -= 1;
        }
        if (keysPressed.current.has('s') || keysPressed.current.has('arrowdown')) {
            direction.current.z += 1;
        }
        if (keysPressed.current.has('a') || keysPressed.current.has('arrowleft')) {
            direction.current.x -= 1;
        }
        if (keysPressed.current.has('d') || keysPressed.current.has('arrowright')) {
            direction.current.x += 1;
        }

        // Normalize and apply speed
        if (direction.current.length() > 0) {
            direction.current.normalize().multiplyScalar(speed * delta);
            velocity.current.add(direction.current);
        }

        // Apply dampening
        velocity.current.multiplyScalar(dampening);

        // Update camera position
        camera.position.add(velocity.current);

        // Keep camera at reasonable height
        camera.position.y = Math.max(2, camera.position.y);
    });

    return null;
}
