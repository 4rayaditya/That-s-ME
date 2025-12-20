'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

interface CameraRigProps {
    enableScroll?: boolean;
}

export function CameraRig({ enableScroll = true }: CameraRigProps) {
    const cameraRef = useRef<THREE.PerspectiveCamera>(null);
    const { camera } = useThree();
    const scrollY = useRef(0);

    useEffect(() => {
        if (!enableScroll) return;

        const handleScroll = () => {
            scrollY.current = window.scrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [enableScroll]);

    useFrame((state) => {
        if (!cameraRef.current || !enableScroll) return;

        const scrollProgress = scrollY.current / (window.innerHeight * 0.5);

        // Smooth camera movement based on scroll
        cameraRef.current.position.y = THREE.MathUtils.lerp(
            cameraRef.current.position.y,
            -scrollProgress * 2,
            0.05
        );

        // Subtle rotation
        cameraRef.current.rotation.x = THREE.MathUtils.lerp(
            cameraRef.current.rotation.x,
            scrollProgress * 0.1,
            0.05
        );
    });

    return <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 5]} fov={75} />;
}

// Camera animation helper
export function animateCamera(
    camera: THREE.Camera,
    targetPosition: [number, number, number],
    targetRotation: [number, number, number],
    duration: number = 1.5
) {
    gsap.to(camera.position, {
        x: targetPosition[0],
        y: targetPosition[1],
        z: targetPosition[2],
        duration,
        ease: 'power2.inOut',
    });

    gsap.to(camera.rotation, {
        x: targetRotation[0],
        y: targetRotation[1],
        z: targetRotation[2],
        duration,
        ease: 'power2.inOut',
    });
}
